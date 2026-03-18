export type HintStyle = 'gentle' | 'detailed' | 'pseudocode';

const PROMPTS: Record<HintStyle, string> = {
  gentle:
    'You are a helpful coding interview assistant. Give a brief, gentle nudge to guide the candidate in the right direction — without giving away the solution. Keep it to 1-2 sentences.',
  detailed:
    'You are a helpful coding interview assistant. Provide a detailed explanation of the approach, covering the key data structures, algorithm choice, and time/space complexity — without writing the full solution.',
  pseudocode:
    'You are a helpful coding interview assistant. Provide a pseudocode outline of the solution approach. Use clear step-by-step pseudocode that the candidate can translate into their language of choice.',
};

export function getSystemPromptForStyle(style: HintStyle): string {
  return PROMPTS[style] ?? PROMPTS.gentle;
}
