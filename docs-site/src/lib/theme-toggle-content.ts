import { pdocSnippet, pdocSteps } from './pdoc-html';
import { themeToggleIconSun, themeToggleIconMoon } from './theme-toggle-icons';

const ICON_SUN = themeToggleIconSun();
const ICON_MOON = themeToggleIconMoon();

const COMPACT_TOGGLE = `<div
              class="theme-toggle theme-toggle--compact"
              role="group"
              aria-label="Color mode"
              data-theme-toggle
            >
              <button
                type="button"
                class="theme-toggle__option is-active"
                data-theme-value="light"
                aria-pressed="true"
                aria-label="Light mode"
              >
                ${ICON_SUN}
              </button>
              <button
                type="button"
                class="theme-toggle__option"
                data-theme-value="dark"
                aria-pressed="false"
                aria-label="Dark mode"
              >
                ${ICON_MOON}
              </button>
            </div>`;

const TOOLBAR_DEMO = `<div class="d-flex align-center justify-between gap-3">
  <span class="body-medium body-medium--semibold mb-0">Application</span>
  ${COMPACT_TOGGLE}
</div>`;

const SWITCH_DEMO = `<article class="card card--elevated card--copy">
  <div class="card__body d-flex flex-column gap-3">
    <p class="heading-h5 mb-0">Preferences</p>
    <label class="theme-toggle theme-toggle--switch">
      <input
        type="checkbox"
        class="theme-toggle__input"
        role="switch"
        aria-checked="false"
        data-theme-switch
      />
      <span class="theme-toggle__track">
        <span class="theme-toggle__knob"></span>
      </span>
      <span class="theme-toggle__label">Dark mode</span>
    </label>
  </div>
</article>`;

const COMPACT_SNIPPET = `<div class="theme-toggle theme-toggle--compact" role="group" aria-label="Color mode" data-theme-toggle>
  <button type="button" class="theme-toggle__option is-active" data-theme-value="light" aria-pressed="true" aria-label="Light mode">
    ${ICON_SUN}
  </button>
  <button type="button" class="theme-toggle__option" data-theme-value="dark" aria-pressed="false" aria-label="Dark mode">
    ${ICON_MOON}
  </button>
</div>`;

const SWITCH_SNIPPET = `<label class="theme-toggle theme-toggle--switch">
  <input type="checkbox" class="theme-toggle__input" role="switch" aria-checked="false" data-theme-switch />
  <span class="theme-toggle__track"><span class="theme-toggle__knob"></span></span>
  <span class="theme-toggle__label">Dark mode</span>
</label>`;

const BOOTSTRAP_SNIPPET = `<script>
(function () {
  try {
    var k = 'pimentcss-theme';
    var s = localStorage.getItem(k);
    var t =
      s === 'light' || s === 'dark'
        ? s
        : window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
</script>`;

const JS_SYNC_SNIPPET = `import { applyTheme, resolveTheme, setTheme, type ThemeMode } from './theme';

function syncThemeUi(theme: ThemeMode) {
  document.querySelectorAll('[data-theme-toggle]').forEach((root) => {
    root.querySelectorAll<HTMLButtonElement>('[data-theme-value]').forEach((btn) => {
      const active = btn.dataset.themeValue === theme;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  });
  document.querySelectorAll<HTMLInputElement>('[data-theme-switch]').forEach((input) => {
    input.checked = theme === 'dark';
    input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
  });
}

applyTheme(resolveTheme());
syncThemeUi(resolveTheme());

document.querySelectorAll('[data-theme-toggle]').forEach((root) => {
  root.querySelectorAll<HTMLButtonElement>('[data-theme-value]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.themeValue as ThemeMode;
      if (next !== 'light' && next !== 'dark') return;
      setTheme(next);
      syncThemeUi(next);
    });
  });
});

document.querySelectorAll<HTMLInputElement>('[data-theme-switch]').forEach((input) => {
  input.addEventListener('change', () => {
    const next: ThemeMode = input.checked ? 'dark' : 'light';
    setTheme(next);
    syncThemeUi(next);
  });
});`;

/** Full Theme toggle page (Foundations). */
export function buildThemeTogglePageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Mode is conveyed with <strong>text labels</strong>, <code>aria-pressed</code> / <code>aria-checked</code>, and visible <code>:focus-visible</code> rings (3px). Icons supplement labels; do not rely on sun/moon alone. Validate contrast in both themes using the header control or the demos below.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>PimentCSS switches palettes through <code>data-theme</code> on <code>&lt;html&gt;</code>. Semantic tokens in <code>tokens/semantic.css</code> update surfaces, text, and borders for light and dark. The <code>.theme-toggle</code> component styles the control; a small script (yours or the docs reference) keeps <code>dataset.theme</code>, storage, and UI in sync.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Piece</th><th>Source</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Semantic tokens</td><td><code>tokens/semantic.css</code></td><td><code>--surface-*</code>, <code>--text-*</code> per theme</td></tr>
              <tr><td>Component SCSS</td><td><code>scss/components/_theme-toggle.scss</code></td><td><code>.theme-toggle</code>, modifiers</td></tr>
              <tr><td>Icons (sun / moon)</td><td><code>assets/icons/theme-toggle/</code></td><td>Dedicated SVG in doc assets</td></tr>
              <tr><td>Dark overrides</td><td><code>[data-theme="dark"]</code></td><td>Explicit dark palette</td></tr>
              <tr><td>System fallback</td><td><code>prefers-color-scheme: dark</code></td><td>When <code>data-theme</code> is unset</td></tr>
              <tr><td>Docs reference JS</td><td><code>docs-site/src/lib/theme.ts</code></td><td>Bootstrap, storage, <code>applyTheme</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a> (theme toggle ships in the default bundle).</li>
          <li><strong>Semantic colors</strong>, understand <code>data-theme</code> and token pairs from <a href="/docs/colors">Colors</a>.</li>
          <li><strong>Optional script</strong>, required only to persist choice and sync multiple controls on the page.</li>
        </ul>

        <h2 id="how-it-works">How it works</h2>
        <p>Set <code>data-theme="light"</code> or <code>data-theme="dark"</code> on the document root. PimentCSS maps each value to semantic variables; omitting the attribute follows the OS via <code>prefers-color-scheme</code> (unless you force <code>data-theme="light"</code>).</p>
        ${pdocSnippet(
          `<html lang="en" data-theme="light">
  <head>
    <link rel="stylesheet" href="/pimentcss.min.css" />
  </head>
  <body>
    …
  </body>
</html>`,
          'index.html',
          'html',
        )}
        <p>When using <code>localStorage</code>, inject a blocking bootstrap script in <code>&lt;head&gt;</code> before CSS paints (see <a href="#js-bootstrap">Bootstrap before paint</a> below).</p>

        <h2 id="compact">Compact control (header / toolbar)</h2>
        <p>Icon-only segmented control for navigation bars. Uses <code>role="group"</code>, <code>aria-pressed</code> on each option, and <code>data-theme-toggle</code> for scripting. Active option gets <code>.is-active</code> and <code>--shadow-xs</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TOOLBAR_DEMO}
          </div>
        </div>
        ${pdocSnippet(COMPACT_SNIPPET, 'header.html', 'html')}

        <h2 id="switch">Switch variant (settings / forms)</h2>
        <p>Checkbox styled as a switch for preference panels. Checked means dark mode. Visible label text stays beside the track; the input is visually hidden but focusable.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SWITCH_DEMO}
          </div>
        </div>
        ${pdocSnippet(SWITCH_SNIPPET, 'settings.html', 'html')}

        <h2 id="javascript">Wire with JavaScript</h2>
        <p>PimentCSS does not ship runtime theme logic. Copy the pattern from <code>docs-site/src/lib/theme.ts</code> (used on this site) or adapt the steps below.</p>
        ${pdocSteps([
          {
            id: 'js-bootstrap',
            title: 'Bootstrap before paint',
            body: 'Read <code>localStorage</code> key <code>pimentcss-theme</code>, else <code>prefers-color-scheme</code>, and set <code>document.documentElement.dataset.theme</code> in <code>&lt;head&gt;</code>.',
            code: BOOTSTRAP_SNIPPET,
            label: 'index.html',
            lang: 'html',
          },
          {
            id: 'js-apply',
            title: 'Apply and persist',
            body: 'On change, set <code>data-theme</code> and optionally <code>localStorage.setItem("pimentcss-theme", theme)</code>. Clear storage to follow the OS again.',
            code: `document.documentElement.dataset.theme = 'dark';
localStorage.setItem('pimentcss-theme', 'dark');`,
            label: 'theme.ts',
            lang: 'js',
          },
          {
            id: 'js-sync',
            title: 'Sync all controls',
            body: 'Update every <code>[data-theme-toggle]</code> button and <code>[data-theme-switch]</code> input when the theme changes (including the docs header).',
            code: JS_SYNC_SNIPPET,
            label: 'theme.ts',
            lang: 'ts',
          },
        ])}
        <p class="pdoc-muted-note">Demos on this page share the same sync as the header toggle. Try switching here and in the toolbar above.</p>

        <h2 id="api">Class reference</h2>
        <p>Optional namespace via Sass <code>$prefix</code> (empty by default).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class / attribute</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.theme-toggle</code></td><td>Segmented container (muted surface, border, round)</td></tr>
              <tr><td><code>.theme-toggle--compact</code></td><td>Icon-only options, <code>--min-touch-target</code> (2.75rem)</td></tr>
              <tr><td><code>.theme-toggle--switch</code></td><td>Switch layout with visible label</td></tr>
              <tr><td><code>.theme-toggle__option</code></td><td>Segment button; <code>:focus-visible</code> ring</td></tr>
              <tr><td><code>.theme-toggle__option.is-active</code></td><td>Selected mode (also <code>[aria-pressed="true"]</code>)</td></tr>
              <tr><td><code>.theme-toggle__input</code></td><td>Visually hidden checkbox (<code>role="switch"</code>)</td></tr>
              <tr><td><code>.theme-toggle__track</code> / <code>__knob</code></td><td>Switch visuals; knob moves when checked</td></tr>
              <tr><td><code>data-theme-toggle</code></td><td>Root for segmented wiring</td></tr>
              <tr><td><code>data-theme-value</code></td><td><code>light</code> or <code>dark</code> on segment buttons</td></tr>
              <tr><td><code>data-theme-switch</code></td><td>Checkbox switch (checked = dark)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        <p>Dark semantic tokens compile by default (<code>$enable-dark-theme: true</code> in <code>scss/abstracts/_variables.scss</code>). Override surfaces globally, not only the toggle:</p>
        ${pdocSnippet(
          `@use "pimentcss-design-system" with (
  $enable-dark-theme: true,
);

// Optional: tune compact chrome shadow via depth tokens
// $shadow-xs: 0 1px 3px oklch(40% 0.03 262 / 0.12);`,
          'theme.scss',
          'scss',
        )}
        <p>See <a href="/docs/customization">Customization</a> and <a href="/docs/depth">Depth &amp; shadows</a> for elevation tokens used on the active segment.</p>

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Color mode without barriers</p>
          <ul>
            <li><strong>Name and state</strong>, segmented: <code>aria-label</code> on the group plus <code>aria-pressed</code> per button. Switch: <code>role="switch"</code> and <code>aria-checked</code> kept in sync with <code>checked</code>.</li>
            <li><strong>Do not rely on iconography alone</strong> (RGAA 10.7). Compact variant uses <code>aria-label="Light mode"</code> / <code>Dark mode</code>; switch variant exposes visible text <code>Dark mode</code>.</li>
            <li><strong>Focus visible</strong>, 3px <code>--border-focus</code> outline on segment buttons; keyboard users can tab to the switch input.</li>
            <li><strong>Touch target</strong>, segment options use <code>--min-touch-target</code> (2.75rem), including <code>.theme-toggle--compact</code>.</li>
            <li><strong>Contrast</strong>, re-check active segment text (<code>--text-action</code> on <code>--surface-primary</code>) in both themes after brand overrides.</li>
            <li><strong>Reduced motion</strong>, transitions respect <code>prefers-reduced-motion</code> when set in global CSS.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/colors"><p class="pdoc-card__title">Colors</p><p class="pdoc-card__desc">Semantic tokens per <code>data-theme</code>.</p></a>
          <a class="pdoc-card" href="/docs/depth"><p class="pdoc-card__title">Depth &amp; shadows</p><p class="pdoc-card__desc"><code>--shadow-xs</code> on active segment.</p></a>
          <a class="pdoc-card" href="/docs/installation"><p class="pdoc-card__title">Installation</p><p class="pdoc-card__desc">Load CSS and optional bootstrap.</p></a>
          <a class="pdoc-card" href="/docs/a11y"><p class="pdoc-card__title">Accessibility</p><p class="pdoc-card__desc">Focus, contrast, and motion.</p></a>
        </div>`;
}
