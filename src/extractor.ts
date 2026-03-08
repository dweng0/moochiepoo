/**
 * Code extractor for coding challenge websites.
 * Supports: LeetCode (Monaco editor), HackerRank/Codewars (CodeMirror), CoderPad (Ace/CodeMirror)
 */

/**
 * Extracts all code from the page as plain text.
 * Returns empty string if no code editor is found.
 */
export function extractCode(doc: Document): string {
  // Monaco editor (LeetCode)
  const monacoLines = doc.querySelector('.view-lines');
  if (monacoLines) {
    return extractTextLines(monacoLines, '.view-line');
  }

  // CodeMirror editor (HackerRank, Codewars, CoderPad)
  const codeMirror = doc.querySelector('.CodeMirror-code');
  if (codeMirror) {
    return extractTextLines(codeMirror, '.CodeMirror-line');
  }

  // Ace editor textarea fallback
  const aceTextarea = doc.querySelector('textarea.ace_text-input') as HTMLTextAreaElement | null;
  if (aceTextarea && aceTextarea.value) {
    return aceTextarea.value;
  }

  // Generic textarea fallback
  const textarea = doc.querySelector('textarea') as HTMLTextAreaElement | null;
  if (textarea && textarea.value) {
    return textarea.value;
  }

  return '';
}

function extractTextLines(container: Element, lineSelector: string): string {
  const lines = container.querySelectorAll(lineSelector);
  if (lines.length === 0) {
    return container.textContent?.trim() ?? '';
  }
  return Array.from(lines)
    .map(line => line.textContent ?? '')
    .join('\n');
}
