import type { CommunityMeetup } from './community-content.ts';
import { site, type Language } from './site.ts';

export function createEventSchema(event: CommunityMeetup | undefined, lang: Language, now = new Date(), url?: string) {
  const name = event?.title?.[lang];
  if (!event || !name || !event.date) return undefined;

  const startTimestamp = Date.parse(event.date);
  const endTimestamp = Date.parse(event.endDate ?? event.date);
  if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp) || endTimestamp <= now.getTime()) return undefined;

  const domain = site.brand.domain.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    ...(event.description?.[lang] ? { description: event.description[lang] } : {}),
    ...(url ? { url } : {}),
    startDate: event.date,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    image: new URL(event.image ?? '/social-card.svg', `${domain}/`).href,
    eventStatus: event.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
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
