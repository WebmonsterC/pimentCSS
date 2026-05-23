import path from 'node:path';
import { appendAutoFixCssAll } from './css-files.mjs';

const AUTO_FIX_MARKER = '/* AUTO-FIX:font-size-input */';

/**
 * @param {string} root
 * @param {import('./types').Violation[]} violations
 */
export function fixFontSizeInputs(root, violations) {
  const fixes = [];
  const skipped = [];
  let applied = 0;

  const inputs = violations.flatMap((v) => v.fontSizeInputs || []);
  if (!inputs.length) {
    return { applied: 0, fixes, skipped: ['font-size: aucun champ'] };
  }

  const block = [
    '@media (max-width: 480px) {',
    '  .field__input,',
    '  .field__textarea,',
    '  select.field__input {',
    '    font-size: max(1rem, var(--font-size-body-medium, 1rem));',
    '  }',
    '}',
  ].join('\n');

  if (appendAutoFixCssAll(root, AUTO_FIX_MARKER, block)) {
    fixes.push(`CSS: font-size mobile ≥16px (${inputs.length} champ(s))`);
    applied++;
  } else {
    skipped.push('font-size: correctif déjà appliqué');
  }

  return { applied, fixes, skipped };
}

