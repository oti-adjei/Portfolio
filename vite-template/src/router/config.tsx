import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/admin/ProtectedRoute';

const Home = lazy(() => import('../pages/home/page'));
const About = lazy(() => import('../pages/about/page'));
const Works = lazy(() => import('../pages/works/page'));
const Project = lazy(() => import('../pages/project/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('../pages/admin/login/page'));
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/page'));
const AdminHome = lazy(() => import('../pages/admin/home/page'));
const AdminAbout = lazy(() => import('../pages/admin/about/page'));
const AdminContact = lazy(() => import('../pages/admin/contact/page'));
const AdminNavigation = lazy(() => import('../pages/admin/navigation/page'));
const AdminFooter = lazy(() => import('../pages/admin/footer/page'));
const AdminWorks = lazy(() => import('../pages/admin/works/page'));
const AdminProjects = lazy(() => import('../pages/admin/projects/page'));
const EditProject = lazy(() => import('../pages/admin/projects/edit/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/works',
    element: <Works />
  },
  {
    path: '/project/:id',
    element: <Project />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
  },
  {
    path: '/admin/home',
    element: <ProtectedRoute><AdminHome /></ProtectedRoute>
  },
  {
    path: '/admin/about',
    element: <ProtectedRoute><AdminAbout /></ProtectedRoute>
  },
  {
    path: '/admin/contact',
    element: <ProtectedRoute><AdminContact /></ProtectedRoute>
  },
  {
    path: '/admin/navigation',
    element: <ProtectedRoute><AdminNavigation /></ProtectedRoute>
  },
  {
    path: '/admin/footer',
    element: <ProtectedRoute><AdminFooter /></ProtectedRoute>
  },
  {
    path: '/admin/works',
    element: <ProtectedRoute><AdminWorks /></ProtectedRoute>
  },
  {
    path: '/admin/projects',
    element: <ProtectedRoute><AdminProjects /></ProtectedRoute>
  },
  {
    path: '/admin/projects/new',
    element: <ProtectedRoute><EditProject /></ProtectedRoute>
  },
  {
    path: '/admin/projects/edit/:id',
    element: <ProtectedRoute><EditProject /></ProtectedRoute>
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
