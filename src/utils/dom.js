// utils/dom.js — Reprompt DOM utilities
//
// ChatGPT's composer is a React-controlled textarea (or contenteditable div).
// Direct .value assignment is ignored by React — we must use the native
// value setter and dispatch a synthetic input event for React to pick it up.

/**
 * Find the ChatGPT composer textarea using multiple fallback selectors.
 * ChatGPT's DOM changes frequently; we try selectors in order of specificity.
 * @returns {HTMLElement|null}
 */
function findTextarea() {
  const selectors = [
    "textarea#prompt-textarea",
    "textarea[data-id='prompt-textarea']",
    "textarea[placeholder]",
    "div[contenteditable='true'][data-id='prompt-textarea']",
    "div[contenteditable='true']"
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }

  return null;
}

/**
 * Find the composer's wrapper element — the container we inject the tray into.
 * We look for a form or a parent of the textarea with enough width.
 * @param {HTMLElement} textarea
 * @returns {HTMLElement|null}
 */
function findComposerWrapper(textarea) {
  if (!textarea) return null;

  // Walk up to find a form or a wide-enough container
  let el = textarea.parentElement;
  for (let i = 0; i < 8; i++) {
    if (!el) break;
    const tag = el.tagName.toLowerCase();
    const width = el.getBoundingClientRect().width;
    if ((tag === "form" || width > 400) && el !== document.body) {
      return el;
    }
    el = el.parentElement;
  }

  return textarea.parentElement;
}

/**
 * Insert text into a React-controlled textarea or contenteditable.
 * Uses the native value setter override to bypass React's synthetic event system.
 *
 * @param {HTMLElement} el - The textarea or contenteditable element
 * @param {string} text - Text to insert
 */
function insertText(el, text) {
  if (!el) return;

  if (el.tagName.toLowerCase() === "textarea") {
    // React controlled input: override via native setter
    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value"
    ).set;
    nativeSetter.call(el, text);
  } else if (el.isContentEditable) {
    el.focus();
    // For contenteditable, use execCommand as fallback
    document.execCommand("selectAll", false, null);
    document.execCommand("insertText", false, text);
    return; // execCommand dispatches its own events
  }

  // Dispatch native input event so React updates its state
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.focus();
}

/**
 * Find and click the send button safely.
 * Only clicks if enabled — never forces a disabled send.
 * @returns {boolean} Whether the send was attempted
 */
function clickSend() {
  const selectors = [
    "button[data-testid='send-button']",
    "button[aria-label='Send message']",
    "button[aria-label='Send prompt']",
    "form button[type='submit']"
  ];

  for (const selector of selectors) {
    const btn = document.querySelector(selector);
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
  }

  return false;
}

/**
 * Get the last assistant message text from the conversation.
 * Returns empty string if none found.
 * @returns {string}
 */
function getLastAssistantMessage() {
  const selectors = [
    "[data-message-author-role='assistant']",
    ".agent-turn",
    "[class*='assistant']"
  ];

  for (const selector of selectors) {
    const messages = document.querySelectorAll(selector);
    if (messages.length > 0) {
      return messages[messages.length - 1].innerText || "";
    }
  }

  return "";
}
