import { Hono } from "hono";

const VALID_STATUS = ["subscribed", "unsubscribed", "bounced"] as const;

type NewsletterStatus = (typeof VALID_STATUS)[number];

interface SubscriberRow {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: NewsletterStatus;
  created_at: string;
  updated_at: string;
}

const adminNewsletter = new Hono<{ Bindings: Env }>();

adminNewsletter.get("/", async (c) => {
  const status = c.req.query("status")?.trim();
  const q = c.req.query("q")?.trim() ?? "";
  const page = Math.max(1, Number(c.req.query("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? "20") || 20));
  const offset = (page - 1) * limit;

  const where: string[] = [];
  const binds: unknown[] = [];

  if (status && VALID_STATUS.includes(status as NewsletterStatus)) {
    where.push("status = ?");
    binds.push(status);
  }

  if (q) {
    where.push("(LOWER(email) LIKE ? OR LOWER(COALESCE(name, '')) LIKE ?)");
    binds.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const totalRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM newsletter_subscribers ${whereClause}`
  )
    .bind(...binds)
    .first<{ total: number }>();

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM newsletter_subscribers ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`
  )
    .bind(...binds, limit, offset)
    .all<SubscriberRow>();

  return c.json({
    items: results,
    pagination: {
      page,
      limit,
      total: totalRow?.total ?? 0,
    },
  });
});

adminNewsletter.put("/:id/status", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ status?: NewsletterStatus }>();

  const status = body.status;
  if (!status || !VALID_STATUS.includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  const now = new Date().toISOString();
  const existing = await c.env.DB.prepare("SELECT id FROM newsletter_subscribers WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();

  if (!existing) return c.json({ error: "Not found" }, 404);

  await c.env.DB.prepare(
    "UPDATE newsletter_subscribers SET status = ?, updated_at = ? WHERE id = ?"
  )
    .bind(status, now, id)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM newsletter_subscribers WHERE id = ?")
    .bind(id)
    .first<SubscriberRow>();

  return c.json(row);
});

export default adminNewsletter;
