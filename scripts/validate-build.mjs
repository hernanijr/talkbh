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

assert.match(pt, /<html lang="pt-BR">/);
assert.match(en, /<html lang="en">/);
assert.match(pt, /<link rel="canonical" href="https:\/\/talk\.bh\//);
assert.match(en, /<link rel="canonical" href="https:\/\/talk\.bh\/en\//);
assert.ok(pt.includes('Desenvolvimento do site:') && pt.includes('href="https://hernani.dev"') && pt.includes('>Hernani Junior</a>'), 'The Portuguese page should credit the website developer.');
assert.ok(en.includes('Website development:') && en.includes('href="https://hernani.dev"') && en.includes('>Hernani Junior</a>'), 'The English page should credit the website developer.');
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
for (const [language, schemaBlocks] of [['Portuguese', ptSchema], ['English', enSchema]]) {
  const organization = schemaBlocks.find((item) => item['@type'] === 'Organization');
  assert.ok(organization, `The ${language} page should expose Organization structured data.`);
  assert.equal(organization.name, 'Talk BH');
  assert.equal(organization.logo, 'https://talk.bh/images/brand/talk-bh-logo.webp');
  assert.equal(organization.makesOffer.price, 0);
  assert.equal(organization.makesOffer.priceCurrency, 'BRL');
  assert.match(organization.makesOffer.description, /free|gratuita/i);
  for (const event of schemaBlocks.filter((item) => item['@type'] === 'Event')) {
    assert.ok(Date.parse(event.startDate) > Date.now(), 'Only future meetups may be emitted as Event structured data.');
    assert.equal(event.eventStatus, 'https://schema.org/EventScheduled');
  }
}
await access(new URL('images/brand/talk-bh-logo.webp', outputDirectory));
await access(new URL('images/community/whatsapp-invite.svg', outputDirectory));
assert.match(pt, /whatsapp-invite\.svg/);
assert.match(en, /whatsapp-invite\.svg/);
const communityContent = JSON.parse(await readFile(new URL('../src/data/community-content.json', import.meta.url), 'utf8'));
const galleryPhotos = Array.isArray(communityContent.gallery) ? communityContent.gallery : [];
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

assert.match(sitemap, /https:\/\/talk\.bh\//);
assert.match(sitemap, /https:\/\/talk\.bh\/en\//);
assert.doesNotMatch(sitemap, /preview|draft/i);
assert.match(robots, /Sitemap: https:\/\/talk\.bh\/sitemap\.xml/);
assert.match(robots, /Disallow: \/admin\//);
assert.doesNotMatch(pt, /description_en|Weekly Talk BH Meetup|Bernardo Vasconcellos|2026-11-11T19:30|2026-11-12T19:30/);
assert.equal(await (async () => { try { await access(new URL('preview/index.html', outputDirectory)); return true; } catch { return false; } })(), false, 'Draft preview content must not be emitted as a public static page.');

console.log('Generated PT/EN SEO, sitemap, invite, logo, CMS configuration and draft-preview checks passed.');
