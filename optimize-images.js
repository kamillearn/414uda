/**
 * optimize-images.js
 * Converts all PNG/JPG images in /images to WebP, resizes to ≤1200px,
 * and generates a -thumb.webp variant at ≤600px.
 * Filenames are sanitised: spaces and (n) suffixes become hyphens.
 *
 * Usage:
 *   npm install sharp
 *   node optimize-images.js
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const INPUT_DIR = path.join(__dirname, 'images');
const MAX_WIDE  = 1200;
const MAX_THUMB = 600;
const QUALITY   = 80;

/** "2 (1)" → "2-1",  "my file" → "my-file" */
function sanitise(basename) {
  return basename
    .replace(/\s*\((\d+)\)\s*/g, '-$1')  // trailing " (1)" → "-1"
    .replace(/\s+/g, '-')                 // remaining spaces
    .toLowerCase();
}

async function main() {
  const files = fs.readdirSync(INPUT_DIR).filter(f =>
    /\.(png|jpe?g)$/i.test(f) &&
    !f.startsWith('favicon') &&
    !f.startsWith('apple-touch')
  );

  if (files.length === 0) {
    console.log('No images found.');
    return;
  }

  const results = [];

  for (const file of files) {
    const base      = path.parse(file).name;
    const sanitised = sanitise(base);
    const src       = path.join(INPUT_DIR, file);

    // ── Standard (≤1200px wide) ──────────────────────────────────────────
    const webpName  = `${sanitised}.webp`;
    const webpPath  = path.join(INPUT_DIR, webpName);
    const meta      = await sharp(src).metadata();
    await sharp(src)
      .resize({ width: MAX_WIDE, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    const webpSize  = fs.statSync(webpPath).size;
    const origSize  = fs.statSync(src).size;
    console.log(`✓  ${file.padEnd(18)}→  ${webpName.padEnd(20)} ${(origSize/1024).toFixed(0)}KB → ${(webpSize/1024).toFixed(0)}KB`);

    // ── Thumbnail (≤600px wide) ──────────────────────────────────────────
    const thumbName = `${sanitised}-thumb.webp`;
    const thumbPath = path.join(INPUT_DIR, thumbName);
    await sharp(src)
      .resize({ width: MAX_THUMB, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(thumbPath);
    const thumbSize = fs.statSync(thumbPath).size;
    console.log(`   ${' '.padEnd(18)}   ${thumbName.padEnd(20)} → ${(thumbSize/1024).toFixed(0)}KB`);

    results.push({ original: file, webp: webpName, thumb: thumbName });
  }

  console.log('\n── Mapping table (paste into HTML) ─────────────────────────────');
  const BASE = 'https://raw.githubusercontent.com/kamillearn/414uda/main/images/';
  for (const r of results) {
    console.log(`${r.original.padEnd(20)} full  → ${BASE}${r.webp}`);
    console.log(`${' '.padEnd(20)} thumb → ${BASE}${r.thumb}`);
  }
  console.log('\nDone!');
}

main().catch(err => { console.error(err); process.exit(1); });
