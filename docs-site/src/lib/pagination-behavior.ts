/**
 * Pagination behavior for PimentCSS markup (docs + reference for apps).
 */

const WIRED = 'data-piment-pagination-wired';
const LIVE = 'data-pagination-live';

function clearItem(btn: HTMLButtonElement): void {
  btn.classList.remove('pagination__item--selected');
  btn.removeAttribute('aria-current');
}

function selectItem(btn: HTMLButtonElement): void {
  btn.classList.add('pagination__item--selected');
  btn.setAttribute('aria-current', 'page');
}

function getPageItems(root: HTMLElement): HTMLButtonElement[] {
  return [
    ...root.querySelectorAll<HTMLButtonElement>(
      '.pagination__list .pagination__item, .pagination__group > .pagination__item',
    ),
  ].filter((btn) => {
    const label = btn.textContent?.trim() ?? '';
    return /^\d+$/.test(label);
  });
}

function wireNumberedList(root: HTMLElement): void {
  const items = getPageItems(root);
  if (!items.length) return;

  items.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      items.forEach(clearItem);
      selectItem(btn);
    });
  });
}

function wireJumperControls(root: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>('.pagination__jumper-field');
  const prev = root.querySelector<HTMLButtonElement>('.pagination__item--prev');
  const next = root.querySelector<HTMLButtonElement>('.pagination__item--next');
  if (!input || !prev || !next) return;

  const max = Number(root.getAttribute('data-pagination-max')) || 20;

  const syncDisabled = () => {
    const page = Math.min(max, Math.max(1, Number.parseInt(input.value, 10) || 1));
    input.value = String(page);
    prev.disabled = page <= 1;
    next.disabled = page >= max;
  };

  prev.addEventListener('click', () => {
    const page = Math.max(1, (Number.parseInt(input.value, 10) || 1) - 1);
    input.value = String(page);
    syncDisabled();
  });

  next.addEventListener('click', () => {
    const page = Math.min(max, (Number.parseInt(input.value, 10) || 1) + 1);
    input.value = String(page);
    syncDisabled();
  });

  input.addEventListener('change', syncDisabled);
  syncDisabled();
}

export function wirePagination(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;

  root.setAttribute(WIRED, 'true');

  if (root.querySelector('.pagination__list')) {
    wireNumberedList(root);
  } else if (root.querySelector('.pagination__jumper-field')) {
    wireJumperControls(root);
  }
}

export function wireAllPaginations(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.pagination[data-pagination-live]').forEach(wirePagination);
}

export const PAGINATION_REFERENCE_JS =
  '// See docs-site/src/lib/pagination-behavior.ts (page selection, jumper prev/next).';
