/**
 * Carousel widgets (docs + reference for apps).
 * Syncs PimentCSS controls with slide panels, thumb, and live region text.
 */

const WIRED = 'data-piment-carousel-wired';
const LIVE = 'data-carousel-live';
const THUMB_WIDTH_PERCENT = 37.5;

function getMaxThumbLeft(): number {
  return 100 - THUMB_WIDTH_PERCENT;
}

function getSlideTitle(slide: HTMLElement): string {
  const title = slide.querySelector('.pdoc-carousel-widget__title');
  return title?.textContent?.trim() || slide.getAttribute('aria-label') || 'Slide';
}

function wireCarouselWidget(root: HTMLElement): void {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-carousel-slide]')];
  const controls = root.querySelector<HTMLElement>('.carousel');
  if (!slides.length || !controls) return;

  const thumb = controls.querySelector<HTMLElement>('.carousel__scrollbar-thumb');
  const scrollbar = controls.querySelector<HTMLElement>('.carousel__scrollbar');
  const track = controls.querySelector<HTMLElement>('.carousel__scrollbar-track');
  const prev = controls.querySelector<HTMLButtonElement>('.carousel__arrow--prev');
  const next = controls.querySelector<HTMLButtonElement>(
    '.carousel__arrow:not(.carousel__arrow--prev)',
  );
  const status = root.querySelector<HTMLElement>('[data-carousel-status]');
  if (!thumb || !prev || !next) return;

  const count = slides.length;
  let index = Math.min(count - 1, Math.max(0, Number(root.getAttribute('data-carousel-index')) || 0));

  if (scrollbar) {
    scrollbar.setAttribute('role', 'slider');
    scrollbar.setAttribute('tabindex', '0');
    scrollbar.setAttribute('aria-valuemin', '1');
    scrollbar.setAttribute('aria-valuemax', String(count));
    scrollbar.setAttribute('aria-label', 'Slide position');
    scrollbar.removeAttribute('aria-hidden');
  }

  const sync = () => {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.hidden = !active;
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      slide.classList.toggle('pdoc-carousel-widget__slide--active', active);
    });

    const maxLeft = getMaxThumbLeft();
    const left = count <= 1 ? 0 : (index / (count - 1)) * maxLeft;
    thumb.style.left = `${left}%`;

    prev.disabled = index <= 0;
    next.disabled = index >= count - 1;

    const title = getSlideTitle(slides[index]);
    const position = index + 1;
    prev.setAttribute('aria-label', `Previous slide (${position} of ${count})`);
    next.setAttribute('aria-label', `Next slide (${position} of ${count})`);

    if (scrollbar) {
      scrollbar.setAttribute('aria-valuenow', String(position));
    }

    if (status) {
      status.textContent = `Slide ${position} of ${count}: ${title}`;
    }

    root.setAttribute('data-carousel-index', String(index));
  };

  const go = (nextIndex: number) => {
    index = Math.min(count - 1, Math.max(0, nextIndex));
    sync();
  };

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  if (scrollbar && track) {
    track.addEventListener('click', (e) => {
      if (count <= 1) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      go(Math.round(ratio * (count - 1)));
    });

    scrollbar.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'Home') {
        e.preventDefault();
        go(e.key === 'Home' ? 0 : index - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'End') {
        e.preventDefault();
        go(e.key === 'End' ? count - 1 : index + 1);
      }
    });
  }

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    }
  });

  sync();
}

/** Interactive scroll bar lab (no arrows; demonstrates slider + hover height). */
function wireScrollbarLab(root: HTMLElement): void {
  const thumb = root.querySelector<HTMLElement>('.carousel__scrollbar-thumb');
  const scrollbar = root.querySelector<HTMLElement>('.carousel__scrollbar');
  const track = root.querySelector<HTMLElement>('.carousel__scrollbar-track');
  const status = root.querySelector<HTMLElement>('[data-carousel-scrollbar-status]');
  if (!thumb || !scrollbar || !track) return;

  const count = Math.max(2, Number(root.getAttribute('data-carousel-slide-count')) || 5);
  let index = Math.min(count - 1, Math.max(0, Number(root.getAttribute('data-carousel-index')) || 0));

  scrollbar.setAttribute('role', 'slider');
  scrollbar.setAttribute('tabindex', '0');
  scrollbar.setAttribute('aria-valuemin', '1');
  scrollbar.setAttribute('aria-valuemax', String(count));
  scrollbar.setAttribute('aria-label', 'Slide position');

  const sync = () => {
    const maxLeft = getMaxThumbLeft();
    const left = count <= 1 ? 0 : (index / (count - 1)) * maxLeft;
    thumb.style.left = `${left}%`;
    const position = index + 1;
    scrollbar.setAttribute('aria-valuenow', String(position));
    root.setAttribute('data-carousel-index', String(index));
    if (status) {
      status.textContent = `Slide ${position} of ${count}`;
    }
  };

  const go = (nextIndex: number) => {
    index = Math.min(count - 1, Math.max(0, nextIndex));
    sync();
  };

  track.addEventListener('click', (e) => {
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    go(Math.round(ratio * (count - 1)));
  });

  scrollbar.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'Home') {
      e.preventDefault();
      go(e.key === 'Home' ? 0 : index - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'End') {
      e.preventDefault();
      go(e.key === 'End' ? count - 1 : index + 1);
    }
  });

  sync();
}

/** Controls-only demo (thumb + arrows, no slide panels). */
function wireCarouselControlsOnly(root: HTMLElement): void {
  const thumb = root.querySelector<HTMLElement>('.carousel__scrollbar-thumb');
  const prev = root.querySelector<HTMLButtonElement>('.carousel__arrow--prev');
  const next = root.querySelector<HTMLButtonElement>(
    '.carousel__arrow:not(.carousel__arrow--prev)',
  );
  if (!thumb || !prev || !next) return;

  const slideCount = Math.max(1, Number(root.getAttribute('data-carousel-slide-count')) || 3);
  let index = Math.min(slideCount - 1, Math.max(0, Number(root.getAttribute('data-carousel-index')) || 0));

  const sync = () => {
    const maxLeft = getMaxThumbLeft();
    const left = slideCount <= 1 ? 0 : (index / (slideCount - 1)) * maxLeft;
    thumb.style.left = `${left}%`;
    prev.disabled = index <= 0;
    next.disabled = index >= slideCount - 1;
    root.setAttribute('data-carousel-index', String(index));
  };

  prev.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      sync();
    }
  });

  next.addEventListener('click', () => {
    if (index < slideCount - 1) {
      index += 1;
      sync();
    }
  });

  sync();
}

export function wireCarousel(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  root.setAttribute(WIRED, 'true');

  if (root.classList.contains('pdoc-carousel-scrollbar-lab')) {
    if (root.hasAttribute('data-carousel-scrollbar-live')) wireScrollbarLab(root);
    return;
  }

  if (!root.hasAttribute(LIVE)) return;

  if (root.classList.contains('pdoc-carousel-widget') || root.querySelector('[data-carousel-slide]')) {
    wireCarouselWidget(root);
    return;
  }

  if (root.classList.contains('carousel')) {
    wireCarouselControlsOnly(root);
  }
}

export function wireAllCarousels(root: ParentNode = document): void {
  root
    .querySelectorAll<HTMLElement>('.pdoc-carousel-scrollbar-lab[data-carousel-scrollbar-live]')
    .forEach(wireCarousel);
  root
    .querySelectorAll<HTMLElement>('.pdoc-carousel-widget[data-carousel-live]')
    .forEach(wireCarousel);
  root
    .querySelectorAll<HTMLElement>(
      '.carousel[data-carousel-live]:not(.pdoc-carousel-widget__controls)',
    )
    .forEach((el) => {
      if (!el.closest('.pdoc-carousel-widget[data-carousel-live]')) wireCarousel(el);
    });
}

export const CAROUSEL_REFERENCE_JS = `import { wireAllCarousels } from './carousel-behavior';

document.addEventListener('DOMContentLoaded', () => wireAllCarousels());

// Full widget: .pdoc-carousel-widget[data-carousel-live] + [data-carousel-slide]
// Scroll bar lab: .pdoc-carousel-scrollbar-lab[data-carousel-scrollbar-live]`;
