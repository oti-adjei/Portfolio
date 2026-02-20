import { Hono } from "hono";

const content = new Hono<{ Bindings: Env }>();

// GET /api/content/:section
// Returns a JSON blob for the requested site content section.
// e.g. /api/content/navigation, /api/content/homePage, /api/content/aboutPage
content.get("/:section", async (c) => {
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

export default content;
