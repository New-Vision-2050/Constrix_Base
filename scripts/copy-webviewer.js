/**
 * Serves Apryse WebViewer core assets from Next.js `public/webviewer`.
 * Run automatically via npm `postinstall`.
 */
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../node_modules/@pdftron/webviewer/public");
const dest = path.join(__dirname, "../public/webviewer");

try {
  if (!fs.existsSync(src)) {
    console.warn(
      "[copy-webviewer] Skipping: %s not found (run npm install).",
      src,
    );
    process.exit(0);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log("[copy-webviewer] Copied to public/webviewer");
} catch (err) {
  console.error("[copy-webviewer] Failed:", err);
  process.exit(1);
}
