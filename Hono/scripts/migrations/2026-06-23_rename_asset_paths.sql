-- 2026-06-23 — rename asset paths after public/ reorganization.
--
-- Idempotent: each UPDATE only touches rows whose column still contains
-- the OLD path. Running twice changes nothing on the second run.
--
-- Pre-flight audit (run locally before this migration) showed:
--   projects.thumbnail_url + gallery_images:  /assets/images/  → 16 hits
--   site_content.value: /Gpic.webp (1), /aboutme.JPG (1), /GHlog.png (2)
--   All other tables/columns: 0 hits for every old path.
--
-- D1/SQLite stores JSON as TEXT; we use plain REPLACE() rather than
-- json_replace() because the change is a string-level path swap that
-- applies uniformly inside JSON arrays of image objects.
--
-- Note: no BEGIN/COMMIT — D1 rejects explicit transactions in SQL files
-- run via `wrangler d1 execute`. Wrangler runs each statement as its own
-- D1 batch; these UPDATEs are idempotent so partial application is safe.

-- projects: /assets/images/<slug>/... → /assets/projects/<slug>/...
UPDATE projects
   SET thumbnail_url = REPLACE(thumbnail_url, '/assets/images/', '/assets/projects/')
 WHERE thumbnail_url LIKE '%/assets/images/%';

UPDATE projects
   SET gallery_images = REPLACE(gallery_images, '/assets/images/', '/assets/projects/')
 WHERE gallery_images LIKE '%/assets/images/%';

-- site_content: brand logo + personal photos
UPDATE site_content
   SET value = REPLACE(value, '/GHlog.png', '/assets/brand/gh-lockup.png')
 WHERE value LIKE '%/GHlog.png%';

UPDATE site_content
   SET value = REPLACE(value, '/Gpic.webp', '/assets/me/portrait-full.webp')
 WHERE value LIKE '%/Gpic.webp%';

UPDATE site_content
   SET value = REPLACE(value, '/aboutme.JPG', '/assets/me/portrait-close.jpg')
 WHERE value LIKE '%/aboutme.JPG%';
