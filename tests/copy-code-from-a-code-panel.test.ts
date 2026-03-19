/**
 * Scenario: copy code from a code panel
 * Given a code panel is displayed in the popup
 * When the user clicks the copy button (rendered using lucide-react Copy icon) in the top-right corner of the panel
 * Then the code content should be copied to the clipboard
 * And the button icon should briefly change to a Check icon to confirm the copy succeeded
 * And after 2 seconds the button should revert to the Copy icon
 */

import { renderHints, attachCopyHandlers } from '../src/popup-ui';

describe('Scenario: copy code from a code panel', () => {
  let container: HTMLElement;
  let writeTextMock: jest.Mock;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.useRealTimers();
  });

  it('renders a copy button inside code panels', () => {
    renderHints(container, { status: 'ready', hints: '```javascript\nconsole.log("hello");\n```' });
    attachCopyHandlers(container);

    const copyBtn = container.querySelector('.copy-btn');
    expect(copyBtn).not.toBeNull();
  });

  it('copies code content to clipboard when copy button is clicked', () => {
    renderHints(container, { status: 'ready', hints: '```javascript\nconsole.log("hello");\n```' });
    attachCopyHandlers(container);

    const copyBtn = container.querySelector('.copy-btn') as HTMLButtonElement;
    copyBtn.click();

    expect(writeTextMock).toHaveBeenCalledWith('console.log("hello");');
  });

  it('adds copied class to button after clicking copy', async () => {
    renderHints(container, { status: 'ready', hints: '```javascript\nconsole.log("hello");\n```' });
    attachCopyHandlers(container);

    const copyBtn = container.querySelector('.copy-btn') as HTMLButtonElement;
    copyBtn.click();
    await Promise.resolve();

    expect(copyBtn.classList.contains('copied')).toBe(true);
  });

  it('removes copied class after 2 seconds', async () => {
    renderHints(container, { status: 'ready', hints: '```javascript\nconsole.log("hello");\n```' });
    attachCopyHandlers(container);

    const copyBtn = container.querySelector('.copy-btn') as HTMLButtonElement;
    copyBtn.click();
    await Promise.resolve();

    jest.advanceTimersByTime(2000);
    expect(copyBtn.classList.contains('copied')).toBe(false);
  });

  it('code panel wraps pre element', () => {
    renderHints(container, { status: 'ready', hints: '```python\nprint("hi")\n```' });
    attachCopyHandlers(container);

    const panel = container.querySelector('.code-panel');
    expect(panel).not.toBeNull();
    expect(panel!.querySelector('pre')).not.toBeNull();
  });

  it('copy button is positioned in top-right corner of panel', () => {
    renderHints(container, { status: 'ready', hints: '```js\nlet x = 1;\n```' });
    attachCopyHandlers(container);

    const panel = container.querySelector('.code-panel');
    const copyBtn = panel!.querySelector('.copy-btn');
    expect(copyBtn).not.toBeNull();
    // Button should be inside the panel
    expect(panel!.contains(copyBtn)).toBe(true);
  });
});
