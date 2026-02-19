
import { useContent } from '../../contexts/ContentContext';
import { Link } from 'react-router-dom';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import FloatingShapes from '../../components/FloatingShapes';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NotesPage() {
  const { content } = useContent();
  const notes = (content.notes ?? [])
    .filter((n) => n.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Group by category
  const categories = Array.from(new Set(notes.map((n) => n.category ?? 'General')));

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <Header />

      <main className="relative z-10 pt-20">
        <section className="py-14 px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-medium text-[#f75124] mb-2">Learning</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Lesson notes</h1>
            <p className="text-base text-gray-500 mb-10">
              Personal notes from things I've been learning — databases, frameworks, tools, and more.
            </p>

            {notes.length === 0 ? (
              <p className="text-gray-400 text-sm">No notes published yet.</p>
            ) : (
              <div className="space-y-10">
                {categories.map((cat) => {
                  const catNotes = notes.filter((n) => (n.category ?? 'General') === cat);
                  return (
                    <div key={cat}>
                      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{cat}</h2>
                      <div>
                        {catNotes.map((note) => (
                          <Link
                            key={note.id}
                            to={`/notes/${note.slug}`}
                            className="block"
                          >
                            <div className="flex items-baseline justify-between gap-6 py-3 border-b border-gray-100 group">
                              <span className="text-gray-800 font-medium group-hover:text-gray-500 transition-colors text-sm sm:text-base">
                                {note.title}
                              </span>
                              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                {formatDate(note.date)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
