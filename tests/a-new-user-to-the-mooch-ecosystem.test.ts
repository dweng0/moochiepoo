/**
 * Scenario: A new user to the Mooch ecosystem
 * Given a user is new to the repo
 * When They go to the repo
 * Then They should see an informative and intuitive README.
 */

import * as fs from 'fs';
import * as path from 'path';

const README_PATH = path.resolve(__dirname, '../README.md');

describe('Scenario: A new user to the Mooch ecosystem', () => {
  let readme: string;

  beforeAll(() => {
    readme = fs.readFileSync(README_PATH, 'utf-8');
  });

  it('README.md exists', () => {
    expect(fs.existsSync(README_PATH)).toBe(true);
  });

  it('has a title', () => {
    expect(readme).toMatch(/^#\s+.+/m);
  });

  it('explains what the extension does', () => {
    const lower = readme.toLowerCase();
    expect(lower).toMatch(/interview|hint|code|challenge/);
  });

  it('has installation or getting started instructions', () => {
    const lower = readme.toLowerCase();
    expect(lower).toMatch(/install|get started|quick start|setup/);
  });

  it('explains how to load the extension in Chrome', () => {
    const lower = readme.toLowerCase();
    expect(lower).toMatch(/chrome|extension|load unpacked|developer mode/);
  });

  it('explains how to configure an API key', () => {
    const lower = readme.toLowerCase();
    expect(lower).toMatch(/api key|anthropic|openai/);
  });

  it('lists the supported coding challenge platforms', () => {
    expect(readme).toMatch(/LeetCode/);
    expect(readme).toMatch(/HackerRank/);
    expect(readme).toMatch(/Codewars/);
    expect(readme).toMatch(/CoderPad/);
  });

  it('includes build or development instructions', () => {
    const lower = readme.toLowerCase();
    expect(lower).toMatch(/npm|build|test/);
  });
});
