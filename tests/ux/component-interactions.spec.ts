import { test, expect } from '@playwright/test';
import { DOC_ROUTES } from '../fixtures/doc-pages';
import { testMeta } from '../helpers/test-meta';
import {
  assertFocusRingVisible,
  clickDocSidebarLink,
  getViewportTier,
  MIN_TOUCH_TARGET_PX,
} from '../helpers/ux';
import { assertFormFieldsMinFontSizeWithHeal } from '../helpers/ux-heal';

test.describe('Components — UX interactions', () => {
  test('buttons: enabled / disabled states', async ({ page }) => {
    await page.goto(DOC_ROUTES.buttons);

    const primary = page.locator('.btn.focus-visible.btn--primary').first();
    await expect(primary).toBeEnabled();
    await primary.click();

    const disabled = page.locator('.btn--primary[disabled]').first();
    await expect(disabled).toBeDisabled();
  });

  test('buttons: minimum touch height', async ({ page }, testInfo) => {
    await page.goto(DOC_ROUTES.buttons);

    const height = await page.locator('.btn.focus-visible').first().evaluate((el) => {
      return el.getBoundingClientRect().height;
    });

    expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  });

  test('form: input and submit visible', async ({ page }, testInfo) => {
    const tier = getViewportTier(testInfo.project.name);
    await page.goto(DOC_ROUTES.form);

    await assertFormFieldsMinFontSizeWithHeal(page, tier, testMeta(page, testInfo), testInfo);

    await page.locator('#pdoc-form-name').fill('Test PimentCSS');
    await page.locator('#pdoc-form-email').fill('test@example.com');

    const submit = page.getByRole('button', { name: /Subscribe now/i });
    await expect(submit).toBeVisible();
    await submit.scrollIntoViewIfNeeded();
    await expect(submit).toBeInViewport();

    const newsletter = page.locator('input[name="newsletter"]');
    await expect(newsletter).toBeChecked();
    await page.locator('.form__checkbox').click();
    await expect(newsletter).not.toBeChecked();
    await page.locator('.form__checkbox').click();
    await expect(newsletter).toBeChecked();
  });

  test('checkbox, radio, and switch: toggle on click', async ({ page }) => {
    await page.goto(DOC_ROUTES.checkboxesRadiosSwitch);

    const checkbox = page.locator('#pdoc-cb-1');
    await checkbox.scrollIntoViewIfNeeded();
    await expect(checkbox).not.toBeChecked();
    await page.locator('label.checkbox:has(#pdoc-cb-1)').click();
    await expect(checkbox).toBeChecked();

    await expect(page.locator('#pdoc-radio-a')).toBeChecked();
    await page.locator('label.radio:has(#pdoc-radio-b)').click();
    await expect(page.locator('#pdoc-radio-b')).toBeChecked();

    const switchInput = page.locator('#pdoc-sw-1');
    await switchInput.scrollIntoViewIfNeeded();
    const initial = await switchInput.isChecked();
    await page.locator('label.switch:has(#pdoc-sw-1)').click();
    await expect(switchInput).toBeChecked({ checked: !initial });
  });

  test('text fields: focus and keyboard input', async ({ page }) => {
    await page.goto(DOC_ROUTES.inputFields);

    const field = page.locator('.field__input').first();
    await field.click();
    await field.fill('Test content');
    await expect(field).toHaveValue('Test content');
    await expect(field).toBeFocused();
  });

  test('tabs: activate on click', async ({ page }) => {
    await page.goto(DOC_ROUTES.tabs);

    const tab = page.locator('.tab').first();
    await tab.click();
    await expect(tab).toBeVisible();
  });

  test('installation: package manager tabs switch visible code', async ({ page }) => {
    await page.goto(DOC_ROUTES.installation);

    const tabs = page.locator('[data-pdoc-tabs]').first();
    await tabs.scrollIntoViewIfNeeded();

    const pnpmTab = tabs.getByRole('tab', { name: 'pnpm' });
    await pnpmTab.click();
    await expect(pnpmTab).toHaveAttribute('aria-selected', 'true');

    const pnpmPanel = page.locator('#pdoc-panel-pnpm');
    await expect(pnpmPanel).toBeVisible();
    await expect(pnpmPanel.locator('.pdoc-snippet__pre')).toBeVisible();
    await expect(pnpmPanel.locator('code')).toContainText('pnpm add pimentcss');
  });

  test('doc navigation: accessible links', async ({ page }) => {
    await page.goto(DOC_ROUTES.buttons);

    await clickDocSidebarLink(page, /Input fields/i, '/input-fields');
    await expect(page).toHaveURL(/input-fields/);
    await expect(page.getByRole('heading', { level: 1, name: 'Input fields' })).toBeVisible();
  });

  test('accessibility: visible focus ring', async ({ page }) => {
    await page.goto(DOC_ROUTES.a11y);
    await assertFocusRingVisible(page);
  });

  test('alerts: dialog and dismiss interactions', async ({ page }) => {
    await page.goto(DOC_ROUTES.alerts);

    await page.getByRole('button', { name: /Show alert dialog/i }).click();
    const dialog = page.locator('#pdoc-alert-dialog-demo');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: /^Cancel$/i }).click();
    await expect(dialog).toBeHidden();

    const dismissible = page.locator('.alert--dismissible').first();
    await dismissible.getByRole('button', { name: /Close notification/i }).click();
    await expect(dismissible).toBeHidden();
  });
});
