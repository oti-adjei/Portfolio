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
