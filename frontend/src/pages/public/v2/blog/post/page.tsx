import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useContent } from '@/public/contexts/PublicContentContext';
import Reveal from '@/components/Reveal';
import Shell from '@/pages/public/experiment/Shell';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function renderArticle(raw: string) {
  const blocks = raw.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="mt-12 mb-4 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="mt-8 mb-3 text-xl md:text-2xl font-semibold text-gray-900">
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
    }
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote
          key={i}
          className="my-8 pl-5 border-l-2 border-gray-900/30 italic text-[17px] text-gray-700"
        >
          {trimmed.replace(/^>\s+/, '')}
        </blockquote>
      );
    }
    if (trimmed.startsWith('```')) {
      const inner = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
      return (
        <pre
          key={i}
          className="my-6 rounded-2xl bg-gray-900 text-gray-100 text-[13px] leading-[1.65] p-5 overflow-x-auto"
        >
          <code>{inner}</code>
        </pre>
      );
    }
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
      return (
        <ul key={i} className="my-5 space-y-2 list-disc list-outside pl-6 text-[16px] leading-[1.8] text-gray-700">
          {items.map((it, j) => (
            <li key={j}>{it.replace(/^-\s+/, '')}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="my-5 text-[16px] md:text-[17px] leading-[1.85] text-gray-700">
        {trimmed}
      </p>
    );
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const post = (content.blogPosts ?? []).find((p) => p.slug === slug && p.published);

  useEffect(() => {
    if (post?.externalUrl && !post.content) {
      window.location.href = post.externalUrl;
    }
  }, [post]);

  const readingTime = useMemo(
    () => (post ? estimateReadingTime(post.content ?? post.excerpt ?? '') : 0),
    [post]
  );

  if (!post) {
    return (
      <Shell>
        <section className="px-8 lg:px-12 py-32 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">404</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Post not found</h1>
          <Link
            to="/experiment/library#writing"
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-gray-700 underline underline-offset-4 hover:text-gray-900"
          >
            <i className="ri-arrow-left-line" /> Back to writing
          </Link>
        </section>
      </Shell>
    );
  }

  const body = post.content ?? post.excerpt ?? '';

  return (
    <Shell>
      <article>
        {/* Header */}
        <section className="px-8 lg:px-12 pt-12 pb-10">
          <Link
            to="/experiment/library#writing"
            className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-900 transition"
          >
            <i className="ri-arrow-left-line" /> Writing
          </Link>

          <Reveal origin="bottom" delay={80}>
            <p className="mt-10 text-[11px] uppercase tracking-[0.18em] text-gray-400">Essay</p>
          </Reveal>
          <Reveal origin="bottom" delay={140}>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-gray-900 max-w-4xl">
              {post.title}
            </h1>
          </Reveal>
          <Reveal origin="bottom" delay={200}>
            <p className="mt-5 max-w-2xl text-[16px] md:text-[18px] leading-[1.7] text-gray-600">
              {post.excerpt}
            </p>
          </Reveal>

          <Reveal origin="bottom" delay={260}>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-calendar-line" />
                {formatDate(post.date)}
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-time-line" />
                {readingTime} min read
              </span>
              {post.tags?.length > 0 && (
                <>
                  <span className="text-gray-300">·</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full bg-white ring-1 ring-gray-200 text-[11px] text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </section>

        {/* Body */}
        <section className="px-8 lg:px-12 pb-20 border-t border-black/5">
          <Reveal origin="bottom" delay={120}>
            <div className="mt-10 max-w-[680px]">
              {renderArticle(body)}
            </div>
          </Reveal>

          {post.externalUrl && (
            <div className="mt-12 max-w-[680px]">
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white ring-1 ring-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 transition"
              >
                <i className="ri-external-link-line" /> Read original
              </a>
            </div>
          )}
        </section>

        {/* Bottom nav */}
        <section className="px-8 lg:px-12 py-12 border-t border-black/5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              to="/experiment/library#writing"
              className="inline-flex items-center gap-1.5 text-[13px] text-gray-700 hover:text-gray-900 transition"
            >
              <i className="ri-arrow-left-line" /> All writing
            </Link>
            <Link
              to="/experiment#contact"
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
