/**
 * Button group behavior for PimentCSS markup (docs + reference for apps).
 */

const WIRED = 'data-piment-button-group-wired';
const LIVE = 'data-button-group-live';
const SINGLE = 'data-bg-single';

function clearItem(btn: HTMLButtonElement): void {
  btn.classList.remove('btn-group__item--selected');
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-checked', 'false');
}

function selectItem(btn: HTMLButtonElement): void {
  btn.classList.add('btn-group__item--selected');
  if (btn.getAttribute('role') === 'radio') {
    btn.setAttribute('aria-checked', 'true');
  } else {
    btn.setAttribute('aria-pressed', 'true');
  }
}

export function wireButtonGroup(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;

  const items = [...root.querySelectorAll<HTMLButtonElement>('.btn-group__item')];
  if (!items.length) return;

  root.setAttribute(WIRED, 'true');

  const isRadio = root.getAttribute('role') === 'radiogroup';
  const singleSelect = isRadio || root.hasAttribute(SINGLE);

  items.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;

      if (singleSelect) {
        items.forEach(clearItem);
        selectItem(btn);
        return;
      }

      if (btn.classList.contains('btn-group__item--selected')) {
        clearItem(btn);
      } else {
        selectItem(btn);
      }
    });

    btn.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const enabled = items.filter((b) => !b.disabled && b.getAttribute('aria-disabled') !== 'true');
      const idx = enabled.indexOf(btn);
      if (idx < 0) return;
      const next = event.key === 'ArrowRight' ? (idx + 1) % enabled.length : (idx - 1 + enabled.length) % enabled.length;
      enabled[next]?.focus();
      if (singleSelect) {
        items.forEach(clearItem);
        selectItem(enabled[next]!);
      }
    });
  });
}

export function wireAllButtonGroups(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.btn-group').forEach(wireButtonGroup);
}

export const BUTTON_GROUP_REFERENCE_JS =
  '// See docs-site/src/lib/button-group-behavior.ts (single-select, radiogroup, optional multi-toggle).';
