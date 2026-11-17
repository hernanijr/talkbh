import type { CommunityMeetup } from './community-content.ts';
import { site, type Language } from './site.ts';

export function createEventSchema(event: CommunityMeetup | undefined, lang: Language, now = new Date()) {
  const name = event?.title?.[lang];
  if (!event || !name || !event.date || event.status !== 'scheduled') return undefined;

  const endTimestamp = Date.parse(event.endDate ?? event.date);
  if (!Number.isFinite(endTimestamp) || endTimestamp <= now.getTime()) return undefined;

  const domain = site.brand.domain.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    ...(event.description?.[lang] ? { description: event.description[lang] } : {}),
    startDate: event.date,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    ...(event.image ? { image: new URL(event.image, `${domain}/`).href } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: 'Belo Horizonte',
        addressRegion: 'MG',
        addressCountry: 'BR',
      },
      ...(event.mapsUrl ? { hasMap: event.mapsUrl } : {}),
    },
    ...(event.entryPrice !== undefined ? {
      offers: { '@type': 'Offer', price: event.entryPrice, priceCurrency: 'BRL' },
    } : {}),
    organizer: { '@type': 'Organization', name: site.brand.name, url: domain },
  };
}
