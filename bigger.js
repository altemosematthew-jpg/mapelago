/* Bigger?: Bigger city? and Bigger country? as one game, from No. 14.
   Ten pairs a day that take turns: a pair of cities (which has more people: the UN's urban-area figure for 2025) and a
   pair of countries (which covers more land: the UN Demographic Yearbook's surface area). The pairs close up through
   the day and follow the weekly arc. No pair ever comes back. One result a day, saved where Bigger city? kept its
   results, so that history carries on; Bigger country?'s history joins it for the streak (site.js).
   Archive days before No. 14 still play on the old pages (bigger-city.html, bigger-country.html). */
(function () {
  "use strict";
  var START = 14, KEY = "dailycity:bigger:v1", N = 10, D = window.BQ_DATA;
  var $ = function (s) { return document.querySelector(s); };
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var CITY = D.city.map(function (r) { return { t: "city", name: r[0], sub: r[1], v: r[2], lat: r[3], lon: r[4], key: r[0] + "|" + r[1] }; });
  var LAND = D.country.map(function (r) { return { t: "country", cc: r[0], cid: r[1], name: r[2], sub: r[3], v: r[4], lat: r[5], lon: r[6], szr: r[7] ? [r[7], r[8]] : null, key: r[0] }; });
  // the same closing ramp as before, slot by slot: the first pair is three to eight times apart, the last 15 to 25%
  var RAMP = [[3, 8], [2.5, 3.4], [2.1, 2.7], [1.8, 2.2], [1.6, 1.85], [1.45, 1.65], [1.35, 1.5], [1.26, 1.4], [1.18, 1.3], [1.15, 1.25]];
  var mulb = function (a) { return function () { a |= 0; a = a + 0x6d2b79f5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  var kind = function (i) { return i % 2 ? "country" : "city"; }; // round 1 is cities, round 2 countries, and so on
  var close = function (a, b) { return a.t === "country" && window.MXAclose ? MXAclose({ area: a.v, szr: a.szr }, { area: b.v, szr: b.szr }) : false; };

  // the day's pairs, dealt in order from No. 14 so that no pair ever returns
  var used = { city: {}, country: {} }, dealt = {}, last = START - 1;
  function sorted(list) { return list.map(function (_, i) { return i; }).sort(function (a, b) { return list[a].v - list[b].v; }); }
  var BY = { city: sorted(CITY), country: sorted(LAND) }, POOL = { city: CITY, country: LAND };
  function dealOne(n) {
    var rnd = mulb(n * 7919 + 131), today = { city: {}, country: {} }, out = [], wf = window.MXS && MXS.weekLevel ? MXS.weekLevel(n).f : 1;
    for (var s = 0; s < N; s++) {
      var k = kind(s), P = POOL[k], by = BY[k], got = null;
      for (var widen = 0; widen < 5 && !got; widen++) {
        var lo = Math.max(1.15, 1 + (RAMP[s][0] - 1) * wf - 0.05 * widen), hi = Math.max(lo + 0.06, 1 + (RAMP[s][1] - 1) * wf + 0.15 * widen);
        for (var t = 0; t < 400 && !got; t++) {
          var a = Math.floor(rnd() * P.length); if (today[k][a]) continue;
          var want = P[a].v * (lo + rnd() * (hi - lo)) * (rnd() < 0.5 ? 1 : 1 / Math.pow(lo + rnd() * (hi - lo), 2));
          var l = 0, h = by.length - 1; while (l < h) { var m = (l + h) >> 1; if (P[by[m]].v < want) l = m + 1; else h = m; }
          for (var j = Math.max(0, l - 3); j <= Math.min(by.length - 1, l + 3) && !got; j++) {
            var b = by[j]; if (b === a || today[k][b]) continue;
            var q = Math.max(P[a].v, P[b].v) / Math.min(P[a].v, P[b].v), pk = Math.min(a, b) + "-" + Math.max(a, b);
            if (q < lo || q > hi || used[k][pk] || close(P[a], P[b])) continue;
            if (k === "city" && P[a].sub === P[b].sub) continue; // two cities of one country tell you nothing about the world
            got = rnd() < 0.5 ? [a, b] : [b, a];
          }
        }
      }
      if (!got) { var free = by.filter(function (i) { return !today[k][i]; }); got = [free[0], free[free.length - 1]]; } // never needed with today's lists
      today[k][got[0]] = today[k][got[1]] = 1; used[k][Math.min(got[0], got[1]) + "-" + Math.max(got[0], got[1])] = 1;
      out.push(got.map(function (i) { return P[i]; }));
    }
    return out;
  }
  function deal(n) { while (last < n) { last++; dealt[last] = dealOne(last); } return dealt[n]; }

  // ---------- the day ----------
  var n = window.MXS ? MXS.puzzleDay() : 1, save;
  try { save = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { save = null; }
  if (!save || typeof save !== "object") save = {};
  if (!save.results || typeof save.results !== "object") save.results = {};
  function store() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} }

  var num = $("#num"); if (num) num.textContent = "No. " + n;
  var old = /^#(?:c-|b-[a-z]+-)(\d+)/.exec(location.hash);
  if (old && +old[1] < START) { location.replace("bigger-city.html" + location.hash); return; } // a Bigger city? result from before the merge
  if (n < START) { // the two old games, for archive days before the merge
    $("#play").hidden = true; $("#before").hidden = false; $("#dots").hidden = true;
    return;
  }
  var pairs = deal(n), g = save.game && save.game.n === n ? save.game : { n: n, picks: [] }, res = save.results[n] && save.results[n].bq ? save.results[n] : null; // a result from the old Bigger city? page is not today's Bigger?
  if (res) g = { n: n, picks: res.picks };
  var ok = function (i) { var p = pairs[i]; return p[g.picks[i]].v > p[1 - g.picks[i]].v; };
  var score = function () { var s = 0; for (var i = 0; i < g.picks.length; i++) if (ok(i)) s++; return s; };

  function the(x) { return /^(United|Czech|Dominican|Central African|Philippines|Netherlands|Gambia|Bahamas|Maldives|Comoros|Marshall|Solomon)/.test(x) ? "the " + x : x; }
  function times(a, b) { var q = Math.max(a, b) / Math.min(a, b); return q >= 1.995 ? q.toFixed(1).replace(/\.0$/, "") + " times" : Math.round((q - 1) * 100) + "%"; }
  function unit(x) { return x.t === "city" ? fmt(x.v) + " people" : fmt(x.v) + " km²"; }

  function dots() {
    $("#dots").innerHTML = pairs.map(function (p, i) {
      var c = i < g.picks.length ? (ok(i) ? "done right" : "done wrong") : i === g.picks.length ? "now" : "";
      return '<li class="' + c + ' k-' + kind(i) + '"><span class="sr">Round ' + (i + 1) + (i < g.picks.length ? (ok(i) ? ": right" : ": wrong") : "") + "</span></li>";
    }).join("");
  }
  function run() { var r = 0; for (var i = 0; i < g.picks.length; i++) r = ok(i) ? r + 1 : 0; return r; }
  var phase = "choose", shownAt = 0;
  function show() {
    var i = g.picks.length;
    dots();
    if (i >= N) return finish();
    var p = pairs[i], k = kind(i);
    $("#round").textContent = (i === N - 1 ? "Final pair" : "Round " + (i + 1) + " of " + N);
    $("#run").textContent = run() ? run() + " in a row" : "";
    $("#ask").textContent = k === "city" ? "Which city has more people?" : "Which country covers more land?";
    [0, 1].forEach(function (j) {
      var b = $("#pick" + j), x = p[j];
      b.className = "pick k-" + k; b.disabled = false;
      b.innerHTML = '<span class="nm">' + x.name + '</span><span class="sb">' + x.sub + '</span><span class="fig" aria-hidden="true"></span>' + (k === "country" ? '<canvas class="bq-shape" aria-hidden="true"></canvas>' : '<span class="bq-pin" aria-hidden="true"></span>');
      b.setAttribute("aria-label", x.name + ", " + x.sub);
    });
    if (k === "country" && window.MXMAP && MXMAP.outline) [0, 1].forEach(function (j) { MXMAP.outline($("#pick" + j + " canvas"), p[j].cid); });
    $("#say").textContent = ""; $("#next").hidden = true; var mm = $("#play canvas.mx-mini"); if (mm) mm.hidden = true; phase = "choose"; shownAt = Date.now();
  }
  function choose(j) {
    if (phase !== "choose" || Date.now() - shownAt < 250) return; // a tap left over from the last round never answers the new pair unseen
    var i = g.picks.length, p = pairs[i], w = p[0].v > p[1].v ? 0 : 1;
    g.picks.push(j); phase = "reveal";
    [0, 1].forEach(function (q) { var b = $("#pick" + q); b.disabled = true; b.classList.add(q === w ? "right" : "wrong"); if (q === j) b.classList.add("mine"); b.querySelector(".fig").textContent = unit(p[q]); });
    var right = j === w, src = kind(i) === "city" ? "urban area population, UN WUP 2025" : "surface area, UN Demographic Yearbook 2023";
    $("#say").innerHTML = (right ? "<b>Right.</b> " : "<b>Not this one.</b> ") + the(p[w].name) + " is " + times(p[0].v, p[1].v) + (kind(i) === "city" ? " bigger by people" : " bigger by land") + ". <span class=\"src\">(" + src + ")</span>";
    if (window.MXMAP) MXMAP.show($("#say"), kind(i) === "city" ? p[0].sub + " " + p[1].sub : p[0].name + " " + p[1].name);
    if (g.picks.length >= N) { save.results[n] = { score: score(), picks: g.picks.slice(), bq: 1 }; save.game = null; } else save.game = g;
    store(); dots();
    $("#run").textContent = run() ? run() + " in a row" : "";
    var nx = $("#next"); nx.hidden = false; nx.textContent = g.picks.length >= N ? "See your result" : "Next pair"; nx.focus({ preventScroll: true });
  }
  function finish() {
    $("#play").hidden = true; $("#done").hidden = false;
    var s = score();
    $("#big").textContent = s;
    $("#doneTitle").textContent = s === 10 ? "Ten out of ten." : s >= 8 ? "A sharp eye for size." : s >= 5 ? "Not bad at all." : "The world is bigger than it looks.";
    $("#bqRecap").innerHTML = pairs.map(function (p, i) {
      var w = p[0].v > p[1].v ? 0 : 1;
      return '<li class="' + (ok(i) ? "r" : "w") + '"><b>' + p[w].name + "</b> " + (kind(i) === "city" ? "has more people than " : "is bigger than ") + p[1 - w].name + ' <span>(' + unit(p[w]) + " v " + unit(p[1 - w]) + ")</span></li>";
    }).join("");
    $("#shareText").textContent = shareText();
    if (window.MX && MX.ev) try { MX.ev("finish", { score: s }); } catch (e) {}
  }
  function shareText() {
    var s = score(), marks = pairs.map(function (_, i) { return ok(i) ? (kind(i) === "city" ? "\u{1F3D9}️" : "\u{1F5FA}️") : "⬜"; }).join("");
    return "Mapelago Bigger? No. " + n + " \u{1F422} " + s + "/10\n" + marks + "\nCity or country, which is bigger? mapelago.com/bigger.html#c-" + n + "-" + s;
  }

  $("#pick0").onclick = function () { choose(0); };
  $("#pick1").onclick = function () { choose(1); };
  $("#next").onclick = function () { show(); };
  document.addEventListener("keydown", function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (phase === "choose" && (e.key === "1" || e.key === "ArrowLeft")) choose(0);
    else if (phase === "choose" && (e.key === "2" || e.key === "ArrowRight")) choose(1);
  });
  $("#shareBtn").onclick = function () { var t = shareText(); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { $("#shareBtn").textContent = "Copied"; }, function () {}); };
  // the test hook: the same shape the old games gave the tests (figures in "pop")
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__big = { S: function () { return { n: n, picks: g.picks, score: score(), pairs: pairs.map(function (p) { return p.map(function (x) { return { name: x.name, country: x.sub, pop: x.v, t: x.t }; }); }) }; }, deal: deal, CITY: CITY, LAND: LAND };
  if (res) { $("#play").hidden = true; finish(); } else show();
})();
