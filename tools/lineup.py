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
    P = r'(?:\.\./|\./|https://mapelago\.com/)?'
    # menus only (every <nav> block): an anchor whose whole text is the game's name, with the whitespace before it
    def fix(m):
        blk = m.group(0)
        blk = re.sub(r'\n?[ \t]*<a href="' + P + r'country\.html"[^>]*>Mystery country</a>', "", blk)
        blk = re.sub(r'\n?[ \t]*<a href="' + P + r'bigger-country\.html"[^>]*>Bigger country\?</a>', "", blk)
        blk = re.sub(r'\n?[ \t]*<a href="' + P + r'voyage\.html"[^>]*>Voyage</a>', "", blk)
        blk = re.sub(r'(<a href="(?:' + P + r')(?:city\.html|)"[^>]*>)Mystery city(</a>)', r"\1Mystery\2", blk)
        blk = re.sub(r'(<a href="' + P + r'bigger\.html"[^>]*>)Bigger city\?(</a>)', r"\1Bigger?\2", blk)
        if "daily.html" not in blk and ">Mystery</a>" in blk:
            blk = re.sub(r'(<a href="((?:\.\./|\./|https://mapelago\.com/)?)(?:city\.html|)"[^>]*>Mystery</a>)', r'<a href="\2daily.html">Daily Voyage</a> \1', blk, count=1)
        # footer menus list every game (some never had the newer ones)
        if blk.startswith('<nav class="foot"'):
            pre = (re.search(r'<a href="((?:\.\./|\./|https://mapelago\.com/)?)daily\.html"', blk) or [None, ""])[1] if "daily.html" in blk else ""
            last = None
            for href, name in [("bigger.html", "Bigger?"), ("crossings.html", "Crossings"), ("dead-reckoning.html", "Dead Reckoning"), ("ballast.html", "Ballast"), ("fathoms.html", "Fathoms"), ("stamps.html", "Stamps"), ("history.html", "Logbook")]:
                m2 = re.search(r'\n?[ \t]*<a href="' + re.escape(pre) + re.escape(href) + r'"[^>]*>[^<]*</a>', blk)
                if m2: last = m2; continue
                at = last.end() if last else blk.find(">", blk.find("Mystery</a>")) + 1
                ins = '\n      <a href="' + pre + href + '">' + name + '</a>'
                blk = blk[:at] + ins + blk[at:]
                last = re.search(re.escape(ins), blk)
        return blk
    s = re.sub(r'<nav\b[^>]*>.*?</nav>', fix, s, flags=re.S)
    s = s.replace("Mapelago, the mystery city game", "Mapelago home")  # the logo is the way home, not one game
    if s != o: open(f, "w", encoding="utf8").write(s); n += 1
print("lineup:", n, "pages changed")
