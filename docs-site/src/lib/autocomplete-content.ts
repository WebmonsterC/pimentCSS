import { pdocSnippet, pdocSteps } from './pdoc-html';
import { AUTOCOMPLETE_REFERENCE_JS } from './autocomplete-behavior';
import { AUTOCOMPLETE_PEOPLE, type AutocompleteSuggestion } from './autocomplete-suggestions';
import { ph, ICON } from './icon';

const LABEL_TOOLTIP = `<button type="button" class="label__tooltip focus-visible" aria-label="Help for this field">${ph('info', 16)}</button>`;

const CLEAR_ICON = ICON.cancel();
const SEARCH_ICON = ICON.search('', 24);
const PERSON_ICON = ICON.user('menu__item-icon');
const BOOKMARK_ICON = ICON.bookmark('menu__item-icon');

function menuOption(person: AutocompleteSuggestion, selected = false, optionId = ''): string {
  const sel = selected ? ' menu__item--selected' : '';
  const ariaSel = selected ? ' aria-selected="true"' : '';
  const idAttr = optionId ? ` id="${optionId}"` : '';
  return `<button type="button" class="menu__item${sel} focus-visible" role="option"${ariaSel}${idAttr} data-ac-value="${person.name}">
                <span class="menu__item-icon">${PERSON_ICON}</span>
                <span class="menu__item-label">
                  <span class="menu__item-title">${person.name}</span>
                  <span class="menu__item-desc">${person.role}</span>
                </span>
                <span class="menu__item-icon">${BOOKMARK_ICON}</span>
              </button>`;
}

function menuPanel(listId: string, people: AutocompleteSuggestion[], selectedIndex = -1): string {
  const items = people
    .map((person, i) => menuOption(person, i === selectedIndex, `${listId}-opt-${i}`))
    .join('\n              ');
  return `<div class="autocomplete__panel" id="${listId}" role="listbox" aria-label="Suggestions">
                <div class="menu menu--rail">
                  <div class="menu__list">
              ${items}
                  </div>
                  <div class="menu__rail" aria-hidden="true"><span class="menu__rail-thumb"></span></div>
                </div>
              </div>`;
}

function autocompleteBlock(opts: {
  idPrefix: string;
  open?: boolean;
  live?: boolean;
  hint?: string;
  value?: string;
  selectedIndex?: number;
  hasValue?: boolean;
}): string {
  const openClass = opts.open ? ' autocomplete--open' : '';
  const liveAttr = opts.live ? ' data-autocomplete-live' : '';
  const hasValueClass = opts.hasValue ? ' autocomplete--has-value' : '';
  const listId = `${opts.idPrefix}-list`;
  const inputId = `${opts.idPrefix}-input`;
  const hintId = `${opts.idPrefix}-hint`;
  const expanded = opts.open ? 'true' : 'false';
  const selectedIndex = opts.selectedIndex ?? -1;
  const selected = selectedIndex >= 0 ? AUTOCOMPLETE_PEOPLE[selectedIndex] : null;
  const value = opts.value ?? selected?.name ?? '';
  const hint = opts.hint ?? 'Search by name or role';
  const people = opts.live ? [] : AUTOCOMPLETE_PEOPLE;
  const panel = menuPanel(listId, people, selectedIndex);

  return `<div class="autocomplete${openClass}${hasValueClass}"${liveAttr}>
            <label class="label" for="${inputId}">
              <span class="label__text">Collaborateur</span>
              ${LABEL_TOOLTIP}
            </label>
            <p class="autocomplete__hint" id="${hintId}">${hint}</p>
            <div class="autocomplete__control">
              <div class="autocomplete__field">
                <input
                  class="autocomplete__input focus-visible"
                  id="${inputId}"
                  type="text"
                  inputmode="search"
                  placeholder="Search a colleague…"
                  autocomplete="off"
                  value="${value}"
                  aria-autocomplete="list"
                  aria-controls="${listId}"
                  aria-expanded="${expanded}"
                  aria-describedby="${hintId}"
                />
                <button type="button" class="autocomplete__clear focus-visible" aria-label="Clear selection"${hasValueClass ? '' : ' hidden'}>
                  ${CLEAR_ICON}
                </button>
              </div>
              <button type="button" class="autocomplete__search focus-visible" aria-label="Search">
                ${SEARCH_ICON}
              </button>
            </div>
            ${panel}
          </div>`;
}


/** Full Autocomplete page (Forms). */
export function buildAutocompletePageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Combobox patterns need a visible <strong>label</strong>, a named listbox (<code>aria-controls</code>), and <code>aria-expanded</code> synced with the panel. PimentCSS ships <strong>CSS and markup</strong> plus a reference script for filtering, keyboard selection, and dismiss (same model as the date picker).</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p><code>.autocomplete</code> stacks a label, optional hint, a composite control (field + clear + search action), and an optional <code>.autocomplete__panel</code> with a <code>.menu</code> list. Open state uses <code>.autocomplete--open</code>. The clear control uses <code>.autocomplete--has-value</code> and only appears after a list selection (not while typing).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Root</td><td><code>.autocomplete</code></td><td>328px max column, positions panel</td></tr>
              <tr><td>Hint</td><td><code>.autocomplete__hint</code></td><td>Helper text under label</td></tr>
              <tr><td>Control</td><td><code>.autocomplete__control</code></td><td>Bordered row: field + search button</td></tr>
              <tr><td>Panel</td><td><code>.autocomplete__panel</code></td><td>Absolute listbox with <code>.menu</code></td></tr>
              <tr><td>Selected</td><td><code>.autocomplete--has-value</code></td><td>Shows <code>.autocomplete__clear</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Labels</strong>, <code>.label</code> and optional <code>.label__tooltip</code> from <a href="/docs/input-fields">Input fields</a>.</li>
          <li><strong>Menu</strong>, suggestion rows use <code>.menu</code>, <code>.menu__item</code> from <a href="/docs/menu-dropdown">Menu &amp; dropdown</a>.</li>
          <li><strong>Depth</strong>, panel uses <code>--shadow-md</code>, see <a href="/docs/depth">Depth &amp; shadows</a>.</li>
        </ul>

        <h2 id="structure">Structure</h2>
        <p>Each option uses <code>.menu__item-title</code> (name) and <code>.menu__item-desc</code> (role). Tie the hint with <code>aria-describedby</code>. Use <code>type="text"</code> on the input to avoid the browser’s native search clear icon.</p>
        ${pdocSnippet(
          `<div class="autocomplete autocomplete--open">
  <label class="label" for="colleague">…</label>
  <p class="autocomplete__hint" id="colleague-hint">…</p>
  <div class="autocomplete__control">
    <div class="autocomplete__field">
      <input class="autocomplete__input" id="colleague" type="text" aria-controls="colleague-list" aria-expanded="true" />
      <button type="button" class="autocomplete__clear" aria-label="Clear selection" hidden>…</button>
    </div>
    <button type="button" class="autocomplete__search" aria-label="Search">…</button>
  </div>
  <div class="autocomplete__panel" id="colleague-list" role="listbox">
    <div class="menu menu--rail">
      <button type="button" class="menu__item" role="option">
        <span class="menu__item-label">
          <span class="menu__item-title">Camille Dupont</span>
          <span class="menu__item-desc">Directrice financière</span>
        </span>
      </button>
    </div>
  </div>
</div>`,
          'autocomplete.html',
          'html',
        )}

        <h2 id="states">Default state</h2>
        <p>Panel hidden until focus or search. Add <code>.autocomplete--open</code> via the script; selected row uses <code>.menu__item--selected</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-ac-demo">
            ${autocompleteBlock({ idPrefix: 'pdoc-ac-default' })}
          </div>
        </div>

        <h2 id="behavior">Behavior in your app</h2>
        <p>Copy and adapt <code>docs-site/src/lib/autocomplete-behavior.ts</code> after PimentCSS CSS is loaded. On this docs site, <code>doc-client.ts</code> calls <code>bindAutocompleteDismiss()</code> and <code>wireAllAutocompletes()</code> on load (same model as the date picker).</p>
        ${pdocSnippet(AUTOCOMPLETE_REFERENCE_JS, 'autocomplete.js', 'javascript')}

        <h2 id="example">Interactive example</h2>
        <p>Focus the field or type a name or role. Pick a row with click or keyboard; the clear button appears only after a list selection. Use Escape or an outside click to close the panel.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-ac-demo">
            ${autocompleteBlock({ idPrefix: 'pdoc-ac-live', live: true, hint: 'Type a name or job title' })}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.autocomplete</code></td><td>Root wrapper (328px max)</td></tr>
              <tr><td><code>.autocomplete--open</code></td><td>Shows <code>.autocomplete__panel</code></td></tr>
              <tr><td><code>.autocomplete--has-value</code></td><td>Reveals <code>.autocomplete__clear</code> after list pick</td></tr>
              <tr><td><code>.autocomplete__hint</code></td><td>Helper below label</td></tr>
              <tr><td><code>.autocomplete__control</code></td><td>Bordered input row + search</td></tr>
              <tr><td><code>.autocomplete__field</code></td><td>Input + clear (280px max)</td></tr>
              <tr><td><code>.autocomplete__input</code></td><td>Text input (combobox)</td></tr>
              <tr><td><code>.autocomplete__clear</code></td><td>Clears committed selection</td></tr>
              <tr><td><code>.autocomplete__search</code></td><td>Primary search action</td></tr>
              <tr><td><code>.menu__item-title</code></td><td>Primary line in a suggestion</td></tr>
              <tr><td><code>.menu__item-desc</code></td><td>Secondary line (role, team, etc.)</td></tr>
              <tr><td><code>.autocomplete__panel</code></td><td>Listbox container</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'ac-tokens',
            title: 'Autocomplete sizing',
            body: 'Override width tokens before importing components.',
            code: `@use "pimentcss-design-system" with (
  $autocomplete-width: 20.5rem,
  $autocomplete-field-width: 17.5rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'ac-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _autocomplete.scss or tokens.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Combobox / listbox</p>
          <ul>
            <li><strong>Label</strong>, <code>&lt;label for="…"&gt;</code> on the input; hint via <code>aria-describedby</code>.</li>
            <li><strong>Combobox</strong>, <code>role="combobox"</code>, <code>aria-autocomplete="list"</code>, <code>aria-controls</code>, <code>aria-expanded</code> synced with open state.</li>
            <li><strong>Listbox</strong>, panel <code>role="listbox"</code> with an accessible name; options as <code>role="option"</code> buttons.</li>
            <li><strong>Selection</strong>, <code>aria-selected="true"</code> on the chosen option; reflect the name in the input.</li>
            <li><strong>Clear</strong>, one control only (<code>type="text"</code> + hidden <code>.autocomplete__clear</code> until a list value is committed).</li>
            <li><strong>Keyboard</strong>, Arrow Up/Down, Enter, Escape require app logic; CSS provides focus rings only.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/menu-dropdown"><p class="pdoc-card__title">Menu &amp; dropdown</p><p class="pdoc-card__desc">List rows and rail scrollbar.</p></a>
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Labels and field primitives.</p></a>
          <a class="pdoc-card" href="/docs/date-picker"><p class="pdoc-card__title">Date picker</p><p class="pdoc-card__desc">Calendar panel pattern.</p></a>
          <a class="pdoc-card" href="/docs/button-group"><p class="pdoc-card__title">Button group</p><p class="pdoc-card__desc">Grouped actions.</p></a>
        </div>`;
}
