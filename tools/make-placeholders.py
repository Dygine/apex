#!/usr/bin/env python3
"""
Generates the branded placeholder images that stand in for Apex staff
photography until real photographs exist.

Run:  python3 tools/make_placeholders.py

Every slot below writes to assets/images/staff/<file>. To use a real photo,
drop it in at the same filename and the same aspect ratio. Nothing else
needs to change anywhere in the site.
"""
from PIL import Image, ImageDraw, ImageFont
import os, textwrap

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "images", "staff")
os.makedirs(OUT, exist_ok=True)

NAVY   = (22, 35, 61)
NAVY_2 = (12, 18, 32)
BONE   = (251, 250, 247)
SIGNAL = (15, 164, 127)
MUTE   = (128, 143, 170)

F_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
F_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


# code, filename, width, height, role label, scene summary
SLOTS = [
    ("AX-01", "staff-supervisor.jpg",     1600, 1066, "FACILITY SUPERVISOR",   "Corporate office floor, tablet in hand"),
    ("AX-02", "staff-team.jpg",           1600, 1000, "FACILITY TEAM",         "Full team lineup, premium office lobby"),
    ("AX-03", "staff-housekeeping.jpg",   1200,  800, "HOUSEKEEPING",          "Cleaning a modern office workspace"),
    ("AX-04", "staff-technician.jpg",     1200,  800, "TECHNICAL",             "Inspecting HVAC / electrical plant"),
    ("AX-05", "staff-security.jpg",       1200,  800, "SECURITY",              "Corporate building main entrance"),
    ("AX-06", "staff-landscape.jpg",      1200,  800, "LANDSCAPING",           "Maintaining a corporate campus lawn"),
    ("AX-07", "staff-inspection.jpg",     1400,  900, "SITE INSPECTION",       "Supervisor walking a site with staff"),
    ("AX-08", "staff-pest.jpg",           1200,  800, "PEST MANAGEMENT",       "Documented treatment in a service area"),
    ("AX-09", "uniform-full.jpg",          900, 1200, "UNIFORM — FULL",        "Head-to-toe standing portrait"),
    ("AX-10", "uniform-logo.jpg",          800,  800, "UNIFORM — CHEST LOGO",  "Close crop on embroidered chest logo"),
    ("AX-11", "uniform-id.jpg",            800,  800, "UNIFORM — PHOTO ID",    "Close crop on ID card and lanyard"),
    ("AX-12", "staff-briefing.jpg",       1400,  900, "SHIFT BRIEFING",        "Morning briefing before deployment"),
]


def draw_mark(d, cx, cy, s, colour=BONE, accent=SIGNAL):
    """The Apex chevron mark, drawn to scale."""
    d.polygon([(cx, cy - s), (cx + s * 0.63, cy + s * 0.63), (cx + s * 0.33, cy + s * 0.63),
               (cx, cy - s * 0.06), (cx - s * 0.33, cy + s * 0.63), (cx - s * 0.63, cy + s * 0.63)],
              fill=colour)
    d.rectangle([cx - s * 0.33, cy + s * 0.74, cx + s * 0.33, cy + s * 0.87], fill=accent)


def build(code, name, w, h, role, scene):
    img = Image.new("RGB", (w, h), NAVY)
    d = ImageDraw.Draw(img)

    # diagonal wash so flat areas are never dead
    for y in range(h):
        t = y / h
        d.line([(0, y), (w, y)],
               fill=(int(NAVY[0] + (NAVY_2[0] - NAVY[0]) * t),
                     int(NAVY[1] + (NAVY_2[1] - NAVY[1]) * t),
                     int(NAVY[2] + (NAVY_2[2] - NAVY[2]) * t)))

    # technical grid
    step = max(w, h) // 22
    grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, w, step):
        gd.line([(x, 0), (x, h)], fill=(255, 255, 255, 10))
    for y in range(0, h, step):
        gd.line([(0, y), (w, y)], fill=(255, 255, 255, 10))
    img = Image.alpha_composite(img.convert("RGBA"), grid).convert("RGB")
    d = ImageDraw.Draw(img)

    # crop frame
    m = int(min(w, h) * 0.055)
    d.rectangle([m, m, w - m, h - m], outline=(255, 255, 255, 40), width=1)
    c = int(min(w, h) * 0.045)
    for (px, py, dx, dy) in ((m, m, 1, 1), (w - m, m, -1, 1), (m, h - m, 1, -1), (w - m, h - m, -1, -1)):
        d.line([(px, py), (px + c * dx, py)], fill=SIGNAL, width=3)
        d.line([(px, py), (px, py + c * dy)], fill=SIGNAL, width=3)

    scale = min(w, h)
    draw_mark(d, w // 2, int(h * 0.40), scale * 0.085)

    f_role  = font(F_BOLD, int(scale * 0.052))
    f_meta  = font(F_MONO, int(scale * 0.024))
    f_small = font(F_MONO, int(scale * 0.021))

    def centre(text, f, y, fill):
        bb = d.textbbox((0, 0), text, font=f)
        d.text(((w - (bb[2] - bb[0])) / 2, y), text, font=f, fill=fill)

    centre(role, f_role, int(h * 0.53), BONE)
    centre(scene, f_small, int(h * 0.615), MUTE)

    lab = "PHOTOGRAPH SLOT " + code
    centre(lab, f_meta, int(h * 0.685), SIGNAL)
    centre("REPLACE WITH REAL APEX PHOTOGRAPH", f_small, int(h * 0.735), MUTE)

    d.text((m + 14, m + 12), f"{w} x {h}", font=f_small, fill=(255, 255, 255))
    bb = d.textbbox((0, 0), name, font=f_small)
    d.text((w - m - 14 - (bb[2] - bb[0]), m + 12), name, font=f_small, fill=(255, 255, 255))

    img.save(os.path.join(OUT, name), quality=86, optimize=True)
    return name


if __name__ == "__main__":
    for s in SLOTS:
        print("wrote", build(*s))
    print(f"\n{len(SLOTS)} placeholders written to assets/images/staff/")
