/**
 * Modal behavior: open/close, focus trap, Escape, backdrop dismiss, scroll lock.
 */

const WIRED = 'data-piment-modal-wired';

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (el) => !el.hidden && el.getAttribute('aria-hidden') !== 'true',
  );
}

function wireModal(modal: HTMLElement): void {
  if (modal.getAttribute(WIRED) === 'true') return;
  modal.setAttribute(WIRED, 'true');

  const modalId = modal.id;
  if (!modalId) return;

  const panel =
    modal.querySelector<HTMLElement>('[role="dialog"]') ??
    modal.querySelector<HTMLElement>('.modal__panel');
  if (!panel) return;

  const staticBackdrop = modal.hasAttribute('data-modal-static');
  const noEscape = modal.hasAttribute('data-modal-no-escape');

  let lastFocus: HTMLElement | null = null;

  const openers = document.querySelectorAll<HTMLButtonElement>(
    `[data-modal-open="${modalId}"]`,
  );

  const close = (): void => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    lastFocus?.focus();
    lastFocus = null;
  };

  const open = (): void => {
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const focusTarget =
      panel.querySelector<HTMLElement>('.modal__close') ??
      getFocusables(panel)[0] ??
      panel;
    focusTarget.focus();
  };

  openers.forEach((btn) => {
    btn.addEventListener('click', open);
  });

  if (!staticBackdrop) {
    modal.querySelectorAll<HTMLElement>('[data-modal-dismiss]').forEach((el) => {
      el.addEventListener('click', close);
    });
  }

  modal.querySelectorAll<HTMLButtonElement>('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  const onKeydown = (event: KeyboardEvent): void => {
    if (modal.hidden) return;

    if (!noEscape && event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusables = getFocusables(panel);
    if (focusables.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', onKeydown);

  modal.addEventListener(
    'pimentcss-modal-destroy',
    () => {
      document.removeEventListener('keydown', onKeydown);
    },
    { once: true },
  );
}

export function wireAllModals(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.modal[data-modal-live]').forEach(wireModal);
}

export const MODAL_REFERENCE_JS = `import { wireAllModals } from './modal-behavior';

document.addEventListener('DOMContentLoaded', () => wireAllModals());`;
