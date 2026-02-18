# Changelog

All notable changes to this project are documented here.
Entries are ordered newest first.

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
