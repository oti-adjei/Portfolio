import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/admin/ProtectedRoute";

const AdminLogin = lazy(() => import("../../pages/admin/login/page"));
const AdminDashboard = lazy(() => import("../../pages/admin/dashboard/page"));
const AdminHome = lazy(() => import("../../pages/admin/home/page"));
const AdminAbout = lazy(() => import("../../pages/admin/about/page"));
const AdminContact = lazy(() => import("../../pages/admin/contact/page"));
const AdminNavigation = lazy(() => import("../../pages/admin/navigation/page"));
const AdminFooter = lazy(() => import("../../pages/admin/footer/page"));
const AdminWorks = lazy(() => import("../../pages/admin/works/page"));
const AdminProjects = lazy(() => import("../../pages/admin/projects/page"));
const EditProject = lazy(() => import("../../pages/admin/projects/edit/page"));
const AdminBlog = lazy(() => import("../../pages/admin/blog/page"));
const AdminNotes = lazy(() => import("../../pages/admin/notes/page"));
const AdminStreams = lazy(() => import("../../pages/admin/streams/page"));

const adminRoutes: RouteObject[] = [
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin", element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
  { path: "/admin/dashboard", element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
  { path: "/admin/home", element: <ProtectedRoute><AdminHome /></ProtectedRoute> },
  { path: "/admin/about", element: <ProtectedRoute><AdminAbout /></ProtectedRoute> },
  { path: "/admin/contact", element: <ProtectedRoute><AdminContact /></ProtectedRoute> },
  { path: "/admin/navigation", element: <ProtectedRoute><AdminNavigation /></ProtectedRoute> },
  { path: "/admin/footer", element: <ProtectedRoute><AdminFooter /></ProtectedRoute> },
  { path: "/admin/works", element: <ProtectedRoute><AdminWorks /></ProtectedRoute> },
  { path: "/admin/projects", element: <ProtectedRoute><AdminProjects /></ProtectedRoute> },
  { path: "/admin/projects/new", element: <ProtectedRoute><EditProject /></ProtectedRoute> },
  { path: "/admin/projects/edit/:id", element: <ProtectedRoute><EditProject /></ProtectedRoute> },
  { path: "/admin/blog", element: <ProtectedRoute><AdminBlog /></ProtectedRoute> },
  { path: "/admin/notes", element: <ProtectedRoute><AdminNotes /></ProtectedRoute> },
  { path: "/admin/streams", element: <ProtectedRoute><AdminStreams /></ProtectedRoute> },
  { path: "*", element: <AdminLogin /> },
];

export default adminRoutes;
