/**
 * Scenario: send code context to LLM
 * Given code has been extracted from the page
 * When the user requests a hint
 * Then the extension should send the code and page context to an LLM and return a helpful response
 */

import { requestHint, LLMConfig } from '../src/llm-client';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const anthropicConfig: LLMConfig = {
  provider: 'anthropic',
  apiKey: 'sk-ant-test',
  model: 'claude-haiku-4-5-20251001'
};

const openAICompatConfig: LLMConfig = {
  provider: 'openai-compatible',
  apiKey: 'test-key',
  baseUrl: 'https://api.example.com/v1',
  model: 'qwen-turbo'
};

describe('Scenario: send code context to LLM', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('sends code and page context to Anthropic and returns hint text', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Try a sliding window approach.' }]
      })
    });

    const result = await requestHint({
      code: 'function maxSum(arr) {}',
      pageTitle: 'Maximum Subarray - LeetCode',
      config: anthropicConfig
    });

    expect(result).toBe('Try a sliding window approach.');
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    const body = JSON.parse(options.body);
    expect(body.messages[0].content).toContain('function maxSum');
    expect(body.messages[0].content).toContain('Maximum Subarray');
  });

  it('sends code and page context to an OpenAI-compatible endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Use dynamic programming.' } }]
      })
    });

    const result = await requestHint({
      code: 'def climb_stairs(n): pass',
      pageTitle: 'Climbing Stairs - LeetCode',
      config: openAICompatConfig
    });

    expect(result).toBe('Use dynamic programming.');
    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/v1/chat/completions');
  });

  it('includes both code and page title in the prompt', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'Hint here.' }]
      })
    });

    await requestHint({
      code: 'const x = 1;',
      pageTitle: 'Two Sum - LeetCode',
      config: anthropicConfig
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const prompt: string = body.messages[0].content;
    expect(prompt).toContain('const x = 1;');
    expect(prompt).toContain('Two Sum - LeetCode');
  });

  it('throws a descriptive error when the API responds with an error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Invalid API key' } })
    });

    await expect(
      requestHint({ code: 'x', pageTitle: 'Test', config: anthropicConfig })
    ).rejects.toThrow('401');
  });

  it('throws when fetch itself fails (network error)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      requestHint({ code: 'x', pageTitle: 'Test', config: anthropicConfig })
    ).rejects.toThrow('Network error');
  });
});
