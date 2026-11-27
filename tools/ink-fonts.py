#!/usr/bin/env python3
"""Ink & Lantern: trim the look's three fonts to the characters the site uses (Basic Latin, Latin-1, dashes, quotes,
the ellipsis, arrows and the middle dot), so they cost a slow phone as little as possible. The latin-ext files stay
whole for the rest. Needs fonttools and brotli. Run on the untrimmed files from @fontsource (SIL OFL)."""
import os, sys
from fontTools import subset
KEEP = "U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201E,U+2022,U+2026,U+2190-2193,U+2212,U+00B7"
for src, dst in [(a, b) for a, b in zip(sys.argv[1::2], sys.argv[2::2])]:
    opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["kern", "liga"]; opts.hinting = False; opts.desubroutinize = True
    f = subset.load_font(src, opts); s = subset.Subsetter(opts); s.populate(unicodes=subset.parse_unicodes(KEEP)); s.subset(f)
    subset.save_font(f, dst, opts); print(dst, os.path.getsize(src), "->", os.path.getsize(dst))
