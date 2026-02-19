# Agent Preferences for Reprompt Project

## 🚨 CRITICAL: Version Control Rules

**CURRENT VERSION: 0.1.0**

### DO NOT increment version without explicit user instruction

**Do NOT create v0.1.1, v0.2.0, etc. unless the user explicitly says to move to the next version.**

### When Adding New Features

#### ✅ CORRECT Approach:
- Keep version at **0.1.0** in both manifest files and `package.json`
- Add feature to existing v0.1.0 sections in CHANGELOG.md and README.md
- Keep the same date or update to current work date

#### ❌ WRONG Approach:
- Creating v0.1.1 or v0.2.0 sections
- Incrementing version numbers in manifest files
- Creating new CHANGELOG entries with new versions

### Current v0.1.0 MVP Roadmap

**Completed:**
- [x] Monorepo structure (src/, chrome/, firefox/, scripts/)
- [x] Chrome Manifest V3 + Firefox Manifest V2
- [x] Build scripts (build-chrome.js, build-firefox.js)
- [x] `src/templates.js` — 5 packs × 6 templates
- [x] `src/utils/heuristics.js` — keyword scoring engine
- [x] `src/utils/dom.js` — React-compatible textarea detection + insert logic
- [x] `src/utils/storage.js` — usage counts, pinned templates, last pack
- [x] `src/background.js` — minimal service worker
- [x] `src/content.js` — tray injection, MutationObserver, keyboard shortcuts
- [x] `src/styles.css` — dark/light theme, collapsed/expanded states

**Still To Do (ALL PART OF v0.1.0):**
- [ ] Real icons (16px, 48px, 128px)
- [ ] End-to-end testing on chat.openai.com and chatgpt.com (Chrome)
- [ ] End-to-end testing in Firefox
- [ ] Selector resilience verification
- [ ] Shift+Click send behavior verification

**Explicit Non-Goals for v0.1.0:**
- No per-pack customization UI

---

## 📝 Documentation Update Requirements

**CRITICAL: Always update documentation when completing features**

After implementing any new feature or fixing bugs, you MUST update:

1. **CHANGELOG.md** — Add feature/fix details under the current version section (v0.1.0)
2. **README.md** — Update version history if user-facing changes

### Workflow:
- When presenting completed work, ALWAYS include both code files and documentation files
- Never present code changes without corresponding documentation updates

### Example:
```
User: "Fix the Shift+Click send behavior"

Response after completion:
1. Present src/content.js (updated code)
2. Present CHANGELOG.md (fix added to v0.1.0 section)
3. Present README.md (updated if user-facing)
```

---

## 🔧 Line Ending Normalization

Handle line ending conversions automatically for Git-tracked files.

### Two-Way Conversion Process:

**When READING uploaded files:**
```bash
dos2unix <filename> 2>/dev/null || sed -i 's/\r$//' <filename>
```

**When PRESENTING files back to user:**
```bash
unix2dos <filename> 2>/dev/null || sed -i 's/$/\r/' <filename>
```

### Git-Tracked Files in This Project:
- `chrome/manifest.json`
- `firefox/manifest.json`
- `src/*.js`
- `src/utils/*.js`
- `src/styles.css`
- `scripts/*.js`
- `package.json`
- `*.md` files

**Never convert:** `build/` contents (gitignored)

---

## File Presentation Preferences

### ❌ DON'T:
- Provide diffs, snippets, or partial edits
- Ask the user to manually apply changes
- Silently truncate large files
- Present files from `build/` — always present source files

### ✅ DO:
- Present each file individually using `present_files`, one at a time
- Return the **complete, final version** of any modified file
- Include clear note about where each file goes in the repo

If a file is too large to safely return in full:
- Stop and say so explicitly
- Propose breaking the task into smaller steps

---

## Project Structure

```
reprompt/
│
├── chrome/
│   └── manifest.json          (Manifest V3, Chrome)
├── firefox/
│   └── manifest.json          (Manifest V2, Firefox)
├── src/
│   ├── background.js
│   ├── content.js
│   ├── styles.css
│   ├── templates.js
│   └── utils/
│       ├── dom.js
│       ├── heuristics.js
│       └── storage.js
├── scripts/
│   ├── build-chrome.js
│   └── build-firefox.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── build/                     (gitignored — never upload or present)
│
├── .agent/
│   ├── project-preferences.md
│   └── claude_workflow.md
│
├── .gitignore
├── package.json
├── CHANGELOG.md
└── README.md
```

---

## Important Technical Notes

### Build Process
- `npm run build:chrome` — copies src/ + chrome/manifest.json → build/chrome/
- `npm run dev:chrome` — watches src/ and rebuilds on save (reload manually in chrome://extensions)
- `npm run dev:firefox` — watches src/, rebuilds, and auto-reloads via web-ext
- `npm run build:firefox` — copies src/ + firefox/manifest.json → build/firefox/, transforms chrome.* → browser.*
- Always present source files from `src/`, `chrome/`, `firefox/` — **never from `build/`**

### React Textarea Insert
The only reliable way to insert into ChatGPT's controlled React textarea:
1. Use `Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, text)`
2. Dispatch a native `input` event with `{ bubbles: true }`
3. Do NOT use direct `.value =` assignment — React will ignore it

### ChatGPT DOM Resilience
- ChatGPT ships UI changes without warning
- Use multiple selector fallbacks for textarea detection
- MutationObserver must debounce injection and prevent duplicate tray instances
- Re-attach tray if removed from DOM

### Heuristic Engine Philosophy
- High-confidence signals only — better to show general pack than wrong pack
- Threshold gating: pack must score above MIN_SCORE_THRESHOLD to win
- Priority order: coding > decision > docs > editing > general (fallback)

### Firefox Compatibility
- Firefox uses Manifest V2 — `background.scripts` array, not `service_worker`
- Firefox uses `browser.*` API — build script handles `chrome.*` → `browser.*` transform
- Firefox uses `browser_action` not `action`

---

## Version Management

### Files to Keep in Sync:
1. `chrome/manifest.json` — "version" field
2. `firefox/manifest.json` — "version" field
3. `package.json` — "version" field
4. `CHANGELOG.md` — Latest version section header
5. `README.md` — Latest version in history section

**REMINDER: Do not update version unless user explicitly says to release a new version!**

---

## 🚫 Git Management

**CRITICAL: User manages Git separately in Cursor**

- **DO NOT** run `git init`, `git checkout`, `git commit`, or any Git operations
- **DO** prepare and present complete modified source files
- **DO** update documentation files
- **DO** provide a suggested commit message at the end of every task
