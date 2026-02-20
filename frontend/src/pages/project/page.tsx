import { useParams, Link } from 'react-router-dom';
import { useContent } from '../../public/contexts/PublicContentContext';
import ProjectHeader from './components/ProjectHeader';
import ProjectHero from './components/ProjectHero';
import ProjectOverview from './components/ProjectOverview';
import ProjectGallery from './components/ProjectGallery';
import ProjectNavigation from './components/ProjectNavigation';
import Footer from '../home/components/Footer';
import FloatingShapes from '../../components/FloatingShapes';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { content } = useContent();
  const { projects } = content;
  const project = projects.find((work) => String(work.id) === String(id));

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = projects.findIndex(work => work.id === project.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <ProjectHeader />
      <main className="relative z-10">
        <ProjectHero project={project} />
        <ProjectOverview project={project} />
        <ProjectGallery project={project} />
        <ProjectNavigation prevProject={prevProject} nextProject={nextProject} />
      </main>
      <Footer />
    </div>
  );
}
