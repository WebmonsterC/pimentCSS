import { pdocSnippet, pdocSteps } from './pdoc-html';

const GRID_DEMO = `<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="pdoc-layout-cell">.col-12</div>
    </div>
    <div class="col-8">
      <div class="pdoc-layout-cell">.col-8</div>
    </div>
    <div class="col-4">
      <div class="pdoc-layout-cell">.col-4</div>
    </div>
  </div>
</div>`;

const GRID_RESPONSIVE_DEMO = `<div class="container">
  <div class="row">
    <div class="col-12 col-md-4">
      <div class="pdoc-layout-cell">.col-12 .col-md-4</div>
    </div>
    <div class="col-12 col-md-4">
      <div class="pdoc-layout-cell">.col-12 .col-md-4</div>
    </div>
    <div class="col-12 col-md-4">
      <div class="pdoc-layout-cell">.col-12 .col-md-4</div>
    </div>
  </div>
</div>`;

const LIVE_SHELL_DEMO = `<div class="container">
  <header class="pdoc-layout-shell__header d-flex align-center justify-between gap-3 mb-4">
    <p class="heading-h5 pdoc-layout-shell__title">Antilles Hub</p>
    <button type="button" class="btn btn--primary focus-visible">Sign in</button>
  </header>
  <div class="row">
    <div class="col-12 col-md-8">
      <article class="copy-block">
        <h2 class="heading-h3">Shipments</h2>
        <p class="copy-block__text">Container + grid keep reading order logical: header, then main column, then aside.</p>
      </article>
    </div>
    <div class="col-12 col-md-4">
      <aside class="pdoc-layout-cell" aria-label="Filters">
        <p class="body-small pdoc-layout-shell__title">Aside · filters</p>
      </aside>
    </div>
  </div>
</div>`;

/** Full Layout page (Foundations). */
export function buildLayoutPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Layout utilities structure content, they do not replace semantic HTML. Keep a single <code>&lt;main&gt;</code>, preserve <strong>DOM order = reading order</strong>, and pair surfaces with <code>--text-body</code> (see <a href="/docs/colors">Colors</a>). Demo cells use <code>--surface-elevated</code> + <code>--text-body</code> so labels stay readable in light and dark mode.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>PimentCSS layout is intentionally small: a centered <strong>container</strong>, a flex-based <strong>12-column grid</strong>, spacing utilities mapped to <code>--space-*</code> tokens, and a handful of <strong>display</strong> helpers. Import via the full bundle or <code>pimentcss-design-system/core</code> when you only need tokens + layout.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Layer</th><th>Location</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td>Spacing tokens</td><td><code>tokens/layout.css</code></td><td><code>--space-1</code> … <code>--space-7</code>, radii, borders</td></tr>
              <tr><td>Container &amp; grid</td><td><code>scss/layout/</code></td><td><code>.container</code>, <code>.row</code>, <code>.col-*</code></td></tr>
              <tr><td>Utilities</td><td><code>scss/utilities/</code></td><td>Spacing, display/flex, shadows</td></tr>
              <tr><td>Copy width</td><td><code>.copy-block</code></td><td>Max width 33rem for comfortable line length</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a> (layout ships with the default CSS).</li>
          <li><strong>Semantic colors</strong>, surfaces and text from <a href="/docs/colors">Colors</a> for readable UI inside columns.</li>
          <li><strong>Typography</strong>, heading/body utilities from <a href="/docs/typography">Typography</a> inside grid regions.</li>
        </ul>

        <h2 id="tokens">Spacing &amp; layout tokens</h2>
        <p>Canonical spacing lives in <code>tokens/layout.css</code>. Override Sass variables before <code>@use "pimentcss-design-system"</code>, see <a href="/docs/customization">Customization</a>.</p>
        ${pdocSnippet(
          `:root {
  --space-1: 0.25rem;  /* 4px */
  --space-3: 1rem;     /* 16px */
  --space-4: 1.5rem;   /* 24px, default grid gutter */
  --space-6: 3rem;     /* 48px */
}

/* Sass (optional) */
$container-max-width: 75rem;
$grid-gutter: $space-4;
$copy-block-max-width: 33rem;`,
          'tokens/layout.css',
          'css',
        )}

        <h2 id="container">Container</h2>
        <p><code>.container</code> centers content, applies horizontal padding (<code>$grid-gutter</code>), and caps width at <strong>75rem</strong>. Use <code>.container--fluid</code> for full-bleed sections while keeping gutter padding.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="container">
              <div class="pdoc-layout-cell">.container, max-width 75rem</div>
            </div>
          </div>
        </div>
        ${pdocSnippet(
          `<main class="container">
  <h1 class="heading-h1">Dashboard</h1>
  <p class="body-medium">Content stays centered on wide screens.</p>
</main>

<section class="container container--fluid">
  <p class="body-medium">Edge-to-edge band with side padding.</p>
</section>`,
          'page.html',
          'html',
        )}

        <h2 id="grid">12-column grid</h2>
        <p>Rows use flexbox with wrap. Columns are width fractions of 12 (<code>.col-1</code> … <code>.col-12</code>). Gutters come from horizontal padding on columns (half gutter each side).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${GRID_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="container">
  <div class="row">
    <div class="col-8">
      <section aria-labelledby="main-title">…</section>
    </div>
    <div class="col-4">
      <aside aria-label="Related links">…</aside>
    </div>
  </div>
</div>`,
          'grid.html',
          'html',
        )}

        <h3 id="grid-responsive">Responsive columns</h3>
        <p>From <strong>48rem</strong> (<code>min-width</code>), <code>.col-md-*</code> classes apply. Below the breakpoint, stack with <code>.col-12</code> so mobile users get a single column without horizontal scroll.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${GRID_RESPONSIVE_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="row">
  <div class="col-12 col-md-4">Column A</div>
  <div class="col-12 col-md-4">Column B</div>
  <div class="col-12 col-md-4">Column C</div>
</div>`,
          'grid-responsive.html',
          'html',
        )}

        <h2 id="spacing">Spacing utilities</h2>
        <p>Margin, padding, and gap helpers map to the spacing scale (0–6). Prefer <code>gap-*</code> in flex/grid layouts instead of chaining margins.</p>
        <div class="pdoc-spacing-rail" data-pdoc-skip aria-hidden="true">
          <div class="pdoc-spacing-rail__item"><span class="pdoc-spacing-rail__label">.m-1</span><span class="pdoc-spacing-rail__bar" style="width: var(--space-1)"></span></div>
          <div class="pdoc-spacing-rail__item"><span class="pdoc-spacing-rail__label">.m-3</span><span class="pdoc-spacing-rail__bar" style="width: var(--space-3)"></span></div>
          <div class="pdoc-spacing-rail__item"><span class="pdoc-spacing-rail__label">.m-5</span><span class="pdoc-spacing-rail__bar" style="width: var(--space-5)"></span></div>
          <div class="pdoc-spacing-rail__item"><span class="pdoc-spacing-rail__label">.m-6</span><span class="pdoc-spacing-rail__bar" style="width: var(--space-6)"></span></div>
        </div>
        <p class="pdoc-muted-note">Visual scale only, class names follow the token number (<code>.mt-3</code>, <code>.mb-4</code>, <code>.p-3</code>, <code>.gap-4</code>).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class pattern</th><th>Maps to</th></tr></thead>
            <tbody>
              <tr><td><code>.m-0</code> … <code>.m-6</code></td><td>margin (all sides)</td></tr>
              <tr><td><code>.mt-*</code> · <code>.mb-*</code></td><td>margin top / bottom</td></tr>
              <tr><td><code>.p-0</code> … <code>.p-6</code></td><td>padding (all sides)</td></tr>
              <tr><td><code>.gap-0</code> … <code>.gap-6</code></td><td>flex/grid gap</td></tr>
            </tbody>
          </table>
        </div>
        ${pdocSnippet(
          `<div class="d-flex gap-3 align-center">
  <button type="button" class="btn btn--outline">Cancel</button>
  <button type="button" class="btn btn--primary">Save</button>
</div>`,
          'toolbar.html',
          'html',
        )}

        <h2 id="display">Display &amp; flex helpers</h2>
        <p>Utility classes for common flex layouts and visibility. Combine with spacing utilities; avoid inline styles in production when a utility exists.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Effect</th></tr></thead>
            <tbody>
              <tr><td><code>.d-flex</code> · <code>.d-inline-flex</code></td><td>Flex formatting context</td></tr>
              <tr><td><code>.d-block</code> · <code>.d-none</code></td><td>Block / hide (<code>d-none</code> removes from layout, use for panels, not icons alone)</td></tr>
              <tr><td><code>.flex-column</code></td><td>Vertical stack</td></tr>
              <tr><td><code>.align-center</code> · <code>.justify-between</code></td><td>Align / distribute on cross/main axis</td></tr>
              <tr><td><code>.text-center</code></td><td>Center text (not a substitute for page headings hierarchy)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="copy-block">Readable line length</h2>
        <p>Long prose should stay within <strong>33rem</strong> (~66 characters). Use the <code>.copy-block</code> component or <code>max-width: 33rem</code> in your own styles.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <article class="copy-block">
              <h2 class="heading-h3">Release notes</h2>
              <p class="copy-block__text">The copy block limits line length for comfortable reading in both light and dark themes.</p>
            </article>
          </div>
        </div>

        <h2 id="patterns">Page shell pattern</h2>
        <p>Typical app shell: <code>container</code> → header row → main + aside. Use real landmarks (<code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;aside&gt;</code>) so screen readers follow the same order as the visual grid.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LIVE_SHELL_DEMO}
          </div>
        </div>

        <h2 id="quick-guide">Quick integration</h2>
        ${pdocSteps([
          {
            id: 'step-structure',
            title: 'Wrap the page',
            body: 'Place primary content in <code>.container</code>. Add <code>container--fluid</code> only for hero bands or full-width data tables.',
            code: '<main class="container">\n  …\n</main>',
            label: 'layout.html',
            lang: 'html',
          },
          {
            id: 'step-grid',
            title: 'Split columns',
            body: 'Use <code>.row</code> and column classes. On small screens, start with <code>.col-12</code> and add <code>.col-md-*</code> for tablet/desktop.',
            code: '<div class="row">\n  <div class="col-12 col-md-8">…</div>\n  <div class="col-12 col-md-4">…</div>\n</div>',
            label: 'grid.html',
            lang: 'html',
          },
          {
            id: 'step-space',
            title: 'Space components',
            body: 'Prefer <code>gap-*</code> inside toolbars and card footers. Use semantic text colors inside each column.',
            code: '<div class="d-flex gap-3 align-center">\n  <button class="btn btn--primary">OK</button>\n</div>',
            label: 'toolbar.html',
            lang: 'html',
          },
        ])}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.container</code></td><td>Centered max-width shell + horizontal padding</td></tr>
              <tr><td><code>.container--fluid</code></td><td>Full width with gutter padding</td></tr>
              <tr><td><code>.row</code></td><td>Flex row with negative gutter margin</td></tr>
              <tr><td><code>.col-1</code> … <code>.col-12</code></td><td>Column width (12-column fraction)</td></tr>
              <tr><td><code>.col-md-1</code> … <code>.col-md-12</code></td><td>Column width from 48rem viewport</td></tr>
              <tr><td><code>.m-*</code> · <code>.mt-*</code> · <code>.mb-*</code></td><td>Margin utilities (0–6)</td></tr>
              <tr><td><code>.p-*</code> · <code>.gap-*</code></td><td>Padding and flex gap utilities</td></tr>
              <tr><td><code>.d-flex</code> · <code>.flex-column</code> · …</td><td>Display / flex / alignment helpers</td></tr>
              <tr><td><code>.copy-block</code></td><td>Constrained prose width (33rem)</td></tr>
              <tr><td><code>.shadow-xs</code> … <code>.shadow-xl</code></td><td>Elevation shadows, see <a href="/docs/depth">Depth &amp; shadows</a></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="sass">Sass customization</h2>
        ${pdocSnippet(
          `@use "pimentcss-design-system/core" with (
  $container-max-width: 72rem,
  $grid-gutter: 1.25rem,
  $space-5: 2.5rem,
  $copy-block-max-width: 36rem,
);`,
          'theme.scss',
          'scss',
        )}

        <h2 id="accessibility">Accessibility</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Layout &amp; RGAA</p>
          <ul>
            <li><strong>Reading order</strong>, DOM order must match visual order; do not rearrange columns only with CSS <code>order</code> without testing with a screen reader.</li>
            <li><strong>Reflow</strong>, stack columns on small viewports (<code>.col-12</code>); avoid horizontal scroll for text (WCAG 1.4.10).</li>
            <li><strong>Contrast</strong>, text inside columns uses <code>--text-body</code> on <code>--surface-page</code> / <code>--surface-elevated</code> (validated on <a href="/docs/colors">Colors</a>).</li>
            <li><strong>Touch targets</strong>, keep actions in grid cells at least 44×44px (<code>--min-touch-target</code>), see <a href="/docs/buttons">Buttons</a>.</li>
            <li><strong>Zoom</strong>, spacing uses <code>rem</code>; layout must remain usable at 200% zoom.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/typography"><p class="pdoc-card__title">Typography</p><p class="pdoc-card__desc">Headings and body scale inside your grid.</p></a>
          <a class="pdoc-card" href="/docs/depth"><p class="pdoc-card__title">Depth &amp; shadows</p><p class="pdoc-card__desc">Elevation tokens on cards and modals.</p></a>
          <a class="pdoc-card" href="/docs/slots-layouts"><p class="pdoc-card__title">Slots &amp; layouts</p><p class="pdoc-card__desc">Higher-level layout patterns.</p></a>
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Actions in toolbars and forms.</p></a>
        </div>`;
}
