import { Hono } from "hono";
import { type BlogPostRow, rowToBlogPost } from "../../types.js";

const adminBlog = new Hono<{ Bindings: Env }>();

// GET /api/admin/blog  — all posts including unpublished
adminBlog.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM blog_posts ORDER BY date DESC"
  ).all<BlogPostRow>();
  return c.json(results.map(rowToBlogPost));
});

// POST /api/admin/blog
adminBlog.post("/", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = (body.id as string | undefined) ?? crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO blog_posts (id, title, slug, date, excerpt, content, external_url, tags, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.title,
      body.slug,
      body.date,
      body.excerpt ?? null,
      body.content ?? null,
      body.external_url ?? null,
      JSON.stringify(body.tags ?? []),
      body.published ? 1 : 0,
      now,
      now
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM blog_posts WHERE id = ?")
    .bind(id)
    .first<BlogPostRow>();
  return c.json(rowToBlogPost(row!), 201);
});

// PUT /api/admin/blog/:id
adminBlog.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Record<string, unknown>>();
  const now = new Date().toISOString();

  const existing = await c.env.DB.prepare("SELECT id FROM blog_posts WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);

  await c.env.DB.prepare(
    `UPDATE blog_posts SET
      title = ?, slug = ?, date = ?, excerpt = ?, content = ?, external_url = ?,
      tags = ?, published = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      body.title,
      body.slug,
      body.date,
      body.excerpt ?? null,
      body.content ?? null,
      body.external_url ?? null,
      JSON.stringify(body.tags ?? []),
      body.published ? 1 : 0,
      now,
      id
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM blog_posts WHERE id = ?")
    .bind(id)
    .first<BlogPostRow>();
  return c.json(rowToBlogPost(row!));
});

// DELETE /api/admin/blog/:id
adminBlog.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT id FROM blog_posts WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

export default adminBlog;
