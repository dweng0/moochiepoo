/**
 * Scenario: works on additional coding challenge platforms
 * Given the user navigates to CodeSignal, Exercism, or AlgoExpert
 * When the extension content script runs
 * Then it should successfully identify and extract the code editor content
 */

import { getSiteProfile, isSupported } from '../src/site-profiles';

describe('Scenario: works on additional coding challenge platforms', () => {
  it('recognises CodeSignal', () => {
    expect(isSupported('app.codesignal.com')).toBe(true);
    expect(getSiteProfile('app.codesignal.com')?.name).toBe('CodeSignal');
  });

  it('recognises Exercism', () => {
    expect(isSupported('exercism.org')).toBe(true);
    expect(getSiteProfile('exercism.org')?.name).toBe('Exercism');
  });

  it('recognises AlgoExpert', () => {
    expect(isSupported('www.algoexpert.io')).toBe(true);
    expect(getSiteProfile('www.algoexpert.io')?.name).toBe('AlgoExpert');
  });
});
