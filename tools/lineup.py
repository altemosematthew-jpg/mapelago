#!/usr/bin/env python3
"""The lineup from No. 17 in every page's game menus: Daily Voyage, Mystery (city or country), Bigger?, then the rest.
Mystery country, Bigger country? and Voyage leave the menus (their pages still open, and hand over from No. 17).
Idempotent: run after any page rebuild."""
import os, re, subprocess
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SKIP = ("googled1f922a49a43e474.html", "daily-start.html", "daily-done.html")
n = 0
for f in subprocess.check_output(["git", "ls-files", "*.html"]).decode().split() + ["bigger.html"]:
    if f.startswith(("review/", "tests/", "tools/")) or f in SKIP or not os.path.exists(f): continue
    s = open(f, encoding="utf8").read(); o = s
    P = r'(?:\.\./|\./)?'
    # menu links only: an anchor whose whole text is the game's name, with the whitespace before it
    s = re.sub(r'\n?[ \t]*<a href="' + P + r'country\.html"[^>]*>Mystery country</a>', "", s)
    s = re.sub(r'\n?[ \t]*<a href="' + P + r'bigger-country\.html"[^>]*>Bigger country\?</a>', "", s)
    s = re.sub(r'\n?[ \t]*<a href="' + P + r'voyage\.html"[^>]*>Voyage</a>', "", s)
    s = re.sub(r'(<a href="' + P + r'city\.html"[^>]*>)Mystery city(</a>)', r"\1Mystery\2", s)
    s = re.sub(r'(<a href="' + P + r'bigger\.html"[^>]*>)Bigger city\?(</a>)', r"\1Bigger?\2", s)
    # the Daily Voyage first in any menu that lists the games and lacks it
    def add(m):
        blk = m.group(0)
        if "daily.html" in blk: return blk
        return re.sub(r'(<a href="(' + P + r')city\.html")', r'<a href="\2daily.html">Daily Voyage</a> \1', blk, 1)
    s = re.sub(r'<nav aria-label="Daily games">.*?</nav>', add, s, flags=re.S)
    s = re.sub(r'<nav class="foot" aria-label="Site">.*?</nav>', add, s, flags=re.S)
    if s != o: open(f, "w", encoding="utf8").write(s); n += 1
print("lineup:", n, "pages changed")
