import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeCommunityContent } from '../src/data/community-content.ts';
import { createEventSchema } from '../src/data/event-schema.ts';

const now = new Date('2026-11-17T22:00:00-03:00');
const source = {
  meetups: [{
    title_pt: 'Talk & Sing — conversação em inglês e karaokê',
    title_en: 'Talk & Sing — English conversation and karaoke',
    description_pt: 'Encontro descontraído para praticar inglês e cantar.',
    description_en: 'A relaxed meetup to practice English and sing.',
    date: '2026-11-17',
    time: '18:30',
    end_time: '00:00',
    entry_price: 0,
    status: 'scheduled',
    venue: 'Charada Pub Savassi',
    address: 'Rua Paraíba, 523 — Belo Horizonte, MG',
    city: 'Belo Horizonte, Minas Gerais, Brasil',
  }],
  next_meetup_poster: { event_date: '2026-11-17', image: '/images/events/test-event.webp' },
  gallery: [],
};

test('builds bilingual Event JSON-LD for an ongoing meetup with midnight rollover, image and free admission', () => {
  const event = normalizeCommunityContent(source, now, true).meetup;
  const pt = createEventSchema(event, 'pt-BR', now, 'https://talk.bh/eventos/talk-sing-2026-11-17/');
  const en = createEventSchema(event, 'en', now, 'https://talk.bh/en/events/talk-sing-2026-11-17/');

  assert.equal(pt?.['@type'], 'Event');
  assert.equal(pt?.name, source.meetups[0].title_pt);
  assert.equal(pt?.description, source.meetups[0].description_pt);
  assert.equal(pt?.url, 'https://talk.bh/eventos/talk-sing-2026-11-17/');
  assert.equal(pt?.startDate, '2026-11-17T18:30:00-03:00');
  assert.equal(pt?.endDate, '2026-11-18T00:00:00-03:00');
  assert.equal(pt?.image, 'https://talk.bh/images/events/test-event.webp');
  assert.deepEqual(pt?.offers, { '@type': 'Offer', price: 0, priceCurrency: 'BRL' });
  assert.equal(en?.name, source.meetups[0].title_en);
  assert.equal(en?.description, source.meetups[0].description_en);
});

test('uses the site default image when no poster is configured', () => {
  const { next_meetup_poster: _poster, ...sourceWithoutPoster } = source;
  const event = normalizeCommunityContent(sourceWithoutPoster, now, true).meetup;
  const schema = createEventSchema(event, 'pt-BR', now);
  assert.equal(schema?.image, 'https://talk.bh/social-card.svg');
});

test('falls back to the default after the linked meetup has passed', () => {
  const afterEvent = new Date('2026-11-18T12:00:00-03:00');
  const event = normalizeCommunityContent({
    ...source,
    meetups: [
      source.meetups[0],
      { ...source.meetups[0], date: '2026-11-20', time: '19:30', end_time: '21:30' },
    ],
  }, afterEvent, true).meetup;
  const schema = createEventSchema(event, 'pt-BR', afterEvent);

  assert.equal(event.date, '2026-11-20T19:30:00-03:00');
  assert.equal(event.image, undefined);
  assert.equal(schema?.image, 'https://talk.bh/social-card.svg');
});

test('uses EventCancelled for a cancelled event that has not started yet', () => {
  const cancelledEvent = normalizeCommunityContent({
    ...source,
    meetups: [{ ...source.meetups[0], status: 'cancelled' }],
  }, new Date('2026-11-17T12:00:00-03:00'), true).meetup;
  const schema = createEventSchema(cancelledEvent, 'pt-BR', new Date('2026-11-17T12:00:00-03:00'));
  assert.equal(schema?.eventStatus, 'https://schema.org/EventCancelled');
});

test('omits expired or cancelled meetups from Event JSON-LD after their scheduled time', () => {
  const expired = normalizeCommunityContent({
    ...source,
    meetups: [{ ...source.meetups[0], date: '2026-11-16' }],
  }, now, true).meetup;
  const cancelled = normalizeCommunityContent({
    ...source,
    meetups: [{ ...source.meetups[0], status: 'cancelled' }],
  }, now, true).meetup;

  assert.equal(createEventSchema(expired, 'pt-BR', now), undefined);
  assert.equal(createEventSchema(cancelled, 'pt-BR', now), undefined);
});
