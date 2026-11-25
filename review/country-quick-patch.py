#!/usr/bin/env python3
"""Quick mode for Mystery country, from No. 14: the same as Mystery city's Quick mode.

Pick Tiles or Quick before the first move or pin of a round (shown from No. 14; the choice is
remembered for the country game on its own, in dailycity:country:mode). Quick: no tiles, one clue to
start, a new clue after each missed pin, five pins, the same miss line. A find on pin 1 to 5 scores
1,000, 800, 600, 400 or 200; five misses score up to 100 by the closest pin. The round stores q: 1,
and so does the day's result. Shares name the mode, so beat-my-score links carry it.

Run after review/country-rules-patch.py and review/scoring-patch.py (some anchors are text they
write):
    python3 review/country-quick-patch.py [--take-ours] [country.html]
Each edit is skipped if it is already there; if an anchor is missing nothing is written.
"""
import sys

FUNCS = r'''/* mx-country-quick: Quick mode, as in Mystery city, from No. 14 (the round stores q: 1). Added by review/country-quick-patch.py. */
function MxQpref(){try{return localStorage.getItem("dailycity:country:mode")==="quick"}catch(e){return!1}}
function MxQrv(){Object.assign(en,{quick:!!C.q,pins:C.q?5:3})}
function MxQr(t){let e=0;for(let n of t){if(n.km<=en.landKm)return{done:!0,won:!0,score:1e3-200*e,misses:e};if(e++,e>=en.pins){let a=Math.min(...t.map(r=>r.km));return{done:!0,won:!1,score:Math.round(100*Math.max(0,1-Math.sqrt(Math.max(0,a-en.landKm)/(en.lossScaleKm-en.landKm)))),misses:e}}}return{done:!1,won:!1,score:0,misses:e}}
function MxQline(){return C.won?`${C.pins.length}/5`:"X/5"}
function MxQshare(){let t=C.pins.map(e=>gt(e.d)==="landed"?"✅ found it":`${MxHQ[MxHq(e.d)].s} ${ve(e.d)} ${vl[mt(e.b)]}`),c=Math.min(...C.pins.map(e=>e.d));return`${an.title} No. ${X} · mystery country, quick mode \u{1F422}
${MxStarTxt()}${C.won?`Found in ${C.pins.length}/5 pins`:`Not found: X/5, closest ${ve(c)}`}
${t.join("\n")}
${C.won?"Can you find it in fewer pins?":"Can you find it?"} ${yi}/${an.path}#c-${X}-${C.score}-${C.pins.length}`}
function MxModeUi(){let m=A("#mxMode");document.documentElement.classList.toggle("mx-quick",!!en.quick);if(!m)return;m.dataset.w||(m.dataset.w=1,m.querySelectorAll("button").forEach(x=>x.onclick=()=>MxMode(x.dataset.m==="quick")));m.hidden=!(X>=14&&!C.moves&&!C.pins.length&&!C.done);m.querySelectorAll("button").forEach(x=>x.setAttribute("aria-checked",String(x.dataset.m==="quick"===!!C.q)))}
function MxMode(q){if(C.moves||C.pins.length||C.done||X<14)return;try{localStorage.setItem("dailycity:country:mode",q?"quick":"tiles")}catch(e){}C.q=q?1:0;MxQrv();Ei();Oa();Gi(q?"Quick mode: one clue now, a new one after each missed pin, five pins.":"Tile mode: slide tiles to open clues, then pin the country.")}
'''

CSS = '''/* mx-country-quick: the Tiles / Quick choice, as in Mystery city */
.modes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px}.modes[hidden]{display:none}
.modes button{display:grid;gap:2px;text-align:left;padding:8px 10px;min-height:44px;background:var(--paper);color:var(--ink);border:var(--bw) solid var(--line);border-radius:var(--r-btn)}
.modes button b{font-size:16px}.modes button span{font-size:12.5px;line-height:1.3;color:var(--ink-2)}
.modes button[aria-checked="true"]{background:var(--accent);color:var(--on-accent);border-bottom-width:var(--lip)}.modes button[aria-checked="true"] span{color:inherit}
.mx-quick #board,.mx-quick .pad,.mx-quick #storm,.mx-quick #track,.mx-quick #tip,.mx-quick .coach,.mx-quick .status .stat:nth-child(2){display:none!important}
.mx-quick .status{grid-template-columns:1fr 1fr}
@media (min-width:900px){.mx-quick .app{max-width:560px;display:block}}
/* /mx-country-quick */
'''

PICKER = '''  <div id="mxMode" class="modes" role="radiogroup" aria-label="How to play today's country" hidden>
    <button type="button" role="radio" data-m="tiles" aria-checked="true"><b>Tiles</b><span>Slide tiles to open clues, then pin. 3 pins.</span></button>
    <button type="button" role="radio" data-m="quick" aria-checked="false"><b>Quick</b><span>One clue now, one more per missed pin. 5 pins.</span></button>
  </div>
'''

EDITS = [
    ("\nvar Z=Y.colors,", "\n" + FUNCS + "var Z=Y.colors,"),
    ("/* /mx-scoring */\n", "/* /mx-scoring */\n" + CSS),
    ("</section>\n  <p id=\"challenge\"", "</section>\n" + PICKER + "  <p id=\"challenge\""),
    # a fresh round of No. 14 or later starts in the remembered mode
    ("C.s&&(en.s2=!0)}", "C.s&&(en.s2=!0);X>=14&&C.q==null&&!C.moves&&!(C.pins&&C.pins.length)&&!C.done&&MxQpref()&&(C.q=1);MxQrv()}"),
    ("function $i(n){let t=0;", "function $i(n){if(en.quick)return MxQr(n);let t=0;"),
    ("function MxCq(){return Math.min(Zn.length,dt(W.maxTile)+(en.r2?Ta():0))}",
     "function MxCq(){return en.quick?Math.min(Zn.length,1+Ta()):Math.min(Zn.length,dt(W.maxTile)+(en.r2?Ta():0))}"),
    ("A(\"#nextClue\").textContent=e?`Next clue: make a ${e.v}`:\"All six clues are open\"",
     "A(\"#nextClue\").textContent=en.quick?(t<Zn.length?\"Next clue: after a missed pin\":\"All six clues are open\"):e?`Next clue: make a ${e.v}`:\"All six clues are open\""),
    ("function _a(n){if(C.done", "function _a(n){if(en.quick)return;if(C.done"),
    ("A(\"#num\").textContent=an.label(X),A(\"#score\").textContent=C.done?C.score:zn(W.moves.length",
     "A(\"#num\").textContent=an.label(X),MxModeUi(),A(\"#score\").textContent=C.done?C.score:en.quick?1e3-200*Ta():zn(W.moves.length"),
    ("A(\"#costNote\").textContent=MxShelp()||`Each move costs", "A(\"#costNote\").textContent=MxShelp()||(en.quick?\"Quick mode: five pins. Each missed pin opens the next clue and costs 200 points.\":`Each move costs"),
    ("${en.r2?\" and opens the next clue\":\"\"}.`;document.querySelectorAll(\".mcost\")",
     "${en.r2?\" and opens the next clue\":\"\"}.`);document.querySelectorAll(\".mcost\")"),
    ("w=!C.done&&(W.storm||a);s.hidden=!w;", "w=!en.quick&&!C.done&&(W.storm||a);s.hidden=!w;"),
    ("hn.results[X]={score:C.score,won:C.won,pins:C.pins.length,moves:W.moves.length}",
     "hn.results[X]=Object.assign({score:C.score,won:C.won,pins:C.pins.length,moves:W.moves.length},C.q?{q:1}:{})"),
    ("<div class=\"score\"><b>${C.score}</b><span>points out of 1,000</span><span class=\"rankname\">${Za(C.score)}</span></div>",
     "${C.q?`<div class=\"score\"><b>${MxQline()}</b><span>Quick mode</span><span class=\"rankname\">${C.score} points</span></div>`:`<div class=\"score\"><b>${C.score}</b><span>points out of 1,000</span><span class=\"rankname\">${Za(C.score)}</span></div>`}"),
    ("n&&MxCount(A(\"#endBody .score b\"),C.score)", "n&&!C.q&&MxCount(A(\"#endBody .score b\"),C.score)"),
    ("function Bi(){", "function Bi(){if(C.q)return MxQshare();"),
    ("`${h} of 6 clues in ${Ee(W.moves.length,\"move\",\"moves\")}`", "(C.q?`${h} of 6 clues, quick mode`:`${h} of 6 clues in ${Ee(W.moves.length,\"move\",\"moves\")}`)"),
    # the choice goes away with the first move (Mystery city's stays until the page redraws)
    ("W0.textContent=W.moves.length,MxCost();", "W0.textContent=W.moves.length,MxCost(),MxModeUi();"),
    # localhost-only test hook
    ("sc:{sm:MxSm,", "mode:MxMode,sc:{sm:MxSm,"),
]


def take_ours(s):
    out, mode = [], None
    for line in s.splitlines(keepends=True):
        if line.startswith("<<<<<<< "):
            mode = "ours"
        elif mode and (line.startswith("||||||| ") or line.rstrip("\r\n") == "======="):
            mode = "skip"
        elif mode and line.startswith(">>>>>>> "):
            mode = None
        elif mode != "skip":
            out.append(line)
    return "".join(out)


def main(args):
    path = ([a for a in args if not a.startswith("--")] or ["country.html"])[0]
    s = open(path, encoding="utf-8").read()
    if "--take-ours" in args:
        s = take_ours(s)
    done, missing = 0, []
    for a, b in EDITS:
        if b in s or (a.startswith("\n") and b.split("\n")[1] in s):
            continue
        if s.count(a) != 1:
            missing.append((a, s.count(a)))
            continue
        s = s.replace(a, b, 1)
        done += 1
    if missing:
        for a, n in missing:
            print(f"{path}: anchor found {n} times (need 1): {a[:110]!r}")
        print(f"{path}: nothing written.")
        return 1
    open(path, "w", encoding="utf-8").write(s)
    print(f"{path}: {done} of {len(EDITS)} Quick mode edits applied ({len(EDITS) - done} were already there)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
