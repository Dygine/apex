# Apex Integrated Facility Management — website

Seven pages. HTML5, CSS3, vanilla JavaScript. GSAP, ScrollTrigger and Lenis from
CDN for the scroll work. No framework, no build step, no backend, no database.

Open `index.html` and it runs. Push the folder to GitHub Pages and it runs there.

---

## 1. Read this first — the one gap

**The staff photography is not real yet.** Twelve photo slots hold branded
placeholders showing the slot code and the scene each one wants. Every prompt is
written and waiting in `assets/images/staff/PROMPTS.md`.

Until those are replaced, the site is a complete and honest demo — but it is not
finished. Nothing else on the site is blocked on anything.

```bash
# 1. Generate or shoot the twelve images (prompts in PROMPTS.md)
# 2. Save each at the same filename in assets/images/staff/
# 3. Stamp the Apex logo on consistently
python3 tools/brand-photos.py --preview staff-supervisor.jpg   # check placement
python3 tools/brand-photos.py --all                            # stamp everything
python3 tools/brand-photos.py --restore                        # undo, any time
```

No HTML changes needed. The `alt` text is already written to match each scene.

---

## 2. Folder structure

```
apex-integrated-facility-management/
│
├── index.html          Home — 18 sections
├── about.html          Who Apex is, approach, people, safety, quality
├── services.html       Six service lines in full, from JSON
├── industries.html     Ten facility types, from JSON
├── process.html        Assess → Plan → Deploy → Monitor → Improve   (new)
├── work.html           Filterable worked examples + lightbox         (new)
├── contact.html        Enquiry form, contact details, map slot
│
├── data/               ← EDIT CONTENT HERE
│   ├── services.json     Service lines. Delete one and it vanishes site-wide.
│   ├── industries.json   Facility types
│   ├── projects.json     Worked examples shown on work.html
│   ├── faq.json          Questions and answers
│   ├── team.json         Roles in the People section
│   └── uniform.json      Uniform hotspots and copy
│
├── js/
│   ├── config.js       ← EDIT COMPANY DETAILS HERE (phone, email, address…)
│   ├── data.js         Auto-generated offline snapshot — do not hand-edit
│   ├── render.js       Turns config + JSON into the page
│   ├── main.js         Nav, menu, cursor, facility map, counters, form
│   └── animations.js   Lenis + GSAP choreography, with fallbacks
│
├── css/
│   ├── style.css       Design tokens and the original components
│   ├── components.css  Sections added in this build
│   └── responsive.css  Every media query, in one file
│
├── assets/
│   ├── brand/
│   │   ├── apex-logo.svg          ← REPLACE with the real logo
│   │   ├── apex-mark.svg          ← REPLACE (mark only, used in nav + favicon)
│   │   ├── apex-mark-mono.svg     ← REPLACE (single colour, for embroidery)
│   │   └── apex-uniform-spec.svg  Vendor-ready uniform drawing
│   ├── images/
│   │   ├── staff/      12 photo slots + PROMPTS.md
│   │   └── *.jpg       Buildings, interiors, facility types
│   └── icons/favicon.svg          ← REPLACE (match apex-mark.svg)
│
├── tools/              Maintenance scripts, not part of the site
│   ├── build-data.js        Refresh js/data.js after editing JSON
│   ├── brand-photos.py      Stamp the logo onto photographs
│   ├── make-placeholders.py Regenerate the placeholder slots
│   └── test-site.py         Full production-readiness check
│
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 3. Where to change things

| What | Where | Notes |
|---|---|---|
| Phone, email, WhatsApp, address | `js/config.js` | One file. Updates nav, footer, contact page and WhatsApp button on all seven pages. |
| Add / remove / reorder a service | `data/services.json` | Home sequence, services page and the contact form dropdown all follow. |
| Facility types | `data/industries.json` | Home list, industries page, contact form dropdown. |
| FAQ questions | `data/faq.json` | |
| Worked examples | `data/projects.json` | Set `"demo": false` to drop the DEMO tag. |
| People roles | `data/team.json` | |
| Uniform hotspots | `data/uniform.json` | `x` / `y` are percentages of the image. |
| Logo | `assets/brand/*.svg` + `assets/icons/favicon.svg` | Four files, all currently placeholders. |
| Uniform spec sheet | `assets/brand/apex-uniform-spec.svg` | Print it, send it to a uniform vendor. |
| Turn off every demo notice | `js/config.js` → `demoMode: false` | Single switch for launch day. |
| Domain | `js/config.js` → `domain`, plus `robots.txt`, `sitemap.xml`, and the canonical/OG tags in each `<head>` | |

**After editing any JSON file, run:**

```bash
node tools/build-data.js
```

That refreshes `js/data.js`, the offline snapshot used when someone opens the
site by double-clicking rather than through a server. Skip it and the site still
works everywhere except `file://`.

### The `confirmed` flag

Contact fields in `config.js` look like this:

```js
phone: { value: '+91 00000 00000', confirmed: false },
```

While `confirmed` is `false` the value renders greyed with a dashed underline and
the link is disabled — so a half-filled site never looks like it is stating a
fact. Set it to `true` once the real value is in. The WhatsApp button hides
entirely until its number is confirmed, rather than showing a dead one.

---

## 4. Running it locally

```bash
cd apex-integrated-facility-management
python3 -m http.server 8000     # then open http://localhost:8000
```

Or VS Code Live Server, or `npx serve`. Double-clicking `index.html` also works
via the `js/data.js` fallback.

---

## 5. Deploying to GitHub Pages

1. Create a repository and push the contents of this folder to the **root** —
   `index.html` must be at the top level.

   ```bash
   git init && git add . && git commit -m "Apex IFM website"
   git branch -M main
   git remote add origin https://github.com/USER/REPO.git
   git push -u origin main
   ```

2. **Settings → Pages → Build and deployment.** Source: `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.

3. The link appears at the top of that page after a minute.

Three things that catch people out:

- Every path is relative (`css/style.css`, not `/css/style.css`). A leading slash
  works locally and 404s on a project URL like `/REPO/`.
- GitHub's servers are case-sensitive; Windows is not. Keep filenames lowercase.
- Links are `about.html`, not `/about/`. No rewrite rules needed. Netlify and
  Vercel behave the same way — drag the folder in, no config.

---

## 6. Making the enquiry form live

It is front-end only: `js/main.js` validates, shows a confirmation, and sends
nothing. To connect it, use Formspree, Web3Forms or Netlify Forms — add an
`action` URL to the `<form>` and remove the `e.preventDefault()` line. All three
have free tiers and work on static hosting.

---

## 7. What was verified

`tools/test-site.py` runs all seven pages in headless Chromium. Latest run:

| Check | Result |
|---|---|
| JavaScript errors, 7 pages | none |
| Failed network requests | none |
| Broken images | none |
| Dead internal links | none |
| Horizontal overflow @ 1920/1440/1366/1024/768/430/390/360 | none |
| One `<h1>` per page | 7/7 |
| Images without `alt` | 0 |
| Unique title + meta description | 7/7 |
| Canonical, Open Graph, structured data | all pages |
| JSON rendering | 6 services, 10 industries, 5 roles, 6 hotspots, 8 questions, 6 examples |
| FAQ accordion | opens; one panel at a time |
| Uniform hotspots | click and hover both select |
| Work filter | 6 → 2 on filtering |
| Lightbox | opens; closes on Escape |
| Mobile menu | opens; closes on Escape |
| Contact form | flags 4 empty required fields; dropdowns populate from JSON |
| Process scroll story | advances through all five stages |
| Reduced motion | 0 elements left invisible |

Re-run any time:

```bash
python3 -m http.server 8899 &
python3 tools/test-site.py
```

**Accessibility.** Semantic sectioning, skip link, visible focus rings, ARIA on
the menu toggle and FAQ panels, keyboard-reachable hotspots and industry rows,
`alt` on every image. `prefers-reduced-motion` disables Lenis, GSAP, the custom
cursor and all ambient motion, un-pins the sticky sections, and reveals
everything that would otherwise animate in.

**Graceful degradation.** If the GSAP or Lenis CDN is blocked, `animations.js`
detects it and calls `revealAll()` — the site renders as a clean static page with
nothing invisible. If `fetch` is unavailable, `js/data.js` supplies the content.
Pinned sections are desktop-only; touch devices get purpose-built vertical
equivalents rather than a broken pin.

---

## 8. Tuning the scroll speed

Top of `js/animations.js`:

```js
var SMOOTH_SCROLL = true;   // false = native browser scrolling
var SCROLL_EASE   = 0.75;   // lower = snappier. 0.6 quick, 1.2 floaty
```

Setting `SMOOTH_SCROLL = false` turns Lenis off entirely. Every scroll animation
still works.

---

## 9. Before launch — checklist

- [ ] Replace the four logo files and re-export the uniform spec sheet
- [ ] Replace the twelve photo slots, then run `tools/brand-photos.py --all`
- [ ] Fill `js/config.js` and flip each `confirmed` to `true`
- [ ] Set `demoMode: false` in `js/config.js`
- [ ] Replace `example.com` in `robots.txt`, `sitemap.xml` and every `<head>`
- [ ] Replace or delete the `data/projects.json` demo entries
- [ ] Replace or delete the testimonials block in `index.html` (marked in source)
- [ ] Add the Google Maps embed in `contact.html` (`.map-holder`)
- [ ] Add compliance registrations to the compliance section — only ones Apex holds
- [ ] Connect the form to Formspree / Web3Forms / Netlify Forms
- [ ] Delete `tools/` from the deployed copy if you would rather not ship it
