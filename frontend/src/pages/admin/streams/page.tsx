import { useMemo, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
import type { StreamEvent } from "../../../types/siteContent";

function createEmptyStream(): StreamEvent {
  return {
    id: crypto.randomUUID(),
    title: "",
    date: new Date().toISOString().slice(0, 10),
    time: "19:00",
    platform: "youtube",
    streamUrl: "",
    description: "",
    isRecurring: false,
    recurringDay: 1,
  };
}

export default function AdminStreams() {
  const { content, createStream, updateStream, deleteStream } = useContent();
  const [editing, setEditing] = useState<StreamEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const streams = useMemo(
    () => [...content.streamEvents].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
    [content.streamEvents]
  );

  const openNew = () => setEditing(createEmptyStream());
  const openEdit = (stream: StreamEvent) => setEditing({ ...stream });

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSaving(true);
    try {
      const exists = content.streamEvents.some((stream) => stream.id === editing.id);
      if (exists) {
        await updateStream(editing);
      } else {
        await createStream(editing);
      }
      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save stream");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stream event?")) return;
    try {
      await deleteStream(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete stream event");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Streams Manager</h1>
            <p className="text-gray-600 mt-1">Manage live stream schedule and recurring events</p>
          </div>
          <button onClick={openNew} className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            New Stream
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Platform</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Recurring</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {streams.map((stream) => (
                <tr key={stream.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{stream.title}</td>
                  <td className="px-4 py-3 text-gray-600">{stream.platform}</td>
                  <td className="px-4 py-3 text-gray-600">{stream.date}</td>
                  <td className="px-4 py-3 text-gray-600">{stream.time}</td>
                  <td className="px-4 py-3 text-gray-600">{stream.isRecurring ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(stream)} className="text-teal-600 hover:text-teal-700">Edit</button>
                    <button onClick={() => handleDelete(stream.id)} className="text-red-600 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{content.streamEvents.some((s) => s.id === editing.id) ? "Edit Stream" : "New Stream"}</h2>
                <button onClick={() => setEditing(null)} className="text-gray-500">Close</button>
              </div>

              <input className="w-full border rounded-lg px-3 py-2" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="w-full border rounded-lg px-3 py-2" type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
                <input className="w-full border rounded-lg px-3 py-2" type="time" value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
              </div>

              <select
                className="w-full border rounded-lg px-3 py-2"
                value={editing.platform}
                onChange={(e) => setEditing({ ...editing, platform: e.target.value as StreamEvent["platform"] })}
              >
                <option value="youtube">YouTube</option>
                <option value="twitch">Twitch</option>
                <option value="tiktok">TikTok</option>
              </select>

              <input className="w-full border rounded-lg px-3 py-2" placeholder="Stream URL / username" value={editing.streamUrl ?? ""} onChange={(e) => setEditing({ ...editing, streamUrl: e.target.value })} />
              <textarea className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Description" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.isRecurring} onChange={(e) => setEditing({ ...editing, isRecurring: e.target.checked })} />
                Recurring weekly
              </label>

              {editing.isRecurring && (
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={editing.recurringDay ?? 1}
                  onChange={(e) => setEditing({ ...editing, recurringDay: Number(e.target.value) })}
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
              )}

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
