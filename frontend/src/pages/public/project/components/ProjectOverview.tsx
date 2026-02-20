
import type { SiteContent } from '@/types/siteContent';

type Project = SiteContent['projects'][0];

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const { overview, details } = project;

  return (
    <section className="py-16 px-6 lg:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {overview.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Challenge</h3>
              <p className="text-gray-600 leading-relaxed">
                {details?.challenge ?? 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Solution</h3>
              <p className="text-gray-600 leading-relaxed">
                {details?.solution ?? 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details?.results?.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-900 rounded-full flex-shrink-0">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <span className="text-gray-700 font-medium">{result}</span>
                  </div>
                )) ?? null}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                Project Details
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Client</p>
                  <p className="text-gray-900 font-medium">{overview.client}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Timeline</p>
                  <p className="text-gray-900 font-medium">{overview.duration}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">My Role</p>
                  <p className="text-gray-900 font-medium">{overview.role}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Year</p>
                  <p className="text-gray-900 font-medium">{project.year}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
