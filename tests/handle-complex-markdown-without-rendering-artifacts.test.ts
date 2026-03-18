/**
 * Scenario: handle complex markdown without rendering artifacts
 * Given the LLM returns a response with nested or mixed markdown
 * When the hint is displayed in the popup
 * Then all markdown should render correctly without artifacts or broken formatting
 */

import { renderHints } from '../src/popup-ui';

describe('Scenario: handle complex markdown without rendering artifacts', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders bold inside a list item', () => {
    renderHints(container, { status: 'ready', hints: '- Use a **hash map** for lookups' });
    expect(container.querySelector('li')).not.toBeNull();
    expect(container.querySelector('strong')?.textContent).toBe('hash map');
  });

  it('renders adjacent bold and italic without artifacts', () => {
    renderHints(container, { status: 'ready', hints: '**bold** and *italic* text' });
    expect(container.querySelector('strong')?.textContent).toBe('bold');
    expect(container.querySelector('em')?.textContent).toBe('italic');
    expect(container.textContent).not.toContain('**');
    expect(container.textContent).not.toContain('*');
  });

  it('does not break on code blocks with special characters', () => {
    const md = '```javascript\nconst x = a && b || c;\n```';
    renderHints(container, { status: 'ready', hints: md });
    expect(container.querySelector('pre')).not.toBeNull();
    expect(container.querySelector('code')?.textContent).toContain('&&');
  });

  it('handles inline code next to bold', () => {
    renderHints(container, { status: 'ready', hints: 'Use **`Map`** for O(1) lookups' });
    expect(container.textContent).toContain('Map');
    expect(container.textContent).not.toContain('**');
  });

  it('handles multiple headings in sequence', () => {
    const md = '## Step 1\nDo this\n## Step 2\nDo that';
    renderHints(container, { status: 'ready', hints: md });
    const headings = container.querySelectorAll('h2');
    expect(headings).toHaveLength(2);
  });
});
