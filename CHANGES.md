# Apex website — change log for this pass

Everything below is already applied. Read this first, then `js/config.js`.

---

## 1. THE ONE THING STILL NEEDED FROM YOU

`js/config.js`, around line 40:

```js
whatsapp: { value: '910000000000', confirmed: false },
```

Put the real number in `value` (country code, no `+`, no spaces — e.g.
`919876543210`) and change `confirmed` to `true`. That is the only edit needed
to make the floating WhatsApp button live.

Until then the button still appears, but it opens `contact.html` instead of a
dead `wa.me` link. Phone and email in the footer are still placeholders and
render greyed out on purpose — same file, same pattern.

---

## 2. LOGO

The old logo was a placeholder SVG — a generic chevron in a rounded box, not
your artwork. Your signage render has the logo on a light background, so it was
cut out to transparency programmatically rather than redrawn.

New files in `assets/brand/`:

| File | Used for |
|---|---|
| `apex-wordmark.png` | the nav bar |
| `apex-wordmark-white.png` | the footer |
| `apex-logo.png` | full lockup incl. the descriptor line, for print/social |
| `apex-logo-white.png` | same, on dark |
| `apex-mark.png` / `-white.png` | the red A alone, for small placements |
| `../icons/favicon.png` | browser tab |

**Why the nav uses the wordmark and not the full lockup:** at a 34px bar
height, the "INTEGRATED FACILITY MANAGEMENT" line inside the artwork renders
about three pixels tall — legible on a signboard, mud on a screen. So the nav
carries the wordmark plus that descriptor as live text beside it. It stays
sharp at any size and search engines can read it.

Brand colours were sampled from the artwork rather than guessed, and now drive
the whole site:

- navy `#0B2A5F` (from the P, E, X) — was an invented `#16233D`
- red `#C2161F` (from the A)

Red is used only where it means something: scroll progress bar, active nav
underline, the ring on the back-to-top button. It is never a page fill.

---

## 3. ANIMATIONS — the four things you reported

**Too fast.** Duration 0.7s → 0.95s, travel 22px → 16px. Both are single
tokens in `css/style.css`:

```css
--rv-dur:  .95s;    /* raise to slow everything down further */
--rv-lift: 16px;    /* lower for an even lighter movement */
```

**The burst when you reach the end of the page.** This was the real bug.
Flicking to the bottom fired every remaining section in the same frame. Two
guards now: reveals pass through a queue spaced 55ms apart, and when the scroll
is moving fast the per-item stagger is dropped so nothing stacks. Measured on a
fast flick to the bottom of the home page: 37 reveals, minimum gap 21ms, zero
same-frame pairs. Before, they all landed at once.

**Nothing animated on the way back up.** The old code called `unobserve()` the
first time an element appeared, so each one fired once and never again. It now
resets when an element is fully clear of the viewport and records which edge it
left by, so it enters from below when you scroll up and from above when you
scroll down.

**A bug found while testing this.** On an *instant* jump — clicking an anchor,
pressing End, landing on a `#hash` — the browser hands the observer stale
positions, and the closing section stayed blank. Two fixes: positions are now
measured live rather than trusted from the event, and a safety sweep runs 180ms
after any scroll settles and reveals anything on screen that got missed. In
normal scrolling the sweep finds nothing to do; it is a backstop.

---

## 4. BACK TO TOP + WHATSAPP

Both were missing. Both added, injected once from `js/main.js` (section 10)
rather than pasted into eight files.

- WhatsApp: bottom right, always visible.
- Back to top: appears past 620px. A button offering to take you to the top
  while you are already at the top is clutter. The red ring around it fills as
  you move down the page.

---

## 5. SERVICES DROPDOWN

Only Services has a dropdown, as asked.

- Clicking the word **Services** still opens the full services page.
- Hovering opens a two-column panel listing all six with one-line
  descriptions.
- Clicking one goes to `services.html#service-<id>`, scrolls to that service
  and tints its title so you can see which one you landed on.
- Touch: first tap opens the panel, second follows the link.
- Escape closes it; the panel closes itself if the bar hides on scroll.
- Mobile: a chevron beside Services expands the same list inside the panel.

To add or remove a service you must edit two places — `data/services.json` for
the page content, and the `SERVICES` list at the top of the nav in each HTML
file for the dropdown. The dropdown is hard-coded on purpose: it works before
JavaScript runs and search engines can follow it.

---

## 6. HOME PAGE LENGTH

711 lines → 530. Sixteen sections → nine.

Nothing that existed only on the home page was deleted:

- People and the Uniform showcase → moved to **about.html**
- FAQ → moved to **contact.html**
- Dropped outright: How We Work (duplicated Process), Safety, Compliance,
  Facility Stories (the Work page already covers it)

Home is now: hero → a day on site → service lines → facility map → about →
industries → process → testimonials → closing CTA.

---

## 7. PAGE HEROES

All seven inner pages had the photograph in a card beside the text. It is now
full-bleed behind the text, under a navy veil dark enough to hold contrast
whatever the photograph is, with white type, a frosted stat strip and a scroll
cue.

---

## 8. SMALLER FIXES FOUND WHILE TESTING

- **"Six service lines" sat next to a stat reading "Nine"**, and the process
  copy said "all nine". `data/services.json` has six. All three corrected, plus
  the `09` in the home hero stats.
- **Instagram icon rendered as a solid white square** — the glyph needs
  even-odd fill winding or its holes fill in. Fixed on all eight pages.
- **Mobile menu cut off Home and About** once the services sub-list expanded —
  the panel centred its content with no way to scroll. It now scrolls.
- **Mobile stat cells stretched** to a third of the screen each, inheriting a
  desktop flex-basis. Now sized to content.
- Address and GST from your signage added to `config.js`, the footer of every
  page, and the structured data.
- Logo assets right-sized: 900px wide serving a 34px render was 312KB; now
  58KB.
- Placeholder SVG logo files deleted, references updated.

---

## 9. TESTED

8 pages × 3 viewports (1440 / 900 / 390). No JavaScript errors, no failed
requests, no horizontal overflow, no broken images, nothing left invisible on
screen after a jump, an End press, a return to top or a mid-page scroll.

Not tested: real iOS/Android Safari and Chrome. Worth a pass on a real phone
before you send it to the client, particularly the dropdown's tap behaviour.

---
---

# Second pass — home page redesign

You said the home page read like a dashboard and pointed at the Bettada Hoovu
site as the kind of thing you wanted. This pass rebuilds `index.html` only.
The other seven pages are untouched.

## What was making it feel like a dashboard

White ground, a rounded card, a row of stats, a heading, more cards — every
section carried the same visual weight, so nothing led and nothing rested. It
read as a table of contents rather than a page.

## What I took from the reference, and what I did not

The reference is a travel brand: warm cream, forest green, italic serif, mountain
ridges. Apex sells facility management and its mark is navy and red. Copying the
skin would have fought your own logo, so I took the **structure** and rendered it
in Apex's colours.

| Their device | What it became here |
|---|---|
| Full-bleed photo hero, dark scrim | Same, deep navy scrim |
| Kannada wordmark watermark high on the photo | Your signage tagline, same position |
| Mountain ridge SVG at the hero base | A **building skyline** — the subject here is buildings |
| Headline line 2 in italic green | Line 2 in the logo's red |
| Stat band under the hero | Same, on navy |
| Warm cream and sand bands | Cool steel bands — industrial, and it matches the mark |
| Rich cards: badge, label on image, arrow | Service cards, same anatomy |
| One dark section as a pivot | The facility map section |

Deliberately not copied: the italic serif display face, the warm palette, the
wave dividers. Those belong to a hill-station travel company.

## New file

`css/home.css` — loaded only by `index.html`. Every change in this pass lives
there, so it can be read, tuned or removed as one block without touching the
pages you already approved.

## The changes

**Hero.** Now full-bleed. The photograph carries the whole first screen with a
slow 14s push-in, a two-pass scrim (vertical to seat the type, horizontal to
keep the left column readable while the right stays open), the signage tagline
as a watermark, and a three-layer skyline at the base so the hero hands over to
the navy band instead of ending on a hard edge. The six service lines sit as
circular thumbnails in the open right side — each is a real link into that
service, and hovering names it.

**Transparent nav over the hero.** A white bar on a full-bleed photograph cuts a
band across the top and wastes the first 82px of the picture. Over the hero the
bar is transparent with white type; the moment it sticks it becomes the solid
white bar the rest of the site uses.

**A reverse logo lockup.** The all-white wordmark lost the red A, which is the
most recognisable part of your mark. `apex-wordmark-reverse.png` keeps the A red
and turns only the navy PEX white. It is now used on the hero nav and in the
footer on every page.

**Red, softened for dark grounds.** `#C2161F` on white is your mark. At display
size on deep navy it vibrates — pure red against pure navy is the least stable
pair in the palette. `--red-lift: #F0554E` is the same hue lifted slightly, used
only on dark. On white the original red is unchanged.

**Stat band.** Four figures on navy directly under the hero, so the photograph
hands over to a solid block rather than straight back to white.

**Section bands.** The page now alternates white → steel → white → deep navy →
white → steel → navy. Each section arrives as a change of ground.

**Service cards rebuilt.** The old card was photo, heading, paragraph, chips and
a text link — five blocks of equal weight, and a 400px card whose only click
target was a 140px line of text. The title now sits on the photograph, the
number is a corner badge, and the whole card is the link.

**Two-tone headline.** Red second line on the hero and on the closing CTA only.
Those are the bookends of the page; using it everywhere would make it wallpaper.

## Two bugs found and fixed while building this

**White text on a light panel.** Putting the facility map section on the deep
band set `color:rgba(255,255,255,.82)` on the section, and the node read-out
card inside it was still a light panel — pale grey text on pale grey, the one
genuinely unreadable spot on the page. That card is now a glass panel that
belongs to the dark ground.

**Both logos rendering at once.** `components.css` has
`.nav-logo img { display:block }`, specificity (0,1,1). My `.logo-light
{ display:none }` was (0,1,0) and lost to it, so the dark and light wordmarks
drew on top of each other. Scoping to `.nav-logo .logo-light` makes it (0,2,0).
Worth knowing about if you add more element-level rules to that file.

## Tested

8 pages × 3 viewports (1440 / 768 / 390). No JS errors, no failed requests, no
horizontal overflow, no broken images, nothing invisible on screen after a jump
or an End press. Logo swap verified in both nav states, and the inner pages
confirmed unaffected.

---
---

# Third pass — lighter hero, rotation, letter type, clients, feedback

## 1. The hero is no longer dark

The scrim was taking the photograph down to roughly a third of its brightness.
Safe for contrast, but it made a well-lit office look like a night shift.

The gradients are now much lighter (top pass `.80 → .34`, side pass `.93 →
.72` and falling away faster), and the skyline layers were lightened with them.
The type is held instead by a `text-shadow` that darkens only what is behind
the letters, rather than the whole picture.

If you want it lighter still, `css/home.css` section 02 — drop the two numbers
in `.hero-scrim`. Below about `.28` on the side pass the white headline starts
to lose contrast against a bright window, so check it on the brightest slide.

## 2. The images now rotate

Five photographs, one per service line, cross-fading every 6 seconds with a
slow push-in underneath. New file: `js/hero.js`.

**Cross-fade, not slide.** A slide puts a hard vertical seam down the middle of
the screen with a different photograph either side of it, which reads as a
glitch. Fading, one photograph simply becomes the next. The push-in runs 9s
against a 6s hold, so it never finishes and freezes — the picture is still
moving when it hands over.

There are dots under the thumbnails to jump between them, the rotation pauses
when the browser tab is hidden, and it does not run at all for anyone who has
asked their system for reduced motion.

To change the pictures, edit the `SLIDES` array at the top of `js/hero.js`.

**One image removed:** `staff-team.jpg` was in the first version of the
rotation. It is a six-panel contact sheet, not a photograph, and at full bleed
it read as a broken grid. It is still used in the closing CTA, where a grid is
what it should look like.

## 3. Letter-by-letter type

The headline and the sentence under it now arrive one character at a time.
Headline at 46ms per letter, the paragraph at 11ms starting 0.9s later so they
do not overlap. Each letter fades up out of a small blur.

Two things worth knowing:

**It is accessible.** The text stays in the HTML, so it is there without
JavaScript and readable by search engines. Every generated letter span is
`aria-hidden` and the whole sentence is restored as the element's `aria-label`,
so a screen reader hears a sentence rather than twenty-three separate letters.
Without that, this effect is actively hostile.

**Words do not break.** The first build wrapped `sheet.` as `s / heet.` — an
inline-block per character gives the browser a legal break point between every
pair of letters. Letters are now grouped inside `.wrd` spans set to `nowrap`,
and the plain space between words is the only place a line may break.

Speed is per element: `data-letter-step` in milliseconds on the tag in
`index.html`. Raise it to slow the typing down.

## 4. Trusted by

A new strip under the stat band, fed by `data/clients.json`. Two copies of the
list run end to end and the track moves exactly one copy's width, so the loop
has no seam. It pauses on hover.

**Read this before showing the client.** Every entry is currently
`confirmed: false`, so the strip shows *facility types* — "Corporate campus,
IT park, Whitefield" — not company names, and it carries a visible note saying
a named list will replace it. Apex has not supplied a client list or written
permission to display one, and putting invented company names on a live site
is the kind of thing that costs a contract. Replace `name`, set
`confirmed: true`, and the note disappears once they all are.

## 5. Feedback

`data/feedback.json`, five entries, rendered as a scrolling rail with star
ratings, initials avatars and arrow paging. It replaces the old three-up
testimonial grid, which capped the section at three and made a fourth a layout
problem.

Same caveat as above: the statements describe outcomes facility managers ask
for, attributed to roles rather than named people, and the section says so
until you set `confirmed: true`.

## 6. A robustness fix made along the way

`render.js` loaded its JSON with `Promise.all`, which rejects on the first
failure — one missing file blanked *every* rendered section on the page. Adding
two more data files made that a real risk, so each file now resolves
independently. A file that 404s yields null and only its own section stays
empty.

## 7. Tested

8 pages × 3 viewports, clean. Also verified specifically:

- **Reduced motion** — letters and slides are not split or animated at all,
  everything is simply visible.
- **JavaScript disabled** — headline reads `We manage every detail.` at full
  opacity. Nothing waits on a script to become readable.
- **Mobile** — letter reveal, rotation and dots all behave at 390px.

---
---

# Fourth pass — light home page, and client logos

## 1. The home page is white now

Every dark block on `index.html` is gone. The inner pages are untouched — they
still have the dark photographic hero, which is what you asked for.

| Section | Was | Now |
|---|---|---|
| Hero | navy scrim over the photo, white type | white wash from the left, navy type |
| Nav over hero | transparent with white type | the standard white bar |
| Stat band | deep navy | steel, navy figures |
| Facility map | near-black navy | steel |
| Closing CTA | navy | steel |
| Footer | navy | **still navy** — it is the same footer on all eight pages |

**How the hero stays readable.** The photograph still runs full bleed and still
rotates. A white wash comes in from the left and holds near-solid across the
whole copy column before releasing the picture on the right. My first attempt
released it at 44% and the tail of the sentence sat on bare photo and faded
out; it now holds to 47% and falls away after that.

**The skyline is dropped on this page.** Three stepped silhouettes read as a
city profile against a dark photograph. Against a white wash they read as a
grey staircase sitting on the picture. The hero now just settles into the stat
band. The inner pages keep theirs.

**The red went back to the real one.** `#C2161F` — your actual mark — instead
of the lifted `#F0554E`. That lift only existed because pure red vibrates
against deep navy. On white it is unnecessary.

If you want the CTA back in navy, delete `cta--light` from the section tag in
`index.html`. Everything else is in `css/home.css` section 17.

## 2. Client logos — read this part

**I have not put real client logos on the site, and I would push back on doing
it the way you have asked.** Two separate problems:

**I do not know who Apex's clients are.** Nobody has told me. Anything I put
there would be a company I made up, printed on a live website as a customer.
That is a false claim about your business, and it is the sort of thing a
prospect checks.

**A logo is a trademark.** Putting a client's logo on your website needs their
written permission. Using one without it is not a small thing — it is a real
legal exposure, and most facility management contracts have a clause covering
exactly this. Worth reading yours before you publish any of them. A prospect
who spots a logo they know does not belong there will assume the rest of the
site is the same.

### What I built instead

The strip is now a **real logo wall** — it renders image files, greyscale at
rest and full colour on hover, which is the standard treatment and stops eight
brand palettes fighting each other.

It ships with eight placeholder logo files in `assets/images/clients/`. They
are abstract marks with the facility type beside them, drawn in your own
colours, sized and shaped exactly like real logo files. So the wall is
reviewable at the correct size and spacing right now, and nothing on it claims
a client you do not have. The note underneath says so in plain language.

### Putting the real ones in — about ten minutes

1. Get written permission from each client. An email saying yes is enough; keep
   it.
2. Export each logo at roughly **300 x 60**, SVG or PNG, transparent
   background. Landscape lockups sit best.
3. Drop the files into `assets/images/clients/`.
4. In `data/clients.json`, for each entry set `name`, `logo` (the filename) and
   `confirmed: true`.

The "these are placeholders" note removes itself once every entry is confirmed.
No CSS to change.

Full instructions are in `assets/images/clients/README.md`.

### If Apex is not ready to name clients

Delete `data/clients.json` and the whole strip disappears cleanly — no gap, no
broken layout. An honest page with no logo wall is a better look than a wall
you cannot stand behind. The stat band and the feedback section already carry
the credibility that strip was meant to add.

## 3. Fixed while building this

- The logo wall was invisible at first: greyscale plus 62% opacity on artwork
  that is already navy and grey left almost nothing on screen. Now 88%.
- The logo SVGs had a fixed 300-wide artboard with dead space to the right, so
  a 42px-tall logo rendered as roughly 30px of artwork with a wide margin. The
  artboards are now trimmed to the artwork.

## 4. Tested

8 pages × 3 viewports, clean. Confirmed the home page hero, stat band, facility
map and CTA all resolve to white or steel, and that `services.html` still
resolves to navy — the light treatment has not leaked into the inner pages.
