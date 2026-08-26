import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { useAuth } from "../../../../admin/contexts/AdminAuthContext";
import {
  createCampaign,
  fetchAdminBlogPosts,
  fetchAdminNotes,
  fetchCampaign,
  fetchCampaigns,
  prepareCampaign,
  retryCampaignFailed,
  sendCampaignChunk,
  sendCampaignTest,
  updateCampaign,
} from "../../../../admin/services/adminApi";
import type { BlogPost, CampaignItem, NewsletterCampaign, Note } from "../../../../types/siteContent";
import {
  Badge,
  Button,
  Card,
  Field,
  Modal,
  Notice,
  PageHeader,
  SaveBar,
  StatusBadge,
} from "../../../../components/admin/ui";

type SendPhase = "idle" | "preparing" | "sending" | "stuck" | "done" | "error";

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export default function NewsletterCompose() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const isNew = !id;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [campaign, setCampaign] = useState<NewsletterCampaign | null>(null);
  const [subject, setSubject] = useState("");
  const [intro, setIntro] = useState("");
  const [style, setStyle] = useState<"teaser" | "full">("teaser");
  const [items, setItems] = useState<CampaignItem[]>([]);
  const [dirty, setDirty] = useState(false);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [otherCampaigns, setOtherCampaigns] = useState<NewsletterCampaign[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [hasSentTest, setHasSentTest] = useState(false);

  const [confirmSend, setConfirmSend] = useState(false);
  const [sendPhase, setSendPhase] = useState<SendPhase>("idle");
  const [sendProgress, setSendProgress] = useState({ sent: 0, failed: 0, remaining: 0 });
  const [sendError, setSendError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryNotice, setRetryNotice] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) setTestEmail(user.email);
  }, [user]);

  // The test-send gate is only meaningful for what it actually tested. Any edit
  // to the rendered content — subject, intro, style, or the item selection —
  // invalidates a prior test, so this is a single choke point that resets the
  // gate rather than four separate setters each remembering to do it.
  useEffect(() => {
    setHasSentTest(false);
  }, [subject, intro, style, items]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      if (!token) return;
      setLoading(true);
      setLoadError(null);
      try {
        const [posts, noteList, campaignList] = await Promise.all([
          fetchAdminBlogPosts(token),
          fetchAdminNotes(token),
          fetchCampaigns(token, { limit: 200 }),
        ]);
        if (cancelled) return;
        setBlogPosts(posts);
        setNotes(noteList);
        setOtherCampaigns(campaignList.items);

        if (id) {
          const existing = await fetchCampaign(token, id);
          if (cancelled) return;
          setCampaign(existing);
          setSubject(existing.subject);
          setIntro(existing.intro ?? "");
          setStyle(existing.style);
          setItems(existing.items);
        }
      } catch (err) {
        console.error("Failed to load composer data:", err);
        if (!cancelled) setLoadError("Failed to load. Try reloading the page.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token, id]);

  const sentItemKeys = useMemo(() => {
    const set = new Set<string>();
    for (const other of otherCampaigns) {
      if (other.id === id || other.status === "draft") continue;
      for (const item of other.items) set.add(`${item.kind}:${item.id}`);
    }
    return set;
  }, [otherCampaigns, id]);

  const sortedBlogPosts = useMemo(
    () => [...blogPosts].sort((a, b) => b.date.localeCompare(a.date)),
    [blogPosts]
  );
  const sortedNotes = useMemo(() => [...notes].sort((a, b) => b.date.localeCompare(a.date)), [notes]);

  const isDraftStatus = (campaign?.status ?? "draft") === "draft";
  const canSave = isDraftStatus && sendPhase === "idle";
  const canSend = !isNew && campaign != null && isDraftStatus && hasSentTest && sendPhase === "idle";

  function isSelected(kind: "blog" | "note", itemId: string): boolean {
    return items.some((it) => it.kind === kind && it.id === itemId);
  }

  function toggleItem(kind: "blog" | "note", ref: BlogPost | Note): void {
    setItems((prev) => {
      const exists = prev.some((it) => it.kind === kind && it.id === ref.id);
      if (exists) return prev.filter((it) => !(it.kind === kind && it.id === ref.id));
      return [...prev, { kind, id: ref.id, slug: ref.slug, title: ref.title }];
    });
    setDirty(true);
  }

  function excerptFor(item: CampaignItem): string {
    if (item.kind === "blog") {
      return blogPosts.find((p) => p.id === item.id)?.excerpt ?? "";
    }
    const note = notes.find((n) => n.id === item.id);
    if (!note) return "";
    const plain = note.content.replace(/[#*_`>-]/g, "").trim();
    return plain.length > 160 ? `${plain.slice(0, 160)}…` : plain;
  }

  async function handleSave() {
    if (!token) return;
    if (!subject.trim()) {
      setSaveError("Subject is required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const payload = { subject: subject.trim(), intro, style, items };
      if (isNew) {
        const created = await createCampaign(token, payload);
        setCampaign(created);
        setDirty(false);
        setSaved(true);
        navigate(`/admin/newsletter/compose/${created.id}`, { replace: true });
      } else if (campaign) {
        const updated = await updateCampaign(token, campaign.id, payload);
        setCampaign(updated);
        setDirty(false);
        setSaved(true);
      }
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save campaign:", err);
      setSaveError(errorMessage(err, "Failed to save. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  async function handleSendTest() {
    if (!token || !campaign || !testEmail.trim()) return;
    setSendingTest(true);
    setTestError(null);
    try {
      await sendCampaignTest(token, campaign.id, testEmail.trim());
      setHasSentTest(true);
    } catch (err) {
      console.error("Test send failed:", err);
      setTestError(errorMessage(err, "Test send failed. Check the address and try again."));
    } finally {
      setSendingTest(false);
    }
  }

  async function runSendLoop(initial: { sent: number; failed: number }) {
    if (!token || !campaign) return;
    let totalSent = initial.sent;
    let totalFailed = initial.failed;
    try {
      // `remaining === 0` means every delivery row is settled, but the server
      // only flips the campaign's own status to sent/failed on a call that
      // finds zero pending rows *at the start* — the batch that drove
      // remaining to 0 doesn't also finalize itself. That branch is the one
      // that echoes `status` back, so that's the real termination signal;
      // looping on `remaining > 0` alone stops one call early and leaves the
      // campaign stuck reporting "sending" with nothing left to send.
      for (;;) {
        const res = await sendCampaignChunk(token, campaign.id);
        totalSent += res.sent;
        totalFailed += res.failed;
        setSendProgress({ sent: totalSent, failed: totalFailed, remaining: res.remaining });

        if (res.stuck > 0) {
          setSendPhase("stuck");
          return;
        }
        if (res.status) {
          setSendPhase("done");
          const refreshed = await fetchCampaign(token, campaign.id);
          setCampaign(refreshed);
          return;
        }
      }
    } catch (err) {
      console.error("Send chunk failed:", err);
      setSendError(errorMessage(err, "Sending failed partway through."));
      setSendPhase("error");
    }
  }

  async function handleConfirmSend() {
    if (!token || !campaign) return;
    setConfirmSend(false);
    setSendError(null);
    setSendPhase("preparing");
    try {
      const prep = await prepareCampaign(token, campaign.id);
      setSendProgress({ sent: 0, failed: 0, remaining: prep.pending });
      setSendPhase("sending");
      await runSendLoop({ sent: 0, failed: 0 });
    } catch (err) {
      console.error("Prepare failed:", err);
      setSendError(errorMessage(err, "Failed to prepare the send."));
      setSendPhase("error");
    }
  }

  async function handleRetry() {
    if (!token || !campaign) return;
    setRetrying(true);
    setSendError(null);
    setRetryNotice(null);
    try {
      const { requeued } = await retryCampaignFailed(token, campaign.id);
      // A stuck 'sending' row is only reclaimed once its claim is past the
      // 15-minute staleness window (see retry-failed). If everything stuck
      // is still inside that window, requeued is 0 and there is nothing to
      // send — looping into runSendLoop here would just re-hit the same
      // stuck state with no explanation of why. Say so instead of bouncing
      // silently back to the stuck banner.
      if (requeued === 0) {
        setRetryNotice("Nothing to retry yet — the stalled deliveries are still inside their claim window. Try again in a few minutes.");
        return;
      }
      setSendPhase("sending");
      await runSendLoop({ sent: sendProgress.sent, failed: sendProgress.failed });
    } catch (err) {
      console.error("Retry failed:", err);
      setSendError(errorMessage(err, "Retry failed."));
    } finally {
      setRetrying(false);
    }
  }

  // A send that was interrupted mid-flight (tab closed, page refreshed) leaves
  // the campaign in "sending" server-side with no local sendPhase driving it.
  // send-chunk only requires status "sending", so re-entering the same loop
  // from the campaign's last known counts is all that's needed to continue it.
  async function handleResume() {
    if (!token || !campaign) return;
    setSendError(null);
    const remaining =
      campaign.deliveries?.pending ??
      Math.max(campaign.total_recipients - campaign.sent_count - campaign.failed_count, 0);
    setSendProgress({ sent: campaign.sent_count, failed: campaign.failed_count, remaining });
    setSendPhase("sending");
    await runSendLoop({ sent: campaign.sent_count, failed: campaign.failed_count });
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto py-16 text-center text-[13px] text-gray-400">Loading…</div>
      </AdminLayout>
    );
  }

  if (loadError) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto">
          <Notice tone="error">{loadError}</Notice>
        </div>
      </AdminLayout>
    );
  }

  const styleOptions: { value: "teaser" | "full"; label: string }[] = [
    { value: "teaser", label: "Teaser" },
    { value: "full", label: "Full" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          eyebrow={isNew ? "New" : "Editing"}
          title={isNew ? "New issue" : "Edit issue"}
          description={campaign ? campaign.subject || "Untitled issue" : "Draft a new newsletter issue"}
          actions={
            <>
              <Link to="/admin/newsletter">
                <Button icon="ri-arrow-left-line">Back</Button>
              </Link>
              {campaign && <StatusBadge status={campaign.status} />}
            </>
          }
        />

        {!isDraftStatus && campaign && (
          <Notice tone="info">
            This issue is {campaign.status} and can no longer be edited. Sent {campaign.sent_count} of{" "}
            {campaign.total_recipients}
            {campaign.failed_count > 0 ? `, ${campaign.failed_count} failed` : ""}.
          </Notice>
        )}

        <Card title="Content">
          <div className="space-y-5">
            <Field
              label="Subject"
              value={subject}
              onChange={(v) => {
                setSubject(v);
                setDirty(true);
              }}
              placeholder="What's new this month"
              required
              disabled={!isDraftStatus}
            />

            <Field
              as="textarea"
              label="Intro"
              value={intro}
              onChange={(v) => {
                setIntro(v);
                setDirty(true);
              }}
              placeholder="A short note before the list of items…"
              rows={4}
              disabled={!isDraftStatus}
            />

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Style</label>
              <div className="flex gap-1.5">
                {styleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={!isDraftStatus}
                    onClick={() => {
                      setStyle(opt.value);
                      setDirty(true);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      style === opt.value
                        ? "bg-signal text-white"
                        : "bg-white ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Items" description="Newest first. Pick what goes in this issue, in send order.">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 mb-2">Blog</p>
              <div className="rounded-xl ring-1 ring-black/5 divide-y divide-black/5">
                {sortedBlogPosts.length === 0 ? (
                  <p className="px-4 py-3 text-[13px] text-gray-400">No blog posts yet.</p>
                ) : (
                  sortedBlogPosts.map((post) => {
                    const alreadySent = sentItemKeys.has(`blog:${post.id}`);
                    return (
                      <label
                        key={post.id}
                        className="flex items-center gap-3 px-4 py-3 text-[13px] cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected("blog", post.id)}
                          onChange={() => toggleItem("blog", post)}
                          disabled={!isDraftStatus}
                          className="w-4 h-4 rounded accent-signal shrink-0"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block font-medium text-gray-900 truncate">{post.title}</span>
                          <span className="block text-[11px] text-gray-400">
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </span>
                        {alreadySent && <Badge tone="muted">Already sent</Badge>}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 mb-2">Notes</p>
              <div className="rounded-xl ring-1 ring-black/5 divide-y divide-black/5">
                {sortedNotes.length === 0 ? (
                  <p className="px-4 py-3 text-[13px] text-gray-400">No notes yet.</p>
                ) : (
                  sortedNotes.map((note) => {
                    const alreadySent = sentItemKeys.has(`note:${note.id}`);
                    return (
                      <label
                        key={note.id}
                        className="flex items-center gap-3 px-4 py-3 text-[13px] cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected("note", note.id)}
                          onChange={() => toggleItem("note", note)}
                          disabled={!isDraftStatus}
                          className="w-4 h-4 rounded accent-signal shrink-0"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block font-medium text-gray-900 truncate">{note.title}</span>
                          <span className="block text-[11px] text-gray-400">
                            {new Date(note.date).toLocaleDateString()}
                          </span>
                        </span>
                        {alreadySent && <Badge tone="muted">Already sent</Badge>}
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="Preview & test"
          description="Preview is structural only — the real email HTML lives in the Worker."
          actions={
            <Button icon="ri-eye-line" onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <Field
                  label="Send a test to"
                  type="email"
                  value={testEmail}
                  onChange={setTestEmail}
                  placeholder="you@example.com"
                  disabled={isNew}
                />
              </div>
              <Button
                icon="ri-send-plane-line"
                loading={sendingTest}
                disabled={isNew || !testEmail.trim()}
                onClick={() => void handleSendTest()}
              >
                Send test
              </Button>
            </div>
            {isNew && <p className="text-[12px] text-gray-400">Save the draft before sending a test.</p>}
            {testError && <Notice tone="error">{testError}</Notice>}
            {hasSentTest && !testError && (
              <Notice tone="success">Test sent. Sending is enabled for this session.</Notice>
            )}
          </div>
        </Card>

        {!isNew && campaign && (
          <Card title="Send" description="This is the one irreversible action in this admin.">
            <div className="space-y-4">
              {campaign.postalAddressConfigured === false && (
                <Notice tone="error">
                  No postal address is configured. CAN-SPAM requires a physical postal address in every
                  commercial email. Set one with{" "}
                  <code className="text-[12px]">npx wrangler secret put NEWSLETTER_POSTAL_ADDRESS</code>{" "}
                  before sending this issue.
                </Notice>
              )}

              {sendPhase === "idle" && isDraftStatus && (
                <>
                  {!confirmSend ? (
                    <Button
                      variant="primary"
                      icon="ri-send-plane-fill"
                      disabled={!canSend}
                      onClick={() => setConfirmSend(true)}
                    >
                      Send to all subscribers
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Notice tone="error">
                        This sends the issue to every subscribed recipient and cannot be undone. Continue?
                      </Notice>
                      <div className="flex gap-2">
                        <Button variant="danger" onClick={() => void handleConfirmSend()}>
                          Yes, send it
                        </Button>
                        <Button onClick={() => setConfirmSend(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                  {!hasSentTest && (
                    <p className="text-[12px] text-gray-400">Send yourself a test first to enable this.</p>
                  )}
                </>
              )}

              {(sendPhase === "preparing" || sendPhase === "sending") && (
                <Notice tone="info">
                  {sendPhase === "preparing"
                    ? "Preparing recipients…"
                    : `Sending… ${sendProgress.sent} sent, ${sendProgress.failed} failed, ${sendProgress.remaining} remaining.`}
                </Notice>
              )}

              {sendPhase === "stuck" && (
                <div className="space-y-3">
                  <Notice tone="error">
                    {sendProgress.sent} sent, {sendProgress.failed} failed, {sendProgress.remaining} remaining
                    — some deliveries were claimed but never settled and the send has stalled. Retry to
                    recover them.
                  </Notice>
                  {retryNotice && <Notice tone="info">{retryNotice}</Notice>}
                  <Button variant="danger" icon="ri-refresh-line" loading={retrying} onClick={() => void handleRetry()}>
                    Retry failed
                  </Button>
                </div>
              )}

              {sendPhase === "error" && (
                <div className="space-y-3">
                  <Notice tone="error">{sendError}</Notice>
                  <Button variant="danger" icon="ri-refresh-line" loading={retrying} onClick={() => void handleRetry()}>
                    Retry failed
                  </Button>
                </div>
              )}

              {sendPhase === "done" && (
                <Notice tone="success">
                  Done. {sendProgress.sent} sent, {sendProgress.failed} failed.
                </Notice>
              )}

              {sendPhase === "idle" && campaign.status === "sending" && (
                <div className="space-y-3">
                  <Notice tone="info">
                    Sending was interrupted — {campaign.sent_count} of {campaign.total_recipients} sent so
                    far{campaign.failed_count > 0 ? `, ${campaign.failed_count} failed` : ""}.
                  </Notice>
                  <Button variant="primary" icon="ri-play-circle-line" onClick={() => void handleResume()}>
                    Resume send
                  </Button>
                </div>
              )}

              {sendPhase === "idle" && !isDraftStatus && campaign.failed_count > 0 && (
                <Button variant="danger" icon="ri-refresh-line" loading={retrying} onClick={() => void handleRetry()}>
                  Retry failed
                </Button>
              )}
            </div>
          </Card>
        )}

        {canSave && (
          <SaveBar onSave={() => void handleSave()} saving={saving} saved={saved} dirty={dirty} label="Save draft" />
        )}
        {saveError && <Notice tone="error">{saveError}</Notice>}
      </div>

      {previewOpen && (
        <Modal title="Preview" onClose={() => setPreviewOpen(false)}>
          <div className="space-y-4">
            <Notice tone="info">Preview is approximate. Send yourself a test before sending for real.</Notice>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Subject</p>
              <p className="text-[14px] font-medium text-gray-900">{subject || "(no subject)"}</p>
            </div>
            {intro && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Intro</p>
                <p className="text-[13px] text-gray-700 whitespace-pre-wrap">{intro}</p>
              </div>
            )}
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Items ({style})</p>
              {items.length === 0 ? (
                <p className="text-[13px] text-gray-400">No items selected.</p>
              ) : (
                items.map((item) => (
                  <div key={`${item.kind}:${item.id}`} className="rounded-xl ring-1 ring-black/5 px-4 py-3">
                    <p className="text-[13px] font-medium text-gray-900">{item.title}</p>
                    {style === "full" && <p className="mt-1 text-[12px] text-gray-500">{excerptFor(item)}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
