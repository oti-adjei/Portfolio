-- Normalises project categories to upper case.
--
-- The public works page builds its filter chips from the distinct category values in the
-- data, matching with `p.category === filter`. That match is case-sensitive, so 'mobile'
-- and 'MOBILE' rendered as two separate chips for the same category, each showing a subset
-- of the projects. Live data had: WEB 8, MOBILE 5, SAAS 2, DESKTOP 1, plus a stray
-- lowercase 'web' and 'mobile' (the two most recently added projects).
--
-- Upper case wins because it is what 16 of the 18 rows already used.
--
-- The admin API now upper-cases category on write, so this is a one-time correction rather
-- than something that needs re-running.
--
-- Apply:
--   npx wrangler d1 execute portfolio-db --local  --file=scripts/migrations/2026-08-27_normalize_project_categories.sql
--   npx wrangler d1 execute portfolio-db --remote --file=scripts/migrations/2026-08-27_normalize_project_categories.sql

UPDATE projects
   SET category = UPPER(category),
       updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
 WHERE category IS NOT NULL
   AND category <> UPPER(category);
