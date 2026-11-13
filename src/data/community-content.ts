import { getGoogleMapsUrl, getMeetupStatus, type MeetupStatus } from './meetup.ts';
import { site, type Language } from './site.ts';

export type CommunityMeetup = {
  title?: Record<Language, string>;
  date: string | null;
  status: 'scheduled' | 'cancelled';
  venue: string;
  city: string;
  address: string;
  mapsUrl: string;
};

export type CommunityPhoto = {
  file: string;
  alt: Record<Language, string>;
};

export type CommunityContent = {
  meetup: CommunityMeetup;
  gallery: CommunityPhoto[];
};

type MeetupRecord = {
  title_pt?: unknown;
  title_en?: unknown;
  date?: unknown;
  time?: unknown;
  status?: unknown;
  venue?: unknown;
  city?: unknown;
  address?: unknown;
  maps_url?: unknown;
};

type PhotoRecord = {
  image?: unknown;
  alt_pt?: unknown;
  alt_en?: unknown;
  rights_confirmed?: unknown;
};

type ContentRecord = { meetups?: unknown; gallery?: unknown };

const fallbackContent: CommunityContent = {
  meetup: { ...site.meetup },
  gallery: [...site.gallery],
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toDateTime(date: string, time: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return undefined;
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  if (calendarDate.getUTCFullYear() !== year || calendarDate.getUTCMonth() !== month - 1 || calendarDate.getUTCDate() !== day) return undefined;
  if (hour > 23 || minute > 59) return undefined;
  return `${date}T${time}:00-03:00`;
}

function meetupFromRecord(record: MeetupRecord, strict: boolean): CommunityMeetup | undefined {
  const titlePt = clean(record.title_pt);
  const titleEn = clean(record.title_en);
  const date = clean(record.date);
  const time = clean(record.time);
  const status = record.status;
  const venue = clean(record.venue);
  const address = clean(record.address);
  const city = clean(record.city) || 'Belo Horizonte, Minas Gerais, Brazil';
  const mapsUrl = clean(record.maps_url);
  const validDate = toDateTime(date, time);
  const validStatus = status === 'scheduled' || status === 'cancelled';
  const validMapsUrl = !mapsUrl || Boolean(getGoogleMapsUrl(mapsUrl));
  if (!titlePt || !titleEn || !validDate || !validStatus || !venue || !address || !validMapsUrl) {
    if (strict) throw new Error('A meetup needs bilingual titles, a valid Belo Horizonte date/time, status, venue and address; the Maps URL must be valid HTTPS Google Maps.');
    return undefined;
  }
  return {
    title: { 'pt-BR': titlePt, en: titleEn },
    date: validDate,
    status,
    venue,
    address,
    city,
    mapsUrl: getGoogleMapsUrl(mapsUrl) ?? '',
  };
}

function photoFromRecord(record: PhotoRecord, strict: boolean): CommunityPhoto | undefined {
  const image = clean(record.image);
  const altPt = clean(record.alt_pt);
  const altEn = clean(record.alt_en);
  if (!image || !altPt || !altEn || record.rights_confirmed !== true) {
    if (strict) throw new Error('Each community photo needs confirmed permission, an image and descriptive alt text in Portuguese and English.');
    return undefined;
  }
  const file = image.split(/[\\/]/).pop() ?? '';
  if (!file || !/\.(avif|gif|jpe?g|png|webp)$/i.test(file)) {
    if (strict) throw new Error('Community photos must use supported image files.');
    return undefined;
  }
  return { file, alt: { 'pt-BR': altPt, en: altEn } };
}

export function normalizeCommunityContent(input: unknown, now = new Date(), strict = false): CommunityContent {
  const record = asRecord(input) as ContentRecord | undefined;
  const meetupRecords = Array.isArray(record?.meetups) ? record.meetups : [];
  const photoRecords = Array.isArray(record?.gallery) ? record.gallery : [];

  const meetups = meetupRecords.flatMap((item) => {
    const meetupRecord = asRecord(item) as MeetupRecord | undefined;
    if (!meetupRecord) {
      if (strict) throw new Error('Meetup entries must be structured objects.');
      return [];
    }
    const meetup = meetupFromRecord(meetupRecord, strict);
    return meetup ? [meetup] : [];
  });

  const upcoming = meetups
    .filter((meetup) => meetup.status === 'scheduled' && ['today', 'upcoming'].includes(getMeetupStatus(meetup, now)))
    .sort((a, b) => Date.parse(a.date!) - Date.parse(b.date!))[0];
  const cancelled = meetups
    .filter((meetup) => meetup.status === 'cancelled' && ['today', 'upcoming'].includes(getMeetupStatus({ ...meetup, status: 'scheduled' }, now)))
    .sort((a, b) => Date.parse(a.date!) - Date.parse(b.date!))[0];

  const gallery = photoRecords.flatMap((item) => {
    const photoRecord = asRecord(item) as PhotoRecord | undefined;
    if (!photoRecord) {
      if (strict) throw new Error('Community photo entries must be structured objects.');
      return [];
    }
    const photo = photoFromRecord(photoRecord, strict);
    return photo ? [photo] : [];
  });
  if (strict && gallery.length > 6) throw new Error('The published community gallery can contain no more than six photos.');

  return {
    meetup: upcoming ?? cancelled ?? { ...fallbackContent.meetup, date: null, status: 'scheduled' },
    gallery: gallery.slice(0, 6),
  };
}

export function getStructuredEventStatus(content: CommunityContent, now = new Date()): MeetupStatus {
  return getMeetupStatus(content.meetup, now);
}
