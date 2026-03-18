/**
 * Scenario: fall back to standalone mode when Mooch is unavailable
 */

import { checkMoochHealth } from '../src/mooch-bridge';

describe('Scenario: fall back to standalone mode when Mooch is unavailable', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
    (global as any).AbortSignal = { timeout: () => undefined };
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('returns null when Mooch is unreachable, enabling fallback', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));

    const health = await checkMoochHealth();
    expect(health).toBeNull();
    // Caller should use standalone LLM client when health is null
  });

  it('returns null on non-ok HTTP response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    const health = await checkMoochHealth();
    expect(health).toBeNull();
  });
});
