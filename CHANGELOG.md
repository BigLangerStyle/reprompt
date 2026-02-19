# Changelog

All notable changes to Reprompt will be documented in this file.

## [0.1.0] - 2026-02-18

### Added

- **Monorepo structure** - Shared source in `src/`, browser-specific manifests in `chrome/` and `firefox/`, build scripts in `scripts/`
- **Chrome Manifest V3** + **Firefox Manifest V2** - dual browser support
- **Build scripts** - `build-chrome.js` and `build-firefox.js` with automatic `chrome.*` → `browser.*` transform for Firefox
- **Dev watch scripts** - `watch-chrome.js` (rebuilds on save) and `watch-firefox.js` (rebuilds + auto-reloads via web-ext)
- **Template packs** - 4 mode-mapped packs × 6 templates: code, long, typing, default
- **Task mode detection** - Deterministic structural signal engine replacing keyword scoring; detects code blocks, response length, and textarea state; falls back to default (Exploration) pack
- **React-compatible insert logic** - Native value setter override + input event dispatch
- **MutationObserver** - Debounced re-injection when ChatGPT re-renders the composer
- **Collapse/expand tray** - Pill state when inactive, horizontal button row when active
- **Keyboard shortcuts** - Alt+1..6 to activate buttons, Esc to collapse
- **Shift+Click** - Insert text and trigger send
- **Persistence** - Usage counts, pinned templates, and last pack via chrome.storage.local
- **Dark/light theme** - CSS variables respond to prefers-color-scheme
- **Multi-selector fallback** - Textarea detection tries multiple selectors for DOM resilience
