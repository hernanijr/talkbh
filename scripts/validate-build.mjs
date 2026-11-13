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
for (const html of [pt, en]) {
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
