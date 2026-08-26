-- Web Push subscriptions for the admin PWA.
--
-- One row per device that has granted notification permission. In practice this holds a
-- handful of rows (a phone, a laptop) — the admin is single-user. Rows are created by
-- POST /api/admin/push/subscribe and deleted either explicitly or automatically when a push
-- service reports the endpoint as 404/410 Gone.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id            TEXT PRIMARY KEY,
  -- The push service URL. Unique so re-subscribing the same device updates rather than
  -- duplicating; browsers hand back the same endpoint until the subscription is revoked.
  endpoint      TEXT NOT NULL UNIQUE,
  -- Subscriber public key (p256dh) and auth secret, both base64url. Required to encrypt.
  p256dh        TEXT NOT NULL,
  auth          TEXT NOT NULL,
  -- Purely so the device list is readable ("iPhone" vs "MacBook") when revoking one.
  user_agent    TEXT,
  created_at    TEXT NOT NULL,
  last_seen_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_created
  ON push_subscriptions (created_at DESC);
