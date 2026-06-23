
import { Link } from 'react-router-dom';
import type { SiteContent } from '@/types/siteContent';

type Project = SiteContent['projects'][0];

interface ProjectNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
}

export default function ProjectNavigation({
  prevProject,
  nextProject,
}: ProjectNavigationProps) {
  return (
    <section className="py-16 px-6 lg:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          {prevProject ? (
            <Link
              to={`/project/${prevProject.id}`}
              className="group flex items-center gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <i className="ri-arrow-left-line text-xl"></i>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-500 mb-1">Previous Project</p>
                <p className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {prevProject.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link
            to="/works"
            className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            All Projects
          </Link>

          {nextProject ? (
            <Link
              to={`/project/${nextProject.id}`}
              className="group flex items-center gap-4 cursor-pointer"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-500 mb-1">Next Project</p>
                <p className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {nextProject.title}
                </p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <i className="ri-arrow-right-line text-xl"></i>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
