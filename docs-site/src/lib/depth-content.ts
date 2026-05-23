import { pdocSnippet, pdocSteps } from './pdoc-html';

type ElevationLevel = {
  id: string;
  label: string;
  token: string;
  utility: string;
  usage: string;
};

const ELEVATION: ElevationLevel[] = [
  { id: 'xs', label: 'XS', token: '--shadow-xs', utility: 'shadow-xs', usage: 'Chips, subtle lift on controls' },
  { id: 'sm', label: 'SM', token: '--shadow-sm', utility: 'shadow-sm', usage: '.card--elevated, snackbar' },
  { id: 'md', label: 'MD', token: '--shadow-md', utility: 'shadow-md', usage: 'Dropdown, autocomplete panel' },
  { id: 'lg', label: 'LG', token: '--shadow-lg', utility: 'shadow-lg', usage: 'Sticky bars, popovers' },
  { id: 'xl', label: 'XL', token: '--shadow-xl', utility: 'shadow-xl', usage: 'Modals, highest overlay' },
];

function elevationRail(): string {
  const tiles = ELEVATION.map(
    (l) => `            <div class="pdoc-depth-compare__tile ${l.utility}" role="listitem" aria-label="${l.label} elevation">
              <span class="pdoc-depth-compare__tile-label">${l.label}</span>
            </div>`,
  ).join('\n');
  return `<div class="pdoc-depth-compare" role="list" aria-label="Elevation scale preview">
          <div class="pdoc-depth-compare__stage">
${tiles}
          </div>
        </div>`;
}

function elevationTable(): string {
  const rows = ELEVATION.map(
    (l) => `              <tr><td><strong>${l.label}</strong></td><td><code>${l.token}</code></td><td><code>.${l.utility}</code></td><td>${l.usage}</td></tr>`,
  ).join('\n');
  return `<div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Step</th><th>Token</th><th>Class</th><th>Typical use</th></tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>`;
}

const STACK_DEMO = `<div class="pdoc-depth-stack" aria-label="Layered surfaces">
  <div class="pdoc-depth-stack__layer pdoc-depth-stack__layer--base">
    <span class="body-small">Page · <code>--surface-page</code></span>
  </div>
  <div class="pdoc-depth-stack__layer shadow-sm pdoc-depth-stack__layer--card">
    <span class="body-small">Card · <code>.shadow-sm</code></span>
  </div>
  <div class="pdoc-depth-stack__layer shadow-xl pdoc-depth-stack__layer--modal">
    <span class="body-small">Overlay · <code>.shadow-xl</code></span>
  </div>
</div>`;

const COMPONENTS_DEMO = `<div class="pdoc-demo-row pdoc-demo-row--start">
  <article class="card card--elevated card--copy">
    <div class="card__body d-flex flex-column gap-2">
      <p class="heading-h5 mb-0">Card</p>
      <p class="body-small copy-block__text mb-0">Uses <code>--shadow-sm</code> via <code>.card--elevated</code> and <code>.card__body</code> padding.</p>
    </div>
  </article>
  <div class="pdoc-depth-dropdown-mock shadow-md p-4 d-flex flex-column gap-2" role="group" aria-label="Dropdown panel example">
    <p class="body-medium body-medium--semibold mb-0">Account</p>
    <button type="button" class="btn btn--transparent focus-visible">Profile</button>
    <button type="button" class="btn btn--transparent focus-visible">Sign out</button>
  </div>
</div>`;

const INSET_DEMO = `<div class="pdoc-depth-stage pdoc-depth-stage--inset">
  <div class="pdoc-depth-tile pdoc-depth-tile--inset shadow-inset" aria-hidden="true"></div>
</div>`;

/** Full Depth & shadows page (Foundations). */
export function buildDepthPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Shadows show <strong>hierarchy</strong>, not state by themselves. Pair with text, borders, or a <code>:focus-visible</code> ring (3px). Validate light and dark with the header toggle.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>OKLCH elevation tokens map to utilities (<code>.shadow-xs</code> … <code>.shadow-xl</code>, <code>.shadow-inset</code>) and to components (cards, menus, snackbars). Sources and overrides:</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Layer</th><th>Source</th><th>Utilities</th></tr></thead>
            <tbody>
              <tr><td>Tokens</td><td><code>tokens/depth.css</code></td><td><code>--shadow-xs</code> … <code>--shadow-xl</code>, <code>--shadow-inset</code></td></tr>
              <tr><td>Sass defaults</td><td><code>scss/abstracts/_variables.scss</code></td><td><code>$shadow-sm</code>, <code>$shadow-md</code>, …</td></tr>
              <tr><td>Classes</td><td><code>scss/utilities/_shadow.scss</code></td><td><code>.shadow-*</code>, <code>.shadow-none</code></td></tr>
              <tr><td>Components</td><td>Card, dropdown, snackbar, …</td><td>Built-in <code>box-shadow: var(--shadow-*)</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a> (shadow utilities ship in the default bundle).</li>
          <li><strong>Semantic surfaces</strong>, readable panels from <a href="/docs/colors">Colors</a> (<code>--surface-elevated</code>, borders).</li>
          <li><strong>Stacking</strong>, combine shadows with <code>z-index</code> on overlays (dropdowns use <code>z-index: 100</code> in component SCSS).</li>
        </ul>

        <h2 id="tokens">Canonical tokens</h2>
        <p>Edit <code>tokens/depth.css</code> for OKLCH shadow stacks. Dark mode overrides live under <code>[data-theme="dark"]</code> and <code>prefers-color-scheme: dark</code>.</p>
        ${pdocSnippet(
          `:root {
  --shadow-lg: 0 12px 28px oklch(40.3% 0.03 262 / 0.22),
    0 4px 12px oklch(40.3% 0.03 262 / 0.14);
  --shadow-xl: 0 20px 48px oklch(40.3% 0.03 262 / 0.28),
    0 8px 20px oklch(40.3% 0.03 262 / 0.18);
}

[data-theme="dark"] {
  --shadow-lg: 0 14px 32px oklch(0% 0 0 / 0.68),
    0 6px 16px oklch(0% 0 0 / 0.5);
  --shadow-xl: 0 22px 50px oklch(0% 0 0 / 0.78),
    0 10px 24px oklch(0% 0 0 / 0.58);
}`,
          'tokens/depth.css',
          'css',
        )}

        <h2 id="elevation-scale">Elevation scale</h2>
        <p>All levels share one stage so you can compare blur and spread. LG and XL use a second shadow layer (XL is wider and stronger). In dark mode, tiles sit on the same muted preview surface as the layered demo below so black shadows stay visible.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${elevationRail()}
          </div>
        </div>
        ${elevationTable()}
        <p class="pdoc-muted-note">Preview is documentation-only (<code>.pdoc-depth-*</code>). In your app, apply <code>.shadow-*</code> on real surfaces.</p>

        <h2 id="inset">Inset shadow</h2>
        <p>Recessed surfaces (wells, pressed tracks). Utility: <code>.shadow-inset</code> · token <code>--shadow-inset</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${INSET_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="shadow-inset p-4" style="border-radius: var(--border-radius-8); background: var(--surface-elevated)">
  Recessed track
</div>`,
          'Markup',
          'html',
        )}

        <h2 id="layered-ui">Layered UI</h2>
        <p>Stack surfaces in order: page, elevated card, then dialog overlay. Increase shadow with each layer; manage focus and use <code>role="dialog"</code> + <code>aria-modal="true"</code> on the top layer.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${STACK_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<article class="card card--elevated">
  <div class="card__body">…</div>
</article>
<div class="dropdown__panel shadow-md">…</div>
<div class="card card--elevated shadow-xl" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <div class="card__body">…</div>
</div>`,
          'Patterns',
          'html',
        )}

        <h2 id="components">Components using shadows</h2>
        <p>Prefer component classes before ad-hoc utilities so elevation stays aligned with the design system. <code>.card--elevated</code> sets outer padding to <code>0</code>: wrap content in <code>.card__body</code> (or header/footer) so spacing comes from the card API. For custom panels, use spacing utilities (<code>.p-3</code>, <code>.gap-2</code>, see <a href="/docs/layout">Layout</a>).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Component</th><th>Shadow token</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td><code>.card--elevated</code></td><td><code>--shadow-sm</code></td><td>Default raised card</td></tr>
              <tr><td><code>.snackbar</code></td><td><code>--shadow-sm</code></td><td>Floating feedback</td></tr>
              <tr><td><code>.dropdown__panel</code></td><td><code>--shadow-md</code></td><td>Menus, <code>z-index: 100</code></td></tr>
              <tr><td><code>.autocomplete__panel</code></td><td><code>--shadow-md</code></td><td>Suggestions panel</td></tr>
              <tr><td><code>.theme-toggle</code></td><td><code>--shadow-xs</code></td><td>Compact control chrome</td></tr>
            </tbody>
          </table>
        </div>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${COMPONENTS_DEMO}
          </div>
        </div>

        <h2 id="utilities">Utility classes</h2>
        <p>Apply on any element. Use <code>.shadow-none</code> to clear shadows when switching variants.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>CSS variable</th></tr></thead>
            <tbody>
              <tr><td><code>.shadow-inset</code></td><td><code>--shadow-inset</code></td></tr>
              <tr><td><code>.shadow-xs</code></td><td><code>--shadow-xs</code></td></tr>
              <tr><td><code>.shadow-sm</code></td><td><code>--shadow-sm</code></td></tr>
              <tr><td><code>.shadow-md</code></td><td><code>--shadow-md</code></td></tr>
              <tr><td><code>.shadow-lg</code></td><td><code>--shadow-lg</code></td></tr>
              <tr><td><code>.shadow-xl</code></td><td><code>--shadow-xl</code></td></tr>
              <tr><td><code>.shadow-none</code></td><td>none</td></tr>
            </tbody>
          </table>
        </div>
        ${pdocSnippet(
          `<div class="shadow-md p-4" style="background: var(--surface-elevated); border-radius: var(--border-radius-8)">
  Custom panel
</div>`,
          'utility.html',
          'html',
        )}

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'sass-vars',
            title: 'Override shadow stacks',
            body: 'Pass <code>!default</code> variables when importing PimentCSS. Keep OKLCH alpha low enough for AA contrast on adjacent text.',
            code: `@use "pimentcss" with (
  $shadow-sm: 0 4px 12px oklch(40% 0.04 262 / 0.18),
  $shadow-md: 0 12px 24px oklch(40% 0.04 262 / 0.2),
);`,
            label: 'theme.scss',
            lang: 'scss',
          },
          {
            id: 'rebuild',
            title: 'Rebuild CSS',
            body: 'Regenerate <code>dist/pimentcss.min.css</code> after token edits.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}
        <p>See <a href="/docs/customization">Customization</a> for partial imports (<code>pimentcss/core</code> includes depth tokens).</p>

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Depth without barriers</p>
          <ul>
            <li><strong>Do not rely on shadow alone</strong> to convey state or errors (RGAA 10.7). Add text, icons, or <code>aria-*</code> attributes.</li>
            <li><strong>Focus visible</strong>, overlays must not trap keyboard users; restore focus on close. Ring: <code>--focus-ring</code> (3px).</li>
            <li><strong>Contrast on surfaces</strong>, elevated panels still need <code>--text-body</code> on <code>--surface-elevated</code> ≥ 4.5:1 (see <a href="/docs/colors">Colors</a>).</li>
            <li><strong>Reduced motion</strong>, avoid animating <code>box-shadow</code> for large transitions; use opacity or border when <code>prefers-reduced-motion: reduce</code>.</li>
            <li><strong>Dark mode</strong>: re-check cards and menus after switching theme; dark stacks use higher-alpha blacks in <code>tokens/depth.css</code>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/colors"><p class="pdoc-card__title">Colors</p><p class="pdoc-card__desc">Surfaces paired with elevation.</p></a>
          <a class="pdoc-card" href="/docs/layout"><p class="pdoc-card__title">Layout</p><p class="pdoc-card__desc">Grid and spacing for stacked UI.</p></a>
          <a class="pdoc-card" href="/docs/modals"><p class="pdoc-card__title">Modals</p><p class="pdoc-card__desc">Dialogs using <code>--shadow-lg</code>.</p></a>
          <a class="pdoc-card" href="/docs/cards"><p class="pdoc-card__title">Cards</p><p class="pdoc-card__desc">Elevated panels using <code>--shadow-sm</code>.</p></a>
          <a class="pdoc-card" href="/docs/menu-dropdown"><p class="pdoc-card__title">Menu &amp; dropdown</p><p class="pdoc-card__desc">Floating panels with <code>--shadow-md</code>.</p></a>
        </div>`;
}
