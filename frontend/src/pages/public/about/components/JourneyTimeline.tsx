
import { useContent } from '@/public/contexts/PublicContentContext';

export default function JourneyTimeline() {
  const { content } = useContent();
  const { journey } = content.aboutPage;

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-800 mb-12 sm:mb-16 lg:mb-20 text-center tracking-tight">
          {journey.sectionTitle}
        </h2>

        {/* Mobile Timeline - Vertical left-aligned */}
        <div className="md:hidden relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

          {journey.timeline.map((item, index) => (
            <div
              key={item.id}
              className="relative pl-12 pb-10 last:pb-0"
            >
              {/* Dot */}
              <div
                className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-teal-400 animate-pulse-dot"
                style={{ animationDelay: `${index * 0.3}s` }}
              />
              
              {/* Content */}
              <span className="text-xs font-medium tracking-[0.15em] text-teal-500 uppercase mb-1 block">
                {item.year}
              </span>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{item.company}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Desktop Timeline - Alternating sides */}
        <div className="hidden md:block relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

          {journey.timeline.map((item, index) => (
            <div
              key={item.id}
              className={`relative flex items-center mb-16 last:mb-0 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'
                }`}
              >
                <span className="text-xs font-medium tracking-[0.2em] text-teal-500 uppercase mb-2 block">
                  {item.year}
                </span>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-1">{item.company}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>

              {/* Center dot */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400 animate-pulse-dot"
                style={{ animationDelay: `${index * 0.3}s` }}
              />

              {/* Empty space for other side */}
              <div className="w-5/12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
