/**
 * In-page anchor nav (docs + reference for apps).
 */

const WIRED = 'data-piment-anchor-wired';
const LIVE = 'data-anchor-live';

function clearItem(link: HTMLAnchorElement): void {
  link.classList.remove('anchor-item--selected');
  link.removeAttribute('aria-current');
}

function selectItem(link: HTMLAnchorElement): void {
  link.classList.add('anchor-item--selected');
  const level2 = link.classList.contains('anchor-item--level-2');
  link.setAttribute('aria-current', level2 ? 'page' : 'true');
}

export function wireAnchorNav(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;

  root.setAttribute(WIRED, 'true');
  const items = [...root.querySelectorAll<HTMLAnchorElement>('.anchor-item')];
  if (!items.length) return;

  items.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      items.forEach(clearItem);
      selectItem(link);
    });
  });
}

export function wireAllAnchorNavs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.anchor-nav[data-anchor-live]').forEach(wireAnchorNav);
}

export const ANCHOR_REFERENCE_JS =
  '// See docs-site/src/lib/anchor-behavior.ts (aria-current on section click).';
