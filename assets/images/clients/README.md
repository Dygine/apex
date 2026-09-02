# Client logos

Seven of the ten clients now have a logo file. The other three render a
monogram in the same plate until artwork is supplied.

| File | Source |
|---|---|
| `wipro.png` | `wipro.com` — official site |
| `garuda-mall.png` | `garudamall.in` — official site |
| `inox.png` | supplied by Apex; cropped out of an "INOX Group / Team India" sponsor lockup |
| `vr-bengaluru.png` | supplied by Apex as white-on-black; inverted to sit on a light plate |
| `raymond.png` | supplied by Apex; transparency checkerboard was baked into the file and has been cleaned |
| `st-peters-hospital.png` | supplied by Apex |
| `swasya-living.png` | supplied by Apex |

All are trimmed of surrounding whitespace, made transparent and resized to
72px tall.

## The three still on monograms

**Sannidhi Eco Farms** — the file supplied was a wordmark lifted from a slide,
not the company's logo, and at roughly 13:1 it shrinks to an illegible smear
inside the 74x40 mark box. The plate already prints the name in full beside
the mark, so a monogram reads better than an unreadable image.


**Tanzior Jewels** — the file supplied was the logo of Tynor, an orthopaedic
products brand. Different company. Because the plate shows the client name
beside the mark, dropping that file in would put "Tanzior Jewels" next to a
logo reading "tynor", which reads as an error rather than a credential. If
the client is actually Tynor, change the `name` in `data/clients.json` and the
file can go in.

**Transit Food Court** — the file supplied was a stock logo template reading
"Fast Food Court / Your tagline here". Same problem: the plate would pair the
name "Transit Food Court" with a mark naming a different business.

## Quality note

Every supplied file was under 300px wide before processing. They are sharp
enough at the 40px display height used in the strip, but if any of these are
ever needed larger — print, a case study header — ask the client for an SVG.

## Adding one properly

1. Ask the client for permission to name them, and ask for the logo file in
   the same message. Most companies have a brand or press kit.
2. Drop the file in this folder, about 72px tall, transparent background.
3. Set the `logo` path on that entry in `data/clients.json`.
4. Run `node tools/build-data.js`.

`render.js` swaps the monogram for the image automatically. The plate is the
same shape either way, which is why a strip mixing logos and monograms still
looks deliberate.

## Please do not source these from image search

Search results are full of superseded versions, fan recreations, stock
templates and JPEGs with a white box baked in. The logos are also registered
trademarks — Wipro, INOX, Raymond and VR Bengaluru all publish brand
guidelines — so the permission conversation has to happen regardless. Ask for
the file during that conversation and you get the correct one for free.
