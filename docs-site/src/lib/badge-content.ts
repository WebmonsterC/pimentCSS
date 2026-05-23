import { pdocSnippet, pdocSteps } from './pdoc-html';

type BadgeVariant = 'default' | 'information' | 'warning' | 'error' | 'success';

const VARIANTS: { id: BadgeVariant; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'information', label: 'Information' },
  { id: 'warning', label: 'Warning' },
  { id: 'error', label: 'Error' },
  { id: 'success', label: 'Success' },
];

function badgeCopy(variant: BadgeVariant, value = '99'): string {
  return `<span class="badge badge--copy badge--${variant}">${value}</span>`;
}

function badgeDot(variant: BadgeVariant, label: string): string {
  return `<span class="badge badge--dot badge--${variant}" role="img" aria-label="${label}"></span>`;
}

function swatchRow(
  ariaLabel: string,
  render: (variant: BadgeVariant, label: string) => string,
): string {
  const items = VARIANTS.map(
    ({ id, label }) => `<figure class="pdoc-badge-swatches__item">
                ${render(id, label)}
                <figcaption class="body-small pdoc-text-muted">${label}</figcaption>
              </figure>`,
  ).join('\n              ');
  return `<div class="pdoc-badge-swatches" role="group" aria-label="${ariaLabel}">
              ${items}
            </div>`;
}

const COPY_SWATCHES = swatchRow('Copy badge variants', (id) => badgeCopy(id));

const DOT_SWATCHES = swatchRow('Dot badge variants', (id, label) => badgeDot(id, label));

const IN_CONTEXT = `<div class="pdoc-badge-context">
              <button type="button" class="btn btn--primary">
                Notifications
                ${badgeCopy('error', '3')}
              </button>
              <span class="pdoc-badge-context__status">
                Status
                ${badgeDot('success', 'Online')}
              </span>
            </div>`;

export function buildBadgePageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_badge.scss</code>. Badges are compact status markers: a <strong>copy</strong> counter (24×24px) or a <strong>dot</strong> indicator (8×8px). Combine type and semantic modifiers (<code>badge--information</code>, <code>badge--error</code>, etc.).</p>

        <h2 id="badge-copy">Type Copy</h2>
        <p>Circular counter with Body/Small semi-bold typography. The visible number is the accessible name; keep counts short (for example <code>9+</code> for large values).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${COPY_SWATCHES}
          </div>
        </div>
        ${pdocSnippet(
          `<span class="badge badge--copy badge--error">3</span>`,
          'badge-copy.html',
          'html',
        )}

        <h2 id="badge-dot">Type Dot</h2>
        <p>8×8px status dot with no visible text. Always expose meaning with <code>aria-label</code> (or <code>aria-labelledby</code>) and <code>role="img"</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${DOT_SWATCHES}
          </div>
        </div>
        ${pdocSnippet(
          `<span class="badge badge--dot badge--success" role="img" aria-label="Online"></span>`,
          'badge-dot.html',
          'html',
        )}

        <h2 id="badge-context">In context</h2>
        <p>Place a copy badge beside a control label, or a dot badge next to status text so sighted users and assistive tech get the same meaning.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${IN_CONTEXT}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.badge</code></td><td>Base inline-flex pill</td></tr>
              <tr><td><code>.badge--copy</code></td><td>24×24px numeric counter</td></tr>
              <tr><td><code>.badge--dot</code></td><td>8×8px indicator (no text)</td></tr>
              <tr><td><code>.badge--default</code></td><td>Primary / neutral emphasis</td></tr>
              <tr><td><code>.badge--information</code></td><td>Informational status</td></tr>
              <tr><td><code>.badge--warning</code></td><td>Warning status</td></tr>
              <tr><td><code>.badge--error</code></td><td>Error or alert count</td></tr>
              <tr><td><code>.badge--success</code></td><td>Success or positive status</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'badge-tokens',
            title: 'Badge sizes',
            body: 'Adjust copy and dot dimensions when your density scale changes.',
            code: `@use "pimentcss-design-system" with (
  $badge-copy-size: 1.5rem,
  $badge-dot-size: 0.5rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'badge-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _badge.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Badges</p>
          <ul>
            <li><strong>Copy badges</strong>, rely on visible text; avoid icon-only triggers that only show a number unless the control has an accessible name that includes the count.</li>
            <li><strong>Dot badges</strong>, use <code>role="img"</code> and a concise <code>aria-label</code> (for example “3 unread messages”, not just “Error”).</li>
            <li><strong>Color</strong>, do not use color alone: pair dots with visible text nearby or expose the status in the parent element’s label.</li>
            <li><strong>Motion</strong>, when counts change, consider a polite <code>aria-live</code> region on the parent widget, not on the badge itself.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/tags"><p class="pdoc-card__title">Tags</p><p class="pdoc-card__desc">Removable labels and filters.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Nav items with optional counters.</p></a>
          <a class="pdoc-card" href="/docs/snackbar"><p class="pdoc-card__title">Snackbar</p><p class="pdoc-card__desc">Transient feedback messages.</p></a>
          <a class="pdoc-card" href="/docs/list"><p class="pdoc-card__title">Lists</p><p class="pdoc-card__desc">Structured steps and resources.</p></a>
        </div>`;
}
