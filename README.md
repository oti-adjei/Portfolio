# Portfolio — George Heavenson

Personal portfolio and brand site, plus the small CMS that feeds it.

Live site: [hearvie.dev](https://hearvie.dev)

## Repo layout

| Path | What it is |
|---|---|
| `frontend/` | React 19 + Vite SPA — the public site **and** the `/admin` CMS UI |
| `Hono/` | Cloudflare Worker (Hono + D1) — the content API |
| `docs/` | `design-system.md` and local-only notes |
| `CHANGELOG.md` | Running log of every meaningful change, newest first |

The two folders are independent npm projects. There is no workspace root — install and run scripts inside each one.

## Stack

**Frontend** — React 19, TypeScript, Vite 7, Tailwind CSS v3, React Router v7 (lazy routes), GSAP 3, Remixicon.
**Backend** — Hono 4 on Cloudflare Workers, D1 (SQLite) for storage, JWT for admin auth, Resend for contact email.

## Quick start

```bash
# API (terminal 1)
cd Hono
cp .dev.vars.example .dev.vars   # fill in admin creds, JWT secret, Resend key
npm install
npm run dev

# Site (terminal 2)
cd frontend
cp .env.example .env
npm install
npm run dev                      # http://localhost:5173
```

`frontend/.env`:

- `VITE_API_BASE_URL` — point at the Worker. Leave empty to use same-origin `/api/*`.
- `VITE_CONTENT_SOURCE` — `api` or `mock`.

**Mock mode needs no backend at all.** `VITE_CONTENT_SOURCE=mock npm run dev` runs the whole site, admin included, off `src/mocks/siteContent.ts` with in-memory writes. Details in [`frontend/SETUP_DATA_SOURCE.md`](frontend/SETUP_DATA_SOURCE.md).

## Site structure

The public site is versioned by design generation, not by branch. V1 was the original site — a conventional multi-page layout. V2 is the redesign that replaced it in June 2026: a single-page home with anchored sections, a sticky pill nav, a cream/white theme toggle, and dedicated sub-pages for the longer-form material. It was built at `/experiment/*` and promoted to the root once it was done; the old design was kept rather than deleted.

- **V2** is canonical and lives at the root URLs — `/`, `/about`, `/works`, `/project/:id`, `/library`, `/press`, `/blog/:slug`, `/notes/:slug`, plus `/design-system`.
- **V1** is archived at `/v1/*` and is not touched by redesign work.

When a V3 lands it takes the root and V2 moves to `/v2/*`. URLs that only ever existed in V1 (`/contact`, `/streams`, `/blog`, `/notes`) return 404 from the root — the archive is reached explicitly via `/v1`.

`/admin/*` is the CMS: login, dashboard, and editors for projects, blog, notes, streams, page content, newsletter, and contact submissions. Everything behind the login is JWT-guarded.

## Commands

Frontend (`cd frontend`):

```bash
npm run dev       # dev server
npm run build     # tsc -b && vite build — full type-check
npm run lint
npm run preview
```

Backend (`cd Hono`):

```bash
npm run dev        # local Worker + D1
npm run check      # tsc && vite build && wrangler deploy --dry-run
npm run deploy     # wrangler deploy
npm run cf-typegen # regenerate binding types after editing wrangler.json
npx wrangler tail  # live logs
```

There is no test suite. Verification is `npm run build` (type-check) plus `npm run lint`.

## Deployment

The two halves ship separately:

- **Site (`frontend/`)** — built by Cloudflare Pages. The repo is wired to a Pages project in the Cloudflare dashboard, so a push deploys it; there is no build config or CI workflow in this repo. Build settings and env vars (`VITE_API_BASE_URL`, `VITE_CONTENT_SOURCE`) live in the dashboard.
- **API (`Hono/`)** — deployed by hand with `npm run deploy` (Wrangler) from the `Hono/` folder. Secrets are set with `npx wrangler secret put`, not from `.dev.vars`.

After deploying the API to a new origin, update `CORS_ALLOWED_ORIGINS` on the Worker and `VITE_API_BASE_URL` in the Pages project.

## Docs

- [`Hono/README.md`](Hono/README.md) — backend overview
- [`Hono/API_ENDPOINTS.md`](Hono/API_ENDPOINTS.md) — endpoint reference
- [`Hono/SETUP.md`](Hono/SETUP.md) — D1 creation, seeding, first deploy
- [`Hono/D1_SYNC_LOCAL_TO_REMOTE.md`](Hono/D1_SYNC_LOCAL_TO_REMOTE.md) — pushing local data to production
- [`docs/design-system.md`](docs/design-system.md) — tokens, type scale, motion, voice
