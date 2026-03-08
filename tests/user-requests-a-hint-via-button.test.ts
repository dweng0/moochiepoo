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
    container = document.createElement('div');
    hintsDiv = document.createElement('div');
    hintsDiv.id = 'hints';
    container.appendChild(hintsDiv);
    document.body.appendChild(container);
    Object.keys(storageData).forEach(k => delete storageData[k]);
    jest.clearAllMocks();
  });

  afterEach(() => {
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

  it('listens for storage changes to update the hints display', () => {
    createGetHintButton(hintsDiv, renderHints);
    expect(
      (chrome.storage.local.onChanged.addListener as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);
  });
});
