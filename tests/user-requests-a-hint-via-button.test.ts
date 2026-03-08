/**
 * Scenario: user requests a hint via button
 * Given the user has opened the extension popup on a supported coding challenge page
 * When they click the Get Hint button
 * Then the popup should show a loading state and then display the LLM response
 */

import { renderHints } from '../src/popup-ui';
import { createGetHintButton } from '../src/popup-button';

const storageData: Record<string, unknown> = {};
const mockSendMessage = jest.fn();

(global as unknown as Record<string, unknown>).chrome = {
  runtime: { sendMessage: mockSendMessage },
  storage: {
    local: {
      get: jest.fn((keys: string[], cb: (r: Record<string, unknown>) => void) => {
        const result: Record<string, unknown> = {};
        keys.forEach(k => { result[k] = storageData[k]; });
        cb(result);
      }),
      remove: jest.fn((keys: string[], cb?: () => void) => {
        (keys as string[]).forEach(k => delete storageData[k]);
        cb?.();
      }),
      onChanged: {
        addListener: jest.fn()
      }
    }
  }
};

describe('Scenario: user requests a hint via button', () => {
  let container: HTMLElement;
  let hintsDiv: HTMLElement;

  beforeEach(() => {
    jest.useFakeTimers();
    container = document.createElement('div');
    hintsDiv = document.createElement('div');
    hintsDiv.id = 'hints';
    container.appendChild(hintsDiv);
    document.body.appendChild(container);
    Object.keys(storageData).forEach(k => delete storageData[k]);
    jest.clearAllMocks();
    // Re-wire remove mock after clearAllMocks
    (chrome.storage.local.remove as jest.Mock).mockImplementation((keys: string[], cb?: () => void) => {
      (keys as string[]).forEach(k => delete storageData[k]);
      cb?.();
    });
    (chrome.storage.local.get as jest.Mock).mockImplementation((keys: string[], cb: (r: Record<string, unknown>) => void) => {
      const result: Record<string, unknown> = {};
      keys.forEach(k => { result[k] = storageData[k]; });
      cb(result);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.removeChild(container);
  });

  it('renders a Get Hint button', () => {
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toMatch(/hint/i);
  });

  it('sends REQUEST_HINT message when button is clicked', () => {
    storageData.extractedCode = 'function foo() {}';
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);

    btn.click();

    expect(mockSendMessage).toHaveBeenCalledWith({ type: 'REQUEST_HINT' });
  });

  it('shows loading state immediately after click', () => {
    storageData.extractedCode = 'function foo() {}';
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);

    btn.click();

    expect(hintsDiv.textContent).toContain('Loading');
  });

  it('disables the button while loading', () => {
    storageData.extractedCode = 'function foo() {}';
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);

    btn.click();

    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('shows no-code message and does not send message when no code extracted', () => {
    storageData.extractedCode = undefined;
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);

    btn.click();

    expect(mockSendMessage).not.toHaveBeenCalled();
    expect(hintsDiv.textContent).toContain('No code detected');
  });

  it('displays hints when poll finds them in storage', () => {
    storageData.extractedCode = 'function foo() {}';
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);

    btn.click();

    // Simulate background writing hints to storage
    storageData.hints = 'Try a hash map approach.';
    jest.advanceTimersByTime(1000);

    expect(hintsDiv.textContent).toContain('Try a hash map approach.');
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('displays error when poll finds hintsError in storage', () => {
    storageData.extractedCode = 'function foo() {}';
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);

    btn.click();

    storageData.hintsError = 'Invalid API key';
    jest.advanceTimersByTime(1000);

    expect(hintsDiv.textContent).toContain('Invalid API key');
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('shows timeout error after 30 seconds with no response', () => {
    storageData.extractedCode = 'function foo() {}';
    const btn = createGetHintButton(hintsDiv, renderHints);
    container.appendChild(btn);

    btn.click();

    jest.advanceTimersByTime(30000);

    expect(hintsDiv.textContent).toContain('timed out');
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('listens for storage changes to update the hints display', () => {
    createGetHintButton(hintsDiv, renderHints);
    expect(
      (chrome.storage.local.onChanged.addListener as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);
  });
});
