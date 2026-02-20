import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { siteContent as fallbackContent } from "../../mocks/siteContent";
import type { BlogPost, Note, Project, SiteContent, StreamEvent } from "../../types/siteContent";
import { useAdminAuth } from "./AdminAuthContext";
import {
  createAdminBlogPost,
  createAdminNote,
  createAdminProject,
  createAdminStream,
  deleteAdminBlogPost,
  deleteAdminNote,
  deleteAdminProject,
  deleteAdminStream,
  fetchAdminBlogPosts,
  fetchAdminNotes,
  fetchAdminProjects,
  fetchAdminSection,
  fetchAdminStreams,
  saveAdminSection,
  updateAdminBlogPost,
  updateAdminNote,
  updateAdminProject,
  updateAdminStream,
  fetchNewsletterSubscribers,
  fetchContactSubmissions,
  updateNewsletterSubscriberStatus,
  updateContactSubmissionStatus,
  type AdminSections,
} from "../services/adminApi";

interface AdminContentContextType {
  content: SiteContent;
  isLoading: boolean;
  error: string | null;
  updateContent: (updates: Partial<SiteContent>) => void;
  refresh: () => Promise<void>;
  saveSection: (key: keyof AdminSections) => Promise<void>;
  createProject: (project: Project) => Promise<Project>;
  updateProject: (project: Project) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  createBlogPost: (post: BlogPost) => Promise<BlogPost>;
  updateBlogPost: (post: BlogPost) => Promise<BlogPost>;
  deleteBlogPost: (postId: string) => Promise<void>;
  createNote: (note: Note) => Promise<Note>;
  updateNote: (note: Note) => Promise<Note>;
  deleteNote: (noteId: string) => Promise<void>;
  createStream: (stream: StreamEvent) => Promise<StreamEvent>;
  updateStream: (stream: StreamEvent) => Promise<StreamEvent>;
  deleteStream: (streamId: string) => Promise<void>;
  fetchNewsletterSubscribers: (params?: { status?: string; q?: string; page?: number; limit?: number }) => Promise<void>;
  updateNewsletterStatus: (id: string, status: 'subscribed' | 'unsubscribed' | 'bounced') => Promise<void>;
  fetchContactSubmissions: (params?: { status?: string; q?: string; page?: number; limit?: number }) => Promise<void>;
  updateContactStatus: (id: string, status: 'new' | 'read' | 'replied' | 'archived') => Promise<void>;
}

const AdminContentContext = createContext<AdminContentContextType | undefined>(undefined);

const SECTION_KEYS: Array<keyof AdminSections> = [
  "navigation",
  "footer",
  "homePage",
  "aboutPage",
  "contactPage",
  "worksPage",
  "streamsPage",
];

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export function AdminContentProvider({ children }: { children: ReactNode }) {
  const { token } = useAdminAuth();
  const [content, setContent] = useState<SiteContent>(fallbackContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateContent = (updates: Partial<SiteContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
  };

  const refresh = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sectionPairs = await Promise.all(
        SECTION_KEYS.map(async (key) => [key, await fetchAdminSection(token, key)] as const)
      );

      const sections = sectionPairs.reduce<AdminSections>(
        (acc, [key, value]) => {
          acc[key] = value as never;
          return acc;
        },
        {} as AdminSections
      );

      const [projects, blogPosts, notes, streamEvents] = await Promise.all([
        fetchAdminProjects(token),
        fetchAdminBlogPosts(token),
        fetchAdminNotes(token),
        fetchAdminStreams(token),
      ]);

      setContent({
        ...sections,
        projects,
        blogPosts,
        notes,
        streamEvents,
        newsletterSubscribers: [],
        contactSubmissions: [],
      });
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [token]);

  const saveSection = async (key: keyof AdminSections) => {
    if (!token) throw new Error("Not authenticated");
    await saveAdminSection(token, key, content[key]);
  };

  const createProject = async (project: Project) => {
    if (!token) throw new Error("Not authenticated");
    const created = await createAdminProject(token, project);
    setContent((prev) => ({ ...prev, projects: [created, ...prev.projects] }));
    return created;
  };

  const updateProject = async (project: Project) => {
    if (!token) throw new Error("Not authenticated");
    const updated = await updateAdminProject(token, project);
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (String(item.id) === String(updated.id) ? updated : item)),
    }));
    return updated;
  };

  const deleteProject = async (projectId: string) => {
    if (!token) throw new Error("Not authenticated");
    await deleteAdminProject(token, projectId);
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => String(project.id) !== String(projectId)),
    }));
  };

  const createBlogPost = async (post: BlogPost) => {
    if (!token) throw new Error("Not authenticated");
    const created = await createAdminBlogPost(token, post);
    setContent((prev) => ({ ...prev, blogPosts: [created, ...prev.blogPosts] }));
    return created;
  };

  const updateBlogPost = async (post: BlogPost) => {
    if (!token) throw new Error("Not authenticated");
    const updated = await updateAdminBlogPost(token, post);
    setContent((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.map((item) => (item.id === updated.id ? updated : item)),
    }));
    return updated;
  };

  const deleteBlogPost = async (postId: string) => {
    if (!token) throw new Error("Not authenticated");
    await deleteAdminBlogPost(token, postId);
    setContent((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.filter((post) => post.id !== postId),
    }));
  };

  const createNote = async (note: Note) => {
    if (!token) throw new Error("Not authenticated");
    const created = await createAdminNote(token, note);
    setContent((prev) => ({ ...prev, notes: [created, ...prev.notes] }));
    return created;
  };

  const updateNote = async (note: Note) => {
    if (!token) throw new Error("Not authenticated");
    const updated = await updateAdminNote(token, note);
    setContent((prev) => ({
      ...prev,
      notes: prev.notes.map((item) => (item.id === updated.id ? updated : item)),
    }));
    return updated;
  };

  const deleteNote = async (noteId: string) => {
    if (!token) throw new Error("Not authenticated");
    await deleteAdminNote(token, noteId);
    setContent((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== noteId),
    }));
  };

  const createStream = async (stream: StreamEvent) => {
    if (!token) throw new Error("Not authenticated");
    const created = await createAdminStream(token, stream);
    setContent((prev) => ({ ...prev, streamEvents: [created, ...prev.streamEvents] }));
    return created;
  };

  const updateStream = async (stream: StreamEvent) => {
    if (!token) throw new Error("Not authenticated");
    const updated = await updateAdminStream(token, stream);
    setContent((prev) => ({
      ...prev,
      streamEvents: prev.streamEvents.map((item) => (item.id === updated.id ? updated : item)),
    }));
    return updated;
  };

  const deleteStream = async (streamId: string) => {
    if (!token) throw new Error("Not authenticated");
    await deleteAdminStream(token, streamId);
    setContent((prev) => ({
      ...prev,
      streamEvents: prev.streamEvents.filter((stream) => stream.id !== streamId),
    }));
  };

  const fetchNewsletterSubscribersHandler = async (params?: { status?: string; q?: string; page?: number; limit?: number }) => {
    if (!token) throw new Error("Not authenticated");
    const response = await fetchNewsletterSubscribers(token, params);
    setContent((prev) => ({
      ...prev,
      newsletterSubscribers: response.items,
    }));
  };

  const updateNewsletterStatusHandler = async (id: string, status: 'subscribed' | 'unsubscribed' | 'bounced') => {
    if (!token) throw new Error("Not authenticated");
    const updated = await updateNewsletterSubscriberStatus(token, id, status);
    setContent((prev) => ({
      ...prev,
      newsletterSubscribers: prev.newsletterSubscribers.map((item) => (item.id === id ? updated : item)),
    }));
  };

  const fetchContactSubmissionsHandler = async (params?: { status?: string; q?: string; page?: number; limit?: number }) => {
    if (!token) throw new Error("Not authenticated");
    const response = await fetchContactSubmissions(token, params);
    setContent((prev) => ({
      ...prev,
      contactSubmissions: response.items,
    }));
  };

  const updateContactStatusHandler = async (id: string, status: 'new' | 'read' | 'replied' | 'archived') => {
    if (!token) throw new Error("Not authenticated");
    const updated = await updateContactSubmissionStatus(token, id, status);
    setContent((prev) => ({
      ...prev,
      contactSubmissions: prev.contactSubmissions.map((item) => (item.id === id ? updated : item)),
    }));
  };

  const value = useMemo<AdminContentContextType>(
    () => ({
      content,
      isLoading,
      error,
      updateContent,
      refresh,
      saveSection,
      createProject,
      updateProject,
      deleteProject,
      createBlogPost,
      updateBlogPost,
      deleteBlogPost,
      createNote,
      updateNote,
      deleteNote,
      createStream,
      updateStream,
      deleteStream,
      fetchNewsletterSubscribers: fetchNewsletterSubscribersHandler,
      updateNewsletterStatus: updateNewsletterStatusHandler,
      fetchContactSubmissions: fetchContactSubmissionsHandler,
      updateContactStatus: updateContactStatusHandler,
    }),
    [content, isLoading, error, token]
  );

  return <AdminContentContext.Provider value={value}>{children}</AdminContentContext.Provider>;
}

export function useAdminContent() {
  const context = useContext(AdminContentContext);
  if (!context) {
    throw new Error("useAdminContent must be used within AdminContentProvider");
  }
  return context;
}

export const useContent = useAdminContent;
