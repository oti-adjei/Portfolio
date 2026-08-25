-- Rewrites /assets/... paths to https://img.hearvie.dev/...
-- Generated 2026-08-25T15:25:01Z by migrate-assets-to-r2.sh

-- gallery_images and site_content.value are JSON blobs that may contain prose,
-- markdown, or unrelated text alongside asset paths. An unanchored REPLACE could
-- silently rewrite a literal "/assets/" substring that isn't part of a path
-- (e.g. inside prose or a code snippet). Anchor to the delimiter that actually
-- precedes a path inside a JSON string value: a quote (JSON string) or a paren
-- (markdown link).
--
-- Audit queries (run manually before applying; not part of the transaction below):
--
-- Any /assets/ occurrence in gallery_images NOT preceded by a quote or paren:
-- SELECT id, gallery_images FROM projects WHERE gallery_images LIKE '%/assets/%' AND gallery_images NOT LIKE '%"/assets/%' AND gallery_images NOT LIKE '%(/assets/%';
--
-- Any /assets/ occurrence in site_content.value NOT preceded by a quote or paren:
-- SELECT key, value FROM site_content WHERE value LIKE '%/assets/%' AND value NOT LIKE '%"/assets/%' AND value NOT LIKE '%(/assets/%';

-- NOTE: no BEGIN TRANSACTION / COMMIT. D1 rejects explicit SQL transactions
-- ("please use the state.storage.transaction() APIs instead") and operates in
-- auto-commit. Atomicity comes instead from every statement being WHERE-guarded
-- and idempotent: a partial run is safe to re-run, not corrupting.

-- thumbnail_url is a bare column holding exactly one path: unanchored REPLACE is safe.
UPDATE projects
SET thumbnail_url = REPLACE(thumbnail_url, '/assets/', 'https://img.hearvie.dev/')
WHERE thumbnail_url LIKE '/assets/%';

UPDATE projects
SET gallery_images = REPLACE(gallery_images, '"/assets/', '"https://img.hearvie.dev/')
WHERE gallery_images LIKE '%"/assets/%';

UPDATE projects
SET gallery_images = REPLACE(gallery_images, '(/assets/', '(https://img.hearvie.dev/')
WHERE gallery_images LIKE '%(/assets/%';

UPDATE site_content
SET value = REPLACE(value, '"/assets/', '"https://img.hearvie.dev/')
WHERE value LIKE '%"/assets/%';

UPDATE site_content
SET value = REPLACE(value, '(/assets/', '(https://img.hearvie.dev/')
WHERE value LIKE '%(/assets/%';

