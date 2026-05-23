/**
 * Documentation page registry (Astro docs-site).
 * Used by responsive UX tests (mobile / tablet / desktop).
 */
export type DocPage = {
  path: string;
  heading: string;
  /** Selector for a representative visible component */
  componentSelector?: string;
};

export const DOC_PAGES: DocPage[] = [
  {
    path: '/docs',
    heading: 'Introduction',
    componentSelector: '.pdoc-intro-showcase .btn--primary',
  },
  { path: '/docs/whats-new', heading: "What's new" },
  { path: '/docs/installation', heading: 'Installation' },
  { path: '/docs/customization', heading: 'Customization' },
  { path: '/docs/colors', heading: 'Colors', componentSelector: '.palette' },
  { path: '/docs/typography', heading: 'Typography' },
  { path: '/docs/layout', heading: 'Layout' },
  { path: '/docs/depth', heading: 'Depth & shadows', componentSelector: '.pdoc-depth-compare' },
  { path: '/docs/icons', heading: 'Icons', componentSelector: '.pdoc-icons-lab .btn--primary' },
  { path: '/docs/buttons', heading: 'Buttons', componentSelector: '.btn--primary' },
  { path: '/docs/input-fields', heading: 'Input fields', componentSelector: '.field__input' },
  { path: '/docs/menu-dropdown', heading: 'Menu & dropdown', componentSelector: '.menu__item' },
  {
    path: '/docs/checkboxes-radios-switch',
    heading: 'Checkboxes, radios & switches',
    componentSelector: 'label.checkbox',
  },
  { path: '/docs/date-picker', heading: 'Date picker', componentSelector: '.calendar-day' },
  { path: '/docs/autocomplete', heading: 'Autocomplete', componentSelector: '.autocomplete' },
  { path: '/docs/form', heading: 'Form', componentSelector: '.form .field__input' },
  { path: '/docs/keyline', heading: 'Dividers', componentSelector: '.hr' },
  { path: '/docs/tabs', heading: 'Tabs', componentSelector: '.tab' },
  { path: '/docs/button-group', heading: 'Button group', componentSelector: '.btn-group__item' },
  { path: '/docs/pagination', heading: 'Pagination', componentSelector: '.pagination__item' },
  { path: '/docs/carousel', heading: 'Carousel', componentSelector: '.carousel__arrow' },
  { path: '/docs/navigation', heading: 'Navigation', componentSelector: '.nav-item' },
  { path: '/docs/anchor-inpage-nav', heading: 'In-page anchors', componentSelector: '.anchor-item' },
  { path: '/docs/link-breadcrumb', heading: 'Links & breadcrumb', componentSelector: '.breadcrumb' },
  { path: '/docs/alerts', heading: 'Alerts', componentSelector: '.alert' },
  { path: '/docs/table', heading: 'Tables', componentSelector: '.pdoc-table-responsive' },
  { path: '/docs/tags', heading: 'Tags', componentSelector: '.tag' },
  { path: '/docs/loader', heading: 'Loader', componentSelector: '.loader' },
  { path: '/docs/list', heading: 'Lists', componentSelector: '.list' },
  { path: '/docs/badge', heading: 'Badges', componentSelector: '.badge' },
  { path: '/docs/tree', heading: 'Tree', componentSelector: '.tree' },
  { path: '/docs/patterns', heading: 'Overview', componentSelector: '.pdoc-pattern-recipe-cards .pdoc-card' },
  { path: '/docs/pattern-contact-form', heading: 'Contact form', componentSelector: '.form .btn--primary' },
  { path: '/docs/pattern-toolbar-modal', heading: 'Toolbar + modal', componentSelector: '[data-modal-open]' },
  { path: '/docs/pattern-table-pagination', heading: 'Table + pagination', componentSelector: '.pdoc-table-demo' },
  { path: '/docs/slots-layouts', heading: 'Slots & layouts', componentSelector: '.slot' },
  { path: '/docs/placeholder', heading: 'Placeholder', componentSelector: '.heading-h6' },
  { path: '/docs/modals', heading: 'Modals', componentSelector: 'button[data-modal-open]' },
  { path: '/docs/cards', heading: 'Cards', componentSelector: '.card' },
  { path: '/docs/snackbar', heading: 'Snackbar', componentSelector: '.snackbar' },
  { path: '/docs/progress', heading: 'Progress', componentSelector: '.progress' },
  {
    path: '/docs/theme-toggle',
    heading: 'Theme toggle',
    componentSelector: '.pdoc-demo .theme-toggle',
  },
  {
    path: '/docs/a11y',
    heading: 'Accessibility guide',
    componentSelector: '.pdoc-a11y-focus-lab .btn--primary',
  },
];

/** Pages with wide tables: documented horizontal scroll tolerance */
export const PAGES_WITH_WIDE_CONTENT = new Set(['/docs/a11y', '/docs/colors', '/docs/input-fields']);

/** Astro site routes for specs outside DOC_PAGES */
export const DOC_ROUTES = {
  index: '/docs',
  installation: '/docs/installation',
  buttons: '/docs/buttons',
  form: '/docs/form',
  checkboxesRadiosSwitch: '/docs/checkboxes-radios-switch',
  inputFields: '/docs/input-fields',
  tabs: '/docs/tabs',
  a11y: '/docs/a11y',
  alerts: '/docs/alerts',
  components: '/docs/alerts',
  table: '/docs/table',
  whatsNew: '/docs/whats-new',
  patterns: '/docs/patterns',
  patternContactForm: '/docs/pattern-contact-form',
  patternToolbarModal: '/docs/pattern-toolbar-modal',
  patternTablePagination: '/docs/pattern-table-pagination',
  slotsLayouts: '/docs/slots-layouts',
  menuDropdown: '/docs/menu-dropdown',
  pagination: '/docs/pagination',
  anchorInpageNav: '/docs/anchor-inpage-nav',
  carousel: '/docs/carousel',
  colors: '/docs/colors',
  icons: '/docs/icons',
  themeToggle: '/docs/theme-toggle',
} as const;
