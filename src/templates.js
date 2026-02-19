// templates.js — Reprompt template packs
// Four packs mapped to detected modes: code, long, typing, default.
// Each template: { id, label, text }

const TEMPLATE_PACKS = {
  code: [
    { id: "code_comments",    label: "Add comments",        text: "Add inline comments to explain this code" },
    { id: "code_tests",       label: "Write unit tests",    text: "Write unit tests for this" },
    { id: "code_refactor",    label: "Refactor it",         text: "Refactor for readability" },
    { id: "code_explain",     label: "Explain simply",      text: "Explain this to a non-technical person" },
    { id: "code_risks",       label: "What could go wrong", text: "What could go wrong with this approach?" },
    { id: "code_alternative", label: "Alternative impl",    text: "Show me an alternative implementation" }
  ],

  long: [
    { id: "long_bullets",   label: "3 bullet summary",  text: "Summarize this in 3 bullet points" },
    { id: "long_concise",   label: "Make concise",      text: "Make this more concise" },
    { id: "long_takeaway",  label: "Key takeaway",      text: "What's the single most important takeaway?" },
    { id: "long_table",     label: "As a table",        text: "Format this as a table" },
    { id: "long_headers",   label: "Add sections",      text: "Break this into sections with headers" },
    { id: "long_tldr",      label: "TL;DR",             text: "Give me the TL;DR" }
  ],

  typing: [
    { id: "typing_clarity",   label: "Improve clarity",   text: "Improve the clarity of what I've written" },
    { id: "typing_assertive", label: "More assertive",     text: "Make this more assertive" },
    { id: "typing_soften",    label: "Soften the tone",    text: "Soften the tone of this" },
    { id: "typing_expand",    label: "Expand on this",     text: "Expand on this idea" },
    { id: "typing_gaps",      label: "Check for gaps",     text: "Check this for logical gaps" },
    { id: "typing_concise",   label: "Make concise",       text: "Make this more concise" }
  ],

  default: [
    { id: "default_perspectives",  label: "3 perspectives",     text: "Give me three different perspectives on this" },
    { id: "default_counterargs",   label: "Counterarguments",   text: "What are the strongest counterarguments?" },
    { id: "default_missing",       label: "What am I missing",  text: "What am I not considering?" },
    { id: "default_tradeoffs",     label: "Compare tradeoffs",  text: "Compare the tradeoffs" },
    { id: "default_decide",        label: "Help me decide",     text: "Help me decide between my options" },
    { id: "default_pushback",      label: "Push back",          text: "Push back on my thinking" }
  ]
};
