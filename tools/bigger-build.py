#!/usr/bin/env python3
"""Builds bigger.html (Bigger?, from No. 17) from Fathoms' head and the shared look. Run after a version bump;
tools/ink-link.py and review/teachers-menu-patch.py run after it (bump.sh does both)."""
import os, re
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
f = open(os.path.join(R, "fathoms.html"), encoding="utf8").read()
v = re.search(r"site\.js\?v=([0-9.]+)", f).group(1)
head = f[:f.find("</style>")]
T = "Bigger? Which city has more people, which country more land | Mapelago"
DESC = "Ten pairs a day, cities and countries in turn: tap the one with more people, or the one with more land. Free, one minute, the same for everyone."
head = head.replace("fathoms.html", "bigger.html").replace("og-fathoms.png", "og-bigger.png")
head = re.sub(r"<title>[^<]*</title>", "<title>" + T + "</title>", head)
head = re.sub(r'(og:title" content=")[^"]*', r"\g<1>" + T, head)
head = re.sub(r'(name="description" content=")[^"]*', r"\g<1>" + DESC, head)
head = re.sub(r'(og:description" content=")[^"]*', r"\g<1>" + DESC, head)
head = re.sub(r'"name":"Fathoms"', '"name":"Bigger?"', head)
head = re.sub(r'("description":")[^"]*(")', lambda m: m.group(1) + DESC + m.group(2), head, count=1)
CSS = r"""
/* Bigger? */
.dots{display:flex;gap:5px;list-style:none;margin:0 0 8px;padding:0}
.dots li{flex:1;height:14px;border:2px solid var(--line);border-radius:3px;background:var(--paper)}
.dots li.k-country{border-style:dashed}.dots li.now{background:var(--tint-2)}
.dots li.right{background:var(--accent)}.dots li.wrong{background:transparent;opacity:.45}
.bqbar{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 4px;font-weight:700}.bqbar #run{color:var(--accent-ink)}
#ask{margin:0 0 8px;font-size:22px}
.pick{position:relative;display:block;width:100%;min-height:96px;margin:0;padding:10px 96px 10px 14px;text-align:left;background:var(--paper);color:var(--ink);border:2px solid var(--line);border-radius:var(--r-btn);font:inherit;cursor:pointer}
.pick .nm{display:block;font:400 26px/1.05 var(--title,var(--font));letter-spacing:.02em}.pick .sb{display:block;margin-top:2px;color:var(--ink-2);font-size:15px}
.pick .fig{display:block;margin-top:4px;font-weight:800;font-size:17px;min-height:1px}
.pick canvas.bq-shape{position:absolute;right:10px;top:50%;width:76px;height:56px;transform:translateY(-50%)}
.pick .bq-pin{position:absolute;right:22px;top:50%;width:46px;height:46px;transform:translateY(-50%);background:url(ink/art/bigger.svg) center/cover;border-radius:3px;opacity:.9}
.pick.right{outline:4px solid var(--accent);outline-offset:-2px}.pick.wrong{opacity:.62}.pick.mine::after{content:"Your pick";position:absolute;right:10px;bottom:6px;font-size:12px;font-weight:800;color:var(--accent-ink)}
.or{margin:6px 0;text-align:center;font-weight:800;color:var(--ink-2)}
#say{min-height:22px;margin:8px 0 4px}#say .src{color:#5a4a30;font-size:13px}
#next{margin-top:6px;width:100%}#next[hidden]{display:none}
#done .score b{font-size:48px}#bqRecap{margin:10px 0;padding-left:20px}#bqRecap li{margin:3px 0}#bqRecap li.w{opacity:.75}#bqRecap span{color:var(--ink-2);font-size:13px}
#before .row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
"""
dv = open(os.path.join(R, "daily.html"), encoding="utf8").read()
LOGO = re.search(r'<a href="\./" id="logoMascot"[^>]*>.*?</a>', dv, re.S).group(0)
BODY = """
<body>
<div class="app">
  <header class="top">
    <div class="mark">LOGO_HERE<div class="name"><p class="word">Bigger?</p><span class="no" id="num"></span></div></div>
    <nav class="tools" aria-label="Game tools"></nav>
  </header>
  <p class="lede" id="lede">Ten pairs: tap the bigger one. Cities by people, countries by land.</p>
  <ol class="dots" id="dots" aria-label="Your ten rounds"></ol>
  <section id="play" aria-label="This pair">
    <div class="bqbar"><span id="round"></span><span id="run" aria-live="polite"></span></div>
    <h2 id="ask"></h2>
    <button class="pick" id="pick0" type="button"></button>
    <p class="or">or</p>
    <button class="pick" id="pick1" type="button"></button>
    <p id="say" aria-live="polite"></p>
    <button class="act" id="next" type="button" hidden>Next pair</button>
  </section>
  <section id="before" class="panel" hidden>
    <h2>One game from Episode 17</h2>
    <p>Bigger city? and Bigger country? become one game, Bigger?, on Episode 17. Until then, today's pairs are on their own pages.</p>
    <div class="row2"><a class="act" href="bigger-city.html">Bigger city?</a><a class="act" href="bigger-country.html">Bigger country?</a></div>
  </section>
  <section id="done" hidden>
    <div class="panel">
      <h2 id="doneTitle"></h2>
      <div class="score"><b id="big"></b><span>right out of 10</span></div>
      <pre class="share" id="shareText"></pre>
      <div class="row2"><button id="shareBtn" class="act" type="button">Copy result</button><a class="act plain" href="daily.html">Daily Voyage</a></div>
      <p class="next">New pairs in <b class="countdown"></b></p>
    </div>
    <ol id="bqRecap" aria-label="Today's pairs"></ol>
  </section>
  <footer class="about">
    <!-- copy:start -->
    <h1 class="about-h">Which is bigger?</h1>
    <p>Bigger? is Mapelago's one-minute size game. Ten pairs a day take turns: two cities (tap the one where more people live) and two countries (tap the one that covers more land). The pairs start far apart and close up, so the last few are the hard ones.</p>
    <p class="mxsource">Sources: city populations are the UN's 2025 estimates of each city's urban area (World Urbanization Prospects 2025, the built-up urban area, not city limits). Country areas are surface areas from the UN Demographic Yearbook 2023. A pair is never asked where the two figures are within 2% or where another common definition could flip the answer.</p>
    <!-- copy:end -->
    <nav aria-label="Site"><a href="./">Home</a> <a href="games/">All games</a> <a href="how-to-play/">How to play</a> <a href="about/">About</a> <a href="privacy/">Privacy</a></nav>
  </footer>
</div>
<div id="toast" role="status"></div>
<script src="site.js?v=VER"></script>
<script src="bigger-data.js?v=VER"></script>
<script src="bigger.js?v=VER"></script>
<script src="analytics.js?v=VER" defer></script>
</body>
</html>
""".replace("VER", v).replace("LOGO_HERE", LOGO)
open(os.path.join(R, "bigger.html"), "w", encoding="utf8").write(head + CSS + "</style>\n</head>" + BODY)
print("wrote bigger.html", v)
