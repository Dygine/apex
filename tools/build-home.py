#!/usr/bin/env python3
"""Restructures index.html: retires the invented-statistics sections, repoints
every reference to the removed stock photographs, and inserts the new
JSON-driven sections. Idempotent."""
import re, os, glob

os.chdir(os.path.join(os.path.dirname(__file__), '..'))

# ── 1. repoint references to photographs that were removed ───────────────
SWAP = {
    'assets/images/crew-sky.jpg':       'assets/images/staff/staff-team.jpg',
    'assets/images/tech-team.jpg':      'assets/images/staff/staff-briefing.jpg',
    'assets/images/welding.jpg':        'assets/images/staff/staff-technician.jpg',
    'assets/images/about-workforce.jpg':'assets/images/staff/staff-supervisor.jpg',
}
ALT = {
    'assets/images/staff/staff-team.jpg':       'Apex facility team in uniform at a client site',
    'assets/images/staff/staff-briefing.jpg':   'Apex team at a shift briefing before deployment',
    'assets/images/staff/staff-technician.jpg': 'Apex maintenance technician inspecting building plant',
    'assets/images/staff/staff-supervisor.jpg': 'Apex facility supervisor on a corporate office floor',
}
for page in glob.glob('*.html'):
    s = open(page, encoding='utf-8').read()
    o = s
    for a, b in SWAP.items():
        s = s.replace(a, b)
    # keep alt text truthful for the swapped slots
    for src, alt in ALT.items():
        s = re.sub(r'(<img[^>]*src="' + re.escape(src) + r'"[^>]*?alt=")[^"]*(")',
                   lambda m: m.group(1) + alt + m.group(2), s)
        s = re.sub(r'(<img[^>]*?alt=")[^"]*("[^>]*src="' + re.escape(src) + r'")',
                   lambda m: m.group(1) + alt + m.group(2), s)
    if s != o:
        open(page, 'w', encoding='utf-8').write(s)
        print('repointed images in', page)

src = open('index.html', encoding='utf-8').read()


def cut(start_marker, end_marker, text):
    """Removes a whole commented section, keeping the end marker."""
    i = text.find(start_marker)
    j = text.find(end_marker)
    if i == -1 or j == -1 or j < i:
        return text, False
    return text[:i] + text[j:], True


def swap(start_marker, end_marker, new, text):
    i = text.find(start_marker)
    j = text.find(end_marker)
    if i == -1 or j == -1 or j < i:
        return text, False
    return text[:i] + new + text[j:], True


# ── 2. retire the invented-figures sections ──────────────────────────────
# "By the numbers" counted to figures nobody had verified, and the operations
# board drew bars from hardcoded values. Both were labelled demo, which is
# honest but not useful — a new company is better served by saying what it
# actually does than by animating a number it cannot stand behind.
src, done = cut('<!-- ══ 08 NUMBERS', '<!-- ══ 09 INDUSTRIES', src)
print('removed invented statistics section:', done)

# ── 3. operations board → statutory compliance ───────────────────────────
COMPLIANCE = '''<!-- ══ 10 COMPLIANCE ═══════════════════════════════════════════════════ -->
<!-- Replaces the old operations board, which drew its bars from invented
     values. Compliance is the thing Indian facility buyers actually ask
     about first, and it can be described truthfully today. -->
<section class="section cmp" id="compliance">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-anim="up">Compliance</p>
        <h2 class="d2 lines"><span class="line"><span>The paperwork</span></span><span class="line"><span class="hollow">is our problem.</span></span></h2>
      </div>
      <p class="lede" data-anim="up" data-delay="0.1">Staff deployed at your site are on Apex&rsquo;s rolls. The statutory obligations that come with them sit with us, and the records behind them can be produced when your auditor asks.</p>
    </div>

    <div class="cmp-grid">
      <div class="cmp-cell" data-anim="up">
        <span class="mono">01</span>
        <h3>Employment sits with Apex</h3>
        <p>Deployed staff are engaged, paid and managed by us. You hold one contract with one company, not an employment relationship with a floating workforce.</p>
      </div>
      <div class="cmp-cell" data-anim="up" data-delay="0.06">
        <span class="mono">02</span>
        <h3>Statutory contributions</h3>
        <p>Wage, PF, ESI and welfare obligations for deployed staff are administered by Apex, with the supporting records kept against each site.</p>
      </div>
      <div class="cmp-cell" data-anim="up" data-delay="0.12">
        <span class="mono">03</span>
        <h3>Records you can produce</h3>
        <p>Attendance, deployment and service records are maintained per site so a compliance question can be answered with a document rather than an assurance.</p>
      </div>
    </div>

    <p class="demo-note demo-only">Registration numbers and certifications are deliberately not listed. Add them here once the client confirms which are in place &mdash; nothing on this site claims a credential Apex has not supplied.</p>
  </div>
</section>

'''
src, done = swap('<!-- ══ 10 OPERATIONS', '<!-- ══ 11 STATEMENTS', COMPLIANCE, src)
print('operations board replaced with compliance:', done)

# ── 4. horizontal rail → JSON-driven service sequence ────────────────────
SERVICES = '''<!-- ══ 05 SERVICE SEQUENCE ═════════════════════════════════════════════ -->
<!-- Scroll-driven. Content comes from data/services.json — add, reorder or
     delete a service there and this section and services.html both follow. -->
<section class="section svcs" id="services">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-anim="up">What we manage</p>
        <h2 class="d2 lines"><span class="line"><span>Six service lines.</span></span><span class="line"><span class="hollow">One contract.</span></span></h2>
      </div>
      <p class="lede" data-anim="up" data-delay="0.1">Take the whole scope or a single line. Either way the supervision structure, the checklists and the person you call when something goes wrong stay the same.</p>
    </div>

    <div class="svc-wrap" data-render="service-scroll">
      <noscript><p class="lede">Service details are listed on the <a href="services.html">services page</a>.</p></noscript>
    </div>
  </div>
</section>

'''
src, done = swap('<!-- ══ 05 HORIZONTAL SCROLL RAIL', '<!-- ══ 06 MARQUEE', SERVICES, src)
print('horizontal rail replaced with service sequence:', done)

# ── 5. industries section now reads from JSON ────────────────────────────
i = src.find('<div class="inds-grid">')
j = src.find('</section>', i)
if i != -1:
    src = src[:i] + '''<div class="inds-grid">
      <div class="inds-list" data-render="industries-rows"></div>
      <div class="inds-preview" data-render="industries-preview"></div>
    </div>
  </div>
''' + src[j:]
    print('industries now JSON-driven: True')

# ── 6. new sections: people + uniform, after the facility map ────────────
PEOPLE_UNIFORM = '''
<!-- ══ 04b PEOPLE ══════════════════════════════════════════════════════ -->
<section class="section ppl" id="people">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-anim="up">People</p>
        <h2 class="d2 lines"><span class="line"><span>People keep</span></span><span class="line"><span class="hollow">facilities moving.</span></span></h2>
      </div>
      <p class="lede" data-anim="up" data-delay="0.1">Equipment and schedules matter, but a building is kept working by the people walking it every day. These are the roles that make up an Apex team on site.</p>
    </div>

    <div class="ppl-grid" data-render="people"></div>

    <p class="demo-note demo-only">Roles, not individuals. No person on this site is invented &mdash; real names and photographs go in only with their consent.</p>
  </div>
</section>

<!-- ══ 04c UNIFORM SHOWCASE ════════════════════════════════════════════ -->
<!-- The client asked specifically for the uniform to be shown with Apex
     branding. Hotspot content lives in data/uniform.json; the vendor-ready
     drawing is assets/brand/apex-uniform-spec.svg. -->
<section class="section uni" id="uniform">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-anim="up">The Apex standard</p>
        <h2 class="d2 lines"><span class="line"><span>Every detail</span></span><span class="line"><span>represents</span></span><span class="line"><span class="hollow">a standard.</span></span></h2>
      </div>
      <p class="lede" data-anim="up" data-delay="0.1">A uniform is the first thing anyone in your building reads about the people working in it. Navy shirt, chest logo, name badge, photo ID &mdash; so nobody ever has to wonder who is on their floor or why.</p>
    </div>

    <div class="uni-wrap" data-render="uniform"></div>
  </div>
</section>

'''
src, done = swap('<!-- ══ 05 SERVICE SEQUENCE', '<!-- ══ 05 SERVICE SEQUENCE',
                 PEOPLE_UNIFORM + '<!-- ══ 05 SERVICE SEQUENCE', src)
print('people + uniform inserted:', done)

# ── 7. FAQ before the testimonials ───────────────────────────────────────
FAQ = '''<!-- ══ 15a FAQ ═════════════════════════════════════════════════════════ -->
<!-- Questions and answers come from data/faq.json -->
<section class="section faq" id="faq">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-anim="up">Questions</p>
        <h2 class="d2 lines"><span class="line"><span>Before you</span></span><span class="line"><span class="hollow">ask us.</span></span></h2>
      </div>
      <p class="lede" data-anim="up" data-delay="0.1">The things people want to know before the first call. If yours is not here, the contact form reaches an actual person.</p>
    </div>
    <div class="faq-list" data-render="faq"></div>
  </div>
</section>

'''
src, done = swap('<!-- ══ 15 TESTIMONIALS', '<!-- ══ 15 TESTIMONIALS',
                 FAQ + '<!-- ══ 15 TESTIMONIALS', src)
print('faq inserted:', done)

open('index.html', 'w', encoding='utf-8').write(src)
print('\nindex.html rebuilt')
