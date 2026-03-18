export function detectLanguage(doc: Document): string | null {
  // LeetCode: language selector button
  const leetcodeSelector = doc.querySelector('.ant-select-selection-item[title]');
  if (leetcodeSelector) {
    return leetcodeSelector.getAttribute('title');
  }

  // CodeMirror: data-lang attribute on line elements
  const cmLine = doc.querySelector('[data-lang]');
  if (cmLine) {
    return cmLine.getAttribute('data-lang');
  }

  // Generic: <select> with language-related class
  const langSelect = doc.querySelector('select.language-selector') as HTMLSelectElement | null;
  if (langSelect && langSelect.selectedOptions.length > 0) {
    const text = langSelect.selectedOptions[0].textContent?.trim();
    if (text) return text;
  }

  return null;
}
