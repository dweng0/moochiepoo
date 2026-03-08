/**
 * Scenario: detect and respond to code changes via polling
 * Given the extension is active on a coding challenge page
 * When the content script starts polling every 8 seconds
 * Then it should compare the current code state with the previous one
 */

import { startPolling, stopPolling } from '../src/poller';
import { extractCode } from '../src/extractor';

jest.mock('../src/extractor');
const mockExtractCode = extractCode as jest.MockedFunction<typeof extractCode>;

const mockSendMessage = jest.fn();
(global as unknown as Record<string, unknown>).chrome = {
  runtime: { sendMessage: mockSendMessage }
};

// Timing constants must match poller.ts
const INITIAL_DELAY = 1500;
const POLL_INTERVAL = 8000;

describe('Scenario: detect and respond to code changes via polling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockExtractCode.mockReset();
    mockSendMessage.mockReset();
  });

  afterEach(() => {
    stopPolling();
    jest.useRealTimers();
  });

  it('sends CODE_EXTRACTED on first detection (stores code for popup)', () => {
    mockExtractCode.mockReturnValue('initial code');
    startPolling(document);

    jest.advanceTimersByTime(INITIAL_DELAY);

    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CODE_EXTRACTED', code: 'initial code' })
    );
  });

  it('polls again every 8 seconds after initial detection', () => {
    mockExtractCode.mockReturnValue('code v1');
    startPolling(document);

    jest.advanceTimersByTime(INITIAL_DELAY);
    expect(mockExtractCode).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(POLL_INTERVAL);
    expect(mockExtractCode).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(POLL_INTERVAL);
    expect(mockExtractCode).toHaveBeenCalledTimes(3);
  });

  it('does not send a duplicate message when code has not changed', () => {
    mockExtractCode.mockReturnValue('same code');
    startPolling(document);

    jest.advanceTimersByTime(INITIAL_DELAY);          // sends once (initial)
    jest.advanceTimersByTime(POLL_INTERVAL);          // unchanged — no extra message
    jest.advanceTimersByTime(POLL_INTERVAL);          // unchanged — no extra message

    expect(mockSendMessage).toHaveBeenCalledTimes(1);
  });

  it('sends CODE_EXTRACTED again when code changes', () => {
    mockExtractCode
      .mockReturnValueOnce('code v1')
      .mockReturnValueOnce('code v2');
    startPolling(document);

    jest.advanceTimersByTime(INITIAL_DELAY);          // sends v1
    jest.advanceTimersByTime(POLL_INTERVAL);          // sends v2

    expect(mockSendMessage).toHaveBeenCalledTimes(2);
    expect(mockSendMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: 'CODE_EXTRACTED', code: 'code v2' })
    );
  });

  it('sends a message each time the code changes', () => {
    mockExtractCode
      .mockReturnValueOnce('v1')
      .mockReturnValueOnce('v2')
      .mockReturnValueOnce('v3');
    startPolling(document);

    jest.advanceTimersByTime(INITIAL_DELAY);
    jest.advanceTimersByTime(POLL_INTERVAL);
    jest.advanceTimersByTime(POLL_INTERVAL);

    expect(mockSendMessage).toHaveBeenCalledTimes(3);
  });

  it('stops polling after stopPolling() is called', () => {
    mockExtractCode.mockReturnValue('code');
    startPolling(document);

    jest.advanceTimersByTime(INITIAL_DELAY);
    stopPolling();
    jest.advanceTimersByTime(POLL_INTERVAL * 3);

    expect(mockExtractCode).toHaveBeenCalledTimes(1);
  });

  it('does not notify when extracted code is empty', () => {
    mockExtractCode.mockReturnValue('');
    startPolling(document);

    jest.advanceTimersByTime(INITIAL_DELAY);
    jest.advanceTimersByTime(POLL_INTERVAL);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
