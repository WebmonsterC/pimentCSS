import { pdocSnippet, pdocSteps } from './pdoc-html';
import { TAG_REFERENCE_JS } from './tag-behavior';
import { ph } from './icon';

const TAG_ADD = ph('plus', 16, 'tag__icon tag__icon--add');
const TAG_CLOSE = ph('x', 16, 'tag__icon');

type StaticVariant = 'neutral' | 'information' | 'success' | 'warning' | 'error' | 'disabled';

const STATIC_VARIANTS: { id: StaticVariant; label: string }[] = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'information', label: 'Information' },
  { id: 'success', label: 'Success' },
  { id: 'warning', label: 'Warning' },
  { id: 'error', label: 'Error' },
  { id: 'disabled', label: 'Disabled' },
];

function staticTag(variant: StaticVariant, label = 'Tag'): string {
  const mod = variant === 'disabled' ? 'tag--disabled' : `tag--${variant}`;
  return `<span class="tag ${mod}">
                ${TAG_ADD}
                <span class="tag__label">${label}</span>
              </span>`;
}

function interactiveTag(opts: {
  selected?: boolean;
  hover?: boolean;
  focus?: boolean;
  disabled?: boolean;
  label?: string;
  matrixStatic?: boolean;
}): string {
  const classes = [
    'tag',
    'tag--interactive',
    opts.selected ? 'tag--interactive-selected' : '',
    opts.hover ? 'tag--hover' : '',
    opts.focus ? 'tag--focus' : '',
    opts.disabled ? 'tag--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const label = opts.label ?? 'Tag';
  const pressed = opts.selected ? 'true' : 'false';
  const disabled = opts.disabled ? ' disabled' : '';
  const ariaPressed = opts.matrixStatic ? '' : ` aria-pressed="${pressed}"`;

  if (opts.selected) {
    return `<button type="button" class="${classes}"${ariaPressed}${disabled}>
                <span class="tag__label">${label}</span>
                ${TAG_CLOSE}
              </button>`;
  }
  return `<button type="button" class="${classes}"${ariaPressed}${disabled}>
                ${TAG_ADD}
                <span class="tag__label">${label}</span>
              </button>`;
}

function matrixCell(html: string): string {
  return `<div class="ds-matrix__cell">${html}</div>`;
}

function matrixRow(rowLabel: string, cells: Parameters<typeof interactiveTag>[0][]): string {
  return `<div class="ds-matrix__row">${rowLabel}</div>
            ${cells.map((c) => matrixCell(interactiveTag({ ...c, matrixStatic: true }))).join('\n            ')}`;
}

const STATIC_SWATCHES = `<div class="pdoc-tag-swatches" role="group" aria-label="Static tag variants">
              ${STATIC_VARIANTS.map(
                ({ id, label }) => `<figure class="pdoc-tag-swatches__item">
                ${staticTag(id)}
                <figcaption class="body-small pdoc-text-muted">${label}</figcaption>
              </figure>`,
              ).join('\n              ')}
            </div>`;

const INTERACTIVE_MATRIX = `<div class="ds-matrix ds-matrix--tag" role="group" aria-label="Interactive tag states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Hover</div>
            <div class="ds-matrix__head">Focus</div>
            <div class="ds-matrix__head">Disabled</div>
            ${matrixRow('Unselected', [
              {},
              { hover: true },
              { focus: true },
              { disabled: true },
            ])}
            ${matrixRow('Selected', [
              { selected: true },
              { selected: true, hover: true },
              { selected: true, focus: true },
              { selected: true, disabled: true },
            ])}
          </div>`;

const LIVE_FILTERS = `<div class="pdoc-tag-filters" data-tags-live role="group" aria-label="Filter topics">
              ${interactiveTag({ label: 'Design' })}
              ${interactiveTag({ label: 'Accessibility', selected: true })}
              ${interactiveTag({ label: 'Forms' })}
              ${interactiveTag({ label: 'Navigation' })}
            </div>`;

export function buildTagsPageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_tag.scss</code>. Tags are compact labels for filters, metadata, or status. Use <strong>static</strong> variants for read-only chips, and <strong>interactive</strong> tags as toggle buttons with <code>aria-pressed</code>.</p>

        <h2 id="tag-static">Static tags</h2>
        <p>Semantic backgrounds with optional leading icon. Disabled uses <code>.tag--disabled</code> on a <code>&lt;span&gt;</code> (not interactive).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${STATIC_SWATCHES}
          </div>
        </div>
        ${pdocSnippet(
          `<span class="tag tag--information">
  <span class="tag__icon" aria-hidden="true">…</span>
  <span class="tag__label">Draft</span>
</span>`,
          'tag-static.html',
          'html',
        )}

        <h2 id="tag-interactive">Interactive tags</h2>
        <p>Dashed border when unselected; solid fill when selected (<code>.tag--interactive-selected</code>). The plus icon hides when selected and a dismiss icon appears.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${INTERACTIVE_MATRIX}
          </div>
        </div>

        <h2 id="tag-live">Filter chips (live)</h2>
        <p>Click tags to toggle selection. Each control is a <code>&lt;button class="tag tag--interactive"&gt;</code> with <code>aria-pressed</code> (<code>data-tags-live</code> wires the demo).</p>
        <div class="pdoc-callout pdoc-callout--tip">
          <p class="body-small mb-0">Use for multi-select filters; expose the group with <code>role="group"</code> and an accessible name.</p>
        </div>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LIVE_FILTERS}
          </div>
        </div>
        ${pdocSnippet(
          `<div role="group" aria-label="Filters" data-tags-live>
  <button type="button" class="tag tag--interactive" aria-pressed="false">
    <span class="tag__label">Design</span>
  </button>
  <button type="button" class="tag tag--interactive tag--interactive-selected" aria-pressed="true">
    <span class="tag__label">Accessibility</span>
  </button>
</div>`,
          'tags-live.html',
          'html',
        )}

        <h2 id="tag-js">JavaScript</h2>
        ${pdocSnippet(TAG_REFERENCE_JS, 'tags.js', 'javascript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.tag</code></td><td>Base inline-flex chip</td></tr>
              <tr><td><code>.tag__label</code></td><td>Truncated label text</td></tr>
              <tr><td><code>.tag__icon</code></td><td>16px icon (add or dismiss)</td></tr>
              <tr><td><code>.tag__icon--add</code></td><td>Plus icon when unselected (hidden when selected)</td></tr>
              <tr><td><code>.tag--neutral</code> … <code>.tag--error</code></td><td>Static semantic variants</td></tr>
              <tr><td><code>.tag--disabled</code></td><td>Static disabled appearance</td></tr>
              <tr><td><code>.tag--interactive</code></td><td>Toggle button (dashed border)</td></tr>
              <tr><td><code>.tag--interactive-selected</code></td><td>Selected toggle (solid fill)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'tag-tokens',
            title: 'Tag spacing',
            body: 'Adjust padding, gap, and icon size for denser toolbars.',
            code: `@use "pimentcss" with (
  $tag-gap: 0.25rem,
  $tag-padding-x: 0.5rem,
  $tag-icon-size: 1rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'tag-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _tag.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Tags and filter chips</p>
          <ul>
            <li><strong>Static tags</strong>, use <code>&lt;span&gt;</code> when not actionable; decorative icons need <code>aria-hidden="true"</code>.</li>
            <li><strong>Interactive tags</strong>, use <code>&lt;button type="button"&gt;</code> with <code>aria-pressed="true|false"</code> for toggle chips.</li>
            <li><strong>Groups</strong>, wrap related filters in <code>role="group"</code> with <code>aria-label</code> or a visible heading referenced by <code>aria-labelledby</code>.</li>
            <li><strong>Disabled</strong>, use the native <code>disabled</code> attribute on buttons; do not rely on color alone for state.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/badge"><p class="pdoc-card__title">Badges</p><p class="pdoc-card__desc">Counters and status dots.</p></a>
          <a class="pdoc-card" href="/docs/keyline"><p class="pdoc-card__title">Dividers</p><p class="pdoc-card__desc">Horizontal and vertical rules.</p></a>
          <a class="pdoc-card" href="/docs/autocomplete"><p class="pdoc-card__title">Autocomplete</p><p class="pdoc-card__desc">Typeahead with suggestions.</p></a>
          <a class="pdoc-card" href="/docs/button-group"><p class="pdoc-card__title">Button group</p><p class="pdoc-card__desc">Segmented single-choice actions.</p></a>
        </div>`;
}
