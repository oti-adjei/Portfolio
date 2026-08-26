import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useContent } from "../../../admin/contexts/AdminContentContext";
import { useAuth } from "../../../admin/contexts/AdminAuthContext";
import { fetchCampaigns } from "../../../admin/services/adminApi";
import type { NewsletterCampaign } from "../../../types/siteContent";
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
  const { token } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<"subscribers" | "issues">("subscribers");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Campaign state lives here, not in AdminContentContext / SiteContent — that
  // pattern caused a real bug in this codebase when content unrelated to the
  // site's public shape was pushed through it.
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);

  // token is null on first render — AdminAuthContext restores it from storage in
  // an effect. Firing before then threw "Not authenticated" into a floating
  // promise and never retried, so a hard load of this page showed an empty list.
  useEffect(() => {
    if (!token) return;
    void fetchNewsletterSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token || view !== "issues") return;
    setCampaignsLoading(true);
    setCampaignsError(null);
    fetchCampaigns(token, { limit: 100 })
      .then((res) => setCampaigns(res.items))
      .catch((err: unknown) => {
        console.error("Failed to load campaigns:", err);
        setCampaignsError("Failed to load issues");
      })
      .finally(() => setCampaignsLoading(false));
  }, [token, view]);

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

  const viewPills = (
    <div className="flex gap-1.5 p-1 rounded-full bg-gray-100">
      {(["subscribers", "issues"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setView(v)}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors capitalize ${
            view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-[1100px] mx-auto">
        <PageHeader
          eyebrow="Inbox"
          title="Newsletter"
          description={
            view === "subscribers" ? `${subscribers.length} subscribers` : `${campaigns.length} issues`
          }
          actions={
            <>
              {viewPills}
              {view === "issues" && (
                <Link to="/admin/newsletter/compose">
                  <Button variant="primary" icon="ri-add-line">
                    New issue
                  </Button>
                </Link>
              )}
            </>
          }
        />

        {view === "subscribers" && (
          <>
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
          </>
        )}

        {view === "issues" && (
          <>
            {campaignsError && (
              <div className="mb-4 rounded-xl bg-red-50 text-red-800 ring-1 ring-red-100 px-4 py-3 text-[13px]">
                {campaignsError}
              </div>
            )}

            {!campaignsLoading && campaigns.length === 0 ? (
              <div className="rounded-2xl ring-1 ring-black/5 bg-white">
                <EmptyState
                  icon="ri-mail-send-line"
                  title="No issues yet"
                  description="Draft your first newsletter issue."
                  action={
                    <Link to="/admin/newsletter/compose">
                      <Button variant="primary" icon="ri-add-line">
                        New issue
                      </Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="rounded-2xl ring-1 ring-black/5 bg-white overflow-hidden">
                <Table
                  head={
                    <>
                      <Th>Subject</Th>
                      <Th>Status</Th>
                      <Th>Sent / Total</Th>
                      <Th>Date</Th>
                      <Th className="text-right">Actions</Th>
                    </>
                  }
                >
                  {campaigns.map((campaign) => (
                    <Tr key={campaign.id} onClick={() => navigate(`/admin/newsletter/compose/${campaign.id}`)}>
                      <Td className="font-medium text-gray-900">{campaign.subject}</Td>
                      <Td>
                        <StatusBadge status={campaign.status} />
                      </Td>
                      <Td className="text-gray-500 tabular-nums">
                        {campaign.sent_count} / {campaign.total_recipients}
                      </Td>
                      <Td className="text-gray-500 tabular-nums whitespace-nowrap">
                        {new Date(campaign.updated_at).toLocaleDateString()}
                      </Td>
                      <Td className="text-right">
                        <Button
                          size="sm"
                          icon={campaign.status === "draft" ? "ri-edit-line" : "ri-eye-line"}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/newsletter/compose/${campaign.id}`);
                          }}
                        >
                          {campaign.status === "draft" ? "Edit" : "View"}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
