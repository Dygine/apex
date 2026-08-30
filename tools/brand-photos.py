#!/usr/bin/env python3
"""
Stamps the Apex chest logo onto staff photographs so branding stays identical
across every image, instead of relying on an image model to draw the mark.

    python3 tools/brand-photos.py --preview staff-supervisor.jpg
    python3 tools/brand-photos.py --all
    python3 tools/brand-photos.py --restore

Placement is a percentage of image width and height, so it survives any resize.
Originals are copied to assets/images/staff/_original/ before the first stamp,
so you can adjust the numbers and re-run as often as you like.

Requires: pip install pillow cairosvg
"""
import argparse, os, shutil, sys

try:
    from PIL import Image
except ImportError:
    sys.exit('Pillow is needed:  pip install pillow')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STAFF = os.path.join(ROOT, 'assets', 'images', 'staff')
ORIG = os.path.join(STAFF, '_original')
MARK = os.path.join(ROOT, 'assets', 'brand', 'apex-mark-mono.svg')

# file: (centre-x %, centre-y %, logo width as % of image width, rotation°)
# Tune these against your own photographs — run --preview to see the result.
PLACEMENTS = {
    'staff-supervisor.jpg':   (56.0, 42.0,  4.2,  0),
    'staff-team.jpg':         (None, None,  0.0,  0),   # too many people — shoot with real uniforms
    'staff-housekeeping.jpg': (47.0, 44.0,  4.5,  0),
    'staff-technician.jpg':   (52.0, 40.0,  4.5,  0),
    'staff-security.jpg':     (50.0, 41.0,  4.5,  0),
    'staff-landscape.jpg':    (49.0, 43.0,  4.2,  0),
    'staff-inspection.jpg':   (38.0, 40.0,  3.4,  0),
    'staff-pest.jpg':         (48.0, 42.0,  4.2,  0),
    'uniform-full.jpg':       (57.0, 30.0,  6.5,  0),
    'uniform-logo.jpg':       (50.0, 50.0, 42.0, -3),
    'uniform-id.jpg':         (None, None,  0.0,  0),   # the ID card art already carries the mark
    'staff-briefing.jpg':     (44.0, 41.0,  3.6,  0),
}


def mark_image(px):
    """Renders the mono mark to a transparent PNG at the requested width."""
    try:
        import cairosvg
    except ImportError:
        sys.exit('cairosvg is needed:  pip install cairosvg')
    import io
    svg = open(MARK, encoding='utf-8').read().replace('currentColor', '#FBFAF7')
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=px)
    return Image.open(io.BytesIO(png)).convert('RGBA')


def stamp(name, preview=False):
    place = PLACEMENTS.get(name)
    if not place or place[0] is None:
        print('  skip  ', name, '(no placement defined)')
        return False

    path = os.path.join(STAFF, name)
    if not os.path.exists(path):
        print('  miss  ', name)
        return False

    os.makedirs(ORIG, exist_ok=True)
    backup = os.path.join(ORIG, name)
    if not os.path.exists(backup):
        shutil.copy2(path, backup)

    base = Image.open(backup).convert('RGBA')
    w, h = base.size
    cx, cy, wpct, rot = place

    logo = mark_image(max(8, int(w * wpct / 100)))
    if rot:
        logo = logo.rotate(rot, expand=True, resample=Image.BICUBIC)

    # slight knock-back so embroidery reads as thread, not a sticker
    logo.putalpha(logo.getchannel('A').point(lambda a: int(a * 0.92)))

    x = int(w * cx / 100 - logo.width / 2)
    y = int(h * cy / 100 - logo.height / 2)

    out = base.copy()
    out.alpha_composite(logo, (x, y))

    if preview:
        target = os.path.join(STAFF, '_preview_' + name)
    else:
        target = path
    out.convert('RGB').save(target, quality=90, optimize=True)
    print('  ok    ', os.path.basename(target))
    return True


def restore():
    if not os.path.isdir(ORIG):
        print('nothing to restore')
        return
    for f in os.listdir(ORIG):
        shutil.copy2(os.path.join(ORIG, f), os.path.join(STAFF, f))
        print('  restored', f)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--preview', metavar='FILE', help='write _preview_FILE without touching the original')
    ap.add_argument('--all', action='store_true', help='stamp every slot with a placement')
    ap.add_argument('--restore', action='store_true', help='put the untouched originals back')
    a = ap.parse_args()

    if a.restore:
        restore()
    elif a.preview:
        stamp(a.preview, preview=True)
    elif a.all:
        print('Stamping the Apex mark:')
        n = sum(stamp(k) for k in PLACEMENTS)
        print(f'\n{n} images branded. Originals kept in assets/images/staff/_original/')
    else:
        ap.print_help()
