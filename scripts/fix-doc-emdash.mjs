/**
 * Replace em dashes in documentation prose (Impeccable copy rule).
 * Usage: node scripts/fix-doc-emdash.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dirs = [
  join(root, 'docs-site', 'src', 'lib'),
  join(root, 'docs-site', 'src', 'generated'),
  join(root, 'docs-site', 'src', 'lib'),
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|html)$/.test(name)) out.push(p);
  }
  return out;
}

function fix(text) {
  return text
    .replace(/\s—\s/g, ', ')
    .replace(/—/g, ', ');
}

let n = 0;
const files = [];
for (const dir of dirs) files.push(...walk(dir));
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = fix(before);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    n++;
  }
}
console.log(`Updated ${n} files.`);
