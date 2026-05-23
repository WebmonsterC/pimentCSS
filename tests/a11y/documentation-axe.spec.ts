import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DOC_PAGES } from '../fixtures/doc-pages';
import {
  assertNoAxeViolations,
  analyzeDocDemoPreviews,
  DOC_AXE_DISABLED_RULES,
  DOC_AXE_EXCLUDE_DEMOS,
  DOC_AXE_TAGS,
  DOC_MATRIX_DEMO_AXE_PAGES,
  enableDocDarkMode,
} from '../helpers/axe-docs';

/** Wait for client transform (.ds-section → .pdoc-demo). */
async function waitDocDemosReady(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const sections = document.querySelectorAll('.ds-section');
    if (!sections.length) return true;
    return [...sections].every((s) => s.querySelector('.pdoc-demo.is-ready'));
  });
}

/**
 * Documentation accessibility audit (shell + content + demos).
 * WCAG 2.2 AA via axe.
 */
for (const { path, heading } of DOC_PAGES) {
  test(`${path} — axe WCAG 2.2 AA compliance`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1.pdoc-page-title')).toContainText(heading);
    await waitDocDemosReady(page);

    const results = await new AxeBuilder({ page })
      .exclude(DOC_AXE_EXCLUDE_DEMOS)
      .withTags([...DOC_AXE_TAGS])
      .disableRules(DOC_AXE_DISABLED_RULES)
      .analyze();

    assertNoAxeViolations(results, path);
  });
}

test('Installation page — step guide without axe regression', async ({ page }) => {
  await page.goto('/docs/installation');
  await expect(page.locator('.pdoc-steps')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('.pdoc-steps')
    .withTags([...DOC_AXE_TAGS])
    .analyze();

  assertNoAxeViolations(results, '/docs/installation (.pdoc-steps)');
});

for (const path of DOC_MATRIX_DEMO_AXE_PAGES) {
  test(`${path} — component demo regions axe WCAG AA`, async ({ page }) => {
    await page.goto(path);
    await waitDocDemosReady(page);

    const results = await analyzeDocDemoPreviews(page);
    assertNoAxeViolations(results, `${path} (.pdoc-demo__preview)`);
  });

  test(`${path} — component demos axe (dark theme)`, async ({ page }) => {
    await page.goto(path);
    await waitDocDemosReady(page);
    await enableDocDarkMode(page);

    const results = await analyzeDocDemoPreviews(page);
    assertNoAxeViolations(results, `${path} demos (dark)`);
  });
}

test('landmarks — single main and breadcrumb navigation', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.locator('main#pdoc-main')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Documentation' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
});
