/**
 * Applique des correctifs automatiques à partir des violations Playwright.
 * Entrée : JSON stdin (Violation[])
 * Sortie : JSON stdout { applied, fixes, skipped }
 */
import fs from 'node:fs';
import path from 'node:path';
import { fixTouchTargets } from './touch-target.mjs';
import { fixHorizontalOverflow } from './overflow.mjs';
import { fixFontSizeInputs } from './font-size.mjs';

const ROOT = process.cwd();

async function main() {
  const raw = fs.readFileSync(0, 'utf-8');
  const violations = JSON.parse(raw || '[]');

  const fixes = [];
  const skipped = [];
  let applied = 0;

  const touch = violations.filter((v) => v.type === 'touch-target');
  if (touch.length) {
    const r = fixTouchTargets(ROOT, touch);
    fixes.push(...r.fixes);
    skipped.push(...r.skipped);
    applied += r.applied;
  }

  const overflow = violations.filter((v) => v.type === 'horizontal-overflow');
  if (overflow.length) {
    const r = fixHorizontalOverflow(ROOT, overflow);
    fixes.push(...r.fixes);
    skipped.push(...r.skipped);
    applied += r.applied;
  }

  const fonts = violations.filter((v) => v.type === 'font-size-input');
  if (fonts.length) {
    const r = fixFontSizeInputs(ROOT, fonts);
    fixes.push(...r.fixes);
    skipped.push(...r.skipped);
    applied += r.applied;
  }

  process.stdout.write(JSON.stringify({ applied, fixes, skipped }));
}

main().catch((err) => {
  process.stderr.write(String(err));
  process.exit(1);
});
