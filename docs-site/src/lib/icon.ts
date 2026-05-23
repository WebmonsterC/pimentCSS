/**
 * Phosphor icons for documentation demos (@phosphor-icons/web).
 * PimentCSS consumers choose their own icon library; slots are agnostic.
 */
export type IconSize = 16 | 20 | 24;

export function ph(name: string, size: IconSize = 24, extra = ''): string {
  const extraClass = extra ? ` ${extra.trim()}` : '';
  return `<i class="ph ph-${name}${extraClass}" style="font-size:${size}px" aria-hidden="true"></i>`;
}

/** Icons used in doc chrome and shared demos. */
export const ICON = {
  copy: () => ph('copy', 16, 'pdoc-icon'),
  copied: () => ph('check', 16, 'pdoc-icon'),
  chevronDown: (extra = 'pdoc-snippet__chevron', size: IconSize = 16) => ph('caret-down', size, extra),
  link: () => ph('link', 24, 'pdoc-anchor__icon'),
  menu: () => ph('list', 20),
  check: (extra = 'checkbox__icon checkbox__icon--check', size: IconSize = 20) =>
    ph('check', size, extra),
  minus: (extra = 'checkbox__icon checkbox__icon--minus') => ph('minus', 16, extra),
  arrowRight: (extra = '', size: IconSize = 24) => ph('arrow-right', size, extra),
  arrowLeft: (extra = '', size: IconSize = 24) => ph('arrow-left', size, extra),
  arrowDown: (extra = '', size: IconSize = 24) => ph('caret-down', size, extra),
  calendar: (extra = '', size: IconSize = 24) => ph('calendar', size, extra),
  search: (extra = 'field__icon', size: IconSize = 24) => ph('magnifying-glass', size, extra),
  mail: (extra = 'field__icon') => ph('envelope', 24, extra),
  phone: (extra = 'field__icon') => ph('phone', 24, extra),
  user: (extra = '') => ph('user-circle', 24, extra),
  bookmark: (extra = '') => ph('bookmark', 24, extra),
  cancel: (extra = '') => ph('x', 24, extra),
  home: (extra = 'tree__icon') => ph('house', 20, extra),
  folder: (extra = 'tree__icon') => ph('folder', 20, extra),
  sort: (extra = 'table__icon') => ph('arrows-down-up', 20, extra),
  information: (extra = 'snackbar__icon') => ph('info', 24, extra),
  snackbarSuccess: (extra = 'snackbar__icon') => ph('check-circle', 24, extra),
  snackbarWarning: (extra = 'snackbar__icon') => ph('warning', 24, extra),
  snackbarError: (extra = 'snackbar__icon') => ph('x-circle', 24, extra),
  snackbarLink: () => ph('link', 20, 'snackbar__link-icon'),
  alertInfo: (extra = 'alert__icon') => ph('info', 24, extra),
  alertSuccess: (extra = 'alert__icon') => ph('check-circle', 24, extra),
  alertWarning: (extra = 'alert__icon') => ph('warning', 24, extra),
  alertError: (extra = 'alert__icon') => ph('x-circle', 24, extra),
  docSearch: () =>
    `<svg class="pdoc-search__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><circle cx="6.75" cy="6.75" r="4.25" stroke="currentColor" stroke-width="1.75"/><path d="M9.75 9.75 13.25 13.25" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  linkForwardTrail: () =>
    `<svg class="link__icon link__icon--trail" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 3h6v6M10 14 21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
} as const;
