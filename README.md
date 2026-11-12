# Talk BH

The official bilingual website MVP for Talk BH, an independent English-speaking community in Belo Horizonte. Built with Astro and Tailwind CSS as a static site for Cloudflare Pages.

## Requirements

- Node.js 20.3 or newer
- npm

## Run locally

```sh
npm install
npm run dev
```

Astro prints the local URL (normally `http://localhost:4321`). Portuguese is at `/`; English is at `/en/`.

## Updating content

Edit `src/data/site.ts`. This file contains the brand, Instagram and WhatsApp URLs, meetup information, gallery images, and all Portuguese and English page copy. Keep both translation objects aligned when changing the page. Empty optional fields are intentional: add the WhatsApp invitation URL to `social.whatsapp` when it is confirmed, and add a confirmed event address or map link to `meetup.address` and `meetup.mapsUrl`.

The event date is checked against the current time at build/render. Once it has passed, the page replaces it with a message directing visitors to the community, instead of continuing to call it upcoming. Edit the meetup date and venue for a newly announced event; clear `meetup.date` to hide event specifics and show the generic announcement fallback.

## Community photos

Only add real Talk BH photographs with permission. Put optimized image files in `public/images/community/`, then add each file path and accurate Portuguese and English alt text to the `gallery` array in `src/data/site.ts`. The gallery stays hidden when the array is empty. Use descriptive filenames and web-sized images (WebP is recommended).

## Social links

The official WhatsApp invite URL is configured in `social.whatsapp`, and its QR image is stored at `public/images/community/whatsapp-invite.png`. Replace both when the invite changes. Until a WhatsApp URL is configured, community buttons gracefully open the official Instagram profile. Change `social.instagram` to update Instagram links.

## Build

```sh
npm run build
npm run preview
```

## Deploy to Cloudflare Pages

1. Push this repository to GitHub.
2. In Cloudflare, create a Pages project and connect the GitHub repository.
3. Choose **Astro** (or use the settings below): build command `npm run build`, output directory `dist`.
4. Use the default Node.js build environment; no paid services or secrets are needed.
5. After the first deployment, add `talk.bh` as a custom domain in the Pages project and follow the DNS instructions Cloudflare shows for the domain. Configure DNS at your registrar when you are ready.

The Astro site URL and canonical metadata are already configured as `https://talk.bh`. DNS and publication are not configured by this project.
