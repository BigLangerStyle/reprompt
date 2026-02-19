// scripts/watch-firefox.js
// Watches src/, firefox/, and icons/ for changes, rebuilds Firefox on save,
// and uses web-ext to auto-reload the extension in a live Firefox window.
//
// Usage: npm run dev:firefox
// Requires: web-ext installed (npm install)

const chokidar  = require("chokidar");
const { execSync, spawn } = require("child_process");
const path      = require("path");

const WATCH_PATHS  = ["src", "firefox", "icons"];
const BUILD_DIR    = path.join(__dirname, "..", "build", "firefox");

console.log("🦊 Starting Firefox dev mode...\n");

// Initial build before launching web-ext
runBuild();

// Launch web-ext in the background — it manages the Firefox window
const webExt = spawn(
  "npx",
  ["web-ext", "run", `--source-dir=${BUILD_DIR}`],
  { stdio: "inherit", shell: true }
);

webExt.on("error", (err) => {
  console.error("❌ web-ext failed to start:", err.message);
  console.error("   Make sure you ran: npm install");
});

webExt.on("close", (code) => {
  if (code !== 0) console.log(`web-ext exited with code ${code}`);
  process.exit(code);
});

// Watch src/ for changes and rebuild — web-ext will detect the updated
// files in build/firefox/ and reload the extension automatically
chokidar
  .watch(WATCH_PATHS, {
    ignoreInitial: true,
    ignored: /(^|[/\\])\../
  })
  .on("all", (event, filePath) => {
    console.log(`\n[${timestamp()}] ${event}: ${filePath}`);
    runBuild();
    console.log("   ↻ web-ext should reload automatically.\n");
  });

// Ensure web-ext is killed cleanly on Ctrl+C
process.on("SIGINT", () => {
  webExt.kill();
  process.exit(0);
});

function runBuild() {
  try {
    execSync("node scripts/build-firefox.js", { stdio: "inherit" });
  } catch (e) {
    console.error("❌ Build failed:", e.message);
  }
}

function timestamp() {
  return new Date().toLocaleTimeString();
}
