/**
 * Scenario: sync interview context from Mooch desktop
 */

import { checkMoochHealth } from '../src/mooch-bridge';

describe('Scenario: sync interview context from Mooch desktop', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
    (global as any).AbortSignal = { timeout: () => undefined };
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('health response includes activeSession when an interview is in progress', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        version: '1.0.0',
        activeSession: 'interview-2026-03-18T12:00:00Z',
      }),
    });

    const health = await checkMoochHealth();
    expect(health!.activeSession).toBe('interview-2026-03-18T12:00:00Z');
  });

  it('activeSession is null when no interview is active', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', version: '1.0.0', activeSession: null }),
    });

    const health = await checkMoochHealth();
    expect(health!.activeSession).toBeNull();
  });
});
