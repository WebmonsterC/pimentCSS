import { pdocPackageTabs, pdocSnippet, pdocSteps } from './pdoc-html';
import { buildIntroPageHtml } from './intro-content';
import { buildInstallationPageHtml } from './installation-content';
import { buildLayoutPageHtml } from './layout-content';
import { buildTypographyPageHtml } from './typography-content';
import { buildWhatsNewPageHtml } from './whats-new-content';
import { buildIconsPageHtml } from './icons-content';

/** Static page HTML (installation, customization, etc.) */
export const STATIC_CONTENT: Record<string, string> = {
  intro: buildIntroPageHtml(),

  'whats-new': buildWhatsNewPageHtml(),

  icons: buildIconsPageHtml(),

  installation: buildInstallationPageHtml(),

  customization: `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">Already using the default CSS?</p>
          <p>You only need this page if you compile a <strong>custom theme</strong> or edit canonical tokens. Otherwise keep <code>dist/pimentcss.min.css</code> from <a href="/docs/installation">Installation</a>.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>PimentCSS is customizable at three levels, often combined:</p>
        <ul>
          <li><strong>Sass <code>@use … with ()</code></strong>, typography, spacing, radii, semantic aliases (<code>$surface-action</code>, <code>$text-body</code>, …).</li>
          <li><strong>Partial Sass entry points</strong>, <code>pimentcss-design-system/core</code> (tokens + layout + utilities) and <code>pimentcss-design-system/components</code> (UI).</li>
          <li><strong>Canonical CSS tokens</strong>, edit <code>tokens/colors.css</code> (OKLCH palettes) and regenerate build artifacts.</li>
        </ul>
        <p>All Sass knobs live in <code>scss/abstracts/_variables.scss</code> with the <code>!default</code> flag, so you override only what you need.</p>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>Sass ^1.69</strong>, <code>npm install -D sass</code> in your app (or use the CLI: <code>npx sass</code>).</li>
          <li><strong>Installed package</strong>, <code>pimentcss-design-system</code> in <code>node_modules</code> (see <a href="/docs/installation">Installation</a>).</li>
          <li><strong>Licensed fonts (optional)</strong>, place Zodiak + Plus Jakarta Sans in <code>fonts/</code>, run <code>npm run build:fonts</code> (see <code>fonts/README.md</code> in the repo).</li>
          <li><strong>Palette pipeline</strong>, only if you change <code>tokens/colors.css</code>: run scripts from the PimentCSS repo or copy updated <code>styles/palettes.css</code>.</li>
        </ul>

        <h2 id="sass-theme">Custom theme with Sass</h2>
        <p>Create a single entry file (for example <code>src/styles/theme.scss</code>) and pass overrides to the main bundle.</p>
        ${pdocSnippet(
          `// src/styles/theme.scss
@use "pimentcss-design-system" with (
  $prefix: hm,
  $font-family-heading: "Zodiak", Georgia, serif,
  $font-family-body: "Plus Jakarta Sans", system-ui, sans-serif,
  $btn-min-height: 2.75rem,
  $border-radius-8: 0.5rem,
  $surface-action: #0f766e,
  $surface-action-hover: #0c5f59,
  $text-action: #0c5f59,
);`,
          'theme.scss',
          'scss',
        )}
        <p>Import the compiled CSS once in your app (bundler or <code>&lt;link&gt;</code> after build).</p>
        ${pdocSnippet(
          `// main.ts (Vite, webpack, …)
import "./styles/theme.css";`,
          'main.ts',
          'js',
        )}

        <h2 id="compile-theme">Compile your theme</h2>
        <p>From your project root, compile the Sass entry to CSS. Watch mode is handy while tuning tokens.</p>
        ${pdocPackageTabs([
          { id: 'npx', label: 'npx', code: 'npx sass src/styles/theme.scss src/styles/theme.css' },
          { id: 'watch', label: 'Watch', code: 'npx sass src/styles/theme.scss src/styles/theme.css --watch' },
          { id: 'npm', label: 'npm script', code: 'npm run build:css' },
        ])}
        <p class="pdoc-muted-note">Add a script in your <code>package.json</code>: <code>"build:css": "sass src/styles/theme.scss src/styles/theme.css --style=compressed"</code>.</p>

        <h2 id="partial-imports">Partial imports</h2>
        <p>Ship a smaller CSS bundle when you only need foundations or only components (components expect core tokens to exist).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Entry</th><th>Includes</th><th>When to use</th></tr></thead>
            <tbody>
              <tr><td><code>pimentcss-design-system</code></td><td>Full bundle (default)</td><td>Most apps, all <code>component classes</code> components</td></tr>
              <tr><td><code>pimentcss-design-system/core</code></td><td>Tokens, layout, utilities</td><td>Custom UI kit, only design tokens + grid</td></tr>
              <tr><td><code>pimentcss-design-system/components</code></td><td>All components</td><td>After <code>core</code>, buttons, forms, nav, …</td></tr>
            </tbody>
          </table>
        </div>
        ${pdocSnippet(
          `// lean.scss, foundations only
@use "pimentcss-design-system/core";

// full-ui.scss, tokens + components
@use "pimentcss-design-system/core";
@use "pimentcss-design-system/components";`,
          'app.scss',
          'scss',
        )}

        <h2 id="css-tokens">OKLCH color tokens</h2>
        <p>Reference palettes are defined in <code>tokens/colors.css</code> (Caribbean / Antilles hues). Semantic surfaces and text map through <code>tokens/semantic.css</code>.</p>
        ${pdocSteps([
          {
            id: 'edit-colors',
            title: 'Edit palette source',
            body: '<p>Adjust OKLCH steps (<code>--primary-*</code>, <code>--accent-*</code>, …) in <code>tokens/colors.css</code>. Keep contrast in mind for light and dark semantics.</p>',
            code: '/* tokens/colors.css */\n:root {\n  --primary-600: oklch(48% 0.13 195);\n  /* … */\n}',
            label: 'colors.css',
            lang: 'css',
          },
          {
            id: 'regenerate',
            title: 'Regenerate artifacts',
            body: '<p>From the PimentCSS repository (or a fork), refresh generated files and the published CSS.</p>',
            code: 'npm run generate:palettes\nnpm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
          {
            id: 'consume-tokens',
            title: 'Use in your app',
            body: '<p>Either depend on a new <code>pimentcss-design-system</code> release, or copy <code>dist/pimentcss.min.css</code> / token files into your pipeline.</p>',
            code: 'import "pimentcss-design-system/tokens/colors.css";\n/* or link/dist copy after build */',
            label: 'app.css',
            lang: 'css',
          },
        ])}
        <p>Preview swatches on the <a href="/docs/colors">Colors</a> page after rebuild. The doc site loads <code>palettes.css</code> for preview classes.</p>

        <h2 id="semantic-tokens">Semantic tokens (light / dark)</h2>
        <p>Components consume semantic variables (<code>--surface-page</code>, <code>--text-body</code>, <code>--border-default</code>), not raw palette steps. Defaults live in <code>tokens/semantic.css</code> with <code>[data-theme="dark"]</code> and <code>prefers-color-scheme</code> overrides, tuned for <strong>RGAA / WCAG AA</strong>.</p>
        ${pdocSnippet(
          `/* Optional: extend in your global CSS after pimentcss */
:root {
  --surface-page: var(--neutral-100);
}
[data-theme="dark"] {
  --surface-page: var(--neutral-900);
}`,
          'overrides.css',
          'css',
        )}
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Accessibility</p>
          <p>When changing palette steps, re-check pairs on <a href="/docs/colors">Colors</a> (semantic swatches) and <a href="/docs/a11y">Accessibility</a>. Prefer adjusting semantics, not only raw hues.</p>
        </div>

        <h2 id="prefix-flags">Prefix and feature flags</h2>
        <p>Rename the <code>.</code> namespace or toggle optional features at compile time.</p>
        ${pdocSnippet(
          `@use "pimentcss-design-system" with (
  $prefix: app,              // .app-btn, .app-container, …
  $enable-local-fonts: true,
  $enable-google-fonts: false,
  $enable-fontshare-fonts: false,
  $enable-dark-theme: true,
  $enable-hex-fallback: true,
);`,
          'flags.scss',
          'scss',
        )}

        <h2 id="color-modes">Light and dark mode</h2>
        <p>Set an explicit mode on the document root, or let the system preference apply when no attribute is set.</p>
        ${pdocSnippet(
          `<html lang="en" data-theme="light">
  <link rel="stylesheet" href="/docs/theme.css" />
  …
</html>`,
          'index.html',
          'html',
        )}
        <p>Add <a href="/docs/theme-toggle">Theme toggle</a> (<code>.theme-toggle</code>) in your header, or sync <code>data-theme</code> with your router / storage. See <code>docs-site/src/lib/theme.ts</code> in the repo for a minimal reference implementation.</p>

        <h2 id="local-repo">Customize from a PimentCSS clone</h2>
        <p>Contributors working inside this repository can iterate without publishing to npm.</p>
        ${pdocSnippet(
          `// scss/custom.example.scss (local)
@use "./pimentcss" with (
  $font-family-heading: "Zodiak", Georgia, serif,
  $surface-action: #0f766e,
);

// npm run build:css   → dist/pimentcss.css
// npm run docs        → docs-site with hot reload`,
          'custom.example.scss',
          'scss',
        )}

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/colors"><p class="pdoc-card__title">Colors</p><p class="pdoc-card__desc">OKLCH palettes, semantic pairs, and contrast swatches.</p></a>
          <a class="pdoc-card" href="/docs/typography"><p class="pdoc-card__title">Typography</p><p class="pdoc-card__desc">Heading scale and body utilities.</p></a>
          <a class="pdoc-card" href="/docs/theme-toggle"><p class="pdoc-card__title">Theme toggle</p><p class="pdoc-card__desc">Light / dark switch for your shell.</p></a>
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">See your theme on interactive components.</p></a>
        </div>`,

  typography: buildTypographyPageHtml(),

  layout: buildLayoutPageHtml(),
};
