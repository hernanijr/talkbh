# Contributing to Talk BH

## Release model

`main` is production. Production changes go through a pull request; do not commit or push feature work directly to `main`. Cloudflare should build preview deployments for pull requests and deploy production only after a reviewed merge to `main`.

## Branch and change flow

1. Start from an up-to-date `main` and create a focused branch:
   - `feature/<short-description>` for product work
   - `fix/<short-description>` for bug fixes
   - `chore/<short-description>` for maintenance
2. Make the smallest complete change. Keep public content in `src/data/site.ts`; do not put credentials in source, screenshots, or committed configuration.
3. Run `npm ci` and `npm run build` locally. For content changes, check both `/` and `/en/`; for layout changes, inspect a narrow mobile viewport too.
4. Open a pull request targeting `main`. Include the reason, summary, build result, and Cloudflare preview URL. Use the pull request checklist and attach screenshots for visual changes.
5. Review the diff and preview, verify Portuguese and English, links, mobile layout, and any relevant event behavior. Resolve all review comments before merging.
6. Merge with **Squash and merge** after approval and a passing **Production build** check. Cloudflare's production deployment follows the merge. Verify `talk.bh` after deployment.

## Protect production on GitHub

In repository **Settings → Rules → Rulesets** (or branch protection rules), create a rule targeting `main`:

- Require a pull request before merging, with at least one approval from another collaborator.
- Require the **Production build** status check.
- Require conversation resolution before merging.
- Block force pushes and branch deletion.
- Keep Cloudflare preview deployments enabled for pull requests and production deployment tied to `main`.

These settings must be enabled in GitHub and Cloudflare dashboards; files in this repository cannot enforce remote branch permissions or dashboard deployment settings.

## Rollback

Do not rewrite or force-push `main`. If a release needs to be undone, open a revert pull request for the merge commit, review its preview, then merge it through the same process.
