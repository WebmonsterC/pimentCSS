import { pdocSnippet, pdocSteps } from './pdoc-html';

type Thickness = '1' | '2' | '4';

const THICKNESSES: { id: Thickness; label: string; mod: string }[] = [
  { id: '1', label: 'Border 1px (default)', mod: '' },
  { id: '2', label: 'Border 2px', mod: '--2' },
  { id: '4', label: 'Border 4px', mod: '--4' },
];

function hrSample(mod: string, label: string): string {
  const classes = mod ? `hr hr${mod}` : 'hr';
  return `<div class="pdoc-keyline-samples__row">
              <span class="pdoc-keyline-samples__label body-small pdoc-text-muted">${label}</span>
              <hr class="${classes} pdoc-keyline-samples__line" aria-hidden="true" />
            </div>`;
}

function keylineDiv(mod: string, label: string): string {
  const classes = mod ? `keyline keyline${mod}` : 'keyline';
  return `<div class="pdoc-keyline-samples__row">
              <span class="pdoc-keyline-samples__label body-small pdoc-text-muted">${label}</span>
              <div class="${classes} pdoc-keyline-samples__line" role="separator" aria-hidden="true"></div>
            </div>`;
}

const HR_SAMPLES = `<div class="pdoc-keyline-samples" role="group" aria-label="HR thickness variants">
              ${THICKNESSES.map(({ mod, label }) => hrSample(mod, label)).join('\n              ')}
            </div>`;

const KEYLINE_SAMPLES = `<div class="pdoc-keyline-samples" role="group" aria-label="Keyline div thickness variants">
              ${THICKNESSES.map(({ mod, label }) => keylineDiv(mod, label)).join('\n              ')}
            </div>`;

const IN_CONTEXT = `<div class="pdoc-keyline-context">
              <p class="body-medium mb-0">Section one</p>
              <p class="body-small pdoc-text-muted mb-0">Introductory copy before the break.</p>
              <hr class="hr" />
              <p class="body-medium mb-0">Section two</p>
              <p class="body-small pdoc-text-muted mb-0">Content after a semantic horizontal rule.</p>
            </div>`;

const TABS_NOTE = `<div class="pdoc-keyline-tabs-note">
              <p class="body-small pdoc-text-muted mb-0">Tab bars reuse the same 1px token via <code>.tabs__separator</code> (see <a href="/docs/tabs">Tabs</a>).</p>
            </div>`;

export function buildKeylinePageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_keyline.scss</code>. Dividers separate content with <code>border-primary</code> at 1, 2, or 4&nbsp;px. Use a native <code>&lt;hr&gt;</code> for thematic breaks, or a <code>&lt;div class="keyline"&gt;</code> when you need a non-semantic separator in flex layouts.</p>

        <h2 id="keyline-hr">HR (horizontal rule)</h2>
        <p>Classes <code>.hr</code> or <code>.keyline</code> on <code>&lt;hr&gt;</code>. Default thickness is 1&nbsp;px; add <code>.hr--2</code> or <code>.hr--4</code> for heavier lines.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-keyline-demo-wrap">
            ${HR_SAMPLES}
          </div>
        </div>
        ${pdocSnippet(
          `<hr class="hr" />
<hr class="hr hr--2" />
<hr class="hr hr--4" />`,
          'hr.html',
          'html',
        )}

        <h2 id="keyline-div">Keyline (div)</h2>
        <p>Same visuals on a <code>&lt;div&gt;</code>. Mark decorative lines <code>aria-hidden="true"</code> when nearby headings or labels already convey structure.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-keyline-demo-wrap">
            ${KEYLINE_SAMPLES}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="keyline" role="separator" aria-hidden="true"></div>
<div class="keyline keyline--2" role="separator" aria-hidden="true"></div>`,
          'keyline.html',
          'html',
        )}

        <h2 id="keyline-usage">In context</h2>
        <p>Prefer <code>&lt;hr&gt;</code> between sections of prose so assistive tech can announce a thematic break. Avoid stacking multiple adjacent rules.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-keyline-demo-wrap">
            ${IN_CONTEXT}
          </div>
        </div>

        <h2 id="keyline-related">Related components</h2>
        ${TABS_NOTE}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.keyline</code> / <code>.hr</code></td><td>Horizontal rule (1px <code>border-primary</code>)</td></tr>
              <tr><td><code>.keyline--2</code> / <code>.hr--2</code></td><td>2px top border</td></tr>
              <tr><td><code>.keyline--4</code> / <code>.hr--4</code></td><td>4px top border</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'keyline-tokens',
            title: 'Keyline width',
            body: 'Override max-width when dividers should span the full content column.',
            code: `@use "pimentcss-design-system" with (
  $keyline-max-width: 100%
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'keyline-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _keyline.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Dividers</p>
          <ul>
            <li><strong>Semantic breaks</strong>, use <code>&lt;hr&gt;</code> between thematic sections; do not replace headings.</li>
            <li><strong>Decorative lines</strong>, on <code>&lt;div class="keyline"&gt;</code> use <code>role="separator"</code> and <code>aria-hidden="true"</code> when structure is already exposed.</li>
            <li><strong>Contrast</strong>, lines use <code>--border-primary</code>; verify on tinted backgrounds in your theme.</li>
            <li><strong>Density</strong>, avoid multiple consecutive rules; one divider per logical break is enough.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/tabs"><p class="pdoc-card__title">Tabs</p><p class="pdoc-card__desc">Tab list with <code>.tabs__separator</code>.</p></a>
          <a class="pdoc-card" href="/docs/placeholder"><p class="pdoc-card__title">Placeholder</p><p class="pdoc-card__desc">Copy blocks and media ratios.</p></a>
          <a class="pdoc-card" href="/docs/layout"><p class="pdoc-card__title">Layout</p><p class="pdoc-card__desc">Spacing and page structure.</p></a>
          <a class="pdoc-card" href="/docs/tags"><p class="pdoc-card__title">Tags</p><p class="pdoc-card__desc">Filter chips and labels.</p></a>
        </div>`;
}
