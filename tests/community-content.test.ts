import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeCommunityContent } from '../src/data/community-content.ts';
import { getGoogleMapsUrl, getMeetupStatus } from '../src/data/meetup.ts';

const now = new Date('2026-11-13T12:00:00-03:00');

const meetup = (date: string, time = '19:30', status = 'scheduled') => ({
  title_pt: 'Talk BH', title_en: 'Talk BH', date, time, status,
  venue: 'Charada Savassi Cervejaria Artesanal', address: 'Rua Paraíba, 523',
});

test('event state distinguishes future, later today, elapsed, cancelled and absent events', () => {
  assert.equal(getMeetupStatus({ date: '2026-11-14T19:30:00-03:00', status: 'scheduled' }, now), 'upcoming');
  assert.equal(getMeetupStatus({ date: '2026-11-13T19:30:00-03:00', status: 'scheduled' }, now), 'today');
  assert.equal(getMeetupStatus({ date: '2026-11-12T19:30:00-03:00', status: 'scheduled' }, now), 'past');
  assert.equal(getMeetupStatus({ date: '2026-11-14T19:30:00-03:00', status: 'cancelled' }, now), 'cancelled');
  assert.equal(getMeetupStatus({ date: null, status: 'scheduled' }, now), 'none');
});

test('content selects the nearest future meetup and keeps bilingual photo alt text', () => {
  const content = normalizeCommunityContent({
    meetups: [meetup('2026-12-15'), meetup('2026-11-20'), meetup('2026-11-10')],
    gallery: [
      { image: 'src/assets/community/talk-bh.jpg', alt_pt: 'Pessoas conversando', alt_en: 'People talking', rights_confirmed: true },
      { image: 'src/assets/community/hidden.jpg', alt_pt: '', alt_en: 'Another photo', rights_confirmed: true },
    ],
  }, now);

  assert.equal(content.meetup.date, '2026-11-20T19:30:00-03:00');
  assert.equal(content.meetup.title?.en, 'Talk BH');
  assert.equal(content.gallery.length, 1);
  assert.equal(content.gallery[0].alt['pt-BR'], 'Pessoas conversando');
});

test('validates Belo Horizonte late-night times without shifting their local calendar date', () => {
  const content = normalizeCommunityContent({ meetups: [meetup('2026-11-13', '23:30')], gallery: [] }, now);
  assert.equal(content.meetup.date, '2026-11-13T23:30:00-03:00');
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
  assert.throws(() => normalizeCommunityContent({
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
