import { LLMConfig } from './llm-client';

export type OptionsState =
  | { provider: 'anthropic'; apiKey: string; model: string }
  | { provider: 'openai-compatible'; apiKey: string; baseUrl: string; model: string };

export function renderOptions(container: HTMLElement, state: OptionsState): void {
  container.innerHTML = '';

  const providerLabel = document.createElement('label');
  providerLabel.textContent = 'Provider: ';
  const providerSelect = document.createElement('select');
  providerSelect.name = 'provider';
  [
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'openai-compatible', label: 'OpenAI-compatible' }
  ].forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    opt.selected = value === state.provider;
    providerSelect.appendChild(opt);
  });
  providerLabel.appendChild(providerSelect);
  container.appendChild(providerLabel);

  container.appendChild(makeInput('API Key', 'apiKey', 'password', state.apiKey));

  if (state.provider === 'openai-compatible') {
    container.appendChild(makeInput('Base URL', 'baseUrl', 'text', state.baseUrl));
    container.appendChild(makeInput('Model', 'model', 'text', state.model));
  }
}

function makeInput(labelText: string, name: string, type: string, value: string): HTMLElement {
  const label = document.createElement('label');
  label.textContent = `${labelText}: `;
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.value = value;
  label.appendChild(input);
  return label;
}

export function saveConfig(config: OptionsState): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.local.set({ llmConfig: config as unknown as LLMConfig }, resolve);
  });
}

export function loadConfig(): Promise<OptionsState | null> {
  return new Promise(resolve => {
    chrome.storage.local.get(['llmConfig'], result => {
      resolve((result.llmConfig as OptionsState) ?? null);
    });
  });
}
