---
title: "Starting with Automad — and the road back to PHP for 9Ts"
date: 2026-06-12
project: 9ts-cms-port
status: draft
tags: [automad, php, herd, cms, port, 9ts]
---

# Starting with Automad — and the road back to PHP for 9Ts

This is post #1 in a series about porting the 9Ts marketing site from a static HTML pipeline (handwritten `.dc.html` templates fed through a custom `build-static.js`) into a CMS the team can edit without touching code. I wanted to write this one while the early decisions were still fresh — so future-me, and anyone onboarding to the project, can see what we picked and why, plus what bit us along the way.

## Why we're moving off "raw HTML + a build script"

The current site looks fine. Six artisanal `.dc.html` files plus `nav.dc.html`, `footer.dc.html`, and a Node script that splices the partials together and dumps a `demo/` folder we push to Netlify. It works.

The problem isn't the output — it's the edit loop:

- New journal post = open a `.dc.html` file, paste in HTML, rebuild, push.
- Swap a work case study = edit a JS array literal inside `<script type="text/x-dc">`, hope no quote escapes, rebuild, push.
- Change the hero copy = same dance.

My collaborator is a PHP/C# dev. The future "let's update the holiday banner" friction needs to be a browser, not a build pipeline. So: CMS.

## How we narrowed down the CMS

The site is mostly marketing pages + occasional journal posts + the odd work case swap. Low cadence, but the **structure** (Services have icons + descriptions + dot color; Work has client + year + role + hero image) is richer than "a blog with posts."

I went through the flat-file PHP CMS shortlist:

- **Bludit** — easiest install, but it's blog-shaped. Services and Work as rich pages with structured fields end up stuffed into a WYSIWYG body. Outgrows in ~a month.
- **Grav** — most powerful, best docs, structured content done right. But Twig theming + a heavier framework means more porting work upfront, and the friend's PHP-and-go familiarity matters here.
- **Kirby** — beautiful, but paid (~$99/site). Skipped for the v1 port.
- **Typemill** — docs-first, mismatch.
- **Ava CMS** — too new, no track record.
- **Automad** — block-based content, flat-file, good DX for porting an existing HTML design, themes are plain PHP files (not Twig).

We went with **Automad**. The clincher was that the existing `.dc.html` files already separate "data" (the `renderVals()` arrays) from markup. Automad's "child pages as collection items + page fields for repeaters" model lined up almost 1:1 with our current shape.

## The plan

1. Install Automad locally under **Laravel Herd** (which we already use for PHP version juggling).
2. Create a custom theme at `packages/9ts/main/` that mirrors the static design exactly — vanilla CSS, no Tailwind refactor (that's a separate later project).
3. Port the homepage as a proof-of-concept.
4. Then services, work, about, journal, contact, FAQ, legal.
5. Cutover from Netlify to any PHP host.

## What bit us along the way (Phase 1)

### Issue 1 — PHP 8.4 deprecation warnings spamming the welcome page

Fresh install. Visit `9ts-cms.test`. Got a wall of `Deprecated: Creation of dynamic property Automad\Engine\Processors\TemplateProcessor::$ContentProcessor is deprecated` — about 150 lines of it — followed by the default Automad welcome page in raw, unstyled HTML.

The site was actually working. The deprecation warnings were getting printed **before** the `<!doctype>`, which put the browser into quirks mode and broke how the theme CSS loaded.

Two paths:

- **A** — Patch `index.php` with `error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);`. 5-second fix.
- **B** — Downgrade the site's PHP version to 8.1 in Herd, where Automad v1 (Feb 2024) was happy.

I went with B. Herd makes per-site PHP versioning trivial, and Automad's v2 beta is being rewritten for modern PHP — so PHP 8.1 here is "park it until the upgrade" rather than a workaround.

**Lesson:** when a CMS predates a PHP version's strict deprecations and you have per-site PHP control, downgrade the *site* rather than patching the CMS.

### Issue 2 — Template path mismatch

Wrote `packages/9ts/main/templates/home.php`, switched the active theme in `shared/data.txt`. Got:

> Template `/9ts/main/home.php` for page `9Ts Studio` is missing!

The default `standard/light` theme has a `templates/` subfolder, so I assumed Automad expected templates there. It doesn't. Templates live **at the theme root**. The `templates/` folder in the standard theme is a separate, parallel thing (shared templates that themes inherit from).

Fix: move `home.php` and `elements/` up one level. Done.

**Lesson:** when a CMS supports multiple template locations, the error message tells you where it actually looked. `/9ts/main/home.php` not `/9ts/main/templates/home.php`. Read the path, don't trust the folder name in another theme.

### Issue 3 — `@i(...)` is not Automad's include syntax

I used `@i(elements/head.php)` — feels right, lots of templating engines use it. Automad uses **`<@ elements/head.php @>`**. The literal text `@i(elements/head.php)` rendered on the page because Automad's parser ignored it.

Fix: swap to the right syntax. Also dropped a `@{ @date(Y) }` runtime expression in the footer — that's not a thing in Automad, just hardcoded `2026`.

**Lesson:** when a CMS-specific feature seems to do nothing, check whether the *string* even matched the engine's regex. Silent passthrough is a strong signal.

### Issue 4 — Herd + Valet polluting the base URL

Page rendered, but completely unstyled. All CSS hrefs in the source HTML looked like:

```
/Applications/Herd.app/Contents/Resources/valet/server.php/packages/9ts/main/css/base.css
```

Herd is Valet under the hood, and Valet routes through a `server.php` shim. Automad's automatic base-URL detection picked that script path up and prepended it to every link, every asset, every internal href.

Fix: set `AM_BASE_URL` to an empty string in `config/config.php`:

```json
"AM_BASE_URL": "",
```

That tells Automad: don't try to detect, just root everything at `/`.

**Lesson:** when a CMS does "smart" URL detection and your local environment uses a routing shim (Valet, MAMP's MultiPHP, etc.), expect the auto-detection to be wrong and override it explicitly.

### Issue 5 — homepage rendered but slug mismatch

When I retired the default `pages/project.txt` and added `pages/home.txt`, the home page started working — but I was also confused for a minute that the default home page was at `pages/project.txt` (directly, not in a folder). The convention is: **the filename stem = the template name** for the page. So `pages/home.txt` means "render with `home.php`." Child pages live in subfolders.

This isn't a bug, it's just a learning curve.

## Where we are now

- ✅ Automad installed at `~/Herd/9ts-cms/`, served at `http://9ts-cms.test`.
- ✅ Custom `9ts/main` theme rendering the homepage.
- ✅ All 7 homepage sections ported (hero with rotating wax-stamp sticker, marquee, trusted-by, capabilities grid, work tiles, process timeline, team flip cards, pricing packages, manifesto, contact form).
- ✅ Floating decorative SVG shapes layered behind content.
- ✅ Sticky cream header with lang toggle + "Book a call" CTA, full dark footer with newsletter strip.
- ✅ The iOS Safari hamburger fix (transform-based slide + `100svh`) carried forward from the static version — that one bit us **before** the port, in another post.
- ✅ Editable headline fields exposed in the admin so the team can tweak copy without touching templates.

## What's next

- **Phase 3:** services overview + 6 service detail child pages, work index + 4 work case studies.
- **Phase 4:** about + team child pages, journal index + posts, contact + FAQ.
- **Phase 5:** legal pages, 404, sitemap, OG/meta polish.
- **Phase 6:** cutover from Netlify to a small PHP host.

## What I'd tell past-me

If you're porting a hand-rolled static site to a flat-file PHP CMS:

1. **Pick the PHP version the CMS was built for, not the latest.** PHP 8.4 is great, but deprecations break unstyled output in ways that look like "the CSS isn't loading."
2. **Override base-URL auto-detection on day one** if you're behind any kind of routing shim.
3. **Don't trust convention from another theme** — look up the actual rule for templates, includes, and page-data filenames.
4. **Port the hero first**, end-to-end (CSS, template, content, admin field), before laying down any more sections. The first round-trip tells you whether the loop works.

More to come as we hit services + work next week.
