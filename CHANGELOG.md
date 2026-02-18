# Changelog

All notable changes to this project are documented here.
Entries are ordered newest first.

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
