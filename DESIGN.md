---
name: PimentCSS documentation
description: Starlight-style technical docs for the PimentCSS v1 design system
colors:
  page-bg: "#faf8f4"
  text-body: "#4a4a48"
  text-heading: "#1a1a18"
  link: "#0f766e"
  code-bg: "#f1f5f9"
  code-fg: "#0f172a"
  border: "#efe9df"
  accent: "#0f766e"
typography:
  display:
    fontFamily: "Zodiak, Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "\"Plus Jakarta Sans\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "\"Plus Jakarta Sans\", system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  doc-aside:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.md}"
    padding: "16px 20px"
  doc-callout-a11y:
    backgroundColor: "#fff4e8"
    textColor: "{colors.text-body}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
---

## Overview

Documentation site (`docs-site/`) for **PimentCSS v1**: Astro layout, sidebar + in-page TOC, `pdoc-*` chrome in `doc.css`, content in `docs-site/src/lib/*-content.ts`. Body class `pdoc--docs-ux`. Visual reference: [Astro installation docs](https://docs.astro.build/en/install-and-setup/).

Impeccable skill: `.agents/skills/impeccable/`. Load context with `npm run impeccable:context`. Polish copy with `npm run test:doc-impeccable` (no em dashes).

## Colors

- **Page**: `--surface-page` / `--pdoc-bg` (warm neutral sand).
- **Prose**: `--text-body`, `--text-heading`; links `--text-action` (primary teal).
- **Code blocks**: `--pdoc-code-bg` #f1f5f9, tokens with AA contrast in light and dark.
- **Strategy**: Restrained product UI; semantic tokens for demos inside `.pdoc-demo__preview`.

## Typography

- **Headings**: Zodiak (display), utilities `.heading-h1` … `.heading-h6` in examples.
- **Body**: Plus Jakarta Sans, `.body-small` / `.body-medium` / `.body-large`.
- **Prose measure**: `--pdoc-prose-measure` 42rem (~65–75ch). Long copy uses `.copy-block` (33rem) in component examples.

## Elevation

- Light shadow on header/cards: `--pdoc-shadow`, `--pdoc-card-hover-shadow`.
- No glassmorphism. Elevated surfaces use `--surface-elevated` and 1px borders.

## Components

| Pattern | Implementation |
|---------|----------------|
| Install tabs | `pdocPackageTabs` (npm / pnpm / yarn) |
| Code blocks | `pdocSnippet`, `pdocTerminal` + copy button |
| Notes | `pdoc-aside` (full border, no side stripe) |
| RGAA callouts | `pdoc-callout--a11y` (full border + tint) |
| Steps | `pdocSteps` numbered guide |
| Live demos | `pdoc-demo` + PimentCSS classes |

## Do's and Don'ts

**Do**

- Keep section titles unique with stable `id` for TOC.
- Use semantic surface/text tokens in demo cells.
- Run `npm run test:doc-classes` when changing documented class names.

**Don't**

- Use `border-left` accents on callouts (Impeccable ban).
- Use em dashes in English prose.
- Document `hm-*` or `pimentcss/core`-only classes in full-bundle examples without saying so.
- Wrap every block in identical icon+title cards.
