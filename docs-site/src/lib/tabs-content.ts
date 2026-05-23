import { pdocSnippet, pdocSteps } from './pdoc-html';
import { TABS_REFERENCE_JS } from './tabs-behavior';
import { ph } from './icon';

const TAB_ICON = ph('house', 20, 'tab__icon');

type TabItemOpts = {
  label?: string;
  mods?: string;
  selected?: boolean;
  disabled?: boolean;
  withIcon?: boolean;
  role?: string;
  ariaLabel?: string;
  id?: string;
  controls?: string;
  tabindex?: string;
  /** Matrix preview only (no tablist ARIA). */
  staticPreview?: boolean;
};

function tabItem(opts: TabItemOpts = {}): string {
  const label = opts.label ?? 'Tab item';
  const className = ['tab', opts.mods, opts.selected ? 'tab--selected' : ''].filter(Boolean).join(' ');
  const disabled = opts.disabled ? ' disabled' : '';
  const staticPreview = opts.staticPreview === true;
  const role = !staticPreview && opts.role ? ` role="${opts.role}"` : '';
  const ariaSel = staticPreview
    ? ''
    : opts.selected
      ? ' aria-selected="true"'
      : opts.role === 'tab'
        ? ' aria-selected="false"'
        : '';
  const ariaLabel = opts.ariaLabel ? ` aria-label="${opts.ariaLabel}"` : '';
  const id = !staticPreview && opts.id ? ` id="${opts.id}"` : '';
  const controls = !staticPreview && opts.controls ? ` aria-controls="${opts.controls}"` : '';
  const tabindex = !staticPreview && opts.tabindex !== undefined ? ` tabindex="${opts.tabindex}"` : '';
  const icon = opts.withIcon ? TAB_ICON : '';
  const inner = icon
    ? `${icon}<span class="tab__label">${label}</span>`
    : `<span class="tab__label">${label}</span>`;
  return `<button type="button" class="${className}"${role}${id}${controls}${ariaSel}${tabindex}${ariaLabel}${disabled}>${inner}</button>`;
}

function matrixCell(tabHtml: string): string {
  return `<div class="ds-matrix__cell">${tabHtml}</div>`;
}

function matrixRow(
  rowLabel: string,
  cells: { mods?: string; selected?: boolean; disabled?: boolean; withIcon?: boolean; ariaLabel: string }[],
): string {
  return `<div class="ds-matrix__row">${rowLabel}</div>
            ${cells
              .map((c) =>
                matrixCell(
                  tabItem({
                    mods: c.mods,
                    selected: c.selected,
                    disabled: c.disabled,
                    withIcon: c.withIcon,
                    staticPreview: true,
                    ariaLabel: c.ariaLabel,
                  }),
                ),
              )
              .join('\n            ')}`;
}

const TAB_MATRIX = `<div class="ds-matrix ds-matrix--tabs" role="group" aria-label="Tab item states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Focus</div>
            <div class="ds-matrix__head">Hover</div>
            <div class="ds-matrix__head">Disabled</div>
            ${matrixRow('Unselected', [
              { withIcon: true, ariaLabel: 'Tab item, default' },
              { mods: 'tab--focus', ariaLabel: 'Tab item, focus' },
              { mods: 'tab--hover', ariaLabel: 'Tab item, hover' },
              { disabled: true, ariaLabel: 'Tab item, disabled' },
            ])}
            ${matrixRow('Selected', [
              { selected: true, ariaLabel: 'Tab item, selected default' },
              { selected: true, mods: 'tab--focus', ariaLabel: 'Tab item, selected focus' },
              { selected: true, mods: 'tab--hover', ariaLabel: 'Tab item, selected hover' },
              { selected: true, disabled: true, ariaLabel: 'Tab item, selected disabled' },
            ])}
          </div>`;

function tabBar(
  tabs: TabItemOpts[],
  opts: { ariaLabel: string; panelHtml: string; activeIndex?: number },
): string {
  const active = opts.activeIndex ?? 0;
  const tabButtons = tabs
    .map((t, i) => {
      const selected = i === active;
      return tabItem({
        ...t,
        role: 'tab',
        selected,
        tabindex: selected ? '0' : '-1',
        id: t.id ?? `pdoc-tab-${i + 1}`,
        controls: t.controls ?? `pdoc-panel-${i + 1}`,
      });
    })
    .join('\n                ');

  const panels = tabs
    .map((t, i) => {
      const id = t.controls ?? `pdoc-panel-${i + 1}`;
      const tabId = t.id ?? `pdoc-tab-${i + 1}`;
      const hidden = i !== active ? ' hidden' : '';
      const body =
        t.label === 'Settings'
          ? '<p class="body-medium">Settings panel (placeholder).</p>'
          : `<p class="body-medium">Content for <strong>${t.label ?? 'Tab'}</strong>. Link panels with <code>aria-controls</code> and <code>aria-labelledby</code>.</p>`;
      return `<div id="${id}" class="tab-panel" role="tabpanel" aria-labelledby="${tabId}" tabindex="0"${hidden}>
              ${body}
            </div>`;
    })
    .join('\n            ');

  return `<div class="tabs pdoc-tabs-demo">
              <div class="tabs__list" role="tablist" aria-label="${opts.ariaLabel}">
                ${tabButtons}
              </div>
              <hr class="tabs__separator" />
              ${panels}
            </div>`;
}

const TAB_BAR_TEXT = tabBar(
  [
    { label: 'General' },
    { label: 'Details' },
    { label: 'History' },
    { label: 'Settings' },
  ],
  { ariaLabel: 'Sections', activeIndex: 1 },
);

const TAB_BAR_ICONS = tabBar(
  [
    { label: 'General', withIcon: true, id: 'pdoc-tab-icon-1', controls: 'pdoc-panel-icon-1' },
    { label: 'Details', withIcon: true, id: 'pdoc-tab-icon-2', controls: 'pdoc-panel-icon-2' },
    { label: 'History', id: 'pdoc-tab-icon-3', controls: 'pdoc-panel-icon-3' },
    { label: 'Settings', id: 'pdoc-tab-icon-4', controls: 'pdoc-panel-icon-4' },
  ],
  { ariaLabel: 'Sections with icons', activeIndex: 1 },
);

const TAB_BAR_LIVE = `<div class="tabs pdoc-tabs-demo" data-tabs-live>
              <div class="tabs__list" role="tablist" aria-label="Account sections">
                ${tabItem({
                  label: 'Overview',
                  role: 'tab',
                  selected: true,
                  tabindex: '0',
                  id: 'pdoc-tab-live-1',
                  controls: 'pdoc-panel-live-1',
                })}
                ${tabItem({
                  label: 'Billing',
                  role: 'tab',
                  tabindex: '-1',
                  id: 'pdoc-tab-live-2',
                  controls: 'pdoc-panel-live-2',
                })}
                ${tabItem({
                  label: 'Team',
                  role: 'tab',
                  tabindex: '-1',
                  id: 'pdoc-tab-live-3',
                  controls: 'pdoc-panel-live-3',
                })}
                ${tabItem({
                  label: 'Security',
                  role: 'tab',
                  tabindex: '-1',
                  id: 'pdoc-tab-live-4',
                  controls: 'pdoc-panel-live-4',
                  disabled: true,
                })}
              </div>
              <hr class="tabs__separator" />
              <div id="pdoc-panel-live-1" class="tab-panel" role="tabpanel" aria-labelledby="pdoc-tab-live-1" tabindex="0">
                <p class="body-medium">Overview: summary cards and recent activity.</p>
              </div>
              <div id="pdoc-panel-live-2" class="tab-panel" role="tabpanel" aria-labelledby="pdoc-tab-live-2" tabindex="0" hidden>
                <p class="body-medium">Billing: invoices and payment methods.</p>
              </div>
              <div id="pdoc-panel-live-3" class="tab-panel" role="tabpanel" aria-labelledby="pdoc-tab-live-3" tabindex="0" hidden>
                <p class="body-medium">Team: members and roles.</p>
              </div>
              <div id="pdoc-panel-live-4" class="tab-panel" role="tabpanel" aria-labelledby="pdoc-tab-live-4" tabindex="0" hidden>
                <p class="body-medium">Security panel (disabled tab cannot be opened).</p>
              </div>
            </div>`;

export function buildTabsPageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_tab.scss</code>. Tabbed sections switch panels with keyboard support and WAI-ARIA tab semantics.</p>

        <h2 id="anatomy">Anatomy</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Bar</td><td><code>.tabs</code></td><td>Column stack: list + separator + panels</td></tr>
              <tr><td>List</td><td><code>.tabs__list</code></td><td>Flex row of tab buttons (<code>role="tablist"</code>)</td></tr>
              <tr><td>Separator</td><td><code>.tabs__separator</code></td><td>Full-width rule under the list</td></tr>
              <tr><td>Item</td><td><code>.tab</code></td><td><code>role="tab"</code>, bottom indicator when selected</td></tr>
              <tr><td>Icon</td><td><code>.tab__icon</code></td><td>Optional 20px icon (<code>aria-hidden</code>)</td></tr>
              <tr><td>Label</td><td><code>.tab__label</code></td><td>Visible tab text</td></tr>
              <tr><td>Panel</td><td><code>.tab-panel</code></td><td><code>role="tabpanel"</code>, linked via <code>aria-labelledby</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Icons</strong>, optional tab icons via <code>ph()</code> (Phosphor in this doc).</li>
          <li><strong>Typography</strong>, labels use body medium tokens (<a href="/docs/typography">Typography</a>).</li>
        </ul>

        <h2 id="tab-states">Tab item states</h2>
        <p>Matrix previews are static buttons (no tablist roles) so they do not compete with live tablists. Doc-only <code>.tab--hover</code> and <code>.tab--focus</code> preview states; production uses <code>:hover</code> and <code>:focus-visible</code>. Selected pairs with <code>.tab--selected</code> or <code>aria-selected="true"</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TAB_MATRIX}
          </div>
        </div>

        <h2 id="tab-bar">Tab bar (static)</h2>
        <p>Text-only tabs with one visible panel. The selected tab uses <code>tabindex="0"</code>; others use <code>-1</code> until focus moves in a live bar.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-tabs-demo-wrap">
            ${TAB_BAR_TEXT}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="tabs">
  <div class="tabs__list" role="tablist" aria-label="Sections">
    <button type="button" class="tab" role="tab" id="tab-a" aria-selected="false" aria-controls="panel-a" tabindex="-1">
      <span class="tab__label">General</span>
    </button>
    <button type="button" class="tab tab--selected" role="tab" id="tab-b" aria-selected="true" aria-controls="panel-b" tabindex="0">
      <span class="tab__label">Details</span>
    </button>
  </div>
  <hr class="tabs__separator" />
  <div id="panel-b" class="tab-panel" role="tabpanel" aria-labelledby="tab-b" tabindex="0">…</div>
</div>`,
          'tabs.html',
          'html',
        )}

        <h2 id="tab-bar-icons">Tab bar with icons</h2>
        <p>Icons are decorative; keep <code>aria-hidden="true"</code> on the icon element and put the name in <code>.tab__label</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-tabs-demo-wrap">
            ${TAB_BAR_ICONS}
          </div>
        </div>

        <h2 id="tab-bar-live">Interactive tab bar</h2>
        <p>Add <code>data-tabs-live</code> on <code>.tabs</code> and call <code>wireAllTabs()</code> after load. Arrow Left/Right (and Up/Down), Home, End, and click update selection and panels.</p>
        ${pdocSnippet(TABS_REFERENCE_JS, 'tabs.js', 'javascript')}
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-tabs-demo-wrap">
            ${TAB_BAR_LIVE}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.tabs</code></td><td>Tab bar container (column, full width)</td></tr>
              <tr><td><code>.tabs__list</code></td><td>Horizontal flex list of tabs</td></tr>
              <tr><td><code>.tabs__separator</code></td><td>Border-top rule under the list</td></tr>
              <tr><td><code>.tab</code></td><td>Tab button: min-height 50px, bottom indicator</td></tr>
              <tr><td><code>.tab--selected</code></td><td>Selected tab (semibold, action border)</td></tr>
              <tr><td><code>.tab--hover</code></td><td>Doc-only hover preview</td></tr>
              <tr><td><code>.tab--focus</code></td><td>Doc-only focus ring preview</td></tr>
              <tr><td><code>.tab--disabled</code></td><td>Doc-only disabled preview (prefer <code>disabled</code>)</td></tr>
              <tr><td><code>.tab__icon</code></td><td>20px icon slot</td></tr>
              <tr><td><code>.tab__label</code></td><td>Tab label text</td></tr>
              <tr><td><code>.tab-panel</code></td><td>Panel content; use <code>hidden</code> when inactive</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'tab-tokens',
            title: 'Tab sizing',
            body: 'Override padding, list gap, indicator width, and min height before importing components.',
            code: `@use "pimentcss" with (
  $tab-item-px: 1rem,
  $tab-item-py: 0.75rem,
  $tab-list-gap: 0.75rem,
  $tab-min-height: 3.125rem,
  $tab-indicator-width: 0.25rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'tab-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _tab.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Tablist pattern</p>
          <ul>
            <li><strong>Roles</strong>, <code>role="tablist"</code> on the list container, <code>role="tab"</code> on each tab, <code>role="tabpanel"</code> on each panel.</li>
            <li><strong>Selection</strong>, set <code>aria-selected="true"</code> on the active tab only; pair with <code>.tab--selected</code> for visuals.</li>
            <li><strong>Linkage</strong>, each tab needs a unique <code>id</code>, <code>aria-controls</code> pointing to its panel <code>id</code>, and panels use <code>aria-labelledby</code> back to the tab.</li>
            <li><strong>Roving tabindex</strong>, active tab <code>tabindex="0"</code>, others <code>-1</code>; move focus with arrow keys in the live example.</li>
            <li><strong>Panels</strong>, hide inactive panels with the <code>hidden</code> attribute (and optionally <code>aria-hidden="true"</code> when wired).</li>
            <li><strong>Disabled</strong>, use the native <code>disabled</code> attribute on tab buttons.</li>
            <li><strong>Keyboard</strong>, Arrow Left/Right (and Up/Down), Home, End on the live tab bar; Enter/Space activate on click.</li>
            <li><strong>Focus</strong>, <code>:focus-visible</code> outline is built into <code>.tab</code>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/menu-dropdown"><p class="pdoc-card__title">Menu &amp; dropdown</p><p class="pdoc-card__desc">Listbox rows and field triggers.</p></a>
          <a class="pdoc-card" href="/docs/pagination"><p class="pdoc-card__title">Pagination</p><p class="pdoc-card__desc">Page controls for long lists.</p></a>
          <a class="pdoc-card" href="/docs/button-group"><p class="pdoc-card__title">Button group</p><p class="pdoc-card__desc">Segmented controls without panels.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Header bars and nav links.</p></a>
        </div>`;
}
