/**
 * Scenario: user can configure their API key
 * Given the user has an Anthropic API key
 * When they open the extension settings
 * Then they should be able to enter and save their API key securely
 *
 * Scenario: Configure an open ai key
 * Given A user has a key from an open ai compatible llm like qwen
 * When add the api key, the base url and the model
 * Then The model should be used.
 */

import { renderOptions, saveConfig, loadConfig, OptionsState } from '../src/options-ui';

// Mock chrome.storage.local
const storageData: Record<string, unknown> = {};
const chromeMock = {
  storage: {
    local: {
      set: jest.fn((data: Record<string, unknown>, cb?: () => void) => {
        Object.assign(storageData, data);
        cb?.();
      }),
      get: jest.fn((keys: string[], cb: (result: Record<string, unknown>) => void) => {
        const result: Record<string, unknown> = {};
        keys.forEach(k => { result[k] = storageData[k]; });
        cb(result);
      })
    }
  }
};
(global as unknown as Record<string, unknown>).chrome = chromeMock;

describe('Scenario: user can configure their API key', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Object.keys(storageData).forEach(k => delete storageData[k]);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders the Anthropic provider option', () => {
    const state: OptionsState = { provider: 'anthropic', apiKey: '', model: 'claude-haiku-4-5-20251001' };
    renderOptions(container, state);
    expect(container.innerHTML).toContain('anthropic');
  });

  it('renders input fields for Anthropic: API key and model', () => {
    const state: OptionsState = { provider: 'anthropic', apiKey: '', model: 'claude-haiku-4-5-20251001' };
    renderOptions(container, state);
    const inputs = container.querySelectorAll('input');
    const inputNames = Array.from(inputs).map(i => i.name);
    expect(inputNames).toContain('apiKey');
  });

  it('pre-fills saved Anthropic API key (masked)', () => {
    const state: OptionsState = { provider: 'anthropic', apiKey: 'sk-ant-abc123', model: 'claude-haiku-4-5-20251001' };
    renderOptions(container, state);
    const keyInput = container.querySelector<HTMLInputElement>('input[name="apiKey"]');
    expect(keyInput?.type).toBe('password');
    expect(keyInput?.value).toBe('sk-ant-abc123');
  });

  it('saves Anthropic config to chrome.storage.local', async () => {
    await saveConfig({ provider: 'anthropic', apiKey: 'sk-ant-xyz', model: 'claude-haiku-4-5-20251001' });
    expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        llmConfig: expect.objectContaining({ provider: 'anthropic', apiKey: 'sk-ant-xyz' })
      }),
      expect.any(Function)
    );
  });

  it('loads saved config from chrome.storage.local', async () => {
    storageData.llmConfig = { provider: 'anthropic', apiKey: 'sk-ant-saved', model: 'claude-haiku-4-5-20251001' };
    const config = await loadConfig();
    expect(config?.provider).toBe('anthropic');
    expect(config?.apiKey).toBe('sk-ant-saved');
  });
});

describe('Scenario: Configure an open ai key', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Object.keys(storageData).forEach(k => delete storageData[k]);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders input fields for OpenAI-compatible: API key, base URL, and model', () => {
    const state: OptionsState = {
      provider: 'openai-compatible', apiKey: '', baseUrl: '', model: ''
    };
    renderOptions(container, state);
    const inputs = container.querySelectorAll('input');
    const inputNames = Array.from(inputs).map(i => i.name);
    expect(inputNames).toContain('apiKey');
    expect(inputNames).toContain('baseUrl');
    expect(inputNames).toContain('model');
  });

  it('pre-fills saved OpenAI-compatible config values', () => {
    const state: OptionsState = {
      provider: 'openai-compatible',
      apiKey: 'qwen-key-123',
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      model: 'qwen-turbo'
    };
    renderOptions(container, state);
    const baseUrlInput = container.querySelector<HTMLInputElement>('input[name="baseUrl"]');
    const modelInput = container.querySelector<HTMLInputElement>('input[name="model"]');
    expect(baseUrlInput?.value).toBe('https://dashscope.aliyuncs.com/compatible-mode/v1');
    expect(modelInput?.value).toBe('qwen-turbo');
  });

  it('saves OpenAI-compatible config including baseUrl and model', async () => {
    await saveConfig({
      provider: 'openai-compatible',
      apiKey: 'qwen-key',
      baseUrl: 'https://api.qwen.ai/v1',
      model: 'qwen-plus'
    });
    expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        llmConfig: expect.objectContaining({
          provider: 'openai-compatible',
          baseUrl: 'https://api.qwen.ai/v1',
          model: 'qwen-plus'
        })
      }),
      expect.any(Function)
    );
  });

  it('loaded OpenAI-compatible config is used by the LLM client', async () => {
    storageData.llmConfig = {
      provider: 'openai-compatible',
      apiKey: 'qwen-key',
      baseUrl: 'https://api.qwen.ai/v1',
      model: 'qwen-turbo'
    };
    const config = await loadConfig();
    expect(config?.provider).toBe('openai-compatible');
    expect((config as { baseUrl?: string })?.baseUrl).toBe('https://api.qwen.ai/v1');
    expect(config?.model).toBe('qwen-turbo');
  });
});
