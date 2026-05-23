/**
 * Ensures CSS classes referenced in documentation exist in built stylesheets.
 * Run after: npm run build:css && node scripts/generate-palette-css.mjs
 *
 * Usage: node scripts/verify-doc-classes.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Doc-site / legacy fragment helpers — not part of PimentCSS */
const DOC_ONLY_PREFIXES = ['pdoc-', 'ds-'];
const DOC_ONLY_SUFFIXES = ['-doc'];
const DOC_ONLY_EXACT = new Set([
  'is-active',
  'is-pass',
  'is-fail',
  'is-contrast-fail',
  'tab--focus',
  'pagination__item--focus',
  'anchor-item--focus',
]);

/** Doc layout / matrix wrappers (docs-site/doc.css), not PimentCSS */
function isFragmentLayoutOnly(name) {
  return (
    /(?:showcase|matrix|ratios|demo|type-scale)/.test(name) ||
    name === 'snackbar-grid' ||
    name.startsWith('snackbar-grid__') ||
    name === 'demo-focus' ||
    name === 'cards-showcase' ||
    name.startsWith('cards-showcase__') ||
    name === 'tree-demo' ||
    name === 'progress-demo' ||
    name.startsWith('progress-demo__')
  );
}

/** Documented in colors page but defined in palettes.css */
const PALETTE_ROOT_CLASSES = new Set(['palette', 'palettes-grid', 'palette__title', 'palette__alias', 'palette__step', 'palette__oklch', 'palette__chip']);

function walkContentTs(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isFile() || !name.endsWith('-content.ts')) continue;
    out.push(p);
  }
  return out;
}

const CONTENT_GLOBS = {
  ts: walkContentTs(join(root, 'docs-site', 'src', 'lib')),
  htmlDir: join(root, 'docs-site', 'src', 'generated'),
  pagesJson: join(root, 'docs-site', 'src', 'data', 'pages.json'),
};

function span(prefix, from, to) {
  const out = [];
  for (let i = from; i <= to; i++) {
    if (prefix === 'heading-h') out.push(`heading-h${i}`);
    else out.push(`${prefix}-${i}`);
  }
  return out;
}

/** Known ellipsis patterns in prose */
function expandEllipsis(text, source) {
  const refs = new Map();
  const add = (cls) => addRef(refs, cls, `${source} (range)`);

  if (/\.col-1\b/.test(text) && /\.col-12\b/.test(text) && !/\.col-md-12\b/.test(text)) {
    for (const c of span('col', 1, 12)) add(c);
  }
  if (/\.col-md-1\b/.test(text) && /\.col-md-12\b/.test(text)) {
    for (const c of span('col-md', 1, 12)) add(c);
  }
  if (/\.m-\*/.test(text) || (/\b\.m-\b/.test(text) && /\.mt-\*/.test(text))) {
    for (const c of [...span('m', 0, 6), ...span('mt', 0, 6), ...span('mb', 0, 6)]) add(c);
  }
  if (/\.p-\*/.test(text)) {
    for (const c of span('p', 0, 6)) add(c);
  }
  if (/\.gap-\*/.test(text)) {
    for (const c of span('gap', 0, 6)) add(c);
  }
  if (/\.shadow-xs\b/.test(text) && /\.shadow-xl\b/.test(text)) {
    for (const c of ['shadow-inset', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-none']) add(c);
  }
  if (/\.heading-h1\b/.test(text) && /\.heading-h6\b/.test(text)) {
    for (const c of span('heading-h', 1, 6)) add(c);
  }
  if (/\.palette__chip--\*/.test(text)) {
    refs.set('__palette_chip_prefix__', new Set([source]));
  }

  return refs;
}

function isDocOnly(name) {
  if (name === 'ico' || name.startsWith('ico-')) return true;
  if (name === 'ph' || name.startsWith('ph-')) return true;
  if (DOC_ONLY_EXACT.has(name)) return true;
  if (DOC_ONLY_PREFIXES.some((p) => name.startsWith(p))) return true;
  if (DOC_ONLY_SUFFIXES.some((s) => name.endsWith(s))) return true;
  if (/-doc__/.test(name)) return true;
  if (isFragmentLayoutOnly(name)) return true;
  return false;
}

function expandWildcardCodeTags(text, source) {
  const refs = new Map();
  const rules = [
    [/<code>\.col-\*<\/code>/, () => span('col', 1, 12)],
    [/<code>\.col-md-\*<\/code>/, () => span('col-md', 1, 12)],
    [/<code>\.m-\*<\/code>/, () => [...span('m', 0, 6), ...span('mt', 0, 6), ...span('mb', 0, 6)]],
    [/<code>\.p-\*<\/code>/, () => span('p', 0, 6)],
    [/<code>\.gap-\*<\/code>/, () => span('gap', 0, 6)],
  ];
  for (const [re, fn] of rules) {
    if (re.test(text)) {
      for (const c of fn()) addRef(refs, c, `${source} (wildcard)`);
    }
  }
  return refs;
}

function normalizeToken(raw) {
  let c = raw.replace(/^\./, '').trim();
  if (!c || c.includes('*') || c.includes('…')) return null;
  if (/^(html|body|main|header|aside|section|article|div|button|input|label|p|h[1-6]|ul|li|svg|path|span|code|pre|table|thead|tbody|tr|td|th)$/i.test(c)) {
    return null;
  }
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/i.test(c)) {
    return null;
  }
  return c.toLowerCase() === c ? c : c; // keep BEM case as-is (btn--primary)
}

function extractFromClassAttr(value) {
  return value.split(/\s+/).map(normalizeToken).filter(Boolean);
}

function addRef(refs, cls, source) {
  if (!cls || isDocOnly(cls)) return;
  if (!refs.has(cls)) refs.set(cls, new Set());
  refs.get(cls).add(source);
}

function extractFromMarkup(text, source) {
  const refs = new Map();

  const classAttrRe = /\bclass\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = classAttrRe.exec(text))) {
    for (const cls of extractFromClassAttr(m[1])) addRef(refs, cls, source);
  }

  const codeDotRe = /<code>\.([a-z][a-z0-9]*(?:-[a-z0-9]+)*)<\/code>/gi;
  while ((m = codeDotRe.exec(text))) {
    if (!m[0].includes('*')) addRef(refs, m[1], source);
  }

  mergeRefs(refs, expandWildcardCodeTags(text, source));
  mergeRefs(refs, expandEllipsis(text, source));
  return refs;
}

function mergeRefs(into, from) {
  for (const [cls, sources] of from) {
    if (!into.has(cls)) into.set(cls, new Set());
    for (const s of sources) into.get(cls).add(s);
  }
}

function loadPagesJson() {
  const refs = new Map();
  if (!existsSync(CONTENT_GLOBS.pagesJson)) return refs;
  const pages = JSON.parse(readFileSync(CONTENT_GLOBS.pagesJson, 'utf8'));
  for (const [page, meta] of Object.entries(pages)) {
    const source = `docs-site/src/data/pages.json → ${page}`;
    if (meta.componentSelector) {
      const cls = normalizeToken(meta.componentSelector);
      if (cls) addRef(refs, cls, source);
    }
    for (const row of meta.api ?? []) {
      const cls = normalizeToken(row.className);
      if (cls) addRef(refs, cls, source);
    }
  }
  return refs;
}

function walkHtmlFragments(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.html')) files.push(join(dir, name));
  }
  return files;
}

function extractCssClasses(cssPath) {
  const css = readFileSync(cssPath, 'utf8');
  const set = new Set();
  const re =
    /\.([a-zA-Z][a-zA-Z0-9]*(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?)/g;
  let m;
  while ((m = re.exec(css))) set.add(m[1]);
  return set;
}

function resolveBundle(cls) {
  if (PALETTE_ROOT_CLASSES.has(cls) || cls.startsWith('palette__')) return 'palettes';
  return 'ds';
}

function main() {
  const cssPath = join(root, 'dist', 'pimentcss.css');
  const palettesPath = join(root, 'styles', 'palettes.css');

  if (!existsSync(cssPath)) {
    console.error('✗ dist/pimentcss.css missing — run: npm run build:css');
    process.exit(1);
  }
  if (!existsSync(palettesPath)) {
    console.error('✗ styles/palettes.css missing — run: node scripts/generate-palette-css.mjs');
    process.exit(1);
  }

  const dsClasses = extractCssClasses(cssPath);
  const paletteClasses = extractCssClasses(palettesPath);
  const palettesCss = readFileSync(palettesPath, 'utf8');

  const allRefs = new Map();
  mergeRefs(allRefs, loadPagesJson());

  for (const rel of CONTENT_GLOBS.ts) {
    const file = join(root, rel);
    if (!existsSync(file)) continue;
    mergeRefs(allRefs, extractFromMarkup(readFileSync(file, 'utf8'), rel));
  }

  for (const file of walkHtmlFragments(CONTENT_GLOBS.htmlDir)) {
    const rel = relative(root, file).replace(/\\/g, '/');
    mergeRefs(allRefs, extractFromMarkup(readFileSync(file, 'utf8'), rel));
  }

  const allClassNames = new Set(
    [...allRefs.keys()].filter((k) => k !== '__palette_chip_prefix__'),
  );

  const missing = [];

  for (const [cls, sources] of allRefs) {
    if (cls === '__palette_chip_prefix__') {
      const palettePrefixOk = [...paletteClasses].some((c) => c.startsWith('palette__chip--'));
      if (!palettePrefixOk) {
        missing.push({ cls: '.palette__chip--*', sources, bundle: 'styles/palettes.css' });
      }
      continue;
    }

    const bundle = resolveBundle(cls);
    const ok =
      bundle === 'palettes'
        ? paletteClasses.has(cls) || palettesCss.includes(`.${cls}`)
        : dsClasses.has(cls);

    const variantCovered = [...allClassNames].some((other) => other.startsWith(`${cls}--`));

    if (!ok && !variantCovered) {
      missing.push({
        cls: `.${cls}`,
        sources,
        bundle: bundle === 'palettes' ? 'styles/palettes.css' : 'dist/pimentcss.css',
      });
    }
  }

  const count = [...allRefs.keys()].filter((k) => k !== '__palette_chip_prefix__').length;

  if (missing.length === 0) {
    console.log(`✓ ${count} documented PimentCSS class references verified (dist/pimentcss.css + palettes.css)`);
    process.exit(0);
  }

  console.error(`✗ ${missing.length} documented class(es) not found in built CSS:\n`);
  for (const { cls, sources, bundle } of missing.sort((a, b) => a.cls.localeCompare(b.cls))) {
    console.error(`  ${cls}  (expected in ${bundle})`);
    for (const s of [...sources].slice(0, 3)) console.error(`    → ${s}`);
    if (sources.size > 3) console.error(`    … +${sources.size - 3} more`);
  }
  console.error('\nFix the documentation or add the class to the design system, then npm run build:css');
  process.exit(1);
}

main();
