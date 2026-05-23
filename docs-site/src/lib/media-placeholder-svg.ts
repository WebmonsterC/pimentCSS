/**
 * Decorative media placeholders for documentation demos.
 * Gradients mirror carousel doc tones (primary / information / accent / success).
 * SVG uses fixed hex values because external <img> cannot resolve CSS variables.
 */

export type MediaPlaceholderPreset = {
  w: number;
  h: number;
  variant: number;
};

/** Presets prerendered for the Placeholder page and reusable in other docs. */
export const MEDIA_PLACEHOLDER_PRESETS: MediaPlaceholderPreset[] = [
  { w: 240, h: 240, variant: 0 },
  { w: 480, h: 300, variant: 1 },
  { w: 360, h: 480, variant: 2 },
  { w: 480, h: 320, variant: 3 },
];

/** Design-system gradient pairs (145deg, same angles as .pdoc-carousel-widget__media). */
const GRADIENT_VARIANTS: readonly [string, string][] = [
  ['#a8e8e2', '#6ecde8'], // primary-200 → information-300
  ['#b8ebc4', '#2ba89c'], // success-200 → primary-400
  ['#ffe0b8', '#5ec9be'], // accent-200 → primary-300
  ['#b8e8f8', '#2ba89c'], // information-200 → primary-400
];

const MAX_DIMENSION = 1920;

function clampDimension(value: number): number {
  if (!Number.isFinite(value)) return 240;
  return Math.min(MAX_DIMENSION, Math.max(1, Math.round(value)));
}

function normalizeVariant(variant: number): number {
  if (!Number.isFinite(variant)) return 0;
  const n = Math.round(variant);
  return ((n % GRADIENT_VARIANTS.length) + GRADIENT_VARIANTS.length) % GRADIENT_VARIANTS.length;
}

/** Path-style URL (static-friendly): /media-placeholder/240/240/0.svg */
export function mediaPlaceholderUrl(w: number, h: number, variant = 0): string {
  const width = clampDimension(w);
  const height = clampDimension(h);
  const tone = normalizeVariant(variant);
  return `/media-placeholder/${width}/${height}/${tone}.svg`;
}

/** Query-style URL (dev server endpoint): /media-placeholder.svg?w=240&h=240&v=0 */
export function mediaPlaceholderQueryUrl(w: number, h: number, variant = 0): string {
  const width = clampDimension(w);
  const height = clampDimension(h);
  const tone = normalizeVariant(variant);
  return `/media-placeholder.svg?w=${width}&h=${height}&v=${tone}`;
}

export function parseMediaPlaceholderSearchParams(searchParams: URLSearchParams): {
  w: number;
  h: number;
  variant: number;
} {
  const w = clampDimension(Number(searchParams.get('w') ?? searchParams.get('width') ?? 240));
  const h = clampDimension(Number(searchParams.get('h') ?? searchParams.get('height') ?? 240));
  const variant = normalizeVariant(Number(searchParams.get('v') ?? searchParams.get('variant') ?? 0));
  return { w, h, variant };
}

export function buildMediaPlaceholderSvg(w: number, h: number, variant = 0): string {
  const width = clampDimension(w);
  const height = clampDimension(h);
  const tone = normalizeVariant(variant);
  const [from, to] = GRADIENT_VARIANTS[tone]!;
  const id = `g-${width}x${height}-v${tone}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="${id}-spot" cx="72%" cy="28%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${id})"/>
  <rect width="100%" height="100%" fill="url(#${id}-spot)"/>
</svg>`;
}
