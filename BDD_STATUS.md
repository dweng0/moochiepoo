# BDD Status

Checked 41 scenario(s) across 37 test file(s).


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

- [x] extract problem metadata from page

## Feature: language-aware prompting

- [x] tailor LLM prompt to detected language

## Feature: settings validation

- [x] test API connection from settings
- [x] validate API key format

## Feature: streaming responses

- [x] stream LLM response to popup

## Feature: keyboard shortcut

- [x] request hint via keyboard shortcut

## Feature: configurable hint style

- [x] choose hint verbosity level

## Feature: additional supported sites

- [x] works on additional coding challenge platforms

## Feature: robust markdown rendering

- [x] handle complex markdown without rendering artifacts

## Feature: unsupported site handling

- [x] show friendly message on unsupported site

## Feature: first-time onboarding

- [x] guide new user to configure API key

## Feature: keyboard shortcut result display

- [x] show hint result after keyboard shortcut

## Feature: hint history persistence

- [x] persist hint history across popup open and close
- [x] clear hint history on navigation

## Feature: code change impact on hints

- [x] indicate stale hints after code changes

## Feature: large code handling

- [x] handle code that exceeds LLM token limits

## Feature: multi-tab awareness

- [x] use code from the active tab

## Feature: offline detection

- [x] show offline state when network is unavailable

## Feature: Mooch desktop integration

- [x] detect running Mooch desktop app
- [x] route hint requests through Mooch desktop
- [x] fall back to standalone mode when Mooch is unavailable
- [x] share provider configuration from Mooch desktop
- [x] send extracted code to Mooch for analysis
- [x] sync interview context from Mooch desktop

## Feature: error recovery

- [x] retry failed hint request

## Feature: code panel display

- [x] render code blocks in a styled code panel

## Feature: copy code button

- [x] copy code from a code panel

## Feature: regenerate hint

- [x] Get Hint button changes to Regenerate after first hint

## Feature: user context input

- [x] add user context to hint request

## Feature: A readme that is friendly for users who just want to get started

- [x] A new user to the Mooch ecosystem

---
**41/41 scenarios covered.**
