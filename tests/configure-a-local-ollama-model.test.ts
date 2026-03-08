/**
 * Scenario: Configure a local Ollama model
 * Given a user has Ollama running locally with a model pulled
 * When they open the extension settings and select OpenAI-compatible provider
 * And they enter a localhost base URL (e.g. http://localhost:11434/v1) and a model name but no API key
 * Then the extension should send hint requests to the local Ollama instance successfully
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

describe('Scenario: Configure a local Ollama model', () => {
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

  it('renders input fields for OpenAI-compatible provider including base URL and model', () => {
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

  it('allows configuring a local Ollama instance without an API key', () => {
    const state: OptionsState = {
      provider: 'openai-compatible',
      apiKey: '', // No API key needed for local Ollama
      baseUrl: 'http://localhost:11434/v1',
      model: 'llama3'
    };
    renderOptions(container, state);
    
    const baseUrlInput = container.querySelector<HTMLInputElement>('input[name="baseUrl"]');
    const modelInput = container.querySelector<HTMLInputElement>('input[name="model"]');
    
    expect(baseUrlInput?.value).toBe('http://localhost:11434/v1');
    expect(modelInput?.value).toBe('llama3');
  });

  it('saves OpenAI-compatible config including base URL and model for Ollama', async () => {
    await saveConfig({
      provider: 'openai-compatible',
      apiKey: '', // Empty API key for Ollama
      baseUrl: 'http://localhost:11434/v1',
      model: 'mistral'
    });
    
    expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        llmConfig: expect.objectContaining({
          provider: 'openai-compatible',
          baseUrl: 'http://localhost:11434/v1',
          model: 'mistral'
        })
      }),
      expect.any(Function)
    );
  });

  it('loads saved Ollama config and uses it for hint requests', async () => {
    storageData.llmConfig = {
      provider: 'openai-compatible',
      apiKey: '', // No API key needed
      baseUrl: 'http://localhost:11434/v1',
      model: 'codellama'
    };
    
    const config = await loadConfig();
    expect(config?.provider).toBe('openai-compatible');
    expect((config as { baseUrl?: string })?.baseUrl).toBe('http://localhost:11434/v1');
    expect(config?.model).toBe('codellama');
  });
});