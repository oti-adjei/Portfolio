
import { useContent } from '../../contexts/ContentContext';
import { Link } from 'react-router-dom';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import FloatingShapes from '../../components/FloatingShapes';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function BlogPage() {
  const { content } = useContent();
  const posts = (content.blogPosts ?? [])
    .filter((p) => p.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <Header />

      <main className="relative z-10 pt-20">
        <section className="py-14 px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-medium text-[#f75124] mb-2">Writing</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">Blog</h1>

            <div>
              {posts.map((post) => {
                const isExternal = !!post.externalUrl;
                const href = isExternal ? post.externalUrl! : `/blog/${post.slug}`;

                const inner = (
                  <div className="flex items-baseline justify-between gap-6 py-4 border-b border-gray-100 group">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium group-hover:text-gray-500 transition-colors leading-snug">
                        {post.title}
                        {isExternal && (
                          <i className="ri-external-link-line text-gray-300 ml-1.5 text-xs"></i>
                        )}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
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

              {posts.length === 0 && (
                <p className="text-gray-400 text-sm py-8">No posts published yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
