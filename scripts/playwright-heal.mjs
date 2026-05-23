#!/usr/bin/env node
/**
 * Boucle tests → auto-fix → rebuild → re-tests (max 5 passes).
 * Usage: npm run test:e2e:heal
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MAX_PASSES = Number(process.env.HEAL_MAX_PASSES || 5);
const ROOT = process.cwd();

function runPlaywright() {
  return spawnSync('npx', ['playwright', 'test'], {
    encoding: 'utf-8',
    cwd: ROOT,
    shell: process.platform === 'win32',
    env: { ...process.env, PLAYWRIGHT_AUTO_FIX: '1' },
  });
}

function hasPendingFixes() {
  const log = path.join(ROOT, '.playwright-auto-fix', 'fixes-log.jsonl');
  if (!fs.existsSync(log)) return false;
  const lines = fs.readFileSync(log, 'utf-8').trim().split('\n').filter(Boolean);
  if (!lines.length) return false;
  const last = JSON.parse(lines[lines.length - 1]);
  return (last.result?.applied ?? 0) > 0;
}

console.log('Playwright heal — auto-correction des violations UX\n');

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  console.log(`--- Passe ${pass}/${MAX_PASSES} ---`);
  const beforeLog = fs.existsSync(path.join(ROOT, '.playwright-auto-fix', 'fixes-log.jsonl'));

  const result = runPlaywright();
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');

  if (result.status === 0) {
    console.log('\nTous les tests passent.');
    process.exit(0);
  }

  const logNow = fs.existsSync(path.join(ROOT, '.playwright-auto-fix', 'fixes-log.jsonl'));
  if (!logNow || (beforeLog && !hasPendingFixes())) {
    console.error('\nÉchec sans correctif applicable. Arrêt.');
    process.exit(result.status || 1);
  }

  console.log('\nCorrectifs appliqués — nouvelle passe…\n');
}

console.error(`\nLimite de ${MAX_PASSES} passes atteinte.`);
process.exit(1);
