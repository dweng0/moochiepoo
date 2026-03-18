export interface SiteProfile {
  name: string;
  hostname: string;
}

const SUPPORTED_SITES: SiteProfile[] = [
  { name: 'LeetCode',   hostname: 'leetcode.com' },
  { name: 'HackerRank', hostname: 'www.hackerrank.com' },
  { name: 'Codewars',   hostname: 'www.codewars.com' },
  { name: 'CoderPad',   hostname: 'app.coderpad.io' },
  { name: 'CodeSignal', hostname: 'app.codesignal.com' },
  { name: 'Exercism',   hostname: 'exercism.org' },
  { name: 'AlgoExpert', hostname: 'www.algoexpert.io' }
];

export function getSiteProfile(hostname: string): SiteProfile | null {
  return SUPPORTED_SITES.find(s => hostname === s.hostname || hostname.endsWith('.' + s.hostname)) ?? null;
}

export function isSupported(hostname: string): boolean {
  return getSiteProfile(hostname) !== null;
}

export function getSupportedSiteNames(): string[] {
  return SUPPORTED_SITES.map(s => s.name);
}
