
import { siteContent } from '@/mocks/siteContent';

export default function ContactHero() {
  const { hero } = siteContent.contactPage;

  return (
    <section className="pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block text-xs sm:text-sm font-medium text-gray-400 tracking-widest uppercase mb-4 sm:mb-6">
          {hero.label}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-4 sm:mb-6 leading-tight">
          {hero.headingLines.map((line, index) => (
            <span key={index}>
              {index === 1 ? <span className="italic text-gray-600">{line}</span> : line}
              {index < hero.headingLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="text-base sm:text-lg text-gray-500 font-light max-w-xl mx-auto leading-relaxed px-4">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
