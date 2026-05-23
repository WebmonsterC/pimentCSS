/**
 * Snackbar behavior: dismiss, auto-dismiss, optional progress animation (docs + reference).
 */

const WIRED = 'data-piment-snackbar-wired';
const TIMER_ID = 'data-piment-snackbar-timer-id';

function parseAutoDismissMs(snackbar: HTMLElement): number {
  const raw = snackbar.getAttribute('data-snackbar-auto-dismiss');
  if (raw === null || raw === '') return 0;
  const ms = Number(raw);
  return Number.isFinite(ms) && ms > 0 ? ms : 0;
}

function clearAutoDismissTimer(snackbar: HTMLElement): void {
  const id = snackbar.getAttribute(TIMER_ID);
  if (id) {
    window.clearTimeout(Number(id));
    snackbar.removeAttribute(TIMER_ID);
  }
}

function dismissSnackbar(snackbar: HTMLElement): void {
  clearAutoDismissTimer(snackbar);
  snackbar.hidden = true;
  snackbar.setAttribute('aria-hidden', 'true');
}

function restoreSnackbar(snackbar: HTMLElement): void {
  snackbar.hidden = false;
  snackbar.removeAttribute('aria-hidden');
  scheduleAutoDismiss(snackbar);
}

function runProgressAnimation(snackbar: HTMLElement, ms: number): void {
  const fill = snackbar.querySelector<HTMLElement>('.progress__fill');
  const bar = snackbar.querySelector<HTMLElement>('.snackbar__progress');
  if (!fill || !bar) return;

  bar.removeAttribute('aria-hidden');
  if (!bar.getAttribute('aria-label')) {
    bar.setAttribute('aria-label', 'Time remaining');
  }
  fill.style.transition = 'none';
  fill.style.width = '100%';
  void fill.offsetWidth;
  fill.style.transition = `width ${ms}ms linear`;
  fill.style.width = '0%';
}

function startAutoDismissTimer(snackbar: HTMLElement, ms: number): void {
  clearAutoDismissTimer(snackbar);
  runProgressAnimation(snackbar, ms);
  const id = window.setTimeout(() => dismissSnackbar(snackbar), ms);
  snackbar.setAttribute(TIMER_ID, String(id));
}

function scheduleAutoDismiss(snackbar: HTMLElement): void {
  const ms = parseAutoDismissMs(snackbar);
  if (!ms) return;

  clearAutoDismissTimer(snackbar);

  if (typeof IntersectionObserver === 'undefined') {
    startAutoDismissTimer(snackbar, ms);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      startAutoDismissTimer(snackbar, ms);
    },
    { threshold: 0.2, rootMargin: '0px' },
  );

  observer.observe(snackbar);
}

function wireSnackbar(snackbar: HTMLElement): void {
  if (snackbar.getAttribute(WIRED) === 'true') return;
  snackbar.setAttribute(WIRED, 'true');

  snackbar.querySelector<HTMLButtonElement>('.snackbar__close')?.addEventListener('click', () => {
    dismissSnackbar(snackbar);
  });

  scheduleAutoDismiss(snackbar);
}

function wireSnackbarRestore(root: ParentNode): void {
  root.querySelectorAll<HTMLButtonElement>('[data-snackbar-restore]').forEach((btn) => {
    if (btn.dataset.pimentSnackbarRestoreBound) return;
    btn.dataset.pimentSnackbarRestoreBound = '1';
    btn.addEventListener('click', () => {
      const id = btn.dataset.snackbarRestore;
      if (!id) return;
      const snackbar = document.getElementById(id);
      if (snackbar?.classList.contains('snackbar')) restoreSnackbar(snackbar);
    });
  });
}

function wireSnackbarShow(root: ParentNode): void {
  root.querySelectorAll<HTMLButtonElement>('[data-snackbar-show]').forEach((btn) => {
    if (btn.dataset.pimentSnackbarShowBound) return;
    btn.dataset.pimentSnackbarShowBound = '1';
    btn.addEventListener('click', () => {
      const templateId = btn.dataset.snackbarShow;
      const hostId = btn.dataset.snackbarHost ?? 'pdoc-snackbar-host';
      if (!templateId) return;
      const template = document.getElementById(templateId);
      const host = document.getElementById(hostId);
      if (!template || !host) return;

      const clone = template.cloneNode(true) as HTMLElement;
      clone.removeAttribute('id');
      clone.hidden = false;
      clone.removeAttribute('aria-hidden');
      host.appendChild(clone);
      wireSnackbar(clone);
    });
  });
}

export function wireAllSnackbars(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.snackbar[data-snackbars-live]').forEach(wireSnackbar);
  wireSnackbarRestore(root);
  wireSnackbarShow(root);
}

export const SNACKBAR_REFERENCE_JS = `import { wireAllSnackbars } from './snackbar-behavior';

document.addEventListener('DOMContentLoaded', () => wireAllSnackbars());`;
