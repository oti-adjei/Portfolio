#!/usr/bin/env bash
set -euo pipefail

# Uploads frontend/public/assets/** to the portfolio-images R2 bucket,
# preserving relative paths as object keys, and emits a SQL file rewriting
# every stored /assets/... path to its https://img.hearvie.dev/... equivalent.
#
# Applies nothing. Inspect the SQL, then apply it yourself.

BUCKET="portfolio-images"
PUBLIC_BASE="https://img.hearvie.dev"
ASSETS_DIR="../frontend/public/assets"
DRY_RUN=0
REMOTE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --remote)  REMOTE=1; shift ;;
    *) echo "Unknown flag: $1"; exit 1 ;;
  esac
done

if [[ ! -d "$ASSETS_DIR" ]]; then
  echo "Assets directory not found: $ASSETS_DIR (run this from Hono/)"
  exit 1
fi

OUT_SQL="scripts/migrations/$(date +%Y-%m-%d)_assets_to_r2.sql"
mkdir -p scripts/migrations

echo "-- Rewrites /assets/... paths to $PUBLIC_BASE/..." > "$OUT_SQL"
echo "-- Generated $(date -u +%Y-%m-%dT%H:%M:%SZ) by migrate-assets-to-r2.sh" >> "$OUT_SQL"
echo "" >> "$OUT_SQL"

COUNT=0
while IFS= read -r -d '' file; do
  rel="${file#"$ASSETS_DIR"/}"
  case "$rel" in
    *.DS_Store) continue ;;
  esac

  if [[ $DRY_RUN -eq 1 ]]; then
    echo "would upload: $rel"
  else
    echo "uploading: $rel"
    if [[ $REMOTE -eq 1 ]]; then
      npx wrangler r2 object put "$BUCKET/$rel" --file="$file" --remote >/dev/null
    else
      npx wrangler r2 object put "$BUCKET/$rel" --file="$file" --local >/dev/null
    fi
  fi

  COUNT=$((COUNT + 1))
done < <(find "$ASSETS_DIR" -type f -print0)

cat >> "$OUT_SQL" <<SQL
-- thumbnail_url is a bare column holding exactly one path: unanchored REPLACE is safe.
UPDATE projects
SET thumbnail_url = REPLACE(thumbnail_url, '/assets/', '$PUBLIC_BASE/')
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
SET gallery_images = REPLACE(gallery_images, '"/assets/', '"$PUBLIC_BASE/')
WHERE gallery_images LIKE '%"/assets/%';

UPDATE projects
SET gallery_images = REPLACE(gallery_images, '(/assets/', '($PUBLIC_BASE/')
WHERE gallery_images LIKE '%(/assets/%';

-- Audit before applying: any /assets/ occurrence NOT preceded by a quote or paren
-- SELECT key, value FROM site_content WHERE value LIKE '%/assets/%' AND value NOT LIKE '%"/assets/%' AND value NOT LIKE '%(/assets/%';

UPDATE site_content
SET value = REPLACE(value, '"/assets/', '"$PUBLIC_BASE/')
WHERE value LIKE '%"/assets/%';

UPDATE site_content
SET value = REPLACE(value, '(/assets/', '($PUBLIC_BASE/')
WHERE value LIKE '%(/assets/%';
SQL

echo ""
echo "Files handled: $COUNT"
echo "SQL written to: $OUT_SQL"
echo ""
echo "Next: inspect the SQL, apply --local, verify, then --remote."
