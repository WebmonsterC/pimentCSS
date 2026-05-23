export type CreditEntry = {
  firstName: string;
  name: string;
  role: string;
};

export type ThanksEntry = {
  name: string;
};

export const CREDITS_TAGLINE = "Piment wasn't built alone.";

/** Sorted alphabetically by first name. */
export const CONTRIBUTORS: CreditEntry[] = [
  { firstName: 'Cédric', name: 'Cédric Martial', role: 'Design system' },
  { firstName: 'Ronny', name: 'Ronny Laposte', role: 'Technical contributor' },
  { firstName: 'Sébastien', name: 'Sébastien Jacobin', role: 'Engineer and developer' },
  { firstName: 'Xavier', name: 'Xavier Simacourbe', role: 'Technical designer' },
].sort((a, b) => a.firstName.localeCompare(b.firstName, 'en', { sensitivity: 'base' }));

/** Optional shout-outs (e.g. { name: '.r3tr0_' }). */
export const THANKS: ThanksEntry[] = [];

export function buildCreditsHtml(): string {
  const items = CONTRIBUTORS.map((c) => `<li><strong>${c.name}</strong>: ${c.role}</li>`).join('\n          ');

  const thanksBlock =
    THANKS.length > 0
      ? `<h3 id="thanks">Acknowledgements</h3>
        <ul class="pdoc-credits__thanks">
          ${THANKS.map((t) => `<li>${t.name}</li>`).join('\n          ')}
        </ul>`
      : '';

  return `
        <h2 id="credits">Credits</h2>
        <p class="pdoc-credits__tagline"><em>${CREDITS_TAGLINE}</em></p>
        <ul class="pdoc-credits__list">
          ${items}
        </ul>
        ${thanksBlock}`;
}

export function buildCreditsMarkdown(): string {
  const lines = CONTRIBUTORS.map((c) => `- **${c.name}**: ${c.role}`);
  const thanks =
    THANKS.length > 0
      ? `\n\n### Acknowledgements\n\n${THANKS.map((t) => `- ${t.name}`).join('\n')}`
      : '';

  return `## Credits

*${CREDITS_TAGLINE}*

Contributors (alphabetical by first name):

${lines.join('\n')}${thanks}
`;
}
