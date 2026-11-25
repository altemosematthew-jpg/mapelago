#!/usr/bin/env python3
"""Adds "For teachers" (/teachers/) to the Site menu of every page, just before About, and to sitemap.xml.

Safe to run again: a page that already links to teachers/ is left alone. Run from anywhere:
    python3 review/teachers-menu-patch.py
A new page added later gets the link the next time this runs. It also gives the teachers page's
scripts the current ?v= version from sw.js, so run it after a release bump."""
import os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ABOUT = re.compile(r'(\n?[ \t]*)(<a href="((?:\.\.?/)?)about/">About</a>)')
SKIP = ("review/", "tests/", "copy/", "data/", "node_modules/")


def pages():
    out = subprocess.run(["git", "-C", ROOT, "ls-files", "*.html"], capture_output=True, text=True).stdout.split()
    extra = [f for f in ["teachers/index.html"] if f not in out]
    return [f for f in out + extra if not f.startswith(SKIP)]


def main():
    changed = 0
    for f in pages():
        p = os.path.join(ROOT, f)
        s = open(p, encoding="utf-8").read()
        if 'teachers/"' in s or not ABOUT.search(s):
            continue
        n = len(ABOUT.findall(s))
        if n != 1:
            print(f"{f}: {n} About links, left alone")
            continue
        s = ABOUT.sub(lambda m: f'{m.group(1)}<a href="{m.group(3)}teachers/">For teachers</a>{m.group(1)}{m.group(2)}', s, count=1)
        open(p, "w", encoding="utf-8").write(s)
        changed += 1
        print(f"{f}: For teachers added to the menu")
    sm = os.path.join(ROOT, "sitemap.xml")
    s = open(sm, encoding="utf-8").read()
    if "mapelago.com/teachers/" not in s:
        line = re.search(r'\n(\s*)<url><loc>https://mapelago\.com/about/</loc><lastmod>([^<]*)</lastmod></url>', s)
        if not line:
            sys.exit("sitemap.xml: no about/ entry to put the new page after")
        s = s.replace(line.group(0), line.group(0) + f"\n{line.group(1)}<url><loc>https://mapelago.com/teachers/</loc><lastmod>2026-11-25</lastmod></url>", 1)
        open(sm, "w", encoding="utf-8").write(s)
        print("sitemap.xml: teachers/ added")
    # the teachers page loads its scripts with the site's current version, read from sw.js (a release changes it there)
    v = re.search(r'const C = "mapelago-([^"]+)"', open(os.path.join(ROOT, "sw.js"), encoding="utf-8").read())
    tp = os.path.join(ROOT, "teachers", "index.html")
    if v and os.path.exists(tp):
        t = open(tp, encoding="utf-8").read()
        t2 = re.sub(r'(\.js)\?v=[0-9A-Za-z.-]+', lambda m: m.group(1) + "?v=" + v.group(1), t)
        if t2 != t:
            open(tp, "w", encoding="utf-8").write(t2)
            print(f"teachers/index.html: scripts now carry ?v={v.group(1)}")
    print(f"{changed} pages changed")


if __name__ == "__main__":
    main()
