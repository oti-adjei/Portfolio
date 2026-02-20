import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const Home = lazy(() => import("../../pages/home/page"));
const About = lazy(() => import("../../pages/about/page"));
const Works = lazy(() => import("../../pages/works/page"));
const Project = lazy(() => import("../../pages/project/page"));
const Contact = lazy(() => import("../../pages/contact/page"));
const Streams = lazy(() => import("../../pages/streams/page"));
const Blog = lazy(() => import("../../pages/blog/page"));
const BlogPost = lazy(() => import("../../pages/blog/post/page"));
const Notes = lazy(() => import("../../pages/notes/page"));
const Note = lazy(() => import("../../pages/notes/note/page"));
const NotFound = lazy(() => import("../../pages/NotFound"));

const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/works", element: <Works /> },
  { path: "/project/:id", element: <Project /> },
  { path: "/contact", element: <Contact /> },
  { path: "/streams", element: <Streams /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <BlogPost /> },
  { path: "/notes", element: <Notes /> },
  { path: "/notes/:slug", element: <Note /> },
  { path: "*", element: <NotFound /> },
];

export default publicRoutes;
