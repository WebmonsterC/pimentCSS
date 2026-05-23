import { test, expect } from '@playwright/test';
import { DOC_ROUTES } from '../fixtures/doc-pages';
import { testMeta } from '../helpers/test-meta';
import {
  getViewportTier,
  isTouchViewport,
  MIN_TOUCH_TARGET_PX,
} from '../helpers/ux';
import { assertTouchTargetsWithHeal, auditTouchTargetsWithHeal } from '../helpers/ux-heal';

/** Pages whose interactive demos must meet WCAG 2.5.5 (44px). */
const COMPONENT_TOUCH_PAGES = [
  DOC_ROUTES.buttons,
  DOC_ROUTES.inputFields,
  DOC_ROUTES.a11y,
  DOC_ROUTES.components,
  DOC_ROUTES.pagination,
  DOC_ROUTES.carousel,
];

test.describe('Touch targets — components (WCAG 2.5.5)', () => {
  for (const path of COMPONENT_TOUCH_PAGES) {
    test(`${path} — action elements ≥ ${MIN_TOUCH_TARGET_PX}px`, async ({ page }, testInfo) => {
      const tier = getViewportTier(testInfo.project.name);
      test.skip(!isTouchViewport(tier), 'Check limited to touch viewports');

      await page.goto(path);
      await assertTouchTargetsWithHeal(page, tier, { pagePath: path, project: testInfo.project.name }, testInfo);
    });
  }

  test('demo primary buttons — minimum height', async ({ page }, testInfo) => {
    const tier = getViewportTier(testInfo.project.name);
    test.skip(!isTouchViewport(tier), 'Check limited to touch viewports');

    await page.goto(DOC_ROUTES.buttons);
    const heights = await page.locator('.btn.focus-visible').evaluateAll((nodes) =>
      nodes.map((el) => el.getBoundingClientRect().height),
    );

    expect(heights.length).toBeGreaterThan(0);
    for (const h of heights) {
      expect(h).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
    }
  });
});

test.describe('Touch targets — doc navigation', () => {
  test('doc sidebar — Colors page links', async ({ page }, testInfo) => {
    const tier = getViewportTier(testInfo.project.name);
    test.skip(!isTouchViewport(tier), 'Check limited to touch viewports');

    await page.goto(DOC_ROUTES.colors);
    await auditTouchTargetsWithHeal(
      page,
      { pagePath: DOC_ROUTES.colors, project: testInfo.project.name },
      '.pdoc-sidebar__link',
      testInfo,
    );
  });
});
