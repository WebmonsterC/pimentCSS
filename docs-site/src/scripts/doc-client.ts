/**
 * PimentCSS documentation — search, TOC, examples, code blocks, theme
 */
import { highlightCode } from '../lib/doc-code';
import { normalizeSnippetCode } from '../lib/normalize-code';
import { initSemanticSwatches } from '../lib/semantic-swatches';
import { applyTheme, resolveTheme, setTheme, type ThemeMode } from '../lib/theme';
import { bindAutocompleteDismiss, wireAllAutocompletes } from '../lib/autocomplete-behavior';
import { wireAllButtonGroups } from '../lib/button-group-behavior';
import { wireAllHeaderNavs } from '../lib/navigation-behavior';
import { bindDropdownDismiss, wireAllDropdowns } from '../lib/menu-dropdown-behavior';
import { wireAllTabs } from '../lib/tabs-behavior';
import { wireAllPaginations } from '../lib/pagination-behavior';
import { wireAllAnchorNavs } from '../lib/anchor-behavior';
import { wireAllCarousels } from '../lib/carousel-behavior';
import { wireAllTables } from '../lib/table-behavior';
import { wireAllTrees } from '../lib/tree-behavior';
import { wireAllTags } from '../lib/tag-behavior';
import { wireAllAlerts } from '../lib/alert-behavior';
import { wireAllModals } from '../lib/modal-behavior';
import { wireAllSnackbars } from '../lib/snackbar-behavior';
import { wireAllProgress } from '../lib/progress-behavior';
import { wireAllLoaders } from '../lib/loader-behavior';
import './doc-search.ts';

function initCarousels(root: ParentNode = document): void {
  wireAllCarousels(root);
}

function initTables(root: ParentNode = document): void {
  wireAllTables(root);
}

function initTrees(root: ParentNode = document): void {
  wireAllTrees(root);
}

function initTags(root: ParentNode = document): void {
  wireAllTags(root);
}

function initAlerts(root: ParentNode = document): void {
  wireAllAlerts(root);
}

function initModals(root: ParentNode = document): void {
  wireAllModals(root);
}

function initSnackbars(root: ParentNode = document): void {
  wireAllSnackbars(root);
}

function initProgress(root: ParentNode = document): void {
  wireAllProgress(root);
}

function initLoaders(root: ParentNode = document): void {
  wireAllLoaders(root);
}
import { bindDatePickerDismiss, wireAllDatePickers } from '../lib/date-picker-behavior';
import { ICON } from '../lib/icon';

const COPY_ICON = ICON.copy();
const COPIED_ICON = ICON.copied();
const CHEVRON_ICON = ICON.chevronDown();

let snippetPanelSeq = 0;

function nextSnippetPanelId(): string {
  snippetPanelSeq += 1;
  return `pdoc-snippet-panel-${snippetPanelSeq}`;
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatPreviewHtml(preview: HTMLElement): string {
  if (preview.children.length > 0) {
    return [...preview.children]
      .map((el) => normalizeSnippetCode(el.outerHTML, 'html'))
      .join('\n\n');
  }
  return normalizeSnippetCode(preview.innerHTML, 'html');
}

function normalizeDemoCodePanel(demo: HTMLElement, preview: HTMLElement, lang: string): HTMLElement {
  const existing = demo.querySelector(':scope > .pdoc-demo__code');
  const panel = buildDemoCodePanel(preview, lang);
  if (existing) {
    existing.replaceWith(panel);
  } else {
    demo.appendChild(panel);
  }
  return panel;
}

async function copyText(btn: HTMLButtonElement, text: string) {
  const trimmed = text.trim();
  let ok = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(trimmed);
      ok = true;
    }
  } catch {
    /* fallback ci-dessous */
  }
  if (!ok) {
    try {
      const ta = document.createElement('textarea');
      ta.value = trimmed;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, trimmed.length);
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch {
      ok = false;
    }
  }
  const prevLabel = btn.getAttribute('aria-label') || 'Copy code';
  const prevHtml = btn.innerHTML;
  if (ok) {
    btn.classList.add('is-copied');
    btn.innerHTML = COPIED_ICON;
    btn.setAttribute('aria-label', 'Copied');
    setTimeout(() => {
      btn.classList.remove('is-copied');
      btn.innerHTML = prevHtml;
      btn.setAttribute('aria-label', prevLabel);
    }, 2000);
  } else {
    btn.setAttribute('aria-label', 'Copy failed');
    setTimeout(() => btn.setAttribute('aria-label', prevLabel), 2000);
  }
}

function syncDemoCollapsedState(block: HTMLElement, collapsed: boolean): void {
  const demo = block.closest('.pdoc-demo');
  if (!demo) return;
  demo.classList.toggle('pdoc-demo--code-collapsed', collapsed);
}

function setSnippetCollapsed(block: HTMLElement, collapsed: boolean): void {
  const toggle = block.querySelector<HTMLButtonElement>('.pdoc-snippet__toggle');
  const panel = block.querySelector<HTMLElement>('.pdoc-snippet__pre');
  if (!toggle || !panel) return;

  const label = block.querySelector('.pdoc-snippet__label')?.textContent?.trim() || 'code';
  block.classList.toggle('pdoc-snippet--collapsed', collapsed);
  toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  toggle.setAttribute('aria-label', collapsed ? `Show ${label} code` : `Hide ${label} code`);
  panel.hidden = collapsed;
  syncDemoCollapsedState(block, collapsed);
}

function enhanceCollapsibleSnippet(block: HTMLElement): void {
  if (block.dataset.pdocCollapsibleBound) return;
  if (block.dataset.pdocCollapsible === 'false') return;

  const header = block.querySelector('.pdoc-snippet__header');
  const panel = block.querySelector<HTMLElement>('.pdoc-snippet__pre');
  if (!header || !panel) return;

  block.classList.add('pdoc-snippet--collapsible');

  let toggle = block.querySelector<HTMLButtonElement>('.pdoc-snippet__toggle');
  if (!toggle) {
    const labelEl = header.querySelector('.pdoc-snippet__label');
    const labelText = labelEl?.textContent?.trim() || 'Code';
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'pdoc-snippet__toggle';
    toggle.innerHTML = `${CHEVRON_ICON}<span class="pdoc-snippet__label">${escapeHtml(labelText)}</span>`;
    if (labelEl) {
      labelEl.replaceWith(toggle);
    } else {
      header.prepend(toggle);
    }
  }

  if (!panel.id) panel.id = nextSnippetPanelId();
  toggle.setAttribute('aria-controls', panel.id);

  const startExpanded =
    block.dataset.pdocExpanded === 'true' ||
    Boolean(block.closest('.pdoc-step__code, .pdoc-tabs__panel'));
  setSnippetCollapsed(block, !startExpanded);

  toggle.addEventListener('click', () => {
    setSnippetCollapsed(block, !block.classList.contains('pdoc-snippet--collapsed'));
  });

  block.dataset.pdocCollapsibleBound = '1';
}

function bindCollapsibleSnippets(root: ParentNode = document): void {
  root.querySelectorAll('.pdoc-snippet').forEach((block) => {
    enhanceCollapsibleSnippet(block as HTMLElement);
  });
}

function bindCopyButtons(root: ParentNode = document) {
  root.querySelectorAll('.pdoc-snippet__copy:not([data-pdoc-copy-bound])').forEach((el) => {
    const btn = el as HTMLButtonElement;
    btn.dataset.pdocCopyBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const block = btn.closest('.pdoc-snippet');
      const text = block?.querySelector('code')?.textContent || '';
      void copyText(btn, text);
    });
  });
}

function initSnippets(root: ParentNode = document) {
  root.querySelectorAll('.pdoc-snippet').forEach((block) => {
    if (block.classList.contains('is-ready')) return;
    const lang = (block as HTMLElement).dataset.lang || 'text';
    const codeEl = block.querySelector('code');
    if (codeEl && !codeEl.querySelector('span')) {
      const raw = normalizeSnippetCode(codeEl.textContent || '', lang);
      codeEl.textContent = raw;
      codeEl.innerHTML = highlightCode(raw, lang);
    }
    block.querySelectorAll('.pdoc-snippet__pre').forEach((pre) => {
      const el = pre as HTMLElement;
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'region');
      if (!el.getAttribute('aria-label')) {
        const label = block.querySelector('.pdoc-snippet__label')?.textContent?.trim();
        el.setAttribute('aria-label', label ? `Source code: ${label}` : 'Source code');
      }
    });
    block.classList.add('is-ready');
  });
  bindCollapsibleSnippets(root);
  bindCopyButtons(root);

  /* Legacy pdoc-code-block — same behavior */
  root.querySelectorAll('.pdoc-code-block').forEach((legacy) => {
    if (legacy.classList.contains('is-ready')) return;
    const code = legacy.querySelector('code');
    const copyBtn = legacy.querySelector('.pdoc-example__copy, .pdoc-snippet__copy');
    if (code && !legacy.querySelector('.pdoc-snippet__header')) {
      const label = (legacy as HTMLElement).dataset.label || 'Code';
      const lang = (legacy as HTMLElement).dataset.lang || 'text';
      const wrap = document.createElement('div');
      wrap.className = 'pdoc-snippet';
      wrap.dataset.lang = lang;
      wrap.innerHTML = `
        <div class="pdoc-snippet__header">
          <button type="button" class="pdoc-snippet__toggle" aria-expanded="false">
            ${CHEVRON_ICON}
            <span class="pdoc-snippet__label">${label}</span>
          </button>
          <button type="button" class="pdoc-snippet__copy" aria-label="Copy code">${COPY_ICON}</button>
        </div>
        <pre class="pdoc-snippet__pre" hidden><code>${code.innerHTML || escapeHtml(code.textContent || '')}</code></pre>`;
      legacy.replaceWith(wrap);
      initSnippets(wrap.parentElement || document);
      return;
    }
    legacy.classList.add('is-ready');
  });
  bindCopyButtons(root);
}

function buildDemoCodePanel(preview: HTMLElement, lang: string): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'pdoc-demo__code';
  panel.dataset.lang = lang;
  const raw = normalizeSnippetCode(formatPreviewHtml(preview), lang);
  const codeExpanded =
    preview.closest<HTMLElement>('[data-pdoc-demo]')?.dataset.pdocCodeExpanded === 'true';
  const expandedAttr = codeExpanded ? ' data-pdoc-expanded="true"' : '';
  const preHidden = codeExpanded ? '' : ' hidden';
  const toggleExpanded = codeExpanded ? 'true' : 'false';
  panel.innerHTML = `
    <div class="pdoc-snippet pdoc-snippet--inset" data-lang="${lang}"${expandedAttr}>
      <div class="pdoc-snippet__header">
        <button type="button" class="pdoc-snippet__toggle" aria-expanded="${toggleExpanded}">
          ${CHEVRON_ICON}
          <span class="pdoc-snippet__label">HTML</span>
        </button>
        <button type="button" class="pdoc-snippet__copy" aria-label="Copy code">${COPY_ICON}</button>
      </div>
      <pre class="pdoc-snippet__pre"${preHidden}><code></code></pre>
    </div>`;
  const codeEl = panel.querySelector('code')!;
  codeEl.textContent = raw;
  codeEl.innerHTML = highlightCode(raw, lang);
  return panel;
}

function initDemos(root: ParentNode = document) {
  root.querySelectorAll('.pdoc-demo[data-pdoc-demo]').forEach((demo) => {
    if (demo.classList.contains('is-ready')) return;
    const preview = demo.querySelector('.pdoc-demo__preview') as HTMLElement | null;
    let codeWrap = demo.querySelector('.pdoc-demo__code') as HTMLElement | null;
    const lang = (demo.dataset.pdocLang || codeWrap?.dataset.lang || 'html') as string;
    if (preview) {
      const needsPanel =
        !codeWrap ||
        !codeWrap.querySelector('.pdoc-snippet') ||
        codeWrap.querySelector(':scope > pre');
      if (needsPanel) {
        codeWrap = normalizeDemoCodePanel(demo, preview, lang);
      } else {
        const codeEl = codeWrap.querySelector('code');
        if (codeEl && !codeEl.querySelector('span')) {
          const raw = normalizeSnippetCode(formatPreviewHtml(preview), lang);
          codeEl.textContent = raw;
          codeEl.innerHTML = highlightCode(raw, lang);
        }
      }
    }
    demo.classList.add('is-ready');
    initSnippets(demo);
    if (demo.dataset.pdocCodeExpanded === 'true') {
      expandSnippetsIn(demo);
    }
    initCarousels(demo);
    initTables(demo);
    initTrees(demo);
    initTags(demo);
    initAlerts(demo);
    initModals(demo);
    initSnackbars(demo);
    initProgress(demo);
    initLoaders(demo);
  });
}

function initLegacyExamples(root: ParentNode = document) {
  root.querySelectorAll('.pdoc-example').forEach((example) => {
    if (example.classList.contains('is-ready')) return;
    const preview = example.querySelector('.pdoc-example__preview') as HTMLElement | null;
    if (!preview) return;

    const demo = document.createElement('div');
    demo.className = 'pdoc-demo';
    demo.dataset.pdocDemo = '';
    const previewClone = preview.cloneNode(true) as HTMLElement;
    previewClone.classList.remove('pdoc-example__preview', 'is-hidden');
    previewClone.classList.add('pdoc-demo__preview');
    if (preview.classList.contains('pdoc-example__preview--muted')) {
      previewClone.classList.add('pdoc-demo__preview--muted');
    }
    demo.appendChild(previewClone);
    demo.appendChild(buildDemoCodePanel(previewClone, 'html'));
    example.replaceWith(demo);
    initDemos(demo.parentElement || document);
  });
}

function wrapDsSections() {
  document.querySelectorAll('.ds-section:not([data-pdoc-skip])').forEach((section) => {
    if (section.closest('.pdoc-demo, .pdoc-example')) return;
    const h2 = section.querySelector('h2');
    if (!h2) return;

    const toMove = [...section.childNodes].filter((n) => n !== h2);
    const demo = document.createElement('div');
    demo.className = 'pdoc-demo';
    demo.dataset.pdocDemo = '';
    const preview = document.createElement('div');
    preview.className = 'pdoc-demo__preview';
    toMove.forEach((node) => preview.appendChild(node));
    demo.appendChild(preview);
    demo.appendChild(buildDemoCodePanel(preview, 'html'));
    section.appendChild(demo);
  });
}

/* ── Sidebar scroll (persist between doc pages) ─────────────── */
const SIDEBAR_SCROLL_KEY = 'pdoc-sidebar-scroll';

function readSidebarScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
    if (raw === null) return null;
    const y = Number.parseInt(raw, 10);
    return Number.isFinite(y) && y >= 0 ? y : null;
  } catch {
    return null;
  }
}

function saveSidebarScroll(): void {
  const el = document.getElementById('pdoc-sidebar');
  if (!el) return;
  try {
    sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(el.scrollTop));
  } catch {
    /* private mode / quota */
  }
}

function restoreSidebarScroll(): void {
  const el = document.getElementById('pdoc-sidebar');
  const y = readSidebarScroll();
  if (!el || y === null) return;
  el.scrollTop = y;
}

function initSidebarScrollPersistence(): void {
  const el = document.getElementById('pdoc-sidebar');
  if (!el) return;

  restoreSidebarScroll();
  requestAnimationFrame(() => {
    restoreSidebarScroll();
    requestAnimationFrame(restoreSidebarScroll);
  });

  let saveScheduled = false;
  el.addEventListener(
    'scroll',
    () => {
      if (saveScheduled) return;
      saveScheduled = true;
      requestAnimationFrame(() => {
        saveScheduled = false;
        saveSidebarScroll();
      });
    },
    { passive: true },
  );

  window.addEventListener('pagehide', saveSidebarScroll);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) restoreSidebarScroll();
  });
}

initSidebarScrollPersistence();

/* ── Navigation mobile ───────────────────────────────────────── */
const sidebar = document.getElementById('pdoc-sidebar');
const toggle = document.getElementById('pdoc-menu-toggle');
const overlay = document.getElementById('pdoc-overlay');

function closeSidebar() {
  sidebar?.classList.remove('is-open');
  overlay?.classList.remove('is-visible');
  toggle?.setAttribute('aria-expanded', 'false');
}

toggle?.addEventListener('click', () => {
  const open = sidebar?.classList.toggle('is-open');
  overlay?.classList.toggle('is-visible', !!open);
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
});

overlay?.addEventListener('click', closeSidebar);

document.querySelectorAll('.pdoc-sidebar__link').forEach((link) => {
  link.addEventListener('click', () => {
    saveSidebarScroll();
    if (window.matchMedia('(max-width: 991px)').matches) closeSidebar();
  });
});

/* ── TOC ─────────────────────────────────────────────────────── */
const tocList = document.getElementById('pdoc-toc-list');
const main = document.querySelector('.pdoc-prose');
if (tocList && main) {
  const headings = main.querySelectorAll('h2[id], h3[id], .pdoc-step__title[id]');
  headings.forEach((h) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') a.classList.add('level-3');
    li.appendChild(a);
    tocList.appendChild(li);
  });

  if (headings.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            tocList.querySelectorAll('a').forEach((a) => {
              a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
  }
}

function syncThemeUi(theme: ThemeMode): void {
  document.querySelectorAll('[data-theme-toggle]').forEach((root) => {
    root.querySelectorAll<HTMLButtonElement>('[data-theme-value]').forEach((btn) => {
      const active = btn.dataset.themeValue === theme;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  });
  document.querySelectorAll<HTMLInputElement>('[data-theme-switch]').forEach((input) => {
    input.checked = theme === 'dark';
    input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
  });
  initSemanticSwatches();
}

function initThemeToggle(): void {
  applyTheme(resolveTheme());
  syncThemeUi(resolveTheme());

  document.querySelectorAll('[data-theme-toggle]').forEach((root) => {
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-theme-value]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.themeValue as ThemeMode;
        if (next !== 'light' && next !== 'dark') return;
        setTheme(next);
        syncThemeUi(next);
      });
    });
  });

  document.querySelectorAll<HTMLInputElement>('[data-theme-switch]').forEach((input) => {
    input.addEventListener('change', () => {
      const next: ThemeMode = input.checked ? 'dark' : 'light';
      setTheme(next);
      syncThemeUi(next);
    });
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('pimentcss-theme')) return;
    const theme = resolveTheme();
    setTheme(theme, false);
    syncThemeUi(theme);
  });
}

function expandSnippetsIn(container: ParentNode): void {
  container.querySelectorAll<HTMLElement>('.pdoc-snippet').forEach((block) => {
    setSnippetCollapsed(block, false);
  });
}

function initTabs(root: ParentNode = document) {
  root.querySelectorAll('[data-pdoc-tabs]').forEach((tabsRoot) => {
    const el = tabsRoot as HTMLElement;
    if (el.dataset.pdocTabsBound) return;
    el.dataset.pdocTabsBound = '1';
    const tabButtons = () => [...el.querySelectorAll<HTMLButtonElement>('[data-pdoc-tab]')];
    const panels = () => [...el.querySelectorAll<HTMLElement>('[data-pdoc-panel]')];

    function activate(id: string) {
      tabButtons().forEach((btn) => {
        const on = btn.dataset.pdocTab === id;
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        btn.tabIndex = on ? 0 : -1;
      });
      panels().forEach((panel) => {
        const on = panel.dataset.pdocPanel === id;
        panel.hidden = !on;
        if (on) {
          initSnippets(panel);
          expandSnippetsIn(panel);
        }
      });
    }

    el.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pdoc-tab]');
      if (!btn || !el.contains(btn)) return;
      activate(btn.dataset.pdocTab || '');
    });

    el.addEventListener('keydown', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pdoc-tab]');
      if (!btn || !el.contains(btn)) return;
      const buttons = tabButtons();
      const i = buttons.indexOf(btn);
      if (i < 0) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = buttons[(i + 1) % buttons.length];
        next?.focus();
        activate(next?.dataset.pdocTab || '');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = buttons[(i - 1 + buttons.length) % buttons.length];
        prev?.focus();
        activate(prev?.dataset.pdocTab || '');
      }
    });

    initSnippets(el);
    bindCollapsibleSnippets(el);
    const initial =
      tabButtons().find((b) => b.getAttribute('aria-selected') === 'true') ?? tabButtons()[0];
    if (initial?.dataset.pdocTab) activate(initial.dataset.pdocTab);
  });
  wireAllTabs(root);
}

function initHeadingAnchors() {
  const prose = document.querySelector('.pdoc-prose');
  if (!prose) return;
  const linkIcon =
    ICON.link();
  prose.querySelectorAll('h2[id], h3[id]').forEach((heading) => {
    const h = heading as HTMLElement;
    if (h.querySelector('.pdoc-anchor')) return;
    const a = document.createElement('a');
    a.className = 'pdoc-anchor';
    a.href = `#${h.id}`;
    a.setAttribute('aria-label', `Link to section: ${h.textContent?.trim() || h.id}`);
    a.innerHTML = linkIcon;
    h.classList.add('pdoc-heading--anchored');
    h.appendChild(a);
  });
}

function initPasswordToggles(): void {
  document.querySelectorAll<HTMLButtonElement>('.password-toggle').forEach((btn) => {
    if (btn.dataset.pdocPwdBound) return;
    btn.dataset.pdocPwdBound = '1';
    const field = btn.closest('.field');
    const input = field?.querySelector<HTMLInputElement>('.field__input');
    if (!input) return;
    btn.addEventListener('click', () => {
      const hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      btn.setAttribute('aria-pressed', hidden ? 'true' : 'false');
      btn.textContent = hidden ? 'Hide' : 'Show';
    });
  });
}

function initTextareaCounters(): void {
  document.querySelectorAll<HTMLTextAreaElement>('textarea[data-pdoc-textarea-count]').forEach((ta) => {
    const counterId = ta.dataset.pdocTextareaCount;
    if (!counterId) return;
    const counter = document.getElementById(counterId);
    if (!counter) return;
    const max = Number(ta.getAttribute('maxlength')) || 200;
    const sync = () => {
      counter.textContent = `${ta.value.length} / ${max}`;
    };
    ta.addEventListener('input', sync);
    sync();
  });
}

wrapDsSections();
initLegacyExamples();
initDemos();
initSnippets();
initTabs();
wireAllPaginations();
wireAllAnchorNavs();
wireAllCarousels();
wireAllTables();
wireAllTrees();
wireAllTags();
wireAllAlerts();
wireAllModals();
wireAllSnackbars();
wireAllProgress();
wireAllLoaders();
initHeadingAnchors();
initThemeToggle();
initSemanticSwatches();
initPasswordToggles();
initTextareaCounters();

function initIndeterminateCheckboxes(): void {
  document.querySelectorAll<HTMLInputElement>('input[data-pdoc-indeterminate]').forEach((input) => {
    input.indeterminate = true;
  });
}

function initSwitchAriaChecked(): void {
  document.querySelectorAll<HTMLInputElement>('.switch__input[role="switch"]').forEach((input) => {
    const sync = () => input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    sync();
    input.addEventListener('change', sync);
  });
}

function initDatePickers(): void {
  bindDatePickerDismiss();
  wireAllDatePickers();
}

function initAutocompletes(): void {
  bindAutocompleteDismiss();
  wireAllAutocompletes();
}

function initButtonGroups(): void {
  wireAllButtonGroups();
}

function initHeaderNavs(): void {
  wireAllHeaderNavs();
}

function initDropdowns(): void {
  bindDropdownDismiss();
  wireAllDropdowns();
}

initIndeterminateCheckboxes();
initSwitchAriaChecked();
initDatePickers();
initAutocompletes();
initButtonGroups();
initHeaderNavs();
initDropdowns();
