#!/usr/bin/env python3
"""Adds Dead Reckoning to every shared file that lists the games. Safe to run again: each edit checks
first and is skipped when it is already in place. Run from the repository root:

    python3 review/dead-reckoning-patch.py

It prints one line per edit: "added", "already there" or "NOT FOUND" (an anchor moved; edit by hand,
see review/dead-reckoning-merge-notes.md).
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
problems = []


def edit(path, done_marker, fn, what):
    p = os.path.join(ROOT, path)
    if not os.path.exists(p):
        print(f"  NOT FOUND  {path}: file missing ({what})"); problems.append(path); return
    s = open(p, encoding="utf-8").read()
    if done_marker in s:
        print(f"  already there  {path}: {what}"); return
    t = fn(s)
    if t is None or t == s:
        print(f"  NOT FOUND  {path}: {what}"); problems.append(path); return
    open(p, "w", encoding="utf-8").write(t)
    print(f"  added  {path}: {what}")


def after(anchor, text):
    def f(s):
        i = s.find(anchor)
        if i < 0: return None
        return s[: i + len(anchor)] + text + s[i + len(anchor):]
    return f


def before(anchor, text):
    def f(s):
        i = s.find(anchor)
        if i < 0: return None
        return s[:i] + text + s[i:]
    return f


# 1. the "Daily games" menu at the foot of every page
def nav(s):
    pat = re.compile(r'^([ \t]*)<a href="([^"]*?)crossings\.html">Crossings</a>(</nav>)?[ \t]*$', re.M)
    m = pat.search(s)
    if not m: return None
    ind, pre, close = m.group(1), m.group(2), m.group(3) or ""
    link = f'{ind}<a href="{pre}dead-reckoning.html">Dead Reckoning</a>'
    return s[: m.start()] + f'{ind}<a href="{pre}crossings.html">Crossings</a>\n{link}{close}' + s[m.end():]


for f in ["index.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html",
          "crossings.html", "404.html", "offline.html", "about/index.html", "how-to-play/index.html"]:
    edit(f, 'dead-reckoning.html">Dead Reckoning</a>', nav, "Daily games menu link")

# 2. site.js: the games list (front-page cards, streaks, stats sheet), beat-my-score code "dr", and the
#    "today's results" line. Dead Reckoning draws its own result, so the generic share image is not added.
edit("site.js", 'id: "reckoning"', after(
    '{ id: "crossings", name: "Crossings", key: "dailycity:crossings:v1", url: "crossings.html", icon: "\\u{1F9ED}", about: "Name the countries between two others, border by border." }',
    ',\n    { id: "reckoning", name: "Dead Reckoning", key: "dailycity:reckoning:v1", url: "dead-reckoning.html", icon: "\\u{1F4CD}", about: "Tap five places on a blank map. Closer scores more." }'),
    "GAMES entry")
edit("site.js", 'reckoning: { code: "dr"', after(
    'stamps: { code: "st", max: 6, modes: 1 }, crossings: { code: "cr", max: 1000, modes: 1 }',
    ',\n    reckoning: { code: "dr", max: 1000, modes: 1 }'), "beat-my-score code dr")
edit("site.js", 'reckoning: function (n)', after(
    'crossings: function (n) { return n + " points"; }',
    ', reckoning: function (n) { return Number(n).toLocaleString("en-US") + " of 1,000"; }'), "challenge wording")
edit("site.js", 'id === "reckoning" ? (r.total', after(
    'id === "crossings" ? (r.score != null ? r.score : "✓") :',
    ' id === "reckoning" ? (r.total != null ? r.total : "✓") :'), "today's results line")
edit("site.js", 'me.id === "reckoning") return /1,000 of 1,000/', after(
    'if (me.id === "crossings") return /\\u{1F422} 1000 points/u.test(line);',
    '\n    if (me.id === "reckoning") return /1,000 of 1,000/.test(line);'), "perfect-day confetti")
edit("site.js", 'me.id === "country" || me.id === "reckoning")) return;', lambda s: s.replace(
    'if (!me || !btn || document.getElementById("imgBtn") || me.id === "city" || me.id === "country") return;',
    'if (!me || !btn || document.getElementById("imgBtn") || me.id === "city" || (me.id === "country" || me.id === "reckoning")) return;', 1),
    "no generic share image")

# 3. service worker: save the page and its script for offline play
edit("sw.js", '"dead-reckoning.html"', lambda s: re.sub(
    r'"crossings\.html",\n', lambda m: '"crossings.html", "dead-reckoning.html",\n  "dead-reckoning.js?v=' + re.search(r'const C = "mapelago-([^"]+)"', s).group(1) + '",\n', s, count=1),
    "PRE list")

# 4. sitemap
edit("sitemap.xml", "dead-reckoning.html", after(
    "<url><loc>https://mapelago.com/crossings.html</loc><lastmod>2026-11-25</lastmod></url>",
    "\n  <url><loc>https://mapelago.com/dead-reckoning.html</loc><lastmod>2026-11-25</lastmod></url>"), "sitemap entry")

# 5. All games page: a section like the others, and nine instead of eight
GAMES_SECTION = '''<section id="dead-reckoning">
<h2><a href="../dead-reckoning.html">Dead Reckoning</a></h2>
<p>Dead Reckoning is Mapelago&#x27;s daily map-tapping game. You get the name of a place and tap where it is on a world map with no labels. Each place scores up to 100 by how far your pin lands from the real spot, and later places count for more, so a perfect day is 1,000. The first place is a capital or a famous city; the last is a small capital or a little-known city. After every tap you see the distance, which way the place lies and a short fact. When you are done, Play more gives you endless practice places that never count.</p>
<ol class="howto"><li>Read the place name.</li><li>Tap the map where you think it is. Zoom in to be exact.</li><li>Lock in your pin and see how far off you were.</li><li>Do all five and share your score: one square per place, never the answers.</li></ol>
<p><a class="play" href="../dead-reckoning.html">Play Dead Reckoning</a></p>
</section>
'''
edit("games/index.html", 'id="dead-reckoning"', before("<h2>Streaks</h2>", GAMES_SECTION), "game section")
edit("games/index.html", "nine free daily", lambda s: s.replace("eight free daily geography games", "nine free daily geography games")
     .replace("Eight free daily geography games: mystery cities and countries, which-is-bigger pairs, trivia, naming and border routes.",
              "Nine free daily geography games: mystery cities and countries, which-is-bigger pairs, trivia, naming, border routes and blank-map pins."), "eight becomes nine")

# 6. How to play
edit("how-to-play/index.html", '<h2>Dead Reckoning, the blank map</h2>', lambda s: re.sub(
    r'(<p><a href="\.\./crossings\.html">Crossings</a>[^\n]*\n)',
    lambda m: m.group(1) + '\n<h2>Dead Reckoning, the blank map</h2>\n<p><a href="../dead-reckoning.html">Dead Reckoning</a> names five places a day. Tap where each one is on a world map with no labels; pinch or scroll to zoom, or move the pin with the arrow keys and press Enter. Each place scores up to 100 by distance (a pin 250 km off still earns 80), and later places count for more, so a perfect day is 1,000. Your result is one square per place, from a bullseye to red, and never names the places. Play more gives endless practice that never touches your streak or stats.</p>\n',
    s, count=1), "how-to-play section")

# 7. About: the list of games
edit("about/index.html", "Nine games a day", lambda s: s.replace(
    "Eight games a day, the same for everyone: Mystery city, Mystery country, Bigger city?, Bigger country?, Voyage, Fathoms, Stamps and Crossings.",
    "Nine games a day, the same for everyone: Mystery city, Mystery country, Bigger city?, Bigger country?, Voyage, Fathoms, Stamps, Crossings and Dead Reckoning."),
    "names all nine games")

# 8. tests: load the page in the clean-load check, and run Dead Reckoning's own checks
edit("tests/run.js", '"crossings.html", "dead-reckoning.html", "hints.html"', lambda s: s.replace(
    '"crossings.html", "hints.html"', '"crossings.html", "dead-reckoning.html", "hints.html"', 1), "clean-load list")
edit("tests/run.js", 'require("./dead-reckoning.test.js")', before(
    "  } finally { await b.close(); srv.close(); }",
    '    // 10. Dead Reckoning (tests/dead-reckoning.test.js)\n    await require("./dead-reckoning.test.js")({ b, U, page, check });\n'),
    "Dead Reckoning checks")

edit("tests/run.js", '"Crossings", "Dead Reckoning"].every', lambda s: s.replace(
    '"Stamps", "Crossings"].every((g) => (/<p class="lede">(.*?)<\\/p>/.exec(ab) || ["", ""])[1].includes(g)) && /Eight games a day/.test(ab), "about page: names all eight daily games");',
    '"Stamps", "Crossings", "Dead Reckoning"].every((g) => (/<p class="lede">(.*?)<\\/p>/.exec(ab) || ["", ""])[1].includes(g)) && /Nine games a day/.test(ab), "about page: names all nine daily games");', 1),
    "about-page check counts nine games")

print("done" if not problems else "finished with problems in: " + ", ".join(sorted(set(problems))))
sys.exit(1 if problems else 0)
