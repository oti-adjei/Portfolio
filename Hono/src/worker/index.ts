import { Hono } from "hono";
import { cors } from "./middleware/cors.js";
import { requireAuth } from "./middleware/auth.js";

// Public routes
import projects from "./routes/projects.js";
import blog from "./routes/blog.js";
import notes from "./routes/notes.js";
import streams from "./routes/streams.js";
import content from "./routes/content.js";
import newsletter from "./routes/newsletter.js";
import contact from "./routes/contact.js";

// Admin routes
import adminAuth from "./routes/admin/auth.js";
import adminProjects from "./routes/admin/projects.js";
import adminBlog from "./routes/admin/blog.js";
import adminNotes from "./routes/admin/notes.js";
import adminStreams from "./routes/admin/streams.js";
import adminContent from "./routes/admin/content.js";
import adminNewsletter from "./routes/admin/newsletter.js";
import adminContactSubmissions from "./routes/admin/contact-submissions.js";

const app = new Hono<{ Bindings: Env }>();

// Apply CORS to all routes
app.use("*", cors);


//healthcheck
app.get("/api/health", (c) => c.json({ status: "ok" }));


// ── Public API ──────────────────────────────────
app.route("/api/projects", projects);
app.route("/api/blog", blog);
app.route("/api/notes", notes);
app.route("/api/streams", streams);
app.route("/api/content", content);
app.route("/api/newsletter", newsletter);
app.route("/api/contact", contact);

// ── Admin auth (no requireAuth guard — it IS the login) ──
app.route("/api/admin/auth", adminAuth);

// ── Protected admin routes ──────────────────────
app.use("/api/admin/*", requireAuth);
app.route("/api/admin/projects", adminProjects);
app.route("/api/admin/blog", adminBlog);
app.route("/api/admin/notes", adminNotes);
app.route("/api/admin/streams", adminStreams);
app.route("/api/admin/content", adminContent);
app.route("/api/admin/newsletter", adminNewsletter);
app.route("/api/admin/contact-submissions", adminContactSubmissions);

export default app;
