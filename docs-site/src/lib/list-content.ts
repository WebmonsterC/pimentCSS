import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ph } from './icon';

const LIST_ICON = ph('bookmark', 20, 'list__indicator-icon');

function listIndicatorProcess(step: string): string {
  return `<span class="list__indicator" aria-hidden="true">${step}</span>`;
}

function listIndicatorIcon(): string {
  return `<span class="list__indicator" aria-hidden="true">${LIST_ICON}</span>`;
}

function listItem(opts: { step?: string; icon?: boolean; title: string; description: string }): string {
  const indicator = opts.icon ? listIndicatorIcon() : listIndicatorProcess(opts.step ?? '1');
  return `<li class="list__item">
                  ${indicator}
                  <div class="list__content">
                    <h3 class="list__title">${opts.title}</h3>
                    <p class="list__description">${opts.description}</p>
                  </div>
                </li>`;
}

const INDICATORS = `<div class="pdoc-list-indicators" role="group" aria-label="List indicator types">
              <figure class="pdoc-list-indicators__figure">
                ${listIndicatorProcess('2')}
                <figcaption class="body-small pdoc-text-muted">Process (step number)</figcaption>
              </figure>
              <figure class="pdoc-list-indicators__figure">
                ${listIndicatorIcon()}
                <figcaption class="body-small pdoc-text-muted">Icon</figcaption>
              </figure>
            </div>`;

const SINGLE_ITEM = `<div class="list__item pdoc-list-single">
              ${listIndicatorProcess('2')}
              <div class="list__content">
                <h3 class="list__title">Verify your email</h3>
                <p class="list__description">We sent a confirmation link. Open it to continue.</p>
              </div>
            </div>`;

const PROCESS_LIST = `<div class="list pdoc-list-demo">
              <h2 class="list__heading heading-h5">Onboarding steps</h2>
              <ol class="list__items">
                ${listItem({
                  step: '1',
                  title: 'Create your account',
                  description: 'Use a work email so teammates can find you.',
                })}
                ${listItem({
                  step: '2',
                  title: 'Verify your email',
                  description: 'Check your inbox for the confirmation link.',
                })}
                ${listItem({
                  step: '3',
                  title: 'Invite your team',
                  description: 'Add colleagues and assign roles.',
                })}
                ${listItem({
                  step: '4',
                  title: 'Publish your first project',
                  description: 'Share a link or export your layout.',
                })}
              </ol>
            </div>`;

const ICON_LIST = `<div class="list pdoc-list-demo">
              <h2 class="list__heading heading-h5">Saved resources</h2>
              <ol class="list__items">
                ${listItem({
                  icon: true,
                  title: 'Design tokens',
                  description: 'Color, type, and spacing variables for your product.',
                })}
                ${listItem({
                  icon: true,
                  title: 'Component checklist',
                  description: 'Accessibility and responsive checks before release.',
                })}
                ${listItem({
                  icon: true,
                  title: 'Release notes',
                  description: 'What changed in the latest PimentCSS build.',
                })}
              </ol>
            </div>`;

export function buildListPageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_list.scss</code>. Use a semantic <code>&lt;ol class="list__items"&gt;</code> for ordered steps, or <code>&lt;ul&gt;</code> when order does not matter. Decorative indicators sit beside title and description blocks.</p>

        <h2 id="list-indicators">Indicators</h2>
        <p>Each row starts with a 24px circle: a <strong>process</strong> step number or an <strong>icon</strong> marker. Mark indicators <code>aria-hidden="true"</code> when the list order already conveys sequence.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${INDICATORS}
          </div>
        </div>

        <h2 id="list-item">Single item</h2>
        <p>Combine <code>.list__item</code>, <code>.list__indicator</code>, and <code>.list__content</code> for one row outside a full list (cards, timelines, side panels).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SINGLE_ITEM}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="list__item">
  <span class="list__indicator" aria-hidden="true">2</span>
  <div class="list__content">
    <h3 class="list__title">Title</h3>
    <p class="list__description">Description</p>
  </div>
</div>`,
          'list-item.html',
          'html',
        )}

        <h2 id="list-component">Full list (process steps)</h2>
        <p>Wrap items in <code>.list</code> with an optional <code>.list__heading</code>. Use <code>&lt;h3 class="list__title"&gt;</code> per row so heading levels stay logical under the section title.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${PROCESS_LIST}
          </div>
        </div>

        <h2 id="list-icon-variant">Icon indicators</h2>
        <p>Swap the number for an icon in <code>.list__indicator-icon</code> (for example <code>&lt;i class="ph ph-bookmark"&gt;</code> at 16px inside the 24px circle).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ICON_LIST}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="list">
  <h2 class="list__heading heading-h5">Heading</h2>
  <ol class="list__items">
    <li class="list__item">
      <span class="list__indicator" aria-hidden="true">1</span>
      <div class="list__content">
        <h3 class="list__title">Title</h3>
        <p class="list__description">Description</p>
      </div>
    </li>
  </ol>
</div>`,
          'list.html',
          'html',
        )}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.list</code></td><td>Vertical stack: optional heading + items</td></tr>
              <tr><td><code>.list__heading</code></td><td>Section title above the items</td></tr>
              <tr><td><code>.list__items</code></td><td><code>ol</code> or <code>ul</code> reset list (no bullets)</td></tr>
              <tr><td><code>.list__item</code></td><td>Row: indicator + content</td></tr>
              <tr><td><code>.list__indicator</code></td><td>24px circular marker (number or icon)</td></tr>
              <tr><td><code>.list__indicator-icon</code></td><td>Icon size inside the marker</td></tr>
              <tr><td><code>.list__content</code></td><td>Title + description column</td></tr>
              <tr><td><code>.list__title</code></td><td>Row heading (H6 scale)</td></tr>
              <tr><td><code>.list__description</code></td><td>Supporting body text</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'list-tokens',
            title: 'List spacing',
            body: 'Tune gaps between items and indicator size.',
            code: `@use "pimentcss-design-system" with (
  $list-gap: 1rem,
  $list-items-gap: 0.5rem,
  $list-indicator-size: 1.5rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'list-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _list.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Lists and steps</p>
          <ul>
            <li><strong>Ordered steps</strong>, use <code>&lt;ol class="list__items"&gt;</code> so screen readers announce position.</li>
            <li><strong>Unordered content</strong>, use <code>&lt;ul class="list__items"&gt;</code> when sequence is not meaningful.</li>
            <li><strong>Decorative indicators</strong>, add <code>aria-hidden="true"</code> on <code>.list__indicator</code> when numbers duplicate what the list order already provides.</li>
            <li><strong>Headings</strong>, keep one logical level: section <code>.list__heading</code>, then <code>&lt;h3 class="list__title"&gt;</code> per item.</li>
            <li><strong>Icons</strong>, if the icon conveys meaning (not just decoration), expose that text in the title or use visible text plus <code>aria-hidden</code> on the icon.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/table"><p class="pdoc-card__title">Tables</p><p class="pdoc-card__desc">Tabular data when you need columns.</p></a>
          <a class="pdoc-card" href="/docs/tree"><p class="pdoc-card__title">Tree</p><p class="pdoc-card__desc">Hierarchical navigation and folders.</p></a>
          <a class="pdoc-card" href="/docs/badge"><p class="pdoc-card__title">Badges</p><p class="pdoc-card__desc">Compact status labels.</p></a>
          <a class="pdoc-card" href="/docs/anchor-inpage-nav"><p class="pdoc-card__title">In-page anchors</p><p class="pdoc-card__desc">Jump between sections on long pages.</p></a>
        </div>`;
}
