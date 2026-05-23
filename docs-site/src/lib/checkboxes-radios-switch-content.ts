import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ICON } from './icon';

const CHECK_ICON = ICON.check();
const MINUS_ICON = ICON.minus();

const RADIO_DOT = `<span class="radio__dot" aria-hidden="true"></span>`;

const SWITCH_KNOB = `<span class="switch__knob" aria-hidden="true"></span>`;

type ControlStateSpec = { label: string; mod: string };
type ControlKind = 'checkbox' | 'radio' | 'switch';

function interactionStates(kind: ControlKind): ControlStateSpec[] {
  const base = `${kind}__control`;
  const states: ControlStateSpec[] = [
    { label: 'Default', mod: '' },
    { label: 'Focus', mod: `${base}--focus` },
    { label: 'Hover', mod: `${base}--hover` },
    { label: 'Disabled', mod: `${base}--disabled` },
  ];
  if (kind === 'checkbox') {
    states.push({ label: 'Error', mod: `${base}--error` });
  }
  return states;
}

function staticControlCell(
  stateLabel: string,
  controlClasses: string,
  inner = '',
): string {
  return `            <li class="pdoc-control-state" role="listitem">
              <span class="pdoc-control-state__label">${stateLabel}</span>
              <span class="${controlClasses}" aria-hidden="true">${inner}</span>
            </li>`;
}

function controlStaticRow(kind: ControlKind, base: string, icon: string): string {
  const modKey = `${kind}__control`;
  return interactionStates(kind)
    .map((s) => {
      const mods = [modKey, base, s.mod].filter(Boolean).join(' ');
      return staticControlCell(s.label, mods, icon);
    })
    .join('\n');
}

function controlStatesList(cells: string, ariaLabel: string): string {
  return `<ul class="pdoc-control-states" role="list" aria-label="${ariaLabel}">
${cells}
          </ul>`;
}

function controlStatesDemoSection(
  id: string,
  title: string,
  description: string,
  cells: string,
  listLabel: string,
): string {
  return `
        <h3 id="${id}">${title}</h3>
        <p class="body-small pdoc-text-muted">${description}</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${controlStatesList(cells, listLabel)}
          </div>
        </div>`;
}

const CHECKBOX_INTERACTIVE = `<div class="pdoc-demo-row">
            <label class="checkbox">
              <input type="checkbox" class="checkbox__input" id="pdoc-cb-1" />
              <span class="checkbox__control" aria-hidden="true">
                ${CHECK_ICON}
                ${MINUS_ICON}
              </span>
              <span class="body-medium">Default</span>
            </label>
            <label class="checkbox">
              <input type="checkbox" class="checkbox__input" id="pdoc-cb-2" checked />
              <span class="checkbox__control" aria-hidden="true">${CHECK_ICON}</span>
              <span class="checkbox__text checkbox__text--pill">Selected pill</span>
            </label>
            <label class="checkbox">
              <input type="checkbox" class="checkbox__input" id="pdoc-cb-indet" data-pdoc-indeterminate />
              <span class="checkbox__control" aria-hidden="true">
                ${CHECK_ICON}
                ${MINUS_ICON}
              </span>
              <span class="body-medium">Indeterminate</span>
            </label>
            <label class="checkbox checkbox--error">
              <input type="checkbox" class="checkbox__input" id="pdoc-cb-err" aria-invalid="true" />
              <span class="checkbox__control" aria-hidden="true">${CHECK_ICON}</span>
              <span class="body-medium">Error</span>
            </label>
          </div>`;

const RADIO_INTERACTIVE = `<fieldset class="pdoc-fieldset d-flex flex-column gap-3">
            <legend class="body-medium body-medium--semibold mb-0">Notification channel</legend>
            <label class="radio">
              <input type="radio" name="pdoc-radio-demo" class="radio__input" id="pdoc-radio-a" value="email" checked />
              <span class="radio__control" aria-hidden="true">${RADIO_DOT}</span>
              <span class="body-medium">Email</span>
            </label>
            <label class="radio">
              <input type="radio" name="pdoc-radio-demo" class="radio__input" id="pdoc-radio-b" value="sms" />
              <span class="radio__control" aria-hidden="true">${RADIO_DOT}</span>
              <span class="radio__text radio__text--pill">SMS pill</span>
            </label>
            <label class="radio">
              <input type="radio" name="pdoc-radio-demo" class="radio__input" id="pdoc-radio-c" value="push" disabled />
              <span class="radio__control" aria-hidden="true">${RADIO_DOT}</span>
              <span class="body-medium">Push (disabled)</span>
            </label>
          </fieldset>`;

const SWITCH_INTERACTIVE = `<div class="pdoc-demo-row">
            <label class="switch">
              <input type="checkbox" class="switch__input" id="pdoc-sw-1" role="switch" aria-checked="false" />
              <span class="switch__control" aria-hidden="true">${SWITCH_KNOB}</span>
              <span class="body-medium">Off</span>
            </label>
            <label class="switch">
              <input type="checkbox" class="switch__input" id="pdoc-sw-2" role="switch" checked aria-checked="true" />
              <span class="switch__control" aria-hidden="true">${SWITCH_KNOB}</span>
              <span class="body-medium">On</span>
            </label>
            <label class="switch">
              <input type="checkbox" class="switch__input" id="pdoc-sw-3" role="switch" disabled aria-checked="false" />
              <span class="switch__control" aria-hidden="true">${SWITCH_KNOB}</span>
              <span class="body-medium">Disabled</span>
            </label>
          </div>`;

/** Full Checkboxes & switches page (Forms). */
export function buildCheckboxesRadiosSwitchPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Use native <code>&lt;input type="checkbox"&gt;</code>, <code>type="radio"</code>, or <code>role="switch"</code> with a visible <strong>label</strong>. Group radios in a <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>. Static previews below are decorative; interactive blocks show the accessible pattern.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>Boolean and single-choice controls share the native <code>&lt;input&gt;</code> + <code>&lt;label&gt;</code> + visual <code>__control</code> pattern (icon font for checkbox ticks). Checkbox adds an <strong>indeterminate</strong> state for “select some” trees and tables.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>HTML</th><th>PimentCSS</th><th>Doc</th></tr></thead>
            <tbody>
              <tr><td><code>input[type="text|email|tel|…"]</code></td><td><code>.field</code> + <code>.field__input</code></td><td><a href="/docs/input-fields">Input fields</a></td></tr>
              <tr><td><code>textarea</code></td><td><code>.textarea</code> + <code>.textarea-field</code></td><td><a href="/docs/input-fields">Input fields</a></td></tr>
              <tr><td><code>select</code></td><td><code>.field</code> + <code>select.field__input</code></td><td><a href="/docs/input-fields">Input fields</a></td></tr>
              <tr><td><code>input[type="checkbox"]</code></td><td><code>.checkbox</code></td><td>This page</td></tr>
              <tr><td><code>input[type="radio"]</code></td><td><code>.radio</code> + <code>fieldset</code></td><td>This page</td></tr>
              <tr><td><code>role="switch"</code></td><td><code>.switch</code></td><td>This page</td></tr>
              <tr><td>Custom listbox</td><td><code>.dropdown</code> + <code>.menu</code></td><td><a href="/docs/menu-dropdown">Menu &amp; dropdown</a></td></tr>
            </tbody>
          </table>
        </div>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Control</th><th>Source</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>Checkbox</td><td><code>scss/components/_checkbox.scss</code></td><td>Checked, indeterminate, error</td></tr>
              <tr><td>Radio</td><td><code>scss/components/_radio.scss</code></td><td>One name per group</td></tr>
              <tr><td>Switch</td><td><code>scss/components/_switch.scss</code></td><td><code>role="switch"</code>, <code>aria-checked</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Input fields</strong>, labels and hints from <a href="/docs/input-fields">Input fields</a>.</li>
          <li><strong>Focus</strong>, <code>:focus-visible</code> rings on <code>__control</code> (3px).</li>
        </ul>

        <h2 id="checkboxes">Checkboxes</h2>
        <p>Wrap with <code>.checkbox</code>: hidden input, <code>.checkbox__control</code>, then label text. Icons for check and minus live inside the control; CSS toggles visibility.</p>
        ${pdocSnippet(
          `<label class="checkbox">
  <input type="checkbox" class="checkbox__input focus-visible" id="agree" />
  <span class="checkbox__control">
    <i class="ph ph-check checkbox__icon checkbox__icon--check" style="font-size:16px" aria-hidden="true"></i>
    <i class="ph ph-minus checkbox__icon checkbox__icon--minus" style="font-size:16px" aria-hidden="true"></i>
  </span>
  <span class="body-medium">I agree</span>
</label>`,
          'checkbox.html',
          'html',
        )}

        <h3 id="checkbox-interactive">Interactive examples</h3>
        <p>Real inputs with labels. Indeterminate is set in JS on this site (<code>data-pdoc-indeterminate</code>).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${CHECKBOX_INTERACTIVE}
          </div>
        </div>

        <h3 id="checkbox-states">Checkbox visuals (spec)</h3>
        <p>Static <code>span.checkbox__control</code> modifiers for documentation only. Each block lists interaction states without nested scroll.</p>
        ${controlStatesDemoSection(
          'checkbox-unchecked',
          'Unchecked',
          'Empty box before selection.',
          controlStaticRow('checkbox', '', ''),
          'Checkbox unchecked states',
        )}
        ${controlStatesDemoSection(
          'checkbox-selected',
          'Selected',
          'Checked with check icon.',
          controlStaticRow('checkbox', 'checkbox__control--checked', CHECK_ICON),
          'Checkbox selected states',
        )}
        ${controlStatesDemoSection(
          'checkbox-indeterminate',
          'Indeterminate',
          'Partial selection (minus icon).',
          controlStaticRow('checkbox', 'checkbox__control--indeterminate', MINUS_ICON),
          'Checkbox indeterminate states',
        )}

        <h2 id="radios">Radio buttons</h2>
        <p>Only one option per <code>name</code>. Use <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code> for the group label.</p>
        ${pdocSnippet(
          `<fieldset>
  <legend>Shipping</legend>
  <label class="radio">
    <input type="radio" name="ship" class="radio__input focus-visible" id="ship-std" value="standard" checked />
    <span class="radio__control"><span class="radio__dot"></span></span>
    <span class="body-medium">Standard</span>
  </label>
</fieldset>`,
          'radio.html',
          'html',
        )}

        <h3 id="radio-interactive">Interactive radio group</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${RADIO_INTERACTIVE}
          </div>
        </div>

        <h3 id="radio-states">Radio visuals (spec)</h3>
        ${controlStatesDemoSection(
          'radio-active',
          'Active (selected)',
          'Filled dot when checked.',
          controlStaticRow('radio', 'radio__control--checked', RADIO_DOT),
          'Radio active states',
        )}
        ${controlStatesDemoSection(
          'radio-inactive',
          'Inactive',
          'Empty circle before selection.',
          controlStaticRow('radio', '', ''),
          'Radio inactive states',
        )}

        <h2 id="switches">Switches</h2>
        <p>Use <code>.switch</code> with <code>role="switch"</code> and sync <code>aria-checked</code> when the knob moves. Under the hood it is still a checkbox input.</p>
        ${pdocSnippet(
          `<label class="switch">
  <input type="checkbox" class="switch__input focus-visible" id="notify" role="switch" aria-checked="false" />
  <span class="switch__control"><span class="switch__knob"></span></span>
  <span class="body-medium">Notifications</span>
</label>`,
          'switch.html',
          'html',
        )}

        <h3 id="switch-interactive">Interactive switches</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SWITCH_INTERACTIVE}
          </div>
        </div>

        <h3 id="switch-states">Switch visuals (spec)</h3>
        ${controlStatesDemoSection(
          'switch-on',
          'On',
          'Knob aligned end, action surface fill.',
          controlStaticRow('switch', 'switch__control--on', SWITCH_KNOB),
          'Switch on states',
        )}
        ${controlStatesDemoSection(
          'switch-off',
          'Off',
          'Knob at start, neutral track.',
          controlStaticRow('switch', '', SWITCH_KNOB),
          'Switch off states',
        )}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.checkbox</code> / <code>.radio</code> / <code>.switch</code></td><td>Label wrapper (click target)</td></tr>
              <tr><td><code>.*__input</code></td><td>Visually hidden native input</td></tr>
              <tr><td><code>.*__control</code></td><td>Visible control; doc modifiers <code>--focus</code>, <code>--hover</code>, …</td></tr>
              <tr><td><code>.checkbox--error</code></td><td>Error group; pair with <code>aria-invalid</code></td></tr>
              <tr><td><code>.*__text--pill</code></td><td>Optional pill label when selected</td></tr>
              <tr><td><code>.switch__control--on</code></td><td>Doc-only “on” track (prefer <code>:checked</code> in apps)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'control-size',
            title: 'Control size',
            body: 'Checkbox and radio use 1.5rem (24px) in component SCSS. Switch track is 3rem × 1.625rem.',
            code: `// scss/components/_checkbox.scss
$control-size: 1.5rem;`,
            label: '_checkbox.scss',
            lang: 'scss',
          },
          {
            id: 'rebuild-controls',
            title: 'Rebuild CSS',
            body: 'Run after editing component SCSS.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Selection controls</p>
          <ul>
            <li><strong>Checkbox / switch label</strong>, native <code>&lt;label&gt;</code> wrapping input + control + text.</li>
            <li><strong>Radio groups</strong>, <code>fieldset</code> + visible <code>legend</code>; same <code>name</code> on every option.</li>
            <li><strong>Switch</strong>, <code>role="switch"</code> and <code>aria-checked</code> updated on toggle (wired on this docs site).</li>
            <li><strong>Indeterminate</strong>, set <code>input.indeterminate = true</code> in JS; not an HTML attribute alone.</li>
            <li><strong>Error</strong>, <code>.checkbox--error</code> + <code>aria-invalid="true"</code> when validation fails.</li>
            <li><strong>Focus</strong>, keyboard users get <code>:focus-visible</code> ring on <code>__control</code>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Text inputs and hints.</p></a>
          <a class="pdoc-card" href="/docs/form"><p class="pdoc-card__title">Form</p><p class="pdoc-card__desc">Compose controls in a form.</p></a>
          <a class="pdoc-card" href="/docs/theme-toggle"><p class="pdoc-card__title">Theme toggle</p><p class="pdoc-card__desc">Switch-style theme control.</p></a>
          <a class="pdoc-card" href="/docs/a11y"><p class="pdoc-card__title">Accessibility</p><p class="pdoc-card__desc">Focus and grouping rules.</p></a>
        </div>`;
}
