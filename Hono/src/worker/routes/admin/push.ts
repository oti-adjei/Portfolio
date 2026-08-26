import { Hono } from "hono";
import { isPushConfigured, notify } from "../../services/push/send.js";

const pushRoutes = new Hono<{ Bindings: Env }>();

interface SubscribeBody {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
}

/**
 * The VAPID public key the browser needs to create a subscription.
 *
 * Public by design — it is sent to every client that subscribes. The private half never
 * leaves the Worker. `configured: false` lets the dashboard card explain the situation
 * instead of showing a button that would fail.
 */
pushRoutes.get("/key", (c) => {
  if (!isPushConfigured(c.env)) {
    return c.json({ configured: false, publicKey: null });
  }
  return c.json({ configured: true, publicKey: c.env.VAPID_PUBLIC_KEY });
});

pushRoutes.get("/devices", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, user_agent, created_at, last_seen_at
       FROM push_subscriptions
      ORDER BY created_at DESC`
  ).all();

  return c.json({ configured: isPushConfigured(c.env), devices: results });
});

pushRoutes.post("/subscribe", async (c) => {
  let body: SubscribeBody;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
  const p256dh = typeof body.keys?.p256dh === "string" ? body.keys.p256dh : "";
  const auth = typeof body.keys?.auth === "string" ? body.keys.auth : "";

  if (!endpoint || !p256dh || !auth) {
    return c.json({ error: "endpoint, keys.p256dh and keys.auth are required" }, 400);
  }

  try {
    new URL(endpoint);
  } catch {
    return c.json({ error: "endpoint must be a valid URL" }, 400);
  }

  const now = new Date().toISOString();

  // Re-subscribing the same device hands back the same endpoint, so upsert rather than
  // insert — otherwise every launch that re-registers would add a duplicate row and the
  // device would get N copies of every notification.
  await c.env.DB.prepare(
    `INSERT INTO push_subscriptions (id, endpoint, p256dh, auth, user_agent, created_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(endpoint) DO UPDATE SET
       p256dh = excluded.p256dh,
       auth = excluded.auth,
       user_agent = excluded.user_agent,
       last_seen_at = excluded.last_seen_at`
  )
    .bind(
      crypto.randomUUID(),
      endpoint,
      p256dh,
      auth,
      c.req.header("user-agent") ?? null,
      now,
      now
    )
    .run();

  return c.json({ success: true });
});

pushRoutes.delete("/subscribe", async (c) => {
  let body: { endpoint?: unknown };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
  if (!endpoint) return c.json({ error: "endpoint is required" }, 400);

  await c.env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`).bind(endpoint).run();

  return c.json({ success: true });
});

/**
 * Sends a test notification to every registered device.
 *
 * Unlike the event triggers this awaits the result and reports it, because the entire point
 * is to find out whether delivery works.
 */
pushRoutes.post("/test", async (c) => {
  if (!isPushConfigured(c.env)) {
    return c.json({ error: "Push is not configured on the server" }, 503);
  }

  const results = await notify(c.env, {
    title: "Test notification",
    body: "Push is working. This came from your Worker.",
    url: "/admin",
    tag: "test",
  });

  if (!results.length) {
    return c.json({ error: "No devices are registered" }, 404);
  }

  const delivered = results.filter((r) => r.status === 201 || r.status === 200).length;

  return c.json({
    success: delivered > 0,
    delivered,
    total: results.length,
    results: results.map((r) => ({ status: r.status, gone: r.gone, error: r.error })),
  });
});

export default pushRoutes;
