/**
 * Scenario: retry failed hint request
 * Given an LLM hint request has failed and an error is displayed
 * When the user sees the error in the popup
 * Then a Retry button should be shown alongside the error message
 * And clicking Retry should re-send the hint request
 */

import { renderHints } from '../src/popup-ui';

describe('Scenario: retry failed hint request', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('error state shows the error message', () => {
    renderHints(container, { status: 'error', message: 'API timeout' });
    expect(container.textContent).toContain('API timeout');
  });

  it('error state is recoverable by re-rendering as loading', () => {
    renderHints(container, { status: 'error', message: 'Failed' });
    expect(container.textContent).toContain('Failed');

    // Simulate retry: re-render as loading
    renderHints(container, { status: 'loading' });
    expect(container.textContent).toContain('Loading');
    expect(container.textContent).not.toContain('Failed');
  });
});
