# Publishing PimentCSS

Repository: [WebmonsterC/pimentCSS](https://github.com/WebmonsterC/pimentCSS)

## Version bumps

1. Update `package.json`, `docs-site/package.json`, and `docs-site/src/data/nav.json`.
2. Add a section to `CHANGELOG.md` and `.github/release-notes/vX.Y.Z.md`.
3. Update the **Latest** line in `README.md`.
4. Commit, tag `vX.Y.Z`, push, create a GitHub release, publish npm, refresh Context7.

```bash
npm version patch --no-git-tag-version   # or minor / major
git add -A
git commit -m "chore: release v1.0.1"
git tag v1.0.1
git push origin main --tags
npm publish --access public
```

## GitHub release

```bash
gh release create v1.0.1 --title "PimentCSS v1.0.1" --notes-file .github/release-notes/v1.0.1.md
```

Without `gh`, create the release manually on GitHub from the tag and paste notes from `.github/release-notes/`.

## npm

Package name on the registry: **[`pimentcss-design-system`](https://www.npmjs.com/package/pimentcss-design-system)** (the legacy name `pimentcss` is owned by another account).

```bash
npm login
npm publish --access public
```

`prepublishOnly` runs `build:css` automatically.

## Context7 (AI documentation index)

Context7 makes PimentCSS discoverable in Cursor, Claude, and other MCP clients (`use context7`).

### First-time submission

1. **GitHub repo** — [context7.com/add-library?tab=github](https://context7.com/add-library?tab=github) → `https://github.com/WebmonsterC/pimentCSS`
2. **Documentation site** (recommended) — [context7.com/add-library](https://context7.com/add-library) → `https://piment.webmonster.tech/docs`

The repo ships `context7.json` at the root to control exclusions and agent rules. Component docs live on the deployed site, not only in GitHub Markdown.

### Claim the library (maintainer)

1. Open [context7.com/WebmonsterC/pimentCSS/admin](https://context7.com/WebmonsterC/pimentCSS/admin)
2. Click **Claim Library** and copy the generated `public_key`
3. Add to `context7.json`:

```json
{
  "url": "https://context7.com/WebmonsterC/pimentCSS",
  "public_key": "pk_…"
}
```

4. Commit, push, then paste the raw GitHub URL of `context7.json` in the claim modal and confirm
5. Use the admin panel to adjust folders, exclusions, and **Refresh** after each release

### After each release

- Add the new Git tag under `previousVersions` in `context7.json` (tag must exist on GitHub)
- Trigger a library refresh on Context7
- Optionally resubmit the docs site URL if pages changed significantly

## After push

1. Enable **GitHub Pages** (Settings → Pages → GitHub Actions) for the docs workflow.
2. Confirm **CI** passes on `main`.
3. Point [piment.webmonster.tech](https://piment.webmonster.tech) to the Pages deployment (or Netlify per `netlify.toml`).
