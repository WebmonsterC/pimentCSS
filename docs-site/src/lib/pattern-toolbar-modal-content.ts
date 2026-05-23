import { pdocSnippet } from './pdoc-html';
import { MODAL_REFERENCE_JS } from './modal-behavior';
import { BUTTON_GROUP_REFERENCE_JS } from './button-group-behavior';
import { ICON, ph } from './icon';

const SNIPPET_OPEN = { expanded: true } as const;
const MODAL_ID = 'pdoc-pattern-modal-export';

const TOOLBAR_MODAL_DEMO = `<div class="pdoc-pattern-stack" role="region" aria-label="List page with toolbar and modal">
            <div class="alert alert--information alert--with-icon" role="status">
              <span class="alert__icon" aria-hidden="true">${ICON.alertInfo()}</span>
              <div class="alert__content">
                <p class="alert__title">3 drafts pending review</p>
                <p class="alert__body">Export or archive items from the toolbar. Changes sync when you refresh.</p>
              </div>
            </div>
            <div class="pdoc-pattern-toolbar">
              <div class="btn-group" role="group" aria-label="View" data-button-group-live>
                <button type="button" class="btn-group__item btn-group__item--selected focus-visible" aria-pressed="true">
                  ${ph('list', 20, 'btn-group__icon')}
                  <span class="btn-group__label">List</span>
                </button>
                <button type="button" class="btn-group__item focus-visible" aria-pressed="false">
                  ${ph('table', 20, 'btn-group__icon')}
                  <span class="btn-group__label">Grid</span>
                </button>
              </div>
              <div class="pdoc-pattern-toolbar__actions">
                <button type="button" class="btn btn--outline focus-visible">Archive</button>
                <button type="button" class="btn btn--primary focus-visible" data-modal-open="${MODAL_ID}">Export</button>
              </div>
            </div>
            <p class="body-small pdoc-text-muted mb-0">Table or card list goes here. This recipe focuses on the feedback + action row above the content.</p>
            <div class="modal" id="${MODAL_ID}" data-modal-live hidden>
              <div class="modal__backdrop" data-modal-dismiss tabindex="-1" aria-hidden="true"></div>
              <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="${MODAL_ID}-title">
                <header class="modal__header">
                  <h2 class="modal__title heading-h5" id="${MODAL_ID}-title">Export data</h2>
                  <button type="button" class="modal__close focus-visible" data-modal-close aria-label="Close dialog">${ph('x', 20, '')}</button>
                </header>
                <div class="modal__body">
                  <p class="body-medium">Choose a format. The file will download when ready.</p>
                  <div class="input pdoc-modal-form-field">
                    <label class="label" for="${MODAL_ID}-format">
                      <span class="label__text">Format</span>
                    </label>
                    <div class="field">
                      <select class="field__input" id="${MODAL_ID}-format" name="format">
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel</option>
                      </select>
                    </div>
                  </div>
                </div>
                <footer class="modal__footer">
                  <button type="button" class="btn btn--outline focus-visible" data-modal-close>Cancel</button>
                  <button type="button" class="btn btn--primary focus-visible" data-modal-close>Download</button>
                </footer>
              </div>
            </div>
          </div>`;

const TOOLBAR_MODAL_SNIPPET = `<section class="page-panel" aria-labelledby="panel-title">
  <h1 id="panel-title" class="heading-h3">Projects</h1>

  <div class="alert alert--information alert--with-icon" role="status">
    <span class="alert__icon" aria-hidden="true">…</span>
    <div class="alert__content">
      <p class="alert__title">3 drafts pending review</p>
      <p class="alert__body">Export or archive from the toolbar.</p>
    </div>
  </div>

  <div class="toolbar-row">
    <div class="btn-group" role="group" aria-label="View" data-button-group-live>
      <button type="button" class="btn-group__item btn-group__item--selected" aria-pressed="true">List</button>
      <button type="button" class="btn-group__item" aria-pressed="false">Grid</button>
    </div>
    <button type="button" class="btn btn--primary" data-modal-open="export-modal">Export</button>
  </div>

  <!-- main content: table, cards, etc. -->

  <div class="modal" id="export-modal" data-modal-live hidden>…</div>
</section>`;

/** Pattern: toolbar + modal recipe. */
export function buildPatternToolbarModalPageHtml(): string {
  return `
        <p class="pdoc-pattern-lead">A list or dashboard screen: <strong>status</strong> at the top, a <strong>toolbar</strong> for view mode and actions, and a <strong>modal</strong> for a focused task. Wire <code>data-button-group-live</code> and <code>data-modal-open</code> as on the component pages.</p>

        <h2 id="when-to-use">When to use it</h2>
        <ul>
          <li>Admin tables, project lists, or settings where users switch view and run batch actions.</li>
          <li>The modal holds a short form or confirmation without leaving the page.</li>
          <li>Use <a href="/docs/alerts">Alerts</a> for inline status; reserve <a href="/docs/modals">Modals</a> for multi-field or blocking tasks.</li>
        </ul>

        <h2 id="recipe">Recipe</h2>
        <ol class="pdoc-pattern-steps">
          <li>Place an <code>.alert</code> under the page title for context (counts, warnings).</li>
          <li>Add a horizontal row: <code>.btn-group</code> for view toggles + primary/secondary <code>.btn</code> actions.</li>
          <li>Render list/table content below the toolbar.</li>
          <li>Keep the <code>.modal</code> root in the DOM with <code>hidden</code>; open via <code>data-modal-open</code>.</li>
          <li>Call <code>wireAllButtonGroups()</code> and <code>wireAllModals()</code> after load (see reference scripts below).</li>
        </ol>

        <h2 id="demo">Live demo</h2>
        <div class="pdoc-demo pdoc-pattern-demo--toolbar" data-pdoc-demo data-pdoc-code-expanded="true">
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TOOLBAR_MODAL_DEMO}
          </div>
        </div>

        <h2 id="markup">Copy markup</h2>
        ${pdocSnippet(TOOLBAR_MODAL_SNIPPET, 'projects.html', 'html', SNIPPET_OPEN)}

        <h2 id="behavior">Behavior (reference)</h2>
        ${pdocSnippet(BUTTON_GROUP_REFERENCE_JS, 'button-group.js', 'javascript', SNIPPET_OPEN)}
        ${pdocSnippet(MODAL_REFERENCE_JS, 'modal.js', 'javascript')}

        <h2 id="related">Component reference</h2>
        <div class="pdoc-cards pdoc-cards--3">
          <a class="pdoc-card" href="/docs/alerts"><p class="pdoc-card__title">Alerts</p><p class="pdoc-card__desc">Inline status and dismiss.</p></a>
          <a class="pdoc-card" href="/docs/button-group"><p class="pdoc-card__title">Button group</p><p class="pdoc-card__desc">Segmented toolbar controls.</p></a>
          <a class="pdoc-card" href="/docs/modals"><p class="pdoc-card__title">Modals</p><p class="pdoc-card__desc">Dialog markup and focus trap.</p></a>
        </div>`;
}
