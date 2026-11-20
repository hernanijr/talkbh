import assert from 'node:assert/strict';
import { readFile, access, stat } from 'node:fs/promises';

const clientDirectory = new URL('../dist/client/', import.meta.url);
const outputDirectory = await stat(clientDirectory).then(() => clientDirectory).catch(() => new URL('../dist/', import.meta.url));
const read = (path) => readFile(new URL(path, outputDirectory), 'utf8');
const pt = await read('index.html');
const en = await read('en/index.html');
const sitemap = await read('sitemap.xml');
const robots = await read('robots.txt');
const admin = await read('admin/index.html');
const cmsConfig = await read('admin/config.yml');
const nextMeetupPt = await read('proximo-encontro/index.html');
const nextMeetupEn = await read('en/next-meetup/index.html');

assert.match(pt, /<html lang="pt-BR">/);
assert.match(en, /<html lang="en">/);
assert.match(pt, /<link rel="canonical" href="https:\/\/talk\.bh\//);
assert.match(en, /<link rel="canonical" href="https:\/\/talk\.bh\/en\//);
assert.ok(pt.includes('Desenvolvimento do site:') && pt.includes('href="https://hernani.dev/?ref=talk.bh"') && pt.includes('>Hernani Junior</a>'), 'The Portuguese page should credit the website developer.');
assert.ok(en.includes('Website development:') && en.includes('href="https://hernani.dev/?ref=talk.bh"') && en.includes('>Hernani Junior</a>'), 'The English page should credit the website developer.');
for (const html of [pt, en]) {
  assert.equal((html.match(/class="cta-arrow"/g) ?? []).length, 2, 'Both hero CTA arrows should use the matching SVG icon style.');
  assert.match(html, /hreflang="pt-BR"/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /https:\/\/chat\.whatsapp\.com\/IjYG3WsRlMf2XM3Ie5oTe9/);
  assert.match(html, /talkbh-language-choice/);
}

const structuredData = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]));
const ptSchema = structuredData(pt);
const enSchema = structuredData(en);
const nextMeetupPtSchema = structuredData(nextMeetupPt);
const nextMeetupEnSchema = structuredData(nextMeetupEn);
assert.equal(nextMeetupPtSchema.filter((item) => item['@type'] === 'Event').length, 0, 'The permanent Portuguese route must not duplicate Event JSON-LD.');
assert.equal(nextMeetupEnSchema.filter((item) => item['@type'] === 'Event').length, 0, 'The permanent English route must not duplicate Event JSON-LD.');
assert.ok(sitemap.includes('<loc>https://talk.bh/proximo-encontro/</loc>'), 'The permanent Portuguese next-meetup URL must always be in the sitemap.');
assert.ok(sitemap.includes('<loc>https://talk.bh/en/next-meetup/</loc>'), 'The permanent English next-meetup URL must always be in the sitemap.');
assert.match(nextMeetupPt, /data-event-detail-link href="\/eventos\/[^"]+\//, 'The Portuguese permanent route should link to the current occurrence page.');
assert.match(nextMeetupEn, /data-event-detail-link href="\/en\/events\/[^"]+\//, 'The English permanent route should link to the current occurrence page.');
for (const [html, language] of [[nextMeetupPt, 'pt-BR'], [nextMeetupEn, 'en']]) {
  assert.match(html, new RegExp('<html lang="' + language + '"'));
  assert.ok(html.includes('<link rel="canonical" href="https://talk.bh/'));
  assert.match(html, /hreflang="pt-BR"/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /property="og:type" content="website"/);
  if (html.includes('data-event-share')) {
    assert.ok(html.includes('data-event-copy-link'), 'A permanent route using the event presentation should expose a copy-link action.');
    assert.ok(html.includes('data-event-share-status'), 'Permanent-route share actions should announce their result accessibly.');
    assert.ok(html.includes('https://wa.me/?text='), 'A permanent route using the event presentation should expose a prefilled WhatsApp share link.');
  } else if (language === 'pt-BR') {
    assert.ok(html.includes('Ainda não há um próximo encontro confirmado.'), 'The Portuguese fallback should explain that no next meetup is confirmed.');
  } else {
    assert.ok(html.includes('The next meetup has not been confirmed yet.'), 'The English fallback should explain that no next meetup is confirmed.');
  }
}
assert.equal(ptSchema.filter((item) => item['@type'] === 'Event').length, 0, 'The homepage should link to event details instead of publishing event structured data itself.');
assert.equal(enSchema.filter((item) => item['@type'] === 'Event').length, 0, 'The English homepage should link to event details instead of publishing event structured data itself.');
for (const [language, schemaBlocks] of [['Portuguese', ptSchema], ['English', enSchema]]) {
  const organization = schemaBlocks.find((item) => item['@type'] === 'Organization');
  assert.ok(organization, `The ${language} page should expose Organization structured data.`);
  assert.equal(organization.name, 'Talk BH');
  assert.equal(organization.logo, 'https://talk.bh/images/brand/talk-bh-logo.webp');
  assert.equal(organization.makesOffer.price, 0);
  assert.equal(organization.makesOffer.priceCurrency, 'BRL');
  assert.match(organization.makesOffer.description, /free|gratuita/i);
}
await access(new URL('images/brand/talk-bh-logo.webp', outputDirectory));
await access(new URL('images/community/whatsapp-invite.svg', outputDirectory));
assert.match(pt, /whatsapp-invite\.svg/);
assert.match(en, /whatsapp-invite\.svg/);
const communityContent = JSON.parse(await readFile(new URL('../src/data/community-content.json', import.meta.url), 'utf8'));
const galleryPhotos = Array.isArray(communityContent.gallery) ? communityContent.gallery : [];
const eventRecords = Array.isArray(communityContent.meetups) ? communityContent.meetups : [];
assert.equal(communityContent.recurring_schedule?.enabled, true, 'The default recurring schedule should be enabled.');
assert.equal(communityContent.recurring_schedule?.weekday, 3, 'The default recurring schedule should use Wednesday.');
assert.equal(communityContent.recurring_schedule?.start_date, '2026-11-25', 'The first weekly meetup is scheduled for 25 November 2026.');
assert.equal(communityContent.recurring_schedule?.time, '18:30');
assert.equal(communityContent.recurring_schedule?.timezone, 'America/Sao_Paulo');
const nextMeetupPoster = communityContent.next_meetup_poster;
if (nextMeetupPoster) {
  assert.match(nextMeetupPoster.event_date, /^\d{4}-\d{2}-\d{2}$/, 'The poster must be linked to an explicit meetup date.');
  const posterUrl = new URL(nextMeetupPoster.image, 'https://talk.bh');
  assert.equal(posterUrl.origin, 'https://talk.bh', 'The next meetup poster must use the Talk BH domain.');
  assert.ok(posterUrl.pathname.startsWith('/images/events/'), 'The next meetup poster must use the dedicated media folder.');
  const fileName = decodeURIComponent(posterUrl.pathname.slice('/images/events/'.length));
  assert.ok(fileName && !fileName.includes('/') && !fileName.includes(String.fromCharCode(92)), 'The poster path must reference one filename.');
  await access(new URL('images/events/' + encodeURIComponent(fileName), outputDirectory));
}

const slugifyEvent = (title) => title.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 48)
  .replace(/-+$/g, '') || 'talk-bh';

for (const record of eventRecords) {
  const slug = record.slug || `${slugifyEvent(record.title_pt)}-${record.date}`;
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Event slugs must be URL-safe.');
  const ptUrl = `https://talk.bh/eventos/${slug}/`;
  const enUrl = `https://talk.bh/en/events/${slug}/`;
  const ptEventPage = await read(`eventos/${slug}/index.html`);
  const enEventPage = await read(`en/events/${slug}/index.html`);
  assert.ok(ptEventPage.includes(`<link rel="canonical" href="${ptUrl}"`), 'Portuguese event pages need a self-referencing canonical URL.');
  assert.ok(enEventPage.includes(`<link rel="canonical" href="${enUrl}"`), 'English event pages need a self-referencing canonical URL.');
  for (const [html, ownUrl] of [[ptEventPage, ptUrl], [enEventPage, enUrl]]) {
    assert.ok(html.includes(`hreflang="pt-BR" href="${ptUrl}"`), 'Event pages must expose the Portuguese alternate.');
    assert.ok(html.includes(`hreflang="en" href="${enUrl}"`), 'Event pages must expose the English alternate.');
    assert.ok(html.includes(`property="og:url" content="${ownUrl}"`), 'Event Open Graph URL must match its canonical URL.');
    assert.ok(html.includes('property="og:type" content="article"'), 'Event pages should use article Open Graph metadata.');
    assert.ok(html.includes(`property="og:image"`), 'Event pages should provide an Open Graph image.');
    assert.ok(html.includes('object-contain'), 'Event posters must be displayed in full without cropping.');
    assert.ok(!html.includes('object-cover'), 'Event posters must not use crop-to-fill styling.');
    assert.ok(html.includes('data-event-share'), 'Event pages should expose the native share action.');
    assert.ok(html.includes('data-event-copy-link'), 'Event pages should expose a copy-link action.');
    assert.ok(html.includes('https://wa.me/?text='), 'Event pages should expose a prefilled WhatsApp share link.');
    assert.ok(html.includes('data-event-share-status'), 'Share actions should announce their result accessibly.');
  }

  const ptEventNodes = structuredData(ptEventPage).filter((item) => item['@type'] === 'Event');
  const enEventNodes = structuredData(enEventPage).filter((item) => item['@type'] === 'Event');
  assert.equal(ptEventNodes.length, enEventNodes.length, 'Both language variants must expose the same event-schema eligibility.');
  assert.ok(ptEventNodes.length <= 1, 'An event detail page must describe one event only.');
  if (ptEventNodes.length === 1) {
    const ptEvent = ptEventNodes[0];
    const enEvent = enEventNodes[0];
    assert.equal(ptEvent.url, ptUrl);
    assert.equal(enEvent.url, enUrl);
    assert.equal(ptEvent.name, record.title_pt);
    assert.equal(enEvent.name, record.title_en);
    assert.equal(ptEvent.description, record.description_pt);
    assert.equal(enEvent.description, record.description_en);
    assert.ok(
      ptEvent.image === 'https://talk.bh/social-card.svg'
        || ptEvent.image.startsWith('https://talk.bh/images/events/'),
      'Event schema should use the uploaded poster or the stable site fallback.',
    );
    assert.ok(['https://schema.org/EventScheduled', 'https://schema.org/EventCancelled'].includes(ptEvent.eventStatus));
    assert.equal(ptEvent.offers.priceCurrency, 'BRL');
    assert.equal(ptEvent.performer, undefined);
    if (record.end_time) {
      assert.ok(ptEvent.endDate, 'A confirmed end time should be represented in Event JSON-LD.');
      assert.equal(enEvent.endDate, ptEvent.endDate, 'Both language variants must expose the same event end time.');
    } else {
      assert.equal(ptEvent.endDate, undefined, 'Do not infer endDate when the CMS has no confirmed event end time.');
      assert.equal(enEvent.endDate, undefined, 'Do not infer endDate in the English page either.');
    }
  }
  assert.ok(sitemap.includes(`<loc>${ptUrl}</loc>`), 'The Portuguese event URL should be included in the sitemap.');
  assert.ok(sitemap.includes(`<loc>${enUrl}</loc>`), 'The English event URL should be included in the sitemap.');
}
const recurringEventSlugs = [...sitemap.matchAll(/<loc>https:\/\/talk\.bh\/eventos\/(talk-bh-encontro-semanal-\d{4}-\d{2}-\d{2})\/<\/loc>/g)]
  .map((match) => match[1]);
const scheduleExceptions = new Set(
  (Array.isArray(communityContent.schedule_exceptions) ? communityContent.schedule_exceptions : [])
    .map((exception) => exception?.date)
    .filter((date) => typeof date === 'string'),
);
const mondayOfWeek = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return new Date(Date.UTC(year, month - 1, day - ((weekday + 6) % 7)))
    .toISOString()
    .slice(0, 10);
};
const replacedWeeks = new Set(
  eventRecords
    .filter((record) => (
      record?.status === 'scheduled'
      && record?.replaces_default_schedule === true
      && typeof record?.date === 'string'
      && /^\\d{4}-\\d{2}-\\d{2}$/.test(record.date)
    ))
    .map((record) => mondayOfWeek(record.date)),
);

let nextRecurringDate = communityContent.recurring_schedule.start_date;
let firstExpectedRecurringDate;
for (let attempt = 0; attempt < 104; attempt += 1) {
  if (!scheduleExceptions.has(nextRecurringDate)
    && !replacedWeeks.has(mondayOfWeek(nextRecurringDate))) {
    firstExpectedRecurringDate = nextRecurringDate;
    break;
  }

  const [year, month, day] = nextRecurringDate.split('-').map(Number);
  nextRecurringDate = new Date(Date.UTC(year, month - 1, day + 7))
    .toISOString()
    .slice(0, 10);
}
assert.ok(firstExpectedRecurringDate, 'The recurring schedule should contain a non-exempt occurrence.');
const expectedRecurringSlug = `talk-bh-encontro-semanal-${firstExpectedRecurringDate}`;
assert.ok(
  recurringEventSlugs.includes(expectedRecurringSlug),
  `The first non-replaced recurring occurrence (${firstExpectedRecurringDate}) should have an individual page in the sitemap.`,
);

for (const slug of recurringEventSlugs) {
  const occurrenceDate = slug.slice(-10);
  assert.ok(
    !scheduleExceptions.has(occurrenceDate),
    `Schedule exception ${occurrenceDate} must not produce a recurring event page.`,
  );
  assert.ok(
    !replacedWeeks.has(mondayOfWeek(occurrenceDate)),
    `A special event that replaces the recurring schedule must suppress its weekly occurrence (${occurrenceDate}).`,
  );
}

for (const slug of recurringEventSlugs) {
  const ptUrl = `https://talk.bh/eventos/${slug}/`;
  const enUrl = `https://talk.bh/en/events/${slug}/`;
  const ptEventPage = await read(`eventos/${slug}/index.html`);
  const enEventPage = await read(`en/events/${slug}/index.html`);
  for (const [html, ownUrl, language] of [
    [ptEventPage, ptUrl, 'pt-BR'],
    [enEventPage, enUrl, 'en'],
  ]) {
    assert.match(html, new RegExp('<html lang="' + language + '"'));
    assert.ok(html.includes(`<link rel="canonical" href="${ownUrl}"`), 'Recurring event pages need self-referencing canonical URLs.');
    assert.ok(html.includes(`hreflang="pt-BR" href="${ptUrl}"`));
    assert.ok(html.includes(`hreflang="en" href="${enUrl}"`));
    assert.ok(html.includes(`property="og:url" content="${ownUrl}"`));
  }

  const ptEventNodes = structuredData(ptEventPage).filter((item) => item['@type'] === 'Event');
  const enEventNodes = structuredData(enEventPage).filter((item) => item['@type'] === 'Event');
  const eventDate = slug.slice(-10);
  const isPast = Date.parse(`${eventDate}T18:30:00-03:00`) < Date.now();
  assert.equal(ptEventNodes.length, isPast ? 0 : 1, 'Only future recurring occurrences should expose Event JSON-LD.');
  assert.equal(enEventNodes.length, ptEventNodes.length, 'PT/EN recurring pages must have matching Event JSON-LD eligibility.');
  if (ptEventNodes.length) {
    assert.equal(ptEventNodes[0].url, ptUrl);
    assert.equal(enEventNodes[0].url, enUrl);
    assert.equal(ptEventNodes[0].startDate, `${eventDate}T21:30:00.000Z`);
    assert.equal(enEventNodes[0].startDate, ptEventNodes[0].startDate);
    assert.equal(ptEventNodes[0].offers.price, 0);
    assert.equal(ptEventNodes[0].offers.priceCurrency, 'BRL');
    assert.equal(ptEventNodes[0].eventAttendanceMode, 'https://schema.org/OfflineEventAttendanceMode');
  }
  assert.ok(sitemap.includes(`<loc>${ptUrl}</loc>`));
  assert.ok(sitemap.includes(`<loc>${enUrl}</loc>`));
}

const imageTags = (html) => html.split('<img').slice(1).map((part) => '<img' + part.split('>')[0] + '>');
for (const photo of galleryPhotos) {
  const photoUrl = new URL(photo.image, 'https://talk.bh');
  assert.equal(photoUrl.origin, 'https://talk.bh', 'Community photos must use local CMS assets.');
  assert.ok(photoUrl.pathname.startsWith('/images/community/'), 'Community photos must use the CMS media folder.');
  const fileName = decodeURIComponent(photoUrl.pathname.slice('/images/community/'.length));
  assert.ok(fileName && !fileName.includes('/') && !fileName.includes(String.fromCharCode(92)), 'Community photo paths must reference one filename.');
  await access(new URL('images/community/' + encodeURIComponent(fileName), outputDirectory));

  const ptTag = imageTags(pt).find((tag) => tag.includes('alt="' + photo.alt_pt + '"'));
  const enTag = imageTags(en).find((tag) => tag.includes('alt="' + photo.alt_en + '"'));
  assert.ok(ptTag, 'The Portuguese page should render every published community photo.');
  assert.ok(enTag, 'The English page should render every published community photo.');
  assert.ok(ptTag.includes('srcset='), 'Community photos should use Astro responsive image variants.');
  assert.ok(enTag.includes('srcset='), 'Community photos should use Astro responsive image variants.');
  assert.ok(ptTag.includes('.webp'), 'Community photos should be delivered as WebP.');
  assert.ok(enTag.includes('.webp'), 'Community photos should be delivered as WebP.');
}

const adminPreview = await read('admin/preview.js');
const adminStyles = await read('admin/admin.css');
assert.ok(admin.includes('/admin/admin.css'), 'The CMS editor should load its thumbnail stylesheet.');
assert.ok(adminPreview.includes('getAsset'), 'The CMS preview should resolve Decap image assets.');
assert.ok(adminStyles.includes('max-height: 160px'), 'CMS editor thumbnails should have a display-height limit.');

await access(new URL('images/brand/talk-bh-mark.webp', outputDirectory));
const localFontFiles = [
  'dm-sans-latin-ext-400-normal.woff2',
  'dm-sans-latin-400-normal.woff2',
  'dm-sans-latin-ext-500-normal.woff2',
  'dm-sans-latin-500-normal.woff2',
  'dm-sans-latin-ext-600-normal.woff2',
  'dm-sans-latin-600-normal.woff2',
  'dm-sans-latin-ext-700-normal.woff2',
  'dm-sans-latin-700-normal.woff2',
  'dm-mono-latin-ext-400-normal.woff2',
  'dm-mono-latin-400-normal.woff2',
  'dm-mono-latin-ext-500-normal.woff2',
  'dm-mono-latin-500-normal.woff2',
  'space-grotesk-latin-ext-400-normal.woff2',
  'space-grotesk-latin-400-normal.woff2',
  'space-grotesk-latin-ext-500-normal.woff2',
  'space-grotesk-latin-500-normal.woff2',
  'space-grotesk-latin-ext-600-normal.woff2',
  'space-grotesk-latin-600-normal.woff2',
  'space-grotesk-latin-ext-700-normal.woff2',
  'space-grotesk-latin-700-normal.woff2',
];
for (const fontFile of localFontFiles) {
  await access(new URL(`fonts/${fontFile}`, outputDirectory));
}
for (const html of [pt, en]) {
  assert.match(html, /href="\/fonts\/dm-sans-latin-400-normal\.woff2"/);
  assert.match(html, /href="\/fonts\/dm-mono-latin-400-normal\.woff2"/);
  assert.match(html, /href="\/fonts\/space-grotesk-latin-700-normal\.woff2"/);
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/);
}
assert.match(pt, /BELO HORIZONTE · BRASIL/);
assert.match(en, /BELO HORIZONTE · BRAZIL/);
assert.match(pt, /Um novo idioma, um novo mapa/i);
assert.match(en, /A new language, a new map/i);
assert.match(admin, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(admin, /decap-cms@(\^3\.0\.0|3\.\d+\.\d+)/);
assert.match(cmsConfig, /name: turbo-github/);
assert.match(cmsConfig, /publish_mode: editorial_workflow/);
assert.doesNotMatch(cmsConfig, /turbo_site_id: SET_AFTER_CREATING_TALK_BH_SITE/);
assert.match(cmsConfig, /turbo_site_id: 63bc3ac0-e116-4c37-9e8d-a6d47b2010ac/);
assert.match(cmsConfig, /name: next_meetup_poster/);
assert.match(cmsConfig, /name: event_date, widget: string, required: true, hint: "Use AAAA-MM-DD/);
assert.doesNotMatch(cmsConfig, /name: event_date, widget: date/);
assert.match(cmsConfig, /name: end_time, widget: string, required: false/);
assert.match(cmsConfig, /name: recurring_schedule/);
assert.match(cmsConfig, /name: schedule_exceptions/);
assert.match(cmsConfig, /name: replaces_default_schedule, widget: boolean/);
assert.match(sitemap, /https:\/\/talk\.bh\//);
assert.match(sitemap, /https:\/\/talk\.bh\/en\//);
assert.doesNotMatch(sitemap, /preview|draft/i);
assert.match(robots, /Sitemap: https:\/\/talk\.bh\/sitemap\.xml/);
assert.match(robots, /Allow: \//);
assert.doesNotMatch(robots, /Disallow: \/admin\//, 'Search crawlers must be able to read the Admin page noindex directive.');
assert.doesNotMatch(pt, /description_en|Weekly Talk BH Meetup|Bernardo Vasconcellos|2026-11-11T19:30|2026-11-12T19:30/);
assert.equal(await (async () => { try { await access(new URL('preview/index.html', outputDirectory)); return true; } catch { return false; } })(), false, 'Draft preview content must not be emitted as a public static page.');

console.log('Generated PT/EN SEO, sitemap, invite, logo, CMS configuration and draft-preview checks passed.');
