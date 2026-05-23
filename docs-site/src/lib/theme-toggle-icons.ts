import sunSvg from '../../../assets/icons/theme-toggle/sun.svg?raw';
import moonSvg from '../../../assets/icons/theme-toggle/moon.svg?raw';

function withClass(svg: string, extraClass = 'theme-toggle__icon'): string {
  return svg.trim().replace('<svg', `<svg class="${extraClass}"`);
}

/** Soleil, mode clair (SVG dédié doc). */
export const themeToggleIconSun = (extraClass?: string) => withClass(sunSvg, extraClass);

/** Lune, mode sombre (SVG dédié doc). */
export const themeToggleIconMoon = (extraClass?: string) => withClass(moonSvg, extraClass);
