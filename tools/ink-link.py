#!/usr/bin/env python3
"""Ink & Lantern: link ink.css last in every page's head (idempotent; run after any page rebuild) and keep the
version on it in step with site.js."""
import os, re, subprocess
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SKIP = ("googled1f922a49a43e474.html", "daily-start.html", "daily-done.html")
v = re.search(r'const C = "mapelago-([^"]+)"', open("sw.js").read()).group(1)
n = 0
for f in subprocess.check_output(["git", "ls-files", "*.html"]).decode().split():
    if f.startswith(("review/", "tests/", "tools/")) or f in SKIP: continue
    s = open(f, encoding="utf8").read(); o = s
    pre = "../" if "/" in f else ""
    s = re.sub(r'<link rel="stylesheet" href="(\.\./)?ink\.css\?v=[^"]*">\n?', "", s)
    s = s.replace("</head>", '<link rel="stylesheet" href="%sink.css?v=%s">\n</head>' % (pre, v), 1)
    s = s.replace('name:"Chart room",about:"The standard look. A sea chart with road-sign lettering."', 'name:"Ink & Lantern",about:"The standard look. Hand-inked panels by lantern light, maps on old chart paper."')
    if s != o: open(f, "w", encoding="utf8").write(s); n += 1
print("ink-link:", n, "pages changed, version", v)
