import { pdocSnippet, pdocSteps } from './pdoc-html';
import { SNACKBAR_REFERENCE_JS } from './snackbar-behavior';
import { ICON, ph } from './icon';

type SnackbarVariant = 'brand' | 'information' | 'success' | 'warning' | 'error';

const VARIANTS: SnackbarVariant[] = ['brand', 'information', 'success', 'warning', 'error'];

const COPY: Record<
  SnackbarVariant,
  {
    label: string;
    title: string;
    description: string;
    role: 'status' | 'alert';
    live: 'polite' | 'assertive';
    icon: () => string;
  }
> = {
  brand: {
    label: 'Brand',
    title: 'Snackbar title',
    description: 'Steve MacSteve, the best player for beta testing.',
    role: 'status',
    live: 'polite',
    icon: ICON.information,
  },
  information: {
    label: 'Information',
    title: 'Snackbar title',
    description: 'Informational message for the user.',
    role: 'status',
    live: 'polite',
    icon: ICON.information,
  },
  success: {
    label: 'Success',
    title: 'Snackbar title',
    description: 'The operation has completed successfully.',
    role: 'status',
    live: 'polite',
    icon: ICON.snackbarSuccess,
  },
  warning: {
    label: 'Warning',
    title: 'Snackbar title',
    description: 'Warning: please verify the entered data.',
    role: 'status',
    live: 'polite',
    icon: ICON.snackbarWarning,
  },
  error: {
    label: 'Error',
    title: 'Snackbar title',
    description: 'An error has occurred.',
    role: 'alert',
    live: 'assertive',
    icon: ICON.snackbarError,
  },
};

type SnackbarOpts = {
  variant: SnackbarVariant;
  withLink?: boolean;
  live?: boolean;
  autoDismissMs?: number;
  id?: string;
  progressPct?: number;
  progressHidden?: boolean;
  progressLabelled?: boolean;
};

function snackbarCloseBtn(): string {
  return `<button type="button" class="snackbar__close focus-visible" aria-label="Close notification">${ph('x', 16, '')}</button>`;
}

function snackbarProgress(pct: number, hidden: boolean, labelled = false): string {
  const hiddenAttr = hidden ? ' aria-hidden="true"' : '';
  const labelAttr = labelled && !hidden ? ' aria-label="Time remaining"' : '';
  return `<div class="snackbar__progress progress progress--sm" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"${labelAttr}${hiddenAttr}>
                  <div class="progress__fill" style="width: ${pct}%"></div>
                </div>`;
}

function snackbarMarkup(opts: SnackbarOpts): string {
  const {
    variant,
    withLink,
    live,
    autoDismissMs,
    id,
    progressPct = 25,
    progressHidden = true,
    progressLabelled = false,
  } = opts;
  const { title, description, role, live: liveMode, icon } = COPY[variant];
  const liveAttr = live ? ' data-snackbars-live' : '';
  const autoAttr = autoDismissMs ? ` data-snackbar-auto-dismiss="${autoDismissMs}"` : '';
  const idAttr = id ? ` id="${id}"` : '';

  const linkBlock = withLink
    ? `<a href="#snackbar-demo-link" class="snackbar__link focus-visible">
                      ${ICON.snackbarLink()}
                      <span class="snackbar__link-label">Link</span>
                    </a>`
    : '';

  return `<div class="snackbar snackbar--${variant}" role="${role}" aria-live="${liveMode}"${liveAttr}${autoAttr}${idAttr}>
                <div class="snackbar__main">
                  <span class="snackbar__icon" aria-hidden="true">${icon()}</span>
                  <div class="snackbar__body">
                    <div class="snackbar__text">
                      <p class="snackbar__title">${title}</p>
                      <p class="snackbar__description">${description}</p>
                    </div>
                    ${linkBlock}
                  </div>
                  ${snackbarCloseBtn()}
                </div>
                ${snackbarProgress(progressPct, progressHidden, progressLabelled)}
              </div>`;
}

const VARIANT_GRID = `<div class="pdoc-snackbar-grid" role="group" aria-label="Snackbar semantic variants">
              ${VARIANTS.map(
                (variant) => `<div class="pdoc-snackbar-grid__item">
                <p class="pdoc-snackbar-grid__label body-medium body-medium--semibold">${COPY[variant].label}</p>
                ${snackbarMarkup({ variant, withLink: variant === 'brand', progressHidden: true })}
              </div>`,
              ).join('\n              ')}
            </div>`;

const DISMISS_DEMO = `<div class="pdoc-snackbar-stack" role="group" aria-label="Dismissible snackbars">
              ${snackbarMarkup({ variant: 'success', live: true })}
              ${snackbarMarkup({ variant: 'information', live: true })}
            </div>`;

const AUTO_DISMISS_ID = 'pdoc-snackbar-auto-demo';

const AUTO_DISMISS = `<div class="pdoc-snackbar-auto-demo">
              ${snackbarMarkup({
                variant: 'success',
                live: true,
                autoDismissMs: 6000,
                id: AUTO_DISMISS_ID,
                progressPct: 100,
                progressHidden: false,
                progressLabelled: true,
              })}
              <p class="body-small pdoc-text-muted">Auto-hides after 6 seconds with a linear progress bar. Use the close button to dismiss immediately.</p>
              <button type="button" class="btn btn--outline focus-visible" data-snackbar-restore="${AUTO_DISMISS_ID}">Show again</button>
            </div>`;

const LIVE_TEMPLATE_ID = 'pdoc-snackbar-live-template';

const LIVE_HOST = `<div class="pdoc-snackbar-live-lab">
              <button type="button" class="btn btn--primary focus-visible" data-snackbar-show="${LIVE_TEMPLATE_ID}" data-snackbar-host="pdoc-snackbar-host">
                Show success snackbar
              </button>
              <div class="pdoc-snackbar-viewport" id="pdoc-snackbar-host" aria-live="polite" aria-relevant="additions"></div>
              <template id="${LIVE_TEMPLATE_ID}">
                ${snackbarMarkup({ variant: 'success', live: true, autoDismissMs: 5000, progressPct: 100, progressHidden: false, progressLabelled: true })}
              </template>
            </div>`;

export function buildSnackbarPageHtml(): string {
  return `
        <p>Transient <strong>snackbar</strong> toasts for lightweight feedback at the edge of the viewport. Styles live in <code>scss/components/_snackbar.scss</code> with <code>.progress--sm</code> for the optional timer bar. For persistent inline messages, use <a href="/docs/alerts">Alerts</a>; for blocking decisions, use <a href="/docs/modals">Modals</a>.</p>

        <h2 id="snackbar-variants">Semantic variants</h2>
        <p>Five surfaces aligned with the design spec: <code>snackbar--brand</code>, <code>snackbar--information</code>, <code>snackbar--success</code>, <code>snackbar--warning</code>, <code>snackbar--error</code>. Title color follows the variant accent; description uses <code>text-body</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${VARIANT_GRID}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="snackbar snackbar--success" role="status" aria-live="polite">
  <div class="snackbar__main">
    <span class="snackbar__icon" aria-hidden="true"><!-- icon --></span>
    <div class="snackbar__body">
      <div class="snackbar__text">
        <p class="snackbar__title">Saved</p>
        <p class="snackbar__description">Your changes were stored.</p>
      </div>
    </div>
    <button type="button" class="snackbar__close" aria-label="Close">×</button>
  </div>
</div>`,
          'snackbar-basic.html',
          'html',
        )}

        <h2 id="snackbar-dismiss">Dismissible</h2>
        <p>Always provide <code>.snackbar__close</code> with an accessible name. Wire dismiss with <code>data-snackbars-live</code> (see Behavior) or your own handler that sets <code>hidden</code> on the root.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${DISMISS_DEMO}
          </div>
        </div>

        <h2 id="snackbar-auto-dismiss">Auto-dismiss and progress</h2>
        <p>Optional <code>data-snackbar-auto-dismiss="{ms}"</code> removes the snackbar after a delay. Pair with <code>.snackbar__progress</code> for a decorative countdown (hide the bar from assistive tech with <code>aria-hidden="true"</code> unless you reflect remaining time in copy).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${AUTO_DISMISS}
          </div>
        </div>

        <h2 id="snackbar-live-host">Live toast host</h2>
        <p>In apps, mount snackbars in a fixed viewport region (for example bottom-end). The demo clones a template into <code>#pdoc-snackbar-host</code> when you click the button.</p>
        <div class="pdoc-callout">
          <p class="pdoc-callout__title">Snackbar vs alert</p>
          <ul class="body-medium">
            <li><strong>Snackbar</strong>, short, non-blocking, often auto-dismisses; does not steal focus.</li>
            <li><strong>Alert</strong>, stays in page flow or blocks attention for important context.</li>
          </ul>
        </div>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-snackbar-live-lab-wrap">
            ${LIVE_HOST}
          </div>
        </div>

        <h2 id="snackbar-behavior">Behavior in your app</h2>
        <p>Copy <code>docs-site/src/lib/snackbar-behavior.ts</code> and call <code>wireAllSnackbars()</code> after load. Handles close buttons, auto-dismiss timers (visible in viewport), progress animation, and the doc demo host.</p>
        ${pdocSnippet(SNACKBAR_REFERENCE_JS, 'snackbar-behavior.ts', 'typescript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class / attribute</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.snackbar</code></td><td>Toast container (shadow, border, max-width)</td></tr>
              <tr><td><code>.snackbar--brand</code> … <code>.snackbar--error</code></td><td>Semantic accent + progress fill tokens</td></tr>
              <tr><td><code>.snackbar__main</code></td><td>Icon, body, and close button row</td></tr>
              <tr><td><code>.snackbar__link</code></td><td>Optional inline action link (icon + <code>.snackbar__link-label</code>)</td></tr>
              <tr><td><code>.snackbar__link-icon</code></td><td>20px decorative icon slot (no underline on hover)</td></tr>
              <tr><td><code>.snackbar__link-label</code></td><td>Visible link text (underlined on hover)</td></tr>
              <tr><td><code>.snackbar__progress</code></td><td>Bottom <code>.progress--sm</code> timer bar</td></tr>
              <tr><td><code>data-snackbars-live</code></td><td>Wires reference dismiss / auto-dismiss script</td></tr>
              <tr><td><code>data-snackbar-auto-dismiss</code></td><td>Milliseconds until auto-hide</td></tr>
              <tr><td><code>data-snackbar-restore</code></td><td>Doc helper: show a hidden snackbar again by <code>id</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'snackbar-tokens',
            title: 'Snackbar layout',
            body: 'Override width, padding, and close target before importing components.',
            code: `@use "pimentcss-design-system" with (
  $snackbar-max-width: 28rem,
  $snackbar-padding-y: 1rem,
  $snackbar-close-target: 2.75rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'snackbar-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _snackbar.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Snackbars</p>
          <ul>
            <li><strong>Live region</strong>, use <code>role="status"</code> + <code>aria-live="polite"</code> for success/info; <code>role="alert"</code> + <code>aria-live="assertive"</code> for errors.</li>
            <li><strong>Focus</strong>, do not move keyboard focus into a snackbar unless it contains interactive controls the user must use immediately.</li>
            <li><strong>Close</strong>, the dismiss control needs <code>aria-label</code> (for example “Close notification”).</li>
            <li><strong>Timer</strong>, if auto-dismiss is the only indicator of remaining time, also provide text or allow users to pause/extend via the close button.</li>
            <li><strong>Viewport host</strong>, append new toasts to a single container with <code>aria-live="polite"</code> and <code>aria-relevant="additions"</code>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/alerts"><p class="pdoc-card__title">Alerts</p><p class="pdoc-card__desc">Persistent and dialog feedback.</p></a>
          <a class="pdoc-card" href="/docs/progress"><p class="pdoc-card__title">Progress</p><p class="pdoc-card__desc">Linear and circular completion indicators.</p></a>
          <a class="pdoc-card" href="/docs/modals"><p class="pdoc-card__title">Modals</p><p class="pdoc-card__desc">Blocking overlays.</p></a>
          <a class="pdoc-card" href="/docs/depth"><p class="pdoc-card__title">Depth</p><p class="pdoc-card__desc"><code>--shadow-sm</code> on floating toasts.</p></a>
        </div>`;
}
