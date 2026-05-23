import { pdocSnippet, pdocSteps } from './pdoc-html';
import { TABLE_REFERENCE_JS } from './table-behavior';
import { ph } from './icon';

const SORT_ICON = ph('arrows-down-up', 20, 'table__icon');
const TABLE_CHECK_ICON = ph('check', 16, 'checkbox__icon checkbox__icon--check');

const TABLE_ITEMS = `<div class="pdoc-table-items-ref">
              <p class="body-small pdoc-text-muted pdoc-table-items-ref__intro">Atomic pieces you combine inside a <code>&lt;td class="table__cell"&gt;</code>. Not a toolbar or a standalone menu.</p>
              <table class="table pdoc-table-items-matrix" aria-label="Table cell content primitives">
                <thead>
                  <tr>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col"><span class="table__text table__text--heading">Type</span></th>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col"><span class="table__text table__text--heading">Markup in a cell</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text">Copy</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__item"><span class="table__text">Body text</span></span></td>
                  </tr>
                  <tr>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text">Heading</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__item"><span class="table__text table__text--heading">Column title</span></span></td>
                  </tr>
                  <tr>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text">Icon &amp; copy</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__item">${SORT_ICON}<span class="table__text table__text--heading">Sortable column</span></span></td>
                  </tr>
                  <tr>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text">Checkbox</span></td>
                    <td class="table__cell table__cell--border-bottom">${tableCheckbox('Select row')}</td>
                  </tr>
                  <tr>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text">Copy underline</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__item"><span class="table__text table__text--underline">Link action</span></span></td>
                  </tr>
                  <tr>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text">Status</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Active</span></span></td>
                  </tr>
                </tbody>
              </table>
            </div>`;

function tableCheckbox(ariaLabel: string): string {
  return `<label class="checkbox table__item">
                <input type="checkbox" class="checkbox__input" aria-label="${ariaLabel}" />
                <span class="checkbox__control" aria-hidden="true">${TABLE_CHECK_ICON}</span>
              </label>`;
}

function tableRow(cells: string[], opts: { mods?: string; selectable?: boolean; selected?: boolean } = {}): string {
  const className = [opts.mods, opts.selected ? 'table__row--selected' : ''].filter(Boolean).join(' ');
  const classAttr = className ? ` class="${className}"` : '';
  const data = opts.selectable ? ' data-table-row data-table-select-row' : '';
  const aria = opts.selected ? ' aria-selected="true"' : '';
  return `<tr${classAttr}${data}${aria}>${cells.map((c) => `<td class="table__cell table__cell--border-bottom">${c}</td>`).join('')}</tr>`;
}

const ROW_TABLE = `<div class="table-scroll pdoc-table-scroll" role="region" tabindex="0" aria-label="Team members" data-table-scroll-hint>
              <table class="table pdoc-table-demo" data-table-live>
                <caption class="sr-only">Team members and roles</caption>
                <thead>
                  <tr>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col">
                      ${tableCheckbox('Select all rows')}
                    </th>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col">
                      <span class="table__item">${SORT_ICON}<span class="table__text table__text--heading">Name</span></span>
                    </th>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col">
                      <span class="table__text table__text--heading">Role</span>
                    </th>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col">
                      <span class="table__text table__text--heading">Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRow(
                    [
                      tableCheckbox('Select Alex Martin'),
                      `<span class="table__text table__text--heading">Alex Martin</span>`,
                      `<span class="table__text table__text--wrap">Product designer</span>`,
                      `<span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Active</span></span>`,
                    ],
                    { selectable: true },
                  )}
                  ${tableRow(
                    [
                      tableCheckbox('Select Samira Chen'),
                      `<span class="table__text table__text--heading">Samira Chen</span>`,
                      `<span class="table__text table__text--wrap">Engineer</span>`,
                      `<span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Active</span></span>`,
                    ],
                    { selectable: true },
                  )}
                  ${tableRow(
                    [
                      tableCheckbox('Select Jordan Lee'),
                      `<span class="table__text table__text--heading">Jordan Lee</span>`,
                      `<span class="table__text table__text--wrap">Content strategist</span>`,
                      `<span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Paused</span></span>`,
                    ],
                    { selectable: true },
                  )}
                </tbody>
              </table>
            </div>
            <p class="pdoc-table-scroll-hint body-small pdoc-text-muted">On phone and tablet, scroll inside the shaded region. The page itself does not scroll sideways.</p>`;

const MOBILE_CARDS = `<div class="pdoc-table-cards" role="list" aria-label="Team members (mobile cards)">
              <article class="pdoc-table-card" role="listitem">
                <header class="pdoc-table-card__head">
                  <span class="table__text table__text--heading">Alex Martin</span>
                  <span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Active</span></span>
                </header>
                <dl class="pdoc-table-card__meta">
                  <div><dt>Role</dt><dd>Product designer</dd></div>
                </dl>
              </article>
              <article class="pdoc-table-card" role="listitem">
                <header class="pdoc-table-card__head">
                  <span class="table__text table__text--heading">Samira Chen</span>
                  <span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Active</span></span>
                </header>
                <dl class="pdoc-table-card__meta">
                  <div><dt>Role</dt><dd>Engineer</dd></div>
                </dl>
              </article>
              <article class="pdoc-table-card" role="listitem">
                <header class="pdoc-table-card__head">
                  <span class="table__text table__text--heading">Jordan Lee</span>
                  <span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Paused</span></span>
                </header>
                <dl class="pdoc-table-card__meta">
                  <div><dt>Role</dt><dd>Content strategist</dd></div>
                </dl>
              </article>
            </div>`;

const RESPONSIVE_BLOCK = `<div class="pdoc-table-responsive pdoc-table-responsive--stack">
              ${ROW_TABLE}
              ${MOBILE_CARDS}
            </div>`;

const COLUMN_LAYOUT = `<div class="table__column pdoc-table-column-demo" role="group" aria-label="Column layout (stacked cells)">
              <div class="table__cell table__cell--heading table__cell--border-bottom">
                <span class="table__text table__text--heading">Metric</span>
              </div>
              <div class="table__cell table__cell--border-bottom">
                <span class="table__text">Revenue</span>
              </div>
              <div class="table__cell table__cell--border-bottom">
                <span class="table__text">Users</span>
              </div>
              <div class="table__cell table__cell--border-bottom">
                <span class="table__status">
                  <span class="table__status-dot" aria-hidden="true"></span>
                  <span class="table__status-label">Healthy</span>
                </span>
              </div>
            </div>`;

const ROW_STATES = `<table class="table pdoc-table-states" aria-label="Row state reference">
              <thead>
                <tr>
                  <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col"><span class="table__text table__text--heading">State</span></th>
                  <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col"><span class="table__text table__text--heading">Example</span></th>
                </tr>
              </thead>
              <tbody>
                <tr><td class="table__cell table__cell--border-bottom"><span class="table__text">Default</span></td><td class="table__cell table__cell--border-bottom"><span class="table__text">Normal row</span></td></tr>
                <tr class="table__row--hover"><td class="table__cell table__cell--border-bottom"><span class="table__text">Hover</span></td><td class="table__cell table__cell--border-bottom"><span class="table__text">table__row--hover or tr:hover</span></td></tr>
                <tr class="table__row--selected" aria-selected="true"><td class="table__cell table__cell--border-bottom"><span class="table__text">Selected</span></td><td class="table__cell table__cell--border-bottom"><span class="table__text">table__row--selected</span></td></tr>
              </tbody>
            </table>`;

export function buildTablePageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_table.scss</code>. PimentCSS styles semantic <code>&lt;table&gt;</code> markup; on narrow screens, pair it with a scroll container or an alternate list layout.</p>

        <h2 id="responsive">Responsive strategy (phone / tablet)</h2>
        <div class="pdoc-callout pdoc-callout--tip">
          <p class="pdoc-callout__title">Recommended patterns</p>
          <ul>
            <li><strong>Row tables (many columns)</strong>, wrap with <code>.table-scroll</code> so overflow stays inside a labeled region. Users swipe horizontally; the page does not.</li>
            <li><strong>Long text</strong>, add <code>.table__text--wrap</code> on cells that may wrap; keep sort labels and numbers in <code>nowrap</code> (default) when alignment matters.</li>
            <li><strong>Very small screens</strong>, consider a card/list view (same data, no horizontal scroll) for critical flows such as checkout or profile.</li>
            <li><strong>Column metrics</strong>, use <code>.table__column</code> when each column is a vertical stack (dashboards), not a classic data grid.</li>
          </ul>
        </div>

        <h2 id="table-responsive-demo">Row table + mobile cards</h2>
        <p>From <code>min-width: 48rem</code> you see the full table inside <code>.table-scroll</code> (checkbox, Name, Role, Status). Below that breakpoint, the same dataset is shown as <strong>cards</strong> (doc pattern) so nothing is crushed. Click a row to toggle selection (<code>data-table-live</code>); hover and selected row styles are documented in <a href="#table-row-states">Row states</a>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-table-demo-wrap">
            ${RESPONSIVE_BLOCK}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="table-scroll" role="region" tabindex="0" aria-label="Team members">
  <table class="table">
    <caption class="sr-only">…</caption>
    <thead>…</thead>
    <tbody>…</tbody>
  </table>
</div>`,
          'table-scroll.html',
          'html',
        )}

        <h2 id="table-items">Cell content primitives</h2>
        <p>Small pieces that can appear <em>inside</em> a cell: text, icon, checkbox, status dot, and so on. Place them in <code>&lt;td class="table__cell"&gt;</code>, usually wrapped in <code>.table__item</code> when you need icon and label on one line (left-aligned). The live table above already combines several of them (checkbox + heading + status).</p>
        <div class="pdoc-callout pdoc-callout--info">
          <p class="pdoc-callout__title">Not a WYSIWYG toolbar</p>
          <p>Documentation only: one row per primitive, with the markup you would put in a real cell.</p>
        </div>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TABLE_ITEMS}
          </div>
        </div>
        ${pdocSnippet(
          `<td class="table__cell table__cell--border-bottom">
  <span class="table__item">
    <i class="ph ph-arrows-down-up table__icon" style="font-size:20px" aria-hidden="true"></i>
    <span class="table__text table__text--heading">Name</span>
  </span>
</td>`,
          'table-cell-item.html',
          'html',
        )}

        <h2 id="table-row-states">Row states</h2>
        <p>Hover uses <code>tr:hover</code> or <code>.table__row--hover</code>. Selection uses <code>.table__row--selected</code> with <code>aria-selected="true"</code> on interactive rows.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ROW_STATES}
          </div>
        </div>

        <h2 id="table-column">Column layout</h2>
        <p class="pdoc-text-muted"><code>.table__column</code> stacks cells vertically for KPI-style columns, not a horizontal grid.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${COLUMN_LAYOUT}
          </div>
        </div>

        <h2 id="table-live">JavaScript</h2>
        <p><code>data-table-live</code> on the <code>&lt;table&gt;</code> enables click-to-select rows. <code>.table-scroll[data-table-scroll-hint]</code> adds a focus hint for keyboard users. Call <code>wireAllTables()</code> after load.</p>
        ${pdocSnippet(TABLE_REFERENCE_JS, 'table.js', 'javascript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.table</code></td><td>Semantic table (collapse borders, 100% width in scroll region)</td></tr>
              <tr><td><code>.table-scroll</code></td><td>Horizontal scroll region for row layouts on narrow viewports</td></tr>
              <tr><td><code>.table__cell</code></td><td>Cell padding and background</td></tr>
              <tr><td><code>.table__cell--heading</code></td><td>Header cell surface</td></tr>
              <tr><td><code>.table__cell--border-bottom</code></td><td>Bottom border between rows</td></tr>
              <tr><td><code>.table__cell--border-full</code></td><td>Full grid borders</td></tr>
              <tr><td><code>.table__row--hover</code></td><td>Hover row background</td></tr>
              <tr><td><code>.table__row--selected</code></td><td>Selected row (action surface)</td></tr>
              <tr><td><code>.table__text--wrap</code></td><td>Allow wrapping inside scroll regions</td></tr>
              <tr><td><code>.table__column</code></td><td>Vertical stack of cells (column layout)</td></tr>
              <tr><td><code>.pdoc-table-cards</code></td><td>Doc-only mobile card list pattern</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'table-tokens',
            title: 'Table spacing',
            body: 'Override cell padding and compact checkbox size in cells.',
            code: `@use "pimentcss" with (
  $table-cell-padding-x: 1rem,
  $table-cell-padding-y: 0.75rem,
  $table-icon-size: 1.25rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'table-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _table.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Tables on small screens</p>
          <ul>
            <li><strong>Captions</strong>, use <code>&lt;caption class="sr-only"&gt;</code> or visible caption; associate headers with <code>scope="col"</code> / <code>scope="row"</code>.</li>
            <li><strong>Scroll region</strong>, <code>.table-scroll</code> needs <code>role="region"</code>, <code>tabindex="0"</code>, and <code>aria-label</code> describing the dataset.</li>
            <li><strong>Selection</strong>, for clickable rows use <code>aria-selected</code> and a clear focus style; prefer checkboxes when multi-select.</li>
            <li><strong>Do not rely on hover alone</strong>, provide text labels and visible status dots with text.</li>
            <li><strong>Mobile alternative</strong>, when cards replace the table, keep the same heading order and expose all column values in the card body.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/carousel"><p class="pdoc-card__title">Carousel</p><p class="pdoc-card__desc">Horizontal controls for slides.</p></a>
          <a class="pdoc-card" href="/docs/pagination"><p class="pdoc-card__title">Pagination</p><p class="pdoc-card__desc">Paging long tabular results.</p></a>
          <a class="pdoc-card" href="/docs/list"><p class="pdoc-card__title">Lists</p><p class="pdoc-card__desc">Simple vertical lists when a table is overkill.</p></a>
          <a class="pdoc-card" href="/docs/form"><p class="pdoc-card__title">Form</p><p class="pdoc-card__desc">Filters above data tables.</p></a>
        </div>`;
}
