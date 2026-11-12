# Talk BH

The official bilingual website for Talk BH, an independent English-speaking community in Belo Horizonte. Built with Astro and Tailwind CSS as a static site for `talk.bh`.

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

## Publish on DreamHost

This project is configured for static output (`dist`) and does not require Node.js, a database, a Cloudflare adapter, or a server process on the production host. Build locally, then upload the **contents** of `dist/` into the DreamHost website directory for `talk.bh` (typically `/home/USERNAME/talk.bh/`). DreamHost recommends SFTP on port 22; do not upload the files into the account home directory itself.

1. Build the site locally:

   ```sh
   npm ci
   npm run build
   ```

2. Confirm `talk.bh` is set up as a hosted website in DreamHost, then use an SFTP client or the DreamHost panel file manager to open its website directory.
3. Upload everything inside the local `dist/` folder, including `index.html`, `en/`, `_astro/`, `images/`, `robots.txt`, and `sitemap.xml`.
4. Verify `https://talk.bh/`, `https://talk.bh/en/`, the WhatsApp QR image, and the sitemap after upload. Upload the contents of `dist/` again after a new build to publish later edits.

DreamHost controls hosting, HTTPS and the DNS instructions for this domain. This repository does not modify DNS. For DreamHost's current upload instructions, see [How do I upload my site?](https://help.dreamhost.com/hc/en-us/articles/215613657-How-do-I-upload-my-site-to-DreamHost), [Where do I upload files?](https://help.dreamhost.com/hc/en-us/articles/214920778-Where-do-I-upload-my-files-once-connected-via-FTP), and [FTP and SFTP](https://help.dreamhost.com/hc/en-us/articles/115001051531-FTP-and-SFTP-at-DreamHost).

Canonical and social metadata use `https://talk.bh`.
