#!/usr/bin/env node
/**
 * One-off maintenance: fix mojibake and inject shared SEO tags.
 * Run: node scripts/site-maintenance.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://tessabobir.com.au';
const OG_IMAGE = `${SITE}/images/hero-bg.png`;

const replacements = [
  ['Ã¢Å“â€°Ã¯Â¸Â ', '✉️ '],
  ['Ã¢Å“â€°Ã¯Â¸Â', '✉️'],
  ['Ã¢â€ Â ', '← '],
  ['Ã¢â€ â€™', '→'],
  ['Ã¢Â Â°', '⏱️'],
  ['Ã¢Â Â±Ã¯Â¸Â ', '⏱️ '],
  ['Ã¢Å“Â¨', '✨'],
  ['Ã¢â‚¬â„¢', "'"],
  ['Ã¢â‚¬â€œ', '–'],
  ['Ã¢â‚¬â€', '—'],
  ['â€™', "'"],
  ['â€œ', '"'],
  ['â€', '"'],
  ['â€”', '—'],
  ['â€“', '–'],
  ['â€º', '›'],
  ['☺️Â "', '☺️"'],
  ['☺️Â\u008fÂ\u008f"', '☺️"'],
  ['☺️\u008fÂ\u008f"', '☺️"'],
  ['Â°C', '°C'],
  ['Â°F', '°F'],
];

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Tessa Bobir',
  description: "Holistic women's wellness — massage, yoni steaming, and wellbeing programs on the Gold Coast.",
  url: SITE,
  image: OG_IMAGE,
  telephone: '+61-423-398-186',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gold Coast',
    addressRegion: 'QLD',
    addressCountry: 'AU',
  },
  sameAs: [
    'https://www.facebook.com/yoniherbsaustralia',
    'https://www.youtube.com/@yoniherbsaustralia9528/videos',
  ],
};

function fixEncoding(content) {
  let out = content;
  for (const [bad, good] of replacements) {
    out = out.split(bad).join(good);
  }
  return out.replace(/[\u0080-\u009f]/g, '');
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : 'Tessa Bobir';
}

function extractDescription(html) {
  const m = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return m ? m[1].trim() : "Holistic women's wellness with Tessa Bobir.";
}

function pageUrl(filename) {
  if (filename === 'index.html') return `${SITE}/`;
  return `${SITE}/${filename}`;
}

function seoBlock(filename, html) {
  const title = extractTitle(html);
  const description = extractDescription(html);
  const url = pageUrl(filename);
  return `
  <link rel="icon" href="images/tessa-bobir-logo.jpg" type="image/jpeg">
  <link rel="apple-touch-icon" href="images/tessa-bobir-logo.jpg">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Tessa Bobir">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${OG_IMAGE}">`;
}

function injectSeo(html, filename) {
  if (html.includes('rel="canonical"')) {
    return html;
  }
  const titleMatch = html.match(/<title>[^<]*<\/title>/i);
  if (!titleMatch) return html;
  let out = html.replace(titleMatch[0], titleMatch[0] + seoBlock(filename, html));
  if (filename === 'index.html' && !out.includes('application/ld+json')) {
    const schema = JSON.stringify(localBusinessSchema, null, 2);
    out = out.replace(
      '</head>',
      `\n  <script type="application/ld+json">\n${schema}\n  </script>\n</head>`
    );
  }
  return out;
}

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
let encodingFixed = 0;
let seoFixed = 0;

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;
  content = fixEncoding(content);
  if (content !== before) encodingFixed++;
  const withSeo = injectSeo(content, file);
  if (withSeo !== content) seoFixed++;
  fs.writeFileSync(filePath, withSeo, 'utf8');
}

console.log(`Processed ${htmlFiles.length} HTML files`);
console.log(`Encoding fixes: ${encodingFixed}`);
console.log(`SEO injections: ${seoFixed}`);

// Lazy-load content images (skip hero / above-the-fold on index)
for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const updated = html.replace(/<img(?![^>]*loading=)/gi, (match, offset) => {
    const slice = html.slice(Math.max(0, offset - 200), offset + 200);
    if (file === 'index.html' && /hero|Hero/.test(slice)) return match;
    return match.replace('<img', '<img loading="lazy" decoding="async"');
  });
  if (updated !== html) fs.writeFileSync(filePath, updated, 'utf8');
}
