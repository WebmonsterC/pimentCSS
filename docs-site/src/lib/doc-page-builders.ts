/**
 * Single source of truth for documentation page bodies (Astro docs-site).
 * Narrative content lives in docs-site/src/lib/*-content.ts.
 */
import { buildA11yPageHtml } from './a11y-content';
import { buildAlertsPageHtml } from './alerts-content';
import { buildAnchorInpageNavPageHtml } from './anchor-inpage-nav-content';
import { buildAutocompletePageHtml } from './autocomplete-content';
import { buildBadgePageHtml } from './badge-content';
import { buildButtonGroupPageHtml } from './button-group-content';
import { buildButtonsPageHtml } from './buttons-content';
import { buildCardsPageHtml } from './cards-content';
import { buildCarouselPageHtml } from './carousel-content';
import { buildCheckboxesRadiosSwitchPageHtml } from './checkboxes-radios-switch-content';
import { buildColorsPageHtml } from './colors-content';
import { buildDatePickerPageHtml } from './date-picker-content';
import { buildDepthPageHtml } from './depth-content';
import { buildFormPageHtml } from './form-content';
import { buildInputFieldsPageHtml } from './input-fields-content';
import { buildKeylinePageHtml } from './keyline-content';
import { buildLinkBreadcrumbPageHtml } from './link-breadcrumb-content';
import { buildListPageHtml } from './list-content';
import { buildLoaderPageHtml } from './loader-content';
import { buildMenuDropdownPageHtml } from './menu-dropdown-content';
import { buildModalsCardsRedirectPageHtml } from './modals-cards-redirect-content';
import { buildModalsPageHtml } from './modals-content';
import { buildNavigationPageHtml } from './navigation-content';
import { buildPaginationPageHtml } from './pagination-content';
import { buildPlaceholderPageHtml } from './placeholder-content';
import { buildProgressPageHtml } from './progress-content';
import { buildSlotsLayoutsPageHtml } from './slots-layouts-content';
import { buildPatternsHubPageHtml } from './patterns-hub-content';
import { buildPatternContactFormPageHtml } from './pattern-contact-form-content';
import { buildPatternToolbarModalPageHtml } from './pattern-toolbar-modal-content';
import { buildPatternTablePaginationPageHtml } from './pattern-table-pagination-content';
import { buildSnackbarPageHtml } from './snackbar-content';
import { buildTablePageHtml } from './table-content';
import { buildTabsPageHtml } from './tabs-content';
import { buildTagsPageHtml } from './tags-content';
import { buildThemeTogglePageHtml } from './theme-toggle-content';
import { buildTreePageHtml } from './tree-content';

export const DOC_PAGE_BUILDERS: Record<string, () => string> = {
  colors: buildColorsPageHtml,
  depth: buildDepthPageHtml,
  'theme-toggle': buildThemeTogglePageHtml,
  'input-fields': buildInputFieldsPageHtml,
  'checkboxes-radios-switch': buildCheckboxesRadiosSwitchPageHtml,
  form: buildFormPageHtml,
  'date-picker': buildDatePickerPageHtml,
  autocomplete: buildAutocompletePageHtml,
  'button-group': buildButtonGroupPageHtml,
  'link-breadcrumb': buildLinkBreadcrumbPageHtml,
  navigation: buildNavigationPageHtml,
  'menu-dropdown': buildMenuDropdownPageHtml,
  tabs: buildTabsPageHtml,
  pagination: buildPaginationPageHtml,
  'anchor-inpage-nav': buildAnchorInpageNavPageHtml,
  carousel: buildCarouselPageHtml,
  table: buildTablePageHtml,
  list: buildListPageHtml,
  tree: buildTreePageHtml,
  badge: buildBadgePageHtml,
  tags: buildTagsPageHtml,
  keyline: buildKeylinePageHtml,
  placeholder: buildPlaceholderPageHtml,
  alerts: buildAlertsPageHtml,
  components: buildAlertsPageHtml,
  modals: buildModalsPageHtml,
  cards: buildCardsPageHtml,
  'modals-cards': buildModalsCardsRedirectPageHtml,
  snackbar: buildSnackbarPageHtml,
  progress: buildProgressPageHtml,
  loader: buildLoaderPageHtml,
  'slots-layouts': buildSlotsLayoutsPageHtml,
  patterns: buildPatternsHubPageHtml,
  'pattern-contact-form': buildPatternContactFormPageHtml,
  'pattern-toolbar-modal': buildPatternToolbarModalPageHtml,
  'pattern-table-pagination': buildPatternTablePaginationPageHtml,
  a11y: buildA11yPageHtml,
  buttons: buildButtonsPageHtml,
};

export function buildDocPageBody(slug: string): string | undefined {
  return DOC_PAGE_BUILDERS[slug]?.();
}
