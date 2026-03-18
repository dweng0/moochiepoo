# BDD Status

Checked 37 scenario(s) across 11 test file(s).


## Feature: code extraction

- [x] extract code from coding challenge page

## Feature: hints and tips

- [x] display hints in popup
- [x] user requests a hint via button

## Feature: LLM integration

- [x] send code context to LLM

## Feature: API key configuration

- [x] user can configure their API key
- [x] Configure an open ai key
- [x] Configure a local Ollama model

## Feature: supported sites

- [x] works on major coding challenge platforms

## Feature: intelligent code change detection

- [x] detect and respond to code changes via polling

## Feature: hint formatting

- [x] render markdown in hint responses

## Feature: hint history

- [x] view previous hints

## Feature: problem metadata extraction

- [ ] UNCOVERED: extract problem metadata from page

## Feature: language-aware prompting

- [ ] UNCOVERED: tailor LLM prompt to detected language

## Feature: settings validation

- [ ] UNCOVERED: test API connection from settings
- [ ] UNCOVERED: validate API key format

## Feature: streaming responses

- [ ] UNCOVERED: stream LLM response to popup

## Feature: keyboard shortcut

- [ ] UNCOVERED: request hint via keyboard shortcut

## Feature: configurable hint style

- [ ] UNCOVERED: choose hint verbosity level

## Feature: additional supported sites

- [ ] UNCOVERED: works on additional coding challenge platforms

## Feature: robust markdown rendering

- [ ] UNCOVERED: handle complex markdown without rendering artifacts

## Feature: unsupported site handling

- [ ] UNCOVERED: show friendly message on unsupported site

## Feature: first-time onboarding

- [ ] UNCOVERED: guide new user to configure API key

## Feature: keyboard shortcut result display

- [x] show hint result after keyboard shortcut

## Feature: hint history persistence

- [ ] UNCOVERED: persist hint history across popup open and close
- [ ] UNCOVERED: clear hint history on navigation

## Feature: code change impact on hints

- [ ] UNCOVERED: indicate stale hints after code changes

## Feature: large code handling

- [ ] UNCOVERED: handle code that exceeds LLM token limits

## Feature: multi-tab awareness

- [x] use code from the active tab

## Feature: offline detection

- [ ] UNCOVERED: show offline state when network is unavailable

## Feature: Mooch desktop integration

- [ ] UNCOVERED: detect running Mooch desktop app
- [ ] UNCOVERED: route hint requests through Mooch desktop
- [ ] UNCOVERED: fall back to standalone mode when Mooch is unavailable
- [ ] UNCOVERED: share provider configuration from Mooch desktop
- [ ] UNCOVERED: send extracted code to Mooch for analysis
- [ ] UNCOVERED: sync interview context from Mooch desktop

## Feature: error recovery

- [ ] UNCOVERED: retry failed hint request

## Feature: A readme that is friendly for users who just want to get started

- [x] A new user to the Mooch ecosystem

---
**14/37 scenarios covered.**

23 scenario(s) need tests:
- extract problem metadata from page
- tailor LLM prompt to detected language
- test API connection from settings
- validate API key format
- stream LLM response to popup
- request hint via keyboard shortcut
- choose hint verbosity level
- works on additional coding challenge platforms
- handle complex markdown without rendering artifacts
- show friendly message on unsupported site
- guide new user to configure API key
- persist hint history across popup open and close
- clear hint history on navigation
- indicate stale hints after code changes
- handle code that exceeds LLM token limits
- show offline state when network is unavailable
- detect running Mooch desktop app
- route hint requests through Mooch desktop
- fall back to standalone mode when Mooch is unavailable
- share provider configuration from Mooch desktop
- send extracted code to Mooch for analysis
- sync interview context from Mooch desktop
- retry failed hint request
