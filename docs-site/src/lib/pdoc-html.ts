/** HTML helpers for code blocks and step guides (documentation). */

import { ICON } from './icon';
import { normalizeSnippetCodeSSR } from './normalize-code-ssr';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const COPY_ICON = ICON.copy();
const CHEVRON_ICON = ICON.chevronDown();

const TERMINAL_CHROME =
  '<span class="pdoc-terminal__chrome" aria-hidden="true"><span></span><span></span><span></span></span>';

let snippetSeq = 0;

function nextSnippetPanelId(): string {
  snippetSeq += 1;
  return `pdoc-snippet-panel-${snippetSeq}`;
}

export type PdocSnippetOptions = {
  /** When true, code panel is visible on load (used in Customize step guides). */
  expanded?: boolean;
};

function collapsibleSnippetShell(
  label: string,
  lang: string,
  extraClass: string,
  preAttrs: string,
  codeInner: string,
  expanded = false,
): string {
  const panelId = nextSnippetPanelId();
  const toggleLabel = expanded ? `Hide ${label} code` : `Show ${label} code`;
  const collapsedClass = expanded ? '' : ' pdoc-snippet--collapsed';
  const expandedAttr = expanded ? ' data-pdoc-expanded="true"' : '';
  const preHidden = expanded ? '' : ' hidden';
  return `<div class="pdoc-snippet pdoc-snippet--collapsible${collapsedClass}${extraClass}" data-lang="${lang}"${expandedAttr}>
  <div class="pdoc-snippet__header">
    <button type="button" class="pdoc-snippet__toggle" aria-expanded="${expanded ? 'true' : 'false'}" aria-controls="${panelId}" aria-label="${escapeHtml(toggleLabel)}">
      ${CHEVRON_ICON}
      <span class="pdoc-snippet__label">${escapeHtml(label)}</span>
    </button>
    <button type="button" class="pdoc-snippet__copy" aria-label="Copy code">${COPY_ICON}</button>
  </div>
  <pre class="pdoc-snippet__pre" id="${panelId}"${preHidden}${preAttrs}><code>${codeInner}</code></pre>
</div>`;
}

/** Code block with header (file / terminal) and copy button. */
export function pdocSnippet(
  code: string,
  label: string,
  lang = 'text',
  opts: PdocSnippetOptions = {},
): string {
  const isTerminal = /^terminal$/i.test(label.trim());
  const mod = isTerminal ? ' pdoc-snippet--terminal' : '';
  const chrome = isTerminal ? TERMINAL_CHROME : '';
  const displayLabel = isTerminal ? 'Terminal' : label;
  const preLabel = isTerminal ? 'Terminal command' : `Source code: ${displayLabel}`;
  const preAttrs = ` tabindex="0" role="region" aria-label="${escapeHtml(preLabel)}"`;
  const formatted = normalizeSnippetCodeSSR(code, lang);
  const shell = collapsibleSnippetShell(
    displayLabel,
    lang,
    mod,
    preAttrs,
    escapeHtml(formatted),
    opts.expanded === true,
  );
  if (!chrome) return shell;
  return shell.replace(
    '<div class="pdoc-snippet__header">',
    `<div class="pdoc-snippet__header">\n    ${chrome}`,
  );
}

/** Terminal block (Astro docs style). */
export function pdocTerminal(code: string, lang = 'bash', opts: PdocSnippetOptions = {}): string {
  return pdocSnippet(code, 'Terminal', lang, opts);
}

export type PdocPackageTab = {
  id: 'npm' | 'pnpm' | 'yarn' | string;
  label: string;
  code: string;
  lang?: string;
};

/** Package manager tabs (npm / pnpm / yarn), like Astro install docs. */
export function pdocPackageTabs(tabs: PdocPackageTab[]): string {
  const tablist = tabs
    .map(
      (tab, i) =>
        `<button type="button" role="tab" class="pdoc-tabs__tab" id="pdoc-tab-${tab.id}" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="pdoc-panel-${tab.id}" tabindex="${i === 0 ? '0' : '-1'}" data-pdoc-tab="${escapeHtml(tab.id)}">${escapeHtml(tab.label)}</button>`,
    )
    .join('');
  const panels = tabs
    .map(
      (tab, i) =>
        `<div class="pdoc-tabs__panel" role="tabpanel" id="pdoc-panel-${tab.id}" aria-labelledby="pdoc-tab-${tab.id}"${i > 0 ? ' hidden' : ''} data-pdoc-panel="${escapeHtml(tab.id)}">${pdocTerminal(tab.code, tab.lang ?? 'bash', { expanded: true })}</div>`,
    )
    .join('');
  return `<div class="pdoc-tabs" data-pdoc-tabs>
  <div class="pdoc-tabs__list" role="tablist" aria-label="Package manager">${tablist}</div>
  ${panels}
</div>`;
}

export type PdocStep = {
  title: string;
  body: string;
  code: string;
  label: string;
  lang?: string;
  /** Anchor for “On this page” (must be unique on the page). */
  id?: string;
};

/** Numbered guide (Tailwind-style: text + code side by side on desktop). */
export function pdocSteps(steps: PdocStep[]): string {
  const items = steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      const idAttr = step.id ? ` id="${escapeHtml(step.id)}"` : '';
      return `<li class="pdoc-step">
  <div class="pdoc-step__aside">
    <span class="pdoc-step__num" aria-hidden="true">${num}</span>
    <div class="pdoc-step__text">
      <h3 class="pdoc-step__title"${idAttr}>${step.title}</h3>
      ${step.body}
    </div>
  </div>
  <div class="pdoc-step__code">${pdocSnippet(step.code, step.label, step.lang ?? 'text', { expanded: true })}</div>
</li>`;
    })
    .join('\n');
  return `<ol class="pdoc-steps">${items}</ol>`;
}
