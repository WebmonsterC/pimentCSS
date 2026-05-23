import type { Page, TestInfo } from '@playwright/test';

export function testMeta(page: Page, testInfo: TestInfo): { pagePath: string; project: string } {
  const url = new URL(page.url());
  return {
    pagePath: url.pathname,
    project: testInfo.project.name,
  };
}
