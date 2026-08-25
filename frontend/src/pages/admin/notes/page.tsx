import { useMemo, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  Table,
  Td,
  Th,
  Tr,
} from "../../../components/admin/ui";
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
  const [page, setPage] = useState(1);
  const limit = 20;

  const notes = useMemo(
    () => [...content.notes].sort((a, b) => b.date.localeCompare(a.date)),
    [content.notes]
  );

  const totalPages = Math.ceil(notes.length / limit);
  const paginatedNotes = notes.slice((page - 1) * limit, page * limit);

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
      <div className="max-w-[1100px] mx-auto">
        <PageHeader
          eyebrow="Content"
          title="Notes"
          description={`${notes.length} notes, published and draft`}
          actions={
            <Button variant="primary" icon="ri-add-line" onClick={openNew}>
              New note
            </Button>
          }
        />

        {notes.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-black/5 bg-white">
            <EmptyState
              icon="ri-sticky-note-line"
              title="No notes yet"
              description="Notes are short-form writing, separate from blog posts."
              action={
                <Button variant="primary" icon="ri-add-line" onClick={openNew}>
                  New note
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {paginatedNotes.map((note) => (
                <div key={note.id} className="rounded-2xl ring-1 ring-black/5 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-gray-900 truncate">{note.title}</p>
                      <p className="text-[12px] text-gray-400 font-mono truncate">/{note.slug}</p>
                    </div>
                    <StatusBadge status={note.published ? "published" : "draft"} />
                  </div>
                  <p className="text-[12px] text-gray-500">
                    {note.category || "General"} · <span className="tabular-nums">{note.date}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" icon="ri-edit-line" onClick={() => openEdit(note)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" icon="ri-delete-bin-line" onClick={() => handleDelete(note.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block rounded-2xl ring-1 ring-black/5 bg-white overflow-hidden">
              <Table
                head={
                  <>
                    <Th>Title</Th>
                    <Th>Category</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </>
                }
              >
                {paginatedNotes.map((note) => (
                  <Tr key={note.id}>
                    <Td>
                      <p className="font-medium text-gray-900">{note.title}</p>
                      <p className="text-[12px] text-gray-400 font-mono">/{note.slug}</p>
                    </Td>
                    <Td className="text-gray-500">{note.category || "General"}</Td>
                    <Td className="text-gray-500 tabular-nums">{note.date}</Td>
                    <Td>
                      <StatusBadge status={note.published ? "published" : "draft"} />
                    </Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button size="sm" icon="ri-edit-line" onClick={() => openEdit(note)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon="ri-delete-bin-line"
                          onClick={() => handleDelete(note.id)}
                          aria-label={`Delete ${note.title}`}
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Table>
            </div>

            <div className="mt-5">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </>
        )}

        {editing && (
          <Modal
            title={content.notes.some((n) => n.id === editing.id) ? "Edit note" : "New note"}
            onClose={() => setEditing(null)}
            footer={
              <>
                <Button onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="primary" loading={isSaving} onClick={() => void handleSave()}>
                  {isSaving ? "Saving\u2026" : "Save note"}
                </Button>
              </>
            }
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Title"
                value={editing.title}
                onChange={(value) => setEditing({ ...editing, title: value })}
                required
              />
              <Field
                label="Slug"
                value={editing.slug}
                onChange={(value) => setEditing({ ...editing, slug: value })}
                hint="Used in the URL: /notes/<slug>"
                required
              />
              <Field
                label="Date"
                type="date"
                value={editing.date}
                onChange={(value) => setEditing({ ...editing, date: value })}
              />
              <Field
                label="Category"
                value={editing.category ?? ""}
                onChange={(value) => setEditing({ ...editing, category: value })}
                placeholder="General"
              />
            </div>

            <Field
              label="Content"
              as="textarea"
              rows={12}
              value={editing.content}
              onChange={(value) => setEditing({ ...editing, content: value })}
              hint="Markdown"
            />

            <label className="flex items-center gap-2.5 text-[13px] text-gray-700">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="w-4 h-4 rounded accent-signal"
              />
              Published
              <Badge tone={editing.published ? "success" : "warning"}>
                {editing.published ? "live" : "draft"}
              </Badge>
            </label>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
