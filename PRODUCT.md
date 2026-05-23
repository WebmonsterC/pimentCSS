# PimentCSS documentation

## Register

**product**, Technical documentation for a CSS design system. Design serves comprehension: scanability, accurate code samples, and WCAG/RGAA contrast guidance. Reference: Astro docs / Starlight (install flows, TOC, code-first).

## Users & purpose

- **Primary users**: Front-end developers integrating PimentCSS (npm, CDN, or Sass).
- **Context**: Evaluating tokens, copying class names, checking accessibility pairs, comparing light/dark semantics.
- **Job to be done**: Install quickly, customize tokens, use components correctly, verify contrast without reading the whole repo.

## Brand personality

Clear, precise, calm, trustworthy. Caribbean / Antilles identity shows in palette naming and tone, not in decorative marketing chrome.

## Anti-references

- Generic “AI doc” walls of identical cards and gradient heroes.
- HubMonster-era `hm-` prefix (removed; classes are unprefixed by default).
- Side-stripe callout borders and gradient text.
- Em dashes in prose (use commas, colons, or periods).
- Code samples that reference classes absent from `dist/pimentcss.css`.

## Strategic principles

1. **Code is the source of truth**, Documented classes must exist in the built bundle (`npm run test:doc-classes`).
2. **Semantic tokens first**, Prefer `--surface-*` / `--text-*` over raw palette steps in UI guidance.
3. **Accessibility is explicit**, RGAA/WCAG AA contrast called out on Colors; focus and touch targets linked from Layout and A11y.
4. **Progressive disclosure**, Short sections, stable `h2`/`h3` ids, package-manager tabs, optional asides.
5. **Light and dark parity**, Examples and swatches must remain readable in both themes.
6. **Icon agnosticism**, PimentCSS defines dimensioned slots (`btn__icon`, `field__icon`, etc.), not a global icon library. The documentation uses **Phosphor** as the reference example; consumers choose their own SVG set. See the [Icons guide](https://piment.webmonster.tech/docs/icons).

## Accessibility

- Target **WCAG 2.2 AA** (4.5:1 normal text) for semantic pairs.
- Visible `:focus-visible` on interactive demos.
- Skip link, landmarks, keyboard-friendly tabs.
- Respect `prefers-reduced-motion` (tokens in `tokens/a11y.css`).
