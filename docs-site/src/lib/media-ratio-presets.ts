import { mediaPlaceholderUrl } from './media-placeholder-svg';

/** Aspect-ratio modifiers from _media.scss; keep in sync with Placeholder page. */
export const MEDIA_RATIO_MODIFIERS = [
  'media--1-1',
  'media--8-5',
  'media--3-4',
  'media--3-2',
] as const;

export type MediaRatioModifier = (typeof MEDIA_RATIO_MODIFIERS)[number];

export interface MediaRatioPreset {
  mod: MediaRatioModifier;
  label: string;
  w: number;
  h: number;
  variant: number;
}

/** Source dimensions match SVG placeholders so crop matches aspect-ratio modifiers. */
export const MEDIA_RATIO_PRESETS: MediaRatioPreset[] = [
  { mod: 'media--1-1', label: '1:1', w: 240, h: 240, variant: 0 },
  { mod: 'media--8-5', label: '8:5', w: 480, h: 300, variant: 1 },
  { mod: 'media--3-4', label: '3:4', w: 360, h: 480, variant: 2 },
  { mod: 'media--3-2', label: '3:2', w: 480, h: 320, variant: 3 },
];

const PRESET_BY_MOD = new Map(MEDIA_RATIO_PRESETS.map((p) => [p.mod, p]));

export function getMediaRatioPreset(mod: MediaRatioModifier): MediaRatioPreset {
  const preset = PRESET_BY_MOD.get(mod);
  if (!preset) throw new Error(`Unknown media ratio modifier: ${mod}`);
  return preset;
}

export function mediaPlaceholderForRatio(mod: MediaRatioModifier): {
  src: string;
  width: number;
  height: number;
} {
  const { w, h, variant } = getMediaRatioPreset(mod);
  return {
    src: mediaPlaceholderUrl(w, h, variant),
    width: w,
    height: h,
  };
}

/** Standalone `.media` demo (Placeholder page grid). */
export function mediaRatioFigure(mod: MediaRatioModifier): string {
  const { label } = getMediaRatioPreset(mod);
  const { src, width, height } = mediaPlaceholderForRatio(mod);
  return `<figure class="pdoc-media-ratios__item">
                <div class="media ${mod}">
                  <img src="${src}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async" />
                </div>
                <figcaption class="body-small pdoc-text-muted">${label}</figcaption>
              </figure>`;
}

/** `.card__media` block: full intrinsic size so SVG matches modifier crop. */
export function cardMediaBlock(mod: MediaRatioModifier, alt = ''): string {
  const { src, width, height } = mediaPlaceholderForRatio(mod);
  return `<div class="card__media media ${mod}">
                    <img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy" decoding="async" />
                  </div>`;
}
