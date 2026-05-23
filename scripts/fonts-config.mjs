/**
 * Fonts required by PimentCSS v1 (minimal subset).
 * Source files live in /fonts — only .woff2 is used in production CSS.
 */

export const FONTS_DIR = 'fonts';

/** @typedef {{ id: string, family: string, weight: number, style: 'normal' | 'italic', fileBase: string }} FontEntry */

/** @type {FontEntry[]} */
export const REQUIRED_FONTS = [
  { id: 'zodiak-bold', family: 'Zodiak', weight: 700, style: 'normal', fileBase: 'Zodiak-Bold' },
  { id: 'pjs-regular', family: 'Plus Jakarta Sans', weight: 400, style: 'normal', fileBase: 'PlusJakartaSans-Regular' },
  { id: 'pjs-medium', family: 'Plus Jakarta Sans', weight: 500, style: 'normal', fileBase: 'PlusJakartaSans-Medium' },
  { id: 'pjs-semibold', family: 'Plus Jakarta Sans', weight: 600, style: 'normal', fileBase: 'PlusJakartaSans-SemiBold' },
  { id: 'pjs-bold', family: 'Plus Jakarta Sans', weight: 700, style: 'normal', fileBase: 'PlusJakartaSans-Bold' },
  { id: 'pjs-italic', family: 'Plus Jakarta Sans', weight: 400, style: 'italic', fileBase: 'PlusJakartaSans-Italic' },
];
