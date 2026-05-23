import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ANCHOR_REFERENCE_JS } from './anchor-behavior';
import { ph } from './icon';

const LINK_ICON = ph('link', 20, 'anchor-item__icon');

type AnchorItemOpts = {
  label?: string;
  level2?: boolean;
  selected?: boolean;
  mods?: string;
  iconLeft?: boolean;
  iconRight?: boolean;
  ariaCurrent?: 'true' | 'page';
  /** Matrix preview only (not a real link; avoids axe on href="#"). */
  staticPreview?: boolean;
};

function anchorItem(opts: AnchorItemOpts = {}): string {
  const label = opts.label ?? 'Anchor item';
  const className = [
    'anchor-item',
    opts.level2 ? 'anchor-item--level-2' : '',
    opts.mods,
    opts.selected ? 'anchor-item--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const ariaCurrent =
    opts.selected || opts.ariaCurrent
      ? ` aria-current="${opts.ariaCurrent ?? (opts.level2 ? 'page' : 'true')}"`
      : '';
  const left = opts.iconLeft ? LINK_ICON : '';
  const right = opts.iconRight ? LINK_ICON : '';
  const inner = `${left}<span class="anchor-item__label">${label}</span>${right}`;
  if (opts.staticPreview) {
    return `<span class="${className}"${ariaCurrent}>${inner}</span>`;
  }
  return `<a href="#" class="${className}"${ariaCurrent}>${inner}</a>`;
}

function matrixCell(html: string): string {
  return `<div class="ds-matrix__cell">${html}</div>`;
}

function matrixRow(rowLabel: string, cells: AnchorItemOpts[]): string {
  return `<div class="ds-matrix__row">${rowLabel}</div>
            ${cells.map((c) => matrixCell(anchorItem({ ...c, staticPreview: true }))).join('\n            ')}`;
}

const ANCHOR_L1_MATRIX = `<div class="ds-matrix ds-matrix--anchor" role="group" aria-label="Anchor item level 1 states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Focus</div>
            <div class="ds-matrix__head">Hover</div>
            ${matrixRow('Unselected', [
              {},
              { mods: 'anchor-item--focus' },
              { mods: 'anchor-item--hover' },
            ])}
            ${matrixRow('Selected', [
              { selected: true },
              { selected: true, mods: 'anchor-item--focus' },
              { selected: true, mods: 'anchor-item--hover' },
            ])}
          </div>`;

const ANCHOR_L2_MATRIX = `<div class="ds-matrix ds-matrix--anchor" role="group" aria-label="Anchor item level 2 states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Focus</div>
            <div class="ds-matrix__head">Hover</div>
            ${matrixRow('Unselected', [
              { level2: true },
              { level2: true, mods: 'anchor-item--focus' },
              { level2: true, mods: 'anchor-item--hover' },
            ])}
            ${matrixRow('Selected', [
              { level2: true, selected: true, ariaCurrent: 'page' },
              { level2: true, selected: true, mods: 'anchor-item--focus', ariaCurrent: 'page' },
              { level2: true, selected: true, mods: 'anchor-item--hover', ariaCurrent: 'page' },
            ])}
          </div>`;

const ANCHOR_BLOCK = `<nav class="anchor-nav pdoc-anchor-demo" aria-label="Sections">
              <a href="#intro" class="anchor-item anchor-item--selected" aria-current="true">
                <span class="anchor-item__label">Introduction</span>
              </a>
              <a href="#details" class="anchor-item">
                <span class="anchor-item__label">Details</span>
              </a>
              <a href="#sub-a" class="anchor-item anchor-item--level-2">
                <span class="anchor-item__label">Subsection A</span>
              </a>
              <a href="#sub-b" class="anchor-item anchor-item--level-2 anchor-item--selected" aria-current="page">
                <span class="anchor-item__label">Subsection B</span>
              </a>
              <a href="#faq" class="anchor-item">
                <span class="anchor-item__label">FAQ</span>
              </a>
            </nav>`;

const ANCHOR_BLOCK_LIVE = `<nav class="anchor-nav pdoc-anchor-demo" data-anchor-live aria-label="Sections (live)">
              <a href="#intro" class="anchor-item anchor-item--selected" aria-current="true">
                <span class="anchor-item__label">Introduction</span>
              </a>
              <a href="#details" class="anchor-item">
                <span class="anchor-item__label">Details</span>
              </a>
              <a href="#sub-a" class="anchor-item anchor-item--level-2">
                <span class="anchor-item__label">Subsection A</span>
              </a>
              <a href="#sub-b" class="anchor-item anchor-item--level-2">
                <span class="anchor-item__label">Subsection B</span>
              </a>
              <a href="#faq" class="anchor-item">
                <span class="anchor-item__label">FAQ</span>
              </a>
            </nav>`;

export function buildAnchorInpageNavPageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_anchor-nav.scss</code>. In-page anchor navigation links sections on long pages with a vertical rail and optional icons.</p>

        <h2 id="anatomy">Anatomy</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Nav</td><td><code>.anchor-nav</code></td><td>Vertical <code>&lt;nav&gt;</code>; width fits longest label</td></tr>
              <tr><td>Constrained</td><td><code>.anchor-nav--constrained</code></td><td>Optional fixed ~110px column with ellipsis</td></tr>
              <tr><td>Item</td><td><code>.anchor-item</code></td><td>Section link with left border rail</td></tr>
              <tr><td>Level 2</td><td><code>.anchor-item--level-2</code></td><td>Indented child section (+8px margin)</td></tr>
              <tr><td>Selected</td><td><code>.anchor-item--selected</code></td><td>Active section; pair with <code>aria-current</code></td></tr>
              <tr><td>Icon</td><td><code>.anchor-item__icon</code></td><td>Optional 20px icons (level 1 only)</td></tr>
              <tr><td>Label</td><td><code>.anchor-item__label</code></td><td>Text slot; hover surface wraps item (8px padding)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Icons</strong> (optional), <code>link-01</code> at 20px via <code>ph()</code>.</li>
          <li><strong>Section IDs</strong>, each <code>href</code> should target a heading or region <code>id</code> on the page.</li>
        </ul>

        <h2 id="anchor-l1">Anchor items, level 1</h2>
        <p>By default, <code>.anchor-nav</code> and each <code>.anchor-item</code> grow to the full label width (plus 8px padding); labels are never truncated. Hover and doc-only <code>.anchor-item--hover</code> wrap that box. For a narrow sidebar with ellipsis, add <code>.anchor-nav--constrained</code>. Icons are optional via <code>.anchor-item__icon</code>. Doc-only <code>.anchor-item--focus</code> previews the focus ring; production uses <code>:focus-visible</code>. Selected uses <code>aria-current="true"</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ANCHOR_L1_MATRIX}
          </div>
        </div>

        <h2 id="anchor-l2">Anchor items, level 2</h2>
        <p>Child sections use <code>.anchor-item--level-2</code> (extra 8px left margin so hover aligns with indented text) and <code>aria-current="page"</code> when that section is active.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ANCHOR_L2_MATRIX}
          </div>
        </div>

        <h2 id="anchor-block">Vertical anchor block</h2>
        <p>Stack links inside <code>.anchor-nav</code>. Mix level 1 and level 2 items; only one section should be current at a time.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-anchor-demo-wrap">
            ${ANCHOR_BLOCK}
          </div>
        </div>
        ${pdocSnippet(
          `<nav class="anchor-nav" aria-label="Sections">
  <a href="#intro" class="anchor-item anchor-item--selected" aria-current="true">
    <span class="anchor-item__label">Introduction</span>
  </a>
  <a href="#details" class="anchor-item anchor-item--level-2">
    <span class="anchor-item__label">Details</span>
  </a>
</nav>`,
          'anchor-nav.html',
          'html',
        )}

        <h2 id="anchor-live">Interactive example</h2>
        <p>Add <code>data-anchor-live</code> on <code>.anchor-nav</code> and call <code>wireAllAnchorNavs()</code> after load. Clicks update <code>aria-current</code> (demo prevents navigation). In production, pair with scroll-spy or native hash navigation.</p>
        ${pdocSnippet(ANCHOR_REFERENCE_JS, 'anchor-nav.js', 'javascript')}
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-anchor-demo-wrap">
            ${ANCHOR_BLOCK_LIVE}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.anchor-nav</code></td><td>Vertical nav; width fits content</td></tr>
              <tr><td><code>.anchor-nav--constrained</code></td><td>Optional max ~110px + ellipsis</td></tr>
              <tr><td><code>.anchor-item</code></td><td>Section link (fit-content width, min-height 44px, hover on padded box)</td></tr>
              <tr><td><code>.anchor-item--level-2</code></td><td>Indented subsection (+8px margin-inline-start)</td></tr>
              <tr><td><code>.anchor-item--selected</code></td><td>Active link (2px left border, semi-bold)</td></tr>
              <tr><td><code>.anchor-item--hover</code></td><td>Doc-only hover preview</td></tr>
              <tr><td><code>.anchor-item--focus</code></td><td>Doc-only focus ring preview</td></tr>
              <tr><td><code>.anchor-item__icon</code></td><td>20px optional icon</td></tr>
              <tr><td><code>.anchor-item__label</code></td><td>Label text</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'anchor-tokens',
            title: 'Anchor spacing',
            body: 'Override gaps, padding, and selected border width.',
            code: `@use "pimentcss-design-system" with (
  $anchor-item-gap: 0.75rem,
  $anchor-item-py: 0.5rem,
  $anchor-item-px-l1: 0.5rem,
  $anchor-item-px-l2: 1rem,
  $anchor-border-selected: 0.125rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'anchor-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _anchor-nav.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">In-page navigation</p>
          <ul>
            <li><strong>Landmark</strong>, use <code>&lt;nav aria-label="Sections"&gt;</code> for the anchor list.</li>
            <li><strong>Current section</strong>, set <code>aria-current="true"</code> on level 1 or <code>aria-current="page"</code> on level 2 (with <code>.anchor-item--selected</code>).</li>
            <li><strong>Targets</strong>, each <code>href</code> must match a visible section <code>id</code>; avoid empty <code>#</code> in production.</li>
            <li><strong>Focus</strong>, visible <code>:focus-visible</code> outline on links.</li>
            <li><strong>Touch</strong>, items are at least 44px tall by default.</li>
            <li><strong>Skip link</strong>, consider a skip link before the anchor nav on long pages.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/pagination"><p class="pdoc-card__title">Pagination</p><p class="pdoc-card__desc">Page controls for long lists.</p></a>
          <a class="pdoc-card" href="/docs/carousel"><p class="pdoc-card__title">Carousel</p><p class="pdoc-card__desc">Horizontal content slides.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Header bars and nav links.</p></a>
          <a class="pdoc-card" href="/docs/link-breadcrumb"><p class="pdoc-card__title">Links & breadcrumb</p><p class="pdoc-card__desc">Inline links and trails.</p></a>
        </div>`;
}
