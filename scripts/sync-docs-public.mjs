import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { REQUIRED_FONTS } from './fonts-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist', 'pimentcss.min.css');
const palettes = join(root, 'styles', 'palettes.css');
const publicDir = join(root, 'docs-site', 'public');

if (!existsSync(dist)) {
  console.error('✗ dist/pimentcss.min.css manquant — lancez npm run build:css');
  process.exit(1);
}
if (!existsSync(palettes)) {
  console.error('✗ styles/palettes.css manquant — lancez npm run build:css');
  process.exit(1);
}

mkdirSync(publicDir, { recursive: true });
mkdirSync(join(publicDir, 'styles'), { recursive: true });
mkdirSync(join(publicDir, 'fonts'), { recursive: true });

const fontsSrc = join(root, 'fonts');
for (const font of REQUIRED_FONTS) {
  const src = join(fontsSrc, `${font.fileBase}.woff2`);
  if (existsSync(src)) {
    copyFileSync(src, join(publicDir, 'fonts', `${font.fileBase}.woff2`));
  }
}

/** Doc site serves CSS from / — rewrite relative palette import. */
let minCss = readFileSync(dist, 'utf8');
minCss = minCss.replace(
  /@import\s*(?:url\()?['"]\.\.\/styles\/palettes\.css['"]\)?;?/g,
  '@import "/palettes.css";',
);
minCss = minCss.replace(
  /url\(\.\.\/fonts\//g,
  'url(/fonts/',
);
writeFileSync(join(publicDir, 'pimentcss.min.css'), minCss);
copyFileSync(palettes, join(publicDir, 'palettes.css'));
copyFileSync(palettes, join(publicDir, 'styles', 'palettes.css'));
console.log('✓ docs-site/public/pimentcss.min.css');
console.log('✓ docs-site/public/palettes.css');
console.log('✓ docs-site/public/fonts/*.woff2');
