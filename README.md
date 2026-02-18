# ⚡ Reprompt

**Heuristic-driven quick reply tray for ChatGPT.**
Instant follow-up suggestions, right above the composer.

---

## What It Does

Reprompt injects a small tray above the ChatGPT composer with 4–6 context-aware reply buttons. Click a button to insert the text. Shift+Click to insert and send immediately.

The tray reads the conversation and selects the most relevant set of follow-ups — clarifications, edits, code requests, comparisons — so the next move is always one click away.

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

Reprompt selects one of five packs based on the conversation context:

| Pack | Triggered by |
|---|---|
| **General** | Default |
| **Coding** | Code blocks, language keywords, error terms |
| **Docs** | Step/instruction/guide language |
| **Decision** | "Should I", "which", "pros/cons", comparison language |
| **Editing** | Grammar, tone, rewrite, concise language |

Most-used buttons surface toward the front over time.

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
