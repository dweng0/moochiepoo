/**
 * Scenario: detect running Mooch desktop app
 */

import { checkMoochHealth, MOOCH_BASE_URL } from '../src/mooch-bridge';

describe('Scenario: detect running Mooch desktop app', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
    (global as any).AbortSignal = { timeout: () => undefined };
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('returns health data when Mooch is running', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', version: '1.0.0', activeSession: null }),
    });

    const health = await checkMoochHealth();
    expect(health).not.toBeNull();
    expect(health!.status).toBe('ok');
    expect(health!.version).toBe('1.0.0');
  });

  it('returns null when Mooch is not running', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));

    const health = await checkMoochHealth();
    expect(health).toBeNull();
  });

  it('probes the correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', version: '1.0.0', activeSession: null }),
    });

    await checkMoochHealth();
    expect(global.fetch).toHaveBeenCalledWith(
      `${MOOCH_BASE_URL}/health`,
      expect.objectContaining({ headers: { 'X-Mooch-Client': 'chrome-extension' } }),
    );
  });
});
