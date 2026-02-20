import type {
  AboutPage,
  BlogPost,
  ContactPage,
  Footer,
  HomePage,
  Navigation,
  Note,
  Project,
  StreamEvent,
  StreamsPage,
  WorksPage,
} from "../../types/siteContent";
import { authHeaders, fetchJson } from "../../shared/api/client";
import {
  fromBlogPost,
  fromNote,
  fromProject,
  fromStreamEvent,
  toBlogPost,
  toNote,
  toProject,
  toStreamEvent,
  type BlogPostDto,
  type NoteDto,
  type ProjectDto,
  type StreamEventDto,
} from "../../shared/api/mappers";

export interface AdminSections {
  navigation: Navigation;
  footer: Footer;
  homePage: HomePage;
  aboutPage: AboutPage;
  contactPage: ContactPage;
  worksPage: WorksPage;
  streamsPage: StreamsPage;
}

function jsonRequest(token: string | null, method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string }> {
  return fetchJson<{ token: string }>("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchAdminSection<K extends keyof AdminSections>(
  token: string,
  key: K
): Promise<AdminSections[K]> {
  return fetchJson<AdminSections[K]>(
    `/api/admin/content/${key}`,
    { headers: authHeaders(token) }
  );
}

export async function saveAdminSection<K extends keyof AdminSections>(
  token: string,
  key: K,
  value: AdminSections[K]
): Promise<void> {
  await fetchJson<{ success: boolean }>(
    `/api/admin/content/${key}`,
    jsonRequest(token, "PUT", value)
  );
}

export async function fetchAdminProjects(token: string): Promise<Project[]> {
  const rows = await fetchJson<ProjectDto[]>("/api/admin/projects", {
    headers: authHeaders(token),
  });
  return rows.map(toProject);
}

export async function createAdminProject(token: string, project: Project): Promise<Project> {
  const row = await fetchJson<ProjectDto>(
    "/api/admin/projects",
    jsonRequest(token, "POST", fromProject(project))
  );
  return toProject(row);
}

export async function updateAdminProject(token: string, project: Project): Promise<Project> {
  const row = await fetchJson<ProjectDto>(
    `/api/admin/projects/${project.id}`,
    jsonRequest(token, "PUT", fromProject(project))
  );
  return toProject(row);
}

export async function deleteAdminProject(token: string, projectId: string): Promise<void> {
  await fetchJson<{ success: boolean }>(
    `/api/admin/projects/${projectId}`,
    { method: "DELETE", headers: authHeaders(token) }
  );
}

export async function fetchAdminBlogPosts(token: string): Promise<BlogPost[]> {
  const rows = await fetchJson<BlogPostDto[]>("/api/admin/blog", {
    headers: authHeaders(token),
  });
  return rows.map(toBlogPost);
}

export async function createAdminBlogPost(token: string, post: BlogPost): Promise<BlogPost> {
  const row = await fetchJson<BlogPostDto>(
    "/api/admin/blog",
    jsonRequest(token, "POST", fromBlogPost(post))
  );
  return toBlogPost(row);
}

export async function updateAdminBlogPost(token: string, post: BlogPost): Promise<BlogPost> {
  const row = await fetchJson<BlogPostDto>(
    `/api/admin/blog/${post.id}`,
    jsonRequest(token, "PUT", fromBlogPost(post))
  );
  return toBlogPost(row);
}

export async function deleteAdminBlogPost(token: string, postId: string): Promise<void> {
  await fetchJson<{ success: boolean }>(`/api/admin/blog/${postId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function fetchAdminNotes(token: string): Promise<Note[]> {
  const rows = await fetchJson<NoteDto[]>("/api/admin/notes", {
    headers: authHeaders(token),
  });
  return rows.map(toNote);
}

export async function createAdminNote(token: string, note: Note): Promise<Note> {
  const row = await fetchJson<NoteDto>(
    "/api/admin/notes",
    jsonRequest(token, "POST", fromNote(note))
  );
  return toNote(row);
}

export async function updateAdminNote(token: string, note: Note): Promise<Note> {
  const row = await fetchJson<NoteDto>(
    `/api/admin/notes/${note.id}`,
    jsonRequest(token, "PUT", fromNote(note))
  );
  return toNote(row);
}

export async function deleteAdminNote(token: string, noteId: string): Promise<void> {
  await fetchJson<{ success: boolean }>(`/api/admin/notes/${noteId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function fetchAdminStreams(token: string): Promise<StreamEvent[]> {
  const rows = await fetchJson<StreamEventDto[]>("/api/admin/streams", {
    headers: authHeaders(token),
  });
  return rows.map(toStreamEvent);
}

export async function createAdminStream(token: string, stream: StreamEvent): Promise<StreamEvent> {
  const row = await fetchJson<StreamEventDto>(
    "/api/admin/streams",
    jsonRequest(token, "POST", fromStreamEvent(stream))
  );
  return toStreamEvent(row);
}

export async function updateAdminStream(token: string, stream: StreamEvent): Promise<StreamEvent> {
  const row = await fetchJson<StreamEventDto>(
    `/api/admin/streams/${stream.id}`,
    jsonRequest(token, "PUT", fromStreamEvent(stream))
  );
  return toStreamEvent(row);
}

export async function deleteAdminStream(token: string, streamId: string): Promise<void> {
  await fetchJson<{ success: boolean }>(`/api/admin/streams/${streamId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
