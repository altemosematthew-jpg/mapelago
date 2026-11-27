// Mapelago site helpers, loaded by every game page before the game's own script.
// 1. A damaged save never stops a game from starting.
// 2. Dialogs behave like dialogs: focus moves in and stays in, Escape closes only the top one
//    (through its own close button, so the game saves what it needs), and focus goes back after.
// 3. Streaks across all the games: freezes, a note when a streak is waiting, one stats panel, a save code.
(function () {
  "use strict";

  // ---------- 1. repair damaged saves (16.6) ----------
  // Only fills in a missing or broken "results" / "games" list with an empty one. Nothing is deleted.
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (!/^dailycity:/.test(key)) continue;
      var raw = localStorage.getItem(key);
      if (!raw || raw.charAt(0) !== "{") continue;
      var save;
      try { save = JSON.parse(raw); } catch (e) { continue; }
      if (!save || typeof save !== "object") continue;
      var fixed = false;
      // The city and country games need both lists; the other games need "results".
      var need = /^dailycity:(v2|country:v1)$/.test(key) ? ["results", "games"] : ["results"];
      ["results", "games"].forEach(function (f) {
        var bad = f in save ? save[f] === null || typeof save[f] !== "object" || Array.isArray(save[f]) : need.indexOf(f) >= 0;
        if (bad) {
          save[f] = {};
          fixed = true;
        }
      });
      if (fixed) localStorage.setItem(key, JSON.stringify(save));
    }
  } catch (e) { /* storage may be blocked; the game copes */ }

  // ---------- 2. dialogs (16.3, 17.7) ----------
  var open = []; // [{ modal, back }]
  function focusables(el) {
    return Array.prototype.filter.call(
      el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (e) { return !e.disabled && e.offsetParent !== null; }
    );
  }
  function opened(modal) {
    for (var i = 0; i < open.length; i++) if (open[i].modal === modal) return;
    open.push({ modal: modal, back: document.activeElement });
    setTimeout(function () {
      if (modal.hidden) return;
      var f = focusables(modal);
      var first = modal.querySelector("[data-focus]") || f.filter(function (e) { return !e.classList.contains("x"); })[0] || f[0];
      if (first) first.focus({ preventScroll: true });
    }, 40);
  }
  function closed(modal) {
    for (var i = open.length - 1; i >= 0; i--) {
      if (open[i].modal !== modal) continue;
      var back = open[i].back;
      open.splice(i, 1);
      var top = open[open.length - 1];
      if (top) { var f = focusables(top.modal); if (f[0] && !top.modal.contains(document.activeElement)) f[0].focus({ preventScroll: true }); }
      else if (back && document.contains(back) && back.focus && back !== document.body) back.focus({ preventScroll: true });
      return;
    }
  }
  function isModal(el) { return el && el.classList && el.classList.contains("modal"); }
  new MutationObserver(function (list) {
    list.forEach(function (r) {
      if (!isModal(r.target)) return;
      if (r.target.hidden) closed(r.target); else opened(r.target);
    });
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
  function scanOpen() { Array.prototype.forEach.call(document.querySelectorAll(".modal:not([hidden])"), opened); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scanOpen); else scanOpen();

  // Runs before the game's own key handler (this file loads first, and listens in the capture phase).
  window.addEventListener("keydown", function (e) {
    while (open.length && open[open.length - 1].modal.hidden) open.pop();
    var top = open[open.length - 1];
    if (!top) return;
    var m = top.modal;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopImmediatePropagation();
      var x = m.querySelector(".x") || m.querySelector('[id^="close"]');
      if (x) x.click(); else m.hidden = true;
      return;
    }
    if (e.key === "Tab") {
      var f = focusables(m);
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1], act = document.activeElement;
      if (!m.contains(act)) { e.preventDefault(); a.focus(); }
      else if (e.shiftKey && act === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && act === z) { e.preventDefault(); a.focus(); }
    }
  }, true);

  // ---------- 3. streaks across all the games (5.1, 5.2, 5.3, 5.4) ----------
  var GAMES = [
    // Mystery: one game with a City and a Country mode. Each mode keeps its own daily puzzle and save; the Country mode's
    // days count toward Mystery's one streak and stats.
    { id: "city", name: "Mystery", key: "dailycity:v2", url: "city.html", icon: "\u{1F3D9}\uFE0F", about: "Slide tiles for clues, then pin today's city, or switch to today's country." },
    { id: "country", parent: "city", name: "Mystery (Country)", key: "dailycity:country:v1", url: "country.html", icon: "\u{1F30D}", about: "Mystery's Country mode: the same, with a country to find." },
    { id: "daily", name: "Daily Voyage", key: "dailycity:dailyvoyage:v1", url: "daily.html", icon: "\u2693", about: "Four stops from the best games, one score out of 100." },
    // Bigger? (from No. 17) is Bigger city? and Bigger country? as one game: it saves where Bigger city? did, and Bigger
    // country?'s days count toward its streak and stats. The old pages still play Nos. 1 to 16.
    { id: "bigger", name: "Bigger?", key: "dailycity:bigger:v1", url: "bigger.html", pages: ["bigger-city.html"], icon: "\u{1F465}", about: "Ten pairs, cities and countries in turn: tap the bigger one." },
    { id: "bigcountry", parent: "bigger", name: "Bigger country?", key: "dailycity:bigcountry:v1", url: "bigger-country.html", icon: "\u{1F5FA}\uFE0F", about: "Ten pairs: tap the country with more land." },
    // Voyage retires on No. 17: its best question is a Daily Voyage stop, and its days count toward the Daily Voyage streak
    { id: "voyage", parent: "daily", name: "Voyage", key: "dailycity:voyage:v1", url: "voyage.html", icon: "\u26F5", about: "Ten islands of trivia. Sail on or drop anchor." },
    { id: "fathoms", name: "Fathoms", key: "dailycity:fathoms:v1", url: "fathoms.html", icon: "\u{1F30A}", about: "Name the least obvious right answer." },
    { id: "stamps", name: "Stamps", key: "dailycity:stamps:v1", url: "stamps.html", icon: "\u{1F4EE}", about: "Spin, answer, and fill a page of stamps." },
    { id: "crossings", name: "Crossings", key: "dailycity:crossings:v1", url: "crossings.html", icon: "\u{1F9ED}", about: "Name the countries between two others, border by border." }
  ];
  var FREEZE_EVERY = 7, FREEZE_MAX = 2;
  function today() {
    var d = new Date();
    return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 10, 14)) / 864e5) + 1;
  }
  // Worked out fresh from the days already saved, so nothing new is stored and old saves count as they are.
  // Every 7th day played earns a freeze (hold up to 2). A missed day while a streak is running spends one
  // instead of ending the streak. Today only counts as missed once it is over.
  function streak(results, now) {
    var days = Object.keys(results || {}).map(Number).filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; });
    var out = { cur: 0, best: 0, freezes: 0, frozen: [], played: days.length, days: days };
    if (!days.length) return out;
    var set = {}; days.forEach(function (d) { set[d] = 1; });
    var end = Math.max(now, days[days.length - 1]), count = 0;
    for (var d = days[0]; d <= end; d++) {
      if (set[d]) {
        out.cur++; count++;
        if (count % FREEZE_EVERY === 0) out.freezes = Math.min(FREEZE_MAX, out.freezes + 1);
      } else if (d < now) {
        if (out.cur > 0 && out.freezes > 0) { out.freezes--; out.frozen.push(d); } else out.cur = 0;
      }
      out.best = Math.max(out.best, out.cur);
    }
    return out;
  }
  function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function plural(n, a, b) { return n + " " + (n === 1 ? a : b); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // a game that became part of another (it has a parent) is not listed on its own: its days count for the parent
  function results(g) { var save = read(g.key); return (save && save.results) || {}; }
  function info() {
    var now = today();
    return GAMES.filter(function (g) { return !g.parent; }).map(function (g) {
      var res = results(g), kids = GAMES.filter(function (k) { return k.parent === g.id; });
      if (kids.length) { var all = {}; kids.forEach(function (k) { var r = results(k); Object.keys(r).forEach(function (d) { if (r[d]) all[d] = r[d]; }); }); Object.keys(res).forEach(function (d) { if (res[d]) all[d] = res[d]; }); res = all; }
      var s = streak(res, now);
      s.game = g; s.doneToday = !!res[now]; s.res = res;
      return s;
    });
  }
  // ---------- sourced country areas (in use from No. 17) ----------
  // Source for every figure: UN Statistics Division, Demographic Yearbook 2023, Table 3, surface area in km2
  // (see review/areas-sourced.md). Sudan, Kosovo and Taiwan are not in the source and keep their earlier figure.
  var AREA_FROM = 17, MXAREA = {};
  "AF=652864;AL=28748;DZ=2381741;AD=468;AO=1246700;AG=442;AR=2796427;AM=29743;AU=7692024;AT=83878;AZ=86600;BS=13940;BH=778;BD=148460;BB=431;BY=207600;BE=30528;BZ=22965;BJ=114763;BT=38394;BO=1098581;BA=51209;BW=577852;BR=8510417;BN=5765;BG=110372;BF=272969;BI=27834;CV=4033;KH=181035;CM=475650;CA=9984670;CF=622984;TD=1284000;CL=756102;CN=9600000;CO=1141748;KM=2235;CR=51100;HR=56594;CU=109884;CY=9251;CZ=78871;CI=322462;CD=2345410;DK=42947;DJ=23200;DM=750;DO=48671;EC=257215;EG=1002000;SV=21041;GQ=28051;ER=121144;EE=45399;SZ=17363;ET=1104300;FJ=18272;FI=336884;FR=551500;GA=267668;GM=11295;GE=69700;DE=357581;GH=238537;GR=131957;GD=345;GT=108889;GN=245836;GW=36125;GY=214969;HT=27750;HN=112492;HU=93025;IS=103000;IN=3287263;ID=1892410;IR=1630848;IQ=435052;IE=69825;IL=22072;IT=302068;JM=10991;JP=377930;JO=89318;KZ=2724910;KE=591958;KI=726;KW=17818;KG=199949;LA=236800;LV=64594;LB=10452;LS=30355;LR=111369;LY=1676198;LI=160;LT=65286;LU=2586;MG=587041;MW=117726;MY=330621;MV=300;ML=1240192;MT=315;MH=181;MR=1030700;MU=1979;MX=1964375;FM=702;MD=33847;MC=2;MN=1564116;ME=13888;MA=446550;MZ=799380;MM=676577;NA=825229;NR=21;NP=147181;NL=41543;NZ=268107;NI=130374;NE=1267000;NG=923768;KP=120538;MK=25713;NO=323772;OM=309980;PK=796096;PW=459;PS=6020;PA=75320;PG=462840;PY=406752;PE=1285216;PH=300000;PL=312679;PT=92225;QA=11637;CG=342000;RO=238398;RU=17098246;RW=26338;KN=261;LC=616;VC=389;WS=2842;SM=61;SA=2206714;SN=196712;RS=88444;SC=457;SL=72300;SG=734;SK=49035;SI=20273;SB=28896;SO=637657;ZA=1221037;KR=100444;SS=658841;ES=506009;LK=65610;SR=163820;SE=438574;CH=41291;SY=185180;ST=964;TJ=141400;TZ=947303;TH=513140;TL=14954;TG=56785;TO=747;TT=5127;TN=163610;TM=488100;TV=26;TR=783562;UG=241550;UA=603500;AE=71024;GB=244376;US=9833517;UY=173626;UZ=448969;VU=12189;VA=0.44;VE=929690;VN=331345;YE=527968;ZM=752612;ZW=390757".split(";").forEach(function (x) { var kv = x.split("="); MXAREA[kv[0]] = +kv[1]; });
  // where the source's definition differs from the other common one, a comparison that could flip is never asked
  var AREA_FLAG = { AR: 1, CN: 1, DK: 1, FR: 1, IN: 1, MA: 1, NO: 1, PK: 1, RS: 1, UA: 1, US: 1 };
  function puzzleDay() { var m = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && /#day-(\d+)/.exec(location.hash); return m ? +m[1] : today(); }
  // a game's country table passes through here: from No. 17 every country gets its sourced area
  // Three corrections (from No. 18; see review/facts-to-check.md): Botswana's official language is English (Setswana is
  // the national language); Canada and Denmark share a land border on Hans Island (2022); South Africa's highest
  // point is shown by its usual name, Mafadi, with the Sotho name the country pack uses.
  var FIX_FROM = 18, MAFADI = "Mafadi (Ntheledi)";
  function fixNames(o) { // the fact tables Voyage and Dead Reckoning carry beside the country table
    try { var z = o && o["South Africa"]; if (!z) return o; if (Array.isArray(z)) z.forEach(function (v, i) { if (typeof v === "string") z[i] = v.replace(/^Ntheledi/, MAFADI); }); else Object.keys(z).forEach(function (k) { if (z[k] === "Ntheledi") z[k] = MAFADI; }); } catch (e) {}
    return o;
  }
  if (puzzleDay() >= FIX_FROM) ["VXPACK", "DR_COUNTRIES"].forEach(function (name) { var val = fixNames(window[name]); try { Object.defineProperty(window, name, { configurable: true, enumerable: true, get: function () { return val; }, set: function (v) { val = fixNames(v); } }); } catch (e) {} });
  window.MXA = function (table) {
    window.MXA.names = window.MXA.names || {}; table.forEach(function (c) { if (c.name && c.cid != null) window.MXA.names[c.name.toLowerCase()] = c.cid; });
    if (puzzleDay() >= FIX_FROM) table.forEach(function (c) {
      if (c.cc === "BW" && c.langs) c.langs = ["English"];
      if (c.cc === "CA" && c.next && c.next.indexOf("DK") < 0) c.next = c.next.concat("DK");
      if (c.cc === "DK" && c.next && c.next.indexOf("CA") < 0) c.next = c.next.concat("CA");
    });
    if (puzzleDay() < AREA_FROM) return table;
    window.MXA.byCid = {};
    table.forEach(function (c) { window.MXA.byCid[c.cid] = c; var a = MXAREA[c.cc]; if (!a) return; if (AREA_FLAG[c.cc] && c.area) c.szr = [Math.min(a, c.area), Math.max(a, c.area)]; c.area = a; c.sourced = 1; });
    return table;
  };
  // true when two countries must not be compared: within 2% of each other, or one has two definitions and the answer could flip
  window.MXAclose = function (x, y) {
    var a = x.area || x.pop, b = y.area || y.pop, r = Math.max(a, b) / Math.min(a, b);
    if (r < 1.02) return true;
    var lo = function (c, v) { return c.szr ? c.szr[0] : v; }, hi = function (c, v) { return c.szr ? c.szr[1] : v; };
    return (x.szr || y.szr) ? !(hi(x, a) * 1.02 < lo(y, b) || hi(y, b) * 1.02 < lo(x, a)) : false;
  };
  window.MXAREA = MXAREA;

  // ---------- the weekly arc ----------
  // No. 1 was a Saturday. Monday is the gentlest day and Saturday the hardest; f scales a game's one difficulty dial
  // (above 1 is easier). A game that follows the arc sets window.MX_ARC and its header says the day's level in words.
  function weekLevel(n) { return [["Sun", "medium", 1], ["Mon", "gentlest", 1.3], ["Tue", "easy", 1.2], ["Wed", "fairly easy", 1.1], ["Thu", "medium", 1], ["Fri", "hard", 0.9], ["Sat", "hardest", 0.8]].map(function (w) { return { day: w[0], word: w[1], f: w[2] }; })[(6 + n - 1) % 7]; }
  function arcLabel() { var a = window.MX_ARC, n = document.getElementById("num"); if (a && n && n.textContent && n.textContent.indexOf(a.word) < 0 && /No\. \d+/.test(n.textContent)) n.textContent = n.textContent.replace(/(No\. \d+)/, "$1 \u00b7 " + a.day + " \u00b7 " + a.word); }

  // One streak for the whole site: a day counts when any game was finished that day (freezes work as they do per game).
  function siteStreak() {
    var all = info(), now = today(), days = {}, n = 0;
    all.forEach(function (s) { Object.keys(s.res).forEach(function (d) { if (+d > 0 && s.res[d]) days[d] = 1; }); if (s.doneToday) n++; });
    var st = streak(days, now); st.today = !!days[now]; st.doneToday = n; st.total = all.length; return st;
  }
  function untilNext() { var d = new Date(), m = Math.max(1, Math.ceil((new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) - d) / 60000)); return Math.floor(m / 60) + "h " + (m % 60) + "m"; }
  // the line every finish screen carries
  // every result card: this game's personal best and how today compares with yesterday (scores kept as each finish is seen,
  // and read from the game's own saves where they carry a score)
  function scoreBook(me) {
    var key = "mx:scores:" + me.id, book = {}; try { book = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch (e) {}
    var save = {}; try { save = JSON.parse(localStorage.getItem(me.key) || "{}") || {}; } catch (e) {}
    Object.keys(save.results || {}).forEach(function (d) { var r = save.results[d], v = r && (r.score != null ? r.score : r.total != null ? r.total : null); if (typeof v === "number" && book[d] == null) book[d] = v; });
    return { book: book, save: function () { try { localStorage.setItem(key, JSON.stringify(book)); } catch (e) {} } };
  }
  function bestText(me, shareEl) {
    var mine = ownResult(shareEl && shareEl.textContent); if (!mine || !me) return "";
    var sb = scoreBook(me); sb.book[mine.n] = mine.score; sb.save();
    var all = Object.keys(sb.book).map(function (d) { return sb.book[d]; }), best = Math.max.apply(null, all), y = sb.book[mine.n - 1];
    var u = UNIT[me.id] || function (n) { return Number(n).toLocaleString("en-US") + " points"; }, vs = y == null ? "" : mine.score > y ? " Beat yesterday's " + u(y) + "." : mine.score === y ? " Same as yesterday." : " Yesterday: " + u(y) + ".";
    return (mine.score >= best && all.length > 1 ? "A new personal best." : "Your best: " + u(best) + ".") + vs;
  }
  function dailyText() {
    var st = siteStreak();
    return (st.today ? "Played today: day " + st.cur + " of your Mapelago streak." : st.cur ? "Your Mapelago streak: " + st.cur + (st.cur === 1 ? " day." : " days.") : "Finish any game to start a streak.") + " Next puzzles in " + untilNext() + ".";
  }
  function siteText(sst) { return sst.today ? "Played today: " + sst.doneToday + " of " + sst.total + " games. Day " + sst.cur + " of your streak." : sst.cur ? "Your streak is " + sst.cur + (sst.cur === 1 ? " day" : " days") + ": finish any game today to keep it." : "Finish any game today to start your streak."; }
  function dailyLine() {
    // a game was just finished: the list of today's games is drawn again, so no card still says "You're here" or "last game left"
    var sec0 = document.querySelector(".mx-today"), app0 = document.querySelector(".app");
    if (sec0 && app0 && sec0.getAttribute("data-sig") !== info().map(function (x) { return x.doneToday ? 1 : 0; }).join("")) { sec0.parentNode.removeChild(sec0); today_games(app0); }
    var top = document.querySelector(".mx-site"); if (top) { var tx = siteText(siteStreak()); if (top.textContent !== tx) top.textContent = tx; }
    var done = document.getElementById("done"), end = document.getElementById("endModal"), box = null, after = null;
    if (done && !done.hidden) { box = done.querySelector(".panel") || done; after = box.querySelector(".row2"); }
    else if (end && !end.hidden) { box = document.getElementById("endBody"); after = box && box.querySelector(".also"); }
    if (!box) return;
    var bt = bestText(here(), document.getElementById("shareText") || document.querySelector("#endBody .share")), p = box.querySelector(".mx-daily"), t = dailyText() + (bt ? " " + bt : ""), tw = weekLevel(today() + 1); t += " Tomorrow: " + ({ Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" })[tw.day] + ", " + tw.word + ".";
    if (!p) { p = document.createElement("p"); p.className = "mx-daily"; if (after && after.parentNode === box) box.insertBefore(p, after.nextSibling); else box.appendChild(p); }
    if (p.textContent !== t) p.textContent = t;
  }
  window.MXS = { streak: streak, info: info, today: today, games: GAMES, siteStreak: siteStreak, untilNext: untilNext, weekLevel: weekLevel, puzzleDay: puzzleDay, shareCard: function () { return shareImageClick({ id: "daily" }); }, card: function (t, id) { return inkCard(t, id); }, inkOn: function () { return isInk(); } };

  var CSS = '.mx-risk{display:block;margin:0 0 10px;line-height:1.45;padding:8px 12px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r,12px);background:var(--tint,#dcedf5);color:var(--ink,#000);font-size:14px;font-weight:600}'
    + '.mx-risk a{color:inherit;font-weight:800}'
    + '.mx-link{background:none;border:0;padding:4px 0;font:inherit;font-weight:800;text-decoration:underline;text-underline-offset:3px;color:inherit;cursor:pointer;min-height:44px}'
    + '.mxm{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:12px;background:var(--scrim,rgba(0,0,0,.32))}.mxm[hidden]{display:none}'
    + '.mxs{position:relative;width:min(560px,100%);max-height:calc(100vh - 24px);overflow:auto;background:var(--paper,#fff);color:var(--ink,#000);border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r,12px);padding:18px 18px 22px}'
    + '.mxs h2{margin:0 44px 12px 0;font-size:22px}.mxs h3{margin:18px 0 6px;font-size:16px}.mxs p{margin:6px 0;font-size:14.5px;line-height:1.4}'
    + '.mxs .x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r-tool,10px);background:var(--paper,#fff);color:inherit;font-size:22px;cursor:pointer}'
    + '.mx-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;padding:8px 0;border-top:1.5px solid var(--rule,#c9e1ec)}'
    + '.mx-row b{font-size:15px}.mx-row .n{font-size:13.5px;color:var(--ink-2,#3d4a52);grid-column:1/-1}'
    + '.mx-cal{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}.mx-cal i{width:13px;height:13px;border:1.5px solid var(--ink,#000);border-radius:3px;font-style:normal;font-size:9px;line-height:10px;text-align:center}'
    + '.mx-cal i.p{background:var(--accent,#b4237d)}.mx-cal i.f{border-style:dashed}.mx-cal i.t{outline:2px solid var(--focus,#b4237d);outline-offset:1px}'
    + '.mxs textarea{width:100%;min-height:76px;box-sizing:border-box;font:12px ui-monospace,monospace;border:1.5px solid var(--line,#000);border-radius:8px;padding:6px}'
    + '.mxs .btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.mxs .btns button{min-height:44px;padding:0 14px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r-btn,12px);background:var(--paper,#fff);color:inherit;font:inherit;font-weight:800;cursor:pointer}'
    + '.mxs .btns .go{background:var(--accent,#b4237d);color:var(--on-accent,#fff)}'
    + '.mx-help{border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r,12px);background:var(--paper,#fff);color:var(--ink,#000);width:min(440px,calc(100vw - 24px));max-height:calc(100vh - 24px);box-sizing:border-box;padding:16px;overflow:auto}.mx-help::backdrop{background:rgba(0,0,0,.45)}.mx-help h2{margin:0 0 8px;font-size:21px}.mx-help p,.mx-help li{margin:0 0 8px;font-size:15px;line-height:1.4}.mx-help ul,.mx-help ol{margin:0 0 10px;padding-left:20px}.mx-help .act{width:100%;margin-top:4px}#mxHelpBtn{font-weight:800;font-size:20px}#done .row2>:nth-child(3):last-child{grid-column:1/-1}#doneTitle:focus{outline:none}@keyframes mxPop{0%{transform:scale(1)}40%{transform:scale(1.06)}100%{transform:scale(1)}}@keyframes mxShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}.mx-pop{animation:mxPop .35s ease-out}.mx-shake{animation:mxShake .4s ease-out}@keyframes mxHand{0%,100%{transform:translate(-50%,6px)}50%{transform:translate(-50%,-4px) scale(.92)}}.mx-hand{position:absolute;z-index:40;font-size:34px;line-height:1;pointer-events:none;transform:translate(-50%,0);animation:mxHand 1.1s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.mx-hand{animation:none}}svg.mx-emb{display:inline-block;width:.8em;height:.8em;vertical-align:-.05em;margin-left:.15em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}@media (max-width:420px){svg.mx-emb{display:none}}#storm.banner{padding:6px 10px;margin-bottom:8px;line-height:1.3}@keyframes mxIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}#done:not([hidden]),#shown:not([hidden]),#choice:not([hidden]),#quiz:not([hidden]),.mx-help[open]{animation:mxIn .25s ease-out}@media (prefers-reduced-motion:reduce){#done,#shown,#choice,#quiz,.mx-help{animation:none!important}}canvas.mx-mini{display:block;width:100%;height:72px;margin:6px 0;border-radius:10px}canvas.mx-mini[hidden]{display:none}.app:has(canvas.mx-mini:not([hidden])) .wheelbox.asked{display:none}.act[hidden],.linkbtn[hidden],.mx-img[hidden]{display:none!important}.mx-daily{margin:6px 0;font-size:13.5px;font-weight:700;line-height:1.3}#done .panel>.mx-daily,#endBody>.mx-daily{order:4}#done:has(.mx-daily) .panel>.next,#endBody:has(.mx-daily)>.next{display:none}.mx-site{font-weight:700}'
    + '@keyframes mxFirst{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 0 5px var(--accent,#b4237d)}}.mx-fresh [data-first]{animation:mxFirst 1.6s ease-in-out infinite;border-radius:var(--r-btn,12px)}@media (prefers-reduced-motion:reduce){.mx-fresh [data-first]{animation:none;box-shadow:0 0 0 4px var(--accent,#b4237d)}}'
    + '.mx-today{grid-column:1/-1;margin:36px 0 0}.mx-today h2{margin:0 0 10px;font-size:20px}'
    + '.mx-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}'
    + '.mx-card a{display:grid;grid-template-columns:auto minmax(0,1fr);gap:2px 10px;align-items:start;height:100%;box-sizing:border-box;padding:10px 12px;min-height:44px;border:var(--bw,2px) solid var(--line,#000);border-bottom-width:var(--lip,6px);border-radius:var(--r,12px);background:var(--paper,#fff);color:var(--ink,#000);text-decoration:none}'
    + '.mx-card .ic{grid-row:span 3;font-size:26px;line-height:1.1}.mx-card b{font-size:16px;line-height:1.2}.mx-card .ab{font-size:13px;line-height:1.3;color:var(--ink-2,#3d4a52)}'
    + '.mx-card .st{font-size:12.5px;font-weight:800;color:var(--accent-ink,#b4237d)}.mx-card.done a{background:var(--tint,#dcedf5)}.mx-card.here a{outline:3px solid var(--accent,#b4237d);outline-offset:-3px}'
    + '.mx-next{margin:10px 0 0;font-size:15px;font-weight:600}.mx-next a{font-weight:800;color:inherit}'
    + '.mx-passport{margin:18px 0 0}.mx-passport h3{margin:0 0 4px;font-size:17px}.mx-passport p{margin:0 0 8px;font-size:14px}.mx-passport ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.mx-passport li{display:grid;justify-items:center;gap:2px;padding:6px 2px;border:1.5px dashed var(--line,#000);border-radius:8px;font-size:12px}.mx-passport b{font-size:11px;letter-spacing:-1px;color:var(--accent-ink,#b4237d);word-break:break-all;text-align:center;line-height:1.1}'
    + '.mx-vs{margin:0 0 10px;padding:10px 12px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r,12px);background:var(--tint,#dcedf5);color:var(--ink,#000)}.mx-vs-cols{display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center}.mx-vs-cols span{display:block;font-size:13px;font-weight:600}.mx-vs-cols b{font-size:34px;font-weight:800;font-style:var(--num-style,normal)}.mx-vs p{margin:6px 0 0;font-weight:700;text-align:center}.mx-vs .mx-link{display:block;margin:0 auto}'
    + '.mx-ver{margin:14px 0 0;font-size:12px;color:var(--ink-2,#3d4a52)}'
    + '.mx-past{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:4px}.mx-past li{display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border:1.5px solid var(--rule,#c9e1ec);border-radius:8px}.mx-past a{font-weight:800;color:inherit}';

  // Addresses come with or without ".html" (mapelago.com/bigger and the previews' /bigger work too), and the home
  // page as "/", "/index" or "/index.html". Pages inside a folder (/games/, /about/) are not games.
  function topId(g) { return g && (g.parent || g.id); } // a mode of another game (Mystery's Country) counts as that game
  function pageKey(p) { p = String(p || "").replace(/^\.?\//, "").replace(/\.html$/, ""); return p === "index" ? "" : p; } // the home page ("" or index) is the hub, not a game
  function here() {
    var parts = location.pathname.split("/"), f = parts.pop();
    if (parts.filter(Boolean).length) return undefined;
    return GAMES.filter(function (g) { return pageKey(g.url) === pageKey(f) || (g.pages || []).some(function (u) { return pageKey(u) === pageKey(f); }); })[0];
  }

  // 5.2 a note on every game page when another game's streak is waiting for today
  function riskNote(app) {
    var me = here();
    var risk = info().filter(function (s) { return s.cur >= 3 && !s.doneToday && (!me || s.game.id !== topId(me)); });
    if (!risk.length) return;
    var el = document.createElement("p");
    el.className = "mx-risk"; el.setAttribute("role", "status");
    el.innerHTML = risk.map(function (s) {
      return s.freezes
        ? "Play <a href=\"" + s.game.url + "\">" + esc(s.game.name) + "</a> today to keep your " + s.cur + "-day streak without using a freeze."
        : "Your " + s.cur + "-day <a href=\"" + s.game.url + "\">" + esc(s.game.name) + "</a> streak ends at midnight.";
    }).join("<br>");
    var head = app.querySelector("header");
    if (head && head.parentNode === app) app.insertBefore(el, head.nextSibling); else app.insertBefore(el, app.firstChild);
  }

  // 5.3 one place for every game's streak, with the last 30 days
  function sheet() {
    var m = document.getElementById("mxStreaks");
    if (m) return m;
    m = document.createElement("div");
    m.className = "modal mxm"; m.id = "mxStreaks"; m.hidden = true;
    m.innerHTML = '<div class="mxs" role="dialog" aria-modal="true" aria-labelledby="mxT"><button class="x" id="closeMxs" aria-label="Close">×</button><h2 id="mxT">Your streaks</h2><div id="mxBody"></div>'
      + '<h3>Move your streaks to another device</h3><p>Copy your save code here, then paste it on the other device. Days you have already played there are kept.</p>'
      + '<div class="btns"><button class="go" id="mxCopy">Copy save code</button></div>'
      + '<p><label for="mxPaste">Paste a save code from another device:</label></p><textarea id="mxPaste" spellcheck="false" autocomplete="off"></textarea>'
      + '<div class="btns"><button id="mxLoad">Load it</button></div><p id="mxSay" role="status"></p></div>';
    document.body.appendChild(m);
    m.addEventListener("click", function (e) { if (e.target === m) m.hidden = true; });
    m.querySelector("#closeMxs").onclick = function () { m.hidden = true; };
    m.querySelector("#mxCopy").onclick = copyCode;
    m.querySelector("#mxLoad").onclick = loadCode;
    return m;
  }
  function openSheet() {
    var m = sheet(), now = today();
    m.querySelector("#mxBody").innerHTML = info().map(function (s) {
      var cal = "";
      for (var d = now - 29; d <= now; d++) {
        if (d < 1) continue;
        var p = !!s.res[d], f = s.frozen.indexOf(d) >= 0;
        cal += '<i class="' + (p ? "p" : f ? "f" : "") + (d === now ? " t" : "") + '" title="No. ' + d + (p ? ": played" : f ? ": a freeze covered it" : ": not played") + '">' + (f ? "❄" : "") + "</i>";
      }
      return '<div class="mx-row"><b><a href="' + s.game.url + '">' + esc(s.game.name) + "</a></b><span>" + (s.doneToday ? "Done today" : "Not played today") + "</span>"
        + '<span class="n">' + plural(s.played, "day", "days") + " played. Streak " + s.cur + ", best " + s.best + (s.freezes ? ". \u{1F9CA} " + plural(s.freezes, "freeze", "freezes") + " ready" : "") + (s.frozen.length ? ". Freezes have saved it " + plural(s.frozen.length, "time", "times") : "") + ".</span>"
        + '<span class="mx-cal" role="img" aria-label="Last 30 days: ' + Object.keys(s.res).filter(function (k) { return k > now - 30; }).length + ' played">' + cal + "</span></div>";
    }).join("") + "<p>Every 7 days you play a game earns a streak freeze for that game (hold up to 2). A freeze covers a day you miss, so one gap doesn't end your streak.</p>";
    m.querySelector("#mxSay").textContent = "";
    m.hidden = false;
  }

  // 5.4 save code: every Mapelago save on this device, compressed when the browser can
  function b64(bytes) { var s = ""; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function unb64(t) { t = t.replace(/-/g, "+").replace(/_/g, "/"); var s = atob(t), b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; }
  async function pack(text) {
    var bytes = new TextEncoder().encode(text);
    if (window.CompressionStream) {
      var z = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer());
      return "MAPELAGO-Z" + b64(z);
    }
    return "MAPELAGO-J" + b64(bytes);
  }
  async function unpack(code) {
    var m = /MAPELAGO-([ZJ])([A-Za-z0-9_-]+)/.exec(code.replace(/\s+/g, ""));
    if (!m) throw new Error("bad");
    var bytes = unb64(m[2]);
    if (m[1] === "Z") bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function copyCode() {
    var all = {};
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^dailycity:/.test(k)) all[k] = localStorage.getItem(k); }
    var code = await pack(JSON.stringify(all)), say = document.getElementById("mxSay");
    try { await navigator.clipboard.writeText(code); say.textContent = "Save code copied. Paste it on your other device."; }
    catch (e) { var t = document.getElementById("mxPaste"); t.value = code; t.select(); say.textContent = "Select the code above and copy it."; }
  }
  // Merge, never overwrite: days already played on this device stay as they are.
  function merge(mine, theirs) {
    if (!mine || typeof mine !== "object") return theirs;
    if (!theirs || typeof theirs !== "object") return mine;
    ["results", "games"].forEach(function (f) {
      if (theirs[f] && typeof theirs[f] === "object") {
        mine[f] = mine[f] && typeof mine[f] === "object" ? mine[f] : {};
        Object.keys(theirs[f]).forEach(function (d) { if (!(d in mine[f])) mine[f][d] = theirs[f][d]; });
      }
    });
    Object.keys(theirs).forEach(function (k) { if (!(k in mine)) mine[k] = theirs[k]; });
    return mine;
  }
  async function loadCode() {
    var say = document.getElementById("mxSay"), data;
    try { data = await unpack(document.getElementById("mxPaste").value); } catch (e) { say.textContent = "That doesn't look like a Mapelago save code. Copy it again and paste the whole thing."; return; }
    var n = 0;
    Object.keys(data).forEach(function (k) {
      if (!/^dailycity:/.test(k) || typeof data[k] !== "string") return;
      var mineRaw = localStorage.getItem(k), theirs = data[k], out = theirs;
      if (mineRaw !== null) {
        var a = null, b = null;
        try { a = JSON.parse(mineRaw); b = JSON.parse(theirs); } catch (e) { a = null; }
        out = a && b && typeof a === "object" ? JSON.stringify(merge(a, b)) : mineRaw;
      }
      localStorage.setItem(k, out); n++;
    });
    say.textContent = "Loaded " + plural(n, "save", "saves") + ". Reloading…";
    setTimeout(function () { location.reload(); }, 900);
  }


  // 18.6 a share image for the games that had none, drawn from their own share text
  var TURTLE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200"><g fill="#9fc98b" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"><path d="M45.5 24h9v12h-9z"/><path d="M50 8c6 0 9.5 5 9.5 10.5S56 28 50 28s-9.5-4-9.5-9.5S44 8 50 8z"/><path d="M32 41C21 30 9 30 8.5 37.5c-.4 5.6 9 10 23.5 12z"/><path d="M68 41c11-11 23-11 23.5-3.5.4 5.6-9 10-23.5 12z"/><path d="M35 73c-9 4-16 11-12 15 4.5 3.8 12-3 17-10z"/><path d="M65 73c9 4 16 11 12 15-4.5 3.8-12-3-17-10z"/><path d="M46.5 80 50 91l3.5-11z"/></g><circle cx="46" cy="16.5" r="1.8" fill="#000000"/><circle cx="54" cy="16.5" r="1.8" fill="#000000"/><rect x="29" y="34" width="42" height="43" rx="15" fill="#ffffff" stroke="#000000" stroke-width="2.4"/><rect x="34.2" y="39.2" width="10.8" height="10.8" fill="#ffffff" stroke="#000000" stroke-width="1.4"/><rect x="45" y="39.2" width="10.8" height="10.8" fill="#dcedf5" stroke="#000000" stroke-width="1.4"/><rect x="55.800000000000004" y="39.2" width="10.8" height="10.8" fill="#a9d3e8" stroke="#000000" stroke-width="1.4"/><rect x="34.2" y="50" width="10.8" height="10.8" fill="#9fc98b" stroke="#000000" stroke-width="1.4"/><rect x="45" y="50" width="10.8" height="10.8" fill="#b4237d" stroke="#000000" stroke-width="1.4"/><path d="M50.4 58.9c-.7-1.4-3-3.3-3-5.2a3 3 0 0 1 6 0c0 1.9-2.3 3.8-3 5.2z" fill="#ffffff"/><circle cx="50.4" cy="53.8" r="1" fill="#b4237d"/><rect x="55.800000000000004" y="50" width="10.8" height="10.8" fill="#f3d98a" stroke="#000000" stroke-width="1.4"/><rect x="34.2" y="60.800000000000004" width="10.8" height="10.8" fill="#a9d3e8" stroke="#000000" stroke-width="1.4"/><rect x="45" y="60.800000000000004" width="10.8" height="10.8" fill="#dcedf5" stroke="#000000" stroke-width="1.4"/><rect x="55.800000000000004" y="60.800000000000004" width="10.8" height="10.8" fill="#ffffff" stroke="#000000" stroke-width="1.4"/></svg>';
  // Ink & Lantern share card: a dark episode cover with the game's panel and a rust score stamp, the same for everyone
  function inkBase() { var l = document.querySelector('link[href*="ink.css"]'); return l ? l.getAttribute("href").replace(/ink\.css.*$/, "") : ""; }
  function inkCard(text, id) {
    var lines = text.split("\n"), W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d"), rnd = inkRand(1126);
    var head = lines[0].split(" \u{1F422} "), title = head[0].replace(/^Mapelago /, ""), score = head[1] || "";
    var no = (title.match(/No\. (\d+)/) || [0, ""])[1], game = title.replace(/ No\. \d+.*$/, "");
    var last = lines[lines.length - 1] || "", ask = last.replace(/\s*\S+$/, ""), url = (last.match(/\S+$/) || [""])[0].replace(/#.*$/, "");
    var wob = function (pts, w, col) { x.beginPath(); x.lineWidth = w; x.strokeStyle = col; x.lineCap = "round"; pts.forEach(function (p, i) { var px = p[0] + (rnd() - .5) * 5, py = p[1] + (rnd() - .5) * 5; if (i) x.quadraticCurveTo((px + p[0]) / 2 + (rnd() - .5) * 6, (py + p[1]) / 2 + (rnd() - .5) * 6, px, py); else x.moveTo(px, py); }); x.stroke(); };
    var draw = function (art) {
      x.fillStyle = "#101316"; x.fillRect(0, 0, W, H);
      var g = x.createRadialGradient(W * .94, H * .02, 10, W * .94, H * .02, W * .9); g.addColorStop(0, "rgba(255,196,120,.34)"); g.addColorStop(.4, "rgba(255,170,90,.1)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
      // the panel's border, inked by hand: each side overshoots the corner
      wob([[30, 58], [W - 40, 50]], 7, "#EFE6CF"); wob([[W - 52, 34], [W - 58, H - 40]], 8, "#EFE6CF"); wob([[W - 30, H - 58], [36, H - 52]], 8, "#EFE6CF"); wob([[54, H - 32], [60, 36]], 7, "#EFE6CF");
      // ink blots in the corners
      [[86, 1270, 22], [1010, 120, 14], [990, 1250, 9]].forEach(function (b) { x.fillStyle = "rgba(0,0,0,.75)"; x.beginPath(); for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2, r = b[2] * (.7 + rnd() * .6); x[i ? "lineTo" : "moveTo"](b[0] + Math.cos(a) * r, b[1] + Math.sin(a) * r); } x.fill(); });
      x.textBaseline = "alphabetic";
      x.fillStyle = "#F0B070"; x.font = "56px 'Patrick Hand SC', cursive"; x.fillText("MAPELAGO", 110, 170);
      var ep = no ? "EPISODE " + no : "EPISODE"; x.font = "150px Anton, Impact, sans-serif"; var cx = 110;
      Array.from(ep).forEach(function (ch) { x.save(); x.translate(cx, 320); x.rotate((rnd() - .5) * .07); x.fillStyle = "#000"; x.fillText(ch, 6, 6); x.fillStyle = "#F3EAD3"; x.fillText(ch, 0, 0); x.restore(); cx += x.measureText(ch).width + 2; });
      x.fillStyle = "#EFE6CF"; x.font = "78px Anton, Impact, sans-serif"; x.fillText(game, 112, 420);
      if (art) { x.save(); x.translate(110, 470); x.rotate(-.012); x.fillStyle = "#000"; x.fillRect(14, 14, 860, 602); x.drawImage(art, 0, 0, 860, 602); x.restore(); }
      // the score stamp: a rust ring, slightly out of round, set at an angle
      var sc = score.replace(/ points$/, "").replace(/ of 100$/, ""), sub = /points$/.test(score) ? "POINTS" : / of 100$/.test(score) ? "OF 100" : "";
      x.save(); x.translate(800, 1000); x.rotate(-.2);
      x.fillStyle = "#A8442E"; x.strokeStyle = "#000"; x.lineWidth = 8; x.beginPath();
      for (var i = 0; i <= 24; i++) { var a = i / 24 * Math.PI * 2, r = 165 * (1 + (rnd() - .5) * .06); x[i ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r * .92); } x.closePath(); x.fill(); x.stroke();
      x.strokeStyle = "#F6EEDC"; x.lineWidth = 4; x.beginPath(); for (i = 0; i <= 24; i++) { a = i / 24 * Math.PI * 2; r = 138 * (1 + (rnd() - .5) * .05); x[i ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r * .92); } x.stroke();
      x.fillStyle = "#F6EEDC"; x.textAlign = "center"; x.font = (sc.length > 6 ? 70 : sc.length > 4 ? 92 : 120) + "px Anton, Impact, sans-serif"; x.fillText(sc, 0, sub ? 28 : 40);
      if (sub) { x.font = "40px 'Patrick Hand SC', cursive"; x.fillText(sub, 0, 82); }
      x.restore(); x.textAlign = "left";
      // the caption box: cream, inked border, hand lettering
      x.fillStyle = "#000"; x.fillRect(118, 1150, 640, 110); x.fillStyle = "#EFE6CF"; x.fillRect(110, 1142, 640, 110);
      wob([[104, 1144], [756, 1140]], 4, "#14110d"); wob([[752, 1136], [754, 1258]], 4, "#14110d"); wob([[758, 1252], [106, 1256]], 4, "#14110d"); wob([[110, 1260], [108, 1136]], 4, "#14110d");
      x.fillStyle = "#14110d"; x.font = "44px 'Patrick Hand SC', cursive"; x.fillText((ask || "To be continued...").slice(0, 30), 132, 1192);
      x.fillStyle = "#7a2d1c"; x.font = "38px 'Patrick Hand SC', cursive"; x.fillText(url || "mapelago.com", 132, 1236);
      return c;
    };
    var fonts = document.fonts && document.fonts.load ? Promise.all(["150px Anton", "40px 'Patrick Hand SC'"].map(function (f) { return document.fonts.load(f); })).catch(function () {}) : Promise.resolve();
    return fonts.then(function () {
      return new Promise(function (done) {
        var finish = function (img) { done(draw(img)); };
        fetch(inkBase() + "ink/art/" + (id || "home") + ".svg").then(function (r) { return r.text(); }).then(function (svg) {
          var img = new Image(); img.onload = function () { finish(img); }; img.onerror = function () { finish(null); };
          img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
        }).catch(function () { finish(null); });
      });
    });
  }
  function shareImage(text, me) {
    if (isInk()) return inkCard(text, me && me.id);
    var lines = text.split("\n"), W = 1080, H = 1350, c = document.createElement("canvas");
    c.width = W; c.height = H;
    var x = c.getContext("2d"), font = "Overpass, 'Helvetica Neue', Arial, sans-serif";
    x.fillStyle = "#e6f1f7"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#fff"; x.fillRect(48, 48, W - 96, H - 96); x.lineWidth = 6; x.strokeStyle = "#000"; x.strokeRect(48, 48, W - 96, H - 96);
    x.fillStyle = "#dcedf5"; x.beginPath(); x.moveTo(51, H - 260); x.quadraticCurveTo(W / 2, H - 330, W - 51, H - 260); x.lineTo(W - 51, H - 51); x.lineTo(51, H - 51); x.fill();
    var head = lines[0].split(" \u{1F422} "), title = head[0].replace(/^Mapelago /, ""), score = head[1] || "";
    x.fillStyle = "#000"; x.font = "italic 800 84px " + font; x.fillText(title.replace(/ No\. \d+$/, ""), 300, 190);
    x.font = "600 44px " + font; x.fillStyle = "#3d4a52"; x.fillText("Mapelago · " + (title.match(/No\. \d+$/) || [""])[0], 300, 255);
    x.fillStyle = "#000"; x.font = "italic 800 " + (score.length > 10 ? 120 : 170) + "px " + font; x.fillText(score.replace(/ points$/, ""), 110, 520);
    if (/points$/.test(score)) { x.font = "600 46px " + font; x.fillStyle = "#3d4a52"; x.fillText("points", 116, 590); }
    // marks as shapes, so they read the same on every phone
    var marks = Array.from(lines[1] || "").filter(function (ch) { return /\S/.test(ch) && ch !== "️"; }), size = Math.min(110, Math.floor((W - 220) / Math.max(1, marks.length)) - 12);
    // a game can draw its own picture in place of the marks (Ballast: the outline of the stack)
    var art = false; try { art = !!(window.MX_SHARE_ART && window.MX_SHARE_ART(x, { x: 110, y: 640, w: W - 220, h: 380 })); } catch (e) { art = false; }
    if (art) marks = [];
    marks.forEach(function (m, i) {
      var px = 110 + i * (size + 12), py = 680;
      x.lineWidth = 5; x.strokeStyle = "#000"; x.setLineDash([]);
      var fill = { "✅": "#b4237d", "\u{1F7E6}": "#2c7bb6", "\u{1F7E8}": "#f3d98a", "⬜": "#ffffff", "⚓": "#a9d3e8", "\u{1F4A1}": "#f3d98a", "\u{1F97E}": "#b4237d", "\u{1F9ED}": "#f3d98a", "\u{1F30A}": "#a9d3e8", "\u{1F419}": "#2c7bb6", "\u{1F41F}": "#f3d98a", "\u{1F4CD}": "#b4237d", "\u26F5": "#dcedf5", "\u{1F4E6}": "#c08a50" }[m];
      if (m === "❌") { x.setLineDash([12, 8]); x.strokeRect(px, py, size, size); x.setLineDash([]); x.beginPath(); x.moveTo(px + size * .28, py + size * .28); x.lineTo(px + size * .72, py + size * .72); x.moveTo(px + size * .72, py + size * .28); x.lineTo(px + size * .28, py + size * .72); x.stroke(); return; }
      x.fillStyle = fill || MXFILL[m] || "#ffffff"; x.fillRect(px, py, size, size); x.strokeRect(px, py, size, size); // MXFILL: Logbook's heat marks
      if (m === "✅") { x.strokeStyle = "#fff"; x.lineWidth = 8; x.beginPath(); x.moveTo(px + size * .25, py + size * .52); x.lineTo(px + size * .43, py + size * .7); x.lineTo(px + size * .76, py + size * .3); x.stroke(); }
      if (m === "⚓") { x.fillStyle = "#000"; x.font = "800 " + Math.round(size * .6) + "px " + font; x.fillText("⚓", px + size * .2, py + size * .72); }
    });
    var last = lines[lines.length - 1] || "", ask = last.replace(/\s*\S+$/, ""), url = (last.match(/\S+$/) || [""])[0].replace(/#.*$/, "");
    x.fillStyle = "#000"; x.font = "800 56px " + font; x.fillText(ask, 110, H - 180);
    x.fillStyle = "#b4237d"; x.font = "800 46px " + font; x.fillText(url, 110, H - 110);
    return new Promise(function (done) {
      var img = new Image();
      img.onload = function () { x.drawImage(img, 80, 80, 200, 200); done(c); };
      img.onerror = function () { done(c); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(TURTLE);
    });
  }
  async function shareImageClick(me) {
    var t = document.getElementById("shareText"); if (!t) return;
    var c = await shareImage(t.textContent, me), blob = await new Promise(function (r) { c.toBlob(r, "image/png"); });
    try {
      var f = new File([blob], "mapelago-" + me.id + ".png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: t.textContent }); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    var m = document.getElementById("mxImg");
    if (!m) {
      m = document.createElement("div"); m.className = "modal mxm"; m.id = "mxImg"; m.hidden = true;
      m.innerHTML = '<div class="mxs" role="dialog" aria-modal="true" aria-labelledby="mxImgT"><button class="x" id="closeMxImg" aria-label="Close">×</button><h2 id="mxImgT">Your result card</h2><p>Press and hold the image to save it, or download it, then post it.</p><img id="mxImgPic" alt="Your result card" style="width:100%;border:2px solid #000;border-radius:8px"><div class="btns"><a class="go" id="mxImgDl" download="mapelago.png" style="display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:2px solid #000;border-radius:12px;text-decoration:none;font-weight:800">Download</a></div></div>';
      document.body.appendChild(m);
      m.querySelector("#closeMxImg").onclick = function () { m.hidden = true; };
      m.addEventListener("click", function (e) { if (e.target === m) m.hidden = true; });
    }
    var url = c.toDataURL("image/png");
    m.querySelector("#mxImgPic").src = url; m.querySelector("#mxImgDl").href = url; m.querySelector("#mxImgDl").download = "mapelago-" + me.id + ".png";
    m.hidden = false;
  }
  function addImageButton() {
    var me = here(), btn = document.getElementById("shareBtn");
    if (!me || !btn || document.getElementById("imgBtn") || me.id === "city" || me.id === "country") return; // those two make their own
    var b = document.createElement("button");
    b.className = btn.className + " mx-img"; b.type = "button"; b.textContent = "Share image";
    b.onclick = function () { shareImageClick(me); };
    btn.parentNode.insertBefore(b, btn.nextSibling);
  }

  // 18.7 one message for everything you played today
  function todayText() {
    var t = today(), parts = [];
    info().forEach(function (s) {
      var r = s.res[t]; if (!r) return;
      if (s.game.id === "history") { parts.push(s.game.icon + " " + (r.score != null ? r.score : "✓")); return; } // Logbook
      var id = s.game.id, v =
        id === "city" || id === "country" ? (r.q ? (r.won ? r.pins + "/5 quick" : "X/5 quick") : r.score != null ? r.score : "✓") :
        id === "bigger" || id === "bigcountry" ? (r.score != null ? r.score + "/10" : "✓") :
        id === "daily" ? (r.score != null ? r.score + "/100" : "✓") :
        id === "fathoms" ? (r.total != null ? Number(r.total).toLocaleString("en-US") : "✓") :
        id === "stamps" ? (r.got != null ? r.got + "/6" : "✓") :
        id === "crossings" ? (r.score != null ? r.score : "✓") : id === "reckoning" ? (r.total != null ? r.total : "✓") :
        id === "ballast" ? (r.score != null ? Number(r.score).toLocaleString("en-US") : "✓") : "✓";
      parts.push(s.game.icon + " " + v);
    });
    return { n: parts.length, text: "Mapelago today, No. " + t + " \u{1F422}\n" + parts.join(" · ") + "\nmapelago.com/games/" };
  }


  // 13.4 a real celebration for a perfect game; 15.5 the Stamps passport book
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function perfect(me, text) {
    var line = (text.split("\n")[0] || "") + " " + (text.split("\n")[1] || "");
    if (me.id === "history") return /\b800 points\b/.test(line); // Logbook
    if (me.id === "voyage") return /✅{10}/.test(text.replace(/\s/g, ""));
    if (me.id === "bigger" || me.id === "bigcountry") return /\b10\/10\b/.test(line);
    if (me.id === "stamps") return /\b6 of 6\b/.test(line);
    if (me.id === "fathoms") return /7,000 of 7,000/.test(line);
    if (me.id === "crossings") return /\u{1F422} 1,?000 points/u.test(line);
    if (me.id === "reckoning") return /1,000 of 1,000/.test(line);
    return false;
  }
  function confetti(box) {
    if (reduce || !box.animate) return;
    var cs = getComputedStyle(document.documentElement), cols = ["--accent", "--t8", "--t16", "--t32", "--t4"].map(function (v) { return cs.getPropertyValue(v).trim() || "#b4237d"; });
    var layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:fixed;left:0;right:0;top:0;height:0;pointer-events:none;z-index:80";
    document.body.appendChild(layer);
    for (var i = 0; i < 30; i++) {
      var c = document.createElement("i");
      c.style.cssText = "position:absolute;top:-12px;width:10px;height:10px;border-radius:2px;left:" + (4 + (i * 37) % 92) + "%;background:" + cols[i % cols.length];
      layer.appendChild(c);
      c.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: "translate(" + ((i % 7) - 3) * 16 + "px," + (420 + (i % 5) * 60) + "px) rotate(" + (i % 2 ? 1 : -1) * (220 + i * 9) + "deg)", opacity: 0 }],
        { duration: 1200 + (i % 6) * 120, delay: (i % 9) * 40, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" });
    }
    setTimeout(function () { layer.remove(); }, 2600);
  }
  function passport(done) {
    if (document.getElementById("mxPassport")) return;
    var save = read("dailycity:stamps:v1"), res = (save && save.results) || {}, t = today(), rows = "";
    for (var d = Math.max(1, t - 13); d <= t; d++) {
      var r = res[d], got = r && r.got != null ? r.got : null;
      rows += '<li title="No. ' + d + (got == null ? ": not played" : ": " + got + " of 6") + '"><span>' + d + "</span><b>" + (got == null ? "·" : "■".repeat(got) + "□".repeat(6 - got)) + "</b></li>";
    }
    var sec = document.createElement("section");
    sec.id = "mxPassport"; sec.className = "mx-passport";
    sec.innerHTML = "<h3>Your passport</h3><p>The last two weeks of pages. Each square is a stamp.</p><ol>" + rows + "</ol>";
    done.appendChild(sec);
  }
  function watchDone() {
    var me = here(), done = document.getElementById("done");
    if (!me || !done || me.id === "city" || me.id === "country") return;
    var seen = false;
    function check() {
      if (done.hidden || seen) return;
      seen = true;
      var t = document.getElementById("shareText");
      if (me.id === "stamps") passport(done);
      if (t && perfect(me, t.textContent)) {
        confetti(done);
        var tm = document.getElementById("logoMascot");
        if (tm && tm.animate && !reduce) tm.animate([{ transform: "translateY(0)" }, { transform: "translateY(-8px)" }, { transform: "translateY(0)" }], { duration: 450, iterations: 3 });
      }
    }
    new MutationObserver(check).observe(done, { attributes: true, attributeFilter: ["hidden"] });
    check();
  }

  // 16.5 Today's games: a card for every game with today's status, and what to play next
  function today_games(app) {
    var me = here(), all = info();
    var sec = document.createElement("section");
    sec.className = "mx-today"; sec.setAttribute("aria-labelledby", "mxTodayH");
    var next = nextUp(all, me), meLeft = me && all.some(function (s) { return s.game.id === topId(me) && !s.doneToday; });
    var homeCopy = me && me.id === "city" && window.MXCOPY && MXCOPY.home;
    sec.innerHTML = (homeCopy ? '<h2 id="mxTodayH">' + esc(homeCopy.headline) + '</h2><p class="mx-next">' + esc(homeCopy.line) + "</p>" : '<h2 id="mxTodayH">Today\'s games</h2>') + '<ul class="mx-cards">' + all.map(function (s) {
      var g = s.game, isMe = me && g.id === topId(me);
      var st = s.doneToday ? "\u2713 Done today" : isMe ? "You're here" : s.cur >= 2 ? s.cur + "-day streak: play today" : "Play";
      return '<li class="mx-card' + (s.doneToday ? " done" : "") + (isMe ? " here" : "") + '"><a href="' + g.url + '"' + (isMe ? ' aria-current="page"' : "") + '><span class="ic" aria-hidden="true">' + g.icon + "</span><b>" + esc(g.name) + '</b><span class="ab">' + esc((window.MXCOPY && MXCOPY.cards && MXCOPY.cards[g.id]) || g.about) + '</span><span class="st">' + st + "</span></a></li>";
    }).join("") + "</ul>" + (next ? '<p class="mx-next">Next up: <a href="' + next.game.url + '">' + esc(next.game.name) + "</a></p>" : '<p class="mx-next">' + (meLeft ? "This is the last game left today." : "Every game done today. See you tomorrow.") + '</p>');
    // the shared streak, under the heading
    var sst = siteStreak(), sp = document.createElement("p"); sp.className = "mx-next mx-site";
    sp.textContent = siteText(sst);
    sec.insertBefore(sp, sec.querySelector(".mx-cards"));
    var tt = todayText();
    if (tt.n >= 2) {
      var share = document.createElement("p"); share.className = "mx-next";
      share.innerHTML = '<button class="mx-link" type="button" id="mxToday">Copy today\'s results (' + tt.n + " games)</button>";
      sec.appendChild(share);
      share.querySelector("button").onclick = async function () {
        var txt = todayText().text, b = this;
        try { await navigator.clipboard.writeText(txt); b.textContent = "Copied. Paste it in your group chat."; }
        catch (e) { window.prompt("Copy your results:", txt); }
      };
    }
    var foot = app.querySelector("footer");
    sec.setAttribute("data-sig", all.map(function (x) { return x.doneToday ? 1 : 0; }).join(""));
    if (foot && foot.parentNode === app) app.insertBefore(sec, foot); else app.appendChild(sec);
  }

  // 18.5 a friend's challenge link (#c-<number>-<score>) on the games that had none
  var UNIT = { daily: function (n) { return n + " of 100"; }, bigger: function (n) { return n + " of 10"; }, bigcountry: function (n) { return n + " of 10"; }, voyage: function (n) { return n + " points"; },
    fathoms: function (n) { return Number(n).toLocaleString("en-US") + " fathoms"; }, stamps: function (n) { return n + " of 6 stamps"; }, crossings: function (n) { return n + " points"; } };
  function challenge(app) {
    var me = here(), m = /^#c-(\d+)-(\d+)$/.exec(location.hash);
    if (!me || !m || !UNIT[me.id]) return;
    var n = Number(m[1]), t = today();
    if (Math.abs(n - t) > 1) return;
    var el = document.createElement("p");
    el.className = "mx-risk"; el.setAttribute("role", "status");
    el.textContent = n === t
      ? "A friend scored " + UNIT[me.id](m[2]) + " on No. " + n + ". Try to beat it."
      : "A friend scored " + UNIT[me.id](m[2]) + " on No. " + n + ". That is " + (n < t ? "yesterday's" : "tomorrow's") + " puzzle where you are, so today you get No. " + t + ". Play it and send yours back.";
    var head = app.querySelector("header");
    if (head && head.parentNode === app) app.insertBefore(el, head.nextSibling); else app.insertBefore(el, app.firstChild);
  }
  // ---------- Logbook (history game): start ----------
  // Logbook joins streaks, "Today's games", today's combined message, challenge links and the share image.
  // Its page is history.html; its own code is history.js. Merge notes: review/history-merge-notes.md
  GAMES.push({ id: "history", name: "Logbook", key: "dailycity:history:v1", url: "history.html", icon: "\u{1F4DC}", about: "Eight questions on how the world map has changed since 1800." });
  UNIT.history = function (n) { return n + " points"; };
  var MXFILL = { "\u{1F3AF}": "#7a0177", "\u{1F525}": "#e06a00", "\u{1F321}": "#f3d98a", "\u2744": "#a9d3e8", "\u{1F9CA}": "#dcedf5" };
  // Until every page's footer lists Logbook, add it to the "Daily games" links on pages that don't.
  function logbookLink() {
    Array.prototype.forEach.call(document.querySelectorAll('nav[aria-label="Daily games"]'), function (nav) {
      if (nav.querySelector('a[href$="history.html"]')) return;
      var a = document.createElement("a"); a.href = "history.html"; a.textContent = "Logbook";
      nav.appendChild(document.createTextNode(" ")); nav.appendChild(a);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", logbookLink); else logbookLink();
  // ---------- Logbook: end ----------
  // ---------- Dead Reckoning: start ----------
  // Dead Reckoning joins streaks, "Today's games", today's combined message and challenge links. Its page is
  // dead-reckoning.html; its own code is dead-reckoning.js. Merge notes: review/dead-reckoning-merge-notes.md
  GAMES.push({ id: "reckoning", name: "Dead Reckoning", key: "dailycity:reckoning:v1", url: "dead-reckoning.html", icon: "\u{1F4CD}", about: "Tap five places on a blank map. Closer scores more." });
  UNIT.reckoning = function (n) { return Number(n).toLocaleString("en-US") + " of 1,000"; };
  // ---------- Dead Reckoning: end ----------
  // ---------- Ballast ----------
  // Only the Daily Ballast counts for streaks and "Today's games"; the voyages (levels) keep their stars in the same save.
  GAMES.push({ id: "ballast", name: "Ballast", key: "dailycity:ballast:v1", url: "ballast.html", icon: "\u{1F6A2}", about: "Load a ship with real countries. Name them for bonus points." });
  UNIT.ballast = function (n) { return Number(n).toLocaleString("en-US") + " points"; };
  // ---------- Ballast: end ----------

  // The first game not yet played today, in menu order, leaving out the one you're on.
  function nextUp(all, me) { return (all || info()).filter(function (s) { return !s.doneToday && (!me || s.game.id !== topId(me)); })[0]; }
  // Every result's "play next" button goes to the first unplayed game (or to All games once everything is done).
  function nextButtons() {
    var me = here(); if (!me) return;
    var n = nextUp(null, me), btns = document.querySelectorAll("#done .row2 a.act.plain, #endBody a.act.plain.also");
    Array.prototype.forEach.call(btns, function (a) {
      var href = n ? n.game.url : "games/", text = n ? "Play " + n.game.name + " next" : "All done today: see every game";
      if (a.getAttribute("href") !== href) a.setAttribute("href", href);
      if (a.textContent !== text) a.textContent = text;
    });
  }
  // A small release line in each game's footer, so a bug report can say which version it was.
  function versionLine() {
    var f = document.querySelector(".app > footer"), sc = document.querySelector('script[src*="site.js?v="]');
    if (!f || !sc || f.querySelector(".mx-ver")) return;
    var v = (/[?&]v=([\w.-]+)/.exec(sc.getAttribute("src")) || [])[1]; if (!v) return;
    var p = document.createElement("p"); p.className = "mx-ver"; p.textContent = "Mapelago release " + v;
    f.appendChild(p);
  }

  // Beat my score. A shared result carries #b-<game>-<puzzle>-<mode>-<score>: a two-letter game code and
  // whole numbers only, nothing about the person and never the answer. Everything read from the address is
  // checked against fixed lists and ranges, and only ever written into the page as text.
  var BEAT = {
    city: { code: "mc", max: 1000, modes: 2 }, country: { code: "mn", max: 1000, modes: 2 },
    bigger: { code: "bc", max: 10, modes: 1 }, bigcountry: { code: "bn", max: 10, modes: 1 },
    voyage: { code: "vy", max: 1000, modes: 1 }, fathoms: { code: "fa", max: 7000, modes: 1 },
    stamps: { code: "st", max: 6, modes: 1 }, crossings: { code: "cr", max: 1000, modes: 1 },
    history: { code: "lb", max: 800, modes: 1 },
    reckoning: { code: "dr", max: 1000, modes: 1 },
    ballast: { code: "bl", max: 60000, modes: 1 }
  };
  function gameByCode(c) { var id = Object.keys(BEAT).filter(function (k) { return BEAT[k].code === c; })[0]; return id ? GAMES.filter(function (g) { return g.id === id; })[0] : null; }
  function gameByPage(page) { var k = pageKey(page) || "city"; /* a link to the home page with a result on it is Mystery city's (it lived there) */ return GAMES.filter(function (g) { return pageKey(g.url) === k; })[0]; }
  function said(id, mode, n) {
    if (mode === 1) return n >= 200 && n % 200 === 0 ? "found it on pin " + ((1000 - n) / 200 + 1) + " of 5 in Quick mode" : "didn't find it in 5 pins in Quick mode";
    if (id === "city" || id === "country" || id === "crossings") return Number(n).toLocaleString("en-US") + " points";
    if (UNIT[id]) return UNIT[id](n);
    return String(n);
  }
  function parseBeat(hash) {
    var m = /^#b-([a-z]{2})-(\d{1,5})-([0-9])-(\d{1,5})$/.exec(hash || "");
    if (!m) return null;
    var g = gameByCode(m[1]); if (!g) return null;
    var n = Number(m[2]), mode = Number(m[3]), sc = Number(m[4]), b = BEAT[g.id];
    if (n < 1 || n > today() + 1 || mode >= b.modes || sc > b.max) return null;
    return { game: g, n: n, mode: mode, score: sc };
  }
  // the game's own link, old style (#c-<puzzle>-<score>[-<pins>]) or new, turned into the new style
  var LINK = /(mapelago\.com\/)([\w.-]*)#(?:c-(\d+)-(\d+)(?:-\d+)?|b-[a-z]{2}-\d+-\d-\d+)/;
  function upgrade(text) {
    if (typeof text !== "string") return text;
    return text.replace(new RegExp(LINK.source, "g"), function (all, host, page, n, sc) {
      if (n === undefined) return all;
      var g = gameByPage(page); if (!g || !BEAT[g.id]) return all;
      var mode = BEAT[g.id].modes > 1 && /quick mode/i.test(text) ? 1 : 0;
      return host + page + "#b-" + BEAT[g.id].code + "-" + n + "-" + mode + "-" + sc;
    });
  }
  function ownResult(text) {
    var m = /#b-([a-z]{2})-(\d+)-(\d)-(\d+)/.exec(upgrade(text || ""));
    return m ? { n: Number(m[2]), mode: Number(m[3]), score: Number(m[4]) } : null;
  }
  // every copy and share goes out with the new link
  (function wrap() {
    try {
      var cb = navigator.clipboard;
      if (cb && cb.writeText && !cb.__mx) { var w = cb.writeText.bind(cb); cb.writeText = function (t) { return w(upgrade(t)); }; cb.__mx = 1; }
      if (navigator.share && !navigator.__mxs) { var sh = navigator.share.bind(navigator); navigator.share = function (d) { if (d && d.text) d = Object.assign({}, d, { text: upgrade(d.text) }); return sh(d); }; navigator.__mxs = 1; }
    } catch (e) {}
  })();
  function upgradeShown() {
    Array.prototype.forEach.call(document.querySelectorAll("#shareText, .share"), function (el) {
      if (LINK.test(el.textContent) && /#c-/.test(el.textContent)) el.textContent = upgrade(el.textContent);
    });
  }
  var friend = null;
  function beat(app) {
    var me = here(), f = parseBeat(location.hash);
    if (!me || !f) return;
    if (f.game.id !== me.id) { location.replace(f.game.url + location.hash); return; }
    var t = today(), el = document.createElement("p");
    el.className = "mx-risk mx-beat"; el.setAttribute("role", "status");
    if (f.n === t) {
      friend = f;
      el.textContent = "A friend " + (f.mode === 1 ? "" : "scored ") + said(me.id, f.mode, f.score) + " on today's " + me.name + ". Can you beat it?";
    } else {
      el.appendChild(document.createTextNode("This challenge is for No. " + f.n + ", " + (f.n < t ? "an earlier puzzle" : "which is tomorrow's where you are (your friend is a day ahead)") + ". Today's " + me.name + " is No. " + t + ". "));
      var a = document.createElement("a"); a.href = me.url; a.textContent = "Play today's and send your score back";
      el.appendChild(a);
    }
    var head = app.querySelector("header");
    if (head && head.parentNode === app) app.insertBefore(el, head.nextSibling); else app.insertBefore(el, app.firstChild);
  }
  function compareInto(box, shareEl) {
    if (!friend || !box || box.querySelector(".mx-vs")) return;
    var me = here(), mine = ownResult(shareEl && shareEl.textContent);
    if (!mine || mine.n !== friend.n) return;
    var d = mine.score - friend.score, sec = document.createElement("section");
    sec.className = "mx-vs"; sec.setAttribute("aria-label", "You and your friend");
    var cols = document.createElement("div"); cols.className = "mx-vs-cols";
    [["Your friend", friend], ["You", mine]].forEach(function (x) {
      var c = document.createElement("div"), b = document.createElement("b"), s = document.createElement("span");
      s.textContent = x[0]; b.textContent = x[1].mode === 1 ? (x[1].score >= 200 && x[1].score % 200 === 0 ? (1000 - x[1].score) / 200 + 1 + "/5" : "X/5") : String(x[1].score);
      c.appendChild(s); c.appendChild(b); cols.appendChild(c);
    });
    var v = document.createElement("p");
    v.textContent = (mine.mode !== friend.mode ? "Different modes, so take this lightly: " : "") + (d > 0 ? "You win." : d === 0 ? "A tie." : "Your friend wins this one.");
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "mx-link"; btn.textContent = "Send yours back";
    btn.onclick = async function () {
      var txt = upgrade(shareEl.textContent);
      try { if (navigator.share && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)) { await navigator.share({ text: txt }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(txt); btn.textContent = "Copied. Paste it to your friend."; } catch (e) { window.prompt("Copy your result:", txt); }
    };
    sec.appendChild(cols); sec.appendChild(v); sec.appendChild(btn);
    shareEl.parentNode.insertBefore(sec, shareEl);
  }
  function watchEnd() {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return; pending = true;
      setTimeout(function () {
        pending = false; upgradeShown(); nextButtons(); dailyLine();
        var done = document.getElementById("done"), end = document.getElementById("endModal");
        if (done && !done.hidden) compareInto(done, document.getElementById("shareText"));
        if (end && !end.hidden) compareInto(document.getElementById("endBody"), document.querySelector("#endBody .share"));
      }, 30);
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["hidden"] });
  }

  window.MXS.beat = { parse: parseBeat, upgrade: upgrade };

  // The rules behind a "?": a page that carries <template id="mxHelp"> gets a ? button in its header, which opens
  // those rules in a dialog. The opening screen then needs only one sentence.
  function helpButton() {
    var t = document.querySelector("template#mxHelp"), top = document.querySelector("header.top");
    if (!t || !top || document.querySelector("#mxHelpBtn")) return;
    var tools = top.querySelector(".tools");
    if (!tools) { tools = document.createElement("div"); tools.className = "tools"; top.appendChild(tools); }
    var b = document.createElement("button"); b.type = "button"; b.className = "tool"; b.id = "mxHelpBtn"; b.setAttribute("data-help", ""); b.setAttribute("aria-label", "How to play"); b.textContent = "?";
    tools.appendChild(b);
    var d = document.createElement("dialog"); d.className = "mx-help"; d.setAttribute("aria-label", "How to play");
    d.appendChild(t.content.cloneNode(true));
    var c = document.createElement("button"); c.type = "button"; c.className = "act"; c.textContent = "Got it"; d.appendChild(c);
    document.body.appendChild(d);
    b.onclick = function () { if (d.showModal) d.showModal(); else d.setAttribute("open", ""); };
    c.onclick = function () { if (d.close) d.close(); else d.removeAttribute("open"); };
    d.addEventListener("click", function (e) { if (e.target === d && d.close) d.close(); });
  }

  // First visit to a game: its first action (marked data-first in the page) pulses until it is used once.
  function firstMove() {
    var el = document.querySelector("[data-first]"), key = "mx:seen:" + location.pathname.replace(/.*\//, "").replace(/\.html$/, "");
    if (!el) return;
    try { if (localStorage.getItem(key)) return; } catch (e) { return; }
    document.documentElement.classList.add("mx-fresh");
    // a ten-second demo on a first visit: a pointing hand taps the first thing to do (still, with reduced motion)
    var hand = document.createElement("span"); hand.className = "mx-hand"; hand.setAttribute("aria-hidden", "true"); hand.textContent = "\u{1F446}";
    var place = function () { var r = el.getBoundingClientRect(); if (!r.width) return; hand.style.left = (r.left + window.scrollX + Math.min(r.width * 0.5, 120)) + "px"; hand.style.top = (r.top + window.scrollY + r.height * 0.55) + "px"; };
    if (!/^(city|country|ballast|reckoning)$/.test((here() || {}).id || "")) { document.body.appendChild(hand); place(); window.addEventListener("resize", place); setTimeout(function () { hand.remove(); }, 10000); }
    var done = function () { hand.remove(); document.documentElement.classList.remove("mx-fresh"); try { localStorage.setItem(key, "1"); } catch (e) {} el.removeEventListener("pointerdown", done, true); el.removeEventListener("keydown", done, true); };
    el.addEventListener("pointerdown", done, true); el.addEventListener("keydown", done, true);
  }

  // Sound on every game: a page whose game has no sound button of its own gets the shared one (the same on/off setting
  // as everywhere else) and three small sounds: a tap on any game button, a rise for a right answer or a finished
  // round, a low note for a wrong answer.
  var SND_ON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  var SND_OFF = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  function soundOff() { try { return localStorage.getItem("dailycity:sound") === "off"; } catch (e) { return false; } }
  var actx = null;
  function tone(f, len, vol, type, to) {
    if (soundOff()) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume();
      var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + len);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + len + 0.02);
    } catch (e) {}
  }
  var SFX = { tap: function () { tone(520, 0.05, 0.05, "triangle"); }, right: function () { tone(523, 0.12, 0.08, "sine", 784); }, wrong: function () { tone(196, 0.18, 0.07, "sawtooth", 147); }, win: function () { tone(523, 0.1, 0.08); setTimeout(function () { tone(659, 0.1, 0.08); }, 110); setTimeout(function () { tone(784, 0.2, 0.09); }, 220); } };
  function soundButton() {
    var top = document.querySelector("header.top"), app = document.querySelector(".app"); if (!top || !app || !here()) return;
    if (document.querySelector('#soundBtn, #mxSound, header.top [aria-label^="Sound"], header.top [aria-label*="sound"]')) return; // the game has its own
    var tools = top.querySelector(".tools"); if (!tools) { tools = document.createElement("div"); tools.className = "tools"; top.appendChild(tools); }
    var b = document.createElement("button"); b.type = "button"; b.className = "tool"; b.id = "mxSound";
    var draw = function () { var off = soundOff(); b.innerHTML = off ? SND_OFF : SND_ON; b.setAttribute("aria-pressed", off ? "true" : "false"); b.setAttribute("aria-label", off ? "Sound is off. Turn sound on" : "Sound is on. Turn sound off"); };
    b.onclick = function () { try { if (soundOff()) localStorage.removeItem("dailycity:sound"); else localStorage.setItem("dailycity:sound", "off"); } catch (e) {} draw(); SFX.tap(); };
    draw(); tools.insertBefore(b, tools.firstChild);
    app.addEventListener("click", function (e) { var t = e.target.closest("button, .opt, .pick"); if (t && t !== b && !t.closest("header, footer, .mx-today")) SFX.tap(); }, true);
    var lastAt = 0, mark = function (el) {
      if (!el.classList || Date.now() - lastAt < 150) return; var c = " " + el.className + " ";
      if (/ (right|correct|good|win) /.test(c)) { lastAt = Date.now(); SFX.right(); } else if (/ (wrong|bad|miss|lost) /.test(c)) { lastAt = Date.now(); SFX.wrong(); }
    };
    new MutationObserver(function (ms) { ms.forEach(function (m) { if (m.type === "attributes" && m.attributeName === "class") mark(m.target); else if (m.type === "attributes" && m.target.id === "done" && !m.target.hidden) SFX.win(); }); }).observe(app, { subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
  }

  // ---------- a small answer map after each reveal (Voyage, Stamps, Logbook, Fathoms, Bigger city?) ----------
  // Drawn from the shared world map (world-lite.js, loaded on first use), in the Chart room colours. It shows where the
  // answer is; it never appears before the answer.
  var MXMAP = (function () {
    var feats = null, byName = {}, waiting = [];
    var ALIAS = { "united states": "united states of america", "usa": "united states of america", "czech republic": "czechia", "ivory coast": "côte d'ivoire", "cote d'ivoire": "côte d'ivoire", "dr congo": "dem. rep. congo", "democratic republic of the congo": "dem. rep. congo", "republic of the congo": "congo", "central african republic": "central african rep.", "south sudan": "s. sudan", "bosnia and herzegovina": "bosnia and herz.", "dominican republic": "dominican rep.", "equatorial guinea": "eq. guinea", "eswatini": "eswatini", "north macedonia": "macedonia", "solomon islands": "solomon is.", "western sahara": "w. sahara", "türkiye": "turkey", "turkiye": "turkey", "east timor": "timor-leste", "cabo verde": "cape verde", "the bahamas": "bahamas", "the gambia": "gambia" };
    function load(cb) {
      if (window.__WORLD) return cb();
      waiting.push(cb); if (waiting.length > 1) return;
      var me = document.querySelector('script[src*="site.js"]'), v = me ? (me.getAttribute("src").split("?")[1] || "") : "", sc = document.createElement("script");
      sc.src = "world-lite.js" + (v ? "?" + v : ""); sc.async = true; sc.onload = function () { var w = waiting; waiting = []; w.forEach(function (f) { f(); }); }; document.head.appendChild(sc);
    }
    function decode() {
      if (feats) return;
      var W = window.__WORLD, T = W.transform, arcs = W.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (q) { x += q[0]; y += q[1]; return [x * T.scale[0] + T.translate[0], y * T.scale[1] + T.translate[1]]; }); });
      var ring = function (ix) { var out = []; ix.forEach(function (i, n) { var a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; out = out.concat(n ? a.slice(1) : a); }); return out; };
      feats = W.objects.countries.geometries.map(function (g) {
        var polys = g.type === "Polygon" ? [g.arcs.map(ring)] : g.type === "MultiPolygon" ? g.arcs.map(function (p) { return p.map(ring); }) : [];
        var f = { id: +g.id, name: (g.properties && g.properties.name) || "", polys: polys }; if (!byName[f.name.toLowerCase()]) byName[f.name.toLowerCase()] = f; return f;
      });
    }
    function find(name) {
      var n = String(name || "").toLowerCase().replace(/^the /, "").trim(), cid = window.MXA && MXA.names && MXA.names[n];
      if (cid != null) { var hit = feats.filter(function (f) { return f.id === cid; })[0]; if (hit) return hit; }
      return byName[n] || byName[ALIAS[n] || ""] || null;
    }
    // every country name inside a piece of text (longest first, whole words)
    function namesIn(text) {
      decode(); var t = " " + String(text || "").toLowerCase() + " ", out = [];
      var all = Object.keys(byName).concat(Object.keys(ALIAS)).concat(window.MXA && MXA.names ? Object.keys(MXA.names) : []).filter(function (x) { return x.length > 3; }).sort(function (a, b) { return b.length - a.length; });
      all.forEach(function (k) { var i = t.indexOf(k); if (i > 0 && !/[a-z]/.test(t[i - 1]) && !/[a-z]/.test(t[i + k.length])) { var f = find(k); if (f && out.indexOf(f) < 0) out.push(f); t = t.split(k).join(" "); } });
      return out;
    }
    function draw(cv, hi) {
      var w = cv.clientWidth || 300, h = cv.clientHeight || 72, dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = w * dpr; cv.height = h * dpr;
      var g = cv.getContext("2d"), cs = getComputedStyle(document.documentElement), col = function (v, d) { return (cs.getPropertyValue(v) || "").trim() || d; };
      var x0 = 180, x1 = -180, y0 = 90, y1 = -90;
      hi.forEach(function (f) { f.polys.forEach(function (p) { p[0].forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }); }); });
      if (x1 - x0 > 200) { x0 = -170; x1 = 190; } // across the date line: show the world
      var mx = (x0 + x1) / 2, my = (y0 + y1) / 2, span = Math.max(x1 - x0, (y1 - y0) * 1.6, 14) * 1.8, cos = Math.cos(my * Math.PI / 180), k = w / (span * cos);
      if ((y1 - y0) * 1.8 * k > h) k = h / ((y1 - y0) * 1.8);
      var P = function (q) { return [w / 2 + (q[0] - mx) * cos * k, h / 2 - (q[1] - my) * k]; };
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = col("--sea", "#dcedf5"); g.fillRect(0, 0, w, h); g.lineJoin = "round";
      var path = function (f) { g.beginPath(); f.polys.forEach(function (p) { p.forEach(function (r) { r.forEach(function (q, i) { var s = P(q); if (i) g.lineTo(s[0], s[1]); else g.moveTo(s[0], s[1]); }); g.closePath(); }); }); };
      feats.forEach(function (f) { path(f); g.fillStyle = col("--land", "#f3d98a"); g.fill(); g.strokeStyle = col("--land-line", "#6f5d22"); g.lineWidth = 0.6; g.stroke(); });
      hi.forEach(function (f) {
        path(f); g.fillStyle = col("--accent", "#b4237d"); g.fill(); g.strokeStyle = col("--ink", "#000"); g.lineWidth = 1.2; g.stroke();
        // a country too small to see gets a marked dot of its own
        var bx = [1e9, 1e9, -1e9, -1e9]; f.polys.forEach(function (p) { p[0].forEach(function (q) { var v = P(q); bx[0] = Math.min(bx[0], v[0]); bx[1] = Math.min(bx[1], v[1]); bx[2] = Math.max(bx[2], v[0]); bx[3] = Math.max(bx[3], v[1]); }); });
        if (bx[2] - bx[0] < 8 && bx[3] - bx[1] < 8) { g.beginPath(); g.arc((bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2, 6, 0, 6.2832); g.fillStyle = col("--accent", "#b4237d"); g.fill(); g.lineWidth = 1.5; g.stroke(); }
      });
      g.strokeStyle = col("--ink", "#000"); g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
    }
    function show(after, text, label) {
      if (!after || !after.parentNode) return;
      load(function () {
        decode(); var hi = namesIn(text), cv = after.parentNode.querySelector("canvas.mx-mini");
        if (!hi.length) { if (cv) cv.hidden = true; return; }
        if (!cv) { cv = document.createElement("canvas"); cv.className = "mx-mini"; cv.setAttribute("role", "img"); after.parentNode.insertBefore(cv, after.nextSibling); }
        cv.hidden = false; cv.setAttribute("aria-label", "Map: " + hi.map(function (f) { return f.name; }).join(", ")); requestAnimationFrame(function () { draw(cv, hi); });
      });
    }
    // one country's outline, fitted to a small canvas (Bigger?'s country cards): land colour, a darker rim on the shadow side
    function outline(cv, cid) {
      if (!cv) return;
      load(function () {
        decode(); var f = feats.filter(function (x) { return x.id === +cid; })[0]; if (!f || !cv.isConnected) return;
        var w = cv.clientWidth || 80, h = cv.clientHeight || 56, dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = w * dpr; cv.height = h * dpr;
        var g = cv.getContext("2d"), cs = getComputedStyle(document.documentElement), col = function (v, d) { return (cs.getPropertyValue(v) || "").trim() || d; };
        // the largest part decides the frame, so a far-off island does not shrink the mainland to a speck
        var big = f.polys.map(function (p) { var b = [1e9, 1e9, -1e9, -1e9]; p[0].forEach(function (q) { b[0] = Math.min(b[0], q[0]); b[1] = Math.min(b[1], q[1]); b[2] = Math.max(b[2], q[0]); b[3] = Math.max(b[3], q[1]); }); return b; }).sort(function (a, b) { return (b[2] - b[0]) * (b[3] - b[1]) - (a[2] - a[0]) * (a[3] - a[1]); })[0];
        if (!big) return;
        var my = (big[1] + big[3]) / 2, cos = Math.cos(my * Math.PI / 180), bw = Math.max(0.2, (big[2] - big[0]) * cos), bh = Math.max(0.2, big[3] - big[1]);
        var k = Math.min((w - 8) / bw, (h - 8) / bh), mx = (big[0] + big[2]) / 2;
        var P = function (q) { return [w / 2 + (q[0] - mx) * cos * k, h / 2 - (q[1] - my) * k]; };
        g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h); g.lineJoin = "round";
        var path = function (dx, dy) { g.beginPath(); f.polys.forEach(function (p) { p.forEach(function (r) { r.forEach(function (q, i) { var s = P(q); if (i) g.lineTo(s[0] + dx, s[1] + dy); else g.moveTo(s[0] + dx, s[1] + dy); }); g.closePath(); }); }); };
        path(-1.4, 1.4); g.fillStyle = col("--land-line", "#6f5d22"); g.fill();
        path(0, 0); g.fillStyle = col("--land", "#f3d98a"); g.fill(); g.strokeStyle = col("--ink", "#000"); g.lineWidth = 1.1; g.stroke();
      });
    }
    return { show: show, namesIn: namesIn, load: load, outline: outline };
  })();
  window.MXMAP = MXMAP;
  // which text names the answer, and where the map goes, in each game
  function answerMaps() {
    var me = here(); if (!me) return;
    var rules = {
      voyage: function () { var s = document.getElementById("say"); return s && /^(Right|Wrong)/.test(s.textContent) ? [s, s.textContent + " " + ((document.querySelector("#opts .opt.right") || {}).textContent || "")] : null; },
      stamps: function () { var s = document.getElementById("qsay"); return s && !s.hidden ? [s, ((document.querySelector("#qopts .opt.right") || {}).textContent || "") + " " + ((document.getElementById("qask") || {}).textContent || "")] : null; },
      history: function () { var s = document.getElementById("qsay"), sl = document.getElementById("slider"); return s && !s.hidden && !(sl && sl.offsetParent) ? [s, s.textContent + " " + ((document.getElementById("qbody") || {}).innerText || "")] : null; },
      fathoms: function () { var s = document.getElementById("shownNote"), sh = document.getElementById("shown"); return s && sh && !sh.hidden ? [s, (document.getElementById("shownTitle") || {}).textContent.split(":")[0] + " " + s.textContent] : null; },
      bigger: function () { var s = document.getElementById("say"), d = document.getElementById("done"); return s && (!d || d.hidden) ? [s, [].map.call(document.querySelectorAll("#play .pick .where"), function (x) { return x.textContent; }).join(" ")] : null; } // where the two cities are (their countries are already on the cards)
    }, rule = rules[me.id];
    if (!rule) return;
    var last = "";
    new MutationObserver(function () { var r = rule(); if (!r) { var cv = document.querySelector("canvas.mx-mini"); if (cv && !cv.hidden && last) { cv.hidden = true; last = ""; } return; } if (r[1] === last) return; last = r[1]; MXMAP.show(r[0], r[1]); })
      .observe(document.querySelector(".app"), { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["hidden", "class"] });
  }

  // Feel: a right answer gives a small pop, a wrong one a short shake, in every game and mode (not with reduced motion)
  function answerMotion() {
    var app = document.querySelector(".app"); if (!app || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    new MutationObserver(function (ms) { ms.forEach(function (m) {
      var el = m.target, c = " " + (el.className && el.className.baseVal == null ? el.className : "") + " ", was = " " + (m.oldValue || "") + " ";
      var right = / (right|correct|got) /.test(c) && !/ (right|correct|got) /.test(was), wrong = / (wrong|miss) /.test(c) && !/ (wrong|miss) /.test(was);
      if (!right && !wrong) return;
      var k = right ? "mx-pop" : "mx-shake"; el.classList.remove(k); void el.offsetWidth; el.classList.add(k);
      setTimeout(function () { el.classList.remove(k); }, 600);
    }); }).observe(app, { subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true });
  }

  // One visual system: each game's header carries a small line drawing in the Chart room style, and screens slide in.
  var EMBLEM = {
    city: '<path d="M3 21V9l5-3v15M8 21V4h6v17M14 21v-9h6v9M2 21h20M10 7h2M10 10h2M10 13h2M16 15h2"/>',
    country: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    bigger: '<path d="M4 20V11h5v9M11 20V4h6v16M2 20h20"/>',
    bigcountry: '<path d="M3 8l6-3 6 3 6-3v11l-6 3-6-3-6 3z"/><path d="M9 5v11M15 8v11"/>',
    voyage: '<circle cx="12" cy="5" r="2"/><path d="M12 7v13M7 11h10M5 15c1 4 4 5 7 5s6-1 7-5"/>',
    fathoms: '<path d="M2 6c3-2 5 2 8 0s5 2 8 0M2 11c3-2 5 2 8 0s5 2 8 0M12 13v8M9 18l3 3 3-3"/>',
    stamps: '<path d="M5 3h14v18H5z" stroke-dasharray="2 2"/><path d="M8 7h8v7H8zM8 17h8"/>',
    crossings: '<circle cx="12" cy="12" r="9"/><path d="M12 5l2 7-2 7-2-7z"/>',
    history: '<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6zM6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2M9 8h7M9 12h7M9 16h4"/>',
    reckoning: '<path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    ballast: '<path d="M2 14h20l-3 6H5zM12 14V3M12 3l7 9h-7"/>'
  };
  // Ink & Lantern (the standard look): hand-set titles, inked panel borders, "Episode N", the lantern's page colour
  function isInk() { var l = document.documentElement.getAttribute("data-look"); return !l || l === "chart"; }
  function inkRand(seed) { var a = seed | 0; return function () { a = a + 0x6d2b79f5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function inkTitle(el) {
    if (!el || el.getAttribute("data-ink")) return;
    el.setAttribute("data-ink", "1");
    var rnd = inkRand(el.textContent.length * 131 + 7);
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
      var f = document.createDocumentFragment(), label = n.nodeValue;
      var wrap = document.createElement("span"); wrap.setAttribute("aria-label", label.trim()); wrap.setAttribute("role", "text");
      label.split(/( +)/).forEach(function (word) {
        if (!word) return;
        if (/^ +$/.test(word)) { wrap.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.style.whiteSpace = "nowrap"; // a word never breaks between its letters
        Array.from(word).forEach(function (ch) {
          var s = document.createElement("span"); s.className = "ink-l"; s.setAttribute("aria-hidden", "true"); s.textContent = ch;
          s.style.setProperty("--t", ((rnd() - 0.5) * 7).toFixed(1) + "deg"); s.style.setProperty("--y", ((rnd() - 0.5) * 2.4).toFixed(1) + "px");
          w.appendChild(s);
        });
        wrap.appendChild(w);
      });
      f.appendChild(wrap); el.replaceChild(f, n);
    });
  }
  function inkFrames() {
    var all = document.body.querySelectorAll("div,section,article,aside,ol,ul,li,p,pre,figure,details,form,fieldset,label,a,dialog,table");
    for (var i = 0; i < all.length; i++) {
      var el = all[i]; if (el.classList.contains("ink-frame") || el.classList.contains("lede") || el.closest(".ink-cap")) continue;
      if (el.offsetWidth < 70 || el.offsetHeight < 30) continue;
      var cs = getComputedStyle(el);
      if (parseFloat(cs.borderTopWidth) >= 1.5 && cs.borderTopStyle === "solid" && cs.borderTopColor === "rgb(239, 230, 207)" && parseFloat(cs.borderLeftWidth) >= 1.5) el.classList.add("ink-frame");
    }
  }
  function inkEpisode() {
    var n = document.getElementById("num"); if (!n) return;
    var fix = function () { var t = n.textContent; if (/^No\. \d/.test(t)) n.textContent = t.replace(/^No\. /, "Episode "); };
    fix(); new MutationObserver(fix).observe(n, { childList: true, characterData: true, subtree: true });
  }
  // Ink & Lantern maps: every land shape in an SVG map gets a darker rim on its shadow side (light from the top right,
  // drawn as an offset copy underneath, so the outline is heavier there) and hand-placed hatching on top (a fill from
  // the baked ink/hatch.svg). No live filters. Land is found by its colour, so every game's maps take part.
  var INK_LAND = "rgb(201, 162, 87)", inkId = 0;
  function inkMaps() {
    document.querySelectorAll("svg").forEach(function (svg) {
      if (svg.hasAttribute("data-ink-copy") || svg.closest("[data-ink-copy]")) return;
      var land = Array.prototype.filter.call(svg.querySelectorAll("path,polygon"), function (p) { return !p.closest("[data-ink-copy]") && getComputedStyle(p).fill === INK_LAND; });
      var byParent = new Map();
      land.forEach(function (p) { var g = p.parentNode; if (!byParent.has(g)) byParent.set(g, []); byParent.get(g).push(p); });
      byParent.forEach(function (ps, g) {
        var key = ps.length + ":" + ps.map(function (p) { return (p.getAttribute("d") || "").length; }).join(",").length;
        if (g.getAttribute("data-ink-n") === key) return;
        Array.prototype.slice.call(g.querySelectorAll(":scope > [data-ink-copy]")).forEach(function (c) { c.remove(); });
        var ctm = g.getScreenCTM && g.getScreenCTM(), k = ctm && ctm.a ? 1 / Math.abs(ctm.a) : 1;
        var NS = "http://www.w3.org/2000/svg", id = svg.getAttribute("data-ink-pat");
        if (!id) {
          id = "inkHatch" + (++inkId); svg.setAttribute("data-ink-pat", id);
          var defs = document.createElementNS(NS, "defs"), pat = document.createElementNS(NS, "pattern"), img = document.createElementNS(NS, "image");
          pat.setAttribute("id", id); pat.setAttribute("patternUnits", "userSpaceOnUse"); pat.setAttribute("width", "900"); pat.setAttribute("height", "900");
          img.setAttribute("href", (document.querySelector('link[href*="ink.css"]') || { getAttribute: function () { return ""; } }).getAttribute("href").replace(/ink\.css.*$/, "") + "ink/hatch.svg");
          img.setAttribute("width", "900"); img.setAttribute("height", "900");
          pat.appendChild(img); defs.appendChild(pat); defs.setAttribute("data-ink-copy", "1"); svg.insertBefore(defs, svg.firstChild);
        }
        svg.querySelector("#" + id).setAttribute("patternTransform", "scale(" + k.toFixed(4) + ")");
        var rim = document.createElementNS(NS, "g"), hat = document.createElementNS(NS, "g");
        rim.setAttribute("data-ink-copy", "1"); hat.setAttribute("data-ink-copy", "1");
        rim.setAttribute("transform", "translate(" + (-1.3 * k).toFixed(3) + " " + (1.3 * k).toFixed(3) + ")");
        rim.setAttribute("style", "fill:#8C6B30;stroke:#5e4520;stroke-width:" + (1.1 * k).toFixed(3));
        hat.setAttribute("style", "fill:url(#" + id + ");stroke:none");
        ps.forEach(function (p) {
          var a = p.cloneNode(false), b = p.cloneNode(false);
          [a, b].forEach(function (c) { c.removeAttribute("id"); c.removeAttribute("class"); c.removeAttribute("style"); c.removeAttribute("fill"); c.removeAttribute("stroke"); c.setAttribute("aria-hidden", "true"); });
          rim.appendChild(a); hat.appendChild(b);
        });
        g.insertBefore(rim, ps[0]);
        g.appendChild(hat);
        g.setAttribute("data-ink-n", key);
      });
    });
  }
  // each game's small comic panel: in its header, and on its card on the home page
  function inkArt() {
    var base = inkBase(), me = here(), page = (location.pathname.split("/").pop() || "index.html");
    var id = me ? me.id : /^daily/.test(page) ? "daily" : /^(index\.html)?$/.test(page) ? "home" : null;
    var mark = document.querySelector(".top .mark");
    if (id && mark && !mark.querySelector(".ink-art")) {
      var im = document.createElement("img"); im.className = "ink-art"; im.alt = ""; im.width = 51; im.height = 36; im.decoding = "async";
      im.src = base + "ink/art/" + id + ".svg";
      // the drawing only stays if the header keeps its height (on a crowded phone header the game name comes first)
      var top = mark.closest(".top") || mark; mark.appendChild(im);
      var word = mark.querySelector(".word") || top;
      var fit = function () {
        im.style.display = "none"; var h0 = top.offsetHeight, w0 = word.offsetHeight; im.style.display = "";
        var line = parseFloat(getComputedStyle(word).lineHeight) || 26; // the drawing stays only beside a one-line title
        if (h0 && (top.offsetHeight > h0 + 2 || word.offsetHeight > w0 + 2 || word.offsetHeight > line * 1.5)) im.style.display = "none";
      };
      fit(); setTimeout(fit, 700); window.addEventListener("load", function () { setTimeout(fit, 400); }); window.addEventListener("resize", fit);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
      if (window.ResizeObserver) { var busy = false; new ResizeObserver(function () { if (busy) return; busy = true; fit(); requestAnimationFrame(function () { busy = false; }); }).observe(top); }
    }
    document.querySelectorAll("a[data-game] .ic, a[data-game] > .ic").forEach(function (ic) {
      var g = GAMES.filter(function (x) { return x.url === ic.parentNode.getAttribute("data-game"); })[0];
      if (!g || ic.querySelector("img")) return;
      ic.innerHTML = '<img src="' + base + "ink/art/" + g.id + '.svg" alt="" width="60" height="42" decoding="async">'; ic.classList.add("ink-ic");
    });
    // the home page: "To be continued..." and how many games are left today
    var home = id === "home" && document.querySelector(".app, main");
    if (home && !document.getElementById("inkTbc")) {
      var t = today(), left = info().filter(function (s) { return !s.res[t]; }).length;
      var p = document.createElement("p"); p.id = "inkTbc"; p.className = "ink-tbc";
      p.textContent = left ? "To be continued... " + left + " more game" + (left === 1 ? "" : "s") + " today." : "To be continued... tomorrow.";
      var foot = home.querySelector("footer"); if (foot) foot.parentNode.insertBefore(p, foot); else home.appendChild(p);
    }
  }
  function ink() {
    if (!isInk()) return;
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", "#101316");
    document.querySelectorAll(".top .word, .about-h").forEach(inkTitle);
    inkEpisode(); inkFrames(); inkArt();
    // the textures (map hatching, blots, paper grain) wait until the page has loaded, so they never slow the first move
    var ready = false, settle = function () { ready = true; document.documentElement.classList.add("ink-ready"); inkMaps(); };
    if (document.readyState === "complete") setTimeout(settle, 200); else window.addEventListener("load", function () { setTimeout(settle, 200); });
    var t = null; new MutationObserver(function (ms) { if (ms.every(function (m) { return m.target.closest && m.target.closest("[data-ink-copy]") || Array.prototype.every.call(m.addedNodes, function (n) { return n.nodeType === 1 && n.hasAttribute("data-ink-copy"); }) && m.addedNodes.length; })) return; clearTimeout(t); t = setTimeout(function () { inkFrames(); if (ready) inkMaps(); }, 250); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "open"] });
    window.addEventListener("load", function () { setTimeout(inkFrames, 300); });
  }

  function emblem() {
    var me = here(), w = document.querySelector("header.top .word"); if (!me || !w || !EMBLEM[me.id] || w.querySelector(".mx-emb")) return;
    w.insertAdjacentHTML("beforeend", ' <svg class="mx-emb" viewBox="0 0 24 24" aria-hidden="true">' + EMBLEM[me.id] + "</svg>");
  }

  function mount() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var app = document.querySelector(".app");
    // screen readers can jump straight to the game: the page's main region (pages that have a <main> keep it)
    if (app && !document.querySelector("main,[role=main]")) {
      app.setAttribute("role", "main");
      // a header or footer inside the main region isn't a page-level banner or footer
      Array.prototype.forEach.call(app.children, function (el) { if (/^(HEADER|FOOTER)$/.test(el.tagName)) el.setAttribute("role", "none"); });
    }
    if (app) { riskNote(app); challenge(app); beat(app); today_games(app); }
    watchEnd(); upgradeShown(); nextButtons(); versionLine(); helpButton(); firstMove(); answerMaps(); answerMotion(); emblem(); ink();
    // the day's level in words on the games whose own dial is not set yet (from No. 19)
    var mine = here(); if (mine && !window.MX_ARC && puzzleDay() >= 19 && /^(country|fathoms|stamps|reckoning)$/.test(mine.id)) window.MX_ARC = weekLevel(puzzleDay());
    setTimeout(arcLabel, 300); setTimeout(arcLabel, 1500); setTimeout(soundButton, 900); // after any game has added its own
    addImageButton();
    watchDone();
    var nav = document.querySelector('nav[aria-label="Daily games"]');
    var me = here();
    if (nav && me) Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) { if (a.getAttribute("href") === me.url || (me.url === "./" && /^(\.\/|index\.html|\.)$/.test(a.getAttribute("href")))) a.setAttribute("aria-current", "page"); });
    if (nav) {
      var b = document.createElement("button");
      b.className = "mx-link"; b.type = "button"; b.textContent = "Your streaks"; b.onclick = openSheet;
      nav.parentNode.insertBefore(b, nav.nextSibling);
    }
  }
  setInterval(function () { if (document.querySelector(".mx-daily, .mx-site")) dailyLine(); }, 30000);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
