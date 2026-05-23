import { pdocSnippet, pdocSteps } from './pdoc-html';
import {
  MEDIA_RATIO_PRESETS,
  type MediaRatioModifier,
  cardMediaBlock,
  mediaPlaceholderForRatio,
} from './media-ratio-presets';
import { ICON, ph } from './icon';

const COPY_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus arcu sed ante consectetur porttitor. Aenean malesuada augue id pulvinar molestie.';

function cardPrimaryBtn(label: string): string {
  return `<button type="button" class="btn btn--primary focus-visible">
                  ${ICON.arrowRight('btn__icon', 20)}
                  ${label}
                </button>`;
}

function copyCardBody(): string {
  return `<div class="copy-block">
                    <h3 class="heading-h5">Headline medium length</h3>
                    <p class="copy-block__text">${COPY_TEXT}</p>
                  </div>
                  ${cardPrimaryBtn('Learn more')}`;
}

function verticalCopyCard(mod: MediaRatioModifier): string {
  return `<article class="card card--copy">
                <div class="card__slots">
                  ${cardMediaBlock(mod)}
                  ${copyCardBody()}
                </div>
              </article>`;
}

function horizontalCopyCard(mod: MediaRatioModifier): string {
  return `<article class="card card--copy card--horizontal">
                <div class="card__slots">
                  ${cardMediaBlock(mod)}
                  <div class="card__content">
                    ${copyCardBody()}
                  </div>
                </div>
              </article>`;
}

const COPY_CARD = verticalCopyCard('media--8-5');

const MEDIA_RATIO_MATRIX = `<div class="pdoc-cards-media-matrix" role="group" aria-label="Card media aspect ratios">
              ${MEDIA_RATIO_PRESETS.map(
                ({ mod, label }) => `<div class="pdoc-cards-media-matrix__item">
                <p class="pdoc-cards-media-matrix__label body-small body-medium--semibold"><code>${mod}</code> · ${label}</p>
                ${verticalCopyCard(mod)}
              </div>`,
              ).join('\n              ')}
            </div>`;

const ORIENTATION_DEMOS = `<div class="pdoc-cards-orientation" role="group" aria-label="Vertical and horizontal card layouts">
              <div class="pdoc-cards-orientation__item">
                <p class="pdoc-cards-orientation__label body-medium body-medium--semibold">Vertical · <code>media--8-5</code></p>
                ${verticalCopyCard('media--8-5')}
              </div>
              <div class="pdoc-cards-orientation__item">
                <p class="pdoc-cards-orientation__label body-medium body-medium--semibold">Vertical · <code>media--3-4</code></p>
                ${verticalCopyCard('media--3-4')}
              </div>
              <div class="pdoc-cards-orientation__item pdoc-cards-orientation__item--wide">
                <p class="pdoc-cards-orientation__label body-medium body-medium--semibold">Horizontal · <code>card--horizontal</code> + <code>media--3-4</code></p>
                ${horizontalCopyCard('media--3-4')}
              </div>
              <div class="pdoc-cards-orientation__item pdoc-cards-orientation__item--wide">
                <p class="pdoc-cards-orientation__label body-medium body-medium--semibold">Horizontal · <code>media--1-1</code></p>
                ${horizontalCopyCard('media--1-1')}
              </div>
            </div>`;

const NEWSLETTER_CARD = `<article class="card card--newsletter">
                <div class="card__slots">
                  <div class="input">
                    <label class="label" for="pdoc-card-news-email">
                      <span class="label__text">Email</span>
                      <button type="button" class="label__tooltip focus-visible" aria-label="Why we need your email">
                        ${ph('info', 16, '')}
                      </button>
                    </label>
                    <p class="input__hint">We will not share your address.</p>
                    <div class="field">
                      <span class="field__icon" aria-hidden="true">${ICON.mail()}</span>
                      <input class="field__input" id="pdoc-card-news-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" />
                    </div>
                  </div>
                  ${cardPrimaryBtn('Subscribe')}
                </div>
              </article>`;

const BLANK_CARD = `<article class="card card--blank">
                <div class="card__slots">
                  <div class="slots-layout slots-layout--row slots-layout--fluid" role="group" aria-label="Composable slot regions">
                    <div class="slot">Header</div>
                    <div class="slot">Content</div>
                    <div class="slot">Action</div>
                  </div>
                </div>
              </article>`;

const SHOWCASE = `<div class="pdoc-cards-showcase" role="group" aria-label="Card layout variants">
              <div class="pdoc-cards-showcase__item">
                <p class="pdoc-cards-showcase__label body-medium body-medium--semibold">Copy card</p>
                ${COPY_CARD}
              </div>
              <div class="pdoc-cards-showcase__item">
                <p class="pdoc-cards-showcase__label body-medium body-medium--semibold">Newsletter signup</p>
                ${NEWSLETTER_CARD}
              </div>
              <div class="pdoc-cards-showcase__item">
                <p class="pdoc-cards-showcase__label body-medium body-medium--semibold">Blank card</p>
                ${BLANK_CARD}
              </div>
            </div>`;

const ELEVATED_CARD = `<article class="card card--elevated pdoc-card-elevated-demo">
              <header class="card__header">Card title</header>
              <div class="card__body">
                <p class="body-medium">Structured panel with header, body, and footer. Uses <code>--shadow-sm</code> and region borders.</p>
              </div>
              <footer class="card__footer">
                <button type="button" class="btn btn--primary focus-visible">Action</button>
              </footer>
            </article>`;

const ratioSnippet = mediaPlaceholderForRatio('media--8-5');

export function buildCardsPageHtml(): string {
  return `
        <p>Composable <strong>cards</strong> for Copy, Newsletter, and Blank layouts. Styles live in <code>scss/components/_card.scss</code> with <code>_slot.scss</code>, <code>_copy.scss</code>, and form primitives. For overlay dialogs, see <a href="/docs/modals">Modals</a>; for inline feedback, see <a href="/docs/alerts">Alerts</a>.</p>

        <h2 id="cards-variants">Card variants</h2>
        <p>Each variant sets a max width: <code>card--copy</code> (26rem), <code>card--newsletter</code> (32rem), <code>card--blank</code> (11.6875rem). Stack blocks in <code>.card__slots</code> (media, copy, fields, slots).</p>
        <p class="body-small pdoc-text-muted"><strong>Blank card</strong> is an empty shell: dashed <code>.slot</code> placeholders show where you compose custom regions (header, body, actions) with <a href="/docs/slots-layouts">Slots &amp; layouts</a>. It is not a fourth content pattern like Copy or Newsletter.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SHOWCASE}
          </div>
        </div>
        ${pdocSnippet(
          `<article class="card card--copy">
  <div class="card__slots">
    <div class="copy-block">
      <h2 class="heading-h5">Title</h2>
      <p class="copy-block__text">Supporting copy.</p>
    </div>
    <button type="button" class="btn btn--primary">Action</button>
  </div>
</article>`,
          'card-copy.html',
          'html',
        )}

        <h2 id="cards-media">Media ratios in cards</h2>
        <p>Pair <code>.card__media</code> with the same <code>.media--*</code> modifiers as on the <a href="/docs/placeholder">Placeholder</a> page. Placeholder SVGs use matching intrinsic dimensions (<code>/media-placeholder/{w}/{h}/{variant}.svg</code>) so the crop aligns with <code>aspect-ratio</code>. Vertical cards use <code>$card-copy-gap</code> (12px) between media and copy, then <code>$slot-gap</code> (24px) before the action; summary text uses <code>body-small</code> via <code>.copy-block__text</code> inside <code>.card</code>.</p>
        <ul class="body-medium">
          <li><strong>Vertical</strong> (default), media stacks above copy in <code>.card__slots</code>.</li>
          <li><strong>Horizontal</strong>, add <code>card--horizontal</code> and wrap copy + actions in <code>.card__content</code>; portrait <code>media--3-4</code> or square <code>media--1-1</code> work well beside text.</li>
        </ul>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${MEDIA_RATIO_MATRIX}
          </div>
        </div>
        ${pdocSnippet(
          `<article class="card card--copy">
  <div class="card__slots">
    <div class="card__media media media--8-5">
      <img src="${ratioSnippet.src}" alt="" width="${ratioSnippet.width}" height="${ratioSnippet.height}" />
    </div>
    <div class="copy-block">…</div>
  </div>
</article>`,
          'card-media-ratio.html',
          'html',
        )}

        <h2 id="cards-orientation">Vertical and horizontal layouts</h2>
        <p><code>card--horizontal</code> lays out <code>.card__slots</code> as a row: fixed-width media, flexible <code>.card__content</code> for copy and buttons. Wide ratios (<code>media--8-5</code>, <code>media--3-2</code>) suit vertical cards; tall or square ratios suit horizontal rows.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ORIENTATION_DEMOS}
          </div>
        </div>
        ${pdocSnippet(
          `<article class="card card--copy card--horizontal">
  <div class="card__slots">
    <div class="card__media media media--3-4">
      <img src="/media-placeholder/360/480/2.svg" alt="" width="360" height="480" />
    </div>
    <div class="card__content">
      <div class="copy-block">…</div>
      <button type="button" class="btn btn--primary">Learn more</button>
    </div>
  </div>
</article>`,
          'card-horizontal.html',
          'html',
        )}

        <h2 id="cards-elevated">Elevated card (header / body / footer)</h2>
        <p><code>.card--elevated</code> removes outer padding and splits header, body, and footer with borders. Footer uses <code>surface-muted</code>. Pair with semantic regions and a visible title in the header.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-card-elevated-wrap">
            ${ELEVATED_CARD}
          </div>
        </div>
        ${pdocSnippet(
          `<article class="card card--elevated">
  <header class="card__header">Card title</header>
  <div class="card__body"><p class="body-medium">Content</p></div>
  <footer class="card__footer">
    <button type="button" class="btn btn--primary">Action</button>
  </footer>
</article>`,
          'card-elevated.html',
          'html',
        )}

        <h2 id="cards-related">Related patterns</h2>
        <ul class="body-medium">
          <li><a href="/docs/placeholder">Placeholder</a>, copy blocks and <code>.media</code> ratios used in the Copy card.</li>
          <li><a href="/docs/slots-layouts">Slots &amp; layouts</a>, <code>.slot</code> and <code>.slots-layout</code> in the Blank card.</li>
          <li><a href="/docs/input-fields">Input fields</a>, labels and fields in the Newsletter card.</li>
          <li><a href="/docs/modals">Modals</a>, overlay dialogs when a card pattern is not enough.</li>
        </ul>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.card</code></td><td>Base container (padding, border, column flex)</td></tr>
              <tr><td><code>.card__slots</code></td><td>Vertical stack for card content (gap <code>$slot-gap</code>)</td></tr>
              <tr><td><code>.card__media</code></td><td>Full-width media inside a card; pair with <code>.media--1-1</code> … <code>.media--3-2</code></td></tr>
              <tr><td><code>.card__content</code></td><td>Copy + actions column inside <code>card--horizontal</code></td></tr>
              <tr><td><code>.card--copy</code> / <code>.card--newsletter</code> / <code>.card--blank</code></td><td>Max-width presets per variant (copy, newsletter, blank)</td></tr>
              <tr><td><code>.card--horizontal</code></td><td>Row layout: media + <code>.card__content</code> (max-width <code>$card-width-horizontal</code>)</td></tr>
              <tr><td><code>.card--elevated</code></td><td>Shadow + header/body/footer regions</td></tr>
              <tr><td><code>.card__header</code> / <code>.card__body</code> / <code>.card__footer</code></td><td>Structured elevated regions</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'cards-tokens',
            title: 'Card widths and padding',
            body: 'Override layout tokens before importing components.',
            code: `@use "pimentcss-design-system" with (
  $card-width-copy: 36rem,
  $card-width-horizontal: 42rem,
  $card-horizontal-media-width: 12rem,
  $card-padding: 1.25rem,
  $slot-gap: 1rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'cards-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _card.scss or related partials.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Cards</p>
          <ul>
            <li><strong>Landmarks</strong>, use <code>&lt;article&gt;</code> when the card is a self-contained unit; include a heading (for example <code>h2</code> / <code>h3</code> in the copy block).</li>
            <li><strong>Images</strong>, decorative thumbnails use <code>alt=""</code>; informative images need descriptive <code>alt</code> text. Set <code>width</code> and <code>height</code> to the real asset dimensions so layout matches <code>aspect-ratio</code>.</li>
            <li><strong>Forms</strong>, every field in the Newsletter card needs a visible <code>&lt;label&gt;</code> linked with <code>for</code> / <code>id</code>.</li>
            <li><strong>Actions</strong>, primary buttons must have an accessible name; do not rely on the card title alone.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/modals"><p class="pdoc-card__title">Modals</p><p class="pdoc-card__desc">Overlay dialogs for focused tasks.</p></a>
          <a class="pdoc-card" href="/docs/alerts"><p class="pdoc-card__title">Alerts</p><p class="pdoc-card__desc">Inline and dialog feedback.</p></a>
          <a class="pdoc-card" href="/docs/slots-layouts"><p class="pdoc-card__title">Slots &amp; layouts</p><p class="pdoc-card__desc">Composable slot regions.</p></a>
          <a class="pdoc-card" href="/docs/placeholder"><p class="pdoc-card__title">Placeholder</p><p class="pdoc-card__desc">Copy blocks and media ratios.</p></a>
        </div>`;
}
