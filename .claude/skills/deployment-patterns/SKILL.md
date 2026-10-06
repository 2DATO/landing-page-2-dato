---
name: deployment-patterns
description: GitHub Pages deployment, Actions workflows, and DNS/CNAME handling for 2dato.co
type: project-skill
---

# deployment-patterns

How this repo ships to production.

## Production surface

- **URL:** https://2dato.co
- **Host:** GitHub Pages (project page with custom domain via `CNAME` file)
- **CDN/TLS:** GitHub-managed (Fastly + Let's Encrypt)
- **DNS:** apex `2dato.co` → registros A de GitHub Pages (185.199.108–111.153); `www.2dato.co` CNAME → `2dato.github.io` (GitHub redirige www → apex)

## Current workflows (state as of 2026-04-22)

- `.github/workflows/static.yml` — uploads repo via `actions/upload-pages-artifact` and deploys
- `.github/workflows/jekyll-gh-pages.yml` — **redundant**; repo has no Jekyll content. Race condition on `concurrency: pages` means one silently skips each push.

**Planned fix (PR 1):** delete `jekyll-gh-pages.yml`, harden `static.yml`.

## Hardening rules for `static.yml`

- `on:` — `push: { branches: [main] }` for deploy + `pull_request:` for dry-run (upload only, no deploy job)
- `permissions:` — minimal: `contents: read`, `pages: write`, `id-token: write` on the deploy job only
- `concurrency:` — `group: pages`, `cancel-in-progress: false` (never cancel an in-flight prod deploy)
- `actions/upload-pages-artifact@v3` with explicit `path: .`
- `actions/configure-pages@v5` before upload
- `actions/deploy-pages@v4` as a separate job depending on upload, gated by `if: github.ref == 'refs/heads/main'`

## Pinning

- Pin actions to major version tags (`@v4`) — not SHAs, not floating
- Bump via `chore(deps):` PRs when vendor announces a breaking change

## Pre-deploy checklist

Before merging to `main`:

1. CI green (lint + e2e)
2. No changes to `CNAME` unless DNS change is planned and coordinated
3. No secrets in committed files (scan with `gitleaks` or review diff)
4. Large binary additions reviewed — image budget ≤500 KB first-load

## Post-deploy verification

After merge:

1. Actions tab: confirm Pages deploy job finished green
2. `curl -I https://2dato.co/` — expect `200` and the new `Last-Modified`
3. Smoke the live URL in browser: hero renders, fonts load, no 404s in console, mobile nav opens

## Rollback

- `git revert <merge-sha>` → push to `main` → next Pages deploy serves the prior content
- Never force-push to `main`. Never delete the `gh-pages` branch (if present)

## External service references

- GitHub Pages docs: https://docs.github.com/en/pages
- Deploy action: https://github.com/actions/deploy-pages
- Use `documentation-lookup` skill for up-to-date action syntax
