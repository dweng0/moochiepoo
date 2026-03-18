/**
 * Scenario: guide new user to configure API key
 * Given the user has just installed the extension and has not configured an LLM provider
 * When they open the extension popup for the first time
 * Then the popup should display a welcome message with a clear link or button to open settings
 * And it should not show the Get Hint button until a provider is configured
 */

import { renderOnboarding } from '../src/popup-ui';

describe('Scenario: guide new user to configure API key', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('shows a welcome message', () => {
    renderOnboarding(container);
    expect(container.textContent).toContain('Welcome');
  });

  it('includes a link or button to open settings', () => {
    renderOnboarding(container);
    const link = container.querySelector('a, button');
    expect(link).not.toBeNull();
    expect(link!.textContent).toContain('Settings');
  });

  it('does not show a Get Hint button', () => {
    renderOnboarding(container);
    expect(container.textContent).not.toContain('Get Hint');
  });
});
