# D1 Sync Guide: Local -> Remote

Use this when your local D1 database has the latest data and you want remote to match it exactly.

This guide is written for reuse in template projects.

## What this does

1. Exports a backup of remote DB.
2. Exports your local DB snapshot.
3. Drops remote tables (destructive).
4. Imports local snapshot into remote.
5. Verifies key row counts.

## Prerequisites

- You are in the backend worker folder:
  - `cd /Volumes/Georgie/Development/Personal/Brand/Portfolio/Hono`
- Wrangler is authenticated.
- Your `wrangler.json` points to the correct D1 database (`portfolio-db` in this example).

## Commands (copy/paste)

### Shortcut (recommended for this repo)

Sync `projects` from `frontend/src/mocks/siteContent.ts` to both local and remote:

```bash
cd /Volumes/Georgie/Development/Personal/Brand/Portfolio/Hono
npm run sync:projects-from-mock
```

Optional:

```bash
# Local only
./scripts/sync-projects-from-mock.sh --local-only

# Remote only
./scripts/sync-projects-from-mock.sh --remote-only
```

### 1) Backup current remote DB to Desktop

```bash
npx wrangler d1 export portfolio-db --remote --output ~/Desktop/remote-backup-$(date +%Y%m%d-%H%M%S).sql
```

### 2) Export local DB snapshot to Desktop

```bash
npx wrangler d1 export portfolio-db --local --output ~/Desktop/local-latest.sql
```

### 3) Reset remote tables (destructive)

```bash
npx wrangler d1 execute portfolio-db --remote --command "DROP TABLE IF EXISTS request_throttle; DROP TABLE IF EXISTS contact_submissions; DROP TABLE IF EXISTS newsletter_subscribers; DROP TABLE IF EXISTS site_content; DROP TABLE IF EXISTS stream_events; DROP TABLE IF EXISTS notes; DROP TABLE IF EXISTS blog_posts; DROP TABLE IF EXISTS projects;"
```

### 4) Import local snapshot into remote

```bash
npx wrangler d1 execute portfolio-db --remote --file ~/Desktop/local-latest.sql
```

## Verify after sync

```bash
npx wrangler d1 execute portfolio-db --remote --command "SELECT COUNT(*) AS projects FROM projects;"
npx wrangler d1 execute portfolio-db --remote --command "SELECT COUNT(*) AS blog_posts FROM blog_posts;"
npx wrangler d1 execute portfolio-db --remote --command "SELECT COUNT(*) AS notes FROM notes;"
npx wrangler d1 execute portfolio-db --remote --command "SELECT COUNT(*) AS stream_events FROM stream_events;"
npx wrangler d1 execute portfolio-db --remote --command "SELECT COUNT(*) AS site_content FROM site_content;"
```

## Rollback (if needed)

Use the backup file created in step 1:

```bash
npx wrangler d1 execute portfolio-db --remote --file ~/Desktop/<your-remote-backup-file>.sql
```

## Important Notes

- Step 3 is destructive on remote. Do not skip step 1.
- This process overwrites remote data state with local data state.
- If your DB adds new tables later, include them in the DROP command.
- If your project uses migrations, keep migrations in source control even if you also do snapshot syncs.
