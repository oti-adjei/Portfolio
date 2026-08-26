import { Hono } from "hono";
import { type ProjectRow, rowToProject } from "../../types.js";

/**
 * The public works page derives its filter chips from distinct category values and matches
 * them case-sensitively, so 'web' and 'WEB' would render as two chips for one category.
 * Upper case is the established convention in the data.
 */
function normalizeCategory(value: unknown): string {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

const adminProjects = new Hono<{ Bindings: Env }>();

// GET /api/admin/projects  — all projects including unpublished
adminProjects.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC"
  ).all<ProjectRow>();
  return c.json(results.map(rowToProject));
});

// POST /api/admin/projects
adminProjects.post("/", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = body.id as string | undefined ?? crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO projects (id, title, category, year, thumbnail_url, thumbnail_alt, tags,
      overview_description, overview_client, overview_duration, overview_role,
      details_challenge, details_solution, details_results, gallery_images, links,
      sort_order, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.title,
      normalizeCategory(body.category),
      body.year ?? null,
      (body.thumbnail as { url?: string } | undefined)?.url ?? null,
      (body.thumbnail as { alt?: string } | undefined)?.alt ?? null,
      JSON.stringify(body.tags ?? []),
      (body.overview as { description?: string } | undefined)?.description ?? null,
      (body.overview as { client?: string } | undefined)?.client ?? null,
      (body.overview as { duration?: string } | undefined)?.duration ?? null,
      (body.overview as { role?: string } | undefined)?.role ?? null,
      (body.details as { challenge?: string } | undefined)?.challenge ?? null,
      (body.details as { solution?: string } | undefined)?.solution ?? null,
      JSON.stringify((body.details as { results?: unknown[] } | undefined)?.results ?? []),
      JSON.stringify((body.gallery as { images?: unknown[] } | undefined)?.images ?? []),
      JSON.stringify(body.links ?? []),
      body.sort_order ?? 0,
      body.published !== false ? 1 : 0,
      now,
      now
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM projects WHERE id = ?")
    .bind(id)
    .first<ProjectRow>();
  return c.json(rowToProject(row!), 201);
});

// PUT /api/admin/projects/:id
adminProjects.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Record<string, unknown>>();
  const now = new Date().toISOString();

  const existing = await c.env.DB.prepare("SELECT id, published FROM projects WHERE id = ?")
    .bind(id)
    .first<{ id: string; published: number }>();
  if (!existing) return c.json({ error: "Not found" }, 404);

  // Preserve the current state when the client doesn't send `published`. This was
  // `body.published !== false ? 1 : 0`, which treated an absent field as "publish" — so a
  // save from any client unaware of the flag silently published a draft.
  const published =
    typeof body.published === "boolean" ? (body.published ? 1 : 0) : existing.published;

  await c.env.DB.prepare(
    `UPDATE projects SET
      title = ?, category = ?, year = ?, thumbnail_url = ?, thumbnail_alt = ?, tags = ?,
      overview_description = ?, overview_client = ?, overview_duration = ?, overview_role = ?,
      details_challenge = ?, details_solution = ?, details_results = ?, gallery_images = ?, links = ?,
      sort_order = ?, published = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      body.title,
      normalizeCategory(body.category),
      body.year ?? null,
      (body.thumbnail as { url?: string } | undefined)?.url ?? null,
      (body.thumbnail as { alt?: string } | undefined)?.alt ?? null,
      JSON.stringify(body.tags ?? []),
      (body.overview as { description?: string } | undefined)?.description ?? null,
      (body.overview as { client?: string } | undefined)?.client ?? null,
      (body.overview as { duration?: string } | undefined)?.duration ?? null,
      (body.overview as { role?: string } | undefined)?.role ?? null,
      (body.details as { challenge?: string } | undefined)?.challenge ?? null,
      (body.details as { solution?: string } | undefined)?.solution ?? null,
      JSON.stringify((body.details as { results?: unknown[] } | undefined)?.results ?? []),
      JSON.stringify((body.gallery as { images?: unknown[] } | undefined)?.images ?? []),
      JSON.stringify(body.links ?? []),
      body.sort_order ?? 0,
      published,
      now,
      id
    )
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM projects WHERE id = ?")
    .bind(id)
    .first<ProjectRow>();
  return c.json(rowToProject(row!));
});

// DELETE /api/admin/projects/:id
adminProjects.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT id FROM projects WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

export default adminProjects;
