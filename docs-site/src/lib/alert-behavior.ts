/**
 * Alert behavior: dismiss, auto-dismiss, dialog overlay (docs + reference for apps).
 */

const WIRED = 'data-piment-alerts-wired';
const TIMER_ID = 'data-piment-alert-timer-id';

function parseAutoDismissMs(alert: HTMLElement): number {
  const raw = alert.getAttribute('data-alert-auto-dismiss');
  if (raw === null || raw === '') return 0;
  const ms = Number(raw);
  return Number.isFinite(ms) && ms > 0 ? ms : 0;
}

function clearAutoDismissTimer(alert: HTMLElement): void {
  const id = alert.getAttribute(TIMER_ID);
  if (id) {
    window.clearTimeout(Number(id));
    alert.removeAttribute(TIMER_ID);
  }
}

function dismissAlert(alert: HTMLElement): void {
  clearAutoDismissTimer(alert);
  alert.hidden = true;
  alert.setAttribute('aria-hidden', 'true');
}

function restoreAlert(alert: HTMLElement): void {
  alert.hidden = false;
  alert.removeAttribute('aria-hidden');
  scheduleAutoDismiss(alert);
}

function startAutoDismissTimer(alert: HTMLElement, ms: number): void {
  clearAutoDismissTimer(alert);
  const id = window.setTimeout(() => dismissAlert(alert), ms);
  alert.setAttribute(TIMER_ID, String(id));
}

function scheduleAutoDismiss(alert: HTMLElement): void {
  const ms = parseAutoDismissMs(alert);
  if (!ms) return;

  clearAutoDismissTimer(alert);

  if (typeof IntersectionObserver === 'undefined') {
    startAutoDismissTimer(alert, ms);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      startAutoDismissTimer(alert, ms);
    },
    { threshold: 0.2, rootMargin: '0px' },
  );

  observer.observe(alert);
}

function wireAlert(alert: HTMLElement): void {
  if (alert.getAttribute(WIRED) === 'true') return;
  alert.setAttribute(WIRED, 'true');

  alert.querySelector<HTMLButtonElement>('.alert__close')?.addEventListener('click', () => {
    dismissAlert(alert);
  });

  scheduleAutoDismiss(alert);
}

function wireAlertRestore(root: ParentNode): void {
  root.querySelectorAll<HTMLButtonElement>('[data-alert-restore]').forEach((btn) => {
    if (btn.dataset.pimentAlertRestoreBound) return;
    btn.dataset.pimentAlertRestoreBound = '1';
    btn.addEventListener('click', () => {
      const id = btn.dataset.alertRestore;
      if (!id) return;
      const alert = document.getElementById(id);
      if (alert?.classList.contains('alert')) restoreAlert(alert);
    });
  });
}

function wireAlertDialog(dialog: HTMLElement): void {
  if (dialog.getAttribute(WIRED) === 'true') return;
  dialog.setAttribute(WIRED, 'true');

  const dialogId = dialog.id;
  if (!dialogId) return;

  const panel =
    dialog.querySelector<HTMLElement>('[role="alertdialog"]') ??
    dialog.querySelector<HTMLElement>('.alert-dialog__panel');
  if (!panel) return;

  let lastFocus: HTMLElement | null = null;

  const openers = document.querySelectorAll<HTMLButtonElement>(
    `[data-alert-dialog-open="${dialogId}"]`,
  );

  const close = (): void => {
    dialog.hidden = true;
    document.body.classList.remove('alert-dialog-open');
    lastFocus?.focus();
    lastFocus = null;
  };

  const open = (): void => {
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.hidden = false;
    document.body.classList.add('alert-dialog-open');
    const focusTarget =
      panel.querySelector<HTMLElement>('.alert__close') ??
      panel.querySelector<HTMLElement>('.btn') ??
      panel;
    focusTarget.focus();
  };

  openers.forEach((btn) => {
    btn.addEventListener('click', open);
  });

  dialog.querySelectorAll<HTMLElement>('[data-alert-dialog-dismiss]').forEach((el) => {
    el.addEventListener('click', close);
  });

  dialog.querySelectorAll<HTMLButtonElement>('[data-alert-dialog-close]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && !dialog.hidden) {
      event.preventDefault();
      close();
    }
  };

  document.addEventListener('keydown', onKeydown);

  dialog.addEventListener(
    'pimentcss-alert-dialog-destroy',
    () => {
      document.removeEventListener('keydown', onKeydown);
    },
    { once: true },
  );
}

export function wireAllAlerts(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.alert[data-alerts-live]').forEach(wireAlert);
  root.querySelectorAll<HTMLElement>('.alert-dialog[data-alert-dialog-live]').forEach(wireAlertDialog);
  wireAlertRestore(root);
}

export const ALERT_REFERENCE_JS = `import { wireAllAlerts } from './alert-behavior';

document.addEventListener('DOMContentLoaded', () => wireAllAlerts());`;
