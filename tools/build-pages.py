#!/usr/bin/env python3
"""Builds process.html and work.html from the shared page shell so the nav,
footer, head and script block never drift between pages."""
import os, re

os.chdir(os.path.join(os.path.dirname(__file__), '..'))

src = open('industries.html', encoding='utf-8').read()

head = src[:src.find('</head>')]
top  = src[src.find('<body>'):src.find('<section class="phero"')]
foot_i = src.find('<footer class="footer">')
bot  = src[foot_i:]


def page(title, desc, og_img, body, canonical):
    h = head
    h = re.sub(r'<title>.*?</title>', '<title>' + title + '</title>', h, flags=re.S)
    h = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + desc + m.group(2), h)
    h = re.sub(r'(<meta property="og:title" content=")[^"]*(")', lambda m: m.group(1) + title + m.group(2), h)
    h = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + desc + m.group(2), h)
    h = re.sub(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m.group(1) + og_img + m.group(2), h)
    h = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + canonical + m.group(2), h)
    h = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + canonical + m.group(2), h)
    return h + '</head>\n' + top + body + '</main>\n\n' + bot


# ══════════════════════════════════════════════════════════════════════════
PROCESS_BODY = '''<section class="phero" id="top">
  <div class="phero-bg"><img src="assets/images/staff/staff-inspection.jpg" alt="Apex supervisor walking a site with the facility team" fetchpriority="high"></div>
  <div class="noise"></div>
  <div class="wrap" style="position:relative;z-index:2">
    <p class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; Process</p>
    <h1 class="d2 lines"><span class="line"><span>Taking over</span></span><span class="line"><span class="hollow">a facility.</span></span></h1>
    <p class="lede" style="margin-top:26px" data-anim="up">Handover is where most facility contracts go wrong. Five stages, in order, with a defined output at each one &mdash; so you know what you are getting before anyone is deployed.</p>
    <div class="phero-meta" data-anim="up" data-delay="0.1">
      <div><span>Stages</span><b>Five</b></div>
      <div><span>Starts with</span><b>A site walkthrough</b></div>
      <div><span>Output</span><b>Written scope and roster</b></div>
      <div><span>Reviewed</span><b>On a fixed cycle</b></div>
    </div>
  </div>
</section>

<!-- ══ SCROLL SEQUENCE ═══════════════════════════════════════════════════ -->
<section class="sstory" aria-label="How Apex takes over a facility">
  <div class="sstory-track" id="procTrack">
    <div class="sstory-pin">
      <div class="sstory-media" aria-hidden="true">
        <figure class="is-active"><img src="assets/images/staff/staff-inspection.jpg" alt="" loading="lazy" decoding="async"></figure>
        <figure><img src="assets/images/corridor.jpg" alt="" loading="lazy" decoding="async"></figure>
        <figure><img src="assets/images/staff/staff-briefing.jpg" alt="" loading="lazy" decoding="async"></figure>
        <figure><img src="assets/images/staff/staff-supervisor.jpg" alt="" loading="lazy" decoding="async"></figure>
        <figure><img src="assets/images/quality-plantroom.jpg" alt="" loading="lazy" decoding="async"></figure>
      </div>

      <div class="sstory-inner">
        <div class="sstory-stage">
          <article class="sstory-step is-active" data-step="0">
            <span class="mono">Stage 01</span>
            <h3>Assess</h3>
            <p>We walk the building with whoever runs it today. Asset condition, current headcount, the areas that generate complaints, and the statutory gaps nobody has looked at recently.</p>
          </article>
          <article class="sstory-step" data-step="1">
            <span class="mono">Stage 02</span>
            <h3>Plan</h3>
            <p>A written scope for your site: what gets cleaned and how often, how many people on which shifts, which equipment is on a maintenance calendar, and what the supervisor signs.</p>
          </article>
          <article class="sstory-step" data-step="2">
            <span class="mono">Stage 03</span>
            <h3>Deploy</h3>
            <p>Staff are inducted to your site before their first shift, not during it. Uniforms, ID cards, equipment and consumables arrive with them. Handover runs in parallel so nothing stops.</p>
          </article>
          <article class="sstory-step" data-step="3">
            <span class="mono">Stage 04</span>
            <h3>Monitor</h3>
            <p>Supervision on site through the shift rather than a form filled in afterwards. Checklists per area, escalation with a name against it, and a log of what was not closed the same day.</p>
          </article>
          <article class="sstory-step" data-step="4">
            <span class="mono">Stage 05</span>
            <h3>Improve</h3>
            <p>A review on a fixed cycle covering what was completed, what slipped and what changes next period. Recurring problems get a change to the plan, not a repeated apology.</p>
          </article>
        </div>
      </div>

      <div class="sstory-bar" aria-hidden="true">
        <i class="on"></i><i></i><i></i><i></i><i></i>
      </div>
    </div>
    <div class="sstory-spacer"></div><div class="sstory-spacer"></div>
    <div class="sstory-spacer"></div><div class="sstory-spacer"></div>
  </div>
</section>

<!-- ══ WHAT YOU RECEIVE ══════════════════════════════════════════════════ -->
<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-anim="up">Deliverables</p>
        <h2 class="d2 lines"><span class="line"><span>What you get</span></span><span class="line"><span class="hollow">in writing.</span></span></h2>
      </div>
      <p class="lede" data-anim="up" data-delay="0.1">Each stage produces a document. If a stage has not produced its document, that stage is not finished.</p>
    </div>

    <div class="cmp-grid">
      <div class="cmp-cell" data-anim="up"><span class="mono">After stage 01</span><h3>Site assessment</h3><p>Condition notes per area, current gaps, and an honest view of what is already working and should be left alone.</p></div>
      <div class="cmp-cell" data-anim="up" data-delay="0.05"><span class="mono">After stage 02</span><h3>Scope and roster</h3><p>Written scope of work, shift roster, maintenance calendar and the agreed service levels, with commercials against them.</p></div>
      <div class="cmp-cell" data-anim="up" data-delay="0.1"><span class="mono">After stage 03</span><h3>Deployment record</h3><p>Who is on site, in what role, on which shift, with induction and ID issued against each name.</p></div>
      <div class="cmp-cell" data-anim="up" data-delay="0.15"><span class="mono">Ongoing</span><h3>Supervisor checklists</h3><p>Signed area checklists, kept on site and available to your team on request.</p></div>
      <div class="cmp-cell" data-anim="up" data-delay="0.2"><span class="mono">Ongoing</span><h3>Escalation log</h3><p>What was raised, who owned it, and when it closed. Open items stay visible rather than quietly disappearing.</p></div>
      <div class="cmp-cell" data-anim="up" data-delay="0.25"><span class="mono">Each cycle</span><h3>Review summary</h3><p>Completed, slipped, and changing next period &mdash; agreed with your team rather than sent to them.</p></div>
    </div>
  </div>
</section>

<section class="cta">
  <div class="cta-bg"><img src="assets/images/staff/staff-team.jpg" alt="" loading="lazy" decoding="async"></div>
  <div class="wrap" style="position:relative;z-index:2">
    <h2 class="d1 lines"><span class="line"><span>Start with</span></span><span class="line"><span class="hollow">a walkthrough.</span></span></h2>
    <p class="lede" style="margin-top:26px" data-anim="up">No proposal is written before someone has seen the building.</p>
    <p style="margin-top:34px" data-anim="up" data-delay="0.1">
      <a href="contact.html" class="btn btn-solid" data-magnetic data-cfg-cta="ctaText">Request a consultation</a>
    </p>
  </div>
</section>

'''

# ══════════════════════════════════════════════════════════════════════════
WORK_BODY = '''<section class="phero" id="top">
  <div class="phero-bg"><img src="assets/images/ind-corporate.jpg" alt="Corporate building exterior" fetchpriority="high"></div>
  <div class="noise"></div>
  <div class="wrap" style="position:relative;z-index:2">
    <p class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; Work</p>
    <h1 class="d2 lines"><span class="line"><span>Scopes of work.</span></span><span class="line"><span class="hollow">Not claims.</span></span></h1>
    <p class="lede" style="margin-top:26px" data-anim="up">Each entry below describes how a facility of that type would be run &mdash; the scope, the reasoning and the deployment. They are worked examples, and they are labelled as such.</p>
    <div class="phero-meta" data-anim="up" data-delay="0.1">
      <div><span>Examples</span><b>Six facility types</b></div>
      <div><span>Status</span><b>Illustrative scopes</b></div>
      <div><span>Figures claimed</span><b>None</b></div>
      <div><span>Replaces with</span><b>Real sites, on consent</b></div>
    </div>
  </div>
</section>

<section class="section-tight on-bone demo-only">
  <div class="wrap">
    <div style="display:flex;gap:18px;align-items:flex-start;max-width:900px">
      <span class="demo-tag" style="border-color:var(--ink);color:var(--ink);flex:none">Please note</span>
      <p style="margin:0;color:var(--mute);line-height:1.65">Apex has not supplied completed sites for this demonstration, so nothing here is presented as delivered work. Each example sets out a realistic scope for that facility type and stops there &mdash; no client is named, no result is claimed and no figure is quoted. Replace these entries in <code>data/projects.json</code> as real sites become available.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="wk-filters" data-render="work-filters" role="group" aria-label="Filter by facility type"></div>
    <div class="wk-grid" data-render="work">
      <noscript><p class="lede">Enable JavaScript to browse the examples, or <a href="contact.html">ask us about your facility type</a>.</p></noscript>
    </div>
  </div>
</section>

<div class="lb" data-render="lightbox"></div>

<section class="cta">
  <div class="cta-bg"><img src="assets/images/staff/staff-supervisor.jpg" alt="" loading="lazy" decoding="async"></div>
  <div class="wrap" style="position:relative;z-index:2">
    <h2 class="d1 lines"><span class="line"><span>Let&rsquo;s talk about</span></span><span class="line"><span class="hollow">your building.</span></span></h2>
    <p class="lede" style="margin-top:26px" data-anim="up">Tell us the facility type and rough size, and we will come and look at it.</p>
    <p style="margin-top:34px" data-anim="up" data-delay="0.1">
      <a href="contact.html" class="btn btn-solid" data-magnetic data-cfg-cta="ctaTextAlt">Request a proposal</a>
    </p>
  </div>
</section>

'''

open('process.html', 'w', encoding='utf-8').write(page(
    'Our Process | Apex Integrated Facility Management',
    'How Apex takes over a facility: assess, plan, deploy, monitor and improve, with a written deliverable at every stage.',
    'assets/images/staff/staff-inspection.jpg',
    PROCESS_BODY, 'https://example.com/process.html'))

open('work.html', 'w', encoding='utf-8').write(page(
    'Work | Apex Integrated Facility Management',
    'Worked examples of facility management scopes across corporate, residential, industrial, retail and healthcare buildings in Bengaluru.',
    'assets/images/ind-corporate.jpg',
    WORK_BODY, 'https://example.com/work.html'))

print('process.html and work.html written')
