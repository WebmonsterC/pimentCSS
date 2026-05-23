/**
 * Replace inline --text-muted (fails AA on doc page bg) with pdoc-text-muted class.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dirs = [join(root, 'docs-site', 'src', 'generated'), join(root, 'docs-site', 'src', 'lib')];

const replacements = [
  [/class="body-medium" style="color: var\(--text-muted\)"/g, 'class="body-medium pdoc-text-muted"'],
  [/class="body-medium" style="color: var\(--text-muted\); margin: 0"/g, 'class="body-medium pdoc-text-muted" style="margin: 0"'],
  [
    /class="body-medium" style="color: var\(--text-muted\); margin-bottom: var\(--space-4\)"/g,
    'class="body-medium pdoc-text-muted" style="margin-bottom: var(--space-4)"',
  ],
  [
    /class="body-medium" style="color: var\(--text-muted\); margin-bottom: var\(--space-3\)"/g,
    'class="body-medium pdoc-text-muted" style="margin-bottom: var(--space-3)"',
  ],
  [
    /class="body-medium" style="color: var\(--text-muted\); margin-top: var\(--space-2\)"/g,
    'class="body-medium pdoc-text-muted" style="margin-top: var(--space-2)"',
  ],
  [
    /style="margin-top: var\(--space-2\); color: var\(--text-muted\)"/g,
    'class="body-medium pdoc-text-muted" style="margin-top: var(--space-2)"',
  ],
  [
    /style="margin-top: var\(--space-3\); color: var\(--text-muted\)"/g,
    'class="body-medium pdoc-text-muted" style="margin-top: var(--space-3)"',
  ],
  [
    /<p class="body-medium" style="margin-top: var\(--space-3\); color: var\(--text-muted\)"/g,
    '<p class="body-medium pdoc-text-muted" style="margin-top: var(--space-3)"',
  ],
  [
    /<p class="body-medium" style="margin-top: var\(--space-2\); color: var\(--text-muted\)"/g,
    '<p class="body-medium pdoc-text-muted" style="margin-top: var(--space-2)"',
  ],
  [
    /<p class="body-medium" style="color: var\(--text-muted\); margin-bottom: var\(--space-4\)"/g,
    '<p class="body-medium pdoc-text-muted" style="margin-bottom: var(--space-4)"',
  ],
];

let count = 0;
for (const dir of dirs) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.html')) continue;
    const file = join(dir, name);
    let text = readFileSync(file, 'utf8');
    const before = text;
    for (const [re, rep] of replacements) text = text.replace(re, rep);
    if (text !== before) {
      writeFileSync(file, text);
      count++;
      console.log('updated', file);
    }
  }
}
console.log(`done (${count} files)`);
