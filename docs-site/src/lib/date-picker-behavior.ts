/**
 * Date picker behavior for PimentCSS markup (docs + reference for apps).
 */

const WIRED = 'data-piment-date-picker-wired';

type MonthView = { year: number; month: number };

function monthKey(y: number, m: number): number {
  return y * 12 + m;
}

function parseInputDate(value: string): { day: number; month: number; year: number } | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  return { day: Number(match[1]), month: Number(match[2]) - 1, year: Number(match[3]) };
}

function formatInputDate(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
}

function formatMonthYear(year: number, month: number): string {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function buildWeeksHtml(
  year: number,
  month: number,
  today: Date,
  selected: { day: number; month: number; year: number } | null,
): string {
  const firstDow = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const minKey = monthKey(today.getFullYear(), today.getMonth());
  const viewKey = monthKey(year, month);
  let day = 1;
  let rows = '';

  for (let week = 0; week < 6; week += 1) {
    let cells = '';
    for (let dow = 0; dow < 7; dow += 1) {
      const index = week * 7 + dow;
      if (index < firstDow || day > totalDays) {
        cells += '<span class="calendar-day calendar-day--blank" aria-hidden="true"></span>';
        continue;
      }
      const n = day;
      day += 1;
      const isSelected =
        selected?.year === year && selected?.month === month && selected?.day === n;
      const isToday =
        today.getFullYear() === year && today.getMonth() === month && today.getDate() === n;
      const isPast =
        viewKey === minKey &&
        year === today.getFullYear() &&
        month === today.getMonth() &&
        n < today.getDate();

      let cls = 'calendar-day focus-visible';
      if (isSelected) cls += ' calendar-day--selected';
      else if (isToday) cls += ' calendar-day--current';

      if (isPast) {
        cells += `<button type="button" class="calendar-day calendar-day--disabled" disabled>${n}</button>`;
      } else {
        cells += `<button type="button" class="${cls}">${n}</button>`;
      }
    }
    rows += `<div class="calendar__week">${cells}</div>`;
    if (day > totalDays) break;
  }
  return rows;
}

function wireLiveCalendar(picker: HTMLElement, panel: HTMLElement, input: HTMLInputElement | null): void {
  const calendar = panel.querySelector<HTMLElement>('[data-calendar-live]');
  if (!calendar) return;

  const monthEl = calendar.querySelector<HTMLElement>('[data-calendar-month]');
  const weeksEl = calendar.querySelector<HTMLElement>('[data-calendar-weeks]');
  const prevBtn = calendar.querySelector<HTMLButtonElement>('[data-calendar-prev]');
  const nextBtn = calendar.querySelector<HTMLButtonElement>('[data-calendar-next]');
  if (!monthEl || !weeksEl || !prevBtn || !nextBtn) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minView: MonthView = { year: today.getFullYear(), month: today.getMonth() };

  let view: MonthView = { ...minView };
  const parsed = input?.value ? parseInputDate(input.value) : null;
  if (parsed && monthKey(parsed.year, parsed.month) >= monthKey(minView.year, minView.month)) {
    view = { year: parsed.year, month: parsed.month };
  }

  if (!monthEl.id) {
    monthEl.id = `calendar-month-${Math.random().toString(36).slice(2, 9)}`;
  }
  calendar.setAttribute('aria-labelledby', monthEl.id);

  const render = () => {
    const selected = input?.value ? parseInputDate(input.value) : null;
    monthEl.textContent = formatMonthYear(view.year, view.month);
    weeksEl.innerHTML = buildWeeksHtml(view.year, view.month, today, selected);

    const atMin = monthKey(view.year, view.month) <= monthKey(minView.year, minView.month);
    prevBtn.disabled = atMin;
    prevBtn.setAttribute('aria-disabled', atMin ? 'true' : 'false');
  };

  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (prevBtn.disabled) return;
    const d = new Date(view.year, view.month - 1, 1);
    if (monthKey(d.getFullYear(), d.getMonth()) < monthKey(minView.year, minView.month)) return;
    view = { year: d.getFullYear(), month: d.getMonth() };
    render();
  });

  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const d = new Date(view.year, view.month + 1, 1);
    view = { year: d.getFullYear(), month: d.getMonth() };
    render();
  });

  weeksEl.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const dayBtn = target.closest<HTMLButtonElement>('button.calendar-day');
    if (!dayBtn || dayBtn.disabled || dayBtn.classList.contains('calendar-day--weekday')) return;

    event.stopPropagation();
    const day = Number(dayBtn.textContent?.trim());
    if (!Number.isFinite(day) || !input) return;

    input.value = formatInputDate(day, view.month, view.year);
    input.setAttribute('aria-live', 'polite');
    picker.classList.remove('date-picker--open');
    const trigger = picker.querySelector<HTMLButtonElement>('.date-picker__trigger');
    trigger?.setAttribute('aria-expanded', 'false');
    input.focus();
    render();
  });

  render();
}

export function wireDatePicker(picker: HTMLElement): void {
  if (picker.getAttribute(WIRED) === 'true') return;

  const trigger = picker.querySelector<HTMLButtonElement>('.date-picker__trigger');
  const input = picker.querySelector<HTMLInputElement>('.field__input');
  const panel = picker.querySelector<HTMLElement>('.date-picker__panel');
  if (!trigger || !panel) return;

  picker.setAttribute(WIRED, 'true');

  if (!panel.id) {
    panel.id = `date-picker-panel-${Math.random().toString(36).slice(2, 9)}`;
  }
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', panel.id);

  const setOpen = (open: boolean) => {
    picker.classList.toggle('date-picker--open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      const weeksEl = panel.querySelector<HTMLElement>('[data-calendar-weeks]');
      const focusTarget =
        weeksEl?.querySelector<HTMLButtonElement>('.calendar-day--selected:not([disabled])') ??
        weeksEl?.querySelector<HTMLButtonElement>('.calendar-day--current:not([disabled])') ??
        weeksEl?.querySelector<HTMLButtonElement>('.calendar-day:not(.calendar-day--blank):not([disabled])');
      focusTarget?.focus();
    }
  };

  setOpen(picker.classList.contains('date-picker--open'));

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!picker.classList.contains('date-picker--open'));
  });

  picker.addEventListener('click', (event) => event.stopPropagation());

  wireLiveCalendar(picker, panel, input);

  // Static calendars (no data-calendar-live)
  if (!panel.querySelector('[data-calendar-live]')) {
    panel.querySelectorAll<HTMLButtonElement>('.calendar-day').forEach((dayBtn) => {
      if (dayBtn.classList.contains('calendar-day--weekday') || dayBtn.classList.contains('calendar-day--blank')) {
        return;
      }
      dayBtn.addEventListener('click', () => {
        if (dayBtn.disabled) return;
        panel.querySelectorAll('.calendar-day--selected').forEach((el) => el.classList.remove('calendar-day--selected'));
        dayBtn.classList.add('calendar-day--selected');
        const day = dayBtn.textContent?.trim();
        if (day && input) {
          const month = picker.dataset.month ?? '05';
          const year = picker.dataset.year ?? '2026';
          input.value = `${day.padStart(2, '0')}/${month}/${year}`;
        }
        setOpen(false);
        input?.focus();
      });
    });
  }

  picker.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && picker.classList.contains('date-picker--open')) {
      event.preventDefault();
      setOpen(false);
      trigger.focus();
    }
  });
}

export function wireAllDatePickers(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.date-picker').forEach(wireDatePicker);
}

let dismissBound = false;

export function bindDatePickerDismiss(): void {
  if (dismissBound) return;
  dismissBound = true;

  document.addEventListener('click', () => {
    document.querySelectorAll<HTMLElement>('.date-picker.date-picker--open').forEach((picker) => {
      picker.classList.remove('date-picker--open');
      const trigger = picker.querySelector<HTMLButtonElement>('.date-picker__trigger');
      trigger?.setAttribute('aria-expanded', 'false');
    });
  });
}

export const DATE_PICKER_REFERENCE_JS = `// See docs-site/src/lib/date-picker-behavior.ts (month nav, min = current month, field-group layout).`;
