import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mediaPlaceholderDevPlugin } from './vite/media-placeholder-dev.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  site: 'https://piment.webmonster.tech',
  srcDir: 'src',
  publicDir: 'public',
  outDir: '../dist-docs',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 5173, host: true },
  vite: {
    plugins: [mediaPlaceholderDevPlugin()],
    server: {
      fs: { allow: [root] },
    },
  },
});
