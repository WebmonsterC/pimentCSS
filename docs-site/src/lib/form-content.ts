import { pdocSnippet, pdocSteps } from './pdoc-html';
import { ICON } from './icon';

const CHECK_ICON = ICON.check();
const EMAIL_ICON = `<span class="field__icon" aria-hidden="true">${ICON.mail()}</span>`;
const PHONE_ICON = `<span class="field__icon" aria-hidden="true">${ICON.phone()}</span>`;

const RADIO_DOT = `<span class="radio__dot" aria-hidden="true"></span>`;

const CONTACT_FORM_DEMO = `<form class="form" action="#" method="post" novalidate>
            <h2 class="form__title">Contact us</h2>
            <div class="form__body">
              <div class="form__field">
                <label class="label" for="pdoc-form-name">
                  <span class="label__text">Name</span>
                </label>
                <div class="field">
                  <input class="field__input" id="pdoc-form-name" name="name" type="text" autocomplete="name" placeholder="Your name" required />
                </div>
              </div>
              <div class="form__field">
                <label class="label" for="pdoc-form-email">
                  <span class="label__text">Email</span>
                </label>
                <div class="field field--error">
                  ${EMAIL_ICON}
                  <input class="field__input" id="pdoc-form-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required aria-invalid="true" aria-describedby="pdoc-form-email-hint" />
                </div>
                <p class="input__hint input__hint--error" id="pdoc-form-email-hint">Enter a valid email address.</p>
              </div>
              <div class="form__field">
                <label class="label" for="pdoc-form-phone">
                  <span class="label__text">Phone number</span>
                </label>
                <div class="field">
                  ${PHONE_ICON}
                  <input class="field__input" id="pdoc-form-phone" name="phone" type="tel" autocomplete="tel" placeholder="+33 …" />
                </div>
              </div>
              <div class="form__field">
                <label class="label" for="pdoc-form-topic">
                  <span class="label__text">Topic</span>
                </label>
                <div class="field">
                  <select class="field__input" id="pdoc-form-topic" name="topic" required>
                    <option value="">Choose a topic</option>
                    <option value="support">Support</option>
                    <option value="sales">Sales</option>
                  </select>
                </div>
              </div>
              <fieldset class="form__fieldset pdoc-fieldset">
                <legend class="body-medium body-medium--semibold">Preferred contact</legend>
                <label class="radio form__radio">
                  <input type="radio" name="pdoc-form-contact" class="radio__input" id="pdoc-form-contact-email" value="email" checked />
                  <span class="radio__control" aria-hidden="true">${RADIO_DOT}</span>
                  <span class="body-medium">Email</span>
                </label>
                <label class="radio form__radio">
                  <input type="radio" name="pdoc-form-contact" class="radio__input" id="pdoc-form-contact-phone" value="phone" />
                  <span class="radio__control" aria-hidden="true">${RADIO_DOT}</span>
                  <span class="body-medium">Phone</span>
                </label>
              </fieldset>
              <div class="textarea-wrap form__field">
                <label class="label" for="pdoc-form-message">
                  <span class="label__text">Message</span>
                </label>
                <div class="textarea-field">
                  <textarea class="textarea" id="pdoc-form-message" name="message" rows="4" placeholder="How can we help?" aria-describedby="pdoc-form-message-hint"></textarea>
                  <span class="textarea-field__resize" aria-hidden="true"></span>
                </div>
                <p class="textarea-wrap__hint" id="pdoc-form-message-hint">Optional, 500 characters max in production.</p>
              </div>
              <label class="checkbox form__checkbox">
                <input class="checkbox__input" type="checkbox" name="newsletter" id="pdoc-form-newsletter" checked />
                <span class="checkbox__control" aria-hidden="true">${CHECK_ICON}</span>
                <span class="body-medium">I would like to receive news about PimentCSS.</span>
              </label>
            </div>
            <div class="form__actions">
              <button type="submit" class="btn btn--primary">
                Subscribe now
                ${ICON.arrowRight('btn__icon', 20)}
              </button>
            </div>
          </form>`;

/** Full Form page (Forms). */
export function buildFormPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Every control needs a visible <strong>label</strong> tied with <code>for</code> / <code>id</code>. Use native <code>&lt;form&gt;</code>, logical tab order, and clear submit actions. This block composes patterns from <a href="/docs/input-fields">Input fields</a> and <a href="/docs/checkboxes-radios-switch">Checkboxes &amp; switches</a>.</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p><code>.form</code> is a centered panel (max 328px) that stacks a heading, field rows, an optional checkbox row, and a full-width primary action. Default spacing: 24px padding, 48px between title and body, 16px between fields.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Panel</td><td><code>.form</code></td><td>Surface, padding, vertical rhythm</td></tr>
              <tr><td>Title</td><td><code>.form__title</code></td><td>Heading styled as h4 token</td></tr>
              <tr><td>Fields stack</td><td><code>.form__body</code></td><td>Inputs + optional checkbox</td></tr>
              <tr><td>Row</td><td><code>.form__field</code></td><td>Label + one <code>.field</code> or <code>.textarea</code></td></tr>
              <tr><td>Actions</td><td><code>.form__actions</code></td><td>Full-width <code>.btn</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Input fields</strong>, <code>.label</code>, <code>.field</code>, icons from <a href="/docs/input-fields">Input fields</a>.</li>
          <li><strong>Checkbox</strong>, opt-in row via <a href="/docs/checkboxes-radios-switch">Checkboxes &amp; switches</a>.</li>
          <li><strong>Buttons</strong>, primary submit from <a href="/docs/buttons">Buttons</a>.</li>
        </ul>

        <h2 id="structure">Structure</h2>
        <p>Wrap fields in <code>.form__field</code> so label-to-control gap (4px) and field width (280px) stay consistent. Checkbox uses <code>.form__checkbox</code> on the label for full-width alignment inside the body.</p>
        ${pdocSnippet(
          `<form class="form" action="/contact" method="post">
  <h2 class="form__title">Contact us</h2>
  <div class="form__body">
    <div class="form__field">
      <label class="label" for="email">…</label>
      <div class="field">…</div>
    </div>
    <label class="checkbox form__checkbox">…</label>
  </div>
  <div class="form__actions">
    <button type="submit" class="btn btn--primary">Send</button>
  </div>
</form>`,
          'form-structure.html',
          'html',
        )}

        <h2 id="contact-example">Contact form example</h2>
        <p>Interactive demo combining text inputs, native <code>select</code>, radio group, textarea, validation error, checkbox, and submit. All controls use PimentCSS form patterns.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-form-demo">
            ${CONTACT_FORM_DEMO}
          </div>
        </div>

        <h3 id="form-field-row">Field row</h3>
        <p>Each <code>.form__field</code> is a column: <code>.label</code> then <code>.field</code> (or <code>.textarea</code>). Icons and validation states come from the field component; the form only sets width and vertical gap.</p>
        ${pdocSnippet(
          `<div class="form__field">
  <label class="label" for="topic">
    <span class="label__text">Topic</span>
  </label>
  <div class="field">
    <input class="field__input focus-visible" id="topic" name="topic" type="text" />
  </div>
</div>`,
          'form-field.html',
          'html',
        )}

        <h3 id="form-checkbox">Checkbox in the form</h3>
        <p>Add <code>.form__checkbox</code> on the checkbox label so it spans the body width and aligns with touch targets. Keep the native input first, then <code>.checkbox__control</code>, then text.</p>

        <h3 id="form-actions">Actions</h3>
        <p><code>.form__actions</code> stretches child buttons to 100% width. Pair with <code>.btn--primary</code> for the main submit.</p>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.form</code></td><td>Root panel; flex column, centered, surface background</td></tr>
              <tr><td><code>.form__title</code></td><td>Title using heading h4 tokens</td></tr>
              <tr><td><code>.form__body</code></td><td>Stack of fields and optional checkbox</td></tr>
              <tr><td><code>.form__field</code></td><td>Single label + control row (280px max)</td></tr>
              <tr><td><code>.form__checkbox</code></td><td>Full-width checkbox label variant</td></tr>
              <tr><td><code>.form__fieldset</code></td><td>Radio group with legend inside the body</td></tr>
              <tr><td><code>.form__radio</code></td><td>Full-width radio label variant</td></tr>
              <tr><td><code>.form__actions</code></td><td>Footer actions; buttons fill width</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'form-tokens',
            title: 'Form spacing',
            body: 'Override panel width and gaps before importing components.',
            code: `@use "pimentcss-design-system" with (
  $form-max-width: 22rem,
  $form-gap: 2.5rem,
  $form-body-gap: 1rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'form-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _form.scss or tokens.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Forms</p>
          <ul>
            <li><strong>Labels</strong>, every input has a visible <code>&lt;label for="…"&gt;</code> matching <code>id</code>.</li>
            <li><strong>Required fields</strong>, use <code>required</code> and <code>aria-required="true"</code> when applicable; show errors with <code>aria-invalid</code> on the control.</li>
            <li><strong>Submit</strong>, use <code>type="submit"</code> on the primary button; do not rely on Enter in a single-field page without a form element.</li>
            <li><strong>Autocomplete</strong>, set meaningful <code>autocomplete</code> values (e.g. <code>name</code>, <code>email</code>, <code>tel</code>).</li>
            <li><strong>Checkbox copy</strong>, label text describes the consent; checked state must be perceivable (not color alone).</li>
            <li><strong>Focus</strong>, <code>focus-visible</code> on inputs, checkbox, and submit for keyboard users.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Labels, fields, validation.</p></a>
          <a class="pdoc-card" href="/docs/checkboxes-radios-switch"><p class="pdoc-card__title">Checkboxes &amp; switches</p><p class="pdoc-card__desc">Selection controls.</p></a>
          <a class="pdoc-card" href="/docs/date-picker"><p class="pdoc-card__title">Date picker</p><p class="pdoc-card__desc">Date input pattern.</p></a>
          <a class="pdoc-card" href="/docs/a11y"><p class="pdoc-card__title">Accessibility</p><p class="pdoc-card__desc">Forms and focus guidance.</p></a>
        </div>`;
}
