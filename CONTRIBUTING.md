# Contributing to Talk BH

## Release model

`main` is production. Production changes go through a pull request; do not commit or push feature work directly to `main`. Cloudflare should build preview deployments for pull requests and deploy production only after a reviewed merge to `main`.

## Branch and change flow

1. Start from an up-to-date `main` and create a focused branch:
   - `feature/<short-description>` for product work
   - `fix/<short-description>` for bug fixes
   - `chore/<short-description>` for maintenance
2. Make the smallest complete change. Keep page copy and permanent community policies in `src/data/site.ts`. Manage meetup and gallery entries in the CMS only after its editor count and zero-cost setup are confirmed. Do not put credentials in source, screenshots, or committed configuration.
3. Run `npm ci`, `npm run check`, `npm test`, `npm run build`, and `npm run validate:build` locally. For visual changes, inspect both language routes and a narrow mobile viewport.
4. Open a pull request targeting `main`. Include the reason, summary, check results, and Cloudflare preview URL. Use the pull request checklist and attach screenshots for visual changes.
5. Review the diff and preview, verify Portuguese and English, links, mobile layout, and any relevant event behavior. Resolve all review comments before merging.
6. Merge with **Squash and merge** after the review and required checks configured in the GitHub ruleset pass. Cloudflare's production deployment follows the merge. Verify `talk.bh` after deployment.

## Protect production on GitHub

In repository **Settings → Rules → Rulesets** (or branch protection rules), maintain a rule targeting `main`:

- Require a pull request before merging and require the **Production build** status check.
- Keep the ruleset's approval and conversation-resolution settings aligned with the number of active reviewers.
- Block force pushes.
- Keep Cloudflare preview deployments enabled for pull requests and production deployment tied to `main`.

These settings must be enabled in GitHub and Cloudflare dashboards; files in this repository cannot enforce remote branch permissions or dashboard deployment settings.

## Content publishing

Site copy, code, meetup entries, and gallery changes use pull requests. Decap CMS is configured for editorial workflow; it must create a content PR, and a different GitHub reviewer approves it before merge. Content must never bypass `main` branch protection. The Decap Turbo Free site ID still needs to be set before enabling editor access. See [the CMS setup](docs/cms-evaluation.md).

## Rollback

Do not rewrite or force-push `main`. If a release needs to be undone, open a revert pull request for the merge commit, review its preview, then merge it through the same process.
