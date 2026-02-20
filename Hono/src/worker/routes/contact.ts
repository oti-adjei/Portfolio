import { Hono } from "hono";
import { getEmailProvider } from "../services/email/index.js";
import {
  assertHoneypotEmpty,
  enforceRateLimit,
  getClientIp,
  isValidEmail,
  normalizeText,
} from "../services/security.js";

const contact = new Hono<{ Bindings: Env }>();

contact.post("/submit", async (c) => {
  let body: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    source?: string;
    hp?: string;
  };

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  assertHoneypotEmpty(body.hp);

  const name = normalizeText(body.name ?? "");
  const email = normalizeText(body.email ?? "").toLowerCase();
  const subject = normalizeText(body.subject ?? "") || undefined;
  const message = (body.message ?? "").trim();
  const source = normalizeText(body.source ?? "contact_page_form") || "contact_page_form";

  if (!name || name.length > 120) {
    return c.json({ error: "Please provide a valid name." }, 400);
  }

  if (!email || email.length > 320 || !isValidEmail(email)) {
    return c.json({ error: "Please provide a valid email address." }, 400);
  }

  if (!message || message.length > 5000) {
    return c.json({ error: "Please provide a valid message." }, 400);
  }

  if (subject && subject.length > 200) {
    return c.json({ error: "Subject is too long." }, 400);
  }

  const ip = getClientIp(c);
  await enforceRateLimit(c.env.DB, "contact", ip, 5, 1);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO contact_submissions
      (id, name, email, subject, message, source, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?)`
  )
    .bind(id, name, email, subject ?? null, message, source, now, now)
    .run();

  const provider = getEmailProvider(c.env);
  const payload = { name, email, subject, message, referenceId: id };

  try {
    await provider.sendOwnerContactNotification(payload);
    await provider.sendUserContactAutoReply(payload);
  } catch (error) {
    console.error("Contact email delivery failed", {
      referenceId: id,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return c.json({ success: true, referenceId: id });
});

export default contact;
