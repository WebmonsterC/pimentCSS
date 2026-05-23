/**
 * Impeccable-aligned checks for documentation sources.
 * - PRODUCT.md + DESIGN.md present (load-context)
 * - No Unicode em dashes (U+2014) in doc prose (PRODUCT anti-reference)
 * - Decorative <i class="ph"> tags include aria-hidden="true"
 *
 * Usage: node scripts/impeccable-doc-lint.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const EM_DASH = '\u2014';

const SCAN_DIRS = [
  join(root, 'docs-site', 'src', 'lib'),
  join(root, 'docs-site', 'src', 'generated'),
  join(root, 'docs-site', 'src', 'layouts'),
];
const SCAN_FILES = [join(root, 'PRODUCT.md'), join(root, 'DESIGN.md')].filter((p) => existsSync(p));

const EXT = new Set(['.ts', '.html', '.md']);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.has(name.slice(name.lastIndexOf('.')))) out.push(p);
  }
  return out;
}

/** Doc snippet sources: use spaces only (tabs normalized at display but forbidden in authoring). */
function checkSnippetTabs(file, text) {
  if (!file.includes('docs-site/src/lib/') || !file.endsWith('-content.ts')) return [];
  const issues = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes('\t')) continue;
    issues.push({
      file,
      line: i + 1,
      snippet: 'tab character in snippet source (use 2 spaces)',
      rule: 'snippet-tabs',
    });
  }
  return issues;
}

function checkEmDash(file, text) {
  const issues = [];
  const lines = text.split('\n');
  let inYaml = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') {
      inYaml = !inYaml;
      continue;
    }
    if (inYaml) continue;
    if (!line.includes(EM_DASH)) continue;
    if (/^\s*\|/.test(line)) continue;
    issues.push({ file, line: i + 1, snippet: line.trim().slice(0, 120) });
  }
  return issues;
}

/** Inline --text-muted on page bg fails AA; use .pdoc-text-muted in prose. */
function checkTextMutedInline(file, text) {
  if (!file.includes('docs')) return [];
  const issues = [];
  const re = /style="[^"]*var\(--text-muted\)/g;
  let m;
  while ((m = re.exec(text))) {
    const line = text.slice(0, m.index).split('\n').length;
    issues.push({
      file,
      line,
      snippet: m[0].slice(0, 80),
      rule: 'text-muted-inline',
    });
  }
  return issues;
}

/** Live dropdown demos: trigger must declare which listbox it controls. */
function checkDropdownAriaControls(file, text) {
  if (!file.includes('menu-dropdown-content')) return [];
  if (!text.includes('data-dropdown-live')) return [];
  if (/data-dropdown-live[\s\S]*?dropdown__trigger[\s\S]*?aria-controls=/.test(text)) {
    return [];
  }
  return [
    {
      file,
      line: 0,
      snippet: 'data-dropdown-live block missing aria-controls on .dropdown__trigger',
      rule: 'dropdown-aria-controls',
    },
  ];
}

/** Tabs matrix: each preview sits in a cell wrapper (prevents grid overflow). */
function checkTabsMatrixCells(file, text) {
  if (!file.includes('tabs-content')) return [];
  if (!text.includes('ds-matrix--tabs')) return [];
  if (text.includes('ds-matrix__cell')) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'ds-matrix--tabs without ds-matrix__cell wrappers',
      rule: 'tabs-matrix-cells',
    },
  ];
}

/** Do not put focus-visible on matrix tab buttons (use tab--focus doc modifier). */
function checkTabsMatrixNoFocusClass(file, text) {
  if (!file.includes('tabs-content')) return [];
  if (!/<button[^>]*class="[^"]*tab[^"]*focus-visible/.test(text)) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'matrix tab uses focus-visible class; use tab--focus for doc preview',
      rule: 'tabs-matrix-focus-class',
    },
  ];
}

/** Tab panels must live inside .tabs (not after the container closes). */
function checkTabsPanelsInContainer(file, text) {
  if (!file.includes('tabs-content')) return [];
  const outsideAfterSeparator = /tabs__separator\s*\/>\s*\n\s*<\/div>\s*\n\s*<div id="pdoc-panel/;
  const outsideAfterTabBar = /\}\s*\n\s*<\/div>\s*\n\s*<div id="pdoc-panel-/;
  if (!outsideAfterSeparator.test(text) && !outsideAfterTabBar.test(text)) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'tab-panel outside .tabs container',
      rule: 'tabs-panels-in-container',
    },
  ];
}

/** Redundant duplicate lead (layout already renders pages.json lead). */
/** PimentCSS buttons: primary | transparent | outline only (no btn--secondary). */
function checkInvalidButtonClasses(file, text) {
  if (!/-content\.ts$/.test(file) && !file.endsWith('static-content.ts')) return [];
  if (!text.includes('btn--secondary')) return [];
  const line = text.split('\n').findIndex((l) => l.includes('btn--secondary')) + 1;
  return [
    {
      file,
      line: line || 0,
      snippet: 'btn--secondary is not a PimentCSS variant (use btn--outline or btn--transparent)',
      rule: 'invalid-btn-secondary',
    },
  ];
}

function checkDuplicatePdocLead(file, text) {
  if (!file.includes('-content.ts')) return [];
  if (!text.includes('class="pdoc-lead"')) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'duplicate pdoc-lead in content (layout already shows lead)',
      rule: 'duplicate-pdoc-lead',
    },
  ];
}

/** Pagination matrix: each preview sits in a cell wrapper. */
function checkPaginationMatrixCells(file, text) {
  if (!file.includes('pagination-content')) return [];
  if (!text.includes('ds-matrix--pagination')) return [];
  if (text.includes('ds-matrix__cell')) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'ds-matrix--pagination without ds-matrix__cell wrappers',
      rule: 'pagination-matrix-cells',
    },
  ];
}

/** Do not put focus-visible on matrix pagination buttons (use pagination__item--focus). */
function checkPaginationMatrixNoFocusClass(file, text) {
  if (!file.includes('pagination-content')) return [];
  if (!/<button[^>]*class="[^"]*pagination__item[^"]*focus-visible/.test(text)) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'matrix pagination item uses focus-visible; use pagination__item--focus for doc preview',
      rule: 'pagination-matrix-focus-class',
    },
  ];
}

/** ds-matrix must not use role="table" (axe aria-required-children). */
function checkDsMatrixRole(file, text) {
  if (!file.includes('-content.ts')) return [];
  if (!text.includes('ds-matrix')) return [];
  if (!/role="table"/.test(text)) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'ds-matrix uses role="table"; use role="group" with aria-label',
      rule: 'ds-matrix-role-group',
    },
  ];
}

/** Anchor matrix: each preview sits in a cell wrapper. */
function checkAnchorMatrixCells(file, text) {
  if (!file.includes('anchor-inpage-nav-content')) return [];
  if (!text.includes('ds-matrix--anchor')) return [];
  if (text.includes('ds-matrix__cell')) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'ds-matrix--anchor without ds-matrix__cell wrappers',
      rule: 'anchor-matrix-cells',
    },
  ];
}

/** Do not put focus-visible on matrix anchor links (use anchor-item--focus). */
function checkAnchorMatrixNoFocusClass(file, text) {
  if (!file.includes('anchor-inpage-nav-content')) return [];
  if (!/<a[^>]*class="[^"]*anchor-item[^"]*focus-visible/.test(text)) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'matrix anchor-item uses focus-visible; use anchor-item--focus for doc preview',
      rule: 'anchor-matrix-focus-class',
    },
  ];
}

/** Anchor matrix focus preview must not clip (pdoc-demo overflow + cell padding). */
function checkAnchorMatrixFocusRoom(file, text) {
  if (!file.includes('doc.css')) return [];
  if (!text.includes('ds-matrix--anchor')) return [];
  const hasOverflow = /pdoc-demo:has\(\.ds-matrix--anchor\)[\s\S]{0,160}overflow:\s*visible/.test(text);
  const hasCellPad = /\.ds-matrix--anchor\s+\.ds-matrix__cell[\s\S]{0,280}padding-block:\s*4px/.test(text);
  if (hasOverflow && hasCellPad) return [];
  return [
    {
      file,
      line: 0,
      snippet:
        'anchor matrix missing overflow:visible on .pdoc-demo or padding-block: 4px on .ds-matrix__cell (focus ring clip)',
      rule: 'anchor-matrix-focus-room',
    },
  ];
}

/** Carousel matrix: each preview sits in a cell wrapper. */
function checkCarouselMatrixCells(file, text) {
  if (!file.includes('carousel-content')) return [];
  if (!text.includes('ds-matrix--carousel')) return [];
  if (text.includes('ds-matrix__cell')) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'ds-matrix--carousel without ds-matrix__cell wrappers',
      rule: 'carousel-matrix-cells',
    },
  ];
}

/** Do not put focus-visible on matrix carousel arrows (use carousel__arrow--focus). */
function checkCarouselMatrixNoFocusClass(file, text) {
  if (!file.includes('carousel-content')) return [];
  if (!/<button[^>]*class="[^"]*carousel__arrow[^"]*focus-visible/.test(text)) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'matrix carousel__arrow uses focus-visible; use carousel__arrow--focus for doc preview',
      rule: 'carousel-matrix-focus-class',
    },
  ];
}

/** Live carousel widgets need slides + polite status region. */
function checkCarouselLiveA11y(file, text) {
  if (!file.includes('carousel-content')) return [];
  if (!text.includes('data-carousel-live')) return [];
  const issues = [];
  if (!text.includes('data-carousel-slide')) {
    issues.push({
      file,
      line: 0,
      snippet: 'data-carousel-live without [data-carousel-slide] panels',
      rule: 'carousel-live-slides',
    });
  }
  if (!/data-carousel-status[\s\S]*?aria-live="polite"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'live carousel missing [data-carousel-status] with aria-live="polite"',
      rule: 'carousel-live-status',
    });
  }
  if (!/aria-roledescription="carousel"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'live carousel widget missing aria-roledescription="carousel"',
      rule: 'carousel-live-roledescription',
    });
  }
  return issues;
}

/** Carousel matrix focus preview must not clip. */
function checkCarouselMatrixFocusRoom(file, text) {
  if (!file.includes('doc.css')) return [];
  const issues = [];
  if (text.includes('ds-matrix--carousel')) {
    const hasOverflow = /pdoc-demo:has\(\.ds-matrix--carousel\)[\s\S]{0,200}overflow:\s*visible/.test(
      text,
    );
    const hasArrowPad = /\.ds-matrix--carousel\s+\.ds-matrix__cell[\s\S]{0,320}padding-block:\s*6px/.test(
      text,
    );
    const hasArrowFocus = /\.ds-matrix--carousel\s+\.carousel__arrow\.carousel__arrow--focus/.test(text);
    if (!hasOverflow || !hasArrowPad || !hasArrowFocus) {
      issues.push({
        file,
        line: 0,
        snippet: 'carousel arrow matrix missing overflow:visible, cell padding, or --focus doc rule',
        rule: 'carousel-matrix-focus-room',
      });
    }
  }
  if (text.includes('pdoc-carousel-scrollbar-lab')) {
    if (!/pdoc-carousel-scrollbar-state__preview--default/.test(text)) {
      issues.push({
        file,
        line: 0,
        snippet: 'scroll bar doc missing static state previews with forced 2px/4px heights',
        rule: 'carousel-scrollbar-states',
      });
    }
  }
  return issues;
}

/** Scroll bar section must use interactive lab, not broken matrix-only markup. */
function checkCarouselScrollbarLab(file, text) {
  if (!file.includes('carousel-content')) return [];
  if (!text.includes('carousel-scroll')) return [];
  const issues = [];
  if (!text.includes('pdoc-carousel-scrollbar-lab')) {
    issues.push({
      file,
      line: 0,
      snippet: 'carousel scroll section missing pdoc-carousel-scrollbar-lab interactive demo',
      rule: 'carousel-scrollbar-lab',
    });
    return issues;
  }
  if (!/data-carousel-scrollbar-status[\s\S]*?aria-live="polite"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'scroll bar lab missing [data-carousel-scrollbar-status] with aria-live="polite"',
      rule: 'carousel-scrollbar-live-status',
    });
  }
  if (
    !/pdoc-carousel-scrollbar-lab__bar[\s\S]*?role="slider"[\s\S]*?aria-valuenow=/.test(text)
  ) {
    issues.push({
      file,
      line: 0,
      snippet: 'scroll bar lab missing role="slider" and aria-valuenow on .carousel__scrollbar',
      rule: 'carousel-scrollbar-slider-a11y',
    });
  }
  return issues;
}

/** Row table demos: scroll region + semantic headers. */
function checkTableResponsiveA11y(file, text) {
  if (!file.includes('table-content')) return [];
  const issues = [];
  if (!text.includes('table-scroll')) return issues;
  if (!/table-scroll[\s\S]*?role="region"[\s\S]*?tabindex="0"[\s\S]*?aria-label=/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: '.table-scroll missing role="region", tabindex="0", or aria-label',
      rule: 'table-scroll-region',
    });
  }
  if (!/<th[^>]*scope="col"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'table demo headers missing scope="col"',
      rule: 'table-header-scope',
    });
  }
  if (!/<caption class="sr-only">/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'live row table missing <caption class="sr-only">',
      rule: 'table-caption-sr',
    });
  }
  if (text.includes('data-table-live') && !text.includes('data-table-row')) {
    issues.push({
      file,
      line: 0,
      snippet: 'data-table-live without tbody tr[data-table-row]',
      rule: 'table-live-rows',
    });
  }
  if (!text.includes('pdoc-table-responsive--stack') || !text.includes('pdoc-table-cards')) {
    issues.push({
      file,
      line: 0,
      snippet: 'table page missing mobile card stack pattern (pdoc-table-cards)',
      rule: 'table-mobile-cards',
    });
  }
  return issues;
}

/** Doc CSS must hide cards on desktop and scroll on mobile. */
function checkTableResponsiveCss(file, text) {
  if (!file.includes('doc.css')) return [];
  if (!text.includes('pdoc-table-responsive--stack')) return [];
  const issues = [];
  const hasMobileHide =
    /\.pdoc-table-responsive--stack\s+\.pdoc-table-scroll[\s\S]{0,120}display:\s*none/.test(text);
  const hasDesktopShow =
    /@media\s*\(\s*min-width:\s*48rem\s*\)[\s\S]{0,400}\.pdoc-table-responsive--stack\s+\.pdoc-table-cards[\s\S]{0,80}display:\s*none/.test(
      text,
    );
  if (!hasMobileHide || !hasDesktopShow) {
    issues.push({
      file,
      line: 0,
      snippet: 'table responsive doc CSS missing mobile/desktop toggle for scroll vs cards',
      rule: 'table-responsive-css',
    });
  }
  return issues;
}

/** Tree matrix: each preview sits in a cell wrapper. */
function checkTreeMatrixCells(file, text) {
  if (!file.includes('tree-content')) return [];
  if (!text.includes('ds-matrix--tree')) return [];
  if (text.includes('ds-matrix__cell')) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'ds-matrix--tree without ds-matrix__cell wrappers',
      rule: 'tree-matrix-cells',
    },
  ];
}

/** Do not put focus-visible on matrix tree rows (use tree__toggle--focus / tree__content--focus). */
function checkTreeMatrixNoFocusClass(file, text) {
  if (!file.includes('tree-content')) return [];
  if (!/tree__row[^>]*focus-visible|tree__content[^>]*focus-visible|tree__toggle[^>]*focus-visible/.test(text)) {
    return [];
  }
  return [
    {
      file,
      line: 0,
      snippet: 'matrix tree row uses focus-visible; use tree__toggle--focus / tree__content--focus',
      rule: 'tree-matrix-focus-class',
    },
  ];
}

/** Live tree demos need role=tree and aria-expanded on toggles. */
function checkTreeLiveA11y(file, text) {
  if (!file.includes('tree-content')) return [];
  if (!text.includes('data-tree-live')) return [];
  const issues = [];
  if (!/role="tree"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'data-tree-live without role="tree" on root',
      rule: 'tree-live-role',
    });
  }
  if (!/data-tree-live[\s\S]*?aria-expanded=/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'data-tree-live without aria-expanded on toggles',
      rule: 'tree-live-expanded',
    });
  }
  if (!/tree__group[\s\S]*?role="group"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'live tree missing role="group" on .tree__group',
      rule: 'tree-live-group',
    });
  }
  return issues;
}

/** Collapsed branches must start with hidden on the child .tree__group. */
function checkTreeCollapsedHidden(file, text) {
  if (!file.includes('tree-content')) return [];
  const issues = [];
  const re = /aria-expanded="false"/g;
  let m;
  while ((m = re.exec(text))) {
    const slice = text.slice(m.index, m.index + 800);
    const groupMatch = slice.match(/<ul class="tree__group"[^>]*>/);
    if (!groupMatch) continue;
    if (!groupMatch[0].includes('hidden')) {
      const line = text.slice(0, m.index).split('\n').length;
      issues.push({
        file,
        line,
        snippet: groupMatch[0],
        rule: 'tree-collapsed-hidden',
      });
    }
  }
  return issues;
}

/** SCSS must not override [hidden] on tree groups (expand/collapse). */
function checkTreeHiddenScss(rootDir) {
  const issues = [];
  const treeScss = join(rootDir, 'scss', 'components', '_tree.scss');
  const a11yScss = join(rootDir, 'scss', 'tokens', '_a11y.scss');
  if (existsSync(treeScss)) {
    const text = readFileSync(treeScss, 'utf8');
    const rel = relative(rootDir, treeScss).replace(/\\/g, '/');
    if (!/tree__group[\s\S]*?&\[hidden\][\s\S]*?display:\s*none/.test(text)) {
      issues.push({
        file: rel,
        line: 0,
        snippet: '_tree.scss missing .tree__group[hidden] { display: none }',
        rule: 'tree-group-hidden-scss',
      });
    }
  }
  if (existsSync(a11yScss)) {
    const text = readFileSync(a11yScss, 'utf8');
    const rel = relative(rootDir, a11yScss).replace(/\\/g, '/');
    if (!/\[hidden\][\s\S]*?display:\s*none/.test(text)) {
      issues.push({
        file: rel,
        line: 0,
        snippet: '_a11y.scss missing global [hidden] { display: none }',
        rule: 'tree-global-hidden-scss',
      });
    }
  }
  return issues;
}

/** Tree matrix focus preview must not clip. */
function checkTreeMatrixFocusRoom(file, text) {
  if (!file.includes('doc.css')) return [];
  if (!text.includes('ds-matrix--tree')) return [];
  const hasOverflow = /pdoc-demo:has\(\.ds-matrix--tree\)[\s\S]{0,160}overflow:\s*visible/.test(text);
  const hasCellPad = /\.ds-matrix--tree\s+\.ds-matrix__cell[\s\S]{0,280}padding-block:\s*4px/.test(text);
  if (hasOverflow && hasCellPad) return [];
  return [
    {
      file,
      line: 0,
      snippet:
        'tree matrix missing overflow:visible on .pdoc-demo or padding-block: 4px on .ds-matrix__cell',
      rule: 'tree-matrix-focus-room',
    },
  ];
}

/** Dot badges must expose an accessible name (no visible text). */
function checkBadgeDotA11y(file, text) {
  if (!file.includes('badge-content')) return [];
  const issues = [];
  const re = /<span class="badge badge--dot[^>]*>/g;
  let m;
  while ((m = re.exec(text))) {
    const tag = m[0];
    if (/aria-label=|aria-labelledby=/.test(tag)) continue;
    const line = text.slice(0, m.index).split('\n').length;
    issues.push({
      file,
      line,
      snippet: tag,
      rule: 'badge-dot-aria-label',
    });
  }
  return issues;
}

/** Tags matrix: each preview sits in a cell wrapper. */
function checkTagsMatrixCells(file, text) {
  if (!file.includes('tags-content')) return [];
  if (!text.includes('ds-matrix--tag')) return [];
  if (text.includes('ds-matrix__cell')) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'ds-matrix--tag without ds-matrix__cell wrappers',
      rule: 'tags-matrix-cells',
    },
  ];
}

/** Do not put focus-visible on matrix tag buttons (use tag--focus). */
function checkTagsMatrixNoFocusClass(file, text) {
  if (!file.includes('tags-content')) return [];
  if (!/<button[^>]*class="[^"]*tag[^"]*focus-visible/.test(text)) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'matrix tag uses focus-visible; use tag--focus for doc preview',
      rule: 'tags-matrix-focus-class',
    },
  ];
}

/** Live tag filters need aria-pressed on interactive buttons. */
function checkTagsLiveA11y(file, text) {
  if (!file.includes('tags-content')) return [];
  if (!text.includes('data-tags-live')) return [];
  if (/data-tags-live[\s\S]*?tag--interactive[\s\S]*?aria-pressed=/.test(text)) {
    return [];
  }
  return [
    {
      file,
      line: 0,
      snippet: 'data-tags-live without aria-pressed on .tag--interactive',
      rule: 'tags-live-pressed',
    },
  ];
}

/** Tags matrix focus preview must not clip. */
function checkTagsMatrixFocusRoom(file, text) {
  if (!file.includes('doc.css')) return [];
  if (!text.includes('ds-matrix--tag')) return [];
  const hasOverflow = /pdoc-demo:has\(\.ds-matrix--tag\)[\s\S]{0,160}overflow:\s*visible/.test(text);
  const hasCellPad = /\.ds-matrix--tag\s+\.ds-matrix__cell[\s\S]{0,280}padding-block:\s*4px/.test(text);
  const hasTagFocus = /\.ds-matrix--tag\s+\.tag\.tag--focus/.test(text);
  if (hasOverflow && hasCellPad && hasTagFocus) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'tags matrix missing overflow:visible, cell padding, or tag--focus doc rule',
      rule: 'tags-matrix-focus-room',
    },
  ];
}

/** Decorative div.keyline must be hidden from assistive tech. */
function checkKeylineDivA11y(file, text) {
  if (!file.includes('keyline-content')) return [];
  const issues = [];
  const re = /<div class="keyline[^"]*"[^>]*>/g;
  let m;
  while ((m = re.exec(text))) {
    const tag = m[0];
    if (/role="separator"/.test(tag) && /aria-hidden="true"/.test(tag)) continue;
    const line = text.slice(0, m.index).split('\n').length;
    issues.push({
      file,
      line,
      snippet: tag,
      rule: 'keyline-div-a11y',
    });
  }
  return issues;
}

/** Keyline page uses pdoc-demo wrappers and sample layout. */
function checkKeylineDemoStructure(file, text) {
  if (!file.includes('keyline-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-keyline-samples')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-keyline-samples layout',
      rule: 'keyline-samples-layout',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'keyline sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'keyline-pdoc-demo',
    });
  }
  return issues;
}

/** Badge page uses doc swatch layout and pdoc-demo wrappers. */
function checkBadgeDemoStructure(file, text) {
  if (!file.includes('badge-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-badge-swatches')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-badge-swatches layout',
      rule: 'badge-swatch-layout',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'badge sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'badge-pdoc-demo',
    });
  }
  return issues;
}

/** Alerts page: variants, dismiss, dialog demos. */
function checkAlertsDemoStructure(file, text) {
  if (!file.includes('alerts-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-alert-stack')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-alert-stack layout',
      rule: 'alerts-stack-layout',
    });
  }
  if (!/alert--warning[\s\S]*?role="alert"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'warning/error alerts should use role="alert"',
      rule: 'alerts-role',
    });
  }
  if (!/data-alerts-live[\s\S]*?alert__close/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing dismissible live alerts with close button',
      rule: 'alerts-dismiss',
    });
  }
  if (!/data-alert-dialog-live[\s\S]*?role="alertdialog"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing alert dialog overlay demo',
      rule: 'alerts-dialog',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'alerts sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'alerts-pdoc-demo',
    });
  }
  return issues;
}

/** Snackbar page: variant grid + live dismiss demos. */
function checkProgressDemoStructure(file, text) {
  if (!file.includes('progress-content')) return [];
  const issues = [];
  if (!text.includes('role="progressbar"')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing role="progressbar" on progress demos',
      rule: 'progress-role',
    });
  }
  if (!text.includes('progress-circle__svg')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing progress-circle__svg markup',
      rule: 'progress-circle-svg',
    });
  }
  if (!text.includes('progress-bar__label')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing progress-bar__label compound demo',
      rule: 'progress-bar-label',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'progress sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'progress-pdoc-demo',
    });
  }
  if (!text.includes('data-progress-simulate')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing data-progress-simulate live demo',
      rule: 'progress-live-demo',
    });
  }
  if (!text.includes('data-progress-kind="circle"')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing live progress circle demo',
      rule: 'progress-live-circle',
    });
  }
  return issues;
}

function checkSlotsLayoutsDemoStructure(file, text) {
  if (!file.includes('slots-layouts-content')) return [];
  const issues = [];
  if (!text.includes('slots-layout--column') || !text.includes('slots-layout--row')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing column and row layout demos',
      rule: 'slots-layout-variants',
    });
  }
  if (!text.includes('slots-layout--fluid')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing slots-layout--fluid demo',
      rule: 'slots-fluid',
    });
  }
  if (!text.includes('card--blank')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing blank card in-context demo',
      rule: 'slots-blank-card',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'slots sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'slots-pdoc-demo',
    });
  }
  return issues;
}

function checkA11yDemoStructure(file, text) {
  if (!file.includes('a11y-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-a11y-focus-lab')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-a11y-focus-lab demo',
      rule: 'a11y-focus-lab',
    });
  }
  if (!text.includes('pdoc-a11y-touch-lab')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-a11y-touch-lab demo',
      rule: 'a11y-touch-lab',
    });
  }
  if (!text.includes('pdoc-semantic-grid') || !text.includes('data-pdoc-semantic-bg')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing live semantic contrast swatches',
      rule: 'a11y-semantic-swatches',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'a11y sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'a11y-pdoc-demo',
    });
  }
  if (!text.includes('prefers-reduced-motion')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing prefers-reduced-motion documentation',
      rule: 'a11y-reduced-motion',
    });
  }
  return issues;
}

function checkButtonsDemoStructure(file, text) {
  if (!file.includes('buttons-content')) return [];
  const issues = [];
  if (!text.includes('ds-matrix--btn')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing ds-matrix--btn variant matrix',
      rule: 'buttons-matrix',
    });
  }
  if (!text.includes('btn--icon-only')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing icon-only button demo',
      rule: 'buttons-icon-only',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'buttons sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'buttons-pdoc-demo',
    });
  }
  return issues;
}

/** Do not put focus-visible on matrix buttons (use btn--focus). */
function checkButtonsMatrixNoFocusClass(file, text) {
  if (!file.includes('buttons-content')) return [];
  const matrix = text.match(/ds-matrix ds-matrix--btn[\s\S]*?<\/div>\s*<p class="body-small pdoc-text-muted"/);
  if (!matrix) return [];
  if (!/<button[^>]*class="[^"]*btn[^"]*focus-visible/.test(matrix[0])) return [];
  return [
    {
      file,
      line: 0,
      snippet: 'matrix btn uses focus-visible; use btn--focus for doc preview',
      rule: 'buttons-matrix-focus-class',
    },
  ];
}

function checkPatternsHubStructure(file, text) {
  if (!file.includes('patterns-hub-content')) return [];
  const issues = [];
  if (!text.includes('pattern-contact-form') || !text.includes('pattern-toolbar-modal')) {
    issues.push({
      file,
      line: 0,
      snippet: 'patterns hub must link all three recipes',
      rule: 'patterns-hub',
    });
  }
  if (!text.includes('slots-layouts')) {
    issues.push({
      file,
      line: 0,
      snippet: 'patterns hub must link slots-layouts',
      rule: 'patterns-hub',
    });
  }
  return issues;
}

function checkIconsGuideStructure(file, text) {
  if (!file.includes('icons-content')) return [];
  const issues = [];
  if (!text.includes('btn__icon') || !text.includes('field__icon')) {
    issues.push({
      file,
      line: 0,
      snippet: 'icons guide must document btn__icon and field__icon slots',
      rule: 'icons-guide',
    });
  }
  if (!text.includes('Phosphor') || !text.includes('aria-hidden')) {
    issues.push({
      file,
      line: 0,
      snippet: 'icons guide must cover Phosphor example and aria-hidden',
      rule: 'icons-guide',
    });
  }
  if (!text.includes('currentColor')) {
    issues.push({
      file,
      line: 0,
      snippet: 'icons guide must mention currentColor for SVG',
      rule: 'icons-guide',
    });
  }
  return issues;
}

function checkWhatsNewStructure(file, text) {
  if (!file.includes('whats-new-content')) return [];
  const issues = [];
  if (!text.includes('CHANGELOG.md')) {
    issues.push({
      file,
      line: 0,
      snippet: "what's new page must link CHANGELOG.md",
      rule: 'whats-new',
    });
  }
  if (!text.includes('id="migration"') || !text.includes('/patterns')) {
    issues.push({
      file,
      line: 0,
      snippet: "what's new page must cover migration and patterns",
      rule: 'whats-new',
    });
  }
  return issues;
}

function checkIntroDemoStructure(file, text) {
  if (!file.includes('intro-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-intro-showcase')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-intro-showcase demo',
      rule: 'intro-showcase',
    });
  }
  if (!text.includes('choose-path')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing choose-path section',
      rule: 'intro-paths',
    });
  }
  if (!text.includes('href="/docs/a11y"') || !text.includes('href="/docs/customization"')) {
    issues.push({
      file,
      line: 0,
      snippet: 'choose-path must link npm, Sass, and a11y routes',
      rule: 'intro-paths',
    });
  }
  if (text.includes('id="explore"')) {
    issues.push({
      file,
      line: 0,
      snippet: 'remove generic explore section; use choose-path + foundations',
      rule: 'intro-paths',
    });
  }
  if (
    !text.includes('cdn.jsdelivr.net/npm/pimentcss-design-system') &&
    !text.includes('NPM_CDN_JSdelivr')
  ) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing CDN quick start snippet',
      rule: 'intro-cdn',
    });
  }
  return issues;
}

function checkLoaderDemoStructure(file, text) {
  if (!file.includes('loader-content')) return [];
  const issues = [];
  if (!text.includes('ds-matrix--loader')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing ds-matrix--loader layout',
      rule: 'loader-matrix',
    });
  }
  if (!text.includes('loader--primary') || !text.includes('loader--secondary')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing loader primary/secondary variants',
      rule: 'loader-variants',
    });
  }
  if (!text.includes('loader__dot')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing loader__dot markup',
      rule: 'loader-dots',
    });
  }
  if (!text.includes('data-loader-live')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing data-loader-live in-context demo',
      rule: 'loader-live',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'loader sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'loader-pdoc-demo',
    });
  }
  return issues;
}

function checkSnackbarDemoStructure(file, text) {
  if (!file.includes('snackbar-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-snackbar-grid')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-snackbar-grid layout',
      rule: 'snackbar-grid-layout',
    });
  }
  if (
    !text.includes('snackbar--brand') ||
    !text.includes('snackbar--information') ||
    !text.includes('snackbar--error')
  ) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing snackbar semantic variants',
      rule: 'snackbar-variants',
    });
  }
  if (!text.includes('data-snackbars-live')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing data-snackbars-live wiring',
      rule: 'snackbar-live-wiring',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'snackbar sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'snackbar-pdoc-demo',
    });
  }
  return issues;
}

/** Modals page: dialog overlay demos. */
function checkModalsDemoStructure(file, text) {
  if (!file.includes('modals-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-modal-lab')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-modal-lab layout',
      rule: 'modals-lab-layout',
    });
  }
  if (!text.includes('data-modal-live') || !/role="dialog"[\s\S]*?aria-modal="true"/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing modal dialog demo (data-modal-live, role=dialog)',
      rule: 'modals-dialog-demo',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'modals sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'modals-pdoc-demo',
    });
  }
  return issues;
}

/** Cards page: showcase grid + elevated card in pdoc-demo wrappers. */
function checkCardsDemoStructure(file, text) {
  if (!file.includes('cards-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-cards-showcase')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-cards-showcase layout',
      rule: 'cards-showcase-layout',
    });
  }
  if (!text.includes('card--copy') || !text.includes('card--newsletter') || !text.includes('card--blank')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing copy / newsletter / blank card variants',
      rule: 'cards-variants',
    });
  }
  if (!text.includes('pdoc-cards-media-matrix') || !text.includes('media--1-1') || !text.includes('card--horizontal')) {
    issues.push({
      file,
      line: 0,
      snippet: 'cards page missing media ratio matrix or horizontal layout',
      rule: 'cards-media-ratios',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'cards sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'cards-pdoc-demo',
    });
  }
  return issues;
}

/** Placeholder page: copy blocks + media ratios in pdoc-demo wrappers. */
function checkPlaceholderDemoStructure(file, text) {
  if (!file.includes('placeholder-content')) return [];
  const issues = [];
  if (!text.includes('pdoc-placeholder-copy-blocks')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-placeholder-copy-blocks layout',
      rule: 'placeholder-copy-layout',
    });
  }
  if (!text.includes('pdoc-media-ratios')) {
    issues.push({
      file,
      line: 0,
      snippet: 'missing pdoc-media-ratios layout',
      rule: 'placeholder-media-layout',
    });
  }
  if (!/data-pdoc-demo[\s\S]*?pdoc-demo__preview/.test(text)) {
    issues.push({
      file,
      line: 0,
      snippet: 'placeholder sections missing pdoc-demo / pdoc-demo__preview',
      rule: 'placeholder-pdoc-demo',
    });
  }
  return issues;
}

/** Live tab demos: each tab must declare which panel it controls. */
function checkTabsAriaControls(file, text) {
  if (!file.includes('tabs-content')) return [];
  if (!text.includes('data-tabs-live')) return [];
  if (/data-tabs-live[\s\S]*?role="tab"[\s\S]*?aria-controls=/.test(text)) {
    return [];
  }
  return [
    {
      file,
      line: 0,
      snippet: 'data-tabs-live block missing aria-controls on role="tab"',
      rule: 'tabs-aria-controls',
    },
  ];
}

/** Hand-written icon markup in doc strings must hide icons from assistive tech. */
function checkPhAriaHidden(file, text) {
  if (file.endsWith('icon.ts')) return [];
  const issues = [];
  const re = /<i class="ph[^>]*>/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[0].includes('aria-hidden')) continue;
    const line = text.slice(0, m.index).split('\n').length;
    issues.push({ file, line, snippet: m[0].slice(0, 100), rule: 'ph-aria-hidden' });
  }
  return issues;
}

function main() {
  let failed = false;

  const loader = join(root, '.agents', 'skills', 'impeccable', 'scripts', 'load-context.mjs');
  if (existsSync(loader)) {
    const r = spawnSync(process.execPath, [loader], { cwd: root, encoding: 'utf8' });
    if (r.status !== 0) {
      console.error('✗ load-context.mjs failed');
      failed = true;
    } else {
      const data = JSON.parse(r.stdout);
      if (!data.hasProduct || !data.hasDesign) {
        console.error('✗ Impeccable context incomplete (need PRODUCT.md and DESIGN.md at repo root)');
        failed = true;
      } else {
        console.log(`✓ Impeccable context loaded from ${data.contextDir}`);
      }
    }
  }

  const files = [...SCAN_FILES];
  for (const dir of SCAN_DIRS) files.push(...walk(dir));

  const emDashIssues = [];
  const snippetTabIssues = [];
  const phIssues = [];
  const mutedIssues = [];
  const dropdownA11yIssues = [];
  const tabsA11yIssues = [];
  const tabsStructureIssues = [];
  const paginationStructureIssues = [];
  const anchorStructureIssues = [];
  const anchorFocusRoomIssues = [];
  const carouselStructureIssues = [];
  const carouselFocusRoomIssues = [];
  const tableStructureIssues = [];
  const tableResponsiveCssIssues = [];
  const treeStructureIssues = [];
  const treeFocusRoomIssues = [];
  const treeScssHiddenIssues = checkTreeHiddenScss(root);
  const badgeStructureIssues = [];
  const tagsStructureIssues = [];
  const tagsFocusRoomIssues = [];
  const keylineStructureIssues = [];
  const placeholderStructureIssues = [];
  const alertsStructureIssues = [];
  const modalsStructureIssues = [];
  const cardsStructureIssues = [];
  const snackbarStructureIssues = [];
  const progressStructureIssues = [];
  const loaderStructureIssues = [];
  const slotsLayoutsStructureIssues = [];
  const a11yStructureIssues = [];
  const buttonsStructureIssues = [];
  const introStructureIssues = [];
  const patternsHubIssues = [];
  const whatsNewIssues = [];
  const iconsGuideIssues = [];
  const invalidButtonClassIssues = [];
  const duplicateLeadIssues = [];
  const docCssPath = join(root, 'docs-site', 'src', 'styles', 'doc.css');
  for (const file of files) {
    if (file.includes('impeccable-doc-lint')) continue;
    const rel = relative(root, file).replace(/\\/g, '/');
    const text = readFileSync(file, 'utf8');
    emDashIssues.push(...checkEmDash(rel, text));
    snippetTabIssues.push(...checkSnippetTabs(rel, text));
    phIssues.push(...checkPhAriaHidden(rel, text));
    mutedIssues.push(...checkTextMutedInline(rel, text));
    dropdownA11yIssues.push(...checkDropdownAriaControls(rel, text));
    tabsA11yIssues.push(...checkTabsAriaControls(rel, text));
    tabsStructureIssues.push(
      ...checkDsMatrixRole(rel, text),
      ...checkTabsMatrixCells(rel, text),
      ...checkTabsMatrixNoFocusClass(rel, text),
      ...checkTabsPanelsInContainer(rel, text),
    );
    paginationStructureIssues.push(
      ...checkDsMatrixRole(rel, text),
      ...checkPaginationMatrixCells(rel, text),
      ...checkPaginationMatrixNoFocusClass(rel, text),
    );
    anchorStructureIssues.push(
      ...checkDsMatrixRole(rel, text),
      ...checkAnchorMatrixCells(rel, text),
      ...checkAnchorMatrixNoFocusClass(rel, text),
    );
    carouselStructureIssues.push(
      ...checkDsMatrixRole(rel, text),
      ...checkCarouselMatrixCells(rel, text),
      ...checkCarouselMatrixNoFocusClass(rel, text),
      ...checkCarouselLiveA11y(rel, text),
      ...checkCarouselScrollbarLab(rel, text),
    );
    tableStructureIssues.push(...checkTableResponsiveA11y(rel, text));
    treeStructureIssues.push(
      ...checkTreeMatrixCells(rel, text),
      ...checkTreeMatrixNoFocusClass(rel, text),
      ...checkTreeLiveA11y(rel, text),
      ...checkTreeCollapsedHidden(rel, text),
    );
    badgeStructureIssues.push(...checkBadgeDotA11y(rel, text), ...checkBadgeDemoStructure(rel, text));
    tagsStructureIssues.push(
      ...checkTagsMatrixCells(rel, text),
      ...checkTagsMatrixNoFocusClass(rel, text),
      ...checkTagsLiveA11y(rel, text),
    );
    keylineStructureIssues.push(...checkKeylineDivA11y(rel, text), ...checkKeylineDemoStructure(rel, text));
    placeholderStructureIssues.push(...checkPlaceholderDemoStructure(rel, text));
    alertsStructureIssues.push(...checkAlertsDemoStructure(rel, text));
    modalsStructureIssues.push(...checkModalsDemoStructure(rel, text));
    cardsStructureIssues.push(...checkCardsDemoStructure(rel, text));
    snackbarStructureIssues.push(...checkSnackbarDemoStructure(rel, text));
    progressStructureIssues.push(...checkProgressDemoStructure(rel, text));
    loaderStructureIssues.push(...checkLoaderDemoStructure(rel, text));
    slotsLayoutsStructureIssues.push(...checkSlotsLayoutsDemoStructure(rel, text));
    a11yStructureIssues.push(...checkA11yDemoStructure(rel, text));
    buttonsStructureIssues.push(
      ...checkButtonsDemoStructure(rel, text),
      ...checkButtonsMatrixNoFocusClass(rel, text),
    );
    introStructureIssues.push(...checkIntroDemoStructure(rel, text));
    patternsHubIssues.push(...checkPatternsHubStructure(rel, text));
    whatsNewIssues.push(...checkWhatsNewStructure(rel, text));
    iconsGuideIssues.push(...checkIconsGuideStructure(rel, text));
    invalidButtonClassIssues.push(...checkInvalidButtonClasses(rel, text));
    duplicateLeadIssues.push(...checkDuplicatePdocLead(rel, text));
  }
  if (existsSync(docCssPath)) {
    const rel = relative(root, docCssPath).replace(/\\/g, '/');
    const docCss = readFileSync(docCssPath, 'utf8');
    anchorFocusRoomIssues.push(...checkAnchorMatrixFocusRoom(rel, docCss));
    carouselFocusRoomIssues.push(...checkCarouselMatrixFocusRoom(rel, docCss));
    tableResponsiveCssIssues.push(...checkTableResponsiveCss(rel, docCss));
    treeFocusRoomIssues.push(...checkTreeMatrixFocusRoom(rel, docCss));
    tagsFocusRoomIssues.push(...checkTagsMatrixFocusRoom(rel, docCss));
  }

  if (snippetTabIssues.length) {
    failed = true;
    console.error(`\n✗ ${snippetTabIssues.length} tab(s) in doc snippet sources:\n`);
    for (const { file, line, snippet, rule } of snippetTabIssues.slice(0, 30)) {
      console.error(`  ${file}:${line} [${rule}] ${snippet}`);
    }
    if (snippetTabIssues.length > 30) console.error(`  … +${snippetTabIssues.length - 30} more`);
  } else {
    console.log('✓ Doc snippet sources use spaces (no tab characters)');
  }

  if (emDashIssues.length) {
    failed = true;
    console.error(`\n✗ ${emDashIssues.length} em dash (—) in documentation (Impeccable copy rule):\n`);
    for (const { file, line, snippet } of emDashIssues.slice(0, 30)) {
      console.error(`  ${file}:${line} ${snippet}`);
    }
    if (emDashIssues.length > 30) console.error(`  … +${emDashIssues.length - 30} more`);
  } else {
    console.log(`✓ No em dashes in ${files.length} documentation source files`);
  }

  if (phIssues.length) {
    failed = true;
    console.error(`\n✗ ${phIssues.length} Phosphor <i> without aria-hidden="true":\n`);
    for (const { file, line, snippet } of phIssues.slice(0, 30)) {
      console.error(`  ${file}:${line} ${snippet}`);
    }
    if (phIssues.length > 30) console.error(`  … +${phIssues.length - 30} more`);
  } else {
    console.log('✓ Decorative doc icons include aria-hidden');
  }

  if (mutedIssues.length) {
    failed = true;
    console.error(`\n✗ ${mutedIssues.length} inline var(--text-muted) in documentation (use .pdoc-text-muted):\n`);
    for (const { file, line, snippet } of mutedIssues.slice(0, 30)) {
      console.error(`  ${file}:${line} ${snippet}`);
    }
    if (mutedIssues.length > 30) console.error(`  … +${mutedIssues.length - 30} more`);
  } else {
    console.log('✓ No inline --text-muted in documentation sources');
  }

  if (dropdownA11yIssues.length) {
    failed = true;
    console.error(`\n✗ ${dropdownA11yIssues.length} live dropdown missing aria-controls:\n`);
    for (const { file, snippet } of dropdownA11yIssues) {
      console.error(`  ${file} ${snippet}`);
    }
  } else {
    console.log('✓ Live dropdown markup includes aria-controls');
  }

  if (tabsA11yIssues.length) {
    failed = true;
    console.error(`\n✗ ${tabsA11yIssues.length} live tabs missing aria-controls:\n`);
    for (const { file, snippet } of tabsA11yIssues) {
      console.error(`  ${file} ${snippet}`);
    }
  } else {
    console.log('✓ Live tabs markup includes aria-controls');
  }

  if (tabsStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${tabsStructureIssues.length} tabs page structure issue(s):\n`);
    for (const { file, snippet, rule } of tabsStructureIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Tabs page structure (matrix cells, panels, focus preview)');
  }

  if (paginationStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${paginationStructureIssues.length} pagination page structure issue(s):\n`);
    for (const { file, snippet, rule } of paginationStructureIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Pagination page structure (matrix cells, focus preview)');
  }

  if (anchorStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${anchorStructureIssues.length} anchor page structure issue(s):\n`);
    for (const { file, snippet, rule } of anchorStructureIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Anchor page structure (matrix cells, focus preview)');
  }

  if (anchorFocusRoomIssues.length) {
    failed = true;
    console.error(`\n✗ ${anchorFocusRoomIssues.length} anchor matrix focus clip guard issue(s):\n`);
    for (const { file, snippet, rule } of anchorFocusRoomIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Anchor matrix focus ring not clipped in doc demos');
  }

  if (carouselStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${carouselStructureIssues.length} carousel page structure issue(s):\n`);
    for (const { file, snippet, rule } of carouselStructureIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Carousel page structure (matrix cells, focus preview)');
  }

  if (carouselFocusRoomIssues.length) {
    failed = true;
    console.error(`\n✗ ${carouselFocusRoomIssues.length} carousel matrix focus clip guard issue(s):\n`);
    for (const { file, snippet, rule } of carouselFocusRoomIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Carousel matrix focus ring not clipped in doc demos');
  }

  if (tableStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${tableStructureIssues.length} table page structure issue(s):\n`);
    for (const { file, snippet, rule } of tableStructureIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Table page structure (scroll region, headers, mobile cards)');
  }

  if (tableResponsiveCssIssues.length) {
    failed = true;
    console.error(`\n✗ ${tableResponsiveCssIssues.length} table responsive CSS issue(s):\n`);
    for (const { file, snippet, rule } of tableResponsiveCssIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Table responsive doc CSS (scroll vs cards)');
  }

  if (treeStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${treeStructureIssues.length} tree page structure issue(s):\n`);
    for (const { file, snippet, rule } of treeStructureIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Tree page structure (matrix cells, live tree a11y)');
  }

  if (treeFocusRoomIssues.length) {
    failed = true;
    console.error(`\n✗ ${treeFocusRoomIssues.length} tree matrix focus clip guard issue(s):\n`);
    for (const { file, snippet, rule } of treeFocusRoomIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Tree matrix focus ring not clipped in doc demos');
  }

  if (treeScssHiddenIssues.length) {
    failed = true;
    console.error(`\n✗ ${treeScssHiddenIssues.length} tree [hidden] SCSS guard issue(s):\n`);
    for (const { file, snippet, rule } of treeScssHiddenIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Tree SCSS respects [hidden] on .tree__group');
  }

  if (badgeStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${badgeStructureIssues.length} badge page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of badgeStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Badge page structure (dot labels, doc demos)');
  }

  if (tagsStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${tagsStructureIssues.length} tags page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of tagsStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Tags page structure (matrix cells, live aria-pressed)');
  }

  if (tagsFocusRoomIssues.length) {
    failed = true;
    console.error(`\n✗ ${tagsFocusRoomIssues.length} tags matrix focus clip guard issue(s):\n`);
    for (const { file, snippet, rule } of tagsFocusRoomIssues) {
      console.error(`  ${file} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Tags matrix focus ring not clipped in doc demos');
  }

  if (keylineStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${keylineStructureIssues.length} keyline page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of keylineStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Keyline page structure (decorative divs, doc demos)');
  }

  if (placeholderStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${placeholderStructureIssues.length} placeholder page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of placeholderStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Placeholder page structure (copy blocks, media ratios, doc demos)');
  }

  if (alertsStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${alertsStructureIssues.length} alerts page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of alertsStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Alerts page structure (stack, dismiss, dialog, doc demos)');
  }

  if (modalsStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${modalsStructureIssues.length} modals page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of modalsStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Modals page structure (dialog overlay, doc demos)');
  }

  if (cardsStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${cardsStructureIssues.length} cards page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of cardsStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Cards page structure (showcase variants, elevated card, doc demos)');
  }

  if (snackbarStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${snackbarStructureIssues.length} snackbar page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of snackbarStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Snackbar page structure (variants grid, dismiss, auto-dismiss, doc demos)');
  }

  if (progressStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${progressStructureIssues.length} progress page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of progressStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Progress page structure (linear, labeled bars, circles, live demo)');
  }

  if (loaderStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${loaderStructureIssues.length} loader page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of loaderStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Loader page structure (matrix, in-context live demo)');
  }

  if (slotsLayoutsStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${slotsLayoutsStructureIssues.length} slots-layouts page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of slotsLayoutsStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Slots & layouts page structure (slot, column, row, blank card)');
  }

  if (a11yStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${a11yStructureIssues.length} accessibility guide page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of a11yStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Accessibility guide page structure (focus, touch, contrast swatches)');
  }

  if (buttonsStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${buttonsStructureIssues.length} buttons page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of buttonsStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Buttons page structure (variant matrix, icon-only, doc demos)');
  }

  if (introStructureIssues.length) {
    failed = true;
    console.error(`\n✗ ${introStructureIssues.length} introduction page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of introStructureIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Introduction page structure (showcase, paths, CDN)');
  }

  if (patternsHubIssues.length) {
    failed = true;
    console.error(`\n✗ ${patternsHubIssues.length} patterns hub structure issue(s):\n`);
    for (const { file, snippet, rule, line } of patternsHubIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Patterns hub links recipes and slots');
  }

  if (whatsNewIssues.length) {
    failed = true;
    console.error(`\n✗ ${whatsNewIssues.length} what's new page structure issue(s):\n`);
    for (const { file, snippet, rule, line } of whatsNewIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log("✓ What's new page links changelog and migration");
  }

  if (iconsGuideIssues.length) {
    failed = true;
    console.error(`\n✗ ${iconsGuideIssues.length} icons guide structure issue(s):\n`);
    for (const { file, snippet, rule, line } of iconsGuideIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Icons guide documents slots, Phosphor example, and a11y');
  }

  if (invalidButtonClassIssues.length) {
    failed = true;
    console.error(`\n✗ ${invalidButtonClassIssues.length} invalid button class in documentation:\n`);
    for (const { file, snippet, rule, line } of invalidButtonClassIssues) {
      const loc = line ? `${file}:${line}` : file;
      console.error(`  ${loc} [${rule}] ${snippet}`);
    }
  } else {
    console.log('✓ Button variants in docs match PimentCSS API (primary, outline, transparent)');
  }

  if (duplicateLeadIssues.length) {
    failed = true;
    console.error(`\n✗ ${duplicateLeadIssues.length} duplicate pdoc-lead in content:\n`);
    for (const { file, snippet } of duplicateLeadIssues) {
      console.error(`  ${file} ${snippet}`);
    }
  } else {
    console.log('✓ No duplicate pdoc-lead in content sources');
  }

  process.exit(failed ? 1 : 0);
}

main();
