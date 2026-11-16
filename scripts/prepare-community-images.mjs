import { copyFile, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = fileURLToPath(new URL('../', import.meta.url));
const contentPath = join(rootDirectory, 'src/data/community-content.json');
const publicDirectory = join(rootDirectory, 'public/images/community');
const assetsDirectory = join(rootDirectory, 'src/assets/community');
const supportedExtensions = new Set(['.avif', '.gif', '.jpg', '.jpeg', '.png', '.webp']);

const content = JSON.parse(await readFile(contentPath, 'utf8'));
const gallery = Array.isArray(content.gallery) ? content.gallery : [];

if (gallery.length > 6) {
  throw new Error('The community gallery supports at most six photos.');
}

await mkdir(assetsDirectory, { recursive: true });

// This directory is generated from the CMS-managed originals on each run.
for (const existingFile of await readdir(assetsDirectory)) {
  if (supportedExtensions.has(extname(existingFile).toLowerCase())) {
    await rm(join(assetsDirectory, existingFile), { force: true });
  }
}

const copiedFiles = new Set();

for (const [index, photo] of gallery.entries()) {
  const image = typeof photo?.image === 'string' ? photo.image.trim() : '';
  if (!image) {
    throw new Error('Community photo ' + (index + 1) + ' has no image path.');
  }

  let imageUrl;
  try {
    imageUrl = new URL(image, 'https://talk.bh');
  } catch {
    throw new Error('Community photo path is invalid: ' + image);
  }

  if (imageUrl.origin !== 'https://talk.bh' || !imageUrl.pathname.startsWith('/images/community/')) {
    throw new Error('Community photos must use the CMS media folder /images/community/: ' + image);
  }

  let fileName;
  try {
    fileName = decodeURIComponent(imageUrl.pathname.slice('/images/community/'.length));
  } catch {
    throw new Error('Community photo filename has invalid URL encoding: ' + image);
  }

  if (!fileName || fileName === '.' || fileName === '..' || fileName.includes('/') || fileName.includes(String.fromCharCode(92))) {
    throw new Error('Community photo must reference a single filename inside /images/community/: ' + image);
  }

  if (!supportedExtensions.has(extname(fileName).toLowerCase())) {
    throw new Error('Community photo uses an unsupported image format: ' + fileName);
  }

  if (copiedFiles.has(fileName)) continue;

  const sourcePath = resolve(publicDirectory, fileName);
  if (dirname(sourcePath) !== publicDirectory) {
    throw new Error('Community photo path escapes the CMS media folder: ' + image);
  }

  const sourceStats = await stat(sourcePath).catch(() => null);
  if (!sourceStats?.isFile()) {
    throw new Error('Community photo is missing from public/images/community: ' + fileName);
  }

  await copyFile(sourcePath, join(assetsDirectory, fileName));
  copiedFiles.add(fileName);
}

console.log('Prepared ' + copiedFiles.size + ' community photo(s) from public/images/community for Astro.');
