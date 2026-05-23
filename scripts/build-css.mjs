import { spawnSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync, statSync } from "fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const sass = join(root, "node_modules", "sass", "sass.js");

function runSass(entry, out, style = "expanded") {
  const result = spawnSync(
    process.execPath,
    [sass, entry, out, `--style=${style}`, "--no-source-map"],
    { cwd: root, stdio: "inherit" },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  const kb = Math.round(statSync(out).size / 1024);
  console.log(`✓ ${out.replace(root + "\\", "").replace(root + "/", "")} (${kb} Ko)`);
}

mkdirSync(distDir, { recursive: true });

const fontsScript = join(root, "scripts", "convert-fonts.mjs");
const fontsGenScript = join(root, "scripts", "generate-font-face.mjs");
for (const script of [fontsScript, fontsGenScript]) {
  const r = spawnSync(process.execPath, [script], { cwd: root, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const paletteScript = join(root, "scripts", "generate-palette-scss.mjs");
const paletteResult = spawnSync(process.execPath, [paletteScript], {
  cwd: root,
  stdio: "inherit",
});

if (paletteResult.status !== 0) {
  process.exit(paletteResult.status ?? 1);
}

const paletteCssScript = join(root, "scripts", "generate-palette-css.mjs");
const paletteCssResult = spawnSync(process.execPath, [paletteCssScript], {
  cwd: root,
  stdio: "inherit",
});

if (paletteCssResult.status !== 0) {
  process.exit(paletteCssResult.status ?? 1);
}

const colorsDocScript = join(root, "scripts", "generate-colors-doc.mjs");
spawnSync(process.execPath, [colorsDocScript], { cwd: root, stdio: "inherit" });

runSass(join(root, "scss", "pimentcss.scss"), join(distDir, "pimentcss.css"));
runSass(join(root, "scss", "pimentcss.scss"), join(distDir, "pimentcss.min.css"), "compressed");

const syncPublic = join(root, "scripts", "sync-docs-public.mjs");
const syncResult = spawnSync(process.execPath, [syncPublic], { cwd: root, stdio: "inherit" });
if (syncResult.status !== 0) {
  process.exit(syncResult.status ?? 1);
}

console.log("✓ PimentCSS v1 — build complete");
