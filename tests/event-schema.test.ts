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
    image: '/images/events/talk-and-sing-2026-11-17.svg',
    entry_price: 0,
    status: 'scheduled',
    venue: 'Charada Pub Savassi',
    address: 'Rua Paraíba, 523 — Belo Horizonte, MG',
    city: 'Belo Horizonte, Minas Gerais, Brasil',
  }],
  gallery: [],
};

test('builds bilingual Event JSON-LD for an ongoing meetup with midnight rollover, image and free admission', () => {
  const event = normalizeCommunityContent(source, now, true).meetup;
  const pt = createEventSchema(event, 'pt-BR', now);
  const en = createEventSchema(event, 'en', now);

  assert.equal(pt?.['@type'], 'Event');
  assert.equal(pt?.name, source.meetups[0].title_pt);
  assert.equal(pt?.description, source.meetups[0].description_pt);
  assert.equal(pt?.startDate, '2026-11-17T18:30:00-03:00');
  assert.equal(pt?.endDate, '2026-11-18T00:00:00-03:00');
  assert.equal(pt?.image, 'https://talk.bh/images/events/talk-and-sing-2026-11-17.svg');
  assert.deepEqual(pt?.offers, { '@type': 'Offer', price: 0, priceCurrency: 'BRL' });
  assert.equal(pt?.performer, undefined);
  assert.equal(en?.name, source.meetups[0].title_en);
  assert.equal(en?.description, source.meetups[0].description_en);
});

test('omits expired or cancelled meetups from Event JSON-LD', () => {
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
