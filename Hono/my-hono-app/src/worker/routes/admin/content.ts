import { Hono } from "hono";

const adminContent = new Hono<{ Bindings: Env }>();

// GET /api/admin/content/:section
adminContent.get("/:section", async (c) => {
  const section = c.req.param("section");
  const row = await c.env.DB.prepare(
    "SELECT value FROM site_content WHERE key = ?"
  )
    .bind(section)
    .first<{ value: string }>();
  if (!row) return c.json({ error: "Section not found" }, 404);
  try {
    return c.json(JSON.parse(row.value));
  } catch {
    return c.json({ error: "Malformed content" }, 500);
  }
});

// PUT /api/admin/content/:section  — upsert a content section
adminContent.put("/:section", async (c) => {
  const section = c.req.param("section");
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const now = new Date().toISOString();
  await c.env.DB.prepare(
    `INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  )
    .bind(section, JSON.stringify(body), now)
    .run();
  return c.json({ success: true, key: section });
});

export default adminContent;
