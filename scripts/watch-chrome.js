// scripts/watch-chrome.js
// Watches src/, chrome/, and icons/ for changes and rebuilds Chrome on save.
// Chrome doesn't support auto-reload like web-ext, so after a rebuild you
// still need to click the ↻ reload icon in chrome://extensions.

const chokidar = require("chokidar");
const { execSync } = require("child_process");

const WATCH_PATHS = ["src", "chrome", "icons"];

console.log("👀 Watching for changes (Chrome)...");
console.log("   After each rebuild, click ↻ in chrome://extensions to reload.\n");

// Initial build
runBuild();

chokidar
  .watch(WATCH_PATHS, {
    ignoreInitial: true,
    ignored: /(^|[/\\])\../  // ignore dotfiles
  })
  .on("all", (event, filePath) => {
    console.log(`[${timestamp()}] ${event}: ${filePath}`);
    runBuild();
  });

function runBuild() {
  try {
    execSync("node scripts/build-chrome.js", { stdio: "inherit" });
  } catch (e) {
    console.error("❌ Build failed:", e.message);
  }
}

function timestamp() {
  return new Date().toLocaleTimeString();
}
