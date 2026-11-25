#!/usr/bin/env python3
"""Adds Dead Reckoning to every shared file that lists the games. Safe to run again: each edit checks
first and is skipped when it is already in place. Run from anywhere:

    python3 review/dead-reckoning-patch.py

Nothing here assumes which game was added last: links and entries go after the last game already listed
(Logbook from 0.15.8, Crossings before that), and "eight / nine / ten games" is worked out from the number
of games in site.js after the edit. It prints "added", "already there" or "NOT FOUND" per edit and exits 1
if anything was not found (an anchor moved; make that edit by hand, see review/dead-reckoning-merge-notes.md).
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
problems = []
WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
NUM = "|".join(WORDS[2:])


def path(f): return os.path.join(ROOT, f)
def read(f): return open(path(f), encoding="utf-8").read()


def edit(f, done, fn, what):
    """done: a string that is in the file once the edit is made, or a function of the file's text."""
    if not os.path.exists(path(f)):
        print(f"  NOT FOUND  {f}: file missing ({what})"); problems.append(f); return
    s = read(f)
    if (done(s) if callable(done) else done in s):
        print(f"  already there  {f}: {what}"); return
    t = fn(s)
    if t is None or t == s:
        print(f"  NOT FOUND  {f}: {what}"); problems.append(f); return
    open(path(f), "w", encoding="utf-8").write(t)
    print(f"  added  {f}: {what}")


def sub1(pat, rep, flags=0):
    def f(s):
        t, n = re.subn(pat, rep, s, count=1, flags=flags)
        return t if n else None
    return f


def add_to_list(text, item):
    """'A, B and C' -> 'A, B, C and <item>'"""
    if item in text: return text
    i = text.rfind(" and ")
    if i < 0: return text + " and " + item
    return text[:i] + ", " + text[i + 5:] + " and " + item


# ---------- 1. site.js: the games list and everything keyed by game ----------
DR_BLOCK = (
    '\n  // ---------- Dead Reckoning: start ----------\n'
    '  // Dead Reckoning joins streaks, "Today\'s games", today\'s combined message and challenge links. Its page is\n'
    '  // dead-reckoning.html; its own code is dead-reckoning.js. Merge notes: review/dead-reckoning-merge-notes.md\n'
    '  GAMES.push({ id: "reckoning", name: "Dead Reckoning", key: "dailycity:reckoning:v1", url: "dead-reckoning.html", icon: "\\u{1F4CD}", about: "Tap five places on a blank map. Closer scores more." });\n'
    '  UNIT.reckoning = function (n) { return Number(n).toLocaleString("en-US") + " of 1,000"; };\n'
    '  // ---------- Dead Reckoning: end ----------')


def games_entry(s):
    """a block of its own, after the last game added the same way (Logbook), else right after UNIT"""
    m = None
    for m in re.finditer(r'\n  // ---------- [^\n]*: end ----------', s): pass
    if m is None:
        m = re.search(r'\n  var UNIT = \{[\s\S]*?\};', s)
    if m is None: return None
    return s[: m.end()] + DR_BLOCK + s[m.end():]


edit("site.js", 'id: "reckoning"', games_entry, "GAMES and UNIT entries, in their own block after the last game (front-page cards, streaks, save code)")
edit("site.js", 'reckoning: { code: "dr"', sub1(r'(\n  var BEAT = \{[\s\S]*?\})(\n  \};)', r'\1,\n    reckoning: { code: "dr", max: 1000, modes: 1 }\2'), "beat-my-score code dr")
edit("site.js", 'id === "reckoning" ? (r.total', sub1(r'( : "✓";\n      parts\.push\()', r' : id === "reckoning" ? (r.total != null ? r.total : "✓")\1'), "today's results line")
edit("site.js", 'me.id === "reckoning") return /1,000 of 1,000/', sub1(r'(\n    return false;\n  \}\n  function confetti)', r'\n    if (me.id === "reckoning") return /1,000 of 1,000/.test(line);\1'), "perfect-day confetti")
edit("site.js", 'me.id === "reckoning")) return;', sub1(r'(if \(!me \|\| !btn \|\| document\.getElementById\("imgBtn"\)[^\n]*?)\) return;', r'\1 || (me.id === "reckoning")) return;'), "no generic share image")

_sj = read("site.js")
N = len(re.findall(r'\{ id: "', re.search(r'var GAMES = \[([\s\S]*?)\n  \];', _sj).group(1))) + len(re.findall(r'\n  GAMES\.push\(\{', _sj))
W = WORDS[N]
print(f"  site.js lists {N} games, so counts read '{W}'")


def count(s):
    """every 'eight games a day' / 'Eight free daily geography games' becomes the real number"""
    def r(m):
        w = W.capitalize() if m.group(1)[0].isupper() else W
        return w + m.group(2)
    return re.sub(r'\b(' + NUM + '|' + NUM.title() + r')( free daily geography games| daily geography games| games a day| daily games)', r, s)


def counted(s): return count(s) == s


# ---------- 2. the "Daily games" menu at the foot of every page ----------
def nav(s):
    pat = re.compile(r'^([ \t]*)<a href="([^"]*?)(history|crossings)\.html">([^<]+)</a>(</nav>)?[ \t]*$', re.M)
    ms = list(pat.finditer(s))
    if not ms: return None
    m = next((x for x in ms if x.group(3) == "history"), ms[0])
    ind, pre, close = m.group(1), m.group(2), m.group(5) or ""
    line = m.group(0)[: len(m.group(0)) - len(close)] if close else m.group(0)
    return s[: m.start()] + line + "\n" + f'{ind}<a href="{pre}dead-reckoning.html">Dead Reckoning</a>{close}' + s[m.end():]


for f in ["index.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html",
          "crossings.html", "history.html", "404.html", "offline.html", "about/index.html", "how-to-play/index.html", "games/index.html", "privacy/index.html", "hints.html"]:
    if not os.path.exists(path(f)): continue
    if f in ("games/index.html", "privacy/index.html", "hints.html") and not re.search(r'^[ \t]*<a href="[^"]*crossings\.html">', read(f), re.M): continue
    edit(f, 'dead-reckoning.html">Dead Reckoning</a>', nav, "Daily games menu link")

# ---------- 3. service worker and sitemap ----------
def sw(s):
    v = re.search(r'const C = "mapelago-([^"]+)"', s).group(1)
    return sub1(r'(\n  "offline\.html",)', '\n  "dead-reckoning.html", "dead-reckoning.js?v=' + v + '",' + r'\1')(s)


edit("sw.js", '"dead-reckoning.html"', sw, "PRE list")
edit("sitemap.xml", "dead-reckoning.html", sub1(r'(\n</urlset>)', r'\n  <url><loc>https://mapelago.com/dead-reckoning.html</loc><lastmod>2026-11-25</lastmod></url>\1'), "sitemap entry")

# the game page's own script addresses carry the release version, like every other page
def page_version(s):
    v = re.search(r'const C = "mapelago-([^"]+)"', read("sw.js")).group(1)
    return re.sub(r'((?:site|copy|world|analytics|dead-reckoning)\.js)\?v=[^"\']+', r'\1?v=' + v, s)


edit("dead-reckoning.html", lambda s: page_version(s) == s, page_version, "script addresses match the sw.js version")

# ---------- 4. the pages that describe the games ----------
GAMES_SECTION = '''<section id="dead-reckoning">
<h2><a href="../dead-reckoning.html">Dead Reckoning</a></h2>
<p>Dead Reckoning is Mapelago&#x27;s daily map-tapping game. You get the name of a place and tap where it is on a world map with no labels. Each place scores up to 100 by how far your pin lands from the real spot, and later places count for more, so a perfect day is 1,000. The first place is a capital or a famous city; the last is a small capital or a little-known city. After every tap you see the distance, which way the place lies and a short fact. When you are done, Play more gives you endless practice places that never count.</p>
<ol class="howto"><li>Read the place name.</li><li>Tap the map where you think it is. Zoom in to be exact.</li><li>Lock in your pin and see how far off you were.</li><li>Do all five and share your score: one square per place, never the answers.</li></ol>
<p><a class="play" href="../dead-reckoning.html">Play Dead Reckoning</a></p>
</section>
'''
edit("games/index.html", 'id="dead-reckoning"', sub1(r'(<h2>Streaks</h2>)', GAMES_SECTION.replace("\\", "\\\\") + r'\1'), "game section")
edit("games/index.html", lambda s: "blank-map pins" in s, lambda s: re.sub(r'(free daily geography games: )([^".<]*)\.', lambda m: m.group(1) + add_to_list(m.group(2), "blank-map pins") + ".", s), "descriptions mention blank-map pins")
edit("games/index.html", counted, count, f"counts say {W}")

HOW = ('<h2>Dead Reckoning, the blank map</h2>\n<p><a href="../dead-reckoning.html">Dead Reckoning</a> names five places a day. Tap where each one is on a world map with no labels; pinch or scroll to zoom, or move the pin with the arrow keys and press Enter. Each place scores up to 100 by distance (a pin 250 km off still earns 80), and later places count for more, so a perfect day is 1,000. Your result is one square per place, from a bullseye to red, and never names the places. Play more gives endless practice that never touches your streak or stats.</p>\n\n')
edit("how-to-play/index.html", "<h2>Dead Reckoning, the blank map</h2>", sub1(r'(<h2>The quick games)', HOW + r'\1'), "how-to-play section")
edit("how-to-play/index.html", counted, count, f"counts say {W}")

edit("about/index.html", lambda s: re.search(r'games a day, the same for everyone: [^<]*Dead Reckoning\.', s),
     sub1(r'(games a day, the same for everyone: )([^<]*?)\.', lambda m: m.group(1) + add_to_list(m.group(2), "Dead Reckoning") + "."), "lede names Dead Reckoning")
edit("about/index.html", counted, count, f"counts say {W}")

# home page search data (0.15.7) and the app's description
if "free daily geography games" in read("index.html"):
    edit("index.html", lambda s: re.search(r'free daily geography games: [^"]*Dead Reckoning', s),
         sub1(r'(free daily geography games: )([^"]*?)\.', lambda m: m.group(1) + add_to_list(m.group(2), "Dead Reckoning") + "."), "search data names Dead Reckoning")
    edit("index.html", counted, count, f"counts say {W}")
if "free daily geography games" in read("manifest.webmanifest"):
    def man(s):
        d = json.loads(s)["description"]
        m = re.match(r'(.*?free daily geography games: )(.*)\.$', d)
        return s.replace(json.dumps(d)[1:-1], json.dumps(m.group(1) + add_to_list(m.group(2), "tap places on a blank map") + ".")[1:-1], 1) if m else None
    edit("manifest.webmanifest", "blank map", man, "description mentions the blank map")
    edit("manifest.webmanifest", counted, count, f"counts say {W}")

# ---------- 5. tests ----------
def test_lists(s):
    """add the page to every list of pages in run.js that names the games, after the last game listed"""
    def r(m):
        body = m.group(0)
        if "dead-reckoning.html" in body or '"crossings.html"' not in body: return body
        last = '"history.html"' if '"history.html"' in body else '"crossings.html"'
        return body.replace(last, last + ', "dead-reckoning.html"', 1)
    return re.sub(r'for \(const f of \[[^\]]*\]', r, s)


edit("tests/run.js", lambda s: test_lists(s) == s, test_lists, "dead-reckoning.html in the page lists (clean load, landmarks, cache version)")
edit("tests/run.js", 'require("./dead-reckoning.test.js")', sub1(r'(\n  \} finally \{ await b\.close\(\); srv\.close\(\); \})',
     r'\n    // Dead Reckoning (tests/dead-reckoning.test.js)\n    await require("./dead-reckoning.test.js")({ b, U, page, check });\1'), "Dead Reckoning checks")


def about_check(s):
    m = re.search(r'\["Mystery city", "Mystery country"[^\]]*\]\.every\(\(g\) => \(/<p class="lede">', s)
    if not m: return None
    arr = m.group(0)
    s = s.replace(arr, arr.replace('"].every', '", "Dead Reckoning"].every', 1), 1) if "Dead Reckoning" not in arr else s
    return s


edit("tests/run.js", lambda s: re.search(r'"Dead Reckoning"\]\.every\(\(g\) => \(/<p class="lede">', s), about_check, "about-page check names Dead Reckoning")


def home_check(s):
    # 0.15.7 section 22: the home page's search data names every game
    return sub1(r'(free daily geography games\[\^"\]\*)(?!Dead Reckoning)[\w ?]+/', r'\1Dead Reckoning/')(s)


if "free daily geography games[^\"]*" in read("tests/run.js"):
    edit("tests/run.js", 'geography games[^"]*Dead Reckoning/', home_check, "home search-data check names Dead Reckoning")


def test_counts(s):
    s = count(s)
    return re.sub(r'\b(all )(' + NUM + r')( daily games| games)\b', lambda m: m.group(1) + W + m.group(3), s)


edit("tests/run.js", lambda s: test_counts(s) == s, test_counts, f"test names and patterns say {W}")

print("done" if not problems else "finished with problems in: " + ", ".join(sorted(set(problems))))
sys.exit(1 if problems else 0)
