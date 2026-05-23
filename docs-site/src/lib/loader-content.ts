import { pdocSnippet, pdocSteps } from './pdoc-html';
import { LOADER_REFERENCE_JS } from './loader-behavior';

const LOADER_DOT_COUNT = 8;
const LOADER_SIZES = [48, 40, 32, 24] as const;
const LOADER_TYPES = ['primary', 'secondary'] as const;

type LoaderSize = (typeof LOADER_SIZES)[number];
type LoaderType = (typeof LOADER_TYPES)[number];

const LOADER_DOTS = Array.from(
  { length: LOADER_DOT_COUNT },
  () => '<span class="loader__dot" aria-hidden="true"></span>',
).join('\n                  ');

function loaderMarkup(
  size: LoaderSize,
  type: LoaderType,
  opts: { live?: boolean; hidden?: boolean; id?: string } = {},
): string {
  const { live, hidden, id } = opts;
  const liveAttr = live ? ' aria-live="polite"' : '';
  const hiddenAttr = hidden ? ' hidden' : '';
  const idAttr = id ? ` id="${id}"` : '';
  const dataAttr = id ? ' data-loader-indicator' : '';
  return `<div class="loader loader--${size} loader--${type}" role="status"${liveAttr} aria-label="Loading"${idAttr}${dataAttr}${hiddenAttr}>
                  ${LOADER_DOTS}
                </div>`;
}

function matrixCell(size: LoaderSize, type: LoaderType): string {
  return `<div class="ds-matrix__cell">${loaderMarkup(size, type)}</div>`;
}

function matrixRow(type: LoaderType, label: string): string {
  const cells = LOADER_SIZES.map((size) => matrixCell(size, type)).join('\n            ');
  return `<div class="ds-matrix__row">${label}</div>
            ${cells}`;
}

const SIZE_MATRIX = `<div class="ds-matrix ds-matrix--loader" role="group" aria-label="Loader sizes and types">
            <div class="ds-matrix__head"></div>
            ${LOADER_SIZES.map((s) => `<div class="ds-matrix__head">${s}px</div>`).join('\n            ')}
            ${matrixRow('primary', 'Primary')}
            ${matrixRow('secondary', 'Secondary')}
          </div>
          <p class="body-small pdoc-text-muted">Eight orbiting dots with staggered pulse animation. Use <code>loader--primary</code> on brand surfaces; <code>loader--secondary</code> on muted backgrounds.</p>`;

const LIVE_REGION_ID = 'pdoc-loader-live';

const IN_CONTEXT = `<div class="pdoc-loader-context" id="${LIVE_REGION_ID}" data-loader-live aria-busy="false">
              <div class="pdoc-loader-context__body">
                <p class="body-medium body-medium--semibold">Dashboard summary</p>
                <p class="body-small pdoc-text-muted">Placeholder content while data loads.</p>
              </div>
              ${loaderMarkup(32, 'primary', { live: true, hidden: true, id: 'pdoc-loader-live-indicator' })}
              <button type="button" class="btn btn--primary focus-visible" data-loader-toggle data-loader-target="#${LIVE_REGION_ID}">
                Simulate loading
              </button>
            </div>`;

const MARKUP_SNIPPET = `<div class="loader loader--32 loader--primary" role="status" aria-live="polite" aria-label="Loading">
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
</div>`;

export function buildLoaderPageHtml(): string {
  return `
        <p>Indeterminate <strong>loader</strong> for operations without a known duration. Eight dots orbit with a cascade pulse. Styles live in <code>scss/components/_loader.scss</code>. When you can show percent complete, use <a href="/docs/progress">Progress</a> instead.</p>

        <h2 id="loader-matrix">Sizes and types</h2>
        <p>Four footprints (24 to 48px) and two color treatments. Each loader needs <code>role="status"</code> and an accessible name via <code>aria-label</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SIZE_MATRIX}
          </div>
        </div>

        <h2 id="loader-context">In context</h2>
        <p>Pair the loader with <code>aria-busy="true"</code> on the loading region. Hide the loader with the <code>hidden</code> attribute when idle so assistive tech is not announced repeatedly.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${IN_CONTEXT}
          </div>
        </div>
        ${pdocSnippet(MARKUP_SNIPPET, 'loader.html', 'html')}

        <h2 id="loader-behavior">Behavior in your app</h2>
        <p>Copy <code>docs-site/src/lib/loader-behavior.ts</code> and call <code>wireAllLoaders()</code> after load, or toggle <code>aria-busy</code> and <code>hidden</code> from your data layer.</p>
        ${pdocSnippet(LOADER_REFERENCE_JS, 'loader-behavior.ts', 'typescript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.loader</code></td><td>Inline host for eight <code>.loader__dot</code> elements</td></tr>
              <tr><td><code>.loader--48</code> … <code>.loader--24</code></td><td>Footprint and dot size tokens</td></tr>
              <tr><td><code>.loader--primary</code></td><td>Brand action color (<code>--surface-action</code>)</td></tr>
              <tr><td><code>.loader--secondary</code></td><td>Neutral orbit (<code>--neutral-400</code>)</td></tr>
              <tr><td><code>.loader__dot</code></td><td>Pulsing dot (decorative, <code>aria-hidden</code>)</td></tr>
              <tr><td><code>data-loader-live</code></td><td>Doc region wired by <code>wireAllLoaders()</code></td></tr>
              <tr><td><code>data-loader-toggle</code></td><td>Button toggles busy state on <code>data-loader-target</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'loader-tokens',
            title: 'Loader layout',
            body: 'Override footprint, dot size, and orbit distance before importing components.',
            code: `@use "pimentcss" with (
  $loader-size-48: 3.5rem,
  $loader-dot-32: 5px,
  $loader-orbit-ratio: 0.4
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'loader-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _loader.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Loaders</p>
          <ul>
            <li><strong>Status</strong>, use <code>role="status"</code> with a concise <code>aria-label</code> (for example “Loading”). Add <code>aria-live="polite"</code> when the loader can appear dynamically.</li>
            <li><strong>Busy region</strong>, set <code>aria-busy="true"</code> on the container while content loads; remove it and hide the loader when done.</li>
            <li><strong>Dots</strong>, mark each <code>.loader__dot</code> with <code>aria-hidden="true"</code>; do not expose eight separate elements to screen readers.</li>
            <li><strong>Known duration</strong>, prefer <a href="/docs/progress">Progress</a> with <code>role="progressbar"</code> when a percentage is available.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/progress"><p class="pdoc-card__title">Progress</p><p class="pdoc-card__desc">Determinate completion bars and rings.</p></a>
          <a class="pdoc-card" href="/docs/snackbar"><p class="pdoc-card__title">Snackbar</p><p class="pdoc-card__desc">Toast feedback after async actions.</p></a>
          <a class="pdoc-card" href="/docs/placeholder"><p class="pdoc-card__title">Placeholder</p><p class="pdoc-card__desc">Skeleton layouts while loading.</p></a>
        </div>`;
}
