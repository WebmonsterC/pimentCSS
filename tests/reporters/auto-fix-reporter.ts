import fs from 'node:fs';
import path from 'node:path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

/**
 * Prints a summary of auto-fixes applied during the session.
 */
export default class AutoFixReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult): void {
    const fixes = result.annotations.filter((a) => a.type === 'auto-fix');
    for (const fix of fixes) {
      console.log(`\n[auto-fix] ${test.title}: ${fix.description}`);
    }
  }

  onEnd(result: FullResult): void {
    const logPath = path.join(process.cwd(), '.playwright-auto-fix', 'fixes-log.jsonl');
    if (!fs.existsSync(logPath)) return;

    const lines = fs.readFileSync(logPath, 'utf-8').trim().split('\n').filter(Boolean);
    let totalApplied = 0;
    const allFixes: string[] = [];

    for (const line of lines) {
      try {
        const entry = JSON.parse(line) as { result?: { applied?: number; fixes?: string[] } };
        totalApplied += entry.result?.applied ?? 0;
        if (entry.result?.fixes) allFixes.push(...entry.result.fixes);
      } catch {
        /* ignore malformed */
      }
    }

    if (totalApplied > 0) {
      console.log('\n══════════════════════════════════════');
      console.log(`Auto-fix: ${totalApplied} fix(es) applied`);
      console.log('══════════════════════════════════════');
      for (const fix of [...new Set(allFixes)]) {
        console.log(`  • ${fix}`);
      }
      console.log(`Log: ${logPath}\n`);
    }

    if (!result.status || result.status === 'passed') return;
  }

  onBegin(_config: FullConfig, _suite: Suite): void {
    fs.mkdirSync(path.join(process.cwd(), '.playwright-auto-fix'), { recursive: true });
  }
}
