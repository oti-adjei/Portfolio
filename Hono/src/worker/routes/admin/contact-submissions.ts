import { Hono } from "hono";

const VALID_STATUS = ["new", "read", "replied", "archived"] as const;

type ContactStatus = (typeof VALID_STATUS)[number];

interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

const adminContactSubmissions = new Hono<{ Bindings: Env }>();

adminContactSubmissions.get("/", async (c) => {
  const status = c.req.query("status")?.trim();
  const q = c.req.query("q")?.trim() ?? "";
  const page = Math.max(1, Number(c.req.query("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? "20") || 20));
  const offset = (page - 1) * limit;

  const where: string[] = [];
  const binds: unknown[] = [];

  if (status && VALID_STATUS.includes(status as ContactStatus)) {
    where.push("status = ?");
    binds.push(status);
  }

  if (q) {
    where.push("(LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(COALESCE(subject, '')) LIKE ? OR LOWER(message) LIKE ?)");
    binds.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const totalRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM contact_submissions ${whereClause}`
  )
    .bind(...binds)
    .first<{ total: number }>();

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM contact_submissions ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`
  )
    .bind(...binds, limit, offset)
    .all<ContactRow>();

  return c.json({
    items: results,
    pagination: {
      page,
      limit,
      total: totalRow?.total ?? 0,
    },
  });
});

adminContactSubmissions.put("/:id/status", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ status?: ContactStatus }>();

  const status = body.status;
  if (!status || !VALID_STATUS.includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  const now = new Date().toISOString();
  const existing = await c.env.DB.prepare("SELECT id FROM contact_submissions WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();

  if (!existing) return c.json({ error: "Not found" }, 404);

  await c.env.DB.prepare(
    "UPDATE contact_submissions SET status = ?, updated_at = ? WHERE id = ?"
  )
    .bind(status, now, id)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM contact_submissions WHERE id = ?")
    .bind(id)
    .first<ContactRow>();

  return c.json(row);
});

export default adminContactSubmissions;
