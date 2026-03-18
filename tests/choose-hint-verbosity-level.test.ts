/**
 * Scenario: choose hint verbosity level
 * Given the user opens the extension settings
 * When they select a hint style (gentle nudge, detailed explanation, or pseudocode outline)
 * And they request a hint
 * Then the LLM system prompt should reflect the chosen style
 * And the response should match the selected verbosity level
 */

import { getSystemPromptForStyle, HintStyle } from '../src/hint-style';

describe('Scenario: choose hint verbosity level', () => {
  it('returns a gentle nudge prompt', () => {
    const prompt = getSystemPromptForStyle('gentle');
    expect(prompt).toContain('brief');
    expect(prompt.length).toBeGreaterThan(20);
  });

  it('returns a detailed explanation prompt', () => {
    const prompt = getSystemPromptForStyle('detailed');
    expect(prompt).toContain('detailed');
  });

  it('returns a pseudocode outline prompt', () => {
    const prompt = getSystemPromptForStyle('pseudocode');
    expect(prompt).toContain('pseudocode');
  });

  it('defaults to gentle when no style is provided', () => {
    const prompt = getSystemPromptForStyle(undefined as unknown as HintStyle);
    expect(prompt).toContain('brief');
  });

  it('each style produces a different prompt', () => {
    const gentle = getSystemPromptForStyle('gentle');
    const detailed = getSystemPromptForStyle('detailed');
    const pseudocode = getSystemPromptForStyle('pseudocode');
    expect(gentle).not.toBe(detailed);
    expect(detailed).not.toBe(pseudocode);
    expect(gentle).not.toBe(pseudocode);
  });
});
