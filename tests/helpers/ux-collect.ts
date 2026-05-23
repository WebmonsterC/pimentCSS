import type { Page } from '@playwright/test';
import type { TouchTargetViolation } from '../fixtures/violations';
import { MIN_TOUCH_TARGET_PX, TOUCH_TARGET_SELECTOR } from './ux';

export async function collectTouchTargetViolations(
  page: Page,
  selector: string = TOUCH_TARGET_SELECTOR,
): Promise<TouchTargetViolation[]> {
  return page.evaluate(
    ({ selector, minSize }) => {
      const failures: TouchTargetViolation[] = [];
      document.querySelectorAll(selector).forEach((el) => {
        const node = el as HTMLElement;
        if (!node.offsetParent && getComputedStyle(node).position !== 'fixed') return;

        const rect = node.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (w < minSize || h < minSize) {
          failures.push({
            tag: node.tagName.toLowerCase(),
            className: typeof node.className === 'string' ? node.className : '',
            width: w,
            height: h,
            label:
              node.getAttribute('aria-label') ||
              node.textContent?.trim().slice(0, 40) ||
              node.tagName.toLowerCase(),
          });
        }
      });
      return failures;
    },
    { selector: TOUCH_TARGET_SELECTOR, minSize: MIN_TOUCH_TARGET_PX },
  );
}

export async function collectHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 2;
  });
}

export async function collectSmallFontInputs(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      '.field__input, .field__textarea',
    );
    const bad: string[] = [];
    inputs.forEach((input) => {
      const size = parseFloat(getComputedStyle(input).fontSize);
      if (size < 16) bad.push(`${input.id || input.name || 'input'}: ${size}px`);
    });
    return bad;
  });
}
