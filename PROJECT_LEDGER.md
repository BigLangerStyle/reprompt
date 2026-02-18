# ⚡ Project Ledger

## Project Name

**Reprompt — Heuristic Quick Replies for ChatGPT**

**Version:** 0.1.0
**Last Update:** February 18, 2026
**Status:** In Progress

---

## Vision

A Chrome extension that injects a contextual "Quick Replies" tray above the ChatGPT composer.

The tray displays 4–6 click-to-insert response buttons selected by lightweight heuristics — no AI calls, no API keys, no external network requests.

Goal:
- Feel intelligent
- Remain fully local
- Zero data leaves the browser
- Fast and visually polished

This is not an AI feature. It is heuristic + template driven.

---

## 1. Scope — v0.1.0 MVP

### Core Behavior

- Inject a small UI tray above ChatGPT's textarea
- Show 4–6 reply buttons selected by heuristics
- Buttons insert text into the composer
- Optional modifier: Shift+Click inserts and sends
- Tray appears when input receives focus OR new assistant message appears
- Tray collapses to a small pill when inactive

### Explicit Non-Goals (v0.1.0)

- No LLM calls
- No remote servers
- No telemetry
- No account system
- No Firefox support
- No per-pack customization UI

---

## 2. Technical Stack

- Manifest V3 Chrome Extension
- Content script for DOM injection
- Background service worker (minimal)
- `chrome.storage.local` for persistence
- MutationObserver for ChatGPT DOM resilience

Target sites:
```
https://chat.openai.com/*
https://chatgpt.com/*
```

---

## 3. File Structure

```
reprompt/
│
├── manifest.json
├── background.js
├── content.js
├── styles.css
├── templates.js
└── utils/
    ├── dom.js
    ├── heuristics.js
    └── storage.js

.agent/
├── project-preferences.md
└── claude_workflow.md

PROJECT_LEDGER.md
CHANGELOG.md
README.md
```

---

## 4. v0.1.0 Progress

### ✅ Completed

- [x] Project scaffold and file structure
- [x] Manifest V3 configuration
- [x] `templates.js` — 5 packs × 6 templates (general, coding, docs, decision, editing)
- [x] `utils/heuristics.js` — keyword scoring engine with threshold gating
- [x] `utils/dom.js` — React-compatible textarea detection + insert logic
- [x] `utils/storage.js` — usage counts, pinned templates, last pack
- [x] `background.js` — minimal service worker
- [x] `content.js` — tray injection, MutationObserver, keyboard shortcuts
- [x] `styles.css` — dark/light theme, collapsed/expanded states

### 🔲 Still To Do

- [ ] Create placeholder icons (16px, 48px, 128px)
- [ ] End-to-end testing on chat.openai.com and chatgpt.com
- [ ] Selector resilience testing (verify textarea detection still works)
- [ ] Shift+Click send behavior verification

---

## 5. Phase 2 (Documented, Not Now)

- Per-pack customization UI
- Toggle packs on/off
- Drag to reorder templates
- Cross-site support (Claude, Gemini)
- Export/import template packs
- Firefox support

---

## 6. Resume Framing

This project demonstrates:
- DOM mutation resilience on a large React app
- UX augmentation without AI
- Extension architecture (Manifest V3)
- State persistence via chrome.storage.local
- Keyboard accessibility
- Performance-sensitive injection logic
- Heuristic inference design
