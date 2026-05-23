import nav from '../data/nav.json';
import pagesData from '../data/pages.json';
import { buildDocPageBody } from './doc-page-builders';
export { DOC_BASE, slugToPath, docHref } from './paths';

export type PageMeta = {
  title: string;
  lead: string;
  breadcrumb: string[];
  static?: string;
  scss?: string;
  api?: { className: string; description: string }[];
  a11y?: string[];
  componentSelector?: string;
};

export const navConfig = nav;

export function hrefToSlug(href: string): string | null {
  if (href === 'index.html') return null;
  return href.replace(/\.html$/, '');
}

export function getPageMeta(slug: string | null): PageMeta {
  const key = slug ? `${slug}.html` : 'index.html';
  const page = (pagesData as Record<string, PageMeta>)[key];
  if (!page) {
    return {
      title: slug ?? 'Documentation',
      lead: 'PimentCSS documentation.',
      breadcrumb: ['Documentation'],
    };
  }
  return page;
}

export { buildDocPageBody };

/** Legacy slug kept for bookmarks (not in sidebar nav). */
const LEGACY_DOC_SLUGS = ['modals-cards'] as const;

export function getAllSlugs(): string[] {
  const slugs: string[] = [];
  for (const section of nav.sections) {
    for (const item of section.items) {
      const slug = hrefToSlug(item.href);
      if (slug) slugs.push(slug);
    }
  }
  return [...new Set([...slugs, ...LEGACY_DOC_SLUGS])];
}
