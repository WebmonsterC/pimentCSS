import { pdocSnippet, pdocSteps } from './pdoc-html';
import { DROPDOWN_REFERENCE_JS } from './menu-dropdown-behavior';
import { ph } from './icon';

const LABEL_TOOLTIP = `<button type="button" class="label__tooltip focus-visible" aria-label="Help for this field">${ph('info', 16)}</button>`;
const ICON_USER = ph('user-circle', 24, 'menu__item-icon');
const ICON_BOOKMARK = ph('bookmark', 24, 'menu__item-icon');
const ICON_FIELD = ph('user-circle', 24, 'field__icon');
const ICON_CHEVRON = ph('caret-down', 20, 'dropdown__chevron');

type MenuItemOpts = {
  label?: string;
  mods?: string;
  disabled?: boolean;
  selected?: boolean;
  withIcons?: boolean;
  role?: string;
  dataValue?: string;
  dataLabel?: string;
  ariaLabel?: string;
  staticPreview?: boolean;
};

function menuMatrixCell(html: string): string {
  return `<div class="ds-matrix__cell">${html}</div>`;
}

function menuItem(opts: MenuItemOpts = {}): string {
  const label = opts.label ?? 'Placeholder';
  const staticPreview = opts.staticPreview === true;
  const className = [
    'menu__item',
    staticPreview ? '' : 'focus-visible',
    opts.mods,
    opts.selected ? 'menu__item--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const disabled = opts.disabled ? ' disabled' : '';
  const ariaSel =
    opts.selected && opts.role === 'option' ? ' aria-selected="true"' : '';
  const role = opts.role ? ` role="${opts.role}"` : '';
  const dataValue = opts.dataValue ? ` data-value="${opts.dataValue}"` : '';
  const dataLabel = opts.dataLabel ? ` data-label="${opts.dataLabel}"` : '';
  const ariaLabel = opts.ariaLabel ? ` aria-label="${opts.ariaLabel}"` : '';
  const icons = opts.withIcons
    ? `<span class="menu__item-icon" aria-hidden="true">${ICON_USER}</span>
                <span class="menu__item-label">${label}</span>
                <span class="menu__item-icon" aria-hidden="true">${ICON_BOOKMARK}</span>`
    : label;
  return `<button type="button" class="${className}"${role}${ariaSel}${dataValue}${dataLabel}${ariaLabel}${disabled}>${icons}</button>`;
}

function menuList(items: string, opts?: { caret?: '' | 'center' | 'left'; label?: string }): string {
  const caretClass =
    opts?.caret === 'center'
      ? ' menu--caret'
      : opts?.caret === 'left'
        ? ' menu--caret menu--caret-left'
        : '';
  const aria = opts?.label ? ` aria-label="${opts.label}"` : '';
  return `<div class="menu${caretClass}" role="listbox"${aria}>
              <div class="menu__list">
                ${items}
              </div>
            </div>`;
}

const MENU_MATRIX = `<div class="ds-matrix ds-matrix--menu" role="group" aria-label="Menu item states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Hover</div>
            <div class="ds-matrix__head">Disabled</div>

            <div class="ds-matrix__row">Not selected</div>
            ${menuMatrixCell(menuItem({ withIcons: true, staticPreview: true, ariaLabel: 'Placeholder, default' }))}
            ${menuMatrixCell(menuItem({ withIcons: true, staticPreview: true, mods: 'menu__item--hover', ariaLabel: 'Placeholder, hover' }))}
            ${menuMatrixCell(menuItem({ withIcons: true, staticPreview: true, mods: 'menu__item--disabled', disabled: true, ariaLabel: 'Placeholder, disabled' }))}

            <div class="ds-matrix__row">Selected</div>
            ${menuMatrixCell(menuItem({ withIcons: true, staticPreview: true, selected: true, ariaLabel: 'Placeholder, selected' }))}
            ${menuMatrixCell(menuItem({ withIcons: true, staticPreview: true, mods: 'menu__item--hover', selected: true, ariaLabel: 'Placeholder, selected hover' }))}
            ${menuMatrixCell(menuItem({ withIcons: true, staticPreview: true, mods: 'menu__item--disabled', selected: true, disabled: true, ariaLabel: 'Placeholder, selected disabled' }))}
          </div>`;

const MENU_VARIANTS = `<div class="pdoc-menu-demo-row">
            <div class="pdoc-menu-demo-col">
              <p class="body-medium body-medium--semibold pdoc-menu-variant-label">None</p>
              ${menuList(
                [
                  menuItem({ label: 'Option 1', role: 'option' }),
                  menuItem({ label: 'Option 2', role: 'option', selected: true }),
                  menuItem({ label: 'Option 3', role: 'option' }),
                ].join('\n                '),
                { label: 'Simple menu' },
              )}
            </div>
            <div class="pdoc-menu-demo-col">
              <p class="body-medium body-medium--semibold pdoc-menu-variant-label">Dropdown (caret)</p>
              ${menuList(
                [
                  menuItem({ label: 'Option 1', role: 'option' }),
                  menuItem({ label: 'Option 2', role: 'option', selected: true }),
                  menuItem({ label: 'Option 3', role: 'option' }),
                ].join('\n                '),
                { caret: 'center', label: 'Menu with caret' },
              )}
            </div>
            <div class="pdoc-menu-demo-col">
              <p class="body-medium body-medium--semibold pdoc-menu-variant-label">Left (caret)</p>
              ${menuList(
                [
                  menuItem({ label: 'Option 1', role: 'option' }),
                  menuItem({ label: 'Option 2', role: 'option', selected: true }),
                  menuItem({ label: 'Option 3', role: 'option' }),
                ].join('\n                '),
                { caret: 'left', label: 'Menu with left caret' },
              )}
            </div>
          </div>`;

function dropdownBlock(opts: {
  id: string;
  open?: boolean;
  live?: boolean;
  selectedLabel?: string;
  filled?: boolean;
}): string {
  const openClass = opts.open ? ' dropdown--open' : '';
  const liveAttr = opts.live ? ' data-dropdown-live' : '';
  const expanded = opts.open ? 'true' : 'false';
  const panelHidden = opts.open ? '' : ' hidden';
  const valueClass = opts.filled ? ' dropdown__value--filled' : '';
  const valueText = opts.selectedLabel ?? 'Placeholder';
  const selectedIdx = opts.selectedLabel === 'Option 2' ? 1 : -1;
  const listboxId = `${opts.id}-listbox`;

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4']
    .map((label, i) =>
      menuItem({
        label,
        role: 'option',
        dataValue: String(i + 1),
        dataLabel: label,
        selected: opts.open && (selectedIdx >= 0 ? i === selectedIdx : i === 1),
      }),
    )
    .join('\n                    ');

  return `<div class="dropdown${openClass}"${liveAttr} data-pdoc-dropdown="${opts.id}">
              <label class="label" id="${opts.id}-label">
                <span class="label__text">Label</span>
                ${LABEL_TOOLTIP}
              </label>
              <p class="dropdown__hint">Hint</p>
              <button
                type="button"
                class="field dropdown__trigger focus-visible"
                aria-labelledby="${opts.id}-label"
                aria-haspopup="listbox"
                aria-controls="${listboxId}"
                aria-expanded="${expanded}"
                id="${opts.id}-trigger"
              >
                <span class="field__icon" aria-hidden="true">${ICON_FIELD}</span>
                <span class="dropdown__value${valueClass}">${valueText}</span>
                <span class="dropdown__chevron" aria-hidden="true">${ICON_CHEVRON}</span>
              </button>
              <div class="dropdown__panel" role="presentation"${panelHidden}>
                <div class="menu" id="${listboxId}" role="listbox" aria-labelledby="${opts.id}-label">
                  <div class="menu__list">
                    ${options}
                  </div>
                </div>
              </div>
            </div>`;
}

const DROPDOWN_DEMOS = `<div class="pdoc-dropdown-demo-row">
            ${dropdownBlock({ id: 'pdoc-dd-closed' })}
            ${dropdownBlock({ id: 'pdoc-dd-open', open: true, selectedLabel: 'Option 2', filled: true })}
          </div>`;

const DROPDOWN_LIVE = dropdownBlock({ id: 'pdoc-dd-live', live: true });

/** Full Menu & dropdown page. */
export function buildMenuDropdownPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Menu rows need visible labels and a clear <strong>selected</strong> state (<code>aria-selected="true"</code> on <code>role="option"</code>). Dropdown triggers are <code>button</code> elements with <code>aria-expanded</code> and <code>aria-haspopup="listbox"</code>; sync expansion when the panel opens or closes.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p><code>.menu</code> is a bordered list of <code>.menu__item</code> rows (280px max width, scrollable list). Use <code>.menu--caret</code> or <code>.menu--caret-left</code> for popover pointers. <code>.dropdown</code> wraps a field-like trigger, hint, and a floating <code>.dropdown__panel</code> that contains a menu.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Menu</td><td><code>.menu</code></td><td>Listbox container</td></tr>
              <tr><td>List</td><td><code>.menu__list</code></td><td>Scrollable column of items</td></tr>
              <tr><td>Item</td><td><code>.menu__item</code></td><td>Row button or option</td></tr>
              <tr><td>Selected</td><td><code>.menu__item--selected</code></td><td>Active row (action surface)</td></tr>
              <tr><td>Caret</td><td><code>.menu--caret</code></td><td>Centered popover arrow</td></tr>
              <tr><td>Dropdown</td><td><code>.dropdown</code></td><td>Label + trigger + panel</td></tr>
              <tr><td>Trigger</td><td><code>.dropdown__trigger</code></td><td>Opens panel (<code>aria-expanded</code>)</td></tr>
              <tr><td>Panel</td><td><code>.dropdown__panel</code></td><td>Absolute menu host (<code>z-index: 100</code>)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Input fields</strong>, dropdown triggers extend <code>.field</code> (<a href="/docs/input-fields">Input fields</a>).</li>
          <li><strong>Icons</strong>, row icons via <code>ph()</code> (Phosphor in this doc).</li>
          <li><strong>Depth</strong>, panels use <code>box-shadow: var(--shadow-md)</code> (<a href="/docs/depth">Depth &amp; shadows</a>).</li>
        </ul>

        <h2 id="menu-states">Menu item states</h2>
        <p>Rows are <code>&lt;button type="button"&gt;</code> elements. Doc-only <code>.menu__item--hover</code> previews hover; live UIs use <code>:hover</code>. Selected pairs with <code>aria-selected="true"</code>. Disabled rows use the <code>disabled</code> attribute.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${MENU_MATRIX}
          </div>
        </div>

        <h2 id="menu-variants">Menu variants</h2>
        <p>Plain menu, centered caret (<code>.menu--caret</code>), or left-aligned caret (<code>.menu--caret-left</code>). Items can be text-only or include leading and trailing icons.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${MENU_VARIANTS}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="menu" role="listbox" aria-label="Choices">
  <div class="menu__list">
    <button type="button" class="menu__item" role="option">Option 1</button>
    <button type="button" class="menu__item menu__item--selected" role="option" aria-selected="true">Option 2</button>
  </div>
</div>`,
          'menu.html',
          'html',
        )}

        <h2 id="dropdown">Dropdown</h2>
        <p>Closed and open states below are static previews. The live example wires toggle, selection, arrow keys, Home/End, Escape, and outside click (same pattern as the date picker and autocomplete).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-dropdown-demo-wrap">
            ${DROPDOWN_DEMOS}
          </div>
        </div>

        <h2 id="dropdown-live">Interactive dropdown</h2>
        <p>Add <code>data-dropdown-live</code> on <code>.dropdown</code> and call <code>wireAllDropdowns()</code> after load. Copy <code>menu-dropdown-behavior.ts</code> into your app.</p>
        ${pdocSnippet(DROPDOWN_REFERENCE_JS, 'dropdown.js', 'javascript')}
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-dropdown-demo-wrap">
            ${DROPDOWN_LIVE}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.menu</code></td><td>Menu container (border, max 17.5rem)</td></tr>
              <tr><td><code>.menu__list</code></td><td>Scrollable flex column</td></tr>
              <tr><td><code>.menu__item</code></td><td>Row: flex, min-height field, dividers</td></tr>
              <tr><td><code>.menu__item--hover</code></td><td>Doc-only hover preview</td></tr>
              <tr><td><code>.menu__item--selected</code></td><td>Selected row (action colors)</td></tr>
              <tr><td><code>.menu__item--disabled</code></td><td>Disabled row</td></tr>
              <tr><td><code>.menu__item-icon</code></td><td>24px icon slot</td></tr>
              <tr><td><code>.menu__item-label</code></td><td>Flexible label column</td></tr>
              <tr><td><code>.menu--caret</code></td><td>Top-center pointer pseudo-elements</td></tr>
              <tr><td><code>.menu--caret-left</code></td><td>Pointer offset to the left</td></tr>
              <tr><td><code>.dropdown</code></td><td>Vertical stack: label, hint, trigger, panel</td></tr>
              <tr><td><code>.dropdown__hint</code></td><td>Caption under label</td></tr>
              <tr><td><code>.dropdown__trigger</code></td><td>Field-styled opener</td></tr>
              <tr><td><code>.dropdown__value</code></td><td>Trigger label (<code>--filled</code> when set)</td></tr>
              <tr><td><code>.dropdown__chevron</code></td><td>Rotates when open</td></tr>
              <tr><td><code>.dropdown__panel</code></td><td>Hosts <code>.menu</code>, shadow md</td></tr>
              <tr><td><code>.dropdown--open</code></td><td>Shows panel, focus ring on trigger</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'menu-tokens',
            title: 'Menu width and scroll',
            body: 'Override list width, item padding, and max height before importing components.',
            code: `@use "pimentcss-design-system" with (
  $menu-width: 20rem,
  $menu-item-padding-x: 1rem,
  $menu-item-padding-y: 0.5rem,
  $menu-max-height: 18rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'menu-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _menu.scss or _dropdown.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Menus and listboxes</p>
          <ul>
            <li><strong>Listbox</strong>, use <code>role="listbox"</code> on <code>.menu</code> and <code>role="option"</code> on items; label with <code>aria-label</code> or <code>aria-labelledby</code>.</li>
            <li><strong>Selection</strong>, set <code>aria-selected="true"</code> on the active option; do not rely on background color alone.</li>
            <li><strong>Disabled</strong>, use the native <code>disabled</code> attribute on buttons (not click handlers only).</li>
            <li><strong>Dropdown trigger</strong>, use a <code>button</code> with <code>aria-expanded</code> and <code>aria-haspopup="listbox"</code>.</li>
            <li><strong>Keyboard</strong>, Arrow Up/Down, Home/End, Enter, and Escape on the live dropdown; close on outside click for pointer users.</li>
            <li><strong>Values</strong>, use <code>data-label</code> for visible trigger text and <code>data-value</code> for the stored value when they differ.</li>
            <li><strong>Controls</strong>, <code>aria-controls</code> on the trigger must reference the listbox <code>id</code>.</li>
            <li><strong>Focus</strong>, <code>:focus-visible</code> ring is built into <code>.menu__item</code> and the field trigger.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Header bars and nav links.</p></a>
          <a class="pdoc-card" href="/docs/tabs"><p class="pdoc-card__title">Tabs</p><p class="pdoc-card__desc">Tab list for switching views.</p></a>
          <a class="pdoc-card" href="/docs/autocomplete"><p class="pdoc-card__title">Autocomplete</p><p class="pdoc-card__desc">Combobox with menu rows.</p></a>
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Labels and field triggers.</p></a>
        </div>`;
}
