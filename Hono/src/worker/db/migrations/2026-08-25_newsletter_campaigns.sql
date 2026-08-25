-- Unsubscribe tokens. The token is the only thing authenticating an
-- unsubscribe, so it must be unguessable and must never be logged.
ALTER TABLE newsletter_subscribers ADD COLUMN unsubscribe_token TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_unsub_token
  ON newsletter_subscribers(unsubscribe_token);

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  intro TEXT NOT NULL DEFAULT '',
  style TEXT NOT NULL DEFAULT 'teaser',
  items TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT
);

CREATE TABLE IF NOT EXISTS newsletter_deliveries (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  subscriber_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  sent_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, subscriber_id)
);

CREATE INDEX IF NOT EXISTS idx_deliveries_campaign_status
  ON newsletter_deliveries(campaign_id, status);
