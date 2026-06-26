import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import Reveal from '@/components/Reveal';
import Shell from '../Shell';
import StreamCalendar from '@/pages/public/v2/components/StreamCalendar';

type Tab = 'writing' | 'notes' | 'stream';

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: 'writing', label: 'Writing', hint: 'Posts & essays' },
  { id: 'notes', label: 'Lesson notes', hint: 'Short learnings' },
  { id: 'stream', label: 'Stream', hint: 'Weekly schedule' },
];

function isTab(value: string): value is Tab {
  return value === 'writing' || value === 'notes' || value === 'stream';
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return d;
  }
}

export default function ExperimentLibrary() {
  const { content } = useContent();
  const navigate = useNavigate();
  const location = useLocation();

  const initial = location.hash.replace('#', '');
  const [tab, setTab] = useState<Tab>(isTab(initial) ? initial : 'writing');

  useEffect(() => {
    const next = location.hash.replace('#', '');
    if (isTab(next) && next !== tab) setTab(next);
  }, [location.hash]);

  const switchTab = (id: Tab) => {
    setTab(id);
    navigate(`/library#${id}`, { replace: true });
  };

  const posts = useMemo(
    () => (content.blogPosts ?? []).filter((p) => p.published !== false),
    [content.blogPosts],
  );
  const notes = useMemo(
    () => (content.notes ?? []).filter((n) => n.published !== false),
    [content.notes],
  );

  return (
    <Shell current="library">
      <section className="px-5 sm:px-8 lg:px-12 pt-16 pb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Library</p>
        <h1 className="mt-3 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
          What I write & stream<span className="text-gray-300">.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] text-gray-600 leading-relaxed">
          Long-form posts, fast lesson notes from the trenches, and when I'll be live next.
        </p>
      </section>

      {/* Tabs */}
      <div className="sticky top-[72px] z-20 px-4 sm:px-5 sm:px-8 lg:px-12 py-3">
        <div className="inline-flex items-center gap-0.5 sm:gap-1 p-1 rounded-full bg-white/70 ring-1 ring-gray-200 max-w-full">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] whitespace-nowrap transition ${
                tab === t.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
              <span className="hidden md:inline text-[11px] ml-2 opacity-60">{t.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <section className="px-5 sm:px-8 lg:px-12 pb-16">
        {tab === 'writing' && (
          <Reveal origin="bottom">
            <ul className="divide-y divide-black/5">
              {posts.length === 0 && (
                <li className="py-12 text-center text-gray-400 text-sm">No posts yet.</li>
              )}
              {posts.map((post) => {
                const inner = (
                  <div className="flex items-baseline justify-between gap-4 py-4 group">
                    <div className="min-w-0">
                      <p className="text-[15px] text-gray-900 group-hover:text-gray-600 transition-colors">
                        {post.title}
                        {post.externalUrl && (
                          <i className="ri-external-link-line text-gray-300 ml-1.5 text-xs" />
                        )}
                      </p>
                      {post.excerpt && (
                        <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">{post.excerpt}</p>
                      )}
                    </div>
                    <span className="text-[12px] text-gray-400 whitespace-nowrap shrink-0">
                      {formatDate(post.date)}
                    </span>
                  </div>
                );
                return post.externalUrl ? (
                  <li key={post.id}>
                    <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="block">
                      {inner}
                    </a>
                  </li>
                ) : (
                  <li key={post.id}>
                    <Link to={`/blog/${post.slug}`} className="block">
                      {inner}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}

        {tab === 'notes' && (
          <Reveal origin="bottom">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-1">
              {notes.length === 0 && (
                <li className="py-12 text-center text-gray-400 text-sm md:col-span-2">No notes yet.</li>
              )}
              {notes.map((n) => (
                <li key={n.id} className="border-b border-black/5">
                  <Link to={`/notes/${n.slug}`} className="block py-4 group">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[15px] text-gray-900 group-hover:text-gray-600 transition-colors">
                        {n.title}
                      </p>
                      <span className="text-[12px] text-gray-400 whitespace-nowrap shrink-0">
                        {formatDate(n.date)}
                      </span>
                    </div>
                    {n.category && (
                      <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-gray-500">
                        {n.category}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {tab === 'stream' && (
          <Reveal origin="bottom">
            <StreamCalendar />
          </Reveal>
        )}
      </section>

      <div className="px-5 sm:px-8 lg:px-12 pb-16 flex items-center justify-between border-t border-black/5 pt-8">
        <Link to="/" className="text-[13px] text-gray-500 hover:text-gray-900">
          ← Back to home
        </Link>
        <Link to="/#contact" className="text-[13px] text-gray-900 underline underline-offset-4">
          Have a topic suggestion? →
        </Link>
      </div>
    </Shell>
  );
}
