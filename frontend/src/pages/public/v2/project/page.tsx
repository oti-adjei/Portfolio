import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import Reveal from '@/components/Reveal';
import Shell from '../Shell';

export default function ExperimentProject() {
  const { id } = useParams<{ id: string }>();
  const { content } = useContent();
  const projects = content.projects ?? [];

  const project = useMemo(
    () => projects.find((p) => String(p.id) === id),
    [projects, id],
  );

  const idx = projects.findIndex((p) => String(p.id) === id);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

  if (!project) {
    return (
      <Shell>
        <div className="px-8 lg:px-12 py-32 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-widest">404</p>
          <h1 className="mt-3 text-4xl font-bold">Project not found</h1>
          <Link
            to="/works"
            className="mt-6 inline-block text-[13px] text-gray-700 underline underline-offset-4"
          >
            ← Back to all work
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Breadcrumb */}
      <div className="px-8 lg:px-12 pt-10 flex items-center gap-2 text-[12px] text-gray-500">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link to="/works" className="hover:text-gray-900">Work</Link>
        <span>/</span>
        <span className="text-gray-700">{project.title}</span>
      </div>

      {/* Title block */}
      <section className="px-8 lg:px-12 pt-8 pb-12">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gray-500">
          <span>{project.year}</span>
          <span className="opacity-30">•</span>
          <span>{project.category}</span>
        </div>
        <Reveal origin="bottom">
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
            {project.title}<span className="text-gray-300">.</span>
          </h1>
        </Reveal>
        <p className="mt-6 max-w-2xl text-[16px] text-gray-700 leading-relaxed">
          {project.overview?.description}
        </p>

        {/* Meta strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Client', value: project.overview?.client },
            { label: 'Role', value: project.overview?.role },
            { label: 'Duration', value: project.overview?.duration },
            { label: 'Year', value: project.year },
          ].map((m) => (
            <div key={m.label}>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">{m.label}</p>
              <p className="mt-1.5 text-[14px] font-medium text-gray-900">{m.value || '—'}</p>
            </div>
          ))}
        </div>

        {/* Tags + Links */}
        {(project.tags?.length || project.links?.length) ? (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {project.tags?.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded bg-gray-200/60 uppercase tracking-wider text-gray-600 text-[10px] font-medium"
              >
                {t}
              </span>
            ))}
            {project.links?.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-1 text-[12px] text-gray-900 underline underline-offset-4 hover:text-gray-600"
              >
                {l.label} <i className="ri-arrow-right-up-line" />
              </a>
            ))}
          </div>
        ) : null}
      </section>

      {/* Hero image */}
      <Reveal origin="bottom">
        <section className="px-8 lg:px-12">
          <div className="aspect-[16/9] rounded-3xl bg-gray-100 overflow-hidden">
            {project.thumbnail?.url && (
              <img
                src={project.thumbnail.url}
                alt={project.thumbnail.alt || project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </section>
      </Reveal>

      {/* Case study */}
      <section className="px-8 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 sticky top-[80px]">
              The case study
            </p>
          </div>
          <div className="lg:col-span-2 space-y-10 text-[15px] leading-[1.75] text-gray-700">
            {project.details?.challenge && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">The challenge</h2>
                <p>{project.details.challenge}</p>
              </div>
            )}
            {project.details?.solution && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">The approach</h2>
                <p>{project.details.solution}</p>
              </div>
            )}
            {project.details?.results?.length ? (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Outcomes</h2>
                <ul className="space-y-2">
                  {project.details.results.map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <i className="ri-arrow-right-line text-gray-400 mt-1.5 text-sm" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery?.images?.length ? (
        <section className="px-8 lg:px-12 pt-8 pb-16">
          <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-6">Gallery</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {project.gallery.images.map((img, i) => (
              <Reveal key={i} origin="bottom" delay={(i % 2) * 80}>
                <figure className="rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover"
                  />
                  {img.caption && (
                    <figcaption className="px-4 py-3 text-[12px] text-gray-500 bg-white/60">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Prev / Next */}
      <section className="px-8 lg:px-12 py-12 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {prev ? (
          <Link
            to={`/project/${String(prev.id)}`}
            className="group/nav block rounded-2xl ring-1 ring-black/5 p-5 hover:bg-white/60 transition"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              <i className="ri-arrow-left-line mr-1" /> Previous
            </p>
            <p className="mt-2 text-[16px] font-semibold text-gray-900 group-hover/nav:underline">
              {prev.title}
            </p>
            <p className="text-[12px] text-gray-500">{prev.category}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            to={`/project/${String(next.id)}`}
            className="group/nav block rounded-2xl ring-1 ring-black/5 p-5 hover:bg-white/60 transition text-right"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Next <i className="ri-arrow-right-line ml-1" />
            </p>
            <p className="mt-2 text-[16px] font-semibold text-gray-900 group-hover/nav:underline">
              {next.title}
            </p>
            <p className="text-[12px] text-gray-500">{next.category}</p>
          </Link>
        ) : <div />}
      </section>

      <div className="px-8 lg:px-12 pb-16 flex justify-center">
        <Link
          to="/works"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-[13px] hover:bg-black transition"
        >
          See all work <i className="ri-arrow-right-up-line" />
        </Link>
      </div>
    </Shell>
  );
}
