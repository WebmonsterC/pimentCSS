import { GITHUB_CHANGELOG, GITHUB_README } from './github';

/** What's new / changelog page for the current major release. */
export function buildWhatsNewPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">Full changelog</p>
          <p>Machine-readable history lives in <a href="${GITHUB_CHANGELOG}" rel="noopener noreferrer" target="_blank">CHANGELOG.md<span class="pdoc-sr-only"> (opens in new tab)</span></a> on GitHub. This page summarizes <strong>v1.0</strong> for adopters.</p>
        </aside>

        <h2 id="release">PimentCSS v1.0</h2>
        <p><strong>1.0</strong> is the first stable release of PimentCSS as a design system from <a href="https://www.webmonster.tech" rel="noopener noreferrer" target="_blank">Webmonster<span class="pdoc-sr-only"> (opens in new tab)</span></a> and <a href="https://www.numera11y.fr" rel="noopener noreferrer" target="_blank">numera11y<span class="pdoc-sr-only"> (opens in new tab)</span></a>. It extends the upstream Piment-Css micro-framework with OKLCH tokens, a customizable Sass layer, documented components, and accessibility checks baked into the doc pipeline.</p>
        <ul class="pdoc-release-highlights">
          <li><strong>Ship fast</strong>: npm, CDN, or Sass <code>@use … with ()</code> (see <a href="/docs/installation">Installation</a>).</li>
          <li><strong>Theme safely</strong>: semantic <code>--surface-*</code> / <code>--text-*</code> tokens with light and dark parity (<a href="/docs/colors">Colors</a>, <a href="/docs/theme-toggle">Theme toggle</a>).</li>
          <li><strong>Compose pages</strong>: <a href="/docs/patterns">Patterns</a> recipes plus slots, forms, navigation, and feedback components.</li>
          <li><strong>Verify a11y</strong>: RGAA/WCAG AA guidance and focus/touch targets (<a href="/docs/a11y">Accessibility guide</a>).</li>
        </ul>

        <h2 id="foundations">Foundations</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Area</th><th>Highlights</th><th>Docs</th></tr></thead>
            <tbody>
              <tr><td>Color</td><td>OKLCH palettes, hex fallback, semantic swatches</td><td><a href="/docs/colors">Colors</a></td></tr>
              <tr><td>Type</td><td>Heading scale, body utilities, licensed font pipeline</td><td><a href="/docs/typography">Typography</a></td></tr>
              <tr><td>Layout</td><td><code>.container</code>, 12-column grid, spacing utilities</td><td><a href="/docs/layout">Layout</a></td></tr>
              <tr><td>Depth</td><td>Elevation shadows and z-index tokens</td><td><a href="/docs/depth">Depth &amp; shadows</a></td></tr>
              <tr><td>Modes</td><td><code>data-theme</code>, system preference, <code>.theme-toggle</code></td><td><a href="/docs/theme-toggle">Theme toggle</a></td></tr>
              <tr><td>Icons</td><td>Dimensioned slots, any SVG or icon font; Phosphor in docs only</td><td><a href="/docs/icons">Icons</a></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="components">Components</h2>
        <p>All documented classes are validated against <code>dist/pimentcss.css</code> (<code>npm run test:doc-classes</code>). Grouped by product area:</p>
        <ul>
          <li><strong>Forms</strong>: fields, selection controls, form layout, date picker, autocomplete.</li>
          <li><strong>Actions</strong>: buttons, button groups, links and breadcrumb.</li>
          <li><strong>Navigation</strong>: header nav, menus, tabs, pagination, in-page anchors, carousel.</li>
          <li><strong>Content</strong>: tables, lists, tree, badges, tags, keyline, placeholders.</li>
          <li><strong>Feedback</strong>: alerts, modals, cards, snackbar, progress, loader.</li>
        </ul>
        <p>New in v1 for page composition: <a href="/docs/patterns">Patterns</a> (contact form, toolbar + modal, table + pagination) and <a href="/docs/slots-layouts">Slots &amp; layouts</a>.</p>

        <h2 id="docs-site">Documentation site</h2>
        <ul>
          <li>Astro static site with live component previews and copyable snippets.</li>
          <li>Package manager tabs on Installation; Introduction quick paths (npm, Sass, a11y).</li>
          <li>Playwright UX tests (mobile, tablet, desktop) and axe WCAG 2.2 AA audits on doc pages.</li>
        </ul>

        <h2 id="migration">Coming from Piment-Css</h2>
        <p>PimentCSS v1 keeps the spirit of the upstream micro-framework but is a full design system release:</p>
        <ul>
          <li>Classes are <strong>unprefixed</strong> by default (<code>.btn</code>, not <code>.hm-btn</code>). Override <code>$prefix</code> in Sass if you need a namespace.</li>
          <li>Prefer <strong>semantic tokens</strong> over raw palette steps in custom CSS.</li>
          <li>See the comparison table in the repo <a href="${GITHUB_README}#relationship-with-piment-css" rel="noopener noreferrer" target="_blank">README<span class="pdoc-sr-only"> (opens in new tab)</span></a>.</li>
        </ul>

        <h2 id="next">After v1</h2>
        <p>Patch releases will note fixes in <a href="${GITHUB_CHANGELOG}" rel="noopener noreferrer" target="_blank">CHANGELOG.md<span class="pdoc-sr-only"> (opens in new tab)</span></a>. Minor releases will extend this page with a new <code>h2</code> section per version. For roadmap ideas, see <code>PROSPECTIVE.md</code> in the repository.</p>
        <div class="pdoc-cards pdoc-cards--3">
          <a class="pdoc-card" href="/docs/installation"><p class="pdoc-card__title">Installation</p><p class="pdoc-card__desc">npm, CDN, Sass compile, and verify.</p></a>
          <a class="pdoc-card" href="/docs/patterns"><p class="pdoc-card__title">Patterns</p><p class="pdoc-card__desc">Compose forms, feedback, and data views.</p></a>
          <a class="pdoc-card" href="/docs/customization"><p class="pdoc-card__title">Customization</p><p class="pdoc-card__desc">Sass variables and OKLCH token pipeline.</p></a>
        </div>`;
}
