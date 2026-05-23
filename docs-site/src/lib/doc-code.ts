/** Light syntax highlighting for documentation blocks. */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrap(cls: string, text: string): string {
  return `<span class="${cls}">${text}</span>`;
}

export function highlightCode(raw: string, lang: string): string {
  const code = raw.trim();
  if (!code) return '';

  if (lang === 'html' || lang === 'xml') {
    return escapeHtml(code)
      .replace(
        /(&lt;\/?)([\w-]+)/g,
        '$1<span class="tok-tag">$2</span>',
      )
      .replace(
        /(class|href|rel|type|id|name|for|aria-[a-z-]+)=(&quot;[^&]*?&quot;)/g,
        '<span class="tok-attr">$1</span>=<span class="tok-str">$2</span>',
      );
  }

  if (lang === 'scss' || lang === 'css') {
    return escapeHtml(code)
      .replace(/(@use|@import|@forward|with)\b/g, wrap('tok-kw', '$1'))
      .replace(/(\$[\w-]+)/g, wrap('tok-var', '$1'))
      .replace(/(\/\/.*)$/gm, wrap('tok-comment', '$1'));
  }

  if (lang === 'bash' || lang === 'shell' || lang === 'sh') {
    const lines = code.split('\n');
    return lines
      .map((line) => {
        const esc = escapeHtml(line);
        if (/^\s*#/.test(line)) return wrap('tok-comment', esc);
        return esc
          .replace(
            /^(npm|npx|cd|node)\b/g,
            wrap('tok-cmd', '$1'),
          )
          .replace(
            /\b(install|run|create|init|build|dev)\b/g,
            wrap('tok-fn', '$1'),
          )
          .replace(
            /(&quot;[^&]*?&quot;|'[^']*')/g,
            wrap('tok-str', '$1'),
          );
      })
      .join('\n');
  }

  if (lang === 'js' || lang === 'javascript' || lang === 'ts') {
    return escapeHtml(code)
      .replace(/\b(import|from|export|const|let|var)\b/g, wrap('tok-kw', '$1'))
      .replace(/(&quot;[^&]*?&quot;|'[^']*')/g, wrap('tok-str', '$1'));
  }

  return escapeHtml(code);
}
