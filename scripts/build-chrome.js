// scripts/build-chrome.js
// Copies src/ files into build/chrome/, injects chrome manifest.

const fs   = require("fs");
const path = require("path");

const SRC     = path.join(__dirname, "..", "src");
const ICONS   = path.join(__dirname, "..", "icons");
const MANIFEST = path.join(__dirname, "..", "chrome", "manifest.json");
const DEST    = path.join(__dirname, "..", "build", "chrome");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and recreate dest
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });

// Copy source files
copyDir(SRC, DEST);

// Copy icons
copyDir(ICONS, path.join(DEST, "icons"));

// Copy manifest
fs.copyFileSync(MANIFEST, path.join(DEST, "manifest.json"));

console.log("✅ Chrome build complete → build/chrome/");
