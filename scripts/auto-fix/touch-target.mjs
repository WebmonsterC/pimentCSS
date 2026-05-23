import fs from 'node:fs';
import path from 'node:path';
import { appendAutoFixCssAll } from './css-files.mjs';

const MIN_TOUCH = 44;
const AUTO_FIX_MARKER = '/* AUTO-FIX:touch-target */';

/**
 * @param {string} root
 * @param {import('./types').Violation[]} violations
 */
export function fixTouchTargets(root, violations) {
  const fixes = [];
  const skipped = [];
  let applied = 0;

  const targets = violations.flatMap((v) => v.touchTargets || []);
  if (!targets.length) {
    return { applied: 0, fixes, skipped: ['touch-target: aucune cible'] };
  }

  const needsField = targets.some(
    (t) => t.className.includes('field__input') || t.tag === 'input',
  );
  const needsLabelControl = targets.some(
    (t) =>
      t.className.includes('checkbox') ||
      t.className.includes('radio') ||
      t.className.includes('switch') ||
      t.tag === 'label',
  );
  const needsMenu = targets.some((t) => t.className.includes('menu__item'));
  const needsNav = targets.some(
    (t) => t.className.includes('ds-nav') || (t.tag === 'a' && t.height < MIN_TOUCH),
  );
  const needsTooltip = targets.some((t) => t.className.includes('label__tooltip'));
  const needsBtnCard = targets.some(
    (t) => t.className.includes('btn') && t.height < MIN_TOUCH,
  );

  if (needsField) {
    if (bumpScssVariable(root, 'field-min-height', '2.625rem', '2.75rem')) {
      fixes.push('SCSS: $field-min-height → 2.75rem (44px)');
      applied++;
    }
  }

  if (needsMenu || needsBtnCard) {
    if (bumpScssVariable(root, 'field-min-height', '2.625rem', '2.75rem')) {
      if (!fixes.includes('SCSS: $field-min-height → 2.75rem (44px)')) {
        fixes.push('SCSS: $field-min-height → 2.75rem (menu/items)');
        applied++;
      }
    }
    if (bumpScssVariable(root, 'btn-height-card', '2.625rem', '2.75rem')) {
      fixes.push('SCSS: $btn-height-card → 2.75rem');
      applied++;
    }
  }

  const cssRules = [];
  if (needsLabelControl) {
    cssRules.push(
      'label.checkbox,',
      'label.radio,',
      'label.switch {',
      '  min-height: var(--min-touch-target, 44px);',
      '  align-items: center;',
      '}',
    );
  }
  if (needsField) {
    cssRules.push(
      '.field__input,',
      '.field__textarea {',
      '  min-height: var(--min-touch-target, 44px);',
      '}',
      '.field {',
      '  min-height: var(--min-touch-target, 44px);',
      '}',
    );
  }
  if (needsMenu) {
    cssRules.push('.menu__item { min-height: var(--min-touch-target, 44px); }');
  }
  if (needsNav) {
    cssRules.push(
      '.ds-nav a {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  min-height: var(--min-touch-target, 44px);',
      '  padding: var(--space-1) var(--space-2);',
      '}',
    );
  }
  if (needsTooltip) {
    cssRules.push(
      '.label__tooltip {',
      '  min-width: var(--min-touch-target, 44px);',
      '  min-height: var(--min-touch-target, 44px);',
      '}',
    );
  }

  if (cssRules.length && appendAutoFixCssAll(root, AUTO_FIX_MARKER, cssRules.join('\n'))) {
    fixes.push('CSS: styles/playwright-auto-fix.css (cibles tactiles)');
    applied++;
  }

  if (!applied) skipped.push('touch-target: correctifs déjà présents ou non mappés');

  return { applied, fixes, skipped };
}

function bumpScssVariable(root, name, from, to) {
  const file = path.join(root, 'scss/abstracts/_variables.scss');
  let content = fs.readFileSync(file, 'utf-8');
  const pattern = new RegExp(`\\$${name}:\\s*${escapeRe(from)}`);
  if (!pattern.test(content)) return false;
  content = content.replace(pattern, `$${name}: ${to}`);
  fs.writeFileSync(file, content, 'utf-8');
  return true;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
