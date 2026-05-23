/**
 * Progress demo: simulate upload on [data-progress-simulate] (docs + reference).
 */

const WIRED = 'data-piment-progress-wired';

function clampPct(pct: number): number {
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function isCircleHost(host: HTMLElement): boolean {
  return host.dataset.progressKind === 'circle' || Boolean(host.querySelector('.progress-circle'));
}

function setLinearProgress(host: HTMLElement, pct: number): void {
  const value = clampPct(pct);
  const bar = host.querySelector<HTMLElement>('.progress[role="progressbar"]');
  const fill = host.querySelector<HTMLElement>('.progress__fill');
  const label = host.querySelector<HTMLElement>('.progress-bar__label');
  if (bar) bar.setAttribute('aria-valuenow', String(value));
  if (fill) fill.style.width = `${value}%`;
  if (label) label.textContent = `Completion: ${value}%`;
}

function setCircleProgress(host: HTMLElement, pct: number): void {
  const value = clampPct(pct);
  const circle =
    host.querySelector<HTMLElement>('.progress-circle[role="progressbar"]') ??
    host.querySelector<HTMLElement>('[role="progressbar"]');
  if (!circle) return;
  const fill = circle.querySelector<HTMLElement>('.progress-circle__fill');
  const label = circle.querySelector<HTMLElement>('.progress-circle__label');
  circle.setAttribute('aria-valuenow', String(value));
  circle.setAttribute('aria-label', `${value} percent complete`);
  if (fill) fill.setAttribute('stroke-dasharray', `${value} ${100 - value}`);
  if (label) label.textContent = `${value}%`;
}

function simulateProgress(host: HTMLElement): void {
  const circle = isCircleHost(host);
  let value = Number(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow') ?? 0);
  if (!Number.isFinite(value)) value = 0;

  const step = () => {
    value = Math.min(100, value + 4);
    if (circle) setCircleProgress(host, value);
    else setLinearProgress(host, value);
    if (value < 100) {
      window.setTimeout(step, 120);
    }
  };

  step();
}

export function wireAllProgress(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>(`[data-progress-simulate]:not([${WIRED}])`).forEach((btn) => {
    btn.setAttribute(WIRED, '');
    btn.addEventListener('click', () => {
      const targetSel = btn.getAttribute('data-progress-target');
      if (!targetSel) return;
      const host = root.querySelector<HTMLElement>(targetSel);
      if (!host) return;
      simulateProgress(host);
    });
  });
}

export const PROGRESS_REFERENCE_JS = `import { wireAllProgress } from './progress-behavior';

wireAllProgress();

// Linear: aria-valuenow + .progress__fill width
// Circle: aria-valuenow + .progress-circle__fill stroke-dasharray + center label`;
