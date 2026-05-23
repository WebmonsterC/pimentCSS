/** Legacy combined page: points readers to the split Modals and Cards docs. */
export function buildModalsCardsRedirectPageHtml(): string {
  return `
        <p>This documentation was split into two pages:</p>
        <div class="pdoc-cards">
          <a class="pdoc-card" href="/docs/modals"><p class="pdoc-card__title">Modals</p><p class="pdoc-card__desc">Dialog overlays, sizes, focus trap, and behavior.</p></a>
          <a class="pdoc-card" href="/docs/cards"><p class="pdoc-card__title">Cards</p><p class="pdoc-card__desc">Copy, newsletter, blank, media ratios, elevated panel.</p></a>
        </div>
        <p class="body-medium">Inline feedback remains on <a href="/docs/alerts">Alerts</a>.</p>`;
}
