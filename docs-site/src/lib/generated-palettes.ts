/** Generated OKLCH palette grid (npm run generate:palettes). Not hand-edited. */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PALETTES_GRID_FILE = join(dirname(fileURLToPath(import.meta.url)), '../generated/palettes-grid.html');

/** HTML for `.palettes-grid` injected into the Colors doc page. */
export function loadGeneratedPalettesGrid(): string {
  if (!existsSync(PALETTES_GRID_FILE)) return '';
  return readFileSync(PALETTES_GRID_FILE, 'utf8');
}
