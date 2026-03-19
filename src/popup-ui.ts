import { HintHistoryEntry } from './hint-history';
import { getSupportedSiteNames } from './site-profiles';

export type HintsState =
  | { status: 'loading' }
  | { status: 'ready'; hints: string }
  | { status: 'streaming'; partialHint: string }
  | { status: 'error'; message: string }
  | { status: 'no-code' };

// Markdown to HTML converter
function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // Extract code blocks first, replace with placeholders to protect from further processing
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_match, lang, code) => {
    const idx = codeBlocks.length;
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rawCode = code.trimEnd().replace(/"/g, '&quot;');
    codeBlocks.push(
      `<div class="code-panel"><button class="copy-btn" data-code="${rawCode}" title="Copy code"></button><pre><code class="${lang}">${escaped.trimEnd()}</code></pre></div>`
    );
    return `%%CODEBLOCK_${idx}%%`;
  });

  // Extract inline code, replace with placeholders
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_match, code) => {
    const idx = inlineCodes.length;
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    inlineCodes.push(`<code>${escaped}</code>`);
    return `%%INLINE_${idx}%%`;
  });

  // Headings
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // Bold then italic (order matters)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Bullet lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');

  // Wrap consecutive <li> in <ul>
  const lines = html.split('\n');
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('<li>')) {
      if (!inList) { lines[i] = '<ul>' + lines[i]; inList = true; }
    } else if (inList) {
      lines[i - 1] += '</ul>';
      inList = false;
    }
  }
  if (inList) lines[lines.length - 1] += '</ul>';
  html = lines.join('\n');

  // Newlines to <br> (but not inside code blocks)
  html = html.replace(/\n/g, '<br>');
  html = html.replace(/^(<br>)+/, '').replace(/(<br>)+$/, '');

  // Restore code blocks and inline code
  codeBlocks.forEach((block, i) => { html = html.replace(`%%CODEBLOCK_${i}%%`, block); });
  inlineCodes.forEach((code, i) => { html = html.replace(`%%INLINE_${i}%%`, code); });

  return html;
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function renderHintHistory(container: HTMLElement, entries: HintHistoryEntry[]): void {
  container.innerHTML = '';

  if (entries.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No hints yet. Click "Get Hint" to get started.';
    container.appendChild(p);
    return;
  }

  const list = document.createElement('div');
  list.className = 'hint-history';

  for (const entry of entries) {
    const item = document.createElement('div');
    item.className = 'hint-history-item';

    const time = document.createElement('span');
    time.className = 'hint-timestamp';
    time.textContent = formatTimestamp(entry.timestamp);

    const body = document.createElement('div');
    body.className = 'hint-body';
    body.innerHTML = markdownToHtml(entry.hint);

    item.appendChild(time);
    item.appendChild(body);
    list.appendChild(item);
  }

  container.appendChild(list);
}

export function renderHints(container: HTMLElement, state: HintsState): void {
  container.innerHTML = '';

  switch (state.status) {
    case 'loading': {
      const el = document.createElement('p');
      el.textContent = 'Loading hints…';
      container.appendChild(el);
      break;
    }
    case 'ready': {
      const el = document.createElement('div');
      el.innerHTML = markdownToHtml(state.hints);
      container.appendChild(el);
      break;
    }
    case 'streaming': {
      const el = document.createElement('div');
      el.innerHTML = markdownToHtml(state.partialHint);
      container.appendChild(el);
      const indicator = document.createElement('span');
      indicator.className = 'streaming-indicator';
      indicator.textContent = '●';
      container.appendChild(indicator);
      break;
    }
    case 'error': {
      const el = document.createElement('p');
      el.textContent = `Error: ${state.message}`;
      container.appendChild(el);
      break;
    }
    case 'no-code': {
      const el = document.createElement('p');
      el.textContent = 'No code detected on this page. Navigate to a coding challenge to get hints.';
      container.appendChild(el);
      break;
    }
  }
}

export function renderUnsupportedSite(container: HTMLElement): void {
  container.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = 'This site is not supported. Mooch Helper works on: ' + getSupportedSiteNames().join(', ') + '.';
  container.appendChild(p);
}

export function renderOnboarding(container: HTMLElement): void {
  container.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = 'Welcome to Mooch Helper! Configure your LLM provider to get started.';
  container.appendChild(p);
  const btn = document.createElement('a');
  btn.textContent = 'Open Settings';
  btn.href = '#';
  container.appendChild(btn);
}

export function renderContextInput(container: HTMLElement, onChange: (value: string) => void): void {
  container.innerHTML = '';

  const toggle = document.createElement('button');
  toggle.className = 'context-toggle';
  toggle.textContent = '+ Add context';
  toggle.type = 'button';

  const panel = document.createElement('div');
  panel.className = 'context-input-panel';
  panel.style.display = 'none';

  const textarea = document.createElement('textarea');
  textarea.placeholder = 'e.g. I am not allowed to use extra space';
  textarea.rows = 3;
  textarea.addEventListener('input', () => onChange(textarea.value));

  panel.appendChild(textarea);
  container.appendChild(toggle);
  container.appendChild(panel);

  toggle.addEventListener('click', () => {
    const expanded = panel.style.display !== 'none';
    panel.style.display = expanded ? 'none' : 'block';
    toggle.textContent = expanded ? '+ Add context' : '− Add context';
  });
}

export function attachCopyHandlers(container: HTMLElement): void {
  container.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code') ?? '';
      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      });
    });
  });
}
