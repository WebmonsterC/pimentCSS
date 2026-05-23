import fs from 'node:fs';
import path from 'node:path';

/** Fichiers CSS auto-fix (racine + site Astro). */
export function getAutoFixCssPaths(root) {
  return [
    path.join(root, 'styles', 'playwright-auto-fix.css'),
    path.join(root, 'docs-site', 'src', 'styles', 'playwright-auto-fix.css'),
  ].filter((f) => fs.existsSync(f));
}

export function appendAutoFixCssAll(root, marker, block) {
  let wrote = false;
  for (const file of getAutoFixCssPaths(root)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes(marker)) continue;
    content = `${content.trim()}\n\n${marker}\n${block}\n`;
    fs.writeFileSync(file, content, 'utf-8');
    wrote = true;
  }
  return wrote;
}
