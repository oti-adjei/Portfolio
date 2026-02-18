
import type { SiteContent } from '../../../types/siteContent';

type Project = SiteContent['projects'][0];

interface ProjectGalleryProps {
  project: Project;
}

/**
 * ProjectGallery component displays a project's image gallery.
 * It safely handles missing or empty image arrays and provides fallback UI.
 */
export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const { gallery } = project;

  // Guard against undefined or empty image collections
  if (!gallery?.images?.length) {
    return (
      <section className="py-16 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Project Gallery
          </h2>
          <p className="text-center text-gray-500">
            No images available for this project.
          </p>
        </div>
      </section>
    );
  }

  // Destructure the first image for the hero section
  const [firstImage, ...otherImages] = gallery.images;

  return (
    <section className="py-16 px-6 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Project Gallery</h2>

        <div className="space-y-8">
          {/* Hero image */}
          <div className="w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden bg-gray-100">
            <img
              src={firstImage?.url ?? ''}
              alt={firstImage?.caption ?? 'Project image'}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <p className="text-center text-sm text-gray-500">
            {firstImage?.caption ?? ''}
          </p>

          {/* Grid of remaining images */}
          {otherImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {otherImages.map((image, index) => (
                <div key={image?.url ?? index} className="space-y-3">
                  <div className="w-full h-[280px] rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={image?.url ?? ''}
                      alt={image?.caption ?? 'Project image'}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    {image?.caption ?? ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
