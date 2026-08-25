#!/usr/bin/env bash
set -uo pipefail

# Fetches every image URL stored in D1 and reports anything that is not 200.
# This is the check that catches a path missed by the migration.
#
# Usage: ./scripts/check-image-urls.sh [--remote]

DB="portfolio-db"
MODE="--local"
[[ "${1:-}" == "--remote" ]] && MODE="--remote"

RAW=$(npx wrangler d1 execute "$DB" $MODE --json --command \
  "SELECT thumbnail_url AS u FROM projects WHERE thumbnail_url != ''
   UNION SELECT value FROM site_content") || {
  echo "wrangler d1 execute failed — cannot verify. Not an all-clear."
  exit 2
}

URLS=$(echo "$RAW" | grep -oE 'https?://[^"]+\.(png|jpg|jpeg|webp|svg)' | sort -u)

if [[ -z "$URLS" ]]; then
  echo "No absolute image URLs found in the database (query succeeded)."
  exit 0
fi

FAILED=0
while IFS= read -r url; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$url")
  if [[ "$code" != "200" ]]; then
    echo "FAIL $code  $url"
    FAILED=$((FAILED + 1))
  fi
done <<< "$URLS"

TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo ""
echo "Checked $TOTAL URLs, $FAILED failed."
[[ $FAILED -eq 0 ]]
