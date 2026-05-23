/** Normalized HTML indentation (2 spaces) for documentation code blocks. */

const NODE_TEXT = 3;
const NODE_ELEMENT = 1;

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const INLINE_TAGS = new Set([
  'a',
  'abbr',
  'b',
  'button',
  'cite',
  'code',
  'em',
  'i',
  'label',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'use',
]);

function attrs(el: Element): string {
  return [...el.attributes]
    .map(({ name, value }) => `${name}="${value}"`)
    .join(' ');
}

function openTag(el: Element, selfClose = false): string {
  const tag = el.tagName.toLowerCase();
  const a = attrs(el);
  const suffix = selfClose ? ' />' : '>';
  return a ? `<${tag} ${a}${suffix}` : `<${tag}${suffix}`;
}

function serializeInline(el: Element): string {
  const tag = el.tagName.toLowerCase();
  if (VOID_TAGS.has(tag)) {
    const a = attrs(el);
    const selfClose = tag === 'input' || tag === 'meta' || tag === 'link';
    return a
      ? selfClose
        ? `<${tag} ${a}>`
        : `<${tag} ${a} />`
      : selfClose
        ? `<${tag}>`
        : `<${tag} />`;
  }
  const inner = [...el.childNodes]
    .map((n) => {
      if (n.nodeType === NODE_TEXT) return n.textContent ?? '';
      if (n.nodeType === NODE_ELEMENT) return serializeInline(n as Element);
      return '';
    })
    .join('');
  return `${openTag(el)}${inner}</${tag}>`;
}

function meaningfulChildren(el: Element): ChildNode[] {
  return [...el.childNodes].filter(
    (n) =>
      n.nodeType === NODE_ELEMENT ||
      (n.nodeType === NODE_TEXT && (n.textContent?.trim() ?? '').length > 0),
  );
}

function isInlineSubtree(node: ChildNode): boolean {
  if (node.nodeType === NODE_TEXT) return true;
  if (node.nodeType !== NODE_ELEMENT) return false;
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (!INLINE_TAGS.has(tag) && tag !== 'svg') return false;
  return meaningfulChildren(el).every(isInlineSubtree);
}

function printNode(node: Node, depth: number, lines: string[]): void {
  const pad = '  '.repeat(depth);

  if (node.nodeType === NODE_TEXT) {
    const text = node.textContent?.trim() ?? '';
    if (text) lines.push(`${pad}${text}`);
    return;
  }

  if (node.nodeType !== NODE_ELEMENT) return;

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (VOID_TAGS.has(tag)) {
    const a = attrs(el);
    const selfClose = tag === 'input' || tag === 'meta' || tag === 'link';
    lines.push(
      a
        ? selfClose
          ? `${pad}<${tag} ${a}>`
          : `${pad}<${tag} ${a} />`
        : selfClose
          ? `${pad}<${tag}>`
          : `${pad}<${tag} />`,
    );
    return;
  }

  const children = meaningfulChildren(el);

  if (children.length === 0) {
    const a = attrs(el);
    lines.push(a ? `${pad}<${tag} ${a}></${tag}>` : `${pad}<${tag}></${tag}>`);
    return;
  }

  if (children.every(isInlineSubtree)) {
    const inner = children
      .map((c) => {
        if (c.nodeType === NODE_TEXT) return c.textContent?.trim() ?? '';
        return serializeInline(c as Element);
      })
      .join('');
    const a = attrs(el);
    lines.push(a ? `${pad}<${tag} ${a}>${inner}</${tag}>` : `${pad}<${tag}>${inner}</${tag}>`);
    return;
  }

  const a = attrs(el);
  lines.push(a ? `${pad}<${tag} ${a}>` : `${pad}<${tag}>`);
  for (const child of children) printNode(child, depth + 1, lines);
  lines.push(`${pad}</${tag}>`);
}

/** Formats a parsed &lt;body&gt; fragment with 2-space indentation. */
export function prettyPrintFromBody(body: Element): string {
  const lines: string[] = [];
  for (const child of meaningfulChildren(body)) {
    printNode(child, 0, lines);
  }
  return lines.join('\n');
}

/** Formats a single element tree (linkedom / HTML fragment roots). */
export function prettyPrintElement(el: Element): string {
  const lines: string[] = [];
  printNode(el, 0, lines);
  return lines.join('\n');
}

/** Formats an HTML fragment with 2-space indentation (browser / DOMParser). */
export function prettyPrintHtml(html: string): string {
  const source = html.trim();
  if (!source) return '';

  if (typeof DOMParser === 'undefined') {
    return source.replace(/>\s+</g, '>\n<');
  }

  try {
    const doc = new DOMParser().parseFromString(`<body>${source}</body>`, 'text/html');
    return prettyPrintFromBody(doc.body);
  } catch {
    return source.replace(/>\s+</g, '>\n<');
  }
}
