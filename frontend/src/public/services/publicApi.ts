import type { SiteContent } from "../../types/siteContent";
import { fetchJson } from "../../shared/api/client";
import {
  toBlogPost,
  toNote,
  toProject,
  toStreamEvent,
  type BlogPostDto,
  type NoteDto,
  type ProjectDto,
  type StreamEventDto,
} from "../../shared/api/mappers";

const SECTION_KEYS = [
  "navigation",
  "footer",
  "homePage",
  "aboutPage",
  "contactPage",
  "worksPage",
  "streamsPage",
] as const;

type SectionKey = (typeof SECTION_KEYS)[number];

type SectionMap = Pick<
  SiteContent,
  "navigation" | "footer" | "homePage" | "aboutPage" | "contactPage" | "worksPage" | "streamsPage"
>;

export async function fetchSection<K extends SectionKey>(key: K): Promise<SectionMap[K]> {
  return fetchJson<SectionMap[K]>(`/api/content/${key}`);
}

export async function fetchPublicContent(): Promise<SiteContent> {
  const sectionPairs = await Promise.all(
    SECTION_KEYS.map(async (key) => [key, await fetchSection(key)] as const)
  );

  const sections = Object.fromEntries(sectionPairs) as SectionMap;

  const [projects, blogPosts, notes, streamEvents] = await Promise.all([
    fetchJson<ProjectDto[]>("/api/projects"),
    fetchJson<BlogPostDto[]>("/api/blog"),
    fetchJson<NoteDto[]>("/api/notes"),
    fetchJson<StreamEventDto[]>("/api/streams"),
  ]);

  const detailedBlogPosts = await Promise.all(
    blogPosts.map(async (post) => {
      if (post.external_url || post.content) return post;
      return fetchJson<BlogPostDto>(`/api/blog/${post.slug}`);
    })
  );

  const detailedNotes = await Promise.all(
    notes.map(async (note) => {
      if (note.content) return note;
      return fetchJson<NoteDto>(`/api/notes/${note.slug}`);
    })
  );

  return {
    ...sections,
    projects: projects.map(toProject),
    blogPosts: detailedBlogPosts.map(toBlogPost),
    notes: detailedNotes.map(toNote),
    streamEvents: streamEvents.map(toStreamEvent),
  };
}
