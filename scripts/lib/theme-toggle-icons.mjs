import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const iconsDir = join(dirname(fileURLToPath(import.meta.url)), "../../assets/icons/theme-toggle");

/**
 * Inline SVG for theme toggle (not in Figma icon font).
 * @param {"sun"|"moon"} name
 * @param {string} [extraClass]
 */
export function themeToggleIcon(name, extraClass = "theme-toggle__icon") {
  const file = name === "sun" ? "sun.svg" : "moon.svg";
  const svg = readFileSync(join(iconsDir, file), "utf8").trim();
  return svg.replace("<svg", `<svg class="${extraClass}"`);
}

export const themeToggleIconSun = (extraClass) => themeToggleIcon("sun", extraClass);
export const themeToggleIconMoon = (extraClass) => themeToggleIcon("moon", extraClass);
