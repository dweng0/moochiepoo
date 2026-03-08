import { LLMConfig } from './llm-client';

export type OptionsState =
  | { provider: 'anthropic'; apiKey: string; model: string }
  | { provider: 'openai-compatible'; apiKey: string; baseUrl: string; model: string };

export function renderOptions(container: HTMLElement, state: OptionsState): void {
  container.innerHTML = '';

  // Provider selector
  container.appendChild(makeSelect('Provider', 'provider', [
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'openai-compatible', label: 'OpenAI-compatible' }
  ], state.provider));

  container.appendChild(makeInput('API Key', 'apiKey', 'password', state.apiKey));

  // Provider-specific fields
  const extras = document.createElement('div');
  extras.id = 'provider-extras';
  renderExtras(extras, state);
  container.appendChild(extras);

  // Re-render extras when provider changes
  const select = container.querySelector<HTMLSelectElement>('select[name="provider"]')!;
  select.addEventListener('change', () => {
    const apiKey = container.querySelector<HTMLInputElement>('input[name="apiKey"]')?.value ?? '';
    const newState: OptionsState = select.value === 'openai-compatible'
      ? { provider: 'openai-compatible', apiKey, baseUrl: '', model: '' }
      : { provider: 'anthropic', apiKey, model: 'claude-haiku-4-5-20251001' };
    renderExtras(extras, newState);
  });
}

function renderExtras(container: HTMLElement, state: OptionsState): void {
  container.innerHTML = '';
  if (state.provider === 'openai-compatible') {
    container.appendChild(makeInput('Base URL (optional)', 'baseUrl', 'text', state.baseUrl));
    container.appendChild(makeInput('Model', 'model', 'text', state.model, 'Model names may be case-sensitive'));
  } else {
    container.appendChild(makeInput('Model', 'model', 'text', state.model, 'e.g. claude-haiku-4-5-20251001'));
  }
}

function makeInput(labelText: string, name: string, type: string, value: string, hint?: string): HTMLElement {
  const wrapper = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.value = value;
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  if (hint) {
    const small = document.createElement('small');
    small.textContent = hint;
    wrapper.appendChild(small);
  }
  return wrapper;
}

function makeSelect(labelText: string, name: string, options: { value: string; label: string }[], selected: string): HTMLElement {
  const wrapper = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  const select = document.createElement('select');
  select.name = name;
  options.forEach(({ value, label: optLabel }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = optLabel;
    opt.selected = value === selected;
    select.appendChild(opt);
  });
  wrapper.appendChild(label);
  wrapper.appendChild(select);
  return wrapper;
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
