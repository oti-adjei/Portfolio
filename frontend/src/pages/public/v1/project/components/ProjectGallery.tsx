
import type { SiteContent, GalleryImage } from '@/types/siteContent';

type Project = SiteContent['projects'][0];

interface ProjectGalleryProps {
  project: Project;
}

type GalleryMode = 'landscape' | 'portrait' | 'mixed';

function getMode(category: string): GalleryMode {
  if (category === 'MOBILE') return 'portrait';
  if (category === 'SAAS') return 'mixed';
  return 'landscape';
}

function LandscapeGallery({ images, heading }: { images: GalleryImage[]; heading?: string }) {
  if (!images.length) return null;
  const [first, ...rest] = images;
  return (
    <div className="space-y-8">
      {heading && (
        <h3 className="text-lg font-semibold text-gray-700">{heading}</h3>
      )}
      {/* Hero image */}
      <div className="w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden bg-gray-100">
        <img
          src={first.url}
          alt={first.caption || 'Project image'}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <p className="text-center text-sm text-gray-500">{first.caption}</p>

      {/* Remaining images in 2-col grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {rest.map((image, index) => (
            <div key={image.url || index} className="space-y-3">
              <div className="w-full h-[280px] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt={image.caption || 'Project image'}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-center text-sm text-gray-500">{image.caption}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PortraitGallery({ images, heading }: { images: GalleryImage[]; heading?: string }) {
  if (!images.length) return null;
  return (
    <div className="space-y-8">
      {heading && (
        <h3 className="text-lg font-semibold text-gray-700">{heading}</h3>
      )}
      <div className="flex flex-wrap justify-center gap-6">
        {images.map((image, index) => (
          <div key={image.url || index} className="flex flex-col items-center gap-3">
            <div
              className="w-[160px] sm:w-[180px] rounded-2xl overflow-hidden bg-gray-100"
              style={{ aspectRatio: '9 / 19.5' }}
            >
              <img
                src={image.url}
                alt={image.caption || 'Project image'}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="text-center text-sm text-gray-500 max-w-[180px]">{image.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const { gallery, category } = project;

  if (!gallery?.images?.length) {
    return (
      <section className="py-16 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Project Gallery</h2>
          <p className="text-center text-gray-500">No images available for this project.</p>
        </div>
      </section>
    );
  }

  const mode = getMode(category);

  return (
    <section className="py-16 px-6 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Project Gallery</h2>

        {mode === 'landscape' && (
          <LandscapeGallery images={gallery.images} />
        )}

        {mode === 'portrait' && (
          <PortraitGallery images={gallery.images} />
        )}

        {mode === 'mixed' && (() => {
          const webImages = gallery.images.filter(img => img.type !== 'mobile');
          const mobileImages = gallery.images.filter(img => img.type === 'mobile');
          return (
            <div className="space-y-16">
              {webImages.length > 0 && (
                <LandscapeGallery images={webImages} heading="Web" />
              )}
              {mobileImages.length > 0 && (
                <PortraitGallery images={mobileImages} heading="Mobile" />
              )}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
