export type MeetupStatus = 'upcoming' | 'today' | 'past' | 'cancelled' | 'none';

export type Meetup = {
  date: string | null;
  status: 'scheduled' | 'cancelled';
};

const timezone = 'America/Sao_Paulo';

function dateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getMeetupStatus(meetup: Meetup, now = new Date()): MeetupStatus {
  if (meetup.status === 'cancelled') return 'cancelled';
  if (!meetup.date) return 'none';

  const eventDate = new Date(meetup.date);
  if (Number.isNaN(eventDate.getTime())) return 'none';

  const eventDay = dateKey(eventDate);
  const today = dateKey(now);
  if (eventDay < today) return 'past';
  if (eventDay === today) return eventDate.getTime() <= now.getTime() ? 'past' : 'today';
  return 'upcoming';
}

export function getGoogleMapsUrl(value: string): string | undefined {
  if (!value.trim()) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return undefined;

    const host = url.hostname.toLowerCase();
    const directMapsHost = host === 'maps.google.com' || host === 'maps.app.goo.gl';
    const googleMapsPath = (host === 'google.com' || host === 'www.google.com')
      && url.pathname.startsWith('/maps');
    return directMapsHost || googleMapsPath ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function getWhatsAppInvite(value: string): string | undefined {
  if (!value.trim()) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.toLowerCase() === 'chat.whatsapp.com'
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}
