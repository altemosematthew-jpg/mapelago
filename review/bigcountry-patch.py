#!/usr/bin/env python3
"""Re-apply this branch's hooks to the game script lines of bigger-country.html and bigger.html.

The whole game script is one long line, so any other change to that line (a data fix, say) makes git
report a conflict on it. To resolve: keep the other branch's side of that one line, then run

    python3 review/bigcountry-patch.py   # puts back the hook, and checks this branch's other blocks are there

In bigger-country.html it changes one spot: the start of the game ("W.forEach(...)...H();") hands the round
to MxBC() when it is there, and plays the old way when it isn't. In bigger.html it adds one call after the
game starts, which hands the city pool to the practice mode (MxPractice). Everything else this branch adds to the page sits on its own
lines, between "bigcountry" markers, and merges cleanly. Safe to run twice. Stops without writing if an
anchor has changed.
"""
import sys, pathlib

path = pathlib.Path(__file__).resolve().parent.parent / "bigger-country.html"
s = path.read_text(encoding="utf-8")

OLD = 'W.forEach((a,n)=>a.onclick=()=>Ca(n));s("#shareBtn").onclick=Ra;window.addEventListener("hashchange",()=>location.reload());H();'
NEW = ('window.addEventListener("hashchange",()=>location.reload());/*bigcountry*/window.MxBC?MxBC({M,R,k,h,A,ok:v,score:O,save:()=>ma(A),'
       'unit:w.unit,title:w.title,path:w.path,site:d.site,brand:d.name,rounds:x.rounds,days:wa,tick:ha,toast:la,esc:E,icon:P,ranks:Ma})'
       ':(W.forEach((a,n)=>a.onclick=()=>Ca(n)),s("#shareBtn").onclick=Ra,H());/*/bigcountry*/')

if NEW in s:
    print("hook already there")
elif s.count(OLD) == 1:
    s = s.replace(OLD, NEW)
    print("hook added")
else:
    sys.exit("anchor not found: the end of the game script has changed; add the hook by hand (see review/bigcountry-merge-notes.md)")

# The names the hook passes must still mean the same things in the game script.
for need in ["function ma(a)", "var M=", "R=q(M,k)", "v=a=>X(M,R[a],h[a])", "O=()=>", "function wa()", "function ha()", "function la(a)", "var E=a=>", "function P(a,n=16)", "Ma=[[10,"]:
    if need not in s:
        sys.exit("the game script no longer has " + need + ": check the hook by hand before committing")
for block in ["/* bigcountry: the round bar", "/* bigcountry: the round, the true-scale reveal", 'id="bcReveal"', 'id="bcStrip"', "function extras()",
              "/* bigcountry-practice:", 'id="mxprGo"', 'id="mxpr"']:
    if block not in s:
        sys.exit("missing this branch's block: " + block)

# bigger.html: hand the pool to the practice mode
cpath = path.parent / "bigger.html"
c = cpath.read_text(encoding="utf-8")
COLD = 'J.forEach((n,a)=>n.onclick=()=>wn(a));c("#shareBtn").onclick=An;window.addEventListener("hashchange",()=>location.reload());O();'
CNEW = COLD + '/*bigcountry-practice*/window.MxPractice&&MxPractice({id:"bigger",pool:x,unit:v.unit,esc:$,icon:L});/*/bigcountry-practice*/'
if CNEW in c:
    print("bigger.html: hook already there")
elif c.count(COLD) == 1:
    c = c.replace(COLD, CNEW)
    print("bigger.html: hook added")
else:
    sys.exit("bigger.html: anchor not found; add the hook by hand (see review/bigcountry-merge-notes.md)")
for need in ["var x=[{name:", 'var v={key:"dailycity:bigger:v1"', "function L(n,a=16)", "/* bigcountry-practice:", 'id="mxprGo"', 'class="tools"']:
    if need not in c:
        sys.exit("bigger.html no longer has " + need + ": check by hand before committing")

path.write_text(s, encoding="utf-8")
cpath.write_text(c, encoding="utf-8")
print("bigger-country.html and bigger.html ok")
