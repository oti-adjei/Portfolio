import { useMemo, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
import type { Note } from "../../../types/siteContent";

function createEmptyNote(): Note {
  return {
    id: crypto.randomUUID(),
    title: "",
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    content: "",
    category: "General",
    published: false,
  };
}

export default function AdminNotes() {
  const { content, createNote, updateNote, deleteNote } = useContent();
  const [editing, setEditing] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const notes = useMemo(
    () => [...content.notes].sort((a, b) => b.date.localeCompare(a.date)),
    [content.notes]
  );

  const openNew = () => setEditing(createEmptyNote());
  const openEdit = (note: Note) => setEditing({ ...note });

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.slug.trim()) {
      alert("Title and slug are required");
      return;
    }

    setIsSaving(true);
    try {
      const exists = content.notes.some((note) => note.id === editing.id);
      if (exists) {
        await updateNote(editing);
      } else {
        await createNote(editing);
      }
      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete note");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notes Manager</h1>
            <p className="text-gray-600 mt-1">Manage learning notes and publication status</p>
          </div>
          <button onClick={openNew} className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            New Note
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{note.title}</p>
                    <p className="text-xs text-gray-500">/{note.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{note.category || "General"}</td>
                  <td className="px-4 py-3 text-gray-600">{note.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${note.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {note.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(note)} className="text-teal-600 hover:text-teal-700">Edit</button>
                    <button onClick={() => handleDelete(note.id)} className="text-red-600 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-3xl rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{content.notes.some((n) => n.id === editing.id) ? "Edit Note" : "New Note"}</h2>
                <button onClick={() => setEditing(null)} className="text-gray-500">Close</button>
              </div>

              <input className="w-full border rounded-lg px-3 py-2" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Category" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              <textarea className="w-full border rounded-lg px-3 py-2" rows={10} placeholder="Markdown content" value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published
              </label>

              <div className="flex justify-end gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-teal-600 text-white rounded-lg">
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
