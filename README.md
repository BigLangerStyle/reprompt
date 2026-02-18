# ⚡ Reprompt

Heuristic-driven quick reply tray for ChatGPT. No AI calls. Fully local.

---

## What It Does

Reprompt injects a small tray above the ChatGPT composer with 4–6 context-aware reply buttons. Click a button to insert the text. Shift+Click to insert and send immediately.

Buttons are selected by a lightweight keyword heuristic — no API calls, no external requests, no accounts.

---

## Install (Developer Mode)

1. Clone or download this repo
2. Open Chrome → `chrome://extensions`
3. Enable **Developer Mode** (top right)
4. Click **Load unpacked**
5. Select the repo root folder (where `manifest.json` lives)
6. Navigate to [chat.openai.com](https://chat.openai.com) or [chatgpt.com](https://chatgpt.com)

---

## Usage

| Action | Result |
|---|---|
| Click tray pill | Expand quick replies |
| Click a button | Insert text into composer |
| Shift+Click a button | Insert + send immediately |
| Alt+1..6 | Activate button by number |
| Esc | Collapse tray |

The tray also expands automatically when the textarea receives focus or when a new assistant message appears.

---

## Template Packs

The heuristic engine selects one of five packs based on the conversation:

| Pack | Triggered by |
|---|---|
| **General** | Default fallback |
| **Coding** | Code blocks, language keywords, error terms |
| **Docs** | Step/instruction/guide language |
| **Decision** | "Should I", "which", "pros/cons", comparison language |
| **Editing** | Grammar, tone, rewrite, concise language |

---

## Privacy

- Zero network requests
- Zero telemetry
- All data stored locally via `chrome.storage.local`
- No accounts, no API keys

---

## Version History

### 0.1.0 (February 18, 2026)

**Initial release — MVP scaffold**

- Template packs: general, coding, docs, decision, editing
- Heuristic keyword scoring engine
- React-compatible text insert logic
- MutationObserver DOM resilience
- Keyboard shortcuts (Alt+1..6, Esc, Shift+Click)
- Dark/light theme support
- Usage count persistence + pinned templates

---

## Development

No build step required. Edit source files, reload the extension in `chrome://extensions`.

```
reprompt/
├── manifest.json
├── background.js
├── content.js
├── styles.css
├── templates.js
└── utils/
    ├── dom.js
    ├── heuristics.js
    └── storage.js
```

Agent workflow and preferences are in `.agent/`.
