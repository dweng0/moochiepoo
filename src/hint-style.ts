export type HintStyle = 'gentle' | 'detailed' | 'pseudocode';

const PROMPTS: Record<HintStyle, string> = {
  gentle:
    'You are a helpful coding interview assistant. Give a brief nudge with a short code snippet showing the key pattern or data structure to use. Keep it to 2-3 sentences plus a small example.',
  detailed:
    'You are a helpful coding interview assistant. Provide a detailed explanation of the approach with concrete code examples. Cover the key data structures, algorithm choice, and time/space complexity. Include code snippets showing how to set up the solution and handle edge cases.',
  pseudocode:
    'You are a helpful coding interview assistant. Provide a pseudocode outline of the solution approach with concrete examples. Use clear step-by-step pseudocode that the candidate can translate into their language of choice, and include example input/output to illustrate the logic.',
};

export function getSystemPromptForStyle(style: HintStyle): string {
  return PROMPTS[style] ?? PROMPTS.gentle;
}
