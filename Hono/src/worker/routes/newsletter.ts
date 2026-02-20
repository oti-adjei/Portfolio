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

  await c.env.DB.prepare(
    `INSERT INTO newsletter_subscribers (id, email, name, source, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'subscribed', ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = COALESCE(excluded.name, newsletter_subscribers.name),
       source = excluded.source,
       status = 'subscribed',
       updated_at = excluded.updated_at`
  )
    .bind(id, email, name ?? null, source, now, now)
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

export default newsletter;
