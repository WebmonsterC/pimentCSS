import { buildCreditsHtml } from './credits';
import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ICON } from './icon';
import { NPM_CDN_JSdelivr, NPM_PACKAGE_NAME } from './npm-package';

const SNIPPET_OPEN = { expanded: true } as const;

const SHOWCASE = `<div class="pdoc-intro-showcase" role="group" aria-label="UI preview">
              <div class="alert alert--information alert--with-icon" role="status">
                <span class="alert__icon" aria-hidden="true">${ICON.alertInfo()}</span>
                <div class="alert__content">
                  <p class="alert__title">Welcome</p>
                  <p class="alert__body">Accessible components with OKLCH tokens and semantic surfaces.</p>
                </div>
              </div>
              <label class="field">
                <span class="field__label">Email</span>
                <input type="email" class="field__input" name="email" placeholder="you@example.com" autocomplete="email" />
              </label>
              <button type="button" class="btn btn--primary focus-visible">Get started</button>
            </div>`;

/** Introduction / home page. */
export function buildIntroPageHtml(): string {
  return `
        <div class="pdoc-callout pdoc-callout--info">
          <p class="pdoc-callout__title">PimentCSS v1</p>
          <p>Accessible CSS framework for web interfaces, with <strong>OKLCH</strong> tokens, ready-made components, and documentation powered by <strong><a href="https://astro.build/">Astro</a></strong>. A collaboration between <a href="https://www.webmonster.tech">Webmonster</a> and <a href="https://www.numera11y.fr">numera11y</a>.</p>
        </div>

        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Accessibility first</p>
          <p>Focus rings, 44px touch targets, and semantic contrast pairs are built in. Start with the <a href="/docs/a11y">Accessibility guide</a> or toggle light/dark in the header while reviewing the preview below.</p>
        </div>

        <h2 id="preview">See it in action</h2>
        <p>One information alert, one labeled field, and a primary button on the same surface. These are the same <code>component classes</code> used across the docs, not a separate theme.</p>
        <div class="pdoc-demo" data-pdoc-demo data-pdoc-code-expanded="true">
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-intro-showcase-wrap">
            ${SHOWCASE}
          </div>
        </div>

        <h2 id="choose-path">Choose your path</h2>
        <p>Pick the entry that matches how you ship PimentCSS. You can combine paths (for example npm + a custom Sass theme).</p>
        <div class="pdoc-cards pdoc-cards--3 pdoc-intro-paths">
          <a class="pdoc-card pdoc-card--path" href="/docs/installation">
            <p class="pdoc-card__eyebrow">Developer</p>
            <p class="pdoc-card__title">npm / bundler</p>
            <p class="pdoc-card__desc">Install <code>${NPM_PACKAGE_NAME}</code>, import CSS in Vite, webpack, Parcel, or Astro.</p>
          </a>
          <a class="pdoc-card pdoc-card--path" href="/docs/customization">
            <p class="pdoc-card__eyebrow">Design system</p>
            <p class="pdoc-card__title">Sass theme</p>
            <p class="pdoc-card__desc">Override <code>!default</code> variables, partial imports, and OKLCH tokens.</p>
          </a>
          <a class="pdoc-card pdoc-card--path" href="/docs/a11y">
            <p class="pdoc-card__eyebrow">RGAA / WCAG</p>
            <p class="pdoc-card__title">Verify accessibility</p>
            <p class="pdoc-card__desc">Focus, contrast pairs, touch targets, and reduced motion checklist.</p>
          </a>
        </div>

        <h2 id="cdn">Quick start (CDN)</h2>
        <p>No build step: paste one <code>&lt;link&gt;</code> in static HTML, CodePen, or a client handoff. Pin an exact semver in production.</p>
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">Agencies &amp; prototypes</p>
          <p>CDN is the fastest way to demo PimentCSS in a mockup or landing page before npm integration. Full options on <a href="/docs/installation#cdn">Installation → CDN</a>.</p>
        </aside>
        ${pdocSnippet(
          `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link
      rel="stylesheet"
      href="${NPM_CDN_JSdelivr}"
    />
  </head>
  <body>
    <button type="button" class="btn btn--primary focus-visible">Submit</button>
  </body>
</html>`,
          'index.html',
          'html',
          SNIPPET_OPEN,
        )}

        <h2 id="quick-start">Quick start (npm)</h2>
        <p>Default path for apps with a package manager. See <a href="/docs/installation">Installation</a> for pnpm, Yarn, static HTML, and verification steps.</p>
        ${pdocSteps([
          {
            id: 'install',
            title: 'Install',
            body: `Add <code>${NPM_PACKAGE_NAME}</code> to your project. The <code>style</code> export points at <code>dist/pimentcss.min.css</code>.`,
            code: `npm install ${NPM_PACKAGE_NAME}`,
            label: 'Terminal',
            lang: 'bash',
          },
          {
            id: 'import',
            title: 'Import CSS',
            body: 'Load the minified bundle once at application startup.',
            code: `import "${NPM_PACKAGE_NAME}";`,
            label: 'main.ts',
            lang: 'js',
          },
          {
            id: 'markup',
            title: 'Add a button',
            body: 'Use component classes from the documentation. Tab to the button to see the focus ring.',
            code: '<button type="button" class="btn btn--primary focus-visible">Submit</button>',
            label: 'Markup',
            lang: 'html',
          },
        ])}

        <h2 id="foundations">Foundations &amp; components</h2>
        <p>After install, explore tokens, <a href="/docs/patterns">composition patterns</a>, and individual components. Each page includes live previews and copyable markup.</p>
        <div class="pdoc-cards pdoc-cards--3">
          <a class="pdoc-card" href="/docs/patterns"><p class="pdoc-card__title">Patterns</p><p class="pdoc-card__desc">Contact form, toolbar + modal, table + pagination recipes.</p></a>
          <a class="pdoc-card" href="/docs/colors"><p class="pdoc-card__title">Colors</p><p class="pdoc-card__desc">OKLCH palettes and semantic contrast swatches.</p></a>
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Variants, states, icons, and class API.</p></a>
        </div>

        <h2 id="components">Components</h2>
        <p>Full library in the sidebar: forms, navigation, feedback, and layout patterns. Class references are verified against <code>dist/pimentcss.css</code>.</p>
        ${buildCreditsHtml()}`;
}
