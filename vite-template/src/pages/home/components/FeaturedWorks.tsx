
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useContent } from '../../../contexts/ContentContext';

interface DisplayProject {
  id: string | number;
  title: string;
  category: string;
  image: string;
  type: 'desktop' | 'mobile';
  bgClass: string;
}

const bgClasses = [
  'from-pink-100 to-pink-200',
  'from-gray-50 to-gray-100',
  'from-teal-100 to-teal-200',
  'from-amber-50 to-amber-100',
  'from-rose-50 to-rose-100',
  'from-emerald-50 to-emerald-100',
  'from-orange-50 to-orange-100',
  'from-sky-50 to-sky-100',
  'from-violet-50 to-violet-100',
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type RowLayout = {
  projects: DisplayProject[];
  pattern: 'dm' | 'md';
};

function buildRows(
  desktopPool: DisplayProject[],
  mobilePool: DisplayProject[],
  count: number
): RowLayout[] {
  const rows: RowLayout[] = [];
  const dPool = [...desktopPool];
  const mPool = [...mobilePool];

  for (let i = 0; i < count; i++) {
    if (dPool.length === 0 || mPool.length === 0) break;

    const pattern: RowLayout['pattern'] = Math.random() > 0.5 ? 'dm' : 'md';
    const projects: DisplayProject[] = [];

    if (pattern === 'dm') {
      const d = dPool.shift();
      const m = mPool.shift();
      if (d && m) {
        projects.push(d, m);
      }
    } else {
      const m = mPool.shift();
      const d = dPool.shift();
      if (m && d) {
        projects.push(m, d);
      }
    }

    if (projects.length === 2) {
      rows.push({ projects, pattern });
    }
  }

  return rows;
}

function ProjectCard({ project }: { project: DisplayProject }) {
  const isMobile = project.type === 'mobile';
  
  return (
    <div
      className={`bg-gradient-to-br ${project.bgClass} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 flex items-center justify-center min-h-[280px] sm:min-h-[350px] lg:min-h-[480px] group cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
    >
      <Link to={`/project/${project.id}`} className="w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={project.image}
            alt={project.title}
            className={`${isMobile ? 'h-[200px] sm:h-[280px] lg:h-[380px] w-auto' : 'w-full h-auto max-h-[200px] sm:max-h-[280px] lg:max-h-full'} object-contain transform group-hover:scale-105 transition-transform duration-500`}
          />
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap">
            <i className={`${isMobile ? 'ri-smartphone-line' : 'ri-window-line'} w-4 h-4 flex items-center justify-center`}></i>
            <span className="hidden sm:inline">{project.category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function FeaturedWorks() {
  const { content } = useContent();
  const featuredWorks = content.homePage.featuredWorks;
  const projects = content.projects;

  const displayProjects = useMemo(() => {
    return projects
      .filter((p) => featuredWorks.projectIds.includes(p.id))
      .map((p, index) => ({
        id: p.id,
        title: p.title,
        category:
          p.category === 'MOBILE'
            ? 'Mobile Design'
            : p.category === 'DESKTOP'
            ? 'Desktop App'
            : 'Web Design',
        image: p.thumbnail.url,
        type: (p.category === 'MOBILE' ? 'mobile' : 'desktop') as 'mobile' | 'desktop',
        bgClass: bgClasses[index % bgClasses.length],
      }));
  }, [projects, featuredWorks]);

  const rows = useMemo(() => {
    const desktopProjects = shuffleArray(
      displayProjects.filter((p) => p.type === 'desktop')
    );
    const mobileProjects = shuffleArray(
      displayProjects.filter((p) => p.type === 'mobile')
    );

    return buildRows(
      desktopProjects,
      mobileProjects,
      featuredWorks.displaySettings.maxRows
    );
  }, [displayProjects, featuredWorks]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {featuredWorks.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">{featuredWorks.subtitle}</p>
        </div>

        {/* Mobile: Simple grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:hidden mb-8 sm:mb-12">
          {displayProjects.slice(0, 4).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Desktop: Row-based layout */}
        <div className="hidden lg:grid grid-cols-3 gap-8 mb-12">
          {rows.map((row, index) => (
            row.pattern === 'dm' ? (
              <>
                <div key={`${index}-d`} className="col-span-2">
                  <ProjectCard project={row.projects[0]} />
                </div>
                <div key={`${index}-m`} className="col-span-1">
                  <ProjectCard project={row.projects[1]} />
                </div>
              </>
            ) : (
              <>
                <div key={`${index}-m`} className="col-span-1">
                  <ProjectCard project={row.projects[0]} />
                </div>
                <div key={`${index}-d`} className="col-span-2">
                  <ProjectCard project={row.projects[1]} />
                </div>
              </>
            )
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/works"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer text-sm sm:text-base"
          >
            See More
            <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
