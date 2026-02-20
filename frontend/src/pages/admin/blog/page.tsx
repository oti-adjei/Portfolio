import { useMemo, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
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

  const posts = useMemo(
    () => [...content.blogPosts].sort((a, b) => b.date.localeCompare(a.date)),
    [content.blogPosts]
  );

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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Manager</h1>
            <p className="text-gray-600 mt-1">Create and manage published and draft posts</p>
          </div>
          <button
            onClick={openNew}
            className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            New Post
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(post)} className="text-teal-600 hover:text-teal-700">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-700">Delete</button>
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
                <h2 className="text-xl font-semibold">{content.blogPosts.some((p) => p.id === editing.id) ? "Edit Post" : "New Post"}</h2>
                <button onClick={() => setEditing(null)} className="text-gray-500">Close</button>
              </div>

              <input className="w-full border rounded-lg px-3 py-2" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="External URL (optional)" value={editing.externalUrl ?? ""} onChange={(e) => setEditing({ ...editing, externalUrl: e.target.value })} />
              <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Excerpt" value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              <textarea className="w-full border rounded-lg px-3 py-2" rows={8} placeholder="Content" value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Tags</p>
                <div className="flex gap-2">
                  <input className="flex-1 border rounded-lg px-3 py-2" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag" />
                  <button onClick={addTag} className="px-4 py-2 border rounded-lg">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editing.tags.map((tag) => (
                    <button key={tag} onClick={() => removeTag(tag)} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {tag} ×
                    </button>
                  ))}
                </div>
              </div>

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
