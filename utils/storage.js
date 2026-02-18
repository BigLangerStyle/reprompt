// utils/storage.js — Reprompt persistence layer
//
// Wraps chrome.storage.local with async helpers.
// Tracks: usage counts per template, pinned templates, last used pack.

const STORAGE_KEYS = {
  USAGE_COUNTS: "reprompt_usage_counts",
  PINNED:       "reprompt_pinned",
  LAST_PACK:    "reprompt_last_pack"
};

/**
 * Increment the usage count for a given template id.
 * @param {string} templateId
 */
async function recordUsage(templateId) {
  const result = await chrome.storage.local.get(STORAGE_KEYS.USAGE_COUNTS);
  const counts = result[STORAGE_KEYS.USAGE_COUNTS] || {};
  counts[templateId] = (counts[templateId] || 0) + 1;
  await chrome.storage.local.set({ [STORAGE_KEYS.USAGE_COUNTS]: counts });
}

/**
 * Get usage counts for all templates.
 * @returns {Promise<Object>} { templateId: count }
 */
async function getUsageCounts() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.USAGE_COUNTS);
  return result[STORAGE_KEYS.USAGE_COUNTS] || {};
}

/**
 * Get pinned template ids.
 * @returns {Promise<string[]>}
 */
async function getPinned() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.PINNED);
  return result[STORAGE_KEYS.PINNED] || [];
}

/**
 * Toggle pin state for a template id.
 * @param {string} templateId
 */
async function togglePin(templateId) {
  const pinned = await getPinned();
  const idx = pinned.indexOf(templateId);
  if (idx === -1) {
    pinned.push(templateId);
  } else {
    pinned.splice(idx, 1);
  }
  await chrome.storage.local.set({ [STORAGE_KEYS.PINNED]: pinned });
}

/**
 * Save the last used pack name.
 * @param {string} packName
 */
async function saveLastPack(packName) {
  await chrome.storage.local.set({ [STORAGE_KEYS.LAST_PACK]: packName });
}

/**
 * Get the last used pack name.
 * @returns {Promise<string|null>}
 */
async function getLastPack() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.LAST_PACK);
  return result[STORAGE_KEYS.LAST_PACK] || null;
}

/**
 * Sort templates within a pack by usage count (descending), with pinned first.
 * @param {Object[]} templates - Array of template objects from TEMPLATE_PACKS
 * @param {Object} usageCounts - { templateId: count }
 * @param {string[]} pinned - Array of pinned template ids
 * @returns {Object[]} Sorted templates
 */
function sortTemplates(templates, usageCounts, pinned) {
  return [...templates].sort((a, b) => {
    const aPinned = pinned.includes(a.id) ? 1 : 0;
    const bPinned = pinned.includes(b.id) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0);
  });
}
