#!/usr/bin/env python3
"""Applies the shared shell (stylesheet, scripts, nav, footer, brand mark,
WhatsApp button) consistently across every page. Idempotent — safe to re-run."""
import re, glob, os, shutil

ROOT = os.path.join(os.path.dirname(__file__), '..')
os.chdir(ROOT)

# projects.html becomes work.html, per the brief's page list
if os.path.exists('projects.html') and not os.path.exists('work.html'):
    shutil.move('projects.html', 'work.html')

PAGES = sorted(glob.glob('*.html'))

BRAND_SVG = (
    '<svg class="brand-mark" viewBox="0 0 108 108" aria-hidden="true">'
    '<rect width="108" height="108" rx="20" fill="#16233D"/>'
    '<path d="M54 20 L88 78 H72 L54 47 L36 78 H20 Z" fill="#FBFAF7"/>'
    '<rect x="36" y="82" width="36" height="7" rx="3.5" fill="#0FA47F"/>'
    '<rect x="45" y="64" width="18" height="6" rx="3" fill="#FBFAF7" opacity=".55"/></svg>'
)

WA = (
    '\n<!-- WhatsApp — number comes from js/config.js -->\n'
    '<a class="wa-float" data-cfg-wa target="_blank" rel="noopener" aria-label="Message Apex on WhatsApp">'
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
    '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97s-.47-.15-.67.15-.77.96-.94 1.16-.35.22-.65.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.07c-.17-.3 0-.46.13-.6s.3-.35.45-.53.2-.3.3-.5 0-.37-.03-.52-.67-1.62-.92-2.22-.49-.5-.67-.51h-.57a1.1 1.1 0 0 0-.79.37 3.32 3.32 0 0 0-1.04 2.47 5.77 5.77 0 0 0 1.21 3.06 13.2 13.2 0 0 0 5.05 4.46c.7.3 1.26.49 1.69.63a4.06 4.06 0 0 0 1.86.12 3.05 3.05 0 0 0 2-1.41 2.47 2.47 0 0 0 .17-1.41c-.07-.13-.27-.2-.57-.35z"/>'
    '<path d="M12.04 2A9.94 9.94 0 0 0 3.6 17.2L2 22l4.94-1.55A9.94 9.94 0 1 0 12.04 2m0 1.8a8.14 8.14 0 1 1-4.24 15.1l-.3-.18-2.94.92.93-2.86-.2-.31a8.14 8.14 0 0 1 6.75-12.67" />'
    '</svg></a>\n'
)

SCRIPTS = (
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>\n'
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>\n'
    '<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>\n'
    '<script src="js/config.js"></script>\n'
    '<script src="js/data.js" defer></script>\n'
    '<script src="js/render.js" defer></script>\n'
    '<script src="js/main.js" defer></script>\n'
    '<script src="js/animations.js" defer></script>\n'
)

NAV_DESK = '''      <a class="nav-a{h}" href="index.html">Home</a>
      <a class="nav-a{a}" href="about.html">About</a>
      <a class="nav-a{s}" href="services.html">Services</a>
      <a class="nav-a{i}" href="industries.html">Industries</a>
      <a class="nav-a{p}" href="process.html">Process</a>
      <a class="nav-a{w}" href="work.html">Work</a>
      <a class="nav-a{c}" href="contact.html">Contact</a>
'''

PANEL = '''    <li><a href="index.html"><span class="idx">01</span>Home</a></li>
    <li><a href="about.html"><span class="idx">02</span>About</a></li>
    <li><a href="services.html"><span class="idx">03</span>Services</a></li>
    <li><a href="industries.html"><span class="idx">04</span>Industries</a></li>
    <li><a href="process.html"><span class="idx">05</span>Process</a></li>
    <li><a href="work.html"><span class="idx">06</span>Work</a></li>
    <li><a href="contact.html"><span class="idx">07</span>Contact</a></li>
'''

FOOT_PAGES = '''          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="industries.html">Industries</a></li>
          <li><a href="process.html">Process</a></li>
          <li><a href="work.html">Work</a></li>
          <li><a href="contact.html">Contact</a></li>
'''

FOOT_SERVICES = '''          <li><a href="services.html#service-housekeeping">Housekeeping</a></li>
          <li><a href="services.html#service-security">Security</a></li>
          <li><a href="services.html#service-technical">Technical maintenance</a></li>
          <li><a href="services.html#service-landscaping">Landscaping</a></li>
          <li><a href="services.html#service-pest">Pest management</a></li>
          <li><a href="services.html#service-manpower">Manpower &amp; support</a></li>
'''

FOOT_CONTACT = '''        <ul>
          <li data-cfg-address>Bengaluru, Karnataka</li>
          <li><a data-cfg-tel>+91 00000 00000</a></li>
          <li><a data-cfg-mail>hello@example.com</a></li>
        </ul>
'''

for page in PAGES:
    src = open(page, encoding='utf-8').read()
    orig = src
    name = os.path.basename(page)

    # ── stylesheet ──────────────────────────────────────────────────────
    if 'css/components.css' not in src:
        src = src.replace('<link rel="stylesheet" href="css/responsive.css">',
                          '<link rel="stylesheet" href="css/components.css">\n'
                          '<link rel="stylesheet" href="css/responsive.css">')

    # ── scripts ─────────────────────────────────────────────────────────
    src = re.sub(
        r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/gsap.*?js/animations\.js" defer></script>\n',
        SCRIPTS, src, flags=re.S)

    # ── favicon also as apple touch ─────────────────────────────────────
    if 'apple-touch-icon' not in src:
        src = src.replace('<link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">',
                          '<link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">\n'
                          '<link rel="apple-touch-icon" href="assets/icons/favicon.svg">')

    # ── brand mark in nav logo ──────────────────────────────────────────
    if 'brand-mark' not in src:
        src = src.replace('<b>Apex</b><span>Integrated Facility Management</span>',
                          BRAND_SVG + '<span class="nav-word"><b>Apex</b>'
                          '<span>Integrated Facility Management</span></span>')

    # ── navigation ──────────────────────────────────────────────────────
    cur = {k: '' for k in 'hasipwc'}
    key = {'index.html': 'h', 'about.html': 'a', 'services.html': 's',
           'industries.html': 'i', 'process.html': 'p', 'work.html': 'w',
           'contact.html': 'c'}.get(name)
    if key:
        cur[key] = ' current'
    src = re.sub(r'(<nav class="nav-menu" aria-label="Primary">\n).*?(    </nav>)',
                 lambda m: m.group(1) + NAV_DESK.format(**cur) + m.group(2), src, flags=re.S)

    src = re.sub(r'(<ul class="panel-list">\n).*?(  </ul>)',
                 lambda m: m.group(1) + PANEL + m.group(2), src, flags=re.S)

    # ── footer ──────────────────────────────────────────────────────────
    src = re.sub(r'(<nav class="foot-col" aria-label="Pages">\n        <h4>Pages</h4>\n        <ul>\n).*?(        </ul>)',
                 lambda m: m.group(1) + FOOT_PAGES + m.group(2), src, flags=re.S)
    src = re.sub(r'(<nav class="foot-col" aria-label="Services">\n        <h4>Services</h4>\n        <ul>\n).*?(        </ul>)',
                 lambda m: m.group(1) + FOOT_SERVICES + m.group(2), src, flags=re.S)
    src = re.sub(r'(<div class="foot-col foot-contact">\n        <h4>Contact</h4>\n)        <ul>.*?</ul>\n',
                 lambda m: m.group(1) + FOOT_CONTACT, src, flags=re.S)

    if 'brand-mark' not in src.split('<footer')[-1]:
        src = src.replace('<div class="foot-brand">\n        <b>Apex</b>',
                          '<div class="foot-brand">\n        ' + BRAND_SVG + '\n        <b>Apex</b>')

    # ── footer demo notice honours demoMode ─────────────────────────────
    src = src.replace(
        '<p>Demonstration website &mdash; content, statistics and contact details are placeholders.</p>',
        '<p class="demo-only">Demonstration website &mdash; imagery, sample projects and contact '
        'details are placeholders pending client content.</p>')

    # ── panel + footer placeholder contacts wired to config ─────────────
    src = re.sub(r'<a href="tel:\+910000000000" data-placeholder>[^<]*</a>',
                 '<a data-cfg-tel>+91 00000 00000</a>', src)
    src = re.sub(r'<a href="mailto:info@example\.com" data-placeholder>[^<]*</a>',
                 '<a data-cfg-mail>hello@example.com</a>', src)

    # ── old links ───────────────────────────────────────────────────────
    src = src.replace('href="projects.html"', 'href="work.html"')

    # ── WhatsApp float ──────────────────────────────────────────────────
    if 'wa-float' not in src:
        src = src.replace('</footer>\n', '</footer>\n' + WA)

    if src != orig:
        open(page, 'w', encoding='utf-8').write(src)
        print('updated', name)
    else:
        print('no change', name)
