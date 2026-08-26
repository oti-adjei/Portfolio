# Portfolio Hono API Endpoints

This document reflects the routes currently wired in `/Volumes/Georgie/Development/Personal/Brand/Portfolio/Hono/src/worker/index.ts`.

## Base URL

- Local (Wrangler dev): `http://localhost:5173`
- Deployed: `https://<your-worker>.workers.dev`

## Auth

- Admin login: `POST /api/admin/auth/login`
- Protected routes: all `/api/admin/*` except `/api/admin/auth/login`
- Header for protected routes:
  - `Authorization: Bearer <jwt-token>`

## Environment Requirements

Required vars/bindings in `/Volumes/Georgie/Development/Personal/Brand/Portfolio/Hono/wrangler.json`:

- `DB` (D1 binding)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_OWNER_TO`
- `CONTACT_AUTO_REPLY_HOURS` (defaults to `"24"`)
- `SITE_URL` (defaults to `https://hearvie.dev`) — used to build newsletter unsubscribe links
- `NEWSLETTER_POSTAL_ADDRESS` (optional) — physical mailing address footer; omitted from emails when unset

## Health

- `GET /api/health`

## Public Content Endpoints

- `GET /api/projects`
- `GET /api/projects/:id`
- `GET /api/blog`
- `GET /api/blog/:slug`
- `GET /api/notes`
- `GET /api/notes/:slug`
- `GET /api/streams`
- `GET /api/content/:section`
  - Common sections: `navigation`, `footer`, `homePage`, `aboutPage`, `contactPage`, `worksPage`, `streamsPage`

## Public Contact and Newsletter Endpoints

### Newsletter

- `POST /api/newsletter/subscribe`
- Body:
```json
{
  "email": "reader@example.com",
  "name": "Reader",
  "source": "home_contact_cta",
  "hp": ""
}
```
- Response:
```json
{
  "success": true
}
```

### Contact

- `POST /api/contact/submit`
- Body:
```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "subject": "Project inquiry",
  "message": "I would like to work together.",
  "source": "contact_page_form",
  "hp": ""
}
```
- Response:
```json
{
  "success": true,
  "referenceId": "uuid"
}
```

## Admin Endpoints

### Auth

- `POST /api/admin/auth/login`
- Body:
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```
- Response:
```json
{
  "token": "<jwt>"
}
```

### Projects

- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`

### Blog

- `GET /api/admin/blog`
- `POST /api/admin/blog`
- `PUT /api/admin/blog/:id`
- `DELETE /api/admin/blog/:id`

### Notes

- `GET /api/admin/notes`
- `POST /api/admin/notes`
- `PUT /api/admin/notes/:id`
- `DELETE /api/admin/notes/:id`

### Streams

- `GET /api/admin/streams`
- `POST /api/admin/streams`
- `PUT /api/admin/streams/:id`
- `DELETE /api/admin/streams/:id`

### Content Sections

- `GET /api/admin/content/:section`
- `PUT /api/admin/content/:section`

### Newsletter Admin

- `GET /api/admin/newsletter?status=&q=&page=1&limit=20`
- `PUT /api/admin/newsletter/:id/status`
- Allowed status values:
  - `subscribed`
  - `unsubscribed`
  - `bounced`

### Contact Submissions Admin

- `GET /api/admin/contact-submissions?status=&q=&page=1&limit=20`
- `PUT /api/admin/contact-submissions/:id/status`
- Allowed status values:
  - `new`
  - `read`
  - `replied`
  - `archived`

### Newsletter Campaigns Admin

- `GET /api/admin/campaigns?page=1&limit=20`
- `POST /api/admin/campaigns`
- `GET /api/admin/campaigns/:id` — includes `deliveries: { pending, sent, failed }`
- `PUT /api/admin/campaigns/:id` — draft only, 409 otherwise
- `DELETE /api/admin/campaigns/:id` — draft only, 409 otherwise
- `POST /api/admin/campaigns/:id/prepare` — 409 unless status is `draft` or `sending`. Snapshots every `subscribed` subscriber into a `pending` delivery row (`INSERT OR IGNORE`, so repeat calls add nothing), sets `total_recipients` and status `sending`. Returns `{ total, pending }`.
- `POST /api/admin/campaigns/:id/send-chunk` — claims up to 100 pending deliveries per call (a per-call `claim_id`, so two overlapping calls can't both send the same rows), sends the claimed batch via the email provider, and settles each to `sent` or `failed` (with the error text). Unsubscribed or token-less rows are failed out before ever being sent. Updates the campaign's `sent_count`/`failed_count` by recomputing from the delivery rows. Call it repeatedly until `remaining` is 0; once no pending rows remain it finalises the campaign to `sent` or `failed` — unless any row is still stuck in `sending` (a claim that never settled), in which case it stays `sending` and reports the count via `stuck` rather than being reported as sent. Returns `{ sent, failed, remaining, stuck, status? }` (`status` only present once finalised).
- `POST /api/admin/campaigns/:id/retry-failed` — requeues that campaign's `failed` deliveries back to `pending` (clearing `error`/`claim_id`/`claimed_at`), and also reclaims any `sending` row whose claim is more than 15 minutes old (a crash between claim and settle — recoverable, but not so eager it can yank a legitimately in-flight claim). Recomputes counters and, if anything was requeued, puts the campaign back into `sending` so `send-chunk` can resume it. Returns `{ requeued }`. Does not auto-retry — a hard bounce would loop forever otherwise.
- `POST /api/admin/campaigns/:id/test` — body `{ email }`. Renders exactly as a real send would (using the first subscriber's unsubscribe token, or the literal `preview-token` if none exist) and sends a single email with the subject prefixed `[TEST] `. Does not touch delivery rows.

### Upload

- `POST /api/admin/upload`
- Multipart form upload. Requires `Authorization: Bearer <token>`.

| Field | Type | Notes |
|---|---|---|
| `file` | File | PNG, JPEG or WebP. Max 10MB. Type is detected from magic bytes, not the Content-Type header. SVG is rejected. |
| `folder` | string | One of `projects`, `me`, `brand`. |

- Response `200`: `{ "url": "https://img.hearvie.dev/<key>", "key": "...", "size": 12345 }`
- Errors: `400` bad folder / no file / empty file, `413` over 10MB, `415` not an accepted image type, `401` missing or invalid token.

## Error Behavior (Current)

- Validation errors: `400`
- Auth failures: `401`
- Missing resource: `404`
- Rate limit: `429`
- Server/DB errors: `500`

Public anti-spam behavior currently implemented:

- Honeypot field (`hp`) must be empty.
- Throttling by IP + route:
  - Newsletter: `10/min`
  - Contact: `5/min`

## Quick Backend Readiness Checklist

1. Run D1 schema migration (includes `newsletter_subscribers`, `contact_submissions`, `request_throttle`).
2. Set all worker secrets/vars above.
3. Verify:
   - `GET /api/health` returns `{"status":"ok"}`
   - Admin login returns token
   - Public contact/newsletter POST endpoints return success
   - Admin newsletter/contact-submissions list endpoints return pagination payload
