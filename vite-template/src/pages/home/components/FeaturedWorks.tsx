
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

    const pattern: RowLayout['pattern'] = i % 2 === 0 ? 'dm' : 'md';
    const projects: DisplayProject[] = [];

    if (pattern === 'dm') {
      const d = dPool.shift();
      const m = mPool.shift();
      if (d && m) projects.push(d, m);
    } else {
      const m = mPool.shift();
      const d = dPool.shift();
      if (m && d) projects.push(m, d);
    }

    if (projects.length === 2) rows.push({ projects, pattern });
  }

  return rows;
}

function ProjectCard({ project }: { project: DisplayProject }) {
  const isMobile = project.type === 'mobile';

  return (
    <Link
      to={`/project/${project.id}`}
      className={`bg-gradient-to-br ${project.bgClass} rounded-2xl sm:rounded-3xl flex items-center justify-center h-full group cursor-pointer relative overflow-hidden`}
    >
      {/* Project image */}
      <img
        src={project.image}
        alt={project.title}
        className={`${
          isMobile
            ? 'h-full w-auto max-w-[90%] object-contain'
            : 'w-full h-full object-cover'
        } transform group-hover:scale-105 transition-transform duration-500`}
      />

      {/* Hover overlay — dark gradient + title, matching legacy .layer:hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] bg-gradient-to-b from-black/50 to-[#191919] flex flex-col items-center justify-center gap-2 px-6 text-center">
        <h3 className="text-white text-xl font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-[400ms]">
          {project.title}
        </h3>
        <p className="text-white/70 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-[400ms] delay-75">
          {project.category}
        </p>
      </div>
    </Link>
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
        <div className="text-right mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {featuredWorks.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl ml-auto">
            {featuredWorks.subtitle}
          </p>
        </div>

        {/* Mobile: simple grid, fixed card height so all cards are equal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:hidden mb-8 sm:mb-12">
          {displayProjects.slice(0, 4).map((project) => (
            <div key={project.id} className="h-[280px] sm:h-[350px]">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Desktop: row-based 3-col layout, fixed row height so mobile col == desktop col */}
        <div className="hidden lg:grid grid-cols-3 gap-8 mb-12">
          {rows.map((row, index) =>
            row.pattern === 'dm' ? (
              <>
                <div key={`${index}-d`} className="col-span-2 h-[480px]">
                  <ProjectCard project={row.projects[0]} />
                </div>
                <div key={`${index}-m`} className="col-span-1 h-[480px]">
                  <ProjectCard project={row.projects[1]} />
                </div>
              </>
            ) : (
              <>
                <div key={`${index}-m`} className="col-span-1 h-[480px]">
                  <ProjectCard project={row.projects[0]} />
                </div>
                <div key={`${index}-d`} className="col-span-2 h-[480px]">
                  <ProjectCard project={row.projects[1]} />
                </div>
              </>
            )
          )}
        </div>

        <div className="text-center">
          <Link
            to="/works"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#f75023] hover:bg-[#e0431a] text-white rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer text-sm sm:text-base"
          >
            See More
            <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
