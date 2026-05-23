import { pdocSnippet, pdocSteps } from './pdoc-html';
import { PAGINATION_REFERENCE_JS } from './pagination-behavior';
import { ph } from './icon';

const ARROW_ICON = ph('arrow-right', 24, 'pagination__item-icon');

type PagItemOpts = {
  label?: string;
  mods?: string;
  prev?: boolean;
  next?: boolean;
  selected?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaCurrent?: boolean;
};

function pagItem(opts: PagItemOpts = {}): string {
  const label = opts.label ?? '';
  const className = [
    'pagination__item',
    opts.prev ? 'pagination__item--prev' : '',
    opts.next ? 'pagination__item--next' : '',
    opts.mods,
    opts.selected ? 'pagination__item--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const disabled = opts.disabled ? ' disabled' : '';
  const ariaLabel = opts.ariaLabel ? ` aria-label="${opts.ariaLabel}"` : '';
  const ariaCurrent = opts.ariaCurrent || opts.selected ? ' aria-current="page"' : '';
  const icon = !label ? ARROW_ICON : '';
  const inner = label ? label : icon;
  return `<button type="button" class="${className}"${ariaLabel}${ariaCurrent}${disabled}>${inner}</button>`;
}

function matrixCell(html: string): string {
  return `<div class="ds-matrix__cell">${html}</div>`;
}

function matrixRow(
  rowLabel: string,
  cells: PagItemOpts[],
): string {
  return `<div class="ds-matrix__row">${rowLabel}</div>
            ${cells
              .map((c) =>
                matrixCell(
                  pagItem({
                    ...c,
                    ariaLabel: c.ariaLabel ?? `${rowLabel}, ${c.label ? 'page ' + c.label : 'control'}`,
                  }),
                ),
              )
              .join('\n            ')}`;
}

const PAG_MATRIX = `<div class="ds-matrix ds-matrix--pagination" role="group" aria-label="Pagination item states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Focus</div>
            <div class="ds-matrix__head">Hover</div>
            <div class="ds-matrix__head">Disabled</div>
            ${matrixRow('Next', [
              { next: true, ariaLabel: 'Next page, default' },
              { next: true, mods: 'pagination__item--focus', ariaLabel: 'Next page, focus' },
              { next: true, mods: 'pagination__item--hover', ariaLabel: 'Next page, hover' },
              { next: true, disabled: true, ariaLabel: 'Next page, disabled' },
            ])}
            ${matrixRow('Previous', [
              { prev: true, ariaLabel: 'Previous page, default' },
              { prev: true, mods: 'pagination__item--focus', ariaLabel: 'Previous page, focus' },
              { prev: true, mods: 'pagination__item--hover', ariaLabel: 'Previous page, hover' },
              { prev: true, disabled: true, ariaLabel: 'Previous page, disabled' },
            ])}
            ${matrixRow('Overflow', [
              { ariaLabel: 'More pages, default' },
              { mods: 'pagination__item--focus', ariaLabel: 'More pages, focus' },
              { mods: 'pagination__item--hover', ariaLabel: 'More pages, hover' },
              { disabled: true, ariaLabel: 'More pages, disabled' },
            ])}
            ${matrixRow('Numeric', [
              { label: '2', ariaLabel: 'Page 2, default' },
              { label: '2', mods: 'pagination__item--focus', ariaLabel: 'Page 2, focus' },
              { label: '2', mods: 'pagination__item--hover', ariaLabel: 'Page 2, hover' },
              { label: '2', disabled: true, ariaLabel: 'Page 2, disabled' },
            ])}
            ${matrixRow('Selected', [
              { label: '1', selected: true, ariaLabel: 'Page 1, selected' },
              { label: '1', selected: true, mods: 'pagination__item--focus', ariaLabel: 'Page 1, selected focus' },
              { label: '1', selected: true, mods: 'pagination__item--hover', ariaLabel: 'Page 1, selected hover' },
              { label: '1', selected: true, disabled: true, ariaLabel: 'Page 1, selected disabled' },
            ])}
          </div>`;

const PAG_DEFAULT = `<nav class="pagination pdoc-pagination-demo" aria-label="Results pagination">
              <div class="pagination__group">
                <button type="button" class="pagination__item pagination__item--prev" aria-label="Previous page">
                  ${ARROW_ICON}
                </button>
                <div class="pagination__jumper">
                  <label class="sr-only" for="pdoc-pag-jump">Page number</label>
                  <input id="pdoc-pag-jump" type="text" class="pagination__jumper-field" value="2" inputmode="numeric" aria-label="Current page" />
                  <span class="pagination__jumper-suffix">of 20 pages</span>
                </div>
                <button type="button" class="pagination__item pagination__item--next" aria-label="Next page">
                  ${ARROW_ICON}
                </button>
              </div>
            </nav>`;

const PAG_JUMPER_LIST = `<nav class="pagination pdoc-pagination-demo" aria-label="Numbered pagination">
              <div class="pagination__group">
                <ul class="pagination__list">
                  <li>
                    <button type="button" class="pagination__item pagination__item--prev" aria-label="Previous page">
                      ${ARROW_ICON}
                    </button>
                  </li>
                  <li><button type="button" class="pagination__item pagination__item--selected" aria-current="page">1</button></li>
                  <li><button type="button" class="pagination__item">2</button></li>
                  <li><button type="button" class="pagination__item">3</button></li>
                  <li>
                    <button type="button" class="pagination__item pagination__item--next" aria-label="Next page">
                      ${ARROW_ICON}
                    </button>
                  </li>
                </ul>
              </div>
            </nav>`;

const PAG_JUMPER_LIVE = `<nav class="pagination pdoc-pagination-demo" data-pagination-live aria-label="Numbered pagination (live)">
              <div class="pagination__group">
                <ul class="pagination__list">
                  <li>
                    <button type="button" class="pagination__item pagination__item--prev" aria-label="Previous page">
                      ${ARROW_ICON}
                    </button>
                  </li>
                  <li><button type="button" class="pagination__item pagination__item--selected" aria-current="page">1</button></li>
                  <li><button type="button" class="pagination__item">2</button></li>
                  <li><button type="button" class="pagination__item">3</button></li>
                  <li><button type="button" class="pagination__item">4</button></li>
                  <li>
                    <button type="button" class="pagination__item pagination__item--next" aria-label="Next page">
                      ${ARROW_ICON}
                    </button>
                  </li>
                </ul>
              </div>
            </nav>`;

const PAG_DEFAULT_LIVE = `<nav class="pagination pdoc-pagination-demo" data-pagination-live data-pagination-max="20" aria-label="Page jump (live)">
              <div class="pagination__group">
                <button type="button" class="pagination__item pagination__item--prev" aria-label="Previous page">
                  ${ARROW_ICON}
                </button>
                <div class="pagination__jumper">
                  <label class="sr-only" for="pdoc-pag-jump-live">Page number</label>
                  <input id="pdoc-pag-jump-live" type="text" class="pagination__jumper-field" value="2" inputmode="numeric" aria-label="Current page" />
                  <span class="pagination__jumper-suffix">of 20 pages</span>
                </div>
                <button type="button" class="pagination__item pagination__item--next" aria-label="Next page">
                  ${ARROW_ICON}
                </button>
              </div>
            </nav>`;

const PAG_WITH_RESULTS = `<nav class="pagination pdoc-pagination-demo pdoc-pagination-demo--wide" aria-label="Pagination with results per page">
              <div class="pagination__group">
                <button type="button" class="pagination__item pagination__item--prev" aria-label="Previous page">
                  ${ARROW_ICON}
                </button>
                <div class="pagination__jumper">
                  <label class="sr-only" for="pdoc-pag-rpp-jump">Page number</label>
                  <input id="pdoc-pag-rpp-jump" type="text" class="pagination__jumper-field" value="2" inputmode="numeric" aria-label="Current page" />
                  <span class="pagination__jumper-suffix">of 20 pages</span>
                </div>
                <button type="button" class="pagination__item pagination__item--next" aria-label="Next page">
                  ${ARROW_ICON}
                </button>
              </div>
              <div class="pagination__results">
                <span class="pagination__results-label">Results per page</span>
                <label class="sr-only" for="pdoc-pag-rpp">Results per page</label>
                <div class="pagination__results-select-wrap">
                  <select id="pdoc-pag-rpp" class="pagination__results-select" aria-label="Results per page">
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
              </div>
            </nav>`;

export function buildPaginationPageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_pagination.scss</code>. Pagination patterns for lists and tables: page links, jumpers, and arrow navigation.</p>

        <h2 id="anatomy">Anatomy</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Bar</td><td><code>.pagination</code></td><td><code>&lt;nav&gt;</code> with <code>aria-label</code></td></tr>
              <tr><td>Group</td><td><code>.pagination__group</code></td><td>Flex row: arrows, jumper, or list</td></tr>
              <tr><td>List</td><td><code>.pagination__list</code></td><td><code>&lt;ul&gt;</code> of page buttons (jumper variant)</td></tr>
              <tr><td>Item</td><td><code>.pagination__item</code></td><td>44×44px button; <code>--prev</code> / <code>--next</code> flip the arrow icon</td></tr>
              <tr><td>Icon</td><td><code>.pagination__item-icon</code></td><td>24px arrow (<code>aria-hidden</code> when labeled)</td></tr>
              <tr><td>Jumper</td><td><code>.pagination__jumper</code></td><td>Page field + <code>.pagination__jumper-suffix</code></td></tr>
              <tr><td>Results</td><td><code>.pagination__results</code></td><td>Optional select block (12px gap from group)</td></tr>
              <tr><td>Select wrap</td><td><code>.pagination__results-select-wrap</code></td><td>Chevron overlay (<code>currentColor</code>, theme-aware)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Icons</strong>, arrows via <code>ph()</code> (Phosphor in this doc).</li>
          <li><strong>Screen reader text</strong>, use <code>.sr-only</code> for visually hidden labels on inputs.</li>
        </ul>

        <h2 id="pag-states">Pagination item states</h2>
        <p>Matrix previews use static buttons. Doc-only <code>.pagination__item--hover</code> and <code>.pagination__item--focus</code> show states; production uses <code>:hover</code> and <code>:focus-visible</code>. Selected uses <code>.pagination__item--selected</code> and <code>aria-current="page"</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${PAG_MATRIX}
          </div>
        </div>

        <h2 id="pag-default">Default (page jump)</h2>
        <p>Previous and next arrows flank a centered page field. Label the field with <code>.sr-only</code> or <code>aria-label</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-pagination-demo-wrap">
            ${PAG_DEFAULT}
          </div>
        </div>

        <h2 id="pag-jumper">Jumper (numbered list)</h2>
        <p>Page numbers live in <code>.pagination__list</code> inside <code>&lt;li&gt;</code> elements. Wrap prev/next in list items for even spacing.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-pagination-demo-wrap">
            ${PAG_JUMPER_LIST}
          </div>
        </div>
        ${pdocSnippet(
          `<nav class="pagination" aria-label="Results">
  <div class="pagination__group">
    <button type="button" class="pagination__item pagination__item--prev" aria-label="Previous page">…</button>
    <ul class="pagination__list">
      <li><button type="button" class="pagination__item pagination__item--selected" aria-current="page">1</button></li>
      <li><button type="button" class="pagination__item">2</button></li>
    </ul>
    <button type="button" class="pagination__item pagination__item--next" aria-label="Next page">…</button>
  </div>
</nav>`,
          'pagination.html',
          'html',
        )}

        <h2 id="pag-live">Interactive examples</h2>
        <p>Add <code>data-pagination-live</code> on <code>.pagination</code> and call <code>wireAllPaginations()</code> after load. Numbered lists update <code>aria-current</code>; the default jumper wires prev/next to the field.</p>
        ${pdocSnippet(PAGINATION_REFERENCE_JS, 'pagination.js', 'javascript')}
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-pagination-demo-wrap">
            ${PAG_JUMPER_LIVE}
          </div>
        </div>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-pagination-demo-wrap">
            ${PAG_DEFAULT_LIVE}
          </div>
        </div>

        <h2 id="pag-results">With results per page</h2>
        <p class="pdoc-text-muted">Optional block to the right of the group (12px gap). Pair with a labeled <code>select</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-pagination-demo-wrap pdoc-pagination-demo-wrap--wide">
            ${PAG_WITH_RESULTS}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.pagination</code></td><td>Nav container (flex, wrap, gap 8px)</td></tr>
              <tr><td><code>.pagination__group</code></td><td>Primary control cluster</td></tr>
              <tr><td><code>.pagination__list</code></td><td>Horizontal list of page buttons</td></tr>
              <tr><td><code>.pagination__item</code></td><td>44×44px control (action colors)</td></tr>
              <tr><td><code>.pagination__item--prev</code></td><td>Flips arrow icon (scaleX -1)</td></tr>
              <tr><td><code>.pagination__item--next</code></td><td>Arrow points right</td></tr>
              <tr><td><code>.pagination__item--selected</code></td><td>Current page (filled action surface)</td></tr>
              <tr><td><code>.pagination__item--hover</code></td><td>Doc-only hover preview</td></tr>
              <tr><td><code>.pagination__item--focus</code></td><td>Doc-only focus ring preview</td></tr>
              <tr><td><code>.pagination__item-icon</code></td><td>24px icon slot</td></tr>
              <tr><td><code>.pagination__jumper</code></td><td>Field + suffix row</td></tr>
              <tr><td><code>.pagination__jumper-field</code></td><td>Centered numeric input</td></tr>
              <tr><td><code>.pagination__jumper-suffix</code></td><td>Caption (for example, of 20 pages)</td></tr>
              <tr><td><code>.pagination__results</code></td><td>Results-per-page row</td></tr>
              <tr><td><code>.pagination__results-select</code></td><td>Styled select (<code>text-filled</code> value, options on <code>surface-primary</code>)</td></tr>
              <tr><td><code>.pagination__results-select-wrap</code></td><td>Wrap for mask chevron (do not remove)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'pag-tokens',
            title: 'Pagination sizing',
            body: 'Override item size, gaps, jumper width, and results select width.',
            code: `@use "pimentcss" with (
  $pagination-item-size: 2.75rem,
  $pagination-gap: 0.5rem,
  $pagination-jumper-width: 3rem,
  $pagination-results-select-width: 5rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'pag-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _pagination.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Pagination pattern</p>
          <ul>
            <li><strong>Landmark</strong>, wrap controls in <code>&lt;nav aria-label="…"&gt;</code>.</li>
            <li><strong>Current page</strong>, set <code>aria-current="page"</code> on the active page button (with <code>.pagination__item--selected</code>).</li>
            <li><strong>Icon buttons</strong>, prev/next and overflow need <code>aria-label</code>; hide icons with <code>aria-hidden="true"</code>.</li>
            <li><strong>Numeric field</strong>, associate <code>&lt;label class="sr-only"&gt;</code> or <code>aria-label</code> on the jumper input.</li>
            <li><strong>Disabled</strong>, use the native <code>disabled</code> attribute on buttons at range ends.</li>
            <li><strong>Focus</strong>, visible <code>:focus-visible</code> ring on items and form controls.</li>
            <li><strong>Touch</strong>, items are 44×44px by default (<code>$pagination-item-size</code>).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/tabs"><p class="pdoc-card__title">Tabs</p><p class="pdoc-card__desc">Tab lists for switching views.</p></a>
          <a class="pdoc-card" href="/docs/anchor-inpage-nav"><p class="pdoc-card__title">In-page anchors</p><p class="pdoc-card__desc">Vertical section navigation.</p></a>
          <a class="pdoc-card" href="/docs/table"><p class="pdoc-card__title">Tables</p><p class="pdoc-card__desc">Data tables often pair with pagination.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Header bars and nav links.</p></a>
        </div>`;
}
