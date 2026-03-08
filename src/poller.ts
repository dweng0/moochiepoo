import { extractCode } from './extractor';

const POLL_INTERVAL_MS = 8000;

let intervalId: ReturnType<typeof setInterval> | null = null;
let previousCode: string | null = null;

export function startPolling(doc: Document): void {
  stopPolling();
  previousCode = null;

  intervalId = setInterval(() => {
    const current = extractCode(doc);
    if (!current) return;

    if (previousCode === null) {
      // First poll: establish baseline, no notification
      previousCode = current;
      return;
    }

    if (current !== previousCode) {
      previousCode = current;
      chrome.runtime.sendMessage({ type: 'CODE_EXTRACTED', code: current, pageTitle: doc.title });
    }
  }, POLL_INTERVAL_MS);
}

export function stopPolling(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
