// utils/heuristics.js — Reprompt mode detection engine
//
// Philosophy: deterministic, signal-based mode selection. No NLP, no scoring,
// no LLM calls. Four stable structural signals determine which pack to show.
//
// Mode detection priority order:
//   1. Code Mode     — assistantText contains ``` or <code>
//   2. Long Mode     — assistantText word count > 250
//   3. Typing Mode   — textareaValue has content
//   4. Default Mode  — fallback

/**
 * Detect the current interaction mode based on conversation context.
 *
 * @param {string} assistantText  - Last assistant message text (may be empty)
 * @param {string} textareaValue  - Current textarea contents (may be empty)
 * @returns {"code"|"long"|"typing"|"default"}
 */
function detectMode(assistantText, textareaValue) {
  const text = assistantText || "";

  // Signal 1: contains a code block
  const containsCodeBlock = text.includes("```") || text.includes("<code>");

  // Signal 2: long response (word count)
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // Signal 3: user is actively typing
  const textareaHasText = (textareaValue || "").trim().length > 0;

  // Priority branching — first match wins
  if (containsCodeBlock)  return "code";
  if (wordCount > 250)    return "long";
  if (textareaHasText)    return "typing";
  return "default";
}
