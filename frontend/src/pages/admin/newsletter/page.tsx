import { useMemo, useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";

export default function AdminNewsletter() {
  const { content, fetchNewsletterSubscribers, updateNewsletterStatus } = useContent();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    void fetchNewsletterSubscribers();
  }, []);

  const subscribers = useMemo(
    () => [...content.newsletterSubscribers].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [content.newsletterSubscribers]
  );

  const filteredSubscribers = useMemo(() => {
    let filtered = subscribers;

    if (statusFilter) {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        s.email.toLowerCase().includes(query) ||
        (s.name && s.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [subscribers, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredSubscribers.length / limit);
  const paginatedSubscribers = filteredSubscribers.slice((page - 1) * limit, page * limit);

  const handleStatusChange = async (id: string, newStatus: 'subscribed' | 'unsubscribed' | 'bounced') => {
    try {
      await updateNewsletterStatus(id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update subscriber status");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
            <p className="text-gray-600 mt-1">Manage subscribers and their status</p>
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
          <input
            type="text"
            placeholder="Search email or name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                paginatedSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{subscriber.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {subscriber.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {subscriber.source}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={subscriber.status}
                        onChange={(e) => handleStatusChange(subscriber.id, e.target.value as typeof subscriber.status)}
                        className={`px-2 py-1 rounded-full text-xs border-0 ${
                          subscriber.status === 'subscribed'
                            ? 'bg-green-100 text-green-700'
                            : subscriber.status === 'unsubscribed'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="subscribed">Subscribed</option>
                        <option value="unsubscribed">Unsubscribed</option>
                        <option value="bounced">Bounced</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => window.location.href = `mailto:${subscriber.email}`}
                        className="text-teal-600 hover:text-teal-700"
                        title="Send email"
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
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
