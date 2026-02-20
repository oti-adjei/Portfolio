import type { EmailProvider } from "./provider.js";
import { createResendProvider } from "./resend.js";

export function getEmailProvider(env: Env): EmailProvider {
  return createResendProvider({
    RESEND_API_KEY: env.RESEND_API_KEY,
    EMAIL_FROM: env.EMAIL_FROM,
    EMAIL_OWNER_TO: env.EMAIL_OWNER_TO,
    CONTACT_AUTO_REPLY_HOURS: env.CONTACT_AUTO_REPLY_HOURS,
  });
}
