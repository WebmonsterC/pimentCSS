import { pdocSnippet, pdocSteps } from './pdoc-html';
import { loadGeneratedPalettesGrid } from './generated-palettes';

type SemanticPair = {
  bg: string;
  fg?: string;
  pair: string;
  border?: boolean;
};

function semanticSwatch({ bg, fg, pair, border }: SemanticPair): string {
  const fgAttr = fg ? ` data-pdoc-semantic-fg="${fg}"` : '';
  const borderClass = border ? ' pdoc-semantic-swatch__chip--border' : '';
  const sample = border ? ', ' : 'Aa';
  return `<div class="pdoc-semantic-swatch" role="listitem" data-pdoc-semantic-bg="${bg}"${fgAttr}>
            <span class="pdoc-semantic-swatch__chip${borderClass}"><span class="pdoc-semantic-swatch__sample" aria-hidden="true">${sample}</span></span>
            <code>${bg}</code>
            <span class="pdoc-semantic-swatch__pair">${pair}</span>
            <span class="pdoc-semantic-swatch__ratio" hidden></span>
          </div>`;
}

const SEMANTIC_PAIRS: SemanticPair[] = [
  { bg: '--surface-page', fg: '--text-body', pair: '+ --text-body (body)' },
  { bg: '--surface-action', fg: '--text-on-action', pair: '+ --text-on-action (primary button)' },
  { bg: '--surface-elevated', fg: '--text-body', pair: '+ --text-body (card)' },
  { bg: '--surface-information', fg: '--text-on-information', pair: '+ --text-on-information' },
  { bg: '--surface-error', fg: '--text-error', pair: '+ --text-error (alert surface)' },
  { bg: '--error-100', fg: '--error-700', pair: '+ --error-700 (inline error)' },
  { bg: '--primary-600', fg: '--neutral-100', pair: '+ --neutral-100 (action step)' },
  { bg: '--border-default', pair: 'border token', border: true },
];

/** Full Colors page content (palettes + tokens + examples). */
export function buildColorsPageHtml(): string {
  const palettes = loadGeneratedPalettesGrid();
  const semanticGrid = SEMANTIC_PAIRS.map(semanticSwatch).join('\n          ');

  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Palette steps are tuned for light and dark semantics. Use <strong>semantic tokens</strong> in UI, verify pairs below (target <strong>≥ 4.5:1</strong> for normal text), and toggle light/dark in the header while reviewing swatches.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>PimentCSS uses a <strong>Caribbean / Antilles</strong> palette in <strong>OKLCH</strong> (<code>tokens/colors.css</code>), mapped to components through <strong>semantic variables</strong> (<code>tokens/semantic.css</code>). Each step exposes a CSS variable and a preview class <code>.palette__chip--*</code>.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Palette</th><th>Role</th><th>Default step</th></tr></thead>
            <tbody>
              <tr><td><code>primary</code></td><td>Lagoon teal, actions, links, focus</td><td><code>600</code></td></tr>
              <tr><td><code>accent</code></td><td>Sunset mango, highlights</td><td><code>500</code></td></tr>
              <tr><td><code>neutral</code></td><td>Warm sand / night, surfaces &amp; text</td><td><code>500</code></td></tr>
              <tr><td><code>information</code></td><td>Lagoon cyan, info UI</td><td><code>500</code></td></tr>
              <tr><td><code>success</code> / <code>warning</code> / <code>error</code></td><td>Feedback states</td><td><code>500</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a> (npm, CDN, or Sass).</li>
          <li><strong>OKLCH support</strong>, modern browsers; hex fallbacks ship when <code>$enable-hex-fallback</code> is on.</li>
          <li><strong>Color mode</strong>, set <code>data-theme</code> on <code>&lt;html&gt;</code> or use the doc header toggle to validate dark semantics.</li>
        </ul>

        <h2 id="canonical-tokens">Canonical tokens</h2>
        <p>Edit <code>tokens/colors.css</code> for palette steps, then <code>tokens/semantic.css</code> for how components consume them. Regenerate preview CSS with <code>npm run generate:palettes</code>.</p>
        ${pdocSnippet(
          `/* tokens/colors.css, primary lagoon */
:root {
  --primary-600: oklch(48% 0.13 195);
  --primary-default: var(--primary-600);
}

/* tokens/semantic.css, light mode */
:root {
  --surface-action: var(--primary-600);
  --text-on-action: var(--neutral-100);
}`,
          'tokens',
          'css',
        )}

        <h2 id="semantic">Semantic contrast pairs</h2>
        <p>Prefer these tokens in components. Each card shows background + foreground with a live <strong>contrast ratio</strong> (WCAG 2.2 / RGAA: ≥ <strong>4.5:1</strong> for normal text). Failed pairs are outlined in red, adjust semantics, not only raw palette steps.</p>
        <div class="pdoc-semantic-grid" role="list" aria-label="Semantic color contrast pairs">
          ${semanticGrid}
        </div>

        <h2 id="palettes">OKLCH palettes</h2>
        <p>Every swatch lists its <strong>OKLCH</strong> value (canonical source). CSS variable: <code>--{palette}-{step}</code>. Preview class: <code>.palette__chip--{palette}-{step}</code>.</p>
        <div class="pdoc-palettes-shell" data-pdoc-skip>
          ${palettes}
        </div>
        <p class="pdoc-muted-note">Steps <strong>100–300</strong> suit backgrounds; <strong>600–900</strong> for text on light surfaces. Re-check after theme changes.</p>

        <h2 id="usage">Usage in CSS</h2>
        <p>Use semantic variables in components; reserve raw steps for illustrations or charts.</p>
        ${pdocSnippet(
          `.card {
  background: var(--surface-elevated);
  color: var(--text-body);
  border: 1px solid var(--border-default);
}

.btn-brand {
  background: var(--surface-action);
  color: var(--text-on-action);
}

.badge-info {
  background: var(--surface-information);
  color: var(--text-on-information);
}`,
          'components.css',
          'css',
        )}
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            <p class="body-medium body-medium--semibold pdoc-demo__eyebrow">Live components</p>
            <div class="pdoc-demo-row pdoc-demo-row--start">
              <button type="button" class="btn btn--primary focus-visible">Primary action</button>
              <span class="tag tag--information">
                <span class="tag__label">Information</span>
              </span>
              <div class="alert alert--success" role="status">
                <div>
                  <p class="alert__title">Success</p>
                  <p class="alert__body">Semantic colors applied.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="pdoc-demo__code" data-lang="html"><pre><code></code></pre></div>
        </div>

        <h2 id="generation">Generate &amp; build</h2>
        ${pdocSteps([
          {
            id: 'edit-source',
            title: 'Edit palette source',
            body: '<p>Update OKLCH values in <code>tokens/colors.css</code>. Keep light and dark semantic mappings aligned.</p>',
            code: '# tokens/colors.css',
            label: 'Editor',
            lang: 'text',
          },
          {
            id: 'regenerate-palettes',
            title: 'Regenerate palettes & docs',
            body: '<p>Refreshes <code>styles/palettes.css</code>, swatch HTML, and Sass palette maps.</p>',
            code: 'npm run generate:palettes',
            label: 'Terminal',
            lang: 'bash',
          },
          {
            id: 'rebuild-css',
            title: 'Rebuild distribution CSS',
            body: '<p>Produces <code>dist/pimentcss.min.css</code> for npm and the documentation site.</p>',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Contrast checklist</p>
          <ul>
            <li><strong>Normal text</strong>, ratio ≥ 4.5:1 (AA). Large text (≥ 18px regular or 14px bold) may use 3:1.</li>
            <li><strong>Non-text UI</strong>, focus rings and control borders ≥ 3:1 against adjacent colors (WCAG 1.4.11).</li>
            <li><strong>Do not rely on hue alone</strong>, pair color with weight, icons, or copy (RGAA thématique 3).</li>
            <li><strong>Test both modes</strong>, toggle light/dark; semantics in <code>tokens/semantic.css</code> must pass in each.</li>
          </ul>
        </div>
        <p>See the full guide on <a href="/docs/a11y">Accessibility</a>. Customize tokens on <a href="/docs/customization">Customization</a>.</p>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/customization"><p class="pdoc-card__title">Customization</p><p class="pdoc-card__desc">Override Sass variables and regenerate palettes.</p></a>
          <a class="pdoc-card" href="/docs/theme-toggle"><p class="pdoc-card__title">Theme toggle</p><p class="pdoc-card__desc">Switch <code>data-theme</code> in your shell.</p></a>
          <a class="pdoc-card" href="/docs/typography"><p class="pdoc-card__title">Typography</p><p class="pdoc-card__desc">Zodiak &amp; Plus Jakarta Sans scale.</p></a>
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Primary, secondary, and focus styles.</p></a>
        </div>`;
}
