# Hono Worker — Setup Guide

This document walks through every step taken to set up the Cloudflare Worker backend from the blank template to a fully seeded, deployed API.

---

## Prerequisites

- Node.js installed
- Wrangler authenticated (`npx wrangler login`)
- A Cloudflare account with Workers & D1 enabled

---

## Step 1 — Create the D1 Database

D1 is Cloudflare's serverless SQLite database. You create it once and Cloudflare manages it.

```bash
# From inside Hono/my-hono-app/
npx wrangler d1 create portfolio-db
```

This outputs a snippet like:

```json
{
  "d1_databases": [
    {
      "binding": "portfolio_db",
      "database_name": "portfolio-db",
      "database_id": "aa05a4e3-6f3f-465d-99f3-bf52e27576fa"
    }
  ]
}
```

Copy the `database_id` — you'll need it in the next step.

---

## Step 2 — Update `wrangler.json`

`wrangler.json` is the Cloudflare configuration file. It tells Wrangler what your worker is called, what bindings it uses, and how to deploy it.

Add the D1 binding and placeholder vars to `wrangler.json`:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-hono-app",
  "account_id": "<your-cloudflare-account-id>",
  "main": "./src/worker/index.ts",
  "compatibility_date": "2025-10-08",
  "compatibility_flags": ["nodejs_compat"],
  "observability": { "enabled": true },
  "upload_source_maps": true,
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "portfolio-db",
      "database_id": "<your-database-id>"
    }
  ],
  "vars": {
    "ADMIN_EMAIL": "",
    "ADMIN_PASSWORD": "",
    "JWT_SECRET": ""
  }
}
```

**Why `vars` with empty strings?**
Secrets set via `wrangler secret put` don't appear in `wrangler.json` at all, so TypeScript wouldn't know the variables exist. Declaring them here as empty strings gives the type generator something to work with — the actual values come from the secrets you set separately and override these at runtime.

---

## Step 3 — Regenerate TypeScript Types

After updating `wrangler.json`, run this to generate `worker-configuration.d.ts`. This is what gives `c.env.DB`, `c.env.ADMIN_EMAIL`, etc. their TypeScript types inside the worker.

```bash
npm run cf-typegen
```

This regenerates `worker-configuration.d.ts` at the project root. You need to rerun this every time you change `wrangler.json`.

---

## Step 4 — Run the Schema Migration

The schema file (`src/worker/db/schema.sql`) defines all five tables: `projects`, `blog_posts`, `notes`, `stream_events`, and `site_content`.

### Local (for `npm run dev`)

```bash
npx wrangler d1 execute portfolio-db --file=src/worker/db/schema.sql
```

### Remote (the actual Cloudflare database)

```bash
npx wrangler d1 execute portfolio-db --file=src/worker/db/schema.sql --remote
```

You need both. Without `--remote`, changes only apply to the local `.wrangler/` SQLite file used during dev. Without the local one, `npm run dev` starts with empty tables.

---

## Step 5 — Seed the Database

The seed file (`src/worker/db/seed.sql`) inserts all the mock content from the frontend: 13 projects, 5 blog posts, 4 notes, 4 stream events, and 7 site content sections (nav, footer, home, about, contact, works, streams).

### Local

```bash
npx wrangler d1 execute portfolio-db --file=src/worker/db/seed.sql
```

### Remote

```bash
npx wrangler d1 execute portfolio-db --file=src/worker/db/seed.sql --remote
```

The seed file uses `INSERT OR REPLACE INTO` so it's safe to run multiple times — it won't create duplicates.

---

## Step 6 — Set Secrets

Secrets are sensitive values (passwords, tokens) that should never live in `wrangler.json` or source control. You set them once via CLI or the dashboard and Cloudflare encrypts them.

### Via CLI

```bash
echo "your-admin-email" | npx wrangler secret put ADMIN_EMAIL
echo "your-admin-password" | npx wrangler secret put ADMIN_PASSWORD

# Generate a strong random JWT secret
openssl rand -hex 32 | npx wrangler secret put JWT_SECRET
```

### Via Cloudflare Dashboard (alternative)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → find `my-hono-app`
3. **Settings** → **Variables and Secrets**
4. Under **Secrets**, add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET`

Secrets set via the dashboard or CLI override the empty placeholder values in `vars`.

---

## Step 7 — Verify TypeScript Compiles

```bash
npx tsc -b
```

No output means no errors. This checks all three TypeScript configs (worker, app, node) via project references.

---

## Step 8 — Run Locally

```bash
npm run dev
```

The Cloudflare Vite plugin starts the worker and the React app together. The worker runs on `localhost:5173`. Test the API:

```bash
# Public endpoints
curl http://localhost:5173/api/projects
curl http://localhost:5173/api/blog
curl http://localhost:5173/api/notes
curl http://localhost:5173/api/streams
curl http://localhost:5173/api/content/navigation

# Get a JWT token
curl -X POST http://localhost:5173/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hearvie.dev","password":"your-password"}'

# Use the token on a protected route
curl http://localhost:5173/api/admin/projects \
  -H "Authorization: Bearer <token-from-above>"
```

---

## Step 9 — Deploy

```bash
npm run deploy
```

This runs `wrangler deploy`, which bundles the worker and pushes it to Cloudflare's edge network. After deploy, your API is live at `https://my-hono-app.<your-subdomain>.workers.dev`.

---

## Useful Commands Reference

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local dev server (worker + React) |
| `npm run build` | TypeScript check + Vite bundle |
| `npm run deploy` | Deploy to Cloudflare |
| `npm run cf-typegen` | Regenerate `worker-configuration.d.ts` from `wrangler.json` |
| `npx wrangler d1 execute portfolio-db --command="SELECT * FROM projects" --remote` | Query the remote D1 database |
| `npx wrangler d1 execute portfolio-db --command="SELECT * FROM projects"` | Query the local D1 database |
| `npx wrangler secret list` | List secret names (not values) for the worker |
| `npx wrangler tail` | Stream live logs from the deployed worker |

---

## What Was Built

```
src/worker/
├── index.ts                  # Entry — mounts all routers, global CORS
├── types.ts                  # D1 row interfaces + row→object mappers
├── middleware/
│   ├── cors.ts               # CORS headers (dev + production origins)
│   └── auth.ts               # HS256 JWT sign/verify + requireAuth middleware
├── routes/
│   ├── projects.ts           # GET /api/projects, GET /api/projects/:id
│   ├── blog.ts               # GET /api/blog, GET /api/blog/:slug
│   ├── notes.ts              # GET /api/notes, GET /api/notes/:slug
│   ├── streams.ts            # GET /api/streams
│   ├── content.ts            # GET /api/content/:section
│   └── admin/
│       ├── auth.ts           # POST /api/admin/auth/login
│       ├── projects.ts       # Full CRUD /api/admin/projects[/:id]
│       ├── blog.ts           # Full CRUD /api/admin/blog[/:id]
│       ├── notes.ts          # Full CRUD /api/admin/notes[/:id]
│       ├── streams.ts        # Full CRUD /api/admin/streams[/:id]
│       └── content.ts        # GET + PUT /api/admin/content/:section
└── db/
    ├── schema.sql            # CREATE TABLE statements for all 5 tables
    └── seed.sql              # All 13 projects, 5 posts, 4 notes, 4 events, 7 content sections
```

---

## Re-seeding / Resetting

If you need to reset the database to the original mock data:

```bash
# Drop and recreate all tables
npx wrangler d1 execute portfolio-db --command="DROP TABLE IF EXISTS projects; DROP TABLE IF EXISTS blog_posts; DROP TABLE IF EXISTS notes; DROP TABLE IF EXISTS stream_events; DROP TABLE IF EXISTS site_content;" --remote

# Re-run schema + seed
npx wrangler d1 execute portfolio-db --file=src/worker/db/schema.sql --remote
npx wrangler d1 execute portfolio-db --file=src/worker/db/seed.sql --remote
```
