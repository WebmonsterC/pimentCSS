import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ph, ICON } from './icon';

const LINK_ICON_LEAD = ph('link', 20, 'link__icon');
const LINK_ICON_FORWARD = ICON.linkForwardTrail();
const BREADCRUMB_SEP = ph('caret-right', 20, 'breadcrumb__separator');

type LinkState = { label: string; tag: 'a' | 'span'; mods: string };

const LINK_STATES: LinkState[] = [
  { label: 'Default', tag: 'a', mods: '' },
  { label: 'Focus', tag: 'a', mods: 'focus-visible' },
  { label: 'Hover (spec)', tag: 'a', mods: 'link--hover' },
  { label: 'Disabled', tag: 'span', mods: 'link--disabled' },
];

function linkStateCell(state: LinkState, withIcons = false): string {
  const iconBefore = withIcons ? LINK_ICON_LEAD : '';
  const iconAfter = withIcons ? LINK_ICON_FORWARD : '';
  const className = ['link', state.mods].filter(Boolean).join(' ');
  const inner = `${iconBefore}<span class="link__label">Link</span>${iconAfter}`;
  if (state.tag === 'a') {
    return `            <li class="pdoc-control-state pdoc-control-state--link" role="listitem">
              <span class="pdoc-control-state__label">${state.label}</span>
              <a href="#" class="${className}">
                ${inner}
              </a>
            </li>`;
  }
  return `            <li class="pdoc-control-state pdoc-control-state--link" role="listitem">
              <span class="pdoc-control-state__label">${state.label}</span>
              <span class="${className}" aria-disabled="true" tabindex="-1">
                ${inner}
              </span>
            </li>`;
}

const LINK_STATES_SPEC = `<ul class="pdoc-control-states pdoc-control-states--link" role="list" aria-label="Link states">
${LINK_STATES.map((s) => linkStateCell(s, s.label === 'Default')).join('\n')}
          </ul>`;

function breadcrumbItem(label: string, href: string): string {
  return `                <li class="breadcrumb__item">
                  <a href="${href}" class="breadcrumb__link">
                    <span>${label}</span>
                    ${BREADCRUMB_SEP}
                  </a>
                </li>`;
}

const BREADCRUMB_DEMO = `<nav class="breadcrumb" aria-label="Breadcrumb">
              <ol class="breadcrumb__list">
${breadcrumbItem('Introduction', '/')}
${breadcrumbItem('Actions', '/buttons')}
${breadcrumbItem('Button group', '/button-group')}
                <li class="breadcrumb__item">
                  <span class="breadcrumb__current" aria-current="page">Links &amp; breadcrumb</span>
                </li>
              </ol>
            </nav>`;

const INLINE_DEMO = `<p class="body-medium mb-0">
              Read the <a href="/docs/installation" class="link link--inline">installation guide</a> before you customize tokens.
            </p>`;

const LINK_WITH_ICON = `<a href="/docs/installation" class="link">
              ${LINK_ICON_LEAD}
              <span class="link__label">Installation</span>
              ${LINK_ICON_FORWARD}
            </a>`;

/** Full Links & breadcrumb page (Actions). */
export function buildLinkBreadcrumbPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Every link needs a clear <strong>accessible name</strong> (visible text, not color alone). Keep decorative icons on <code>aria-hidden="true"</code>. Breadcrumbs use <code>&lt;nav aria-label="Breadcrumb"&gt;</code> and an ordered list; the current page is plain text with <code>aria-current="page"</code>, not another link.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p><code>.link</code> styles standalone action links (pill padding, hover surface). Add <code>.link--inline</code> inside body copy for underlined text links. <code>.breadcrumb</code> wraps an <code>&lt;ol class="breadcrumb__list"&gt;</code>: each ancestor is a <code>.breadcrumb__link</code> followed by a <code>.breadcrumb__separator</code> chevron.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Link</td><td><code>.link</code></td><td>Action link (anchor; can pair with <code>.link__label</code>)</td></tr>
              <tr><td>Inline</td><td><code>.link--inline</code></td><td>Underlined link in paragraphs</td></tr>
              <tr><td>Icon</td><td><code>.link__icon</code></td><td>20px mask icon beside label</td></tr>
              <tr><td>Label</td><td><code>.link__label</code></td><td>Visible link text</td></tr>
              <tr><td>Breadcrumb</td><td><code>.breadcrumb</code></td><td>Navigation landmark wrapper</td></tr>
              <tr><td>List</td><td><code>.breadcrumb__list</code></td><td>Ordered trail (<code>&lt;ol&gt;</code>)</td></tr>
              <tr><td>Segment</td><td><code>.breadcrumb__link</code></td><td>Ancestor link + separator icon</td></tr>
              <tr><td>Current</td><td><code>.breadcrumb__current</code></td><td>Current page label (no link)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Icons</strong>, optional <code>link__icon</code> slot with your library (this doc uses Phosphor via <code>ph()</code>).</li>
          <li><strong>Typography</strong>, inline links sit in <a href="/docs/typography">Typography</a> body utilities (<code>.body-medium</code>).</li>
        </ul>

        <h2 id="link-states">Link states</h2>
        <p>Each state is an <code>&lt;a href="…"&gt;</code> except disabled (non-focusable <code>&lt;span&gt;</code>). Doc-only <code>.link--hover</code> shows the spec surface; live pages use <code>:hover</code> and <code>:focus-visible</code>. The default cell shows optional <code>link-04</code> and an outbound trail icon.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LINK_STATES_SPEC}
          </div>
        </div>

        <h2 id="structure">Structure</h2>
        <p>Use a real <code>href</code> on anchors. For disabled links, prefer removing the anchor or use <code>aria-disabled="true"</code> with <code>tabindex="-1"</code> on a span styled as <code>.link--disabled</code>.</p>
        ${pdocSnippet(
          `<a href="/docs/colors" class="link">
  <span class="link__label">View colors</span>
</a>`,
          'link.html',
          'html',
        )}

        <h2 id="inline">Inline link</h2>
        <p>Inside paragraphs, add <code>.link--inline</code> for underline and the same action color tokens.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-copy-block">${INLINE_DEMO}</div>
          </div>
        </div>

        <h2 id="with-icons">Link with icons</h2>
        <p>Optional pattern: <code>link-04</code> before the label, outbound arrow after (16px). Use when the design calls for both link affordance and an external destination cue.</p>
        <p class="body-small pdoc-text-muted mt-2 mb-0">The trail arrow uses an inline SVG (<code>ICON.linkForwardTrail()</code>) for a clearer external-link cue at 16px.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LINK_WITH_ICON}
          </div>
        </div>

        <h2 id="breadcrumb">Breadcrumb</h2>
        <p>Each ancestor is a <code>.breadcrumb__link</code> ending with <code>.breadcrumb__separator</code>. The last item is <code>.breadcrumb__current</code> with <code>aria-current="page"</code>.</p>
        ${pdocSnippet(
          `<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="/docs" class="breadcrumb__link">
        <span>Home</span>
        <i class="ph ph-caret-right breadcrumb__separator" style="font-size:20px" aria-hidden="true"></i>
      </a>
    </li>
    <li class="breadcrumb__item">
      <span class="breadcrumb__current" aria-current="page">Current page</span>
    </li>
  </ol>
</nav>`,
          'breadcrumb.html',
          'html',
        )}
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${BREADCRUMB_DEMO}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.link</code></td><td>Action link: flex row, action color, hover surface</td></tr>
              <tr><td><code>.link--inline</code></td><td>Underlined variant for body text</td></tr>
              <tr><td><code>.link--hover</code></td><td>Doc-only hover preview</td></tr>
              <tr><td><code>.link--disabled</code></td><td>Disabled look (pair with <code>aria-disabled</code>)</td></tr>
              <tr><td><code>.link__icon</code></td><td>20px icon slot</td></tr>
              <tr><td><code>.link__label</code></td><td>Link text</td></tr>
              <tr><td><code>.breadcrumb</code></td><td>Breadcrumb nav wrapper</td></tr>
              <tr><td><code>.breadcrumb__list</code></td><td>Ordered list, flex wrap</td></tr>
              <tr><td><code>.breadcrumb__item</code></td><td>List item, inline flex</td></tr>
              <tr><td><code>.breadcrumb__link</code></td><td>Ancestor link + separator icon</td></tr>
              <tr><td><code>.breadcrumb__separator</code></td><td>Chevron between segments</td></tr>
              <tr><td><code>.breadcrumb__current</code></td><td>Current page label</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'lb-tokens',
            title: 'Link and breadcrumb spacing',
            body: 'Override gap, padding, and icon size before importing components.',
            code: `@use "pimentcss" with (
  $link-gap: 0.5rem,
  $link-padding: 0.25rem,
  $link-icon-size: 1.25rem,
  $breadcrumb-gap: 0.25rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'lb-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _link.scss or _breadcrumb.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Links and breadcrumbs</p>
          <ul>
            <li><strong>Link purpose</strong>, link text describes the destination; avoid generic labels like "click here".</li>
            <li><strong>Decorative icons</strong>, <code>aria-hidden="true"</code> on icons beside visible link text.</li>
            <li><strong>Focus</strong>, do not remove <code>:focus-visible</code>; contrast meets AA on action tokens.</li>
            <li><strong>Disabled</strong>, do not leave a focusable <code>href</code> on disabled items; use <code>aria-disabled</code> and remove from tab order.</li>
            <li><strong>Breadcrumb nav</strong>, <code>aria-label="Breadcrumb"</code> on <code>&lt;nav&gt;</code>; use <code>&lt;ol&gt;</code> for order.</li>
            <li><strong>Current page</strong>, <code>aria-current="page"</code> on the last item only; ancestors stay links.</li>
            <li><strong>Separators</strong>, decorative chevrons use <code>aria-hidden="true"</code>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/button-group"><p class="pdoc-card__title">Button group</p><p class="pdoc-card__desc">Segmented actions.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Nav bars and sections.</p></a>
          <a class="pdoc-card" href="/docs/anchor-inpage-nav"><p class="pdoc-card__title">In-page anchors</p><p class="pdoc-card__desc">On-page section links.</p></a>
          <a class="pdoc-card" href="/docs/typography"><p class="pdoc-card__title">Typography</p><p class="pdoc-card__desc">Body styles paired with inline links.</p></a>
        </div>`;
}
