/**
 * One-off migration: remove HubMonster "hm-" class prefix from source files.
 * Run: node scripts/remove-hm-prefix.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', 'dist-docs', '.git', 'fonts']);
const EXT = new Set(['.html', '.ts', '.css', '.mjs', '.json', '.md', '.scss', '.astro']);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (EXT.has(name.slice(name.lastIndexOf('.')))) files.push(p);
  }
  return files;
}

function transform(content) {
  let s = content;
  s = s.replace(/\$hm-fonts-local-available/g, '$fonts-local-available');
  s = s.replace(/data-hm-theme-toggle/g, 'data-theme-toggle');
  s = s.replace(/\.hm-\*/g, 'component classes');
  s = s.replace(/hm-/g, '');
  return s;
}

let changed = 0;
for (const file of walk(root)) {
  if (file.includes('remove-hm-prefix.mjs')) continue;
  if (file.includes('docs-site\\public\\pimentcss')) continue;
  if (file.includes('docs-site/public/pimentcss')) continue;
  const before = readFileSync(file, 'utf8');
  const after = transform(before, file);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    changed++;
  }
}

console.log(`Updated ${changed} files.`);
