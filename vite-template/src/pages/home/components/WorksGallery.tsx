
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../../contexts/ContentContext';

export default function WorksGallery() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { content } = useContent();
  const { worksPage, projects } = content;

  // Guard against missing data
  if (!worksPage || !Array.isArray(projects)) {
    return null; // or render a fallback UI
  }

  const filteredWorks =
    selectedCategory === 'ALL'
      ? projects
      : projects.filter((work) => work.category === selectedCategory);

  return (
    <section id="works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {worksPage.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {worksPage.subtitle}
          </p>
        </div>

        <div className="flex justify-start sm:justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {worksPage.categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredWorks.map((work, index) => (
            <Link
              to={`/project/${work.id}`}
              key={work.id}
              className="group cursor-pointer block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-3 sm:mb-4">
                <div className="w-full h-56 sm:h-64 lg:h-80 flex items-center justify-center">
                  <img
                    src={work.thumbnail?.url ?? ''}
                    alt={work.thumbnail?.alt ?? 'Project thumbnail'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                      {Array.isArray(work.tags) &&
                        work.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium">
                      View Project <i className="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 tracking-wider">
                    {work.category}
                  </span>
                  <span className="text-xs text-gray-400">{work.year}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {work.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {work.overview?.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
