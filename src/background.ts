import { requestHint, LLMConfig } from './llm-client';
import { checkMoochHealth, requestHintViaMooch } from './mooch-bridge';

// Ping the Mooch bridge periodically so the popup can show live status
const HEALTH_INTERVAL = 5000;

async function pingBridge(): Promise<void> {
  const result = await checkMoochHealth();
  chrome.storage.local.set({ moochBridgeConnected: !!result });
}

pingBridge();
setInterval(pingBridge, HEALTH_INTERVAL);

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'CODE_EXTRACTED') {
    chrome.storage.local.set({ extractedCode: message.code, pageTitle: message.pageTitle });
  }
  if (message.type === 'REQUEST_HINT') {
    handleHintRequest();
  }
});

async function handleHintRequest(): Promise<void> {
  const { extractedCode, pageTitle, llmConfig, userContext } = await chrome.storage.local.get([
    'extractedCode', 'pageTitle', 'llmConfig', 'userContext'
  ]);

  if (!extractedCode) {
    chrome.storage.local.set({ hintsError: 'No code extracted from page' });
    return;
  }

  if (!llmConfig) {
    chrome.storage.local.set({ hintsError: 'Not configured yet. Open extension settings.' });
    return;
  }

  const config = llmConfig as LLMConfig & { provider: string };

  // User chose Mooch mode
  if (config.provider === 'mooch') {
    try {
      const result = await requestHintViaMooch({
        code: extractedCode,
        pageTitle: pageTitle ?? 'Coding Challenge',
      });
      chrome.storage.local.set({ hints: result.hint, hintsError: null });
    } catch (err) {
      chrome.storage.local.set({ hintsError: `Mooch bridge error: ${String(err)}` });
    }
    return;
  }

  // Direct LLM mode
  try {
    const hints = await requestHint({
      code: extractedCode,
      pageTitle: pageTitle ?? 'Coding Challenge',
      config: config as LLMConfig,
      userContext: userContext as string | undefined,
    });
    chrome.storage.local.set({ hints, hintsError: null });
  } catch (err) {
    chrome.storage.local.set({ hintsError: String(err) });
  }
}
