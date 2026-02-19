
import { Link } from 'react-router-dom';
import { useContent } from '../../../contexts/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;

  if (!footer) {
    console.error('Footer data is missing in siteContent.');
    return null;
  }

  const { logo, copyright, links = [] } = footer;

  return (
    <footer className="py-10 px-6 bg-gray-900 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
        {logo?.url ? (
          <Link to={logo.url} className="cursor-pointer">
            {logo.imageUrl ? (
              <img src={logo.imageUrl} alt={logo.text} className="h-8 w-auto brightness-0 invert" />
            ) : (
              <span className="text-white font-bold">{logo.text || 'Logo'}</span>
            )}
          </Link>
        ) : (
          <span className="text-white font-bold">{logo?.text || 'Logo'}</span>
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
