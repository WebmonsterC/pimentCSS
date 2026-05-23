import { expect, type Page } from '@playwright/test';
import { collectTouchTargetViolations } from './ux-collect';

/** Matches --min-touch-target (tokens/a11y.css) */
export const MIN_TOUCH_TARGET_PX = 44;

/** Interactive “action” elements (excluding decorative matrices) */
export const TOUCH_TARGET_SELECTOR = [
  '.btn.focus-visible:not([disabled])',
  '.form .btn--primary:not([disabled])',
  'label.checkbox:has(input:not([disabled]))',
  'label.radio:has(input:not([disabled]))',
  'label.switch:has(input:not([disabled]))',
  '.pagination__item.focus-visible',
  '.carousel__arrow.focus-visible',
  '.menu__item.focus-visible',
].join(', ');

export type ViewportTier = 'mobile' | 'tablet' | 'desktop';

export function getViewportTier(projectName: string): ViewportTier {
  if (projectName === 'mobile') return 'mobile';
  if (projectName === 'tablet') return 'tablet';
  return 'desktop';
}

export function isTouchViewport(tier: ViewportTier): boolean {
  return tier === 'mobile' || tier === 'tablet';
}

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 2;
  });
  expect(hasOverflow, 'Unwanted horizontal scroll on the page').toBe(false);
}

export async function assertStylesheetLoaded(page: Page): Promise<void> {
  await expect(page.locator('link[href*="pimentcss"]')).toHaveCount(1);
}

/** Opens the mobile/tablet doc nav drawer so sidebar links are clickable. */
export async function ensureDocSidebarVisible(page: Page): Promise<void> {
  const sidebar = page.locator('#pdoc-sidebar');
  const menuToggle = page.getByRole('button', { name: /Open navigation menu/i });
  if (await menuToggle.isVisible()) {
    const expanded = await menuToggle.getAttribute('aria-expanded');
    if (expanded !== 'true') {
      await menuToggle.click();
      await expect(sidebar).toHaveClass(/is-open/);
    }
  }
}

/** Clicks a doc sidebar link (scrolls inside the fixed drawer on narrow viewports). */
export async function clickDocSidebarLink(page: Page, linkName: RegExp, href: string): Promise<void> {
  await ensureDocSidebarVisible(page);
  const sidebar = page.locator('#pdoc-sidebar');
  const link = sidebar.getByRole('link', { name: linkName });
  await expect(link).toBeVisible();
  await sidebar.evaluate((root, path) => {
    const anchor = root.querySelector<HTMLAnchorElement>(`a[href="${path}"]`);
    anchor?.scrollIntoView({ block: 'center', inline: 'nearest' });
  }, href);
  await link.click({ timeout: 10_000 });
}

export async function assertTouchTargets(page: Page, tier: ViewportTier): Promise<void> {
  if (!isTouchViewport(tier)) return;

  const violations = await collectTouchTargetViolations(page);

  expect(
    violations.map((v) => `# <${v.tag}> « ${v.label} » — ${v.width}×${v.height}px`),
    `Touch targets smaller than ${MIN_TOUCH_TARGET_PX}px (${tier})`,
  ).toEqual([]);
}

export async function assertFormFieldsMinFontSize(page: Page, tier: ViewportTier): Promise<void> {
  if (tier !== 'mobile') return;

  const tooSmall = await page.evaluate(() => {
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      '.field__input, .field__textarea',
    );
    const bad: string[] = [];
    inputs.forEach((input) => {
      const size = parseFloat(getComputedStyle(input).fontSize);
      if (size < 16) bad.push(`${input.id || input.name}: ${size}px`);
    });
    return bad;
  });

  expect(tooSmall, 'Fields < 16px on mobile (iOS zoom)').toEqual([]);
}

export async function assertFocusRingVisible(page: Page): Promise<void> {
  const target = page.locator('.btn.focus-visible').first();
  await target.focus();

  const outlineWidth = await target.evaluate((el) => {
    const styles = getComputedStyle(el);
    return parseFloat(styles.outlineWidth) || 0;
  });

  expect(outlineWidth).toBeGreaterThan(0);
}

export { collectTouchTargetViolations } from './ux-collect';
