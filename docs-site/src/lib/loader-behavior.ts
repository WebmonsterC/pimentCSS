/**
 * Loader demo: toggle aria-busy + visible loader on [data-loader-toggle] (docs + reference).
 */

const WIRED = 'data-piment-loader-wired';
const BUSY_MS = 2400;

function findIndicator(region: HTMLElement): HTMLElement | null {
  return (
    region.querySelector<HTMLElement>('[data-loader-indicator]') ??
    region.querySelector<HTMLElement>('.loader[role="status"]')
  );
}

export function setLoaderBusy(region: HTMLElement, busy: boolean): void {
  const indicator = findIndicator(region);
  region.setAttribute('aria-busy', busy ? 'true' : 'false');
  if (indicator) indicator.hidden = !busy;
}

function simulateLoading(region: HTMLElement, btn: HTMLButtonElement): void {
  if (region.getAttribute('aria-busy') === 'true') return;
  setLoaderBusy(region, true);
  btn.disabled = true;
  window.setTimeout(() => {
    setLoaderBusy(region, false);
    btn.disabled = false;
  }, BUSY_MS);
}

export function wireAllLoaders(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>(`[data-loader-toggle]:not([${WIRED}])`).forEach((btn) => {
    btn.setAttribute(WIRED, '');
    btn.addEventListener('click', () => {
      const targetSel = btn.getAttribute('data-loader-target');
      if (!targetSel) return;
      const region = root.querySelector<HTMLElement>(targetSel);
      if (!region) return;
      simulateLoading(region, btn);
    });
  });
}

export const LOADER_REFERENCE_JS = `import { setLoaderBusy, wireAllLoaders } from './loader-behavior';

wireAllLoaders();

// Or control a region directly:
const panel = document.getElementById('my-panel');
setLoaderBusy(panel, true);
// … fetch …
setLoaderBusy(panel, false);`;
