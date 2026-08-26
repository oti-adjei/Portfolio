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

**Frontend** — React 19, TypeScript, Vite 7, Tailwind CSS v3, React Router v7 (lazy routes), GSAP 3, Remixicon (self-hosted).
**Backend** — Hono 4 on Cloudflare Workers, D1 (SQLite) for storage, JWT for admin auth, Resend for contact email and newsletter sending.

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

Both halves deploy from git — a push builds them. There is no CI workflow in this repo; both projects are wired to the repo in the Cloudflare dashboard, and their build settings live there.

- **Site (`frontend/`)** — Cloudflare Pages. Env vars (`VITE_API_BASE_URL`, `VITE_CONTENT_SOURCE`) are set in the Pages project.
- **API (`Hono/`)** — Workers Builds, root directory `Hono/`. Bindings come from `wrangler.json`, so adding one there is enough — do not also add it in the dashboard, it gets overwritten. Secrets are the exception: set them with `npx wrangler secret put`, never from `.dev.vars`.

`npm run deploy` in `Hono/` still works for an out-of-band deploy, but it needs a local Wrangler login with the right account and scopes.

After moving the API to a new origin, update `CORS_ALLOWED_ORIGINS` on the Worker and `VITE_API_BASE_URL` in the Pages project.

## Repository size

`git clone` pulls roughly **83MB packed** (~109MB unpacked `.git`), while the working tree holds well under 1MB of images. That gap is history, not the checkout.

Git keeps every version of every file forever. Deleting a file removes it from the working tree and from future builds — it does **not** remove it from the repository. Two waves of image deletions are still in there:

| What | Roughly | When |
|---|---|---|
| `assets/`, `assets/images/*` — the pre-V1 legacy site | 35MB | deleted 2026-02-19 (`6585aac`) |
| `frontend/public/assets/{projects,me,documents}` — moved to R2 | 58MB | deleted 2026-08-25 |

Both are unreachable from any current commit's tree, and both are still downloaded on every fresh clone.

### Reducing it, if it ever matters

Only a history rewrite removes them. From a clean clone with no uncommitted work:

```bash
# install once: brew install git-filter-repo
git filter-repo --path assets --path frontend/public/assets --invert-paths
git push --force --all
git push --force --tags
```

Expect ~83MB → under 10MB.

What it costs, and why it is tolerable here:

- **Every commit SHA changes.** Links to specific commits break, and any existing clone must be re-cloned rather than pulled.
- This repo has a single author across four identities, so there are no collaborators to disrupt — which is what makes the rewrite cheap here and expensive in a team repo.
- Keep `frontend/public/assets/brand/` — those SVGs are still live in the working tree. The command above would strip them; add `--path frontend/public/assets/brand --path-glob` exclusions or restore them afterwards.
- GitHub keeps unreachable objects until its own GC runs, so the remote may not shrink immediately.

None of this affects the running site. It is purely clone and CI-checkout weight, which is why it has been left alone.

## Docs

- [`Hono/README.md`](Hono/README.md) — backend overview
- [`Hono/API_ENDPOINTS.md`](Hono/API_ENDPOINTS.md) — endpoint reference
- [`Hono/SETUP.md`](Hono/SETUP.md) — D1 creation, seeding, first deploy
- [`Hono/D1_SYNC_LOCAL_TO_REMOTE.md`](Hono/D1_SYNC_LOCAL_TO_REMOTE.md) — pushing local data to production
- [`docs/design-system.md`](docs/design-system.md) — tokens, type scale, motion, voice
