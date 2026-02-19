import { Hono } from "hono";
import { cors } from "./middleware/cors.js";
import { requireAuth } from "./middleware/auth.js";

// Public routes
import projects from "./routes/projects.js";
import blog from "./routes/blog.js";
import notes from "./routes/notes.js";
import streams from "./routes/streams.js";
import content from "./routes/content.js";

// Admin routes
import adminAuth from "./routes/admin/auth.js";
import adminProjects from "./routes/admin/projects.js";
import adminBlog from "./routes/admin/blog.js";
import adminNotes from "./routes/admin/notes.js";
import adminStreams from "./routes/admin/streams.js";
import adminContent from "./routes/admin/content.js";

const app = new Hono<{ Bindings: Env }>();

// Apply CORS to all routes
app.use("*", cors);

// ── Public API ──────────────────────────────────
app.route("/api/projects", projects);
app.route("/api/blog", blog);
app.route("/api/notes", notes);
app.route("/api/streams", streams);
app.route("/api/content", content);

// ── Admin auth (no requireAuth guard — it IS the login) ──
app.route("/api/admin/auth", adminAuth);

// ── Protected admin routes ──────────────────────
app.use("/api/admin/*", requireAuth);
app.route("/api/admin/projects", adminProjects);
app.route("/api/admin/blog", adminBlog);
app.route("/api/admin/notes", adminNotes);
app.route("/api/admin/streams", adminStreams);
app.route("/api/admin/content", adminContent);

export default app;
