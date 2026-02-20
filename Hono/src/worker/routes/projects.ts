import { Hono } from "hono";
import { type ProjectRow, rowToProject } from "../types.js";

const projects = new Hono<{ Bindings: Env }>();

// GET /api/projects
projects.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, created_at DESC"
  ).all<ProjectRow>();
  return c.json(results.map(rowToProject));
});

// GET /api/projects/:id
projects.get("/:id", async (c) => {
  const id = c.req.param("id");
  const row = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE id = ? AND published = 1"
  )
    .bind(id)
    .first<ProjectRow>();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(rowToProject(row));
});

export default projects;
