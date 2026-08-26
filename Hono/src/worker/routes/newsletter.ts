import { Hono } from "hono";
import { getEmailProvider } from "../services/email/index.js";
import {
  assertHoneypotEmpty,
  enforceRateLimit,
  getClientIp,
  isValidEmail,
  normalizeText,
} from "../services/security.js";

const newsletter = new Hono<{ Bindings: Env }>();

newsletter.post("/subscribe", async (c) => {
  let body: { email?: string; name?: string; source?: string; hp?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  assertHoneypotEmpty(body.hp);

  const email = normalizeText(body.email ?? "").toLowerCase();
  const name = normalizeText(body.name ?? "") || undefined;
  const source = normalizeText(body.source ?? "home_contact_cta") || "home_contact_cta";

  if (!email || email.length > 320 || !isValidEmail(email)) {
    return c.json({ error: "Please provide a valid email address." }, 400);
  }

  const ip = getClientIp(c);
  await enforceRateLimit(c.env.DB, "newsletter", ip, 10, 1);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const unsubscribeToken = crypto.randomUUID();

  await c.env.DB.prepare(
    `INSERT INTO newsletter_subscribers (id, email, name, source, status, unsubscribe_token, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'subscribed', ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = COALESCE(excluded.name, newsletter_subscribers.name),
       source = excluded.source,
       status = 'subscribed',
       unsubscribe_token = COALESCE(newsletter_subscribers.unsubscribe_token, excluded.unsubscribe_token),
       updated_at = excluded.updated_at`
  )
    .bind(id, email, name ?? null, source, unsubscribeToken, now, now)
    .run();

  const provider = getEmailProvider(c.env);
  const payload = { email, name };

  try {
    await provider.sendUserNewsletterConfirmation(payload);
    await provider.sendOwnerNewsletterNotification(payload);
  } catch (error) {
    console.error("Newsletter email delivery failed", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return c.json({ success: true });
});

const UNSUB_CONFIRMATION = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed</title></head>
<body style="margin:0;background:#faf8ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<div style="max-width:480px;margin:64px auto;background:#fff;border-radius:16px;padding:32px;text-align:center">
<h1 style="font-size:20px;margin:0 0 8px;color:#111">You're unsubscribed</h1>
<p style="margin:0;color:#666;font-size:14px">You won't receive any more emails from this list.</p>
</div></body></html>`;

async function unsubscribeByToken(db: D1Database, token: string): Promise<void> {
  if (!token) return;
  await db
    .prepare("UPDATE newsletter_subscribers SET status = 'unsubscribed', updated_at = ? WHERE unsubscribe_token = ?")
    .bind(new Date().toISOString(), token)
    .run();
}

// Same response whether or not the token matched. A different reply would let
// someone probe which tokens are real.
newsletter.get("/unsubscribe", async (c) => {
  await unsubscribeByToken(c.env.DB, c.req.query("token") ?? "");
  return c.html(UNSUB_CONFIRMATION);
});

// One-click, for List-Unsubscribe-Post.
newsletter.post("/unsubscribe", async (c) => {
  let token = c.req.query("token") ?? "";
  if (!token) {
    const body = (await c.req.json().catch(() => null)) as { token?: string } | null;
    token = body?.token ?? "";
  }
  await unsubscribeByToken(c.env.DB, token);
  return c.json({ success: true });
});

export default newsletter;
