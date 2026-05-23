# Changelog

All notable changes to PimentCSS are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-05-21

### Added

- **`context7.json`** — Context7 indexing configuration (folder exclusions, coding-agent rules, version tags) for AI assistants using MCP or `use context7`.
- **README badges** — npm version, monthly downloads, license, CI, documentation, and GitHub release links.

### Documentation

- **RELEASING.md** — Context7 submission, library claim, and post-release refresh steps.
- **README** — Context7 library link and release line for v1.0.1.

## [1.0.0] - 2026-05-21

### Added

- **PimentCSS v1** design system: OKLCH palettes, semantic light/dark tokens, and unprefixed component classes (evolution of [Piment-Css](https://github.com/freepiment/Piment-Css)).
- **Distribution**: npm package [`pimentcss-design-system`](https://www.npmjs.com/package/pimentcss-design-system), CDN-ready `dist/pimentcss.min.css`, Sass entry points (`pimentcss-design-system`, `pimentcss-design-system/core`, `pimentcss-design-system/components`).
- **Foundations**: colors, typography, layout grid, depth/shadows, theme toggle.
- **Forms**: fields, checkboxes/radios/switches, form layout, date picker, autocomplete.
- **Actions & navigation**: buttons, button groups, links/breadcrumb, header nav, menus/dropdowns, tabs, pagination, anchor/in-page nav, carousel.
- **Content & feedback**: tables (responsive scroll + mobile cards), lists, tree, badges, tags, keyline, placeholders, alerts, modals, cards, snackbar, progress, loader.
- **Patterns**: composition recipes (contact form, toolbar + modal, table + pagination) and slots/layouts primitives.
- **Accessibility**: WCAG 2.2 AA semantic pairs, focus/touch guidance, `prefers-reduced-motion` tokens, axe-tested documentation demos.
- **Documentation site** (Astro): live previews, package-manager tabs, search, TOC, Introduction paths, Installation verify flow, and this release page.

### Changed

- Class namespace: default **unprefixed** BEM-style API (`btn--primary`, not `hm-btn`).
- Color system: **OKLCH** canonical tokens in `tokens/colors.css` with hex fallback.
- **npm package name**: published as [`pimentcss-design-system`](https://www.npmjs.com/package/pimentcss-design-system) because the legacy name `pimentcss` belongs to another registry account. Install commands, Sass `@use` paths, CDN snippets (jsDelivr/unpkg), and documentation examples now use the new name.

[1.0.1]: https://github.com/WebmonsterC/pimentCSS/releases/tag/v1.0.1
[1.0.0]: https://github.com/WebmonsterC/pimentCSS/releases/tag/v1.0.0
