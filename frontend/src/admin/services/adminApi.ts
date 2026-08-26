import type {
  AboutPage,
  BlogPost,
  ContactPage,
  ContactSubmission,
  Footer,
  HomePage,
  Navigation,
  NewsletterCampaign,
  NewsletterSubscriber,
  Note,
  PaginationResponse,
  Project,
  StreamEvent,
  StreamsPage,
  WorksPage,
} from "../../types/siteContent";
import { ApiError, authHeaders, fetchJson, getApiBaseUrl } from "../../shared/api/client";
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

export async function fetchNewsletterSubscribers(
  token: string,
  params?: { status?: string; q?: string; page?: number; limit?: number }
): Promise<PaginationResponse<NewsletterSubscriber>> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.q) query.set("q", params.q);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const queryString = query.toString();
  return fetchJson<PaginationResponse<NewsletterSubscriber>>(
    `/api/admin/newsletter${queryString ? `?${queryString}` : ""}`,
    { headers: authHeaders(token) }
  );
}

export async function updateNewsletterSubscriberStatus(
  token: string,
  id: string,
  status: "subscribed" | "unsubscribed" | "bounced"
): Promise<NewsletterSubscriber> {
  return fetchJson<NewsletterSubscriber>(`/api/admin/newsletter/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ status }),
  });
}

export async function fetchContactSubmissions(
  token: string,
  params?: { status?: string; q?: string; page?: number; limit?: number }
): Promise<PaginationResponse<ContactSubmission>> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.q) query.set("q", params.q);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const queryString = query.toString();
  return fetchJson<PaginationResponse<ContactSubmission>>(
    `/api/admin/contact-submissions${queryString ? `?${queryString}` : ""}`,
    { headers: authHeaders(token) }
  );
}

export async function updateContactSubmissionStatus(
  token: string,
  id: string,
  status: "new" | "read" | "replied" | "archived"
): Promise<ContactSubmission> {
  return fetchJson<ContactSubmission>(`/api/admin/contact-submissions/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ status }),
  });
}

export async function fetchCampaigns(
  token: string,
  params?: { page?: number; limit?: number }
): Promise<PaginationResponse<NewsletterCampaign>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const queryString = query.toString();
  return fetchJson<PaginationResponse<NewsletterCampaign>>(
    `/api/admin/campaigns${queryString ? `?${queryString}` : ""}`,
    { headers: authHeaders(token) }
  );
}

export async function fetchCampaign(token: string, id: string): Promise<NewsletterCampaign> {
  return fetchJson<NewsletterCampaign>(`/api/admin/campaigns/${id}`, {
    headers: authHeaders(token),
  });
}

export async function createCampaign(
  token: string,
  campaign: {
    subject: string;
    intro?: string;
    style?: "teaser" | "full";
    items?: NewsletterCampaign["items"];
  }
): Promise<NewsletterCampaign> {
  return fetchJson<NewsletterCampaign>(
    "/api/admin/campaigns",
    jsonRequest(token, "POST", campaign)
  );
}

export async function updateCampaign(
  token: string,
  id: string,
  campaign: {
    subject: string;
    intro?: string;
    style?: "teaser" | "full";
    items?: NewsletterCampaign["items"];
  }
): Promise<NewsletterCampaign> {
  return fetchJson<NewsletterCampaign>(
    `/api/admin/campaigns/${id}`,
    jsonRequest(token, "PUT", campaign)
  );
}

export async function deleteCampaign(token: string, id: string): Promise<void> {
  await fetchJson<{ success: boolean }>(`/api/admin/campaigns/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function prepareCampaign(
  token: string,
  id: string
): Promise<{ total: number; pending: number }> {
  return fetchJson<{ total: number; pending: number }>(
    `/api/admin/campaigns/${id}/prepare`,
    jsonRequest(token, "POST")
  );
}

export async function sendCampaignChunk(
  token: string,
  id: string
): Promise<{ sent: number; failed: number; remaining: number; stuck: number; status?: string }> {
  return fetchJson<{
    sent: number;
    failed: number;
    remaining: number;
    stuck: number;
    status?: string;
  }>(`/api/admin/campaigns/${id}/send-chunk`, jsonRequest(token, "POST"));
}

export async function retryCampaignFailed(
  token: string,
  id: string
): Promise<{ requeued: number }> {
  return fetchJson<{ requeued: number }>(
    `/api/admin/campaigns/${id}/retry-failed`,
    jsonRequest(token, "POST")
  );
}

export async function sendCampaignTest(
  token: string,
  id: string,
  email: string
): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(
    `/api/admin/campaigns/${id}/test`,
    jsonRequest(token, "POST", { email })
  );
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

export async function uploadImage(
  token: string,
  file: Blob,
  filename: string,
  folder: string
): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file, filename);
  form.append("folder", folder);

  // Not fetchJson: it sets Content-Type, and the browser must set the
  // multipart boundary itself.
  const response = await fetch(`${getApiBaseUrl()}/api/admin/upload`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(body?.error ?? `Upload failed (${response.status})`, response.status);
  }

  return (await response.json()) as UploadResult;
}
