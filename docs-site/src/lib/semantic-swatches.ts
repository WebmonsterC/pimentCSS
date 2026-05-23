import {
  AA_TEXT_NORMAL,
  contrastRatio,
  formatRatio,
  luminanceFromCssColor,
  pickForegroundForBackground,
  readTokenColor,
} from './contrast';

function tokenVar(name: string): string {
  return name.startsWith('--') ? name : `--${name}`;
}

function applyChipContrast(chip: HTMLElement, bgToken: string, fgToken?: string): void {
  const bgVar = tokenVar(bgToken);
  const isBorder = bgToken.includes('border') || chip.classList.contains('pdoc-semantic-swatch__chip--border');

  if (isBorder) {
    chip.style.background = 'var(--surface-page)';
    chip.style.border = `3px solid var(${bgVar})`;
    chip.style.color = 'var(--text-body)';
    const ratioEl = chip.closest('.pdoc-semantic-swatch')?.querySelector<HTMLElement>('.pdoc-semantic-swatch__ratio');
    if (ratioEl) {
      ratioEl.hidden = true;
    }
    return;
  }

  chip.style.background = `var(${bgVar})`;
  chip.style.border = 'none';

  const bgColor = readTokenColor(bgVar);
  const bgLum = luminanceFromCssColor(bgColor);
  if (bgLum == null) return;

  let fgColor: string;
  if (fgToken) {
    chip.style.color = `var(${tokenVar(fgToken)})`;
    fgColor = readTokenColor(tokenVar(fgToken));
  } else {
    const hex = pickForegroundForBackground(bgLum);
    chip.style.color = hex;
    fgColor = hex;
  }

  const fgLum = luminanceFromCssColor(fgColor);
  const ratioEl = chip.closest('.pdoc-semantic-swatch')?.querySelector<HTMLElement>('.pdoc-semantic-swatch__ratio');
  if (ratioEl && fgLum != null) {
    const ratio = contrastRatio(bgLum, fgLum);
    const pass = ratio >= AA_TEXT_NORMAL;
    ratioEl.textContent = `${formatRatio(ratio)} · ${pass ? 'AA ✓' : 'below AA'}`;
    ratioEl.hidden = false;
    ratioEl.classList.toggle('is-pass', pass);
    ratioEl.classList.toggle('is-fail', !pass);
    chip.classList.toggle('is-contrast-fail', !pass);
  }
}

export function initSemanticSwatches(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.pdoc-semantic-swatch[data-pdoc-semantic-bg]').forEach((swatch) => {
    const bg = swatch.dataset.pdocSemanticBg;
    const fg = swatch.dataset.pdocSemanticFg;
    const chip = swatch.querySelector<HTMLElement>('.pdoc-semantic-swatch__chip');
    if (!bg || !chip) return;
    chip.classList.remove('is-contrast-fail');
    applyChipContrast(chip, bg, fg || undefined);
  });
}
