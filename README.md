# PimentCSS

[![npm version](https://img.shields.io/npm/v/pimentcss-design-system.svg)](https://www.npmjs.com/package/pimentcss-design-system)
[![npm downloads](https://img.shields.io/npm/dm/pimentcss-design-system.svg)](https://www.npmjs.com/package/pimentcss-design-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/WebmonsterC/pimentCSS/actions/workflows/ci.yml/badge.svg)](https://github.com/WebmonsterC/pimentCSS/actions/workflows/ci.yml)
[![Documentation](https://img.shields.io/badge/docs-piment.webmonster.tech-blue)](https://piment.webmonster.tech/docs)
[![GitHub release](https://img.shields.io/github/v/release/WebmonsterC/pimentCSS)](https://github.com/WebmonsterC/pimentCSS/releases)

**Latest:** [v1.0.0](https://github.com/WebmonsterC/pimentCSS/releases/tag/v1.0.0) · [Changelog](CHANGELOG.md) · [npm](https://www.npmjs.com/package/pimentcss-design-system)

**PimentCSS** is the accessible design system from [Webmonster.tech](https://www.webmonster.tech), published at [piment.webmonster.tech](https://piment.webmonster.tech) (documentation at [/docs](https://piment.webmonster.tech/docs)). It extends the [Piment-Css](https://github.com/freepiment/Piment-Css) micro-framework with OKLCH tokens, a customizable Sass layer, and ready-to-use component classes.

This project is the result of a collaboration between [Webmonster](https://www.webmonster.tech) and [numera11y](https://www.numera11y.fr).

## Installation

### 1. Ready-to-use CSS (npm)

```bash
npm install pimentcss-design-system
```

```html
<link rel="stylesheet" href="node_modules/pimentcss-design-system/dist/pimentcss.min.css" />
<button type="button" class="btn btn--primary">Submit</button>
```

With a bundler (Vite, webpack, etc.):

```js
import "pimentcss-design-system/dist/pimentcss.min.css";
```

### 2. Custom Sass theme

```scss
// my-theme.scss
@use "pimentcss-design-system" with (
  $font-family-heading: "Inter", system-ui, sans-serif,
  $btn-min-height: 2.75rem,
  $surface-action: #0b5ed7,
  $border-radius-8: 0.375rem,
);
```

```bash
npx sass my-theme.scss dist/my-theme.css
```

### 3. Partial imports (tokens or components only)

```scss
@use "pimentcss-design-system/core";           // tokens, layout, utilities
@use "pimentcss-design-system/components";    // component classes (after core)
```

Canonical CSS tokens: `import "pimentcss-design-system/tokens/colors.css"` (or a `<link>` tag).

### Repository development

```bash
npm install
npm run build:css   # dist/pimentcss.css + .min.css
npm run docs        # http://localhost:5173/ (docs: /docs)
```

## Repository structure

```
scss/
  abstracts/          # !default variables, mixins, palettes (generated)
  tokens/             # :root (OKLCH colors, typography, semantic, a11y)
  components/         # buttons, badges, forms, navigation?
  layout/             # container, 12-column grid
  utilities/          # spacing, flex, display
  core.scss           # tokens + layout + utilities (partial entry)
  components.scss     # all components (partial entry)
  pimentcss.scss      # npm bundle
  custom.example.scss # theme example
tokens/               # canonical colors (OKLCH)
docs-site/            # Astro documentation (source, not in npm)
  src/data/           # nav.json, pages.json
  src/generated/      # palettes-grid.html (from generate:palettes)
  src/lib/*-content.ts
dist-docs/            # `astro build` output (deploy → piment.webmonster.tech)
dist/                 # compiled CSS published to npm
tests/ux/             # Playwright tests (mobile, tablet, desktop)
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages or Netlify.

**Release notes**: [CHANGELOG.md](CHANGELOG.md) and the doc site page [What's new in v1](https://piment.webmonster.tech/docs/whats-new).

The npm tarball includes only `dist/`, `scss/`, `tokens/`, `styles/palettes.css`, and `README.md` (not the documentation site or doc assets).

## Sass customization (local repo)

```scss
// my-theme.scss
@use "./scss/pimentcss" with (
  $font-family-heading: "Inter", system-ui, sans-serif,
  $btn-min-height: 2.75rem,
  $surface-action: #0b5ed7,
  $border-radius-8: 0.375rem,
);
```

Then: `npx sass my-theme.scss dist/my-theme.css`

**Recolor a palette**: edit `tokens/colors.css`, then:

```bash
npm run generate:palettes
npm run build:css
```

## Light and dark mode

PimentCSS uses **semantic CSS variables** (`--surface-page`, `--text-body`, `--border-default`, etc.) that adapt when you set a color mode on the document root:

```html
<html lang="en" data-theme="light">
  <link rel="stylesheet" href="node_modules/pimentcss-design-system/dist/pimentcss.min.css" />
  <!-- components use semantic tokens automatically -->
</html>
```

- **`data-theme="dark"`** ? full dark semantic overrides (buttons, fields, alerts, cards, ?).
- **No attribute + `prefers-color-scheme: dark`** ? system preference applies when the user has not chosen a mode.
- **`data-theme="light"`** ? forces light mode even if the OS prefers dark.

**Typography:** Zodiak Bold (headings) + Plus Jakarta Sans (body). With licensed files in [`fonts/`](fonts/README.md), run `npm run build:fonts` then `npm run build:css` for self-hosted **woff2**. Otherwise CDN fallbacks (Fontshare + Google Fonts) apply when local files are missing.

**Theme toggle component** (`.theme-toggle`) for headers, sidebars, or settings:

```html
<div class="theme-toggle theme-toggle--compact" role="group" aria-label="Color mode" data-theme-toggle>
  <button type="button" class="theme-toggle__option is-active" data-theme-value="light" aria-pressed="true" aria-label="Light mode">?</button>
  <button type="button" class="theme-toggle__option" data-theme-value="dark" aria-pressed="false" aria-label="Dark mode">?</button>
</div>
```

Wire with a short script: set `document.documentElement.dataset.theme` and optionally persist `localStorage`. See the [theme toggle doc](https://piment.webmonster.tech/docs/theme-toggle) and `docs-site/src/lib/theme.ts` on this site.

Sass: dark tokens are included by default (`$enable-dark-theme: true` in `scss/abstracts/_variables.scss`).

## Components

| Component | Main classes | Docs |
|-----------|--------------|------|
| Buttons | `.btn`, `--primary`, `--outline`, `--transparent` | [Buttons](https://piment.webmonster.tech/docs/buttons) |
| Fields | `.field`, `.input`, labels, textarea | [Input fields](https://piment.webmonster.tech/docs/input-fields) |
| Menu / Dropdown | `.menu`, `.dropdown` | [Menu & dropdown](https://piment.webmonster.tech/docs/menu-dropdown) |
| Checkbox / Radio / Switch | `.checkbox`, `.radio`, `.switch` | [Selection controls](https://piment.webmonster.tech/docs/checkboxes-radios-switch) |
| Alerts, cards, feedback | `.alert`, `.card`, `.modal`, … | [Alerts](https://piment.webmonster.tech/docs/alerts) |
| Layout | `.container`, `.row`, `.col-*` | [Layout](https://piment.webmonster.tech/docs/layout) |
| Theme toggle | `.theme-toggle`, `--compact` | [Theme toggle](https://piment.webmonster.tech/docs/theme-toggle) |
| Accessibility | `.focus-visible`, `.sr-only`, `prefers-reduced-motion` | [A11y guide](https://piment.webmonster.tech/docs/a11y) |

Classes use BEM-style modifiers (`btn--primary`, `field--error`, ?). Override `$prefix` in Sass if you need a namespace.

## Palettes (OKLCH)

| Palette | Alias | Steps |
|---------|-------|-------|
| Primary | Blue | 100?900 + default (500) |
| Accent | Yellow | 100?900 |
| Neutral | Grey | 100?900, 450, white/black |
| Information | Azure | 100?900 |
| Success | Green | 100?900, 650 |
| Warning | Orange | 100?900 |
| Error | Red | 100?900, 450 |

Values in **OKLCH** with hex fallback (`@supports not (color: oklch(...))`).

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run build:css` | Palettes + `dist/pimentcss.css`, `.min.css` |
| `npm run build:css:min` | Alias for `build:css` |
| `prepublishOnly` | Automatic build before `npm publish` |
| `npm run generate:palettes` | `tokens/colors.css` ? `_palettes.generated.scss` |
| `npm run watch:css` | Recompile on every SCSS change |
| `npm run build:docs` | Sync `pages.json`, palette grid, and `docs-site/public/` |
| `npm run docs:preview` | Preview `dist-docs/` locally |
| `npm run build:docs:astro` | Production build → `dist-docs/` |
| `npm run docs` | Astro dev (`http://localhost:5173/`) — [Astro](https://astro.build/) |
| `npm run sync:doc-metadata` | Refresh English leads in `docs-site/src/data/pages.json` |
| `npm run test:e2e` | Playwright UX tests (3 viewports) |
| `npm run test:e2e:heal` | Test loop ? auto-fix ? rebuild ? re-test |
| `npm run test:e2e:mobile` | Mobile viewport (Pixel 5) |
| `npm run test:e2e:tablet` | Tablet viewport (iPad) |
| `npm run test:e2e:desktop` | Desktop viewport |

## UX tests (Playwright)

E2E suite on Astro doc pages, in **mobile**, **tablet**, and **desktop**:

- loads `pimentcss.css`, H1 title, no horizontal scroll;
- touch targets ? 44px (mobile/tablet);
- interactions (buttons, form, checkbox/radio/switch, navigation).

**Auto-fix** enabled by default (`PLAYWRIGHT_AUTO_FIX=1`): log in `.playwright-auto-fix/fixes-log.jsonl`.

```bash
npm run test:e2e
npm run test:e2e:heal
# Disable: $env:PLAYWRIGHT_AUTO_FIX='0'; npm run test:e2e
```

## Accessibility tests (axe / WCAG 2.2 AA)

**axe-core** audit on all Astro doc pages (`dist-docs/`), tags `wcag2aa` / `wcag21aa` / `wcag22aa`. Component previews (`.pdoc-demo__preview`) use the design system surface; the doc shell is checked outside excluded zones.

```bash
npm run build:docs:astro
npm run test:e2e:a11y
```

## Relationship with Piment-Css

| | Piment-Css (upstream) | PimentCSS v1 (this repo) |
|--|----------------------|---------------------------|
| Repository | [freepiment/Piment-Css](https://github.com/freepiment/Piment-Css) | [WebmonsterC/pimentCSS](https://github.com/WebmonsterC/pimentCSS) |
| Role | Lightweight CSS micro-framework | OKLCH tokens, Sass, WCAG 2.2 a11y, docs + tests |
| Docs | [piment.webmonster.tech/docs](https://piment.webmonster.tech/docs) | Astro site (`docs-site/` → `dist-docs/`) |

## Credits

*Piment wasn't built alone.*

Contributors (alphabetical by first name):

- **Cédric Martial** — Design system
- **Ronny Laposte** — Technical contributor
- **Sébastien Jacobin** — Engineer and developer
- **Xavier Simacourbe** — Technical designer

## License

[MIT](LICENSE) — see [LICENSE](https://github.com/WebmonsterC/pimentCSS/blob/main/LICENSE) on GitHub.  
Collaboration [Webmonster.tech](https://www.webmonster.tech) · [numera11y](https://www.numera11y.fr).

## Releases

- **v1.0.0** — [Release notes](https://github.com/WebmonsterC/pimentCSS/releases/tag/v1.0.0) · [CHANGELOG](CHANGELOG.md)
- Publishing guide: [RELEASING.md](RELEASING.md)
