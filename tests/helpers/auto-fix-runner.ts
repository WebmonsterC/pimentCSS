import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { Violation } from '../fixtures/violations';

export type AutoFixResult = {
  applied: number;
  fixes: string[];
  skipped: string[];
};

const LOG_DIR = path.join(process.cwd(), '.playwright-auto-fix');

export function isAutoFixEnabled(): boolean {
  return process.env.PLAYWRIGHT_AUTO_FIX !== '0';
}

export function runAutoFix(violations: Violation[]): AutoFixResult {
  if (violations.length === 0) {
    return { applied: 0, fixes: [], skipped: [] };
  }

  fs.mkdirSync(LOG_DIR, { recursive: true });

  const proc = spawnSync(process.execPath, [path.join(process.cwd(), 'scripts/auto-fix/index.mjs')], {
    input: JSON.stringify(violations),
    encoding: 'utf-8',
    cwd: process.cwd(),
  });

  if (proc.status !== 0) {
    const err = proc.stderr || proc.stdout || 'auto-fix failed';
    throw new Error(`Auto-fix: ${err}`);
  }

  const result = JSON.parse(proc.stdout || '{}') as AutoFixResult;
  appendFixLog(violations, result);
  return result;
}

function sleep(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* attente synchrone courte */
  }
}

export function rebuildDesignSystem(): void {
  const lockPath = path.join(LOG_DIR, '.rebuild.lock');
  fs.mkdirSync(LOG_DIR, { recursive: true });

  if (fs.existsSync(lockPath)) {
    const age = Date.now() - fs.statSync(lockPath).mtimeMs;
    if (age > 120_000) fs.unlinkSync(lockPath);
  }

  const deadline = Date.now() + 90_000;
  while (fs.existsSync(lockPath) && Date.now() < deadline) {
    sleep(250);
  }

  if (fs.existsSync(lockPath)) {
    throw new Error('Timeout en attente du rebuild CSS (lock)');
  }

  fs.writeFileSync(lockPath, String(process.pid), 'utf-8');
  try {
    const proc = spawnSync('npm', ['run', 'build:css'], {
      encoding: 'utf-8',
      cwd: process.cwd(),
      shell: process.platform === 'win32',
    });

    if (proc.status !== 0) {
      throw new Error(proc.stderr || proc.stdout || 'build:css failed');
    }
  } finally {
    try {
      fs.unlinkSync(lockPath);
    } catch {
      /* lock already released */
    }
  }
}

function appendFixLog(violations: Violation[], result: AutoFixResult): void {
  const logPath = path.join(LOG_DIR, 'fixes-log.jsonl');
  const line = JSON.stringify({
    at: new Date().toISOString(),
    violations,
    result,
  });
  fs.appendFileSync(logPath, `${line}\n`, 'utf-8');
}
