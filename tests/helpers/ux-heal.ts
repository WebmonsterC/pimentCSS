import { expect, type Page, type TestInfo } from '@playwright/test';
import type { Violation } from '../fixtures/violations';
import { isAutoFixEnabled, rebuildDesignSystem, runAutoFix } from './auto-fix-runner';
import {
  collectHorizontalOverflow,
  collectSmallFontInputs,
  collectTouchTargetViolations,
} from './ux-collect';
import { MIN_TOUCH_TARGET_PX, type ViewportTier, isTouchViewport } from './ux';

const MAX_HEAL_ATTEMPTS = 3;

async function healLoop(
  page: Page,
  meta: { pagePath: string; project: string },
  buildViolations: () => Promise<Violation[]>,
  assertClean: () => Promise<void>,
  testInfo?: TestInfo,
): Promise<void> {
  for (let attempt = 0; attempt < MAX_HEAL_ATTEMPTS; attempt++) {
    const violations = await buildViolations();
    if (violations.length === 0) {
      await assertClean();
      return;
    }

    if (!isAutoFixEnabled() || attempt === MAX_HEAL_ATTEMPTS - 1) {
      await assertClean();
      return;
    }

    const result = runAutoFix(violations);
    if (result.applied === 0) {
      await assertClean();
      return;
    }

    testInfo?.annotations.push({
      type: 'auto-fix',
      description: `[attempt ${attempt + 1}] ${result.fixes.join(' · ')}`,
    });

    const needsRebuild = result.fixes.some((f) => f.startsWith('SCSS:'));
    if (needsRebuild) rebuildDesignSystem();

    await page.reload({ waitUntil: 'networkidle' });
  }
}

export async function assertTouchTargetsWithHeal(
  page: Page,
  tier: ViewportTier,
  meta: { pagePath: string; project: string },
  testInfo?: TestInfo,
): Promise<void> {
  if (!isTouchViewport(tier)) return;

  await healLoop(
    page,
    meta,
    async () => {
      const touchTargets = await collectTouchTargetViolations(page);
      if (touchTargets.length === 0) return [];
      return [{ type: 'touch-target' as const, ...meta, touchTargets }];
    },
    async () => {
      const remaining = await collectTouchTargetViolations(page);
      expect(
        remaining,
        `Touch targets smaller than ${MIN_TOUCH_TARGET_PX}px (${tier})`,
      ).toEqual([]);
    },
    testInfo,
  );
}

export async function assertNoHorizontalOverflowWithHeal(
  page: Page,
  meta: { pagePath: string; project: string },
  testInfo?: TestInfo,
): Promise<void> {
  await healLoop(
    page,
    meta,
    async () => {
      const hasOverflow = await collectHorizontalOverflow(page);
      return hasOverflow ? [{ type: 'horizontal-overflow' as const, ...meta }] : [];
    },
    async () => {
      const hasOverflow = await collectHorizontalOverflow(page);
      expect(hasOverflow, 'Unwanted horizontal scroll on the page').toBe(false);
    },
    testInfo,
  );
}

export async function assertFormFieldsMinFontSizeWithHeal(
  page: Page,
  tier: ViewportTier,
  meta: { pagePath: string; project: string },
  testInfo?: TestInfo,
): Promise<void> {
  if (tier !== 'mobile') return;

  await healLoop(
    page,
    meta,
    async () => {
      const fontSizeInputs = await collectSmallFontInputs(page);
      if (fontSizeInputs.length === 0) return [];
      return [{ type: 'font-size-input' as const, ...meta, fontSizeInputs }];
    },
    async () => {
      const fontSizeInputs = await collectSmallFontInputs(page);
      expect(fontSizeInputs, 'Fields < 16px on mobile (iOS zoom)').toEqual([]);
    },
    testInfo,
  );
}

/** Touch audit (custom selector) with auto-fix. */
export async function auditTouchTargetsWithHeal(
  page: Page,
  meta: { pagePath: string; project: string },
  selector: string,
  testInfo?: TestInfo,
): Promise<void> {
  const { collectTouchTargetViolations } = await import('./ux-collect');

  await healLoop(
    page,
    meta,
    async () => {
      const touchTargets = await collectTouchTargetViolations(page, selector);
      if (touchTargets.length === 0) return [];
      return [{ type: 'touch-target' as const, ...meta, touchTargets }];
    },
    async () => {
      const remaining = await collectTouchTargetViolations(page, selector);
      expect(remaining.length, `Zones < ${MIN_TOUCH_TARGET_PX}px (${selector})`).toBe(0);
    },
    testInfo,
  );
}
