
import { Link } from 'react-router-dom';
import { useContent } from '../../../contexts/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;

  // Defensive checks to avoid runtime errors if the mock data is incomplete
  if (!footer) {
    console.error('Footer data is missing in siteContent.');
    return null;
  }

  const { logo, copyright, links = [] } = footer;

  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            {logo?.url && logo?.text ? (
              <Link
                to={logo.url}
                className="text-white font-bold cursor-pointer"
              >
                {logo.text}
              </Link>
            ) : (
              <span className="text-white font-bold">{logo?.text || 'Logo'}</span>
            )}
            <span className="hidden sm:inline text-gray-400">•</span>
            <p className="text-xs sm:text-sm text-gray-400">
              {copyright || ''}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            {links.map((link) => {
              if (!link?.id || !link?.label) {
                // Skip malformed link objects
                return null;
              }

              const commonProps = {
                key: link.id,
                className:
                  'text-xs sm:text-sm text-gray-400 hover:text-white transition-colors cursor-pointer',
                children: link.label,
              };

              // External link
              if (link.url?.startsWith('http')) {
                return (
                  <a
                    {...commonProps}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                );
              }

              // Internal link (fallback to "#" if missing)
              return (
                <Link
                  {...commonProps}
                  to={link.url || '#'}
                />
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
