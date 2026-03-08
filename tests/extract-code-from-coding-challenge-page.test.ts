/**
 * Scenario: extract code from coding challenge page
 * Given a user is on a coding challenge website (e.g. LeetCode, HackerRank, Codewars)
 * When the page loads
 * Then the extension should extract all code from the page as plain text
 */

import { extractCode } from '../src/extractor';

describe('Scenario: extract code from coding challenge page', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('extracts code from a LeetCode-style monaco editor', () => {
    document.body.innerHTML = `
      <div class="view-lines">
        <div class="view-line"><span>function twoSum(nums, target) {</span></div>
        <div class="view-line"><span>  return [];</span></div>
        <div class="view-line"><span>}</span></div>
      </div>
    `;
    const result = extractCode(document);
    expect(result).toContain('function twoSum');
    expect(result).toContain('return []');
    expect(result).toContain('}');
  });

  it('extracts code from a CodeMirror editor (HackerRank/Codewars)', () => {
    document.body.innerHTML = `
      <div class="CodeMirror-code">
        <pre class="CodeMirror-line"><span>def solve(n):</span></pre>
        <pre class="CodeMirror-line"><span>    return n * 2</span></pre>
      </div>
    `;
    const result = extractCode(document);
    expect(result).toContain('def solve(n):');
    expect(result).toContain('return n * 2');
  });

  it('extracts code from a textarea fallback', () => {
    document.body.innerHTML = `
      <textarea class="ace_text-input">console.log("hello");</textarea>
    `;
    const result = extractCode(document);
    expect(result).toContain('console.log("hello");');
  });

  it('returns empty string when no code editor is found', () => {
    document.body.innerHTML = '<p>No editor here</p>';
    const result = extractCode(document);
    expect(result).toBe('');
  });

  it('returns plain text without HTML tags', () => {
    document.body.innerHTML = `
      <div class="view-lines">
        <div class="view-line"><span class="mtk1">const <span class="mtk9">x</span> = 1;</span></div>
      </div>
    `;
    const result = extractCode(document);
    expect(result).not.toContain('<span');
    expect(result).not.toContain('mtk');
  });
});
