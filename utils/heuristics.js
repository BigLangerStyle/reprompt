// utils/heuristics.js — Reprompt heuristic scoring engine
//
// Philosophy: high-confidence signals only. Better to show the general pack
// than to show the wrong specialized pack. Each pack has a score threshold
// that must be met before it wins. If nothing clears the threshold, fall
// back to "general".
//
// Scoring model:
//   1. Extract last assistant message + current user input
//   2. Normalize and tokenize
//   3. Score each pack by keyword hits (weighted)
//   4. Return the pack name with the highest score above MIN_SCORE_THRESHOLD
//   5. Ties broken by pack priority order

const MIN_SCORE_THRESHOLD = 2;

// Keywords and their weights per pack.
// Higher weight = stronger signal.
const PACK_SIGNALS = {
  coding: {
    weight: 2,
    keywords: [
      "```", "function", "const ", "let ", "var ", "return ", "class ",
      "import ", "export ", "async ", "await ", "error", "bug", "debug",
      "syntax", "compile", "runtime", "null", "undefined", "exception",
      "array", "object", "string", "boolean", "integer", "loop", "iterate",
      "algorithm", "refactor", "test", "unittest", "jest", "mocha",
      "python", "javascript", "typescript", "java", "rust", "golang",
      "html", "css", "sql", "bash", "shell", "git", "npm", "api",
      "endpoint", "request", "response", "http", "json", "xml"
    ]
  },

  docs: {
    weight: 2,
    keywords: [
      "step", "steps", "how to", "instructions", "guide", "tutorial",
      "documentation", "readme", "setup", "install", "configure",
      "process", "procedure", "workflow", "walkthrough", "explain how",
      "markdown", "format", "document", "checklist", "list of"
    ]
  },

  decision: {
    weight: 2,
    keywords: [
      "should i", "which", "better", "best", "choose", "choice",
      "option", "options", "recommend", "recommendation", "pros",
      "cons", "tradeoff", "trade-off", "versus", " vs ", "compare",
      "comparison", "decide", "decision", "worth it", "or should"
    ]
  },

  editing: {
    weight: 2,
    keywords: [
      "rewrite", "rephrase", "grammar", "spelling", "tone", "formal",
      "casual", "concise", "shorten", "expand", "improve", "edit",
      "proofread", "polish", "clearer", "clarity", "wording", "sentence",
      "paragraph", "essay", "email", "message", "draft", "copy"
    ]
  }
};

/**
 * Normalize text for keyword matching.
 * Lowercases and trims, preserving spaces so phrase matching works.
 * @param {string} text
 * @returns {string}
 */
function normalize(text) {
  return (text || "").toLowerCase().trim();
}

/**
 * Score a single pack against the given normalized text.
 * Returns the total weighted score.
 * @param {Object} packSignal - { weight, keywords }
 * @param {string} text - normalized combined context
 * @returns {number}
 */
function scorepack(packSignal, text) {
  let score = 0;
  for (const keyword of packSignal.keywords) {
    if (text.includes(keyword)) {
      score += packSignal.weight;
    }
  }
  return score;
}

/**
 * Select the best template pack based on conversation context.
 *
 * @param {string} assistantMessage - Last assistant message text
 * @param {string} userInput - Current user input (may be empty)
 * @returns {string} Pack name — one of: general, coding, docs, decision, editing
 */
function selectPack(assistantMessage, userInput) {
  const combined = normalize(assistantMessage + " " + userInput);

  let bestPack = "general";
  let bestScore = MIN_SCORE_THRESHOLD - 1; // must beat threshold to win

  // Priority order: coding > decision > docs > editing
  // (coding signals are most distinctive; editing is most generic)
  const priority = ["coding", "decision", "docs", "editing"];

  for (const packName of priority) {
    const score = scorepack(PACK_SIGNALS[packName], combined);
    if (score > bestScore) {
      bestScore = score;
      bestPack = packName;
    }
  }

  return bestPack;
}
