import { pdocPackageTabs, pdocSnippet, pdocSteps, type PdocSnippetOptions } from './pdoc-html';
import { NPM_CDN_JSdelivr, NPM_CDN_UNPKG, NPM_PACKAGE_NAME } from './npm-package';

/** Installation is a reference page: keep all snippets open by default. */
const SNIPPET_OPEN: PdocSnippetOptions = { expanded: true };

const VERIFY_DEMO = `<div class="pdoc-install-verify">
  <p class="body-small pdoc-text-muted">Preview (uses the same CSS as this site)</p>
  <button type="button" class="btn btn--primary focus-visible">It works</button>
</div>`;

/** Full Installation page (Getting started). */
export function buildInstallationPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>After install, confirm <strong>visible focus</strong> on buttons (<code>:focus-visible</code>, 3px ring) and semantic contrast on primary actions. See <a href="/docs/colors">Colors</a> for token pairs in light and dark mode.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>PimentCSS ships as one compiled stylesheet plus optional Sass entry points. Pick a path below, load CSS once, and use component classes (for example <code>.btn</code>, <code>.field</code>). No runtime JavaScript is required for styling.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Path</th><th>Best for</th><th>Output</th></tr></thead>
            <tbody>
              <tr><td><a href="#npm"><strong>npm / pnpm / yarn</strong></a></td><td>Vite, webpack, Parcel, Node apps</td><td><code>node_modules/pimentcss-design-system/dist/pimentcss.min.css</code></td></tr>
              <tr><td><a href="#cdn"><strong>CDN</strong></a></td><td>Prototypes, static HTML, CodePen</td><td>Hosted <code>pimentcss.min.css</code></td></tr>
              <tr><td><a href="#sass"><strong>Sass theme</strong></a></td><td>Brand tokens, partial imports</td><td>Your compiled <code>theme.css</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>Package manager</strong> (npm, pnpm, or yarn) for the npm path only.</li>
          <li><strong>Sass ^1.69</strong> (optional) when you compile a custom theme.</li>
          <li><strong>Fonts (recommended)</strong>: Zodiak Bold + Plus Jakarta Sans in <code>fonts/</code>, then <code>npm run build:fonts</code> before <code>build:css</code> in this repo. See <code>fonts/README.md</code>. Without files, CDN fallbacks apply.</li>
          <li><strong>Modern browsers</strong> with OKLCH and <code>color-scheme</code> support. Details on <a href="/docs/a11y">Accessibility</a>.</li>
        </ul>

        <h2 id="quick-start">Quick start (npm)</h2>
        <p>Fastest path for most projects: install the package, import CSS once, add a button to verify.</p>
        ${pdocSteps([
          {
            id: 'step-install',
            title: 'Install',
            body: `Add <code>${NPM_PACKAGE_NAME}</code> to your project. The <code>style</code> export points at <code>dist/pimentcss.min.css</code>.`,
            code: `npm install ${NPM_PACKAGE_NAME}`,
            label: 'Terminal',
            lang: 'bash',
          },
          {
            id: 'step-import',
            title: 'Import CSS',
            body: 'Import once at application startup (bundler entry or global CSS).',
            code: `import "${NPM_PACKAGE_NAME}";`,
            label: 'main.ts',
            lang: 'js',
          },
          {
            id: 'step-verify',
            title: 'Verify',
            body: 'Add a primary button. In DevTools → Computed, check <code>--surface-action</code> on the button and tab to see the focus ring.',
            code: '<button type="button" class="btn btn--primary">It works</button>',
            label: 'Markup',
            lang: 'html',
          },
        ])}

        <h2 id="npm">Install with npm, pnpm, or yarn</h2>
        <p>Install the published package, then import the minified CSS in your bundler entry.</p>
        <h3 id="npm-install">Install the package</h3>
        ${pdocPackageTabs([
          { id: 'npm', label: 'npm', code: `npm install ${NPM_PACKAGE_NAME}` },
          { id: 'pnpm', label: 'pnpm', code: `pnpm add ${NPM_PACKAGE_NAME}` },
          { id: 'yarn', label: 'Yarn', code: `yarn add ${NPM_PACKAGE_NAME}` },
        ])}
        <h3 id="npm-import">Import in your bundler</h3>
        <p>Use the package root or the explicit file path.</p>
        ${pdocSnippet(
          `import "${NPM_PACKAGE_NAME}";
// or
import "${NPM_PACKAGE_NAME}/dist/pimentcss.min.css";`,
          'main.ts',
          'js',
          SNIPPET_OPEN,
        )}

        <h2 id="cdn">CDN (no build step)</h2>
        <p>For static pages or quick experiments, load the minified file from a public CDN. Pin an exact version in production.</p>
        ${pdocSnippet(
          `<link
  rel="stylesheet"
  href="${NPM_CDN_JSdelivr}"
/>
<!-- Alternative: ${NPM_CDN_UNPKG} -->`,
          'index.html',
          'html',
          SNIPPET_OPEN,
        )}
        <p class="pdoc-muted-note">Replace <code>@1</code> with a fixed semver (for example <code>@1.0.1</code>) so upgrades stay predictable.</p>

        <h2 id="static-html">Static HTML (local file)</h2>
        <p>After <code>npm install</code>, link the file from <code>node_modules</code> or copy <code>dist/pimentcss.min.css</code> into your assets folder.</p>
        ${pdocSnippet(
          `<link rel="stylesheet" href="node_modules/pimentcss-design-system/dist/pimentcss.min.css" />
<button type="button" class="btn btn--primary focus-visible">
  Submit
</button>`,
          'index.html',
          'html',
          SNIPPET_OPEN,
        )}

        <h2 id="sass">Sass theme (optional)</h2>
        <p>Override <code>!default</code> variables, then compile your own CSS. See <a href="/docs/customization">Customization</a> for partial imports and the OKLCH token pipeline.</p>
        ${pdocSnippet(
          `// my-theme.scss
@use "${NPM_PACKAGE_NAME}" with (
  $font-family-heading: "Inter", system-ui, sans-serif,
  $btn-min-height: 2.75rem,
  $surface-action: #0f766e,
);

// npx sass my-theme.scss dist/my-theme.css`,
          'my-theme.scss',
          'scss',
          SNIPPET_OPEN,
        )}
        <div class="pdoc-callout pdoc-callout--tip">
          <p class="pdoc-callout__title">Peer dependency</p>
          <p>Sass <code>^1.69</code> is optional. Install it only when you compile a theme: <code>npm install -D sass</code>.</p>
        </div>

        <h2 id="verify">Verify the install</h2>
        <p>Confirm fonts, OKLCH surfaces, and focus styles. Toggle light/dark in the header while checking the button below.</p>
        <div class="pdoc-demo" data-pdoc-demo data-pdoc-code-expanded="true">
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${VERIFY_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<button type="button" class="btn btn--primary focus-visible">It works</button>`,
          'Markup',
          'html',
          SNIPPET_OPEN,
        )}

        <h2 id="exports">Package exports</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Import</th><th>What you get</th></tr></thead>
            <tbody>
              <tr><td><code>${NPM_PACKAGE_NAME}</code></td><td>Full CSS bundle (default)</td></tr>
              <tr><td><code>${NPM_PACKAGE_NAME}/core</code></td><td>Tokens, layout, utilities (Sass only)</td></tr>
              <tr><td><code>${NPM_PACKAGE_NAME}/components</code></td><td>UI components (Sass, after core)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="accessibility">Accessibility</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">After install</p>
          <ul>
            <li>Use <code>.focus-visible</code> or native <code>:focus-visible</code> on custom controls (3px ring via <code>--focus-ring</code>).</li>
            <li>Prefer semantic tokens (<code>--text-body</code> on <code>--surface-page</code>) over raw palette steps in UI.</li>
            <li>Respect <code>prefers-reduced-motion</code> (see <code>tokens/a11y.css</code>).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/customization"><p class="pdoc-card__title">Customization</p><p class="pdoc-card__desc">Sass variables, partial imports, and CSS tokens.</p></a>
          <a class="pdoc-card" href="/docs/colors"><p class="pdoc-card__title">Colors</p><p class="pdoc-card__desc">OKLCH palettes and semantic surfaces.</p></a>
          <a class="pdoc-card" href="/docs/theme-toggle"><p class="pdoc-card__title">Theme toggle</p><p class="pdoc-card__desc">Light / dark with <code>data-theme</code>.</p></a>
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Variants, states, and the <code>.btn</code> API.</p></a>
        </div>`;
}
