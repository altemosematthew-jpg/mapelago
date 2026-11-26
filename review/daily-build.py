#!/usr/bin/env python3
# Builds daily.html (Daily Voyage) from Fathoms' head and the shared look, plus the two tiny counted pages.
import re, os
R = '/home/user/mapelago'
f = open(R + '/fathoms.html', encoding='utf8').read()
v = re.search(r'site\.js\?v=([0-9.]+)', f).group(1)
head = f[:f.find('</style>')]
T = 'Daily Voyage: four stops, one score | Mapelago'
DESC = "Today's voyage: pin a place, pick the bigger country, find the country between two others, and one more. Four stops, a score out of 100, the same for everyone."
head = head.replace('fathoms.html', 'daily.html').replace('og-fathoms.png', 'og-voyage.png')
head = re.sub(r'<title>[^<]*</title>', '<title>' + T + '</title>', head)
head = re.sub(r'(og:title" content=")[^"]*', r'\g<1>' + T, head)
head = re.sub(r'(name="description" content=")[^"]*', r'\g<1>' + DESC, head)
head = re.sub(r'(og:description" content=")[^"]*', r'\g<1>' + DESC, head)
head = re.sub(r'"name":"Fathoms"', '"name":"Daily Voyage"', head)
CSS = r'''
/* Daily Voyage */
#route{margin:0 0 6px;color:var(--ground-ink)}#route svg{display:block;width:100%;height:auto}
#route circle{fill:var(--paper);stroke:var(--ink);stroke-width:2}#route circle.now{fill:var(--accent)}#route circle.done{fill:var(--tint)}
#route text{font:800 12px var(--font);fill:var(--ink)}#route text.lab{font:700 10px var(--font);fill:var(--ground-ink-2)}
.dvhead{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 6px}.dvhead b{font-size:22px}
#leg{display:grid;gap:8px;margin:8px 0 0}#leg .opt{min-height:48px;padding:6px 10px;font:700 16px var(--font);text-align:left;background:var(--paper);color:var(--ink);border:2px solid var(--ink);border-radius:var(--r-btn)}
#leg .opt.big{display:flex;justify-content:space-between;align-items:center;min-height:58px}#leg .opt.big span{font-weight:600;font-size:14px;color:var(--ink-2)}
#leg .opt.right{background:var(--accent);color:var(--on-accent)}#leg .opt.wrong{border-style:dashed;opacity:.8}#leg .opt.x{opacity:.6}
#pinmap{display:block;width:100%;aspect-ratio:2/1.15;border:var(--bw) solid var(--line);border-radius:var(--r);cursor:crosshair;touch-action:manipulation}
#din{width:100%;height:50px;box-sizing:border-box;padding:0 12px;font:600 17px var(--font);border:2px solid var(--ink);border-radius:var(--r-btn)}
#say{min-height:22px;margin:8px 0 4px;font-weight:800}
#next{margin-top:4px}#next[hidden]{display:none}
#done .score b{font-size:48px}#grid{font-size:28px;letter-spacing:6px;margin:4px 0}#legs{margin:0 0 8px;padding-left:20px}
.full{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.full a{text-align:center}
'''
BODY = '''
<body>
<div class="app">
  <header class="top">
    <div class="mark"><a href="./" id="logoMascot" aria-label="Mapelago home"></a><div class="name"><p class="word">Daily Voyage</p><span class="no" id="num"></span></div></div>
  </header>
  <p class="lede">Four stops, one voyage: each is worth up to 25 points.</p>
  <div id="route" role="img" aria-label="Today's route: four stops"></div>
  <section id="play" class="panel" aria-label="This stop">
    <div class="dvhead"><span class="kind" id="kind"></span><span><b id="score">0</b> of 100</span></div>
    <h2 id="ask"></h2>
    <div id="leg"></div>
    <p id="say" aria-live="polite"></p>
    <button class="act" id="next" type="button" hidden></button>
  </section>
  <section id="done" hidden>
    <div class="panel">
      <h2>Voyage over</h2>
      <div class="score"><b id="big"></b><span>of 100</span></div>
      <p id="grid" aria-hidden="true"></p>
      <ul id="legs"></ul>
      <pre class="share" id="shareText"></pre>
      <div class="row2"><button id="shareBtn" class="act" type="button">Copy result</button><a class="act plain" href="games/">All games</a></div>
      <p class="note" id="streak"></p>
      <p><b>Play the full games:</b></p>
      <div class="full"><a class="act plain" href="dead-reckoning.html">Dead Reckoning</a><a class="act plain" href="bigger-country.html">Bigger country?</a><a class="act plain" href="crossings.html">Crossings</a><a class="act plain" href="fathoms.html">Fathoms</a></div>
    </div>
  </section>
  <footer class="about">
    <p>Daily Voyage strings together one stop from Dead Reckoning, Bigger country? and Crossings, then a Fathoms prompt or a Logbook pair, on alternate days. Every game still has its own page, streak and archive.</p>
    <nav aria-label="Site"><a href="./">Home</a> <a href="games/">All games</a> <a href="how-to-play/">How to play</a> <a href="about/">About</a> <a href="privacy/">Privacy</a></nav>
  </footer>
</div>
<div id="toast" role="status"></div>
<script src="site.js?v=VER"></script>
<script src="daily-data.js?v=VER"></script>
<script src="daily.js?v=VER"></script>
<script src="analytics.js?v=VER" defer></script>
</body>
</html>
'''.replace('VER', v)
open(R + '/daily.html', 'w', encoding='utf8').write(head + CSS + '</style>\n</head>' + BODY)
for w in ('start', 'done'):
    open(R + '/daily-%s.html' % w, 'w', encoding='utf8').write('<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Daily Voyage %s</title></head><body><!-- counted once per Daily Voyage %s; loaded hidden by daily.js on mapelago.com only --><script src="analytics.js?v=%s" defer></script></body></html>\n' % (w, 'started' if w == 'start' else 'finished', v))
print('wrote daily.html', v)
