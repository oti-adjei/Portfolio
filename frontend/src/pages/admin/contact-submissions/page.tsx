import { useMemo, useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-700';
      case 'read': return 'bg-blue-100 text-blue-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Inbox</h1>
            <p className="text-gray-600 mt-1">Manage contact enquiries and responses</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm min-h-11 w-full sm:w-auto"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          <input
            type="text"
            placeholder="Search name, email, or message..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm min-h-11 flex-1"
          />
        </div>

        <div className="md:hidden space-y-3">
          {paginatedSubmissions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-8 text-center text-gray-500">
              No submissions found
            </div>
          ) : (
            paginatedSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{submission.name}</p>
                    <p className="text-sm text-gray-600 break-all">{submission.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{submission.subject || "-"}</p>
                <p className="text-xs text-gray-500">{new Date(submission.created_at).toLocaleDateString()}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="flex-1 min-h-10 px-3 py-2 border border-gray-200 rounded-lg text-sm text-teal-700 hover:bg-teal-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => { window.location.href = `mailto:${submission.email}`; }}
                    className="min-h-10 px-3 py-2 border border-gray-200 rounded-lg text-sm text-teal-700 hover:bg-teal-50"
                    title="Reply via email"
                  >
                    <i className="ri-mail-send-line"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Received</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No submissions found
                  </td>
                </tr>
              ) : (
                paginatedSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{submission.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {submission.email}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {submission.subject || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={submission.status}
                        onChange={(e) => handleStatusChange(submission.id, e.target.value as typeof submission.status)}
                        className={`px-2 py-1 rounded-full text-xs border-0 ${getStatusColor(submission.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-teal-600 hover:text-teal-700"
                        title="View details"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button
                        onClick={() => window.location.href = `mailto:${submission.email}`}
                        className="text-teal-600 hover:text-teal-700"
                        title="Reply via email"
                      >
                        <i className="ri-mail-send-line"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="min-h-10 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="min-h-10 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-3xl rounded-xl p-4 sm:p-6 space-y-4 h-[calc(100vh-2rem)] sm:h-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Enquiry Details</h2>
                <button onClick={() => setSelectedSubmission(null)} className="text-gray-500">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">From</p>
                  <p className="text-gray-900 font-medium">{selectedSubmission.name}</p>
                  <p className="text-gray-600">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-gray-600">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                  <p className="text-sm font-medium text-gray-600 mt-2">Status</p>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => {
                      handleStatusChange(selectedSubmission.id, e.target.value as typeof selectedSubmission.status);
                      setSelectedSubmission(null);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm border border-gray-200 ${getStatusColor(selectedSubmission.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {selectedSubmission.subject && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Subject</p>
                  <p className="text-gray-900 font-medium">{selectedSubmission.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600">Source</p>
                <p className="text-gray-600">{selectedSubmission.source}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  onClick={() => window.location.href = `mailto:${selectedSubmission.email}`}
                  className="min-h-11 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Reply via Email
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="min-h-11 px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
