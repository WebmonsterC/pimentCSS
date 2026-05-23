/**
 * Shared palette metadata for docs & preview CSS generation.
 * Source of truth for steps: tokens/colors.css
 */

export const PALETTES = [
  { id: 'primary', title: 'Primary', alias: 'Lagoon teal', defaultStep: '600', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { id: 'accent', title: 'Accent', alias: 'Sunset mango', defaultStep: '500', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { id: 'neutral', title: 'Neutral', alias: 'Warm sand', defaultStep: '500', steps: ['100', '200', '300', '400', '450', '500', '600', '700', '800', '900'] },
  { id: 'information', title: 'Information', alias: 'Lagoon cyan', defaultStep: '500', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { id: 'success', title: 'Success', alias: 'Tropical green', defaultStep: '500', steps: ['100', '200', '300', '400', '500', '600', '650', '700', '800', '900'] },
  { id: 'warning', title: 'Warning', alias: 'Papaya', defaultStep: '500', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { id: 'error', title: 'Error', alias: 'Hibiscus', defaultStep: '500', steps: ['100', '200', '300', '400', '450', '500', '600', '700', '800', '900'] },
  { id: 'shades', title: 'Shades', alias: null, defaultStep: null, steps: ['white', 'black'] },
];

export function getOklch(css, paletteId, step) {
  const key = paletteId === 'shades' ? `neutral-${step}` : `${paletteId}-${step}`;
  const m = css.match(new RegExp(`--${key}:\\s*(oklch\\([^)]+\\))`));
  return m ? m[1] : '';
}

export function chipLabel(step, defaultStep) {
  if (defaultStep && step === defaultStep) return `${step} · default`;
  return step;
}

export function renderPaletteChip(paletteId, step, oklch, defaultStep) {
  const label = chipLabel(step, defaultStep);
  const oklchHtml = oklch
    ? `<code class="palette__oklch">${oklch}</code>`
    : '';
  const titleAttr = oklch ? ` title="${oklch}"` : '';
  return `              <div class="palette__chip palette__chip--${paletteId}-${step}"${titleAttr}>
                <span class="palette__step">${label}</span>
                ${oklchHtml}
              </div>`;
}

export function buildPalettesGrid(css) {
  let grid = '';
  for (const p of PALETTES) {
    const alias = p.alias ? `<p class="palette__alias">${p.alias}</p>` : '';
    const chips = p.steps
      .map((step) => {
        const oklch = getOklch(css, p.id, step);
        return renderPaletteChip(p.id, step, oklch, p.defaultStep);
      })
      .join('\n');
    grid += `          <div>
            <p class="palette__title">${p.title}</p>
            ${alias}
            <div class="palette">
${chips}
            </div>
          </div>\n`;
  }
  return grid;
}
