export interface SiteProfile {
  name: string;
  hostname: string;
}

const SUPPORTED_SITES: SiteProfile[] = [
  { name: 'LeetCode',   hostname: 'leetcode.com' },
  { name: 'HackerRank', hostname: 'www.hackerrank.com' },
  { name: 'Codewars',   hostname: 'www.codewars.com' },
  { name: 'CoderPad',   hostname: 'app.coderpad.io' }
];

export function getSiteProfile(hostname: string): SiteProfile | null {
  return SUPPORTED_SITES.find(s => hostname === s.hostname || hostname.endsWith('.' + s.hostname)) ?? null;
}

export function isSupported(hostname: string): boolean {
  return getSiteProfile(hostname) !== null;
}
