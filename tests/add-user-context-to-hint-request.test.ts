/**
 * Scenario: add user context to hint request
 * Given the user opens the extension popup
 * When a small collapsible context input panel is visible below the hint button
 * And the user types additional context (e.g. "I am not allowed to use extra space") into the text area
 * Then clicking Get Hint or Regenerate should include that context text in the LLM request payload alongside the extracted code
 * And the LLM prompt should incorporate the user-provided context so the hint is tailored accordingly
 */

import { buildPrompt } from '../src/llm-client';
import { renderContextInput } from '../src/popup-ui';

describe('Scenario: add user context to hint request', () => {
  describe('buildPrompt includes user context', () => {
    it('omits user context section when not provided', () => {
      const prompt = buildPrompt('function foo() {}', 'Two Sum');
      expect(prompt).not.toContain('Additional context');
    });

    it('includes user context in prompt when provided', () => {
      const prompt = buildPrompt('function foo() {}', 'Two Sum', null, 'I am not allowed to use extra space');
      expect(prompt).toContain('Additional context');
      expect(prompt).toContain('I am not allowed to use extra space');
    });

    it('places user context after the code block', () => {
      const prompt = buildPrompt('let x = 1;', 'Two Sum', null, 'must be O(n)');
      const contextIdx = prompt.indexOf('must be O(n)');
      const codeIdx = prompt.indexOf('let x = 1;');
      expect(contextIdx).toBeGreaterThan(codeIdx);
    });
  });

  describe('renderContextInput renders a collapsible textarea', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('renders a context input container', () => {
      renderContextInput(container, jest.fn());
      expect(container.querySelector('.context-input-panel')).not.toBeNull();
    });

    it('renders a textarea inside the panel', () => {
      renderContextInput(container, jest.fn());
      expect(container.querySelector('textarea')).not.toBeNull();
    });

    it('calls onChange when user types in the textarea', () => {
      const onChange = jest.fn();
      renderContextInput(container, onChange);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'must be O(n)';
      textarea.dispatchEvent(new Event('input'));
      expect(onChange).toHaveBeenCalledWith('must be O(n)');
    });

    it('has a toggle to expand/collapse the panel', () => {
      renderContextInput(container, jest.fn());
      const toggle = container.querySelector('.context-toggle');
      expect(toggle).not.toBeNull();
    });
  });
});
