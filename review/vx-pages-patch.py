#!/usr/bin/env python3
"""Voyage and Stamps (voyage-stamps session): the edits this branch makes to voyage.html and stamps.html.

Run from the repository root:  python3 review/vx-pages-patch.py && node review/vx-pack.js
Safe to run twice (an edit already made is skipped). Stops without writing if an anchor is missing.
Every edit is marked with "vx-" so it can be found again.
"""
import sys

def patch(path, edits):
    s = open(path, encoding="utf8").read()
    out = s
    for old, new in edits:
        if new in out or ("vx-pack:start" in new and "vx-pack:start" in out):
            continue
        n = out.count(old)
        if n != 1:
            sys.exit(f"{path}: anchor found {n} times, nothing written: {old[:70]!r}")
        out = out.replace(old, new)
    if out != s:
        open(path, "w", encoding="utf8").write(out)
        print(f"{path}: updated")
    else:
        print(f"{path}: already up to date")

BLOCK = '<script>/* vx-pack:start */ /* vx-pack:end */</script>\n'

voyage = [
    # the generated pack + families + practice code, just before the game's own script
    ('<script src="site.js?v=0.15.2"></script>\n<script>"use strict";',
     '<script src="site.js?v=0.15.2"></script>\n' + BLOCK + '<script>"use strict";'),
    # from No. 14 the day is dealt by the new mix
    ('rn=ut(xa,dt,_)', 'rn=window.VXV&&_>=VX.FROM?VXV.deal(xa,dt,_,yn):ut(xa,dt,_)'),
    # names for the new kinds (badges and island labels)
    ('tongue:"Languages"}', 'tongue:"Languages",inland:"Landlocked",drive:"Driving",web:"Web",money:"Money",call:"Phone codes",peak:"Peaks"}'),
    ('O.kinds.filter(', '(window.VXV?VXV.kinds:O.kinds).filter('),
    # the picture drawer can draw into the practice panel too
    ('function we(n){let a=P("#show")', 'function we(n,cv){let a=cv||P("#show")'),
    ('at&&(window.__voy=', 'window.VXH={draw:we,map:Fo,xa,dt,yn},window.VXV&&VXV.wire(),at&&(window.__voy='),
    # "Play more" under the result, and the practice panel
    ('<div class="row2"><button id="shareBtn" class="act">Copy result</button><a class="act plain" href="./">Mystery city</a></div>\n      <p class="next">Next voyage in',
     '<div class="row2"><button id="shareBtn" class="act">Copy result</button><a class="act plain" href="./">Mystery city</a></div>\n'
     '      <!-- vx-practice:start --><button class="act plain vxmore" id="vxMore">Play more: practice questions</button>\n'
     '      <p class="note vxmore-note">Endless questions, just for fun. Today\'s score, streak and share stay as they are.</p><!-- vx-practice:end -->\n'
     '      <p class="next">Next voyage in'),
    ('    <ol id="recap" aria-label="The islands you reached"></ol>\n  </section>\n',
     '    <ol id="recap" aria-label="The islands you reached"></ol>\n  </section>\n'
     '  <!-- vx-practice:start -->\n'
     '  <section id="vxp" class="panel vxp" hidden aria-labelledby="vxpHead">\n'
     '    <p class="vxp-tag">Practice: doesn\'t count toward today\'s score or streak</p>\n'
     '    <div class="vxp-top"><h2 id="vxpHead">Practice</h2><p class="vxp-streak" id="vxpStreak"></p></div>\n'
     '    <p class="kind" id="vxpKind"></p>\n'
     '    <h3 id="vxpAsk" class="vxp-ask"></h3>\n'
     '    <canvas id="vxpShow" class="vxp-show" width="640" height="340" hidden></canvas>\n'
     '    <div class="opts" id="vxpOpts"></div>\n'
     '    <p class="qsay" id="vxpSay" role="status" hidden></p>\n'
     '    <button class="act" id="vxpNext" hidden>Next question</button>\n'
     '    <button class="act plain" id="vxpBack">Back to today\'s result</button>\n'
     '  </section>\n'
     '  <!-- vx-practice:end -->\n'),
    ('.about-h{margin:0 0 10px;font-size:22px;line-height:1.2}.howto{margin:6px 0 14px;padding-left:22px;line-height:1.45}\n</style>',
     '.about-h{margin:0 0 10px;font-size:22px;line-height:1.2}.howto{margin:6px 0 14px;padding-left:22px;line-height:1.45}\n'
     '/* vx-practice: Play more */\n'
     '.vxmore{margin-top:10px}.vxmore-note{margin:6px 0 0}\n'
     '.vxp .act{margin-top:10px}.vxp-tag{display:inline-block;margin:0 0 8px;padding:3px 10px;border:2px dashed var(--muted);border-radius:999px;font-size:13px;font-weight:700;color:var(--ink-2)}\n'
     '.vxp-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:6px}.vxp-streak{margin:0;font-size:15px;font-variant-numeric:tabular-nums}\n'
     '.vxp-ask{margin:0 0 12px;font-size:21px;line-height:1.2}.vxp-show{display:block;width:100%;height:auto;margin:0 0 12px;border-radius:var(--r-tool)}.vxp-show[hidden]{display:none}\n'
     '.opt.wrong{border-style:dashed;color:var(--ink-2);text-decoration:line-through}\n'
     '.qsay{margin:10px 0 0;padding:9px 12px;border:var(--bw) solid var(--line);border-radius:var(--r);font-weight:800;font-size:15.5px;line-height:1.35}.qsay[hidden]{display:none}\n'
     '.qsay.ok{background:var(--tint)}.qsay.no{background:var(--paper);border-style:dashed}\n'
     '</style>'),
]

stamps = [
    ('<script src="site.js?v=0.15.2"></script>\n<script>"use strict";',
     '<script src="site.js?v=0.15.2"></script>\n' + BLOCK + '<script>"use strict";'),
    # from No. 14 the wheel's six categories and their questions come from the new mix
    ('A=pa(Ma,b)', 'A=(window.SX&&SX.init({T:Ma,yn:I,sa,Wa,Ya,D,va}),window.SX&&b>=SX.FROM?SX.deal(b,n=>{k=p.cats=n}):pa(Ma,b))'),
    ('na&&(window.__stamp=', 'window.SX&&SX.wire(),na&&(window.__stamp='),
    ('<div class="row2"><button id="shareBtn" class="act">Copy result</button><a class="act plain" href="./">Mystery city</a></div>\n      <p class="next">A new page in',
     '<div class="row2"><button id="shareBtn" class="act">Copy result</button><a class="act plain" href="./">Mystery city</a></div>\n'
     '      <!-- vx-practice:start --><button class="act plain vxmore" id="sxMore">Play more: practice questions</button>\n'
     '      <p class="note vxmore-note">Endless questions, just for fun. Today\'s page, streak and share stay as they are.</p><!-- vx-practice:end -->\n'
     '      <p class="next">A new page in'),
    ('    <ol id="recap" aria-label="Today\'s questions"></ol>\n  </section>\n',
     '    <ol id="recap" aria-label="Today\'s questions"></ol>\n  </section>\n'
     '  <!-- vx-practice:start -->\n'
     '  <section id="sxp" class="panel vxp" hidden aria-labelledby="sxpHead">\n'
     '    <p class="vxp-tag">Practice: doesn\'t count toward today\'s page or streak</p>\n'
     '    <div class="vxp-top"><h2 id="sxpHead">Practice</h2><p class="vxp-streak" id="sxpStreak"></p></div>\n'
     '    <p class="kind vxp-cat" id="sxpCat"></p>\n'
     '    <h3 id="sxpAsk" class="vxp-ask"></h3>\n'
     '    <div class="opts" id="sxpOpts"></div>\n'
     '    <p class="qsay" id="sxpSay" role="status" hidden></p>\n'
     '    <button class="act" id="sxpNext" hidden>Next question</button>\n'
     '    <button class="act plain" id="sxpBack">Back to today\'s page</button>\n'
     '  </section>\n'
     '  <!-- vx-practice:end -->\n'),
    ('.about-h{margin:0 0 10px;font-size:22px;line-height:1.2}.howto{margin:6px 0 14px;padding-left:22px;line-height:1.45}\n</style>',
     '.about-h{margin:0 0 10px;font-size:22px;line-height:1.2}.howto{margin:6px 0 14px;padding-left:22px;line-height:1.45}\n'
     '/* vx-practice: Play more */\n'
     '.vxmore{margin-top:10px}.vxmore-note{margin:6px 0 0}\n'
     '.vxp{margin-top:14px}.vxp-tag{display:inline-block;margin:0 0 8px;padding:3px 10px;border:2px dashed var(--muted);border-radius:999px;font-size:13px;font-weight:700;color:var(--ink-2)}\n'
     '.vxp-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:6px}.vxp-streak{margin:0;font-size:15px;font-variant-numeric:tabular-nums}\n'
     '.vxp-cat{display:flex;align-items:center;gap:6px}.vxp-ask{margin:0 0 12px;font-size:21px;line-height:1.2}\n'
     '</style>'),
]

patch("voyage.html", voyage)
patch("stamps.html", stamps)
