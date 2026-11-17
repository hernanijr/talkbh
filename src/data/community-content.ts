import { getGoogleMapsUrl, getMeetupStatus, type MeetupStatus } from './meetup.ts';
import { site, type Language } from './site.ts';

export type CommunityMeetup = {
  title?: Record<Language, string>;
  description?: Record<Language, string>;
  date: string | null;
  endDate?: string;
  image?: string;
  entryPrice?: number;
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
  description_pt?: unknown;
  description_en?: unknown;
  date?: unknown;
  time?: unknown;
  end_time?: unknown;
  image?: unknown;
  entry_price?: unknown;
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

function nextCalendarDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return [
    String(next.getUTCFullYear()).padStart(4, '0'),
    String(next.getUTCMonth() + 1).padStart(2, '0'),
    String(next.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function toEndDateTime(date: string, startTime: string, endTime: string): string | undefined {
  if (!toDateTime(date, startTime) || !toDateTime(date, endTime)) return undefined;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const endIsNextDay = endHour * 60 + endMinute <= startHour * 60 + startMinute;
  return toDateTime(endIsNextDay ? nextCalendarDate(date) : date, endTime);
}

function meetupFromRecord(record: MeetupRecord, strict: boolean): CommunityMeetup | undefined {
  const titlePt = clean(record.title_pt);
  const titleEn = clean(record.title_en);
  const descriptionPt = clean(record.description_pt);
  const descriptionEn = clean(record.description_en);
  const date = clean(record.date);
  const time = clean(record.time);
  const endTime = clean(record.end_time);
  const image = clean(record.image);
  const entryPrice = record.entry_price === undefined ? undefined
    : typeof record.entry_price === 'number' ? record.entry_price : Number.NaN;
  const status = record.status;
  const venue = clean(record.venue);
  const address = clean(record.address);
  const city = clean(record.city) || 'Belo Horizonte, Minas Gerais, Brasil';
  const mapsUrl = clean(record.maps_url);
  const validDate = toDateTime(date, time);
  const endDate = endTime ? toEndDateTime(date, time, endTime) : undefined;
  const validEndDate = !endTime || Boolean(endDate);
  const validImage = /^\/images\/events\/[a-z0-9][a-z0-9._-]*\.(avif|jpe?g|png|svg|webp)$/i.test(image);
  const validPrice = entryPrice === undefined || (Number.isFinite(entryPrice) && entryPrice >= 0);
  const validStatus = status === 'scheduled' || status === 'cancelled';
  const validMapsUrl = !mapsUrl || Boolean(getGoogleMapsUrl(mapsUrl));
  const validStructuredFields = !strict || (
    Boolean(descriptionPt) && Boolean(descriptionEn) && validImage
    && entryPrice !== undefined && validPrice
  );
  if (!titlePt || !titleEn || !validDate || !validEndDate || !validPrice || !validStatus
    || !venue || !address || !validMapsUrl || !validStructuredFields) {
    if (strict) throw new Error('A meetup needs bilingual titles and descriptions, a valid date/time, an optional valid end time, a local event image, a non-negative admission price, status, venue and address; the Maps URL must be valid HTTPS Google Maps.');
    return undefined;
  }
  return {
    title: { 'pt-BR': titlePt, en: titleEn },
    description: { 'pt-BR': descriptionPt, en: descriptionEn },
    date: validDate,
    ...(endDate ? { endDate } : {}),
    image,
    entryPrice,
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
