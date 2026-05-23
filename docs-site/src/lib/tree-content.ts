import { pdocSnippet, pdocSteps } from './pdoc-html';
import { TREE_REFERENCE_JS } from './tree-behavior';
import { ph } from './icon';

const TOGGLE_ICON = ph('caret-right', 20, 'tree__toggle-icon');

/** Phosphor icon names for tree file kinds. */
type TreeGlyph = 'house' | 'folder' | 'image' | 'video' | 'file-pdf' | 'file-text' | 'file-zip';

type FileKind = 'folder' | 'image' | 'video' | 'pdf' | 'text' | 'archive';

const ICON_BY_FILE_KIND: Record<FileKind, TreeGlyph> = {
  folder: 'folder',
  image: 'image',
  video: 'video',
  pdf: 'file-pdf',
  text: 'file-text',
  archive: 'file-zip',
};

function treeIconGlyph(glyph: TreeGlyph): string {
  return `<span class="tree__icon" aria-hidden="true">${ph(glyph, 20)}</span>`;
}

function treeIconForKind(kind: FileKind): string {
  return treeIconGlyph(ICON_BY_FILE_KIND[kind]);
}

function fileLeafRow(label: string, kind: FileKind): string {
  return `<div class="tree__row tree__row--level-3">
                          <span class="tree__toggle-spacer" aria-hidden="true"></span>
                          <button type="button" class="tree__content">
                            ${treeIconForKind(kind)}
                            <span class="tree__label">${label}</span>
                          </button>
                        </div>`;
}

const FILE_ICON_GUIDE = `<div class="pdoc-table-wrap pdoc-tree-file-icons">
          <table class="pdoc-api">
            <thead>
              <tr><th>Extensions (examples)</th><th>Library icon</th><th>Usage</th></tr>
            </thead>
            <tbody>
              <tr><td><code>.png</code>, <code>.jpg</code>, <code>.webp</code></td><td><code>ph-image</code></td><td>${treeIconForKind('image')} <span class="pdoc-text-muted">Raster image</span></td></tr>
              <tr><td><code>.mp4</code>, <code>.mov</code></td><td><code>ph-video</code></td><td>${treeIconForKind('video')} <span class="pdoc-text-muted">Video</span></td></tr>
              <tr><td><code>.pdf</code></td><td><code>ph-file-pdf</code></td><td>${treeIconForKind('pdf')} <span class="pdoc-text-muted">PDF / document</span></td></tr>
              <tr><td><code>.txt</code>, <code>.md</code></td><td><code>ph-file-text</code></td><td>${treeIconForKind('text')} <span class="pdoc-text-muted">Plain text</span></td></tr>
              <tr><td><code>.zip</code>, archives</td><td><code>ph-file-zip</code></td><td>${treeIconForKind('archive')} <span class="pdoc-text-muted">Bundle</span></td></tr>
              <tr><td>Folders</td><td><code>ph-folder</code></td><td>${treeIconForKind('folder')} <span class="pdoc-text-muted">Directory</span></td></tr>
            </tbody>
          </table>
        </div>`;

type ToggleOpts = {
  open?: boolean;
  hover?: boolean;
  focus?: boolean;
  label?: string;
  matrixStatic?: boolean;
  controls?: string;
};

function treeToggle(opts: ToggleOpts = {}): string {
  const className = [
    'tree__toggle',
    opts.open ? 'tree__toggle--open' : '',
    opts.hover ? 'tree__toggle--hover' : '',
    opts.focus ? 'tree__toggle--focus' : '',
  ]
    .filter(Boolean)
    .join(' ');
  if (opts.matrixStatic) {
    return `<button type="button" class="${className}" aria-hidden="true" tabindex="-1">${TOGGLE_ICON}</button>`;
  }
  const expanded = opts.open ? 'true' : 'false';
  const label = opts.label ?? 'Expand section';
  const controls = opts.controls ? ` aria-controls="${opts.controls}"` : '';
  return `<button type="button" class="${className}" aria-expanded="${expanded}" aria-label="${label}"${controls}>${TOGGLE_ICON}</button>`;
}

type RowOpts = {
  selected?: boolean;
  toggleHover?: boolean;
  contentHover?: boolean;
  contentFocus?: boolean;
  label?: string;
  glyph?: TreeGlyph;
  level2?: boolean;
  leaf?: boolean;
  matrixStatic?: boolean;
};

function treeRow(opts: RowOpts = {}): string {
  const rowClass = [
    'tree__row',
    opts.level2 ? 'tree__row--level-2' : '',
    opts.leaf ? 'tree__row--level-3' : '',
    opts.selected ? 'tree__row--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const contentClass = [
    'tree__content',
    opts.contentHover ? 'tree__content--hover' : '',
    opts.contentFocus ? 'tree__content--focus' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const label = opts.label ?? 'Tree item';
  const glyph = opts.glyph ?? 'home-01';
  const ariaCurrent = opts.selected ? ' aria-current="true"' : '';
  const toggle = opts.leaf
    ? '<span class="tree__toggle-spacer" aria-hidden="true"></span>'
    : treeToggle({
        hover: opts.toggleHover,
        matrixStatic: opts.matrixStatic,
      });
  return `<div class="${rowClass}">
              ${toggle}
              <button type="button" class="${contentClass}"${ariaCurrent}>
                ${treeIconGlyph(glyph)}
                <span class="tree__label">${label}</span>
              </button>
            </div>`;
}

function matrixCell(html: string): string {
  return `<div class="ds-matrix__cell">${html}</div>`;
}

function matrixRow(rowLabel: string, cells: RowOpts[]): string {
  return `<div class="ds-matrix__row">${rowLabel}</div>
            ${cells.map((c) => matrixCell(treeRow({ ...c, matrixStatic: true }))).join('\n            ')}`;
}

const TOGGLE_INDICATORS = `<div class="pdoc-tree-indicators" role="group" aria-label="Expand/collapse toggle states">
              <figure class="pdoc-tree-indicators__figure">
                ${treeToggle({ label: 'Expand section' })}
                <figcaption class="body-small pdoc-text-muted">Closed</figcaption>
              </figure>
              <figure class="pdoc-tree-indicators__figure">
                ${treeToggle({ open: true, label: 'Collapse section' })}
                <figcaption class="body-small pdoc-text-muted">Open</figcaption>
              </figure>
              <figure class="pdoc-tree-indicators__figure">
                ${treeToggle({ hover: true, label: 'Expand section' })}
                <figcaption class="body-small pdoc-text-muted">Hover / closed</figcaption>
              </figure>
              <figure class="pdoc-tree-indicators__figure">
                ${treeToggle({ open: true, hover: true, label: 'Collapse section' })}
                <figcaption class="body-small pdoc-text-muted">Hover / open</figcaption>
              </figure>
            </div>`;

const L1_MATRIX = `<div class="ds-matrix ds-matrix--tree" role="group" aria-label="Level 1 tree row states">
            <div></div>
            <div class="ds-matrix__head">Default</div>
            <div class="ds-matrix__head">Hover</div>
            <div class="ds-matrix__head">Focus</div>
            ${matrixRow('Unselected', [
              {},
              { toggleHover: true, contentHover: true },
              { contentFocus: true },
            ])}
            ${matrixRow('Selected', [
              { selected: true },
              { selected: true, toggleHover: true, contentHover: true },
              { selected: true, contentFocus: true },
            ])}
          </div>`;

const LEVELS_TREE = `<ul class="tree pdoc-tree-levels-tree" role="tree" data-tree-live aria-label="Indentation example">
              <li role="treeitem" aria-expanded="true">
                <div class="tree__row">
                  ${treeToggle({ open: true, label: 'Collapse Workspace', controls: 'pdoc-tree-levels-group' })}
                  <button type="button" class="tree__content" aria-current="true">
                    ${`<span class="tree__icon" aria-hidden="true">${ph('house', 20)}</span>`}
                    <span class="tree__label">Workspace</span>
                  </button>
                </div>
                <ul class="tree__group" id="pdoc-tree-levels-group" role="group">
                  <li role="treeitem" aria-expanded="true">
                    <div class="tree__row tree__row--level-2">
                      ${treeToggle({ open: true, label: 'Collapse Assets', controls: 'pdoc-tree-levels-assets' })}
                      <button type="button" class="tree__content">
                        ${treeIconForKind('folder')}
                        <span class="tree__label">Assets</span>
                      </button>
                    </div>
                    <ul class="tree__group" id="pdoc-tree-levels-assets" role="group">
                      <li role="treeitem">${fileLeafRow('logo.png', 'image')}</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>`;

const LIVE_TREE = `<ul class="tree pdoc-tree-demo" role="tree" data-tree-live aria-label="Project files">
              <li role="treeitem" aria-expanded="true" id="pdoc-tree-workspace">
                <div class="tree__row tree__row--selected">
                  ${treeToggle({
                    open: true,
                    label: 'Collapse Workspace',
                    controls: 'pdoc-tree-group-workspace',
                  })}
                  <button type="button" class="tree__content" aria-current="true">
                    ${`<span class="tree__icon" aria-hidden="true">${ph('house', 20)}</span>`}
                    <span class="tree__label">Workspace</span>
                  </button>
                </div>
                <ul class="tree__group" id="pdoc-tree-group-workspace" role="group">
                  <li role="treeitem" aria-expanded="true" id="pdoc-tree-assets">
                    <div class="tree__row tree__row--level-2">
                      ${treeToggle({
                        open: true,
                        label: 'Collapse Assets',
                        controls: 'pdoc-tree-group-assets',
                      })}
                      <button type="button" class="tree__content">
                        ${treeIconForKind('folder')}
                        <span class="tree__label">Assets</span>
                      </button>
                    </div>
                    <ul class="tree__group" id="pdoc-tree-group-assets" role="group">
                      <li role="treeitem">${fileLeafRow('logo.png', 'image')}</li>
                      <li role="treeitem">${fileLeafRow('hero.jpg', 'image')}</li>
                      <li role="treeitem">${fileLeafRow('intro.mp4', 'video')}</li>
                    </ul>
                  </li>
                  <li role="treeitem" aria-expanded="true" id="pdoc-tree-docs">
                    <div class="tree__row tree__row--level-2">
                      ${treeToggle({
                        open: true,
                        label: 'Collapse Documentation',
                        controls: 'pdoc-tree-group-docs',
                      })}
                      <button type="button" class="tree__content">
                        ${treeIconForKind('folder')}
                        <span class="tree__label">Documentation</span>
                      </button>
                    </div>
                    <ul class="tree__group" id="pdoc-tree-group-docs" role="group">
                      <li role="treeitem">${fileLeafRow('guide.pdf', 'pdf')}</li>
                      <li role="treeitem">${fileLeafRow('readme.txt', 'text')}</li>
                      <li role="treeitem">${fileLeafRow('changelog.md', 'text')}</li>
                    </ul>
                  </li>
                  <li role="treeitem" aria-expanded="false" id="pdoc-tree-archive">
                    <div class="tree__row tree__row--level-2">
                      ${treeToggle({
                        label: 'Expand Archive',
                        controls: 'pdoc-tree-group-archive',
                      })}
                      <button type="button" class="tree__content">
                        ${treeIconForKind('folder')}
                        <span class="tree__label">Archive</span>
                      </button>
                    </div>
                    <ul class="tree__group" id="pdoc-tree-group-archive" role="group" hidden>
                      <li role="treeitem">${fileLeafRow('2024-backup.zip', 'archive')}</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>`;

export function buildTreePageHtml(): string {
  return `
        <p>Styles live in <code>scss/components/_tree.scss</code>. A tree is a nested <code>&lt;ul class="tree"&gt;</code> with <code>role="tree"</code>, expandable folders, and file rows. The component is narrow by default (150px); widen it in your layout when labels are longer.</p>

        <h2 id="tree-toggle">Expand/collapse toggle</h2>
        <p><code>.tree__toggle</code> is a 24px round control with a 16px chevron. Add <code>.tree__toggle--open</code> to rotate the arrow. Use <code>aria-expanded</code> and <code>aria-controls</code> on the button, and toggle the <code>hidden</code> attribute on the matching <code>.tree__group</code>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${TOGGLE_INDICATORS}
          </div>
        </div>

        <h2 id="tree-items">Level 1 row states</h2>
        <p>Each row is a flex line: toggle + <code>.tree__content</code> (16px icon in a 20px slot + label). Selected rows use <code>.tree__row--selected</code> and <code>aria-current="true"</code> on the label button.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${L1_MATRIX}
          </div>
        </div>

        <h2 id="tree-levels">Levels 2 and 3 (live)</h2>
        <p><code>.tree__row--level-2</code> indents folders. Files at level 3 use <code>.tree__row--level-3</code> and a <code>.tree__toggle-spacer</code> so the label aligns with folder rows. This mini tree is interactive (<code>data-tree-live</code>).</p>
        <div class="pdoc-callout pdoc-callout--tip">
          <p class="body-small mb-0">Click the chevrons to expand/collapse, and a row label to select it.</p>
        </div>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-tree-demo-wrap">
            ${LEVELS_TREE}
          </div>
        </div>

        <h2 id="tree-file-icons">File type icons</h2>
        <p>PimentCSS does not ship icons. In this doc we use <strong>Phosphor</strong> (<code>ph-image</code>, <code>ph-file-pdf</code>, etc.): pick one glyph per media type and reuse it for every matching extension.</p>
        ${FILE_ICON_GUIDE}

        <h2 id="tree-live">File tree (interactive)</h2>
        <p>Example with folders and mixed files. Chevrons expand branches; clicking a name selects that row. Production apps should add keyboard support per the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/">ARIA treeview pattern</a>.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-tree-demo-wrap">
            ${LIVE_TREE}
          </div>
        </div>
        ${pdocSnippet(
          `<ul class="tree" role="tree" data-tree-live aria-label="Files">
  <li role="treeitem" aria-expanded="false">
    <div class="tree__row">
      <button type="button" class="tree__toggle" aria-expanded="false" aria-controls="group-a" aria-label="Expand Assets">…</button>
      <button type="button" class="tree__content">
        <span class="tree__icon" aria-hidden="true">…</span>
        <span class="tree__label">Assets</span>
      </button>
    </div>
    <ul class="tree__group" id="group-a" role="group" hidden>
      <li role="treeitem">
        <div class="tree__row tree__row--level-3">
          <span class="tree__toggle-spacer" aria-hidden="true"></span>
          <button type="button" class="tree__content">…</button>
        </div>
      </li>
    </ul>
  </li>
</ul>`,
          'tree.html',
          'html',
        )}

        <h2 id="tree-js">JavaScript</h2>
        ${pdocSnippet(TREE_REFERENCE_JS, 'tree.js', 'javascript')}

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.tree</code></td><td>Root list (column, max-width 150px by default)</td></tr>
              <tr><td><code>.tree__group</code></td><td>Nested <code>ul</code> for children</td></tr>
              <tr><td><code>.tree__row</code></td><td>Horizontal row (toggle + content)</td></tr>
              <tr><td><code>.tree__row--level-2</code></td><td>16px left inset for nested folders</td></tr>
              <tr><td><code>.tree__row--level-3</code></td><td>16px inset + <code>.tree__toggle-spacer</code> (aligns with folder row)</td></tr>
              <tr><td><code>.tree__toggle-spacer</code></td><td>Empty slot when a row has no toggle (files)</td></tr>
              <tr><td><code>.tree__row--selected</code></td><td>Selected row</td></tr>
              <tr><td><code>.tree__toggle</code></td><td>24px expand/collapse control</td></tr>
              <tr><td><code>.tree__toggle--open</code></td><td>Chevron rotated 90°</td></tr>
              <tr><td><code>.tree__content</code></td><td>Label button (icon + text)</td></tr>
              <tr><td><code>.tree__icon</code></td><td>20px slot, 16px icon</td></tr>
              <tr><td><code>.tree__label</code></td><td>Truncated label text</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'tree-tokens',
            title: 'Tree spacing',
            body: 'Adjust indentation and icon sizes. Override max-width on .tree in your app if filenames are long.',
            code: `@use "pimentcss-design-system" with (
  $tree-level-2-pl: 1rem,
  $tree-level-3-pl: 1rem,
  $tree-icon-size: 1.25rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'tree-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _tree.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Tree widget</p>
          <ul>
            <li><strong>Roles</strong>, root <code>role="tree"</code>, items <code>role="treeitem"</code>, child lists <code>role="group"</code>.</li>
            <li><strong>Expand</strong>, set <code>aria-expanded</code> on the toggle and matching <code>treeitem</code>; hide collapsed groups with the <code>hidden</code> attribute.</li>
            <li><strong>Controls</strong>, link toggle to its group with <code>aria-controls</code> + stable <code>id</code> on <code>.tree__group</code>.</li>
            <li><strong>Selection</strong>, expose the current node with <code>aria-current="true"</code> on <code>.tree__content</code> (single-select side nav).</li>
            <li><strong>Keyboard</strong>, for production apps follow the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/">ARIA treeview pattern</a> (arrows, Home/End); the doc demo uses pointer interaction only.</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/list"><p class="pdoc-card__title">Lists</p><p class="pdoc-card__desc">Linear steps without nesting.</p></a>
          <a class="pdoc-card" href="/docs/navigation"><p class="pdoc-card__title">Navigation</p><p class="pdoc-card__desc">Top-level nav items.</p></a>
          <a class="pdoc-card" href="/docs/badge"><p class="pdoc-card__title">Badges</p><p class="pdoc-card__desc">Compact status labels.</p></a>
          <a class="pdoc-card" href="/docs/anchor-inpage-nav"><p class="pdoc-card__title">In-page anchors</p><p class="pdoc-card__desc">Flat section links on long pages.</p></a>
        </div>`;
}
