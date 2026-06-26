---
title: "The Cookie Was Lying: Debugging Better Auth, Cloudflare D1, and Audit Log Foreign Keys"
date: "2026-05-09"
status: "draft"
tags:
  - Better Auth
  - Cloudflare D1
  - OpenNext
  - Debugging
  - Audit Logs
---

# The Cookie Was Lying: Debugging Better Auth, Cloudflare D1, and Audit Log Foreign Keys

While building the Wondakhid admin system, I hit one of those bugs that looked like a database problem at first, then looked like a login problem, then finally turned out to be a configuration problem.

The symptom showed up while testing the new admin blog flow. I created a post from `/admin/blog/new`, clicked save, and got a `500 Internal Server Error`.

The error pointed at the audit log:

```txt
Failed query: insert into "admin_audit_log"
("id", "actor_user_id", "action", "entity", "entity_id", "diff", "ip", "created_at")

D1_ERROR: FOREIGN KEY constraint failed
```

The failed audit row looked roughly like this:

```txt
actor_user_id = cmAO1sy2vNVXS7luzWc9gNppGpLV9UG7
action = blog.created
entity = blog_post
```

That was confusing because the blog post itself had already been inserted. The failure happened after the content write, when the app tried to record who performed the action.

## The First Assumption

The obvious first thought was: maybe I was not logged in.

But the action was getting an admin user id. The `actor_user_id` was not random. It came from the admin session.

The create flow looked like this:

```ts
const admin = await deps.requireAdmin();

await deps.insertPost(row);

await deps.writeAudit({
  actorUserId: admin.id,
  action: 'blog.created',
  entity: 'blog_post',
  entityId: row.id,
});
```

That meant the server action believed there was an authenticated admin user.

So the next question was: where exactly is `admin.id` coming from?

The chain was:

```txt
createBlogPostAction
  -> createBlogPostWithDeps
  -> requireAdminSession()
  -> requireSession()
  -> auth.api.getSession({ headers })
  -> session.user.id
```

So Better Auth was returning a session user. But D1 was rejecting that same id when the audit log tried to reference `users.id`.

That is the kind of contradiction that usually means two systems are not looking at the same source of truth.

## The Misleading Local Preview State

This project runs on Next.js with OpenNext for Cloudflare, using D1 as the database. In local preview, there was already a known caveat: `wrangler d1 execute --local` does not reliably inspect the same runtime D1 state used by `pnpm preview`.

That meant checking the database from the CLI was not enough. I needed to inspect the running Worker itself.

I temporarily added a debug endpoint that did two things inside the same runtime:

1. Asked Better Auth for the current session user.
2. Queried D1 directly for rows in `users` and `sessions`.

After signing in, the endpoint returned something like this:

```json
{
  "sessionUser": {
    "id": "9e6RgTiHI116GNUcjsfCgEIB9KxVhy0G",
    "email": "jrgeorge991@outlook.com",
    "role": "admin"
  },
  "rawUsers": [],
  "rawSessions": []
}
```

That was the important clue.

Better Auth could return a signed-in user, but the actual D1 `users` and `sessions` tables were empty.

So the cookie was not exactly fake, but it was misleading. The session layer was giving the app a user-shaped object while the relational database had no matching user row.

The audit table was doing the right thing by rejecting it.

## The Real Bug

The auth setup looked like this:

```ts
return betterAuth(
  withCloudflare(
    {
      autoDetectIpAddress: true,
      geolocationTracking: false,
      cf: {},
    },
    {
      database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema: {
          user: schema.users,
          session: schema.sessions,
          account: schema.accounts,
          verification: schema.verifications,
        },
      }),
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
    },
  ),
);
```

At a glance, that looks reasonable. Better Auth gets a database adapter. The adapter points at the D1-backed Drizzle schema. Done.

But `better-auth-cloudflare` expects the Cloudflare database configuration inside the first `withCloudflare()` argument.

Internally, the wrapper builds its own `database` option based on `d1`, `d1Native`, `postgres`, or `mysql`. If none of those are present, `database` becomes `undefined`, and then the wrapper returns a merged options object where that `undefined` value overwrites the `database` passed in the second argument.

So the configured Drizzle adapter was silently being discarded.

The app thought Better Auth was backed by D1. It was not.

## The Fix

The fix was to move the D1 config into the Cloudflare options object:

```ts
return betterAuth(
  withCloudflare(
    {
      autoDetectIpAddress: true,
      geolocationTracking: false,
      cf: {},
      d1: {
        db,
        options: {
          schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
          },
        },
      },
    },
    {
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      emailAndPassword: {
        enabled: true,
        autoSignIn: true,
      },
    },
  ),
);
```

And remove the old `database: drizzleAdapter(...)` from the second argument.

After that, the same runtime debug check returned the expected shape:

```json
{
  "sessionUser": {
    "id": "klPHFsOt8I3N5WAS0GvCHJ36dCd0Kt2L",
    "email": "jrgeorge991@outlook.com",
    "role": "super_admin"
  },
  "rawUsers": [
    {
      "id": "klPHFsOt8I3N5WAS0GvCHJ36dCd0Kt2L",
      "email": "jrgeorge991@outlook.com",
      "role": "super_admin"
    }
  ],
  "rawSessions": [
    {
      "user_id": "klPHFsOt8I3N5WAS0GvCHJ36dCd0Kt2L"
    }
  ]
}
```

Now Better Auth and the app were using the same D1 persistence layer.

## Why I Did Not Remove The Foreign Key

One tempting fix would have been to weaken the audit table:

```txt
admin_audit_log.actor_user_id no longer references users.id
```

That would have made the error disappear.

It also would have hidden the real problem.

The audit log was correct to say: if an admin action claims a user performed it, that user should exist. The data model was doing its job. The broken part was the auth configuration.

Keeping the foreign key forced the system to reveal that Better Auth was not writing users and sessions into D1.

That is exactly the kind of failure a relational constraint should catch.

## The Login Screen Side Quest

This bug also exposed a smaller UI issue.

The original admin login page used a plain HTML form:

```tsx
<form action="/api/auth/sign-in/email" method="post">
```

That posted directly to Better Auth’s API endpoint. The login technically worked, but the browser rendered the JSON response instead of returning to the admin dashboard.

The fix was to make the login page handle the request as app UI:

```ts
const res = await fetch('/api/auth/sign-in/email', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  credentials: 'same-origin',
  body: JSON.stringify({ email, password, callbackURL }),
});

if (res.ok) {
  router.replace('/admin');
}
```

That kept Better Auth in charge of authentication, but let the app own the user experience.

## Lessons

The main lesson is simple:

**Do not let auth be cookie-only while the rest of the app assumes persisted users.**

If the app has audit logs, ownership records, permissions, or foreign keys pointing to `users.id`, then auth must write to the same `users` table the rest of the app reads.

The second lesson is about debugging local Cloudflare state:

**When local preview has multiple state layers, inspect the running Worker, not just the CLI database.**

`wrangler d1 execute --local` can be useful, but in this setup it was not authoritative for the preview runtime. The temporary debug endpoint was the thing that proved the mismatch.

The final lesson is architectural:

**Do not remove constraints just because they are loud.**

The foreign key was loud, but it was right. It protected the audit log from pointing at users that did not exist. Fixing the auth database configuration made the system consistent again.

