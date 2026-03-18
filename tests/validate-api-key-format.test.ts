/**
 * Scenario: validate API key format
 * Given the user enters an API key on the settings page
 * When the key does not match the expected format for the selected provider
 * Then the settings page should show an inline validation warning before saving
 */

import { validateApiKey, ApiKeyValidation } from '../src/settings-validation';

describe('Scenario: validate API key format', () => {
  it('accepts a valid Anthropic API key format', () => {
    const result = validateApiKey('anthropic', 'sk-ant-api03-abcdefghijklmnop');
    expect(result.valid).toBe(true);
    expect(result.warning).toBeNull();
  });

  it('warns on an Anthropic key that does not start with sk-ant-', () => {
    const result = validateApiKey('anthropic', 'some-random-string');
    expect(result.valid).toBe(false);
    expect(result.warning).toContain('sk-ant-');
  });

  it('warns on an empty API key for Anthropic', () => {
    const result = validateApiKey('anthropic', '');
    expect(result.valid).toBe(false);
    expect(result.warning).toContain('required');
  });

  it('accepts any non-empty key for openai-compatible', () => {
    const result = validateApiKey('openai-compatible', 'any-key-here');
    expect(result.valid).toBe(true);
  });

  it('allows empty key for openai-compatible (local models)', () => {
    const result = validateApiKey('openai-compatible', '');
    expect(result.valid).toBe(true);
    expect(result.warning).toBeNull();
  });
});
