import { Hono } from "hono";
import { getEmailProvider } from "../../services/email/index.js";
import { renderCampaignHtml, renderCampaignText } from "../../services/newsletter/render.js";
import type { CampaignItem } from "../../services/newsletter/render.js";
import { isValidEmail } from "../../services/security.js";

const VALID_STYLES = ["teaser", "full"] as const;

type CampaignStyle = (typeof VALID_STYLES)[number];
type CampaignStatus = "draft" | "sending" | "sent" | "failed";

interface CampaignRow {
  id: string;
  subject: string;
  intro: string;
  style: string;
  items: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
}

interface Campaign {
  id: string;
  subject: string;
  intro: string;
  style: CampaignStyle;
  items: unknown[];
  status: CampaignStatus;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function rowToCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    subject: row.subject,
    intro: row.intro,
    style: row.style as CampaignStyle,
    items: parseJson<unknown[]>(row.items, []),
    status: row.status as CampaignStatus,
    total_recipients: row.total_recipients,
    sent_count: row.sent_count,
    failed_count: row.failed_count,
    created_at: row.created_at,
    updated_at: row.updated_at,
    sent_at: row.sent_at,
  };
}

function validateCampaignBody(
  body: Record<string, unknown>
): { error: string } | { subject: string; intro: string; style: CampaignStyle; items: unknown[] } {
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  if (!subject) return { error: "subject is required" };
  if (subject.length > 200) return { error: "subject must be 200 characters or fewer" };

  const style = (body.style as CampaignStyle | undefined) ?? "teaser";
  if (!VALID_STYLES.includes(style)) {
    return { error: "style must be 'teaser' or 'full'" };
  }

  const items = body.items ?? [];
  if (!Array.isArray(items)) return { error: "items must be an array" };

  const intro = typeof body.intro === "string" ? body.intro : "";

  return { subject, intro, style, items };
}

interface StoredItem {
  kind: "blog" | "note";
  id: string;
  slug: string;
  title: string;
}

/**
 * The campaign's stored `items` only carry {kind, id, slug, title} — the
 * excerpt/content is looked up fresh at send time so an edited post is
 * reflected in what actually goes out. An item whose source row is gone
 * (deleted post/note) is skipped rather than failing the whole send.
 */
async function hydrateItems(db: D1Database, items: unknown[]): Promise<CampaignItem[]> {
  const hydrated: CampaignItem[] = [];

  for (const raw of items) {
    const item = raw as Partial<StoredItem> | null;
    if (!item || (item.kind !== "blog" && item.kind !== "note") || !item.id || !item.slug) continue;

    if (item.kind === "blog") {
      const row = await db
        .prepare("SELECT excerpt, content, date FROM blog_posts WHERE id = ?")
        .bind(item.id)
        .first<{ excerpt: string | null; content: string | null; date: string }>();
      if (!row) continue;
      hydrated.push({
        kind: "blog",
        id: item.id,
        slug: item.slug,
        title: item.title ?? "",
        excerpt: row.excerpt ?? undefined,
        content: row.content ?? undefined,
        date: row.date,
      });
    } else {
      const row = await db
        .prepare("SELECT content, date FROM notes WHERE id = ?")
        .bind(item.id)
        .first<{ content: string | null; date: string }>();
      if (!row) continue;
      hydrated.push({
        kind: "note",
        id: item.id,
        slug: item.slug,
        title: item.title ?? "",
        content: row.content ?? undefined,
        date: row.date,
      });
    }
  }

  return hydrated;
}

/**
 * Delivery rows are the source of truth; the campaign's sent_count/failed_count
 * are a cache of them. Recomputing from a GROUP BY instead of applying deltas
 * means a partial failure can never leave the counters drifted from the rows.
 */
async function recomputeCounters(db: D1Database, campaignId: string): Promise<{ sent: number; failed: number }> {
  const { results } = await db
    .prepare("SELECT status, COUNT(*) as count FROM newsletter_deliveries WHERE campaign_id = ? GROUP BY status")
    .bind(campaignId)
    .all<{ status: string; count: number }>();

  let sent = 0;
  let failed = 0;
  for (const row of results) {
    if (row.status === "sent") sent = row.count;
    if (row.status === "failed") failed = row.count;
  }
  return { sent, failed };
}

function resolveSiteUrl(env: Env): string {
  return env.SITE_URL || "https://hearvie.dev";
}

function resolvePostalAddress(env: Env): string | undefined {
  return env.NEWSLETTER_POSTAL_ADDRESS || undefined;
}

function isPostalAddressConfigured(env: Env): boolean {
  return typeof env.NEWSLETTER_POSTAL_ADDRESS === "string" && env.NEWSLETTER_POSTAL_ADDRESS.trim().length > 0;
}

const adminCampaigns = new Hono<{ Bindings: Env }>();

// GET /api/admin/campaigns
adminCampaigns.get("/", async (c) => {
  const page = Math.max(1, Number(c.req.query("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? "20") || 20));
  const offset = (page - 1) * limit;

  const totalRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as total FROM newsletter_campaigns"
  ).first<{ total: number }>();

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM newsletter_campaigns
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`
  )
    .bind(limit, offset)
    .all<CampaignRow>();

  return c.json({
    items: results.map(rowToCampaign),
    pagination: {
      page,
      limit,
      total: totalRow?.total ?? 0,
    },
  });
});

// POST /api/admin/campaigns
adminCampaigns.post("/", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const validated = validateCampaignBody(body);
  if ("error" in validated) return c.json({ error: validated.error }, 400);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO newsletter_campaigns
      (id, subject, intro, style, items, status, total_recipients, sent_count, failed_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'draft', 0, 0, 0, ?, ?)`
  )
    .bind(id, validated.subject, validated.intro, validated.style, JSON.stringify(validated.items), now, now)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<CampaignRow>();

  return c.json(rowToCampaign(row!), 201);
});

// GET /api/admin/campaigns/:id
adminCampaigns.get("/:id", async (c) => {
  const id = c.req.param("id");
  const row = await c.env.DB.prepare("SELECT * FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<CampaignRow>();
  if (!row) return c.json({ error: "Not found" }, 404);

  const { results } = await c.env.DB.prepare(
    `SELECT status, COUNT(*) as count FROM newsletter_deliveries
     WHERE campaign_id = ? GROUP BY status`
  )
    .bind(id)
    .all<{ status: string; count: number }>();

  const deliveries = { pending: 0, sent: 0, failed: 0 } as Record<string, number>;
  for (const r of results) {
    deliveries[r.status] = r.count;
  }

  return c.json({
    ...rowToCampaign(row),
    deliveries,
    postalAddressConfigured: isPostalAddressConfigured(c.env),
  });
});

// PUT /api/admin/campaigns/:id
adminCampaigns.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Record<string, unknown>>();

  const existing = await c.env.DB.prepare("SELECT status FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<{ status: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);
  if (existing.status !== "draft") {
    return c.json({ error: "Only draft issues can be edited." }, 409);
  }

  const validated = validateCampaignBody(body);
  if ("error" in validated) return c.json({ error: validated.error }, 400);

  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `UPDATE newsletter_campaigns SET
      subject = ?, intro = ?, style = ?, items = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(validated.subject, validated.intro, validated.style, JSON.stringify(validated.items), now, id)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<CampaignRow>();

  return c.json(rowToCampaign(row!));
});

// DELETE /api/admin/campaigns/:id
adminCampaigns.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await c.env.DB.prepare("SELECT status FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<{ status: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);
  if (existing.status !== "draft") {
    return c.json({ error: "Only draft issues can be edited." }, 409);
  }

  await c.env.DB.prepare("DELETE FROM newsletter_campaigns WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// POST /api/admin/campaigns/:id/prepare
adminCampaigns.post("/:id/prepare", async (c) => {
  const id = c.req.param("id");

  const campaign = await c.env.DB.prepare("SELECT status FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<{ status: string }>();
  if (!campaign) return c.json({ error: "Not found" }, 404);
  if (campaign.status !== "draft") {
    // Re-running prepare against an in-flight campaign would silently fold
    // newly-subscribed people into an issue that has already started
    // sending to the original list — restricted to draft so the recipient
    // set is fixed the moment sending begins.
    return c.json({ error: "Campaign must be a draft to prepare." }, 409);
  }

  const { results: subscribers } = await c.env.DB.prepare(
    "SELECT id, email FROM newsletter_subscribers WHERE status = 'subscribed'"
  ).all<{ id: string; email: string }>();

  const now = new Date().toISOString();

  if (subscribers.length > 0) {
    const inserts = subscribers.map((sub) =>
      c.env.DB.prepare(
        `INSERT OR IGNORE INTO newsletter_deliveries (id, campaign_id, subscriber_id, email, status, created_at)
         VALUES (?, ?, ?, ?, 'pending', ?)`
      ).bind(crypto.randomUUID(), id, sub.id, sub.email, now)
    );
    await c.env.DB.batch(inserts);
  }

  const totalRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as total FROM newsletter_deliveries WHERE campaign_id = ?"
  )
    .bind(id)
    .first<{ total: number }>();
  const pendingRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as pending FROM newsletter_deliveries WHERE campaign_id = ? AND status = 'pending'"
  )
    .bind(id)
    .first<{ pending: number }>();

  const total = totalRow?.total ?? 0;

  await c.env.DB.prepare(
    "UPDATE newsletter_campaigns SET total_recipients = ?, status = 'sending', updated_at = ? WHERE id = ?"
  )
    .bind(total, now, id)
    .run();

  return c.json({ total, pending: pendingRow?.pending ?? 0 });
});

// POST /api/admin/campaigns/:id/send-chunk
adminCampaigns.post("/:id/send-chunk", async (c) => {
  const id = c.req.param("id");

  const campaign = await c.env.DB.prepare("SELECT * FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<CampaignRow>();
  if (!campaign) return c.json({ error: "Not found" }, 404);
  if (campaign.status !== "sending") {
    return c.json({ error: "Campaign must be in 'sending' status to send a chunk." }, 409);
  }

  const now = new Date().toISOString();

  // CRITICAL 2 & 3: sweep pending rows that must never be mailed out of the
  // queue before they ever reach the join below — a subscriber who
  // unsubscribed after `prepare` snapshotted them, or one whose token is
  // missing (nullable column, backfill is a manual step). Not limited to
  // this chunk's 100: this is bulk row-state cleanup, not a network call,
  // so it can't strand rows outside the window forever.
  await c.env.DB.prepare(
    `UPDATE newsletter_deliveries
     SET status = 'failed', error = 'unsubscribed before send'
     WHERE campaign_id = ? AND status = 'pending'
       AND subscriber_id IN (SELECT id FROM newsletter_subscribers WHERE status != 'subscribed')`
  )
    .bind(id)
    .run();

  await c.env.DB.prepare(
    `UPDATE newsletter_deliveries
     SET status = 'failed', error = 'missing unsubscribe token'
     WHERE campaign_id = ? AND status = 'pending'
       AND subscriber_id IN (SELECT id FROM newsletter_subscribers WHERE unsubscribe_token IS NULL)`
  )
    .bind(id)
    .run();

  const { results: pending } = await c.env.DB.prepare(
    `SELECT d.id as delivery_id, d.email, s.unsubscribe_token
     FROM newsletter_deliveries d
     JOIN newsletter_subscribers s ON s.id = d.subscriber_id
     WHERE d.campaign_id = ? AND d.status = 'pending' AND s.status = 'subscribed'
     LIMIT 100`
  )
    .bind(id)
    .all<{ delivery_id: string; email: string; unsubscribe_token: string | null }>();

  // A row stuck in 'sending' (crash between claim and settle, on this or a
  // prior call) is neither confirmed sent nor safely retryable — it must
  // never be silently counted as a success. Check for it before deciding
  // whether an empty pending queue means the campaign is actually done.
  const stuckRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM newsletter_deliveries WHERE campaign_id = ? AND status = 'sending'"
  )
    .bind(id)
    .first<{ count: number }>();
  const stuckCount = stuckRow?.count ?? 0;

  if (pending.length === 0) {
    const counters = await recomputeCounters(c.env.DB, id);

    if (stuckCount > 0) {
      // Do NOT finalize while any row is unaccounted for — that would report
      // "sent" for people who were never confirmed mailed and for whom no
      // endpoint could ever requeue them once the campaign left 'sending'.
      await c.env.DB.prepare("UPDATE newsletter_campaigns SET sent_count = ?, failed_count = ?, updated_at = ? WHERE id = ?")
        .bind(counters.sent, counters.failed, now, id)
        .run();
      return c.json({ sent: 0, failed: 0, remaining: 0, stuck: stuckCount, status: "sending" });
    }

    const finalStatus = counters.failed === 0 ? "sent" : "failed";
    await c.env.DB.prepare(
      "UPDATE newsletter_campaigns SET sent_count = ?, failed_count = ?, status = ?, sent_at = ?, updated_at = ? WHERE id = ?"
    )
      .bind(counters.sent, counters.failed, finalStatus, now, now, id)
      .run();
    return c.json({ sent: 0, failed: 0, remaining: 0, stuck: 0, status: finalStatus });
  }

  // CRITICAL 1: claim before sending, with a per-call identity. Status alone
  // ('pending' -> 'sending') isn't enough — two concurrent calls selecting
  // the same pending ids would both see the other's claimed rows sitting in
  // 'sending' and both would build and send the same batch. claim_id scopes
  // the re-select to rows *this* call's UPDATE actually flipped, so a second
  // caller's claim matches zero rows and it sends nothing.
  const claimId = crypto.randomUUID();
  const claimedAt = new Date().toISOString();
  const ids = pending.map((row) => row.delivery_id);
  const placeholders = ids.map(() => "?").join(",");

  await c.env.DB.prepare(
    `UPDATE newsletter_deliveries SET status = 'sending', claim_id = ?, claimed_at = ?
     WHERE campaign_id = ? AND status = 'pending' AND id IN (${placeholders})`
  )
    .bind(claimId, claimedAt, id, ...ids)
    .run();

  const { results: claimedRows } = await c.env.DB.prepare(
    `SELECT id FROM newsletter_deliveries WHERE campaign_id = ? AND claim_id = ?`
  )
    .bind(id, claimId)
    .all<{ id: string }>();
  const claimedIds = new Set(claimedRows.map((row) => row.id));
  const claimed = pending.filter((row) => claimedIds.has(row.delivery_id));

  let sentCount = 0;
  let failedCount = 0;

  if (claimed.length > 0) {
    const items = await hydrateItems(c.env.DB, parseJson<unknown[]>(campaign.items, []));
    const siteUrl = resolveSiteUrl(c.env);
    const postalAddress = resolvePostalAddress(c.env);
    const style = campaign.style === "full" ? "full" : "teaser";

    const emails = claimed.map((row) => {
      const renderInput = {
        subject: campaign.subject,
        intro: campaign.intro,
        style,
        items,
        siteUrl,
        // Guaranteed non-null: the sweep above already failed out every
        // pending row whose subscriber lacked a token.
        unsubscribeUrl: `${siteUrl}/api/newsletter/unsubscribe?token=${row.unsubscribe_token as string}`,
        postalAddress,
      };
      return {
        to: row.email,
        subject: campaign.subject,
        html: renderCampaignHtml(renderInput),
        text: renderCampaignText(renderInput),
      };
    });

    const emailProvider = getEmailProvider(c.env);
    const batchResult = await emailProvider.sendNewsletterBatch(emails);

    const settledAt = new Date().toISOString();
    const updates = claimed.map((row, index) => {
      const outcome = batchResult.results[index];
      if (outcome?.ok) {
        sentCount += 1;
        return c.env.DB.prepare(
          "UPDATE newsletter_deliveries SET status = 'sent', sent_at = ? WHERE id = ? AND claim_id = ?"
        ).bind(settledAt, row.delivery_id, claimId);
      }
      failedCount += 1;
      const error = outcome && !outcome.ok ? outcome.error : "Unknown send error";
      return c.env.DB.prepare(
        "UPDATE newsletter_deliveries SET status = 'failed', error = ? WHERE id = ? AND claim_id = ?"
      ).bind(error, row.delivery_id, claimId);
    });
    await c.env.DB.batch(updates);
  }

  const counters = await recomputeCounters(c.env.DB, id);
  await c.env.DB.prepare("UPDATE newsletter_campaigns SET sent_count = ?, failed_count = ?, updated_at = ? WHERE id = ?")
    .bind(counters.sent, counters.failed, now, id)
    .run();

  const remainingRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as remaining FROM newsletter_deliveries WHERE campaign_id = ? AND status = 'pending'"
  )
    .bind(id)
    .first<{ remaining: number }>();
  const stuckAfterRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM newsletter_deliveries WHERE campaign_id = ? AND status = 'sending'"
  )
    .bind(id)
    .first<{ count: number }>();

  return c.json({
    sent: sentCount,
    failed: failedCount,
    remaining: remainingRow?.remaining ?? 0,
    stuck: stuckAfterRow?.count ?? 0,
  });
});

// POST /api/admin/campaigns/:id/retry-failed
adminCampaigns.post("/:id/retry-failed", async (c) => {
  const id = c.req.param("id");

  const campaign = await c.env.DB.prepare("SELECT id FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!campaign) return c.json({ error: "Not found" }, 404);

  // Rows stranded in 'sending' (claim happened, settle never did — a crash
  // mid-send) also need a way back to 'pending'. A 15-minute cutoff on
  // claimed_at keeps this from yanking rows out from under a chunk that is
  // still legitimately in flight — only claims old enough to be certainly
  // dead get reclaimed.
  const staleCutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const requeueRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM newsletter_deliveries
     WHERE campaign_id = ?
       AND (status = 'failed' OR (status = 'sending' AND claimed_at IS NOT NULL AND claimed_at <= ?))`
  )
    .bind(id, staleCutoff)
    .first<{ count: number }>();
  const requeued = requeueRow?.count ?? 0;

  await c.env.DB.prepare(
    `UPDATE newsletter_deliveries
     SET status = 'pending', error = NULL, claim_id = NULL, claimed_at = NULL
     WHERE campaign_id = ?
       AND (status = 'failed' OR (status = 'sending' AND claimed_at IS NOT NULL AND claimed_at <= ?))`
  )
    .bind(id, staleCutoff)
    .run();

  // send-chunk requires status = 'sending' (IMPORTANT 7). Without this, a
  // campaign that finalized to 'failed' would requeue its rows to 'pending'
  // but stay permanently un-sendable — retry-failed's whole point is to
  // make the chunk loop resumable, so it has to put the campaign back into
  // the state that loop runs in. A requeue of zero leaves status untouched,
  // so a fully-sent campaign can't be nudged back into 'sending' by mistake.
  const counters = await recomputeCounters(c.env.DB, id);

  if (requeued > 0) {
    await c.env.DB.prepare(
      "UPDATE newsletter_campaigns SET status = 'sending', sent_count = ?, failed_count = ?, updated_at = ? WHERE id = ?"
    )
      .bind(counters.sent, counters.failed, new Date().toISOString(), id)
      .run();
  } else {
    await c.env.DB.prepare("UPDATE newsletter_campaigns SET sent_count = ?, failed_count = ?, updated_at = ? WHERE id = ?")
      .bind(counters.sent, counters.failed, new Date().toISOString(), id)
      .run();
  }

  return c.json({ requeued });
});

// POST /api/admin/campaigns/:id/test
adminCampaigns.post("/:id/test", async (c) => {
  const id = c.req.param("id");

  const campaign = await c.env.DB.prepare("SELECT * FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<CampaignRow>();
  if (!campaign) return c.json({ error: "Not found" }, 404);

  let body: { email?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return c.json({ error: "A valid email is required." }, 400);
  }

  const subscriber = await c.env.DB.prepare(
    "SELECT unsubscribe_token FROM newsletter_subscribers ORDER BY created_at ASC LIMIT 1"
  ).first<{ unsubscribe_token: string | null }>();
  const token = subscriber?.unsubscribe_token || "preview-token";

  const items = await hydrateItems(c.env.DB, parseJson<unknown[]>(campaign.items, []));
  const siteUrl = resolveSiteUrl(c.env);
  const style = campaign.style === "full" ? "full" : "teaser";
  const subject = `[TEST] ${campaign.subject}`;

  const renderInput = {
    subject,
    intro: campaign.intro,
    style,
    items,
    siteUrl,
    unsubscribeUrl: `${siteUrl}/api/newsletter/unsubscribe?token=${token}`,
    postalAddress: resolvePostalAddress(c.env),
  };

  const emailProvider = getEmailProvider(c.env);
  const batchResult = await emailProvider.sendNewsletterBatch([
    {
      to: email,
      subject,
      html: renderCampaignHtml(renderInput),
      text: renderCampaignText(renderInput),
    },
  ]);

  const outcome = batchResult.results[0];
  if (outcome && !outcome.ok) {
    return c.json({ error: outcome.error }, 502);
  }

  return c.json({ success: true });
});

export default adminCampaigns;
