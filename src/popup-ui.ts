import { HintHistoryEntry } from './hint-history';

export type HintsState =
  | { status: 'loading' }
  | { status: 'ready'; hints: string }
  | { status: 'error'; message: string }
  | { status: 'no-code' };

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // First, handle code blocks - replace them with placeholders to avoid interference
  const codeBlockRegex = /```(\w+)?\n(.*?)\n```/gs;
  const codeBlocks: string[] = [];
  let match;
  while ((match = codeBlockRegex.exec(html)) !== null) {
    codeBlocks.push(match[0]);
  }
  
  // Convert code blocks to proper HTML
  html = html.replace(/```(\w+)?\n(.*?)\n```/gs, '<pre><code class="$1">$2</code></pre>');

  // Convert headings (# Header -> <h1>Header</h1>)
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // Convert bold (**text** -> <strong>text</strong>)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert italic (*text* -> <em>text</em>)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert bullet lists (- item -> <li>item</li>)
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');

  // Wrap lists in <ul> tags
  const lines = html.split('\n');
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('<li>')) {
      if (!inList) {
        lines[i] = '<ul>' + lines[i];
        inList = true;
      }
    } else {
      if (inList && !lines[i].startsWith('<')) {
        // If we're in a list and encounter non-tag text, close the list
        lines[i] = '</ul>' + lines[i];
        inList = false;
      }
    }
  }
  if (inList) {
    lines.push('</ul>');
  }
  html = lines.join('\n');

  // Convert inline code (`code` -> <code>code</code>)
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Convert newlines to <br> tags
  html = html.replace(/\n/g, '<br>');

  // Remove extra <br> tags at the beginning and end
  html = html.replace(/<br>$/g, '');
  html = html.replace(/^<br>/g, '');
  
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
