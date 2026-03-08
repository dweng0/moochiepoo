import { renderHints, HintsState } from './popup-ui';

type RenderFn = (container: HTMLElement, state: HintsState) => void;

const POLL_INTERVAL_MS = 1000;
const TIMEOUT_MS = 30000;

export function createGetHintButton(hintsDiv: HTMLElement, render: RenderFn): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = 'Get Hint';
  btn.id = 'get-hint-btn';

  // Keep a reference so we can cancel polling
  let pollInterval: ReturnType<typeof setInterval> | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  // Listen for storage changes so hints appear automatically when background responds
  chrome.storage.local.onChanged.addListener((changes) => {
    if ('hints' in changes && changes.hints.newValue) {
      stopPolling();
      render(hintsDiv, { status: 'ready', hints: changes.hints.newValue as string });
      btn.removeAttribute('disabled');
    }
    if ('hintsError' in changes && changes.hintsError.newValue) {
      stopPolling();
      render(hintsDiv, { status: 'error', message: changes.hintsError.newValue as string });
      btn.removeAttribute('disabled');
    }
  });

  function stopPolling(): void {
    if (pollInterval !== null) { clearInterval(pollInterval); pollInterval = null; }
    if (timeoutId !== null) { clearTimeout(timeoutId); timeoutId = null; }
  }

  function startPolling(): void {
    stopPolling();
    pollInterval = setInterval(() => {
      chrome.storage.local.get(['hints', 'hintsError'], (result) => {
        if (result.hints) {
          stopPolling();
          render(hintsDiv, { status: 'ready', hints: result.hints as string });
          btn.removeAttribute('disabled');
        } else if (result.hintsError) {
          stopPolling();
          render(hintsDiv, { status: 'error', message: result.hintsError as string });
          btn.removeAttribute('disabled');
        }
      });
    }, POLL_INTERVAL_MS);

    timeoutId = setTimeout(() => {
      stopPolling();
      render(hintsDiv, { status: 'error', message: 'Request timed out after 30s. Check your API key and network.' });
      btn.removeAttribute('disabled');
    }, TIMEOUT_MS);
  }

  btn.addEventListener('click', () => {
    chrome.storage.local.get(['extractedCode'], (result) => {
      if (!result.extractedCode) {
        render(hintsDiv, { status: 'no-code' });
        return;
      }
      // Clear stale hints so onChanged fires reliably
      chrome.storage.local.remove(['hints', 'hintsError'], () => {
        render(hintsDiv, { status: 'loading' });
        btn.setAttribute('disabled', 'true');
        chrome.runtime.sendMessage({ type: 'REQUEST_HINT' });
        startPolling();
      });
    });
  });

  return btn;
}
