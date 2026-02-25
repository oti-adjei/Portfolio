# Frontend Data Source Setup (`api` vs `mock`)

This project supports two frontend content modes controlled by `VITE_CONTENT_SOURCE`.

## Modes

- `api`: frontend reads/writes through Hono endpoints.
- `mock`: frontend uses local mock data (`src/mocks/siteContent.ts`) with local in-memory admin behavior.

## Env Variables

Use these in your frontend environment:

```env
VITE_API_BASE_URL=
VITE_CONTENT_SOURCE=api
```

Notes:
- Leave `VITE_API_BASE_URL` empty to use same-origin `/api/*`.
- Valid `VITE_CONTENT_SOURCE` values are only `api` or `mock`.

## Dev Commands

From:
`/Volumes/Georgie/Development/Personal/Brand/Portfolio/frontend`

Run in API mode:

```bash
VITE_CONTENT_SOURCE=api npm run dev
```

Run in Mock mode:

```bash
VITE_CONTENT_SOURCE=mock npm run dev
```

## Build Commands

Build in API mode:

```bash
VITE_CONTENT_SOURCE=api npm run build
```

Build in Mock mode:

```bash
VITE_CONTENT_SOURCE=mock npm run build
```

## Behavior Summary

### `api` mode
- Public content loads from backend APIs.
- Admin login uses `/api/admin/auth/login`.
- Admin CRUD/actions call backend protected endpoints.
- Contact/newsletter submit to backend endpoints.

### `mock` mode
- Public content renders from local mock data.
- Admin login is local-only (non-empty credentials).
- Admin CRUD/actions are local in-memory updates.
- Contact/newsletter forms show success UX without backend calls.

## Quick Troubleshooting

- Wrong mode value:
  - Invalid `VITE_CONTENT_SOURCE` falls back to `api` (dev warning in console).
- API mode unauthorized admin:
  - Verify backend `ADMIN_EMAIL`/`ADMIN_PASSWORD` and use exact values.
- API mode contact/newsletter failures:
  - Ensure D1 tables exist locally (`newsletter_subscribers`, `contact_submissions`, `request_throttle`).
- Changes not reflected:
  - Restart dev server after env changes.
