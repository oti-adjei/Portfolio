import { Hono } from "hono";
import { type BlogPostRow, rowToBlogPost } from "../types.js";

const blog = new Hono<{ Bindings: Env }>();

// GET /api/blog  — list summary (no content body to keep response small)
blog.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, title, slug, date, excerpt, external_url, tags, published, created_at, updated_at FROM blog_posts WHERE published = 1 ORDER BY date DESC"
  ).all<BlogPostRow>();
  return c.json(results.map(rowToBlogPost));
});

// GET /api/blog/:slug
blog.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    "SELECT * FROM blog_posts WHERE slug = ? AND published = 1"
  )
    .bind(slug)
    .first<BlogPostRow>();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(rowToBlogPost(row));
});

export default blog;
