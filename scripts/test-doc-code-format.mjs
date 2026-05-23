/**
 * Unit tests for documentation code formatting (normalize-code, format-html).
 * Usage: npm run test:doc-code
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tsx = join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const tests = [
  'docs-site/src/lib/normalize-code.test.ts',
  'docs-site/src/lib/format-html.test.ts',
].map((p) => join(root, p));

const r = spawnSync(process.execPath, [tsx, '--test', ...tests], { cwd: root, stdio: 'inherit' });

process.exit(r.status ?? 1);
