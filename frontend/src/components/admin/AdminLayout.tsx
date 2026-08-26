import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const navGroups = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', path: '/admin' }],
  },
  {
    label: 'Pages',
    items: [
      { id: 'home', label: 'Home Page', icon: 'ri-home-line', path: '/admin/home' },
      { id: 'about', label: 'About Page', icon: 'ri-user-line', path: '/admin/about' },
      { id: 'contact', label: 'Contact Page', icon: 'ri-mail-line', path: '/admin/contact' },
      { id: 'works', label: 'Works Page', icon: 'ri-briefcase-line', path: '/admin/works' },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'projects', label: 'Projects', icon: 'ri-folder-line', path: '/admin/projects' },
      { id: 'blog', label: 'Blog', icon: 'ri-article-line', path: '/admin/blog' },
      { id: 'notes', label: 'Notes', icon: 'ri-sticky-note-line', path: '/admin/notes' },
      { id: 'streams', label: 'Streams', icon: 'ri-live-line', path: '/admin/streams' },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { id: 'newsletter', label: 'Newsletter', icon: 'ri-mail-send-line', path: '/admin/newsletter' },
      { id: 'contact-submissions', label: 'Contact Inbox', icon: 'ri-message-3-line', path: '/admin/contact-submissions' },
    ],
  },
  {
    label: 'Site chrome',
    items: [
      { id: 'navigation', label: 'Navigation', icon: 'ri-navigation-line', path: '/admin/navigation' },
      { id: 'footer', label: 'Footer', icon: 'ri-layout-bottom-line', path: '/admin/footer' },
    ],
  },
];

const navItems = navGroups.flatMap((group) => group.items);

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileDrawerRef = useRef<HTMLElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || !mobileDrawerRef.current) {
      return;
    }

    const focusable = mobileDrawerRef.current.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      mobileMenuButtonRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  const handleToggleMenu = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      setIsMobileMenuOpen((prev) => !prev);
      return;
    }

    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white">
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={mobileDrawerRef}
        id="admin-navigation-drawer"
        aria-label="Admin navigation"
        aria-modal={isMobileMenuOpen ? true : undefined}
        className={`fixed top-0 left-0 h-full bg-ink text-white transition-all duration-300 z-50 pl-[env(safe-area-inset-left)] ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } w-72 md:translate-x-0 ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}`}
      >
        {/* Insets keep the drawer clear of the notch and home indicator when installed to
            an iOS home screen, where there is no browser chrome to absorb them. */}
        <div className="flex flex-col h-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          {/* Brand */}
          <div className="h-16 flex items-center px-4 border-b border-white/10">
            <Link
              to="/admin"
              className={`flex items-center gap-2.5 ${isSidebarOpen ? '' : 'mx-auto'}`}
              aria-label="Admin dashboard"
            >
              <span className="w-8 h-8 rounded-full bg-signal inline-flex items-center justify-center shrink-0">
                <i className="ri-pencil-ruler-2-line text-[15px]" aria-hidden="true" />
              </span>
              {isSidebarOpen && (
                <span className="text-[13px] font-medium tracking-tight">Portfolio CMS</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-4 last:mb-0">
                {isSidebarOpen && (
                  <p className="px-5 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5 px-2">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`flex items-center gap-3 px-3 py-2 rounded-full text-[13px] transition-colors ${
                            isActive
                              ? 'bg-signal/15 text-signal'
                              : 'text-white/65 hover:bg-white/5 hover:text-white'
                          } ${!isSidebarOpen ? 'justify-center' : ''}`}
                          title={!isSidebarOpen ? item.label : undefined}
                        >
                          <i className={`${item.icon} text-[16px]`} aria-hidden="true" />
                          {isSidebarOpen && <span>{item.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* User */}
          <div className="border-t border-white/10 p-4">
            {isSidebarOpen ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-white/10 inline-flex items-center justify-center shrink-0">
                    <i className="ri-user-line text-[13px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] truncate">{user?.email}</p>
                    <p className="text-[11px] text-white/40">Administrator</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full inline-flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  title="Log out"
                  aria-label="Log out"
                >
                  <i className="ri-logout-box-line" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-white/10 inline-flex items-center justify-center mx-auto text-white/50 hover:text-white transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <i className="ri-logout-box-line" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={`transition-all duration-300 ml-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] bg-white/85 backdrop-blur-md border-b border-black/5 sticky top-0 z-30">
          <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                ref={mobileMenuButtonRef}
                onClick={handleToggleMenu}
                aria-expanded={isMobileMenuOpen}
                aria-controls="admin-navigation-drawer"
                aria-label="Toggle navigation"
                className="w-9 h-9 rounded-full inline-flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <i className={`ri-${isSidebarOpen ? 'menu-fold' : 'menu-unfold'}-line text-lg`} aria-hidden="true" />
              </button>
              <p className="text-[14px] font-medium tracking-tight text-gray-900 truncate">
                {navItems.find((item) => item.path === location.pathname)?.label ?? 'Portfolio CMS'}
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i className="ri-external-link-line" aria-hidden="true" />
              <span className="hidden sm:inline">View site</span>
            </a>
          </div>
        </header>

        {/* Bottom inset clears the iOS home indicator; the sidebar and header carry the
            left/right insets for landscape. */}
        <main className="p-4 sm:p-5 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {children}
        </main>
      </div>
    </div>
  );
}
