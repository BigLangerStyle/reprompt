// scripts/build-firefox.js
// Copies src/ files into build/firefox/, injects firefox manifest,
// and converts chrome.* API calls to browser.* for MV2 compatibility.

const fs   = require("fs");
const path = require("path");

const SRC      = path.join(__dirname, "..", "src");
const ICONS    = path.join(__dirname, "..", "icons");
const MANIFEST = path.join(__dirname, "..", "firefox", "manifest.json");
const DEST     = path.join(__dirname, "..", "build", "firefox");

function copyDir(src, dest, transform) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, transform);
    } else if (transform && entry.name.endsWith(".js")) {
      let content = fs.readFileSync(srcPath, "utf8");
      content = transform(content);
      fs.writeFileSync(destPath, content, "utf8");
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Replace chrome.* with browser.* for Firefox MV2 compatibility
function chromeToFirefox(content) {
  return content.replace(/\bchrome\./g, "browser.");
}

// Clean and recreate dest
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });

// Copy source files with chrome → browser transform
copyDir(SRC, DEST, chromeToFirefox);

// Copy icons (no transform needed)
copyDir(ICONS, path.join(DEST, "icons"));

// Copy manifest
fs.copyFileSync(MANIFEST, path.join(DEST, "manifest.json"));

console.log("✅ Firefox build complete → build/firefox/");
