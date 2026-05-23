import { test, expect } from '@playwright/test';
import { DOC_ROUTES } from '../fixtures/doc-pages';
import { testMeta } from '../helpers/test-meta';
import { getViewportTier, isTouchViewport, MIN_TOUCH_TARGET_PX } from '../helpers/ux';
import { auditTouchTargetsWithHeal } from '../helpers/ux-heal';

/**
 * Pages with demo matrices: auto-fix then strict verification.
 */
const AUDIT_PAGES: { path: string; selector: string }[] = [
  { path: DOC_ROUTES.form, selector: '.field__input, label.form__checkbox' },
  {
    path: DOC_ROUTES.checkboxesRadiosSwitch,
    selector: '#checkbox-interactive ~ .pdoc-demo label.checkbox, #radio-interactive ~ .pdoc-demo label.radio, #switch-interactive ~ .pdoc-demo label.switch',
  },
  { path: DOC_ROUTES.menuDropdown, selector: '.menu__item, .dropdown__trigger, .label__tooltip' },
  { path: DOC_ROUTES.tabs, selector: '.tabs__list .tab[role="tab"]' },
  { path: DOC_ROUTES.pagination, selector: '.pagination__item' },
  { path: DOC_ROUTES.anchorInpageNav, selector: '.anchor-item' },
  { path: DOC_ROUTES.carousel, selector: '.carousel__arrow' },
  { path: DOC_ROUTES.inputFields, selector: '.field__input, .label__tooltip' },
];

test.describe('Touch audit — with auto-fix', () => {
  for (const { path, selector } of AUDIT_PAGES) {
    test(`${path} — areas ≥ ${MIN_TOUCH_TARGET_PX}px after heal`, async ({ page }, testInfo) => {
      const tier = getViewportTier(testInfo.project.name);
      test.skip(!isTouchViewport(tier), 'Audit limited to touch viewports');

      await page.goto(path);
      const meta = testMeta(page, testInfo);

      await auditTouchTargetsWithHeal(page, meta, selector, testInfo);

      const fixed = testInfo.annotations.some((a) => a.type === 'auto-fix');
      testInfo.annotations.push({
        type: 'a11y-audit',
        description: fixed
          ? `Passing after auto-fix (≥ ${MIN_TOUCH_TARGET_PX}px)`
          : `Passing (≥ ${MIN_TOUCH_TARGET_PX}px)`,
      });
    });
  }
});
