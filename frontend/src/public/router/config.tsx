import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const Home = lazy(() => import("../../pages/public/home/page"));
const About = lazy(() => import("../../pages/public/about/page"));
const Works = lazy(() => import("../../pages/public/works/page"));
const Project = lazy(() => import("../../pages/public/project/page"));
const Contact = lazy(() => import("../../pages/public/contact/page"));
const Streams = lazy(() => import("../../pages/public/streams/page"));
const Blog = lazy(() => import("../../pages/public/blog/page"));
const BlogPost = lazy(() => import("../../pages/public/blog/post/page"));
const Notes = lazy(() => import("../../pages/public/notes/page"));
const Note = lazy(() => import("../../pages/public/notes/note/page"));
const NotFound = lazy(() => import("../../pages/public/NotFound"));

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
