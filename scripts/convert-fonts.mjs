/**
 * Ensures required .woff2 files exist in fonts/.
 * Converts from .ttf when missing (Plus Jakarta Sans).
 * Skips .eot / .woff — woff2 is enough for supported browsers.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ttf2woff2 from 'ttf2woff2';
import { FONTS_DIR, REQUIRED_FONTS } from './fonts-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = join(root, FONTS_DIR);

mkdirSync(fontsDir, { recursive: true });

let converted = 0;
let ok = 0;
const missing = [];

for (const font of REQUIRED_FONTS) {
  const woff2Path = join(fontsDir, `${font.fileBase}.woff2`);
  const ttfPath = join(fontsDir, `${font.fileBase}.ttf`);

  if (existsSync(woff2Path)) {
    ok++;
    continue;
  }

  if (existsSync(ttfPath)) {
    const out = ttf2woff2(readFileSync(ttfPath));
    writeFileSync(woff2Path, out);
    console.log(`✓ converted ${font.fileBase}.ttf → .woff2`);
    converted++;
    ok++;
    continue;
  }

  missing.push(font.fileBase);
}

if (missing.length) {
  console.error('✗ Missing font files (need .woff2 or .ttf):');
  missing.forEach((f) => console.error(`  - fonts/${f}.woff2`));
  process.exit(1);
}

console.log(`✓ fonts ready (${ok} woff2${converted ? `, ${converted} converted from ttf` : ''})`);
