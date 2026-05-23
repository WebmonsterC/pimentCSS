import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ICON, ph } from './icon';

type BtnVariant = 'primary' | 'transparent' | 'outline';

const VARIANTS: { id: BtnVariant; label: string }[] = [
  { id: 'primary', label: 'Primary' },
  { id: 'transparent', label: 'Transparent' },
  { id: 'outline', label: 'Outline' },
];

function btnMarkup(
  variant: BtnVariant,
  opts: { hover?: boolean; focus?: boolean; disabled?: boolean; label?: string } = {},
): string {
  const classes = [
    'btn',
    `btn--${variant}`,
    opts.hover ? 'btn--hover' : '',
    opts.focus ? 'btn--focus' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const label = opts.label ?? 'Button';
  const disabled = opts.disabled ? ' disabled' : '';
  return `<button type="button" class="${classes}"${disabled}>${label}</button>`;
}

function matrixCell(html: string): string {
  return `<div class="ds-matrix__cell">${html}</div>`;
}

function matrixRow(variant: BtnVariant, label: string): string {
  const cells = [
    matrixCell(btnMarkup(variant, {})),
    matrixCell(btnMarkup(variant, { hover: true })),
    matrixCell(btnMarkup(variant, { focus: true })),
    matrixCell(btnMarkup(variant, { disabled: true })),
  ].join('\n            ');
  return `<div class="ds-matrix__row">${label}</div>
            ${cells}`;
}

const VARIANT_MATRIX = `<div class="ds-matrix ds-matrix--btn" role="group" aria-label="Button variants and states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Hover</div>
            <div class="ds-matrix__head">Focus</div>
            <div class="ds-matrix__head">Disabled</div>
            ${VARIANTS.map((v) => matrixRow(v.id, v.label)).join('\n            ')}
          </div>
          <p class="body-small pdoc-text-muted">Matrix uses <code>.btn--hover</code> and <code>.btn--focus</code> for documentation previews. In your app, rely on <code>:hover</code> and <code>:focus-visible</code>.</p>`;

const ICON_ROW = `<div class="pdoc-btn-icon-row" role="group" aria-label="Icon-only buttons">
              <button type="button" class="btn btn--primary btn--icon-only focus-visible" aria-label="Add item">
                ${ph('plus', 20, 'btn__icon')}
              </button>
              <button type="button" class="btn btn--outline btn--icon-only focus-visible" aria-label="Settings">
                ${ph('gear-six', 20, 'btn__icon')}
              </button>
              <button type="button" class="btn btn--transparent btn--icon-only focus-visible" aria-label="Close">
                ${ph('x', 20, 'btn__icon')}
              </button>
            </div>`;

const WITH_ICONS = `<div class="pdoc-demo-row pdoc-demo-row--start">
              <button type="button" class="btn btn--primary focus-visible">
                Continue
                ${ICON.arrowRight('btn__icon', 20)}
              </button>
              <button type="button" class="btn btn--outline focus-visible">
                ${ph('download-simple', 20, 'btn__icon')}
                Download
              </button>
            </div>`;

const IN_CONTEXT = `<article class="card card--elevated card--copy">
              <div class="card__body d-flex flex-column gap-3">
                <p class="heading-h5 mb-0">Newsletter</p>
                <p class="body-small copy-block__text mb-0">Semantic action colors from <code>--surface-action</code> and <code>--text-on-action</code>.</p>
                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="btn btn--primary focus-visible">Subscribe</button>
                  <button type="button" class="btn btn--outline focus-visible">Learn more</button>
                </div>
              </div>
            </article>`;

const LINK_AS_BTN = `<a href="/docs/installation" class="btn btn--primary focus-visible">Installation guide</a>`;

/** Full Buttons page (Actions). */
export function buildButtonsPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Use native <code>&lt;button type="button"&gt;</code> for actions. Icon-only controls need an <code>aria-label</code>. Disabled actions: <code>disabled</code> or <code>aria-disabled="true"</code>. Visible focus: <code>:focus-visible</code> (3px <code>--focus-ring</code>). Minimum height <code>--min-touch-target</code> (44px).</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>Action buttons live in <code>scss/components/_button.scss</code>. Three variants share one base <code>.btn</code> class: <strong>primary</strong> (filled action surface), <strong>outline</strong> (bordered on primary surface), and <strong>transparent</strong> (text action on muted backgrounds). Pair with <a href="/docs/button-group">Button group</a> for segmented toolbars.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Variant</th><th>Class</th><th>Typical use</th></tr></thead>
            <tbody>
              <tr><td>Primary</td><td><code>.btn--primary</code></td><td>Main call to action, one per view when possible</td></tr>
              <tr><td>Outline</td><td><code>.btn--outline</code></td><td>Secondary actions, cancel beside primary</td></tr>
              <tr><td>Transparent</td><td><code>.btn--transparent</code></td><td>Tertiary actions in headers, cards, tables</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Semantic colors</strong>, <code>--surface-action</code> and <code>--text-on-action</code> from <a href="/docs/colors">Colors</a>.</li>
          <li><strong>Focus tokens</strong>, <code>--focus-ring</code> on <a href="/docs/a11y">Accessibility</a>.</li>
        </ul>

        <h2 id="variants-matrix">Variants and states</h2>
        <p>Default, hover, focus, and disabled for each variant. Toggle light/dark in the header to verify contrast on primary and outline.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${VARIANT_MATRIX}
          </div>
        </div>
        ${pdocSnippet(
          `<button type="button" class="btn btn--primary">Save</button>
<button type="button" class="btn btn--outline">Cancel</button>
<button type="button" class="btn btn--transparent">Details</button>`,
          'buttons.html',
          'html',
        )}

        <h2 id="icons">Icons in buttons</h2>
        <p>Place icons in <code>.btn__icon</code> (20px slot). Icons are decorative when visible text is present: set <code>aria-hidden="true"</code> on the icon element. Leading and trailing icons are supported via flex <code>gap</code>. See the <a href="/docs/icons">Icons guide</a> for library choice, slot sizes, and SVG patterns.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${WITH_ICONS}
          </div>
        </div>
        ${pdocSnippet(
          `<button type="button" class="btn btn--primary">
  Continue
  <i class="ph ph-arrow-right btn__icon" aria-hidden="true"></i>
</button>`,
          'button-with-icon.html',
          'html',
        )}

        <h2 id="icon-only">Icon-only</h2>
        <p>Square touch target via <code>.btn--icon-only</code> (min 44×44px). Always provide <code>aria-label</code>; never rely on the icon alone.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ICON_ROW}
          </div>
        </div>
        ${pdocSnippet(
          `<button type="button" class="btn btn--primary btn--icon-only" aria-label="Add item">
  <i class="ph ph-plus btn__icon" aria-hidden="true"></i>
</button>`,
          'icon-only.html',
          'html',
        )}

        <h2 id="link-as-button">Link styled as a button</h2>
        <p>For navigation that looks like a button, use <code>&lt;a class="btn btn--primary"&gt;</code> with a real <code>href</code>. Do not use <code>&lt;button&gt;</code> for in-page navigation. For text links, see <a href="/docs/link-breadcrumb">Links &amp; breadcrumb</a>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview">
            ${LINK_AS_BTN}
          </div>
        </div>

        <h2 id="in-context">In context</h2>
        <p>Primary + outline pairs work well in cards and forms. Keep one primary action per panel.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${IN_CONTEXT}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.btn</code></td><td>Base: flex, typography, min-height, transitions</td></tr>
              <tr><td><code>.btn--primary</code></td><td>Filled action (<code>--surface-action</code>)</td></tr>
              <tr><td><code>.btn--outline</code></td><td>Bordered on <code>--surface-primary</code></td></tr>
              <tr><td><code>.btn--transparent</code></td><td>Transparent background, action text color</td></tr>
              <tr><td><code>.btn--icon-only</code></td><td>Square icon-only (44px min)</td></tr>
              <tr><td><code>.btn__icon</code></td><td>Icon slot (1.25rem)</td></tr>
              <tr><td><code>.btn--hover</code> / <code>.btn--focus</code></td><td>Doc preview modifiers only</td></tr>
              <tr><td><code>.focus-visible</code></td><td>Simulates focus ring in docs</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'btn-vars',
            title: 'Override button tokens',
            body: 'Adjust height, padding, and radius. Keep <code>$btn-min-height</code> at or above 2.75rem (44px) for touch targets.',
            code: `@use "pimentcss" with (
  $btn-min-height: 2.75rem,
  $btn-padding-x: 1.25rem,
  $btn-border-radius: 0.5rem,
  $surface-action: var(--primary-600),
);`,
            label: 'theme.scss',
            lang: 'scss',
          },
          {
            id: 'btn-rebuild',
            title: 'Rebuild CSS',
            body: 'Regenerate your theme CSS after variable changes.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}
        <p>See <a href="/docs/customization">Customization</a> for partial imports and semantic token overrides.</p>

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Button checklist</p>
          <ul>
            <li><strong>Native control</strong>, prefer <code>&lt;button type="button"&gt;</code> for actions; use <code>&lt;a class="btn"&gt;</code> only for navigation.</li>
            <li><strong>Accessible name</strong>, visible text or <code>aria-label</code> on icon-only buttons.</li>
            <li><strong>Disabled</strong>, use <code>disabled</code> or <code>aria-disabled="true"</code>; do not rely on color alone.</li>
            <li><strong>Focus</strong>, never remove <code>:focus-visible</code>; ring uses <code>--focus-ring</code> (3px).</li>
            <li><strong>Contrast</strong>, primary text on <code>--surface-action</code> ≥ 4.5:1 in light and dark (<a href="/docs/colors">Colors</a>).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/button-group"><p class="pdoc-card__title">Button group</p><p class="pdoc-card__desc">Segmented actions and toolbars.</p></a>
          <a class="pdoc-card" href="/docs/form"><p class="pdoc-card__title">Form</p><p class="pdoc-card__desc">Submit buttons in real forms.</p></a>
          <a class="pdoc-card" href="/docs/link-breadcrumb"><p class="pdoc-card__title">Links &amp; breadcrumb</p><p class="pdoc-card__desc">When the control navigates instead of acting.</p></a>
          <a class="pdoc-card" href="/docs/a11y"><p class="pdoc-card__title">Accessibility</p><p class="pdoc-card__desc">Focus, touch targets, and contrast.</p></a>
        </div>`;
}
