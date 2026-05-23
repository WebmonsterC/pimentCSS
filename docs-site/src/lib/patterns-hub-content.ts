/** Patterns hub: how to compose pages from multiple components. */
export function buildPatternsHubPageHtml(): string {
  return `
        <h2 id="overview">How to compose a page</h2>
        <p>PimentCSS documents atoms (buttons, fields, alerts) and molecules (forms, tables, modals). <strong>Patterns</strong> show how to wire them into flows you ship: a contact panel, a list screen with actions, or a data table with paging.</p>
        <p>Each recipe is a short, copy-pasteable stack with links to the underlying component pages. Start here, then dive into <a href="/docs/form">Form</a>, <a href="/docs/navigation">Navigation</a>, or <a href="/docs/feedback">Feedback</a> sections for API detail.</p>

        <h2 id="recipes">Recipes</h2>
        <div class="pdoc-cards pdoc-cards--3 pdoc-pattern-recipe-cards">
          <a class="pdoc-card pdoc-card--path" href="/docs/pattern-contact-form">
            <p class="pdoc-card__eyebrow">Forms</p>
            <p class="pdoc-card__title">Contact form</p>
            <p class="pdoc-card__desc"><code>.form</code> + fields, radios, checkbox, and submit.</p>
          </a>
          <a class="pdoc-card pdoc-card--path" href="/docs/pattern-toolbar-modal">
            <p class="pdoc-card__eyebrow">Feedback + actions</p>
            <p class="pdoc-card__title">Toolbar + modal</p>
            <p class="pdoc-card__desc">Status alert, <code>.btn-group</code>, and a dialog for a focused task.</p>
          </a>
          <a class="pdoc-card pdoc-card--path" href="/docs/pattern-table-pagination">
            <p class="pdoc-card__eyebrow">Content</p>
            <p class="pdoc-card__title">Table + pagination</p>
            <p class="pdoc-card__desc">Scrollable table, selection, and page controls under the grid.</p>
          </a>
        </div>

        <h2 id="layout-primitives">Layout primitives</h2>
        <p>When you need empty regions before content exists (wireframes, CMS slots, blank cards), use dashed <code>.slot</code> placeholders and <code>.slots-layout</code> grids.</p>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/slots-layouts">
            <p class="pdoc-card__title">Slots &amp; layouts</p>
            <p class="pdoc-card__desc">Column and row slot grids, fluid stacks, and blank card composition.</p>
          </a>
          <a class="pdoc-card" href="/docs/layout">
            <p class="pdoc-card__title">Layout</p>
            <p class="pdoc-card__desc">Container, 12-column grid, and spacing utilities.</p>
          </a>
          <a class="pdoc-card" href="/docs/cards">
            <p class="pdoc-card__title">Cards</p>
            <p class="pdoc-card__desc">Copy, newsletter, and blank slot cards.</p>
          </a>
        </div>

        <h2 id="by-domain">Browse by domain</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Domain</th><th>Start with</th><th>Typical stack</th></tr></thead>
            <tbody>
              <tr><td>Forms</td><td><a href="/docs/pattern-contact-form">Contact form</a></td><td><code>.form</code>, <code>.field</code>, <code>.btn</code></td></tr>
              <tr><td>Feedback</td><td><a href="/docs/pattern-toolbar-modal">Toolbar + modal</a></td><td><code>.alert</code>, <code>.btn-group</code>, <code>.modal</code></td></tr>
              <tr><td>Data lists</td><td><a href="/docs/pattern-table-pagination">Table + pagination</a></td><td><code>.table-scroll</code>, <code>.pagination</code></td></tr>
              <tr><td>Navigation</td><td><a href="/docs/navigation">Navigation</a></td><td><code>.header-nav</code>, <code>.tabs</code>, <code>.breadcrumb</code></td></tr>
            </tbody>
          </table>
        </div>`;
}
