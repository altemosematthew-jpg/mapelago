#!/usr/bin/env python3
"""Mystery city and Mystery country: the new scoring, from No. 14 (see review/scoring.md).

Usage (from the repository folder):
    python3 review/scoring-patch.py                  # both pages
    python3 review/scoring-patch.py --take-ours      # after a merge: keep the checked-out side of each conflict first

Run review/country-rules-patch.py on country.html first; some anchors here are text it writes.
Each edit is skipped if it is already there; if an anchor is missing nothing is written for that page.

A round of No. 14 or later that starts on this version stores s: 1 and scores the new way:
- each missed pin costs 50 within 250 km, rising evenly to 150 at 2,000 km and beyond
  (rounded to 10); the miss line says what it cost
- each new tile size, up to 64, adds half its value the first time you make it (4 adds 2 ... 64 adds 32;
  62 at most), and the "New clue" note says so
- the end card shows the sum and one to three stars (850+, 650+, 400+); the copied result shows the stars
Quick mode keeps its own scoring (1000, 800, 600 ...); it only gets the stars and the sum.
Rounds before No. 14, and rounds started before this version, score as they always did.
"""
import sys

# The same functions on both pages, written with placeholders for each page's minified names.
CORE = r'''/* mx-scoring: the new scoring from No. 14 (rounds store s: 1). Added by review/scoring-patch.py; see review/scoring.md. */
function MxSm(d){return d<=250?50:d>=2e3?150:Math.round((50+(d-250)/17.5)/10)*10}
function MxSb(m){return m>=4?Math.min(m,64)-2:0}
function MxSmiss(e){let s=0,k=0;for(let p of @P.pins)if(p.d>@nt.landKm){if(k++>=e)break;s+=MxSm(p.d)}return s}
function MxStars(n){return n>=850?3:n>=650?2:n>=400?1:0}
function MxStarTxt(){if(!@P.s||!@P.done)return"";let n=MxStars(@P.score);return"★".repeat(n)+"☆".repeat(3-n)+" "}
function MxSmx(d){return @nt.s2&&!@nt.quick?` −${MxSm(d)} points.`:""}
function MxSbx(){let m=@J.maxTile;return @nt.s2&&m>=4&&m<=64?`. +${m/2} points for making ${m===8?"an":"a"} ${m}.`:""}
function MxShelp(){document.querySelectorAll(".mx-s2").forEach(x=>x.hidden=!@nt.s2);return @nt.s2&&!@nt.quick?`Each move costs ${@nt.moveCost} points. Each new tile size earns half its value. A missed pin costs 50 to 150, less the closer it lands, and opens the next clue.`:""}
function MxSum(){let G=@P,f=x=>Math.round(x).toLocaleString("en-US"),pl=(n,a)=>`${n} ${a}${n===1?"":"s"}`;if(!G.s||!G.done)return"";
if(G.q){let k=G.pins.length;return G.won?(k>1?`1,000 − ${pl(k-1,"missed pin")} × 200 = ${f(G.score)}`:`Found on the first pin: ${f(G.score)}`):`Not found in five pins: up to 100 by your closest pin = ${f(G.score)}`}
let m=@J.moves.length,mc=@nt.moveCost,b=MxSb(@J.maxTile),ms=G.pins.filter(p=>p.d>@nt.landKm),lost=!G.won,c=ms.slice(0,lost?ms.length-1:ms.length).map(p=>MxSm(p.d)),h=@nt.hm!=null&&m>=@nt.hm?@nt.hc:0,sub=Math.max(0,Math.min(@nt.start,@nt.start-m*mc-c.reduce((a,x)=>a+x,0)+b)-h),t=["1,000"],k=1;
m&&t.push(`− ${pl(m,"move")} × ${mc}`);b&&t.push(`+ ${b} tile bonus`);c.length&&t.push(`− ${pl(c.length,"missed pin")} (${c.join(" + ")})`);h&&t.push(`− ${h} turtle hint`);
let s=t.join(" ")+` = ${f(sub)}`;if(lost){let a=Math.min(...G.pins.map(p=>p.d));k=Math.max(0,1-Math.sqrt(Math.max(0,a-@nt.landKm)/(@nt.lossScaleKm-@nt.landKm)));s+=`. Not found, so × ${Math.round(k*100)}% for your closest pin (${@km(a)}) = ${f(G.score)}`}
return Math.round(sub*k)===G.score?s:""}
function MxEnd(){if(!@P.s||!@P.done)return"";let n=MxStars(@P.score),s=MxSum();return`<p class="mx-grade"><span aria-hidden="true">${"★".repeat(n)}${"☆".repeat(3-n)}</span><span class="sr">${n} of 3 stars</span></p>${s?`<p class="mx-sum">${s}</p>`:""}`}
'''

CSS = '''/* mx-scoring: stars and the sum on the end card */
.mx-grade{margin:2px 0 0;font-size:30px;line-height:1;letter-spacing:3px;color:var(--accent)}
.mx-sum{margin:6px 0 10px;font-size:14px;line-height:1.4;color:var(--ink-2)}
/* /mx-scoring */
'''

HELP = '''      <li class="mx-s2" hidden>Scoring from No. 14: each new tile size, up to 64, also adds half its value (a 16 adds 8), and a miss costs 50 to 150 points instead of 150, less the closer it lands. Your result gets one to three stars.</li>
'''

CITY = dict(P="P", J="J", nt="nt", km="Sn")
COUNTRY = dict(P="C", J="W", nt="en", km="ve")


def core(names):
    s = CORE
    for k, v in names.items():
        s = s.replace("@" + k, v)
    return s


PAGES = {
    "index.html": [
        # the functions, on their own lines before the Quick mode block
        ("\n/* Quick mode (asked for by players)", "\n" + core(CITY) + "/* Quick mode (asked for by players)"),
        ("/* /mx-find */\n", "/* /mx-find */\n" + CSS),
        # a new round of No. 14 or later scores the new way
        ("P.h&&(nt.hm=P.hm)}function MxRg(){",
         "P.h&&(nt.hm=P.hm);!P.moves&&!(P.pins&&P.pins.length)&&!P.done&&P.s==null&&(P.s=j>=14?1:0);P.s&&(nt.s2=!0)}function MxRg(){"),
        # the score: tile bonus, misses by distance, 1,000 at most
        ("function Jt(t,e){return Math.max(0,nt.start-t*nt.moveCost-e*nt.missCost-(nt.hm!=null&&t>=nt.hm?nt.hc:0))}",
         "function Jt(t,e,m){return nt.s2?Math.max(0,Math.min(nt.start,nt.start-t*nt.moveCost-MxSmiss(e)+MxSb(m===void 0?J?J.maxTile:0:m))-(nt.hm!=null&&t>=nt.hm?nt.hc:0)):Math.max(0,nt.start-t*nt.moveCost-e*nt.missCost-(nt.hm!=null&&t>=nt.hm?nt.hc:0))}"),
        ("return(!Gc(t)||Jt(t.moves.length,n)<=0)&&(t.storm=!0)", "return(!Gc(t)||Jt(t.moves.length,n,t.maxTile)<=0)&&(t.storm=!0)"),
        # what a miss cost, and what a new tile earned
        ("`Right country! Now find the city: ${Sn(t)} ${d}.${f}`:`${Sn(t)} off. Head ${d}.${f}`),3800);xr(MxHm(t)+`${rc?\"Right country. \":\"\"}Missed by ${Sn(t)}. The ${at.thing} is to the ${d}.${f}`)",
         "`Right country! Now find the city: ${Sn(t)} ${d}.${MxSmx(t)}${f}`:`${Sn(t)} off. Head ${d}.${MxSmx(t)}${f}`),3800);xr(MxHm(t)+`${rc?\"Right country. \":\"\"}Missed by ${Sn(t)}. The ${at.thing} is to the ${d}.${MxSmx(t)}${f}`)"),
        ("xr(`New clue: ${i.label.toLowerCase()}`),MxToastClue(`New clue: ${i.label.toLowerCase()}`)",
         "xr(`New clue: ${i.label.toLowerCase()}${MxSbx()}`),MxToastClue(`New clue: ${i.label.toLowerCase()}${MxSbx()}`)"),
        # the cost line and the rules sheet
        ("b(\"#costNote\").textContent=nt.quick?", "b(\"#costNote\").textContent=MxShelp()||(nt.quick?"),
        ("${nt.missCost}${nt.r2?\" and opens the next clue\":\"\"}.`,document.querySelectorAll(\".mcost\")",
         "${nt.missCost}${nt.r2?\" and opens the next clue\":\"\"}.`),document.querySelectorAll(\".mcost\")"),
        ("<li>Each move costs <span class=\"mcost\">6</span> points, so drop a pin as soon as you think you know.</li>\n",
         "<li>Each move costs <span class=\"mcost\">6</span> points, so drop a pin as soon as you think you know.</li>\n" + HELP),
        # the end card and the copied result
        ("<pre class=\"share\">${V(wr())}</pre>", "${MxEnd()}<pre class=\"share\">${V(wr())}</pre>"),
        ("${P.score} points \\u00B7 ${En(J.moves.length,\"move\",\"moves\")}", "${MxStarTxt()}${P.score} points \\u00B7 ${En(J.moves.length,\"move\",\"moves\")}"),
        ("${P.won?`Found in ${P.pins.length}/5 pins`", "${MxStarTxt()}${P.won?`Found in ${P.pins.length}/5 pins`"),
        # localhost-only test hooks
        ("score:P.score,moves:J.moves}),move:za,", "score:P.score,moves:J.moves}),move:za,sc:{sm:MxSm,sb:MxSb,stars:MxStars,sum:MxSum,s:()=>P.s},"),
    ],
    "country.html": [
        ("\nvar Z=Y.colors,", "\n" + core(COUNTRY) + "var Z=Y.colors,"),
        ("/* /mx-find */\n", "/* /mx-find */\n" + CSS),
        ("&&(C.r=2);C.r>=2&&Object.assign(en,{r2:!0,moveCost:6})}",
         "&&(C.r=2,C.s=1);C.r>=2&&Object.assign(en,{r2:!0,moveCost:6});C.s&&(en.s2=!0)}"),
        ("function zn(n,t){return Math.max(0,en.start-n*en.moveCost-t*en.missCost)}",
         "function zn(n,t,m){return en.s2?Math.max(0,Math.min(en.start,en.start-n*en.moveCost-MxSmiss(t)+MxSb(m===void 0?W?W.maxTile:0:m))):Math.max(0,en.start-n*en.moveCost-t*en.missCost)}"),
        ("return(!Fl(n)||zn(n.moves.length,e)<=0)&&(n.storm=!0)", "return(!Fl(n)||zn(n.moves.length,e,n.maxTile)<=0)&&(n.storm=!0)"),
        ("Yn(MxHm(n)+`${ve(n)} off. Head ${d}.${f}`,f?3800:3400);f&&setTimeout(()=>MxToastFit(2650),1150);Gi(MxHm(n)+`Missed by ${ve(n)}. The ${an.thing} is to the ${d}.${f}`)",
         "Yn(MxHm(n)+`${ve(n)} off. Head ${d}.${MxSmx(n)}${f}`,f?3800:3400);f&&setTimeout(()=>MxToastFit(2650),1150);Gi(MxHm(n)+`Missed by ${ve(n)}. The ${an.thing} is to the ${d}.${MxSmx(n)}${f}`)"),
        ("Gi(`New clue: ${r.label.toLowerCase()}`),MxToastClue(`New clue: ${r.label.toLowerCase()}`)",
         "Gi(`New clue: ${r.label.toLowerCase()}${MxSbx()}`),MxToastClue(`New clue: ${r.label.toLowerCase()}${MxSbx()}`)"),
        ("function MxCost(){A(\"#costNote\").textContent=`Each move costs ${en.moveCost} points. Each missed pin costs ${en.missCost}${en.r2?\" and opens the next clue\":\"\"}.`;",
         "function MxCost(){A(\"#costNote\").textContent=MxShelp()||`Each move costs ${en.moveCost} points. Each missed pin costs ${en.missCost}${en.r2?\" and opens the next clue\":\"\"}.`;"),
        ("<li>Each move costs <span class=\"mcost\">6</span> points, so drop a pin as soon as you think you know.</li>\n",
         "<li>Each move costs <span class=\"mcost\">6</span> points, so drop a pin as soon as you think you know.</li>\n" + HELP),
        ("<pre class=\"share\">${z(Bi())}</pre>", "${MxEnd()}<pre class=\"share\">${z(Bi())}</pre>"),
        ("return`${an.title} No. ${X}, ${C.score} points", "return`${an.title} No. ${X}, ${MxStarTxt()}${C.score} points"),
        ("move:_a,dist:", "move:_a,sc:{sm:MxSm,sb:MxSb,stars:MxStars,sum:MxSum,s:()=>C.s},dist:"),
    ],
}


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


def patch(path, edits, resolve):
    s = open(path, encoding="utf-8").read()
    if resolve:
        s = take_ours(s)
    done, missing = 0, []
    for a, b in edits:
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
    print(f"{path}: {done} of {len(edits)} scoring edits applied ({len(edits) - done} were already there)")
    return 0


def main(args):
    resolve = "--take-ours" in args
    files = [a for a in args if not a.startswith("--")]
    pages = {f: PAGES[f.split("/")[-1]] for f in files} if files else PAGES
    return max(patch(f, e, resolve) for f, e in pages.items())


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
