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
import type { BlogPost } from "../../../types/siteContent";

function createEmptyPost(): BlogPost {
  return {
    id: crypto.randomUUID(),
    title: "",
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    content: "",
    externalUrl: "",
    tags: [],
    published: false,
  };
}

export default function AdminBlog() {
  const { content, createBlogPost, updateBlogPost, deleteBlogPost } = useContent();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const posts = useMemo(
    () => [...content.blogPosts].sort((a, b) => b.date.localeCompare(a.date)),
    [content.blogPosts]
  );

  const totalPages = Math.ceil(posts.length / limit);
  const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

  const openNew = () => {
    setTagInput("");
    setEditing(createEmptyPost());
  };

  const openEdit = (post: BlogPost) => {
    setTagInput("");
    setEditing({ ...post, tags: [...post.tags] });
  };

  const addTag = () => {
    if (!editing) return;
    const value = tagInput.trim();
    if (!value) return;
    if (editing.tags.includes(value)) return;
    setEditing({ ...editing, tags: [...editing.tags, value] });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    if (!editing) return;
    setEditing({ ...editing, tags: editing.tags.filter((item) => item !== tag) });
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.slug.trim()) {
      alert("Title and slug are required");
      return;
    }

    setIsSaving(true);
    try {
      const exists = content.blogPosts.some((post) => post.id === editing.id);
      if (exists) {
        await updateBlogPost(editing);
      } else {
        await createBlogPost(editing);
      }
      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deleteBlogPost(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete blog post");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1100px] mx-auto">
        <PageHeader
          eyebrow="Content"
          title="Blog"
          description={`${posts.length} posts, published and draft`}
          actions={
            <Button variant="primary" icon="ri-add-line" onClick={openNew}>
              New post
            </Button>
          }
        />

        {posts.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-black/5 bg-white">
            <EmptyState
              icon="ri-article-line"
              title="No posts yet"
              description="Write the first one."
              action={
                <Button variant="primary" icon="ri-add-line" onClick={openNew}>
                  New post
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {paginatedPosts.map((post) => (
                <div key={post.id} className="rounded-2xl ring-1 ring-black/5 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-gray-900 truncate">{post.title}</p>
                      <p className="text-[12px] text-gray-400 font-mono truncate">/{post.slug}</p>
                    </div>
                    <StatusBadge status={post.published ? "published" : "draft"} />
                  </div>
                  <p className="text-[12px] text-gray-500 tabular-nums">{post.date}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" icon="ri-edit-line" onClick={() => openEdit(post)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" icon="ri-delete-bin-line" onClick={() => handleDelete(post.id)}>
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
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </>
                }
              >
                {paginatedPosts.map((post) => (
                  <Tr key={post.id}>
                    <Td>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-[12px] text-gray-400 font-mono">/{post.slug}</p>
                    </Td>
                    <Td className="text-gray-500 tabular-nums whitespace-nowrap">{post.date}</Td>
                    <Td>
                      <StatusBadge status={post.published ? "published" : "draft"} />
                    </Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button size="sm" icon="ri-edit-line" onClick={() => openEdit(post)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon="ri-delete-bin-line"
                          onClick={() => handleDelete(post.id)}
                          aria-label={`Delete ${post.title}`}
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
            title={content.blogPosts.some((p) => p.id === editing.id) ? "Edit post" : "New post"}
            onClose={() => setEditing(null)}
            footer={
              <>
                <Button onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="primary" loading={isSaving} onClick={() => void handleSave()}>
                  {isSaving ? "Saving…" : "Save post"}
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
                hint="Used in the URL: /blog/<slug>"
                required
              />
              <Field
                label="Date"
                type="date"
                value={editing.date}
                onChange={(value) => setEditing({ ...editing, date: value })}
              />
              <Field
                label="External URL"
                type="url"
                value={editing.externalUrl ?? ""}
                onChange={(value) => setEditing({ ...editing, externalUrl: value })}
                hint="Optional — links out instead of rendering locally"
              />
            </div>

            <Field
              label="Excerpt"
              as="textarea"
              rows={3}
              value={editing.excerpt}
              onChange={(value) => setEditing({ ...editing, excerpt: value })}
            />

            <Field
              label="Content"
              as="textarea"
              rows={10}
              value={editing.content ?? ""}
              onChange={(value) => setEditing({ ...editing, content: value })}
            />

            <div className="space-y-2">
              <p className="text-[12px] font-medium text-gray-700">Tags</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag"
                  aria-label="Add a tag"
                  className="flex-1 min-h-11 px-4 py-2.5 text-[13px] rounded-xl bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
                />
                <Button icon="ri-add-line" onClick={addTag}>
                  Add
                </Button>
              </div>
              {editing.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {editing.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-surface text-[11px] text-gray-700 hover:text-red-600 transition-colors"
                    >
                      {tag}
                      <i className="ri-close-line" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>

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
