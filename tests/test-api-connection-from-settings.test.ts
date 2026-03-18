/**
 * Scenario: test API connection from settings
 * Given the user has entered their LLM provider configuration
 * When they click a Test Connection button on the settings page
 * Then the extension should make a lightweight test call to the configured LLM
 * And display whether the connection succeeded or failed with a clear message
 */

import { testConnection, TestConnectionResult } from '../src/settings-validation';

describe('Scenario: test API connection from settings', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('returns success for a valid Anthropic config', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'ok' }] }),
    });

    const result = await testConnection({
      provider: 'anthropic',
      apiKey: 'sk-ant-api03-valid',
      model: 'claude-haiku-4-5-20251001',
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('success');
  });

  it('returns failure for an Anthropic config with bad key', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await testConnection({
      provider: 'anthropic',
      apiKey: 'bad-key',
      model: 'claude-haiku-4-5-20251001',
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('401');
  });

  it('returns success for a valid OpenAI-compatible config', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
    });

    const result = await testConnection({
      provider: 'openai-compatible',
      apiKey: 'sk-valid',
      baseUrl: 'http://localhost:11434/v1',
      model: 'llama3',
    });

    expect(result.success).toBe(true);
  });

  it('returns failure when fetch throws (network error)', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    const result = await testConnection({
      provider: 'anthropic',
      apiKey: 'sk-ant-api03-valid',
      model: 'claude-haiku-4-5-20251001',
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Failed to fetch');
  });

  it('result has the correct shape', () => {
    const result: TestConnectionResult = { success: true, message: 'Connection successful' };
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
  });
});
