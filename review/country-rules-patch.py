#!/usr/bin/env python3
"""Mystery country plays by Mystery city's rules (rules version 2), from No. 14.

Applies the change to country.html: the minified game script, plus the cost line, the rules
sheet and one style rule. It is safe to run twice:
a page that already has it is left alone. Every anchor must match exactly once, or nothing
is written and the script says which anchor is missing.

Why a script: the whole game is one very long line of country.html, so any other change to
that line conflicts with this one in git. To resolve such a conflict, take the other branch's
country.html (git checkout --ours country.html, when merging this branch into it) and run:

    python3 review/country-rules-patch.py country.html

What it does, for rounds of No. 14 or later that start on this version (older rounds and
rounds already started keep the rules they began with; the round stores r: 2):
- moves cost 6 points (was 8); a missed pin still costs 150 and also opens the next clue
- the board starts with two 2-tiles, so everyone gets exactly one clue at the start
- a round with no find scores like Mystery city's: the points you'd have had finding it on
  pin 3, times 1 - sqrt((km - 50) / 2450) for your closest pin
- the miss line measures to the nearest point of the country's border, not just the
  nearest corner of its outline
For every round:
- "Next clue: make a N" matches the highlighted slot, also after a missed pin opened a clue
  early (the locked slots show the tile that really opens them), as in Mystery city
- the "New clue" note never covers the clue it announces (moves to the top, as in the city)
- the cost line and the rules sheet show the costs of the round in play
"""
import sys

MARK = "/* mx-country-rules"

HELPERS = r'''</svg>`}
/* mx-country-rules: Mystery country plays by Mystery city's rules (rules version 2) from No. 14. Added by review/country-rules-patch.py; see review/country-merge-notes.md. */
function MxNew(f){let s=hn.games[X];X>=14&&(f||!s||!s.moves&&!(s.pins&&s.pins.length))&&(C.r=2);C.r>=2&&Object.assign(en,{r2:!0,moveCost:6})}
function MxCq(){return Math.min(Zn.length,dt(W.maxTile)+(en.r2?Ta():0))}
/* A missed pin opens a clue early, so a locked slot shows the tile that will really open it (it matches "Next clue: make a N"). */
function MxSlot(r,e){if(C.done||r<e)return Zn[r].v;let k=r-(e-dt(W.maxTile));return Zn[Math.max(0,Math.min(Zn.length-1,k))].v}
/* The "New clue" note, and the miss note that opens a free clue, never sit on top of the clue they announce: they move to the top of the screen, or are skipped if both would cover it. */
function MxToastFit(d){let n=A("#toast"),c=document.querySelector("#clues .clue.fresh");if(!c||!n.classList.contains("show"))return;let o=(a,q)=>a.bottom>q.top-6&&a.top<q.bottom+6,r=c.getBoundingClientRect();if(o(r,n.getBoundingClientRect())){n.classList.add("mxtop");if(o(r,n.getBoundingClientRect()))n.classList.remove("show")}clearTimeout(MxToastFit.t);MxToastFit.t=setTimeout(()=>n.classList.remove("mxtop"),d+400)}
function MxToastClue(t){A("#toast").classList.remove("mxtop");Yn(t);MxToastFit(1900)}
function MxMiss(n,t,q0){let q1=MxCq(),d=Ne[mt(t)],f=q1>q0?` Free clue: ${Zn[q1-1].label.toLowerCase()}.`:"";q1>q0&&Oa(q1-1);A("#toast").classList.remove("mxtop");Yn(MxHm(n)+`${ve(n)} off. Head ${d}.${f}`,f?3800:3400);f&&setTimeout(()=>MxToastFit(2650),1150);Gi(MxHm(n)+`Missed by ${ve(n)}. The ${an.thing} is to the ${d}.${f}`)}
function MxCost(){A("#costNote").textContent=`Each move costs ${en.moveCost} points. Each missed pin costs ${en.missCost}${en.r2?" and opens the next clue":""}.`;document.querySelectorAll(".mcost").forEach(x=>x.textContent=en.moveCost);let m=A("#missRule");m&&(m.textContent=en.r2?" and opens the next clue":"");let s=A("#storm"),a=en.r2&&MxCq()>=Zn.length,w=!C.done&&(W.storm||a);s.hidden=!w;w&&(s.textContent=W.storm?(zn(W.moves.length,Ta())<=0?"Out of points for moves. ":"No moves left. ")+(en.r2&&MxCq()<Zn.length?"Drop a pin. Each miss opens the next clue.":"Drop a pin."):"All six clues are open. More moves only cost points. Drop your pin.")}
function MxStuck(){let s=A("#storm");MxCost(),s.scrollIntoView({block:"nearest",behavior:wi?"auto":"smooth"}),wi||s.animate([{scale:1},{scale:1.04},{scale:1}],{duration:220})}
/* Distance to the nearest point of the country's border: every edge of the outline, not only its corners (long straight borders have few corners). */
function MxNear(p,g){let L=g.type==="Polygon"?[g.coordinates]:g.coordinates,k=Math.max(1e-6,Math.cos(p[1]*Math.PI/180)),w=x=>(x-p[0]+540)%360-180,best=1/0,bp=In;for(let poly of L)for(let ring of poly)for(let i=0;i<ring.length;i++){let a=ring[i],b=ring[(i+1)%ring.length],ax=w(a[0])*k,ay=a[1]-p[1],bx=w(b[0])*k,by=b[1]-p[1],dx=bx-ax,dy=by-ay,q2=dx*dx+dy*dy,s=q2>0&&Math.abs(dx)<90*k?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/q2)):0,q=[p[0]+(ax+s*dx)/k,p[1]+ay+s*dy],d=Ut(p,q);d<best&&(best=d,bp=q)}return[best,bp]}
var Z=Y.colors,'''

PATCHES = [
    # helper functions, on their own lines, before the game code
    ("</svg>`}var Z=Y.colors,", HELPERS),
    # a new round of No. 14 or later gets rules version 2 (before its board is built)
    ('C=hn.games[X]||{moves:"",pins:[],done:!1,won:!1,score:0},W=U0();',
     'C=hn.games[X]||{moves:"",pins:[],done:!1,won:!1,score:0},W=(MxNew(),U0());'),
    ('return n.ok?n.board:(C={moves:"",pins:[],done:!1,won:!1,score:0},Ya(gl))}',
     'return n.ok?n.board:(C={moves:"",pins:[],done:!1,won:!1,score:0},MxNew(1),Ya(gl))}'),
    # the board starts with two 2-tiles (same random numbers used as before)
    ("return Va(t),Va(t),t}function Pi(",
     "return Va(t),Va(t),en.r2&&(t.tiles.forEach(x=>x.v=2),t.maxTile=2),t}function Pi("),
    # the softer last-pin score
    ("score:Math.round(r*Math.max(0,1-a/en.lossScaleKm)),misses:t}",
     "score:en.r2?Math.round(zn(e.moves,t-1)*Math.max(0,1-Math.sqrt(Math.max(0,a-en.landKm)/(en.lossScaleKm-en.landKm)))):Math.round(r*Math.max(0,1-a/en.lossScaleKm)),misses:t}"),
    # nearest point of the border
    ("if(Xe(t,n))return{d:0,b:0};let e=1/0,a=In,",
     "if(Xe(t,n))return{d:0,b:0};if(en.r2){let q=MxNear(n,t.geometry);return{d:q[0],b:za(n,q[1])}}let e=1/0,a=In,"),
    # clue list, label and track
    ("let t=C.done?Zn.length:dt(W.maxTile),e=Zn[t];",
     "let t=C.done?Zn.length:MxCq(),e=t<Zn.length?Zn[dt(W.maxTile)]:void 0;"),
    ("`Next clue at ${e.v}`", "`Next clue: make a ${e.v}`"),
    ('a.innerHTML=Zn.map((r,i)=>`<li class="sw${i<t?" open":i===t?" upnext":""}${i===n?" fresh":""}" data-v="${r.v}">${r.v}</li>`).join("")',
     'a.innerHTML=Zn.map((r,i)=>{let v=MxSlot(i,t);return`<li class="sw${i<t?" open":i===t?" upnext":""}${i===n?" fresh":""}" data-v="${v}">${v}</li>`}).join("")'),
    # a move: count clues the new way, the note doesn't cover the clue, a swipe on a locked board points to the pin
    ("function _a(n){if(C.done||W.storm||Vn||!Z0.hidden||!V0.hidden)return;let t=dt(W.maxTile),e=Wa(W,n,Ta());",
     "function _a(n){if(C.done||W.storm||Vn||!Z0.hidden||!V0.hidden){W.storm&&!C.done&&!Vn&&Z0.hidden&&V0.hidden&&MxStuck();return}let t=MxCq(),e=Wa(W,n,Ta());"),
    ("W0.textContent=W.moves.length;let a=dt(W.maxTile);if(a>t){Oa(a-1);let r=Zn[a-1];Gi(`New clue: ${r.label.toLowerCase()}`),Yn(`New clue: ${r.label.toLowerCase()}`)}",
     "W0.textContent=W.moves.length,MxCost();let a=MxCq();if(a>t){Oa(a-1);let r=Zn[a-1];Gi(`New clue: ${r.label.toLowerCase()}`),MxToastClue(`New clue: ${r.label.toLowerCase()}`)}"),
    # a missed pin opens the next clue
    ("function Ri(){if(!An||C.done)return;let{d:n,b:t}=wl(An);",
     "function Ri(){if(!An||C.done)return;let{d:n,b:t}=wl(An),q0=MxCq();"),
    (":(Yn(MxHm(n)+`${ve(n)} off. Head ${Ne[mt(t)]}.`,3400),Gi(MxHm(n)+`Missed by ${ve(n)}. The ${an.thing} is to the ${Ne[mt(t)]}.`),setTimeout(Ia,1100))",
     ":(MxMiss(n,t,q0),setTimeout(Ia,1100))"),
    # the cost line, the rules sheet and the locked-board note follow the round's rules
    ('A("#costNote").hidden=C.done;let t=A("#pinBtn");', 'A("#costNote").hidden=C.done,MxCost();let t=A("#pinBtn");'),
    # shared result and result image count the clues opened
    ("${dt(W.maxTile)} of 6 clues\n", "${MxCq()} of 6 clues\n"),
    ("h=dt(W.maxTile);Zn.forEach(", "h=MxCq();Zn.forEach("),
    # localhost-only test hooks
    ("score:C.score,moves:W.moves}),move:_a,", "score:C.score,moves:W.moves,r:C.r||1,moveCost:en.moveCost,clues:MxCq()}),move:_a,dist:n=>wl(n),near:MxNear,"),
    # outside the script: the cost line, the rules sheet, the locked-board note and the note's top position
    ('<p class="note" id="costNote">Each move costs 8 points. Each missed pin costs 150.</p>',
     '<p class="note" id="costNote">Each move costs 6 points. Each missed pin costs 150 and opens the next clue.</p>'),
    ('<li>Each move costs 8 points, so drop a pin as soon as you think you know.</li>',
     '<li>Each move costs <span class="mcost">6</span> points, so drop a pin as soon as you think you know.</li>'),
    ("<li>Put a pin inside the country, or within 50 km of it, and you've found it. A miss costs 150 points and tells you how far off you are and which way to go. You have three pins.</li>",
     "<li>Put a pin inside the country, or within 50 km of it, and you've found it. A miss costs 150 points<span id=\"missRule\"> and opens the next clue</span>. It tells you how far off you are, measured to the nearest point of the country, which way to go, and whether you're getting warmer. You have three pins.</li>"),
    ('<p id="storm" class="banner" hidden>No moves left. Drop a pin.</p>',
     '<p id="storm" class="banner" role="status" hidden>No moves left. Drop a pin.</p>'),
    ('@media (prefers-reduced-motion:reduce){#toast{transition:none}}',
     '@media (prefers-reduced-motion:reduce){#toast{transition:none}}\n/* mx-country-rules: the "New clue" note moves to the top when it would cover the new clue */\n#toast.mxtop{top:calc(10px + env(safe-area-inset-top));bottom:auto}'),
]


def main(path):
    s = open(path, encoding="utf-8").read()
    if MARK in s:
        print(f"{path}: already has the Mystery country rules, nothing to do")
        return 0
    missing = [a for a, _ in PATCHES if s.count(a) != 1]
    if missing:
        for a in missing:
            print(f"anchor found {s.count(a)} times (need 1): {a[:120]}")
        print("Nothing written. The page changed under these anchors; update them in this script.")
        return 1
    for a, b in PATCHES:
        s = s.replace(a, b, 1)
    open(path, "w", encoding="utf-8").write(s)
    print(f"{path}: Mystery country rules applied ({len(PATCHES)} edits)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "country.html"))
