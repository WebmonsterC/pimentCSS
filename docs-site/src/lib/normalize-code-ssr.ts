/** Snippet normalization at Astro build time (Node + linkedom). */

import { createRequire } from 'node:module';
import { prettyPrintElement, prettyPrintFromBody } from './format-html';
import { dedent, normalizeWhitespace } from './normalize-code';

const require = createRequire(import.meta.url);

function parseFragmentRoot(source: string): Element {
  const { parseHTML } = require('linkedom') as typeof import('linkedom');
  const { document } = parseHTML(source);
  const root = document.documentElement;
  if (root.tagName.toLowerCase() === 'html') return document.body as unknown as Element;
  return root as unknown as Element;
}

function prettyPrintHtmlSSR(html: string): string {
  const source = html.trim();
  if (!source) return '';

  try {
    const root = parseFragmentRoot(source);
    if (root.tagName.toLowerCase() === 'body') {
      return prettyPrintFromBody(root);
    }
    return prettyPrintElement(root);
  } catch {
    return source.replace(/>\s+</g, '>\n<');
  }
}

/** Same contract as {@link normalizeSnippetCode} for static HTML generation. */
export function normalizeSnippetCodeSSR(code: string, lang = 'text'): string {
  const langKey = lang.trim().toLowerCase();
  const dedented = dedent(code);

  if (langKey === 'html' || langKey === 'xml') {
    return prettyPrintHtmlSSR(dedented);
  }

  return normalizeWhitespace(dedented);
}
