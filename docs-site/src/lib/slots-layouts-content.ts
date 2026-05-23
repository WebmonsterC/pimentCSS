import { pdocSnippet, pdocSteps } from './pdoc-html';

const SLOT_LABEL = 'Slot component';

function slotMarkup(label = SLOT_LABEL): string {
  return `<div class="slot">${label}</div>`;
}

function columnLayout(count: number): string {
  const slots = Array.from({ length: count }, () => slotMarkup()).join('\n                ');
  return `<div class="slots-layout slots-layout--column" role="group" aria-label="${count} slots in a row">
                ${slots}
              </div>`;
}

function rowLayout(count: number, fluid = false): string {
  const fluidClass = fluid ? ' slots-layout--fluid' : '';
  const slots = Array.from({ length: count }, () => slotMarkup()).join('\n                ');
  return `<div class="slots-layout slots-layout--row${fluidClass}" role="group" aria-label="${count} stacked slots">
                ${slots}
              </div>`;
}

const SLOT_BASE = `<div class="pdoc-slots-base">
              ${slotMarkup()}
              <p class="body-small pdoc-text-muted">Dashed <code>border-action</code>, background <code>surface-action-hover-2</code>, min. 139×42px. Replace with real components in production.</p>
            </div>`;

function exampleStack(blocks: string, label: string): string {
  return `<div class="pdoc-slots-example-stack" role="group" aria-label="${label}">
              ${blocks}
            </div>`;
}

function columnBlocks(counts: number[]): string {
  return counts
    .map(
      (n) => `<div class="pdoc-slots-block">
                <p class="pdoc-slots-block__title body-small body-medium--semibold">${n} slot${n > 1 ? 's' : ''} side by side</p>
                ${columnLayout(n)}
              </div>`,
    )
    .join('\n              ');
}

function rowBlocks(
  items: { count: number; fluid?: boolean; title: string }[],
): string {
  return items
    .map(
      ({ count, fluid, title }) => `<div class="pdoc-slots-block${fluid ? ' pdoc-slots-block--fluid-row' : ''}">
                <p class="pdoc-slots-block__title body-small body-medium--semibold">${title}</p>
                ${rowLayout(count, fluid)}
              </div>`,
    )
    .join('\n              ');
}

const COLUMN_DEMO_1_2 = columnBlocks([1, 2]);
const COLUMN_DEMO_3_4 = columnBlocks([3, 4]);
const COLUMN_DEMO_5_6 = columnBlocks([5, 6]);

const ROW_DEMO_STACK = rowBlocks([
  { count: 1, title: 'Vertical stack · 1 slot' },
  { count: 2, title: 'Vertical stack · 2 slots' },
  { count: 3, title: 'Vertical stack · 3 slots' },
]);

const ROW_DEMO_FLUID = rowBlocks([
  { count: 6, fluid: true, title: 'Vertical stack · 6 slots (fluid, blank card)' },
]);

const BLANK_CARD_CONTEXT = `<article class="card card--blank pdoc-slots-card-demo">
              <div class="card__slots">
                <div class="slots-layout slots-layout--row slots-layout--fluid" role="group" aria-label="Card slot regions">
                  <div class="slot">Header</div>
                  <div class="slot">Content</div>
                  <div class="slot">Actions</div>
                </div>
              </div>
            </article>
            <p class="body-small pdoc-text-muted">Used inside <a href="/cards#card-blank">Blank card</a> (<code>.card--blank</code>). Swap placeholders for headings, copy, or buttons.</p>`;

const MARKUP_SNIPPET = `<div class="slots-layout slots-layout--column">
  <div class="slot">Toolbar</div>
  <div class="slot">Filters</div>
  <div class="slot">Actions</div>
</div>

<div class="slots-layout slots-layout--row slots-layout--fluid">
  <div class="slot">Header</div>
  <div class="slot">Body</div>
</div>`;

export function buildSlotsLayoutsPageHtml(): string {
  return `
        <p><strong>Slots</strong> are dashed placeholders for composing regions in wireframes or empty shells. <strong>Slots layouts</strong> arrange them in a horizontal row (<code>--column</code>) or vertical stack (<code>--row</code>) with a 24px gap. For full page recipes (forms, tables, toolbars), start at <a href="/docs/patterns">Patterns overview</a>. Styles live in <code>scss/components/_slot.scss</code> and <code>_slots-layout.scss</code>.</p>

        <h2 id="slot-base">Slot</h2>
        <p>Single placeholder block before grouping into layouts.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${SLOT_BASE}
          </div>
        </div>
        ${pdocSnippet(`<div class="slot">Header region</div>`, 'slot.html', 'html')}

        <h2 id="column-layout">Column layout</h2>
        <p><code>.slots-layout.slots-layout--column</code> places slots side by side (Figma « Column », 1 to 6 slots). In production, slots keep <code>min-width: 139px</code> and do not shrink; wide sets may overflow their container. Demos below use a <strong>doc-only wrap</strong> so slots reflow without horizontal scrollbars.</p>

        <h3 id="column-1-2">1–2 slots (horizontal)</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${exampleStack(COLUMN_DEMO_1_2, 'One and two slots side by side')}
          </div>
        </div>

        <h3 id="column-3-4">3–4 slots (horizontal)</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${exampleStack(COLUMN_DEMO_3_4, 'Three and four slots side by side')}
          </div>
        </div>

        <h3 id="column-5-6">5–6 slots (horizontal)</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${exampleStack(COLUMN_DEMO_5_6, 'Five and six slots side by side')}
          </div>
        </div>
        ${pdocSnippet(columnLayout(3), 'slots-column.html', 'html')}

        <h2 id="row-layout">Row layout</h2>
        <p>In Figma, <strong>Row</strong> means slots stacked <strong>vertically</strong> (reading order top to bottom), not a horizontal row of examples. Class <code>.slots-layout.slots-layout--row</code> is 139px wide with a 24px gap between slots. Add <code>.slots-layout--fluid</code> for full-width stacks inside cards.</p>

        <h3 id="row-stack-1-3">1–3 slots (vertical stack)</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${exampleStack(ROW_DEMO_STACK, 'Vertical row layouts with one to three slots')}
          </div>
        </div>

        <h3 id="row-stack-fluid">6 slots · fluid (blank card)</h3>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${exampleStack(ROW_DEMO_FLUID, 'Fluid vertical row for blank card')}
          </div>
        </div>
        ${pdocSnippet(rowLayout(3, true), 'slots-row-fluid.html', 'html')}

        <h2 id="slots-in-context">In context</h2>
        <p>Blank cards use a fluid row layout inside <code>.card__slots</code> so teams can map header, body, and actions.</p>
        <div class="pdoc-demo" data-pdoc-demo>
          <div class="pdoc-demo__preview pdoc-demo__preview--muted">
            ${BLANK_CARD_CONTEXT}
          </div>
        </div>

        <h2 id="api">Class reference</h2>
        <div class="pdoc-table-wrap">
          <table class="pdoc-api">
            <thead><tr><th>Class</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>.slot</code></td><td>Dashed placeholder (min 139×42px, action colors)</td></tr>
              <tr><td><code>.slots-layout</code></td><td>Flex host with <code>$slot-gap</code> (24px)</td></tr>
              <tr><td><code>.slots-layout--column</code></td><td>Horizontal row of slots (1–6)</td></tr>
              <tr><td><code>.slots-layout--row</code></td><td>Vertical stack, fixed 139px width</td></tr>
              <tr><td><code>.slots-layout--fluid</code></td><td>Row layout at 100% width (cards)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="customize">Customize (Sass)</h2>
        ${pdocSteps([
          {
            id: 'slots-tokens',
            title: 'Slot spacing',
            body: 'Override gap and minimum slot width before importing components.',
            code: `@use "pimentcss-design-system" with (
  $slot-gap: 1.5rem,
  $slot-min-width: 10rem
);`,
            label: 'variables',
            lang: 'scss',
          },
          {
            id: 'slots-rebuild',
            title: 'Rebuild CSS',
            body: 'Run after editing _slot.scss or _slots-layout.scss.',
            code: 'npm run build:css',
            label: 'Terminal',
            lang: 'bash',
          },
        ])}

        <h2 id="accessibility">Accessibility (RGAA / WCAG)</h2>
        <div class="pdoc-callout pdoc-callout--a11y">
          <p class="pdoc-callout__title">Slots in production</p>
          <ul>
            <li><strong>Wireframes only</strong>, <code>.slot</code> is a design-time placeholder. Replace with semantic HTML (headings, buttons, landmarks) before shipping.</li>
            <li><strong>Reading order</strong>, column layouts follow DOM order left to right (then next line if wrapped); row layouts top to bottom. Match visual order for keyboard and screen readers.</li>
            <li><strong>Grouped regions</strong>, when multiple slots become one pattern (for example a card), use a single <code>role="group"</code> with <code>aria-label</code> on the layout, not on each placeholder.</li>
            <li><strong>Page grid</strong>, for full-page structure use <a href="/docs/layout">Layout</a> (<code>.container</code>, <code>.row</code>, <code>.col-*</code>).</li>
          </ul>
        </div>

        <h2 id="next-steps">Next steps</h2>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/cards"><p class="pdoc-card__title">Cards</p><p class="pdoc-card__desc">Blank card with fluid row slots.</p></a>
          <a class="pdoc-card" href="/docs/layout"><p class="pdoc-card__title">Layout</p><p class="pdoc-card__desc">12-column page grid.</p></a>
          <a class="pdoc-card" href="/docs/placeholder"><p class="pdoc-card__title">Placeholder</p><p class="pdoc-card__desc">Skeleton loading blocks.</p></a>
        </div>`;
}
