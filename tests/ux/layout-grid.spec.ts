import { test, expect } from '@playwright/test';
import { DOC_ROUTES } from '../fixtures/doc-pages';
import { assertNoHorizontalOverflow, getViewportTier } from '../helpers/ux';

test.describe('Layout — grid and containers', () => {
  test('Colors page: palettes visible without overflow', async ({ page }, testInfo) => {
    await page.goto(DOC_ROUTES.colors);
    await assertNoHorizontalOverflow(page);

    await expect(page.locator('.palette, .palettes-grid, [data-palettes-grid]').first()).toBeVisible();
  });

  test('table: cards on mobile, scroll region on larger viewports', async ({ page }, testInfo) => {
    const tier = getViewportTier(testInfo.project.name);
    await page.goto(DOC_ROUTES.table);

    await expect(page.locator('.pdoc-table-responsive').first()).toBeVisible();
    await assertNoHorizontalOverflow(page);

    if (tier === 'mobile') {
      const card = page.locator('.pdoc-table-card').first();
      await expect(card).toBeVisible();
      const viewport = page.viewportSize();
      const box = await card.boundingBox();
      if (box && viewport) {
        expect(box.width).toBeLessThanOrEqual(viewport.width + 2);
      }
    } else {
      const scroll = page.locator('.table-scroll').first();
      await expect(scroll).toBeVisible();
      const scrollBox = await scroll.boundingBox();
      expect(scrollBox?.width).toBeGreaterThan(0);
    }
  });

  test('slots / layouts: stacked sections on mobile', async ({ page }, testInfo) => {
    const tier = getViewportTier(testInfo.project.name);
    await page.goto(DOC_ROUTES.slotsLayouts);

    await expect(page.locator('.slot, .slots-layout').first()).toBeVisible();
    await assertNoHorizontalOverflow(page);

    if (tier === 'mobile') {
      const viewport = page.viewportSize();
      const slot = page.locator('.slot').first();
      if ((await slot.count()) > 0) {
        const box = await slot.boundingBox();
        if (box && viewport) {
          expect(box.width).toBeLessThanOrEqual(viewport.width + 2);
        }
      }
    }
  });
});
