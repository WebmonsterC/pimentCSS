/**
 * Interactive tag toggle (filter chips) for docs + reference for apps.
 */

import { ph } from './icon';

const WIRED = 'data-piment-tags-wired';
const LIVE = 'data-tags-live';

function tagLabel(btn: HTMLButtonElement): string {
  const stored = btn.dataset.tagLabel;
  if (stored) return stored;
  const text = btn.querySelector('.tag__label')?.textContent?.trim() ?? 'Tag';
  btn.dataset.tagLabel = text;
  return text;
}

function renderTag(btn: HTMLButtonElement, selected: boolean): void {
  const label = tagLabel(btn);
  btn.classList.toggle('tag--interactive-selected', selected);
  btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
  if (selected) {
    btn.innerHTML = `<span class="tag__label">${label}</span>${ph('x', 16, 'tag__icon')}`;
  } else {
    btn.innerHTML = `${ph('plus', 16, 'tag__icon tag__icon--add')}<span class="tag__label">${label}</span>`;
  }
}

export function wireTags(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;

  const buttons = [...root.querySelectorAll<HTMLButtonElement>('.tag--interactive')];
  if (!buttons.length) return;

  root.setAttribute(WIRED, 'true');

  buttons.forEach((btn) => {
    const selected = btn.classList.contains('tag--interactive-selected');
    btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
    if (selected) renderTag(btn, true);

    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      renderTag(btn, !btn.classList.contains('tag--interactive-selected'));
    });
  });
}

export function wireAllTags(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-tags-live]').forEach(wireTags);
}

export const TAG_REFERENCE_JS = `import { wireAllTags } from './tag-behavior';

wireAllTags();`;
