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
    chained = {e[0] for e in edits}
    for old, new in edits:
        # an edit that a later edit changes again (its result is that edit's anchor) is done once the later one is
        if old not in out and new in chained:
            continue
        if new in out or ("vx-pack:start" in new and "vx-pack:start" in out):
            continue
        # an edit already made and changed again by a later edit: its first new line is still there
        first = next((l for l in new.split("\n") if l.strip() and l not in old), "")
        if first and first in out.split("\n"):
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
    # the generated pack + families + practice code, before the toast and the scripts (kept away from the ?v= lines)
    ('</div>\n<div id="toast" role="status"></div>\n',
     '</div>\n' + BLOCK + '<div id="toast" role="status"></div>\n'),
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
    # clarity (375 px first-time play): say what a harbor is up front, and put the topic chips under the question with a caption
    ('<p class="lede" id="lede">Ten islands, one question on each. Drop anchor to keep your points, or sail on for more.</p>',
     '<p class="lede" id="lede">Ten islands, one question on each. Drop anchor to keep your points, or sail on for more. Islands 3 and 6 are harbors: points you reach there are safe.</p>'),
    ('  </section>\n  <ul class="badges" id="badges" aria-label="Kinds of question you have answered"></ul>\n\n  <section id="play"',
     '  </section>\n  <!-- vx-topics: the topic chips moved under the question -->\n\n  <section id="play"'),
    ('  <p id="say" aria-live="polite"></p>\n\n  <section id="done" hidden>',
     '  <p id="say" aria-live="polite"></p>\n'
     '  <!-- vx-topics:start --><p class="note vx-topics">Today\'s topics. Each one fills in when you get it right.</p>\n'
     '  <ul class="badges" id="badges" aria-label="Kinds of question you have answered"></ul><!-- vx-topics:end -->\n\n  <section id="done" hidden>'),
    ('.vxmore{margin-top:10px}.vxmore-note{margin:6px 0 0}\n.vxp .act',
     '.vxmore{margin-top:10px}.vxmore-note{margin:6px 0 0}\n.vx-topics{margin:0 0 6px}\n'
     '.vx-practicing #dots,.vx-practicing .status,.vx-practicing #badges,.vx-practicing .vx-topics,.vx-practicing #say{display:none}\n.vxp .act'),
    # the practice Next button stays hidden until an answer is picked (.act sets display, which beats [hidden])
    ('.vx-topics{margin:0 0 6px}\n', '.vx-topics{margin:0 0 6px}\n#vxpNext[hidden]{display:none}\n'),
    # review fixes (live 0.15.2): words for the pictures, harbors on the route, the spyglass stays visible, the points ladder, 1,000 with a comma
    ('function we(n,cv){let a=cv||P("#show");', 'function we(n,cv){let a=cv||P("#show");window.VXV&&VXV.alt(n,a,xa);'),
    ('function ve(){', 'function ve(){window.VXV&&VXV.ui(C,qn(et(),!0));'),
    ('P("#spy").hidden=C.spy!==-1', '(P("#spy").hidden=!1,P("#spy").disabled=C.spy!==-1,P("#spy").textContent=C.spy===-1?"Use the spyglass: take away two wrong answers":C.spy===n?"Spyglass used on this island":"Spyglass used (one a day)")'),
    ('Worth ${O.values[n]} points.', 'Worth ${VXN(O.values[n])} points.'),
    ('Right. You have ${e} points.', 'Right. You have ${VXN(e)} points.'),
    ('would leave you with ${o}.', 'would leave you with ${VXN(o)}.'),
    ('for ${O.values[n+1]}', 'for ${VXN(O.values[n+1])}'),
    ('Drop anchor and keep ${e}', 'Drop anchor and keep ${VXN(e)}'),
    ('P("#bigScore").textContent=Hn()', 'P("#bigScore").textContent=VXN(Hn())'),
    ('P("#vPoints").textContent=Hn()', 'P("#vPoints").textContent=VXN(Hn())'),
    ('P("#vSafe").textContent=C.end?Hn():qn(et(),!0)', 'P("#vSafe").textContent=VXN(C.end?Hn():qn(et(),!0))'),
    ('\\u{1F422} ${Hn()} points', '\\u{1F422} ${VXN(Hn())} points'),
    # the share line fits how the trip ended
    ('window.MXCOPY&&MXCOPY.invite&&MXCOPY.invite.voyage||"How far would you sail?"',
     '(C.end==="home"?"I made it home: all ten islands. Can you?":C.end==="wreck"?"How far would you sail?":window.MXCOPY&&MXCOPY.invite&&MXCOPY.invite.voyage||"How far would you sail?")'),
    ('<ol class="dots" id="dots" aria-label="The ten islands"></ol>',
     '<ol class="dots" id="dots" aria-label="The ten islands"></ol>\n'
     '  <!-- vx-ladder:start --><ol class="vx-ladder" aria-label="Points for reaching each island"><li>50</li><li>100</li><li class="h">150<span class="sr">, harbor</span></li><li>250</li><li>350</li><li class="h">500<span class="sr">, harbor</span></li><li>650</li><li>800</li><li>900</li><li>1,000</li></ol>\n'
     '  <p class="vx-key" aria-hidden="true"><span class="vx-anchor">\u2693</span> Harbor: points you reach there are safe</p><!-- vx-ladder:end -->'),
    ('  </section>\n  <!-- vx-topics: the topic chips moved under the question -->',
     '  </section>\n  <p class="note vx-harbor" id="vxHarborNote">Safe in harbor is what you keep if a wrong answer wrecks you. It is 0 until you answer island 3 right.</p>\n  <!-- vx-topics: the topic chips moved under the question -->'),
    ('#vxpNext[hidden]{display:none}\n',
     '#vxpNext[hidden]{display:none}\n'
     '.vx-ladder{list-style:none;margin:-8px 0 4px;padding:0;display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:5px;font-size:11px;font-weight:700;text-align:center;font-variant-numeric:tabular-nums;color:var(--ground-ink-2)}\n'
     '.vx-ladder li.h{color:var(--ground-ink);font-weight:800}\n'
     '.dots li.harbor:not(.done)::before{content:"\\2693";font-size:14px;line-height:1;color:var(--ink-2)}\n'
     '.vx-key{margin:0 0 10px;font-size:13px;color:var(--ground-ink-2)}.vx-harbor{margin:-4px 0 10px}.vx-harbor[hidden]{display:none}\n'
     '.spy:disabled{opacity:.6;cursor:default;border-style:dotted}\n'),
    # play-through on the branch: practice streak and best spaced apart
    ('.vxp-streak{margin:0;font-size:15px;font-variant-numeric:tabular-nums}', '.vxp-streak{margin:0;font-size:15px;font-variant-numeric:tabular-nums}.vxp-streak span+span{margin-left:14px}'),
]

stamps = [
    ('</div>\n<div id="toast" role="status"></div>\n',
     '</div>\n' + BLOCK + '<div id="toast" role="status"></div>\n'),
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
    # clarity: the answer message shows once, inside the question panel (it has its own role="status")
    ('.vxp{margin-top:14px}',
     '#quiz:not([hidden]) + #say{display:none}\n.vx-practicing .passport,.vx-practicing #say{display:none}\n.vxp{margin-top:14px}'),
    ('#quiz:not([hidden]) + #say{display:none}\n', '#quiz:not([hidden]) + #say{display:none}\n#sxpNext[hidden]{display:none}\n'),
    # review fixes (live 0.15.2): explanations add a fact; the share grid is labelled; the wheel says how it works
    ('A=(window.SX&&SX.init({T:Ma,yn:I,sa,Wa,Ya,D,va}),window.SX&&b>=SX.FROM?SX.deal(b,n=>{k=p.cats=n}):pa(Ma,b))',
     'A=(window.SX&&SX.init({T:Ma,yn:I,sa,Wa,Ya,D,va}),window.SX?SX.explainAll(b>=SX.FROM?SX.deal(b,n=>{k=p.cats=n}):pa(Ma,b),b):pa(Ma,b))'),
    ('${k.map(t=>({1:"\\u2705",2:"\\u{1F7E8}",0:"\\u274C"})[a[t].got]).join("")}',
     '${window.SX?SX.grid(k,a,D):k.map(t=>({1:"\\u2705",2:"\\u{1F7E8}",0:"\\u274C"})[a[t].got]).join("")}'),
    ('  </div>\n  <button class="act" id="spin">Spin the wheel</button>',
     '  </div>\n  <p class="note vx-wheel-note" id="vxWheelNote">Tap the wheel to stop it early. It skips categories that are already stamped or missed twice, and when only one is left it picks that one for you.</p>\n  <button class="act" id="spin">Spin the wheel</button>'),
    ('#sxpNext[hidden]{display:none}\n', '#sxpNext[hidden]{display:none}\n.qsay.ok::before,.qsay.no::before{content:none}\n.vx-wheel-note{margin:0 0 10px;text-align:center}#wheelbox.asked + .vx-wheel-note,#wheelbox[hidden] + .vx-wheel-note{display:none}\n'),
    # play-through on the branch: practice streak and best spaced apart
    ('.vxp-streak{margin:0;font-size:15px;font-variant-numeric:tabular-nums}', '.vxp-streak{margin:0;font-size:15px;font-variant-numeric:tabular-nums}.vxp-streak span+span{margin-left:14px}'),
]

patch("voyage.html", voyage)
patch("stamps.html", stamps)
