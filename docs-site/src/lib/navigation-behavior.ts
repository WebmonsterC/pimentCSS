/**
 * Header navigation: mobile drawer toggle (docs + reference for apps).
 */

const WIRED = 'data-piment-header-nav-wired';

export function wireHeaderNav(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;

  const toggle = root.querySelector<HTMLButtonElement>('.header-nav__toggle');
  const panelId = toggle?.getAttribute('aria-controls');
  const panel = panelId ? root.querySelector<HTMLElement>(`#${panelId}`) : null;
  if (!toggle || !panel) return;

  root.setAttribute(WIRED, 'true');

  const setOpen = (open: boolean) => {
    root.classList.toggle('header-nav--open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(!root.classList.contains('header-nav--open'));
  });

  root.querySelectorAll<HTMLAnchorElement>('.header-nav__panel .nav-item').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('header-nav--open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

export function wireAllHeaderNavs(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-header-nav]').forEach(wireHeaderNav);
}
