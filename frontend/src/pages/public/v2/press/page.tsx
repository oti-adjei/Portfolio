import { useState } from 'react';
import Reveal from '@/components/Reveal';
import Shell from '../Shell';

interface Bio {
  label: string;
  wordCount: string;
  text: string;
}

interface Headshot {
  src: string;
  alt: string;
  caption: string;
  filename: string;
}

interface LogoAsset {
  name: string;
  src: string;
  bg: 'light' | 'dark' | 'cream';
  filename: string;
}

interface Role {
  period: string;
  title: string;
  org: string;
  detail?: string;
}

interface PressContact {
  label: string;
  value: string;
  href: string;
  icon: string;
}

const BIOS: Bio[] = [
  {
    label: 'Short',
    wordCount: '1 line',
    text: 'George Heavenson is a Product & Brand Designer in Lagos, Nigeria.',
  },
  {
    label: 'Medium',
    wordCount: '~50 words',
    text:
      "George Heavenson is a Product & Brand Designer with 6+ years across healthcare, fintech, and consumer products. Based in Lagos, Nigeria, he currently leads design at Hivelabs, turning ambiguous problems into clear, accessible, and scalable design solutions across the full product lifecycle.",
  },
  {
    label: 'Long',
    wordCount: '~150 words',
    text:
      "George Heavenson is a Product & Brand Designer working at the intersection of user research and product thinking. With over six years of experience across healthcare, fintech, and consumer technology, he leads design at Hivelabs in Lagos, Nigeria — building products used by thousands of people. His process spans the full design lifecycle, from discovery and information architecture through high-fidelity prototyping and developer handoff. Outside of client work, George streams design and engineering sessions, writes about product craft, and contributes to design systems thinking in the African tech ecosystem. He believes great design should feel effortless — and that the best products come from teams who take both user needs and engineering constraints seriously. He is currently open to selective collaborations and speaking opportunities.",
  },
];

const HEADSHOTS: Headshot[] = [
  {
    src: '/assets/me/portrait-full.webp',
    alt: 'George Heavenson — full portrait',
    caption: 'Full portrait',
    filename: 'george-heavenson-portrait.webp',
  },
  {
    src: '/assets/me/portrait-close.jpg',
    alt: 'George Heavenson — close-up headshot',
    caption: 'Close-up headshot',
    filename: 'george-heavenson-headshot.jpg',
  },
  {
    src: '/assets/me/portrait-alt.jpg',
    alt: 'George Heavenson — alternate headshot',
    caption: 'Alternate headshot',
    filename: 'george-heavenson-alternate.jpg',
  },
];

const LOGOS: LogoAsset[] = [
  { name: 'Primary lockup', src: '/assets/brand/gh-primary.svg', bg: 'light', filename: 'gh-primary.svg' },
  { name: 'Primary lockup (inverse)', src: '/assets/brand/gh-primary-inverse.svg', bg: 'dark', filename: 'gh-primary-inverse.svg' },
  { name: 'Secondary mark', src: '/assets/brand/gh-secondary.svg', bg: 'light', filename: 'gh-secondary.svg' },
  { name: 'Secondary mark (inverse)', src: '/assets/brand/gh-secondary-inverse.svg', bg: 'dark', filename: 'gh-secondary-inverse.svg' },
  { name: 'Mono — black', src: '/assets/brand/gh-mono-black.svg', bg: 'light', filename: 'gh-mono-black.svg' },
  { name: 'Mono — white', src: '/assets/brand/gh-mono-white.svg', bg: 'dark', filename: 'gh-mono-white.svg' },
];

const ROLES: Role[] = [
  { period: '2024 — Now', title: 'Senior Product Designer', org: 'Hivelabs', detail: 'Leading design on the engineering platform.' },
  { period: '2021 — 2024', title: 'Product Designer', org: 'Nagyique', detail: 'Brand systems and product launches for early-stage teams.' },
  { period: '2020 — 2024', title: 'B.Tech, Computer Science', org: 'KKR & KSR Institute of Technology' },
];

const QUICK_FACTS: { label: string; value: string }[] = [
  { label: 'Based in', value: 'Lagos, Nigeria' },
  { label: 'Currently at', value: 'Hivelabs' },
  { label: 'Years designing', value: '6+' },
  { label: 'Pronouns', value: 'he / him' },
];

const CONTACTS: PressContact[] = [
  { label: 'Press email', value: 'hello@georgie.com', href: 'mailto:hello@georgie.com', icon: 'ri-mail-line' },
  { label: 'Twitter / X', value: '@georgie_dev', href: 'https://twitter.com/georgie_dev', icon: 'ri-twitter-x-line' },
  { label: 'LinkedIn', value: 'linkedin.com/in/georgie', href: 'https://linkedin.com/in/georgie', icon: 'ri-linkedin-box-fill' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — silently ignore */
    }
  };
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white ring-1 ring-gray-200 text-[11px] text-gray-700 hover:bg-gray-50 transition"
      aria-label="Copy to clipboard"
    >
      <i className={copied ? 'ri-check-line text-emerald-600' : 'ri-file-copy-line'} />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function logoBgClass(bg: LogoAsset['bg']) {
  if (bg === 'dark') return 'bg-gray-900';
  if (bg === 'cream') return 'bg-[#faf8ef]';
  return 'bg-white';
}

export default function ExperimentPress() {
  return (
    <Shell>
      {/* Hero */}
      <section className="px-8 lg:px-12 pt-16 pb-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Press kit</p>
        <Reveal origin="bottom" delay={80}>
          <h1 className="mt-4 text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
            Press &amp; media<span className="text-gray-300">.</span>
          </h1>
        </Reveal>
        <Reveal origin="bottom" delay={160}>
          <p className="mt-5 max-w-2xl text-[15px] md:text-[17px] leading-[1.7] text-gray-600">
            Everything you need to write about, interview, or feature George Heavenson — bios at three
            lengths, high-res headshots, brand logos, and press contact info. All assets free to use for
            editorial coverage.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="mailto:hello@georgie.com?subject=Press%20enquiry"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-[13px] hover:bg-gray-800 transition"
          >
            <i className="ri-mail-send-line" /> Press contact
          </a>
          <a
            href="/assets/documents/george-oti-adjei-cv.docx"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white ring-1 ring-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 transition"
          >
            <i className="ri-download-2-line" /> Download CV
          </a>
        </div>
      </section>

      {/* Quick facts */}
      <section className="px-8 lg:px-12 py-10 border-t border-black/5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">At a glance</p>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_FACTS.map((f) => (
            <div key={f.label} className="rounded-2xl bg-white ring-1 ring-black/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">{f.label}</p>
              <p className="mt-1.5 text-[15px] font-medium text-gray-900">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bios */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Bios</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Three lengths to choose from</h2>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {BIOS.map((b) => (
            <Reveal key={b.label} origin="bottom" delay={100}>
              <article className="h-full flex flex-col rounded-3xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold tracking-[0.14em] text-gray-700 uppercase">{b.label}</p>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400">{b.wordCount}</span>
                </div>
                <p className="mt-4 text-[14px] leading-[1.75] text-gray-700 flex-1">{b.text}</p>
                <div className="mt-5 flex justify-end">
                  <CopyButton text={b.text} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Headshots */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Headshots</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">High-resolution photography</h2>
          </div>
          <p className="text-[12px] text-gray-500">Click any image to download.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEADSHOTS.map((h) => (
            <Reveal key={h.src} origin="bottom" delay={100}>
              <a
                href={h.src}
                download={h.filename}
                className="group block rounded-3xl overflow-hidden ring-1 ring-black/5 bg-white"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={h.src}
                    alt={h.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{h.caption}</p>
                    <p className="text-[11px] text-gray-500">{h.filename}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[11px] text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition">
                    <i className="ri-download-2-line" /> Download
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Logos */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Logos</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Brand marks &amp; lockups</h2>
            <p className="mt-2 text-[13px] text-gray-500 max-w-xl">
              Vector files (SVG) — use the variant that fits the background of your layout. Please don&apos;t
              recolor, distort, or add effects.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOGOS.map((l) => (
            <Reveal key={l.filename} origin="bottom" delay={100}>
              <div className="rounded-3xl overflow-hidden ring-1 ring-black/5 bg-white">
                <div className={`aspect-[16/9] flex items-center justify-center ${logoBgClass(l.bg)}`}>
                  <img src={l.src} alt={l.name} className="max-w-[68%] max-h-[68%] object-contain" />
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{l.name}</p>
                    <p className="text-[11px] text-gray-500">SVG · vector</p>
                  </div>
                  <a
                    href={l.src}
                    download={l.filename}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[11px] text-gray-700 hover:bg-gray-900 hover:text-white transition"
                  >
                    <i className="ri-download-2-line" /> SVG
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Roles / Past work */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Current role &amp; background</p>
        <div className="mt-6 space-y-3">
          {ROLES.map((r) => (
            <div
              key={`${r.period}-${r.title}`}
              className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 rounded-2xl bg-white ring-1 ring-black/5 px-5 py-4"
            >
              <p className="md:w-40 shrink-0 text-[12px] tracking-[0.06em] text-gray-500">{r.period}</p>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">
                  {r.title} <span className="text-gray-400">· {r.org}</span>
                </p>
                {r.detail && <p className="text-[13px] text-gray-600 mt-0.5">{r.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-8 lg:px-12 py-14 border-t border-black/5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Contact</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Reach out</h2>
        <p className="mt-2 text-[13px] text-gray-500 max-w-xl">
          For interviews, podcasts, features, or collaboration — email is the fastest channel.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 rounded-2xl bg-white ring-1 ring-black/5 px-5 py-4 hover:ring-gray-300 transition"
            >
              <span className="w-9 h-9 rounded-full bg-gray-100 inline-flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition">
                <i className={c.icon} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">{c.label}</p>
                <p className="text-[13px] text-gray-900 truncate">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="px-8 lg:px-12 py-10 text-center text-[11px] text-gray-400">
        Press kit · /experiment/press
      </footer>
    </Shell>
  );
}
