
import { useParams, Link } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import FloatingShapes from '@/components/FloatingShapes';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const note = (content.notes ?? []).find((n) => n.slug === slug && n.published);

  if (!note) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Note not found</h1>
          <Link to="/notes" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Back to notes
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
              to="/notes"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
            >
              <i className="ri-arrow-left-line"></i> Lesson notes
            </Link>

            {/* Header */}
            <div className="mb-10">
              {note.category && (
                <p className="text-xs font-semibold text-[#f75124] uppercase tracking-wider mb-2">{note.category}</p>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug">
                {note.title}
              </h1>
              <span className="text-sm text-gray-400">{formatDate(note.date)}</span>
            </div>

            {/* Content — render line by line; lines starting with ## become headings */}
            <div className="space-y-3 text-gray-700 leading-relaxed">
              {note.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={i} className="text-base font-bold text-gray-900 pt-4 first:pt-0">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('`') && line.endsWith('`')) {
                  return (
                    <code key={i} className="block bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-800">
                      {line.slice(1, -1)}
                    </code>
                  );
                }
                if (line.trim() === '') {
                  return <div key={i} className="h-1" />;
                }
                return (
                  <p key={i} className="text-sm sm:text-base">{line}</p>
                );
              })}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
