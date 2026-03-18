import { renderHints, HintsState } from './popup-ui';
import { createGetHintButton } from './popup-button';

const hintsDiv = document.getElementById('hints') as HTMLElement;
const btnContainer = document.getElementById('btn-container') as HTMLElement;
const debugDiv = document.getElementById('debug') as HTMLElement;
const debugToggle = document.getElementById('debug-toggle') as HTMLElement;

// Add the Get Hint button
const btn = createGetHintButton(hintsDiv, renderHints);
btnContainer.appendChild(btn);

// Show current state on open
chrome.storage.local.get(['extractedCode', 'hints', 'hintsError', 'llmConfig'], (result) => {
  if (!result.llmConfig) {
    hintsDiv.innerHTML = `<p class="setup-msg">No API key configured. <a id="open-options" href="#">Open Settings →</a></p>`;
    document.getElementById('open-options')?.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
    btn.setAttribute('disabled', 'true');
    return;
  }

  let state: HintsState;
  if (!result.extractedCode) {
    state = { status: 'no-code' };
  } else if (result.hintsError) {
    state = { status: 'error', message: result.hintsError };
  } else if (result.hints) {
    state = { status: 'ready', hints: result.hints };
  } else {
    // Code is extracted but no hints requested yet — show prompt
    state = { status: 'ready', hints: 'Code detected! Click **Get Hint** for guidance.' };
  }
  renderHints(hintsDiv, state);
});

// Debug panel
debugToggle.addEventListener('click', () => {
  if (debugDiv.style.display === 'none') {
    debugDiv.style.display = 'block';
    refreshDebug();
  } else {
    debugDiv.style.display = 'none';
  }
});

function refreshDebug(): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const hostname = tab?.url ? new URL(tab.url).hostname : 'unknown';

    chrome.storage.local.get(['extractedCode', 'pageTitle', 'llmConfig', 'hintsError'], (result) => {
      const code = result.extractedCode as string | undefined;
      const config = result.llmConfig as { provider?: string } | undefined;

      debugDiv.innerHTML = `
        <div class="debug-row"><b>Tab hostname:</b> ${hostname}</div>
        <div class="debug-row"><b>extractedCode:</b> ${code ? `✓ ${code.slice(0, 60).replace(/\s+/g, ' ')}…` : '✗ none'}</div>
        <div class="debug-row"><b>pageTitle:</b> ${result.pageTitle ?? 'none'}</div>
        <div class="debug-row"><b>llmConfig:</b> ${config ? `✓ provider=${config.provider}` : '✗ not set'}</div>
        <div class="debug-row"><b>hintsError:</b> ${result.hintsError ?? 'none'}</div>
        <button id="force-extract">Force Extract Now</button>
      `;

      document.getElementById('force-extract')?.addEventListener('click', () => {
        if (!tab?.id) return;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // Run extraction directly and report what selectors find
            const monacoLines = document.querySelector('.view-lines');
            const codeMirror = document.querySelector('.CodeMirror-code');
            const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
            return {
              hostname: location.hostname,
              monacoFound: !!monacoLines,
              monacoText: monacoLines?.textContent?.slice(0, 100) ?? null,
              codeMirrorFound: !!codeMirror,
              textareaFound: !!textarea,
              textareaValue: textarea?.value?.slice(0, 100) ?? null,
            };
          }
        }, (results) => {
          const r = results?.[0]?.result;
          if (r) {
            const pre = document.createElement('pre');
            pre.className = 'debug-result';
            pre.textContent = JSON.stringify(r, null, 2);
            debugDiv.appendChild(pre);

            // If monaco found, store it
            if (r.monacoText) {
              chrome.storage.local.set({ extractedCode: r.monacoText, pageTitle: tab.title }, () => {
                renderHints(hintsDiv, { status: 'no-code' }); // reset so button works
                refreshDebug();
              });
            }
          }
        });
      });
    });
  });
}
