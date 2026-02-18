// background.js — Reprompt background service worker
//
// Minimal: no LLM calls, no network requests.
// Handles extension lifecycle and storage management only.

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[Reprompt] Installed v0.1.0");
  } else if (details.reason === "update") {
    console.log(`[Reprompt] Updated to v0.1.0`);
  }
});
