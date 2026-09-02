# Client logos

**Everything in this folder is a placeholder.** None of these are real company
logos. They are abstract marks with the facility type written beside them,
drawn in the site's own colours so the logo wall can be reviewed at the correct
size and spacing.

## Why there are no real logos here

Two reasons, and both matter:

1. **Nobody has told me who Apex's clients are.** Inventing names would put a
   false claim on a live site.
2. **Using a company's logo needs their permission.** A logo is a trademark.
   Putting a client's mark on your site without written sign-off is a real
   commercial risk, and it is the kind of thing that ends a contract rather
   than winning one. Most facility management agreements have a clause about
   this — worth checking yours before you publish any of them.

## How to put the real ones in

1. Get written permission from each client. An email saying "yes, you may use
   our logo on your website" is enough, and keep it.
2. Export each logo at about **300 x 60 px**, **SVG or PNG with a transparent
   background**. Landscape lockups work best; a square mark will look small
   next to the others.
3. Drop the file in this folder.
4. Open `data/clients.json` and for each entry set:
   - `name` — the company name (used as the image's alt text)
   - `logo` — the filename, e.g. `assets/images/clients/acme.svg`
   - `sector` — a short descriptor, e.g. "IT park, Whitefield"
   - `confirmed` — change to `true`

When every entry is `confirmed: true`, the "these are placeholders" note under
the strip disappears on its own. Until then it stays visible, on purpose.

## Not ready to name clients yet?

Delete `data/clients.json` and the whole strip disappears cleanly — no gap, no
broken layout. That is a better look than a wall of logos you cannot stand
behind.
