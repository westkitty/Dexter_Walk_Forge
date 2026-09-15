export function documentBoundaries(html, label = 'document') {
  if (typeof html !== 'string') throw new TypeError(`${label}: HTML must be a string`);
  const lower = html.toLowerCase();
  const headClose = lower.indexOf('</head>');
  const bodyOpen = lower.indexOf('<body', Math.max(0, headClose));
  const bodyOpenEnd = bodyOpen >= 0 ? lower.indexOf('>', bodyOpen) : -1;
  const bodyClose = lower.lastIndexOf('</body>');
  const htmlClose = lower.lastIndexOf('</html>');

  const valid = headClose >= 0 && bodyOpen > headClose && bodyOpenEnd > bodyOpen && bodyClose > bodyOpenEnd && htmlClose > bodyClose;
  if (!valid) throw new Error(`${label}: malformed outer HTML document boundaries`);
  return { headClose, bodyOpen, bodyOpenEnd, bodyClose, htmlClose };
}

export function injectDocumentHooks(html, { headHook = '', bodyHook = '', headMarker = '', bodyMarker = '', label = 'document' } = {}) {
  let out = html;
  let bounds = documentBoundaries(out, label);

  if (headHook && (!headMarker || !out.includes(headMarker))) {
    out = out.slice(0, bounds.headClose) + headHook + out.slice(bounds.headClose);
    bounds = documentBoundaries(out, label);
  }

  if (bodyHook && (!bodyMarker || !out.includes(bodyMarker))) {
    out = out.slice(0, bounds.bodyClose) + bodyHook + out.slice(bounds.bodyClose);
  }

  documentBoundaries(out, label);
  return out;
}

export function firstInlineScript(html) {
  const lower = html.toLowerCase();
  let cursor = 0;
  while (true) {
    const open = lower.indexOf('<script', cursor);
    if (open < 0) return null;
    const openEnd = lower.indexOf('>', open);
    if (openEnd < 0) throw new Error('Unclosed <script> tag');
    const close = lower.indexOf('</script>', openEnd + 1);
    if (close < 0) throw new Error('Unclosed script element');
    const tag = lower.slice(open, openEnd + 1);
    if (!/\bsrc\s*=/.test(tag)) return html.slice(openEnd + 1, close);
    cursor = close + '</script>'.length;
  }
}
