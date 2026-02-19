// templates.js — Reprompt template packs
// Each pack is selected by the heuristic engine based on conversation context.
// Each template: { id, label, text }

const TEMPLATE_PACKS = {
  general: [
    { id: "elaborate",   label: "Elaborate",          text: "Can you elaborate on that?" },
    { id: "simplify",    label: "Simplify",            text: "Can you explain that more simply?" },
    { id: "examples",    label: "Give examples",       text: "Can you give me some concrete examples?" },
    { id: "summarize",   label: "Summarize",           text: "Can you give me a brief summary of your response?" },
    { id: "continue",    label: "Continue",            text: "Please continue." },
    { id: "rephrase",    label: "Rephrase",            text: "Can you rephrase that in different words?" }
  ],

  coding: [
    { id: "explain_code",  label: "Explain this",       text: "Can you walk me through how this code works?" },
    { id: "add_comments",  label: "Add comments",        text: "Can you add clear comments to this code?" },
    { id: "find_bugs",     label: "Find bugs",           text: "Can you identify any bugs or issues in this code?" },
    { id: "optimize",      label: "Optimize",            text: "Can you optimize this for performance?" },
    { id: "write_tests",   label: "Write tests",         text: "Can you write unit tests for this?" },
    { id: "refactor",      label: "Refactor",            text: "Can you refactor this to be cleaner and more maintainable?" }
  ],

  docs: [
    { id: "step_by_step",  label: "Step by step",        text: "Can you break this down into step-by-step instructions?" },
    { id: "add_examples",  label: "Add examples",        text: "Can you add examples to make this clearer?" },
    { id: "tldr",          label: "TL;DR",               text: "Can you give me a TL;DR version?" },
    { id: "format_md",     label: "Format as Markdown",  text: "Can you format this as clean Markdown?" },
    { id: "table",         label: "Make a table",        text: "Can you present this information as a table?" },
    { id: "checklist",     label: "Make a checklist",    text: "Can you turn this into a checklist?" }
  ],

  decision: [
    { id: "pros_cons",     label: "Pros & cons",         text: "Can you give me a pros and cons breakdown?" },
    { id: "recommend",     label: "Recommend one",       text: "Which option would you recommend, and why?" },
    { id: "tradeoffs",     label: "Tradeoffs",           text: "What are the key tradeoffs I should consider?" },
    { id: "risks",         label: "Risks",               text: "What are the main risks of each option?" },
    { id: "compare",       label: "Compare them",        text: "Can you compare these side by side?" },
    { id: "decide",        label: "Help me decide",      text: "Based on what you know, what would you do in my position?" }
  ],

  editing: [
    { id: "shorten",       label: "Make it shorter",     text: "Can you make this more concise?" },
    { id: "lengthen",      label: "Expand this",         text: "Can you expand on this with more detail?" },
    { id: "fix_grammar",   label: "Fix grammar",         text: "Can you fix any grammar or spelling issues?" },
    { id: "tone_formal",   label: "More formal",         text: "Can you rewrite this in a more formal tone?" },
    { id: "tone_casual",   label: "More casual",         text: "Can you rewrite this in a more casual, conversational tone?" },
    { id: "improve",       label: "Improve writing",     text: "Can you improve the overall clarity and flow of this?" }
  ]
};
