
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import GHLogoFull from '@/components/logo/GHLogoFull';

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const el = logoWrapRef.current;
    if (!el) return;
    if (shouldAnimate) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldAnimate]);

  if (!footer) {
    console.error('Footer data is missing in siteContent.');
    return null;
  }

  const { logo, copyright, links = [] } = footer;

  const logoMark = (
    <div ref={logoWrapRef} className="w-full max-w-[380px] sm:max-w-[460px]">
      <GHLogoFull
        variant="light"
        autoplay={shouldAnimate}
        ariaLabel={logo?.text || 'George Heavenson'}
        className="w-full h-auto"
      />
    </div>
  );

  return (
    <footer className="py-12 px-6 bg-gray-900 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        {logo?.url ? (
          <Link to={logo.url} className="cursor-pointer" aria-label={logo.text}>
            {logoMark}
          </Link>
        ) : (
          logoMark
        )}

        <p className="text-sm text-gray-400 tracking-wide">{copyright || ''}</p>

        <div className="flex items-center gap-6 flex-wrap justify-center">
          {links.map((link) => {
            if (!link?.id || !link?.label) return null;

            if (link.url?.startsWith('http')) {
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.id}
                to={link.url || '#'}
                className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
