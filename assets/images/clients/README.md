# Client logos

Two real files are in here. Both were taken from the companies' own websites,
not from a search engine:

| File | Source |
|---|---|
| `wipro.png` | `wipro.com/content/dam/nexus/en/images/wipro_logo.png` |
| `garuda-mall.png` | `garudamall.in/garuda-logo-nobg.png` |

Both were trimmed of transparent padding and resized to 72px tall.

## The other eight

They render a monogram in the same box until a file is supplied. Here is what
happened when I went looking for each one:

| Client | Result |
|---|---|
| INOX | site returns 403 to anything that is not a browser (Akamai) |
| Raymond | same, 403 |
| VR Bengaluru | file found, but it is the white-on-transparent version — invisible on this light strip, and inverting someone's logo is not something to do without asking |
| St Peter's Hospital | no reachable site found |
| Swasya Living | site is Framer-hosted; the only SVG served is a background texture, not the mark |
| Sannidhi Eco Farms | Swasya Living project, same problem |
| Tanzior Jewels | incorporated Feb 2025, no published brand assets |
| Transit Food Court | no site found |

## Adding one properly

1. Ask the client for permission to name them, and ask for the logo file in
   the same message. Most companies have a brand or press kit and will send an
   SVG or a transparent PNG.
2. Drop the file in this folder, about 72px tall, transparent background.
3. Set the `logo` path on that entry in `data/clients.json`.
4. Run `node tools/build-data.js`.

`render.js` swaps the monogram for the image automatically. Nothing else
changes — the plate is the same shape either way, which is why a strip with
two logos and eight monograms still looks deliberate.

## Please do not source these from image search

Search results are full of superseded versions, fan recreations and JPEGs with
a white box baked into them. Put three of those next to each other and the
strip makes Apex look smaller, not larger. The logos are also registered
trademarks — Wipro, INOX, Raymond and VR Bengaluru all publish brand
guidelines — so the permission conversation has to happen regardless. Ask for
the file during that conversation and you get the correct one for free.
