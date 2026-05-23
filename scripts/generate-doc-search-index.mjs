/**
 * Build doc search index for client-side Fuse.js (V1: nav + page metadata).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nav = JSON.parse(readFileSync(join(root, 'docs-site', 'src', 'data', 'nav.json'), 'utf8'));
const pages = JSON.parse(readFileSync(join(root, 'docs-site', 'src', 'data', 'pages.json'), 'utf8'));
const outPath = join(root, 'docs-site', 'public', 'doc-search-index.json');

function hrefToPath(href) {
  if (href === 'index.html') return '/docs';
  return `/docs/${href.replace(/\.html$/, '')}`;
}

function hrefToId(href) {
  if (href === 'index.html') return 'intro';
  return href.replace(/\.html$/, '');
}

const byUrl = new Map();

for (const section of nav.sections) {
  for (const item of section.items) {
    const href = item.href;
    const page = pages[href] ?? {};
    const url = hrefToPath(href);
    byUrl.set(url, {
      id: hrefToId(href),
      title: item.label,
      url,
      section: section.title,
      breadcrumb: page.breadcrumb ?? [section.title, item.label],
      lead: page.lead ?? '',
      keywords: item.keywords ?? '',
    });
  }
}

/** Pages in pages.json but not listed in nav (legacy routes). */
for (const [href, page] of Object.entries(pages)) {
  const url = hrefToPath(href);
  if (byUrl.has(url)) continue;
  byUrl.set(url, {
    id: hrefToId(href),
    title: page.title ?? hrefToId(href),
    url,
    section: page.breadcrumb?.[0] ?? 'Documentation',
    breadcrumb: page.breadcrumb ?? ['Documentation'],
    lead: page.lead ?? '',
    keywords: '',
  });
}

const index = [...byUrl.values()].sort((a, b) => a.title.localeCompare(b.title, 'en'));

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ version: 1, generated: new Date().toISOString(), entries: index }, null, 2));
console.log(`✓ docs-site/public/doc-search-index.json (${index.length} entries)`);
