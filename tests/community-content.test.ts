import assert from 'node:assert/strict';
import test from 'node:test';
import { createMeetupSlug, normalizeCommunityContent, normalizeCommunityMeetups } from '../src/data/community-content.ts';
import { getGoogleMapsUrl, getMeetupStatus } from '../src/data/meetup.ts';

const now = new Date('2026-11-13T12:00:00-03:00');


const recurringSchedule = {
  enabled: true,
  weekday: 3,
  start_date: '2026-11-25',
  time: '18:30',
  timezone: 'America/Sao_Paulo',
  title_pt: 'Talk BH — encontro semanal de conversação em inglês',
  title_en: 'Talk BH — weekly English conversation meetup',
  description_pt: 'Encontro semanal para praticar inglês em um ambiente leve e informal.',
  description_en: 'A weekly meetup to practice English in a relaxed, informal setting.',
  entry_price: 0,
  venue: 'Charada Savassi Cervejaria Artesanal',
  city: 'Belo Horizonte, Minas Gerais, Brasil',
  address: 'Rua Paraíba, 523 — Belo Horizonte, MG',
  maps_url: 'https://www.google.com/maps/search/?api=1&query=Charada+Savassi',
};

const meetup = (date: string, time = '19:30', status = 'scheduled', endTime = '21:30') => ({
  title_pt: 'Talk BH', title_en: 'Talk BH',
  description_pt: 'Encontro para praticar inglês.', description_en: 'A meetup to practice English.',
  date, time, end_time: endTime, entry_price: 0, status,
  venue: 'Charada Savassi Cervejaria Artesanal', address: 'Rua Paraíba, 523',
});

test('event state distinguishes future, later today, elapsed, cancelled, absent and ongoing events', () => {
  assert.equal(getMeetupStatus({ date: '2026-11-14T19:30:00-03:00', status: 'scheduled' }, now), 'upcoming');
  assert.equal(getMeetupStatus({ date: '2026-11-13T19:30:00-03:00', status: 'scheduled' }, now), 'today');
  assert.equal(getMeetupStatus({ date: '2026-11-12T19:30:00-03:00', status: 'scheduled' }, now), 'past');
  assert.equal(getMeetupStatus({ date: '2026-11-14T19:30:00-03:00', status: 'cancelled' }, now), 'cancelled');
  assert.equal(getMeetupStatus({ date: null, status: 'scheduled' }, now), 'none');
  assert.equal(getMeetupStatus({
    date: '2026-11-13T18:30:00-03:00',
    endDate: '2026-11-14T00:00:00-03:00',
    status: 'scheduled',
  }, new Date('2026-11-13T22:00:00-03:00')), 'today');
  assert.equal(getMeetupStatus({
    date: '2026-11-13T18:30:00-03:00',
    endDate: '2026-11-14T00:00:00-03:00',
    status: 'scheduled',
  }, new Date('2026-11-14T00:00:00-03:00')), 'past');
});

test('content selects the nearest future meetup and keeps bilingual photo alt text', () => {
  const content = normalizeCommunityContent({
    meetups: [meetup('2026-12-15'), meetup('2026-11-20'), meetup('2026-11-10')],
    next_meetup_poster: { event_date: '2026-11-20', image: '/images/events/next-meetup.webp' },
    gallery: [
      { image: 'src/assets/community/talk-bh.jpg', alt_pt: 'Pessoas conversando', alt_en: 'People talking', rights_confirmed: true },
      { image: 'src/assets/community/hidden.jpg', alt_pt: '', alt_en: 'Another photo', rights_confirmed: true },
    ],
  }, now);

  assert.equal(content.meetup.date, '2026-11-20T19:30:00-03:00');
  assert.equal(content.meetup.title?.en, 'Talk BH');
  assert.equal(content.meetup.slug, 'talk-bh-2026-11-20');
  assert.equal(content.meetup.image, '/images/events/next-meetup.webp');
  assert.equal(content.gallery.length, 1);
  assert.equal(content.gallery[0].alt['pt-BR'], 'Pessoas conversando');
});


test('recurring schedule starts on Wednesday November 25 and repeats every week at 18:30', () => {
  const input = { meetups: [], recurring_schedule: recurringSchedule, schedule_exceptions: [], gallery: [] };
  const beforeThisWednesday = normalizeCommunityContent(input, new Date('2026-11-18T12:00:00-03:00'), true).meetup;
  assert.equal(beforeThisWednesday.date, '2026-11-25T21:30:00.000Z');
  assert.equal(beforeThisWednesday.source, 'recurring');
  assert.equal(beforeThisWednesday.slug, undefined);

  const beforeFirstStart = normalizeCommunityContent(input, new Date('2026-11-25T17:59:00-03:00'), true).meetup;
  assert.equal(beforeFirstStart.date, '2026-11-25T21:30:00.000Z');

  const afterFirstStart = normalizeCommunityContent(input, new Date('2026-11-25T18:31:00-03:00'), true).meetup;
  assert.equal(afterFirstStart.date, '2026-11-25T21:30:00.000Z');

  const followingDay = normalizeCommunityContent(input, new Date('2026-11-26T00:01:00-03:00'), true).meetup;
  assert.equal(followingDay.date, '2026-12-02T21:30:00.000Z');
});

test('recurring schedule can skip one Wednesday without disabling future weeks', () => {
  const content = normalizeCommunityContent({
    meetups: [],
    recurring_schedule: recurringSchedule,
    schedule_exceptions: [{ date: '2026-11-25', reason: 'No meetup this week' }],
    gallery: [],
  }, new Date('2026-11-18T12:00:00-03:00'), true);

  assert.equal(content.meetup.date, '2026-12-02T21:30:00.000Z');
});

test('a special meetup replaces the default occurrence only when explicitly flagged', () => {
  const special = { ...meetup('2026-11-27', '20:00'), replaces_default_schedule: true };
  const replaced = normalizeCommunityContent({
    meetups: [special],
    recurring_schedule: recurringSchedule,
    schedule_exceptions: [],
    gallery: [],
  }, new Date('2026-11-24T12:00:00-03:00'), true);
  assert.equal(replaced.meetup.date, '2026-11-27T23:00:00.000Z');
  assert.equal(replaced.meetup.slug, 'talk-bh-2026-11-27');

  const additional = normalizeCommunityContent({
    meetups: [{ ...special, replaces_default_schedule: false }],
    recurring_schedule: recurringSchedule,
    schedule_exceptions: [],
    gallery: [],
  }, new Date('2026-11-24T12:00:00-03:00'), true);
  assert.equal(additional.meetup.date, '2026-11-25T21:30:00.000Z');
  assert.equal(additional.meetup.source, 'recurring');
});

test('a disabled recurring schedule leaves only explicitly registered meetups', () => {
  const content = normalizeCommunityContent({
    meetups: [],
    recurring_schedule: { ...recurringSchedule, enabled: false },
    schedule_exceptions: [],
    gallery: [],
  }, new Date('2026-11-18T12:00:00-03:00'), true);

  assert.equal(content.meetup.date, null);
});

test('recurring schedule rejects a first date that does not match its configured weekday', () => {
  assert.throws(() => normalizeCommunityContent({
    meetups: [],
    recurring_schedule: { ...recurringSchedule, start_date: '2026-11-24' },
    schedule_exceptions: [],
    gallery: [],
  }, new Date('2026-11-18T12:00:00-03:00'), true));
});

test('rolls event end times after midnight into the next calendar date', () => {
  const content = normalizeCommunityContent({ meetups: [meetup('2026-11-13', '18:30', 'scheduled', '00:00')], gallery: [] }, now);
  assert.equal(content.meetup.date, '2026-11-13T18:30:00-03:00');
  assert.equal(content.meetup.endDate, '2026-11-14T00:00:00-03:00');
});

test('keeps a same-day meetup active when no confirmed end time is provided', () => {
  const { end_time: _endTime, ...withoutEndTime } = meetup('2026-11-13', '18:30');
  const event = normalizeCommunityContent({ meetups: [withoutEndTime], gallery: [] }, now, true).meetup;

  assert.equal(getMeetupStatus(event, new Date('2026-11-13T22:00:00-03:00')), 'today');
  assert.equal(getMeetupStatus(event, new Date('2026-11-14T00:00:00-03:00')), 'past');
});

test('normalizes descriptions, matching next meetup poster and free admission', () => {
  const content = normalizeCommunityContent({
    meetups: [meetup('2026-11-20')],
    next_meetup_poster: { event_date: '2026-11-20', image: '/images/events/test-event.webp' },
    gallery: [],
  }, now, true);
  assert.equal(content.meetup.description?.['pt-BR'], 'Encontro para praticar inglês.');
  assert.equal(content.meetup.image, '/images/events/test-event.webp');
  assert.equal(content.meetup.entryPrice, 0);
});

test('accepts a meetup without a separate poster', () => {
  const content = normalizeCommunityContent({ meetups: [meetup('2026-11-20')], gallery: [] }, now, true);
  assert.equal(content.meetup.image, undefined);
  assert.equal(content.meetup.title?.['pt-BR'], 'Talk BH');
});

test('ignores an old poster after its linked meetup has passed', () => {
  const content = normalizeCommunityContent({
    meetups: [meetup('2026-11-17'), meetup('2026-11-20')],
    next_meetup_poster: { event_date: '2026-11-17', image: '/images/events/old-poster.webp' },
    gallery: [],
  }, new Date('2026-11-18T12:00:00-03:00'), true);

  assert.equal(content.meetup.date, '2026-11-20T19:30:00-03:00');
  assert.equal(content.meetup.image, undefined);
});

test('rejects malformed next meetup poster metadata', () => {
  assert.throws(() => normalizeCommunityContent({
    meetups: [meetup('2026-11-20')],
    next_meetup_poster: { event_date: '2026-02-30', image: '/images/events/poster.webp' },
    gallery: [],
  }, now, true));
  assert.throws(() => normalizeCommunityContent({
    meetups: [meetup('2026-11-20')],
    next_meetup_poster: { event_date: '2026-11-20', image: '/images/community/old-photo.jpg' },
    gallery: [],
  }, now, true));
});

test('a future cancellation is preserved when no scheduled meetup is upcoming', () => {
  const content = normalizeCommunityContent({ meetups: [meetup('2026-11-20', '19:30', 'cancelled')], gallery: [] }, now);
  assert.equal(content.meetup.status, 'cancelled');
});

test('strict content rejects invalid dates, Maps links, photo permissions, alt text and gallery sizes', () => {
  assert.throws(() => normalizeCommunityContent({
    meetups: [{ ...meetup('2026-02-30'), maps_url: 'javascript:alert(1)' }], gallery: [],
  }, now, true));
  assert.throws(() => normalizeCommunityContent({
    meetups: [], gallery: [{ image: 'src/assets/community/photo.jpg', alt_pt: 'Foto', alt_en: '', rights_confirmed: true }],
  }, now, true));
  assert.throws(() => normalizeCommunityContent({
    meetups: [], gallery: [{ image: 'src/assets/community/photo.jpg', alt_pt: 'Foto', alt_en: 'Photo', rights_confirmed: false }],
  }, now, true));
  assert.doesNotThrow(() => normalizeCommunityContent({
    meetups: [], gallery: [1, 2].map((_, i) => ({ image: `src/assets/community/${i}.jpg`, alt_pt: 'Foto', alt_en: 'Photo', rights_confirmed: true })),
  }, now, true));
  assert.throws(() => normalizeCommunityContent({
    meetups: [], gallery: Array.from({ length: 7 }, (_, i) => ({ image: `src/assets/community/${i}.jpg`, alt_pt: 'Foto', alt_en: 'Photo', rights_confirmed: true })),
  }, now, true));
});

test('Google Maps CTA accepts only HTTPS Google Maps URLs', () => {
  assert.ok(getGoogleMapsUrl('https://maps.google.com/?q=Belo+Horizonte'));
  assert.equal(getGoogleMapsUrl('http://maps.google.com/?q=Belo+Horizonte'), undefined);
  assert.equal(getGoogleMapsUrl('https://example.com/'), undefined);
});

test('generates safe date-qualified event slugs and accepts an explicit stable slug', () => {
  assert.equal(createMeetupSlug('Talk & Sing — conversação em inglês', '2026-11-17'), 'talk-sing-conversacao-em-ingles-2026-11-17');
  const generated = normalizeCommunityMeetups({ meetups: [meetup('2026-11-20')] }, now, true);
  assert.equal(generated[0].slug, 'talk-bh-2026-11-20');

  const custom = normalizeCommunityMeetups({
    meetups: [{ ...meetup('2026-11-20'), slug: 'talk-bh-community-night' }],
  }, now, true);
  assert.equal(custom[0].slug, 'talk-bh-community-night');
});

test('rejects duplicate event URLs before static generation', () => {
  assert.throws(() => normalizeCommunityMeetups({
    meetups: [
      meetup('2026-11-20'),
      { ...meetup('2026-11-20'), title_pt: 'Different title', title_en: 'Different title', slug: 'talk-bh-2026-11-20' },
    ],
  }, now, true));
});
