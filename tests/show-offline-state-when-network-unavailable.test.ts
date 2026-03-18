/**
 * Scenario: show offline state when network is unavailable
 * Given the user has no network connection
 * When they click Get Hint
 * Then the popup should display a clear offline message
 * And automatically retry or re-enable the button when connectivity is restored
 */

import { isOffline } from '../src/network-status';

describe('Scenario: show offline state when network is unavailable', () => {
  const origNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, 'navigator', { value: origNavigator, writable: true });
  });

  it('detects offline state', () => {
    Object.defineProperty(global, 'navigator', {
      value: { onLine: false },
      writable: true,
    });
    expect(isOffline()).toBe(true);
  });

  it('detects online state', () => {
    Object.defineProperty(global, 'navigator', {
      value: { onLine: true },
      writable: true,
    });
    expect(isOffline()).toBe(false);
  });
});
