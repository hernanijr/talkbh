# Talk BH

The official bilingual website for Talk BH, an independent English-speaking community in Belo Horizonte. Built with Astro and Tailwind CSS for Cloudflare Workers at `talk.bh`.

## Requirements

- Node.js 22.23.4 or newer (version is pinned in `.nvmrc`)
- npm

## Run locally

```sh
npm install
npm run dev
```

Astro prints the local URL (normally `http://localhost:4321`). Portuguese is at `/`; English is at `/en/`.

The language suggestion uses the browser's supported languages and remembers the visitor's manual choice. It does not redirect crawlers or replace the explicit `/` and `/en/` URLs.

## Development workflow

`main` is the production branch. Do not commit or push feature work directly to `main`. Create a short-lived branch from the latest `main` (`feature/...`, `fix/...`, or `chore/...`), open a pull request back to `main`, review its Cloudflare preview, and merge only after the build and review checklist pass. Merging to `main` is the production release. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full process and GitHub settings to protect production.

## Updating site copy and community content

Edit `src/data/site.ts` for brand settings, Instagram and WhatsApp URLs, and all Portuguese and English page copy. Keep translations aligned when changing copy. The WhatsApp URL currently points to the official Talk BH community. If it is unavailable, leave it empty; buttons fall back to Instagram.

Talk BH participation is free and requires no registration or reservation. Guests pay only for food and drinks they order at the venue. These confirmed policies are reflected in both language versions.

Meetup location is the Charada Savassi Cervejaria Artesanal at Rua Paraíba, 523, Belo Horizonte. The former fallback date, 12 November 2026 at 19:30, has passed and was cleared; no next event is announced until organizers confirm its date and time. Meetup and photo content is centralized in `src/data/community-content.json` and managed in the `/admin/` panel after its Decap Turbo site ID is configured. Do not enter event dates until organizers confirm them.

## Community photos

Only use real Talk BH photographs with permission. Add up to six photos with descriptive Portuguese and English alt text; the site hides the gallery when there are no photos and optimizes local assets at build time. Do not add stock or generated people photos.

## Social links

The official WhatsApp invite URL is configured in `social.whatsapp`, and its QR image is stored at `public/images/community/whatsapp-invite.png`. Replace both when the invite changes. Until a valid WhatsApp URL is configured, community buttons open the official Instagram profile with matching fallback labels. Change `social.instagram` to update Instagram links.

## Build

```sh
npm run build
npm run preview
```

Run the same checks as CI with `npm run check`, `npm test`, `npm run build`, and `npm run validate:build`.

## CMS and Cloudflare Workers deployment

The `/admin/` panel uses Decap CMS with the Decap Turbo Free backend. The organizers confirmed one panel editor; other admins review content pull requests in GitHub. The site ID is still a setup value in `public/admin/config.yml`; until that is filled in after creating the free site, the CMS login is not connected. Do not opt into paid trials or plans. See [the CMS evaluation and setup steps](docs/cms-evaluation.md).

Cloudflare builds the Astro static site with `npm run build`. [wrangler.jsonc](wrangler.jsonc) explicitly deploys `./dist` as static assets, so the Worker does not require a `SESSION` KV binding. `main` remains production; code and approved content changes go through reviewed pull requests. CMS drafts use Decap's editorial workflow and are proposed as GitHub pull requests; the content and uploaded photos are stored in Git. Only a reviewed merge triggers the production Worker build. The production domain and canonical metadata use `https://talk.bh`. Public pages use localized canonical and `hreflang` tags. Only a confirmed future meetup receives Event structured data. See [CONTRIBUTING.md](CONTRIBUTING.md) for the deployment process and [the CMS evaluation](docs/cms-evaluation.md) for setup steps.
