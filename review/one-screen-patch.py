#!/usr/bin/env python3
# One screen on a phone (375x667) for Mystery city and Mystery country: adds a small style block and marks the
# first action. Safe to run again: it replaces its own block. Run after any script that rebuilds those pages.
import re, sys
CSS = r'''
/* One screen: on a phone the whole game (score, board, the newest clue, the pin button) fits without scrolling. */
@media (max-width:520px){
.top{margin-bottom:8px}
.mx-find{margin-bottom:8px}.mx-find a{min-height:38px;font-size:15px;padding:2px 4px}
.status{margin-bottom:8px;min-height:0}.stat{padding:4px 4px;gap:2px}.stat b{font-size:22px}
.modes{margin-bottom:8px}.modes button{min-height:44px;padding:4px 10px;text-align:center;align-content:center}.modes button span{display:none}
.tip{margin-bottom:8px;min-height:44px}.tip p{font-size:13.5px;line-height:1.25}.tipm{width:24px;height:24px}.tipx{height:40px}
#guesses{margin-bottom:6px;font-size:13px;gap:2px}#guesses{min-width:0;max-width:100%}#guesses li.hrow{flex-wrap:nowrap;min-height:24px;min-width:0;max-width:100%}#guesses li.hrow>span:last-of-type{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.app:has(#guesses li+li) #tip{display:none}
.app{--y1:0px;--y2:0px;--y3:0px;--y4:0px;--y5:0px}
.app:has(#tip:not([hidden])){--y1:54px}.app:has(#challenge:not([hidden])){--y2:66px}.app:has(#guesses li){--y3:26px}.app:has(#guesses li+li){--y3:52px;--y1:0px}.app:has(#guesses li+li+li){--y3:78px}.app:has(#guesses li+li+li+li){--y3:104px}
.app:has(#mxMode:not([hidden])){--y4:52px}.app:has(#askBtn:not([hidden])){--y5:44px}
.board{width:min(100%,max(180px,calc(100vh - 402px - var(--y1) - var(--y2) - var(--y3) - var(--y4) - var(--y5))));width:min(100%,max(180px,calc(100svh - 402px - var(--y1) - var(--y2) - var(--y3) - var(--y4) - var(--y5))))}
.legend,[data-look] .legend{margin:8px 0 0;min-width:0;max-width:100%;overflow:hidden}#clues{max-width:100%;min-width:0}
.lhead,[data-look] .lhead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0}
.track,[data-look] .track{margin:0 0 6px;gap:6px}.sw,[data-look] .sw{width:auto;min-width:36px;height:32px;font-size:15px}[data-look="island"] .sw{width:36px;height:36px}
/* the clues are a row of cards, newest first: swipe sideways (or tap a tile size above) to see the earlier ones */
#clues,[data-look] #clues{display:flex;flex-direction:row-reverse;justify-content:flex-end;gap:8px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;padding:0;background:none;height:74px}
#clues::-webkit-scrollbar{display:none}#clues::before{display:none!important}
#clues .clue,[data-look] #clues .clue{flex:0 0 88%;box-sizing:border-box;scroll-snap-align:start;height:74px;overflow:hidden;padding:6px 10px;background:var(--paper);color:var(--ink);border:1.5px solid var(--line);border-radius:12px;font-size:14px;line-height:1.3;align-content:center}
#clues .clue:only-child{flex-basis:100%}
#clues .clue svg,#clues .clue img{max-height:58px;width:auto}
[data-look="postcard"] .legend::after{display:none}
[data-look="arcade"] .word{font-size:26px}[data-look="arcade"] .no{font-size:13px}[data-look="arcade"] .stat b{font-size:24px}[data-look="arcade"] .stat span{font-size:13px}[data-look="arcade"] #guesses{font-size:14px}[data-look="arcade"] #clues .clue{font-size:15px}[data-look="arcade"] .tip p{font-size:15px}[data-look="arcade"] .ask{font-size:14px}
.ask{margin-top:6px;min-height:38px;padding:2px 10px;font-size:13px;line-height:1.15}
.stuck{position:relative;z-index:4;margin:-96px 6px 8px;min-height:88px;box-sizing:border-box;font-size:13.5px}.stuck p{margin:0}
.actbar{padding-top:6px;padding-bottom:calc(8px + env(safe-area-inset-bottom))}.actbar .act{min-height:50px}
#toast{bottom:calc(150px + env(safe-area-inset-bottom))}
/* the result: place, score, share, the next game and the countdown come first; the map, facts and stats follow */
#endBody{display:flex;flex-direction:column}#endBody>*{order:9}
#endBody>.mascot{order:0}#endBody>#endTitle{order:1;font-size:19px;margin:0 0 2px}#endBody>.place{order:1;font-size:26px}#endBody>.country{order:1;margin:0}
#endBody>.score{order:2;margin:8px 0 6px}#endBody .score b{font-size:44px}
#endBody>.row2{order:3;margin:0 0 8px}#endBody>.also{order:3;margin:0}#endBody>.next{order:4;margin:8px 0}
#endBody>#miniMap{order:5}#endBody>.facts{order:6}
.mx-tip{margin:0 0 8px;padding:6px 10px;font-size:13.5px;font-weight:600;line-height:1.25;background:var(--paper);color:var(--ink);border:var(--bw) solid var(--line);border-radius:var(--r)}.app:not(.mx-new) .mx-tip{display:none}.app.mx-new:has(#mxTip){--y1:54px}
/* first visit: show the first move on the board */
.app.mx-new .board::after{content:"\1F446";position:absolute;left:50%;top:50%;font-size:34px;line-height:1;z-index:6;pointer-events:none;animation:mxSwipe 1.8s ease-in-out infinite}
html.mx-quick .app.mx-new .board::after{display:none}
html.mx-quick .app.mx-new .actbar .act{animation:mxPulse 1.6s ease-in-out infinite}
}
@keyframes mxSwipe{0%{transform:translate(-90px,-10px);opacity:0}15%{opacity:1}70%{transform:translate(50px,-10px);opacity:1}100%{transform:translate(50px,-10px);opacity:0}}
@keyframes mxPulse{50%{box-shadow:0 0 0 6px color-mix(in srgb,var(--accent) 35%,transparent)}}
@media (prefers-reduced-motion:reduce){.app.mx-new .board::after{animation:none;transform:translate(-17px,-10px)}html.mx-quick .app.mx-new .actbar .act{animation:none}}
'''
JS = r'''
<script id="mxOneJs">
// One screen: a new clue brings the clue row back to its start, and tapping a tile size shows that clue.
(function(){var c=document.getElementById("clues"),t=document.getElementById("track");if(!c||!t)return;
new MutationObserver(function(){c.scrollLeft=0}).observe(c,{childList:true});
var app=document.querySelector(".app"),sw=document.getElementById("swipes"),gu=document.getElementById("guesses");
function fresh(){if(app)app.classList.toggle("mx-new",!!sw&&sw.textContent.trim()==="0"&&!(gu&&gu.children.length))}
if(sw)new MutationObserver(fresh).observe(sw,{childList:true,characterData:true,subtree:true});if(gu)new MutationObserver(fresh).observe(gu,{childList:true});fresh();
t.addEventListener("click",function(e){var li=e.target.closest("li");if(!li)return;var i=[].indexOf.call(t.children,li),k=c.children[i];if(k&&k.scrollIntoView)k.scrollIntoView({block:"nearest",inline:"start",behavior:"smooth"})});
})();
</script>
'''
# ---- the other games: a style block for phones, the rules moved behind a "?" (site.js shows it), one opening sentence
def simple(f, css, help_html, swaps):
    s = open(f, encoding='utf8').read()
    s = re.sub(r'<style id="mxOne">.*?</style>\n', '', s, flags=re.S); s = re.sub(r'<template id="mxHelp">.*?</template>\n', '', s, flags=re.S)
    for a, b in swaps:
        if b in s and a not in s: continue
        assert s.count(a) == 1, (f, a, s.count(a)); s = s.replace(a, b)
    assert s.count('</head>') == 1
    s = s.replace('</head>', '<style id="mxOne">' + css + '</style>\n</head>')
    if help_html: i = s.index('<footer'); s = s[:i] + '<template id="mxHelp">' + help_html + '</template>\n' + s[i:]
    open(f, 'w', encoding='utf8').write(s); print('patched', f)

VOYAGE_CSS = r'''
@media (max-width:520px){
.top{margin-bottom:6px}.lede{font-size:14.5px;line-height:1.3;margin:0 0 6px}
.dots{margin:0 0 4px}.vx-ladder{margin:0 0 6px}.vx-key,#vxHarborNote,.vx-topics{display:none}
.status{margin-bottom:6px;min-height:0}.stat{padding:3px 4px;gap:1px}.stat b{font-size:21px}
#play.panel,#choice.panel{padding:8px 10px;margin:0 0 6px}#play .kind{margin:0 0 2px;font-size:13px}#ask{font-size:17.5px;line-height:1.2;margin:0 0 6px}
#show{display:block;max-height:128px;width:auto;max-width:100%;margin:0 auto 6px}#show[hidden]{display:none}
#opts{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0}#opts button{min-height:48px;padding:4px 6px;font-size:15px;line-height:1.15;margin:0}
.spy{min-height:40px;margin:6px 0 0;padding:2px 8px;font-size:13.5px}
#say{margin:0 0 4px;font-size:14px;min-height:20px}
.badges{margin:0;gap:4px}.badges li{font-size:12px;padding:2px 6px;min-height:0}
#done .panel{padding:10px 14px}#done h2{font-size:21px;margin:0 0 4px}#done .score{margin:2px 0 6px}#done .score b{font-size:40px}#done .share{padding:8px 10px;font-size:13px;line-height:1.3;margin:0 0 8px}#done .row2{margin:0 0 6px;gap:8px}#done .act{min-height:46px;font-size:15px}#done .note,#done .next{font-size:13px;margin:4px 0}
}
'''
VOYAGE_HELP = '''<h2>How to play Voyage</h2>
<ul>
<li>Ten islands, one question on each.</li>
<li>After a right answer, drop anchor to keep your points, or sail on for more.</li>
<li>A wrong answer wrecks you: you keep only what is safe in harbor.</li>
<li>⚓ Islands 3 and 6 are harbors: points you reach there are safe. Safe in harbor is 0 until you answer island 3 right.</li>
<li>The spyglass takes away two wrong answers, once a voyage.</li>
<li>Today's topics sit under the question; each one fills in when you get it right.</li>
</ul>'''
if not sys.argv[1:] or 'voyage.html' in sys.argv:
    simple('voyage.html', VOYAGE_CSS, VOYAGE_HELP, [
        ('<p class="lede" id="lede">Ten islands, one question on each. Drop anchor to keep your points, or sail on for more. Islands 3 and 6 are harbors: points you reach there are safe.</p>',
         '<p class="lede" id="lede">Answer each island\'s question, then sail on for more points or drop anchor to keep them.</p>'),
        ('<div class="opts" id="opts"></div>', '<div class="opts" id="opts" data-first></div>'),
        ('<p class="note vx-topics">', '<p class="note vx-topics" data-below>'),
    ])

RECK_CSS = r'''
@media (max-width:520px){
.top{margin-bottom:6px}.lede{font-size:14.5px;line-height:1.3;margin:0 0 6px}
.game{gap:6px}.side{gap:6px}
.ask{padding:4px 10px;margin-bottom:6px;gap:6px;box-shadow:none}.ask h2{font-size:19px}.rnd{font-size:12px}
.mapwrap{aspect-ratio:auto;height:clamp(200px,calc(100vh - 330px),340px);height:clamp(200px,calc(100svh - 330px),340px)}
.maphint{display:none}
.dots{gap:4px}.dots li{min-height:0}
#lockBtn{min-height:50px}
/* after a pin is locked the answer panel needs the room, so the map gives some up */
.app:has(#reveal:not([hidden])) .mapwrap{height:clamp(170px,calc(100vh - 470px),300px);height:clamp(170px,calc(100svh - 470px),300px)}
.reveal{padding:8px 10px}.reveal .dist{margin:0 0 4px;gap:8px}.reveal .arrow{width:36px;height:36px}.reveal .km{font-size:20px}.reveal .pts{font-size:24px}.fact{margin:0 0 6px;font-size:13.5px;line-height:1.3}.reveal .act{min-height:46px}
/* the result takes the screen */
.app:has(#done:not([hidden])) :is(.lede,#ask,.mapwrap,.dots){display:none}
#done .panel{padding:10px 14px}#done h2{font-size:21px;margin:0 0 4px}#done .score{margin:2px 0 6px}#done .score b{font-size:40px}#done .share{padding:8px 10px;font-size:13px;line-height:1.3;margin:0 0 8px}#done .row2{margin:0 0 6px;gap:8px}#done .act{min-height:46px;font-size:15px}#done .note,#done .next,#done p{font-size:13px;margin:4px 0}
#done .panel{display:flex;flex-direction:column}#done .panel>*{order:5}#done #doneTitle,#done .score{order:1}#done .share{order:2}#done .row2{order:3}#done .next{order:4}
}
'''
RECK_HELP = '''<h2>How to play Dead Reckoning</h2>
<ul>
<li>Five places a day. Tap where each one is on a blank map, then lock in your pin. The closer, the more points.</li>
<li>Pinch or scroll to zoom, drag to move the map.</li>
<li>Keyboard: arrow keys move the pin (Shift for big steps), Enter locks it in, plus and minus zoom.</li>
<li>Play more is practice: endless random places that never change today's result, your streak or your stats.</li>
</ul>'''
if not sys.argv[1:] or 'dead-reckoning.html' in sys.argv:
    simple('dead-reckoning.html', RECK_CSS, RECK_HELP, [
        ('<p class="lede" id="lede">Five places a day. Tap where each one is on a blank map. The closer, the more points.</p>',
         '<p class="lede" id="lede">Tap the blank map where you think each of today\'s five places is.</p>'),
        ('<div class="mapwrap">', '<div class="mapwrap" data-first>'),
    ])

DONE_CSS = "#done .panel{padding:10px 14px}#done h2{font-size:21px;margin:0 0 4px}#done .score{margin:2px 0 6px}#done .score b{font-size:40px}#done .share{padding:8px 10px;font-size:13px;line-height:1.3;margin:0 0 8px}#done .row2{margin:0 0 6px;gap:8px}#done .act{min-height:46px;font-size:15px}#done .note,#done .next,#done p{font-size:13px;margin:4px 0}"
STAMPS_CSS = r'''
@media (max-width:520px){
.top{margin-bottom:6px}.lede{font-size:14.5px;line-height:1.3;margin:0 0 6px}
.wheelbox{width:min(210px,56vw);height:min(210px,56vw);margin:2px auto 8px}.wheelbox.asked{width:76px;height:76px;margin:0 auto 6px}
.vx-wheel-note{display:none}
#spin{min-height:50px}
#quiz.panel{padding:8px 10px}#qcat{margin:0 0 2px;font-size:13px}#qask{font-size:17px;line-height:1.2;margin:0}
#qopts{gap:6px;margin-top:6px;grid-template-columns:1fr 1fr}#qopts .opt{min-height:46px;padding:4px 6px;font-size:15px;line-height:1.15}
#qabout{font-size:13px;line-height:1.3;margin:6px 0 0}.qsay{margin:6px 0;padding:5px 8px;font-size:14px;line-height:1.25}#qnext{min-height:46px}
#say{margin:4px 0 0;min-height:18px;font-size:14px}
.passport{margin-top:6px;padding:8px 10px}.passport h2{font-size:15px;margin:0}
.pass{margin:6px 0 0;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}.pass .slot{min-width:0;gap:2px}.pass .slot .ring{width:42px;height:42px}.pass .slot .ring svg{width:24px;height:24px}.pass .slot b{font-size:9.5px;line-height:1.1;letter-spacing:-.2px;text-align:center}.pass .slot>span:last-child{font-size:9.5px}
.app:has(#done:not([hidden])) :is(.lede,.wheelbox,#spin,#say,.passport){display:none}
''' + DONE_CSS + '''
}
'''
STAMPS_HELP = '''<h2>How to play Stamps</h2>
<ul>
<li>Spin the wheel and answer the question it lands on. A right answer stamps that category. Fill all six.</li>
<li>Tap the wheel to stop it early.</li>
<li>The wheel skips categories that are already stamped or missed twice, and when only one is left it picks that one for you.</li>
</ul>'''
if not sys.argv[1:] or 'stamps.html' in sys.argv:
    simple('stamps.html', STAMPS_CSS, STAMPS_HELP, [
        ('<p class="lede" id="lede">Spin the wheel and answer the question it lands on. A right answer stamps that category. Fill all six.</p>',
         '<p class="lede" id="lede">Spin the wheel, answer its question, and fill all six stamps.</p>'),
        ('<button class="act" id="spin">', '<button class="act" id="spin" data-first>'),
    ])

FATHOMS_CSS = r'''
@media (max-width:520px){
.top{margin-bottom:6px}.lede{font-size:14.5px;line-height:1.3;margin:0 0 6px}
.dots{margin:0 0 6px}.status{margin-bottom:6px;min-height:0}.stat{padding:3px 4px;gap:1px}.stat b{font-size:21px}
#play.panel,#shown.panel{padding:8px 10px}#play .kind{margin:0 0 2px;font-size:13px}#ask{font-size:18px;line-height:1.2;margin:0 0 8px}
#fin{height:48px}#sugs{margin:6px 0 0;gap:4px;max-height:150px;overflow:auto}#sugs li,#sugs button{min-height:40px}
#fgo{min-height:50px;margin-top:8px}#fpass{margin-top:2px}
#shown h2{font-size:18px;line-height:1.2;margin:0 0 6px}#shownNote{font-size:13.5px;line-height:1.3;margin:6px 0}
/* every right answer stays one tap away in its own scrolling list, so Next is always on screen */
#allAns{max-height:calc(100vh - 470px);max-height:calc(100svh - 470px);min-height:90px;overflow:auto;margin:0 0 8px;font-size:13.5px}
#fnext{min-height:50px}
#say{margin:4px 0 0;min-height:18px;font-size:14px}
''' + DONE_CSS + '''
}
'''
FATHOMS_HELP = '''<h2>How to play Fathoms</h2>
<ul>
<li>Seven prompts a day, each with many right answers.</li>
<li>The less obvious your answer, the deeper it goes: up to 1,000 fathoms a prompt, 7,000 in all.</li>
<li>A wrong answer or a pass scores nothing for that prompt.</li>
<li>After each prompt you see every right answer, deepest first.</li>
</ul>'''
if not sys.argv[1:] or 'fathoms.html' in sys.argv:
    simple('fathoms.html', FATHOMS_CSS, FATHOMS_HELP, [
        ('<p class="lede" id="lede">Seven prompts a day, each with many right answers. The less obvious your answer, the deeper it goes.</p>',
         '<p class="lede" id="lede">Type any right answer: the less obvious it is, the deeper you go.</p>'),
        ('<input id="fin" type="text"', '<input id="fin" data-first type="text"'),
    ])

# Bigger city? and Bigger country?: only the result is rearranged (title, score, share and the next game first)
BIG_CSS = r'''
@media (max-width:520px){
''' + DONE_CSS + '''
#done .panel{display:flex;flex-direction:column}#done .panel>*{order:5}#done #doneTitle,#done .score{order:1}#done .bcstats{order:2;margin:0 0 6px}#done .row2{order:3}#done .next{order:4}
}
'''
for f in ('bigger.html', 'bigger-country.html'):
    if not sys.argv[1:] or f in sys.argv: simple(f, BIG_CSS, None, [])

# Logbook: the same questions, tightened so the slider questions and their answers fit a phone screen
LOG_CSS = r'''
@media (max-width:520px){
.top{margin-bottom:6px}.lede{font-size:14px;line-height:1.3;margin:0 0 6px}
#dots,.dots{margin:0 0 4px}
#play.panel,#game .panel{padding:8px 10px}
#qask{font-size:17.5px;line-height:1.2;margin:0}
.ev{margin:6px 0 0;padding:6px 10px;font-size:15px;line-height:1.25}
.hint{margin:4px 0 0;font-size:13px}
.tl{margin-top:6px}.yearbig{margin:0 0 2px}.yearbig b{font-size:40px}.tlpins{height:38px}
.nudge{margin:4px 0 0;gap:6px}
.opts{gap:6px;margin-top:8px}.opt{min-height:46px;padding:4px 10px;font-size:15.5px;line-height:1.2}
.qsay{margin:6px 0 4px;padding:5px 8px;font-size:14px;line-height:1.25}
#qnext{margin-top:6px;min-height:48px}
''' + DONE_CSS + '''
#done .panel{display:flex;flex-direction:column}#done .panel>*{order:5}#done #doneTitle,#done .score{order:1}#done .row2{order:3}#done .next{order:4}
}
'''
if not sys.argv[1:] or 'history.html' in sys.argv:
    simple('history.html', LOG_CSS, None, [('<p class="morebar"><button class="linkbtn" id="pastBtn"', '<p class="morebar" data-below><button class="linkbtn" id="pastBtn"')])

for f in [x for x in (sys.argv[1:] or ['city.html', 'country.html']) if x in ('city.html', 'country.html')]:
    s = open(f, encoding='utf8').read()
    s = re.sub(r'<style id="mxOne">.*?</style>\n', '', s, flags=re.S); s = re.sub(r'\n<script id="mxOneJs">.*?</script>\n', '\n', s, flags=re.S)
    assert s.count('</head>') == 1 and s.count('</body>') == 1
    s = s.replace('</head>', '<style id="mxOne">' + CSS + '</style>\n</head>')
    s = s.replace('</body>', JS.strip('\n') + '\n</body>') if False else s.replace('</body>', JS.lstrip('\n') + '</body>')
    s = s.replace('<div id="board" class="board" tabindex="0"', '<div id="board" class="board" data-first tabindex="0"') if 'class="board" data-first' not in s else s
    if f == 'country.html':
        # the rules sheet no longer opens by itself on a first visit (it stays behind the ? button); one sentence instead
        s = s.replace('hn.seenHelp||(A("#helpModal").hidden=!1);', '/*mx-one: play first*/')
        if 'id="mxTip"' not in s:
            a0 = '<div id="board" class="board"'; assert s.count(a0) == 1
            s = s.replace(a0, '<p id="mxTip" class="mx-tip">Swipe the board to join matching tiles and open clues to today\'s mystery country.</p>\n  ' + a0)
    for a in ['<p class="note" id="costNote"', '<div class="pad" role="group"', '<p class="note" id="streakNote"', '<p class="note" id="nextNote"']:
        if a in s: s = s.replace(a, a.replace(' ', ' data-below ', 1))
    open(f, 'w', encoding='utf8').write(s); print('patched', f)
