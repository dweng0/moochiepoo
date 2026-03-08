import { renderHints, HintsState } from './popup-ui';

type RenderFn = (container: HTMLElement, state: HintsState) => void;

export function createGetHintButton(hintsDiv: HTMLElement, render: RenderFn): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = 'Get Hint';
  btn.id = 'get-hint-btn';

  // Listen for storage changes so hints appear automatically when background responds
  chrome.storage.local.onChanged.addListener((changes) => {
    if ('hints' in changes) {
      const hints = changes.hints.newValue as string;
      render(hintsDiv, { status: 'ready', hints });
      btn.removeAttribute('disabled');
    }
    if ('hintsError' in changes && changes.hintsError.newValue) {
      render(hintsDiv, { status: 'error', message: changes.hintsError.newValue as string });
      btn.removeAttribute('disabled');
    }
  });

  btn.addEventListener('click', () => {
    chrome.storage.local.get(['extractedCode'], (result) => {
      if (!result.extractedCode) {
        render(hintsDiv, { status: 'no-code' });
        return;
      }
      render(hintsDiv, { status: 'loading' });
      btn.setAttribute('disabled', 'true');
      chrome.runtime.sendMessage({ type: 'REQUEST_HINT' });
    });
  });

  return btn;
}
