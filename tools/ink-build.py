#!/usr/bin/env python3
"""Ink & Lantern: bakes the look's textures into small static files in ink/ (run once; the files are committed).

Everything is drawn here, at build time, so the pages need no live SVG filters:
  frame.svg       cream hand-inked panel border (9-slice, lines overshoot the corners)
  frame-ink.svg   the same border in black ink, for caption boxes
  blots.svg       ink blots and splatter for the page edges
  hatch.svg       hand-placed hatching for land: short lines, each with its own angle and length
  paper.jpg       aged chart paper for map surfaces
A fixed seed keeps the files identical from run to run.
"""
import math, os, random

R = random.Random(20261126)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ink")
os.makedirs(OUT, exist_ok=True)
CREAM, INK = "#EFE6CF", "#14110d"


def wob(x0, y0, x1, y1, amp, n=5):
    """A hand-drawn line: the ends drift a little and the middle bows."""
    pts = []
    for i in range(n + 1):
        t = i / n
        x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
        dx, dy = y1 - y0, x0 - x1
        L = math.hypot(dx, dy) or 1
        off = (R.random() - .5) * amp * (1 if 0 < i < n else .5)
        pts.append((x + dx / L * off, y + dy / L * off))
    d = "M%.1f %.1f" % pts[0]
    for i in range(1, len(pts)):
        (ax, ay), (bx, by) = pts[i - 1], pts[i]
        d += " Q%.1f %.1f %.1f %.1f" % (ax + (bx - ax) * .5 + (R.random() - .5) * amp * .6, ay + (by - ay) * .5 + (R.random() - .5) * amp * .6, bx, by)
    return d


def frame(color, name, width=2.4):
    # 64 x 64, sliced 12 from each edge; each side is a separate stroke that runs past the corner
    S, e = 64, 6
    sides = [wob(1.5, e + .6, S - 1, e - .4, 1.2), wob(S - e + .5, 1, S - e - .6, S - 1.5, 1.2),
             wob(S - 1.2, S - e - .3, 1, S - e + .8, 1.2), wob(e - .4, S - 1, e + .7, 1.5, 1.2)]
    paths = "".join('<path d="%s" stroke-width="%.1f"/>' % (d, width + (i % 2) * .5) for i, d in enumerate(sides))
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">'
           '<g fill="none" stroke="%s" stroke-linecap="round" stroke-linejoin="round">%s</g></svg>' % (color, paths))
    open(os.path.join(OUT, name), "w").write(svg)


def blob(cx, cy, r, k=11):
    pts = []
    for i in range(k):
        a = i / k * math.tau
        rr = r * (0.72 + R.random() * 0.5)
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    d = "M%.1f %.1f" % pts[0]
    for i in range(1, k + 1):
        p, q = pts[i % k], pts[(i + 1) % k]
        d += " Q%.1f %.1f %.1f %.1f" % (p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
    return d + "Z"


def blots():
    # 1200 x 1600, transparent; blots hug the edges and corners only, never the middle
    out = []
    spots = [(40, 60, 26), (1160, 220, 18), (70, 1480, 30), (1150, 1530, 22), (20, 760, 14), (1185, 980, 12)]
    for x, y, r in spots:
        out.append('<path d="%s" fill="#000" opacity=".55"/>' % blob(x, y, r))
        for _ in range(9):  # splatter around each blot
            a, dist = R.random() * math.tau, r * (1.4 + R.random() * 2.6)
            out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#000" opacity=".5"/>' % (x + math.cos(a) * dist, y + math.sin(a) * dist, .8 + R.random() * 2.6))
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">%s</svg>' % "".join(out)
    open(os.path.join(OUT, "blots.svg"), "w").write(svg)


def hatch(name, color, w=900, h=900, n=2600, op=.32):
    # light from the top right, so the strokes lean the same way, each with its own jitter
    lines = []
    for _ in range(n):
        x, y = R.random() * w, R.random() * h
        a = math.radians(-38 + (R.random() - .5) * 22)
        L = 4 + R.random() * 9
        lines.append("M%.1f %.1fl%.1f %.1f" % (x, y, math.cos(a) * L, math.sin(a) * L))
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">'
           '<path d="%s" stroke="%s" stroke-width=".9" stroke-linecap="round" opacity="%s" fill="none"/></svg>' % (w, h, w, h, "".join(lines), color, op))
    open(os.path.join(OUT, name), "w").write(svg)


def paper():
    from PIL import Image, ImageDraw, ImageFilter
    W = 512
    im = Image.new("RGB", (W, W), (0xCD, 0xB9, 0x8E))
    px = im.load()
    for y in range(W):
        for x in range(W):
            n = (R.random() - .5) * 14
            r, g, b = px[x, y]
            px[x, y] = (int(r + n), int(g + n), int(b + n * .8))
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(14):  # faint stains, soft-edged
        x, y, r = R.random() * W, R.random() * W, 20 + R.random() * 70
        d.ellipse([x - r, y - r * .8, x + r, y + r * .8], fill=(120, 90, 40, 14))
    for _ in range(40):  # fibres
        x, y = R.random() * W, R.random() * W
        a = R.random() * math.tau
        d.line([x, y, x + math.cos(a) * 18, y + math.sin(a) * 18], fill=(110, 85, 45, 22), width=1)
    im = im.filter(ImageFilter.GaussianBlur(.6))
    im.save(os.path.join(OUT, "paper.jpg"), quality=72, optimize=True)


if __name__ == "__main__":
    frame(CREAM, "frame.svg")
    frame(INK, "frame-ink.svg", 2.2)
    blots()
    hatch("hatch.svg", "#5b4520")
    paper()
    for f in sorted(os.listdir(OUT)):
        print(f, os.path.getsize(os.path.join(OUT, f)))
