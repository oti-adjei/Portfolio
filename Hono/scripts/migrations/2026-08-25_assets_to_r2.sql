-- Rewrites /assets/... paths to https://img.hearvie.dev/...
-- Generated 2026-08-25T14:35:09Z by migrate-assets-to-r2.sh

-- thumbnail_url is a bare column holding exactly one path: unanchored REPLACE is safe.
UPDATE projects
SET thumbnail_url = REPLACE(thumbnail_url, '/assets/', 'https://img.hearvie.dev/')
WHERE thumbnail_url LIKE '/assets/%';

-- gallery_images and site_content.value are JSON blobs that may contain prose,
-- markdown, or unrelated text alongside asset paths. An unanchored REPLACE could
-- silently rewrite a literal "/assets/" substring that isn't part of a path
-- (e.g. inside prose or a code snippet). Anchor to the delimiter that actually
-- precedes a path inside a JSON string value: a quote (JSON string) or a paren
-- (markdown link).
--
-- Audit before applying: any /assets/ occurrence in gallery_images NOT preceded by a quote or paren
-- SELECT id, gallery_images FROM projects WHERE gallery_images LIKE '%/assets/%' AND gallery_images NOT LIKE '%"/assets/%' AND gallery_images NOT LIKE '%(/assets/%';

UPDATE projects
SET gallery_images = REPLACE(gallery_images, '"/assets/', '"https://img.hearvie.dev/')
WHERE gallery_images LIKE '%"/assets/%';

UPDATE projects
SET gallery_images = REPLACE(gallery_images, '(/assets/', '(https://img.hearvie.dev/')
WHERE gallery_images LIKE '%(/assets/%';

-- Audit before applying: any /assets/ occurrence NOT preceded by a quote or paren
-- SELECT key, value FROM site_content WHERE value LIKE '%/assets/%' AND value NOT LIKE '%"/assets/%' AND value NOT LIKE '%(/assets/%';

UPDATE site_content
SET value = REPLACE(value, '"/assets/', '"https://img.hearvie.dev/')
WHERE value LIKE '%"/assets/%';

UPDATE site_content
SET value = REPLACE(value, '(/assets/', '(https://img.hearvie.dev/')
WHERE value LIKE '%(/assets/%';
