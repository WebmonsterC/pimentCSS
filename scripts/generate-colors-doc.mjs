/**
 * Generates OKLCH palette swatch HTML for the Astro Colors page.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildPalettesGrid } from './palette-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs-site', 'src', 'generated');
const outFile = join(outDir, 'palettes-grid.html');

const css = readFileSync(join(root, 'tokens', 'colors.css'), 'utf8');
const grid = buildPalettesGrid(css);

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `<div class="palettes-grid">\n${grid}        </div>\n`, 'utf8');
console.log('✓ docs-site/src/generated/palettes-grid.html');
