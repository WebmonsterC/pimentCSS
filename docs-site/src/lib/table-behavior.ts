/**
 * Table demos (docs): row selection + scroll region focus hint.
 */

const WIRED = 'data-piment-table-wired';
const LIVE = 'data-table-live';

function syncRowSelected(row: HTMLTableRowElement, selected: boolean): void {
  if (selected) {
    row.classList.add('table__row--selected');
    row.setAttribute('aria-selected', 'true');
  } else {
    row.classList.remove('table__row--selected');
    row.removeAttribute('aria-selected');
  }
}

export function wireTableLive(root: HTMLElement): void {
  if (root.getAttribute(WIRED) === 'true') return;
  if (!root.hasAttribute(LIVE)) return;
  root.setAttribute(WIRED, 'true');

  const rows = [...root.querySelectorAll<HTMLTableRowElement>('tbody tr[data-table-row]')];
  const selectableRows = rows.filter((row) => row.hasAttribute('data-table-select-row'));
  const headerCheckbox = root.querySelector<HTMLInputElement>('thead input[type="checkbox"]');

  const syncHeaderCheckbox = (): void => {
    if (!headerCheckbox || !selectableRows.length) return;
    const checkedCount = selectableRows.filter(
      (row) => row.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked,
    ).length;
    headerCheckbox.indeterminate = checkedCount > 0 && checkedCount < selectableRows.length;
    headerCheckbox.checked = checkedCount === selectableRows.length;
  };

  selectableRows.forEach((row) => {
    const checkbox = row.querySelector<HTMLInputElement>('input[type="checkbox"]');

    checkbox?.addEventListener('change', () => {
      syncRowSelected(row, checkbox.checked);
      syncHeaderCheckbox();
    });

    row.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('input, label, a, button')) return;
      const next = !row.classList.contains('table__row--selected');
      if (checkbox) checkbox.checked = next;
      syncRowSelected(row, next);
      syncHeaderCheckbox();
    });
  });

  headerCheckbox?.addEventListener('change', () => {
    const on = headerCheckbox.checked;
    headerCheckbox.indeterminate = false;
    selectableRows.forEach((row) => {
      const checkbox = row.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (checkbox) checkbox.checked = on;
      syncRowSelected(row, on);
    });
  });

  syncHeaderCheckbox();
}

export function wireTableScrollRegions(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.table-scroll[data-table-scroll-hint]').forEach((region) => {
    if (region.getAttribute('data-scroll-hint-wired') === 'true') return;
    region.setAttribute('data-scroll-hint-wired', 'true');
    const label = region.getAttribute('aria-label') || 'Table';
    if (!region.hasAttribute('tabindex')) {
      region.setAttribute('tabindex', '0');
    }
    region.addEventListener('focus', () => {
      region.setAttribute(
        'aria-description',
        `${label}: swipe horizontally or use Shift+scroll to see all columns.`,
      );
    });
  });
}

export function wireAllTables(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-table-live]').forEach(wireTableLive);
  wireTableScrollRegions(root);
}

export const TABLE_REFERENCE_JS = `import { wireAllTables } from './table-behavior';

document.addEventListener('DOMContentLoaded', () => wireAllTables());

// Row table: .table-scroll[aria-label] + .table[data-table-live] + tbody tr[data-table-select-row]
// Header checkbox toggles all rows; row checkbox and row click stay in sync`;
