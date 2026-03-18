export interface ProblemMetadata {
  difficulty: string | null;
  tags: string[] | null;
  constraints: string | null;
}

export function extractMetadata(doc: Document): ProblemMetadata {
  return {
    difficulty: extractDifficulty(doc),
    tags: extractTags(doc),
    constraints: extractConstraints(doc),
  };
}

function extractDifficulty(doc: Document): string | null {
  // LeetCode-style: [data-difficulty] or class containing "difficulty"
  const byAttr = doc.querySelector('[data-difficulty]');
  if (byAttr) {
    return byAttr.getAttribute('data-difficulty');
  }

  // Class-based: text-difficulty-easy, text-difficulty-medium, text-difficulty-hard
  for (const level of ['easy', 'medium', 'hard']) {
    const el = doc.querySelector(`.text-difficulty-${level}`);
    if (el) {
      return el.textContent?.trim() ?? null;
    }
  }

  return null;
}

function extractTags(doc: Document): string[] | null {
  const tagEls = doc.querySelectorAll('.topic-tag');
  if (tagEls.length > 0) {
    const tags = Array.from(tagEls)
      .map(el => el.textContent?.trim() ?? '')
      .filter(t => t.length > 0);
    return tags.length > 0 ? tags : null;
  }
  return null;
}

function extractConstraints(doc: Document): string | null {
  const container = doc.querySelector('.constraints');
  if (container) {
    const text = container.textContent?.trim() ?? '';
    return text.length > 0 ? text : null;
  }
  return null;
}
