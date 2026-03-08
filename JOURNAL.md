# Journal

<!-- Agent writes entries here, newest at the top. Never delete entries. -->
<!-- Format: ## Day N — HH:MM — [short title] -->

## Day 8-9 — Interactive session — End-to-end testing and bugfixes

Worked interactively with the user to test the extension on a real LeetCode page (two-sum). Several issues discovered and fixed in sequence.

**Bugs found and fixed:**

- **Code never stored on page load.** The poller's first tick was "silent" — it set a local baseline but never wrote to `chrome.storage.local`. The popup reads storage for `extractedCode`, so it always found nothing. Fixed by sending `CODE_EXTRACTED` on first detection.
- **SPA rendering delay.** LeetCode's Monaco editor loads ~1s after the content script runs. Added a 1.5s initial delay before the first extraction attempt.
- **`document.title` in service worker.** `background.ts` used `pageTitle ?? document.title` — `document` doesn't exist in an MV3 service worker context. Would throw `ReferenceError` (caught, stored as `hintsError`). Fixed to use `'Coding Challenge'` as the fallback.
- **`onChanged` unreliable.** If the service worker restarted mid-request, the storage `onChanged` listener in the popup was gone. The popup hung on "Loading hints…" forever. Fixed by polling storage every 1s while loading, with a 30s timeout.
- **Stale hints not cleared.** If `hints` already had a value and the LLM returned the same text, `onChanged` wouldn't fire. Now `hints` and `hintsError` are cleared before each request.
- **Options page not dynamic.** Switching the provider dropdown didn't show/hide OpenAI-compatible fields (base URL, model). Fixed with a `change` listener on the select.
- **No guidance when API key missing.** Popup showed "No code detected" when `llmConfig` wasn't set. Now shows "No API key configured. Open Settings →" with a direct link.
- **Debug panel added.** Collapsible section shows hostname, extractedCode snippet, llmConfig provider, hintsError, and a "Force Extract Now" button using `chrome.scripting.executeScript` for live diagnosis.

**Outcome:** Full end-to-end flow confirmed working on LeetCode. 57 tests passing, 9/9 BDD scenarios covered.

## Day 1-7 — Bootstrap and BDD implementation

Built the full extension from scratch across 7 sessions, implementing all 8 original BDD scenarios:

- Day 1: Project bootstrap (TypeScript, Webpack, Jest). Implemented `extractCode()` for Monaco and CodeMirror editors.
- Day 2: Popup UI with loading/ready/error/no-code states via `renderHints()`.
- Day 3: LLM client supporting Anthropic and OpenAI-compatible APIs.
- Day 4: Options page with API key configuration for both providers.
- Day 5: Site profiles registry (LeetCode, HackerRank, Codewars, CoderPad). Content script guards on supported hostnames.
- Day 6: Polling-based code change detection (8s interval, first tick = baseline).
- Day 7: README covering quick start, API setup, supported platforms, and project structure.
- Day 8: Added "Get Hint" button as a new BDD scenario. 9/9 scenarios, 53 tests passing.

