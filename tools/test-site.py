#!/usr/bin/env python3
"""Production-readiness check for the Apex site.

Runs every page in headless Chromium and reports console errors, failed
requests, broken internal links, missing images, horizontal overflow, and the
SEO and accessibility basics that actually get a site rejected.

    cd apex-integrated-facility-management
    python3 -m http.server 8899 &
    python3 tools/test-site.py

Exit code is 0 when everything passes, 1 when anything under FAIL is listed.
WARN items are judgement calls — read them, they are usually content gaps
rather than bugs.
"""
from playwright.sync_api import sync_playwright
import sys, os, re, glob

BASE  = 'http://localhost:8899/'
ROOT  = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PAGES = ['index.html', 'about.html', 'services.html', 'industries.html',
         'process.html', 'work.html', 'contact.html', '404.html']
WIDTHS = [1920, 1440, 1280, 1024, 820, 768, 430, 390, 360]

fails, warns = [], []
def fail(p, m): fails.append(f'{p}: {m}')
def warn(p, m): warns.append(f'{p}: {m}')


# ── static checks, no browser needed ───────────────────────────────────────
def static_checks():
    for f in PAGES:
        p = os.path.join(ROOT, f)
        if not os.path.exists(p):
            fail(f, 'file missing'); continue
        s = open(p, encoding='utf-8').read()

        t = re.search(r'<title>(.*?)</title>', s)
        if not t:                  fail(f, 'no <title>')
        elif len(t.group(1)) > 62: warn(f, f'title is {len(t.group(1))} chars; over 60 gets truncated in results')

        d = re.search(r'<meta name="description" content="(.*?)"', s)
        if not d: fail(f, 'no meta description')
        elif not 70 <= len(d.group(1)) <= 165:
            warn(f, f'meta description is {len(d.group(1))} chars; aim for 70-160')

        if f != '404.html':
            if '<link rel="canonical"' not in s: fail(f, 'no canonical link')
            if 'og:title' not in s:              fail(f, 'no Open Graph title')
            if 'og:image' not in s:              fail(f, 'no Open Graph image')
        elif 'noindex' not in s:
            fail(f, '404 must be noindex')

        n = s.count('<h1')
        if n != 1: fail(f, f'{n} h1 elements; there must be exactly one')
        if 'lang="en"' not in s: fail(f, 'no lang attribute on <html>')

        for m in re.finditer(r'<img\b(?![^>]*\balt=)[^>]*>', s):
            fail(f, 'img with no alt attribute: ' + m.group()[:70])

        if 'example.com' in s and f != '404.html':
            warn(f, 'still contains example.com — run tools/set-domain.js before launch')

    for extra in ['robots.txt', 'sitemap.xml', '.htaccess', '_headers']:
        if not os.path.exists(os.path.join(ROOT, extra)):
            fail(extra, 'missing')

    sm = open(os.path.join(ROOT, 'sitemap.xml'), encoding='utf-8').read()
    for f in PAGES:
        if f == '404.html': continue
        want = '/' if f == 'index.html' else '/' + f
        if want + '<' not in sm:
            fail('sitemap.xml', f'{f} is not listed')

    # placeholder slot cards that must not ship
    data_blob = ''.join(open(j, encoding='utf-8').read()
                        for j in glob.glob(os.path.join(ROOT, 'data/*.json')))
    page_blob = ''.join(open(os.path.join(ROOT, f), encoding='utf-8').read() for f in PAGES)
    for img in glob.glob(os.path.join(ROOT, 'assets/images/**/*.jpg'), recursive=True):
        if os.path.getsize(img) < 80_000:
            base = os.path.basename(img)
            if base in data_blob or base in page_blob:
                warn(os.path.relpath(img, ROOT),
                     'under 80KB and still referenced — likely an unfilled placeholder card')

    cfg = open(os.path.join(ROOT, 'js/config.js'), encoding='utf-8').read()
    if '+91 00000 00000'  in cfg: warn('js/config.js', 'phone number is still a placeholder')
    if 'hello@example.com' in cfg: warn('js/config.js', 'email is still a placeholder')
    if '910000000000'     in cfg: warn('js/config.js', 'WhatsApp number is still a placeholder')
    if 'demoMode: true'   in cfg: warn('js/config.js', 'demoMode is on — demonstration notices are visible')


# ── browser checks ─────────────────────────────────────────────────────────
def browser_checks():
    with sync_playwright() as p:
        b = p.chromium.launch()
        for f in PAGES:
            ctx = b.new_context(viewport={'width': 1440, 'height': 900})
            pg = ctx.new_page()
            errs, bad = [], []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
            pg.on('requestfailed', lambda r: bad.append(r.url) if 'fonts.g' not in r.url else None)

            pg.goto(BASE + f, wait_until='networkidle')
            pg.wait_for_timeout(1200)

            for e in errs: fail(f, 'console: ' + e[:130])
            for u in bad:  fail(f, 'request failed: ' + u)

            broken = pg.evaluate("""() => [...document.images]
                .filter(i => i.complete && i.naturalWidth === 0)
                .map(i => i.currentSrc || i.src)""")
            for u in broken: fail(f, 'image did not load: ' + u)

            hrefs = pg.evaluate("""() => [...document.querySelectorAll('a[href]')]
                .map(a => a.getAttribute('href'))""")
            for h in set(hrefs):
                if not h or h.startswith(('#', 'http', 'mailto:', 'tel:', 'javascript:')):
                    continue
                target = h.split('#')[0].split('?')[0]
                if target and not os.path.exists(os.path.join(ROOT, target)):
                    fail(f, 'link target missing: ' + h)

            for h in set(hrefs):
                if h and h.startswith('#') and len(h) > 1:
                    ok = pg.evaluate("s => !!document.querySelector(s)", h)
                    if not ok: fail(f, 'anchor has no target: ' + h)

            order = pg.evaluate("""() => [...document.querySelectorAll('h1,h2,h3,h4')]
                .map(h => +h.tagName[1])""")
            prev = 0
            for lvl in order:
                if prev and lvl > prev + 1:
                    warn(f, f'heading jumps h{prev} to h{lvl}'); break
                prev = lvl

            unnamed = pg.evaluate("""() => [...document.querySelectorAll('a,button')]
                .filter(el => !el.textContent.trim()
                           && !el.getAttribute('aria-label')
                           && !el.querySelector('img[alt]:not([alt=""])'))
                .map(el => el.tagName + '.' + (el.className.toString().split(' ')[0] || '?'))
                .slice(0,6)""")
            for u in set(unnamed): fail(f, 'no accessible name: ' + u)

            for w in WIDTHS:
                pg.set_viewport_size({'width': w, 'height': 900})
                pg.wait_for_timeout(280)
                over = pg.evaluate("""() => {
                    const d = document.documentElement;
                    if (d.scrollWidth <= d.clientWidth + 1) return null;
                    const out = [];
                    document.querySelectorAll('body *').forEach(el => {
                        const r = el.getBoundingClientRect();
                        if (r.right > d.clientWidth + 1 && r.width > 0 && r.width < 4000)
                            out.push(el.tagName + '.' + (el.className.toString().split(' ')[0] || '?'));
                    });
                    return [d.scrollWidth, d.clientWidth, out.slice(0, 4)];
                }""")
                if over:
                    fail(f, f'horizontal overflow at {w}px: {over[0]} vs {over[1]} — {over[2]}')

            pg.set_viewport_size({'width': 390, 'height': 844})
            pg.wait_for_timeout(320)
            small = pg.evaluate("""() => [...document.querySelectorAll('a,button')]
                .filter(el => { const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0 && (r.height < 30 || r.width < 30); })
                .map(el => el.tagName + '.' + (el.className.toString().split(' ')[0] || '?'))
                .slice(0, 6)""")
            for t in set(small): warn(f, 'tap target under 30px on mobile: ' + t)

            ctx.close()
        b.close()


static_checks()
browser_checks()

print('\n' + '=' * 70)
print(f'FAIL  ({len(fails)})' + ('  — nothing blocking' if not fails else ''))
for x in fails: print('  x', x)
print()
print(f'WARN  ({len(warns)})')
for x in warns: print('  !', x)
print('=' * 70 + '\n')
sys.exit(1 if fails else 0)
