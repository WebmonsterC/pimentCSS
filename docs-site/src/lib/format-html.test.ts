import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createRequire } from 'node:module';
import { prettyPrintElement } from './format-html';

const require = createRequire(import.meta.url);

describe('prettyPrintElement', () => {
  it('indents block children with 2 spaces (linkedom)', () => {
    const { parseHTML } = require('linkedom') as typeof import('linkedom');
    const { document } = parseHTML('<ul><li>A</li><li>B</li></ul>');
    const out = prettyPrintElement(document.documentElement as unknown as Element);
    assert.equal(out, '<ul>\n  <li>A</li>\n  <li>B</li>\n</ul>');
  });

  it('keeps inline subtrees on one line', () => {
    const { parseHTML } = require('linkedom') as typeof import('linkedom');
    const { document } = parseHTML('<button type="button" class="btn btn--primary">Go</button>');
    const out = prettyPrintElement(document.documentElement as unknown as Element);
    assert.equal(out, '<button type="button" class="btn btn--primary">Go</button>');
  });
});
