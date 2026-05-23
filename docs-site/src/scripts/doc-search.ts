/**
 * Documentation search V1 — build-time index + combobox UI.
 */
import type { DocSearchEntry, DocSearchIndex } from '../lib/doc-search-types';
import { searchDocEntries } from '../lib/doc-search-engine';

const INDEX_URL = '/doc-search-index.json';
const DEBOUNCE_MS = 120;

let entries: DocSearchEntry[] | null = null;
let indexPromise: Promise<DocSearchEntry[]> | null = null;

function loadIndex(): Promise<DocSearchEntry[]> {
  if (entries) return Promise.resolve(entries);
  if (!indexPromise) {
    indexPromise = fetch(INDEX_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Search index failed (${res.status})`);
        return res.json() as Promise<DocSearchIndex>;
      })
      .then((data) => {
        entries = data.entries;
        return entries;
      });
  }
  return indexPromise;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderResults(panel: HTMLElement, items: DocSearchEntry[], activeIndex: number, inputId: string): void {
  if (!items.length) {
    panel.innerHTML =
      '<p class="pdoc-doc-search__empty" role="presentation">No matching pages. Try another term.</p>';
    return;
  }

  panel.innerHTML = items
    .map((item, i) => {
      const active = i === activeIndex;
      const optId = `${inputId}-opt-${i}`;
      return `<a
        class="pdoc-doc-search__option${active ? ' is-active' : ''}"
        role="option"
        id="${optId}"
        href="${escapeHtml(item.url)}"
        ${active ? 'aria-selected="true"' : ''}
        data-pdoc-doc-search-option
      >
        <span class="pdoc-doc-search__option-title">${escapeHtml(item.title)}</span>
        <span class="pdoc-doc-search__option-meta">${escapeHtml(item.section)}</span>
        ${item.lead ? `<span class="pdoc-doc-search__option-lead">${escapeHtml(item.lead)}</span>` : ''}
      </a>`;
    })
    .join('');
}

function setOpen(root: HTMLElement, open: boolean): void {
  const input = root.querySelector<HTMLInputElement>('[data-pdoc-doc-search-input]');
  const panel = root.querySelector<HTMLElement>('[data-pdoc-doc-search-panel]');
  if (!input || !panel) return;

  root.classList.toggle('is-open', open);
  input.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) {
    panel.removeAttribute('hidden');
  } else {
    panel.setAttribute('hidden', '');
  }
}

function setStatus(root: HTMLElement, message: string): void {
  const status = root.querySelector<HTMLElement>('[data-pdoc-doc-search-status]');
  if (status) status.textContent = message;
}

function syncPeerInput(source: HTMLInputElement): void {
  const peerId =
    source.id === 'pdoc-search' ? 'pdoc-search-mobile' : source.id === 'pdoc-search-mobile' ? 'pdoc-search' : null;
  if (!peerId) return;
  const peer = document.getElementById(peerId) as HTMLInputElement | null;
  if (peer && peer.value !== source.value) {
    peer.value = source.value;
    peer.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function wireDocSearchRoot(root: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>('[data-pdoc-doc-search-input]');
  const panel = root.querySelector<HTMLElement>('[data-pdoc-doc-search-panel]');
  if (!input || !panel) return;

  let results: DocSearchEntry[] = [];
  let activeIndex = -1;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const close = () => {
    setOpen(root, false);
    activeIndex = -1;
  };

  const openWithResults = (items: DocSearchEntry[]) => {
    results = items;
    activeIndex = items.length ? 0 : -1;
    renderResults(panel, items, activeIndex, input.id);
    setOpen(root, items.length > 0 || input.value.trim().length >= 2);
    setStatus(
      root,
      items.length
        ? `${items.length} result${items.length === 1 ? '' : 's'}`
        : input.value.trim().length >= 2
          ? 'No results'
          : '',
    );
  };

  const runSearch = async (query: string) => {
    const q = query.trim();
    if (q.length < 2) {
      results = [];
      activeIndex = -1;
      panel.innerHTML = '';
      close();
      setStatus(root, '');
      return;
    }
    try {
      const index = await loadIndex();
      openWithResults(searchDocEntries(index, q));
    } catch {
      setStatus(root, 'Search unavailable');
      close();
    }
  };

  const focusOption = (index: number) => {
    if (!results.length) return;
    activeIndex = Math.max(0, Math.min(index, results.length - 1));
    renderResults(panel, results, activeIndex, input.id);
    const option = panel.querySelector<HTMLElement>(`#${input.id}-opt-${activeIndex}`);
    option?.scrollIntoView({ block: 'nearest' });
  };

  const navigateActive = () => {
    if (activeIndex >= 0 && results[activeIndex]) {
      window.location.href = results[activeIndex].url;
    } else if (results[0]) {
      window.location.href = results[0].url;
    }
  };

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void runSearch(input.value);
    }, DEBOUNCE_MS);
    syncPeerInput(input);
  });

  input.addEventListener('focus', () => {
    if (results.length) setOpen(root, true);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close();
      input.blur();
      event.preventDefault();
      return;
    }
    if (event.key === 'ArrowDown') {
      if (!root.classList.contains('is-open') && input.value.trim().length >= 2) {
        void runSearch(input.value);
      }
      focusOption(activeIndex + 1);
      event.preventDefault();
      return;
    }
    if (event.key === 'ArrowUp') {
      focusOption(activeIndex <= 0 ? results.length - 1 : activeIndex - 1);
      event.preventDefault();
      return;
    }
    if (event.key === 'Enter') {
      if (root.classList.contains('is-open') && results.length) {
        navigateActive();
        event.preventDefault();
      }
    }
  });

  panel.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-pdoc-doc-search-option]');
    if (!link) return;
    event.preventDefault();
    window.location.href = link.href;
  });

  panel.addEventListener('mousemove', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-pdoc-doc-search-option]');
    if (!link) return;
    const options = [...panel.querySelectorAll<HTMLAnchorElement>('[data-pdoc-doc-search-option]')];
    const idx = options.indexOf(link);
    if (idx >= 0) focusOption(idx);
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) close();
  });
}

export function initDocSearch(): void {
  document.querySelectorAll<HTMLElement>('[data-pdoc-doc-search]').forEach(wireDocSearchRoot);
}

initDocSearch();
