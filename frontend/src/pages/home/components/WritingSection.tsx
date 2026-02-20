
import { Link } from 'react-router-dom';
import { useContent } from '../../../public/contexts/PublicContentContext';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function WritingSection() {
  const { content } = useContent();
  const posts = (content.blogPosts ?? [])
    .filter((p) => p.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <i className="ri-article-line text-gray-400 text-lg"></i>
          <div>
            <p className="text-sm font-medium text-[#f75124]">Writing</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Recent posts</h2>
          </div>
        </div>

        {/* Post list */}
        <div className="mb-4">
          {posts.map((post) => {
            const isExternal = !!post.externalUrl;
            const href = isExternal ? post.externalUrl! : `/blog/${post.slug}`;

            const inner = (
              <div className="flex items-baseline justify-between gap-4 py-3 border-b border-gray-100 group">
                <span className="text-gray-800 text-sm sm:text-base group-hover:text-gray-500 transition-colors leading-snug">
                  {post.title}
                  {isExternal && (
                    <i className="ri-external-link-line text-gray-300 ml-1.5 text-xs"></i>
                  )}
                </span>
                <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                  {formatDate(post.date)}
                </span>
              </div>
            );

            return isExternal ? (
              <a key={post.id} href={href} target="_blank" rel="noopener noreferrer" className="block">
                {inner}
              </a>
            ) : (
              <Link key={post.id} to={href} className="block">
                {inner}
              </Link>
            );
          })}
        </div>

        {/* See all link */}
        <div className="flex justify-end mb-8">
          <Link
            to="/blog"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
          >
            See all posts <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        {/* Pill links */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
          >
            <i className="ri-sticky-note-line text-sm"></i>
            Lesson notes
          </Link>
          <Link
            to="/streams"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
          >
            <i className="ri-live-line text-sm"></i>
            Stream schedule
          </Link>
        </div>
      </div>
    </section>
  );
}
