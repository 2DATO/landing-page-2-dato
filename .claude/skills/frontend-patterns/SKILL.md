---
name: frontend-patterns
description: Vanilla HTML/CSS/JS patterns, performance, accessibility, and SEO for the 2Dato static landing page
type: project-skill
---

# frontend-patterns

Guidance when editing `index.html`, `styles.css`, `main.js`, or anything in `assets/`.

## Site profile

- Static single-page site, no framework, no bundler
- Renders on `DOMContentLoaded` via `main.js` init functions
- Heavy visuals: canvas particles, gradient glass cards, animated counters
- Target: fast first paint on mobile over Colombian 4G

## HTML

- One `index.html`. Keep semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Every `<img>` needs `alt`, `width`, `height`, `loading="lazy"` (except LCP image which is eager), `decoding="async"`
- Use `<picture>` with WebP + JPG fallback for photographs
- Inline SVG icons are fine — keep them small; add `aria-hidden="true"` when decorative
- Never ship `<style>` blocks in HTML — everything belongs in `styles.css`

## CSS

- Design tokens live at the top of `styles.css` as CSS custom properties (`--color-*`, `--gradient-*`, `--ease-*`)
- Prefer custom properties over hard-coded hex / timing values
- Mobile-first breakpoints; test ≤360 px width and ≥1440 px
- Respect `@media (prefers-reduced-motion: reduce)` — gate every animation, transition, and scroll effect

## JS

- Vanilla ES2022, no transpilation. Target evergreen browsers
- `'use strict'` at the top of `main.js`
- Every `init*` function must be idempotent and guard against missing DOM nodes
- Pause expensive work on `document.visibilitychange` (already done for particles — do the same for any future RAF loop)
- No globals beyond the init entry; expose nothing on `window`

## Performance

- **LCP budget:** under 2.5 s on 4G — the hero + first team photo dominate
- Team photos must be resized to display size (≤640 px wide for cards) and served WebP-first
- Preload critical fonts with `<link rel="preload" as="font" crossorigin>` only if they're render-blocking
- Never import a font variant (weight/style) that isn't used
- Avoid layout shift: always set explicit `width`/`height` on media

## Accessibility

- Every interactive element reachable by keyboard; visible focus outlines (no `outline: none` without a replacement)
- `aria-expanded` on the mobile nav toggle, flipped on open/close
- Skip-to-content link as the first focusable element
- Color contrast ≥ 4.5:1 for body text (check against the dark glass background)
- Decorative canvases: `aria-hidden="true"` and `role="presentation"`

## SEO / social

- `<title>` under 60 chars, `<meta name="description">` under 160
- Open Graph: `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type=website`, `og:locale=es_CO`
- Twitter: `twitter:card=summary_large_image`, title, description, image
- `<link rel="canonical" href="https://2dato.co/">`
- `<meta name="theme-color">` matching the dark palette
- `sitemap.xml` + `robots.txt` at repo root

## When in doubt

- Check `documentation-lookup` skill for library-specific behavior
- For anything non-trivial, run `planner` → `tdd-guide` (if testable) → implementation → `code-reviewer`
