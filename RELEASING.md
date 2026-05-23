# Publishing PimentCSS

Repository: [WebmonsterC/pimentCSS](https://github.com/WebmonsterC/pimentCSS)

## First-time push

```bash
git init
git branch -M main
git remote add origin https://github.com/WebmonsterC/pimentCSS.git
npm ci
npm ci --prefix docs-site
npm run build:css
git add -A
git commit -m "chore: initial release of PimentCSS v1.0.0"
git push -u origin main
```

If the remote already contains an initial commit (e.g. LICENSE only), use:

```bash
git pull origin main --allow-unrelated-histories
# resolve conflicts if any, then:
git push -u origin main
```

## GitHub release v1.0.0

```bash
gh release create v1.0.0 --title "PimentCSS v1.0.0" --notes-file .github/release-notes/v1.0.0.md
```

## npm

Package name on the registry: **[`pimentcss-design-system`](https://www.npmjs.com/package/pimentcss-design-system)** (the legacy name `pimentcss` is owned by another account).

```bash
npm login
npm publish --access public
```

## After push

1. Enable **GitHub Pages** (Settings → Pages → GitHub Actions) for the docs workflow.
2. Confirm **CI** passes on `main`.
3. Point [piment.webmonster.tech](https://piment.webmonster.tech) to the Pages deployment (or Netlify per `netlify.toml`).

## Version bumps

1. Update `package.json` and `docs-site` references if versioned there.
2. Add a section to `CHANGELOG.md`.
3. Tag `vX.Y.Z` and create a GitHub release with notes from the changelog.
