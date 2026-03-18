export interface TruncationResult {
  code: string;
  wasTruncated: boolean;
}

const TRUNCATION_NOTICE = '\n\n// ... [code truncated to fit token limits]';

export function truncateCode(code: string, maxChars: number): TruncationResult {
  if (code.length <= maxChars) {
    return { code, wasTruncated: false };
  }

  const trimmed = code.slice(0, maxChars) + TRUNCATION_NOTICE;
  return { code: trimmed, wasTruncated: true };
}
