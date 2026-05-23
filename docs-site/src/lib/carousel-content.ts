import { pdocSnippet, pdocSteps } from './pdoc-html';
import { CAROUSEL_REFERENCE_JS } from './carousel-behavior';
import { ph } from './icon';

const ARROW_ICON = ph('arrow-right', 24, 'carousel__arrow-icon');

type SlideData = {
  title: string;
  text: string;
  mediaLabel?: string;
  mediaTone?: 'a' | 'b' | 'c';
};

type ArrowOpts = {
  prev?: boolean;
  mods?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

function carouselArrow(opts: ArrowOpts = {}): string {
  const className = [
    'carousel__arrow',
    opts.prev ? 'carousel__arrow--prev' : '',
    opts.mods,
  ]
    .filter(Boolean)
    .join(' ');
  const ariaLabel = opts.ariaLabel
    ? ` aria-label="${opts.ariaLabel}"`
    : opts.prev
      ? ' aria-label="Previous"'
      : ' aria-label="Next"';
  const disabled = opts.disabled ? ' disabled' : '';
  return `<button type="button" class="${className}"${ariaLabel}${disabled}>${ARROW_ICON}</button>`;
}

function carouselControls(ariaPrefix: string): string {
  return `${carouselArrow({ prev: true, ariaLabel: `${ariaPrefix}, previous slide` })}
              <div class="carousel__scrollbar" tabindex="0">
                <div class="carousel__scrollbar-track">
                  <div class="carousel__scrollbar-thumb"></div>
                </div>
              </div>
              ${carouselArrow({ ariaLabel: `${ariaPrefix}, next slide` })}`;
}

function slideArticle(
  slide: SlideData,
  index: number,
  total: number,
  withMedia: boolean,
): string {
  const n = index + 1;
  const hidden = index === 0 ? '' : ' hidden';
  const activeClass = index === 0 ? ' pdoc-carousel-widget__slide--active' : '';
  const media =
    withMedia && slide.mediaLabel
      ? `<div class="pdoc-carousel-widget__media pdoc-carousel-widget__media--${slide.mediaTone ?? 'a'}" role="img" aria-label="${slide.mediaLabel}"></div>`
      : '';
  const body = `<div class="pdoc-carousel-widget__body">
                  <h3 class="pdoc-carousel-widget__title">${slide.title}</h3>
                  <p class="pdoc-carousel-widget__text body-medium">${slide.text}</p>
                </div>`;
  const layoutClass = withMedia ? ' pdoc-carousel-widget__slide--split' : ' pdoc-carousel-widget__slide--text';
  return `<article class="pdoc-carousel-widget__slide${layoutClass}${activeClass}" data-carousel-slide role="group" aria-roledescription="slide" aria-label="${n} of ${total}: ${slide.title}"${hidden}>
                  ${withMedia ? `${media}\n                  ${body}` : body}
                </article>`;
}

function carouselWidget(opts: {
  id: string;
  label: string;
  slides: SlideData[];
  withMedia: boolean;
}): string {
  const total = opts.slides.length;
  const track = opts.slides
    .map((s, i) => slideArticle(s, i, total, opts.withMedia))
    .join('\n                ');
  const first = opts.slides[0];
  return `<div class="pdoc-carousel-widget" id="${opts.id}" data-carousel-live role="region" aria-roledescription="carousel" aria-label="${opts.label}" tabindex="-1">
              <div class="pdoc-carousel-widget__viewport">
                <div class="pdoc-carousel-widget__track">
                ${track}
                </div>
              </div>
              <p class="pdoc-carousel-widget__status" data-carousel-status aria-live="polite">Slide 1 of ${total}: ${first.title}</p>
              <div class="carousel pdoc-carousel-widget__controls">
                ${carouselControls(opts.label)}
              </div>
            </div>`;
}

const HERO_SLIDES: SlideData[] = [
  {
    title: 'Accessible forms',
    text: 'Pair labels, hints, and error text with input fields. Keyboard and screen reader flows stay predictable.',
    mediaLabel: 'Abstract illustration, teal and blue gradient',
    mediaTone: 'a',
  },
  {
    title: 'Navigation patterns',
    text: 'Compose header nav, tabs, anchors, and pagination so users always know where they are.',
    mediaLabel: 'Abstract illustration, green gradient',
    mediaTone: 'b',
  },
  {
    title: 'Content density',
    text: 'Tables and carousels share spacing tokens so dense dashboards remain readable on small screens.',
    mediaLabel: 'Abstract illustration, warm gradient',
    mediaTone: 'c',
  },
];

const QUOTE_SLIDES: SlideData[] = [
  {
    title: 'Design tokens first',
    text: 'We ship semantic colors and spacing once, then every component inherits the same contrast guarantees.',
  },
  {
    title: 'Document the states',
    text: 'Matrices in the docs show default, focus, hover, and disabled so QA can compare documented states with CSS quickly.',
  },
  {
    title: 'Wire the behavior',
    text: 'Live demos use the same classes as production: slides, controls, and aria-live text stay in sync.',
  },
];

function matrixCell(html: string): string {
  return `<div class="ds-matrix__cell">${html}</div>`;
}

function arrowMatrixRow(rowLabel: string, cells: ArrowOpts[]): string {
  return `<div class="ds-matrix__row">${rowLabel}</div>
            ${cells
              .map((c) =>
                matrixCell(
                  carouselArrow({
                    ...c,
                    ariaLabel:
                      c.ariaLabel ??
                      `${rowLabel}, ${c.mods?.includes('focus') ? 'focus' : c.mods?.includes('hover') ? 'hover' : 'default'}`,
                  }),
                ),
              )
              .join('\n            ')}`;
}

const ARROW_MATRIX = `<div class="ds-matrix ds-matrix--carousel" role="group" aria-label="Carousel arrow states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Focus</div>
            <div class="ds-matrix__head">Hover</div>
            ${arrowMatrixRow('Right', [
              { ariaLabel: 'Next slide, default' },
              { mods: 'carousel__arrow--focus', ariaLabel: 'Next slide, focus' },
              { mods: 'carousel__arrow--hover', ariaLabel: 'Next slide, hover' },
            ])}
            ${arrowMatrixRow('Left', [
              { prev: true, ariaLabel: 'Previous slide, default' },
              { prev: true, mods: 'carousel__arrow--focus', ariaLabel: 'Previous slide, focus' },
              { prev: true, mods: 'carousel__arrow--hover', ariaLabel: 'Previous slide, hover' },
            ])}
          </div>`;

const SCROLLBAR_STATES = `<div class="pdoc-carousel-scrollbar-states" role="group" aria-label="Scroll bar static state reference">
              <figure class="pdoc-carousel-scrollbar-state">
                <figcaption class="pdoc-carousel-scrollbar-state__label">Default (2px)</figcaption>
                <div class="pdoc-carousel-scrollbar-state__preview pdoc-carousel-scrollbar-state__preview--default" aria-hidden="true">
                  <div class="carousel__scrollbar">
                    <div class="carousel__scrollbar-track">
                      <div class="carousel__scrollbar-thumb"></div>
                    </div>
                  </div>
                </div>
              </figure>
              <figure class="pdoc-carousel-scrollbar-state">
                <figcaption class="pdoc-carousel-scrollbar-state__label">Focus</figcaption>
                <div class="pdoc-carousel-scrollbar-state__preview pdoc-carousel-scrollbar-state__preview--focus" aria-hidden="true">
                  <div class="carousel__scrollbar carousel__scrollbar--focus">
                    <div class="carousel__scrollbar-track">
                      <div class="carousel__scrollbar-thumb"></div>
                    </div>
                  </div>
                </div>
              </figure>
              <figure class="pdoc-carousel-scrollbar-state">
                <figcaption class="pdoc-carousel-scrollbar-state__label">Hover (4px)</figcaption>
                <div class="pdoc-carousel-scrollbar-state__preview pdoc-carousel-scrollbar-state__preview--hover" aria-hidden="true">
                  <div class="carousel__scrollbar carousel__scrollbar--hover">
                    <div class="carousel__scrollbar-track">
                      <div class="carousel__scrollbar-thumb"></div>
                    </div>
                  </div>
                </div>
              </figure>
            </div>`;

const SCROLLBAR_LAB = `<div class="pdoc-carousel-scrollbar-lab" data-carousel-scrollbar-live data-carousel-slide-count="5" data-carousel-index="0" role="group" aria-label="Interactive scroll bar">
              <p class="pdoc-carousel-scrollbar-lab__status" data-carousel-scrollbar-status aria-live="polite">Slide 1 of 5</p>
              <div class="carousel__scrollbar pdoc-carousel-scrollbar-lab__bar" role="slider" tabindex="0" aria-valuemin="1" aria-valuemax="5" aria-valuenow="1" aria-label="Slide position">
                <div class="carousel__scrollbar-track">
                  <div class="carousel__scrollbar-thumb"></div>
                </div>
              </div>
              <ul class="pdoc-carousel-scrollbar-lab__hints body-small pdoc-text-muted">
                <li><strong>Hover</strong> the bar: track grows from 2px to 4px.</li>
                <li><strong>Click</strong> the track to jump; thumb width stays 37.5%.</li>
                <li><strong>Focus</strong> the bar and use Arrow Left/Right or Home/End.</li>
              </ul>
            </div>`;

const CAROUSEL_HERO = carouselWidget({
  id: 'pdoc-carousel-hero',
  label: 'Featured topics',
  slides: HERO_SLIDES,
  withMedia: true,
});

const CAROUSEL_QUOTES = carouselWidget({
  id: 'pdoc-carousel-quotes',
  label: 'Release highlights',
  slides: QUOTE_SLIDES,
  withMedia: false,
});

const CAROUSEL_CONTROLS_STATIC = `<div class="carousel pdoc-carousel-controls-static" role="group" aria-label="Carousel controls only (static)">
              ${carouselArrow({ prev: true, ariaLabel: 'Previous slide' })}
              <div class="carousel__scrollbar" aria-hidden="true">
                <div class="carousel__scrollbar-track">
                  <div class="carousel__scrollbar-thumb"></div>
                </div>
              </div>
              ${carouselArrow({ ariaLabel: 'Next slide' })}
            </div>`;

export function buildCarouselPageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_carousel.scss</code>. Combine slide content (your markup) with <code>.carousel</code> controls; the live demos below show two compositions plus the control primitives.</p>

        <h2 id="anatomy">Anatomy</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Part</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Block</td><td><code>.carousel</code></td><td>Flex row: prev arrow + scroll bar + next arrow (gap 16px, max 640px)</td></tr>
              <tr><td>Arrow</td><td><code>.carousel__arrow</code></td><td>48×48px round button; <code>--prev</code> mirrors the icon</td></tr>
              <tr><td>Scroll bar</td><td><code>.carousel__scrollbar</code></td><td>Track + thumb; use as slider when wired to slides</td></tr>
              <tr><td>Doc widget</td><td><code>.pdoc-carousel-widget</code></td><td>Doc-only wrapper: viewport + <code>aria-live</code> status + controls</td></tr>
              <tr><td>Slide</td><td><code>[data-carousel-slide]</code></td><td>One panel; toggle <code>hidden</code> + <code>aria-hidden</code> from JS</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Icons</strong>, <code>ph-arrow-right</code> at 24px via <code>ph()</code> (Phosphor in this doc).</li>
          <li><strong>Slides</strong>, any HTML (image, text, cards); keep one visible slide at a time.</li>
          <li><strong>Script</strong>, call <code>wireAllCarousels()</code> after DOM ready (see interactive section).</li>
        </ul>

        <h2 id="carousel-compose">Composed carousels (live)</h2>
        <p>Two widget patterns share the same <code>.carousel</code> controls. Use arrow keys on the carousel region or the scroll bar (slider). Status text updates in <code>aria-live="polite"</code>.</p>

        <h3 id="carousel-hero">Media + text</h3>
        <p>Split layout from <code>min-width: 30rem</code>: visual block + title and body copy. Decorative gradients use <code>role="img"</code> and a text alternative.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-carousel-demo-wrap">
            ${CAROUSEL_HERO}
          </div>
        </div>

        <h3 id="carousel-quotes">Text-only slides</h3>
        <p>Same controls and behavior without a media column. Useful for quotes, KPIs, or legal notices.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-carousel-demo-wrap">
            ${CAROUSEL_QUOTES}
          </div>
        </div>
        ${pdocSnippet(
          `<div class="pdoc-carousel-widget" data-carousel-live role="region" aria-roledescription="carousel" aria-label="Featured topics" tabindex="-1">
  <div class="pdoc-carousel-widget__viewport">
    <article class="pdoc-carousel-widget__slide" data-carousel-slide role="group" aria-roledescription="slide" aria-label="1 of 3: Accessible forms">
      <div class="pdoc-carousel-widget__media" role="img" aria-label="…"></div>
      <div class="pdoc-carousel-widget__body">
        <h3 class="pdoc-carousel-widget__title">Accessible forms</h3>
        <p class="pdoc-carousel-widget__text">…</p>
      </div>
    </article>
    <!-- more slides -->
  </div>
  <p data-carousel-status aria-live="polite">Slide 1 of 3: Accessible forms</p>
  <div class="carousel pdoc-carousel-widget__controls">…</div>
</div>`,
          'carousel-widget.html',
          'html',
        )}

        <h2 id="carousel-arrows">Arrow primitives</h2>
        <p>48px circular buttons with a 2px action border. Doc-only <code>.carousel__arrow--hover</code> and <code>.carousel__arrow--focus</code>; production uses <code>:hover</code> and <code>:focus-visible</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${ARROW_MATRIX}
          </div>
        </div>

        <h2 id="carousel-scroll">Scroll bar primitives</h2>
        <p>The scroll bar is a <code>role="slider"</code> when it reflects slide position (<code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code>). Default height is 2px; it grows to 4px on <code>:hover</code>. Use the interactive lab first, then compare the static state references below.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-carousel-scrollbar-lab-wrap">
            ${SCROLLBAR_LAB}
          </div>
        </div>
        <p class="pdoc-text-muted">Static references (doc-only modifiers for focus/hover height previews):</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SCROLLBAR_STATES}
          </div>
        </div>

        <h2 id="carousel-controls-only">Controls only</h2>
        <p class="pdoc-text-muted">Use when slide content lives elsewhere (for example a full-width hero). Mark a decorative bar with <code>aria-hidden="true"</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-carousel-demo-wrap">
            ${CAROUSEL_CONTROLS_STATIC}
          </div>
        </div>

        <h2 id="carousel-live">JavaScript</h2>
        <p>Add <code>data-carousel-live</code> on <code>.pdoc-carousel-widget</code> (full carousel) or <code>data-carousel-scrollbar-live</code> on <code>.pdoc-carousel-scrollbar-lab</code> (scroll bar only). Call <code>wireAllCarousels()</code> after load.</p>
        ${pdocSnippet(CAROUSEL_REFERENCE_JS, 'carousel.js', 'javascript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.carousel</code></td><td>Control row (flex, gap 16px, max-width 640px)</td></tr>
              <tr><td><code>.carousel__arrow</code></td><td>48×48px prev/next button</td></tr>
              <tr><td><code>.carousel__arrow--prev</code></td><td>Flips arrow icon (scaleX -1)</td></tr>
              <tr><td><code>.carousel__scrollbar</code></td><td>Track container (slider when wired)</td></tr>
              <tr><td><code>.carousel__scrollbar-thumb</code></td><td>Progress thumb; position with <code>left</code></td></tr>
              <tr><td><code>.pdoc-carousel-widget</code></td><td>Doc layout: viewport + status + controls</td></tr>
              <tr><td><code>.pdoc-carousel-widget__slide</code></td><td>Single slide panel</td></tr>
              <tr><td><code>.pdoc-carousel-widget__media</code></td><td>Decorative visual block (doc demos)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'carousel-tokens',
            title: 'Carousel sizing',
            body: 'Override max width, gaps, arrow size, and scroll bar metrics.',
            code: `@use "pimentcss-design-system" with (
  $carousel-max-width: 40rem,
  $carousel-gap: 1rem,
  $carousel-arrow-size: 3rem,
  $carousel-scrollbar-thumb-width: 37.5%
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'carousel-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _carousel.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Carousel pattern</p>
          <ul>
            <li><strong>Region</strong>, <code>role="region"</code> + <code>aria-roledescription="carousel"</code> + concise <code>aria-label</code>.</li>
            <li><strong>Slides</strong>, <code>role="group"</code> + <code>aria-roledescription="slide"</code>; hide inactive slides with <code>hidden</code> and <code>aria-hidden="true"</code>.</li>
            <li><strong>Status</strong>, <code>aria-live="polite"</code> text (slide x of y + title) updated on change.</li>
            <li><strong>Controls</strong>, labeled prev/next; disable at ends; scroll bar as <code>role="slider"</code> when it reflects position.</li>
            <li><strong>Keyboard</strong>, Arrow Left/Right on the widget; Home/End on the slider; focus ring remains visible.</li>
            <li><strong>Images</strong>, real content images need <code>alt</code>; decorative blocks use <code>role="img"</code> + <code>aria-label</code>.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/anchor-inpage-nav"><p class="pdoc-card__title">In-page anchors</p><p class="pdoc-card__desc">Vertical section navigation.</p></a>
          <a class="pdoc-card" href="/docs/table"><p class="pdoc-card__title">Tables</p><p class="pdoc-card__desc">Data tables and dense content.</p></a>
          <a class="pdoc-card" href="/docs/pagination"><p class="pdoc-card__title">Pagination</p><p class="pdoc-card__desc">Page controls for long lists.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Header bars and nav links.</p></a>
        </div>`;
}
