/**
 * Autocomplete behavior for PimentCSS markup (docs + reference for apps).
 * Same integration model as date-picker-behavior.ts: wire every .autocomplete on the page.
 */

import { AUTOCOMPLETE_PEOPLE, type AutocompleteSuggestion } from './autocomplete-suggestions';
import { ICON } from './icon';

const WIRED = 'data-piment-autocomplete-wired';
const LIVE = 'data-autocomplete-live';
const SELECTED_VALUE = 'data-ac-selected-value';

const PERSON_ICON = ICON.user('menu__item-icon');
const BOOKMARK_ICON = ICON.bookmark('menu__item-icon');

function optionId(listId: string, index: number): string {
  return `${listId}-opt-${index}`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function buildOptionHtml(
  person: AutocompleteSuggestion,
  listId: string,
  index: number,
  selected: boolean,
): string {
  const id = optionId(listId, index);
  const sel = selected ? ' menu__item--selected' : '';
  const ariaSel = selected ? ' aria-selected="true"' : '';
  return `<button type="button" class="menu__item${sel} focus-visible" id="${id}" role="option"${ariaSel} data-ac-value="${escapeAttr(person.name)}">
        <span class="menu__item-icon">${PERSON_ICON}</span>
        <span class="menu__item-label">
          <span class="menu__item-title">${person.name}</span>
          <span class="menu__item-desc">${person.role}</span>
        </span>
        <span class="menu__item-icon">${BOOKMARK_ICON}</span>
      </button>`;
}

function getOptions(root: HTMLElement): HTMLButtonElement[] {
  return [...root.querySelectorAll<HTMLButtonElement>('.autocomplete__panel .menu__item[role="option"]')];
}

function optionSearchText(btn: HTMLButtonElement): string {
  const title = btn.querySelector('.menu__item-title')?.textContent?.trim() ?? '';
  const desc = btn.querySelector('.menu__item-desc')?.textContent?.trim() ?? '';
  return `${title} ${desc}`.trim().toLowerCase();
}

export function wireAutocomplete(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;

  const input = root.querySelector<HTMLInputElement>('.autocomplete__input');
  const panel = root.querySelector<HTMLElement>('.autocomplete__panel');
  const clearBtn = root.querySelector<HTMLButtonElement>('.autocomplete__clear');
  const searchBtn = root.querySelector<HTMLButtonElement>('.autocomplete__search');
  if (!input || !panel) return;

  root.setAttribute(WIRED, 'true');

  if (!panel.id) {
    panel.id = `autocomplete-panel-${Math.random().toString(36).slice(2, 9)}`;
  }
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', panel.id);

  const listId = panel.id;
  let activeIndex = -1;

  const injectPeople = () => {
    const list = panel.querySelector('.menu__list');
    if (!list) return;
    list.innerHTML = AUTOCOMPLETE_PEOPLE.map((person, i) => buildOptionHtml(person, listId, i, false)).join('');
  };

  if (root.hasAttribute(LIVE) && !panel.querySelector('.menu__item')) {
    injectPeople();
  }

  const setHasSelection = (active: boolean, committedValue = '') => {
    if (active && committedValue) {
      root.classList.add('autocomplete--has-value');
      root.setAttribute(SELECTED_VALUE, committedValue);
      clearBtn?.removeAttribute('hidden');
    } else {
      root.classList.remove('autocomplete--has-value');
      root.removeAttribute(SELECTED_VALUE);
      clearBtn?.setAttribute('hidden', '');
    }
  };

  const committedValue = (): string => root.getAttribute(SELECTED_VALUE) ?? '';

  if (root.classList.contains('autocomplete--has-value') && input.value.trim()) {
    setHasSelection(true, input.value.trim());
  } else {
    setHasSelection(false);
  }

  const setOpen = (open: boolean) => {
    if (open) {
      document.querySelectorAll<HTMLElement>('.autocomplete.autocomplete--open').forEach((other) => {
        if (other === root) return;
        other.classList.remove('autocomplete--open');
        const otherInput = other.querySelector<HTMLInputElement>('.autocomplete__input');
        otherInput?.setAttribute('aria-expanded', 'false');
      });
    }
    root.classList.toggle('autocomplete--open', open);
    input.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) {
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
      getOptions(root).forEach((el) => el.classList.remove('menu__item--hover'));
    }
  };

  const visibleOptions = (): HTMLButtonElement[] =>
    getOptions(root).filter((btn) => !btn.hidden && btn.style.display !== 'none');

  const filterOptions = () => {
    const query = input.value.trim().toLowerCase();
    getOptions(root).forEach((btn) => {
      const haystack = optionSearchText(btn);
      const match = !query || haystack.includes(query);
      btn.hidden = !match;
      btn.style.display = match ? '' : 'none';
    });
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
    getOptions(root).forEach((el) => el.classList.remove('menu__item--hover'));
  };

  const selectOption = (btn: HTMLButtonElement) => {
    const value =
      btn.dataset.acValue ?? btn.querySelector('.menu__item-title')?.textContent?.trim() ?? '';
    input.value = value;
    input.setAttribute('aria-live', 'polite');
    setHasSelection(true, value);
    getOptions(root).forEach((el) => {
      const on = el === btn;
      el.classList.toggle('menu__item--selected', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    setOpen(false);
    input.focus();
  };

  const setActiveOption = (index: number) => {
    const opts = visibleOptions();
    if (!opts.length) {
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    const clamped = ((index % opts.length) + opts.length) % opts.length;
    activeIndex = clamped;
    const btn = opts[clamped];
    if (!btn.id) btn.id = optionId(listId, clamped);
    input.setAttribute('aria-activedescendant', btn.id);
    opts.forEach((el) => el.classList.remove('menu__item--hover'));
    btn.classList.add('menu__item--hover');
    btn.scrollIntoView({ block: 'nearest' });
  };

  setOpen(root.classList.contains('autocomplete--open'));

  input.addEventListener('focus', () => {
    filterOptions();
    setOpen(true);
  });

  input.addEventListener('input', () => {
    const committed = committedValue();
    if (committed && input.value.trim() !== committed) {
      setHasSelection(false);
      getOptions(root).forEach((el) => {
        el.classList.remove('menu__item--selected');
        el.setAttribute('aria-selected', 'false');
      });
    }
    filterOptions();
    setOpen(true);
  });

  clearBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    input.value = '';
    setHasSelection(false);
    filterOptions();
    getOptions(root).forEach((el) => {
      el.classList.remove('menu__item--selected');
      el.setAttribute('aria-selected', 'false');
    });
    setOpen(false);
    input.focus();
  });

  searchBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    filterOptions();
    setOpen(true);
    input.focus();
  });

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('.menu__item[role="option"]');
    if (!btn || btn.hidden) return;
    event.stopPropagation();
    selectOption(btn);
  });

  root.addEventListener('click', (event) => event.stopPropagation());

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (root.classList.contains('autocomplete--open')) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!root.classList.contains('autocomplete--open')) setOpen(true);
      setActiveOption(activeIndex + 1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!root.classList.contains('autocomplete--open')) setOpen(true);
      setActiveOption(activeIndex <= 0 ? visibleOptions().length - 1 : activeIndex - 1);
      return;
    }
    if (event.key === 'Enter' && root.classList.contains('autocomplete--open')) {
      const opts = visibleOptions();
      if (activeIndex >= 0 && opts[activeIndex]) {
        event.preventDefault();
        selectOption(opts[activeIndex]);
      }
    }
  });
}

export function wireAllAutocompletes(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.autocomplete').forEach(wireAutocomplete);
}

let dismissBound = false;

export function bindAutocompleteDismiss(): void {
  if (dismissBound) return;
  dismissBound = true;

  document.addEventListener('click', () => {
    document.querySelectorAll<HTMLElement>('.autocomplete.autocomplete--open').forEach((root) => {
      root.classList.remove('autocomplete--open');
      const input = root.querySelector<HTMLInputElement>('.autocomplete__input');
      input?.setAttribute('aria-expanded', 'false');
    });
  });
}

/** Shown in docs (bootstrap); full logic is in this file. */
export const AUTOCOMPLETE_REFERENCE_JS = `// Copy from docs-site/src/lib/autocomplete-behavior.ts (same pattern as date-picker-behavior.ts)
import { bindAutocompleteDismiss, wireAllAutocompletes } from './autocomplete-behavior';

bindAutocompleteDismiss();
wireAllAutocompletes();

// Markup: type="text" on .autocomplete__input (not type="search") to avoid the native clear icon.
// Toggle .autocomplete--has-value after a list selection to show .autocomplete__clear.`;
