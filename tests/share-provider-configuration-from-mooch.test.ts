/**
 * Scenario: share provider configuration from Mooch desktop
 */

import { getMoochProviders, MOOCH_BASE_URL } from '../src/mooch-bridge';

describe('Scenario: share provider configuration from Mooch desktop', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('fetches available providers from Mooch', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        providers: [
          { name: 'Claude', type: 'anthropic', configured: true },
          { name: 'Ollama', type: 'openai-compatible', configured: true },
        ],
      }),
    });

    const providers = await getMoochProviders();
    expect(providers).toHaveLength(2);
    expect(providers[0].name).toBe('Claude');
    expect(providers[0].configured).toBe(true);
  });

  it('does not expose API keys in the response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        providers: [{ name: 'Claude', type: 'anthropic', configured: true }],
      }),
    });

    const providers = await getMoochProviders();
    const json = JSON.stringify(providers);
    expect(json).not.toContain('apiKey');
    expect(json).not.toContain('sk-');
  });
});
