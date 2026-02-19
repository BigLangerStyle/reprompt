// content.js — Reprompt main content script
//
// Responsibilities:
//   - Detect ChatGPT textarea
//   - Inject the Reprompt tray above the composer
//   - Monitor DOM for re-renders (MutationObserver)
//   - Run heuristic detection and render buttons
//   - Handle insert logic, keyboard shortcuts, collapse behavior

// ─── Constants ───────────────────────────────────────────────────────────────

const TRAY_ID        = "reprompt-tray";
const MAX_BUTTONS    = 6;
const INJECT_DELAY   = 600;   // ms — debounce for MutationObserver
const OBSERVER_ROOT  = document.body;

// ─── State ───────────────────────────────────────────────────────────────────

let currentPack      = "default";
let isCollapsed      = true;
let injectDebounce   = null;
let removingTray     = false;  // prevents observer from reacting to our own tray removal

// ─── Tray Injection ──────────────────────────────────────────────────────────

/**
 * Main entry point. Find the textarea, build the tray, insert it.
 * Safe to call multiple times — checks for existing tray first.
 */
async function injectTray() {
  // Don't inject if tray already exists and is still in DOM
  if (document.getElementById(TRAY_ID)) return;

  const textarea = findTextarea();
  if (!textarea) return;

  const wrapper = findComposerWrapper(textarea);
  if (!wrapper) return;

  // Determine pack from context
  const assistantText = getLastAssistantMessage();
  const userInput     = textarea.value || textarea.innerText || "";
  currentPack         = detectMode(assistantText, userInput);

  // Persist last pack
  await saveLastPack(currentPack);

  // Build and insert tray
  const tray = await buildTray(currentPack);
  wrapper.insertBefore(tray, wrapper.firstChild);

  // Attach textarea focus listener to expand tray
  textarea.addEventListener("focus", () => expandTray(), { passive: true });
}

/**
 * Build the full tray DOM element.
 * @param {string} packName
 * @returns {Promise<HTMLElement>}
 */
async function buildTray(packName) {
  const usageCounts = await getUsageCounts();
  const pinned      = await getPinned();
  const templates   = sortTemplates(
    TEMPLATE_PACKS[packName] || TEMPLATE_PACKS.default,
    usageCounts,
    pinned
  ).slice(0, MAX_BUTTONS);

  const tray = document.createElement("div");
  tray.id = TRAY_ID;
  tray.className = "reprompt-tray reprompt-collapsed";
  tray.setAttribute("role", "toolbar");
  tray.setAttribute("aria-label", "Reprompt quick replies");

  // Pill (collapsed state)
  const pill = document.createElement("button");
  pill.className = "reprompt-pill";
  pill.textContent = "⚡ Reprompt";
  pill.setAttribute("aria-expanded", "false");
  pill.addEventListener("click", toggleTray);

  // Button row (expanded state)
  const row = document.createElement("div");
  row.className = "reprompt-row";
  row.setAttribute("role", "list");

  templates.forEach((tmpl, idx) => {
    const btn = buildButton(tmpl, idx + 1, pinned.includes(tmpl.id));
    row.appendChild(btn);
  });

  tray.appendChild(pill);
  tray.appendChild(row);

  // Keyboard handler (Alt+1..6 to activate buttons, Esc to collapse)
  document.addEventListener("keydown", handleKeyDown, { passive: false });

  return tray;
}

/**
 * Build a single reply button.
 * @param {Object} tmpl - { id, label, text }
 * @param {number} index - 1-based keyboard index
 * @param {boolean} isPinned
 * @returns {HTMLElement}
 */
function buildButton(tmpl, index, isPinned) {
  const btn = document.createElement("button");
  btn.className = "reprompt-btn" + (isPinned ? " reprompt-pinned" : "");
  btn.dataset.templateId = tmpl.id;
  btn.dataset.templateText = tmpl.text;
  btn.textContent = tmpl.label;
  btn.setAttribute("role", "listitem");
  btn.title = `Alt+${index}: ${tmpl.text}`;

  btn.addEventListener("click", (e) => {
    handleButtonClick(tmpl, e.shiftKey);
  });

  return btn;
}

// ─── Interaction Handlers ─────────────────────────────────────────────────────

/**
 * Handle a reply button click.
 * @param {Object} tmpl - { id, label, text }
 * @param {boolean} sendImmediately - true if Shift was held
 */
async function handleButtonClick(tmpl, sendImmediately = false) {
  const textarea = findTextarea();
  if (!textarea) return;

  insertText(textarea, tmpl.text);
  await recordUsage(tmpl.id);

  if (sendImmediately) {
    // Small delay to let React process the input event before clicking send
    setTimeout(() => clickSend(), 80);
  }

  collapseTray();
}

/**
 * Handle Alt+1..6 keyboard shortcuts and Esc.
 * @param {KeyboardEvent} e
 */
function handleKeyDown(e) {
  const tray = document.getElementById(TRAY_ID);
  if (!tray) return;

  // Esc — collapse
  if (e.key === "Escape" && !isCollapsed) {
    collapseTray();
    return;
  }

  // Alt+1..6 — activate buttons
  if (e.altKey && e.key >= "1" && e.key <= "6") {
    const index = parseInt(e.key, 10) - 1;
    const buttons = tray.querySelectorAll(".reprompt-btn");
    if (buttons[index]) {
      e.preventDefault();
      handleButtonClick(
        {
          id:   buttons[index].dataset.templateId,
          text: buttons[index].dataset.templateText
        },
        e.shiftKey
      );
    }
  }
}

// ─── Collapse / Expand ────────────────────────────────────────────────────────

function expandTray() {
  const tray = document.getElementById(TRAY_ID);
  if (!tray || !isCollapsed) return;
  isCollapsed = false;
  tray.classList.remove("reprompt-collapsed");
  tray.classList.add("reprompt-expanded");
  const pill = tray.querySelector(".reprompt-pill");
  if (pill) pill.setAttribute("aria-expanded", "true");
}

function collapseTray() {
  const tray = document.getElementById(TRAY_ID);
  if (!tray || isCollapsed) return;
  isCollapsed = true;
  tray.classList.remove("reprompt-expanded");
  tray.classList.add("reprompt-collapsed");
  const pill = tray.querySelector(".reprompt-pill");
  if (pill) pill.setAttribute("aria-expanded", "false");
}

function toggleTray() {
  isCollapsed ? expandTray() : collapseTray();
}

// ─── MutationObserver ─────────────────────────────────────────────────────────

/**
 * Watch for DOM changes and re-inject tray if it gets removed,
 * or refresh it when a new assistant message appears.
 */
function startObserver() {
  const observer = new MutationObserver((mutations) => {
    // Ignore mutations we caused ourselves (tray insert/remove)
    const selfMutation = mutations.every((m) =>
      Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).every((n) => {
        if (n.nodeType !== 1) return true;
        return n.id === TRAY_ID || n.closest?.(`#${TRAY_ID}`) !== null;
      })
    );
    if (selfMutation) return;

    // Check if tray was removed by ChatGPT (not by us)
    const trayGone = !removingTray && !document.getElementById(TRAY_ID);

    // Check if a new assistant message appeared
    const newAssistantMessage = mutations.some((m) =>
      Array.from(m.addedNodes).some((n) => {
        if (n.nodeType !== 1) return false;
        return (
          n.matches?.("[data-message-author-role='assistant']") ||
          n.querySelector?.("[data-message-author-role='assistant']")
        );
      })
    );

    if (trayGone || newAssistantMessage) {
      // Debounce to avoid spamming inject on rapid DOM changes
      clearTimeout(injectDebounce);
      injectDebounce = setTimeout(() => {
        // Remove stale tray, flagging so observer ignores this removal
        removingTray = true;
        document.getElementById(TRAY_ID)?.remove();
        removingTray = false;
        isCollapsed = true;
        injectTray();
      }, INJECT_DELAY);
    }
  });

  observer.observe(OBSERVER_ROOT, {
    childList: true,
    subtree:   true
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

(function init() {
  // Initial inject with a short delay to let ChatGPT's React app mount
  setTimeout(() => {
    injectTray();
    startObserver();
  }, 1200);
})();
