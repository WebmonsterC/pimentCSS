# Fonts (bring your own)

PimentCSS v1 uses two families. **You must have a valid license** to host and redistribute font files (especially Zodiak from [Fontshare](https://www.fontshare.com/fonts/zodiak)).

## Required files (minimal)

Place files in this folder. The build uses **`.woff2` only** (modern browsers). You do **not** need `.eot` or `.woff`.

| Family | Files | Weights |
|--------|-------|---------|
| **Zodiak** | `Zodiak-Bold.woff2` (or `.ttf` to convert) | 700 — headings |
| **Plus Jakarta Sans** | `PlusJakartaSans-Regular`, `-Medium`, `-SemiBold`, `-Bold`, `-Italic` | 400, 500, 600, 700, 400 italic |

Extra Zodiak weights (Thin, Black, Variable, …) are optional and ignored by the build.

## Generate missing `.woff2`

If you only have `.ttf` (e.g. Plus Jakarta Sans), run:

```bash
npm run build:fonts
```

This converts TTF → WOFF2 for the required files and generates `styles/fonts.local.css`.

## Build integration

- `npm run build:css` runs `build:fonts` first, then compiles Sass with **local fonts** when all required `.woff2` exist.
- If fonts are missing, the build falls back to **Fontshare + Google Fonts** CDN imports.
- The documentation site copies `.woff2` to `docs-site/public/fonts/` and rewrites URLs to `/fonts/…`.

## npm package consumers

Published `pimentcss` on npm **does not ship** font binaries (size + licensing). Either:

1. Keep CDN enabled (default when `fonts/` is absent), or  
2. Add licensed files under `fonts/` in your app and run `npm run build:fonts` in this repo before compiling your theme.

Override in Sass when needed:

```scss
@use "pimentcss" with (
  $enable-local-fonts: false,
  $enable-fontshare-fonts: true,
  $enable-google-fonts: true,
);
```
