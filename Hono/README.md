# Portfolio API — Hono on Cloudflare Workers

Content API for [the portfolio site](../frontend). Hono 4 on Cloudflare Workers, D1 (SQLite) for storage, JWT for admin auth, Resend for outbound email.

The Worker also serves a small static landing page (`index.html`, built to `dist/client`) so the API domain isn't blank. The actual site is a separate build in `frontend/`.

## Layout

```
src/worker/
  index.ts              route mounting — the map of the whole API
  middleware/
    auth.ts             JWT guard for /api/admin/*
    cors.ts             origin allowlist from CORS_ALLOWED_ORIGINS
  routes/               public read endpoints
    admin/              protected CRUD endpoints
  services/
    email/              Resend — contact notification + auto-reply
    security.ts
  db/
    schema.sql, seed.sql
    migrations/         schema changes
scripts/
  migrations/           ad-hoc data migrations
  sync-projects-from-mock.sh
```

## Routes

Mounted in `src/worker/index.ts`:

- `GET /api/health`
- Public reads — `/api/projects`, `/api/blog`, `/api/notes`, `/api/streams`, `/api/content`
- Public writes — `/api/contact`, `/api/newsletter` (throttled via the `request_throttle` table)
- `/api/admin/auth` — login, mounted **before** the guard
- Everything else under `/api/admin/*` sits behind `requireAuth`: `projects`, `blog`, `notes`, `streams`, `content`, `newsletter`, `contact-submissions`

Full request/response shapes: [`API_ENDPOINTS.md`](API_ENDPOINTS.md). A Postman collection lives in `postman/`.

## Development

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

`.dev.vars` (Worker secrets — never committed):

| Var | Purpose |
|---|---|
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | the single CMS login |
| `JWT_SECRET` | signs admin tokens — long and random |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_OWNER_TO` | contact form delivery |
| `CONTACT_AUTO_REPLY_HOURS` | auto-reply throttle window |
| `CORS_ALLOWED_ORIGINS` | comma-separated frontend origins |

For production, set the same keys with `npx wrangler secret put <NAME>`.

Bindings live in `wrangler.json` — D1 database `portfolio-db` bound as `DB`. After changing bindings, run `npm run cf-typegen` to regenerate `worker-configuration.d.ts`.

## Database

D1 has no migration runner here — SQL files are applied by hand, local first, then remote:

```bash
npx wrangler d1 execute portfolio-db --local  --file=./src/worker/db/schema.sql
npx wrangler d1 execute portfolio-db --local  --file=./src/worker/db/seed.sql
npx wrangler d1 execute portfolio-db --remote --file=<same file>
```

Schema changes go in `src/worker/db/migrations/`; one-off data fixes go in `scripts/migrations/`. Name files by date, e.g. `2026-04-22_add_project_links.sql`.

`npm run sync:projects-from-mock` regenerates project rows from the frontend mock (`--local-only` to skip remote).

Copying a full local database over production is destructive and has its own guide: [`D1_SYNC_LOCAL_TO_REMOTE.md`](D1_SYNC_LOCAL_TO_REMOTE.md).

## Deploy

```bash
npm run check    # tsc && vite build && wrangler deploy --dry-run
npm run deploy
npx wrangler tail
```

Observability and log persistence are on in `wrangler.json`.

First-time setup — creating the D1 database, seeding it, wiring the custom domain — is walked through in [`SETUP.md`](SETUP.md).
