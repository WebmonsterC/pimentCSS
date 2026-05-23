# Deployment — piment.webmonster.tech

Marketing site at `/` and documentation at `/docs`. Built with [Astro](https://astro.build/) in `docs-site/` and published from `dist-docs/`.

## Local build

```bash
npm run build:docs:astro
# Output: dist-docs/ (marketing + doc pages + assets)
```

Preview the production build:

```bash
npm run docs:preview
# http://localhost:5173/  (docs: http://localhost:5173/docs)
```

## Option A — GitHub Pages (included workflow)

1. On GitHub: **Settings → Pages → Source**: **GitHub Actions**
2. Push to `main` — the `.github/workflows/deploy-docs.yml` workflow builds and deploys
3. **Settings → Pages → Custom domain**: `piment.webmonster.tech`
4. DNS at your registrar:
   - `CNAME` `piment` → `<user>.github.io` (value shown by GitHub)
   - or `A` records to GitHub Pages IPs

The `docs-site/public/CNAME` file is copied into `dist-docs/` at build time.

## Option B — Netlify

1. Connect the repository on [Netlify](https://www.netlify.com/)
2. `netlify.toml` configures:
   - **Build**: `npm run build:docs:astro`
   - **Publish**: `dist-docs`
3. Custom domain: `piment.webmonster.tech` (automatic SSL)

Legacy doc URLs (e.g. `/installation`) redirect to `/docs/installation` via `docs-site/public/_redirects`.

## Tests before deployment

```bash
npm run build:docs:astro
npm run test:e2e:a11y
npm run test:e2e
```

## npm package (CSS only)

The published tarball does not include the doc site. Before `npm publish`:

```bash
npm run build:css
```
