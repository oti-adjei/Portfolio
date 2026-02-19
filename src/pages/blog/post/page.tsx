
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useContent } from '../../../contexts/ContentContext';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import FloatingShapes from '../../../components/FloatingShapes';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const post = (content.blogPosts ?? []).find((p) => p.slug === slug && p.published);

  // If the post is external-only, redirect to the external URL
  useEffect(() => {
    if (post?.externalUrl && !post.content) {
      window.location.href = post.externalUrl;
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Post not found</h1>
          <Link to="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <Header />

      <main className="relative z-10 pt-20">
        <article className="py-14 px-4 sm:px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
            >
              <i className="ri-arrow-left-line"></i> Blog
            </Link>

            {/* Header */}
            <div className="mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">{formatDate(post.date)}</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
              {(post.content ?? post.excerpt).split('\n').map((para, i) =>
                para.trim() ? (
                  <p key={i} className="text-base">{para}</p>
                ) : (
                  <br key={i} />
                ),
              )}
            </div>

            {post.externalUrl && (
              <div className="mt-10 pt-6 border-t border-gray-100">
                <a
                  href={post.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <i className="ri-external-link-line"></i>
                  Read original post
                </a>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
