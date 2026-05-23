/**
 * Regenerates docs-site/src/data/pages.json with English titles/leads from nav.json.
 * Astro page bodies come from docs-site/src/lib/*-content.ts.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'docs-site', 'src', 'data');
const pagesPath = join(dataDir, 'pages.json');
const nav = JSON.parse(readFileSync(join(dataDir, 'nav.json'), 'utf8'));

const LEADS = {
  'index.html': 'OKLCH tokens, live component preview, npm or CDN quick start, and paths to customize or verify accessibility.',
  'installation.html': 'Add PimentCSS via npm, CDN, or Sass compilation.',
  'customization.html': 'Override Sass variables and CSS tokens to match your brand.',
  'colors.html': 'OKLCH palettes with hex fallback, semantic variables, and swatch classes.',
  'typography.html': 'Heading scale, body utilities, and font loading for Zodiak and Plus Jakarta Sans.',
  'layout.html': 'Container, 12-column grid, spacing utilities, and RGAA-friendly layout patterns for light and dark mode.',
  'depth.html': 'Elevation shadows and z-index tokens for cards, overlays, and modals.',
  'theme-toggle.html': 'Light / dark mode control for headers, menus, and settings panels.',
  'icons.html': 'Dimensioned icon slots for any SVG or icon font. Phosphor is used in docs as a reference example only.',
  'whats-new.html': 'Release highlights for PimentCSS v1.0: tokens, components, patterns, documentation, and migration from Piment-Css.',
  'input-fields.html': 'Labels, hints, validation states, and prefix icons for text inputs.',
  'checkboxes-radios-switch.html': 'Selection controls with accessible labels and group semantics.',
  'form.html': 'Vertical form layout with fields, actions, and validation messaging.',
  'date-picker.html': 'Calendar panel, month navigation, and field-group layout.',
  'autocomplete.html': 'Suggest list, keyboard navigation, and combobox patterns.',
  'buttons.html': 'Primary, outline, and transparent variants with icon slots and touch targets.',
  'button-group.html': 'Segmented single-select and optional multi-toggle toolbars.',
  'link-breadcrumb.html': 'Inline links, external trail icons, and breadcrumb navigation.',
  'navigation.html': 'Header nav items, active state, and responsive shell patterns.',
  'menu-dropdown.html': 'Menu lists, dropdown panels, and keyboard-friendly disclosure.',
  'tabs.html': 'Tablist, panels, and arrow-key navigation between tabs.',
  'pagination.html': 'Page controls, ellipsis, and compact table footers.',
  'anchor-inpage-nav.html': 'In-page anchor list with scroll-spy style active states.',
  'carousel.html': 'Scrollable track, arrows, and scrollbar affordances.',
  'table.html': 'Semantic row tables with a horizontal scroll region, plus column stacks and mobile-friendly card patterns.',
  'list.html': 'Stacked list rows with indicators and optional actions.',
  'tree.html': 'Expandable tree groups with toggle buttons and nested items.',
  'badge.html': 'Dot badges, counts, and status labels on inline content.',
  'tags.html': 'Removable tags, filter chips, and pressed toggle states.',
  'keyline.html': 'Horizontal rules and vertical keylines for section separation.',
  'placeholder.html': 'Copy blocks, media ratio placeholders, and skeleton patterns.',
  'alerts.html': 'Inline alerts, dismiss controls, and dialog-style confirmations.',
  'modals.html': 'Modal overlay, focus trap, and action footers.',
  'cards.html': 'Card patterns for Copy, Newsletter signup, Blank slots, media ratios, and elevated panels.',
  'snackbar.html': 'Transient snackbars with actions, auto-dismiss, and progress.',
  'progress.html': 'Linear bars, labeled progress, and circular indicators.',
  'loader.html': 'Spinners and in-context loading states.',
  'patterns.html': 'Short recipes that combine forms, feedback, navigation, and content components into real pages.',
  'pattern-contact-form.html': 'Contact form recipe with fields, consent, and submit actions.',
  'pattern-toolbar-modal.html': 'Toolbar with status alert, button group, and modal task flow.',
  'pattern-table-pagination.html': 'Data table with selection and pagination controls.',
  'slots-layouts.html': 'Slot placeholders and column/row layout grids for wireframes.',
  'a11y.html': 'Focus rings, touch targets, semantic contrast pairs, and reduced motion.',
};

let pages = {};
if (existsSync(pagesPath)) {
  try {
    pages = JSON.parse(readFileSync(pagesPath, 'utf8'));
  } catch {
    pages = {};
  }
}

for (const section of nav.sections) {
  for (const item of section.items) {
    const href = item.href;
    const prev = pages[href] || {};
    pages[href] = {
      ...prev,
      title: prev.title || item.label,
      breadcrumb: prev.breadcrumb || [section.title, item.label],
      lead: LEADS[href] || prev.lead || `${item.label} — PimentCSS component documentation.`,
    };
    delete pages[href].fragment;
  }
}

writeFileSync(pagesPath, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
console.log('✓ docs-site/src/data/pages.json (English, no fragments)');
