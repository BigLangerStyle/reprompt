# Reprompt: Compaction-Proof Claude Workflow

## Purpose

This document enforces a compaction-proof workflow for using Claude with the Reprompt repo.

Core goal: avoid full-project uploads and avoid relying on chat memory. Use scoped context plus authoritative docs.

---

## Non-Negotiable Rules

1. **Do NOT ask for or request the full project zip.**
2. **Do NOT rely on long chat history as project memory.**
3. **The source of truth is always:**
   - The repo files
   - The docs uploaded for the task
4. **Do NOT run git commands or tell the user you ran them.**
   - The user manages git in Cursor
5. **Always keep context lean:**
   - Only request files that will be read or modified
6. **Every task ends with:**
   - A list of files to commit
   - A suggested commit message
   - How to test (build + load in browser)
   - Any doc updates required

---

## Full File Return Rule (Non-Negotiable)

If Claude modifies a file in any way:

- Claude **MUST** return the complete, final version of that file
- Claude **MUST NOT** provide diffs, snippets, or partial edits
- Claude **MUST NOT** ask the user to manually apply changes
- Claude **MUST NOT** present files from `build/` — always source files

If a file is too large to safely return in full:
- Stop and say so explicitly
- Propose breaking the task into smaller steps
- **MUST NOT** silently truncate output

---

## Chat Types and Their Roles

### Main Chat
**Purpose:** High-level discussions, feature brainstorming, release planning

**Does:**
- Discuss upcoming features
- Brainstorm heuristic strategies or new template packs
- Review current state
- Produce release scope definitions

**Does NOT:**
- Implement code
- Modify files

### Release Chat (e.g., `release/v0.2.0`)
**Purpose:** Break down a release into discrete feature/bugfix chats

**Does:**
- Define scope for the release
- Produce one task description at a time as a downloadable `.md` file
- Produce a "Files to upload" list for each task
- Track completion

**Does NOT:**
- Implement code
- Make file changes

### Feature/Bugfix Chat (e.g., `feature/icon-assets`, `bugfix/selector-fallback`)
**Purpose:** Implement a single feature or bugfix

**Does:**
- Implement the task description
- Modify source files
- Update documentation
- Return complete files ready for commit
- Provide test instructions

**Does NOT:**
- Work outside the uploaded files
- Guess at code not provided
- Jump to other features

---

## The Workflow: Starting a Feature/Bugfix Chat

### Step 1: Task Description

The release chat produces a task description as a **downloadable markdown file** — created with `create_file` and presented with `present_files`, not pasted inline.

**Task description format:**

```markdown
## Reprompt - feature/[name]

This is the **feature implementation** chat for Reprompt.

**Project:** Chrome + Firefox extension (monorepo). Shared source in src/, browser-specific manifests in chrome/ and firefox/. Build scripts in scripts/. No build step needed for Chrome dev — load unpacked from build/chrome/ after running npm run build:chrome.

**Workflow rules:** `.agent/claude_workflow.md` (in uploaded files — read it first).

**What this chat does:**
- Feature chat: Implement the task description below. Stay within uploaded files only.

**Uploaded files are the source of truth.** Do not guess at code you haven't seen. If you need a file not uploaded, ask for exactly that one file.

---

## Task: [Brief title]

**Branch Name:** feature/[name] or bugfix/[name]
**Parent Branch:** release/v0.X.0 or main

### Context
Background and why this is needed

### Requirements
- [ ] Specific requirement 1
- [ ] Specific requirement 2
```

**Filename convention:** `task-feature-[name].md` or `task-bugfix-[name].md`

### Step 2: Files to Upload

**Always include:**
1. `CHANGELOG.md`
2. `README.md` (if updating user-facing docs)

**Source files being modified:**
3. Relevant `src/*.js` files
4. `src/styles.css` (if UI changes)

**Manifests (only if changing metadata/version):**
5. `chrome/manifest.json`
6. `firefox/manifest.json`
7. `package.json` (only if changing version)

**Example:**
```
Files to upload:
1. CHANGELOG.md
2. src/content.js
3. src/utils/dom.js
```

### Step 3: Package as Zip

```powershell
cd "C:\Users\slanger\Documents\Git\reprompt"
Compress-Archive -Path CHANGELOG.md, src/content.js, src/utils/dom.js -DestinationPath task_selector_fallback_files.zip -Force
```

**Rules:**
- Always `cd` to repo root first
- Zip filename describes the task
- File paths are repo-relative
- Never include `build/`, `node_modules/`, or `.gitignore`d files

### Step 4: Work Within Provided Context

- Make changes **only** to the files provided
- If a missing file is needed, pause and request exactly that file
- Do not guess at unseen code

### Step 5: Deliver Results

Claude must respond with:

```
## Summary
Brief description of what changed

## Files Ready for Commit
- src/content.js
- src/utils/dom.js
- CHANGELOG.md

## Commit Message
fix: add selector fallbacks for textarea detection

- Try 5 selectors in priority order before giving up
- Added contenteditable support as final fallback
- Prevents tray from silently failing after ChatGPT DOM updates

## Git Commit Command
```bash
git commit -m "fix: add selector fallbacks for textarea detection

- Try 5 selectors in priority order before giving up
- Added contenteditable support as final fallback
- Prevents tray from silently failing after ChatGPT DOM updates"
```

## Testing
1. npm run build:chrome
2. chrome://extensions → Developer Mode → Load unpacked → select build/chrome/
3. Navigate to chat.openai.com or chatgpt.com
4. [Specific test steps]
5. Check DevTools console for [Reprompt] logs

## Documentation Updated
- CHANGELOG.md: Added to v0.1.0 section
```

---

## Version Control Integration

- Features are added to the **current version** section in CHANGELOG.md and README.md
- Do NOT create new version entries unless user says "release new version"
- Keep both manifests and package.json in sync on version bumps

---

## Browser Extension Testing Workflow

### Chrome
1. `npm run build:chrome`
2. Go to `chrome://extensions`
3. Enable Developer Mode
4. Click **Load unpacked** → select `build/chrome/`
5. If already loaded, click the ↻ reload icon
6. Navigate to `chat.openai.com` or `chatgpt.com`
7. Open DevTools → Console → filter for `[Reprompt]`

### Firefox
1. `npm run build:firefox`
2. Go to `about:debugging`
3. Click **This Firefox** → **Load Temporary Add-on**
4. Select `build/firefox/manifest.json`
5. Navigate to `chat.openai.com` or `chatgpt.com`

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

**Key rule:** Always present source files from `src/`, `chrome/`, `firefox/` — **never from `build/`**.

---

## Feature Chat Handoff Back to Release Chat

```markdown
## Completed: feature/selector-fallback

**What changed:**
- Added 5-selector fallback chain for textarea detection
- Added contenteditable support
- Tray now survives ChatGPT DOM updates more reliably

**Tested:**
- Chrome: npm run build:chrome → loaded unpacked → verified tray appears
- No console errors

**Files committed:**
- src/utils/dom.js
- CHANGELOG.md

**Status:** Ready to merge into release/v0.1.0
```

---

## Chat Intro Block

```markdown
## Reprompt - [release/v0.1.0 | feature/selector-fallback]

This is the **[release orchestration | feature implementation]** chat for Reprompt.

**Project:** Chrome + Firefox extension (monorepo). Shared source in src/, browser-specific manifests in chrome/ and firefox/. Build scripts in scripts/.

**Workflow rules:** `.agent/claude_workflow.md` (in uploaded files — read it first).

**What this chat does:**
- [Release chat: Define scope, produce task descriptions and file lists. No implementation.]
- [Feature chat: Implement the task description below. Stay within uploaded files only.]

**Uploaded files are the source of truth.** Do not guess at code you haven't seen. If you need a file not uploaded, ask for exactly that one file.
```

---

## Line Ending Handling

**When READING uploaded files:**
```bash
dos2unix <filename> 2>/dev/null || sed -i 's/\r$//' <filename>
```

**When PRESENTING files back:**
```bash
unix2dos <filename> 2>/dev/null || sed -i 's/$/\r/' <filename>
```

**Git-tracked files:** `src/*.js`, `src/utils/*.js`, `src/styles.css`, `chrome/manifest.json`, `firefox/manifest.json`, `scripts/*.js`, `package.json`, `*.md`

**Not tracked (skip conversion):** `build/` contents

---

## Known Pitfalls

### ChatGPT DOM Changes
OpenAI updates ChatGPT without warning. If the tray stops appearing, check the textarea selector in `src/utils/dom.js` first.

### React Synthetic Events
Direct `.value =` on ChatGPT's textarea is silently ignored by React. Always use the native value setter override in `src/utils/dom.js`.

### Firefox chrome.* → browser.* Transform
The build script handles this automatically. Never manually write `browser.*` in src/ files — always use `chrome.*` and let the build script transform it for Firefox.

### Flat Zip Extraction
Check your zip structure:
```powershell
& "C:\Program Files\Git\usr\bin\unzip.exe" -l task_files.zip
```
You should see `src/utils/dom.js`, not just `dom.js`.

### Missing Task Description
Always paste both the chat intro block AND the task description together at the start of a feature/bugfix chat.

---

## Standard Prompts

### Starting a Task
"Let's keep this compaction-proof. Tell me the task in one sentence, then give me the exact 'Files to upload' list."

### After Files Uploaded
"Got them. Staying inside these files only. If I need anything else, I'll ask for that specific file."

### If User Uploads Full Zip
"Let's not do the full zip — it can cause compaction. Instead, upload only these files: ..."

---

## Why This Exists

Large zips and long chats trigger compaction and cause Claude to lose file-level detail.

This workflow keeps context small and explicit:
- Small, focused feature chats
- Minimal file uploads (only what changes)
- Clear handoff points between chats
- Explicit testing and documentation per task
