-- Adds two projects: Zook (Go deploy controller) and the Portfolio CMS itself.
--
-- Both ship with an EMPTY thumbnail_url on purpose. Every other project has a real R2
-- image, and inserting a broken or borrowed one would look worse than none. Add them from
-- /admin/projects after running this — the ImageField resizes and uploads to R2 for you.
--
-- Zook's repo is private, so it deliberately has no "View source" link; a link that 404s
-- for every visitor is worse than no link. It also has no releases yet, so nothing here
-- claims it is installable via Homebrew even though the tap repo exists.
--
-- gallery_images is a JSON ARRAY of image objects, not an object with an `images` key.
-- An earlier version of this file wrote '{"images": []}', which parsed into a non-array and
-- made toProject throw on `.map` — that rejected the whole refresh() and left the admin
-- showing its bundled mock data instead of the database. Keep it an array.
--
-- Both are inserted UNPUBLISHED (published = 0). With no thumbnail they would render as
-- broken cards on the live site, so they land as drafts: add an image in /admin/projects,
-- then publish from there. Nothing appears publicly until you do.
--
-- Apply:
--   npx wrangler d1 execute portfolio-db --local  --file=scripts/migrations/2026-08-27_seed_zook_and_cms_projects.sql
--   npx wrangler d1 execute portfolio-db --remote --file=scripts/migrations/2026-08-27_seed_zook_and_cms_projects.sql

INSERT OR REPLACE INTO projects (
  id, title, category, year,
  thumbnail_url, thumbnail_alt,
  tags,
  overview_description, overview_client, overview_duration, overview_role,
  details_challenge, details_solution, details_results,
  gallery_images, links,
  sort_order, published, created_at, updated_at
) VALUES (
  'zook-deploy-controller',
  'Zook',
  'DEVTOOL',
  '2026',
  '',
  'Zook — a single-binary deploy controller',
  '["Go","Docker Compose","systemd","CLI","Homebrew","GoReleaser"]',
  'A single-binary deployment controller for Docker Compose stacks and native systemd services. "To zook" is Ghanaian pidgin for to hold, or to manage — Zook holds your deployments, owning the release lifecycle: deploy, health-gate, roll back. It sits alongside Docker and Dockge rather than replacing them, and picks its runtime per stack from a zook.yaml, so a Compose stack and a plain systemd binary are deployed the same way.',
  'Self-initiated',
  'Ongoing since August 2026',
  'Sole engineer — design, implementation, docs',
  'Deploying to a small server is either manual and error-prone, or requires adopting a platform far heavier than the problem. Copying a Compose file up and running "up -d" gives you no health gate and no way back: if the new release is broken, the old one is already gone. The heavyweight alternatives assume Kubernetes, a registry and a CI pipeline — an enormous amount of ceremony for a handful of services on one box.',
  'A single Go binary that owns the release lifecycle behind an explicit deploy contract. Each release is staged, started, and then health-gated before it is allowed to take over — if the gate fails, the previous release is still there and Zook rolls back to it. Two runtimes sit behind one interface, selected per stack in zook.yaml: Docker Compose stacks and native systemd services, so the same workflow covers containerised and plain binaries. The project is documented as a handbook rather than a README, covering concepts, the deploy contract, command reference and architecture, with the docs site generated from those same pages so the published documentation cannot drift from the source.',
  '["Single binary, no runtime dependencies on the target host","Health-gated releases with rollback — a failed gate leaves the previous release running","Two runtimes behind one deploy contract: Docker Compose and native systemd","Documented as a handbook, with the docs site generated from the same source pages","Release pipeline wired through GoReleaser to a Homebrew tap"]',
  '[]',
  '[]',
  50,
  0,
  '2026-08-27T00:00:00.000Z',
  '2026-08-27T00:00:00.000Z'
);

INSERT OR REPLACE INTO projects (
  id, title, category, year,
  thumbnail_url, thumbnail_alt,
  tags,
  overview_description, overview_client, overview_duration, overview_role,
  details_challenge, details_solution, details_results,
  gallery_images, links,
  sort_order, published, created_at, updated_at
) VALUES (
  'portfolio-cms',
  'Portfolio CMS',
  'SAAS',
  '2026',
  '',
  'The admin CMS behind hearvie.dev',
  '["TypeScript","Hono","Cloudflare Workers","D1","R2","React","PWA","Web Push"]',
  'The CMS behind this site — you are looking at its output. A Cloudflare Workers API on D1 and R2, with a React admin that runs installed on a phone home screen. It manages projects, posts, notes and streams, handles contact submissions, and sends the newsletter. Built because a portfolio that is annoying to update stops being updated.',
  'Self-initiated',
  'Ongoing since February 2026',
  'Sole engineer — API, database, admin UI, infrastructure',
  'A personal site is only worth having if it stays current, and it only stays current if updating it is frictionless. The first version was not: content lived in code, so every change meant an editor, a commit and a deploy, which in practice meant sitting at a laptop. Two harder problems sat behind that. Sending a newsletter to real subscribers has to survive being interrupted — a send that fails halfway must never double-send to the people it already reached. And notifications had to reach a phone from a runtime with no Node crypto.',
  'A Hono API on Cloudflare Workers over D1, with images in R2 resized to WebP in the browser before upload. Newsletter sending is built on per-recipient delivery rows rather than a campaign-level counter: each chunk claims up to 100 pending rows with a per-call claim ID before sending, so two concurrent runs cannot grab the same recipient, an interrupted send resumes exactly where it stopped, and rows stranded mid-send are reported rather than silently counted as delivered. The admin is installable to an iOS home screen, scoped so the public site keeps its own identity, and push notifications are implemented directly against WebCrypto from RFC 8291 and RFC 8292 — the Node web-push libraries do not run on Workers — verified by decrypting the output with an independent implementation rather than trusting that encryption returned bytes.',
  '["Resumable newsletter sending — claim-based delivery rows survive interruption without double-sending","Web Push implemented from the RFCs against WebCrypto, with no dependencies","Installable to an iOS home screen, scoped to the admin so the public site is unaffected","Browser-side image resizing to WebP before upload to R2","Token-authenticated unsubscribe that cannot be used to probe which tokens are valid"]',
  '[]',
  '[{"label":"View source","url":"https://github.com/oti-adjei/Portfolio"}]',
  51,
  0,
  '2026-08-27T00:00:00.000Z',
  '2026-08-27T00:00:00.000Z'
);
