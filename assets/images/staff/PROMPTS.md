# Apex — photography prompt pack

Twelve slots. Each one currently holds a branded placeholder. Generate or shoot
a replacement, save it at **the same filename and roughly the same aspect
ratio**, and drop it into `assets/images/staff/`. Nothing else on the site needs
editing — the alt text is already written to match the scene described here.

Krishna: these are written for Google Flow / Midjourney / Flux. Run the shared
style block below with each scene prompt so the twelve images look like one
company's photography rather than twelve unrelated stock shots.

---

## Shared style block — append to every prompt

> Realistic commercial photography, Indian professionals, natural indoor
> lighting, shallow depth of field, 35mm lens look, muted colour grade with deep
> navy and warm neutral tones, no text overlays, no logos other than a plain
> navy uniform, calm confident expressions, documentary corporate style, not
> stock-photo posed, not glossy, not cartoonish, no AI artefacts on hands or
> faces.

## Shared uniform description — append to every prompt with a person in it

> Wearing a dark navy (#16233D) short-sleeve work shirt with a small
> embroidered chevron logo on the left chest, a green name badge on the right
> chest, and a photo ID card on a green lanyard.

**On the logo:** most image models will not render your actual mark correctly.
Generate the photos with a *plain* navy uniform, then stamp the real logo on
afterwards with `tools/brand-photos.py` (see below). That gives you a consistent,
correct mark across all twelve images instead of twelve slightly wrong ones.

---

## The twelve slots

| Slot | File | Size | Scene prompt |
|---|---|---|---|
| AX-01 | `staff-supervisor.jpg` | 1600×1066 | An Indian facility supervisor standing on a modern corporate office floor, holding a tablet, mid-conversation, glass partitions and desks softly out of focus behind. |
| AX-02 | `staff-team.jpg` | 1600×1000 | A team of six to eight Indian facility staff standing together in a premium office lobby, mixed roles, natural unposed spacing, one supervisor slightly forward. |
| AX-03 | `staff-housekeeping.jpg` | 1200×800 | An Indian housekeeping professional cleaning a glass meeting-room partition in a modern office, cleaning trolley beside her, morning light through windows. |
| AX-04 | `staff-technician.jpg` | 1200×800 | An Indian maintenance technician checking an electrical distribution panel in a commercial building plant room, torch in hand, safety gloves, concentrating. |
| AX-05 | `staff-security.jpg` | 1200×800 | An Indian security professional at the main entrance of a modern corporate building, standing at a reception desk, calm and alert, glass doors behind. |
| AX-06 | `staff-landscape.jpg` | 1200×800 | An Indian landscaping worker trimming a hedge on a corporate campus lawn, office building softly out of focus behind, early morning light. |
| AX-07 | `staff-inspection.jpg` | 1400×900 | An Indian facility supervisor walking a corridor with two staff members, pointing at something off-frame, clipboard in hand, mid-inspection. |
| AX-08 | `staff-pest.jpg` | 1200×800 | An Indian pest-management technician applying a treatment along the skirting of a commercial kitchen service area, wearing gloves and a mask, service log visible. |
| AX-09 | `uniform-full.jpg` | 900×1200 | Full head-to-toe standing portrait of an Indian facility supervisor in uniform against a plain warm grey studio background, hands relaxed, clean black shoes, neutral expression. |
| AX-10 | `uniform-logo.jpg` | 800×800 | Extreme close crop on the left chest of a navy work shirt showing the embroidered logo and fabric texture, shallow depth of field. |
| AX-11 | `uniform-id.jpg` | 800×800 | Close crop on a photo ID card hanging from a green lanyard against a navy shirt, card slightly angled, shallow depth of field. |
| AX-12 | `staff-briefing.jpg` | 1400×900 | An Indian facility supervisor briefing a line of staff at the start of a shift in a back-of-house corridor, staff listening, clipboard in the supervisor's hand. |

---

## Stamping the logo on afterwards

```bash
# preview where the logo will land on one image
python3 tools/brand-photos.py --preview staff-supervisor.jpg

# stamp every slot that has a placement defined
python3 tools/brand-photos.py --all
```

Placements live in `tools/brand-photos.py` under `PLACEMENTS`, as percentages of
image width and height. Adjust the numbers, re-run, done. Originals are copied to
`assets/images/staff/_original/` first, so you can re-run as many times as you like.

---

## If you would rather not generate images

Two other routes, in order of how well they'll land with the client:

1. **A half-day shoot.** Six people, one office, a borrowed lobby. This beats
   every generated option and it is the thing the reference sites do not have —
   Auronixx, FrameX and CMN all run generic stock. FrameX is currently shipping a
   literal "replace with your office photo" placeholder on their live homepage.
2. **Licensed Indian stock.** Search for Indian office cleaning, Indian security
   guard, Indian maintenance technician on a paid library. Then run
   `brand-photos.py` over the results so at least the branding is consistent.

Do not use images from any of the six reference sites.
