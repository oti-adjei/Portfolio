---
title: "The full-bleed hero that broke my sticky header"
date: 2026-06-26
tags: [css, layout, sticky, overflow, debugging]
excerpt: "A short story about how widening one section of my portfolio quietly killed the sticky nav on the entire page — and the one-word CSS change that fixed it."
---

# The full-bleed hero that broke my sticky header

I spent the evening polishing the hero on my portfolio and ran into one of those CSS bugs that takes ten seconds to fix and an hour to understand. I'm writing it down because I'll absolutely forget by next quarter.

## The setup

My V2 home page lives inside a fixed-width container:

```tsx
<main className="mx-auto max-w-[1380px]">
  <div className="sticky top-0 z-30 ...">{/* nav pill */}</div>
  <section id="work">{/* hero */}</section>
  <section id="about">...</section>
  ...
</main>
```

A 1380px shell, a sticky nav pill at the top, and a hero section underneath. Everything inside the shell. Clean.

## What I wanted

Two unrelated tweaks:

1. **Header sits *inside* the hero at page load**, then sticks normally as you scroll. So no awkward gap above and below the nav when the page first paints.
2. **Hero background spans the full viewport width**, while every other section keeps the 1380px container.

The first one was easy. I gave the hero a `-mt-[72px]` and a `min-h-screen`, so it pulled up under the transparent nav pill. The pill kept its `sticky top-0` and the existing scroll listener still swapped in the blurred background once `scrollY > 12`. Nothing exotic.

The second one is where I tripped.

## The full-bleed move

To make only the hero background break out of the 1380px container, I used the classic full-bleed trick on the hero's inner element:

```tsx
<div className="... w-screen left-1/2 -translate-x-1/2 overflow-hidden">
```

`w-screen` makes it 100vw wide. `left-1/2 -translate-x-1/2` re-centers it on the viewport. The result: the cream texture + bg image now go edge to edge, while a nested `mx-auto max-w-[1380px]` container keeps the hero text aligned with the rest of the page.

But `w-screen` inside a narrower parent can produce a horizontal scrollbar on some viewports (the element is technically wider than its containing block). So I did what I always do reflexively:

```diff
- <div className="min-h-screen ...">
+ <div className="min-h-screen ... overflow-x-hidden">
```

Built it. Looked at it. Everything was perfect.

Until I scrolled.

## The bug

The sticky nav pill no longer stuck. It scrolled away like a normal `position: static` element. The scroll listener was firing (logs proved it), the `scrollY > 12` branch was correctly producing the "scrolled" class, but the element itself was just… leaving.

I tried everything before I got to the real fix:

- `z-index`? Already 30.
- Some parent forcing `position: relative`? No.
- React strict mode double-rendering eating the listener? No.
- The `-mt-[72px]` from earlier somehow conflicting? Removed it. No change.

Then I went back to the diff and saw it.

## The cause

`overflow: hidden` on any ancestor of a sticky element — on **either** axis — turns that ancestor into a scroll container. Once that happens, `position: sticky` sticks to *that* ancestor's box, not the viewport. And because the ancestor in my case (the outer page wrapper) is way taller than the viewport, the sticky element never has anywhere to stick — it just rides along with the document.

This is in the spec, it's well-known, and I've been bitten by it before. The fact that I was using `overflow-x-hidden` (only one axis) didn't matter. The browser still establishes the scroll container.

The MDN article on `position: sticky` literally has a callout about this. I have read that callout. Multiple times. I still wrote `overflow-x-hidden` without thinking.

## The fix

One word:

```diff
- <div className="min-h-screen ... overflow-x-hidden">
+ <div className="min-h-screen ... overflow-x-clip">
```

`overflow: clip` is the newer cousin. It clips the overflowing content the same way `hidden` does, but **does not establish a scroll container**. Which means descendant `position: sticky` elements continue to stick to the viewport like they always did.

`overflow-x: clip` has been in all evergreen browsers for a while now (Chrome 90+, Firefox 81+, Safari 16+). Tailwind exposes it as `overflow-x-clip`.

That's it. That was the whole fix. The header started sticking again. The hero kept its full-bleed background. No horizontal scrollbar.

## The takeaways

- If a `position: sticky` element stops sticking after you "just added an overflow rule somewhere," check every ancestor. Any axis. Any value other than `visible` (with the exception of `clip`) breaks it.
- `overflow: clip` is the right tool 95% of the time you reach for `overflow: hidden` and you don't actually need a scroll container. Especially on page-level wrappers.
- Full-bleed via `w-screen left-1/2 -translate-x-1/2` is fine and works inside a fixed-width container — just pair it with `overflow-x-clip` higher up, not `overflow-x-hidden`.
- "I'll just remember not to do that" is not a strategy. Write the post.

Now I have one.
