import { Hono } from "hono";

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

export default adminCampaigns;
