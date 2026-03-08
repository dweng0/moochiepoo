import { renderHints, HintsState } from './popup-ui';
import { createGetHintButton } from './popup-button';

const hintsDiv = document.getElementById('hints') as HTMLElement;
const btnContainer = document.getElementById('btn-container') as HTMLElement;

// Add the Get Hint button
const btn = createGetHintButton(hintsDiv, renderHints);
btnContainer.appendChild(btn);

// Show current state on open
chrome.storage.local.get(['extractedCode', 'hints', 'hintsError'], (result) => {
  let state: HintsState;
  if (!result.extractedCode) {
    state = { status: 'no-code' };
  } else if (result.hintsError) {
    state = { status: 'error', message: result.hintsError };
  } else if (result.hints) {
    state = { status: 'ready', hints: result.hints };
  } else {
    state = { status: 'no-code' };
  }
  renderHints(hintsDiv, state);
});
