# Mooch Helper

A Chrome extension that assists you during technical interviews by extracting code from coding challenge websites and providing LLM-powered hints — without giving away the answer.

## What it does

- Detects when you're on a supported coding challenge site
- Extracts your current code every 8 seconds (only when it changes)
- Click the extension icon to get contextual hints and tips from an LLM
- Works with Anthropic Claude or any OpenAI-compatible model (e.g. Qwen, local LLMs)

## Supported platforms

| Platform | URL |
|---|---|
| LeetCode | leetcode.com |
| HackerRank | hackerrank.com |
| Codewars | codewars.com |
| CoderPad | coderpad.io |

## Quick start

### 1. Get an API key

- **Anthropic**: sign up at [console.anthropic.com](https://console.anthropic.com) and create an API key
- **OpenAI-compatible** (e.g. Qwen, Ollama): grab your key and base URL from your provider

### 2. Build the extension

```bash
npm install
npm run build
```

### 3. Load the extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right)
3. Click **Load unpacked** and select the `dist/` folder

### 4. Configure your API key

1. Click the Mooch Helper icon in your toolbar
2. Go to **Settings** (or right-click the icon → Options)
3. Choose your provider, enter your API key, and (for OpenAI-compatible) your base URL and model name
4. Click **Save**

### 5. Use it

Navigate to a coding challenge on any supported platform. When you want a hint, click the Mooch Helper icon — it will show hints based on your current code.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

The `dist/` folder contains the built extension ready to load into Chrome.

## Project structure

```
src/
  content.ts       # Content script: polls for code changes on supported sites
  background.ts    # Service worker: handles LLM requests
  popup.ts         # Popup UI: displays hints
  options.ts       # Settings page: API key configuration
  extractor.ts     # Extracts code from Monaco/CodeMirror editors
  poller.ts        # Polls for code changes every 8 seconds
  llm-client.ts    # Sends code to Anthropic or OpenAI-compatible LLMs
  site-profiles.ts # Registry of supported coding challenge sites
  popup-ui.ts      # Renders hint states (loading/ready/error)
  options-ui.ts    # Renders and saves API key configuration
```
