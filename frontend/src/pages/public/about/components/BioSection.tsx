
import { siteContent } from '@/mocks/siteContent';

export default function BioSection() {
  // Guard against missing data to avoid runtime crashes
  const aboutPage = siteContent?.aboutPage;
  const bio = aboutPage?.bio;

  if (!bio || !Array.isArray(bio.paragraphs)) {
    // Render a friendly fallback UI instead of throwing
    return (
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center text-gray-500">
          No biography information is available.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {bio.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`font-serif ${
              index === 0 ? 'text-lg sm:text-xl text-gray-700' : 'text-base sm:text-lg text-gray-600'
            } leading-[1.8] sm:leading-[1.9] mb-6 sm:mb-8 last:mb-0`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
