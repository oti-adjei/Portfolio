import { Hono } from "hono";
import { type StreamEventRow, rowToStreamEvent } from "../../types.js";

const adminStreams = new Hono<{ Bindings: Env }>();

// GET /api/admin/streams
adminStreams.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM stream_events ORDER BY date ASC, time ASC"
  ).all<StreamEventRow>();
  return c.json(results.map(rowToStreamEvent));
});

// POST /api/admin/streams
adminStreams.post("/", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = (body.id as string | undefined) ?? crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO stream_events (id, title, date, time, platform, stream_url, description, is_recurring, recurring_day, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.title,
      body.date ?? null,
      body.time ?? null,
      body.platform,
      body.stream_url ?? null,
      body.description ?? null,
      body.is_recurring ? 1 : 0,
      body.recurring_day ?? null,
      now,
      now
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM stream_events WHERE id = ?")
    .bind(id)
    .first<StreamEventRow>();
  return c.json(rowToStreamEvent(row!), 201);
});

// PUT /api/admin/streams/:id
adminStreams.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Record<string, unknown>>();
  const now = new Date().toISOString();

  const existing = await c.env.DB.prepare("SELECT id FROM stream_events WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);

  await c.env.DB.prepare(
    `UPDATE stream_events SET
      title = ?, date = ?, time = ?, platform = ?, stream_url = ?,
      description = ?, is_recurring = ?, recurring_day = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      body.title,
      body.date ?? null,
      body.time ?? null,
      body.platform,
      body.stream_url ?? null,
      body.description ?? null,
      body.is_recurring ? 1 : 0,
      body.recurring_day ?? null,
      now,
      id
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM stream_events WHERE id = ?")
    .bind(id)
    .first<StreamEventRow>();
  return c.json(rowToStreamEvent(row!));
});

// DELETE /api/admin/streams/:id
adminStreams.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT id FROM stream_events WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("DELETE FROM stream_events WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

export default adminStreams;
