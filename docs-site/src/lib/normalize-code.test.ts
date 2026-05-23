import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dedent, normalizeSnippetCode, normalizeWhitespace } from './normalize-code';
import { normalizeSnippetCodeSSR } from './normalize-code-ssr';

describe('dedent', () => {
  it('removes shared leading spaces', () => {
    const input = `    line one\n    line two`;
    assert.equal(dedent(input), 'line one\nline two');
  });

  it('converts tabs to two spaces before dedenting', () => {
    const input = '\t\t<div></div>';
    assert.equal(dedent(input), '<div></div>');
  });
});

describe('normalizeWhitespace', () => {
  it('trims trailing spaces and outer blank lines', () => {
    assert.equal(normalizeWhitespace('  a  \n  b  \n'), 'a\n  b');
  });
});

describe('normalizeSnippetCode (HTML)', () => {
  it('pretty-prints nested markup with 2-space indent (SSR)', () => {
    const raw = '<div><p>Hi</p></div>';
    const out = normalizeSnippetCodeSSR(raw, 'html');
    assert.equal(out, '<div>\n  <p>Hi</p>\n</div>');
  });

  it('matches client path when DOMParser is available', () => {
    if (typeof DOMParser === 'undefined') return;
    const raw = '<article><span>x</span></article>';
    assert.equal(
      normalizeSnippetCode(raw, 'html'),
      normalizeSnippetCodeSSR(raw, 'html'),
    );
  });
});

describe('normalizeSnippetCode (non-HTML)', () => {
  it('normalizes bash without reformatting structure', () => {
    const raw = '\tnpm install pimentcss-design-system\n';
    assert.equal(normalizeSnippetCodeSSR(raw, 'bash'), 'npm install pimentcss-design-system');
  });
});
