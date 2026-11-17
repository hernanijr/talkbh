import type { APIRoute } from 'astro';
import contentFile from '../data/community-content.json';
import { normalizeCommunityMeetups } from '../data/community-content';

export const prerender = true;

const domain = 'https://talk.bh';

function alternateLinks(ptUrl: string, enUrl: string): string {
  return [
    `<xhtml:link rel="alternate" hreflang="pt-BR" href="${ptUrl}"/>`,
    `<xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${ptUrl}"/>`,
  ].join('');
}

function urlEntry(url: string, alternates: string): string {
  return `<url><loc>${url}</loc>${alternates}</url>`;
}

export const GET: APIRoute = () => {
  const homePt = `${domain}/`;
  const homeEn = `${domain}/en/`;
  const homeAlternates = alternateLinks(homePt, homeEn);
  const entries = [
    urlEntry(homePt, homeAlternates),
    urlEntry(homeEn, homeAlternates),
  ];

  const meetups = normalizeCommunityMeetups(contentFile, new Date(), true);
  for (const event of meetups) {
    if (!event.slug) continue;
    const eventPt = `${domain}/eventos/${event.slug}/`;
    const eventEn = `${domain}/en/events/${event.slug}/`;
    const eventAlternates = alternateLinks(eventPt, eventEn);
    entries.push(urlEntry(eventPt, eventAlternates), urlEntry(eventEn, eventAlternates));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
