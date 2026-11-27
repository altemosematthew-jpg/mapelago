#!/usr/bin/env python3
"""Ink & Lantern: one small comic panel per game (ink/art/<id>.svg), used in each game's header and on its home card.

Drawn in code so it stays small and static: wobbly ink lines, hand-placed hatching, no perfect circles, one warm
lantern light from the top right. No faces on countries, nothing traced from any other work. Fixed seed.
"""
import math, os, random

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ink", "art")
os.makedirs(OUT, exist_ok=True)
W, H = 120, 84
INK, CREAM, NIGHT, PAPER, SEA, LAND, RIM, RUST, LAMP = "#14110d", "#EFE6CF", "#1c2226", "#CDB98E", "#7E9C93", "#C9A257", "#8C6B30", "#A8442E", "#F3C46B"


class Pen:
    def __init__(self, seed):
        self.r = random.Random(seed)
        self.out = []

    def j(self, a=1.0):
        return (self.r.random() - .5) * a

    def line(self, pts, w=1.6, color=INK, close=False, fill="none", amp=.9):
        p = [(x + self.j(amp), y + self.j(amp)) for x, y in pts]
        d = "M%.1f %.1f" % p[0]
        for i in range(1, len(p)):
            (ax, ay), (bx, by) = p[i - 1], p[i]
            d += " Q%.1f %.1f %.1f %.1f" % ((ax + bx) / 2 + self.j(amp), (ay + by) / 2 + self.j(amp), bx, by)
        if close: d += "Z"
        self.out.append('<path d="%s" fill="%s" stroke="%s" stroke-width="%.1f" stroke-linecap="round" stroke-linejoin="round"/>' % (d, fill, color, w))

    def blob(self, cx, cy, rx, ry, fill, stroke=INK, w=1.5, k=10, rough=.12):
        pts = []
        for i in range(k):
            a = i / k * math.tau
            f = 1 + self.j(rough * 2)
            pts.append((cx + math.cos(a) * rx * f, cy + math.sin(a) * ry * f))
        d = "M%.1f %.1f" % ((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2)
        for i in range(1, k + 1):
            p, q = pts[i % k], pts[(i + 1) % k]
            d += " Q%.1f %.1f %.1f %.1f" % (p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
        self.out.append('<path d="%sZ" fill="%s" stroke="%s" stroke-width="%.1f"/>' % (d, fill, stroke, w))

    def hatch(self, x0, y0, x1, y1, n=18, color=INK, op=.55, ang=-40):
        # short strokes leaning away from the light, each with its own angle and length
        s = []
        for _ in range(n):
            x, y = x0 + self.r.random() * (x1 - x0), y0 + self.r.random() * (y1 - y0)
            a = math.radians(ang + self.j(24))
            L = 2.5 + self.r.random() * 4
            s.append("M%.1f %.1fl%.1f %.1f" % (x, y, math.cos(a) * L, math.sin(a) * L))
        self.out.append('<path d="%s" stroke="%s" stroke-width=".8" opacity="%s" stroke-linecap="round"/>' % ("".join(s), color, op))

    def svg(self, title):
        body = "".join(self.out)
        frame = Pen(self.r.random())
        frame.line([(2, 3), (W - 2, 2.2)], 2.2, CREAM, amp=.7); frame.line([(W - 3, 1.5), (W - 2.2, H - 2)], 2.4, CREAM, amp=.7)
        frame.line([(W - 1, H - 3), (1.5, H - 2.4)], 2.4, CREAM, amp=.7); frame.line([(3, H - 1), (2.4, 1.5)], 2.2, CREAM, amp=.7)
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" role="img" aria-label="%s">'
                '<defs><radialGradient id="L" cx=".92" cy=".05" r=".9"><stop offset="0" stop-color="%s" stop-opacity=".55"/><stop offset=".45" stop-color="%s" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'
                '<clipPath id="C"><rect x="2" y="2" width="%d" height="%d"/></clipPath></defs>'
                '<g clip-path="url(#C)"><rect width="%d" height="%d" fill="%s"/>%s<rect width="%d" height="%d" fill="url(#L)"/></g>%s</svg>'
                % (W, H, title, LAMP, LAMP, W - 4, H - 4, W, H, NIGHT, body, W, H, "".join(frame.out)))


def city():  # Mystery city: a night skyline with lit windows
    p = Pen(1)
    p.blob(96, 16, 7, 7, "#EFE6CF", w=1.2)  # the moon, not quite round
    x = 4
    for i, (bw, bh) in enumerate([(14, 34), (11, 48), (16, 28), (12, 58), (15, 38), (10, 30), (14, 44), (13, 26)]):
        top = H - 6 - bh
        p.line([(x, H - 4), (x, top), (x + bw, top + p.j(1.5)), (x + bw, H - 4)], 1.4, INK, close=True, fill="#0d1013")
        p.hatch(x + 1, top + 2, x + bw * .45, H - 6, 6, "#000", .7)
        for wy in range(int(top) + 5, H - 9, 6):
            for wx in range(int(x) + 3, int(x + bw) - 2, 4):
                if p.r.random() < .42: p.out.append('<rect x="%.1f" y="%d" width="2" height="2.6" fill="%s"/>' % (wx + p.j(.5), wy, LAMP if p.r.random() < .8 else "#e9dcb5"))
        x += bw + .5
    return p.svg("A city skyline at night with lit windows")


def country():  # Mystery country: an unnamed country cut out and pinned to a board under the lamp
    p = Pen(2)
    p.line([(10, 10), (110, 12), (108, 76), (12, 74)], 1.8, INK, close=True, fill=PAPER)
    p.hatch(12, 52, 60, 74, 22, RIM, .6)
    p.line([(40, 26), (58, 22), (74, 30), (80, 46), (70, 60), (52, 64), (40, 52), (36, 38)], 1.6, INK, close=True, fill=LAND)
    p.line([(42, 56), (54, 66), (72, 62)], 2.2, RIM)
    p.blob(58, 20, 3.2, 3, RUST, w=1.1); p.line([(58, 22), (59, 30)], 1.3)
    p.out.append('<text x="88" y="70" font-family="Patrick Hand SC,cursive" font-size="16" fill="%s">?</text>' % INK)
    return p.svg("A country cut-out pinned to a board, with a question mark")


def bigger():  # Bigger city?: two towers side by side, one a little taller
    p = Pen(3)
    p.line([(4, 76), (116, 75)], 1.8, CREAM)
    for x0, h, lit in [(26, 52, .5), (66, 60, .6)]:
        p.line([(x0, 75), (x0, 75 - h), (x0 + 26, 75 - h - 1), (x0 + 26, 75)], 1.6, INK, close=True, fill="#0d1013")
        p.hatch(x0 + 1, 75 - h, x0 + 10, 74, 10, "#000", .7)
        for wy in range(75 - h + 5, 70, 6):
            for wx in range(x0 + 4, x0 + 24, 5):
                if p.r.random() < lit: p.out.append('<rect x="%d" y="%d" width="2.4" height="3" fill="%s"/>' % (wx, wy, LAMP))
    p.out.append('<text x="55" y="38" font-family="Anton,sans-serif" font-size="14" fill="%s" transform="rotate(-6 55 38)">?</text>' % CREAM)
    return p.svg("Two towers side by side at night")


def bigcountry():  # Bigger country?: two land shapes on a balance
    p = Pen(4)
    p.line([(60, 22), (60, 72)], 2, CREAM); p.line([(44, 74), (76, 74)], 2.2, CREAM)
    p.line([(20, 30), (100, 26)], 2, CREAM)
    p.line([(20, 30), (12, 46), (30, 46)], 1.2, CREAM, close=True); p.line([(100, 26), (90, 42), (110, 42)], 1.2, CREAM, close=True)
    p.line([(13, 44), (17, 36), (24, 35), (29, 42)], 1.4, INK, close=True, fill=LAND)
    p.line([(88, 40), (92, 30), (101, 28), (108, 33), (110, 40)], 1.4, INK, close=True, fill=LAND)
    p.blob(60, 22, 3, 2.6, RUST, w=1)
    return p.svg("Two land shapes weighed on a balance")


def voyage():  # Voyage: a small boat between islands at dusk
    p = Pen(5)
    p.out.append('<rect x="0" y="52" width="%d" height="40" fill="%s"/>' % (W, SEA))
    p.hatch(0, 56, 120, 82, 26, "#3d5650", .6, ang=-8)
    p.line([(4, 54), (22, 44), (40, 54)], 1.5, INK, fill=LAND); p.line([(84, 54), (98, 40), (116, 54)], 1.5, INK, fill=LAND)
    p.hatch(6, 47, 22, 54, 7, RIM, .8); p.hatch(86, 44, 98, 54, 7, RIM, .8)
    p.line([(48, 60), (74, 60), (70, 66), (52, 66)], 1.5, INK, close=True, fill="#6b4a2a")
    p.line([(60, 60), (60, 36)], 1.4); p.line([(61, 37), (72, 56), (61, 56)], 1.3, INK, close=True, fill=CREAM)
    return p.svg("A small sailing boat between two islands")


def fathoms():  # Fathoms: a weighted line dropping into dark water
    p = Pen(6)
    for i, c in enumerate(["#5f7d76", "#4a645e", "#36504b", "#24383a", "#162426"]):
        p.out.append('<rect x="0" y="%d" width="%d" height="17" fill="%s"/>' % (i * 17, W, c))
    p.line([(28, 0), (30, 30), (29, 58), (31, 70)], 1.3, CREAM)
    p.line([(26, 70), (36, 70), (34, 77), (28, 77)], 1.3, INK, close=True, fill="#8a8f92")
    for y in range(12, 70, 14): p.line([(30, y), (36, y)], 1, CREAM)
    p.hatch(60, 40, 118, 82, 24, "#000", .5, ang=-20)
    return p.svg("A weighted line sounding the depths")


def stamps():  # Stamps: a perforated stamp with a little ship on it
    p = Pen(7)
    pts = []
    for i in range(16):
        t = i / 15
        pts += [(30 + t * 60, 14 + (1.6 if i % 2 else 0))]
    p.line([(30, 14), (90, 14), (90, 72), (30, 72)], 1.8, INK, close=True, fill="#E3D3A8")
    for i in range(14): p.blob(30 + i * 4.6, 14, 1.4, 1.4, NIGHT, w=0, k=6); p.blob(30 + i * 4.6, 72, 1.4, 1.4, NIGHT, w=0, k=6)
    p.line([(38, 22), (82, 22), (82, 62), (38, 62)], 1.2, RUST, close=True)
    p.line([(48, 50), (72, 50), (68, 56), (52, 56)], 1.3, INK, close=True, fill=RUST); p.line([(60, 50), (60, 30)], 1.2); p.line([(61, 31), (70, 48), (61, 48)], 1.1, INK, close=True, fill=CREAM)
    return p.svg("A postage stamp with a ship on it")


def crossings():  # Crossings: a border gate at dusk
    p = Pen(8)
    p.out.append('<rect x="0" y="58" width="%d" height="30" fill="#3a3326"/>' % W)
    p.line([(0, 60), (120, 58)], 1.5, INK)
    p.line([(20, 60), (20, 28), (34, 26), (34, 60)], 1.5, INK, close=True, fill="#2a2f33")
    p.line([(22, 34), (32, 34), (32, 42), (22, 42)], 1, INK, close=True, fill=LAMP)
    p.line([(34, 40), (108, 38)], 3.4, CREAM);
    for x in range(44, 108, 12): p.line([(x, 40), (x + 6, 38.5)], 3.6, RUST)
    p.line([(108, 34), (108, 60)], 1.6)
    p.line([(60, 82), (64, 60), (70, 60), (80, 82)], 1, "#7a6b4e")
    p.hatch(0, 62, 120, 82, 20, "#000", .6)
    return p.svg("A border gate at dusk, its barrier down")


def reckoning():  # Dead Reckoning: a pin in a half-shadowed globe
    p = Pen(9)
    p.blob(58, 46, 30, 30, SEA, w=1.8, k=14, rough=.04)
    p.line([(44, 30), (56, 26), (66, 34), (60, 46), (48, 44)], 1.3, INK, close=True, fill=LAND)
    p.line([(62, 56), (74, 52), (78, 62), (68, 68)], 1.3, INK, close=True, fill=LAND)
    p.line([(30, 46), (86, 46)], .8, "#3d5650"); p.line([(58, 17), (58, 75)], .8, "#3d5650")
    p.out.append('<path d="M58 16 C36 22 30 66 58 76 C44 66 40 26 58 16Z" fill="#000" opacity=".45"/>')
    p.hatch(30, 30, 52, 72, 18, "#000", .6)
    p.line([(70, 36), (70, 22)], 1.6); p.blob(70, 20, 4, 3.6, RUST, w=1.2)
    return p.svg("A pin in a globe, half in shadow")


def ballast():  # Ballast: a ship's deck stacked with cargo, a gull on the mast
    p = Pen(10)
    p.out.append('<rect x="0" y="64" width="%d" height="24" fill="%s"/>' % (W, SEA))
    p.line([(14, 58), (106, 58), (96, 70), (24, 70)], 1.8, INK, close=True, fill="#6b4a2a")
    p.hatch(26, 60, 60, 70, 10, "#000", .6)
    for x0, y0, w, h, c in [(34, 46, 16, 12, LAND), (52, 46, 18, 12, "#9FB39A"), (40, 34, 22, 12, RUST), (72, 48, 12, 10, "#E3D3A8")]:
        p.line([(x0, y0 + h), (x0, y0), (x0 + w, y0), (x0 + w, y0 + h)], 1.3, INK, close=True, fill=c)
    p.line([(92, 58), (92, 20)], 1.5); p.line([(86, 18), (90, 16), (92, 18), (94, 16), (98, 18)], 1.3, CREAM)
    return p.svg("A ship's deck stacked with cargo")


def logbook():  # Logbook: an open logbook and a quill by the lamp
    p = Pen(11)
    p.line([(12, 22), (58, 26), (58, 74), (14, 70)], 1.6, INK, close=True, fill="#E3D3A8")
    p.line([(58, 26), (106, 20), (104, 68), (58, 74)], 1.6, INK, close=True, fill="#EFE6CF")
    for y in range(34, 66, 6): p.line([(20, y), (52, y + 1)], .7, "#6b5a3a"); p.line([(64, y), (98, y - 2)], .7, "#6b5a3a")
    p.hatch(14, 56, 40, 70, 10, RIM, .6)
    p.line([(84, 52), (110, 12)], 1.4, CREAM); p.line([(104, 14), (112, 8), (110, 20)], 1, CREAM, fill="#cfc4a8")
    return p.svg("An open logbook with a quill")


def daily():  # Daily Voyage: a compass and a dotted route over four stops
    p = Pen(12)
    p.line([(10, 62), (34, 46), (62, 58), (90, 36), (110, 44)], 1.4, CREAM)
    for x, y in [(10, 62), (34, 46), (62, 58), (90, 36)]: p.blob(x, y, 3.6, 3.4, RUST, w=1.2)
    p.blob(96, 66, 11, 11, "#E3D3A8", w=1.5, k=12, rough=.05)
    p.line([(96, 57), (99, 66), (96, 75), (93, 66)], 1, INK, close=True, fill=RUST)
    return p.svg("A dotted route over four stops, and a compass")


def home():  # the home page: the lantern itself
    p = Pen(13)
    p.line([(60, 8), (60, 18)], 1.4, CREAM)
    p.line([(50, 20), (70, 20), (74, 26), (46, 26)], 1.4, INK, close=True, fill="#2a2f33")
    p.line([(48, 26), (72, 26), (70, 60), (50, 60)], 1.6, INK, close=True, fill=LAMP)
    p.line([(54, 30), (66, 30), (64, 56), (56, 56)], .9, "#b88a2e")
    p.line([(46, 60), (74, 60), (72, 66), (48, 66)], 1.4, INK, close=True, fill="#2a2f33")
    return p.svg("A ship's lantern")


ART = {"city": city, "country": country, "bigger": bigger, "bigcountry": bigcountry, "voyage": voyage, "fathoms": fathoms,
       "stamps": stamps, "crossings": crossings, "reckoning": reckoning, "ballast": ballast, "history": logbook, "daily": daily, "home": home}

if __name__ == "__main__":
    for k, f in ART.items():
        s = f()
        open(os.path.join(OUT, k + ".svg"), "w").write(s)
        print(k, len(s))
