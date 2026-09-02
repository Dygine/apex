# Apex — deployment guide

Static site. No build step, no backend, no database, no third-party
JavaScript. Upload the folder and it runs.

`tools/` and `data/` are development files — `tools/` is not needed on the
server (`robots.txt` and `.htaccess` both block it), `data/` is the content
source and is read by `tools/build-data.js`, not by the browser.

---

## Before you upload — four things

### 1. Set the domain (one command)

The domain appears in eleven places: a canonical link and an `og:url` on each
of seven pages, plus `robots.txt`, `sitemap.xml` and `js/config.js`. Missing
one is the commonest way a launch goes wrong — Google indexes `example.com`,
or a shared WhatsApp link previews as a dead URL.

```bash
node tools/set-domain.js https://www.yourdomain.com
```

Safe to run more than once. If the domain changes later, run it again.

### 2. Real contact details

In `js/config.js`:

```js
phone:    { value: '+91 …',        confirmed: true },
email:    { value: '…@…',          confirmed: true },
whatsapp: { value: '919876543210', confirmed: true },   // digits only, no +
```

While `confirmed:false` these render greyed out with a "to be confirmed"
note, which is deliberate — a half-filled site should not look like it is
claiming something untrue. The WhatsApp button currently opens the contact
page instead of a dead `wa.me` link.

### 3. Turn off demo mode

```js
demoMode: false
```

That single switch hides every "demonstration website" notice across all
seven pages.

### 4. Replace the seven placeholder images

These are unfilled slot cards, not photographs. Spot them by file size — all
under 80KB, against 130–500KB for the real ones:

```
assets/images/ind-hospital.jpg     assets/images/ind-hotel.jpg
assets/images/ind-corporate.jpg    assets/images/ind-retail.jpg
assets/images/ind-warehouse.jpg    assets/images/staff/uniform-logo.jpg
assets/images/ind-education.jpg
```

`tools/test-site.py` lists them every run, so you will not forget.

---

## Upload

**cPanel / A2 Hosting.** Upload the folder contents to `public_html/`.
`.htaccess` is already there. Open it and uncomment the HTTPS block and
**one** of the www / non-www rules — enabling both is a redirect loop.

**Cloudflare Pages / Netlify.** Connect the repo, leave the build command
empty, set the output directory to `/`. `_headers` is picked up
automatically; `.htaccess` is ignored.

Both configs set the same caching: HTML never cached hard so a content edit
goes live immediately, assets cached for a year. Rename an asset file when
you change it.

---

## After you upload

1. **Google Search Console** — add the property, verify by DNS, submit
   `https://yourdomain.com/sitemap.xml`.
2. **Google Business Profile** — the `ProfessionalService` structured data on
   the home page should match the GBP listing exactly: same name, same
   address, same phone. Mismatches hurt local ranking.
3. Check `https://yourdomain.com/404` shows the styled 404, not the host's
   default page.
4. Share a link in WhatsApp and confirm the preview card shows the right
   image and title.
5. Send the contact form once and confirm where it goes — **see the warning
   below**.

---

## The contact form does not send anything

`js/main.js` validates the form and shows a success state. It is a front-end
demonstration only. **Nothing is transmitted and nothing is stored.** Before
launch, pick one:

- **Formspree / Web3Forms / Getform** — change the `<form>` action, no server
  code. Fastest.
- **A PHP handler** on cPanel — `mail()` or PHPMailer via SMTP. More
  reliable delivery than `mail()` alone.
- **Cloudflare Pages Function** if you host there.

Whichever you choose, add a honeypot field or a captcha. A public contact
form with no spam guard fills up within a week.

---

## Testing

```bash
python3 -m http.server 8899 &
python3 tools/test-site.py
```

Checks every page at nine widths from 1920 down to 360 and reports:

- console errors and failed requests
- images that did not load
- internal links pointing at a file that is not there
- in-page anchors with no target
- horizontal overflow at any width
- title and meta description length, canonical, Open Graph
- exactly one `h1` per page, no skipped heading levels
- `alt` on every image, accessible name on every link and button
- tap targets under 30px on a phone
- leftover `example.com`, placeholder contact details, demo mode, unfilled images

**Current state: 0 failures.** The 19 warnings are all content gaps for you
to fill — domain, contact details and the seven placeholder photographs.

---

## SEO, what is already done

- Unique title and meta description on every page
- Canonical and Open Graph on all seven pages
- `sitemap.xml` with `lastmod`, priorities and change frequency
- `robots.txt` blocking `/tools/` and `/data/`
- `ProfessionalService` structured data on the home page, with address, GST
  and service area
- `BreadcrumbList` on all six inner pages
- `FAQPage` on the contact page, generated from `data/faq.json`
- 404 marked `noindex, follow`
- Semantic headings, one `h1` per page
- Descriptive `alt` on every image
- Lazy loading below the fold, `fetchpriority="high"` on the hero
- Security headers in both host configs

**Not done, and only you can do it:** Google Business Profile, local
citations, and any content aimed at specific search terms. If you want
"facility management company in Bangalore" to rank, that is a content and
GBP job, not a markup job.

---

## Changing content later

Almost nothing needs an HTML edit.

| To change | Edit | Then |
|---|---|---|
| Phone, email, address, GST, social links | `js/config.js` | nothing |
| Service lines | `data/services.json` | `node tools/build-data.js` |
| Industries | `data/industries.json` | same |
| Client list and logos | `data/clients.json` | same |
| FAQ | `data/faq.json` | same |
| Worked examples | `data/projects.json` | same |
| Feedback | `data/feedback.json` | same |
| Per-page accent colour | `css/page-accent.css` | nothing |

`tools/build-data.js` regenerates `js/data.js`, which is the offline snapshot
that lets the site work from `file://` as well as over HTTP. Forget to run it
and the site keeps showing the old content.

---

## Credits

Footer carries "Digital partner — Dygine Software Solution", linking to
`https://dygine.com` in a new tab, on all seven pages plus the 404. It is in
`.foot-bottom` on each page; styling is `.foot-credit` in
`css/page-accent.css`.
