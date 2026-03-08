# Mooch Helper
[![Evolution](https://github.com/dweng0/moochiepoo/actions/workflows/evolve.yml/badge.svg)](https://github.com/dweng0/moochiepoo/actions/workflows/evolve.yml)
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

## Supported LLMs

The extension works with Anthropic Claude natively, and any OpenAI-compatible API — including local models via Ollama.

| Provider | Type | Notes |
|---|---|---|
| [Anthropic Claude](https://console.anthropic.com) | Cloud | Native support; recommended default |
| [OpenAI](https://platform.openai.com) | Cloud | GPT-4o, GPT-4.1, etc. |
| [Qwen](https://dashscope.aliyuncs.com) | Cloud | Qwen2.5-Coder models work well |
| [Google Gemini](https://aistudio.google.com) | Cloud | Via OpenAI-compatible endpoint |
| [Groq](https://console.groq.com) | Cloud | Fast inference; Llama, Mixtral, etc. |
| [Together AI](https://api.together.xyz) | Cloud | Wide model selection |
| [Ollama](https://ollama.com) | Local | Run models locally; no API key needed |
| [LM Studio](https://lmstudio.ai) | Local | Local OpenAI-compatible server |
| [Jan](https://jan.ai) | Local | Local OpenAI-compatible server |

For any OpenAI-compatible provider, set the base URL to the provider's endpoint and enter your model name in Settings.

**Ollama example**: base URL `http://localhost:11434/v1`, model `qwen2.5-coder:7b`, no API key required (enter any placeholder).

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
