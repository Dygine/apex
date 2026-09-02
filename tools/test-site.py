#!/usr/bin/env python3
"""Production-readiness check. Runs every page in headless Chromium and reports
console errors, failed requests, broken links, missing images, overflow and the
accessibility basics."""
from playwright.sync_api import sync_playwright
import sys, os, json

BASE = 'http://localhost:8899/'
PAGES = ['index.html', 'about.html', 'services.html', 'industries.html',
         'process.html', 'work.html', 'contact.html']
WIDTHS = [1920, 1440, 1366, 1024, 768, 430, 390, 360]

fails, notes = [], []


def run():
    with sync_playwright() as p:
        b = p.chromium.launch()
        for page_name in PAGES:
            ctx = b.new_context(viewport={'width': 1440, 'height': 900})
            pg = ctx.new_page()
            errs, bad = [], []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
            pg.on('requestfailed',
                  lambda r: bad.append(r.url) if 'fonts.g' not in r.url and 'cdn' not in r.url else None)

            pg.goto(BASE + page_name, wait_until='networkidle')
            pg.wait_for_timeout(900)

            if errs:
                fails.append(f'{page_name}: console errors -> {errs[:3]}')
            if bad:
                fails.append(f'{page_name}: failed requests -> {bad[:3]}')

            # images actually rendered
            # force every lazy image to load, then check what actually failed
            pg.evaluate("() => [...document.images].forEach(i => i.loading = 'eager')")
            pg.wait_for_timeout(1500)
            broken = pg.evaluate("""() => [...document.images]
                .filter(i => i.complete && i.naturalWidth === 0)
                .map(i => i.getAttribute('src'))""")
            if broken:
                fails.append(f'{page_name}: broken images -> {broken[:4]}')

            total_imgs = pg.evaluate("() => document.images.length")
            no_alt = pg.evaluate("() => [...document.images].filter(i => !i.hasAttribute('alt')).length")
            if no_alt:
                fails.append(f'{page_name}: {no_alt} images without alt')

            h1 = pg.evaluate("() => document.querySelectorAll('h1').length")
            if page_name == 'index.html':
                if h1 != 1:
                    fails.append(f'{page_name}: {h1} h1 elements')
            elif h1 != 1:
                fails.append(f'{page_name}: {h1} h1 elements')

            cdn = pg.evaluate("""() => [...document.scripts]
                .map(s => s.src).filter(s => s && !s.startsWith(location.origin))""")
            if cdn:
                fails.append(f'{page_name}: third-party script -> {cdn[:2]}')

            title = pg.title()
            desc = pg.evaluate("() => (document.querySelector('meta[name=description]')||{}).content || ''")
            if not title or not desc:
                fails.append(f'{page_name}: missing title or description')

            # internal links resolve
            links = pg.evaluate("""() => [...document.querySelectorAll('a[href]')]
                .map(a => a.getAttribute('href'))
                .filter(h => h && !h.startsWith('http') && !h.startsWith('#')
                             && !h.startsWith('mailto') && !h.startsWith('tel'))""")
            for href in set(links):
                target = href.split('#')[0]
                if target and not os.path.exists(os.path.join(os.path.dirname(__file__), '..', target)):
                    fails.append(f'{page_name}: dead link -> {href}')

            # rendered content from JSON
            counts = pg.evaluate("""() => ({
                svc:  document.querySelectorAll('.svc-card').length,
                sdet: document.querySelectorAll('.sdet').length,
                inds: document.querySelectorAll('.inds-row').length,
                indc: document.querySelectorAll('.indc').length,
                ppl:  document.querySelectorAll('.ppl-card').length,
                uni:  document.querySelectorAll('.uni-dot').length,
                faq:  document.querySelectorAll('.faq-item').length,
                wk:   document.querySelectorAll('.wk').length,
                opts: document.querySelectorAll('#c-services option').length
            })""")
            notes.append(f'{page_name}: {total_imgs} imgs, rendered {json.dumps(counts)}')

            # horizontal overflow at every breakpoint
            for w in WIDTHS:
                pg.set_viewport_size({'width': w, 'height': 850})
                pg.wait_for_timeout(220)
                over = pg.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
                if over > 2:
                    fails.append(f'{page_name} @ {w}px: horizontal overflow {over}px')
            ctx.close()

        # ── interaction tests ────────────────────────────────────────────
        ctx = b.new_context(viewport={'width': 1440, 'height': 900})
        pg = ctx.new_page()

        # FAQ accordion
        pg.goto(BASE + 'index.html', wait_until='networkidle')
        pg.wait_for_timeout(700)
        pg.locator('.faq-q button').first.click()
        pg.wait_for_timeout(450)
        if pg.locator('.faq-item').first.get_attribute('class').find('is-open') == -1:
            fails.append('FAQ: panel did not open')
        else:
            notes.append('FAQ: opens on click')
        pg.locator('.faq-q button').nth(1).click()
        pg.wait_for_timeout(400)
        opened = pg.evaluate("() => document.querySelectorAll('.faq-item.is-open').length")
        if opened != 1:
            fails.append(f'FAQ: {opened} panels open, expected 1')
        else:
            notes.append('FAQ: only one panel open at a time')

        # uniform hotspots
        pg.locator('.uni-dot').nth(2).click()
        pg.wait_for_timeout(350)
        act = pg.evaluate("() => (document.querySelector('.uni-item.is-active')||{}).dataset?.uniItem")
        notes.append(f'Uniform: hotspot 3 selects "{act}"')
        if not act:
            fails.append('Uniform: hotspot click did not change the readout')

        # service cards render from JSON and reveal on scroll
        pg.evaluate("() => document.querySelector('#services').scrollIntoView()")
        pg.wait_for_timeout(900)
        n = pg.evaluate("() => document.querySelectorAll('.svc-card').length")
        shown = pg.evaluate("() => document.querySelectorAll('.svc-card.is-revealed').length")
        notes.append(f'Service cards: {n} rendered, {shown} revealed on scroll')
        if n and not shown:
            fails.append('Service cards rendered but never revealed')

        # mobile menu
        pg.set_viewport_size({'width': 390, 'height': 844})
        pg.goto(BASE + 'index.html', wait_until='networkidle')
        pg.wait_for_timeout(600)
        pg.locator('#burger').click()
        pg.wait_for_timeout(500)
        if not pg.locator('#panel').is_visible():
            fails.append('Mobile menu: did not open')
        else:
            notes.append('Mobile menu: opens')
        pg.keyboard.press('Escape')
        pg.wait_for_timeout(400)

        # work page: filter + lightbox
        pg.set_viewport_size({'width': 1440, 'height': 900})
        pg.goto(BASE + 'work.html', wait_until='networkidle')
        pg.wait_for_timeout(700)
        total = pg.locator('.wk').count()
        pg.locator('.wf').nth(1).click()
        pg.wait_for_timeout(350)
        shown = pg.evaluate("() => [...document.querySelectorAll('.wk')].filter(c=>!c.classList.contains('is-hidden')).length")
        notes.append(f'Work filter: {total} total -> {shown} after filtering')
        if shown == 0 or shown == total:
            fails.append(f'Work filter: filtered to {shown} of {total}')
        pg.locator('.wf').first.click()
        pg.wait_for_timeout(300)
        pg.locator('.wk-open').first.click()
        pg.wait_for_timeout(500)
        if not pg.locator('.lb.is-open').count():
            fails.append('Lightbox: did not open')
        else:
            notes.append('Lightbox: opens')
        pg.keyboard.press('Escape')
        pg.wait_for_timeout(400)
        if pg.locator('.lb.is-open').count():
            fails.append('Lightbox: Escape did not close it')
        else:
            notes.append('Lightbox: closes on Escape')

        # contact form validation
        pg.goto(BASE + 'contact.html', wait_until='networkidle')
        pg.wait_for_timeout(700)
        opts = pg.locator('#c-services option').count()
        notes.append(f'Contact: {opts} service options rendered from JSON')
        pg.locator('form button[type=submit], form .btn').first.click()
        pg.wait_for_timeout(400)
        flagged = pg.evaluate("() => document.querySelectorAll('.f.bad, .f.err, .f.invalid').length")
        notes.append(f'Contact: empty submit flagged {flagged} fields')

        # process page sequence — five stages, all readable without a pin
        pg.goto(BASE + 'process.html', wait_until='networkidle')
        pg.wait_for_timeout(600)
        pg.mouse.wheel(0, 2600)
        pg.wait_for_timeout(800)
        steps = pg.evaluate("() => document.querySelectorAll('.sstory-step').length")
        vis = pg.evaluate("""() => [...document.querySelectorAll('.sstory-step')]
            .filter(s => getComputedStyle(s).opacity !== '0').length""")
        notes.append(f'Process sequence: {steps} stages, {vis} visible')
        if steps != 5:
            fails.append(f'Process sequence: expected 5 stages, found {steps}')

        # reduced motion — nothing may stay invisible
        ctx2 = b.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
        p2 = ctx2.new_page()
        p2.goto(BASE + 'index.html', wait_until='networkidle')
        p2.wait_for_timeout(900)
        hidden = p2.evaluate("""() => [...document.querySelectorAll('[data-anim], .lines .line span')]
            .filter(e => getComputedStyle(e).opacity === '0').length""")
        if hidden:
            fails.append(f'Reduced motion: {hidden} elements stayed invisible')
        else:
            notes.append('Reduced motion: all content visible')
        ctx2.close()
        ctx.close()
        b.close()


run()
print('\n──────── OBSERVATIONS ────────')
for n in notes:
    print(' ', n)
print('\n──────── FAILURES ────────')
if fails:
    for f in fails:
        print('  FAIL', f)
    print(f'\n{len(fails)} issue(s)')
    sys.exit(1)
print('  none')
