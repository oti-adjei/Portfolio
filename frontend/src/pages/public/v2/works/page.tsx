import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import Reveal from '@/components/Reveal';
import Shell from '../Shell';

export default function ExperimentWorks() {
  const { content } = useContent();
  const projects = content.projects ?? [];
  const [filter, setFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [projects]);

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <Shell current="works">
      {/* Intro */}
      <section className="px-8 lg:px-12 pt-16 pb-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Selected Work · {projects.length} projects</p>
        <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
          Things I've shipped<span className="text-gray-300">.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] text-gray-600 leading-relaxed">
          A mix of product, brand, and engineering work — fintech apps, property tools,
          esports platforms, and the occasional brand system.
        </p>
      </section>

      {/* Filter chips */}
      <div className="sticky top-[72px] z-20 px-8 lg:px-12 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] uppercase tracking-wider transition ${
                filter === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white/60 ring-1 ring-gray-200 text-gray-600 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
          {filtered.map((p, idx) => (
            <Reveal key={String(p.id)} origin="bottom" delay={(idx % 4) * 80}>
              <Link to={`/project/${String(p.id)}`} className="group/card block">
                <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden">
                  {p.thumbnail?.url && (
                    <img
                      src={p.thumbnail.url}
                      alt={p.thumbnail.alt || p.title}
                      className="w-full h-full object-cover group-hover/card:scale-[1.02] transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="pt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900 inline-flex items-center gap-1">
                      {p.title} <i className="ri-arrow-right-up-line text-gray-400" />
                    </p>
                    <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">
                      {p.overview?.description || p.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0 pt-1">
                    <span>{p.year}</span>
                    <span className="px-2 py-1 rounded bg-gray-200/60 uppercase tracking-wider text-gray-600 text-[10px] font-medium">
                      {p.category}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">
            No projects under "{filter}" yet.
          </div>
        )}
      </section>

      <div className="px-8 lg:px-12 pb-16 flex items-center justify-between border-t border-black/5 pt-8">
        <Link to="/" className="text-[13px] text-gray-500 hover:text-gray-900">
          ← Back to home
        </Link>
        <Link to="/#contact" className="text-[13px] text-gray-900 underline underline-offset-4">
          Got a project? Let's talk →
        </Link>
      </div>
    </Shell>
  );
}
