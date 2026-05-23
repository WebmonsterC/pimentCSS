import { pdocSnippet, pdocSteps } from './pdoc-html';

const LIVE_UI_MARKUP = `<div class="pdoc-live-ui">
  <div class="input">
    <label class="label" for="typo-live-email">
      <span class="label__text">Email</span>
    </label>
    <div class="field">
      <input class="field__input" id="typo-live-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" />
    </div>
    <p class="input__hint">We never share your address.</p>
  </div>
  <button type="button" class="btn btn--primary focus-visible">Save changes</button>
  <div class="alert alert--information" role="status">
    <div>
      <p class="alert__title">Typography</p>
      <p class="alert__body">Titles and body styles come from the same token set.</p>
    </div>
  </div>
</div>`;

/** Full Typography page (Foundations). */
export function buildTypographyPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">Self-hosted fonts</p>
          <p>Headings use <strong>Zodiak Bold (700)</strong> and UI copy uses <strong>Plus Jakarta Sans</strong>. Place licensed files in <code>fonts/</code> and run <code>npm run build:fonts</code>, see <code>fonts/README.md</code> and <a href="/docs/installation">Installation</a>.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>The Antilles pairing separates <strong>display</strong> (Zodiak, serif) from <strong>interface</strong> (Plus Jakarta Sans, sans-serif). Sizes, line heights, and letter-spacing are exposed as CSS variables and <code>component classes</code> utility classes, the same tokens power buttons, forms, and alerts.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Role</th><th>Family</th><th>Typical use</th></tr></thead>
            <tbody>
              <tr><td>Headings</td><td><code>--font-family-heading</code></td><td>Page titles, section titles, marketing hero</td></tr>
              <tr><td>Body / UI</td><td><code>--font-family-body</code></td><td>Paragraphs, labels, buttons, tables</td></tr>
              <tr><td>Weights</td><td><code>400</code> · <code>600</code> · <code>700</code></td><td>Body, emphasis, headings &amp; labels</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS stylesheet</strong>, <a href="/docs/installation">Installation</a> (imports typography tokens automatically).</li>
          <li><strong>Font files (recommended)</strong>, <code>npm run build:fonts</code> for local woff2; otherwise CDN fallbacks apply.</li>
          <li><strong>Semantic text colors</strong>, pair type with <code>--text-heading</code>, <code>--text-body</code>, <code>--text-muted</code> from <a href="/docs/colors">Colors</a>.</li>
        </ul>

        <h2 id="tokens">CSS tokens</h2>
        <p>Canonical definitions live in <code>tokens/typography.css</code> (compiled from <code>scss/tokens/_typography.scss</code>). Override Sass variables before <code>@use "pimentcss-design-system"</code>, see <a href="/docs/customization">Customization</a>.</p>
        ${pdocSnippet(
          `:root {
  --font-family-heading: "Zodiak", Georgia, serif;
  --font-family-body: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
  --font-size-heading-h1: 3.75rem;
  --line-height-heading-h1: 4.5rem;
  --font-size-body-medium: 1rem;
  --line-height-body-medium: 1.6rem;
}`,
          'tokens/typography.css',
          'css',
        )}

        <h2 id="heading-scale">Heading scale</h2>
        <p>Apply <code>.heading-h1</code> … <code>.heading-h6</code> on any element (usually <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code>). Negative letter-spacing keeps large display type tight.</p>
        <div class="pdoc-type-scale" data-pdoc-skip>
          <div class="pdoc-type-scale__row">
            <p class="heading-h1">Heading H1, 3.75rem</p>
            <span class="pdoc-type-scale__meta"><code>.heading-h1</code> · lh 4.5rem</span>
          </div>
          <div class="pdoc-type-scale__row">
            <p class="heading-h2">Heading H2, 3rem</p>
            <span class="pdoc-type-scale__meta"><code>.heading-h2</code> · lh 3.6rem</span>
          </div>
          <div class="pdoc-type-scale__row">
            <p class="heading-h3">Heading H3, 2.5rem</p>
            <span class="pdoc-type-scale__meta"><code>.heading-h3</code> · lh 3rem</span>
          </div>
          <div class="pdoc-type-scale__row">
            <p class="heading-h4">Heading H4, 2rem</p>
            <span class="pdoc-type-scale__meta"><code>.heading-h4</code> · lh 2.4rem</span>
          </div>
          <div class="pdoc-type-scale__row">
            <p class="heading-h5">Heading H5, 1.5rem</p>
            <span class="pdoc-type-scale__meta"><code>.heading-h5</code> · lh 1.8rem</span>
          </div>
          <div class="pdoc-type-scale__row">
            <p class="heading-h6">Heading H6, 1.25rem</p>
            <span class="pdoc-type-scale__meta"><code>.heading-h6</code> · lh 1.5rem</span>
          </div>
        </div>
        ${pdocSnippet(
          `<h1 class="heading-h1">Dashboard</h1>
<h2 class="heading-h3">Recent activity</h2>
<p class="body-medium">Your team shipped 12 updates this week.</p>`,
          'page.html',
          'html',
        )}

        <h2 id="body-scale">Body scale</h2>
        <p>Three body steps cover UI density: <strong>small</strong> (metadata), <strong>medium</strong> (default), <strong>large</strong> (intro / lead). Add <code>.body-medium--semibold</code> for emphasis without changing size.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-demo-stack">
              <p class="body-large">Body large, lead paragraph or short intro.</p>
              <p class="body-medium">Body medium, default copy in forms, tables, and buttons.</p>
              <p class="body-medium body-medium--semibold">Body medium semibold, inline emphasis.</p>
              <p class="body-small">Body small, captions, footnotes, helper text.</p>
            </div>
          </div>
        </div>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Size</th><th>Line height</th></tr></thead>
            <tbody>
              <tr><td><code>.body-small</code></td><td>0.75rem (12px)</td><td>1.3125rem</td></tr>
              <tr><td><code>.body-medium</code></td><td>1rem (16px)</td><td>1.6rem</td></tr>
              <tr><td><code>.body-large</code></td><td>1.25rem (20px)</td><td>2rem</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="semantic-text">Semantic text colors</h2>
        <p>Always set color with semantic tokens so light/dark modes stay readable (RGAA / WCAG).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <div class="pdoc-demo-stack">
              <p class="heading-h4">Heading, uses --text-headings</p>
              <p class="body-medium">Body, uses --text-body (default on .body-*).</p>
              <p class="body-small pdoc-text-muted">Muted, --text-muted</p>
              <p class="body-medium"><a href="#" class="pdoc-text-action">Action link, --text-action</a></p>
            </div>
          </div>
        </div>

        <h2 id="caption">Caption tokens</h2>
        <p>Labels and helper text use caption tokens (<code>--font-size-caption</code>) inside components such as <code>.label</code> and field hints, no separate utility class required.</p>
        ${pdocSnippet(
          `<div class="input">
  <label class="label" for="email">
    <span class="label__text">Email</span>
  </label>
  <div class="field">
    <input class="field__input" id="email" type="email" />
  </div>
  <p class="input__hint">Helper uses caption tokens.</p>
</div>`,
          'field.html',
          'html',
        )}

        <h2 id="patterns">Composition patterns</h2>
        <p>Combine heading + body utilities with layout tokens. Long-form copy should respect <code>--copy-block-max-width</code> (33rem) for comfortable line length.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <article class="pdoc-copy-block">
              <h2 class="heading-h2">Welcome back</h2>
              <p class="body-large">Track shipments across the Caribbean hub.</p>
              <p class="body-medium">PimentCSS maps typography to semantic colors. Toggle dark mode in the header to verify contrast.</p>
              <p class="body-small pdoc-text-muted">Last updated · 21 May 2026</p>
            </article>
          </div>
        </div>

        <h2 id="in-components">Typography in components</h2>
        <p>Buttons, alerts, and form labels inherit body tokens automatically. Use the <strong>Input</strong> block (<code>.input</code> → <code>.label</code> + <code>.field</code> + optional <code>.input__hint</code>), not <code>class="input"</code> on the <code>&lt;input&gt;</code> itself. Place the <strong>primary action below</strong> the field group for a clear tab order (label → field → hint → button).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LIVE_UI_MARKUP}
          </div>
        </div>

        <h2 id="sass">Sass customization</h2>
        <p>Override families and scale before compiling your theme.</p>
        ${pdocSnippet(
          `@use "pimentcss-design-system" with (
  $font-family-heading: "Zodiak", Georgia, serif,
  $font-family-body: "Plus Jakarta Sans", system-ui, sans-serif,
  $font-size-heading-h1: 3.25rem,
  $font-size-body-medium: 1rem,
  $enable-local-fonts: true,
);`,
          'theme.scss',
          'scss',
        )}

        <h2 id="accessibility">Accessibility</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Readable type</p>
          <ul>
            <li><strong>Real headings</strong>, use <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code> with utility classes; do not skip levels for styling only.</li>
            <li><strong>Line length</strong>, keep paragraphs near <code>--copy-block-max-width</code> (≈ 66 characters).</li>
            <li><strong>Contrast</strong>, <code>--text-body</code> on <code>--surface-page</code> is validated on <a href="/docs/colors">Colors</a>; test dark mode.</li>
            <li><strong>Zoom</strong>, sizes are in <code>rem</code>; respect user font scaling (up to 200%).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/colors"><p class="pdoc-card__title">Colors</p><p class="pdoc-card__desc">Semantic text and surface pairs for type.</p></a>
          <a class="pdoc-card" href="/docs/layout"><p class="pdoc-card__title">Layout</p><p class="pdoc-card__desc">Container, grid, and spacing utilities.</p></a>
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Type inside actions and states.</p></a>
          <a class="pdoc-card" href="/docs/customization"><p class="pdoc-card__title">Customization</p><p class="pdoc-card__desc">Sass variables and local fonts.</p></a>
        </div>`;
}
