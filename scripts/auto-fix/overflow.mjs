import path from 'node:path';
import { appendAutoFixCssAll } from './css-files.mjs';

const AUTO_FIX_MARKER = '/* AUTO-FIX:horizontal-overflow */';

/**
 * @param {string} root
 * @param {import('./types').Violation[]} violations
 */
export function fixHorizontalOverflow(root, violations) {
  const fixes = [];
  const skipped = [];
  let applied = 0;

  if (!violations.length) {
    return { applied: 0, fixes, skipped: ['overflow: rien à corriger'] };
  }

  const block = [
    '.ds-page,',
    '.pdoc-layout {',
    '  max-width: 100%;',
    '  overflow-x: clip;',
    '}',
    '.ds-body,',
    '.pdoc-main,',
    '.pdoc-main__inner,',
    'main {',
    '  max-width: 100%;',
    '  overflow-x: auto;',
    '  -webkit-overflow-scrolling: touch;',
    '}',
    '.ds-body table,',
    '.pdoc-main table,',
    'main table {',
    '  display: block;',
    '  max-width: 100%;',
    '  overflow-x: auto;',
    '}',
    '.ds-matrix,',
    '.palettes-grid {',
    '  max-width: 100%;',
    '}',
  ].join('\n');

  if (appendAutoFixCssAll(root, AUTO_FIX_MARKER, block)) {
    fixes.push(`CSS: overflow horizontal (${violations.length} page(s))`);
    applied++;
  } else {
    skipped.push('overflow: correctif déjà appliqué');
  }

  return { applied, fixes, skipped };
}

