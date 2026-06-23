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
const Experiment = lazy(() => import("../../pages/public/experiment/page"));
const ExperimentWorks = lazy(() => import("../../pages/public/experiment/works/page"));
const ExperimentProject = lazy(() => import("../../pages/public/experiment/project/page"));
const ExperimentLibrary = lazy(() => import("../../pages/public/experiment/library/page"));
const ExperimentAbout = lazy(() => import("../../pages/public/experiment/about/page"));
const ExperimentPress = lazy(() => import("../../pages/public/experiment/press/page"));
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
  { path: "/experiment", element: <Experiment /> },
  { path: "/experiment/works", element: <ExperimentWorks /> },
  { path: "/experiment/project/:id", element: <ExperimentProject /> },
  { path: "/experiment/library", element: <ExperimentLibrary /> },
  { path: "/experiment/about", element: <ExperimentAbout /> },
  { path: "/experiment/press", element: <ExperimentPress /> },
  { path: "*", element: <NotFound /> },
];

export default publicRoutes;
