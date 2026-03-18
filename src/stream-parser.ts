export type StreamState = {
  partialHint: string;
  done: boolean;
};

export function parseSSEChunk(line: string, provider: 'anthropic' | 'openai-compatible'): string | null {
  if (!line.startsWith('data: ')) return null;
  const data = line.slice(6).trim();
  if (data === '[DONE]') return null;

  try {
    const parsed = JSON.parse(data);

    if (provider === 'anthropic') {
      if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
        return parsed.delta.text as string;
      }
      return null;
    } else {
      const content = parsed.choices?.[0]?.delta?.content;
      return content ?? null;
    }
  } catch {
    return null;
  }
}
