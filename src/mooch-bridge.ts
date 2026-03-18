export const MOOCH_BASE_URL = 'http://localhost:62544';
const CLIENT_HEADER = { 'X-Mooch-Client': 'chrome-extension' };

export interface MoochHealthResponse {
  status: string;
  version: string;
  activeSession: string | null;
}

export interface MoochProvider {
  name: string;
  type: 'anthropic' | 'openai-compatible';
  configured: boolean;
}

export interface MoochHintRequest {
  code: string;
  pageTitle: string;
  language?: string | null;
  metadata?: {
    difficulty?: string | null;
    tags?: string[] | null;
    constraints?: string | null;
  } | null;
  hintStyle?: 'gentle' | 'detailed' | 'pseudocode' | null;
}

export interface MoochHintResponse {
  hint: string;
}

export interface MoochAnalyzeRequest {
  code: string;
  context?: string | null;
}

export interface MoochAnalyzeResponse {
  analysis: string;
}

export async function checkMoochHealth(): Promise<MoochHealthResponse | null> {
  try {
    const response = await fetch(`${MOOCH_BASE_URL}/health`, {
      headers: CLIENT_HEADER,
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) return null;
    return await response.json() as MoochHealthResponse;
  } catch {
    return null;
  }
}

export async function requestHintViaMooch(req: MoochHintRequest): Promise<MoochHintResponse> {
  const response = await fetch(`${MOOCH_BASE_URL}/api/hint`, {
    method: 'POST',
    headers: { ...CLIENT_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${response.status}`);
  }
  return await response.json() as MoochHintResponse;
}

export async function getMoochProviders(): Promise<MoochProvider[]> {
  const response = await fetch(`${MOOCH_BASE_URL}/api/providers`, {
    headers: CLIENT_HEADER,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json() as { providers: MoochProvider[] };
  return data.providers;
}

export async function analyzeViaMooch(req: MoochAnalyzeRequest): Promise<MoochAnalyzeResponse> {
  const response = await fetch(`${MOOCH_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { ...CLIENT_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json() as MoochAnalyzeResponse;
}
