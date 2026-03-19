/**
 * Scenario: Get Hint button changes to Regenerate after first hint
 * Given the user has already received at least one hint for the current page
 * When the popup is open
 * Then the "Get Hint" button label should change to "Regenerate"
 * And clicking "Regenerate" should request a new hint from the LLM
 * And the new hint should be prepended to the hint history
 */

import { createGetHintButton } from '../src/popup-button';
import { renderHints } from '../src/popup-ui';

describe('Scenario: Get Hint button changes to Regenerate after first hint', () => {
  let container: HTMLElement;
  let mockStorage: Record<string, unknown>;
  let onChangedListeners: Array<(changes: Record<string, { newValue?: unknown }>) => void>;
  let sendMessageMock: jest.Mock;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockStorage = {};
    onChangedListeners = [];
    sendMessageMock = jest.fn();

    (global as any).chrome = {
      storage: {
        local: {
          get: jest.fn((keys: string[], cb: (result: Record<string, unknown>) => void) => {
            const result: Record<string, unknown> = {};
            for (const k of keys) {
              if (k in mockStorage) result[k] = mockStorage[k];
            }
            cb(result);
          }),
          set: jest.fn((items: Record<string, unknown>, cb?: () => void) => {
            Object.assign(mockStorage, items);
            if (cb) cb();
          }),
          remove: jest.fn((_keys: string | string[], cb?: () => void) => {
            if (cb) cb();
          }),
          onChanged: {
            addListener: jest.fn((listener: (changes: Record<string, { newValue?: unknown }>) => void) => {
              onChangedListeners.push(listener);
            }),
          },
        },
      },
      runtime: {
        sendMessage: sendMessageMock,
      },
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.useRealTimers();
  });

  it('shows "Get Hint" label when no hints exist yet', () => {
    const btn = createGetHintButton(container, renderHints);
    expect(btn.textContent).toBe('Get Hint');
  });

  it('shows "Regenerate" label when hint history already exists', (done) => {
    mockStorage['hintHistory'] = [{ hint: 'Previous hint', timestamp: Date.now() - 5000 }];
    const btn = createGetHintButton(container, renderHints);

    // Allow async storage check to complete
    setTimeout(() => {
      expect(btn.textContent).toBe('Regenerate');
      done();
    }, 0);
    jest.runAllTimers();
  });

  it('changes button label to "Regenerate" after receiving a hint', () => {
    const btn = createGetHintButton(container, renderHints);
    expect(btn.textContent).toBe('Get Hint');

    // Simulate a hint arriving via storage change
    onChangedListeners.forEach(listener =>
      listener({ hints: { newValue: 'A new hint response' } })
    );

    expect(btn.textContent).toBe('Regenerate');
  });

  it('clicking Regenerate sends a new hint request', () => {
    mockStorage['extractedCode'] = 'function foo() {}';
    const btn = createGetHintButton(container, renderHints);
    btn.textContent = 'Regenerate';

    btn.click();

    expect(sendMessageMock).toHaveBeenCalledWith({ type: 'REQUEST_HINT' });
  });
});
