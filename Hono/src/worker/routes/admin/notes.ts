import { Hono } from "hono";
import { type NoteRow, rowToNote } from "../../types.js";

const adminNotes = new Hono<{ Bindings: Env }>();

// GET /api/admin/notes  — all notes including unpublished
adminNotes.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM notes ORDER BY date DESC"
  ).all<NoteRow>();
  return c.json(results.map(rowToNote));
});

// POST /api/admin/notes
adminNotes.post("/", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = (body.id as string | undefined) ?? crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO notes (id, title, slug, date, content, category, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.title,
      body.slug,
      body.date,
      body.content,
      body.category ?? null,
      body.published ? 1 : 0,
      now,
      now
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM notes WHERE id = ?")
    .bind(id)
    .first<NoteRow>();
  return c.json(rowToNote(row!), 201);
});

// PUT /api/admin/notes/:id
adminNotes.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Record<string, unknown>>();
  const now = new Date().toISOString();

  const existing = await c.env.DB.prepare("SELECT id FROM notes WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);

  await c.env.DB.prepare(
    `UPDATE notes SET
      title = ?, slug = ?, date = ?, content = ?, category = ?, published = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      body.title,
      body.slug,
      body.date,
      body.content,
      body.category ?? null,
      body.published ? 1 : 0,
      now,
      id
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM notes WHERE id = ?")
    .bind(id)
    .first<NoteRow>();
  return c.json(rowToNote(row!));
});

// DELETE /api/admin/notes/:id
adminNotes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT id FROM notes WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

export default adminNotes;
