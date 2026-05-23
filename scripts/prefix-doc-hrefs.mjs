/**
 * One-off / maintenance: prefix internal doc hrefs with /docs for the marketing site layout.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libDir = join(root, 'docs-site', 'src', 'lib');

function patchFile(path) {
  let text = readFileSync(path, 'utf8');
  const before = text;
  text = text.replace(/href="\/(?!docs)([^"#]*)"/g, (_, rest) => {
    if (!rest) return 'href="/docs"';
    return `href="/docs/${rest}"`;
  });
  if (text !== before) {
    writeFileSync(path, text, 'utf8');
    return true;
  }
  return false;
}

let n = 0;
for (const name of readdirSync(libDir)) {
  const path = join(libDir, name);
  if (!statSync(path).isFile() || !name.endsWith('.ts')) continue;
  if (patchFile(path)) {
    console.log(`  ${name}`);
    n++;
  }
}
console.log(n ? `✓ ${n} file(s) updated` : '✓ no href changes needed');
