import { pdocSnippet, pdocSteps } from './pdoc-html';
import { MODAL_REFERENCE_JS } from './modal-behavior';
import { ph } from './icon';

const MODAL_BASIC_ID = 'pdoc-modal-basic';
const MODAL_FORM_ID = 'pdoc-modal-form';
const MODAL_STATIC_ID = 'pdoc-modal-static';

const MODAL_BASIC_TRIGGER = `<button type="button" class="btn btn--primary focus-visible" data-modal-open="${MODAL_BASIC_ID}">Open modal</button>`;

const MODAL_BASIC = `<div class="modal" id="${MODAL_BASIC_ID}" data-modal-live hidden>
              <div class="modal__backdrop" data-modal-dismiss tabindex="-1" aria-hidden="true"></div>
              <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="${MODAL_BASIC_ID}-title">
                <header class="modal__header">
                  <h2 class="modal__title heading-h5" id="${MODAL_BASIC_ID}-title">Invite teammates</h2>
                  <button type="button" class="modal__close focus-visible" data-modal-close aria-label="Close dialog">${ph('x', 20, '')}</button>
                </header>
                <div class="modal__body" id="${MODAL_BASIC_ID}-body">
                  <p class="body-medium">Share this workspace with your team. They will receive an email invitation with a secure link.</p>
                </div>
                <footer class="modal__footer">
                  <button type="button" class="btn btn--outline focus-visible" data-modal-close>Cancel</button>
                  <button type="button" class="btn btn--primary focus-visible" data-modal-close>Send invites</button>
                </footer>
              </div>
            </div>`;

const MODAL_FORM_TRIGGER = `<button type="button" class="btn btn--outline focus-visible" data-modal-open="${MODAL_FORM_ID}">Edit profile (large)</button>`;

const MODAL_FORM = `<div class="modal modal--lg" id="${MODAL_FORM_ID}" data-modal-live data-modal-static hidden>
              <div class="modal__backdrop" tabindex="-1" aria-hidden="true"></div>
              <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="${MODAL_FORM_ID}-title" aria-describedby="${MODAL_FORM_ID}-hint">
                <header class="modal__header">
                  <h2 class="modal__title heading-h5" id="${MODAL_FORM_ID}-title">Edit profile</h2>
                  <button type="button" class="modal__close focus-visible" data-modal-close aria-label="Close dialog">${ph('x', 20, '')}</button>
                </header>
                <div class="modal__body">
                  <p class="body-small pdoc-text-muted" id="${MODAL_FORM_ID}-hint">Required fields are marked. Backdrop click is disabled so drafts are not lost.</p>
                  <div class="input pdoc-modal-form-field">
                    <label class="label" for="${MODAL_FORM_ID}-name">
                      <span class="label__text">Display name</span>
                    </label>
                    <div class="field">
                      <input class="field__input" id="${MODAL_FORM_ID}-name" name="name" type="text" autocomplete="name" value="Alex Martin" />
                    </div>
                  </div>
                </div>
                <footer class="modal__footer">
                  <button type="button" class="btn btn--outline focus-visible" data-modal-close>Cancel</button>
                  <button type="button" class="btn btn--primary focus-visible" data-modal-close>Save changes</button>
                </footer>
              </div>
            </div>`;

const MODAL_STATIC_TRIGGER = `<button type="button" class="btn btn--transparent focus-visible" data-modal-open="${MODAL_STATIC_ID}">Small confirmation</button>`;

const MODAL_STATIC = `<div class="modal modal--sm" id="${MODAL_STATIC_ID}" data-modal-live hidden>
              <div class="modal__backdrop" data-modal-dismiss tabindex="-1" aria-hidden="true"></div>
              <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="${MODAL_STATIC_ID}-title" aria-describedby="${MODAL_STATIC_ID}-body">
                <header class="modal__header">
                  <h2 class="modal__title heading-h5" id="${MODAL_STATIC_ID}-title">Archive item?</h2>
                  <button type="button" class="modal__close focus-visible" data-modal-close aria-label="Close dialog">${ph('x', 20, '')}</button>
                </header>
                <div class="modal__body" id="${MODAL_STATIC_ID}-body">
                  <p class="body-small">You can restore archived items within 30 days.</p>
                </div>
                <footer class="modal__footer">
                  <button type="button" class="btn btn--outline focus-visible" data-modal-close>Keep</button>
                  <button type="button" class="btn btn--primary focus-visible" data-modal-close>Archive</button>
                </footer>
              </div>
            </div>`;

const MODAL_LAB = `<div class="pdoc-modal-lab" role="group" aria-label="Modal examples">
              ${MODAL_BASIC_TRIGGER}
              ${MODAL_FORM_TRIGGER}
              ${MODAL_STATIC_TRIGGER}
              ${MODAL_BASIC}
              ${MODAL_FORM}
              ${MODAL_STATIC}
            </div>`;

export function buildModalsPageHtml(): string {
  return `
        <p>Blocking <strong>modal dialogs</strong> for focused tasks, forms, and multi-step flows. Styles live in <code>scss/components/_modal.scss</code>. For destructive confirmations with limited choices, use <a href="/alerts#alert-dialog">alert dialog</a> on the Alerts page. For layout blocks in the page, see <a href="/docs/cards">Cards</a>.</p>

        <h2 id="modal-overview">Dialog pattern</h2>
        <p>Overlay with <code>role="dialog"</code>, <code>aria-modal="true"</code>, labelled title, optional description, scrollable body, and footer actions. The root stays in the DOM with <code>hidden</code> when closed.</p>
        <div class="pdoc-callout">
          <p class="pdoc-callout__title">Modal vs alert dialog</p>
          <ul class="body-medium">
            <li><strong>Modal</strong> (<code>.modal</code>), general content and forms. Backdrop dismiss is optional (<code>data-modal-static</code>).</li>
            <li><strong>Alert dialog</strong> (<code>.alert-dialog</code>), urgent decisions with limited actions. See <a href="/alerts#alert-dialog">Alerts</a>.</li>
          </ul>
        </div>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-modal-lab-wrap">
            ${MODAL_LAB}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="modal" id="invite-modal" data-modal-live hidden>
  <div class="modal__backdrop" data-modal-dismiss></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="invite-title">
    <header class="modal__header">
      <h2 class="modal__title heading-h5" id="invite-title">Invite teammates</h2>
      <button type="button" class="modal__close" data-modal-close aria-label="Close">×</button>
    </header>
    <div class="modal__body"><p class="body-medium">Message…</p></div>
    <footer class="modal__footer">
      <button type="button" class="btn btn--outline" data-modal-close>Cancel</button>
      <button type="button" class="btn btn--primary" data-modal-close>Send</button>
    </footer>
  </div>
</div>
<button type="button" data-modal-open="invite-modal">Open</button>`,
          'modal-basic.html',
          'html',
        )}

        <h2 id="modal-sizes">Sizes and static backdrop</h2>
        <p>Default width uses <code>$modal-max-width</code> (32rem). Add <code>modal--sm</code> (24rem) or <code>modal--lg</code> (42rem) on the root. Set <code>data-modal-static</code> on the root to require an explicit close (no backdrop dismiss) for forms or drafts.</p>

        <h2 id="modal-behavior">Behavior in your app</h2>
        <p>Open with <code>data-modal-open="{id}"</code>, close with <code>data-modal-close</code> or backdrop <code>data-modal-dismiss</code>. Copy <code>docs-site/src/lib/modal-behavior.ts</code> for focus trap, Escape, scroll lock, and focus restore.</p>
        ${pdocSnippet(MODAL_REFERENCE_JS, 'modal-behavior.ts', 'typescript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class / attribute</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.modal</code></td><td>Fixed overlay root (<code>hidden</code> when closed)</td></tr>
              <tr><td><code>.modal__panel</code></td><td>Dialog surface (<code>role="dialog"</code>)</td></tr>
              <tr><td><code>.modal__header</code> / <code>.modal__body</code> / <code>.modal__footer</code></td><td>Regions (title, scrollable content, actions)</td></tr>
              <tr><td><code>.modal--sm</code> / <code>.modal--lg</code></td><td>Width presets</td></tr>
              <tr><td><code>data-modal-open</code></td><td>Opens modal by <code>id</code></td></tr>
              <tr><td><code>data-modal-close</code></td><td>Closes modal</td></tr>
              <tr><td><code>data-modal-dismiss</code></td><td>Backdrop click closes (omit with <code>data-modal-static</code>)</td></tr>
              <tr><td><code>data-modal-live</code></td><td>Wires reference behavior script</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'modal-tokens',
            title: 'Modal width and layering',
            body: 'Override modal tokens before importing components.',
            code: `@use "pimentcss" with (
  $modal-max-width: 36rem,
  $modal-max-width-lg: 48rem,
  $modal-z: 1300
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'modal-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _modal.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Modals</p>
          <ul>
            <li><strong>Role</strong>, use <code>role="dialog"</code> (not <code>alertdialog</code>) for general tasks. Reserve <code>alertdialog</code> for urgent, limited-choice prompts.</li>
            <li><strong>Naming</strong>, <code>aria-labelledby</code> points to the visible title; add <code>aria-describedby</code> when extra context is needed.</li>
            <li><strong>Focus</strong>, move focus into the panel on open, trap Tab inside, restore focus to the trigger on close. Escape closes unless <code>data-modal-no-escape</code>.</li>
            <li><strong>Scroll</strong>, lock page scroll (<code>body.modal-open</code>) while open; keep long content in <code>.modal__body</code>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/alerts"><p class="pdoc-card__title">Alerts</p><p class="pdoc-card__desc">Inline and alert dialog feedback.</p></a>
          <a class="pdoc-card" href="/docs/cards"><p class="pdoc-card__title">Cards</p><p class="pdoc-card__desc">Copy, newsletter, and blank layouts.</p></a>
          <a class="pdoc-card" href="/docs/snackbar"><p class="pdoc-card__title">Snackbar</p><p class="pdoc-card__desc">Transient toast messages.</p></a>
          <a class="pdoc-card" href="/docs/depth"><p class="pdoc-card__title">Depth</p><p class="pdoc-card__desc">Shadow tokens used on modal panels.</p></a>
        </div>`;
}
