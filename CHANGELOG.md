# Changelog

All notable changes to Reprompt will be documented in this file.

## [0.1.0] — 2026-02-18

### Added

- **Initial scaffold** — Full Manifest V3 Chrome extension structure
- **Template packs** — 5 packs × 6 templates: general, coding, docs, decision, editing
- **Heuristic engine** — Keyword scoring with threshold gating; falls back to general pack
- **React-compatible insert logic** — Native value setter override + input event dispatch
- **MutationObserver** — Debounced re-injection when ChatGPT re-renders the composer
- **Collapse/expand tray** — Pill state when inactive, horizontal button row when active
- **Keyboard shortcuts** — Alt+1..6 to activate buttons, Esc to collapse
- **Shift+Click** — Insert text and trigger send
- **Persistence** — Usage counts, pinned templates, and last pack via chrome.storage.local
- **Dark/light theme** — CSS variables respond to prefers-color-scheme
- **Multi-selector fallback** — Textarea detection tries multiple selectors for DOM resilience
