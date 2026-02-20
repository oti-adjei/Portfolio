import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', path: '/admin' },
  { id: 'home', label: 'Home Page', icon: 'ri-home-line', path: '/admin/home' },
  { id: 'about', label: 'About Page', icon: 'ri-user-line', path: '/admin/about' },
  { id: 'contact', label: 'Contact Page', icon: 'ri-mail-line', path: '/admin/contact' },
  { id: 'works', label: 'Works Page', icon: 'ri-briefcase-line', path: '/admin/works' },
  { id: 'projects', label: 'Projects', icon: 'ri-folder-line', path: '/admin/projects' },
  { id: 'blog', label: 'Blog', icon: 'ri-article-line', path: '/admin/blog' },
  { id: 'notes', label: 'Notes', icon: 'ri-sticky-note-line', path: '/admin/notes' },
  { id: 'streams', label: 'Streams', icon: 'ri-live-line', path: '/admin/streams' },
  { id: 'newsletter', label: 'Newsletter', icon: 'ri-mail-send-line', path: '/admin/newsletter' },
  { id: 'contact-submissions', label: 'Messages', icon: 'ri-message-3-line', path: '/admin/contact-submissions' },
  { id: 'navigation', label: 'Navigation', icon: 'ri-navigation-line', path: '/admin/navigation' },
  { id: 'footer', label: 'Footer', icon: 'ri-layout-bottom-line', path: '/admin/footer' }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            {isSidebarOpen ? (
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <i className="ri-admin-line text-lg"></i>
                </div>
                <span className="font-semibold text-sm">Admin Panel</span>
              </Link>
            ) : (
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mx-auto">
                <i className="ri-admin-line text-lg"></i>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-teal-500 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      } ${!isSidebarOpen && 'justify-center'}`}
                      title={!isSidebarOpen ? item.label : undefined}
                    >
                      <i className={`${item.icon} text-lg`}></i>
                      {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-800 p-4">
            {isSidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <i className="ri-logout-box-line text-lg"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <i className="ri-logout-box-line text-lg"></i>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <i className={`ri-${isSidebarOpen ? 'menu-fold' : 'menu-unfold'}-line text-xl`}></i>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {navItems.find((item) => item.path === location.pathname)?.label || 'Admin Panel'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-500 transition-colors inline-flex items-center gap-2"
              >
                <i className="ri-external-link-line"></i>
                View Site
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
