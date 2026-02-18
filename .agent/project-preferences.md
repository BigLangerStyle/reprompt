# Agent Preferences for Reprompt Project

## 🚨 CRITICAL: Version Control Rules

**CURRENT VERSION: 0.1.0**

### DO NOT increment version without explicit user instruction

All features currently listed in `PROJECT_LEDGER.md` under **"Still To Do (v0.1.0)"** are part of the **v0.1.0 MVP release**.

**Do NOT create v0.1.1, v0.2.0, etc. unless the user explicitly says to move to the next version.**

### When Adding New Features

#### ✅ CORRECT Approach:
- Keep version at **0.1.0** in `manifest.json`
- Add feature to existing v0.1.0 sections in CHANGELOG.md and README.md
- Mark feature as complete in PROJECT_LEDGER.md under v0.1.0
- Keep the same date or update to current work date

#### ❌ WRONG Approach:
- Creating v0.1.1 or v0.2.0 sections
- Incrementing version numbers in manifest.json
- Creating new CHANGELOG entries with new versions

### Current v0.1.0 MVP Roadmap

**Completed:**
- [x] Project scaffold and file structure
- [x] Manifest V3 configuration
- [x] `templates.js` — 5 packs × 6 templates
- [x] `utils/heuristics.js` — keyword scoring engine
- [x] `utils/dom.js` — React-compatible textarea detection + insert logic
- [x] `utils/storage.js` — usage counts, pinned templates, last pack
- [x] `background.js` — minimal service worker
- [x] `content.js` — tray injection, MutationObserver, keyboard shortcuts
- [x] `styles.css` — dark/light theme, collapsed/expanded states

**Still To Do (ALL PART OF v0.1.0):**
- [ ] Placeholder icons (16px, 48px, 128px)
- [ ] End-to-end testing on chat.openai.com and chatgpt.com
- [ ] Selector resilience verification
- [ ] Shift+Click send behavior verification

**Explicit Non-Goals for v0.1.0:**
- No LLM calls
- No remote servers
- No telemetry
- No Firefox support
- No per-pack customization UI

---

## 📝 Documentation Update Requirements

**CRITICAL: Always update documentation when completing features**

After implementing any new feature or fixing bugs, you MUST update associated documentation:

### Required Updates:
1. **CHANGELOG.md** — Add feature/fix details under the current version section (v0.1.0)
2. **README.md** — Add to the current version's feature list in the version history
3. **PROJECT_LEDGER.md** — Mark feature as complete, move from "Still To Do" to "Completed"

### Workflow:
- When presenting completed work, ALWAYS include both:
  - Code files (source files)
  - Documentation files (CHANGELOG.md, README.md, PROJECT_LEDGER.md)
- Never present code changes without corresponding documentation updates

### Example:
```
User: "Fix the Shift+Click send behavior"

Response after completion:
1. Present content.js (updated code)
2. Present CHANGELOG.md (fix added to v0.1.0 section)
3. Present README.md (updated if user-facing)
4. Present PROJECT_LEDGER.md (marked as complete in v0.1.0)
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
- `manifest.json`
- `background.js`
- `content.js`
- `styles.css`
- `templates.js`
- `utils/*.js`
- `*.md` files

---

## File Presentation Preferences

### ❌ DON'T:
- Provide diffs, snippets, or partial edits
- Ask the user to manually apply changes
- Silently truncate large files

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

## Important Technical Notes

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

### No Build Step
- Load unpacked directly from repo root
- No transpilation, no bundling, no npm required for v0.1.0

---

## Version Management

### Files to Keep in Sync:
1. `manifest.json` — "version" field
2. `PROJECT_LEDGER.md` — "Version:" field
3. `CHANGELOG.md` — Latest version section header
4. `README.md` — Latest version in history section

**REMINDER: Do not update version unless user explicitly says to release a new version!**

---

## 🚫 Git Management

**CRITICAL: User manages Git separately in Cursor**

- **DO NOT** run `git init`, `git checkout`, `git commit`, or any Git operations
- **DO** prepare and present complete modified source files
- **DO** update documentation files
- **DO** provide a suggested commit message at the end of every task
