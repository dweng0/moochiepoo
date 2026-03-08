export type LLMConfig =
  | { provider: 'anthropic'; apiKey: string; model: string }
  | { provider: 'openai-compatible'; apiKey: string; baseUrl: string; model: string };

export interface HintRequest {
  code: string;
  pageTitle: string;
  config: LLMConfig;
}

const SYSTEM_PROMPT =
  'You are a helpful coding interview assistant. Given a coding challenge and the user\'s current code, provide concise hints and tips to guide them — without giving away the full solution.';

function buildPrompt(code: string, pageTitle: string): string {
  return `Challenge: ${pageTitle}\n\nCurrent code:\n\`\`\`\n${code}\n\`\`\`\n\nProvide helpful hints and tips for solving this challenge.`;
}

export async function requestHint({ code, pageTitle, config }: HintRequest): Promise<string> {
  const prompt = buildPrompt(code, pageTitle);

  if (config.provider === 'anthropic') {
    return callAnthropic(prompt, config);
  } else {
    return callOpenAICompatible(prompt, config);
  }
}

async function callAnthropic(
  prompt: string,
  config: Extract<LLMConfig, { provider: 'anthropic' }>
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text as string;
}

async function callOpenAICompatible(
  prompt: string,
  config: Extract<LLMConfig, { provider: 'openai-compatible' }>
): Promise<string> {
  const url = `${config.baseUrl.replace(/\/$/, '')}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Only include Authorization header if API key is provided
  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}
