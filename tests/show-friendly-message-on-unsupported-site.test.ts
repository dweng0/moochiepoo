/**
 * Scenario: show friendly message on unsupported site
 * Given the user is on a website that is not a supported coding challenge platform
 * When they open the extension popup
 * Then the popup should display a message explaining the current site is not supported
 * And list the supported platforms
 */

import { renderUnsupportedSite } from '../src/popup-ui';
import { getSupportedSiteNames } from '../src/site-profiles';

describe('Scenario: show friendly message on unsupported site', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders a message explaining the site is not supported', () => {
    renderUnsupportedSite(container);
    expect(container.textContent).toContain('not supported');
  });

  it('lists the supported platforms', () => {
    renderUnsupportedSite(container);
    const text = container.textContent ?? '';
    expect(text).toContain('LeetCode');
    expect(text).toContain('HackerRank');
  });

  it('getSupportedSiteNames returns all site names', () => {
    const names = getSupportedSiteNames();
    expect(names).toContain('LeetCode');
    expect(names).toContain('CodeSignal');
    expect(names.length).toBeGreaterThanOrEqual(7);
  });
});
