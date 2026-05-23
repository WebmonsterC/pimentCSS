/**
 * Dropdown behavior for PimentCSS markup (docs + reference for apps).
 */

const WIRED = 'data-piment-dropdown-wired';
const LIVE = 'data-dropdown-live';

function setOpen(root: HTMLElement, open: boolean): void {
  root.classList.toggle('dropdown--open', open);
  const trigger = root.querySelector<HTMLButtonElement>('.dropdown__trigger');
  const panel = root.querySelector<HTMLElement>('.dropdown__panel');
  if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (panel) {
    if (open) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
  }
}

function optionLabel(item: HTMLButtonElement): string {
  return (
    item.getAttribute('data-label')?.trim() ||
    item.querySelector('.menu__item-label')?.textContent?.trim() ||
    item.textContent?.trim() ||
    item.getAttribute('data-value')?.trim() ||
    ''
  );
}

function getOptions(root: HTMLElement): HTMLButtonElement[] {
  return [...root.querySelectorAll<HTMLButtonElement>('.dropdown__panel .menu__item[role="option"]')];
}

function selectOption(root: HTMLElement, item: HTMLButtonElement): void {
  const label = optionLabel(item);
  const value = item.getAttribute('data-value')?.trim() ?? label;
  const valueEl = root.querySelector<HTMLElement>('.dropdown__value');
  if (valueEl) {
    valueEl.textContent = label;
    valueEl.classList.add('dropdown__value--filled');
  }
  root.setAttribute('data-dropdown-value', value);

  getOptions(root).forEach((opt) => {
    const selected = opt === item;
    opt.classList.toggle('menu__item--selected', selected);
    opt.setAttribute('aria-selected', selected ? 'true' : 'false');
  });

  setOpen(root, false);
  clearActiveDescendant(root);
  root.querySelector<HTMLButtonElement>('.dropdown__trigger')?.focus();
}

function clearActiveDescendant(root: HTMLElement): void {
  const trigger = root.querySelector<HTMLButtonElement>('.dropdown__trigger');
  trigger?.removeAttribute('aria-activedescendant');
  getOptions(root).forEach((el) => el.classList.remove('menu__item--hover'));
  root.removeAttribute('data-dropdown-active-index');
}

function setActiveOption(root: HTMLElement, index: number): void {
  const trigger = root.querySelector<HTMLButtonElement>('.dropdown__trigger');
  const opts = getOptions(root).filter((btn) => !btn.disabled);
  if (!opts.length || !trigger) {
    clearActiveDescendant(root);
    return;
  }
  const clamped = ((index % opts.length) + opts.length) % opts.length;
  const btn = opts[clamped];
  const listbox = root.querySelector<HTMLElement>('.dropdown__panel .menu[role="listbox"]');
  const listId = listbox?.id || 'dropdown-list';
  if (!btn.id) btn.id = `${listId}-opt-${clamped}`;
  trigger.setAttribute('aria-activedescendant', btn.id);
  root.setAttribute('data-dropdown-active-index', String(clamped));
  opts.forEach((el) => el.classList.remove('menu__item--hover'));
  btn.classList.add('menu__item--hover');
  btn.scrollIntoView({ block: 'nearest' });
}

function activeIndex(root: HTMLElement): number {
  const raw = root.getAttribute('data-dropdown-active-index');
  return raw ? Number(raw) : -1;
}

export function wireDropdown(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;

  const trigger = root.querySelector<HTMLButtonElement>('.dropdown__trigger');
  const panel = root.querySelector<HTMLElement>('.dropdown__panel');
  const listbox = panel?.querySelector<HTMLElement>('.menu[role="listbox"]');
  if (!trigger || !panel || !listbox) return;

  if (!listbox.id) {
    listbox.id = `dropdown-list-${Math.random().toString(36).slice(2, 9)}`;
  }
  trigger.setAttribute('aria-controls', listbox.id);

  root.setAttribute(WIRED, 'true');
  setOpen(root, root.classList.contains('dropdown--open'));

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = !root.classList.contains('dropdown--open');
    setOpen(root, open);
    if (open) {
      const selected = getOptions(root).findIndex(
        (opt) => opt.classList.contains('menu__item--selected') || opt.getAttribute('aria-selected') === 'true',
      );
      setActiveOption(root, selected >= 0 ? selected : 0);
    } else {
      clearActiveDescendant(root);
    }
  });

  root.addEventListener('click', (event) => event.stopPropagation());

  getOptions(root).forEach((item) => {
    item.addEventListener('click', () => {
      if (item.disabled) return;
      selectOption(root, item);
    });
  });

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && root.classList.contains('dropdown--open')) {
      event.preventDefault();
      setOpen(root, false);
      clearActiveDescendant(root);
      trigger.focus();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!root.classList.contains('dropdown--open')) {
        setOpen(root, true);
        setActiveOption(root, 0);
        return;
      }
      setActiveOption(root, activeIndex(root) + 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!root.classList.contains('dropdown--open')) {
        setOpen(root, true);
        setActiveOption(root, getOptions(root).filter((o) => !o.disabled).length - 1);
        return;
      }
      setActiveOption(root, activeIndex(root) - 1);
      return;
    }

    if (event.key === 'Home' && root.classList.contains('dropdown--open')) {
      event.preventDefault();
      setActiveOption(root, 0);
      return;
    }

    if (event.key === 'End' && root.classList.contains('dropdown--open')) {
      event.preventDefault();
      setActiveOption(root, getOptions(root).filter((o) => !o.disabled).length - 1);
      return;
    }

    if (
      (event.key === 'Enter' || event.key === ' ') &&
      root.classList.contains('dropdown--open')
    ) {
      const opts = getOptions(root).filter((o) => !o.disabled);
      const idx = activeIndex(root);
      if (idx >= 0 && opts[idx]) {
        event.preventDefault();
        selectOption(root, opts[idx]);
      }
    }

    if ((event.key === 'Enter' || event.key === ' ') && !root.classList.contains('dropdown--open')) {
      if (event.target === trigger) {
        event.preventDefault();
        setOpen(root, true);
        setActiveOption(root, 0);
      }
    }
  };

  trigger.addEventListener('keydown', onKeydown);
  root.addEventListener('keydown', onKeydown);
}

export function wireAllDropdowns(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.dropdown').forEach(wireDropdown);
}

let dismissBound = false;

export function bindDropdownDismiss(): void {
  if (dismissBound) return;
  dismissBound = true;

  document.addEventListener('click', () => {
    document.querySelectorAll<HTMLElement>('.dropdown.dropdown--open').forEach((root) => {
      setOpen(root, false);
      clearActiveDescendant(root);
    });
  });
}

export const DROPDOWN_REFERENCE_JS = `import { bindDropdownDismiss, wireAllDropdowns } from './menu-dropdown-behavior';

bindDropdownDismiss();
wireAllDropdowns();

// Markup: .dropdown[data-dropdown-live], button.dropdown__trigger[aria-expanded][aria-controls],
// .menu[role="listbox"]#id, options with role="option" and optional data-label / data-value.`;
