/**
 * Scenario: view previous hints
 * Given the user has requested multiple hints during a session
 * When they scroll through the popup
 * Then they should see a scrollable list of all previous hints with timestamps
 * And the most recent hint should appear at the top
 */

import { HintHistoryEntry, addHintToHistory, getHintHistory, clearHintHistory } from '../src/hint-history';
import { renderHintHistory } from '../src/popup-ui';

describe('Scenario: view previous hints', () => {
  let mockStorage: Record<string, unknown>;

  beforeEach(() => {
    mockStorage = {};
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
          remove: jest.fn((keys: string | string[], cb?: () => void) => {
            const arr = Array.isArray(keys) ? keys : [keys];
            for (const k of arr) delete mockStorage[k];
            if (cb) cb();
          }),
        },
      },
    };
  });

  it('stores a hint with a timestamp in history', (done) => {
    addHintToHistory('Use a hash map for O(n) lookup', () => {
      getHintHistory((history) => {
        expect(history).toHaveLength(1);
        expect(history[0].hint).toBe('Use a hash map for O(n) lookup');
        expect(typeof history[0].timestamp).toBe('number');
        done();
      });
    });
  });

  it('stores multiple hints and preserves order (most recent first)', (done) => {
    addHintToHistory('First hint', () => {
      // Advance time slightly so timestamps differ
      const entry = (mockStorage.hintHistory as HintHistoryEntry[]);
      entry[0].timestamp = Date.now() - 5000;
      mockStorage.hintHistory = entry;

      addHintToHistory('Second hint', () => {
        getHintHistory((history) => {
          expect(history).toHaveLength(2);
          expect(history[0].hint).toBe('Second hint');
          expect(history[1].hint).toBe('First hint');
          expect(history[0].timestamp).toBeGreaterThan(history[1].timestamp);
          done();
        });
      });
    });
  });

  it('renders a scrollable list of hints with timestamps', () => {
    const container = document.createElement('div');
    const now = Date.now();
    const entries: HintHistoryEntry[] = [
      { hint: 'Latest hint about recursion', timestamp: now },
      { hint: 'Earlier hint about arrays', timestamp: now - 60000 },
    ];

    renderHintHistory(container, entries);

    const items = container.querySelectorAll('.hint-history-item');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Latest hint about recursion');
    expect(items[1].textContent).toContain('Earlier hint about arrays');
  });

  it('displays timestamps on each hint entry', () => {
    const container = document.createElement('div');
    const entries: HintHistoryEntry[] = [
      { hint: 'Some hint', timestamp: Date.now() },
    ];

    renderHintHistory(container, entries);

    const timeEl = container.querySelector('.hint-timestamp');
    expect(timeEl).not.toBeNull();
    expect(timeEl!.textContent!.length).toBeGreaterThan(0);
  });

  it('shows the most recent hint at the top', () => {
    const container = document.createElement('div');
    const entries: HintHistoryEntry[] = [
      { hint: 'Newest', timestamp: Date.now() },
      { hint: 'Oldest', timestamp: Date.now() - 120000 },
    ];

    renderHintHistory(container, entries);

    const items = container.querySelectorAll('.hint-history-item');
    expect(items[0].textContent).toContain('Newest');
    expect(items[1].textContent).toContain('Oldest');
  });

  it('clears hint history', (done) => {
    addHintToHistory('A hint', () => {
      clearHintHistory(() => {
        getHintHistory((history) => {
          expect(history).toHaveLength(0);
          done();
        });
      });
    });
  });

  it('renders empty state when no history exists', () => {
    const container = document.createElement('div');
    renderHintHistory(container, []);

    expect(container.textContent).toContain('No hints yet');
  });
});
