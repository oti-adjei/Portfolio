-- Rewrites /assets/... paths to https://img.hearvie.dev/...
-- Generated 2026-08-25T14:31:18Z by migrate-assets-to-r2.sh

UPDATE projects
SET thumbnail_url = REPLACE(thumbnail_url, '/assets/', 'https://img.hearvie.dev/')
WHERE thumbnail_url LIKE '/assets/%';

UPDATE projects
SET gallery_images = REPLACE(gallery_images, '/assets/', 'https://img.hearvie.dev/')
WHERE gallery_images LIKE '%/assets/%';

UPDATE site_content
SET value = REPLACE(value, '/assets/', 'https://img.hearvie.dev/')
WHERE value LIKE '%/assets/%';
