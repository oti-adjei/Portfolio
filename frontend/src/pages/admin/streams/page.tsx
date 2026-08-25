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
  Table,
  Td,
  Th,
  Tr,
} from "../../../components/admin/ui";
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

const platformOptions = [
  { value: "youtube", label: "YouTube" },
  { value: "twitch", label: "Twitch" },
  { value: "tiktok", label: "TikTok" },
];

const dayOptions = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

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
      <div className="max-w-[1100px] mx-auto">
        <PageHeader
          eyebrow="Content"
          title="Streams"
          description={`${streams.length} scheduled events`}
          actions={
            <Button variant="primary" icon="ri-add-line" onClick={openNew}>
              New stream
            </Button>
          }
        />

        {streams.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-black/5 bg-white">
            <EmptyState
              icon="ri-live-line"
              title="No streams scheduled"
              description="Add one-off or recurring weekly events."
              action={
                <Button variant="primary" icon="ri-add-line" onClick={openNew}>
                  New stream
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {streams.map((stream) => (
                <div key={stream.id} className="rounded-2xl ring-1 ring-black/5 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-medium text-gray-900 min-w-0 truncate">{stream.title}</p>
                    <Badge tone={stream.platform === "twitch" ? "info" : "outline"}>{stream.platform}</Badge>
                  </div>
                  <p className="text-[12px] text-gray-500 tabular-nums">
                    {stream.date} · {stream.time}
                  </p>
                  {stream.isRecurring && <Badge tone="cream" icon="ri-repeat-line">Weekly</Badge>}
                  <div className="flex items-center gap-2">
                    <Button size="sm" icon="ri-edit-line" onClick={() => openEdit(stream)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" icon="ri-delete-bin-line" onClick={() => handleDelete(stream.id)}>
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
                    <Th>Platform</Th>
                    <Th>Date</Th>
                    <Th>Time</Th>
                    <Th>Repeat</Th>
                    <Th className="text-right">Actions</Th>
                  </>
                }
              >
                {streams.map((stream) => (
                  <Tr key={stream.id}>
                    <Td className="font-medium text-gray-900">{stream.title}</Td>
                    <Td>
                      <Badge tone={stream.platform === "twitch" ? "info" : "outline"}>{stream.platform}</Badge>
                    </Td>
                    <Td className="text-gray-500 tabular-nums">{stream.date}</Td>
                    <Td className="text-gray-500 tabular-nums">{stream.time}</Td>
                    <Td className="text-gray-500">{stream.isRecurring ? "Weekly" : "One-time"}</Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button size="sm" icon="ri-edit-line" onClick={() => openEdit(stream)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon="ri-delete-bin-line"
                          onClick={() => handleDelete(stream.id)}
                          aria-label={`Delete ${stream.title}`}
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Table>
            </div>
          </>
        )}

        {editing && (
          <Modal
            title={content.streamEvents.some((s) => s.id === editing.id) ? "Edit stream" : "New stream"}
            onClose={() => setEditing(null)}
            footer={
              <>
                <Button onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="primary" loading={isSaving} onClick={() => void handleSave()}>
                  {isSaving ? "Saving\u2026" : "Save stream"}
                </Button>
              </>
            }
          >
            <Field
              label="Title"
              value={editing.title}
              onChange={(value) => setEditing({ ...editing, title: value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Date"
                type="date"
                value={editing.date}
                onChange={(value) => setEditing({ ...editing, date: value })}
              />
              <Field
                label="Time"
                type="time"
                value={editing.time}
                onChange={(value) => setEditing({ ...editing, time: value })}
              />
            </div>

            <Field
              label="Platform"
              as="select"
              options={platformOptions}
              value={editing.platform}
              onChange={(value) => setEditing({ ...editing, platform: value as StreamEvent["platform"] })}
            />

            <Field
              label="Stream URL or username"
              value={editing.streamUrl ?? ""}
              onChange={(value) => setEditing({ ...editing, streamUrl: value })}
            />

            <Field
              label="Description"
              as="textarea"
              rows={4}
              value={editing.description ?? ""}
              onChange={(value) => setEditing({ ...editing, description: value })}
            />

            <label className="flex items-center gap-2.5 text-[13px] text-gray-700">
              <input
                type="checkbox"
                checked={editing.isRecurring}
                onChange={(e) => setEditing({ ...editing, isRecurring: e.target.checked })}
                className="w-4 h-4 rounded accent-signal"
              />
              Recurring weekly
            </label>

            {editing.isRecurring && (
              <Field
                label="Day of week"
                as="select"
                options={dayOptions}
                value={String(editing.recurringDay ?? 1)}
                onChange={(value) => setEditing({ ...editing, recurringDay: Number(value) })}
              />
            )}
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
