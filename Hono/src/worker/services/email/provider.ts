export interface ContactEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  referenceId: string;
}

export interface NewsletterEmailPayload {
  email: string;
  name?: string;
}

export interface EmailProvider {
  sendOwnerContactNotification: (payload: ContactEmailPayload) => Promise<void>;
  sendUserContactAutoReply: (payload: ContactEmailPayload) => Promise<void>;
  sendOwnerNewsletterNotification: (payload: NewsletterEmailPayload) => Promise<void>;
  sendUserNewsletterConfirmation: (payload: NewsletterEmailPayload) => Promise<void>;
}
