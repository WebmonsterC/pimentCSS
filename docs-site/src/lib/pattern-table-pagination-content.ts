import { pdocSnippet } from './pdoc-html';
import { TABLE_REFERENCE_JS } from './table-behavior';
import { PAGINATION_REFERENCE_JS } from './pagination-behavior';
import { ph } from './icon';

const SNIPPET_OPEN = { expanded: true } as const;
const ARROW_ICON = ph('arrow-right', 24, 'pagination__item-icon');
const TABLE_CHECK = ph('check', 16, 'checkbox__icon checkbox__icon--check');

const TABLE_PAGINATION_DEMO = `<div class="pdoc-pattern-stack pdoc-pattern-stack--table" role="region" aria-label="Data table with pagination">
            <div class="table-scroll pdoc-table-scroll" role="region" tabindex="0" aria-label="Team members" data-table-scroll-hint>
              <table class="table pdoc-table-demo" data-table-live>
                <caption class="sr-only">Team members</caption>
                <thead>
                  <tr>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col">
                      <label class="checkbox table__item">
                        <input type="checkbox" class="checkbox__input" aria-label="Select all rows" />
                        <span class="checkbox__control" aria-hidden="true">${TABLE_CHECK}</span>
                      </label>
                    </th>
                    <th class="table__cell table__cell--heading table__cell--border-bottom" scope="col">
                      <span class="table__text table__text--heading">Name</span>
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
                  <tr data-table-row data-table-select-row>
                    <td class="table__cell table__cell--border-bottom">
                      <label class="checkbox table__item">
                        <input type="checkbox" class="checkbox__input" aria-label="Select Alex Martin" />
                        <span class="checkbox__control" aria-hidden="true">${TABLE_CHECK}</span>
                      </label>
                    </td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text table__text--heading">Alex Martin</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text table__text--wrap">Product designer</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Active</span></span></td>
                  </tr>
                  <tr data-table-row data-table-select-row>
                    <td class="table__cell table__cell--border-bottom">
                      <label class="checkbox table__item">
                        <input type="checkbox" class="checkbox__input" aria-label="Select Samira Chen" />
                        <span class="checkbox__control" aria-hidden="true">${TABLE_CHECK}</span>
                      </label>
                    </td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text table__text--heading">Samira Chen</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__text table__text--wrap">Engineer</span></td>
                    <td class="table__cell table__cell--border-bottom"><span class="table__status"><span class="table__status-dot" aria-hidden="true"></span><span class="table__status-label">Active</span></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <nav class="pagination pdoc-pagination-demo" data-pagination-live aria-label="Results pagination">
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
            </nav>
          </div>`;

const TABLE_PAGINATION_SNIPPET = `<section aria-labelledby="results-title">
  <h2 id="results-title" class="heading-h4">Team members</h2>

  <div class="table-scroll" role="region" tabindex="0" aria-label="Team members">
    <table class="table" data-table-live>
      <caption class="sr-only">Team members</caption>
      <thead>…</thead>
      <tbody>…</tbody>
    </table>
  </div>

  <nav class="pagination" data-pagination-live aria-label="Results pagination">
    <div class="pagination__group">
      <ul class="pagination__list">…</ul>
    </div>
  </nav>
</section>`;

/** Pattern: table + pagination recipe. */
export function buildPatternTablePaginationPageHtml(): string {
  return `
        <p class="pdoc-pattern-lead">A data screen: scrollable <code>.table</code> for rows, then <code>.pagination</code> for paging. Combines <a href="/docs/table">Tables</a> and <a href="/docs/pagination">Pagination</a>.</p>

        <h2 id="when-to-use">When to use it</h2>
        <ul>
          <li>Admin lists, CRM views, or reports with more rows than fit on one screen.</li>
          <li>Row selection via checkboxes and optional bulk actions above the table (see <a href="/docs/pattern-toolbar-modal">Toolbar + modal</a>).</li>
          <li>On small viewports, the same data can collapse to card stacks (see <a href="/table#responsive">Tables → Responsive</a>).</li>
        </ul>

        <h2 id="recipe">Recipe</h2>
        <ol class="pdoc-pattern-steps">
          <li>Wrap the table in <code>.table-scroll</code> with <code>role="region"</code>, <code>tabindex="0"</code>, and an <code>aria-label</code>.</li>
          <li>Use semantic <code>&lt;table&gt;</code>, <code>&lt;caption class="sr-only"&gt;</code>, and <code>scope="col"</code> on headers.</li>
          <li>Place <code>nav.pagination</code> directly under the scroll region, not inside it.</li>
          <li>Add <code>data-table-live</code> and <code>data-pagination-live</code> when using the doc reference scripts.</li>
        </ol>

        <h2 id="demo">Live demo</h2>
        <div class="pdoc-demo pdoc-pattern-demo--table" data-pdoc-demo data-pdoc-code-expanded="true">
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TABLE_PAGINATION_DEMO}
          </div>
        </div>

        <h2 id="markup">Copy markup</h2>
        ${pdocSnippet(TABLE_PAGINATION_SNIPPET, 'team-list.html', 'html', SNIPPET_OPEN)}

        <h2 id="behavior">Behavior (reference)</h2>
        ${pdocSnippet(TABLE_REFERENCE_JS, 'table.js', 'javascript', SNIPPET_OPEN)}
        ${pdocSnippet(PAGINATION_REFERENCE_JS, 'pagination.js', 'javascript')}

        <h2 id="related">Component reference</h2>
        <div class="pdoc-cards pdoc-cards--3">
          <a class="pdoc-card" href="/docs/table"><p class="pdoc-card__title">Tables</p><p class="pdoc-card__desc">Cells, selection, responsive cards.</p></a>
          <a class="pdoc-card" href="/docs/pagination"><p class="pdoc-card__title">Pagination</p><p class="pdoc-card__desc">Jumpers, numbered lists, live wiring.</p></a>
          <a class="pdoc-card" href="/docs/patterns"><p class="pdoc-card__title">All patterns</p><p class="pdoc-card__desc">More composition recipes.</p></a>
        </div>`;
}
