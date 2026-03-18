/**
 * Scenario: handle code that exceeds LLM token limits
 * Given the extracted code is very large and may exceed the LLM context window
 * When the user requests a hint
 * Then the extension should truncate or summarise the code to fit within token limits
 * And inform the user that the code was trimmed with a brief notice
 */

import { truncateCode, TruncationResult } from '../src/code-truncator';

describe('Scenario: handle code that exceeds LLM token limits', () => {
  it('returns code unchanged when under the limit', () => {
    const result = truncateCode('short code', 10000);
    expect(result.code).toBe('short code');
    expect(result.wasTruncated).toBe(false);
  });

  it('truncates code that exceeds the character limit', () => {
    const longCode = 'x'.repeat(50000);
    const result = truncateCode(longCode, 10000);
    expect(result.code.length).toBeLessThanOrEqual(10000 + 100); // allow small overhead for notice
    expect(result.wasTruncated).toBe(true);
  });

  it('appends a truncation notice when code is trimmed', () => {
    const longCode = 'x'.repeat(50000);
    const result = truncateCode(longCode, 10000);
    expect(result.code).toContain('truncated');
  });

  it('preserves the beginning of the code (most relevant part)', () => {
    const code = 'function solve() {\n' + 'x'.repeat(50000);
    const result = truncateCode(code, 10000);
    expect(result.code).toContain('function solve()');
  });
});
