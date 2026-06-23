
import { useContent } from '@/public/contexts/PublicContentContext';

export default function AboutHero() {
  const { content } = useContent();
  const { hero } = content.aboutPage;

  // Defensive guard in case hero data is missing or malformed
  if (!hero?.avatar?.url) {
    console.error('AboutHero: Missing hero avatar data');
    return null;
  }

  return (
    <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Avatar with pulse animation */}
        <div className="relative inline-block mb-6 sm:mb-8 lg:mb-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-lg animate-pulse-gentle">
            <img
              src={hero.avatar.url}
              alt={hero.avatar.alt ?? 'Avatar'}
              className="w-full h-full object-cover object-bottom"
            />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-teal-400/20 animate-ping-slow" />
        </div>

        {/* Name */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-3 sm:mb-4 tracking-tight">
          {hero.name ?? 'Unnamed'}
        </h1>

        {/* Role */}
        <p className="text-xs sm:text-sm text-gray-500 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-8 sm:mb-10 lg:mb-12">
          {hero.role ?? ''}
        </p>

        {/* Philosophy tagline */}
        <p className="font-serif text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light px-4">
          {hero.tagline ?? ''}
        </p>
      </div>
    </section>
  );
}
