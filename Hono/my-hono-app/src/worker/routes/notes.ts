import { Hono } from "hono";
import { type NoteRow, rowToNote } from "../types.js";

const notes = new Hono<{ Bindings: Env }>();

// GET /api/notes  — list summary (no content body)
notes.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, title, slug, date, category, published, created_at, updated_at FROM notes WHERE published = 1 ORDER BY date DESC"
  ).all<NoteRow & { content: string }>(); // content omitted via SELECT but type needs it
  // Return without content for list view
  return c.json(
    results.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      date: row.date,
      category: row.category ?? undefined,
      published: row.published === 1,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  );
});

// GET /api/notes/:slug
notes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    "SELECT * FROM notes WHERE slug = ? AND published = 1"
  )
    .bind(slug)
    .first<NoteRow>();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(rowToNote(row));
});

export default notes;
