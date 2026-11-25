#!/usr/bin/env python3
"""Fixes from the hands-on review of live 0.15.2, for the two mystery games.

- The rules shown match the round being played. A Mystery country round before No. 14 says
  "Today: 8 points a move; a miss costs 150 and opens no clue." under the pin button, and a note above
  the page's explainer says the round plays by the earlier rules (or the earlier scoring), which start
  changing with No. 14. Mystery city shows the same note for a round on the earlier scoring.
- Mystery country's languages clue no longer repeats its label ("Languages: Languages: ...").
- One name: Mystery country's share says "Mystery country No. 12", and the header says "No. 12".
  Share links are unchanged, so old ones keep working.
- "Next clue: make an 8" (was "make a 8") in both games; Mystery country's coach line uses the same words.
- Past countries: an archive like Past cities. "Past countries" next to Your streaks lists every earlier
  number; #past-N plays it in a separate save (dailycity:country:archive:v1) that never touches results,
  streaks or stats. Quick mode is not offered in the archive, as in Mystery city.

Run after the other patch scripts:
    python3 review/review-fixes-patch.py [--take-ours] [index.html] [country.html]
Each edit is skipped if it is already there; if an anchor is missing nothing is written for that page.
"""
import sys

NOTE = '    <p class="note" id="todayRules" hidden></p>\n'

CITY_FN = r'''/* mx-review: the rules shown match the round being played. Added by review/review-fixes-patch.py. */
function MxTodayRules(){let e=b("#todayRules");if(!e)return;let t=!nt.quick&&!nt.s2?`${MxArc?"This":"Today's"} round, No. ${j}, uses the earlier scoring: no tile bonus, and every missed pin costs ${nt.missCost}. The scoring described below starts with No. 14.`:"";e.textContent=t;e.hidden=!t}
'''

COUNTRY_FN = r'''/* mx-review: fixes from the review of 0.15.2 (rules shown for the round being played, Past countries). Added by review/review-fixes-patch.py. */
function MxTodayRules(){let e=A("#todayRules");if(!e)return;let r=`${MxArc?"This":"Today's"} round, No. ${X},`,t=en.quick?"":!en.r2?`${r} plays by the earlier rules: ${en.moveCost} points a move, and a missed pin costs ${en.missCost} and opens no clue. The rules described below start with No. 14.`:!en.s2?`${r} uses the earlier scoring: no tile bonus, and every missed pin costs ${en.missCost}. The scoring described below starts with No. 14.`:"";e.textContent=t;e.hidden=!t}
function MxArcUi(){if(MxArc){A("#arcBan").hidden=!1;document.body.classList.add("archive")}let go=()=>setTimeout(MxPastBtn,0);MxArcUi.d||(MxArcUi.d=1,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",go):go())}
function MxPastBtn(){let n=document.querySelector('nav[aria-label="Daily games"]');if(!n||A("#pastCountries"))return;let x=document.createElement("button");x.className="mx-link",x.type="button",x.id="pastCountries",x.textContent="Past countries",x.style.marginLeft="16px",x.onclick=MxPast;let a=n.nextSibling&&n.nextSibling.classList&&n.nextSibling.classList.contains("mx-link")?n.nextSibling:n;a.parentNode.insertBefore(x,a.nextSibling)}
function MxPast(){let m=A("#mxPast"),rd=k=>{try{return(JSON.parse(localStorage.getItem(k))||{}).results||{}}catch(e){return{}}},main=rd(an.saveKey),arc=rd("dailycity:country:archive:v1"),t=$a(),d=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],o=[];for(let n=t-1;n>=1;n--){let w=new Date(Date.UTC(Y.epoch.y,Y.epoch.m-1,Y.epoch.d+n-1)),r=main[n]||arc[n];o.push(`<li><a href="#past-${n}">No. ${n} · ${d[w.getUTCDay()]}</a><span>${r?(r.won?"✓ found, ":"played, ")+r.score+" points":"not played"}</span></li>`)}A("#mxPastList").innerHTML=o.join("")||"<li>No earlier countries yet.</li>";A("#closeMxPast").innerHTML||(A("#closeMxPast").innerHTML=Ln.close(20),A("#closeMxPast").onclick=()=>{m.hidden=!0},m.addEventListener("click",e=>{e.target===m&&(m.hidden=!0)}));m.hidden=!1;A("#closeMxPast").focus()}
'''

COUNTRY_HTML_BAN = ('  <p id="newDay" class="banner" hidden>',
                    '  <p id="arcBan" class="banner" hidden>You\'re playing an earlier country from the archive. It doesn\'t count toward your streak. <a href="country.html">Back to today\'s country</a></p>\n  <p id="newDay" class="banner" hidden>')

COUNTRY_MODAL = '''<div class="modal" id="mxPast" hidden>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mxPastT">
    <button class="tool x" id="closeMxPast" aria-label="Close"></button>
    <h2 id="mxPastT">Past countries</h2>
    <p class="note">Play any earlier country. These don't count toward your streak.</p>
    <ol class="mx-past" id="mxPastList"></ol>
  </div>
</div>
'''

COUNTRY_CSS = '''/* mx-review: the archive has no streaks or stats, they belong to the daily game */
.archive .stats,.archive .hist,.archive .freeze{display:none}
'''

PAGES = {
    "index.html": [
        ("\n/* mx-scoring: the new scoring", "\n" + CITY_FN + "/* mx-scoring: the new scoring"),
        ('  <footer class="about">\n    <!-- copy:start -->', '  <footer class="about">\n' + NOTE + '    <!-- copy:start -->'),
        ('b("#costNote").textContent=MxShelp()||(', 'MxTodayRules(),b("#costNote").textContent=MxShelp()||('),
        ("`Next clue: make a ${n.v}`", "`Next clue: make ${n.v===8?\"an\":\"a\"} ${n.v}`"),
    ],
    "country.html": [
        ("\n/* mx-country-quick: Quick mode", "\n" + COUNTRY_FN + "/* mx-country-quick: Quick mode"),
        ('  <footer class="about">\n    <!-- copy:start -->', '  <footer class="about">\n' + NOTE + '    <!-- copy:start -->'),
        COUNTRY_HTML_BAN,
        ('<div class="modal" id="helpModal" hidden>', COUNTRY_MODAL + '<div class="modal" id="helpModal" hidden>'),
        ("/* /mx-country-quick */\n", "/* /mx-country-quick */\n" + COUNTRY_CSS),
        # the rules shown for the round
        ("function MxCost(){", "function MxCost(){MxTodayRules();"),
        ("`Each move costs ${en.moveCost} points. Each missed pin costs ${en.missCost}${en.r2?\" and opens the next clue\":\"\"}.`",
         "(en.r2?`Each move costs ${en.moveCost} points. Each missed pin costs ${en.missCost} and opens the next clue.`:`${MxArc?\"This round\":\"Today\"}: ${en.moveCost} points a move; a miss costs ${en.missCost} and opens no clue.`)"),
        # the languages clue without its label
        ("case\"speak\":return`${e.length>1?\"Languages\":\"Language\"}: ${Yi(e.slice(0,4).map(z))}`;", "case\"speak\":return Yi(e.slice(0,4).map(z));"),
        # one name
        ("title:`${Y.name} Countries`", "title:\"Mystery country\""),
        ("label:n=>`Countries, No. ${n}`", "label:n=>`No. ${n}`"),
        # the city's wording for the next clue
        ("`Next clue: make a ${e.v}`", "`Next clue: make ${e.v===8?\"an\":\"a\"} ${e.v}`"),
        ("Your next one comes at ${e.v}.", "Next clue: make ${e.v===8?\"an\":\"a\"} ${e.v}."),
        # Past countries: #past-N plays an earlier number in its own save
        ("La&&(X=Number(La[1]));", "La&&(X=Number(La[1]));var MxArc=/^#past-(\\d+)$/.exec(location.hash);MxArc&&+MxArc[1]>=1&&+MxArc[1]<X?X=+MxArc[1]:MxArc=null;"),
        ("var Ka=an.saveKey,", "var Ka=MxArc?\"dailycity:country:archive:v1\":an.saveKey,"),
        ("if(!(La||$a()<=X))", "if(!(La||MxArc||$a()<=X))"),
        ("A(\"#num\").textContent=an.label(X),", "A(\"#num\").textContent=an.label(X)+(MxArc?\" \\u00b7 archive\":\"\"),MxArcUi(),"),
        ("A(\"#streakNote\").hidden=e<2,", "A(\"#streakNote\").hidden=e<2||!!MxArc,"),
        ("return`${an.title} No. ${X}, ${MxStarTxt()}", "return`${an.title} No. ${X}${MxArc?\" (archive)\":\"\"}, ${MxStarTxt()}"),
        ("X>=14&&C.q==null&&", "!MxArc&&X>=14&&C.q==null&&"),
        ("m.hidden=!(X>=14&&", "m.hidden=!(!MxArc&&X>=14&&"),
        ("function MxMode(q){if(C.moves||C.pins.length||C.done||X<14)return;", "function MxMode(q){if(C.moves||C.pins.length||C.done||X<14||MxArc)return;"),
        # from the play-through: an archive round doesn't show the welcome sheet again to someone who has seen it
        ("hn.seenHelp||(A(\"#helpModal\").hidden=!1);", "hn.seenHelp||MxArc&&(Da(an.saveKey)||{}).seenHelp||(A(\"#helpModal\").hidden=!1);"),
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
    print(f"{path}: {done} of {len(edits)} review fixes applied ({len(edits) - done} were already there)")
    return 0


def main(args):
    resolve = "--take-ours" in args
    files = [a for a in args if not a.startswith("--")]
    pages = {f: PAGES[f.split("/")[-1]] for f in files} if files else PAGES
    return max(patch(f, e, resolve) for f, e in pages.items())


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
