import { Link } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import Reveal from '@/components/Reveal';
import Shell from '../Shell';
import Timeline from '@/pages/public/v2/components/Timeline';

export default function ExperimentAbout() {
  const { content } = useContent();
  const about = content.aboutPage;

  const timelineNodes = (about?.journey?.timeline ?? []).map((t) => ({
    period: t.year,
    title: t.title,
    org: t.company,
    detail: t.description,
  }));

  return (
    <Shell current="about">
      {/* Hero */}
      <section className="px-8 lg:px-12 pt-16 pb-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">About</p>
        <div className="mt-4 flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
          <Reveal origin="left">
            <img
              src={about?.hero?.avatar?.url || '/assets/me/portrait-close.jpg'}
              alt={about?.hero?.avatar?.alt || about?.hero?.name || 'Portrait'}
              className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover ring-1 ring-black/5 shadow-sm"
            />
          </Reveal>
          <Reveal origin="bottom" delay={120}>
            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
                {about?.hero?.name?.split(' ')[0] || 'George'}
                <span className="text-gray-300">.</span>
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-gray-500">— {about?.hero?.role}</p>
              {about?.hero?.tagline && (
                <p className="mt-4 max-w-xl text-[15px] text-gray-600 leading-relaxed">
                  {about.hero.tagline}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bio */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 sticky top-[80px]">
              The story
            </p>
          </div>
          <div className="lg:col-span-2 space-y-5 text-[15px] leading-[1.8] text-gray-700">
            {about?.bio?.paragraphs?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-6">
          {about?.expertise?.sectionTitle || 'Expertise'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {about?.expertise?.items?.map((item, i) => (
            <Reveal key={item.id} origin="bottom" delay={(i % 2) * 80}>
              <div className="rounded-2xl ring-1 ring-black/5 bg-white/50 p-5">
                <i className={`${item.icon} text-2xl text-gray-700`} />
                <p className="mt-3 text-[16px] font-semibold text-gray-900">{item.title}</p>
                <p className="mt-1.5 text-[13px] text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-8">
          {about?.journey?.sectionTitle || 'Journey'}
        </p>
        <Timeline nodes={timelineNodes} />
      </section>

      {/* Philosophy */}
      {about?.philosophy && (
        <section className="px-8 lg:px-12 py-16 border-t border-black/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
            {about.philosophy.label}
          </p>
          <blockquote
            className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-tight max-w-3xl mx-auto"
          >
            "{about.philosophy.quote}"
          </blockquote>
        </section>
      )}

      {/* Connect CTA */}
      {about?.connectCTA && (
        <section className="px-8 lg:px-12 py-16 border-t border-black/5">
          <div className="rounded-3xl bg-white/60 ring-1 ring-black/5 p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {about.connectCTA.heading}
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[15px] text-gray-600 leading-relaxed">
              {about.connectCTA.description}
            </p>
            <Link
              to={about.connectCTA.ctaButton.url}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition"
            >
              <i className="ri-mail-send-line" /> {about.connectCTA.ctaButton.label}
            </Link>
          </div>
        </section>
      )}

      <div className="px-8 lg:px-12 pb-16 flex items-center justify-between border-t border-black/5 pt-8">
        <Link to="/experiment" className="text-[13px] text-gray-500 hover:text-gray-900">
          ← Back to home
        </Link>
        <Link to="/experiment/works" className="text-[13px] text-gray-900 underline underline-offset-4">
          See selected work →
        </Link>
      </div>
    </Shell>
  );
}
