/** Normalize documentation snippet source (indent, tabs, HTML pretty-print). */

import { prettyPrintHtml } from './format-html';

const TAB_WIDTH = 2;

/** Replace tabs with spaces and trim trailing whitespace per line. */
export function normalizeWhitespace(code: string): string {
  return code
    .replace(/\t/g, ' '.repeat(TAB_WIDTH))
    .split('\n')
    .map((line) => line.replace(/ +$/u, ''))
    .join('\n')
    .trim();
}

/** Remove the minimum shared leading indent from non-empty lines. */
export function dedent(code: string): string {
  const normalized = code.replace(/\t/g, ' '.repeat(TAB_WIDTH));
  const lines = normalized.split('\n');
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  if (lines.length === 0) return '';

  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0);
  const min = Math.min(...indents);
  if (min <= 0) return lines.join('\n');
  return lines.map((line) => line.slice(min)).join('\n');
}

/** Format snippet source for display and copy (2-space indent). */
export function normalizeSnippetCode(code: string, lang = 'text'): string {
  const langKey = lang.trim().toLowerCase();
  const dedented = dedent(code);

  if (langKey === 'html' || langKey === 'xml') {
    return prettyPrintHtml(dedented);
  }

  return normalizeWhitespace(dedented);
}
