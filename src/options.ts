import { renderOptions, saveConfig, loadConfig, OptionsState } from './options-ui';

const container = document.getElementById('options') as HTMLElement;
const status = document.getElementById('status') as HTMLElement;
const form = document.getElementById('options-form') as HTMLFormElement;

async function init(): Promise<void> {
  const saved = await loadConfig();
  const state: OptionsState = saved ?? { provider: 'anthropic', apiKey: '', model: 'claude-haiku-4-5-20251001' };
  renderOptions(container, state);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const provider = data.get('provider') as string;

  let config: OptionsState;
  if (provider === 'openai-compatible') {
    config = {
      provider: 'openai-compatible',
      apiKey: data.get('apiKey') as string,
      baseUrl: data.get('baseUrl') as string,
      model: data.get('model') as string
    };
  } else {
    config = {
      provider: 'anthropic',
      apiKey: data.get('apiKey') as string,
      model: (data.get('model') as string) || 'claude-haiku-4-5-20251001'
    };
  }

  await saveConfig(config);
  status.textContent = 'Saved!';
  setTimeout(() => { status.textContent = ''; }, 2000);
});

init();
