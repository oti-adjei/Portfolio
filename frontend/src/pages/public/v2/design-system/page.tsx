import { useState, type ReactNode } from 'react';
import Shell from '../Shell';
import GHLogoMark from '@/components/logo/GHLogoMark';
import GHLogoFull from '@/components/logo/GHLogoFull';

type Swatch = {
  name: string;
  hex: string;
  cls: string;
  role: string;
  textOn?: 'light' | 'dark';
};

const corePalette: Swatch[] = [
  { name: 'cream-bg', hex: '#faf8ef', cls: 'bg-[#faf8ef]', role: 'Page background (cream theme)', textOn: 'dark' },
  { name: 'cream-surface', hex: '#f3efe2', cls: 'bg-[#f3efe2]', role: 'Pill nav, raised surfaces on cream', textOn: 'dark' },
  { name: 'cream-accent', hex: '#d8d3c8', cls: 'bg-[#d8d3c8]', role: 'Cream-side accent fills', textOn: 'dark' },
  { name: 'signal-orange', hex: '#f75124', cls: 'bg-[#f75124]', role: 'Signature accent, links, callouts', textOn: 'light' },
  { name: 'signal-purple', hex: '#8067f0', cls: 'bg-[#8067f0]', role: 'Secondary accent', textOn: 'light' },
  { name: 'twitch-purple', hex: '#9146ff', cls: 'bg-[#9146ff]', role: 'Twitch-specific (streams only)', textOn: 'light' },
  { name: 'logo-green', hex: '#00e281', cls: 'bg-[#00e281]', role: 'Logo mark — never used outside brand', textOn: 'dark' },
  { name: 'ink-dark', hex: '#02231c', cls: 'bg-[#02231c]', role: 'Logo "dark" fill', textOn: 'light' },
];

const neutrals: Swatch[] = [
  { name: 'gray-900', hex: '#111827', cls: 'bg-gray-900', role: 'Ink — primary text', textOn: 'light' },
  { name: 'gray-700', hex: '#374151', cls: 'bg-gray-700', role: 'Secondary text', textOn: 'light' },
  { name: 'gray-500', hex: '#6b7280', cls: 'bg-gray-500', role: 'Muted — nav, meta', textOn: 'light' },
  { name: 'gray-200', hex: '#e5e7eb', cls: 'bg-gray-200', role: 'Hairline ring on white', textOn: 'dark' },
  { name: 'gray-100', hex: '#f3f4f6', cls: 'bg-gray-100', role: 'Pill nav (white theme)', textOn: 'dark' },
  { name: 'white', hex: '#ffffff', cls: 'bg-white', role: 'Page background (white theme)', textOn: 'dark' },
];

function Section({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="px-6 sm:px-8 lg:px-12 py-14 border-t border-black/5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        <div className="lg:col-span-1">
          <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 sticky top-[92px]">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          {intro && (
            <p className="mt-3 max-w-sm text-[13.5px] text-gray-600 leading-relaxed">{intro}</p>
          )}
        </div>
        <div className="lg:col-span-2">{children}</div>
      </div>
    </section>
  );
}

function TokenChip({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-gray-200 px-2.5 py-1 text-[11px] text-gray-700 hover:bg-gray-50 transition"
      title="Click to copy"
    >
      <span className="text-gray-400">{label}</span>
      <span className="font-mono">{value}</span>
      <i className={copied ? 'ri-check-line text-[#f75124]' : 'ri-file-copy-line text-gray-400'} />
    </button>
  );
}

function SwatchCard({ s }: { s: Swatch }) {
  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white">
      <div className={`${s.cls} h-24 w-full`} />
      <div className="p-3">
        <p className="text-[13px] font-semibold text-gray-900">{s.name}</p>
        <p className="mt-0.5 text-[11.5px] text-gray-500 leading-snug">{s.role}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <TokenChip label="hex" value={s.hex} />
          <TokenChip label="tw" value={s.cls} />
        </div>
      </div>
    </div>
  );
}

export default function DesignSystem() {
  return (
    <Shell>
      {/* Hero */}
      <section className="px-6 sm:px-8 lg:px-12 pt-16 pb-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Design System</p>
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
          The system<span className="text-[#f75124]">.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[16px] text-gray-600 leading-relaxed">
          A working catalog of the visual language behind this site — colors, type, motion, and the
          handful of patterns that hold it all together. Tokens are click-to-copy. Everything you see
          here is the same code the rest of the portfolio uses.
        </p>
      </section>

      {/* Brand */}
      <Section
        eyebrow="01 — Brand"
        title="Mark & lockups"
        intro="The mark is a stylized H inside a ring, with a small smile beneath. Animated on first load, static everywhere else."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]">
            <GHLogoMark variant="dark" autoplay={false} className="h-20 w-auto" />
            <p className="text-[11px] text-gray-500">Mark — dark</p>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-[#02231c] p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]">
            <GHLogoMark variant="light" autoplay={false} className="h-20 w-auto" />
            <p className="text-[11px] text-gray-400">Mark — light, on ink</p>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-[#faf8ef] p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]">
            <GHLogoFull variant="dark" autoplay={false} className="h-12 w-auto" />
            <p className="text-[11px] text-gray-500">Full lockup — cream</p>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]">
            <img src="/assets/brand/gh-lockup.png" alt="GH lockup" className="max-h-20 w-auto" />
            <p className="text-[11px] text-gray-500">Promotional lockup</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Do</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-gray-600 leading-relaxed list-disc pl-5">
              <li>Keep clear space ≥ the height of the H crossbar around the mark</li>
              <li>Use the dark variant on cream / light backgrounds</li>
              <li>Use the light variant on ink (`#02231c`) only</li>
              <li>Minimum size: 24px tall for the mark, 32px for the full lockup</li>
            </ul>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Don't</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-gray-600 leading-relaxed list-disc pl-5">
              <li>Recolor the green ring outside the brand palette</li>
              <li>Stretch, skew, or rotate the mark</li>
              <li>Place on busy photography without a solid backdrop</li>
              <li>Mix dark and light variants in the same composition</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Color */}
      <Section
        eyebrow="02 — Color"
        title="Palette"
        intro="Six brand colors, six neutrals. The cream is the personality; orange is the signal."
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-3">Brand</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {corePalette.map((s) => (
            <SwatchCard key={s.name} s={s} />
          ))}
        </div>

        <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-3">Neutrals</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {neutrals.map((s) => (
            <SwatchCard key={s.name} s={s} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl ring-1 ring-black/5 bg-white p-5">
          <p className="text-[12px] font-semibold text-gray-900">Theme mapping</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-[12.5px]">
            <p className="text-gray-400">Surface</p>
            <p className="text-gray-400">Cream theme</p>
            <p className="text-gray-400">White theme</p>
            <p className="text-gray-700">Page</p>
            <p className="font-mono text-gray-900">#faf8ef</p>
            <p className="font-mono text-gray-900">#ffffff</p>
            <p className="text-gray-700">Pill nav</p>
            <p className="font-mono text-gray-900">#f3efe2/85 + blur</p>
            <p className="font-mono text-gray-900">gray-100/85 + blur</p>
            <p className="text-gray-700">Hairline</p>
            <p className="font-mono text-gray-900">black/[0.06]</p>
            <p className="font-mono text-gray-900">gray-200</p>
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section
        eyebrow="03 — Typography"
        title="Jost, top to bottom"
        intro="One family doing all the work. Weights 100–900 are loaded; the scale below covers what's actually used."
      >
        <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Display · 72 / 56 / 48</p>
            <p className="mt-2 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
              George<span className="text-gray-300">.</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">H1 · 36</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">A working catalog of the visual language</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">H2 · 30</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">Mark & lockups</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">H3 · 20</p>
            <p className="mt-2 text-xl font-semibold tracking-tight">Theme mapping</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Body · 15 / 16 · leading 1.8</p>
            <p className="mt-2 text-[15px] text-gray-700 leading-[1.8] max-w-2xl">
              The cream is the personality; orange is the signal. The two purples reach for different
              contexts — one for general accent, one reserved for Twitch.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Small · 13 · meta</p>
            <p className="mt-2 text-[13px] text-gray-600">Used for muted labels, captions, footnotes.</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Micro · 11 · uppercase tracked</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-gray-400">SECTION EYEBROW</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Mono · technical labels</p>
            <p className="mt-2 font-mono text-[13px] text-gray-700">bg-[#faf8ef] · rounded-full</p>
          </div>
        </div>
      </Section>

      {/* Space & layout */}
      <Section
        eyebrow="04 — Space"
        title="Layout & radii"
        intro="The shell maxes at 1380. Pill radius is the signature — it shows up on nav, buttons, and badges."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Shell</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <TokenChip label="max-w" value="max-w-[1380px]" />
              <TokenChip label="gutter" value="px-4 sm:px-6 lg:px-8" />
            </div>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Hairlines</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <TokenChip label="cream" value="ring-black/[0.06]" />
              <TokenChip label="white" value="ring-gray-200" />
            </div>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Radii</p>
            <div className="mt-4 flex items-end gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-[#f3efe2]" />
                <p className="text-[10.5px] font-mono text-gray-500">rounded-2xl</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-3xl bg-[#f3efe2]" />
                <p className="text-[10.5px] font-mono text-gray-500">rounded-3xl</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-24 rounded-full bg-[#f3efe2]" />
                <p className="text-[10.5px] font-mono text-gray-500">rounded-full</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Shadow</p>
            <div className="mt-4 flex items-end gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm" />
              <div className="h-14 w-14 rounded-2xl bg-white shadow-md" />
              <div className="h-14 w-14 rounded-2xl bg-white shadow-lg" />
            </div>
            <p className="mt-2 text-[11.5px] text-gray-500">Used sparingly — hairlines do most of the lifting.</p>
          </div>
        </div>
      </Section>

      {/* Motion */}
      <Section
        eyebrow="05 — Motion"
        title="Animations"
        intro="GSAP for brand moments. Tailwind keyframes for ambient decoration. Always respects prefers-reduced-motion."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5 overflow-hidden">
            <p className="text-[12px] font-semibold text-gray-900">Float — slow / medium / fast</p>
            <div className="relative mt-4 h-24">
              <div className="absolute left-4 top-2 h-12 w-12 rounded-full bg-[#f75124]/30 animate-float-slow" />
              <div className="absolute left-20 top-4 h-10 w-10 rounded-full bg-[#8067f0]/30 animate-float-medium" />
              <div className="absolute left-36 top-0 h-8 w-8 rounded-full bg-[#00e281]/30 animate-float-fast" />
            </div>
            <p className="mt-2 text-[11.5px] text-gray-500">For ambient background shapes — never on content.</p>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Pulse — subtle</p>
            <div className="mt-4 flex items-center justify-center h-24">
              <div className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/5 animate-pulse-subtle" />
            </div>
            <p className="mt-2 text-[11.5px] text-gray-500">Light shadow pulse — use on CTAs, sparingly.</p>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5 sm:col-span-2 overflow-hidden">
            <p className="text-[12px] font-semibold text-gray-900">Scroll — marquee</p>
            <div className="mt-4 overflow-hidden">
              <div className="flex gap-8 whitespace-nowrap animate-scroll w-max">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="text-[15px] text-gray-700">
                    DESIGN · CODE · STREAM · WRITE · BUILD · SHIP · LEARN · REPEAT
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-2 text-[11.5px] text-gray-500">Used for value strips and brand affirmations.</p>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Logo intro — GSAP</p>
            <div className="mt-4 flex items-center justify-center h-24">
              <GHLogoMark variant="dark" className="h-20 w-auto" />
            </div>
            <p className="mt-2 text-[11.5px] text-gray-500">Plays once on mount. Skipped under reduced-motion.</p>
          </div>
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Page reveal</p>
            <p className="mt-3 text-[13px] text-gray-600 leading-relaxed">
              The <span className="font-mono text-[12px]">Reveal</span> component fades + translates
              content in on scroll. Use <span className="font-mono text-[12px]">origin="bottom"</span>{' '}
              for most cases, <span className="font-mono text-[12px]">origin="left"</span> for hero
              imagery.
            </p>
          </div>
        </div>
      </Section>

      {/* Primitives */}
      <Section
        eyebrow="06 — Primitives"
        title="The building blocks"
        intro="Buttons, badges, cards, links. These compose every page."
      >
        <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6 space-y-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-3">Buttons</p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[12px] text-gray-700 hover:bg-gray-50">
                Resume <i className="ri-arrow-right-up-line" />
              </button>
              <button className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#f75124] text-white text-[13px] hover:opacity-90">
                Primary <i className="ri-arrow-right-line" />
              </button>
              <button className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gray-900 text-white text-[13px] hover:bg-gray-800">
                Ink CTA
              </button>
              <button
                aria-label="Toggle"
                className="w-8 h-8 rounded-full bg-white ring-1 ring-gray-200 inline-flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <i className="ri-sun-line" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-3">Badges</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f3efe2] text-[11px] text-gray-700">
                Available
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f75124]/10 text-[11px] text-[#f75124]">
                New
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#8067f0]/10 text-[11px] text-[#8067f0]">
                Concept
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full ring-1 ring-gray-200 text-[11px] text-gray-600">
                Archive
              </span>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-3">Card</p>
            <div className="rounded-2xl ring-1 ring-black/5 bg-white/50 p-5 max-w-md">
              <i className="ri-pen-nib-line text-2xl text-gray-700" />
              <p className="mt-3 text-[16px] font-semibold text-gray-900">A card surface</p>
              <p className="mt-1.5 text-[13px] text-gray-600 leading-relaxed">
                Cream-friendly card. Hairline ring, faint white fill, room to breathe.
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-3">Link</p>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              An <a className="text-gray-900 underline underline-offset-[6px] decoration-1 hover:text-[#f75124]">underlined link</a>{' '}
              uses a 6px offset and a 1px decoration. Hover shifts to{' '}
              <span className="text-[#f75124]">signal-orange</span>.
            </p>
          </div>
        </div>
      </Section>

      {/* Patterns */}
      <Section
        eyebrow="07 — Patterns"
        title="Recurring compositions"
        intro="A handful of patterns the rest of the site is built from."
      >
        <div className="space-y-4">
          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Sticky pill nav</p>
            <div className="mt-4 rounded-xl bg-[#faf8ef] p-4">
              <div className="mx-auto flex items-center justify-between gap-3 rounded-full pl-4 pr-2 py-2 ring-1 ring-black/[0.06] bg-[#f3efe2]/85 backdrop-blur-md max-w-2xl">
                <GHLogoMark variant="dark" autoplay={false} className="h-6 w-auto" />
                <div className="flex items-center gap-4 text-[12px] text-gray-500">
                  <span className="text-gray-900 underline underline-offset-[6px] decoration-1">Work</span>
                  <span>About</span>
                  <span>Library</span>
                  <span>Contact</span>
                </div>
                <button className="px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[11px] text-gray-700">
                  Resume
                </button>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-gray-500">
              Flush at top of page; morphs to ring + tinted pill on scroll. Lives in{' '}
              <span className="font-mono">Shell.tsx</span>.
            </p>
          </div>

          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Eyebrow + display heading</p>
            <div className="mt-4 rounded-xl bg-[#faf8ef] p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Section</p>
              <h3 className="mt-3 text-4xl font-bold tracking-tight leading-[0.95]">
                The pattern<span className="text-[#f75124]">.</span>
              </h3>
              <p className="mt-3 max-w-md text-[14px] text-gray-600">
                Eyebrow micro-label, then a tight display heading, with a colored period as the
                signature flourish.
              </p>
            </div>
          </div>

          <div className="rounded-2xl ring-1 ring-black/5 bg-white p-5">
            <p className="text-[12px] font-semibold text-gray-900">Cream ↔ white theme toggle</p>
            <p className="mt-3 text-[13px] text-gray-600 leading-relaxed">
              The sun/moon button in the nav swaps the page background and pill tint. Try it now — the
              toggle is live above. Theme state is component-local; no persistence yet.
            </p>
          </div>
        </div>
      </Section>

      {/* Voice */}
      <Section
        eyebrow="08 — Voice"
        title="How it reads"
        intro="The system has a voice. Quiet, considered, occasionally dry."
      >
        <ul className="space-y-3 text-[14.5px] text-gray-700 leading-relaxed">
          <li>
            <span className="text-gray-900 font-semibold">Plain over clever.</span> Say what the thing
            is. Don't dress it up.
          </li>
          <li>
            <span className="text-gray-900 font-semibold">Short over long.</span> If a sentence can
            lose three words and still hit, lose them.
          </li>
          <li>
            <span className="text-gray-900 font-semibold">First person, low ceremony.</span> "I built
            this" — not "We are excited to announce."
          </li>
          <li>
            <span className="text-gray-900 font-semibold">Specifics over adjectives.</span> "Cut load
            time from 4.2s to 800ms" beats "Drastically improved performance."
          </li>
          <li>
            <span className="text-gray-900 font-semibold">A period is a flourish.</span> The orange
            period (<span className="text-[#f75124]">.</span>) closes hero headings. Use sparingly.
          </li>
          <li>
            <span className="text-gray-900 font-semibold">Never ALL CAPS for emphasis.</span> Use
            tracked uppercase micro-labels for category, not for shouting.
          </li>
        </ul>
      </Section>

      {/* Footer note */}
      <section className="px-6 sm:px-8 lg:px-12 py-12 border-t border-black/5 text-center">
        <p className="text-[12px] text-gray-500">
          Built with the same tokens as the rest of the site. Last updated 2026-06-26.
        </p>
      </section>
    </Shell>
  );
}
