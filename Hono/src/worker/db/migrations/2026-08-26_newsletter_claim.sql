-- send-chunk needs a per-call identity on the claim, not just the 'sending'
-- status, so two concurrent calls can't both treat the same rows as their
-- own claim (status alone is racy: B's re-select can't tell A's claim from
-- its own). claimed_at lets retry-failed distinguish a stranded claim from
-- one that's still legitimately in flight.
ALTER TABLE newsletter_deliveries ADD COLUMN claim_id TEXT;
ALTER TABLE newsletter_deliveries ADD COLUMN claimed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_deliveries_claim ON newsletter_deliveries(claim_id);
