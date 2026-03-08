/**
 * Scenario: display hints in popup
 * Given the extension has extracted code from the page
 * When the user opens the extension popup
 * Then the popup should display LLM-generated hints and tips for the code challenge
 */

import { renderHints, HintsState } from '../src/popup-ui';

describe('Scenario: display hints in popup', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('shows a loading state while hints are being fetched', () => {
    const state: HintsState = { status: 'loading' };
    renderHints(container, state);
    expect(container.textContent).toContain('Loading');
  });

  it('displays hints when available', () => {
    const state: HintsState = {
      status: 'ready',
      hints: 'Consider using a hash map to solve this in O(n) time.'
    };
    renderHints(container, state);
    expect(container.textContent).toContain('Consider using a hash map');
  });

  it('shows an error message when hint fetching fails', () => {
    const state: HintsState = { status: 'error', message: 'API key missing' };
    renderHints(container, state);
    expect(container.textContent).toContain('API key missing');
  });

  it('shows a prompt when no code has been extracted yet', () => {
    const state: HintsState = { status: 'no-code' };
    renderHints(container, state);
    expect(container.textContent).toContain('No code detected');
  });

  it('renders hints as readable text without raw HTML', () => {
    const state: HintsState = {
      status: 'ready',
      hints: 'Use two pointers.\nStart from both ends.'
    };
    renderHints(container, state);
    const text = container.textContent ?? '';
    expect(text).toContain('Use two pointers');
    expect(text).toContain('Start from both ends');
  });
});
