#!/usr/bin/env python3
# Builds index.html: the home page. Daily Voyage is the one big button; three featured games; the other eight below.
# Old links to the Mystery city game (mapelago.com/#..., shares, archive days) are sent on to city.html.
import re, json
R = '/home/user/mapelago'
f = open(R + '/fathoms.html', encoding='utf8').read()
v = re.search(r'site\.js\?v=([0-9.]+)', f).group(1)
head = f[:f.find('</style>')]
T = 'Mapelago: free daily geography games'
DESC = "Today's Daily Voyage, four stops in a few minutes, and eleven free daily geography games: find a city, cross borders, pin places on a blank map and more. The same puzzles for everyone, nothing to sign up for."
head = head.replace('fathoms.html', '').replace('og-fathoms.png', 'og-voyage.png')
head = re.sub(r'<title>[^<]*</title>', '<title>' + T + '</title>', head)
head = re.sub(r'(og:title" content=")[^"]*', r'\g<1>' + T, head)
head = re.sub(r'(name="description" content=")[^"]*', r'\g<1>' + DESC, head)
head = re.sub(r'(og:description" content=")[^"]*', r'\g<1>' + DESC, head)
head = re.sub(r'"name":"Fathoms"', '"name":"Mapelago"', head)
head = head.replace('<head>', '<head>\n<script>/* links made for the Mystery city game when it lived here (shares, archive days, #day-N) go on to it */\nif (location.hash.length > 1 || /[?&](q|city)=/.test(location.search)) location.replace("city.html" + location.search + location.hash);</script>', 1)
CSS = r'''
/* Home */
.hero{margin:6px 0 16px;padding:16px;background:var(--paper);color:var(--ink);border:var(--bw) solid var(--line);border-bottom-width:var(--lip);border-radius:var(--r)}
.hero h1{margin:0 0 4px;font-size:26px;line-height:1.1}.hero p{margin:0 0 12px;color:var(--ink-2);font-weight:600}
.hero .act{min-height:62px;font-size:21px}
.hero svg{display:block;width:100%;height:auto;margin:0 0 10px;color:var(--ink)}
.feat{display:grid;gap:10px;margin:0 0 18px}.feat a,.more a{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;align-items:center;padding:12px;background:var(--paper);color:var(--ink);text-decoration:none;border:var(--bw) solid var(--line);border-bottom-width:var(--lip);border-radius:var(--r)}
.feat .ic,.more .ic{grid-row:span 2;font-size:28px}.feat b,.more b{font-size:18px}.feat span,.more span{font-size:14px;color:var(--ink-2);font-weight:600}
.feat a.done b::after,.more a.done b::after{content:" \2713";color:var(--accent-ink)}
h2.sec{font-size:18px;margin:0 0 8px}
.more{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 18px}.more a{grid-template-columns:auto 1fr;padding:10px}.more b{font-size:15px}.more span{font-size:12.5px}
@media (min-width:900px){.app{max-width:760px}.feat{grid-template-columns:repeat(3,1fr)}.more{grid-template-columns:repeat(4,1fr)}}
'''
FEAT = [("crossings.html", "\U0001F9ED", "Crossings", "Get from one country to another, border by border."),
        ("dead-reckoning.html", "\U0001F4CD", "Dead Reckoning", "Five places, a blank map, the closer the better."),
        ("city.html", "\U0001F3D9️", "Mystery city", "Slide tiles for clues, then pin today's city.")]
MORE = [("country.html", "\U0001F30D", "Mystery country", "Clues, then pin the country."),
        ("bigger.html", "\U0001F465", "Bigger city?", "Ten pairs: which has more people?"),
        ("bigger-country.html", "\U0001F5FA️", "Bigger country?", "Ten pairs: which covers more land?"),
        ("voyage.html", "⚓", "Voyage", "Ten islands, sail on or drop anchor."),
        ("fathoms.html", "\U0001F419", "Fathoms", "Name a country nobody else would."),
        ("stamps.html", "\U0001F4EE", "Stamps", "Spin the wheel, fill six stamps."),
        ("history.html", "\U0001F4DC", "Logbook", "How the map changed since 1800."),
        ("ballast.html", "\U0001F6A2", "Ballast", "Stack real countries on a rocking ship.")]
card = lambda c: '<a href="%s" data-game="%s"><span class="ic" aria-hidden="true">%s</span><b>%s</b><span>%s</span></a>' % (c[0], c[0], c[1], c[2], c[3])
ROUTE = '<svg viewBox="0 0 320 50" aria-hidden="true"><path d="M18 32 C70 6 110 46 160 24 S250 8 302 28" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5"/><circle cx="18" cy="32" r="8" fill="#b4237d" stroke="currentColor" stroke-width="2"/><circle cx="112" cy="30" r="8" fill="#fff" stroke="currentColor" stroke-width="2"/><circle cx="208" cy="18" r="8" fill="#fff" stroke="currentColor" stroke-width="2"/><circle cx="302" cy="28" r="8" fill="#fff" stroke="currentColor" stroke-width="2"/></svg>'
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
</svg></a><div class="name"><p class="word">Mapelago</p><span class="no" id="num">Free daily geography games</span></div></div>
  </header>
  <section class="hero" aria-labelledby="dvH">
    %s
    <h1 id="dvH">Today's Daily Voyage</h1>
    <p id="dvLine">Four stops, one score, a few minutes. The same voyage for everyone.</p>
    <a class="act" id="dvGo" href="daily.html">Play today's Daily Voyage</a>
  </section>
  <h2 class="sec">Featured games</h2>
  <nav class="feat" aria-label="Featured games">%s</nav>
  <h2 class="sec">More games</h2>
  <nav class="more" aria-label="More games">%s</nav>
  <footer class="about">
    <nav aria-label="Site">
      <a href="games/">All games</a>
      <a href="how-to-play/">How to play</a>
      <a href="teachers/">For teachers</a>
      <a href="about/">About</a>
      <a href="privacy/">Privacy</a>
    </nav>
  </footer>
</div>
<div id="toast" role="status"></div>
<script src="site.js?v=%s"></script>
<script>
// a tick on the games already played today, and the voyage button says when today's is done
(function () { try {
  var g = window.MXS && MXS.info ? MXS.info() : []; g.forEach(function (s) { var a = document.querySelector('a[data-game="' + s.game.url + '"]'); if (a && s.doneToday) a.classList.add("done"); });
  var dv = JSON.parse(localStorage.getItem("dailycity:dailyvoyage:v1") || "{}"), n = window.MXS ? MXS.today() : 0, r = dv.results && dv.results[n];
  if (r) { document.getElementById("dvGo").textContent = "Today's voyage: " + r.score + " of 100. See it"; document.getElementById("dvLine").textContent = "Done for today. A new voyage in " + (MXS.untilNext ? MXS.untilNext() : "the morning") + "."; }
} catch (e) {} })();
</script>
<script src="analytics.js?v=%s" defer></script>
</body>
</html>
''' % (ROUTE, ''.join(map(card, FEAT)), ''.join(map(card, MORE)), v, v)
open(R + '/index.html', 'w', encoding='utf8').write(head + CSS + '</style>\n</head>' + BODY)
print('wrote index.html', v)
