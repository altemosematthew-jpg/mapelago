// Daily Voyage: four short legs a day from Mapelago's strongest games, the same for everyone.
//   1 Pin: Dead Reckoning's rule, one place on a blank map.   2 Bigger: Bigger country?'s rule, one pair.
//   3 Crossing: Crossings' rule, the one country between two others.   4 Rotating: a Fathoms prompt or a Logbook pair.
// Each leg is worth up to 25; one score out of 100, one streak, one share card. Data: daily-data.js (the site's own tables).
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); }, D = window.DV, KEY = "dailycity:dailyvoyage:v1";
  var LOCAL = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var m = LOCAL && /#day-(\d+)/.exec(location.hash), N = m ? +m[1] : (window.MXS ? MXS.today() : 1);
  var save = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })(); save.results = save.results || {};
  function store() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} }
  function rng(a) { return function () { a |= 0; a = a + 0x6d2b79f5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var r = rng(N * 7919 + 4243), pick = function (a) { return a[Math.floor(r() * a.length)]; };
  var W = window.MXS && MXS.weekLevel ? MXS.weekLevel(N) : { f: 1, day: "", word: "" };
  var byCC = {}; D.C.forEach(function (c) { byCC[c[0]] = { cc: c[0], name: c[1], cid: c[2], area: c[3], fame: c[4], cont: c[5], flag: c[6] }; });
  var THE = /^(United States|United Kingdom|United Arab Emirates|Netherlands|Philippines|Bahamas|Gambia|Maldives|Comoros|Seychelles|Central African Republic|Dominican Republic|Czech Republic|Solomon Islands|Marshall Islands|Democratic Republic of the Congo|Republic of the Congo)$/;
  var the = function (n) { return (THE.test(n) ? "the " : "") + n; };
  var adj = {}; D.E.forEach(function (e) { (adj[e[0]] = adj[e[0]] || []).push(e[1]); (adj[e[1]] = adj[e[1]] || []).push(e[0]); });
  function km(a, b) { var R = Math.PI / 180, x = Math.sin((b[0] - a[0]) * R / 2), y = Math.sin((b[1] - a[1]) * R / 2), h = x * x + Math.cos(a[0] * R) * Math.cos(b[0] * R) * y * y; return 12742 * Math.asin(Math.min(1, Math.sqrt(h))); }

  // ---------- the day's four legs (same for everyone) ----------
  var famous = D.C.filter(function (c) { return !c[6]; }).sort(function (a, b) { return b[4] - a[4]; }).slice(0, 120).map(function (c) { return byCC[c[0]]; });
  var LEGS = [];
  // 1. a place: well known on Monday, less so later in the week
  var places = D.P.filter(function (p) { return W.f >= 1.1 ? p[4] === "city" : true; }), place = pick(places);
  LEGS.push({ kind: "pin", name: "Pin", place: place, ask: "Where is " + place[0] + (place[1] ? ", " + place[1] : "") + "?" });
  // 2. a pair of countries: further apart on Monday, closer on Saturday
  var lo = 1 + 0.4 * W.f, hi = lo + 0.6, pair = null;
  for (var t = 0; t < 4000 && !pair; t++) { var a = pick(famous), b = pick(famous), q = Math.max(a.area, b.area) / Math.min(a.area, b.area); if (a !== b && q >= lo && q <= hi) pair = [a, b]; }
  if (N >= 17 && N % 2 && window.BQ_DATA) {
    // from No. 17 the Bigger stop follows Bigger?: on odd numbers a pair of cities, by the UN's urban-area figures
    var CT = BQ_DATA.city, cp = null;
    for (t = 0; t < 4000 && !cp; t++) { var ca = pick(CT), cb = pick(CT), cq = Math.max(ca[2], cb[2]) / Math.min(ca[2], cb[2]); if (ca !== cb && ca[1] !== cb[1] && cq >= lo && cq <= hi) cp = [ca, cb]; }
    LEGS.push({ kind: "pair", name: "Bigger", city: true, pair: cp.map(function (c) { return { name: c[0], cont: c[1], area: c[2] }; }), ask: "Which city has more people?" });
  } else LEGS.push({ kind: "pair", name: "Bigger", pair: pair, ask: "Which covers more land?" });
  // 3. a crossing with one country between: which one links them?
  var cross = null;
  for (t = 0; t < 4000 && !cross; t++) {
    var A = pick(famous), nbA = adj[A.cc] || []; if (!nbA.length) continue;
    var mid = byCC[pick(nbA)]; if (!mid) continue; var nbM = (adj[mid.cc] || []).filter(function (x) { return x !== A.cc && nbA.indexOf(x) < 0 && byCC[x]; }); if (!nbM.length) continue;
    var B = byCC[pick(nbM)], links = nbA.filter(function (x) { return (adj[B.cc] || []).indexOf(x) >= 0 && byCC[x]; });
    var wrong = nbA.concat(adj[B.cc] || []).filter(function (x) { return links.indexOf(x) < 0 && x !== A.cc && x !== B.cc && byCC[x]; });
    wrong = wrong.filter(function (x, i) { return wrong.indexOf(x) === i; });
    if (wrong.length < 3) continue;
    var opts = [links[0]]; while (opts.length < 4) { var w = pick(wrong); if (opts.indexOf(w) < 0) opts.push(w); }
    for (var i = 3; i > 0; i--) { var j = Math.floor(r() * (i + 1)), tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp; }
    cross = { a: A, b: B, links: links, opts: opts };
  }
  LEGS.push({ kind: "cross", name: "Crossing", cross: cross, ask: "Which country lies between " + the(cross.a.name) + " and " + the(cross.b.name) + "?" });
  // 4. rotating: a Fathoms prompt on odd days, a Logbook pair on even days; from No. 17 three in turn, the third being
  //    Voyage's best question (Voyage itself retires): which city is at the mark?
  var ROT = N >= 17 ? ["deep", "first", "mark"][N % 3] : N % 2 ? "deep" : "first";
  if (ROT === "mark") {
    var cities = D.P.filter(function (p) { return p[4] === "city"; }), at = pick(cities), near = [];
    var far = cities.filter(function (p) { var d = km([p[2], p[3]], [at[2], at[3]]); return d > 1500 && d < 7000 && p[1] !== at[1]; });
    while (near.length < 3 && far.length) { var c3 = far.splice(Math.floor(r() * far.length), 1)[0]; if (near.every(function (x) { return km([x[2], x[3]], [c3[2], c3[3]]) > 800; })) near.push(c3); }
    var mopts = [at].concat(near); for (var mi = 3; mi > 0; mi--) { var mj = Math.floor(r() * (mi + 1)), mt = mopts[mi]; mopts[mi] = mopts[mj]; mopts[mj] = mt; }
    LEGS.push({ kind: "mark", name: "Voyage", ask: "Which city is at the mark?", at: at, opts: mopts });
  } else if (ROT === "deep") {
    var fam = pick(D.FAM), ans = fam[1].filter(function (c) { return byCC[c]; }).sort(function (x, y) { return byCC[y].fame - byCC[x].fame; });
    LEGS.push({ kind: "deep", name: "Fathoms", ask: fam[0], answers: ans });
  } else {
    var F = D.F.map(function (f, i) { return f ? [f[0], f[1], f[2], i] : null; }).filter(Boolean), e1, e2;
    for (t = 0; t < 2000 && !e2; t++) { e1 = pick(F); var c2 = pick(F), gap = Math.abs(e1[0] - c2[0]); if (gap >= (e1[2] || c2[2] ? 25 : 18) && gap <= 120) e2 = c2; }
    LEGS.push({ kind: "first", name: "Logbook", ask: "Which came first?", ev: r() < 0.5 ? [e1, e2] : [e2, e1] });
  }

  // ---------- state ----------
  var G = save.game && save.game.n === N ? save.game : { n: N, at: 0, pts: [], tries: 0 };
  function keep() { if (save.results[N]) return; save.game = G; store(); }
  function total() { return G.pts.reduce(function (s, x) { return s + x; }, 0); }
  function mark(p) { return p >= 20 ? "⚓" : p >= 8 ? "\u{1F9ED}" : "\u{1F30A}"; }

  // ---------- the chart: four stops on a short voyage ----------
  function chart() {
    var svg = '<svg viewBox="0 0 320 54" aria-hidden="true"><path d="M20 34 C70 8 110 46 160 26 S250 10 300 30" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5"/>';
    [[20, 34], [113, 31], [207, 20], [300, 30]].forEach(function (p, i) {
      var done = i < G.pts.length, now = i === G.at && !save.results[N];
      svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (now ? 11 : 9) + '" class="' + (done ? "done" : now ? "now" : "") + '"/>';
      svg += '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle">' + (done ? mark(G.pts[i]) : i + 1) + "</text>";
      svg += '<text class="lab" x="' + p[0] + '" y="52" text-anchor="middle">' + LEGS[i].name + "</text>";
    });
    $("#route").innerHTML = svg + "</svg>";
    $("#score").textContent = total();
  }

  // ---------- a blank world map for the pin leg ----------
  var feats = null;
  function decode() {
    if (feats || !window.__WORLD) return; var Wd = window.__WORLD, Tr = Wd.transform;
    var arcs = Wd.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (q) { x += q[0]; y += q[1]; return [x * Tr.scale[0] + Tr.translate[0], y * Tr.scale[1] + Tr.translate[1]]; }); });
    var ring = function (ix) { var o = []; ix.forEach(function (i, n) { var a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; o = o.concat(n ? a.slice(1) : a); }); return o; };
    feats = Wd.objects.countries.geometries.map(function (g) { return g.type === "Polygon" ? [g.arcs.map(ring)] : g.type === "MultiPolygon" ? g.arcs.map(function (p) { return p.map(ring); }) : []; });
  }
  function drawMap(cv, pin, ans) {
    decode(); var w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = w * dpr; cv.height = h * dpr;
    var g = cv.getContext("2d"), cs = getComputedStyle(document.documentElement), col = function (v, d) { return cs.getPropertyValue(v).trim() || d; };
    var P = function (lat, lon) { return [(lon + 180) / 360 * w, (82 - lat) / 140 * h]; };
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = col("--sea", "#dcedf5"); g.fillRect(0, 0, w, h);
    g.strokeStyle = col("--grat", "#c9e1ec"); g.lineWidth = 1; for (var lo = -150; lo <= 150; lo += 30) { var a = P(0, lo); g.beginPath(); g.moveTo(a[0], 0); g.lineTo(a[0], h); g.stroke(); } for (var la = -30; la <= 60; la += 30) { var b = P(la, 0); g.beginPath(); g.moveTo(0, b[1]); g.lineTo(w, b[1]); g.stroke(); }
    if (feats) feats.forEach(function (f) { g.beginPath(); f.forEach(function (p) { p.forEach(function (rg) { rg.forEach(function (q, i) { var s = P(q[1], q[0]); if (i) g.lineTo(s[0], s[1]); else g.moveTo(s[0], s[1]); }); g.closePath(); }); }); g.fillStyle = col("--land", "#f3d98a"); g.fill(); g.strokeStyle = col("--land-line", "#6f5d22"); g.lineWidth = 0.5; g.stroke(); });
    var dot = function (p, c) { var s = P(p[0], p[1]); g.beginPath(); g.arc(s[0], s[1], 6, 0, 6.2832); g.fillStyle = c; g.fill(); g.lineWidth = 2; g.strokeStyle = col("--ink", "#000"); g.stroke(); return s; };
    if (pin && ans) { var s1 = P(pin[0], pin[1]), s2 = P(ans[0], ans[1]); g.setLineDash([4, 4]); g.beginPath(); g.moveTo(s1[0], s1[1]); g.lineTo(s2[0], s2[1]); g.strokeStyle = col("--ink", "#000"); g.stroke(); g.setLineDash([]); }
    if (pin) dot(pin, col("--accent", "#b4237d")); if (ans) dot(ans, "#1a7f37");
    if (cv.mxMark) { var mk = P(cv.mxMark[0], cv.mxMark[1]); g.lineWidth = 3; g.strokeStyle = col("--accent", "#b4237d"); g.beginPath(); g.arc(mk[0], mk[1], 9, 0, 6.2832); g.stroke(); g.beginPath(); g.moveTo(mk[0] - 14, mk[1]); g.lineTo(mk[0] - 5, mk[1]); g.moveTo(mk[0] + 5, mk[1]); g.lineTo(mk[0] + 14, mk[1]); g.moveTo(mk[0], mk[1] - 14); g.lineTo(mk[0], mk[1] - 5); g.moveTo(mk[0], mk[1] + 5); g.lineTo(mk[0], mk[1] + 14); g.stroke(); }
    cv.mxP = function (x, y) { return [82 - y / h * 140, x / w * 360 - 180]; };
  }

  // ---------- the legs ----------
  var busy = false;
  function say(t) { $("#say").textContent = t; }
  function finishLeg(p, why, names) {
    G.pts.push(p); G.tries = 0; busy = true; say(why + " +" + p); keep(); chart();
    if (names && names.length && window.MXMAP) MXMAP.show($("#say"), names.join(" ")); // where the answer is
    $("#next").hidden = false; $("#next").textContent = G.pts.length < 4 ? "Sail on to stop " + (G.pts.length + 1) : "See the voyage";
    $("#next").focus({ preventScroll: true });
  }
  function show() {
    busy = false; $("#next").hidden = true; say(""); chart();
    var mm = document.querySelector("#play canvas.mx-mini"); if (mm) mm.hidden = true;
    if (save.results[N] || G.at >= 4) return done();
    var L = LEGS[G.at], box = $("#leg"); $("#ask").textContent = L.ask; $("#kind").textContent = "Stop " + (G.at + 1) + " of 4 · " + L.name;
    if (L.kind === "pin") {
      box.innerHTML = '<canvas id="pinmap" role="application" aria-label="Blank world map. Tap where you think the place is, then lock it in."></canvas><button class="act" id="lock" disabled>Lock in my pin</button>';
      var cv = $("#pinmap"), pin = null, go = function () { drawMap(cv, pin); };
      if (window.__WORLD) go(); else { var sc = document.createElement("script"); sc.src = document.querySelector('script[src*="daily.js"]').src.replace("daily.js", "world-lite.js"); sc.onload = go; document.head.appendChild(sc); go(); }
      cv.onclick = function (e) { if (busy) return; var rc = cv.getBoundingClientRect(); pin = cv.mxP(e.clientX - rc.left, e.clientY - rc.top); drawMap(cv, pin); $("#lock").disabled = false; };
      $("#lock").onclick = function () { if (busy || !pin) return; var d = km(pin, [L.place[2], L.place[3]]), p = Math.round(25 * Math.exp(-d / 1200)); $("#lock").disabled = true; drawMap(cv, pin, [L.place[2], L.place[3]]); finishLeg(p, Math.round(d).toLocaleString("en-US") + " km off."); };
    } else if (L.kind === "pair") {
      box.innerHTML = L.pair.map(function (c, i) { return '<button class="opt big" data-i="' + i + '"><b>' + c.name + "</b><span>" + c.cont + "</span></button>"; }).join("");
      box.onclick = function (e) { var bt = e.target.closest(".opt"); if (!bt || busy) return; var i = +bt.dataset.i, w = L.pair[0].area > L.pair[1].area ? 0 : 1, ok = i === w, q = L.pair[w].area / L.pair[1 - w].area;
        box.querySelectorAll(".opt").forEach(function (o, k) { o.disabled = true; o.classList.add(k === w ? "right" : k === i ? "wrong" : "other"); o.querySelector("span").textContent = Math.round(L.pair[k].area).toLocaleString("en-US") + (L.city ? " people" : " km²"); });
        finishLeg(ok ? 25 : 0, (ok ? "Right: " : "No: ") + the(L.pair[w].name) + " is " + (q >= 1.995 ? q.toFixed(1) + " times" : Math.round((q - 1) * 100) + "%") + (L.city ? " bigger by people (urban areas, UN 2025)." : " bigger."), L.city ? [L.pair[0].cont, L.pair[1].cont] : [L.pair[0].name, L.pair[1].name]); box.onclick = null; };
    } else if (L.kind === "cross") {
      box.innerHTML = L.cross.opts.map(function (cc) { return '<button class="opt" data-cc="' + cc + '">' + byCC[cc].name + "</button>"; }).join("");
      box.onclick = function (e) { var bt = e.target.closest(".opt"); if (!bt || busy || bt.disabled) return; var ok = L.cross.links.indexOf(bt.dataset.cc) >= 0; bt.disabled = true;
        if (ok) { bt.classList.add("right"); box.querySelectorAll(".opt").forEach(function (o) { o.disabled = true; }); finishLeg(G.tries ? 12 : 25, "Right: " + the(byCC[bt.dataset.cc].name) + " borders both.", [L.cross.a.name, byCC[bt.dataset.cc].name, L.cross.b.name]); box.onclick = null; }
        else if (!G.tries) { bt.classList.add("wrong"); G.tries = 1; say(the(byCC[bt.dataset.cc].name) + " doesn't border both. One more try."); }
        else { bt.classList.add("wrong"); box.querySelectorAll(".opt").forEach(function (o) { o.disabled = true; if (L.cross.links.indexOf(o.dataset.cc) >= 0) o.classList.add("right"); }); finishLeg(0, "It was " + the(byCC[L.cross.links[0]].name) + ".", [L.cross.a.name, byCC[L.cross.links[0]].name, L.cross.b.name]); box.onclick = null; } };
    } else if (L.kind === "mark") {
      box.innerHTML = '<canvas id="pinmap" role="img" aria-label="A world map with one city marked"></canvas>' + L.opts.map(function (p, i) { return '<button class="opt" data-i="' + i + '">' + p[0] + ", " + p[1] + "</button>"; }).join("");
      var mcv = $("#pinmap"); mcv.mxMark = [L.at[2], L.at[3]]; var mgo = function () { drawMap(mcv); };
      if (window.__WORLD) mgo(); else { var ms = document.createElement("script"); ms.src = document.querySelector('script[src*="daily.js"]').src.replace("daily.js", "world-lite.js"); ms.onload = mgo; document.head.appendChild(ms); mgo(); }
      box.onclick = function (e) { var bt = e.target.closest(".opt"); if (!bt || busy || bt.disabled) return; var p = L.opts[+bt.dataset.i], ok = p === L.at; bt.disabled = true;
        if (ok) { bt.classList.add("right"); box.querySelectorAll(".opt").forEach(function (o) { o.disabled = true; }); finishLeg(G.tries ? 12 : 25, "Right: that's " + L.at[0] + "."); box.onclick = null; }
        else if (!G.tries) { bt.classList.add("wrong"); G.tries = 1; say("Not " + p[0] + ". One more try."); }
        else { bt.classList.add("wrong"); box.querySelectorAll(".opt").forEach(function (o) { o.disabled = true; if (L.opts[+o.dataset.i] === L.at) o.classList.add("right"); }); finishLeg(0, "It was " + L.at[0] + ", " + L.at[1] + "."); box.onclick = null; } };
    } else if (L.kind === "deep") {
      box.innerHTML = '<input id="din" list="dlist" autocomplete="off" placeholder="Type a country"><datalist id="dlist">' + D.C.map(function (c) { return "<option value=\"" + c[1] + "\">"; }).join("") + '</datalist><button class="act" id="dgo">Answer</button>';
      var go2 = function () { if (busy) return; var v = $("#din").value.trim().toLowerCase(), c = D.C.filter(function (x) { return x[1].toLowerCase() === v; })[0]; if (!c) { say("Pick a country from the list."); return; }
        var k = L.answers.indexOf(c[0]); $("#din").disabled = true;
        if (k < 0) finishLeg(0, the(c[1]) + " doesn't fit. Deepest was " + the(byCC[L.answers[L.answers.length - 1]].name) + ".");
        else { var p = Math.round(10 + 15 * (L.answers.length > 1 ? k / (L.answers.length - 1) : 1)); finishLeg(p, the(c[1]) + " fits: " + (k + 1) + " of " + L.answers.length + " by how hidden it is."); } };
      $("#dgo").onclick = go2; $("#din").onkeydown = function (e) { if (e.key === "Enter") go2(); };
    } else {
      box.innerHTML = L.ev.map(function (ev, i) { return '<button class="opt" data-i="' + i + '">' + ev[1] + "</button>"; }).join("");
      box.onclick = function (e) { var bt = e.target.closest(".opt"); if (!bt || busy) return; var i = +bt.dataset.i, w = L.ev[0][0] < L.ev[1][0] ? 0 : 1, ok = i === w;
        box.querySelectorAll(".opt").forEach(function (o, k) { o.disabled = true; o.classList.add(k === w ? "right" : k === i ? "wrong" : "other"); o.insertAdjacentHTML("beforeend", " <b>" + L.ev[k][0] + "</b>"); });
        finishLeg(ok ? 25 : 0, ok ? "Right." : "No: the other came first."); box.onclick = null; };
    }
  }
  $("#next").onclick = function () { G.at = G.pts.length; keep(); show(); };

  // ---------- the finish ----------
  function shareText() { var res = save.results[N]; return "Mapelago Daily Voyage No. " + N + " \u{1F422} " + res.score + " of 100\n" + res.pts.map(mark).join("") + "\nFour stops, one voyage. mapelago.com/daily.html"; }
  function done() {
    if (!save.results[N]) { save.results[N] = { score: total(), pts: G.pts.slice() }; delete save.game; store(); ping("done"); }
    // one streak with the retired Voyage's days in it (site.js counts them for the Daily Voyage)
    var res = save.results[N], mine = window.MXS && MXS.info ? MXS.info().filter(function (x) { return x.game.id === "daily"; })[0] : null, st = mine || (window.MXS ? MXS.streak(save.results, N) : { cur: 1, best: 1 });
    $("#play").hidden = true; $("#done").hidden = false; chart();
    $("#big").textContent = res.score; $("#grid").textContent = res.pts.map(mark).join(" ");
    $("#legs").innerHTML = res.pts.map(function (p, i) { return "<li>" + LEGS[i].name + ": " + p + " of 25</li>"; }).join("");
    $("#shareText").textContent = shareText();
    var best = Math.max.apply(null, Object.keys(save.results).map(function (k) { return save.results[k].score; })), y = save.results[N - 1];
    $("#streak").textContent = "Daily Voyage streak: " + st.cur + (st.cur === 1 ? " day" : " days") + ". Your best: " + best + "." + (y ? (res.score > y.score ? " Beat yesterday's " + y.score + "." : " Yesterday: " + y.score + ".") : "") + (window.MXS && MXS.untilNext ? " Next voyage in " + MXS.untilNext() + "." : "");
  }
  $("#imgBtn").onclick = function () { if (window.MXS && MXS.shareCard) MXS.shareCard(); };
  $("#shareBtn").onclick = function () { var t = shareText(); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { say("Copied."); $("#shareBtn").textContent = "Copied"; }, function () {}); };
  // visit counting: a start and a finish each load a tiny counted page (mapelago.com only; see analytics.js)
  function ping(what) { if (location.hostname !== "mapelago.com" && location.hostname !== "www.mapelago.com") return; var f = document.createElement("iframe"); f.hidden = true; f.src = "daily-" + what + ".html"; document.body.appendChild(f); }
  if (!save.results[N] && !G.pts.length) { var started = false; document.addEventListener("click", function () { if (!started) { started = true; ping("start"); } }, { once: true, capture: true }); }
  $("#num").textContent = "No. " + N + (W.word ? " · " + W.day + " · " + W.word : "");
  show();
  if (LOCAL) window.__dv = { N: N, LEGS: LEGS, G: function () { return G; }, total: total, save: function () { return save; } };
})();
