/**
 * Minimal Figma REST client (token via FIGMA_ACCESS_TOKEN).
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const BASE = "https://api.figma.com/v1";
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function loadEnvFile() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvFile();

export function getToken() {
  const token = process.env.FIGMA_ACCESS_TOKEN?.trim();
  if (!token) {
    console.error("FIGMA_ACCESS_TOKEN manquant. Copiez .env.example vers .env et ajoutez votre token.");
    process.exit(1);
  }
  return token;
}

export async function figmaFetch(path, { retries = 3 } = {}) {
  const token = getToken();
  let lastErr;
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "X-Figma-Token": token },
    });
    if (res.status === 429) {
      const wait = 2000 * (attempt + 1);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      lastErr = new Error(`Figma API ${res.status}: ${body.slice(0, 400)}`);
      if (res.status >= 500 && attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw lastErr;
    }
    return res.json();
  }
  throw lastErr;
}

export async function getNodes(fileKey, ids, depth = 1) {
  const encoded = ids.map((id) => encodeURIComponent(id)).join(",");
  return figmaFetch(`/files/${fileKey}/nodes?ids=${encoded}&depth=${depth}`);
}

export async function getSvgUrls(fileKey, ids) {
  const encoded = ids.map((id) => encodeURIComponent(id)).join(",");
  const data = await figmaFetch(`/images/${fileKey}?ids=${encoded}&format=svg`);
  return data.images ?? {};
}
