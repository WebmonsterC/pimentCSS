import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ph, ICON } from './icon';

const LABEL_TOOLTIP = `<button type="button" class="label__tooltip focus-visible" aria-label="Help for this field">${ph('info', 16)}</button>`;

const LABELS_DEMO = `<div class="d-flex flex-column gap-4">
            <div class="input">
              <label class="label" for="pdoc-label-ex1">
                <span class="label__text">Label</span>
                ${LABEL_TOOLTIP}
              </label>
              <div class="field">
                <input class="field__input" id="pdoc-label-ex1" type="text" />
              </div>
            </div>
            <div class="input">
              <label class="label" for="pdoc-label-ex2">
                <span class="label__required" aria-hidden="true">*</span>
                <span class="label__text">Required field</span>
                ${LABEL_TOOLTIP.replace('Help for this field', 'Help')}
              </label>
              <div class="field">
                <input class="field__input" id="pdoc-label-ex2" type="text" required aria-required="true" />
              </div>
            </div>
            <div class="input">
              <label class="label" for="pdoc-label-ex3">
                <span class="label__text">Optional field</span>
                ${LABEL_TOOLTIP.replace('Help for this field', 'Help')}
                <span class="label__optional">(optional)</span>
              </label>
              <div class="field">
                <input class="field__input" id="pdoc-label-ex3" type="text" />
              </div>
            </div>
          </div>`;

const FIELD_SEARCH_ICON = `<span class="field__icon" aria-hidden="true">${ICON.search()}</span>`;

type FieldStateSpec = {
  label: string;
  mod: string;
  input: string;
};

const FIELD_STATE_SPECS: FieldStateSpec[] = [
  { label: 'Default', mod: '', input: 'placeholder="Placeholder"' },
  { label: 'Active', mod: 'field--active', input: 'placeholder="Placeholder"' },
  { label: 'Focus', mod: 'field--focus', input: 'placeholder="Placeholder"' },
  {
    label: 'Error',
    mod: 'field--error',
    input: 'placeholder="Placeholder" aria-invalid="true"',
  },
  { label: 'Success', mod: 'field--success', input: 'placeholder="Placeholder"' },
  { label: 'Disabled', mod: 'field--disabled', input: 'placeholder="Placeholder" disabled' },
];

function fieldStateInputId(idPrefix: string, spec: FieldStateSpec): string {
  const slug = spec.label.toLowerCase().replace(/\s+/g, '-');
  return `pdoc-field-${idPrefix}-${slug}`;
}

function fieldStateCell(
  spec: FieldStateSpec,
  idPrefix: string,
  opts: { value?: string; type?: string; icon?: boolean },
): string {
  const mod = spec.mod ? ` ${spec.mod}` : '';
  const valueAttr = opts.value ? ` value="${opts.value}"` : '';
  const type = opts.type ?? 'text';
  const icon = opts.icon ? `\n              ${FIELD_SEARCH_ICON}` : '';
  const inputId = fieldStateInputId(idPrefix, spec);
  return `            <li class="pdoc-field-state" role="listitem">
              <label class="pdoc-field-state__label" for="${inputId}">${spec.label}</label>
              <div class="field${mod}">${icon}
                <input class="field__input" id="${inputId}" type="${type}" ${spec.input}${valueAttr} />
              </div>
            </li>`;
}

function fieldStatesPreview(
  ariaLabel: string,
  idPrefix: string,
  opts: { value?: string; type?: string; icon?: boolean },
): string {
  const items = FIELD_STATE_SPECS.map((s) => fieldStateCell(s, idPrefix, opts)).join('\n');
  return `<ul class="pdoc-field-states" role="list" aria-label="${ariaLabel}">
${items}
          </ul>`;
}

function fieldStatesDemoSection(
  id: string,
  title: string,
  description: string,
  idPrefix: string,
  opts: { value?: string; type?: string; icon?: boolean },
): string {
  return `
        <h3 id="${id}">${title}</h3>
        <p class="body-small pdoc-text-muted">${description}</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${fieldStatesPreview(`${title} field states`, idPrefix, opts)}
          </div>
        </div>`;
}

const INPUT_BLOCK_DEMO = `<div class="pdoc-demo-row pdoc-demo-row--start">
  <div class="input">
    <label class="label" for="pdoc-full-input">
      <span class="label__required" aria-hidden="true">*</span>
      <span class="label__text">Identifier</span>
    </label>
    <div class="field">
      <input class="field__input" id="pdoc-full-input" type="text" placeholder="Placeholder" autocomplete="username" />
    </div>
    <p class="input__hint" id="pdoc-full-input-hint">Help text below the field (caption).</p>
  </div>
  <div class="input">
    <label class="label" for="pdoc-full-input-err">
      <span class="label__text">Identifier</span>
    </label>
    <div class="field field--error">
      <input class="field__input" id="pdoc-full-input-err" type="text" value="invalid" aria-invalid="true" aria-describedby="pdoc-full-input-err-hint" />
    </div>
    <p class="input__hint input__hint--error" id="pdoc-full-input-err-hint">This value is not valid.</p>
  </div>
</div>`;

const PASSWORD_DEMO = `<div class="input">
            <label class="label" for="pdoc-pwd">
              <span class="label__text">Password</span>
            </label>
            <div class="field">
              <input class="field__input" id="pdoc-pwd" type="password" placeholder="Placeholder" autocomplete="current-password" />
              <button type="button" class="password-toggle focus-visible" aria-pressed="false">Show</button>
            </div>
          </div>`;

const SELECT_DEMO = `<div class="form__field">
            <label class="label" for="pdoc-topic">
              <span class="label__text">Topic</span>
            </label>
            <div class="field">
              <select class="field__input" id="pdoc-topic" name="topic">
                <option value="">Choose a topic</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="press">Press</option>
              </select>
            </div>
          </div>`;

const TEXTAREA_DEMO = `<div class="textarea-wrap">
            <label class="label" for="pdoc-ta">
              <span class="label__text">Description</span>
            </label>
            <p class="textarea-wrap__hint" id="pdoc-ta-hint">Instructions for the long field.</p>
            <div class="textarea-field">
              <textarea class="textarea focus-visible" id="pdoc-ta" placeholder="Placeholder" rows="5" maxlength="200" aria-describedby="pdoc-ta-hint pdoc-ta-count" data-pdoc-textarea-count="pdoc-ta-count"></textarea>
              <span class="textarea-field__resize" aria-hidden="true"></span>
            </div>
            <p class="textarea-wrap__count" id="pdoc-ta-count" aria-live="polite">0 / 200</p>
          </div>`;

const DEFINED_DEMO = `<div class="d-flex flex-column gap-4">
  <div class="input input--defined">
    <label class="label" for="pdoc-url-default">
      <span class="label__text">URL, default</span>
    </label>
    <div class="field-group">
      <span class="field-group__tab field-group__tab--pre field-group__tab--active">https://</span>
      <div class="field field--defined">
        <input class="field__input" id="pdoc-url-default" type="text" placeholder="example.com" />
      </div>
    </div>
  </div>
  <div class="input input--defined">
    <label class="label" for="pdoc-url-suffix">
      <span class="label__text">Suffix, active post tab</span>
    </label>
    <div class="field-group">
      <div class="field field--defined">
        <input class="field__input" id="pdoc-url-suffix" type="text" placeholder="value" />
      </div>
      <span class="field-group__tab field-group__tab--post field-group__tab--active">.com</span>
    </div>
  </div>
  <div class="input input--defined">
    <label class="label" for="pdoc-url-disabled">
      <span class="label__text">Disabled</span>
    </label>
    <div class="field-group">
      <span class="field-group__tab field-group__tab--pre field-group__tab--active">https://</span>
      <div class="field field--defined field--disabled">
        <input class="field__input" id="pdoc-url-disabled" type="text" value="locked" disabled />
      </div>
    </div>
  </div>
</div>`;

const INPUT_SNIPPET = `<div class="input">
  <label class="label" for="email">
    <span class="label__required" aria-hidden="true">*</span>
    <span class="label__text">Email</span>
  </label>
  <div class="field">
    <input class="field__input" id="email" type="email" name="email" autocomplete="email" />
  </div>
  <p class="input__hint" id="email-hint">We never share your email.</p>
</div>`;

const ERROR_SNIPPET = `<div class="input">
  <label class="label" for="email-err"><span class="label__text">Email</span></label>
  <div class="field field--error">
    <input class="field__input" id="email-err" type="email" aria-invalid="true" aria-describedby="email-err-hint" />
  </div>
  <p class="input__hint input__hint--error" id="email-err-hint">Enter a valid email address.</p>
</div>`;

/** Full Input fields page (Forms). */
export function buildInputFieldsPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Every control needs a visible <strong>label</strong> linked with <code>for</code> / <code>id</code>. Errors use <code>aria-invalid="true"</code> and <code>aria-describedby</code> pointing at the hint. Focus rings use <code>:focus-within</code> on <code>.field</code> (3px). Test light and dark with the header theme toggle.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>Form text controls stack as <code>.input</code> (label + field + hint), <code>.field</code> (bordered control), and optional <code>.field-group</code> tabs for defined widths. Tokens <code>--field-*</code> set default sizing.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Layer</th><th>Source</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Label</td><td><code>scss/components/_label.scss</code></td><td><code>.label</code>, required asterisk, tooltip</td></tr>
              <tr><td>Field</td><td><code>scss/components/_input.scss</code></td><td><code>.field</code>, states, icons, password</td></tr>
              <tr><td>Input block</td><td><code>scss/components/_input.scss</code></td><td><code>.input</code>, <code>.input__hint</code></td></tr>
              <tr><td>Native <code>select</code></td><td><code>scss/components/_input.scss</code></td><td><code>select.field__input</code> inside <code>.field</code></td></tr>
              <tr><td>Textarea</td><td><code>scss/components/_textarea.scss</code></td><td><code>.textarea-wrap</code>, counter</td></tr>
              <tr><td>Semantics</td><td><code>tokens/semantic.css</code></td><td>Borders, surfaces, <code>--text-error</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a> (input components ship in the default bundle).</li>
          <li><strong>Semantic colors</strong>, error and success hues from <a href="/docs/colors">Colors</a>.</li>
          <li><strong>Layout</strong>, optional width utilities; default max width is <code>--field-width</code> (17.5rem).</li>
        </ul>

        <h2 id="anatomy">Anatomy</h2>
        <p>Prefer the <code>.input</code> wrapper so label, control, and hint share a 4px gap (<code>--space-1</code>). The native element sits in <code>.field__input</code> without its own border.</p>
        ${pdocSnippet(
          `<div class="input">
  <label class="label" for="x"><span class="label__text">Label</span></label>
  <div class="field">
    <input class="field__input" id="x" type="text" />
  </div>
  <p class="input__hint">Caption</p>
</div>`,
          'structure.html',
          'html',
        )}

        <h2 id="labels">Labels</h2>
        <p>Required fields show an asterisk with <code>aria-hidden="true"</code> on the glyph (announce requirement in the label text or with <code>aria-required</code> on the input). Optional fields may use <code>.label__optional</code>. Tooltip buttons need an explicit <code>aria-label</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${LABELS_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<label class="label" for="name">
  <span class="label__required" aria-hidden="true">*</span>
  <span class="label__text">Full name</span>
</label>`,
          'label.html',
          'html',
        )}

        <h2 id="field-states">Field states</h2>
        <p>States map to modifiers on <code>.field</code>. In production, rely on <code>:hover</code>, <code>:focus-within</code>, and validation attributes. Each variant has its own preview below (responsive grid, no nested scroll).</p>
        ${fieldStatesDemoSection(
          'field-states-empty',
          'Empty',
          'Placeholder only, no value.',
          'empty',
          {},
        )}
        ${fieldStatesDemoSection(
          'field-states-filled',
          'Filled',
          'A value is already entered.',
          'filled',
          { value: 'Entered value' },
        )}
        ${fieldStatesDemoSection(
          'field-states-icon',
          'With icon',
          'Leading icon (search) with placeholder.',
          'icon',
          { type: 'search', icon: true },
        )}
        <p class="pdoc-muted-note">State previews use visible <code>&lt;label for&gt;</code> + matching <code>id</code> on each input.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Modifier</th><th>When to use</th></tr></thead>
            <tbody>
              <tr><td><code>.field--active</code></td><td>Doc / forced active border (<code>--border-action-hover</code>)</td></tr>
              <tr><td><code>.field--focus</code></td><td>Doc preview of focus ring (prefer <code>:focus-within</code>)</td></tr>
              <tr><td><code>.field--error</code></td><td>Validation failed; pair with <code>aria-invalid="true"</code></td></tr>
              <tr><td><code>.field--success</code></td><td>Valid entry confirmed</td></tr>
              <tr><td><code>.field--disabled</code></td><td>Disabled input inside field</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="input-block">Input block (label + hint)</h2>
        <p>Stack label, field, and caption. Error hints use <code>.input__hint--error</code> and <code>--text-error</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${INPUT_BLOCK_DEMO}
          </div>
        </div>
        ${pdocSnippet(INPUT_SNIPPET, 'input.html', 'html')}
        ${pdocSnippet(ERROR_SNIPPET, 'input-error.html', 'html')}

        <h2 id="password">Password</h2>
        <p>Add <code>.password-toggle</code> inside <code>.field</code>. Toggle updates <code>type</code>, button label, and <code>aria-pressed</code> (wired on this docs site).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${PASSWORD_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="input">
  <label class="label" for="pwd"><span class="label__text">Password</span></label>
  <div class="field">
    <input class="field__input" id="pwd" type="password" autocomplete="current-password" />
    <button type="button" class="password-toggle focus-visible" aria-pressed="false">Show</button>
  </div>
</div>`,
          'password.html',
          'html',
        )}

        <h2 id="select">Native select</h2>
        <p>Place a native <code>&lt;select&gt;</code> inside <code>.field</code> with class <code>field__input</code>. A chevron is drawn on the field (icon font). For rich listboxes, use <a href="/docs/menu-dropdown">Menu &amp; dropdown</a>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SELECT_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="field">
  <select class="field__input" id="country" name="country">
    <option value="">Country</option>
    <option value="fr">France</option>
  </select>
</div>`,
          'select.html',
          'html',
        )}

        <h2 id="textarea">Textarea</h2>
        <p>Long text uses <code>.textarea-wrap</code> with optional instructions and a live counter (<code>aria-live="polite"</code>).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TEXTAREA_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="textarea-wrap">
  <label class="label" for="bio"><span class="label__text">Bio</span></label>
  <div class="textarea-field">
    <textarea class="textarea focus-visible" id="bio" rows="5" maxlength="200" aria-describedby="bio-count"></textarea>
  </div>
  <p class="textarea-wrap__count" id="bio-count" aria-live="polite">0 / 200</p>
</div>`,
          'textarea.html',
          'html',
        )}

        <h2 id="defined-field">Defined field (prefix / suffix)</h2>
        <p>Wide controls (<code>--field-width-defined</code>, 26.875rem) use <code>.input--defined</code> and <code>.field-group</code> with pre/post tabs. Active tab uses <code>--surface-action</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${DEFINED_DEMO}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="input input--defined">
  <label class="label" for="url"><span class="label__text">Website</span></label>
  <div class="field-group">
    <span class="field-group__tab field-group__tab--pre field-group__tab--active">https://</span>
    <div class="field field--defined">
      <input class="field__input" id="url" type="text" />
    </div>
  </div>
</div>`,
          'defined.html',
          'html',
        )}

        <h2 id="api">Class reference</h2>
        <p>Optional namespace via Sass <code>$prefix</code> (empty by default).</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.label</code></td><td>Caption row; pair with <code>for</code> + input <code>id</code></td></tr>
              <tr><td><code>.label__required</code></td><td>Visual asterisk (<code>aria-hidden</code>)</td></tr>
              <tr><td><code>.label__optional</code></td><td>Muted “(optional)” suffix</td></tr>
              <tr><td><code>.label__tooltip</code></td><td>Icon button; requires <code>aria-label</code></td></tr>
              <tr><td><code>.field</code></td><td>Bordered control shell; <code>:focus-within</code> ring</td></tr>
              <tr><td><code>.field__input</code></td><td>Native input (no border)</td></tr>
              <tr><td><code>.field__icon</code></td><td>Leading icon slot (<code>aria-hidden</code>)</td></tr>
              <tr><td><code>.field--error</code> / <code>--success</code></td><td>Validation borders</td></tr>
              <tr><td><code>.input</code></td><td>Vertical stack: label + field + hint</td></tr>
              <tr><td><code>.input__hint</code></td><td>Caption; <code>--error</code> / <code>--success</code> variants</td></tr>
              <tr><td><code>.password-toggle</code></td><td>Show/hide password control</td></tr>
              <tr><td><code>.textarea-wrap</code></td><td>Textarea stack with hint and counter</td></tr>
              <tr><td><code>.textarea</code></td><td>Native textarea inside <code>.textarea-field</code></td></tr>
              <tr><td><code>.field-group</code></td><td>Prefix/suffix tabs + field</td></tr>
              <tr><td><code>.field-group__tab--active</code></td><td>Highlighted pre/post segment</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'field-tokens',
            title: 'Field sizing tokens',
            body: 'Override widths and padding when importing PimentCSS. Values feed <code>--field-*</code> CSS variables.',
            code: `@use "pimentcss" with (
  $field-width: 20rem,
  $field-width-defined: 28rem,
  $field-min-height: 2.75rem,
);`,
            label: 'theme.scss',
            lang: 'scss',
          },
          {
            id: 'field-rebuild',
            title: 'Rebuild CSS',
            body: 'Regenerate <code>dist/pimentcss.min.css</code> after Sass changes.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}
        <p>See <a href="/docs/customization">Customization</a> for partial imports.</p>

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Forms without barriers</p>
          <ul>
            <li><strong>Labels</strong>, every input has a visible label and matching <code>id</code>. Do not use placeholder as the only label.</li>
            <li><strong>Errors</strong>, set <code>aria-invalid="true"</code> and link the message with <code>aria-describedby</code> (hint paragraph <code>id</code>).</li>
            <li><strong>Required</strong>, use <code>required</code> or <code>aria-required="true"</code> plus text or asterisk explained in copy.</li>
            <li><strong>Focus</strong>, keyboard users get <code>:focus-within</code> ring on <code>.field</code> / <code>.textarea-field</code> (<code>--border-focus</code>, 3px).</li>
            <li><strong>Password toggle</strong>, update <code>aria-pressed</code> when visibility changes; keep button text meaningful (Show / Hide).</li>
            <li><strong>Contrast</strong>, body and hint text on <code>--surface-primary</code> ≥ 4.5:1; verify in light and dark (<a href="/docs/colors">Colors</a>).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/form"><p class="pdoc-card__title">Form</p><p class="pdoc-card__desc">Compose fields into a form layout.</p></a>
          <a class="pdoc-card" href="/docs/checkboxes-radios-switch"><p class="pdoc-card__title">Checkboxes &amp; switches</p><p class="pdoc-card__desc">Boolean and single-choice inputs.</p></a>
          <a class="pdoc-card" href="/docs/autocomplete"><p class="pdoc-card__title">Autocomplete</p><p class="pdoc-card__desc">Suggestions panel on a field.</p></a>
          <a class="pdoc-card" href="/docs/a11y"><p class="pdoc-card__title">Accessibility</p><p class="pdoc-card__desc">Focus, contrast, and touch targets.</p></a>
        </div>`;
}
