# Documentation UX (local notes)

Canonical Impeccable context lives at the **repository root**:

- [../PRODUCT.md](../PRODUCT.md) — users, register, principles, a11y goals
- [../DESIGN.md](../DESIGN.md) — colors, typography, doc components (Stitch-style tokens)

## Quick reference

1. **Scanability**: short sections, stable `h2`/`h3` ids, sidebar + TOC.
2. **Progressive disclosure**: package-manager tabs (`pdocPackageTabs`).
3. **Code-first**: `pdocSnippet` / `pdocTerminal`, AA syntax tokens in light/dark.
4. **Rhythm**: PimentCSS `--space-*`; prose measure `--pdoc-prose-measure` (42rem).
5. **Accessibility**: skip link, focus rings, `aria-selected` on tabs.

Body class: `pdoc--docs-ux` on `DocsLayout.astro`.

## Impeccable skill

Installed at `.agents/skills/impeccable/`. Enable **Agent Skills** in Cursor, then:

```bash
npm run impeccable:context   # verify PRODUCT.md + DESIGN.md
npm run test:doc-impeccable  # CI: em-dash copy rule + decorative ico aria-hidden
```

Commands like `/layout`, `/typeset`, `/polish` on `docs-site/` use the root context files.
