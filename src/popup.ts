import { renderHints, HintsState } from './popup-ui';

const hintsDiv = document.getElementById('hints') as HTMLElement;

renderHints(hintsDiv, { status: 'loading' });

chrome.storage.local.get(['extractedCode', 'hints', 'hintsError'], (result) => {
  let state: HintsState;

  if (!result.extractedCode) {
    state = { status: 'no-code' };
  } else if (result.hintsError) {
    state = { status: 'error', message: result.hintsError };
  } else if (result.hints) {
    state = { status: 'ready', hints: result.hints };
  } else {
    state = { status: 'loading' };
  }

  renderHints(hintsDiv, state);
});
