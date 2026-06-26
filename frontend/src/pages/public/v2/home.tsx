import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import Reveal from '@/components/Reveal';
import type { Project } from '@/types/siteContent';
import StreamSchedule from '@/components/shared/StreamSchedule';
import WritingSection from '@/components/shared/WritingSection';
import FadingBrands from '@/pages/public/v2/components/FadingBrands';
import Timeline from '@/pages/public/v2/components/Timeline';
import GHLogoMark from '@/components/logo/GHLogoMark';

type SectionId = 'work' | 'about' | 'journey' | 'contact';

type NavItem =
  | { kind: 'scroll'; id: SectionId; label: string }
  | { kind: 'link'; id: string; label: string; to: string };

export default function Experiment() {
  const { content } = useContent();
  const [active, setActive] = useState<SectionId>('work');
  const [theme, setTheme] = useState<'cream' | 'white'>('cream');
  const [aboutVariant, setAboutVariant] = useState<'classic' | 'split'>('classic');
  const [scrolled, setScrolled] = useState(false);

  const bgPage = theme === 'cream' ? 'bg-[#faf8ef]' : 'bg-white';
  const bgPill = theme === 'cream' ? 'bg-[#f3efe2]/85 backdrop-blur-md' : 'bg-gray-100/85 backdrop-blur-md';
  const pillClasses = scrolled
    ? `ring-1 ring-black/[0.06] ${bgPill}`
    : 'ring-0 ring-transparent bg-transparent';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: NavItem[] = [
    { kind: 'scroll', id: 'work', label: 'Work' },
    { kind: 'scroll', id: 'about', label: 'About' },
    { kind: 'link', id: 'library', label: 'Library', to: '/library' },
    { kind: 'scroll', id: 'contact', label: 'Contact' },
  ];

  const scrollTo = (id: SectionId) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const projects = content.projects?.slice(0, 4) ?? [];
  const socialIcons = content.homePage?.hero?.socialIcons ?? [];

  return (
    <div className={`min-h-screen ${bgPage} text-gray-900 antialiased`}>
        <main className={`mx-auto max-w-[1380px] ${bgPage}`}>
          {/* Top bar — static at top, sticks on scroll */}
          <div className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-4 pb-3 pointer-events-none">
            <div className={`mx-auto flex items-center justify-between gap-6 rounded-full pl-5 pr-2 py-2 pointer-events-auto transition-all duration-300 ${pillClasses}`}>
              <Link to="/" className="flex items-center text-[13px] text-gray-700" aria-label="Georgie">
                <GHLogoMark variant="dark" className="h-7 w-auto" />
              </Link>
              <div className="flex items-center gap-5">
                <nav className="flex items-center gap-5 text-[13px] text-gray-500">
                  {navItems.map((n) => {
                    if (n.kind === 'link') {
                      return (
                        <Link
                          key={n.id}
                          to={n.to}
                          className="hover:text-gray-900 transition"
                        >
                          {n.label}
                        </Link>
                      );
                    }
                    return (
                      <button
                        key={n.id}
                        onClick={() => scrollTo(n.id)}
                        className={`hover:text-gray-900 transition ${
                          active === n.id ? 'text-gray-900 underline underline-offset-[6px] decoration-1' : ''
                        }`}
                      >
                        {n.label}
                      </button>
                    );
                  })}
                </nav>
                <a
                  href="/assets/documents/george-oti-adjei-cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[12px] text-gray-700 hover:bg-gray-50"
                >
                  Resume <i className="ri-arrow-right-up-line" />
                </a>
                <button
                  onClick={() => setTheme(theme === 'cream' ? 'white' : 'cream')}
                  aria-label="Toggle theme"
                  className="w-8 h-8 rounded-full bg-white ring-1 ring-gray-200 inline-flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  title={theme === 'cream' ? 'Switch to Light' : 'Switch to Dark'}
                >
                  <i className={theme === 'cream' ? 'ri-sun-line' : 'ri-moon-line'} />
                </button>
              </div>
            </div>
          </div>

          {/* ─ HERO / WORK ─ */}
          <section id="work" className="relative overflow-hidden">
            <div className="relative bg-[#d8d3c8] min-h-[calc(100vh-72px)] flex items-center">
              {/* Architectural search-image background */}
              <img
                src="https://readdy.ai/api/search-image?query=abstract%20white%20architectural%20pattern%20with%20diagonal%20lines%20and%20curves%2C%20minimalist%20geometric%20background%2C%20clean%20modern%20design%2C%20white%20and%20light%20gray%20tones%2C%20subtle%20depth%20and%20dimension%2C%20professional%20studio%20photography&width=1920&height=1080&seq=hero-bg-1&orientation=landscape"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
              />

              {/* portrait right (scaled to ~70%) */}
              <div
                className="hidden md:block absolute right-0 bottom-[18%] h-[64%] w-[38%]"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to left, black 65%, transparent 100%), linear-gradient(to bottom, black 65%, transparent 100%), linear-gradient(to top, black 65%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to left, black 65%, transparent 100%), linear-gradient(to bottom, black 65%, transparent 100%), linear-gradient(to top, black 65%, transparent 100%)',
                  WebkitMaskComposite: 'source-in',
                  maskComposite: 'intersect',
                }}
              >
                <img
                  src="/assets/me/portrait-close.jpg"
                  alt="George Oti-Adjei"
                  className="w-full h-full object-cover object-[50%_80%]"
                />
              </div>

              <Reveal origin="left" delay={150} className="relative px-8 lg:px-12 py-20 max-w-[640px]">
                <p className="text-[15px] md:text-[17px] leading-[1.7] text-gray-700">
                  <span className="text-gray-400">I'm Georgie </span>
                  <span className="text-gray-900">
                    — a mobile &amp; full-stack engineer, builder, and curious
                    problem-solver shipping cross-platform apps and full-stack systems,
                    currently based in Accra, Ghana.
                  </span>
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-gray-500">
                  <span>Open to work</span>
                  <span className="inline-flex items-center gap-1.5">
                    currently <i className="ri-flashlight-fill text-amber-500" />
                    <span className="font-medium text-gray-700">MashHarder</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <i className="ri-map-pin-2-fill text-rose-500" /> Accra, Ghana
                  </span>
                </div>

                <a
                  href="mailto:george@hearvie.dev"
                  className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[12px] text-gray-700 hover:bg-gray-50"
                >
                  <i className="ri-mail-line" /> george@hearvie.dev
                </a>

                {/* Social icons */}
                {socialIcons.length > 0 && (
                  <div className="mt-6 flex -space-x-3">
                    {socialIcons.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden bg-purple-800 flex items-center justify-center hover:scale-110 hover:bg-[#f75124] transition-transform cursor-pointer"
                      >
                        <i className={`${social.icon} text-white text-lg sm:text-xl`}></i>
                      </a>
                    ))}
                  </div>
                )}
              </Reveal>
            </div>

            {/* Selected work — continuous horizontal marquee */}
            <div className="py-12">
              <div className="px-8 lg:px-12 flex items-center justify-between mb-6">
                <p className="text-[12px] font-semibold tracking-[0.18em] text-gray-700">
                  SELECTED WORK ▸
                </p>
                <Link
                  to="/works"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full ring-1 ring-gray-300 text-[12px] text-gray-700 hover:bg-white transition"
                >
                  See all work <i className="ri-arrow-right-up-line" />
                </Link>
              </div>

              {/* Marquee track */}
              <div
                className="group relative overflow-hidden"
                style={{ maskImage: 'linear-gradient(to right, transparent 0, black 4%, black 96%, transparent 100%)' }}
              >
                <div className="flex gap-5 w-max animate-scroll group-hover:[animation-play-state:paused] px-8 lg:px-12">
                  {[...projects, ...projects].map((p: Project, idx) => (
                    <Link
                      key={`${String(p.id)}-${idx}`}
                      to={`/project/${String(p.id)}`}
                      className="group/card shrink-0 w-[260px] sm:w-[320px]"
                    >
                      <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden">
                        {p.thumbnail?.url && (
                          <img
                            src={p.thumbnail.url}
                            alt={p.thumbnail.alt || p.title}
                            className="w-full h-full object-cover group-hover/card:scale-[1.02] transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="pt-4">
                        <p className="text-[15px] font-semibold text-gray-900 inline-flex items-center gap-1">
                          {p.title}
                          <i className="ri-arrow-right-up-line text-gray-400" />
                        </p>
                        <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">
                          {p.overview?.description || p.category || 'Case study'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500">
                          <span>{p.year || '2025'}</span>
                          <span className="px-2 py-1 rounded bg-gray-200/60 uppercase tracking-wider text-gray-600 text-[10px] font-medium">
                            {p.category || 'UX DESIGN'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─ BRANDS (fading 4-up) ─ */}
          <section>
            <FadingBrands />
          </section>

          {/* ─ ABOUT ─ */}
          <section id="about" className="border-t border-black/5">
            {/* Big name intro */}
            <Reveal origin="bottom" delay={100}>
              <div className="relative px-8 lg:px-12 pt-24 pb-12">
                {aboutVariant === 'classic' ? (
                  <div className="flex items-center gap-6 md:gap-10">
                    <img
                      src="/assets/me/portrait-full.webp"
                      alt="George Oti-Adjei"
                      className="shrink-0 w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover object-top ring-1 ring-black/5 shadow-sm"
                    />
                    <h2 className="text-[14vw] md:text-[9.5rem] leading-[0.95] font-bold tracking-tight text-gray-900 select-none">
                      Georgie.
                    </h2>
                  </div>
                ) : (
                  <h2 className="text-[14vw] md:text-[9.5rem] leading-[0.95] font-bold tracking-tight text-gray-900 select-none">
                    Georgie.
                  </h2>
                )}
                <p className="mt-4 text-2xl md:text-3xl text-gray-400">— Engineer</p>

                {/* Floating press-kit cloud */}
                <Link
                  to="/press"
                  aria-label="View press kit"
                  className="hidden md:block absolute top-16 right-12 lg:right-20 group animate-float-medium"
                >
                  <div className="relative -rotate-[6deg] group-hover:rotate-0 group-hover:scale-[1.04] transition-transform duration-300">
                    <div className="bg-white rounded-[28px] ring-1 ring-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Want my</p>
                      <p className="mt-0.5 text-[15px] font-semibold text-gray-900 inline-flex items-center gap-1.5">
                        Press kit? <i className="ri-arrow-right-up-line text-gray-500" />
                      </p>
                    </div>
                    {/* cloud puffs trailing toward the text */}
                    <span className="absolute -bottom-2 left-7 w-4 h-4 rounded-full bg-white ring-1 ring-black/5 shadow-sm" />
                    <span className="absolute -bottom-[18px] left-14 w-2.5 h-2.5 rounded-full bg-white ring-1 ring-black/5 shadow-sm" />
                  </div>
                </Link>
              </div>
            </Reveal>

            <div className="px-8 lg:px-12 py-14 border-t border-black/5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">About</p>
                <button
                  onClick={() => setAboutVariant(aboutVariant === 'classic' ? 'split' : 'classic')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[11px] text-gray-700 hover:bg-gray-50 transition"
                  aria-label="Switch about layout"
                  title={aboutVariant === 'classic' ? 'Switch to split layout' : 'Switch to classic layout'}
                >
                  <i className={aboutVariant === 'classic' ? 'ri-layout-row-line' : 'ri-layout-column-line'} />
                  {aboutVariant === 'classic' ? 'Classic' : 'Split'}
                </button>
              </div>

              {aboutVariant === 'classic' ? (
                /* Classic: text (2/3) + sticky note (1/3) */
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4 text-[14px] leading-[1.75] text-gray-700">
                    <p>
                      Mobile &amp; Full-stack Engineer with 4+ years across fintech, SaaS, and
                      e-commerce. I work across the stack — turning ambiguous problems into
                      shipping, accessible, performant software.
                    </p>
                    <p>
                      My work spans the full product lifecycle — discovery, architecture,
                      building, testing, and shipping. Currently leading frontend at MashHarder
                      and running Senvon Atelier on the side.
                    </p>
                    <p className="text-gray-900">I build to make people's experiences feel effortless.</p>
                  </div>

                  <div className="lg:col-span-1 space-y-4">
                    <div className="rounded-2xl bg-emerald-300/90 p-5 shadow-sm rotate-[1.5deg]">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-900/70">
                        <i className="ri-checkbox-circle-fill mr-1" />Available now
                      </p>
                      <p className="mt-2 text-[16px] font-semibold text-emerald-950">Mobile &amp; Full-stack Engineer</p>
                      <ul className="mt-3 space-y-1 text-[13px] text-emerald-950/80">
                        <li>→ Accra (or Remote)</li>
                        <li>→ EU/US time zones</li>
                        <li>→ Open to contract</li>
                      </ul>
                      <p className="mt-4 text-[11px] text-emerald-950/60">Jun 2026 · MashHarder</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <i className="ri-folder-fill text-5xl text-sky-400" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Split: big image (5/12) + text & sticky note (7/12) */
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                  <Reveal origin="left" delay={100} className="lg:col-span-5">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-sm bg-gray-100">
                      <img
                        src="/assets/me/portrait-full.webp"
                        alt="George Oti-Adjei"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                    </div>
                  </Reveal>

                  <Reveal origin="right" delay={200} className="lg:col-span-7">
                    <div className="space-y-4 text-[14px] leading-[1.75] text-gray-700">
                      <p>
                        Mobile &amp; Full-stack Engineer with 4+ years across fintech, SaaS, and
                        e-commerce. I work across the stack — turning ambiguous problems into
                        shipping, accessible, performant software.
                      </p>
                      <p>
                        My work spans the full product lifecycle — discovery, architecture,
                        building, testing, and shipping. Currently leading frontend at MashHarder
                        and running Senvon Atelier on the side.
                      </p>
                      <p className="text-gray-900">I build to make people's experiences feel effortless.</p>
                    </div>

                    <div className="mt-8 max-w-xs">
                      <div className="rounded-2xl bg-emerald-300/90 p-5 shadow-sm rotate-[1.5deg]">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-900/70">
                          <i className="ri-checkbox-circle-fill mr-1" />Available now
                        </p>
                        <p className="mt-2 text-[16px] font-semibold text-emerald-950">Mobile &amp; Full-stack Engineer</p>
                        <ul className="mt-3 space-y-1 text-[13px] text-emerald-950/80">
                          <li>→ Accra (or Remote)</li>
                          <li>→ EU/US time zones</li>
                          <li>→ Open to contract</li>
                        </ul>
                        <p className="mt-4 text-[11px] text-emerald-950/60">Jun 2026 · MashHarder</p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              )}

              {/* tools strip */}
              <div className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-2xl text-gray-400">
                {['ri-code-s-slash-line', 'ri-smartphone-line', 'ri-terminal-box-line', 'ri-database-2-line', 'ri-git-branch-line', 'ri-cloud-line', 'ri-stack-line', 'ri-figma-fill'].map((i, idx) => (
                  <i key={idx} className={i} />
                ))}
              </div>

              {/* Learn more */}
              <div className="mt-10 text-center">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-[13px] text-gray-900 underline underline-offset-4 hover:text-gray-600"
                >
                  Learn more about me <i className="ri-arrow-right-line" />
                </Link>
              </div>
            </div>
          </section>

          {/* ─ JOURNEY (timeline) ─ */}
          <section id="journey" className="px-8 lg:px-12 py-14 border-t border-black/5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 mb-8">Journey</p>
            <Timeline
              nodes={[
                { period: 'Jan 2026 — Present', title: 'Lead Software Engineer (Frontend Architecture)', org: 'MashHarder', detail: 'Architecting MashHarder UI — a framework-agnostic Web Component library (Lit) for React, Astro, and Next.js consumers.' },
                { period: 'Oct 2025 — Present', title: 'Founder & Software Engineer', org: 'Senvon Atelier', detail: 'Digital studio delivering SaaS platforms and client web applications — including Home Sweet Home (property management SaaS).' },
                { period: 'May — Dec 2025', title: 'Software Engineer', org: 'Suronntech', detail: 'Cross-platform mobile (Flutter/React Native) and responsive web (React/Next.js) with Azure DevOps CI/CD pipelines.' },
              ]}
            />
            <div className="mt-6 text-right">
              <Link
                to="/press#roles"
                className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 underline underline-offset-4 hover:text-gray-900"
              >
                Earlier roles <i className="ri-arrow-right-up-line" />
              </Link>
            </div>
          </section>

          {/* ─ STREAM (scaled down) ─ */}
          <section
            id="stream"
            className="border-t border-black/5 [&_section]:!bg-transparent [&_section]:!py-10 [&_section]:!px-6 [&_.max-w-7xl]:!max-w-3xl [&_h2]:!text-xl [&_h2]:sm:!text-2xl"
          >
            <Reveal origin="bottom"><StreamSchedule /></Reveal>
            <div className="px-8 lg:px-12 pb-8 text-center">
              <Link
                to="/library#stream"
                className="inline-flex items-center gap-1.5 text-[12px] text-gray-700 underline underline-offset-4 hover:text-gray-900"
              >
                See full stream schedule <i className="ri-arrow-right-up-line" />
              </Link>
            </div>
          </section>

          {/* ─ WRITING (no white bg) ─ */}
          <section
            id="writing"
            className="border-t border-black/5 [&_section]:!bg-transparent [&_section]:!py-12 [&_.max-w-7xl]:!max-w-3xl"
          >
            <Reveal origin="bottom"><WritingSection /></Reveal>
            <div className="px-8 lg:px-12 pb-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/library#writing"
                className="inline-flex items-center gap-1.5 text-[12px] text-gray-700 underline underline-offset-4 hover:text-gray-900"
              >
                See all posts <i className="ri-arrow-right-up-line" />
              </Link>
              <Link
                to="/library#notes"
                className="inline-flex items-center gap-1.5 text-[12px] text-gray-700 underline underline-offset-4 hover:text-gray-900"
              >
                Lesson notes <i className="ri-arrow-right-up-line" />
              </Link>
            </div>
          </section>

          {/* ─ CONTACT (chat style) ─ */}
          <section id="contact" className="px-8 lg:px-12 py-14 border-t border-black/5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Contact</p>

            <div className="mt-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white ring-1 ring-black/5 px-4 py-3 text-[13px] text-gray-800">
                  I'm Georgie — based in Accra. I build and ship cross-platform software, end to end.
                </div>
              </div>

              <div className="mt-3 ml-11 flex flex-wrap gap-2">
                {['see my work ↗', 'how do you ship?', "what's your stack?", "what's your availability?", 'wanna chat?', 'resume ↗', 'linkedin ↗'].map((q) => (
                  <button
                    key={q}
                    className="px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[12px] text-gray-700 hover:bg-gray-50 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="mt-5 ml-11 flex items-center gap-2 rounded-full bg-white ring-1 ring-gray-200 pl-4 pr-1 py-1">
                <span className="font-mono text-gray-500 select-none text-[13px]">{'>_'}</span>
                <input
                  type="text"
                  placeholder="What problem are we solving?"
                  className="flex-1 bg-transparent font-mono text-[13px] py-2 outline-none placeholder:text-gray-400"
                />
                <button className="w-8 h-8 rounded-full bg-gray-900 text-white inline-flex items-center justify-center">
                  <i className="ri-arrow-up-line" />
                </button>
              </div>
            </div>
          </section>

          <footer className="px-8 lg:px-12 py-10 text-center text-[11px] text-gray-400">
            V2 · /
          </footer>
        </main>
    </div>
  );
}
