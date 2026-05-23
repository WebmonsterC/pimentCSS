import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");

if (!existsSync(envPath)) {
  console.log("✗ .env introuvable");
  process.exit(1);
}

const raw = readFileSync(envPath, "utf8");
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  if (key === "FIGMA_ACCESS_TOKEN") {
    console.log(`FIGMA_ACCESS_TOKEN: longueur ${val.length}, préfixe ${val.slice(0, 4)}…`);
    const res = await fetch("https://api.figma.com/v1/me", {
      headers: { "X-Figma-Token": val },
    });
    const body = await res.text();
    if (res.ok) {
      const data = JSON.parse(body);
      console.log(`✓ Token valide — ${data.email ?? data.handle ?? "OK"}`);
      process.exit(0);
    }
    console.log(`✗ Token refusé (${res.status}): ${body.slice(0, 120)}`);
    process.exit(1);
  }
}
console.log("✗ FIGMA_ACCESS_TOKEN absent de .env");
