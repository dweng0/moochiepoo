import { requestHint, LLMConfig } from './llm-client';

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'CODE_EXTRACTED') {
    chrome.storage.local.set({ extractedCode: message.code, pageTitle: message.pageTitle });
  }
  if (message.type === 'REQUEST_HINT') {
    handleHintRequest();
  }
});

async function handleHintRequest(): Promise<void> {
  const { extractedCode, pageTitle, llmConfig } = await chrome.storage.local.get([
    'extractedCode', 'pageTitle', 'llmConfig'
  ]);

  if (!extractedCode) {
    chrome.storage.local.set({ hintsError: 'No code extracted from page' });
    return;
  }
  if (!llmConfig) {
    chrome.storage.local.set({ hintsError: 'API key not configured. Open extension settings.' });
    return;
  }

  try {
    const hints = await requestHint({
      code: extractedCode,
      pageTitle: pageTitle ?? 'Coding Challenge',
      config: llmConfig as LLMConfig
    });
    chrome.storage.local.set({ hints, hintsError: null });
  } catch (err) {
    chrome.storage.local.set({ hintsError: String(err) });
  }
}
