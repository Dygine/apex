# Apex Integrated Facility Management — Website

A six-page, fully static marketing site built with HTML5, CSS3 and vanilla JavaScript.
GSAP, ScrollTrigger and Lenis are loaded from CDN for the scroll choreography; there is no
framework, no build step, no backend and no database.

Open `index.html` and it runs. Upload the folder to GitHub Pages, Netlify or Vercel and it runs there.

---

## 1. Folder structure

```
apex-integrated-facility-management/
│
├── index.html          Home — cinematic hero, pinned image stack, sticky story,
│                       facility map, horizontal rail, marquee, numbers,
│                       industries, operations, statements, process, safety,
│                       facility stories, testimonials, CTA
├── about.html          Story, mission/vision/values, approach, people, safety, quality
├── services.html       Nine service lines in detail + delivery process
├── industries.html     Eight sectors: challenges, requirements, response
├── projects.html       Demo case studies, clearly labelled
├── contact.html        Split-screen contact, floating-label form, map placeholder
│
├── css/
│   ├── style.css       Design tokens + every component and section (27 blocks)
│   └── responsive.css  All breakpoint rules, in one place
│
├── js/
│   ├── main.js         Interaction layer — nav, menu, cursor, industries,
│   │                   facility map, process, counters, form
│   └── animations.js   Lenis + GSAP ScrollTrigger choreography, with fallbacks
│
├── assets/
│   ├── images/         20 photographs (2.8 MB total)
│   └── icons/
│       └── favicon.svg Favicon placeholder
│
├── robots.txt
├── sitemap.xml
└── README.md
```

**Why the split.** `style.css` owns the design system so there is a single source of truth for
colour, type and spacing. `responsive.css` owns every media query, so changing behaviour at a
breakpoint never means hunting through the main file. `main.js` runs with or without GSAP;
`animations.js` is pure enhancement and bails out cleanly if the CDN is unreachable.

**No icon library.** Every icon is inline SVG. That removes a render-blocking request and keeps
the icons sharp at any size.

---

## 2. How to run it locally

**Simplest:** double-click `index.html`.

**Better** — a local server, which matches how the site behaves once deployed:

```bash
cd apex-integrated-facility-management
python -m http.server 8000     # then open http://localhost:8000

# or
npx serve
```

**VS Code:** install Live Server, right-click `index.html`, *Open with Live Server*.

---

## 3. How to deploy to GitHub Pages

1. Create a public repository on GitHub.

2. Push the contents of this folder to the repository root. `index.html` must be at the top
   level, not inside a subfolder:

   ```bash
   cd apex-integrated-facility-management
   git init
   git add .
   git commit -m "Apex IFM website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. **Settings → Pages → Build and deployment.** Set Source to `Deploy from a branch`, branch
   `main`, folder `/ (root)`. Save.

4. After a minute your link appears at the top of that page:
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`

**Three things that catch people out:**

- Every path in the code is relative (`css/style.css`, `about.html`). That is exactly what a
  project URL like `/YOUR-REPO/` needs. Do not change them to start with `/` — they will work
  locally and 404 on Pages.
- Filenames are case-sensitive on GitHub's servers but not on Windows. Keep everything lowercase.
- Page links use `about.html`, not `/about/`. No server-side routing is involved, so nothing
  needs a rewrite rule. Netlify and Vercel work the same way — drag the folder in, no config.

---

## 4. Where to replace company details

| What | Where |
|---|---|
| Phone, email, WhatsApp | Search `data-placeholder` — every placeholder carries it |
| Office address | `contact.html` (`.ctc-details`) and the footer of all six pages |
| Domain in canonical + Open Graph | `<head>` of each page — replace `https://example.com/` |
| Domain in `robots.txt` and `sitemap.xml` | Both files, replace `example.com` |
| Logo wordmark | The `.nav-logo` block and `.foot-brand` in each page |
| Favicon | `assets/icons/favicon.svg` |
| Copyright year | Auto-updates via `data-year` in `js/main.js` |

The WhatsApp link format is `https://wa.me/91` followed by the 10-digit number, no `+` or spaces.

**Map placeholder.** `contact.html` has a `.map-holder` block near the bottom. Replace the inner
`<div>` with a Google Maps embed:

```html
<iframe src="PASTE_EMBED_URL" width="100%" height="100%" style="border:0"
        allowfullscreen loading="lazy" title="Apex office location"></iframe>
```

**Two demo notices to delete before launch:** the line under the WhatsApp/Call/Email buttons on
`contact.html`, and "Demonstration website…" in the footer of all six pages.

---

## 5. Where to replace images

All 20 live in `assets/images/`. Drop replacements in using the **same filenames** and nothing
else needs editing.

| File | Used for |
|---|---|
| `hero-towers.jpg` | Home hero background (widest — use a landscape shot) |
| `portrait-tech.jpg`, `ops-control.jpg` | Hero foreground cards |
| `about-housekeeping.jpg`, `crew-sky.jpg`, `tech-team.jpg` | Story, about, marquee |
| `safety-engineer.jpg`, `quality-plantroom.jpg`, `welding.jpg` | Safety, HVAC, electrical |
| `corridor.jpg` | Contact hero, pest control |
| `hub-facility.jpg` | Spare |
| `ind-*.jpg` (8) | Industry cards and previews |

Keep roughly the same shape — the hero wants landscape, industry cards are landscape, the about
main image is portrait. **Update the `alt` text** when you swap a photo; it is written
descriptively for accessibility and SEO, so a stale description is worse than none.

Current photographs are Unsplash stock used under the Unsplash License. Replacing them with the
client's own site photography will lift the design more than any other single change.

---

## 6. Where to replace demo statistics

**Home, "By the numbers"** — search `data-count`:

```html
<div class="nums-cell"><b><span data-count="10">0</span><i>+</i></b><span>Service categories</span></div>
```

`data-count` is the number counted to; the `<i>` is the suffix (`+`, `/7`, `°`, `%`); the trailing
`<span>` is the label. The section ends with a visible note calling them demonstration figures —
delete that line once the numbers are real.

**Home hero strip** — three figures in `.hero-stats`, hardcoded (not animated).

**Operations board** — `data-val` on each `.ops-bar i` drives the bar width, 0–100. These are
labelled "illustrative" in the UI. Both the label and the note should change when real data exists.

**Page hero meta rows** — the `.phero-meta` blocks on the five inner pages.

---

## 7. Where to replace demo projects and testimonials

**Projects.** `projects.html` holds four `.detail-item` blocks, each marked `Demo project`, plus a
standing notice at the top of the page. The structure per case is: challenge, approach, services in
scope, outcome. Replace the text, delete the `demo-tag` span and the notice block, and the layout
takes real content without any CSS changes. The home page has a matching four-card teaser under
`<!-- ══ 14 FACILITY STORIES ══ -->` with the same `demo-tag` markers.

**Testimonials.** `index.html`, marked in the source:

```html
<!-- DEMO CONTENT — REPLACE WITH REAL CLIENT TESTIMONIALS.
     Names below are role descriptions, not real individuals or companies. -->
```

Quotes are attributed to roles ("Facility manager, corporate office — placeholder"), never to
invented people or companies. Swap in real quotes with permission, or delete the section.

**Making the form live.** It is front-end only — `js/main.js` section 10 validates and shows a
confirmation. Nothing is transmitted or stored. To connect it, use Formspree, Web3Forms or Netlify
Forms: add an `action` URL to the `<form>` and remove the `e.preventDefault()` line. All three have
free tiers and work on static hosting.

---

## 8. Production-readiness check

Verified in headless Chromium against a local server.

| Check | Result |
|---|---|
| JavaScript errors, all 6 pages | none |
| Failed network requests | none |
| Images loading (115 across the site) | 115/115 |
| Broken internal links | none |
| Horizontal overflow @ 1920/1440/1366/768/430/390 | none |
| `<h1>` per page | exactly 1 |
| Images without `alt` | 0 |
| Unique title + meta description per page | yes, 6/6 |
| Canonical + Open Graph tags | on all 6 pages |
| Form: blocks empty submit | 4 fields flagged |
| Form: rejects malformed email | pass |
| Form: valid submit → success animation | pass |
| Form: reset restores and clears | pass |
| Mobile menu: opens, locks scroll, closes on Escape | pass |
| Reduced motion: hidden elements | 0 (all content visible) |
| Reduced motion: custom cursor | disabled |

**Accessibility.** Semantic sectioning, one `<h1>` per page, skip link, visible focus rings, ARIA
on the menu toggle, keyboard-reachable industry rows and process steps, and `alt` on every image.
`prefers-reduced-motion` disables Lenis, GSAP, the custom cursor and all ambient animation, then
reveals every element that would otherwise animate in.

**Performance.** No framework. Below-the-fold images are lazy-loaded; hero images use
`fetchpriority="high"`. Scroll handlers are throttled with `requestAnimationFrame`. Counters,
bars and reveals use `IntersectionObserver`. Total image payload is 2.8 MB across 20 files.

**Graceful degradation.** If the GSAP or Lenis CDN is blocked, `animations.js` detects it and calls
`revealAll()` — the site renders as a clean, fully functional static page with no invisible content.
The same path runs under reduced-motion. Pinned sections (image stack, horizontal rail) are desktop
only; touch devices get purpose-built vertical equivalents rather than a broken pin.

**Known limitations.** Google Fonts is the one external dependency for typography; if it fails the
site falls back to system sans-serif. The two pinned sections make the home page long by design
(roughly 24,000px at 1440 wide) — that is the scroll experience, not a layout bug.
