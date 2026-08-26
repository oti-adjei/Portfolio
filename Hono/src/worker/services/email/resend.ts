import type {
  BatchEmail,
  BatchResult,
  ContactEmailPayload,
  EmailProvider,
  NewsletterEmailPayload,
} from "./provider.js";

interface ResendEnv {
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_OWNER_TO: string;
  CONTACT_AUTO_REPLY_HOURS?: string;
}

interface ResendMailBody {
  from: string;
  to: string[];
  subject: string;
  text: string;
}

async function sendWithRetry(apiKey: string, body: ResendMailBody): Promise<void> {
  const send = async () => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Resend request failed (${response.status}): ${detail}`);
    }
  };

  try {
    await send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown resend error";
    const shouldRetry = message.includes("(500)") || message.includes("(502)") || message.includes("(503)") || message.includes("(504)");

    if (!shouldRetry) throw error;
    await send();
  }
}

/**
 * Batch send against Resend's /emails/batch endpoint. That endpoint is
 * all-or-nothing — it does not report per-entry failures within a 200 — so
 * a rejected request marks every input row failed rather than losing track
 * of which ones went out.
 */
async function sendBatch(
  apiKey: string,
  fromAddr: string,
  ownerTo: string,
  emails: BatchEmail[],
  idempotencyKey?: string
): Promise<BatchResult> {
  if (emails.length === 0) return { results: [] };

  const listUnsubscribe = `<mailto:${ownerTo}?subject=unsubscribe>`;

  try {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Keyed on the caller's claim_id (unique per chunk-claim attempt),
        // not per delivery row: the whole point is that re-POSTing the SAME
        // claimed chunk — e.g. because our response handling crashed or
        // timed out after Resend already accepted it — hits Resend's
        // idempotency cache instead of re-mailing everyone in the batch. A
        // *different* claim (new chunk, or a genuine retry-failed requeue)
        // gets a new claim_id and therefore a new key, so it is never
        // suppressed by an unrelated earlier send.
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify(
        emails.map((email) => ({
          from: fromAddr,
          to: [email.to],
          subject: email.subject,
          html: email.html,
          text: email.text,
          headers: { "List-Unsubscribe": listUnsubscribe },
        }))
      ),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      const error = `Resend batch request failed (${response.status}): ${detail}`;
      return { results: emails.map(() => ({ ok: false, error })) };
    }

    // A 200 still isn't proof every entry sent — parse the body and confirm
    // it names exactly as many entries as we submitted before trusting any
    // of them. A shape we don't recognise is treated as a total failure
    // rather than guessing which recipients actually got mail.
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      const error = "Resend batch response was not valid JSON";
      return { results: emails.map(() => ({ ok: false, error })) };
    }

    const data = (payload as { data?: unknown } | null)?.data;
    if (!Array.isArray(data) || data.length !== emails.length) {
      const error = `Resend batch response did not confirm all ${emails.length} sends`;
      return { results: emails.map(() => ({ ok: false, error })) };
    }

    return { results: emails.map(() => ({ ok: true })) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown resend error";
    return { results: emails.map(() => ({ ok: false, error: message })) };
  }
}

function autoReplyWindow(hours?: string): string {
  const parsed = Number(hours ?? "24");
  if (Number.isNaN(parsed) || parsed <= 0) return "24";
  return String(parsed);
}

export function createResendProvider(env: ResendEnv): EmailProvider {
  const sendEmail = (mail: ResendMailBody) => sendWithRetry(env.RESEND_API_KEY, mail);

  return {
    async sendOwnerContactNotification(payload: ContactEmailPayload) {
      await sendEmail({
        from: env.EMAIL_FROM,
        to: [env.EMAIL_OWNER_TO],
        subject: `New contact submission: ${payload.subject || "No subject"}`,
        text: [
          `Reference: ${payload.referenceId}`,
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Subject: ${payload.subject || "N/A"}`,
          "",
          "Message:",
          payload.message,
        ].join("\n"),
      });
    },

    async sendUserContactAutoReply(payload: ContactEmailPayload) {
      const responseHours = autoReplyWindow(env.CONTACT_AUTO_REPLY_HOURS);
      await sendEmail({
        from: env.EMAIL_FROM,
        to: [payload.email],
        subject: "We received your message",
        text: [
          `Hi ${payload.name},`,
          "",
          "Thanks for reaching out. This is a quick confirmation that your message has been received.",
          `We will get back to you within ${responseHours} hours.`,
          "",
          `Reference ID: ${payload.referenceId}`,
          "",
          "Best regards,",
          "Portfolio Team",
        ].join("\n"),
      });
    },

    async sendOwnerNewsletterNotification(payload: NewsletterEmailPayload) {
      await sendEmail({
        from: env.EMAIL_FROM,
        to: [env.EMAIL_OWNER_TO],
        subject: "New newsletter signup",
        text: [
          "A new subscriber joined your newsletter.",
          `Email: ${payload.email}`,
          `Name: ${payload.name || "N/A"}`,
        ].join("\n"),
      });
    },

    async sendUserNewsletterConfirmation(payload: NewsletterEmailPayload) {
      await sendEmail({
        from: env.EMAIL_FROM,
        to: [payload.email],
        subject: "Welcome to the newsletter",
        text: [
          `Hi ${payload.name || "there"},`,
          "",
          "Thanks for subscribing to updates and recent posts.",
          "You are now on the list and will receive future updates.",
        ].join("\n"),
      });
    },

    async sendNewsletterBatch(emails: BatchEmail[], idempotencyKey?: string): Promise<BatchResult> {
      return sendBatch(env.RESEND_API_KEY, env.EMAIL_FROM, env.EMAIL_OWNER_TO, emails, idempotencyKey);
    },
  };
}
