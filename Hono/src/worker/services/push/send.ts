import { createVapidToken, encryptPayload } from "./crypto.js";

export interface PushSubscriptionRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushMessage {
  title: string;
  body: string;
  /** Path opened when the notification is tapped. Relative to the site origin. */
  url?: string;
  /** Collapses same-tag notifications so a burst doesn't stack up on the lock screen. */
  tag?: string;
}

export interface PushResult {
  subscriptionId: string;
  status: number | "error";
  /** Endpoint is permanently dead — the row should be deleted. */
  gone: boolean;
  error?: string;
}

function vapidConfig(env: Env): { publicKey: string; privateKey: string; subject: string } | null {
  const publicKey = env.VAPID_PUBLIC_KEY;
  const privateKey = env.VAPID_PRIVATE_KEY;
  const subject = env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) return null;
  return { publicKey, privateKey, subject };
}

/** True when push is configured. Callers use this to stay silent rather than throw. */
export function isPushConfigured(env: Env): boolean {
  return vapidConfig(env) !== null;
}

async function sendOne(env: Env, sub: PushSubscriptionRow, message: PushMessage): Promise<PushResult> {
  const config = vapidConfig(env);
  if (!config) {
    return { subscriptionId: sub.id, status: "error", gone: false, error: "VAPID not configured" };
  }

  try {
    const body = await encryptPayload(JSON.stringify(message), sub.p256dh, sub.auth);
    const token = await createVapidToken(sub.endpoint, config.subject, config.publicKey, config.privateKey);

    const response = await fetch(sub.endpoint, {
      method: "POST",
      headers: {
        Authorization: `vapid t=${token}, k=${config.publicKey}`,
        "Content-Encoding": "aes128gcm",
        "Content-Type": "application/octet-stream",
        TTL: "86400",
        // `normal` lets the push service batch and defer delivery to save the device's
        // battery, which shows up as notifications arriving late and without an alert.
        // These are single-user admin alerts, so they are worth waking the device for.
        Urgency: "high",
      },
      body: body as BodyInit,
    });

    // 404/410 mean the subscription is permanently dead — the browser dropped it, the app was
    // uninstalled, or the endpoint rotated. Anything else may be transient, so the row stays.
    return {
      subscriptionId: sub.id,
      status: response.status,
      gone: response.status === 404 || response.status === 410,
      error: response.ok ? undefined : await response.text().catch(() => undefined),
    };
  } catch (error) {
    return {
      subscriptionId: sub.id,
      status: "error",
      gone: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Sends one message to every registered device and prunes the ones that are permanently gone.
 *
 * This never throws. Every caller runs it inside waitUntil on a request that has already done
 * the thing that matters — a contact submission must not fail because Apple's push service is
 * having a bad day.
 */
export async function notify(env: Env, message: PushMessage): Promise<PushResult[]> {
  if (!isPushConfigured(env)) return [];

  try {
    const { results } = await env.DB.prepare(
      `SELECT id, endpoint, p256dh, auth FROM push_subscriptions`
    ).all<PushSubscriptionRow>();

    if (!results.length) return [];

    const outcomes = await Promise.all(results.map((sub) => sendOne(env, sub, message)));

    const dead = outcomes.filter((r) => r.gone).map((r) => r.subscriptionId);
    if (dead.length) {
      const placeholders = dead.map(() => "?").join(",");
      await env.DB.prepare(`DELETE FROM push_subscriptions WHERE id IN (${placeholders})`)
        .bind(...dead)
        .run();
    }

    const failed = outcomes.filter((r) => !r.gone && r.status !== 201 && r.status !== 200);
    if (failed.length) {
      console.error("Push delivery failed", { failed });
    }

    return outcomes;
  } catch (error) {
    console.error("Push fan-out failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export { sendOne };
