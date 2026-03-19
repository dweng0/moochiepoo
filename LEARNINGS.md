# Learnings

This file records knowledge gathered during development that might be useful for future sessions. It's organized by topic.

## Project Structure — 2026-03-19 16:22

The project is a Chrome extension built with TypeScript and uses Webpack for bundling. Key directories:
- `src/` contains the main source code
- `tests/` contains unit tests
- `dist/` is the output directory for built files
- `manifest.json` defines the extension metadata
- The build process uses `tsc` for type checking and `webpack` for bundling

The extension follows a modular architecture with separate files for content scripts, background scripts, popup UI, and options page.

Things I've looked up so I don't search for the same thing twice.

<!-- Format: ## [Topic] / [Date] -->
<!-- Write what you learned, link to the source, note what you'd do differently. -->
