import type { BlogPost, ContactSubmission, NewsletterSubscriber, Note, Project, StreamEvent } from "../../types/siteContent";

export type ProjectDto = {
  id: string;
  title: string;
  category: string;
  year?: string;
  thumbnail: { url: string; alt: string };
  tags: string[];
  overview: {
    description: string;
    client?: string;
    duration?: string;
    role?: string;
  };
  details: {
    challenge: string;
    solution: string;
    results: string[];
  };
  gallery: { images: Array<{ url: string; alt?: string; caption?: string }> };
  sort_order?: number;
  published?: boolean;
};

export type BlogPostDto = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content?: string;
  external_url?: string;
  tags: string[];
  published: boolean;
};

export type NoteDto = {
  id: string;
  title: string;
  slug: string;
  date: string;
  content?: string;
  category?: string;
  published: boolean;
};

export type StreamEventDto = {
  id: string;
  title: string;
  date?: string;
  time?: string;
  platform: "twitch" | "tiktok" | "youtube";
  stream_url?: string;
  description?: string;
  is_recurring?: boolean;
  recurring_day?: string;
};

export function toProject(dto: ProjectDto): Project {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    year: dto.year ?? "",
    thumbnail: dto.thumbnail,
    tags: dto.tags ?? [],
    overview: {
      description: dto.overview?.description ?? "",
      client: dto.overview?.client ?? "",
      duration: dto.overview?.duration ?? "",
      role: dto.overview?.role ?? "",
    },
    details: {
      challenge: dto.details?.challenge ?? "",
      solution: dto.details?.solution ?? "",
      results: dto.details?.results ?? [],
    },
    gallery: {
      images: (dto.gallery?.images ?? []).map((image) => ({
        url: image.url,
        caption: image.caption ?? "",
      })),
    },
  };
}

export function fromProject(project: Project): ProjectDto {
  return {
    id: String(project.id),
    title: project.title,
    category: project.category,
    year: project.year,
    thumbnail: project.thumbnail,
    tags: project.tags,
    overview: {
      description: project.overview.description,
      client: project.overview.client || undefined,
      duration: project.overview.duration || undefined,
      role: project.overview.role || undefined,
    },
    details: {
      challenge: project.details.challenge,
      solution: project.details.solution,
      results: project.details.results,
    },
    gallery: {
      images: project.gallery.images.map((image) => ({
        url: image.url,
        caption: image.caption,
      })),
    },
  };
}

export function toBlogPost(dto: BlogPostDto): BlogPost {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    date: dto.date,
    excerpt: dto.excerpt ?? "",
    content: dto.content,
    externalUrl: dto.external_url,
    tags: dto.tags ?? [],
    published: !!dto.published,
  };
}

export function fromBlogPost(post: BlogPost): BlogPostDto {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content,
    external_url: post.externalUrl,
    tags: post.tags,
    published: post.published,
  };
}

export function toNote(dto: NoteDto): Note {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    date: dto.date,
    content: dto.content ?? "",
    category: dto.category,
    published: !!dto.published,
  };
}

export function fromNote(note: Note): NoteDto {
  return {
    id: note.id,
    title: note.title,
    slug: note.slug,
    date: note.date,
    content: note.content,
    category: note.category,
    published: note.published,
  };
}

function dayToNumber(day?: string): number | undefined {
  if (!day) return undefined;
  const map: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  const normalized = day.toLowerCase();
  return map[normalized];
}

function numberToDay(day?: number): string | undefined {
  if (day === undefined || day === null) return undefined;
  const map = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return map[day] ?? undefined;
}

export function toStreamEvent(dto: StreamEventDto): StreamEvent {
  return {
    id: dto.id,
    title: dto.title,
    date: dto.date ?? "",
    time: dto.time ?? "",
    platform: dto.platform,
    streamUrl: dto.stream_url,
    description: dto.description,
    isRecurring: !!dto.is_recurring,
    recurringDay: dayToNumber(dto.recurring_day),
  };
}

export function fromStreamEvent(event: StreamEvent): StreamEventDto {
  return {
    id: event.id,
    title: event.title,
    date: event.date || undefined,
    time: event.time || undefined,
    platform: event.platform,
    stream_url: event.streamUrl,
    description: event.description,
    is_recurring: event.isRecurring,
    recurring_day: numberToDay(event.recurringDay),
  };
}

export type NewsletterSubscriberDto = {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: "subscribed" | "unsubscribed" | "bounced";
  created_at: string;
  updated_at: string;
};

export type ContactSubmissionDto = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
  updated_at: string;
};

export function toNewsletterSubscriber(dto: NewsletterSubscriberDto): NewsletterSubscriber {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    source: dto.source,
    status: dto.status,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
  };
}

export function toContactSubmission(dto: ContactSubmissionDto): ContactSubmission {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    subject: dto.subject,
    message: dto.message,
    source: dto.source,
    status: dto.status,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
  };
}
