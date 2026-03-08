import { extractCode } from './extractor';

// Content script: runs on supported coding challenge pages
const code = extractCode(document);
if (code) {
  chrome.runtime.sendMessage({ type: 'CODE_EXTRACTED', code });
}
