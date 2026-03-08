import { extractCode } from './extractor';

const POLL_INTERVAL_MS = 8000;
const INITIAL_DELAY_MS = 1500; // give SPAs time to render the editor

let intervalId: ReturnType<typeof setInterval> | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let previousCode: string | null = null;

export function startPolling(doc: Document): void {
  stopPolling();
  previousCode = null;

  // Try immediately after a short delay (editor may not be in DOM yet)
  timeoutId = setTimeout(() => {
    tick(doc);
    // Then poll on the regular interval
    intervalId = setInterval(() => tick(doc), POLL_INTERVAL_MS);
  }, INITIAL_DELAY_MS);
}

function tick(doc: Document): void {
  const current = extractCode(doc);
  if (!current) return;

  if (current !== previousCode) {
    previousCode = current;
    chrome.runtime.sendMessage({ type: 'CODE_EXTRACTED', code: current, pageTitle: doc.title });
  }
}

export function stopPolling(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}
