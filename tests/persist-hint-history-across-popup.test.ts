/**
 * Scenario: persist hint history across popup open and close
 * Scenario: clear hint history on navigation
 */

import { addHintToHistory, getHintHistory, clearHintHistory } from '../src/hint-history';

describe('Scenario: hint history persistence', () => {
  let mockStorage: Record<string, unknown>;

  beforeEach(() => {
    mockStorage = {};
    (global as any).chrome = {
      storage: {
        local: {
          get: jest.fn((keys: string[], cb: (r: Record<string, unknown>) => void) => {
            const result: Record<string, unknown> = {};
            for (const k of keys) { if (k in mockStorage) result[k] = mockStorage[k]; }
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

  it('hint history persists in storage after popup closes and reopens', (done) => {
    addHintToHistory('Persistent hint', () => {
      // Simulate closing popup and reopening — storage remains
      getHintHistory((history) => {
        expect(history).toHaveLength(1);
        expect(history[0].hint).toBe('Persistent hint');
        done();
      });
    });
  });

  it('clearHintHistory removes all entries (simulates navigation)', (done) => {
    addHintToHistory('Old hint', () => {
      clearHintHistory(() => {
        getHintHistory((history) => {
          expect(history).toHaveLength(0);
          done();
        });
      });
    });
  });
});
