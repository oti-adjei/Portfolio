# Design System — Reference

Terse personal reference. For the live, interactive version, visit [/design-system](https://georgeheavenson.com/design-system).

Last updated: 2026-06-26.

---

## Brand

- Mark: `src/components/logo/GHLogoMark.tsx` — animated H-in-ring, with smile
- Full lockup: `src/components/logo/GHLogoFull.tsx`
- Assets: `frontend/public/assets/brand/`
  - `gh-lockup.png` — promotional
  - `gh-mono-black.svg`, `gh-mono-white.svg` — mono variants
  - `gh-primary.svg`, `gh-primary-inverse.svg`
  - `gh-secondary.svg`, `gh-secondary-mono.svg`, `gh-secondary-inverse.svg`

**Rules**

- Clear space ≥ height of the H crossbar
- Min size: 24px mark, 32px full lockup
- Dark variant on cream/light; light variant on `#02231c` ink only
- Never recolor the green ring outside brand palette
- Never stretch, skew, rotate, or overlay on busy imagery

---

## Color

### Brand

| Token           | Hex       | Tailwind                    | Role                                 |
| --------------- | --------- | --------------------------- | ------------------------------------ |
| cream-bg        | `#faf8ef` | `bg-[#faf8ef]`              | Page bg (cream theme)                |
| cream-surface   | `#f3efe2` | `bg-[#f3efe2]/85`           | Pill nav, raised cream surfaces      |
| cream-accent    | `#d8d3c8` | `bg-[#d8d3c8]`              | Cream-side accent fills              |
| signal-orange   | `#f75124` | `bg-/text-/ring-[#f75124]`  | Signature accent, links, callouts    |
| signal-purple   | `#8067f0` | `bg-/text-/ring-[#8067f0]`  | Secondary accent                     |
| twitch-purple   | `#9146ff` | `bg-/text-[#9146ff]`        | Twitch-only (streams)                |
| logo-green      | `#00e281` | n/a                         | Logo mark — brand only               |
| ink-dark        | `#02231c` | `bg-[#02231c]`              | Logo "dark" fill, deep ink backdrop  |

### Neutrals (Tailwind defaults)

| Class           | Role                       |
| --------------- | -------------------------- |
| `text-gray-900` | Ink — primary text         |
| `text-gray-700` | Secondary text             |
| `text-gray-500` | Muted — nav, meta          |
| `text-gray-400` | Eyebrow micro-labels       |
| `ring-gray-200` | Hairline on white          |
| `ring-black/[0.06]` | Hairline on cream      |

### Theme mapping

| Surface  | Cream theme         | White theme            |
| -------- | ------------------- | ---------------------- |
| Page     | `#faf8ef`           | `#ffffff`              |
| Pill nav | `#f3efe2/85` + blur | `gray-100/85` + blur   |
| Hairline | `black/[0.06]`      | `gray-200`             |

---

## Typography

**One family: Jost** (Google Fonts, all weights 100–900). Loaded in `src/index.css`.

CLAUDE.md mentions Playfair Display and Instrument Serif — V1 holdovers, not used in V2.

### Scale

| Role     | Size               | Weight | Tracking         | Notes                       |
| -------- | ------------------ | ------ | ---------------- | --------------------------- |
| Display  | `text-4xl/5xl/7xl` | 700    | `tracking-tight` | `leading-[0.95]`            |
| H1       | `text-4xl`         | 700    | `tracking-tight` |                             |
| H2       | `text-3xl`         | 700    | `tracking-tight` |                             |
| H3       | `text-xl`          | 600    | `tracking-tight` |                             |
| Body     | `text-[15px]`      | 400    | default          | `leading-[1.8]` for prose   |
| Body LG  | `text-[16px]`      | 400    | default          | hero subcopy                |
| Small    | `text-[13px]`      | 400    | default          | meta, captions              |
| Micro    | `text-[11px]`      | 400    | `tracking-[0.18em]` | uppercase eyebrows       |
| Mono     | `font-mono`        | 400    | default          | technical labels            |

---

## Space & layout

- Shell max width: `max-w-[1380px]`
- Gutter: `px-4 sm:px-6 lg:px-8` (sometimes `px-6 sm:px-8 lg:px-12` for section interiors)
- Section padding: `py-12` to `py-14`, separated by `border-t border-black/5`
- Grid pattern: `grid grid-cols-1 lg:grid-cols-3 gap-12` — eyebrow column + 2-col content
- Sticky eyebrows: `sticky top-[92px]`

### Radii

| Class            | Used for                  |
| ---------------- | ------------------------- |
| `rounded-full`   | Pill nav, buttons, badges (signature) |
| `rounded-3xl`    | Larger card surfaces      |
| `rounded-2xl`    | Standard cards            |
| `rounded-xl`     | Inset surfaces            |

### Shadow

`shadow-sm` is the default. `shadow-md` and `shadow-lg` exist but are rarely needed — hairline rings do most of the work.

---

## Motion

From `tailwind.config.ts`:

| Class                | When to use                          |
| -------------------- | ------------------------------------ |
| `animate-float-slow` | Ambient background shapes (large)    |
| `animate-float-medium` | Ambient background shapes (mid)    |
| `animate-float-fast` | Ambient background shapes (small)    |
| `animate-pulse-subtle` | CTA emphasis, sparingly           |
| `animate-scroll`     | Marquee strip (desktop)              |
| `animate-scroll-mobile` | Marquee strip (mobile, slower)    |

**GSAP-driven**

- Logo intro — `GHLogoMark` on mount
- `PageLoader` — initial app loading
- `Reveal` component — fade + translate on scroll. Props: `origin="bottom" | "left" | "right"`, `delay={ms}`

All motion respects `prefers-reduced-motion: reduce`.

---

## Primitives

### Buttons

```tsx
// Pill (secondary)
className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[12px] text-gray-700 hover:bg-gray-50"

// Primary (orange)
className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#f75124] text-white text-[13px] hover:opacity-90"

// Ink CTA
className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gray-900 text-white text-[13px] hover:bg-gray-800"

// Icon-only (theme toggle pattern)
className="w-8 h-8 rounded-full bg-white ring-1 ring-gray-200 inline-flex items-center justify-center text-gray-600 hover:bg-gray-50"
```

### Badges

```tsx
// Cream chip
className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f3efe2] text-[11px] text-gray-700"

// Tinted (accent color, 10% bg)
className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f75124]/10 text-[11px] text-[#f75124]"

// Outlined
className="inline-flex items-center px-2.5 py-1 rounded-full ring-1 ring-gray-200 text-[11px] text-gray-600"
```

### Card

```tsx
className="rounded-2xl ring-1 ring-black/5 bg-white/50 p-5"
```

### Link

```tsx
className="text-gray-900 underline underline-offset-[6px] decoration-1 hover:text-[#f75124]"
```

Icons: Remixicon via CDN (e.g. `<i className="ri-arrow-right-up-line" />`).

---

## Patterns

### Sticky pill nav

Implemented in `frontend/src/pages/public/v2/Shell.tsx`.

- Flush at top: transparent, no ring
- After `scrollY > 12`: `ring-1 ring-black/[0.06]` + tinted pill bg (`#f3efe2/85` cream, `gray-100/85` white) + `backdrop-blur-md`
- Transition: `transition-all duration-300`

### Eyebrow + display heading

```
[micro eyebrow]
[Display heading.] ← orange period as flourish
[max-w-md body subcopy]
```

### Section block

Two-column grid: eyebrow + title on the left (sticky), content on the right. See `Section` component in `frontend/src/pages/public/v2/design-system/page.tsx` for canonical implementation.

### Theme toggle

Sun/moon button in `Shell.tsx`. Component-local state (no persistence). Toggles page bg and pill tint.

---

## Voice

- **Plain over clever.** Say what the thing is.
- **Short over long.** Cut three words if you can.
- **First person, low ceremony.** "I built this" not "We are excited to announce."
- **Specifics over adjectives.** Numbers beat superlatives.
- **The orange period is a flourish.** Closes hero headings only.
- **Never ALL CAPS for emphasis.** Tracked uppercase micro-labels are for category.

---

## Routing

- Live showcase: `/design-system` (registered in `src/public/router/config.tsx`)
- Not linked from main nav. Direct URL only.
- When V3 launches and V2 moves to `/v2/*`, this route follows: `/v2/design-system`.
