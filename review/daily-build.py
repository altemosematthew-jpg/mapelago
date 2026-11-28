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
#leg .opt.right{background:var(--accent);color:var(--on-accent)}#leg .opt.wrong{border-style:dashed;opacity:.8}#leg .opt.other{opacity:.6}
#pinmap{display:block;width:100%;aspect-ratio:2/1.25;border:var(--bw) solid var(--line);border-radius:var(--r);cursor:crosshair;touch-action:manipulation}
.dvmap{position:relative}@media (max-width:600px){.dvmap{margin:0 -14px}.dvmap #pinmap{border-left:0;border-right:0;border-radius:0}}.dvzoom{position:absolute;right:8px;top:8px;display:grid;gap:6px}.dvzoom button{width:40px;height:40px;padding:0;font:800 22px var(--font);background:var(--paper);color:var(--ink);border:2px solid var(--line);border-radius:var(--r-btn);cursor:pointer}
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
    <div class="mark"><a href="./" id="logoMascot" aria-label="Mapelago home"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="38" height="38" aria-hidden="true">
  
  <g fill="#9fc98b" stroke="#000000" stroke-width="2.2" stroke-linejoin="round">
    <path d="M45.5 24h9v12h-9z"/>
    <path d="M50 8c6 0 9.5 5 9.5 10.5S56 28 50 28s-9.5-4-9.5-9.5S44 8 50 8z"/>
    <path d="M32 41C21 30 9 30 8.5 37.5c-.4 5.6 9 10 23.5 12z"/>
    <path d="M68 41c11-11 23-11 23.5-3.5.4 5.6-9 10-23.5 12z"/>
    <path d="M35 73c-9 4-16 11-12 15 4.5 3.8 12-3 17-10z"/>
    <path d="M65 73c9 4 16 11 12 15-4.5 3.8-12-3-17-10z"/>
    <path d="M46.5 80 50 91l3.5-11z"/>
  </g>
  <circle cx="46" cy="16.5" r="1.8" fill="#000000"/><circle cx="54" cy="16.5" r="1.8" fill="#000000"/>
  <rect x="29" y="34" width="42" height="43" rx="15" fill="#ffffff" stroke="#000000" stroke-width="2.4"/>
  <rect x="34.2" y="39.2" width="10.8" height="10.8" fill="#ffffff" stroke="#000000" stroke-width="1.4"/><rect x="45" y="39.2" width="10.8" height="10.8" fill="#dcedf5" stroke="#000000" stroke-width="1.4"/><rect x="55.800000000000004" y="39.2" width="10.8" height="10.8" fill="#a9d3e8" stroke="#000000" stroke-width="1.4"/><rect x="34.2" y="50" width="10.8" height="10.8" fill="#9fc98b" stroke="#000000" stroke-width="1.4"/><rect x="45" y="50" width="10.8" height="10.8" fill="#b4237d" stroke="#000000" stroke-width="1.4"/><path d="M50.4 58.9c-.7-1.4-3-3.3-3-5.2a3 3 0 0 1 6 0c0 1.9-2.3 3.8-3 5.2z" fill="#ffffff"/><circle cx="50.4" cy="53.8" r="1" fill="#b4237d"/><rect x="55.800000000000004" y="50" width="10.8" height="10.8" fill="#f3d98a" stroke="#000000" stroke-width="1.4"/><rect x="34.2" y="60.800000000000004" width="10.8" height="10.8" fill="#a9d3e8" stroke="#000000" stroke-width="1.4"/><rect x="45" y="60.800000000000004" width="10.8" height="10.8" fill="#dcedf5" stroke="#000000" stroke-width="1.4"/><rect x="55.800000000000004" y="60.800000000000004" width="10.8" height="10.8" fill="#ffffff" stroke="#000000" stroke-width="1.4"/>
</svg></a><div class="name"><p class="word">Daily Voyage</p><span class="no" id="num"></span></div></div>
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
      <div class="row2"><button id="shareBtn" class="act" type="button">Copy result</button><button id="imgBtn" class="act" type="button">Share image</button><a class="act plain" href="games/">All games</a></div>
      <p class="note" id="streak"></p>
      <p><b>Play the full games:</b></p>
      <div class="full"><a class="act plain" href="dead-reckoning.html">Dead Reckoning</a><a class="act plain" href="bigger.html">Bigger?</a><a class="act plain" href="crossings.html">Crossings</a><a class="act plain" href="fathoms.html">Fathoms</a></div>
    </div>
  </section>
  <footer class="about">
    <p>Daily Voyage strings together one stop from Dead Reckoning, Bigger? and Crossings, then, in turn, a Fathoms prompt, a Logbook pair or the old Voyage game\'s best question: which city is at the mark? Every game still has its own page, streak and archive; the retired Voyage\'s days count toward the Daily Voyage streak.</p>
    <nav aria-label="Site"><a href="./">Home</a> <a href="games/">All games</a> <a href="how-to-play/">How to play</a> <a href="about/">About</a> <a href="privacy/">Privacy</a></nav>
  </footer>
</div>
<div id="toast" role="status"></div>
<script src="site.js?v=VER"></script>
<script src="daily-data.js?v=VER"></script>
<script src="bigger-data.js?v=VER"></script>
<script src="daily.js?v=VER"></script>
<script src="analytics.js?v=VER" defer></script>
</body>
</html>
'''.replace('VER', v)
open(R + '/daily.html', 'w', encoding='utf8').write(head + CSS + '</style>\n</head>' + BODY)
for w in ('start', 'done'):
    open(R + '/daily-%s.html' % w, 'w', encoding='utf8').write('<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Daily Voyage %s</title></head><body><!-- counted once per Daily Voyage %s; loaded hidden by daily.js on mapelago.com only --><script src="analytics.js?v=%s" defer></script></body></html>\n' % (w, 'started' if w == 'start' else 'finished', v))
print('wrote daily.html', v)
