import { pdocSnippet, pdocSteps } from './pdoc-html';
import { DATE_PICKER_REFERENCE_JS } from './date-picker-behavior';
import { ICON } from './icon';

const CALENDAR_ICON = ICON.calendar();
const NAV_PREV = ICON.arrowLeft();
const NAV_NEXT = ICON.arrowRight();

const WEEKDAY_HEADERS = `<span class="calendar-day calendar-day--weekday">S</span>
              <span class="calendar-day calendar-day--weekday">M</span>
              <span class="calendar-day calendar-day--weekday">T</span>
              <span class="calendar-day calendar-day--weekday">W</span>
              <span class="calendar-day calendar-day--weekday">T</span>
              <span class="calendar-day calendar-day--weekday">F</span>
              <span class="calendar-day calendar-day--weekday">S</span>`;

function calendarDayCell(label: string, inner: string): string {
  return `            <li class="pdoc-calendar-state" role="listitem">
              <span class="pdoc-calendar-state__label">${label}</span>
              ${inner}
            </li>`;
}

const DAY_STATES_SPEC = `<ul class="pdoc-calendar-states" role="list" aria-label="Calendar day states">
${calendarDayCell('Default', '<button type="button" class="calendar-day focus-visible">12</button>')}
${calendarDayCell('Current', '<button type="button" class="calendar-day calendar-day--current focus-visible">13</button>')}
${calendarDayCell('Selected', '<button type="button" class="calendar-day calendar-day--selected focus-visible">14</button>')}
${calendarDayCell('Hover (spec)', '<button type="button" class="calendar-day calendar-day--hover focus-visible">15</button>')}
${calendarDayCell('Focus (spec)', '<button type="button" class="calendar-day calendar-day--focus focus-visible">16</button>')}
${calendarDayCell('Disabled', '<button type="button" class="calendar-day calendar-day--disabled focus-visible" disabled>17</button>')}
${calendarDayCell('Weekday', '<span class="calendar-day calendar-day--weekday">M</span>')}
${calendarDayCell('Blank', '<span class="calendar-day calendar-day--blank" aria-hidden="true"></span>')}
          </ul>`;

const CALENDAR_WEEKS = `<div class="calendar__week">
                <span class="calendar-day calendar-day--blank" aria-hidden="true"></span>
                <span class="calendar-day calendar-day--blank" aria-hidden="true"></span>
                <span class="calendar-day calendar-day--blank" aria-hidden="true"></span>
                <span class="calendar-day calendar-day--blank" aria-hidden="true"></span>
                <span class="calendar-day calendar-day--blank" aria-hidden="true"></span>
                <button type="button" class="calendar-day focus-visible">1</button>
                <button type="button" class="calendar-day focus-visible">2</button>
              </div>
              <div class="calendar__week">
                <button type="button" class="calendar-day focus-visible">3</button>
                <button type="button" class="calendar-day calendar-day--selected focus-visible">4</button>
                <button type="button" class="calendar-day focus-visible">5</button>
                <button type="button" class="calendar-day focus-visible">6</button>
                <button type="button" class="calendar-day focus-visible">7</button>
                <button type="button" class="calendar-day focus-visible">8</button>
                <button type="button" class="calendar-day focus-visible">9</button>
              </div>
              <div class="calendar__week">
                <button type="button" class="calendar-day focus-visible">10</button>
                <button type="button" class="calendar-day focus-visible">11</button>
                <button type="button" class="calendar-day focus-visible">12</button>
                <button type="button" class="calendar-day calendar-day--current focus-visible">13</button>
                <button type="button" class="calendar-day focus-visible">14</button>
                <button type="button" class="calendar-day focus-visible">15</button>
                <button type="button" class="calendar-day focus-visible">16</button>
              </div>
              <div class="calendar__week">
                <button type="button" class="calendar-day focus-visible">17</button>
                <button type="button" class="calendar-day focus-visible">18</button>
                <button type="button" class="calendar-day focus-visible">19</button>
                <button type="button" class="calendar-day focus-visible">20</button>
                <button type="button" class="calendar-day focus-visible">21</button>
                <button type="button" class="calendar-day focus-visible">22</button>
                <button type="button" class="calendar-day focus-visible">23</button>
              </div>
              <div class="calendar__week">
                <button type="button" class="calendar-day focus-visible">24</button>
                <button type="button" class="calendar-day focus-visible">25</button>
                <button type="button" class="calendar-day focus-visible">26</button>
                <button type="button" class="calendar-day focus-visible">27</button>
                <button type="button" class="calendar-day focus-visible">28</button>
                <button type="button" class="calendar-day focus-visible">29</button>
                <button type="button" class="calendar-day focus-visible">30</button>
              </div>
              <div class="calendar__week">
                <button type="button" class="calendar-day focus-visible">31</button>
              </div>`;

function calendarBlock(opts: {
  role: string;
  label: string;
  weeks: string;
  nav?: boolean;
  live?: boolean;
}): string {
  const liveAttr = opts.live ? ' data-calendar-live' : '';
  const monthAttr = opts.live ? ' data-calendar-month' : '';
  const prevAttr = opts.live ? ' data-calendar-prev' : '';
  const nextAttr = opts.live ? ' data-calendar-next' : '';
  const weeksAttr = opts.live ? ' data-calendar-weeks' : '';

  const header = opts.nav
    ? `<div class="calendar__header">
              <div class="calendar__nav-group">
                <button type="button" class="calendar__nav focus-visible" aria-label="Previous month"${prevAttr}>${NAV_PREV}</button>
              </div>
              <p class="calendar__month"${monthAttr}>May 2026</p>
              <div class="calendar__nav-group">
                <button type="button" class="calendar__nav focus-visible" aria-label="Next month"${nextAttr}>${NAV_NEXT}</button>
              </div>
            </div>`
    : `<div class="calendar__header"><p class="calendar__month"${monthAttr}>May 2026</p></div>`;

  return `<div class="calendar"${liveAttr} role="${opts.role}" aria-label="${opts.label}">
            ${header}
            <div class="calendar__weekdays">${WEEKDAY_HEADERS}</div>
            <div class="calendar__weeks"${weeksAttr}>${opts.weeks}</div>
          </div>`;
}

const FULL_CALENDAR = calendarBlock({
  role: 'application',
  label: 'Calendar May 2026',
  weeks: CALENDAR_WEEKS,
  nav: true,
});

const PANEL_CALENDAR = calendarBlock({
  role: 'dialog',
  label: 'Choose a date',
  weeks: '',
  nav: true,
  live: true,
});

function datePickerBlock(open: boolean, idPrefix: string): string {
  const openClass = open ? ' date-picker--open' : '';
  const panelId = `${idPrefix}-panel`;
  const inputId = `${idPrefix}-input`;
  const expanded = open ? 'true' : 'false';

  return `<div class="date-picker${openClass}">
            <div class="date-picker__body">
              <div class="date-picker__control">
                <label class="label" for="${inputId}">
                  <span class="label__text">Date</span>
                </label>
                <div class="field-group">
                  <div class="field">
                    <input id="${inputId}" class="field__input" type="text" readonly value="" placeholder="dd/mm/yyyy" aria-describedby="${idPrefix}-hint" />
                  </div>
                  <button type="button" class="date-picker__trigger focus-visible" aria-label="Open calendar" aria-haspopup="dialog" aria-controls="${panelId}" aria-expanded="${expanded}">
                    ${CALENDAR_ICON}
                  </button>
                </div>
              </div>
              <div class="date-picker__panel" id="${panelId}">
                ${PANEL_CALENDAR}
              </div>
            </div>
            <p class="date-picker__hint" id="${idPrefix}-hint">Pick a date</p>
          </div>`;
}

/** Full Date picker page (Forms). */
export function buildDatePickerPageHtml(): string {
  return `
        <aside class="pdoc-aside pdoc-aside--note">
          <p class="pdoc-aside__title">RGAA / WCAG AA</p>
          <p>Date selection needs a visible <strong>label</strong>, keyboard-operable day buttons, and <code>aria-expanded</code> on the trigger. PimentCSS provides <strong>CSS and markup</strong>; your app adds a short script to open the panel and write the selected date (same model as the theme toggle).</p>
        </aside>

        <h2 id="overview">Overview</h2>
        <p>Three layers: <code>.calendar-day</code> cells, a <code>.calendar</code> grid, and <code>.date-picker</code> which wraps a field + trigger + panel. Panel visibility uses <code>.date-picker--open</code>. There is no bundled <code>DatePicker</code> runtime in the npm package: only styles and the HTML contract below.</p>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Layer</th><th>Class</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Day</td><td><code>.calendar-day</code></td><td>Day button or weekday/blank cell</td></tr>
              <tr><td>Grid</td><td><code>.calendar</code></td><td>Month view with header and weeks</td></tr>
              <tr><td>Picker</td><td><code>.date-picker</code></td><td>Label, field, trigger, optional panel</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li><strong>PimentCSS installed</strong>, <a href="/docs/installation">Installation</a>.</li>
          <li><strong>Input fields</strong>, <code>.label</code>, <code>.field</code>, <code>.field-group</code> from <a href="/docs/input-fields">Input fields</a>.</li>
          <li><strong>Focus</strong>, <code>:focus-visible</code> rings on days and nav buttons.</li>
        </ul>

        <h2 id="calendar-days">Calendar days</h2>
        <p>Days are <code>&lt;button type="button"&gt;</code> except weekday headers and leading blanks (<code>span</code>). Modifiers <code>--selected</code>, <code>--current</code>, <code>--disabled</code>, and doc-only <code>--hover</code> / <code>--focus</code> show spec states.</p>

        <h3 id="day-states">Day states (spec)</h3>
        <p class="body-small pdoc-text-muted">Static modifiers for documentation; interactive days use real buttons below.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${DAY_STATES_SPEC}
          </div>
        </div>

        <h2 id="calendar">Calendar</h2>
        <p>Stack header (month + optional prev/next), weekday row, then <code>.calendar__week</code> rows. Max width 240px, 12px padding, 8px gap between cells.</p>
        ${pdocSnippet(
          `<div class="calendar" role="application" aria-label="May 2026">
  <div class="calendar__header">…</div>
  <div class="calendar__weekdays">…</div>
  <div class="calendar__weeks">
    <div class="calendar__week">…</div>
  </div>
</div>`,
          'calendar.html',
          'html',
        )}

        <h3 id="calendar-example">Full month example</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-date-picker-demo">
            ${FULL_CALENDAR}
          </div>
        </div>

        <h2 id="behavior">Behavior in your app</h2>
        <p>Copy and adapt the script in <code>docs-site/src/lib/date-picker-behavior.ts</code> after PimentCSS CSS is loaded. It toggles the panel, renders months from the current month forward (previous month disabled), disables past days in the current month, and closes on Escape or outside click.</p>
        ${pdocSnippet(DATE_PICKER_REFERENCE_JS, 'date-picker.js', 'javascript')}

        <h2 id="date-picker">Date picker</h2>
        <p>Combines <code>.field-group</code>, readonly text input, calendar trigger button, and <code>.date-picker__panel</code>. Add <code>.date-picker--open</code> (via JS) to reveal the panel. Demos on this page are wired with the script above.</p>
        ${pdocSnippet(
          `<div class="date-picker date-picker--open">
  <div class="date-picker__body">
    <div class="field-group">…</div>
    <div class="date-picker__panel">
      <div class="calendar" role="dialog">…</div>
    </div>
  </div>
  <p class="date-picker__hint">dd/mm/yyyy</p>
</div>`,
          'date-picker.html',
          'html',
        )}

        <h3 id="picker-example">Example (closed)</h3>
        <p>Click the calendar button to open the panel, then pick a day. Requires the behavior script (included on this docs site).</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-date-picker-demo">
            ${datePickerBlock(false, 'pdoc-dp-closed')}
          </div>
        </div>

        <h3 id="picker-open">Open state (spec)</h3>
        <p>Markup with <code>date-picker--open</code> for screenshots; the same script can toggle it closed.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted pdoc-date-picker-demo">
            ${datePickerBlock(true, 'pdoc-dp-open')}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.calendar-day</code></td><td>Day cell (button or span)</td></tr>
              <tr><td><code>.calendar-day--selected</code></td><td>Chosen day</td></tr>
              <tr><td><code>.calendar-day--current</code></td><td>Today outline</td></tr>
              <tr><td><code>.calendar-day--disabled</code></td><td>Unavailable day</td></tr>
              <tr><td><code>.calendar-day--weekday</code></td><td>Column header (S–S)</td></tr>
              <tr><td><code>.calendar-day--blank</code></td><td>Leading/trailing empty cell</td></tr>
              <tr><td><code>.calendar</code></td><td>Month grid container</td></tr>
              <tr><td><code>.calendar__nav</code></td><td>Previous / next month control</td></tr>
              <tr><td><code>.date-picker</code></td><td>Field + panel wrapper (240px max)</td></tr>
              <tr><td><code>.date-picker--open</code></td><td>Shows <code>.date-picker__panel</code></td></tr>
              <tr><td><code>.date-picker__trigger</code></td><td>Opens calendar (pair with <code>aria-expanded</code>)</td></tr>
              <tr><td><code>.date-picker__hint</code></td><td>Format hint below field</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'calendar-tokens',
            title: 'Calendar sizing',
            body: 'Override picker width and cell size before importing components.',
            code: `@use "pimentcss" with (
  $date-picker-width: 16rem,
  $calendar-day-size: 1.625rem,
  $calendar-gap: 0.375rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'calendar-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _date-picker.scss or tokens.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Date selection</p>
          <ul>
            <li><strong>Label</strong>, <code>&lt;label for="…"&gt;</code> on the date field; hint via <code>aria-describedby</code> when needed.</li>
            <li><strong>Trigger</strong>, <code>aria-haspopup="dialog"</code>, <code>aria-controls</code>, <code>aria-expanded</code> synced with open state.</li>
            <li><strong>Calendar</strong>, <code>role="dialog"</code> (or <code>application</code> for standalone grid) with an accessible name.</li>
            <li><strong>Days</strong>, use <code>&lt;button&gt;</code> with visible day number; disable unavailable days with <code>disabled</code>.</li>
            <li><strong>Keyboard</strong>, arrow keys and Escape require app logic; CSS provides focus rings only.</li>
            <li><strong>Selected state</strong>, expose the chosen date in the input value (and optionally <code>aria-live</code> on change).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/input-fields"><p class="pdoc-card__title">Input fields</p><p class="pdoc-card__desc">Labels and field groups.</p></a>
          <a class="pdoc-card" href="/docs/form"><p class="pdoc-card__title">Form</p><p class="pdoc-card__desc">Compose fields in a form.</p></a>
          <a class="pdoc-card" href="/docs/autocomplete"><p class="pdoc-card__title">Autocomplete</p><p class="pdoc-card__desc">Typeahead list pattern.</p></a>
          <a class="pdoc-card" href="/docs/a11y"><p class="pdoc-card__title">Accessibility</p><p class="pdoc-card__desc">Focus and dialogs.</p></a>
        </div>`;
}
