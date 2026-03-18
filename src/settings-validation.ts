import { LLMConfig } from './llm-client';

export interface TestConnectionResult {
  success: boolean;
  message: string;
}

export interface ApiKeyValidation {
  valid: boolean;
  warning: string | null;
}

export async function testConnection(config: LLMConfig): Promise<TestConnectionResult> {
  if (config.provider === 'mooch') {
    return { success: false, message: 'Use the Mooch desktop app to test provider connections' };
  }

  try {
    if (config.provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }],
        }),
      });

      if (!response.ok) {
        return { success: false, message: `Connection failed: HTTP ${response.status}` };
      }
      return { success: true, message: 'Connection successful' };
    } else {
      const url = `${config.baseUrl.replace(/\/$/, '')}/chat/completions`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (config.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        }),
      });

      if (!response.ok) {
        return { success: false, message: `Connection failed: HTTP ${response.status}` };
      }
      return { success: true, message: 'Connection successful' };
    }
  } catch (err) {
    return { success: false, message: `Connection failed: ${String(err)}` };
  }
}

export function validateApiKey(provider: string, apiKey: string): ApiKeyValidation {
  if (provider === 'anthropic') {
    if (!apiKey) {
      return { valid: false, warning: 'API key is required for Anthropic' };
    }
    if (!apiKey.startsWith('sk-ant-')) {
      return { valid: false, warning: 'Anthropic keys typically start with sk-ant-' };
    }
    return { valid: true, warning: null };
  }

  // openai-compatible: empty key is fine (local models)
  return { valid: true, warning: null };
}
