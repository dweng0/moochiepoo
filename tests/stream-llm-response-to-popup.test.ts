/**
 * Scenario: stream LLM response to popup
 * Given the user has clicked Get Hint and the LLM is generating a response
 * When tokens arrive from the LLM
 * Then the popup should display the response incrementally as it streams in
 * And show a subtle indicator that the response is still generating
 */

import { parseSSEChunk, StreamState } from '../src/stream-parser';
import { renderHints } from '../src/popup-ui';

describe('Scenario: stream LLM response to popup', () => {
  describe('SSE parsing', () => {
    it('extracts text content from an Anthropic content_block_delta event', () => {
      const chunk = 'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}';
      expect(parseSSEChunk(chunk, 'anthropic')).toBe('Hello');
    });

    it('extracts text from an OpenAI-compatible chunk', () => {
      const chunk = 'data: {"choices":[{"delta":{"content":"world"}}]}';
      expect(parseSSEChunk(chunk, 'openai-compatible')).toBe('world');
    });

    it('returns null for non-data lines', () => {
      expect(parseSSEChunk('event: ping', 'anthropic')).toBeNull();
    });

    it('returns null for [DONE] signal', () => {
      expect(parseSSEChunk('data: [DONE]', 'openai-compatible')).toBeNull();
    });

    it('returns null for events without text content', () => {
      const chunk = 'data: {"type":"message_start","message":{}}';
      expect(parseSSEChunk(chunk, 'anthropic')).toBeNull();
    });
  });

  describe('streaming UI state', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
    });

    it('shows a streaming indicator during generation', () => {
      const state = { status: 'streaming' as const, partialHint: 'Consider using...' };
      renderHints(container, state);
      expect(container.textContent).toContain('Consider using...');
      expect(container.querySelector('.streaming-indicator')).not.toBeNull();
    });

    it('removes streaming indicator when complete', () => {
      renderHints(container, { status: 'ready', hints: 'Final answer' });
      expect(container.querySelector('.streaming-indicator')).toBeNull();
    });
  });
});
