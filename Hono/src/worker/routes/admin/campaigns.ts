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

function resolveSiteUrl(env: Env): string {
  return env.SITE_URL || "https://hearvie.dev";
}

function resolvePostalAddress(env: Env): string | undefined {
  return env.NEWSLETTER_POSTAL_ADDRESS || undefined;
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

  return c.json({ ...rowToCampaign(row), deliveries });
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
  if (campaign.status !== "draft" && campaign.status !== "sending") {
    return c.json({ error: "Campaign must be a draft or already sending to prepare." }, 409);
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

  const { results: pending } = await c.env.DB.prepare(
    `SELECT d.id as delivery_id, d.email, s.unsubscribe_token
     FROM newsletter_deliveries d
     JOIN newsletter_subscribers s ON s.id = d.subscriber_id
     WHERE d.campaign_id = ? AND d.status = 'pending'
     LIMIT 100`
  )
    .bind(id)
    .all<{ delivery_id: string; email: string; unsubscribe_token: string | null }>();

  const now = new Date().toISOString();

  if (pending.length === 0) {
    const finalStatus = campaign.failed_count === 0 ? "sent" : "failed";
    await c.env.DB.prepare("UPDATE newsletter_campaigns SET status = ?, sent_at = ? WHERE id = ?")
      .bind(finalStatus, now, id)
      .run();
    return c.json({ sent: 0, failed: 0, remaining: 0, status: finalStatus });
  }

  const items = await hydrateItems(c.env.DB, parseJson<unknown[]>(campaign.items, []));
  const siteUrl = resolveSiteUrl(c.env);
  const postalAddress = resolvePostalAddress(c.env);
  const style = campaign.style === "full" ? "full" : "teaser";

  const emails = pending.map((row) => {
    const token = row.unsubscribe_token || "preview-token";
    const renderInput = {
      subject: campaign.subject,
      intro: campaign.intro,
      style,
      items,
      siteUrl,
      unsubscribeUrl: `${siteUrl}/api/newsletter/unsubscribe?token=${token}`,
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

  let sentCount = 0;
  let failedCount = 0;
  const updates = pending.map((row, index) => {
    const outcome = batchResult.results[index];
    if (outcome?.ok) {
      sentCount += 1;
      return c.env.DB.prepare("UPDATE newsletter_deliveries SET status = 'sent', sent_at = ? WHERE id = ?").bind(
        now,
        row.delivery_id
      );
    }
    failedCount += 1;
    const error = outcome && !outcome.ok ? outcome.error : "Unknown send error";
    return c.env.DB.prepare("UPDATE newsletter_deliveries SET status = 'failed', error = ? WHERE id = ?").bind(
      error,
      row.delivery_id
    );
  });
  await c.env.DB.batch(updates);

  await c.env.DB.prepare(
    "UPDATE newsletter_campaigns SET sent_count = sent_count + ?, failed_count = failed_count + ?, updated_at = ? WHERE id = ?"
  )
    .bind(sentCount, failedCount, now, id)
    .run();

  const remainingRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as remaining FROM newsletter_deliveries WHERE campaign_id = ? AND status = 'pending'"
  )
    .bind(id)
    .first<{ remaining: number }>();

  return c.json({ sent: sentCount, failed: failedCount, remaining: remainingRow?.remaining ?? 0 });
});

// POST /api/admin/campaigns/:id/retry-failed
adminCampaigns.post("/:id/retry-failed", async (c) => {
  const id = c.req.param("id");

  const campaign = await c.env.DB.prepare("SELECT id FROM newsletter_campaigns WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!campaign) return c.json({ error: "Not found" }, 404);

  const failedRow = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM newsletter_deliveries WHERE campaign_id = ? AND status = 'failed'"
  )
    .bind(id)
    .first<{ count: number }>();
  const requeued = failedRow?.count ?? 0;

  await c.env.DB.prepare(
    "UPDATE newsletter_deliveries SET status = 'pending', error = NULL WHERE campaign_id = ? AND status = 'failed'"
  )
    .bind(id)
    .run();

  await c.env.DB.prepare("UPDATE newsletter_campaigns SET failed_count = 0, updated_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), id)
    .run();

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
