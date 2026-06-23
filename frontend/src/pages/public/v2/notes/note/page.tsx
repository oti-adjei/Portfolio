import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useContent } from '@/public/contexts/PublicContentContext';
import Reveal from '@/components/Reveal';
import Shell from '@/pages/public/v2/Shell';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

interface Section {
  heading?: string;
  blocks: string[];
}

function parseNote(raw: string): Section[] {
  const lines = raw.split('\n');
  const sections: Section[] = [];
  let current: Section = { blocks: [] };
  let buffer: string[] = [];

  const flushBuffer = () => {
    const joined = buffer.join('\n').trim();
    if (joined) current.blocks.push(joined);
    buffer = [];
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushBuffer();
      if (current.heading || current.blocks.length) sections.push(current);
      current = { heading: line.replace(/^##\s+/, ''), blocks: [] };
    } else if (line.trim() === '') {
      flushBuffer();
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();
  if (current.heading || current.blocks.length) sections.push(current);
  return sections;
}

function renderBlock(block: string, key: number) {
  const trimmed = block.trim();
  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    return (
      <pre
        key={key}
        className="my-4 rounded-xl bg-gray-900 text-gray-100 text-[13px] leading-[1.65] p-4 overflow-x-auto"
      >
        <code>{trimmed.slice(1, -1)}</code>
      </pre>
    );
  }
  if (trimmed.startsWith('- ')) {
    const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
    return (
      <ul key={key} className="my-3 space-y-1.5 list-disc list-outside pl-6 text-[15px] leading-[1.7] text-gray-700">
        {items.map((it, j) => (
          <li key={j}>{it.replace(/^-\s+/, '')}</li>
        ))}
      </ul>
    );
  }
  return (
    <p key={key} className="my-3 text-[15px] md:text-[16px] leading-[1.8] text-gray-700">
      {trimmed}
    </p>
  );
}

export default function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const note = (content.notes ?? []).find((n) => n.slug === slug && n.published);

  const sections = useMemo(() => (note ? parseNote(note.content ?? '') : []), [note]);
  const readingTime = useMemo(
    () => (note ? estimateReadingTime(note.content ?? '') : 0),
    [note]
  );

  if (!note) {
    return (
      <Shell>
        <section className="px-8 lg:px-12 py-32 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">404</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Note not found</h1>
          <Link
            to="/library#notes"
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-gray-700 underline underline-offset-4 hover:text-gray-900"
          >
            <i className="ri-arrow-left-line" /> Back to notes
          </Link>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <article>
        {/* Header */}
        <section className="px-8 lg:px-12 pt-12 pb-10">
          <Link
            to="/library#notes"
            className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-900 transition"
          >
            <i className="ri-arrow-left-line" /> Lesson notes
          </Link>

          <Reveal origin="bottom" delay={80}>
            <div className="mt-10 flex items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Note</p>
              {note.category && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 ring-1 ring-amber-200 text-[11px] text-amber-800 uppercase tracking-[0.1em]">
                    {note.category}
                  </span>
                </>
              )}
            </div>
          </Reveal>
          <Reveal origin="bottom" delay={140}>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-gray-900 max-w-4xl">
              {note.title}
            </h1>
          </Reveal>

          <Reveal origin="bottom" delay={220}>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-calendar-line" />
                {formatDate(note.date)}
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-time-line" />
                {readingTime} min read
              </span>
            </div>
          </Reveal>
        </section>

        {/* Body — sectioned with TOC-style left rail on wide screens */}
        <section className="px-8 lg:px-12 pb-20 border-t border-black/5">
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* TOC */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-3">On this page</p>
                <ul className="space-y-2 text-[13px] text-gray-600">
                  {sections.filter((s) => s.heading).map((s, i) => (
                    <li key={i}>
                      <a
                        href={`#h-${i}`}
                        className="hover:text-gray-900 transition"
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="lg:col-span-9 max-w-[680px]">
              <Reveal origin="bottom" delay={120}>
                <div>
                  {sections.map((s, i) => (
                    <div key={i} className="mb-10">
                      {s.heading && (
                        <h2
                          id={`h-${i}`}
                          className="mt-8 mb-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 scroll-mt-24"
                        >
                          {s.heading}
                        </h2>
                      )}
                      {s.blocks.map((b, j) => renderBlock(b, j))}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Bottom nav */}
        <section className="px-8 lg:px-12 py-12 border-t border-black/5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              to="/library#notes"
              className="inline-flex items-center gap-1.5 text-[13px] text-gray-700 hover:text-gray-900 transition"
            >
              <i className="ri-arrow-left-line" /> All notes
            </Link>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-[13px] hover:bg-gray-800 transition"
            >
              Get in touch <i className="ri-arrow-right-up-line" />
            </Link>
          </div>
        </section>
      </article>
    </Shell>
  );
}
