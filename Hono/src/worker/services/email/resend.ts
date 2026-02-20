import type {
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
  };
}
