import { test, expect } from '@playwright/test';
import { DOC_PAGES, PAGES_WITH_WIDE_CONTENT } from '../fixtures/doc-pages';
import { testMeta } from '../helpers/test-meta';
import { assertStylesheetLoaded } from '../helpers/ux';
import { assertNoHorizontalOverflowWithHeal } from '../helpers/ux-heal';

test.describe('Documentation — responsive UX quality', () => {
  for (const docPage of DOC_PAGES) {
    test(`${docPage.heading} — structure and layout`, async ({ page }, testInfo) => {
      await page.goto(docPage.path);

      await expect(page).toHaveTitle(/PimentCSS/);
      await expect(page.getByRole('heading', { level: 1, name: docPage.heading })).toBeVisible();

      await assertStylesheetLoaded(page);

      if (!PAGES_WITH_WIDE_CONTENT.has(docPage.path)) {
        await assertNoHorizontalOverflowWithHeal(page, testMeta(page, testInfo), testInfo);
      }

      if (docPage.componentSelector) {
        await expect(page.locator(docPage.componentSelector).first()).toBeVisible();
      }
    });
  }

  test('viewport meta present on all pages', async ({ page }) => {
    for (const { path } of DOC_PAGES) {
      await page.goto(path);
      await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
        'content',
        /width=device-width/,
      );
    }
  });
});
