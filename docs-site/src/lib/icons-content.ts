import { pdocSnippet } from './pdoc-html';
import { ICON, ph } from './icon';

const ICONS_LAB = `<div class="pdoc-icons-lab" role="group" aria-label="Icon slot examples">
            <button type="button" class="btn btn--primary">
              ${ph('download-simple', 20, 'btn__icon')}
              Download
            </button>
            <div class="field pdoc-icons-lab__field">
              <span class="field__icon" aria-hidden="true">${ICON.search()}</span>
              <input type="search" class="field__input" placeholder="Search" aria-label="Search" />
            </div>
            <div class="alert alert--info" role="status">
              <span class="alert__icon" aria-hidden="true">${ICON.alertInfo()}</span>
              <div class="alert__content">
                <p class="alert__title">Phosphor as reference</p>
                <p class="alert__message mb-0">Swap the markup for your own SVG set; slots stay the same.</p>
              </div>
            </div>
          </div>`;

/** Icons guide: agnostic slots, Phosphor examples, accessibility. */
export function buildIconsPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">No global icon library</p>
          <p>PimentCSS ships <strong>dimensioned slots</strong> (<code>.btn__icon</code>, <code>.field__icon</code>, …), not an icon font or SVG pack. This documentation uses <a href="https://phosphoricons.com/" rel="noopener noreferrer" target="_blank">Phosphor<span class="pdoc-sr-only"> (opens in new tab)</span></a> only as a working example.</p>
        </aside>

        <h2 id="principles">Principles</h2>
        <ul>
          <li><strong>Slots, not glyphs</strong>: components reserve space and alignment; you provide SVG, an icon font, or inline markup.</li>
          <li><strong><code>currentColor</code></strong>: icons inherit semantic text colors (action, body, on-action) from the parent component.</li>
          <li><strong>One source per app</strong>: pick any library (Phosphor, Heroicons, Material Symbols, custom sprites) and use it consistently.</li>
          <li><strong>Accessible names</strong>: decorative icons beside visible text use <code>aria-hidden="true"</code>; icon-only controls need <code>aria-label</code> (see <a href="/docs/a11y">Accessibility guide</a>).</li>
        </ul>

        <h2 id="examples">Examples in context</h2>
        <p>Three common slots with Phosphor Regular (<code>ph</code> classes). Match the icon graphic size to the slot (20px in buttons, 24px in fields and alerts).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ICONS_LAB}
          </div>
        </div>

        <h2 id="slots">Slot reference</h2>
        <p>Default sizes come from Sass variables in <code>scss/abstracts/_variables.scss</code> (<code>!default</code>, overridable via <code>@use "pimentcss" with ()</code>). The <code>_icon-slot.scss</code> partial scales child <code>svg</code>, <code>.ph</code>, and <code>i[class*="ph-"]</code> to fill the slot.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api pdoc-icons-slot-table">
            <thead><tr><th>Slot class</th><th>Default size</th><th>Used in</th></tr></thead>
            <tbody>
              <tr><td><code>.tag__icon</code></td><td>1rem (16px)</td><td><a href="/docs/tags">Tags</a></td></tr>
              <tr><td><code>.checkbox__icon</code></td><td>Control box (16px graphic)</td><td><a href="/docs/checkboxes-radios-switch">Checkboxes</a></td></tr>
              <tr><td><code>.btn__icon</code>, <code>.btn-group__icon</code>, <code>.tab__icon</code>, <code>.table__icon</code>, <code>.tree__icon</code>, <code>.link__icon</code>, <code>.nav-item__icon</code></td><td>1.25rem (20px)</td><td><a href="/docs/buttons">Buttons</a>, <a href="/docs/button-group">Button group</a>, <a href="/docs/tabs">Tabs</a>, <a href="/docs/table">Table</a>, <a href="/docs/tree">Tree</a>, <a href="/docs/link-breadcrumb">Links</a>, <a href="/docs/navigation">Navigation</a></td></tr>
              <tr><td><code>.field__icon</code>, <code>.textarea-field__icon</code>, <code>.menu__item-icon</code></td><td>1.5rem (24px)</td><td><a href="/docs/input-fields">Input fields</a>, <a href="/docs/menu-dropdown">Menu &amp; dropdown</a></td></tr>
              <tr><td><code>.alert__icon</code>, <code>.snackbar__icon</code>, <code>.pagination__item-icon</code>, <code>.carousel__arrow-icon</code></td><td>1.5rem (24px)</td><td><a href="/docs/alerts">Alerts</a>, <a href="/docs/snackbar">Snackbar</a>, <a href="/docs/pagination">Pagination</a>, <a href="/docs/carousel">Carousel</a></td></tr>
              <tr><td><code>.alert__close</code>, <code>.snackbar__link-icon</code></td><td>1.25rem / 1rem</td><td><a href="/docs/alerts">Alerts</a>, <a href="/docs/snackbar">Snackbar</a></td></tr>
              <tr><td><code>.list__indicator-icon</code></td><td>1rem graphic in 1.5rem indicator</td><td><a href="/docs/list">List</a></td></tr>
              <tr><td><code>.theme-toggle__option svg</code></td><td>Custom sun/moon SVG (not a <code>__icon</code> slot)</td><td><a href="/docs/theme-toggle">Theme toggle</a></td></tr>
            </tbody>
          </table>
        </div>
        <p>Chevrons in selects and dropdowns may use CSS masks (<code>.field--select</code>, <code>.dropdown__chevron</code>) instead of an icon library.</p>

        <h2 id="phosphor">Phosphor (documentation example)</h2>
        <p>To mirror the doc site, install Phosphor Web and load the Regular stylesheet once per app shell.</p>
        ${pdocSnippet(
          `npm install @phosphor-icons/web`,
          'Terminal',
          'bash',
        )}
        ${pdocSnippet(
          `<link rel="stylesheet" href="/docs/node_modules/@phosphor-icons/web/src/regular/style.css" />

<button type="button" class="btn btn--primary">
  <i class="ph ph-arrow-right btn__icon" style="font-size:20px" aria-hidden="true"></i>
  Continue
</button>`,
          'phosphor-button.html',
          'html',
        )}
        <p>Set <code>font-size</code> on the <code>ph</code> element to match the slot (see table above). The slot box still comes from PimentCSS; Phosphor only draws the glyph.</p>

        <h2 id="inline-svg">Inline SVG</h2>
        <p>Prefer <code>fill="currentColor"</code> or <code>stroke="currentColor"</code> so light/dark semantics apply automatically.</p>
        ${pdocSnippet(
          `<button type="button" class="btn btn--outline btn--icon-only" aria-label="Close">
  <svg class="btn__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
</button>`,
          'svg-icon-only.html',
          'html',
        )}

        <h2 id="accessibility">Accessibility</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Naming and visibility</p>
          <ul class="mb-0">
            <li><strong>Decorative</strong> (text or label already names the control): <code>aria-hidden="true"</code> on the icon, plus <code>focusable="false"</code> on SVG.</li>
            <li><strong>Icon-only</strong>: <code>aria-label</code> on the <code>button</code> or <code>a</code>; never leave the glyph as the only accessible name.</li>
            <li><strong>Meaningful standalone icons</strong> (rare): use visible text or <code>aria-label</code> on the control; do not rely on shape alone.</li>
          </ul>
        </div>
        <p>Touch targets for icon-only buttons use <code>.btn--icon-only</code> (min 44×44px). See <a href="/buttons#icon-only">Buttons: icon-only</a> and <a href="/a11y#touch">Accessibility: touch targets</a>.</p>

        <h2 id="customize">Customize slot sizes (Sass)</h2>
        ${pdocSnippet(
          `@use "pimentcss" with (
  $btn-icon-size: 1.25rem,
  $field-icon-size: 1.5rem,
  $tab-icon-size: 1.25rem,
);`,
          'icon-vars.scss',
          'scss',
        )}
        <p>After changing sizes, redraw or re-export icons from your library at the new pixel grid.</p>

        <h2 id="related">Related</h2>
        <div class="pdoc-cards pdoc-cards--3">
          <a class="pdoc-card" href="/docs/buttons"><p class="pdoc-card__title">Buttons</p><p class="pdoc-card__desc">Leading, trailing, and icon-only patterns.</p></a>
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Prefix icons in <code>.field__icon</code>.</p></a>
          <a class="pdoc-card" href="/docs/a11y"><p class="pdoc-card__title">Accessibility</p><p class="pdoc-card__desc">Focus, labels, and touch targets.</p></a>
        </div>`;
}
