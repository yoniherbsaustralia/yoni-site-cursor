#!/usr/bin/env node
/** Compress large JPEG/PNG in images/ for web. Requires: npm install sharp (in scripts/) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const imagesDir = path.join(root, 'images');
const require = createRequire(import.meta.url);

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Run once: cd scripts && npm install sharp');
  process.exit(1);
}

const MAX_WIDTH = 1600;
const QUALITY = 82;
const exts = new Set(['.jpg', '.jpeg', '.png']);

for (const name of fs.readdirSync(imagesDir)) {
  const ext = path.extname(name).toLowerCase();
  if (!exts.has(ext)) continue;
  const filePath = path.join(imagesDir, name);
  const stat = fs.statSync(filePath);
  if (stat.size < 400_000) continue;

  const img = sharp(filePath);
  const meta = await img.metadata();
  if (meta.width && meta.width <= MAX_WIDTH && stat.size < 800_000) continue;

  const buf =
    ext === '.png'
      ? await img.rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).png({ quality: 80, compressionLevel: 9 }).toBuffer()
      : await img.rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();

  if (buf.length < stat.size) {
    try {
      fs.writeFileSync(filePath, buf);
      console.log(`${name}: ${Math.round(stat.size / 1024)}KB -> ${Math.round(buf.length / 1024)}KB`);
    } catch (err) {
      console.warn(`Skip ${name}: ${err.message}`);
    }
  }
}

console.log('Done.');
