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

  it('polls every 8 seconds', () => {
    mockExtractCode.mockReturnValue('code v1');
    startPolling(document);

    jest.advanceTimersByTime(8000);
    expect(mockExtractCode).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(8000);
    expect(mockExtractCode).toHaveBeenCalledTimes(2);
  });

  it('does not send a message when code has not changed', () => {
    mockExtractCode.mockReturnValue('same code');
    startPolling(document);

    jest.advanceTimersByTime(8000);
    jest.advanceTimersByTime(8000);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('sends CODE_EXTRACTED when code changes', () => {
    mockExtractCode
      .mockReturnValueOnce('code v1')
      .mockReturnValueOnce('code v2');
    startPolling(document);

    jest.advanceTimersByTime(8000); // first poll: sets baseline
    jest.advanceTimersByTime(8000); // second poll: detects change

    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CODE_EXTRACTED', code: 'code v2' })
    );
  });

  it('sends a message each time the code changes', () => {
    mockExtractCode
      .mockReturnValueOnce('v1')
      .mockReturnValueOnce('v2')
      .mockReturnValueOnce('v3');
    startPolling(document);

    jest.advanceTimersByTime(8000);
    jest.advanceTimersByTime(8000);
    jest.advanceTimersByTime(8000);

    expect(mockSendMessage).toHaveBeenCalledTimes(2);
  });

  it('stops polling after stopPolling() is called', () => {
    mockExtractCode.mockReturnValue('code');
    startPolling(document);

    jest.advanceTimersByTime(8000);
    stopPolling();
    jest.advanceTimersByTime(16000);

    expect(mockExtractCode).toHaveBeenCalledTimes(1);
  });

  it('does not notify when extracted code is empty', () => {
    mockExtractCode
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    startPolling(document);

    jest.advanceTimersByTime(8000);
    jest.advanceTimersByTime(8000);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
