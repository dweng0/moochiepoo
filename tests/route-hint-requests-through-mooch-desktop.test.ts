/**
 * Scenario: route hint requests through Mooch desktop
 */

import { requestHintViaMooch, MOOCH_BASE_URL } from '../src/mooch-bridge';

describe('Scenario: route hint requests through Mooch desktop', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('sends hint request to Mooch API and returns the hint', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ hint: 'Try using a sliding window' }),
    });

    const result = await requestHintViaMooch({
      code: 'function solve() {}',
      pageTitle: 'Two Sum',
      language: 'JavaScript',
    });

    expect(result.hint).toBe('Try using a sliding window');
    expect(global.fetch).toHaveBeenCalledWith(
      `${MOOCH_BASE_URL}/api/hint`,
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('includes the X-Mooch-Client header', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ hint: 'ok' }),
    });

    await requestHintViaMooch({ code: 'x', pageTitle: 'test' });

    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[1].headers['X-Mooch-Client']).toBe('chrome-extension');
  });

  it('throws on error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'no provider configured' }),
    });

    await expect(requestHintViaMooch({ code: 'x', pageTitle: 'test' }))
      .rejects.toThrow('no provider configured');
  });
});
