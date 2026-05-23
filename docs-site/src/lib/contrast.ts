/** WCAG 2.x relative luminance & contrast (for doc swatches). */

function parseChannel(raw: string | number): number {
  const n = typeof raw === 'number' ? raw : Number.parseFloat(raw);
  if (Number.isNaN(n)) return 0;
  const c = n / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * parseChannel(r) + 0.7152 * parseChannel(g) + 0.0722 * parseChannel(b);
}

export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function luminanceFromCssColor(color: string): number | null {
  const m = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!m) return null;
  return relativeLuminance(Number(m[1]), Number(m[2]), Number(m[3]));
}

/** Resolved computed background color for a CSS variable token, e.g. `--surface-page`. */
export function readTokenColor(token: string): string {
  const name = token.startsWith('--') ? token : `--${token}`;
  const probe = document.createElement('span');
  probe.style.cssText = `position:absolute;left:-9999px;width:1px;height:1px;background:var(${name})`;
  document.body.appendChild(probe);
  const bg = getComputedStyle(probe).backgroundColor;
  document.body.removeChild(probe);
  return bg;
}

export function pickForegroundForBackground(bgLum: number): '#0f172a' | '#f8fafc' {
  return bgLum > 0.179 ? '#0f172a' : '#f8fafc';
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export const AA_TEXT_NORMAL = 4.5;
