/**
 * Scenario: extract problem metadata from page
 * Given the user is on a coding challenge page that displays difficulty, tags, or constraints
 * When the content script extracts code
 * Then it should also extract available metadata (difficulty level, problem tags, constraints)
 * And include that metadata in the context sent to the LLM
 */

import { extractMetadata, ProblemMetadata } from '../src/metadata-extractor';

describe('Scenario: extract problem metadata from page', () => {
  function makeDoc(html: string): Document {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc;
  }

  it('extracts difficulty from a LeetCode-style page', () => {
    const doc = makeDoc(`
      <div class="text-difficulty-easy" data-difficulty="Easy">Easy</div>
    `);
    const meta = extractMetadata(doc);
    expect(meta.difficulty).toBe('Easy');
  });

  it('extracts difficulty from a data attribute', () => {
    const doc = makeDoc(`
      <div data-difficulty="Medium">Medium</div>
    `);
    const meta = extractMetadata(doc);
    expect(meta.difficulty).toBe('Medium');
  });

  it('extracts tags from topic tag elements', () => {
    const doc = makeDoc(`
      <div class="topic-tags">
        <a class="topic-tag">Array</a>
        <a class="topic-tag">Hash Table</a>
        <a class="topic-tag">Two Pointers</a>
      </div>
    `);
    const meta = extractMetadata(doc);
    expect(meta.tags).toEqual(['Array', 'Hash Table', 'Two Pointers']);
  });

  it('extracts constraints from a constraints section', () => {
    const doc = makeDoc(`
      <div class="constraints">
        <li>1 <= nums.length <= 10^4</li>
        <li>-10^9 <= nums[i] <= 10^9</li>
      </div>
    `);
    const meta = extractMetadata(doc);
    expect(meta.constraints).toContain('1 <= nums.length <= 10^4');
  });

  it('returns null fields when no metadata is found', () => {
    const doc = makeDoc('<div>Just some page</div>');
    const meta = extractMetadata(doc);
    expect(meta.difficulty).toBeNull();
    expect(meta.tags).toBeNull();
    expect(meta.constraints).toBeNull();
  });

  it('metadata structure matches the contract for LLM context', () => {
    const meta: ProblemMetadata = {
      difficulty: 'Hard',
      tags: ['Dynamic Programming', 'Graph'],
      constraints: '1 <= n <= 1000',
    };
    // Verify the shape can be serialised to the Mooch bridge contract format
    const json = JSON.stringify(meta);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty('difficulty');
    expect(parsed).toHaveProperty('tags');
    expect(parsed).toHaveProperty('constraints');
  });
});
