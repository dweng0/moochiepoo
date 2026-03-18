import { LLMConfig } from './llm-client';
import { checkMoochHealth, MoochHealthResponse } from './mooch-bridge';

export type OptionsState =
  | { provider: 'anthropic'; apiKey: string; model: string }
  | { provider: 'openai-compatible'; apiKey: string; baseUrl: string; model: string }
  | { provider: 'mooch' };

export function renderOptions(container: HTMLElement, state: OptionsState): void {
  container.innerHTML = '';

  const mode = state.provider === 'mooch' ? 'mooch' : 'direct';

  // Hidden input to track which mode is active
  const modeInput = document.createElement('input');
  modeInput.type = 'hidden';
  modeInput.name = 'connectionMode';
  modeInput.value = mode;
  container.appendChild(modeInput);

  // Mode cards
  const cards = document.createElement('div');
  cards.className = 'mode-cards';

  const directCard = makeModeCard(
    'direct',
    'Use API Key',
    'Connect directly using your own LLM provider key',
    mode === 'direct'
  );
  const moochCard = makeModeCard(
    'mooch',
    'Connect via Mooch',
    'Use your Mooch desktop app\'s AI settings',
    mode === 'mooch'
  );

  cards.appendChild(directCard);
  cards.appendChild(moochCard);
  container.appendChild(cards);

  // Content area that changes based on mode
  const content = document.createElement('div');
  content.id = 'mode-content';
  container.appendChild(content);

  function activateMode(m: 'direct' | 'mooch'): void {
    modeInput.value = m;
    directCard.classList.toggle('active', m === 'direct');
    moochCard.classList.toggle('active', m === 'mooch');
    if (m === 'direct') {
      renderDirectMode(content, state.provider !== 'mooch' ? state : { provider: 'anthropic', apiKey: '', model: 'claude-haiku-4-5-20251001' });
    } else {
      renderMoochMode(content);
    }
  }

  directCard.addEventListener('click', () => activateMode('direct'));
  moochCard.addEventListener('click', () => activateMode('mooch'));

  activateMode(mode);
}

function makeModeCard(id: string, title: string, description: string, active: boolean): HTMLElement {
  const card = document.createElement('div');
  card.className = 'mode-card' + (active ? ' active' : '');
  card.dataset.mode = id;

  const h = document.createElement('div');
  h.className = 'mode-card-title';
  h.textContent = title;

  const p = document.createElement('div');
  p.className = 'mode-card-desc';
  p.textContent = description;

  card.appendChild(h);
  card.appendChild(p);
  return card;
}

function renderDirectMode(container: HTMLElement, state: OptionsState): void {
  container.innerHTML = '';

  const directState = state.provider !== 'mooch' ? state : { provider: 'anthropic' as const, apiKey: '', model: 'claude-haiku-4-5-20251001' };

  container.appendChild(makeSelect('Provider', 'provider', [
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'openai-compatible', label: 'OpenAI-compatible' }
  ], directState.provider));

  container.appendChild(makeInput('API Key', 'apiKey', 'password', directState.apiKey));

  const extras = document.createElement('div');
  extras.id = 'provider-extras';
  renderExtras(extras, directState);
  container.appendChild(extras);

  const select = container.querySelector<HTMLSelectElement>('select[name="provider"]')!;
  select.addEventListener('change', () => {
    const apiKey = container.querySelector<HTMLInputElement>('input[name="apiKey"]')?.value ?? '';
    const newState: OptionsState = select.value === 'openai-compatible'
      ? { provider: 'openai-compatible', apiKey, baseUrl: '', model: '' }
      : { provider: 'anthropic', apiKey, model: 'claude-haiku-4-5-20251001' };
    renderExtras(extras, newState);
  });
}

function renderMoochMode(container: HTMLElement): void {
  container.innerHTML = '';

  const statusDiv = document.createElement('div');
  statusDiv.className = 'mooch-status';
  statusDiv.innerHTML = '<span class="mooch-checking">Checking connection...</span>';
  container.appendChild(statusDiv);

  const info = document.createElement('div');
  info.className = 'mooch-info';
  info.textContent = 'Mooch desktop shares its AI provider settings with this extension — no API key needed here.';
  container.appendChild(info);

  checkMoochHealth().then((health: MoochHealthResponse | null) => {
    if (health) {
      statusDiv.innerHTML = '';
      const dot = document.createElement('span');
      dot.className = 'mooch-dot connected';
      statusDiv.appendChild(dot);

      const text = document.createElement('span');
      text.className = 'mooch-connected-text';
      text.textContent = `Connected to Mooch v${health.version}`;
      statusDiv.appendChild(text);

      if (health.activeSession) {
        const session = document.createElement('div');
        session.className = 'mooch-session';
        session.textContent = `Active session: ${health.activeSession}`;
        container.appendChild(session);
      }
    } else {
      statusDiv.innerHTML = '';
      const dot = document.createElement('span');
      dot.className = 'mooch-dot disconnected';
      statusDiv.appendChild(dot);

      const text = document.createElement('span');
      text.textContent = 'Mooch desktop not detected';
      statusDiv.appendChild(text);

      const hint = document.createElement('div');
      hint.className = 'mooch-hint';
      hint.textContent = 'Make sure Mooch is running on your machine. The extension connects at localhost:62544.';
      container.appendChild(hint);
    }
  });
}

type DirectState = Exclude<OptionsState, { provider: 'mooch' }>;

function renderExtras(container: HTMLElement, state: DirectState): void {
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
