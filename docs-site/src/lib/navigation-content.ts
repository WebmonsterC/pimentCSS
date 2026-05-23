import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ph, ICON } from './icon';

const LOGO_ICON = ph('house-simple', 20);
const MENU_ICON = ph('list', 24);
const SEARCH_ICON = ICON.search('header-nav__search-icon', 20);
const NAV_TRAIL_ICON = ph('house', 20, 'nav-item__icon');

const NAV_LINKS = `
                  <li><a href="#about" class="nav-item">About</a></li>
                  <li><a href="#service" class="nav-item nav-item--selected" aria-current="page">Service</a></li>
                  <li><a href="#portfolio" class="nav-item">Portfolio</a></li>`;

function headerNavPanel(panelId: string, actionsHtml: string): string {
  return `<div class="header-nav__panel" id="${panelId}">
                <nav class="header-nav__nav" aria-label="Main navigation">
                  <ul class="nav__list">${NAV_LINKS}
                  </ul>
                </nav>${actionsHtml}
              </div>`;
}

function headerNavWrap(
  panelId: string,
  actionsHtml: string,
  opts?: { wrapClass?: string; headerClass?: string; withToggle?: boolean },
): string {
  const wrapClass = opts?.wrapClass ?? 'pdoc-header-nav-demo-wrap';
  const headerClass = ['header-nav', opts?.headerClass].filter(Boolean).join(' ');
  const dataNav = opts?.withToggle ? ' data-header-nav' : '';
  const toggle = opts?.withToggle
    ? `
              <button
                type="button"
                class="header-nav__toggle"
                aria-expanded="false"
                aria-controls="${panelId}"
                aria-label="Open menu"
              >${MENU_ICON}</button>`
    : '';
  return `<div class="${wrapClass}">
            <header class="${headerClass}"${dataNav}>
              <a href="/docs" class="header-nav__logo" aria-label="Home">
                ${LOGO_ICON}
              </a>
              ${headerNavPanel(panelId, actionsHtml)}${toggle}
            </header>
          </div>`;
}

const HEADER_LINKS_ONLY = headerNavWrap('pdoc-header-nav-links', '');
const HEADER_WITH_CTA = headerNavWrap(
  'pdoc-header-nav-cta',
  `
                <div class="header-nav__actions">
                  <button type="button" class="btn btn--primary">Sign up</button>
                </div>`,
);
const HEADER_WITH_SEARCH = headerNavWrap(
  'pdoc-header-nav-search',
  `
                <div class="header-nav__actions">
                  <button type="button" class="btn btn--transparent btn--icon-only" aria-label="Search">
                    ${SEARCH_ICON}
                  </button>
                  <button type="button" class="btn btn--primary">Sign up</button>
                </div>`,
);
const HEADER_BURGER = headerNavWrap(
  'pdoc-header-nav-burger-panel',
  `
                <div class="header-nav__actions">
                  <button type="button" class="btn btn--transparent">Log in</button>
                  <button type="button" class="btn btn--primary">Sign up</button>
                </div>`,
  {
    wrapClass: 'pdoc-header-nav-demo-wrap pdoc-header-nav-demo-wrap--burger',
    headerClass: 'header-nav--compact',
    withToggle: true,
  },
);

type NavState = { label: string; mods: string; current?: string };

const NAV_STATES: NavState[] = [
  { label: 'Default', mods: '' },
  { label: 'Focus', mods: 'focus-visible' },
  { label: 'Hover (spec)', mods: 'nav-item--hover' },
  { label: 'Selected', mods: 'nav-item--selected', current: 'page' },
];

function navStateCell(state: NavState, withIcon = false): string {
  const className = ['nav-item', state.mods].filter(Boolean).join(' ');
  const current = state.current ? ` aria-current="${state.current}"` : '';
  const icon = withIcon ? NAV_TRAIL_ICON : '';
  const label = withIcon ? `Nav item\n                ${icon}` : 'Nav item';
  return `            <li class="pdoc-control-state pdoc-control-state--nav" role="listitem">
              <span class="pdoc-control-state__label">${state.label}</span>
              <a href="#" class="${className}"${current}>${label}</a>
            </li>`;
}

const NAV_STATES_SPEC = `<ul class="pdoc-control-states pdoc-control-states--nav" role="list" aria-label="Nav item states">
${NAV_STATES.map((s) => navStateCell(s, s.label === 'Selected')).join('\n')}
          </ul>`;

const INPAGE_NAV = `<nav class="inpage-nav" aria-label="Page sections">
              <a href="#overview" class="nav-item">Overview</a>
              <a href="#inpage" class="nav-item nav-item--selected" aria-current="true">In-page nav</a>
              <a href="#header" class="nav-item">
                Header bar
                ${NAV_TRAIL_ICON}
              </a>
            </nav>`;

/** Full Navigation page. */
export function buildNavigationPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Primary navigation needs a <strong>landmark</strong> (<code>&lt;nav aria-label="…"&gt;</code>) and visible link names. Mark the active item with <code>aria-current="page"</code> (or <code>aria-current="true"</code> for in-page sections). Decorative trailing icons use <code>aria-hidden="true"</code>.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p><code>.nav-item</code> is the shared link style for header bars and vertical in-page lists. Wrap horizontal groups in <code>.nav__list</code>; stack sections with <code>.inpage-nav</code>. The <code>.header-nav</code> pattern adds logo, main links, and an optional actions slot (buttons).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Item</td><td><code>.nav-item</code></td><td>Nav link (8px padding, 12px gap)</td></tr>
              <tr><td>Icon</td><td><code>.nav-item__icon</code></td><td>Optional 20px icon (often trailing)</td></tr>
              <tr><td>Selected</td><td><code>.nav-item--selected</code></td><td>Active item (action color)</td></tr>
              <tr><td>List</td><td><code>.nav__list</code></td><td>Horizontal <code>&lt;ul&gt;</code> in header</td></tr>
              <tr><td>In-page</td><td><code>.inpage-nav</code></td><td>Vertical stack of <code>.nav-item</code></td></tr>
              <tr><td>Header</td><td><code>.header-nav</code></td><td>Logo + nav + actions row</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Icons</strong>, optional <code>nav-item__icon</code> via <code>ph()</code> (Phosphor in this doc).</li>
          <li><strong>Buttons</strong>, header actions use <a href="/docs/buttons">Buttons</a> (<code>.btn--transparent</code>, <code>.btn--primary</code>).</li>
        </ul>

        <h2 id="nav-states">Nav item states</h2>
        <p>Each item is an <code>&lt;a href="…"&gt;</code>. Doc-only <code>.nav-item--hover</code> previews hover color; live pages use <code>:hover</code> and <code>:focus-visible</code>. Selected uses <code>aria-current</code> plus <code>.nav-item--selected</code> when you need the spec modifier.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${NAV_STATES_SPEC}
          </div>
        </div>

        <h2 id="structure">Structure</h2>
        <p>Horizontal header links belong in <code>&lt;ul class="nav__list"&gt;</code> inside a labeled <code>&lt;nav&gt;</code>. Vertical section links use <code>.inpage-nav</code> without a list (anchors only).</p>
        ${pdocSnippet(
          `<nav aria-label="Main navigation">
  <ul class="nav__list">
    <li><a href="/docs" class="nav-item">Home</a></li>
    <li><a href="/docs/colors" class="nav-item nav-item--selected" aria-current="page">Colors</a></li>
  </ul>
</nav>`,
          'navigation.html',
          'html',
        )}

        <h2 id="inpage">In-page navigation</h2>
        <p>Simple vertical nav for jumping between sections on the same page. For multi-level side nav with rails, see <a href="/docs/anchor-inpage-nav">In-page anchors</a>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-nav-inpage-wrap">${INPAGE_NAV}</div>
          </div>
        </div>

        <h2 id="header">Header navigation</h2>
        <p>Desktop uses a <strong>three-column grid</strong> (<code>1fr auto 1fr</code>): logo at the start, links centered, optional actions at the end. Below <code>48rem</code> viewport width, links and buttons move into a drawer opened with <code>.header-nav__toggle</code>. Use <code>.header-nav--compact</code> only for doc previews or embedded narrow frames.</p>

        <h3 id="header-links">Logo + 3 links</h3>
        <div class="pdoc-demo pdoc-demo--header-nav" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${HEADER_LINKS_ONLY}
          </div>
        </div>

        <h3 id="header-cta">Logo + 3 links + button</h3>
        <div class="pdoc-demo pdoc-demo--header-nav" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${HEADER_WITH_CTA}
          </div>
        </div>

        <h3 id="header-search">Logo + 3 links + search + button</h3>
        <div class="pdoc-demo pdoc-demo--header-nav" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${HEADER_WITH_SEARCH}
          </div>
        </div>

        <h3 id="header-burger">Logo + burger (drawer)</h3>
        <p class="body-small pdoc-text-muted">Preview uses <code>.header-nav--compact</code> to show the mobile drawer. Open the menu icon; the panel stacks above the demo with a raised <code>z-index</code>.</p>
        <div class="pdoc-demo pdoc-demo--header-nav" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${HEADER_BURGER}
          </div>
        </div>

        ${pdocSnippet(
          `<header class="header-nav">
  <a href="/docs" class="header-nav__logo" aria-label="Home">…</a>
  <div class="header-nav__panel" id="app-header-nav">
    <nav class="header-nav__nav" aria-label="Main navigation">
      <ul class="nav__list">
        <li><a href="#about" class="nav-item">About</a></li>
        <li><a href="#service" class="nav-item" aria-current="page">Service</a></li>
        <li><a href="#portfolio" class="nav-item">Portfolio</a></li>
      </ul>
    </nav>
    <div class="header-nav__actions">
      <button type="button" class="btn btn--primary">Sign up</button>
    </div>
  </div>
</header>`,
          'header-nav.html',
          'html',
        )}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.nav-item</code></td><td>Nav link: inline flex, body text color, hover primary</td></tr>
              <tr><td><code>.nav-item--hover</code></td><td>Doc-only hover preview</td></tr>
              <tr><td><code>.nav-item--selected</code></td><td>Active item (action text color)</td></tr>
              <tr><td><code>.nav-item__icon</code></td><td>20px icon slot (currentColor)</td></tr>
              <tr><td><code>.nav__list</code></td><td>Horizontal flex list for header links</td></tr>
              <tr><td><code>.inpage-nav</code></td><td>Vertical column of full-width items</td></tr>
              <tr><td><code>.header-nav</code></td><td>Header bar grid (logo | nav | actions)</td></tr>
              <tr><td><code>.header-nav__panel</code></td><td>Wraps nav + actions (drawer on mobile)</td></tr>
              <tr><td><code>.header-nav__toggle</code></td><td>Burger control (visible below 48rem or with <code>--compact</code>)</td></tr>
              <tr><td><code>.header-nav--open</code></td><td>Drawer expanded (toggle with JS)</td></tr>
              <tr><td><code>.header-nav--compact</code></td><td>Force drawer layout (doc / narrow embed)</td></tr>
              <tr><td><code>.header-nav__logo</code></td><td>Brand mark slot (~25×32px)</td></tr>
              <tr><td><code>.header-nav__nav</code></td><td>Main link list landmark</td></tr>
              <tr><td><code>.header-nav__actions</code></td><td>Trailing buttons (full width in drawer)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'nav-tokens',
            title: 'Navigation spacing',
            body: 'Override item padding, list gap, and header spacing before importing components.',
            code: `@use "pimentcss-design-system" with (
  $nav-item-padding: 0.5rem,
  $nav-item-gap: 0.75rem,
  $nav-list-gap: 0.5rem,
  $header-nav-gap: 2rem,
  $header-nav-actions-gap: 0.75rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'nav-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _navigation.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Navigation landmarks</p>
          <ul>
            <li><strong>Landmark</strong>, wrap primary links in <code>&lt;nav aria-label="Main navigation"&gt;</code> (unique label per nav).</li>
            <li><strong>Current location</strong>, <code>aria-current="page"</code> on the active link; do not rely on color alone.</li>
            <li><strong>Focus</strong>, <code>:focus-visible</code> outline is built in; keep tab order logical (logo, links, actions).</li>
            <li><strong>Icons</strong>, trailing icons are decorative when text is visible; use <code>aria-hidden="true"</code>.</li>
            <li><strong>Logo link</strong>, <code>aria-label</code> on the home/logo anchor if there is no visible text.</li>
            <li><strong>Search</strong>, icon-only search needs <code>aria-label="Search"</code> on the button.</li>
            <li><strong>Mobile menu</strong>, sync <code>aria-expanded</code> on <code>.header-nav__toggle</code>; close on Escape and after link selection.</li>
            <li><strong>Skip link</strong>, pages with header nav should still offer skip to main content (see doc layout).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/link-breadcrumb"><p class="pdoc-card__title">Links &amp; breadcrumb</p><p class="pdoc-card__desc">Inline links and breadcrumb trail.</p></a>
          <a class="pdoc-card" href="/docs/menu-dropdown"><p class="pdoc-card__title">Menu &amp; dropdown</p><p class="pdoc-card__desc">Menus and disclosure panels.</p></a>
          <a class="pdoc-card" href="/docs/anchor-inpage-nav"><p class="pdoc-card__title">In-page anchors</p><p class="pdoc-card__desc">Multi-level section nav.</p></a>
          <a class="pdoc-card" href="/docs/tabs"><p class="pdoc-card__title">Tabs</p><p class="pdoc-card__desc">Tab list for switching views.</p></a>
        </div>`;
}
