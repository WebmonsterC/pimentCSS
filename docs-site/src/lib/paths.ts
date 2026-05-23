/** URL prefix for the documentation area (Astro static routes). */
export const DOC_BASE = '/docs';

export function slugToPath(slug: string | null): string {
  if (!slug) return DOC_BASE;
  return `${DOC_BASE}/${slug}`;
}

/** Prefix internal doc paths for prose links (already prefixed paths are unchanged). */
export function docHref(path: string): string {
  if (!path || path === '/') return DOC_BASE;
  if (path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto:')) return path;
  if (path.startsWith(DOC_BASE)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${DOC_BASE}${normalized}`;
}
