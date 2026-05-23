/**
 * Tree expand/collapse and row selection (docs + reference for apps).
 */

const WIRED = 'data-piment-tree-wired';
const LIVE = 'data-tree-live';

function clearSelection(root: HTMLElement): void {
  root.querySelectorAll('.tree__row--selected').forEach((row) => row.classList.remove('tree__row--selected'));
  root.querySelectorAll('.tree__content[aria-current]').forEach((btn) => btn.removeAttribute('aria-current'));
}

export function wireTree(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;

  root.setAttribute(WIRED, 'true');

  root.querySelectorAll<HTMLButtonElement>('.tree__content').forEach((btn) => {
    btn.addEventListener('click', () => {
      clearSelection(root);
      btn.closest('.tree__row')?.classList.add('tree__row--selected');
      btn.setAttribute('aria-current', 'true');
    });
  });

  root.querySelectorAll<HTMLButtonElement>('.tree__toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const li = toggle.closest('[role="treeitem"]');
      const group = li?.querySelector(':scope > .tree__group');
      if (!group) return;
      const open = !toggle.classList.contains('tree__toggle--open');
      toggle.classList.toggle('tree__toggle--open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (li) li.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (group instanceof HTMLElement) group.hidden = !open;
      const label = toggle.getAttribute('aria-label');
      if (label) {
        const base = label.replace(/^(Expand|Collapse)\s+/i, '');
        toggle.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} ${base}`);
      }
    });
  });
}

export function wireAllTrees(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.tree[data-tree-live]').forEach(wireTree);
}

export const TREE_REFERENCE_JS = `import { wireAllTrees } from './tree-behavior';

wireAllTrees();`;
