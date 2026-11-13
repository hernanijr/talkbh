# Talk BH content management evaluation

Assessment made 13 November 2026 for a small bilingual institutional site on Cloudflare Workers. Priorities are no recurring fee, low operational work, event and photo editing, visual review, and an approval before production. No CMS account or paid service has been created.

## Recommendation under a zero-cost requirement

Use Decap CMS with Decap Turbo's Free tier if one person needs to edit content in the panel and a different maintainer can review and merge the resulting GitHub pull request. The current Free tier lists one site and one seat, with hosted authentication and proxying; it does not require us to operate an OAuth server. Editors can sign in without GitHub accounts, and content is still committed to the GitHub repository. Changes in an editorial workflow are proposed as pull requests, so `main` remains protected and Cloudflare deploys only after a reviewed merge.

The organizers confirmed that one person needs panel access and other admins can review in GitHub. That fits this option. Do not enable paid trials or plans.

| Option | Zero-cost fit | Workflow and maintenance |
| --- | --- | --- |
| Decap CMS + Decap Turbo Free | $0, one site and one CMS seat. | Managed authentication avoids running an OAuth service. Git content and editorial workflow use pull requests. A separate GitHub maintainer can approve/merge without occupying the CMS seat. [Plans](https://decapcms.org/turbo/), [connecting a site](https://decapcms.org/docs/turbo-connecting-a-site/), [editorial workflow](https://decapcms.org/docs/editorial-workflows/). |
| Self-hosted Decap CMS | $0 for software and Cloudflare Worker usage within the free quota. No CMS seat cap. | Supports Git-based draft and pull request workflows, but GitHub authentication requires an OAuth server or another auth provider. Operating that endpoint and its secrets adds maintenance. [GitHub backend](https://decapcms.org/docs/github-backend/), [OAuth clients](https://decapcms.org/docs/external-oauth-clients/). |
| TinaCMS Free | $0, two users. | Visual editing and enough users for a small team, but the current Free plan does not include Editorial Workflow. It would need a separate branch/PR process, which adds custom integration and care. [Pricing](https://tina.io/pricing), [Cloudflare Workers deployment](https://tina.io/docs/tinacloud/deployment-options/cloudflare-workers/). |
| Storyblok / Sanity | Not selected under the no-cost rule. | Their stronger managed editing and review features can require paid seats or plans, and would introduce hosted CMS configuration. Revisit only if the free options cannot support the actual editor count and the organizers later change the cost constraint. |

## Content rules independent of CMS choice

- Keep page copy, permanent policies, and translations in their existing centralized bilingual data.
- Store meetup and gallery content as structured data. The next event requires a confirmed date and time in `America/Sao_Paulo`; never infer a recurring schedule. Past and cancelled meetups cannot appear as upcoming or as scheduled-event structured data.
- Keep the confirmed venue as Charada Savassi Cervejaria Artesanal, Rua Paraíba, 523, Belo Horizonte. Show directions only with a valid Google Maps URL.
- Support up to six genuine community photos with permission and descriptive alt text in Portuguese and English. Keep the gallery hidden when empty, and optimize assets at build time.
- Prefer a CMS preview pane styled with the existing design. A content change must create a reviewable GitHub pull request. Merge triggers the existing Cloudflare build; the CMS must not write directly to production `main`.
- Keep drafts out of production output, sitemap, and search indexing. Public pages stay pre-rendered; no request-time CMS rendering is needed for a small institutional website.

The GitHub repository is public, so CMS pull requests, draft text, and uploaded photo files are also visible to the public on GitHub before approval. The editor preview is for visual review, not confidentiality. Do not enter private or sensitive material as draft content.

## Setup steps

1. Create a Decap Turbo organization on its Free plan and one site; do not opt into the Pro trial.
2. Connect the Talk BH GitHub repository and set the admin origin to `https://talk.bh`.
3. Copy the generated site ID into `turbo_site_id` in `public/admin/config.yml`. It is an ID, not a credential. The CMS does not work until this value is set in a later PR.
4. Confirm the CMS Git connection and editorial workflow create content pull requests targeting `main`. Require a different GitHub reviewer and the CI build before merging. Only a reviewed merge deploys the content to Cloudflare.
5. Give the one CMS seat to the primary editor. Other organizers review and approve through GitHub; they do not need CMS seats.

If the number of panel editors changes later, the free tier no longer matches. Re-evaluate self-hosted Decap's OAuth/authentication operation before adding an account; it is free software but requires an auth endpoint and credential upkeep. Do not silently add a paid seat or provider.

Photos and the date/time of the next meetup are still needed. Until the organizers provide them, the public site should show no upcoming event and no new gallery content.

## Attached `schema.json` review

Use only supported, verified facts from the file. Keep Talk BH's own logo asset and official Instagram URL. Emit the official website URL, a language-appropriate description, Belo Horizonte service area, and the permanent zero-participation-fee policy as JSON-LD. Do not copy the proposed Instagram URL as a logo/image, the unverified alternate name or founders, the unverified coordinates, or the past event dated 11 November 2026. The existing JSON-LD includes an Event only for a confirmed future meetup.
