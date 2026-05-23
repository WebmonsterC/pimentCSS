import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ALERT_REFERENCE_JS } from './alert-behavior';
import { ICON, ph } from './icon';

type AlertVariant = 'information' | 'success' | 'warning' | 'error';

const VARIANTS: AlertVariant[] = ['information', 'success', 'warning', 'error'];

const COPY: Record<
  AlertVariant,
  { title: string; body: string; role: 'status' | 'alert'; icon: () => string }
> = {
  information: {
    title: 'Information',
    body: 'Informational message for the user.',
    role: 'status',
    icon: ICON.alertInfo,
  },
  success: {
    title: 'Success',
    body: 'The operation has completed successfully.',
    role: 'status',
    icon: ICON.alertSuccess,
  },
  warning: {
    title: 'Warning',
    body: 'Review this item before you continue.',
    role: 'alert',
    icon: ICON.alertWarning,
  },
  error: {
    title: 'Error',
    body: 'Something went wrong. Try again or contact support.',
    role: 'alert',
    icon: ICON.alertError,
  },
};

type AlertOpts = {
  variant: AlertVariant;
  withIcon?: boolean;
  dismissible?: boolean;
  live?: boolean;
  autoDismissMs?: number;
  id?: string;
  extraClass?: string;
};

function alertCloseBtn(): string {
  return `<button type="button" class="alert__close focus-visible" aria-label="Close notification">${ph('x', 20, '')}</button>`;
}

function alertMarkup(opts: AlertOpts): string {
  const { variant, withIcon, dismissible, live, autoDismissMs, id, extraClass } = opts;
  const { title, body, role, icon } = COPY[variant];
  const mods = [
    'alert',
    `alert--${variant}`,
    withIcon ? 'alert--with-icon' : '',
    dismissible ? 'alert--dismissible' : '',
    extraClass ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  const liveAttr = live ? ' data-alerts-live' : '';
  const autoAttr = autoDismissMs ? ` data-alert-auto-dismiss="${autoDismissMs}"` : '';
  const idAttr = id ? ` id="${id}"` : '';

  return `<div class="${mods}" role="${role}"${liveAttr}${autoAttr}${idAttr}>
                ${withIcon ? `<span class="alert__icon" aria-hidden="true">${icon()}</span>` : ''}
                <div class="alert__content">
                  <p class="alert__title">${title}</p>
                  <p class="alert__body">${body}</p>
                </div>
                ${dismissible ? alertCloseBtn() : ''}
              </div>`;
}

const VARIANT_STACK = `<div class="pdoc-alert-stack" role="group" aria-label="Alert semantic variants">
              ${VARIANTS.map((v) => alertMarkup({ variant: v })).join('\n              ')}
            </div>`;

const ICON_STACK = `<div class="pdoc-alert-stack" role="group" aria-label="Alerts with icons">
              ${VARIANTS.map((v) => alertMarkup({ variant: v, withIcon: true })).join('\n              ')}
            </div>`;

const DISMISS_STACK = `<div class="pdoc-alert-stack" role="group" aria-label="Dismissible alerts">
              ${VARIANTS.map((v) => alertMarkup({ variant: v, withIcon: true, dismissible: true, live: true })).join('\n              ')}
            </div>`;

const AUTO_DISMISS = `<div class="pdoc-alert-auto-demo">
              ${alertMarkup({
                variant: 'success',
                withIcon: true,
                dismissible: true,
                live: true,
                autoDismissMs: 6000,
                id: 'pdoc-alert-auto-demo',
              })}
              <p class="body-small pdoc-text-muted">This alert auto-hides after 6 seconds. Use the close button to dismiss immediately.</p>
              <button type="button" class="btn btn--outline focus-visible" data-alert-restore="pdoc-alert-auto-demo">Show again</button>
            </div>`;

const RESPONSIVE_DEMO = `<div class="pdoc-alert-narrow" role="group" aria-label="Responsive alert in a narrow column">
              ${alertMarkup({
                variant: 'warning',
                withIcon: true,
                dismissible: true,
                live: true,
                extraClass: 'pdoc-alert-narrow__alert',
              })}
            </div>`;

const DIALOG_ID = 'pdoc-alert-dialog-demo';

const DIALOG_TRIGGER = `<button type="button" class="btn btn--primary focus-visible" data-alert-dialog-open="${DIALOG_ID}">Show alert dialog</button>`;

const DIALOG = `<div class="alert-dialog" id="${DIALOG_ID}" data-alert-dialog-live hidden>
              <div class="alert-dialog__backdrop" data-alert-dialog-dismiss tabindex="-1" aria-hidden="true"></div>
              <div class="alert-dialog__panel" role="alertdialog" aria-modal="true" aria-labelledby="${DIALOG_ID}-title" aria-describedby="${DIALOG_ID}-body">
                <div class="alert alert--error alert--with-icon alert--dismissible" role="alert">
                  <span class="alert__icon" aria-hidden="true">${ICON.alertError()}</span>
                  <div class="alert__content">
                    <p class="alert__title" id="${DIALOG_ID}-title">Delete this project?</p>
                    <p class="alert__body" id="${DIALOG_ID}-body">This action cannot be undone. All data will be permanently removed.</p>
                  </div>
                  <button type="button" class="alert__close focus-visible" data-alert-dialog-close aria-label="Close dialog">${ph('x', 20, '')}</button>
                </div>
                <footer class="alert-dialog__footer">
                  <button type="button" class="btn btn--outline focus-visible" data-alert-dialog-close>Cancel</button>
                  <button type="button" class="btn btn--primary focus-visible" data-alert-dialog-close>Delete</button>
                </footer>
              </div>
            </div>`;

export function buildAlertsPageHtml(): string {
  return `
        <p>Inline <strong>alerts</strong> for persistent page feedback, plus a blocking <strong>alert dialog</strong> overlay for critical decisions. Styles live in <code>scss/components/_alert.scss</code>. General task dialogs use <a href="/docs/modals">Modals</a>; transient toasts use <a href="/docs/snackbar">Snackbar</a>; layout cards use <a href="/docs/cards">Cards</a>.</p>

        <h2 id="alert-variants">Semantic variants</h2>
        <p>Four semantic surfaces: <code>alert--information</code>, <code>alert--success</code>, <code>alert--warning</code>, <code>alert--error</code>. Pair with <code>role="status"</code> (information, success) or <code>role="alert"</code> (warning, error).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${VARIANT_STACK}
          </div>
        </div>

        <h2 id="alert-icons">With or without icon</h2>
        <p>Add <code>.alert--with-icon</code> and an <code>.alert__icon</code> slot (decorative, <code>aria-hidden="true"</code>). Text-only alerts omit the icon column.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ICON_STACK}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="alert alert--information alert--with-icon" role="status">
  <span class="alert__icon" aria-hidden="true"><!-- icon --></span>
  <div class="alert__content">
    <p class="alert__title">Information</p>
    <p class="alert__body">Message text.</p>
  </div>
</div>`,
          'alert-with-icon.html',
          'html',
        )}

        <h2 id="alert-dismiss">Dismissible alerts</h2>
        <p>Add <code>.alert--dismissible</code> and <code>.alert__close</code>. Wire with <code>data-alerts-live</code> (see Behavior) or your own handler that sets <code>hidden</code> on the root.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${DISMISS_STACK}
          </div>
        </div>

        <h2 id="alert-auto-dismiss">Auto-dismiss</h2>
        <p>Optional <code>data-alert-auto-dismiss="6000"</code> (milliseconds) removes the alert after a delay. Always keep a close button for users who need more time.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${AUTO_DISMISS}
          </div>
        </div>

        <h2 id="alert-responsive">Responsive layout</h2>
        <p>Alerts are fluid (<code>width: 100%</code>). In narrow columns, dismissible alerts with icons wrap the close control to preserve touch targets (44px).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${RESPONSIVE_DEMO}
          </div>
        </div>

        <h2 id="alert-dialog">Alert dialog (overlay)</h2>
        <p>Blocking overlay for critical messages: <code>.alert-dialog</code> + <code>role="alertdialog"</code>, <code>aria-modal="true"</code>, backdrop dismiss, Escape, and footer actions. Open with <code>data-alert-dialog-open</code> targeting the dialog <code>id</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-alert-dialog-lab">
            ${DIALOG_TRIGGER}
            ${DIALOG}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="alert-dialog" id="confirm-delete" data-alert-dialog-live hidden>
  <div class="alert-dialog__backdrop" data-alert-dialog-dismiss></div>
  <div class="alert-dialog__panel" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
    <div class="alert alert--error alert--with-icon" role="alert">…</div>
    <footer class="alert-dialog__footer">
      <button type="button" class="btn btn--outline" data-alert-dialog-close>Cancel</button>
      <button type="button" class="btn btn--primary">Delete</button>
    </footer>
  </div>
</div>`,
          'alert-dialog.html',
          'html',
        )}

        <h2 id="behavior">Behavior in your app</h2>
        <p>Copy <code>docs-site/src/lib/alert-behavior.ts</code> and call <code>wireAllAlerts()</code> after load. This site wires it from <code>doc-client.ts</code> for <code>data-alerts-live</code> and <code>data-alert-dialog-live</code>.</p>
        ${pdocSnippet(ALERT_REFERENCE_JS, 'alert-behavior.ts', 'typescript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class / attribute</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.alert</code></td><td>Inline feedback block (fluid width)</td></tr>
              <tr><td><code>.alert--with-icon</code></td><td>Icon column + content</td></tr>
              <tr><td><code>.alert--dismissible</code></td><td>Close button slot</td></tr>
              <tr><td><code>.alert__close</code></td><td>Dismiss control (44px target)</td></tr>
              <tr><td><code>data-alerts-live</code></td><td>Wire dismiss + auto-dismiss</td></tr>
              <tr><td><code>data-alert-auto-dismiss</code></td><td>Auto-hide delay in ms</td></tr>
              <tr><td><code>.alert-dialog</code></td><td>Fixed overlay root (<code>hidden</code> when closed)</td></tr>
              <tr><td><code>data-alert-dialog-open</code></td><td>Opens dialog by <code>id</code></td></tr>
              <tr><td><code>data-alert-dialog-close</code></td><td>Closes dialog</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'alert-tokens',
            title: 'Alert spacing and dialog width',
            body: 'Override tokens before importing PimentCSS.',
            code: `@use "pimentcss" with (
  $alert-icon-size: 1.25rem,
  $alert-dialog-max-width: 32rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'alert-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _alert.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Alerts</p>
          <ul>
            <li><strong>Roles</strong>, <code>role="alert"</code> for urgent messages; <code>role="status"</code> for informational feedback.</li>
            <li><strong>Alert dialog</strong>, focus moves to the panel on open and returns to the trigger on close. For general modals with focus trap, see <a href="/modals#modal-behavior">Modals</a>.</li>
            <li><strong>Auto-dismiss</strong>, never rely on timing alone; always offer a close control.</li>
            <li><strong>Icons</strong>, decorative; meaning must be in the title and body text.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/snackbar"><p class="pdoc-card__title">Snackbar</p><p class="pdoc-card__desc">Transient toast with progress.</p></a>
          <a class="pdoc-card" href="/docs/modals"><p class="pdoc-card__title">Modals</p><p class="pdoc-card__desc">Dialog overlays for focused tasks.</p></a>
          <a class="pdoc-card" href="/docs/cards"><p class="pdoc-card__title">Cards</p><p class="pdoc-card__desc">Copy, newsletter, and blank layouts.</p></a>
          <a class="pdoc-card" href="/docs/form"><p class="pdoc-card__title">Form</p><p class="pdoc-card__desc">Inline field errors vs page alerts.</p></a>
          <a class="pdoc-card" href="/docs/badge"><p class="pdoc-card__title">Badges</p><p class="pdoc-card__desc">Compact status markers.</p></a>
        </div>`;
}
