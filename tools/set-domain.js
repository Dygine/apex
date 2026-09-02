#!/usr/bin/env node
/* ==========================================================================
   APEX — set-domain.js
   The live domain appears in eleven places across the project: a canonical
   link and an og:url on each of the seven pages, plus robots.txt,
   sitemap.xml and js/config.js. Missing one of them is the commonest way a
   launch goes wrong — Google indexes example.com, or a shared link previews
   as a dead URL.

   Run this once, on launch day, instead of hand-editing eleven files:

       node tools/set-domain.js https://www.apexifm.in

   It is safe to run more than once. It rewrites whatever domain is currently
   in place, so if the domain changes later you just run it again.
   ========================================================================== */

const fs   = require('fs');
const path = require('path');

const raw = process.argv[2];
if (!raw) {
  console.error('\nUsage: node tools/set-domain.js https://www.yourdomain.com\n');
  process.exit(1);
}
if (!/^https?:\/\/[^\/\s]+$/.test(raw.replace(/\/+$/, ''))) {
  console.error('\nThat does not look like a bare origin.');
  console.error('Expected something like https://www.apexifm.in — no path, no trailing slash.\n');
  process.exit(1);
}

const DOMAIN = raw.replace(/\/+$/, '');
const ROOT   = path.join(__dirname, '..');

/* Matches any origin already sitting in the files, so this works on a fresh
   checkout and on a site that has been stamped before. */
const ORIGIN = /https?:\/\/(?:www\.)?(?:example\.com|[a-z0-9-]+(?:\.[a-z0-9-]+)+)(?=\/|"|<|\s|$)/gi;

const PAGES = ['index.html', 'about.html', 'services.html', 'industries.html',
               'process.html', 'work.html', 'contact.html', '404.html'];

let touched = 0;

function edit(file, fn) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  const before = fs.readFileSync(p, 'utf8');
  const after  = fn(before);
  if (after !== before) { fs.writeFileSync(p, after); touched++; console.log('  updated', file); }
}

/* Pages: only the canonical, og:url and og:image lines. Deliberately not a
   blanket replace — an external link in the body must survive. */
PAGES.forEach(f => edit(f, s => s
  .replace(/(<link rel="canonical" href=")[^"]*(")/g,      (m, a, b) => a + DOMAIN + canonicalPath(f) + b)
  .replace(/(<meta property="og:url" content=")[^"]*(")/g, (m, a, b) => a + DOMAIN + canonicalPath(f) + b)
  .replace(/(<meta property="og:image" content=")(?!https?:)([^"]*)(")/g,
           (m, a, rel, b) => a + DOMAIN + '/' + rel.replace(/^\.?\//, '') + b)
  .replace(/("logo":\s*")[^"]*(")/g,  (m, a, b) => a + DOMAIN + '/assets/brand/apex-logo.png' + b)
  .replace(/("url":\s*")[^"]*(")/g,   (m, a, b) => a + DOMAIN + '/' + b)
));

function canonicalPath(f) { return f === 'index.html' ? '/' : '/' + f; }

edit('robots.txt',   s => s.replace(ORIGIN, DOMAIN).replace(/^# Replace.*\n/m, ''));
edit('sitemap.xml',  s => s.replace(ORIGIN, DOMAIN).replace(/^\s*<!-- Replace[\s\S]*?-->\n/m, ''));
edit('js/config.js', s => s.replace(/(domain:\s*')[^']*(')/, (m, a, b) => a + DOMAIN + b));

console.log('\nDomain set to ' + DOMAIN + ' across ' + touched + ' files.\n');
console.log('Still to do before you go live:');
console.log('  1. js/config.js — real phone, email and WhatsApp number, and set');
console.log('     each confirmed:true. The WhatsApp value is digits only, no plus.');
console.log('  2. js/config.js — set demoMode:false to hide the demonstration notices.');
console.log('  3. Submit ' + DOMAIN + '/sitemap.xml in Google Search Console.\n');
