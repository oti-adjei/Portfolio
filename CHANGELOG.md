# Changelog

All notable changes to this project are documented here.
Entries are ordered newest first.

---

## 2026-02-19 (7)

### vite-template — Project re-categorisation, Dear Akua, and Works pagination

**`src/mocks/siteContent.ts`**
- Re-categorised Home Sweet Home (id: 1) from `WEB` → `SAAS`
- Re-categorised FlexDown (id: 5) from `MOBILE` → `SAAS`
- Added Dear Akua (id: 13) as a `WEB` project — anonymous confession platform built with Node.js, Express, MongoDB; data ported from legacy `data/projects.json`

**`src/pages/home/components/WorksGallery.tsx`**
- Added `currentPage` state with `ITEMS_PER_PAGE = 9` constant
- `filteredWorks` is now sliced to the current page before rendering
- Category button click resets page to 1
- Pagination bar renders below the grid when `totalPages > 1`: prev/next arrow buttons + numbered page buttons; smooth-scrolls to `#works` section on page change

---

## 2026-02-19 (6)

### vite-template — Category-aware project gallery + new filter types

**`src/types/siteContent.ts`**
- Added optional `type?: 'web' | 'mobile'` field to `GalleryImage` — used to tag individual screenshots in SaaS project galleries

**`src/mocks/siteContent.ts`**
- Extended `worksPage.categories` to include `'SAAS'`, `'CLI'`, `'BACKEND'` alongside existing `WEB`, `MOBILE`, `DESKTOP`

**`src/pages/project/components/ProjectGallery.tsx`**
- Replaced single fixed landscape layout with three category-aware modes:
  - `landscape` (WEB / DESKTOP / CLI / BACKEND) — unchanged hero + 2-col grid behaviour
  - `portrait` (MOBILE) — centred flex grid of `160–180px` wide portrait frames with `9/19.5` aspect ratio; no stretched landscape hero
  - `mixed` (SAAS) — splits gallery images by `image.type`: web screenshots rendered in landscape layout under a "Web" heading, mobile screenshots in portrait layout under a "Mobile" heading; each sub-section is skipped if empty
- Extracted `LandscapeGallery` and `PortraitGallery` as local sub-components for reuse in mixed mode

---

## 2026-02-19 (5)

### vite-template — Floating shapes on About, Works, and Project pages

**`src/components/FloatingShapes.tsx`** *(new — shared)*
- Replaced the old About-only `about/components/FloatingShapes.tsx` (generic teal/pink/emerald blobs) with a shared component using brand colours: `#d9d1fa` (lavender), `#f75124` (orange), `#baebcd` (mint), `#faedce` (peach)
- 8 shapes: 4 circles, 2 diamonds (`rotate-45`), 2 rings (border-only) — crisp edges matching the Services section style
- `fixed inset-0 z-1 pointer-events-none` so shapes persist across the full page scroll
- Uses existing `animate-float-slow/medium/fast` Tailwind animations with staggered delays

**`src/pages/about/page.tsx`**
- Import updated from `./components/FloatingShapes` → `../../components/FloatingShapes`

**`src/pages/works/page.tsx`**
- Added `relative overflow-hidden` to wrapper div, `FloatingShapes` component, and `relative z-10` on `<main>`

**`src/pages/project/page.tsx`**
- Added `relative overflow-hidden` to wrapper div, `FloatingShapes` component, and `relative z-10` on `<main>`

**Result**: `npm run build` passes clean — 0 errors.

---

## 2026-02-19 (4)

### vite-template — Services section redesigned: 3-col minimal grid + floating shapes

**`src/mocks/siteContent.ts`**
- Updated `homePage.services.subtitle` to reflect engineering focus
- Replaced 6 placeholder service items (UI/UX Design, Design Systems, Prototyping…) with George's real services: Mobile Development, Web Development, Backend Engineering, Desktop Applications, DevOps & CI/CD, Technical Consulting

**`src/pages/home/components/Services.tsx`**
- Removed `circleColors` array, `group`/`group-hover:scale-90`/`hover:!scale-105` and card shadows
- Redesigned to 3-column grid (`sm:grid-cols-2 lg:grid-cols-3`) matching screenshot layout
- Icon container: `w-11 h-11 bg-gray-100 rounded-xl` (small gray square vs previous 65px circle)
- Added 6 floating geometric shapes in `z-0` layer using existing `animate-float-slow/medium/fast` Tailwind keyframes (already in `tailwind.config.ts`):
  - Large lavender circle (280px) — top-left, `animate-float-slow`
  - Orange diamond (100px, rotate-45) — top-right, `animate-float-medium` delay 2s
  - Mint ring (180px, border-only) — bottom-left, `animate-float-fast` delay 1s
  - Peach circle (140px) — bottom-right, `animate-float-slow` delay 3s
  - Small orange circle (70px) — mid-left, `animate-float-medium` delay 0.5s
  - Lavender diamond (90px, rotate-45) — mid-right, `animate-float-slow` delay 4s

**Result**: `npm run build` passes clean — 0 errors.

---

## 2026-02-19 (3)

### vite-template — Scroll reveal animations (matching legacy ScrollReveal)

**`src/components/Reveal.tsx`** *(new)*
- Lightweight scroll-reveal component using native `IntersectionObserver` — zero new dependencies
- Props: `origin` (`bottom` | `left` | `right` | `top`), `delay` (ms), `className` (forwarded to wrapper div)
- Fades in + translates when element enters viewport; fires once then unobserves

**`src/pages/home/components/Hero.tsx`**
- Left content: `<Reveal origin="left" delay={200}>` — matches legacy `.home-text { origin: left }`
- Right image: `<Reveal origin="right" delay={350}>` — matches legacy `.home-img { origin: right }`

**`src/pages/home/page.tsx`**
- All sections below Hero wrapped in `<Reveal origin="bottom">` — matches legacy `.about,.portfolio,.service,.cta` reveal
- Sections: AboutNew, SkillsOrbit, FeaturedWorks, Services, Stats, ContactCTA, Footer

**Result**: `npm run build` passes clean — 0 errors.

---

## 2026-02-19 (2)

### vite-template — Replace Ava Chen persona with George's real content

**`src/mocks/siteContent.ts`**
- Replaced all 4 `'Ava Chen'` references with `'George Oti-Adjei'`
- `footer.copyright`: updated year to 2026, name to George Oti-Adjei; replaced Readdy/Privacy/Terms links with real GitHub and LinkedIn links
- `homePage.hero`: badge → `'Mobile & Software Engineer'`; heading and subtitle updated to match George's actual profile
- `homePage.hero.socialIcons`: removed Twitter/Dribbble; updated GitHub → `github.com/oti-adjei`, LinkedIn → `linkedin.com/in/george-jrr`
- `homePage.about`: name, role, bio (3 paragraphs from CV), tools array → Flutter, React, Go, TypeScript, Node.js, Figma
- `homePage.stats`: years experience `8+` → `3+`; projects `50+` → `20+`; clients `30+` → `10+`
- `aboutPage.hero`: avatar switched from readdy.ai URL to `/Gpic.webp`; name, role, tagline updated
- `aboutPage.bio.paragraphs`: full rewrite from CV — Accra-based, 3+ years, real career context
- `aboutPage.expertise.items`: replaced Product Design/UX Research with Mobile Development, Web & Frontend, Backend Engineering, DevOps & Tooling
- `aboutPage.journey.timeline`: 5 fictional entries replaced with 6 real roles — MashHarder, Senvon Studio, Enyata Ghana, teamAlpha, ADB Ghana, Npontu Technologies
- `aboutPage.philosophy`: quote and label updated to engineering philosophy
- `contactPage.contactInfo.cards`: email → `jrgeorge991@gmail.com`, phone → `+233 50-005-2067`, location → `Accra, Ghana`
- `contactPage.contactInfo.socialLinks`: removed Twitter/Dribbble; real GitHub and LinkedIn URLs
- `contactPage.map`: embed and title updated to Accra, Ghana

**`src/pages/home/components/AboutNew.tsx`**
- `toolIcons` map updated: removed Sketch/Tailwind CSS; added Flutter and Go
- Removed stale linter-injected `className="bg-[a09dab]"` from bio paragraph

**Result**: `npm run build` passes clean — 0 errors.

---

## 2026-02-19

### vite-template — Replace all placeholder projects with George's real CV projects

**`src/mocks/siteContent.ts`**
- Replaced all 14 fictitious "Ava Chen" placeholder projects with 12 real projects from George's CV and legacy portfolio
- Projects ordered newest-first by ID (1–12) so `featuredWorks.projectIds` naturally displays them in reverse-chronological order
- Updated `featuredWorks.projectIds` from `[1..14]` to `[1..12]`

**Projects added:**

| ID | Title | Category | Year |
|---|---|---|---|
| 1 | Home Sweet Home | WEB | 2025 |
| 2 | PriPri | DESKTOP | 2025 |
| 3 | Scribble Notes | MOBILE | 2025 |
| 4 | Mummy's Darl | WEB | 2025 |
| 5 | FlexDown | MOBILE | 2023 (active 2025) |
| 6 | Envoyer GH | WEB | 2024 |
| 7 | Purple Pay | MOBILE | 2024 |
| 8 | Nagyique Boutique | WEB | 2024 |
| 9 | Pokebook | MOBILE | 2023 |
| 10 | Gullivers Travel Hotel | WEB | 2022 |
| 11 | GESA KNUST | MOBILE | 2022 |
| 12 | Pro-Vid | MOBILE | 2021 |

**`vite-template/public/assets/images/`**
- Copied legacy project images into vite-template/public for Vite serving
- Real screenshots: envoyer/, gesa/, flexdown/, gullivers/
- Generic placeholders (to be replaced with real screenshots): projects/ folder with per-project named files

**`src/pages/home/components/ContactCTA.tsx`**
- Removed unused `Link` import (pre-existing TS6133 error blocking build)

---

## 2026-02-18 (9)

### vite-template — Section heading alignment matches legacy pattern

**`src/pages/home/components/FeaturedWorks.tsx`**
- Heading block changed from `text-center` to `text-right`, matching legacy `portfolio .heading { text-align: right }`
- Subtitle `<p>` switched from `mx-auto` to `ml-auto` to keep it right-anchored

**`src/pages/home/components/Services.tsx`**
- Heading block changed from `text-center` to `text-left`, matching legacy `service .heading { text-align: left }`
- Removed `mx-auto` from subtitle `<p>`

Stats (`text-center`) and ContactCTA remain unchanged — they already match the legacy pattern.

---

## 2026-02-18 (8)

### vite-template — Services section redesigned to match legacy style

**`src/pages/home/components/Services.tsx`**
- Removed gradient card backgrounds and per-icon `colorMap`
- Cards are now white with the legacy box-shadow (`18px 0px 87px 0px rgb(10 15 70 / 7%)`) and `border-radius` 12px
- Circle icon container (65×65, `border-radius: 50%`) cycles through the 4 legacy colours: `#f75124` → `#baebcd` → `#d9d1fa` → `#faedce`
- Hover effect: hovered card scales to `1.05`, all others shrink to `0.9` via `group-hover:scale-90 hover:!scale-105` on a `group` grid wrapper — matching legacy `.row:hover / .row:not(:hover)` behaviour
- Layout switched to 2-column grid (`sm:grid-cols-2`) matching legacy `minmax(430px, auto)` proportions

---

## 2026-02-18 (7)

### vite-template — About section tool icons: legacy circle backgrounds

**`src/pages/home/components/AboutNew.tsx`**
- Replaced flat `bg-gray-50 rounded-lg` icon containers with `rounded-full` circles
- Cycles through the 4 legacy background colours (`#f75124`, `#baebcd`, `#d9d1fa`, `#faedce`) by index
- Removed per-icon text colours; icons now render as `text-gray-800` for contrast on all backgrounds
- Added `hover:-translate-y-1.5` lift transition to match legacy `.skill-item:hover` behaviour

---

## 2026-02-18 (6)

### vite-template — Fix header and footer logo not rendering

**`src/types/siteContent.ts`**
- Added optional `imageUrl?: string` to `Navigation.logo` and `Footer.logo` types

**`src/mocks/siteContent.ts`**
- Fixed both logo entries: `url` corrected to `'/'` (was accidentally set to the image path), `imageUrl` set to `'/GHlog.png'`, `text` set to `'GH'` as fallback alt text

**`src/pages/home/components/Header.tsx`**
- Logo link now renders `<img>` when `imageUrl` is present, falls back to bold text span

**`src/pages/home/components/Footer.tsx`**
- Logo link now renders `<img>` when `imageUrl` is present (with `brightness-0 invert` for white-on-dark display), falls back to text

---

## 2026-02-18 (5)

### vite-template — FeaturedWorks hover overlay + consistent card heights

**`src/pages/home/components/FeaturedWorks.tsx`**

Hover overlay (matching legacy `.layer:hover` behaviour):
- Removed the category pill badge at bottom-right
- Added an absolutely positioned overlay div (`opacity-0 → opacity-100` on group-hover, `duration-[400ms]`)
- Overlay background: `bg-gradient-to-b from-black/50 to-[#191919]` (matching legacy)
- Project title (`h3`) and category (`p`) slide up via `translate-y-4 → translate-y-0` with `opacity-0 → opacity-100` on hover; category has `delay-75` for stagger
- `Link` now wraps the whole card (was a nested child) so the entire card is clickable

Card height fix (mobile projects no longer shorter than desktop):
- Desktop layout wrappers: explicit `h-[480px]` on both `col-span-2` and `col-span-1` divs — forces same row height regardless of content
- Mobile grid wrappers: `h-[280px] sm:h-[350px]` wrapper divs around each card
- `ProjectCard` now uses `h-full` to fill whatever height the wrapper sets
- Desktop images: `w-full h-full object-cover` (fills card, crops if needed)
- Mobile images: `h-full w-auto max-w-[90%] object-contain` (full height, portrait preserved)

Also aligned "See More" button to legacy orange: `bg-[#f75023] hover:bg-[#e0431a]`

---

## 2026-02-18 (4)

### vite-template — Use legacy hero image

- Copied `assets/images/Gpic.webp` → `vite-template/public/Gpic.webp` (served at `/Gpic.webp`)
- Updated `src/mocks/siteContent.ts` `hero.image.url` from readdy.ai placeholder to `/Gpic.webp`

---

## 2026-02-18 (3)

### vite-template — Switch font to Jost (legacy font)

- `src/index.css` — replaced Playfair Display Google Fonts import with Jost (weights 100–900); updated `@layer base` to apply `Jost, sans-serif` globally via `*` selector
- `tailwind.config.ts` — replaced `fontFamily.serif` (Playfair Display) with `fontFamily.sans` (Jost) so Tailwind's `font-sans` utility and defaults all use Jost

---

## 2026-02-18 (2)

### vite-template — Migrate legacy visual style to Stats, ContactCTA, Footer

**Stats.tsx** (`src/pages/home/components/Stats.tsx`)
- Replaced vibrant gradient card backgrounds with solid pastel colours matching the legacy site: mint `#baebcd`, lavender `#D9D1FA`, peach `#faedce`
- Switched text from white to dark (`text-gray-900 / text-gray-800 / text-gray-600`) for legibility on pastels
- Removed icon circles (white backdrop circle + Remixicon icon) — legacy design has no icons
- Replaced `shadow-lg / hover:shadow-2xl` with the soft legacy shadow: `shadow-[18px_0px_87px_0px_rgb(10_15_70/7%)]`
- Changed card border-radius from `rounded-3xl` to `rounded-xl` (12 px, matching legacy)
- Removed unused `iconMap` constant

**ContactCTA.tsx** (`src/pages/home/components/ContactCTA.tsx`)
- Replaced purple→pink→orange gradient background with solid `#8067f0` (exact legacy purple)
- Removed the absolute-positioned gradient overlay div (no longer needed)
- Changed submit button from `bg-orange-500` to `bg-[#f75023]` / `hover:bg-[#e0431a]` (exact legacy orange)

**Footer.tsx** (`src/pages/home/components/Footer.tsx`)
- Changed layout from `flex-row justify-between` (logo left, links right) to centred `flex-col items-center`
- Added `tracking-wide` to copyright text (matching legacy `letter-spacing: 1px`)
- Simplified link rendering (removed shared `commonProps` spread pattern)

**Result**: `npm run build` passes clean — 0 errors.

---

## 2026-02-18

### vite-template — Port & cleanup (AI slop removal)

**Dependencies installed**
- `react-router-dom` — routing
- `tailwindcss@^3`, `postcss`, `autoprefixer` — styling

**Scaffolding fixed**
- `vite.config.ts` — replaced Readdy.ai boilerplate; added `@` path alias, removed `unplugin-auto-import`, `__BASE_PATH__` define, and Readdy preview scripts
- `tailwind.config.ts` — created; Playfair Display font, custom float/pulse animations
- `postcss.config.ts` — created
- `index.html` — added Remixicon CDN, title "Ava Chen — Portfolio"; removed Font Awesome CDN and `/preview-inject/index.ts` script
- `src/index.css` — replaced Vite default with Tailwind directives + Google Fonts import
- `src/App.tsx` — replaced boilerplate with `BrowserRouter` + `AuthProvider` + `ContentProvider` + `Suspense`
- `src/router/index.ts` — removed `window.REACT_APP_NAVIGATE` global hack; simplified to `useRoutes`
- `src/App.css` — deleted (Tailwind replaces it)

**TypeScript fixes**
- Applied `import type` to all type-only imports across 8 files (`verbatimModuleSyntax` compliance)
- `src/types/siteContent.ts` — completely rewritten to match actual mock data and component usage:
  - `thumbnail`: `{ url, alt }` (was bare string in some AI iterations)
  - `gallery`: `{ images: GalleryImage[] }` (was flat array)
  - `ctaButton` / `secondaryButton`: `{ label, url }` throughout
  - `MenuItem` / `FooterLink`: use `url` not `href`/`link`
  - `ContactInfoSection`: removed stray `id` field; `availability` is `{ status, label }`
  - `ContactFormSection`: `submitButton: { label, loadingLabel }`, `messages: { success, error }`
  - `AboutHeroSection`: `avatar: { url, alt }`, `tagline`
  - `JourneySection` / `ExpertiseSection`: use `sectionTitle`
  - `ContactHeroSection`: `headingLines: string[]`
  - `Project.id`: `string | number`

**Admin page bug fixes**
- `admin/footer` — `href` → `url` in `FooterLink`
- `admin/navigation` — `href` → `url` in `MenuItem`
- `admin/about` — `avatar.url` for ImageUploader; `sectionTitle` field names
- `admin/contact` — `submitButton.label`, `messages.success/error`, `card.label`, nullable `link`, `availability.status`
- `admin/works` — removed invalid `title` prop from `AdminLayout`
- `admin/projects/edit` — `thumbnail` initialised as `{ url, alt }`; `gallery` initialised as `{ images: [] }`; all gallery helpers updated to operate on `gallery.images`; removed invalid `helpText` prop from `ImageUpload`
- `admin/projects` — `gallery.images.length`; `String(project.id)` for URL param; simplified thumbnail img to `.url`/`.alt`

**Component fixes**
- `FeaturedWorks.tsx` — `DisplayProject.id`: `number` → `string | number`
- `Stats.tsx` — `Record<string, string>` type on `colorMap` / `iconMap`
- `AdminLayout.tsx` — removed unused duplicate `menuItems` variable
- `mocks/siteContent.ts` — removed stray `id: 'contact-info'`

**Result**: `npm run build` passes clean — 105 modules, 0 errors, 0 warnings.

---

## 2024 and earlier — Legacy static site

See git log for earlier commits to the root static site (`index.html`, `css/`, `js/`, `pages/`).
