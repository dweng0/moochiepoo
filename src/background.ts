// Background service worker
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'CODE_EXTRACTED') {
    chrome.storage.local.set({ extractedCode: message.code });
  }
});
