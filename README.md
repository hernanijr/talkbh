# Talk BH

The official bilingual website for Talk BH, an independent English-speaking community in Belo Horizonte. Built with Astro and Tailwind CSS as a static site for `talk.bh`.

## Requirements

- Node.js 22.23.4 or newer (version is pinned in `.nvmrc`)
- npm

## Run locally

```sh
npm install
npm run dev
```

Astro prints the local URL (normally `http://localhost:4321`). Portuguese is at `/`; English is at `/en/`.

## Development workflow

`main` is the production branch. Do not commit or push feature work directly to `main`. Create a short-lived branch from the latest `main` (`feature/...`, `fix/...`, or `chore/...`), open a pull request back to `main`, review its Cloudflare preview, and merge only after the build and review checklist pass. Merging to `main` is the production release. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full process and GitHub settings to protect production.

## Updating content

Edit `src/data/site.ts`. This file contains the brand, Instagram and WhatsApp URLs, meetup information, gallery image list, and all Portuguese and English page copy. Keep both translation objects aligned when changing the page. The WhatsApp URL currently points to the official Talk BH community. If it is unavailable, leave it empty; buttons fall back to Instagram and use an Instagram label.

Talk BH participation is free and requires no registration or reservation. Guests pay only for food and drinks they order at the venue. These confirmed policies are reflected in both language versions.

The current meetup is the Charada Savassi Cervejaria Artesanal at Rua Paraíba, 523, Belo Horizonte. Meetup name, address, date, time, status and Maps link are centralized in `src/data/site.ts`. The existing date and time remain 12 November 2026 at 19:30; do not set a future date or time until organizers confirm it. Meetup dates are interpreted in the Belo Horizonte timezone. The page checks the event in the visitor’s browser, so it changes to past after its scheduled time even when the static site is not rebuilt. It distinguishes upcoming, today, past, cancelled, and no-announcement states. Set `meetup.status` to `cancelled` for a cancelled event; set `meetup.date` to `null` when there is no announced event. A directions button appears only for a valid HTTPS Google Maps link (`maps.google.com`, `maps.app.goo.gl`, or a `/maps` path on `google.com`).

## Community photos

Only add real Talk BH photographs with permission. Put image sources in `src/assets/community/`, then add each filename and accurate Portuguese and English alt text to the `gallery` array in `src/data/site.ts`. Astro optimizes these local images into responsive WebP variants during the production build. The gallery stays hidden if there are no configured image files and displays at most six. Use descriptive filenames; do not add stock or generated people photos.

## Social links

The official WhatsApp invite URL is configured in `social.whatsapp`, and its QR image is stored at `public/images/community/whatsapp-invite.png`. Replace both when the invite changes. Until a valid WhatsApp URL is configured, community buttons open the official Instagram profile with matching fallback labels. Change `social.instagram` to update Instagram links.

## Build

```sh
npm run build
npm run preview
```

## Cloudflare deployment

The site builds as static files in `dist/` and does not need application secrets, a database, or server-side Node.js at runtime. The Cloudflare project is connected to this repository; keep `main` as its production branch and review Cloudflare preview deployments from pull requests before merging. Configure the Cloudflare build to run `npm run build` and publish `dist/` (for Pages). If the current project is a Worker with static assets, keep its existing dashboard build/deploy settings; this repo intentionally does not add Wrangler credentials or an inferred deploy command. Configure `talk.bh` and DNS in Cloudflare and the registrar dashboard, not in source code.

The production domain and canonical metadata use `https://talk.bh`.

Canonical and social metadata use `https://talk.bh`.
