import { pdocSnippet, pdocSteps } from './pdoc-html';

type SemanticPair = {
  bg: string;
  fg?: string;
  pair: string;
  border?: boolean;
};

function semanticSwatch({ bg, fg, pair, border }: SemanticPair): string {
  const fgAttr = fg ? ` data-pdoc-semantic-fg="${fg}"` : '';
  const borderClass = border ? ' pdoc-semantic-swatch__chip--border' : '';
  const sample = border ? ', ' : 'Aa';
  return `<div class="pdoc-semantic-swatch" role="listitem" data-pdoc-semantic-bg="${bg}"${fgAttr}>
            <span class="pdoc-semantic-swatch__chip${borderClass}"><span class="pdoc-semantic-swatch__sample" aria-hidden="true">${sample}</span></span>
            <code>${bg}</code>
            <span class="pdoc-semantic-swatch__pair">${pair}</span>
            <span class="pdoc-semantic-swatch__ratio" hidden></span>
          </div>`;
}

const A11Y_SEMANTIC_PAIRS: SemanticPair[] = [
  { bg: '--surface-page', fg: '--text-body', pair: 'Body copy' },
  { bg: '--surface-action', fg: '--text-on-action', pair: 'Primary button' },
  { bg: '--error-100', fg: '--error-700', pair: 'Inline error' },
  { bg: '--surface-elevated', fg: '--text-body', pair: 'Card surface' },
];

const FOCUS_LAB = `<div class="pdoc-a11y-focus-lab" role="group" aria-label="Focus ring examples">
  <button type="button" class="btn btn--primary focus-visible">Button</button>
  <a href="#focus" class="link focus-visible">Link</a>
  <label class="field pdoc-a11y-focus-field">
    <span class="field__label">Field</span>
    <input type="text" class="field__input focus-visible" value="Input" aria-label="Sample text field" />
  </label>
</div>`;

const TOUCH_LAB = `<div class="pdoc-a11y-touch-lab" role="group" aria-label="Minimum touch target (44px)">
  <div class="pdoc-a11y-touch-ruler" aria-hidden="true"><span>44px</span></div>
  <button type="button" class="btn btn--primary focus-visible">Primary</button>
  <button type="button" class="btn btn--primary btn--icon-only focus-visible" aria-label="Settings">
    <span class="btn__icon" aria-hidden="true">⚙</span>
  </button>
</div>`;

const SR_ONLY_DEMO = `<p class="body-medium mb-0">
  <button type="button" class="btn btn--outline focus-visible">
    Save
    <span class="sr-only">, changes apply immediately</span>
  </button>
</p>`;

/** Full Accessibility guide page. */
export function buildA11yPageHtml(): string {
  const semanticGrid = A11Y_SEMANTIC_PAIRS.map(semanticSwatch).join('\n          ');

  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG 2.2 AA</p>
          <p>PimentCSS ships <strong>focus rings</strong>, <strong>44px touch targets</strong>, documented <strong>contrast pairs</strong>, and <strong>prefers-reduced-motion</strong> defaults. Tokens live in <code>tokens/a11y.css</code>; components inherit them via Sass mixins. This guide is maintained with <a href="https://www.numera11y.fr" rel="noopener noreferrer" target="_blank">numera11y</a>.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>Accessibility is built into the token layer, not added per component. Override tokens or Sass variables when branding; re-check focus, contrast, and motion after theme changes.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Concern</th><th>Token / API</th><th>WCAG</th></tr></thead>
            <tbody>
              <tr><td>Keyboard focus</td><td><code>--focus-ring</code>, <code>.focus-visible</code></td><td>2.4.7 Focus visible</td></tr>
              <tr><td>Touch size</td><td><code>--min-touch-target</code> (44px)</td><td>2.5.5 Target size (AAA target, AA practice)</td></tr>
              <tr><td>Text contrast</td><td>Semantic fg/bg pairs</td><td>1.4.3 Contrast (minimum)</td></tr>
              <tr><td>Motion</td><td><code>prefers-reduced-motion</code></td><td>2.3.3 Animation from interactions</td></tr>
              <tr><td>Screen reader text</td><td><code>.sr-only</code></td><td>1.3.1 Info and relationships</td></tr>
              <tr><td>Hidden content</td><td><code>[hidden]</code> + <code>display: none</code></td><td>4.1.2 Name, role, value</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a> (a11y tokens ship in the default bundle).</li>
          <li><strong>Semantic colors</strong>, <a href="/docs/colors">Colors</a> for surfaces and text tokens used in contrast pairs.</li>
          <li><strong>Both themes</strong>, toggle light/dark in the doc header while reviewing focus and swatches below.</li>
        </ul>

        <h2 id="tokens">Canonical tokens</h2>
        <p>Edit <code>tokens/a11y.css</code> for focus, motion, and documented contrast aliases. Sass source: <code>scss/tokens/_a11y.scss</code>.</p>
        ${pdocSnippet(
          `:root {
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
  --focus-ring-color: var(--primary-400);
  --focus-ring: var(--focus-ring-width) solid var(--focus-ring-color);
  --min-touch-target: 44px;
}

.focus-visible:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}`,
          'tokens/a11y.css',
          'css',
        )}

        <h2 id="focus">Visible focus</h2>
        <p>Interactive elements use <code>:focus-visible</code> (not <code>:focus</code> on every click) with a <strong>3px</strong> ring. Apply <code>.focus-visible</code> on custom controls or use the <code>focus-ring</code> mixin in Sass. In documentation previews, <code>.focus-visible</code> simulates the ring without tabbing.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${FOCUS_LAB}
          </div>
        </div>
        ${pdocSnippet(
          `<button type="button" class="btn btn--primary">Save</button>
<a class="link" href="/docs/profile">Profile</a>
<input class="field__input" type="email" />`,
          'Native focus-visible (no extra class)',
          'html',
        )}
        <p class="pdoc-muted-note">Tab through the demo above to see live <code>:focus-visible</code> on each control.</p>

        <h2 id="touch">Touch targets</h2>
        <p>Buttons, checkboxes, radios, switches, and theme toggles respect <code>min-height: var(--min-touch-target)</code> (44px). Icon-only buttons use the same minimum square size via <code>.btn--icon-only</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TOUCH_LAB}
          </div>
        </div>
        ${pdocSnippet(
          `@include touch-target; /* min 44×44px */

.btn--icon-only {
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
}`,
          'scss/mixins',
          'scss',
        )}

        <h2 id="contrast">Contrast pairs</h2>
        <p>Use <strong>semantic</strong> foreground/background tokens in UI. Target <strong>≥ 4.5:1</strong> for normal text (AA). Large text (≥ 18px regular or 14px bold) may use 3:1. Non-text UI boundaries and focus indicators need ≥ 3:1 against adjacent colors (WCAG 1.4.11).</p>
        <div class="pdoc-semantic-grid pdoc-semantic-grid--compact" role="list" aria-label="Key semantic contrast pairs">
          ${semanticGrid}
        </div>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Usage</th><th>Text</th><th>Background</th><th>Target</th></tr></thead>
            <tbody>
              <tr><td>Page body</td><td><code>--text-body</code></td><td><code>--surface-page</code></td><td>AA 4.5:1</td></tr>
              <tr><td>Primary button</td><td><code>--text-on-action</code></td><td><code>--surface-action</code></td><td>AA 4.5:1</td></tr>
              <tr><td>Error message</td><td><code>--error-700</code></td><td><code>--error-100</code></td><td>AA 4.5:1</td></tr>
              <tr><td>Success on tint</td><td><code>--success-900</code></td><td><code>--success-100</code></td><td>AA 4.5:1</td></tr>
            </tbody>
          </table>
        </div>
        <p>Full palette and live ratios: <a href="/colors#semantic">Colors → Semantic contrast pairs</a>.</p>

        <h2 id="sr-only">Screen reader only</h2>
        <p>Supplement visible labels with <code>.sr-only</code> when context is missing visually (icon-only buttons, redundant link text). Documentation chrome uses <code>.pdoc-sr-only</code> with the same clipping pattern.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview">
            ${SR_ONLY_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<button type="button" class="btn btn--primary btn--icon-only" aria-label="Close dialog">
  <span class="btn__icon" aria-hidden="true">×</span>
</button>
<!-- or visible label + sr-only detail -->
<button type="button" class="btn btn--outline">
  Download
  <span class="sr-only">, PDF format</span>
</button>`,
          'Patterns',
          'html',
        )}

        <h2 id="hidden">Hidden content</h2>
        <p>Always use the native <code>hidden</code> attribute (or <code>aria-hidden="true"</code> for decorative icons). Global CSS sets <code>[hidden] { display: none !important; }</code> so collapsed tree groups and loaders do not remain focusable.</p>
        ${pdocSnippet(
          `<ul class="tree__group" hidden>
  …
</ul>`,
          'Collapse pattern',
          'html',
        )}

        <h2 id="motion">Reduced motion</h2>
        <p>When users enable <strong>Reduce motion</strong> at the OS level, animations and transitions are minimized site-wide:</p>
        ${pdocSnippet(
          `@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
          'tokens/a11y.css',
          'css',
        )}
        <p>Avoid animating large properties (box-shadow, width) for state changes; prefer opacity, border, or instant swaps. Test carousels, loaders, and snackbars with reduced motion enabled.</p>

        <h2 id="utilities">Utilities &amp; classes</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td><code>.focus-visible</code></td><td>Applies <code>--focus-ring</code> on <code>:focus-visible</code></td></tr>
              <tr><td><code>.sr-only</code></td><td>Visually hidden, available to assistive tech</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'focus-vars',
            title: 'Override focus and touch tokens',
            body: 'Pass variables when importing PimentCSS. Keep ring width ≥ 2px and sufficient contrast against adjacent surfaces.',
            code: `@use "pimentcss-design-system" with (
  $focus-ring-width: 3px,
  $focus-ring-color: var(--accent-500),
  $min-touch-target: 44px,
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
        <p>See <a href="/docs/customization">Customization</a> for partial imports. Components use <code>@include focus-ring</code> and <code>@include touch-target</code> from <code>scss/abstracts/_mixins.scss</code>.</p>

        <h2 id="checklist">Review checklist</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Before shipping UI</p>
          <ul>
            <li><strong>Keyboard</strong>, tab order logical; focus visible on every interactive control; no focus trap without escape.</li>
            <li><strong>Names</strong>, buttons and links have accessible names; form fields have associated <code>&lt;label&gt;</code> or <code>aria-label</code>.</li>
            <li><strong>Color</strong>, do not rely on hue alone; pair with text, icons, or weight (RGAA thématique 3).</li>
            <li><strong>Contrast</strong>, verify light and dark; use semantic tokens from <a href="/docs/colors">Colors</a>.</li>
            <li><strong>Motion</strong>, test with <code>prefers-reduced-motion: reduce</code>.</li>
            <li><strong>Dialogs</strong>, <code>role="dialog"</code>, <code>aria-modal="true"</code>, focus management, see <a href="/docs/modals">Modals</a>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/colors"><p class="pdoc-card__title">Colors</p><p class="pdoc-card__desc">OKLCH palettes and semantic contrast swatches.</p></a>
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Variants, focus, and touch-sized controls.</p></a>
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Labels, errors, and field focus rings.</p></a>
          <a class="pdoc-card" href="/docs/theme-toggle"><p class="pdoc-card__title">Theme toggle</p><p class="pdoc-card__desc">Light / dark with accessible mode control.</p></a>
          <a class="pdoc-card" href="/docs/modals"><p class="pdoc-card__title">Modals</p><p class="pdoc-card__desc">Focus trap and dialog semantics.</p></a>
        </div>`;
}
