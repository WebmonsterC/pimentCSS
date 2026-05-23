/**
 * Marketing site (/) — mobile menu and theme toggle.
 */
import { applyTheme, resolveTheme, setTheme, type ThemeMode } from '../lib/theme';

const MENU_OPEN_CLASS = 'psite-menu-open';

function syncThemeUi(theme: ThemeMode): void {
  document.body.classList.toggle('psite--dark', theme === 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((root) => {
    root.querySelectorAll<HTMLButtonElement>('[data-theme-value]').forEach((btn) => {
      const active = btn.dataset.themeValue === theme;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  });
}

function initThemeToggle(): void {
  const theme = resolveTheme();
  applyTheme(theme);
  syncThemeUi(theme);

  document.querySelectorAll('[data-theme-toggle]').forEach((root) => {
    root.querySelectorAll<HTMLButtonElement>('[data-theme-value]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.themeValue as ThemeMode;
        if (next !== 'light' && next !== 'dark') return;
        setTheme(next);
        syncThemeUi(next);
      });
    });
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('pimentcss-theme')) return;
    const next = resolveTheme();
    setTheme(next, false);
    syncThemeUi(next);
  });
}

function initSiteMenu(): void {
  const menu = document.getElementById('psite-menu');
  const toggle = document.querySelector<HTMLButtonElement>('[data-psite-menu-toggle]');
  if (!menu || !toggle) return;

  const panel = menu.querySelector<HTMLElement>('.psite-menu__panel');
  const closeEls = menu.querySelectorAll<HTMLElement>('[data-psite-menu-close]');
  const links = menu.querySelectorAll<HTMLAnchorElement>('.psite-menu__nav a[href^="#"]');

  const setOpen = (open: boolean) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle(MENU_OPEN_CLASS, open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const icon = toggle.querySelector('.ph');
    if (icon) {
      icon.classList.toggle('ph-list', !open);
      icon.classList.toggle('ph-x', open);
    }
    if (open) {
      panel?.querySelector<HTMLElement>('.psite-menu__close')?.focus();
    } else if (document.activeElement && menu.contains(document.activeElement)) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  closeEls.forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
    }
  });

  matchMedia('(min-width: 1024px)').addEventListener('change', (mq) => {
    if (mq.matches) setOpen(false);
  });
}

initThemeToggle();
initSiteMenu();
