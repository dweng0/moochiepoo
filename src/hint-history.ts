export interface HintHistoryEntry {
  hint: string;
  timestamp: number;
}

const STORAGE_KEY = 'hintHistory';

export function getHintHistory(cb: (history: HintHistoryEntry[]) => void): void {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    cb((result[STORAGE_KEY] as HintHistoryEntry[]) ?? []);
  });
}

export function addHintToHistory(hint: string, cb?: () => void): void {
  getHintHistory((history) => {
    const entry: HintHistoryEntry = { hint, timestamp: Date.now() };
    const updated = [entry, ...history];
    chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => { if (cb) cb(); });
  });
}

export function clearHintHistory(cb?: () => void): void {
  chrome.storage.local.remove(STORAGE_KEY, () => { if (cb) cb(); });
}
