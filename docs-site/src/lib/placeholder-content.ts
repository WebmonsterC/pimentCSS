import { pdocSnippet, pdocSteps } from './pdoc-html';
import { mediaPlaceholderQueryUrl, mediaPlaceholderUrl } from './media-placeholder-svg';
import { MEDIA_RATIO_PRESETS, mediaRatioFigure } from './media-ratio-presets';

const TYPE_ROWS: { label: string; className: string; sample: string }[] = [
  { label: '.heading-h6', className: 'heading-h6', sample: 'Headline medium length' },
  { label: '.heading-h5', className: 'heading-h5', sample: 'Headline medium length' },
  { label: '.heading-h4', className: 'heading-h4', sample: 'Headline medium length' },
  { label: '.heading-h3', className: 'heading-h3', sample: 'Headline medium length' },
  { label: '.heading-h2', className: 'heading-h2', sample: 'Headline medium length' },
  { label: '.heading-h1', className: 'heading-h1', sample: 'Headline medium length' },
  {
    label: '.body-small',
    className: 'body-small',
    sample:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus arcu sed ante consectetur porttitor.',
  },
  {
    label: '.body-medium',
    className: 'body-medium',
    sample:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus arcu sed ante consectetur porttitor. Aenean malesuada augue id pulvinar molestie.',
  },
  {
    label: '.body-large',
    className: 'body-large',
    sample:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus arcu sed ante consectetur porttitor. Aenean malesuada augue id pulvinar molestie. Etiam tellus erat.',
  },
];

const COPY_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus arcu sed ante consectetur porttitor. Aenean malesuada augue id pulvinar molestie.';

const TYPE_SCALE = `<div class="pdoc-type-scale pdoc-placeholder-type-scale" role="group" aria-label="Typographic scale">
              ${TYPE_ROWS.map(
                ({ label, className, sample }) => `<div class="pdoc-type-scale__row">
                <p class="${className}">${sample}</p>
                <span class="pdoc-type-scale__meta"><code>${label}</code></span>
              </div>`,
              ).join('\n              ')}
            </div>`;

const COPY_BLOCKS = `<div class="pdoc-placeholder-copy-blocks" role="group" aria-label="Copy block alignment">
              <div class="pdoc-placeholder-copy-blocks__item">
                <p class="body-medium body-medium--semibold pdoc-placeholder-copy-blocks__label">Left</p>
                <div class="copy-block">
                  <h3 class="heading-h5">Headline medium length</h3>
                  <p class="copy-block__text">${COPY_TEXT}</p>
                </div>
              </div>
              <div class="pdoc-placeholder-copy-blocks__item">
                <p class="body-medium body-medium--semibold pdoc-placeholder-copy-blocks__label">Center</p>
                <div class="copy-block copy-block--center">
                  <h3 class="heading-h5">Headline medium length</h3>
                  <p class="copy-block__text">${COPY_TEXT}</p>
                </div>
              </div>
            </div>`;

const MEDIA_GRID = `<div class="pdoc-media-ratios" role="group" aria-label="Image aspect ratios">
              ${MEDIA_RATIO_PRESETS.map(({ mod }) => mediaRatioFigure(mod)).join('\n              ')}
            </div>`;

export function buildPlaceholderPageHtml(): string {
  return `
        <p>Placeholder patterns for loading and layout previews: <strong>typographic copy</strong>, <strong>copy blocks</strong>, and <strong>media ratios</strong>. Styles live in <code>scss/components/_copy.scss</code>, <code>_media.scss</code>, and typography tokens.</p>

        <h2 id="placeholder-copy-scale">Copy, typographic scale</h2>
        <p>Heading and body utility classes from the design system. Pair with semantic HTML (<code>&lt;h1 class="heading-h1"&gt;</code>, <code>&lt;p class="body-medium"&gt;</code>).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TYPE_SCALE}
          </div>
        </div>
        ${pdocSnippet(
          `<h2 class="heading-h3">Section title</h2>
<p class="body-medium">Supporting copy uses the medium body step by default.</p>
<p class="body-small">Metadata or captions use body small.</p>`,
          'placeholder-copy.html',
          'html',
        )}

        <h2 id="placeholder-copy-block">Copy block</h2>
        <p><code>.copy-block</code> groups a heading and paragraph with consistent spacing. Add <code>.copy-block--center</code> to center-align marketing hero copy.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${COPY_BLOCKS}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="copy-block">
  <h2 class="heading-h5">Headline medium length</h2>
  <p class="copy-block__text">Supporting paragraph.</p>
</div>`,
          'copy-block.html',
          'html',
        )}

        <h2 id="placeholder-media">Image ratios</h2>
        <p><code>.media</code> constrains images with <code>aspect-ratio</code>. Modifiers set common crops: <code>media--1-1</code>, <code>media--8-5</code>, <code>media--3-4</code>, <code>media--3-2</code>. Demos use local SVG placeholders from the design system palette (<code>/media-placeholder/{w}/{h}/{variant}.svg</code> or <code>/media-placeholder.svg?w=&amp;h=&amp;v=</code> in dev).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${MEDIA_GRID}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="media media--3-2">
  <img src="${mediaPlaceholderUrl(480, 320, 0)}" alt="Description of the image" width="480" height="320" />
</div>
<!-- Custom size (astro dev): ${mediaPlaceholderQueryUrl(640, 360, 1)} -->`,
          'media.html',
          'html',
        )}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.heading-h1</code> … <code>.heading-h6</code></td><td>Display heading scale (see Typography)</td></tr>
              <tr><td><code>.body-small</code> / <code>.body-medium</code> / <code>.body-large</code></td><td>Body text steps</td></tr>
              <tr><td><code>.copy-block</code></td><td>Stacked title + paragraph (max-width 33rem)</td></tr>
              <tr><td><code>.copy-block--center</code></td><td>Centered copy block</td></tr>
              <tr><td><code>.copy-block__text</code></td><td>Paragraph inside a copy block</td></tr>
              <tr><td><code>.media</code></td><td>Responsive image frame with <code>object-fit: cover</code></td></tr>
              <tr><td><code>.media--1-1</code> … <code>.media--3-2</code></td><td>Aspect ratio modifiers</td></tr>
              <tr><td><code>/media-placeholder/{w}/{h}/{v}.svg</code></td><td>Doc-only gradient placeholder (<code>v</code> = palette variant 0–3)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'placeholder-tokens',
            title: 'Copy and media width',
            body: 'Tune copy block width and default media column size.',
            code: `@use "pimentcss" with (
  $copy-block-max-width: 36rem,
  $media-width-base: 15rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'placeholder-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _copy.scss or _media.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Placeholder content</p>
          <ul>
            <li><strong>Headings</strong>, use real heading levels (<code>h1</code>–<code>h6</code>) with utility classes; do not skip levels for styling only.</li>
            <li><strong>Images</strong>, every <code>&lt;img&gt;</code> in production needs a meaningful <code>alt</code>; decorative thumbnails use <code>alt=""</code>.</li>
            <li><strong>Loading states</strong>, when replacing placeholders with content, move focus and announce updates with <code>aria-live</code> where appropriate.</li>
            <li><strong>Contrast</strong>, body and heading tokens meet theme contrast targets; verify on tinted card backgrounds.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/typography"><p class="pdoc-card__title">Typography</p><p class="pdoc-card__desc">Tokens and heading scale.</p></a>
          <a class="pdoc-card" href="/docs/layout"><p class="pdoc-card__title">Layout</p><p class="pdoc-card__desc">Spacing and page structure.</p></a>
          <a class="pdoc-card" href="/docs/slots-layouts"><p class="pdoc-card__title">Slots & layouts</p><p class="pdoc-card__desc">Composable page regions.</p></a>
          <a class="pdoc-card" href="/docs/keyline"><p class="pdoc-card__title">Dividers</p><p class="pdoc-card__desc">Horizontal rules between sections.</p></a>
        </div>`;
}
