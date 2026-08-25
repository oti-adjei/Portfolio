import { useMemo, useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
import {
  Button,
  EmptyState,
  Field,
  PageHeader,
  Pagination,
  StatusBadge,
  Table,
  Td,
  Th,
  Toolbar,
  Tr,
} from "../../../components/admin/ui";

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

  const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "subscribed", label: "Subscribed" },
    { value: "unsubscribed", label: "Unsubscribed" },
    { value: "bounced", label: "Bounced" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1100px] mx-auto">
        <PageHeader
          eyebrow="Inbox"
          title="Newsletter"
          description={`${subscribers.length} subscribers`}
        />

        <Toolbar
          search={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          searchPlaceholder="Search email or name\u2026"
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

        {paginatedSubscribers.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-black/5 bg-white">
            <EmptyState
              icon="ri-mail-send-line"
              title="No subscribers found"
              description={statusFilter || searchQuery ? "Try clearing the filters." : "Sign-ups from the site land here."}
            />
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {paginatedSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="rounded-2xl ring-1 ring-black/5 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 break-all">{subscriber.email}</p>
                      <p className="text-[12px] text-gray-500">{subscriber.name || "\u2014"}</p>
                    </div>
                    <StatusBadge status={subscriber.status} />
                  </div>
                  <p className="text-[12px] text-gray-400">Source: {subscriber.source}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Field
                        label=""
                        as="select"
                        value={subscriber.status}
                        onChange={(value) => void handleStatusChange(subscriber.id, value as typeof subscriber.status)}
                        options={statusOptions.slice(1)}
                      />
                    </div>
                    <a href={`mailto:${subscriber.email}`} aria-label={`Email ${subscriber.email}`}>
                      <Button icon="ri-mail-send-line" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block rounded-2xl ring-1 ring-black/5 bg-white overflow-hidden">
              <Table
                head={
                  <>
                    <Th>Email</Th>
                    <Th>Name</Th>
                    <Th>Source</Th>
                    <Th>Status</Th>
                    <Th>Joined</Th>
                    <Th className="text-right">Actions</Th>
                  </>
                }
              >
                {paginatedSubscribers.map((subscriber) => (
                  <Tr key={subscriber.id}>
                    <Td className="font-medium text-gray-900">{subscriber.email}</Td>
                    <Td className="text-gray-500">{subscriber.name || "\u2014"}</Td>
                    <Td className="text-gray-500">{subscriber.source}</Td>
                    <Td>
                      <select
                        value={subscriber.status}
                        onChange={(e) => void handleStatusChange(subscriber.id, e.target.value as typeof subscriber.status)}
                        aria-label={`Status for ${subscriber.email}`}
                        className="text-[12px] rounded-full bg-white ring-1 ring-gray-200 px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-signal/50"
                      >
                        <option value="subscribed">Subscribed</option>
                        <option value="unsubscribed">Unsubscribed</option>
                        <option value="bounced">Bounced</option>
                      </select>
                    </Td>
                    <Td className="text-gray-500 tabular-nums whitespace-nowrap">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </Td>
                    <Td className="text-right">
                      <a href={`mailto:${subscriber.email}`} aria-label={`Email ${subscriber.email}`}>
                        <Button size="sm" icon="ri-mail-send-line" />
                      </a>
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
      </div>
    </AdminLayout>
  );
}
