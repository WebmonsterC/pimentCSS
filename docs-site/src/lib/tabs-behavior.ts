/**
 * Tabs behavior for PimentCSS markup (docs + reference for apps).
 */

const WIRED = 'data-piment-tabs-wired';
const LIVE = 'data-tabs-live';

function getTabs(root: HTMLElement): HTMLButtonElement[] {
  return [...root.querySelectorAll<HTMLButtonElement>('.tabs__list .tab[role="tab"]')];
}

function getPanels(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.tab-panel[role="tabpanel"]')];
}

function selectTab(root: HTMLElement, tab: HTMLButtonElement, focus = false): void {
  if (tab.disabled || tab.getAttribute('aria-disabled') === 'true') return;

  const panelId = tab.getAttribute('aria-controls');
  const tabs = getTabs(root);
  const panels = getPanels(root);

  tabs.forEach((t) => {
    const on = t === tab;
    t.classList.toggle('tab--selected', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.setAttribute('tabindex', on ? '0' : '-1');
  });

  panels.forEach((panel) => {
    const show = panel.id === panelId;
    if (show) {
      panel.removeAttribute('hidden');
      panel.setAttribute('aria-hidden', 'false');
    } else {
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  if (focus) tab.focus();
}

export function wireTabs(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;

  const tabs = getTabs(root);
  if (!tabs.length) return;

  root.setAttribute(WIRED, 'true');

  const initial =
    tabs.find((t) => t.getAttribute('aria-selected') === 'true' && !t.disabled) ??
    tabs.find((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true') ??
    tabs[0];
  if (initial) selectTab(root, initial);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectTab(root, tab));

    tab.addEventListener('keydown', (event) => {
      const enabled = tabs.filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
      const idx = enabled.indexOf(tab);
      if (idx < 0) return;

      let target: HTMLButtonElement | undefined;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          target = enabled[(idx + 1) % enabled.length];
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          target = enabled[(idx - 1 + enabled.length) % enabled.length];
          break;
        case 'Home':
          event.preventDefault();
          target = enabled[0];
          break;
        case 'End':
          event.preventDefault();
          target = enabled[enabled.length - 1];
          break;
        default:
          return;
      }

      if (target) selectTab(root, target, true);
    });
  });
}

export function wireAllTabs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.tabs[data-tabs-live]').forEach(wireTabs);
}

export const TABS_REFERENCE_JS =
  '// See docs-site/src/lib/tabs-behavior.ts (tablist selection, panels, arrow keys, Home/End).';
