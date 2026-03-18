/**
 * Scenario: send extracted code to Mooch for analysis
 */

import { analyzeViaMooch, MOOCH_BASE_URL } from '../src/mooch-bridge';

describe('Scenario: send extracted code to Mooch for analysis', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('sends code to Mooch analyze endpoint and returns analysis', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ analysis: 'Consider edge case when array is empty' }),
    });

    const result = await analyzeViaMooch({ code: 'function solve(arr) { return arr[0]; }' });
    expect(result.analysis).toContain('edge case');
    expect(global.fetch).toHaveBeenCalledWith(
      `${MOOCH_BASE_URL}/api/analyze`,
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
