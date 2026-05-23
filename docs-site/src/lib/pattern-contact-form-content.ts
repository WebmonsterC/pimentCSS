import { pdocSnippet } from './pdoc-html';
import { ICON } from './icon';

const SNIPPET_OPEN = { expanded: true } as const;

const CONTACT_RECIPE_DEMO = `<form class="form" action="#" method="post" novalidate>
            <h2 class="form__title">Contact us</h2>
            <div class="form__body">
              <div class="form__field">
                <label class="label" for="pdoc-pattern-name">
                  <span class="label__text">Name</span>
                </label>
                <div class="field">
                  <input class="field__input" id="pdoc-pattern-name" name="name" type="text" autocomplete="name" required />
                </div>
              </div>
              <div class="form__field">
                <label class="label" for="pdoc-pattern-email">
                  <span class="label__text">Email</span>
                </label>
                <div class="field">
                  <span class="field__icon" aria-hidden="true">${ICON.mail()}</span>
                  <input class="field__input" id="pdoc-pattern-email" name="email" type="email" autocomplete="email" required />
                </div>
              </div>
              <div class="textarea-wrap form__field">
                <label class="label" for="pdoc-pattern-message">
                  <span class="label__text">Message</span>
                </label>
                <div class="textarea-field">
                  <textarea class="textarea" id="pdoc-pattern-message" name="message" rows="4" required></textarea>
                  <span class="textarea-field__resize" aria-hidden="true"></span>
                </div>
              </div>
              <label class="checkbox form__checkbox">
                <input class="checkbox__input" type="checkbox" name="consent" id="pdoc-pattern-consent" required />
                <span class="checkbox__control" aria-hidden="true">${ICON.check()}</span>
                <span class="body-medium">I agree to be contacted about my request.</span>
              </label>
            </div>
            <div class="form__actions">
              <button type="submit" class="btn btn--primary focus-visible">Send message</button>
            </div>
          </form>`;

const CONTACT_RECIPE_SNIPPET = `<form class="form" action="/contact" method="post">
  <h2 class="form__title">Contact us</h2>
  <div class="form__body">
    <div class="form__field">
      <label class="label" for="contact-name"><span class="label__text">Name</span></label>
      <div class="field">
        <input class="field__input" id="contact-name" name="name" type="text" autocomplete="name" required />
      </div>
    </div>
    <div class="form__field">
      <label class="label" for="contact-email"><span class="label__text">Email</span></label>
      <div class="field">
        <input class="field__input" id="contact-email" name="email" type="email" autocomplete="email" required />
      </div>
    </div>
    <div class="textarea-wrap form__field">
      <label class="label" for="contact-message"><span class="label__text">Message</span></label>
      <div class="textarea-field">
        <textarea class="textarea" id="contact-message" name="message" rows="4" required></textarea>
      </div>
    </div>
  </div>
  <div class="form__actions">
    <button type="submit" class="btn btn--primary">Send message</button>
  </div>
</form>`;

/** Pattern: contact form recipe. */
export function buildPatternContactFormPageHtml(): string {
  return `
        <p class="pdoc-pattern-lead">A centered <code>.form</code> panel for marketing or support pages. Combines <a href="/docs/input-fields">Input fields</a>, <a href="/docs/checkboxes-radios-switch">Checkboxes</a>, and <a href="/docs/buttons">Buttons</a>.</p>

        <h2 id="when-to-use">When to use it</h2>
        <ul>
          <li>Single-column contact, quote, or newsletter signup on a landing page.</li>
          <li>You need one primary submit and optional consent checkbox.</li>
          <li>Server-side validation maps to <code>field--error</code> and <code>aria-invalid</code> (see full <a href="/docs/form">Form</a> demo).</li>
        </ul>

        <h2 id="recipe">Recipe</h2>
        <ol class="pdoc-pattern-steps">
          <li>Wrap fields in <code>.form</code> with <code>.form__title</code>, <code>.form__body</code>, and <code>.form__actions</code>.</li>
          <li>Each control row uses <code>.form__field</code> + <code>.label</code> + <code>.field</code> or <code>.textarea-wrap</code>.</li>
          <li>Put consent or opt-in in <code>.form__body</code> as a <code>.checkbox</code> before actions.</li>
          <li>Use <code>type="submit"</code> on a <code>.btn--primary</code> inside <code>.form__actions</code>.</li>
        </ol>

        <h2 id="demo">Live demo</h2>
        <div class="pdoc-demo pdoc-pattern-demo--form" data-pdoc-demo data-pdoc-code-expanded="true">
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${CONTACT_RECIPE_DEMO}
          </div>
        </div>

        <h2 id="markup">Copy markup</h2>
        ${pdocSnippet(CONTACT_RECIPE_SNIPPET, 'contact.html', 'html', SNIPPET_OPEN)}

        <h2 id="related">Component reference</h2>
        <div class="pdoc-cards pdoc-cards--3">
          <a class="pdoc-card" href="/docs/form"><p class="pdoc-card__title">Form</p><p class="pdoc-card__desc">Full panel API and validation example.</p></a>
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Labels, hints, and error states.</p></a>
          <a class="pdoc-card" href="/docs/patterns"><p class="pdoc-card__title">All patterns</p><p class="pdoc-card__desc">More composition recipes.</p></a>
        </div>`;
}
