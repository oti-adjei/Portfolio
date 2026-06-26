import { lazy } from "react";
import { Navigate, useParams, type RouteObject } from "react-router-dom";

// V1 (archived at /v1/*)
const HomeV1 = lazy(() => import("../../pages/public/v1/home/page"));
const AboutV1 = lazy(() => import("../../pages/public/v1/about/page"));
const WorksV1 = lazy(() => import("../../pages/public/v1/works/page"));
const ProjectV1 = lazy(() => import("../../pages/public/v1/project/page"));
const ContactV1 = lazy(() => import("../../pages/public/v1/contact/page"));
const StreamsV1 = lazy(() => import("../../pages/public/v1/streams/page"));
const BlogListV1 = lazy(() => import("../../pages/public/v1/blog/page"));
const BlogPostV1 = lazy(() => import("../../pages/public/v1/blog/post/page"));
const NotesListV1 = lazy(() => import("../../pages/public/v1/notes/page"));
const NoteV1 = lazy(() => import("../../pages/public/v1/notes/note/page"));

// V2 (canonical at root)
const HomeV2 = lazy(() => import("../../pages/public/v2/home"));
const AboutV2 = lazy(() => import("../../pages/public/v2/about/page"));
const WorksV2 = lazy(() => import("../../pages/public/v2/works/page"));
const ProjectV2 = lazy(() => import("../../pages/public/v2/project/page"));
const LibraryV2 = lazy(() => import("../../pages/public/v2/library/page"));
const PressV2 = lazy(() => import("../../pages/public/v2/press/page"));
const BlogPostV2 = lazy(() => import("../../pages/public/v2/blog/post/page"));
const NoteV2 = lazy(() => import("../../pages/public/v2/notes/note/page"));
const DesignSystemV2 = lazy(() => import("../../pages/public/v2/design-system/page"));

const NotFound = lazy(() => import("../../pages/public/NotFound"));

function RedirectExperimentProject() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/project/${id ?? ""}`} replace />;
}

const publicRoutes: RouteObject[] = [
  // V2 (canonical) at root
  { path: "/", element: <HomeV2 /> },
  { path: "/about", element: <AboutV2 /> },
  { path: "/works", element: <WorksV2 /> },
  { path: "/project/:id", element: <ProjectV2 /> },
  { path: "/library", element: <LibraryV2 /> },
  { path: "/press", element: <PressV2 /> },
  { path: "/blog/:slug", element: <BlogPostV2 /> },
  { path: "/notes/:slug", element: <NoteV2 /> },
  { path: "/design-system", element: <DesignSystemV2 /> },

  // V1 (archive) at /v1/*
  { path: "/v1", element: <HomeV1 /> },
  { path: "/v1/about", element: <AboutV1 /> },
  { path: "/v1/works", element: <WorksV1 /> },
  { path: "/v1/project/:id", element: <ProjectV1 /> },
  { path: "/v1/contact", element: <ContactV1 /> },
  { path: "/v1/streams", element: <StreamsV1 /> },
  { path: "/v1/blog", element: <BlogListV1 /> },
  { path: "/v1/blog/:slug", element: <BlogPostV1 /> },
  { path: "/v1/notes", element: <NotesListV1 /> },
  { path: "/v1/notes/:slug", element: <NoteV1 /> },

  // /experiment/* redirects — URLs were just renamed; preserve backlinks
  { path: "/experiment", element: <Navigate to="/" replace /> },
  { path: "/experiment/about", element: <Navigate to="/about" replace /> },
  { path: "/experiment/works", element: <Navigate to="/works" replace /> },
  { path: "/experiment/project/:id", element: <RedirectExperimentProject /> },
  { path: "/experiment/library", element: <Navigate to="/library" replace /> },
  { path: "/experiment/press", element: <Navigate to="/press" replace /> },

  // Catch-all 404 — also catches V1-only URLs (/contact, /blog, /notes, /streams)
  // that have no V2 equivalent. Per spec: those must 404 (no redirect to /v1/*).
  { path: "*", element: <NotFound /> },
];

export default publicRoutes;
