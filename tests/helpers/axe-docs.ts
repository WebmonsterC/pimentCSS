import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

/** Tags WCAG 2.x niveau AA (base RGAA). */
export const DOC_AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] as const;

/**
 * Doc pages with component matrices / live demos in `.pdoc-demo__preview`.
 * Light and dark axe runs target this list.
 */
export const DOC_MATRIX_DEMO_AXE_PAGES = [
  '/docs/anchor-inpage-nav',
  '/docs/tabs',
  '/docs/pagination',
  '/docs/menu-dropdown',
  '/docs/carousel',
  '/docs/table',
  '/docs/list',
  '/docs/tree',
  '/docs/badge',
  '/docs/tags',
  '/docs/keyline',
  '/docs/placeholder',
  '/docs/alerts',
  '/docs/modals',
  '/docs/cards',
  '/docs/snackbar',
  '/docs/progress',
  '/docs/loader',
  '/docs/slots-layouts',
  '/docs/pattern-toolbar-modal',
  '/docs/pattern-table-pagination',
  '/docs/pattern-contact-form',
  '/docs/a11y',
  '/docs/checkboxes-radios-switch',
  '/docs/form',
  '/docs/buttons',
] as const;

/** Disabled rules (DS demos in .pdoc-demo__preview only when needed). */
export const DOC_AXE_DISABLED_RULES: string[] = [];

/** Component demo zones: PimentCSS styles, audited separately. */
export const DOC_AXE_EXCLUDE_DEMOS = '.pdoc-demo__preview, .ds-matrix, .palettes-grid';

export function formatAxeViolations(violations: Result[]): string {
  if (!violations.length) return '';
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 3)
        .map((n) => `  - ${n.html}\n    ${n.failureSummary}`)
        .join('\n');
      const more = v.nodes.length > 3 ? `\n  … +${v.nodes.length - 3} nœud(s)` : '';
      return `[${v.id}] ${v.help} (${v.impact})\n${v.helpUrl}\n${nodes}${more}`;
    })
    .join('\n\n');
}

export function assertNoAxeViolations(results: AxeResults, pageLabel: string): void {
  const violations = results.violations.filter((v) => v.impact !== 'minor');
  if (!violations.length) return;

  const summary = formatAxeViolations(violations);
  throw new Error(`${pageLabel} — ${violations.length} violation(s) axe (WCAG AA):\n\n${summary}`);
}

/** Doc header theme toggle → dark mode (semantic tokens on demo previews). */
export async function enableDocDarkMode(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Dark mode' }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
}

/** axe on `.pdoc-demo__preview` regions (component matrices and live demos). */
export async function analyzeDocDemoPreviews(page: Page): Promise<AxeResults> {
  return new AxeBuilder({ page })
    .include('.pdoc-demo__preview')
    .withTags([...DOC_AXE_TAGS])
    .disableRules(DOC_AXE_DISABLED_RULES)
    .analyze();
}
