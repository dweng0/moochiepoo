/**
 * Scenario: request hint via keyboard shortcut
 * Given the user is on a supported coding challenge page
 * When they press Ctrl+Shift+H (or Cmd+Shift+H on macOS)
 * Then the extension should request a hint without needing to open the popup
 */

import { isHintShortcut } from '../src/keyboard-shortcut';

describe('Scenario: request hint via keyboard shortcut', () => {
  it('detects Ctrl+Shift+H as the hint shortcut', () => {
    const event = new KeyboardEvent('keydown', { key: 'H', ctrlKey: true, shiftKey: true });
    expect(isHintShortcut(event)).toBe(true);
  });

  it('detects Cmd+Shift+H (macOS) as the hint shortcut', () => {
    const event = new KeyboardEvent('keydown', { key: 'H', metaKey: true, shiftKey: true });
    expect(isHintShortcut(event)).toBe(true);
  });

  it('does not trigger on Ctrl+H (without Shift)', () => {
    const event = new KeyboardEvent('keydown', { key: 'H', ctrlKey: true, shiftKey: false });
    expect(isHintShortcut(event)).toBe(false);
  });

  it('does not trigger on Shift+H (without Ctrl/Cmd)', () => {
    const event = new KeyboardEvent('keydown', { key: 'H', shiftKey: true });
    expect(isHintShortcut(event)).toBe(false);
  });

  it('is case-insensitive for the key', () => {
    const event = new KeyboardEvent('keydown', { key: 'h', ctrlKey: true, shiftKey: true });
    expect(isHintShortcut(event)).toBe(true);
  });
});
