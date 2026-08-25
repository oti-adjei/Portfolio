import { useMemo, useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
import {
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
  Toolbar,
  Tr,
} from "../../../components/admin/ui";
import type { ContactSubmission } from "../../../types/siteContent";

export default function AdminContactSubmissions() {
  const { content, fetchContactSubmissions, updateContactStatus } = useContent();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const limit = 20;

  useEffect(() => {
    void fetchContactSubmissions();
  }, []);

  const submissions = useMemo(
    () => [...content.contactSubmissions].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [content.contactSubmissions]
  );

  const filteredSubmissions = useMemo(() => {
    let filtered = submissions;

    if (statusFilter) {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        (s.subject && s.subject.toLowerCase().includes(query)) ||
        s.message.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [submissions, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredSubmissions.length / limit);
  const paginatedSubmissions = filteredSubmissions.slice((page - 1) * limit, page * limit);

  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    try {
      await updateContactStatus(id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update submission status");
    }
  };


  const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "replied", label: "Replied" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1100px] mx-auto">
        <PageHeader
          eyebrow="Inbox"
          title="Contact inbox"
          description={`${submissions.length} enquiries`}
        />

        <Toolbar
          search={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          searchPlaceholder="Search name, email, or message\u2026"
        >
          <div className="w-full sm:w-52">
            <Field
              label=""
              as="select"
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            />
          </div>
        </Toolbar>

        {paginatedSubmissions.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-black/5 bg-white">
            <EmptyState
              icon="ri-message-3-line"
              title="No enquiries found"
              description={statusFilter || searchQuery ? "Try clearing the filters." : "Messages from the contact form land here."}
            />
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {paginatedSubmissions.map((submission) => (
                <button
                  key={submission.id}
                  type="button"
                  onClick={() => setSelectedSubmission(submission)}
                  className="w-full text-left rounded-2xl ring-1 ring-black/5 bg-white p-4 space-y-2 hover:ring-signal/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{submission.name}</p>
                      <p className="text-[12px] text-gray-500 break-all">{submission.email}</p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                  <p className="text-[13px] text-gray-700">{submission.subject || "\u2014"}</p>
                  <p className="text-[11px] text-gray-400 tabular-nums">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block rounded-2xl ring-1 ring-black/5 bg-white overflow-hidden">
              <Table
                head={
                  <>
                    <Th>From</Th>
                    <Th>Subject</Th>
                    <Th>Status</Th>
                    <Th>Received</Th>
                    <Th className="text-right">Actions</Th>
                  </>
                }
              >
                {paginatedSubmissions.map((submission) => (
                  <Tr key={submission.id} onClick={() => setSelectedSubmission(submission)}>
                    <Td>
                      <p className="font-medium text-gray-900">{submission.name}</p>
                      <p className="text-[12px] text-gray-500">{submission.email}</p>
                    </Td>
                    <Td className="text-gray-500">{submission.subject || "\u2014"}</Td>
                    <Td>
                      <StatusBadge status={submission.status} />
                    </Td>
                    <Td className="text-gray-500 tabular-nums">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </Td>
                    <Td className="text-right">
                      <Button size="sm" icon="ri-eye-line" onClick={() => setSelectedSubmission(submission)}>
                        Open
                      </Button>
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

        {selectedSubmission && (
          <Modal
            title="Enquiry"
            onClose={() => setSelectedSubmission(null)}
            footer={
              <>
                <Button onClick={() => setSelectedSubmission(null)}>Close</Button>
                <a href={`mailto:${selectedSubmission.email}`}>
                  <Button variant="primary" icon="ri-reply-line">
                    Reply by email
                  </Button>
                </a>
              </>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">From</p>
                <p className="text-[14px] font-medium text-gray-900 mt-1">{selectedSubmission.name}</p>
                <a href={`mailto:${selectedSubmission.email}`} className="text-[13px] text-gray-500 hover:text-signal break-all">
                  {selectedSubmission.email}
                </a>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Received</p>
                <p className="text-[13px] text-gray-700 mt-1 tabular-nums">
                  {new Date(selectedSubmission.created_at).toLocaleString()}
                </p>
                <p className="text-[12px] text-gray-400 mt-1">via {selectedSubmission.source}</p>
              </div>
            </div>

            {selectedSubmission.subject && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Subject</p>
                <p className="text-[14px] font-medium text-gray-900 mt-1">{selectedSubmission.subject}</p>
              </div>
            )}

            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 mb-1.5">Message</p>
              <div className="rounded-xl bg-cream p-4 text-[13px] leading-[1.7] text-gray-800 whitespace-pre-wrap">
                {selectedSubmission.message}
              </div>
            </div>

            <Field
              label="Status"
              as="select"
              value={selectedSubmission.status}
              options={statusOptions.slice(1)}
              onChange={(value) => {
                void handleStatusChange(selectedSubmission.id, value as typeof selectedSubmission.status);
                setSelectedSubmission(null);
              }}
            />
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
