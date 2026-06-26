
import { Link } from 'react-router-dom';
import type { SiteContent } from '@/types/siteContent';

type Project = SiteContent['projects'][0];

interface ProjectHeroProps {
  project: Project;
}

/**
 * ProjectHero component displays a project's hero section.
 * It safely accesses project data and includes basic error handling
 * to avoid runtime crashes if any required field is missing.
 */
export default function ProjectHero({ project }: ProjectHeroProps) {
  // Guard against undefined/null project (should never happen if used correctly)
  if (!project) {
    return (
      <section className="pt-24 pb-12 px-6 lg:px-12">
        <p className="text-red-600">Project data is unavailable.</p>
      </section>
    );
  }

  // Destructure with defaults to ensure robustness
  const {
    category = 'Uncategorized',
    year = '',
    title = '',
    tags = [],
    thumbnail = { url: '', alt: '' },
  } = project;

  return (
    <section className="pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/works"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8 cursor-pointer"
        >
          <i className="ri-arrow-left-line"></i>
          Back to Works
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-gray-100 text-xs font-semibold text-gray-700 rounded-full">
                {category}
              </span>
              {year && (
                <span className="text-sm text-gray-500">{year}</span>
              )}
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gray-100">
          {thumbnail.url ? (
            <img
              src={thumbnail.url}
              alt={thumbnail.alt || 'Project thumbnail'}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              No image available
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
