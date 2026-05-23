import { pdocSnippet, pdocSteps } from './pdoc-html';
import { BUTTON_GROUP_REFERENCE_JS } from './button-group-behavior';
import { ph } from './icon';

const bgIcon = (name: string, size: 16 | 20 | 24 = 20) => ph(name, size, 'btn-group__icon');
const ICON_LIST = bgIcon('list');
const ICON_FOLDER = bgIcon('folder');
const ICON_BOOKMARK = bgIcon('bookmark');
const ICON_HOME = bgIcon('house');

type ItemState = { label: string; mods: string; disabled?: boolean };

const ITEM_STATES: ItemState[] = [
  { label: 'Default', mods: '' },
  { label: 'Hover (spec)', mods: 'btn-group__item--hover' },
  { label: 'Selected', mods: 'btn-group__item--selected' },
  { label: 'Disabled', mods: '', disabled: true },
];

function itemStateCell(state: ItemState, label = 'Label'): string {
  const disabled = state.disabled ? ' disabled' : '';
  const mods = state.mods ? ` ${state.mods}` : '';
  return `            <li class="pdoc-control-state pdoc-control-state--btn-group" role="listitem">
              <span class="pdoc-control-state__label">${state.label}</span>
              <div class="btn-group" role="presentation">
                <button type="button" class="btn-group__item${mods} focus-visible"${disabled}>
                  ${ICON_LIST}
                  <span class="btn-group__label">${label}</span>
                </button>
              </div>
            </li>`;
}

const ITEM_STATES_SPEC = `<ul class="pdoc-control-states pdoc-control-states--btn-group" role="list" aria-label="Button item states">
${ITEM_STATES.map((s) => itemStateCell(s)).join('\n')}
          </ul>`;

function btnItem(
  label: string,
  icon: string,
  opts: {
    selected?: boolean;
    pressed?: boolean;
    checked?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    radio?: boolean;
  } = {},
): string {
  const sel = opts.selected ? ' btn-group__item--selected' : '';
  const disabled = opts.disabled ? ' disabled' : '';
  const ariaLabel = opts.ariaLabel ? ` aria-label="${opts.ariaLabel}"` : '';
  const pressed = opts.pressed ? ' aria-pressed="true"' : opts.pressed === false ? ' aria-pressed="false"' : '';
  const checked = opts.checked ? ' aria-checked="true"' : opts.checked === false ? ' aria-checked="false"' : '';
  const role = opts.radio ? ' role="radio"' : '';

  return `<button type="button" class="btn-group__item${sel} focus-visible"${role}${pressed}${checked}${disabled}${ariaLabel}>
                ${icon}
                <span class="btn-group__label">${label}</span>
              </button>`;
}

function buttonGroupBlock(opts: {
  id?: string;
  variant?: '' | 'icon';
  role: 'group' | 'radiogroup';
  label: string;
  items: string;
  live?: boolean;
  single?: boolean;
  hint?: string;
}): string {
  const iconMod = opts.variant === 'icon' ? ' btn-group--icon' : '';
  const liveAttr = opts.live ? ' data-button-group-live' : '';
  const singleAttr = opts.single ? ' data-bg-single' : '';
  const idAttr = opts.id ? ` id="${opts.id}"` : '';
  const hint = opts.hint
    ? `<p class="body-small pdoc-text-muted mt-2 mb-0">${opts.hint}</p>`
    : '';

  return `<div class="btn-group${iconMod}"${idAttr} role="${opts.role}" aria-label="${opts.label}"${liveAttr}${singleAttr}>
              ${opts.items}
            </div>${hint}`;
}

const DEFAULT_GROUP = buttonGroupBlock({
  role: 'group',
  label: 'View mode',
  single: true,
  items: [
    btnItem('List view', ICON_LIST),
    btnItem('Grid view', ICON_FOLDER),
    btnItem('Card view', ICON_BOOKMARK, { selected: true, pressed: true }),
    btnItem('Detail view', ICON_HOME),
  ].join('\n              '),
});

const TOGGLE_GROUP = buttonGroupBlock({
  role: 'radiogroup',
  label: 'Display mode',
  items: [
    btnItem('List', ICON_LIST, { radio: true, checked: false }),
    btnItem('Grid', ICON_FOLDER, { radio: true, selected: true, checked: true }),
  ].join('\n              '),
  hint: 'Single choice: <code>role="radiogroup"</code> and <code>aria-checked</code> on each item.',
});

const ICON_GROUP = buttonGroupBlock({
  variant: 'icon',
  role: 'group',
  label: 'Quick actions',
  items: [
    `<button type="button" class="btn-group__item focus-visible" aria-label="Search">${bgIcon('search-01')}</button>`,
    `<button type="button" class="btn-group__item focus-visible" aria-label="Add">${bgIcon('add-01')}</button>`,
    `<button type="button" class="btn-group__item btn-group__item--selected focus-visible" aria-pressed="true" aria-label="Bookmark (active)">${ICON_BOOKMARK}</button>`,
    `<button type="button" class="btn-group__item focus-visible" aria-label="Home">${ICON_HOME}</button>`,
  ].join('\n              '),
});

const LIVE_GROUP = buttonGroupBlock({
  id: 'pdoc-bg-live',
  role: 'group',
  label: 'View mode',
  live: true,
  single: true,
  items: [
    btnItem('List', ICON_LIST, { pressed: false }),
    btnItem('Grid', ICON_FOLDER, { selected: true, pressed: true }),
    btnItem('Cards', ICON_BOOKMARK, { pressed: false }),
  ].join('\n              '),
});

/** Full Button group page (Actions). */
export function buildButtonGroupPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Grouped actions need a visible <strong>name</strong> on the container (<code>aria-label</code> or <code>aria-labelledby</code>). Each segment stays a native <code>&lt;button&gt;</code> with a clear label (visible text or <code>aria-label</code> when icon-only). Keep decorative icons on <code>aria-hidden="true"</code>. Sync <code>aria-pressed</code> or <code>aria-checked</code> when the selected state changes.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p><code>.btn-group</code> is an inline flex row of <code>.btn-group__item</code> buttons sharing one outer border. Add <code>.btn-group--icon</code> when every item is icon-only (square min-width). The active segment uses <code>.btn-group__item--selected</code> and the matching ARIA attribute (<code>aria-pressed</code> or <code>aria-checked</code>).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Container</td><td><code>.btn-group</code></td><td>Bordered row, clips item corners</td></tr>
              <tr><td>Item</td><td><code>.btn-group__item</code></td><td>Segment button (42px min-height)</td></tr>
              <tr><td>Icon</td><td><code>.btn-group__icon</code></td><td>20px mask icon inside item</td></tr>
              <tr><td>Label</td><td><code>.btn-group__label</code></td><td>Visible text beside icon</td></tr>
              <tr><td>Icon-only</td><td><code>.btn-group--icon</code></td><td>Square icon buttons</td></tr>
              <tr><td>Selected</td><td><code>.btn-group__item--selected</code></td><td>Primary surface + on-action text</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Icons</strong>, <code>btn-group__icon</code> slot with Phosphor (<code>ph()</code>) or any SVG library.</li>
          <li><strong>Buttons</strong>, same action tokens as standalone <a href="/docs/buttons">Buttons</a> (hover, focus, disabled).</li>
        </ul>

        <h2 id="item-states">Button item</h2>
        <p>Each segment is a <code>&lt;button type="button"&gt;</code>. Doc-only modifiers <code>--hover</code> show spec states; interactive demos rely on real hover and your script for selection.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ITEM_STATES_SPEC}
          </div>
        </div>

        <h2 id="structure">Structure</h2>
        <p>Wrap items in <code>.btn-group</code> with <code>role="group"</code> for toolbars or multi-toggle segments, or <code>role="radiogroup"</code> when only one option may be active. Icon + text pairs use <code>.btn-group__icon</code> and <code>.btn-group__label</code>.</p>
        ${pdocSnippet(
          `<div class="btn-group" role="group" aria-label="View mode">
  <button type="button" class="btn-group__item" aria-pressed="false">
    <i class="ph ph-list btn-group__icon" style="font-size:20px" aria-hidden="true"></i>
    <span class="btn-group__label">List view</span>
  </button>
  <button type="button" class="btn-group__item btn-group__item--selected" aria-pressed="true">
    <i class="ph ph-folder btn-group__icon" style="font-size:20px" aria-hidden="true"></i>
    <span class="btn-group__label">Grid view</span>
  </button>
</div>`,
          'button-group.html',
          'html',
        )}

        <h2 id="default">Default group</h2>
        <p>Segmented control with one selected item; siblings use <code>aria-pressed="false"</code>. Icons sit before labels when you need both.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-bg-demo">${DEFAULT_GROUP}</div>
          </div>
        </div>

        <h2 id="toggle">Toggle (radiogroup)</h2>
        <p>When only one option may be active, prefer <code>role="radiogroup"</code> with <code>role="radio"</code> and <code>aria-checked</code> on items.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-bg-demo">${TOGGLE_GROUP}</div>
          </div>
        </div>

        <h2 id="icon-only">Icon-only group</h2>
        <p>Add <code>.btn-group--icon</code> and a distinct <code>aria-label</code> on each button (search, add, bookmark, home below). The active item uses <code>aria-pressed="true"</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-bg-demo">${ICON_GROUP}</div>
          </div>
        </div>

        <h2 id="behavior">Behavior in your app</h2>
        <p>Copy and adapt <code>docs-site/src/lib/button-group-behavior.ts</code> after PimentCSS CSS is loaded. This site calls <code>wireAllButtonGroups()</code> from <code>doc-client.ts</code> for blocks with <code>data-button-group-live</code>.</p>
        ${pdocSnippet(BUTTON_GROUP_REFERENCE_JS, 'button-group.js', 'javascript')}

        <h2 id="example">Interactive example</h2>
        <p>Click a segment to select it. Arrow Left and Arrow Right move focus and update the single selected item in this live demo.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-bg-demo">${LIVE_GROUP}</div>
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.btn-group</code></td><td>Inline flex container, 1px border, 4px radius</td></tr>
              <tr><td><code>.btn-group--icon</code></td><td>Icon-only items (min-width 42px)</td></tr>
              <tr><td><code>.btn-group__item</code></td><td>Segment button; right divider between items</td></tr>
              <tr><td><code>.btn-group__item--selected</code></td><td>Active segment (primary background)</td></tr>
              <tr><td><code>.btn-group__item--hover</code></td><td>Doc-only hover preview</td></tr>
              <tr><td><code>.btn-group__item--disabled</code></td><td>Disabled look (prefer <code>disabled</code> attribute)</td></tr>
              <tr><td><code>.btn-group__icon</code></td><td>20px icon slot (fills item color)</td></tr>
              <tr><td><code>.btn-group__label</code></td><td>Text label beside icon</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'bg-tokens',
            title: 'Button group spacing',
            body: 'Override padding, gap, and icon size before importing components.',
            code: `@use "pimentcss-design-system" with (
  $btn-group-item-px: 1rem,
  $btn-group-item-py: 0.5rem,
  $btn-group-item-gap: 0.5rem,
  $btn-group-icon-size: 1.25rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'bg-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _button-group.scss or tokens.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Grouped buttons</p>
          <ul>
            <li><strong>Name</strong>, <code>aria-label</code> on <code>.btn-group</code> or <code>aria-labelledby</code> pointing to visible text.</li>
            <li><strong>Single selection</strong>, <code>role="radiogroup"</code> + <code>role="radio"</code> + <code>aria-checked</code>, or <code>role="group"</code> + <code>aria-pressed</code> on a single active item.</li>
            <li><strong>Icon-only</strong>, each button needs <code>aria-label</code>; keep <code>aria-hidden="true"</code> on decorative icons.</li>
            <li><strong>Keyboard</strong>, Tab focuses each segment; Arrow Left/Right should move selection in single-select groups (provide in JS).</li>
            <li><strong>Focus</strong>, <code>:focus-visible</code> outline is built in; do not remove it.</li>
            <li><strong>Disabled</strong>, use <code>disabled</code> or <code>aria-disabled="true"</code> and avoid handlers on inactive items.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Primary, secondary, and ghost actions.</p></a>
          <a class="pdoc-card" href="/docs/link-breadcrumb"><p class="pdoc-card__title">Links &amp; breadcrumb</p><p class="pdoc-card__desc">Text links and trail navigation.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Nav bars and sections.</p></a>
          <a class="pdoc-card" href="/docs/theme-toggle"><p class="pdoc-card__title">Theme toggle</p><p class="pdoc-card__desc">Compact group pattern (light / dark).</p></a>
        </div>`;
}
