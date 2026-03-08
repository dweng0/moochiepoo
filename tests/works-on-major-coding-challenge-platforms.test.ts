/**
 * Scenario: works on major coding challenge platforms
 * Given the user navigates to LeetCode, HackerRank, Codewars, or CoderPad
 * When the extension content script runs
 * Then it should successfully identify and extract the code editor content
 */

import { extractCode } from '../src/extractor';
import { getSiteProfile, SiteProfile } from '../src/site-profiles';

describe('Scenario: works on major coding challenge platforms', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('LeetCode', () => {
    it('identifies LeetCode by hostname', () => {
      const profile = getSiteProfile('leetcode.com');
      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('LeetCode');
    });

    it('extracts code from LeetCode Monaco editor', () => {
      document.body.innerHTML = `
        <div class="view-lines" role="presentation">
          <div class="view-line"><span><span>var</span><span> twoSum = function(nums, target) {</span></span></div>
          <div class="view-line"><span><span>    return</span><span> [];</span></span></div>
          <div class="view-line"><span><span>};</span></span></div>
        </div>
      `;
      const code = extractCode(document);
      expect(code).toContain('twoSum');
      expect(code).toContain('return');
      expect(code.trim().length).toBeGreaterThan(0);
    });
  });

  describe('HackerRank', () => {
    it('identifies HackerRank by hostname', () => {
      const profile = getSiteProfile('www.hackerrank.com');
      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('HackerRank');
    });

    it('extracts code from HackerRank CodeMirror editor', () => {
      document.body.innerHTML = `
        <div class="CodeMirror-code">
          <pre class="CodeMirror-line"><span>def solve(n):</span></pre>
          <pre class="CodeMirror-line"><span>    print(n)</span></pre>
        </div>
      `;
      const code = extractCode(document);
      expect(code).toContain('def solve');
      expect(code).toContain('print(n)');
    });
  });

  describe('Codewars', () => {
    it('identifies Codewars by hostname', () => {
      const profile = getSiteProfile('www.codewars.com');
      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('Codewars');
    });

    it('extracts code from Codewars CodeMirror editor', () => {
      document.body.innerHTML = `
        <div class="CodeMirror-code">
          <pre class="CodeMirror-line"><span>function solution(number) {</span></pre>
          <pre class="CodeMirror-line"><span>  return number > 0 ? 'positive' : 'negative';</span></pre>
          <pre class="CodeMirror-line"><span>}</span></pre>
        </div>
      `;
      const code = extractCode(document);
      expect(code).toContain('function solution');
      expect(code).toContain("'positive'");
    });
  });

  describe('CoderPad', () => {
    it('identifies CoderPad by hostname', () => {
      const profile = getSiteProfile('app.coderpad.io');
      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('CoderPad');
    });

    it('extracts code from CoderPad CodeMirror editor', () => {
      document.body.innerHTML = `
        <div class="CodeMirror-code">
          <pre class="CodeMirror-line"><span>class Solution:</span></pre>
          <pre class="CodeMirror-line"><span>    def maxProfit(self, prices):</span></pre>
          <pre class="CodeMirror-line"><span>        pass</span></pre>
        </div>
      `;
      const code = extractCode(document);
      expect(code).toContain('class Solution');
      expect(code).toContain('maxProfit');
    });
  });

  describe('unsupported sites', () => {
    it('returns null profile for an unsupported hostname', () => {
      const profile = getSiteProfile('google.com');
      expect(profile).toBeNull();
    });
  });
});
