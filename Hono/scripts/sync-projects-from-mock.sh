#!/usr/bin/env bash
set -euo pipefail

DB_NAME="portfolio-db"
MODE="both"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --db)
      DB_NAME="${2:-}"
      if [[ -z "$DB_NAME" ]]; then
        echo "Missing value for --db"
        exit 1
      fi
      shift 2
      ;;
    --local-only)
      MODE="local"
      shift
      ;;
    --remote-only)
      MODE="remote"
      shift
      ;;
    -h|--help)
      cat <<'HELP'
Sync projects from frontend mock data into D1.

Usage:
  ./scripts/sync-projects-from-mock.sh [--db <database-name>] [--local-only|--remote-only]

Defaults:
  --db portfolio-db
  sync mode: both local and remote

Examples:
  ./scripts/sync-projects-from-mock.sh
  ./scripts/sync-projects-from-mock.sh --local-only
  ./scripts/sync-projects-from-mock.sh --remote-only
  ./scripts/sync-projects-from-mock.sh --db portfolio-db
HELP
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HONO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_DIR="$(cd "$HONO_DIR/.." && pwd)"
MOCK_FILE="$REPO_DIR/frontend/src/mocks/siteContent.ts"
LOCAL_SQL="/tmp/sync_projects_from_mock.sql"
REMOTE_SQL="/tmp/sync_projects_from_mock_remote.sql"

if [[ ! -f "$MOCK_FILE" ]]; then
  echo "Mock file not found: $MOCK_FILE"
  exit 1
fi

echo "Generating SQL from $MOCK_FILE"

node - "$MOCK_FILE" "$LOCAL_SQL" "$REMOTE_SQL" <<'NODE'
const fs = require("fs");
const vm = require("vm");

const mockFile = process.argv[2];
const localSqlFile = process.argv[3];
const remoteSqlFile = process.argv[4];

let s = fs.readFileSync(mockFile, "utf8");
s = s.replace(/^import[^\n]*\n/, "");
s = s.replace("export const siteContent: SiteContent =", "const siteContent =");
s = s.replace(/\sas const/g, "");

const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${s}\nthis.siteContent=siteContent;`, ctx);

const projects = ctx.siteContent.projects;
const esc = (v) => String(v ?? "").replace(/'/g, "''");
const j = (v) => JSON.stringify(v ?? []).replace(/'/g, "''");
const ids = projects.map((p) => `'${esc(p.id)}'`).join(", ");

function buildSql({ withTransaction }) {
  let sql = "";
  if (withTransaction) sql += "BEGIN TRANSACTION;\n";
  sql += `DELETE FROM projects WHERE id NOT IN (${ids});\n`;

  projects.forEach((p, i) => {
    const thumb = p.thumbnail || {};
    const ov = p.overview || {};
    const d = p.details || {};
    const galleryImages = (p.gallery && p.gallery.images) || [];
    const published = p.published === false ? 0 : 1;

    sql += `INSERT OR REPLACE INTO projects (id, title, category, year, thumbnail_url, thumbnail_alt, tags, overview_description, overview_client, overview_duration, overview_role, details_challenge, details_solution, details_results, gallery_images, sort_order, published, updated_at) VALUES ('${esc(p.id)}','${esc(p.title)}','${esc(p.category)}',${p.year ? `'${esc(p.year)}'` : "NULL"},${thumb.url ? `'${esc(thumb.url)}'` : "NULL"},${thumb.alt ? `'${esc(thumb.alt)}'` : "NULL"},'${j(p.tags || [])}',${ov.description ? `'${esc(ov.description)}'` : "NULL"},${ov.client ? `'${esc(ov.client)}'` : "NULL"},${ov.duration ? `'${esc(ov.duration)}'` : "NULL"},${ov.role ? `'${esc(ov.role)}'` : "NULL"},${d.challenge ? `'${esc(d.challenge)}'` : "NULL"},${d.solution ? `'${esc(d.solution)}'` : "NULL"},'${j(d.results || [])}','${j(galleryImages)}',${i},${published},CURRENT_TIMESTAMP);\n`;
  });

  if (withTransaction) sql += "COMMIT;\n";
  return sql;
}

fs.writeFileSync(localSqlFile, buildSql({ withTransaction: true }));
fs.writeFileSync(remoteSqlFile, buildSql({ withTransaction: false }));
console.log(`Generated SQL for ${projects.length} projects.`);
NODE

cd "$HONO_DIR"

if [[ "$MODE" == "both" || "$MODE" == "local" ]]; then
  echo "Applying local sync to D1 database: $DB_NAME"
  npx wrangler d1 execute "$DB_NAME" --file="$LOCAL_SQL"
  echo "Local sync complete."
fi

if [[ "$MODE" == "both" || "$MODE" == "remote" ]]; then
  echo "Applying remote sync to D1 database: $DB_NAME"
  npx wrangler d1 execute "$DB_NAME" --remote --file="$REMOTE_SQL"
  echo "Remote sync complete."
fi

echo "Verifying project counts..."
if [[ "$MODE" == "both" || "$MODE" == "local" ]]; then
  npx wrangler d1 execute "$DB_NAME" --command "SELECT COUNT(*) AS projects FROM projects;"
fi
if [[ "$MODE" == "both" || "$MODE" == "remote" ]]; then
  npx wrangler d1 execute "$DB_NAME" --remote --command "SELECT COUNT(*) AS projects FROM projects;"
fi

echo "Done."
