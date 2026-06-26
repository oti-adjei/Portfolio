import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import GHLogoMark from '@/components/logo/GHLogoMark';

interface ShellProps {
  children: ReactNode;
  current?: 'work' | 'about' | 'contact' | 'library' | 'works' | 'press';
}

export default function Shell({ children, current = 'work' }: ShellProps) {
  const [theme, setTheme] = useState<'cream' | 'white'>('cream');
  const [scrolled, setScrolled] = useState(false);
  const bgPage = theme === 'cream' ? 'bg-[#faf8ef]' : 'bg-white';
  const bgPill = theme === 'cream' ? 'bg-[#f3efe2]/85 backdrop-blur-md' : 'bg-gray-100/85 backdrop-blur-md';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: { label: string; to: string; id: string }[] = [
    { label: 'Work', to: '/#work', id: 'work' },
    { label: 'About', to: '/#about', id: 'about' },
    { label: 'Library', to: '/library', id: 'library' },
    { label: 'Contact', to: '/#contact', id: 'contact' },
  ];

  const pillClasses = scrolled
    ? `ring-1 ring-black/[0.06] ${bgPill}`
    : 'ring-0 ring-transparent bg-transparent';

  return (
    <div className={`min-h-screen ${bgPage} text-gray-900 antialiased`}>
      <main className={`mx-auto max-w-[1380px] ${bgPage}`}>
        {/* Top nav — flush at top, morphs to pill on scroll */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-4 pb-3 pointer-events-none">
          <div
            className={`mx-auto flex items-center justify-between gap-6 rounded-full pl-5 pr-2 py-2 pointer-events-auto transition-all duration-300 ${pillClasses}`}
          >
            <Link to="/" className="flex items-center text-[13px] text-gray-700" aria-label="Georgie">
              <GHLogoMark variant="dark" className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-5">
              <nav className="flex items-center gap-5 text-[13px] text-gray-500">
                {navItems.map((n) => (
                  <Link
                    key={n.id}
                    to={n.to}
                    className={`hover:text-gray-900 transition ${
                      current === n.id ? 'text-gray-900 underline underline-offset-[6px] decoration-1' : ''
                    }`}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <a
                href="#"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[12px] text-gray-700 hover:bg-gray-50"
              >
                Resume <i className="ri-arrow-right-up-line" />
              </a>
              <button
                onClick={() => setTheme(theme === 'cream' ? 'white' : 'cream')}
                aria-label="Toggle theme"
                className="w-8 h-8 rounded-full bg-white ring-1 ring-gray-200 inline-flex items-center justify-center text-gray-600 hover:bg-gray-50"
                title={theme === 'cream' ? 'Switch to Light' : 'Switch to Dark'}
              >
                <i className={theme === 'cream' ? 'ri-sun-line' : 'ri-moon-line'} />
              </button>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
