import { pdocSnippet, pdocSteps } from './pdoc-html';
import { PROGRESS_REFERENCE_JS } from './progress-behavior';

function linearProgress(
  pct: number,
  opts: { sm?: boolean; ariaLabel?: string; labelledBy?: string } = {},
): string {
  const { sm, ariaLabel, labelledBy } = opts;
  const smClass = sm ? ' progress--sm' : '';
  const labelAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
  const labelledAttr = labelledBy ? ` aria-labelledby="${labelledBy}"` : '';
  return `<div class="progress${smClass}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"${labelAttr}${labelledAttr}>
                <div class="progress__fill" style="width: ${pct}%"></div>
              </div>`;
}

function progressBarCompound(size: 'sm' | 'md', pct: number, labelText: string, id: string): string {
  return `<div class="progress-bar progress-bar--${size}" role="group" aria-labelledby="${id}">
                <p class="progress-bar__label" id="${id}">${labelText}</p>
                ${linearProgress(pct, { sm: size === 'sm', labelledBy: id })}
              </div>`;
}

function progressCircleSvg(pct: number): string {
  const dash = `${pct} ${100 - pct}`;
  return `<svg class="progress-circle__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                  <circle class="progress-circle__track" cx="50" cy="50" r="45" pathLength="100"></circle>
                  <circle class="progress-circle__fill" cx="50" cy="50" r="45" pathLength="100" stroke-dasharray="${dash}"></circle>
                </svg>`;
}

function progressCircle(size: 'sm' | 'md', pct: number, ariaLabel: string): string {
  return `<div class="progress-circle progress-circle--${size}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${ariaLabel}">
                ${progressCircleSvg(pct)}
                <span class="progress-circle__label">${pct}%</span>
              </div>`;
}

const LINEAR_BAR = `<div class="pdoc-progress-linear" role="group" aria-label="Linear progress bar">
              ${linearProgress(50, { ariaLabel: 'Upload progress' })}
              <p class="body-small pdoc-text-muted">Default track: max-width 256px, height 4px, pill radius. Use <code>.progress--sm</code> for 2px (snackbar timer).</p>
            </div>`;

const SIZE_COMPARE = `<div class="pdoc-progress-sizes" role="group" aria-label="Progress bar heights">
              <div class="pdoc-progress-sizes__item">
                <p class="body-small body-medium--semibold pdoc-progress-sizes__label" id="pdoc-progress-size-md">Medium (4px)</p>
                ${linearProgress(50, { ariaLabel: 'Medium progress bar example' })}
              </div>
              <div class="pdoc-progress-sizes__item">
                <p class="body-small body-medium--semibold pdoc-progress-sizes__label" id="pdoc-progress-size-sm">Small (2px)</p>
                ${linearProgress(50, { sm: true, ariaLabel: 'Small progress bar example' })}
              </div>
            </div>`;

const LABELED_BARS = `<div class="pdoc-progress-bars" role="group" aria-label="Progress bars with labels">
              ${progressBarCompound('sm', 25, 'Completion: 25%', 'pdoc-pb-sm')}
              ${progressBarCompound('md', 25, 'Completion: 25%', 'pdoc-pb-md')}
            </div>`;

const CIRCLES = `<div class="pdoc-progress-circles" role="group" aria-label="Circular progress indicators">
              ${progressCircle('md', 75, '75 percent complete')}
              ${progressCircle('sm', 75, '75 percent complete')}
            </div>
            <p class="body-small pdoc-text-muted">Medium 128px (label body-large) · Small 64px (label body-medium). Set <code>stroke-dasharray="{value} {remainder}"</code> on <code>.progress-circle__fill</code> with <code>pathLength="100"</code>.</p>`;

const LIVE_LINEAR_ID = 'pdoc-progress-live-linear';
const LIVE_CIRCLE_ID = 'pdoc-progress-live-circle';

const LIVE_DEMO = `<div class="pdoc-progress-live-lab" role="group" aria-label="Live progress update demos">
              <div class="pdoc-progress-live-card">
                <p class="pdoc-progress-live-card__label body-small body-medium--semibold">Linear bar</p>
                <div class="pdoc-progress-live" id="${LIVE_LINEAR_ID}" data-progress-live>
                  <div class="progress-bar progress-bar--md" role="group" aria-labelledby="pdoc-progress-live-label">
                    <p class="progress-bar__label" id="pdoc-progress-live-label">Completion: 0%</p>
                    ${linearProgress(0, { labelledBy: 'pdoc-progress-live-label' })}
                  </div>
                  <button type="button" class="btn btn--primary focus-visible" data-progress-simulate data-progress-target="#${LIVE_LINEAR_ID}">
                    Simulate upload
                  </button>
                </div>
              </div>
              <div class="pdoc-progress-live-card">
                <p class="pdoc-progress-live-card__label body-small body-medium--semibold">Progress circle</p>
                <div class="pdoc-progress-live pdoc-progress-live--circle" id="${LIVE_CIRCLE_ID}" data-progress-live data-progress-kind="circle">
                  ${progressCircle('md', 0, '0 percent complete')}
                  <button type="button" class="btn btn--outline focus-visible" data-progress-simulate data-progress-target="#${LIVE_CIRCLE_ID}">
                    Simulate update
                  </button>
                </div>
              </div>
            </div>`;

export function buildProgressPageHtml(): string {
  return `
        <p>Linear and circular <strong>progress</strong> indicators for uploads, form steps, and background tasks. Styles live in <code>scss/components/_progress.scss</code>. Pair with <a href="/docs/snackbar">Snackbars</a> for optional timer bars, or <a href="/docs/loader">Loader</a> when the duration is unknown.</p>

        <h2 id="progress-linear">Linear bar</h2>
        <p>Standalone <code>.progress</code> track with <code>.progress__fill</code> width. Expose <code>role="progressbar"</code> and <code>aria-valuenow</code> when the value is meaningful.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LINEAR_BAR}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="progress" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
  <div class="progress__fill" style="width: 50%"></div>
</div>`,
          'progress-linear.html',
          'html',
        )}

        <h2 id="progress-sizes">Heights</h2>
        <p><code>.progress--sm</code> (2px) for compact timers; default height 4px for page-level feedback.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SIZE_COMPARE}
          </div>
        </div>

        <h2 id="progress-bar">Progress bar (label + track)</h2>
        <p>Wrap the track in <code>.progress-bar</code> with a visible <code>.progress-bar__label</code>. The inner bar uses <code>aria-labelledby</code> so the label is the accessible name.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LABELED_BARS}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="progress-bar progress-bar--md" role="group" aria-labelledby="upload-label">
  <p class="progress-bar__label" id="upload-label">Completion: 25%</p>
  <div class="progress" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" aria-labelledby="upload-label">
    <div class="progress__fill" style="width: 25%"></div>
  </div>
</div>`,
          'progress-bar.html',
          'html',
        )}

        <h2 id="progress-circle">Progress circle</h2>
        <p>SVG ring with <code>.progress-circle__track</code> and <code>.progress-circle__fill</code>. Center label is visual only; keep <code>aria-label</code> or <code>aria-valuenow</code> in sync when the value changes.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${CIRCLES}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="progress-circle progress-circle--md" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="75 percent complete">
  <svg class="progress-circle__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <circle class="progress-circle__track" cx="50" cy="50" r="45" pathLength="100"></circle>
    <circle class="progress-circle__fill" cx="50" cy="50" r="45" pathLength="100" stroke-dasharray="75 25"></circle>
  </svg>
  <span class="progress-circle__label">75%</span>
</div>`,
          'progress-circle.html',
          'html',
        )}

        <h2 id="progress-live">Live update</h2>
        <p>Update <code>aria-valuenow</code>, visible labels, and either <code>.progress__fill</code> width or the circle <code>stroke-dasharray</code> when progress changes in your app.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LIVE_DEMO}
          </div>
        </div>

        <h2 id="progress-behavior">Behavior in your app</h2>
        <p>Copy <code>docs-site/src/lib/progress-behavior.ts</code> and call <code>wireAllProgress()</code> after load, or update values from your framework when tasks complete.</p>
        ${pdocSnippet(PROGRESS_REFERENCE_JS, 'progress-behavior.ts', 'typescript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.progress</code></td><td>Linear track (max-width 256px, 4px height)</td></tr>
              <tr><td><code>.progress--sm</code></td><td>2px height (snackbar timer, compact UI)</td></tr>
              <tr><td><code>.progress__fill</code></td><td>Filled portion; set <code>width</code> or animate in JS</td></tr>
              <tr><td><code>.progress-bar</code></td><td>Label + track column (max-width 512px)</td></tr>
              <tr><td><code>.progress-bar--sm</code> / <code>--md</code></td><td>Bar height token on nested <code>.progress</code></td></tr>
              <tr><td><code>.progress-bar__label</code></td><td>Visible status text; pair with <code>aria-labelledby</code></td></tr>
              <tr><td><code>.progress-circle</code></td><td>Circular indicator (128px default)</td></tr>
              <tr><td><code>.progress-circle--sm</code></td><td>64px ring + body-medium label</td></tr>
              <tr><td><code>.progress-circle__svg</code></td><td>Rotated SVG host for track and fill arcs</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'progress-tokens',
            title: 'Progress layout',
            body: 'Override track width, bar heights, and circle sizes before importing components.',
            code: `@use "pimentcss" with (
  $progress-width: 20rem,
  $progress-height-md: 6px,
  $progress-circle-md: 9rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'progress-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _progress.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Progress indicators</p>
          <ul>
            <li><strong>Role</strong>, use <code>role="progressbar"</code> with <code>aria-valuenow</code>, <code>aria-valuemin</code>, and <code>aria-valuemax</code> when the value is known.</li>
            <li><strong>Name</strong>, provide <code>aria-label</code> or <code>aria-labelledby</code> (compound <code>.progress-bar</code> uses the visible label).</li>
            <li><strong>Indeterminate</strong>, omit <code>aria-valuenow</code> or use <code>aria-busy="true"</code> on a parent region; prefer <a href="/docs/loader">Loader</a> when percent is unknown.</li>
            <li><strong>Decorative timers</strong>, snackbar countdown bars can use <code>aria-hidden="true"</code> if remaining time is not the only cue (see <a href="/docs/snackbar">Snackbar</a>).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/snackbar"><p class="pdoc-card__title">Snackbar</p><p class="pdoc-card__desc"><code>.progress--sm</code> timer on toasts.</p></a>
          <a class="pdoc-card" href="/docs/loader"><p class="pdoc-card__title">Loader</p><p class="pdoc-card__desc">Indeterminate busy states.</p></a>
          <a class="pdoc-card" href="/docs/alerts"><p class="pdoc-card__title">Alerts</p><p class="pdoc-card__desc">Completion messages after tasks.</p></a>
        </div>`;
}
