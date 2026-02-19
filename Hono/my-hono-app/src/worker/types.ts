export interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface Project {
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
  gallery: { images: GalleryImage[] };
  sort_order?: number;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content?: string;
  external_url?: string;
  tags: string[];
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Note {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  category?: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StreamEvent {
  id: string;
  title: string;
  date?: string;
  time?: string;
  platform: "twitch" | "tiktok" | "youtube";
  stream_url?: string;
  description?: string;
  is_recurring?: boolean;
  recurring_day?: string;
  created_at?: string;
  updated_at?: string;
}

// Raw D1 row shapes (all fields are flat strings/numbers from D1)
export interface ProjectRow {
  id: string;
  title: string;
  category: string;
  year: string | null;
  thumbnail_url: string | null;
  thumbnail_alt: string | null;
  tags: string | null;
  overview_description: string | null;
  overview_client: string | null;
  overview_duration: string | null;
  overview_role: string | null;
  details_challenge: string | null;
  details_solution: string | null;
  details_results: string | null;
  gallery_images: string | null;
  sort_order: number;
  published: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string | null;
  content: string | null;
  external_url: string | null;
  tags: string | null;
  published: number;
  created_at: string;
  updated_at: string;
}

export interface NoteRow {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  category: string | null;
  published: number;
  created_at: string;
  updated_at: string;
}

export interface StreamEventRow {
  id: string;
  title: string;
  date: string | null;
  time: string | null;
  platform: string;
  stream_url: string | null;
  description: string | null;
  is_recurring: number;
  recurring_day: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to parse JSON safely
function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    year: row.year ?? undefined,
    thumbnail: {
      url: row.thumbnail_url ?? "",
      alt: row.thumbnail_alt ?? "",
    },
    tags: parseJson<string[]>(row.tags, []),
    overview: {
      description: row.overview_description ?? "",
      client: row.overview_client ?? undefined,
      duration: row.overview_duration ?? undefined,
      role: row.overview_role ?? undefined,
    },
    details: {
      challenge: row.details_challenge ?? "",
      solution: row.details_solution ?? "",
      results: parseJson<string[]>(row.details_results, []),
    },
    gallery: {
      images: parseJson<GalleryImage[]>(row.gallery_images, []),
    },
    sort_order: row.sort_order,
    published: row.published === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    date: row.date,
    excerpt: row.excerpt ?? undefined,
    content: row.content ?? undefined,
    external_url: row.external_url ?? undefined,
    tags: parseJson<string[]>(row.tags, []),
    published: row.published === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    date: row.date,
    content: row.content,
    category: row.category ?? undefined,
    published: row.published === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function rowToStreamEvent(row: StreamEventRow): StreamEvent {
  return {
    id: row.id,
    title: row.title,
    date: row.date ?? undefined,
    time: row.time ?? undefined,
    platform: row.platform as StreamEvent["platform"],
    stream_url: row.stream_url ?? undefined,
    description: row.description ?? undefined,
    is_recurring: row.is_recurring === 1,
    recurring_day: row.recurring_day ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
