/**
 * Scenario: tailor LLM prompt to detected language
 * Given the code editor indicates a specific programming language (e.g. Python, JavaScript, Java)
 * When the user requests a hint
 * Then the system prompt sent to the LLM should reference the detected language
 * And the hint should include language-specific guidance
 */

import { detectLanguage } from '../src/language-detector';
import { buildPrompt } from '../src/llm-client';

describe('Scenario: tailor LLM prompt to detected language', () => {
  describe('language detection', () => {
    function makeDoc(html: string): Document {
      return new DOMParser().parseFromString(html, 'text/html');
    }

    it('detects language from LeetCode language selector', () => {
      const doc = makeDoc(`
        <div id="editor">
          <button class="ant-select-selection-item" title="Python3">Python3</button>
        </div>
      `);
      expect(detectLanguage(doc)).toBe('Python3');
    });

    it('detects language from CodeMirror mode class', () => {
      const doc = makeDoc(`
        <div class="CodeMirror cm-s-default">
          <pre class="CodeMirror-line" data-lang="javascript"></pre>
        </div>
      `);
      expect(detectLanguage(doc)).toBe('javascript');
    });

    it('detects language from a select dropdown with language options', () => {
      const doc = makeDoc(`
        <select class="language-selector">
          <option value="java" selected>Java</option>
          <option value="python">Python</option>
        </select>
      `);
      expect(detectLanguage(doc)).toBe('Java');
    });

    it('returns null when no language can be detected', () => {
      const doc = makeDoc('<div>no editor</div>');
      expect(detectLanguage(doc)).toBeNull();
    });
  });

  describe('prompt includes language', () => {
    it('includes detected language in the prompt', () => {
      const prompt = buildPrompt('print("hello")', 'Two Sum', 'Python3');
      expect(prompt).toContain('Python3');
    });

    it('works without a language (null)', () => {
      const prompt = buildPrompt('console.log("hi")', 'Two Sum', null);
      expect(prompt).not.toContain('Language:');
    });
  });
});
