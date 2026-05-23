import type { APIRoute } from 'astro';
import {
  buildMediaPlaceholderSvg,
  MEDIA_PLACEHOLDER_PRESETS,
} from '../../../../lib/media-placeholder-svg';

export function getStaticPaths() {
  return MEDIA_PLACEHOLDER_PRESETS.map(({ w, h, variant }) => ({
    params: { w: String(w), h: String(h), variant: String(variant) },
  }));
}

export const GET: APIRoute = ({ params }) => {
  const w = Number(params.w);
  const h = Number(params.h);
  const variant = Number(params.variant);
  const svg = buildMediaPlaceholderSvg(w, h, variant);

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml;charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
