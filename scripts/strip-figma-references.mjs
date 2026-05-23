/**
 * Retire les références Figma du contenu doc public (fragments HTML).
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const generatedDir = join(root, "docs", "_generated");

function cleanHtml(html) {
  let out = html;

  // Blocs d’en-tête « source Figma » + lien registre
  out = out.replace(
    /<p class="body-medium">\s*<a[^>]*figma\.com[^>]*>[\s\S]*?<\/p>\s*/gi,
    "",
  );
  out = out.replace(
    /<p class="body-medium"[^>]*>\s*[^<]*Figma[\s\S]*?<\/p>\s*/gi,
    (block) => (block.includes("figma.com") || block.includes("../figma/") ? "" : block),
  );

  out = out.replace(/\s*\(Figma[^)]*\)/gi, "");
  out = out.replace(/\s*\(frame[^)]*\)\s*—/gi, "");
  out = out.replace(/\s*—\s*<a href="\.\.\/figma\/[^"]+">registre<\/a>/gi, "");
  out = out.replace(/Figma\s*·\s*/gi, "");
  out = out.replace(/variantes Figma/gi, "variantes");
  out = out.replace(/composant Figma/gi, "composant");
  out = out.replace(/Cartes Figma/gi, "Cartes");
  out = out.replace(/cards-figma/g, "cards-demo");
  out = out.replace(/États Figma\s*:/gi, "États :");
  out = out.replace(/Composition Figma\s*:/gi, "Composition :");
  out = out.replace(/Bloc Figma\s*:/gi, "Bloc :");
  out = out.replace(/Bloc optionnel Figma/gi, "Bloc optionnel");
  out = out.replace(/alignées Figma/gi, "documentées");
  out = out.replace(/dans Figma/gi, "dans la spec");
  out = out.replace(/fichier Figma/gi, "spec design");
  out = out.replace(/figma\.com[^\s"']*/gi, "");

  return out.trimStart();
}

for (const name of readdirSync(generatedDir)) {
  if (!name.endsWith(".html")) continue;
  const path = join(generatedDir, name);
  const next = cleanHtml(readFileSync(path, "utf8"));
  writeFileSync(path, next.endsWith("\n") ? next : `${next}\n`, "utf8");
}

console.log("Fragments nettoyés.");

const scssDir = join(root, "scss");
function walkScss(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkScss(p);
    else if (ent.name.endsWith(".scss")) {
      let s = readFileSync(p, "utf8");
      const prev = s;
      s = s.replace(/\(Figma[^)]*\)/gi, "");
      s = s.replace(/—\s*Numera11y[^(\n]*(\(Figma[^)]*\))?/gi, "— PimentCSS v1");
      s = s.replace(/\s*Figma\s+[\d:]+\s*\/\s*page\s+[\d:]+/gi, "");
      s = s.replace(/\s*Figma\s+[\d:]+/gi, "");
      s = s.replace(/Figma\s+«([^»]+)»/gi, "«$1»");
      s = s.replace(/Figma/gi, "spec");
      s = s.replace(/noms\s+spec/gi, "noms sémantiques");
      s = s.replace(/spec\s+Depth/gi, "ombres");
      s = s.replace(/  \/\* — spec \*\//g, "");
      if (s !== prev) writeFileSync(p, s, "utf8");
    }
  }
}
walkScss(scssDir);
console.log("Commentaires SCSS nettoyés.");
