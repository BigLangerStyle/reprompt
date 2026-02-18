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
   - How to test (load extension in Chrome)
   - Any doc updates required

---

## Full File Return Rule (Non-Negotiable)

If Claude modifies a file in any way:

- Claude **MUST** return the complete, final version of that file
- Claude **MUST NOT** provide diffs, snippets, or partial edits
- Claude **MUST NOT** ask the user to manually apply changes

This applies to all source files, `manifest.json`, and all markdown docs.

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

**Project:** Chrome extension (Manifest V3) that injects a heuristic-driven quick reply tray above the ChatGPT composer. No LLM calls, no external network — fully local. No build step; load unpacked from repo root.

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
1. `PROJECT_LEDGER.md`
2. `CHANGELOG.md`
3. `README.md` (if updating user-facing docs)

**Source files being modified:**
4. Relevant `.js` files
5. `styles.css` (if UI changes)
6. `manifest.json` (only if changing metadata/version)

**Example:**
```
Files to upload:
1. PROJECT_LEDGER.md
2. CHANGELOG.md
3. content.js
4. utils/dom.js
```

### Step 3: Package as Zip

```powershell
cd "C:\Users\<you>\Documents\Git\reprompt"
Compress-Archive -Path PROJECT_LEDGER.md, CHANGELOG.md, content.js, utils/dom.js -DestinationPath task_selector_fallback_files.zip -Force
```

**Rules:**
- Always `cd` to repo root first
- Zip filename describes the task
- File paths are repo-relative
- Never include `.gitignore`d files

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
- content.js
- utils/dom.js
- CHANGELOG.md
- PROJECT_LEDGER.md

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
1. Load unpacked: chrome://extensions → Developer Mode → Load unpacked → select repo root
2. Navigate to chat.openai.com or chatgpt.com
3. [Specific test steps]
4. Check DevTools console for [Reprompt] logs

## Documentation Updated
- CHANGELOG.md: Added to v0.1.0 section
- PROJECT_LEDGER.md: Marked as complete
```

---

## Version Control Integration

- Features are added to the **current version** section
- Do NOT create new version entries unless user says "release new version"
- Keep `manifest.json` and `PROJECT_LEDGER.md` in sync

---

## Chrome Extension Testing Workflow

1. Edit source files
2. Go to `chrome://extensions`
3. Enable Developer Mode
4. Click **Load unpacked** → select repo root (where `manifest.json` is)
5. If already loaded, click the ↻ reload icon on the Reprompt card
6. Navigate to `chat.openai.com` or `chatgpt.com`
7. Open DevTools → Console → filter for `[Reprompt]`
8. Test the feature
9. Commit changes

**No build step needed** — source files load directly.

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

## Feature Chat Handoff Back to Release Chat

```markdown
## Completed: feature/selector-fallback

**What changed:**
- Added 5-selector fallback chain for textarea detection
- Added contenteditable support
- Tray now survives ChatGPT DOM updates more reliably

**Tested in Chrome:**
- Loaded unpacked from repo root
- Verified tray appears on both chat.openai.com and chatgpt.com
- No console errors

**Files committed:**
- utils/dom.js
- CHANGELOG.md
- PROJECT_LEDGER.md

**Status:** Ready to merge into release/v0.1.0
```

---

## Chat Intro Block

```markdown
## Reprompt - [release/v0.1.0 | feature/selector-fallback]

This is the **[release orchestration | feature implementation]** chat for Reprompt.

**Project:** Chrome extension (Manifest V3) that injects a heuristic-driven quick reply tray above the ChatGPT composer. No LLM calls, no external network — fully local. No build step; load unpacked from repo root.

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

**Git-tracked files:**
- `manifest.json`, `*.js`, `styles.css`, `*.md`

---

## Known Pitfalls

### ChatGPT DOM Changes
OpenAI updates ChatGPT without warning. If the tray stops appearing, check whether the textarea selector still matches. `utils/dom.js` uses a fallback chain — update it first when this happens.

### React Synthetic Events
Direct `.value =` on ChatGPT's textarea is silently ignored by React. Always use the native value setter override in `utils/dom.js`. Do not bypass it.

### Flat Zip Extraction
Check your zip structure:
```powershell
& "C:\Program Files\Git\usr\bin\unzip.exe" -l task_files.zip
```
You should see `utils/dom.js`, not just `dom.js`. If flat, mention it when uploading.

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
