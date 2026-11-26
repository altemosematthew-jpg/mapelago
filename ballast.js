"use strict";
// Ballast: stack countries on a ship's deck. Real outlines at true relative scale within a round,
// 2D physics (matter-js, in vendor/), name each country before you drop it for bonus points.
// Two modes: Daily Ballast (same pieces for everyone, one go a day) and Voyages (levels by region, 1-3 stars).
(function () {
  var M = window.Matter, SHAPES = window.MX_BALLAST;
  M.Common.setDecomp(window.decomp);
  var $ = function (s) { return document.querySelector(s); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "dailycity:ballast:v1";
  var byCC = {}; SHAPES.forEach(function (s) { byCC[s.cc] = s; });
  function fmt(n) { return Number(n).toLocaleString("en-US"); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ---------- levels ----------
  // deck: deck width in view units (the view is 360 wide); swell: rocking in degrees; wind: push to the side;
  // name: "pick" (four choices) or "type"; line: the load line as a share of the height the test bot reached.
  var R = function (id, region, title, list, o) { return Object.assign({ id: id, region: region, title: title, list: list, deck: 230, swell: 0, wind: 0, name: "pick" }, o || {}); };
  var LEVELS = [
    R("eu1", "Europe", "Calm harbour", ["FR", "ES", "DE", "IT", "GB", "PL"]),
    R("eu2", "Europe", "Middle sea", ["PT", "IE", "AT", "CZ", "HU", "GR", "BG"]),
    R("eu3", "Europe", "Low countries", ["NL", "BE", "CH", "DK", "SK", "HR", "RS", "LT"], { swell: 2 }),
    R("eu4", "Europe", "Long coasts", ["NO", "SE", "FI", "IT", "HR", "GR"], { wind: 1 }),
    R("eu5", "Europe", "Balkan squall", ["AL", "MK", "ME", "SI", "MD", "EE", "LV", "BA"], { name: "type", swell: 3, wind: 1, deck: 200 }),
    R("af1", "Africa", "Gulf of Guinea", ["NG", "KE", "ET", "EG", "ZA", "TZ"]),
    R("af2", "Africa", "West wind", ["GH", "CI", "SN", "CM", "UG", "ZM", "ZW"], { wind: 1 }),
    R("af3", "Africa", "Cape rollers", ["SO", "MG", "MZ", "NA", "BW", "AO"], { swell: 3 }),
    R("af4", "Africa", "Small parcels", ["MW", "BJ", "TG", "RW", "BI", "ER", "SL", "LR"], { name: "type", wind: 1 }),
    R("af5", "Africa", "Sahara cargo", ["LY", "SD", "TD", "NE", "ML", "MR", "CD"], { name: "type", swell: 3, deck: 190 }),
    R("as1", "Asia", "Silk road", ["CN", "IN", "KZ", "MN", "IR", "SA"]),
    R("as2", "Asia", "Monsoon", ["VN", "TH", "MM", "LA", "KH", "MY", "JP"], { swell: 2 }),
    R("as3", "Asia", "High passes", ["TR", "IQ", "SY", "AF", "PK", "UZ", "TM"], { wind: 1 }),
    R("as4", "Asia", "Mountain kingdoms", ["JO", "AE", "AZ", "GE", "LK", "BD", "NP", "TJ"], { name: "type", wind: 2 }),
    R("as5", "Asia", "Typhoon season", ["VN", "JP", "KR", "KP", "BT", "PH", "KG", "OM"], { name: "type", swell: 4, wind: 1, deck: 190 }),
    R("am1", "Americas", "Andes freight", ["MX", "CO", "PE", "BO", "VE", "AR"]),
    R("am2", "Americas", "Isthmus", ["GT", "HN", "NI", "CU", "PA", "CR", "EC"], { swell: 2 }),
    R("am3", "Americas", "Giants", ["BR", "AR", "US", "CA", "MX"], { wind: 1, deck: 250 }),
    R("am4", "Americas", "Long and thin", ["CL", "UY", "PY", "EC", "GY", "SR", "PE"], { name: "type", wind: 2 }),
    R("am5", "Americas", "Caribbean chop", ["JM", "HT", "DO", "BZ", "SV", "CR", "PA"], { name: "type", swell: 4, deck: 190 }),
    R("oc1", "Oceania", "Southern cross", ["AU", "PG", "NZ", "ID", "MY", "PH"]),
    R("oc2", "Oceania", "Island hopping", ["FJ", "VU", "SB", "WS", "TO", "TL", "BN"], { name: "type", swell: 3 }),
    R("oc3", "Oceania", "Roaring forties", ["NZ", "PG", "JP", "PH", "MY", "TL", "FJ"], { name: "type", swell: 3, wind: 2, deck: 200 }),
    R("wo1", "World", "Famous outlines", ["IT", "GB", "JP", "EG", "IN", "BR", "AU"]),
    R("wo2", "World", "Odd shapes", ["CL", "NO", "VN", "IT", "PA", "MW", "GM"], { wind: 1 }),
    R("wo3", "World", "Same size, far apart", ["FR", "TH", "KE", "UA", "MG", "CM", "PG"], { name: "type", swell: 2, wind: 1 }),
    R("wo4", "World", "Square-ish", ["EG", "LY", "CO", "MN", "TD", "NE"], { name: "type", swell: 3, wind: 1 }),
    R("wo5", "World", "Big seas", ["CL", "NO", "IT", "VN", "MY", "NZ", "PH", "CR"], { name: "type", swell: 4, wind: 2, deck: 180 }),
    R("wo6", "World", "Grand tour", ["RU", "CA", "CN", "US", "BR", "AU", "IN", "AR"], { name: "type", swell: 2, wind: 1, deck: 260 }),
    R("wo7", "World", "Captain's test", ["NO", "CL", "IT", "GB", "JP", "CU", "NZ", "PA", "MW"], { name: "type", swell: 5, wind: 2, deck: 170 })
  ];
  var REGIONS = ["Europe", "Africa", "Asia", "Americas", "Oceania", "World"];
  LEVELS.forEach(function (l) { l.name = "earn"; }); // on a voyage every piece is earned with a question first
  // The load line rises through each region: the first voyage asks for 80% of the test bot's stack, the fifth 120%;
  // the World voyages run from 90% to 130%.
  (function () { var seen = {}; LEVELS.forEach(function (l) { var i = seen[l.region] = (seen[l.region] || 0) + 1; l.line = l.region === "World" ? [0.9, 0.95, 1, 1.05, 1.1, 1.2, 1.3][i - 1] : [0.8, 0.9, 1, 1.1, 1.2][i - 1]; }); })();
  // Stack heights (km) a simple test bot reached on each voyage (its second-best of four plain strategies).
  // A voyage's load line is that height times the voyage's "line" share; see review/ballast.md.
  var BOT = window.MX_BALLAST_BOT || {};

  // ---------- the daily ---------
  var EPOCH = Date.UTC(2026, 10, 14);
  function today() { return window.MXS ? MXS.today() : Math.round((Date.now() - EPOCH) / 864e5) + 1; }
  // ---------- the level generator: one seed and a difficulty number make a level ----------
  // Used by the Daily climb (seed = the date), Endless practice (a random seed) and nothing else.
  // n = 1 is easy; every step adds a little: more pieces, bigger pieces for the deck, a higher load line,
  // then swell, then wind, then long awkward shapes, and typed names from level 5.
  var GEN_REGIONS = ["Europe", "Africa", "Asia", "Americas", "Oceania", "World"];
  function regionOf(s) { return /America/.test(s.r) ? "Americas" : s.r === "Europe and Asia" ? "Asia" : s.r; }
  function longness(s) { var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; s.p.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }); var w = x1 - x0, h = y1 - y0; return Math.max(w, h) / Math.max(1, Math.min(w, h)); }
  function genLevel(seed, n, attempt) {
    var r = rng(seed * 7919 + n * 104729 + (attempt || 0) * 31), order = shuffle(GEN_REGIONS.slice(0, 5), rng(seed * 13 + 5));
    var region = n % 6 === 0 ? "World" : order[(n - 1) % 5];
    var pool = SHAPES.filter(function (s) { return s.a >= 15000 && (region === "World" || regionOf(s) === region); });
    var count = Math.min(10, 4 + Math.floor(n * 0.6));
    // the first two levels (the day's first nine pieces) use each region's best-known countries
    // (from No. 15, and in practice) those first pieces are also compact: no long thin countries in the first minute
    if (n <= 2 && seed !== 13 && seed !== 14) { var squat = pool.filter(function (s) { return longness(s) <= 1.6; }); if (squat.length >= count + 2) pool = squat; }
    if (n <= 2) { var known = pool.slice().sort(function (a, b) { return b.f - a.f; }).slice(0, 14); if (known.length >= count + 2) pool = known; }
    // pieces of similar size, around a random anchor
    var anchor = pool[Math.floor(r() * pool.length)], near = pool.filter(function (s) { return s.a >= anchor.a / 6 && s.a <= anchor.a * 3; });
    if (near.length < count) near = pool.slice().sort(function (a, b) { return Math.abs(Math.log(a.a / anchor.a)) - Math.abs(Math.log(b.a / anchor.a)); }).slice(0, Math.max(count, 8));
    // from level 7, long thin countries are favoured
    var picks = shuffle(near, r);
    if (n >= 7) picks.sort(function (a, b) { return (longness(b) > 2 ? 1 : 0) - (longness(a) > 2 ? 1 : 0); });
    picks = shuffle(picks.slice(0, count), r);
    // a breather opens every level: the broadest, least awkward piece goes first, as a base
    var base = picks.reduce(function (m, x) { return x.a / Math.pow(longness(x), 2) > m.a / Math.pow(longness(m), 2) ? x : m; }, picks[0]);
    picks = [base].concat(picks.filter(function (x) { return x !== base; }));
    var lv = R("g" + n, region, "Level " + n, picks.map(function (s) { return s.cc; }), {
      deck: Math.max(170, 236 - 5 * n), big: Math.min(0.62, 0.4 + 0.016 * n),
      swell: n < 3 ? 0 : Math.min(5, Math.floor((n - 1) / 2)), wind: n < 4 ? 0 : Math.min(3, Math.floor((n - 1) / 3)),
      name: n >= 5 ? "type" : "pick", climb: n, endAtLine: true
    });
    var est = 0; lv.list.forEach(function (cc) { est += Math.sqrt(byCC[cc].a); });
    lv.lineKm = Math.round(est * 0.27 * Math.min(2.2, 0.8 + 0.09 * n));
    return lv;
  }
  // the five tutorial levels, shown once: each teaches one thing on one screen
  var TUTORIAL = [
    R("t1", "Tutorial", "1 of 5: Drop", ["FR", "ES", "DE"], { tip: "Drag the country, let go to drop it, and hold the stack above the dashed line for 2 seconds.", name: "none", line: 0, lineKm: 900, endAtLine: true, tut: 1 }),
    R("t2", "Tutorial", "2 of 5: Turn", ["IT", "GB", "PL"], { tip: "Tap a country to turn it, and lay the long ones flat.", name: "none", lineKm: 500, endAtLine: true, tut: 2 }),
    R("t3", "Tutorial", "3 of 5: Name it", ["EG", "TR", "NG"], { tip: "After you place a country, name it for bonus points; a wrong guess costs nothing.", name: "pick", lineKm: 900, endAtLine: true, tut: 3 }),
    R("t4", "Tutorial", "4 of 5: Wind", ["TH", "MY", "VN", "KH"], { tip: "Wind pushes the stack to the right, so build a little to the left.", name: "pick", wind: 1, lineKm: 600, endAtLine: true, tut: 4 }),
    R("t5", "Tutorial", "5 of 5: Swell", ["CO", "PE", "BO", "VE"], { tip: "The swell rocks the deck, so keep the stack low and in the middle.", name: "pick", swell: 3, lineKm: 1100, endAtLine: true, tut: 5 })
  ];
  var RUN = null; // { mode: "daily" | "practice" | "tut", seed, lvl, lives, cleared, named, lost, marks: [], attempt }
  function newRun(mode, seed) { return { mode: mode, seed: seed, lvl: 1, lives: 3, cleared: 0, named: 0, lost: 0, marks: [], attempt: 0 }; }
  function runPoints(r) { return r.cleared * 100 + r.named * 10; }
  function cargoPreview(seed) { var l = genLevel(seed, 1); return "Today's cargo starts in " + (l.region === "World" ? "every corner of the world" : l.region === "Americas" ? "the Americas" : l.region) + "."; }

  // ---------- save ----------
  var save = (function () { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === "object") return s; } catch (e) {} return {}; })();
  save.results = save.results && typeof save.results === "object" ? save.results : {};
  save.levels = save.levels && typeof save.levels === "object" ? save.levels : {};
  save.stats = save.stats && typeof save.stats === "object" ? save.stats : {}; // { best, bestPractice, runs, sum }
  function store() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} }

  // ---------- sound (shared mute with the other games) ----------
  var muted = (function () { try { return localStorage.getItem("dailycity:sound") === "off"; } catch (e) { return false; } })(), ac = null;
  function note(f, t0, len, vol, type, to) {
    if (muted) return;
    try {
      if (!ac) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return; ac = new A(); }
      if (ac.state === "suspended") ac.resume();
      var t = ac.currentTime + t0, o = ac.createOscillator(), g = ac.createGain();
      o.type = type || "triangle"; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + len);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime((vol || 0.4) * 0.16, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + len + 0.05);
    } catch (e) {}
  }
  var SFX = {
    drop: function () { note(220, 0, 0.12, 0.35, "sine", 140); },
    land: function () { note(110, 0, 0.08, 0.3, "sine"); },
    right: function () { note(659, 0, 0.1); note(880, 0.08, 0.16); },
    wrong: function () { note(196, 0, 0.18, 0.35, "sine"); },
    splash: function () { note(500, 0, 0.3, 0.25, "sine", 90); },
    line: function () { [523, 659, 784, 1047].forEach(function (f, i) { note(f, i * 0.1, i === 3 ? 0.4 : 0.12, 0.45); }); },
    fail: function () { [392, 330, 262].forEach(function (f, i) { note(f, i * 0.15, 0.24, 0.35, "sine"); }); }
  };
  var ICON_ON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  function drawMute() { var b = $("#soundBtn"); b.innerHTML = muted ? ICON_OFF : ICON_ON; b.setAttribute("aria-pressed", muted ? "true" : "false"); b.setAttribute("aria-label", muted ? "Sound is off. Turn sound on" : "Sound is on. Turn sound off"); }

  // ---------- names (for the naming bonus) ----------
  var ALIAS = { US: ["usa", "united states of america", "america"], GB: ["uk", "britain", "great britain"], TR: ["turkey", "turkiye"], CZ: ["czech republic"], MM: ["burma"], CI: ["cote d'ivoire", "ivory coast"], CD: ["dr congo", "drc", "democratic republic of the congo"], CG: ["congo", "republic of the congo"], NL: ["holland"], KR: ["korea", "south korea"], KP: ["north korea"], AE: ["uae"], TL: ["east timor", "timor-leste"], MK: ["macedonia"], SZ: ["swaziland"], CV: ["cape verde"] };
  function norm(x) { return String(x).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’'`.\-]/g, " ").replace(/\bthe\b/g, " ").replace(/\bsaint\b/g, "st").replace(/\s+/g, " ").trim(); }
  var NAMES = []; SHAPES.forEach(function (s) { NAMES.push([norm(s.n), s.cc]); (ALIAS[s.cc] || []).forEach(function (a) { NAMES.push([norm(a), s.cc]); }); });
  function suggest(t) {
    var n = norm(t); if (!n) return [];
    var seen = {}, out = [];
    NAMES.forEach(function (x) { if (!seen[x[1]] && (x[0].indexOf(n) === 0 || x[0].indexOf(" " + n) >= 0)) { seen[x[1]] = 1; out.push(x[1]); } });
    return out.sort(function (a, b) { return (norm(byCC[a].n).indexOf(n) === 0 ? 0 : 1) - (norm(byCC[b].n).indexOf(n) === 0 ? 0 : 1) || (byCC[a].n < byCC[b].n ? -1 : 1); }).slice(0, 5);
  }
  function exact(t) { var n = norm(t), hit = NAMES.filter(function (x) { return x[0] === n; })[0]; return hit ? hit[1] : null; }

  // ---------- the world ----------
  // World units: the view is 360 wide and 520 tall at zoom 1; the deck top is y = 0 and the sea starts at y = 26.
  var VW = 360, VH = 520, WATER = 26, DECK_Y = 0, HOLD = 2000;
  var cv = $("#sea"), cx = cv.getContext("2d"), touched = false, listA = 0, sinkV = 0;
  var dropping = null, engine, world, ship, pieces, hover, L, S, raf = 0, last = 0, acc = 0, time = 0, state = "idle";
  var zoom = 1, holdT = 0, fallT = 0, stillT = 0, cheerT = 0, lastBody = null;

  function deckW() { return L.deck * 1.28; }
  function scaleFor(list, deck, share) {
    // one km-to-unit scale for the whole round, so sizes are in true proportion: the biggest piece is about half the deck
    var big = 0; list.forEach(function (cc) { var s = byCC[cc]; big = Math.max(big, s.u * 100); });
    return deck * (share || 0.45) / big;
  }
  // a wrong answer on a voyage swaps the country for a plain crate about a third of its size
  function localOutline(s, k, crate) {
    if (crate) { var w = Math.sqrt(s.a * 0.35 * 1.6) * k, h = w / 1.6; return [{ x: -w / 2, y: -h / 2 }, { x: w / 2, y: -h / 2 }, { x: w / 2, y: h / 2 }, { x: -w / 2, y: h / 2 }]; }
    return s.p.map(function (q) { return { x: q[0] * s.u * k, y: q[1] * s.u * k }; });
  }
  function makeBody(s, k, x, y, ang, crate) {
    var out = localOutline(s, k, crate);
    // grippy, no bounce, a little air drag: a dropped country lands with a thud and stays put
    var opt = { friction: 0.9, frictionStatic: 2.5, frictionAir: 0.03, restitution: 0, density: 0.0015, slop: 0.04 };
    var b = M.Bodies.fromVertices(0, 0, [out], opt, true, 0.01, 0.05);
    if (!b) b = M.Bodies.fromVertices(0, 0, [M.Vertices.hull(out.map(function (v) { return { x: v.x, y: v.y }; }))], opt);
    // keep the drawn outline lined up with the body (the library recentres it on the centre of mass)
    var bx = [Infinity, Infinity, -Infinity, -Infinity];
    (b.parts.length > 1 ? b.parts.slice(1) : [b]).forEach(function (p) { p.vertices.forEach(function (v) { bx[0] = Math.min(bx[0], v.x); bx[1] = Math.min(bx[1], v.y); bx[2] = Math.max(bx[2], v.x); bx[3] = Math.max(bx[3], v.y); }); });
    var ob = [Infinity, Infinity, -Infinity, -Infinity]; out.forEach(function (v) { ob[0] = Math.min(ob[0], v.x); ob[1] = Math.min(ob[1], v.y); ob[2] = Math.max(ob[2], v.x); ob[3] = Math.max(ob[3], v.y); });
    var dx = (bx[0] + bx[2]) / 2 - (ob[0] + ob[2]) / 2 - b.position.x, dy = (bx[1] + bx[3]) / 2 - (ob[1] + ob[3]) / 2 - b.position.y;
    b.mxOutline = out.map(function (v) { return { x: v.x + dx, y: v.y + dy }; });
    M.Body.setPosition(b, { x: x, y: y }); M.Body.setAngle(b, ang || 0);
    b.mxCC = s.cc; b.mxCrate = !!crate;
    return b;
  }
  function halfHeight(h) { var o = localOutline(h.s, S.k, h.crate), c = Math.cos(h.ang), sn = Math.sin(h.ang), m = 0; o.forEach(function (v) { m = Math.max(m, Math.abs(v.x * sn + v.y * c)); }); return m; }
  function halfWidth(h) { var o = localOutline(h.s, S.k, h.crate), c = Math.cos(h.ang), sn = Math.sin(h.ang), m = 0; o.forEach(function (v) { m = Math.max(m, Math.abs(v.x * c - v.y * sn)); }); return m; }

  function start(level) {
    stop();
    L = level;
    S = { i: 0, k: 1, named: [], lost: [], kept: [], over: false, judged: false, cleared: false, height: 0, wrong: 0 };
    S.k = scaleFor(L.list, deckW(), L.big);
    engine = M.Engine.create({ gravity: { x: 0, y: 1, scale: 0.0009 }, positionIterations: 10, velocityIterations: 8, enableSleeping: !L.swell && !L.wind });
    world = engine.world; pieces = [];
    var deck = M.Bodies.rectangle(0, DECK_Y + 7, deckW(), 14, { isStatic: true, label: "deck" }), railH = 16;
    // rails at both ends of the deck hold a piece that slides, not one that topples
    var rails = [-1, 1].map(function (sd) { return M.Bodies.rectangle(sd * (deckW() / 2 - 3), DECK_Y - railH / 2, 6, railH, { isStatic: true, label: "rail" }); });
    ship = M.Body.create({ parts: [deck].concat(rails), isStatic: true, friction: 1, frictionStatic: 3 });
    M.Composite.add(world, ship);
    L.lineKm = L.lineKm || Math.round((BOT[L.id] || estimateLine(L)) * L.line);
    if (L.spare == null) L.spare = L.tut ? 99 : 2; // how many countries may be lost to the sea before the load fails
    zoom = 1; holdT = 0; time = 0; stillT = 0; cheerT = 0; lastBody = null; listA = 0; sinkV = 0;
    $("#lvlTitle").textContent = RUN && RUN.mode === "daily" ? "Daily Ballast · Level " + RUN.lvl : RUN && RUN.mode === "practice" ? "Practice · Level " + RUN.lvl : RUN && RUN.mode === "captain" ? "Captain's run · Level " + RUN.lvl : L.title;
    $("#lvlMeta").textContent = (RUN && RUN.mode !== "tut" ? "♥".repeat(RUN.lives) + "♡".repeat(3 - RUN.lives) + " · " : "") + L.region + " · " + L.list.length + " countries" + (L.swell ? " · swell" : "") + (L.wind ? " · wind" : "");
    $("#lvlMeta").setAttribute("aria-label", (RUN && RUN.mode !== "tut" ? RUN.lives + " of 3 lives. " : "") + L.region + ", " + L.list.length + " countries, load line " + L.lineKm + " kilometres");
    $("#tip").hidden = !L.tip; $("#tip").textContent = L.tip || ""; $("#skipTut").hidden = !(RUN && RUN.mode === "tut");
    $("#nameBox").hidden = L.name === "none"; $("#nameBox").dataset.mode = L.name === "type" ? "type" : "pick";
    asked = null; dropping = null; $("#dropBtn").hidden = false; $("#contBtn").hidden = true;
    $("#play").hidden = false; $("#done").hidden = true; $("#chart").hidden = true;
    resize();
    next();
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; if (engine) M.Engine.clear(engine); engine = null; }
  function estimateLine(level) {
    // no measured value (the generator): the test bot's stacks reach about a quarter of the pieces' summed square-root areas
    var k = 0; level.list.forEach(function (cc) { k += Math.sqrt(byCC[cc].a); }); return k * 0.27;
  }

  // ---------- one piece at a time ----------
  // In the Daily and practice the name question is about the country just placed, and never holds up the next piece.
  // On a voyage each piece is earned first (see renderEarn).
  var asked = null; // { s, answer: null | true | false, body }
  function lastCall() { // the load is over: one last chance to name the final country, then Continue
    hover = null;
    if (!asked || asked.answer !== null || L.name === "none" || L.name === "earn") { finish(); return; }
    state = "last"; $("#dropBtn").hidden = true; $("#contBtn").hidden = false; renderHud();
  }
  function cont() { if (state !== "last") return; if (asked && asked.answer === null) markName(false, true); $("#contBtn").hidden = true; $("#dropBtn").hidden = false; finish(); }
  function next() {
    if (S.i >= L.list.length) { hover = null; state = "wait"; renderHud(); return; } // all aboard: the stack must hold, or settle below the line
    hover = { s: byCC[L.list[S.i]], x: 0, y: null, ang: 0, crate: false };
    if (L.name === "earn") { state = "earn"; renderEarn(); } else { state = "aim"; if (!asked) renderName(); }
    renderHud();
  }
  function vhUnits() { return cv.width ? cv.height / cv.width * VW : VH; }
  function viewTop() { return DECK_Y + 70 - vhUnits() / zoom; }
  function stackTop(resting) { var top = DECK_Y; pieces.forEach(function (b) { if (!b.mxGone && (!resting || b.speed < 0.8)) top = Math.min(top, b.bounds.min.y); }); return top; }
  // a new piece waits just above the stack (not at the top of the view), so a plain drop is gentle on any screen size
  function homeY() { return Math.max(viewTop() + halfHeight(hover) + 6, stackTop() - 34 - halfHeight(hover)); }
  function hoverPos() { return { x: hover.x, y: hover.y == null ? homeY() : hover.y }; }
  // where the piece in hand would first touch if it fell straight down from the top (the landing ghost, and the lowest you can hold it)
  var ghostBody = null, ghostKey = "";
  function landY() {
    if (!hover || !world) return null;
    var key = hover.s.cc + "|" + hover.crate + "|" + hover.ang.toFixed(3) + "|" + Math.round(hover.x) + "|" + pieces.length + "|" + S.lost.length + "|" + S.i;
    if (key === ghostKey) return hover.gy;
    ghostKey = key;
    var bk = hover.s.cc + "|" + hover.crate + "|" + hover.ang.toFixed(3);
    if (!ghostBody || ghostBody.mxKey !== bk) { ghostBody = makeBody(hover.s, S.k, 0, 0, hover.ang, hover.crate); ghostBody.mxKey = bk; }
    var others = M.Composite.allBodies(world), y = Math.min(stackTop(), DECK_Y) - 30 - 2 * halfHeight(hover), stop = DECK_Y + 80, hit = false;
    for (; y < stop; y += 2.5) { M.Body.setPosition(ghostBody, { x: hover.x, y: y }); if (M.Query.collides(ghostBody, others).length) { hit = true; break; } }
    hover.gy = hit ? y - 2.5 : null;
    return hover.gy;
  }
  function untilMidnight() { var n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), mins = Math.max(0, Math.round((m - n) / 60000)); return Math.floor(mins / 60) + "h " + (mins % 60) + "m"; }
  function clampHover() {
    var hw = halfWidth(hover);
    hover.x = Math.max(-VW / 2 / zoom + Math.min(hw, 40), Math.min(VW / 2 / zoom - Math.min(hw, 40), hover.x));
    if (hover.y != null) { var g = landY(), lo = viewTop() + halfHeight(hover) + 2; hover.y = Math.max(lo, g == null ? hover.y : Math.min(hover.y, g - 1)); }
  }
  function drop() {
    touched = true;
    if (state !== "aim" || !hover) return;
    clampHover();
    var at = hoverPos(), b = makeBody(hover.s, S.k, at.x, at.y, hover.ang, hover.crate);
    pieces.push(b); M.Composite.add(world, b); lastBody = b;
    b.mxShow = L.name === "earn" || L.name === "none";      // its name shows once it's named (or straight away where there's no question to spoil)
    S.kept.push(hover.s.cc);
    if (asked && asked.answer === null && L.name !== "none") markName(false, true); // the earlier question lapses
    dropping = hover.s; hover = null;
    state = "fall"; fallT = 0;
    $("#dropBtn").disabled = true;
    SFX.drop();
  }
  function overboard(b) { return b.position.y > DECK_Y + WATER + 16 || Math.abs(b.position.x) > VW; } // lost only when it's in the water
  function settled() { return pieces.every(function (b) { return b.mxGone || b.isSleeping || (b.speed < 0.1 && b.angularSpeed < 0.008); }); }
  function heightKm() { return Math.max(0, Math.round((DECK_Y - stackTop(true)) / S.k)); }
  function need() { return L.climb ? Math.ceil(L.list.length / 2) : L.tut ? 2 : 1; } // in the climb the line only counts once half the cargo is aboard
  function endLevel(ok) {
    if (S.judged) return;
    S.judged = true; S.cleared = ok; S.height = heightKm(); hover = null;
    if (ok) { SFX.line(); turtle("swim"); state = "cheer"; cheerT = 0; } else lastCall();
  }

  function step(dt) {
    time += dt;
    // swell rocks the deck; with reduced motion it sits at a fixed tilt instead
    var sw = L.swell * Math.PI / 180, ang = reduce ? sw * 0.6 : sw * Math.sin(time / 1300);
    M.Body.setAngle(ship, ang, true);
    pieces.forEach(function (b) {
      if (b.mxGone || b.isSleeping) return;
      if (L.wind) M.Body.applyForce(b, b.position, { x: b.mass * L.wind * 0.00009 * (0.6 + 0.4 * Math.sin(time / 2100) + (reduce ? 0 : 0.3 * Math.sin(time / 370))), y: 0 });
      // spin dies away quickly, so a piece tips and rests instead of rolling along the deck
      if (Math.abs(b.angularVelocity) > 1e-4) M.Body.setAngularVelocity(b, b.angularVelocity * 0.955);
    });
    M.Engine.update(engine, dt);
    pieces.forEach(function (b) {
      if (!b.mxGone && overboard(b)) { b.mxGone = true; M.Composite.remove(world, b); S.lost.push(b.mxCC); SFX.splash(); toast((b.mxShow ? byCC[b.mxCC].n : "A country") + " went overboard." + (L.tut ? "" : S.lost.length > L.spare ? "" : " " + (L.spare - S.lost.length) + " more may be lost.")); renderHud(); }
    });
    if (state === "cheer") { cheerT += dt; if (cheerT > 900) lastCall(); return; }
    if (S.judged) return;
    if (state === "fall") {
      fallT += dt;
      // the piece has landed once it slows (or hits the water): thud, then the next piece is yours at once
      if (fallT > 250 && (!lastBody || lastBody.mxGone || lastBody.speed < 0.9 || fallT > 1600)) {
        if (lastBody && !lastBody.mxGone) SFX.land();
        S.i++;
        if (L.name !== "none" && L.name !== "earn") { asked = { s: dropping, answer: null, body: lastBody }; renderName(); }
        $("#dropBtn").disabled = false;
        next();
      }
    }
    var h = heightKm(); S.height = h;
    if (S.lost.length > L.spare) { endLevel(false); return; }
    // the goal: the stack must stand above the line for two seconds
    if (h >= L.lineKm && S.i >= need() && state !== "fall") holdT += dt; else if (h < L.lineKm || state !== "fall") holdT = 0;
    if (holdT >= HOLD) { endLevel(true); return; }
    if (state === "wait") { stillT = settled() ? stillT + dt : 0; if (stillT > 1200 && h < L.lineKm) { endLevel(false); return; } }
    if ((time / (1000 / 60) | 0) % 6 === 0) renderHud();
  }
  var fpsNow = 60;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    var dt = Math.min(64, now - last); last = now;
    if (dt > 0) fpsNow += (1000 / dt - fpsNow) * 0.05;
    if (engine && !S.over) { acc += dt; while (acc >= 1000 / 60) { step(1000 / 60); acc -= 1000 / 60; if (S.over) break; } }
    draw();
  }

  // ---------- drawing ----------
  var css = function (v, d) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || d; };
  var turtleImg = new Image(); turtleImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(window.MX_TURTLE_SVG || "");
  // the whole game on one screen: the sea takes whatever height the rest of the play area leaves
  function fit() {
    var play = $("#play"); if (!play || play.hidden) return;
    cv.style.height = "";
    var rest = play.getBoundingClientRect().height - cv.getBoundingClientRect().height, top = play.getBoundingClientRect().top + window.scrollY;
    cv.style.height = Math.max(220, Math.min(640, Math.floor(window.innerHeight - top - rest - 6))) + "px";
  }
  function resize() {
    fit();
    var w = cv.clientWidth || 360, hgt = cv.clientHeight || 520, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(hgt * dpr);
  }
  function draw() {
    if (!L || !S) return;
    var W = cv.width, H = cv.height, k = W / VW;
    // the view keeps the deck at the bottom and zooms out smoothly so the top of the stack, the line and the piece in hand all fit
    var lineY = DECK_Y - L.lineKm * S.k, room = hover ? 2 * halfHeight(hover) + 60 : 50;
    var wantTop = Math.min(stackTop(), lineY - 26) - room, target = Math.max(0.42, Math.min(1, (vhUnits() - 70) / (DECK_Y - wantTop)));
    zoom = reduce ? target : zoom + (target - zoom) * 0.07;
    var vh = H / k, top = DECK_Y + 70 - vh / zoom; // the canvas may be shorter than 520 units on small screens
    var X = function (x) { return (x * zoom + VW / 2) * k; }, Y = function (y) { return (y - top) * zoom * k; }, kz = k * zoom;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    // The ship reacts to its load: it sits lower as the stack grows and lists toward the heavy side. This is drawing only
    // (the ship, its load line and the stack move together), so the physics and every score stay exactly as they were.
    var ld = Math.max(0, Math.min(1.2, S.height / L.lineKm)), mass = 0, mx = 0;
    pieces.forEach(function (b) { if (!b.mxGone && b.speed < 1.5) { mass += b.mass; mx += b.mass * b.position.x; } });
    var lean = mass ? Math.max(-1, Math.min(1, 3 * mx / mass / (deckW() / 2))) : 0, ease = reduce ? 1 : 0.04;
    listA += (0.035 * lean * Math.min(1, ld * 1.2) - listA) * ease; sinkV += (5 * ld - sinkV) * ease;
    var pvx = X(0), pvy = Y(WATER), ca = Math.cos(listA), sa = Math.sin(listA);
    var shipFrame = function () { cx.setTransform(ca, sa, -sa, ca, pvx - pvx * ca + pvy * sa, pvy - pvx * sa - pvy * ca + sinkV * kz); }, seaFrame = function () { cx.setTransform(1, 0, 0, 1, 0, 0); };
    cx.fillStyle = css("--sea", "#ffffff"); cx.fillRect(0, 0, W, H);
    cx.strokeStyle = css("--grat", "#c9e1ec"); cx.lineWidth = 1;
    for (var gx = -VW; gx <= VW; gx += 30) { cx.beginPath(); cx.moveTo(X(gx), 0); cx.lineTo(X(gx), H); cx.stroke(); }
    for (var gy = Math.ceil(top / 30) * 30; gy < top + vh / zoom; gy += 30) { cx.beginPath(); cx.moveTo(0, Y(gy)); cx.lineTo(W, Y(gy)); cx.stroke(); }
    var font = css("--font", "sans-serif"), ink = css("--ink", "#000"), accent = css("--accent", "#b4237d");
    // the load line: dashed until the stack is over it, then solid while it holds
    shipFrame();
    var over = S.height >= L.lineKm && S.i >= need(), cleared = S.judged && S.cleared;
    cx.strokeStyle = accent; cx.lineWidth = (over || cleared ? 3.5 : 2) * k / 1.5;
    cx.setLineDash(over || cleared ? [] : [8 * k / 2, 6 * k / 2]);
    cx.beginPath(); cx.moveTo(0, Y(lineY)); cx.lineTo(W, Y(lineY)); cx.stroke(); cx.setLineDash([]);
    cx.fillStyle = accent; cx.font = "800 " + 12 * k + "px " + font;
    cx.fillText("Load line · " + fmt(L.lineKm) + " km", 6 * k, Y(lineY) - 5 * k);
    // the sea
    seaFrame();
    var wave = reduce ? 0 : 3 * Math.sin(time / 600);
    cx.fillStyle = css("--tint-2", "#a9d3e8");
    cx.beginPath(); cx.moveTo(0, Y(WATER + wave)); for (var sx = -VW; sx <= VW; sx += 20) cx.lineTo(X(sx), Y(WATER + wave + (reduce ? 0 : 2.5 * Math.sin(sx / 30 + time / 500)))); cx.lineTo(W, H); cx.lineTo(0, H); cx.closePath(); cx.fill();
    // the ship
    shipFrame();
    var dk = ship.parts[1]; cx.save(); cx.translate(X(dk.position.x), Y(dk.position.y)); cx.rotate(ship.angle);
    var dw = deckW() * kz, u = kz;
    cx.fillStyle = "#8a5a2b"; cx.strokeStyle = ink; cx.lineWidth = 2 * k / 1.2;
    cx.beginPath(); cx.moveTo(-dw / 2 - 10 * u, -7 * u); cx.lineTo(dw / 2 + 16 * u, -7 * u); cx.lineTo(dw / 2 - 6 * u, 34 * u); cx.lineTo(-dw / 2 + 4 * u, 34 * u); cx.closePath(); cx.fill(); cx.stroke();
    cx.fillStyle = "#c08a50"; cx.fillRect(-dw / 2, -7 * u, dw, 6 * u); cx.strokeRect(-dw / 2, -7 * u, dw, 6 * u);
    [-1, 1].forEach(function (sd) { cx.fillRect(sd * (dw / 2 - 3 * u) - 3 * u, -23 * u, 6 * u, 16 * u); cx.strokeRect(sd * (dw / 2 - 3 * u) - 3 * u, -23 * u, 6 * u, 16 * u); });
    if (turtleImg.complete && turtleImg.naturalWidth) cx.drawImage(turtleImg, dw / 2 + 2 * u, -36 * u, 28 * u, 28 * u);
    cx.restore();
    function shape(out, px, py, a, fill, alpha) {
      cx.save(); cx.translate(X(px), Y(py)); cx.rotate(a);
      cx.beginPath(); out.forEach(function (v, i) { (i ? cx.lineTo : cx.moveTo).call(cx, v.x * kz, v.y * kz); }); cx.closePath();
      cx.globalAlpha = alpha == null ? 1 : alpha; cx.fillStyle = fill; cx.fill();
      cx.lineJoin = "round"; cx.strokeStyle = ink; cx.lineWidth = 1.6 * k / 1.2; cx.stroke();
      cx.restore();
    }
    function label(t, px, py) {
      cx.font = "700 " + Math.max(9, 10.5 * zoom) * k + "px " + font; cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.lineWidth = 3 * k; cx.strokeStyle = css("--paper", "#fff"); cx.lineJoin = "round"; cx.strokeText(t, X(px), Y(py)); cx.fillStyle = ink; cx.fillText(t, X(px), Y(py));
      cx.textAlign = "left"; cx.textBaseline = "alphabetic";
    }
    // the stack, each country named once it has been named (or placed, where there's no question to spoil)
    var land = css("--land", "#f3d98a");
    pieces.forEach(function (b) { if (!b.mxGone) shape(b.mxOutline, b.position.x, b.position.y, b.angle, b.mxCrate ? "#d9c7a3" : land); });
    pieces.forEach(function (b) { if (!b.mxGone && b.mxShow) label(b.mxCrate ? "crate" : byCC[b.mxCC].n, b.position.x, b.position.y); });
    // the piece in hand, its landing ghost and a guide down to it
    if (hover && (state === "aim" || state === "earn")) {
      var at = hoverPos(), o = localOutline(hover.s, S.k, hover.crate), gy = landY();
      if (state === "aim" && gy !== null && gy > at.y + 6) {
        cx.strokeStyle = css("--muted", "#6b777e"); cx.setLineDash([3 * k, 4 * k]); cx.lineWidth = 1;
        cx.beginPath(); cx.moveTo(X(at.x), Y(at.y)); cx.lineTo(X(at.x), Y(gy)); cx.stroke(); cx.setLineDash([]);
        shape(o, at.x, gy, hover.ang, accent, 0.25);
      }
      if (state === "aim" && L.tut === 1 && S.i === 0 && !touched) { // first visit: show what to grab
        var pulse = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(time * 5), rad = (Math.max(halfWidth(hover), halfHeight(hover)) + 8 + 5 * pulse) * zoom * k;
        cx.strokeStyle = accent; cx.lineWidth = 3 * k; cx.setLineDash([6 * k, 5 * k]); cx.beginPath(); cx.arc(X(at.x), Y(at.y), rad, 0, 6.2832); cx.stroke(); cx.setLineDash([]);
        cx.font = "800 " + 13 * k + "px " + font; cx.textAlign = "center"; cx.fillStyle = ink; cx.fillText("Drag me, then let go", X(at.x), Y(at.y) - rad - 6 * k); cx.textAlign = "left";
      }
      shape(o, at.x, at.y, hover.ang, state === "earn" ? css("--muted", "#6b777e") : hover.crate ? "#d9c7a3" : accent, state === "earn" ? 0.55 : 0.9);
    }
    // read-outs: the stack against the line, the hold countdown, the finish
    var gx0 = W - 14 * k, gh = Y(DECK_Y) - Y(lineY), frac = Math.max(0, Math.min(1, S.height / L.lineKm));
    cx.fillStyle = css("--paper", "#fff"); cx.strokeStyle = ink; cx.lineWidth = 1.5 * k / 1.2;
    cx.fillRect(gx0, Y(lineY), 8 * k, gh); cx.strokeRect(gx0, Y(lineY), 8 * k, gh);
    cx.fillStyle = accent; cx.fillRect(gx0, Y(DECK_Y) - gh * frac, 8 * k, gh * frac);
    // a tick and the figure at the stack's highest point, so the reading and the drawing can be compared at a glance
    if (S.height > 0 && !cleared) { var ty = Y(DECK_Y - S.height * S.k); cx.strokeStyle = ink; cx.lineWidth = 1.5 * k / 1.2; cx.beginPath(); cx.moveTo(gx0 - 26 * k, ty); cx.lineTo(gx0 + 8 * k, ty); cx.stroke(); cx.fillStyle = ink; cx.font = "700 " + 10 * k + "px " + font; cx.textAlign = "right"; cx.fillText(fmt(S.height) + " km", gx0 - 2 * k, ty - 3 * k); }
    seaFrame();
    cx.textAlign = "center"; cx.fillStyle = ink;
    if (cleared) { var pulse = reduce ? 1 : 1 + 0.12 * Math.sin(cheerT / 90); cx.font = "800 " + 30 * k * pulse + "px " + font; cx.fillStyle = accent; cx.fillText("Loaded!", W / 2, Y(lineY) - 22 * k); }
    else if (holdT > 0) { cx.font = "800 " + 24 * k + "px " + font; cx.fillStyle = accent; cx.fillText("Hold " + Math.max(0, (HOLD - holdT) / 1000).toFixed(1), W / 2, Y(lineY) - 22 * k); }
    cx.textAlign = "left";
    // the next country, small, in the corner
    var ni = S.i + (hover || state === "fall" ? 1 : 0), nx = L.list[ni] && byCC[L.list[ni]];
    if (nx && !S.judged) {
      var bw = 46 * k, bx = W - bw - 28 * k, by = 8 * k, sc = 34 * k / 100;
      cx.fillStyle = css("--paper", "#fff"); cx.strokeStyle = ink; cx.lineWidth = 1.5 * k / 1.2;
      cx.beginPath(); cx.rect(bx, by, bw, bw + 12 * k); cx.fill(); cx.stroke();
      cx.fillStyle = css("--ink-2", "#3d4a52"); cx.font = "700 " + 9.5 * k + "px " + font; cx.textAlign = "center"; cx.fillText("Next", bx + bw / 2, by + 11 * k); cx.textAlign = "left";
      cx.save(); cx.translate(bx + bw / 2, by + 12 * k + bw / 2);
      cx.beginPath(); nx.p.forEach(function (q, i) { (i ? cx.lineTo : cx.moveTo).call(cx, q[0] * sc, q[1] * sc); }); cx.closePath();
      cx.fillStyle = land; cx.fill(); cx.strokeStyle = ink; cx.lineWidth = 1; cx.stroke(); cx.restore();
    }
  }

  // ---------- naming ----------
  function renderName() {
    var box = $("#nameBox");
    box.classList.remove("right", "wrong"); $("#nameSay").textContent = "";
    if (!asked) { $("#nameQ").textContent = "Place a country, then name it for +" + nameBonus() + "."; $("#nameOpts").hidden = true; $("#nameType").hidden = true; return; }
    var s = asked.s;
    $("#nameQ").textContent = "Which country did you just place? (+" + nameBonus() + ")";
    $("#nameSay").textContent = "";
    if (L.name === "pick") {
      $("#nameType").hidden = true; $("#nameOpts").hidden = false;
      var r = rng(((RUN && RUN.seed) || 7) * 131 + S.i * 17 + s.cc.charCodeAt(0) + (L.climb || 0) * 7);
      var same = SHAPES.filter(function (x) { return x.cc !== s.cc && (x.r === s.r) && x.a > 2000; });
      if (same.length < 3) same = SHAPES.filter(function (x) { return x.cc !== s.cc && x.a > 2000; });
      var opts = shuffle([s].concat(shuffle(same, r).slice(0, 3)), r);
      $("#nameOpts").innerHTML = opts.map(function (o) { return '<button type="button" class="opt" data-cc="' + o.cc + '">' + o.n + "</button>"; }).join("");
    } else {
      $("#nameOpts").hidden = true; $("#nameType").hidden = false;
      $("#nin").value = ""; $("#nin").disabled = false; $("#nsugs").innerHTML = "";
    }
    box.classList.remove("right", "wrong");
  }
  function markName(ok, skipped) {
    if (!asked || asked.answer !== null) return;
    asked.answer = ok; S.named.push(ok ? 1 : 0); if (asked.body) asked.body.mxShow = true;
    var s = asked.s, box = $("#nameBox");
    box.classList.add(ok ? "right" : "wrong");
    $("#nameSay").textContent = ok ? "Right: " + s.n + ". +" + nameBonus() : skipped ? "Unnamed: that was " + s.n + "." : "It's " + s.n + ".";
    Array.prototype.forEach.call(document.querySelectorAll("#nameOpts .opt"), function (b) { b.disabled = true; if (b.dataset.cc === s.cc) b.classList.add("is"); });
    $("#nin").disabled = true;
    if (!skipped) (ok ? SFX.right : SFX.wrong)();
    renderHud();
  }
  // ---------- voyages: each piece is earned with a question about that country ----------
  // Four choices. A right answer gives you the country; a wrong one costs nothing but gives a plain crate, about a third
  // of the size, in its place. Kinds: which country is this outline; its capital; its continent; one of its neighbours.
  var CONT = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
  function earnQuestion(s, r) {
    var kinds = ["shape"]; if (s.c) kinds.push("capital"); if (s.nb && s.nb.length) kinds.push("neighbour"); if (CONT.indexOf(s.r) >= 0) kinds.push("continent");
    var kind = kinds[Math.floor(r() * kinds.length)], others = SHAPES.filter(function (x) { return x.cc !== s.cc && x.a > 2000; }), q;
    if (kind === "shape") { var same = others.filter(function (x) { return x.r === s.r; }); q = { ask: "Which country is this?", right: s.n, opts: shuffle(same.length >= 3 ? same : others, r).slice(0, 3).map(function (x) { return x.n; }), why: "This is " + s.n + "." }; }
    else if (kind === "capital") { var caps = shuffle(others.filter(function (x) { return x.c && x.c !== s.c && x.r === s.r; }), r).slice(0, 3).map(function (x) { return x.c; }); q = { ask: "What is the capital of " + s.n + "?", right: s.c, opts: caps, why: "The capital of " + s.n + " is " + s.c + "." }; }
    else if (kind === "continent") { q = { ask: "Which continent is " + s.n + " in?", right: s.r, opts: shuffle(CONT.filter(function (c) { return c !== s.r; }), r).slice(0, 3), why: s.n + " is in " + s.r + "." }; }
    else { var nbr = byCC[s.nb[Math.floor(r() * s.nb.length)]], not = shuffle(others.filter(function (x) { return s.nb.indexOf(x.cc) < 0 && x.r === s.r; }), r).slice(0, 3).map(function (x) { return x.n; }); q = { ask: "Which of these borders " + s.n + "?", right: nbr.n, opts: not, why: nbr.n + " borders " + s.n + "." }; }
    if (q.opts.length < 3) return earnQuestion(s, function () { return 0; }); // fall back to the outline question
    q.kind = kind; q.all = shuffle([q.right].concat(q.opts), r);
    return q;
  }
  var earnQ = null;
  function renderEarn() {
    earnQ = earnQuestion(hover.s, rng(S.i * 53 + hover.s.cc.charCodeAt(0) * 7 + hover.s.cc.charCodeAt(1) + LEVELS.indexOf(L) * 101));
    var box = $("#nameBox"); box.classList.remove("right", "wrong");
    $("#nameQ").textContent = "Earn this country: " + earnQ.ask; $("#nameSay").textContent = "";
    $("#nameType").hidden = true; $("#nameOpts").hidden = false;
    $("#nameOpts").innerHTML = earnQ.all.map(function (o, i) { return '<button type="button" class="opt" data-earn="' + i + '">' + o + "</button>"; }).join("");
  }
  function earn(i) {
    if (state !== "earn" || !earnQ) return;
    var ok = earnQ.all[i] === earnQ.right, box = $("#nameBox");
    S.named.push(ok ? 1 : 0); if (!ok) { S.wrong++; hover.crate = true; ghostKey = ""; }
    box.classList.add(ok ? "right" : "wrong");
    $("#nameSay").textContent = ok ? "Right. " + hover.s.n + " is yours: drag it aboard." : "Not quite. " + earnQ.why + " A plain crate instead.";
    Array.prototype.forEach.call(document.querySelectorAll("#nameOpts .opt"), function (b, k) { b.disabled = true; if (earnQ.all[k] === earnQ.right) b.classList.add("is"); });
    (ok ? SFX.right : SFX.wrong)();
    state = "aim"; renderHud();
  }

  // a name is worth 10 points in a Daily or practice run (where the levels are the score) and 100 on a voyage
  function nameBonus() { return RUN ? 10 : 100; }
  function answer(cc) { if (!asked || asked.answer !== null || (state !== "aim" && state !== "last")) return; markName(cc === asked.s.cc); if (state === "last") setTimeout(function () { if (state === "last") finish(); }, 700); }

  // ---------- HUD, end ----------
  function named() { return S.named.reduce(function (a, b) { return a + b; }, 0); }
  function points() { return heightKm() + 100 * named(); }
  function renderHud() {
    $("#hPieces").textContent = Math.max(0, L.list.length - S.i - (state === "fall" ? 1 : 0));
    $("#hHeight").textContent = fmt(S.height) + " of " + fmt(L.lineKm);
    $("#hNamed").textContent = named();
    $("#hLost").textContent = L.tut ? S.lost.length : S.lost.length + " of " + L.spare;
  }
  function stars() {
    if (!S.cleared) return 0;
    return 1 + (S.lost.length === 0 ? 1 : 0) + (S.named.length > 0 && S.wrong === 0 && named() === S.named.length ? 1 : 0); // every question right
  }
  function finish() {
    S.over = true; state = "done";
    S.height = heightKm();
    if (RUN) { runStep(); return; }
    // a voyage
    var st = stars(), pts = S.height + 100 * named();
    if (st) SFX.line(); else SFX.fail();
    turtle(st ? "swim" : "peek");
    var prev = save.levels[L.id] || { stars: 0, best: 0 };
    save.levels[L.id] = { stars: Math.max(prev.stars, st), best: Math.max(prev.best, pts) }; store();
    $("#doneTitle").textContent = st ? (st === 3 ? "Three stars. A perfect load." : "Loaded to the line.") : S.lost.length > L.spare ? "Too much went overboard." : "Below the line this time.";
    $("#doneStars").hidden = false; $("#doneStars").textContent = "★".repeat(st) + "☆".repeat(3 - st);
    $("#doneStars").setAttribute("aria-label", st + " of 3 stars");
    $("#bigScore").textContent = fmt(pts); $("#bigUnit").textContent = "points";
    $("#doneLine").textContent = "Stack " + fmt(S.height) + " km (load line " + fmt(L.lineKm) + " km) · " + named() + " of " + S.named.length + " questions right · " + S.lost.length + " overboard.";
    $("#doneWhy").textContent = "Stars: hold the stack above the line; nothing overboard; every question right.";
    $("#shareText").hidden = true; $("#shareBtn").hidden = true;
    var idx = LEVELS.indexOf(L), nx = LEVELS[idx + 1];
    $("#nextLvl").hidden = !(st && nx); if (nx) $("#nextLvl").textContent = "Next voyage: " + nx.title;
    $("#retryBtn").hidden = false; $("#retryBtn").textContent = "Try this voyage again";
    showDone();
  }
  function showDone() {
    $("#play").hidden = true; $("#done").hidden = false; renderChart();
    setTimeout(function () { var t = $("#doneTitle"); t.setAttribute("tabindex", "-1"); t.focus(); }, 30);
  }
  // one level of a run (daily, practice or tutorial) has ended
  function runStep() {
    var ok = S.cleared, r = RUN;
    if (r.mode !== "tut" && (ok || !r.pic)) r.pic = stackShot(); // the picture of the day: the last stack that stood
    r.named += named(); r.lost += S.lost.length;
    if (r.mode === "tut") {
      if (ok) { SFX.line(); r.lvl++; } else { SFX.fail(); toast("Not quite: try that one again."); }
      if (r.lvl > TUTORIAL.length) { save.tut = 1; store(); RUN = null; toast("That's the tutorial. Here is today's Daily Ballast."); startDaily(); return; }
      setTimeout(function () { if (RUN === r) start(TUTORIAL[r.lvl - 1]); }, ok ? 700 : 1100); return;
    }
    if (ok) { r.cleared++; r.marks.push(S.lost.length ? "\u{1F7E8}" : "\u{1F7E9}"); r.lvl++; r.attempt = 0; SFX.line(); turtle("swim"); toast("Level " + (r.lvl - 1) + " loaded. On to level " + r.lvl + "."); }
    else { r.lives--; r.marks.push("\u{1F7E5}"); r.attempt++; SFX.fail(); turtle("peek"); if (r.lives > 0) toast("Below the line. " + r.lives + (r.lives === 1 ? " life" : " lives") + " left: a fresh cargo for level " + r.lvl + "."); }
    if (r.mode === "daily") { save.run = { day: dayNo, lvl: r.lvl, lives: r.lives, cleared: r.cleared, named: r.named, lost: r.lost, marks: r.marks, attempt: r.attempt, pic: r.pic }; store(); }
    if (r.lives > 0) { setTimeout(function () { if (RUN === r) start(runLevel(r)); }, 900); return; }
    endRun();
  }
  function endRun() {
    var r = RUN, pts = runPoints(r), reached = r.cleared + 1, st = save.stats;
    if (r.mode === "daily") {
      if (!save.results[dayNo]) {
        save.results[dayNo] = { score: pts, lvl: r.cleared, named: r.named, lost: r.lost, marks: r.marks.join(""), pic: r.pic };
        Object.keys(save.results).forEach(function (d) { if (+d < dayNo - 13 && save.results[d]) delete save.results[d].pic; }); // keep two weeks of pictures
        st.runs = (st.runs || 0) + 1; st.sum = (st.sum || 0) + r.cleared; st.best = Math.max(st.best || 0, r.cleared);
      }
      delete save.run;
    } else if (r.mode === "captain") {
      save.captain = save.captain || {}; if (!save.captain[dayNo]) save.captain[dayNo] = { lvl: r.cleared, score: pts };
      st.bestCaptain = Math.max(st.bestCaptain || 0, r.cleared);
    } else st.bestPractice = Math.max(st.bestPractice || 0, r.cleared);
    store();
    var res = r.mode === "daily" ? save.results[dayNo] : { score: pts, lvl: r.cleared, named: r.named, marks: r.marks.join("") };
    $("#doneTitle").textContent = r.mode === "daily" ? "The stack gave out on level " + (res.lvl + 1) + "." : r.mode === "captain" ? "Captain's run over on level " + reached + "." : "Practice over on level " + reached + ".";
    $("#doneStars").hidden = true;
    $("#bigScore").textContent = res.lvl; $("#bigUnit").textContent = res.lvl === 1 ? "level cleared" : "levels cleared";
    $("#doneLine").textContent = fmt(res.score) + " points: " + res.lvl + " × 100 for the levels + " + res.named + " × 10 for the names.";
    $("#doneWhy").textContent = r.mode === "daily" ? statsLine() + " Next climb in " + untilMidnight() + ". Endless practice and the voyages are open any time." : r.mode === "captain" ? "The Captain's run is a Sunday extra on a harder sea: it never changes your Daily Ballast or your streak. Your best: " + (st.bestCaptain || 0) + " levels. Back next Sunday." : "Practice doesn't count for your streak. Best practice run: " + (st.bestPractice || 0) + " levels.";
    var share = $("#shareText"), sb = $("#shareBtn");
    share.hidden = sb.hidden = r.mode !== "daily";
    if (r.mode === "daily") share.textContent = shareText(dayNo, res);
    $("#nextLvl").hidden = true; $("#retryBtn").hidden = r.mode !== "practice"; $("#retryBtn").textContent = "Another practice run";
    RUN = null;
    showDone();
  }
  // ---------- today's cargo: the stack as a small picture (outlines only, no names) ----------
  function stackShot() {
    var out = [];
    pieces.forEach(function (b) {
      if (b.mxGone || b.position.y > DECK_Y + 40) return;
      var c = Math.cos(b.angle), s = Math.sin(b.angle), row = [];
      b.mxOutline.forEach(function (v) { row.push(Math.round(b.position.x + v.x * c - v.y * s), Math.round(b.position.y + v.x * s + v.y * c - DECK_Y)); });
      out.push(row);
    });
    return { d: Math.round(deckW()), p: out };
  }
  function drawShot(c2, pic, x, y, w, h) {
    if (!pic || !pic.p) return false;
    var x0 = -pic.d / 2 - 14, x1 = pic.d / 2 + 14, y0 = -20, y1 = 26;
    pic.p.forEach(function (row) { for (var i = 0; i < row.length; i += 2) { x0 = Math.min(x0, row[i]); x1 = Math.max(x1, row[i]); y0 = Math.min(y0, row[i + 1]); } });
    var k = Math.min(w / (x1 - x0), h / (y1 - y0)), ox = x + (w - (x1 - x0) * k) / 2 - x0 * k, oy = y + h - y1 * k;
    c2.save(); c2.lineJoin = "round"; c2.lineWidth = Math.max(1.5, k * 1.6); c2.strokeStyle = "#000";
    c2.fillStyle = "#a9d3e8"; c2.fillRect(x, oy + 16 * k, w, h - (oy + 16 * k - y)); // the sea
    c2.fillStyle = "#8a5a2b"; c2.beginPath(); c2.moveTo(ox + (-pic.d / 2 - 12) * k, oy); c2.lineTo(ox + (pic.d / 2 + 12) * k, oy); c2.lineTo(ox + (pic.d / 2 - 4) * k, oy + 24 * k); c2.lineTo(ox + (-pic.d / 2 + 4) * k, oy + 24 * k); c2.closePath(); c2.fill(); c2.stroke();
    c2.fillStyle = "#f3d98a";
    pic.p.forEach(function (row) { c2.beginPath(); for (var i = 0; i < row.length; i += 2) (i ? c2.lineTo : c2.moveTo).call(c2, ox + row[i] * k, oy + row[i + 1] * k); c2.closePath(); c2.fill(); c2.stroke(); });
    c2.restore(); return true;
  }
  // the shared result card draws the stack instead of a row of marks
  window.MX_SHARE_ART = function (c2, box) { var r = save.results[dayNo]; return !!(r && r.pic) && drawShot(c2, r.pic, box.x, box.y, box.w, box.h); };
  function cargoPic() {
    var r = save.results[dayNo], c = $("#cargoPic"), fig = $("#cargoFig"); if (!c || !fig) return;
    fig.hidden = !(r && r.pic); if (fig.hidden) return;
    var g = c.getContext("2d"); g.clearRect(0, 0, c.width, c.height); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); drawShot(g, r.pic, 8, 8, c.width - 16, c.height - 16);
  }
  function statsLine() { var st = save.stats; return st.runs ? "Your best: level " + (st.best || 0) + " cleared. Average over " + st.runs + (st.runs === 1 ? " run: " : " runs: ") + (Math.round((st.sum || 0) / st.runs * 10) / 10) + "." : ""; }
  function shareText(n, res) {
    var t = "Mapelago Ballast No. " + n + " \u{1F422} " + fmt(res.score) + " points\n" + String(res.marks || "").replace(/\u{1F7E9}|\u{1F7E8}/gu, "\u{1F4E6}").replace(/\u{1F7E5}/gu, "\u{1F30A}") + "\nLoaded " + res.lvl + (res.lvl === 1 ? " level" : " levels") + " · named " + res.named + (res.named === 1 ? " country" : " countries") + "\n" + ((window.MXCOPY && MXCOPY.invite && MXCOPY.invite.ballast) || "How high can you load it?") + " mapelago.com/ballast.html#c-" + n + "-" + res.score;
    return window.MXS && MXS.beat ? MXS.beat.upgrade(t) : t;
  }
  function startDaily() {
    if (save.results[dayNo]) { home(); return; }
    var sv = save.run && save.run.day === dayNo ? save.run : null;
    RUN = newRun("daily", dayNo);
    if (sv) { RUN.lvl = sv.lvl; RUN.lives = sv.lives; RUN.cleared = sv.cleared; RUN.named = sv.named; RUN.lost = sv.lost; RUN.marks = sv.marks || []; RUN.attempt = sv.attempt || 0; RUN.pic = sv.pic || null; }
    start(genLevel(RUN.seed, RUN.lvl, RUN.attempt));
  }
  // The Captain's run: on Sundays, one extra run on a harder sea (the Daily's level 5 is its level 1: swell and wind
  // from the first load). It has its own result and best; the Daily Ballast, its score and the streak are untouched.
  var CAPTAIN = 4;
  function isSunday(n) { return new Date(EPOCH + (n - 1) * 864e5).getUTCDay() === 0; }
  function runLevel(r) { return genLevel(r.seed, r.lvl + (r.mode === "captain" ? CAPTAIN : 0), r.attempt); }
  function startCaptain() {
    if (!isSunday(dayNo) || (save.captain && save.captain[dayNo])) { home(); return; }
    RUN = newRun("captain", dayNo * 7 + 3); start(runLevel(RUN));
  }
  function startPractice() { RUN = newRun("practice", Math.floor(Math.random() * 1e9)); start(genLevel(RUN.seed, 1, 0)); }
  function startTutorial() { RUN = newRun("tut", 0); start(TUTORIAL[0]); }
  function home() {
    stop(); RUN = null; $("#play").hidden = true; $("#done").hidden = true; $("#chart").hidden = false; renderChart();
    var r = save.results[dayNo], d = $("#dailyBtn");
    d.disabled = !!r; d.textContent = r ? "Daily Ballast done: " + r.lvl + (r.lvl === 1 ? " level" : " levels") + " cleared" : save.run && save.run.day === dayNo ? "Carry on today's Daily Ballast (level " + save.run.lvl + ")" : "Play today's Daily Ballast";
    $("#dailyNote").hidden = false;
    $("#dailyNote").textContent = (r ? "Next climb in " + untilMidnight() + ". " : cargoPreview(dayNo) + " ") + statsLine();
    $("#homeShare").hidden = !r; if (r) $("#homeShareText").textContent = shareText(dayNo, r);
    cargoPic();
    var cb = $("#captainBtn"), cr = save.captain && save.captain[dayNo];
    if (cb) { cb.hidden = !isSunday(dayNo); cb.disabled = !!cr; cb.textContent = cr ? "Captain's run done: " + cr.lvl + (cr.lvl === 1 ? " level" : " levels") + " on the harder sea" : "Sunday's Captain's run: a harder sea"; }
  }

  // ---------- the level chart ----------
  function unlocked(i) { if (i === 0) return true; var p = LEVELS[i - 1]; return !!(save.levels[p.id] && save.levels[p.id].stars) || LEVELS[i].id.slice(-1) === "1"; }
  function renderChart() {
    var total = 0;
    $("#chartList").innerHTML = REGIONS.map(function (rg) {
      return '<li class="region"><h3>' + rg + '</h3><ol class="lv">' + LEVELS.map(function (l, i) {
        if (l.region !== rg) return "";
        var s = (save.levels[l.id] || {}).stars || 0, open = unlocked(i); total += s;
        return '<li><button type="button" class="lvbtn' + (s ? " done" : "") + '" data-i="' + i + '"' + (open ? "" : " disabled") + ' aria-label="' + l.title + (open ? ", " + s + " of 3 stars" : ", locked") + '"><b>' + (LEVELS.filter(function (x, j) { return x.region === rg && j <= i; }).length) + "</b><span>" + l.title + '</span><i aria-hidden="true">' + (open ? "★".repeat(s) + "☆".repeat(3 - s) : "\u{1F512}") + "</i></button></li>";
      }).join("") + "</ol></li>";
    }).join("");
    $("#chartStars").textContent = total + " of " + LEVELS.length * 3 + " stars";
  }

  // ---------- turtle and toast ----------
  function turtle(move) {
    var t = $("#logoMascot svg"); if (!t || reduce || !t.animate) return;
    if (move === "swim") t.animate([{ transform: "translate(0,0) rotate(0)" }, { transform: "translate(6px,-5px) rotate(8deg)" }, { transform: "translate(-6px,-5px) rotate(-8deg)" }, { transform: "translate(0,0)" }], { duration: 700, iterations: 3 });
    if (move === "peek") t.animate([{ transform: "translateY(0)" }, { transform: "translateY(7px) scale(.94)" }, { transform: "translateY(0)" }], { duration: 650 });
  }
  var tT = 0;
  function toast(t) { var el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(tT); tT = setTimeout(function () { el.classList.remove("show"); }, 1800); }

  // ---------- input ----------
  function move(dx, dy) { if (state !== "aim" || !hover) return; if (dy) hover.y = hoverPos().y + dy; hover.x += dx; clampHover(); }
  function turn(d) { if (state === "aim" && hover) { hover.ang += d * Math.PI / 12; clampHover(); } } // 15 degrees a step
  // Space and Enter belong to a focused button, unless that button is switched off (an answered name choice keeps focus)
  function onLiveButton(e) { var t = e.target || {}; return t.tagName === "BUTTON" && !t.disabled; }
  function init() {
    $("#logoMascot").innerHTML = window.MX_TURTLE_SVG;
    drawMute();
    $("#soundBtn").onclick = function () { muted = !muted; try { localStorage.setItem("dailycity:sound", muted ? "off" : "on"); } catch (e) {} drawMute(); if (!muted) SFX.right(); };
    resize(); window.addEventListener("resize", function () { if (document.activeElement !== $("#nin")) resize(); });
    // Direct handling: press anywhere and drag, and the country follows the finger one for one, in both directions;
    // let go and it drops from exactly there. A tap or click without a drag turns it 15 degrees.
    var grab = null;
    cv.addEventListener("pointerdown", function (e) {
      touched = true;
      if (state !== "aim" || !hover) return;
      var at = hoverPos(); grab = { id: e.pointerId, px: e.clientX, py: e.clientY, hx: at.x, hy: at.y, moved: false };
      try { cv.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault();
    });
    cv.addEventListener("pointermove", function (e) {
      if (!grab || e.pointerId !== grab.id || state !== "aim" || !hover) return;
      var r = cv.getBoundingClientRect(), f = VW / r.width / zoom, dx = e.clientX - grab.px, dy = e.clientY - grab.py;
      if (Math.abs(dx) + Math.abs(dy) > 6) grab.moved = true;
      if (!grab.moved) return;
      hover.x = grab.hx + dx * f; hover.y = grab.hy + dy * f; clampHover();
    });
    cv.addEventListener("pointerup", function (e) { if (!grab || e.pointerId !== grab.id) return; var m = grab.moved; grab = null; if (m) drop(); else turn(1); });
    cv.addEventListener("pointercancel", function () { grab = null; });
    $("#leftBtn").onclick = function () { move(-10); };
    $("#rightBtn").onclick = function () { move(10); };
    $("#ccwBtn").onclick = function () { turn(-1); };
    $("#cwBtn").onclick = function () { turn(1); };
    $("#helpBtn").onclick = function () { var d = $("#helpDlg"); if (d.showModal) d.showModal(); else d.setAttribute("open", ""); };
    $("#helpClose").onclick = function () { var d = $("#helpDlg"); if (d.close) d.close(); else d.removeAttribute("open"); };
    $("#dropBtn").onclick = drop; $("#contBtn").onclick = cont;
    window.addEventListener("keydown", function (e) {
      if (/^(INPUT|TEXTAREA)$/.test((e.target || {}).tagName)) return;
      if (state === "last" && (e.key === " " || e.key === "Enter") && !onLiveButton(e)) { cont(); e.preventDefault(); return; }
      if (state !== "aim") return;
      if (e.key === "ArrowLeft") { move(e.shiftKey ? -3 : -8); e.preventDefault(); }
      else if (e.key === "ArrowRight") { move(e.shiftKey ? 3 : 8); e.preventDefault(); }
      else if (e.key === "ArrowUp") { move(0, e.shiftKey ? -3 : -8); e.preventDefault(); }
      else if (e.key === "ArrowDown") { move(0, e.shiftKey ? 3 : 8); e.preventDefault(); }
      else if (e.key === "q" || e.key === "Q") { turn(-1); e.preventDefault(); }
      else if (e.key === "e" || e.key === "E") { turn(1); e.preventDefault(); }
      else if ((e.key === " " || e.key === "Enter") && !onLiveButton(e)) { drop(); e.preventDefault(); }
    });
    $("#nameOpts").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.earn != null) earn(+b.dataset.earn); else answer(b.dataset.cc); });
    var sel = 0, opts = [];
    function showSugs() { opts = suggest($("#nin").value); sel = 0; $("#nsugs").innerHTML = opts.map(function (cc, i) { return '<li role="option" aria-selected="' + (i === sel) + '"><button type="button" class="sug' + (i === sel ? " on" : "") + '" data-cc="' + cc + '" tabindex="-1">' + byCC[cc].n + "</button></li>"; }).join(""); }
    $("#nin").addEventListener("input", showSugs);
    $("#nin").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); var cc = exact($("#nin").value) || opts[sel]; if (cc) { answer(cc); $("#nsugs").innerHTML = ""; } }
      else if (e.key === "ArrowDown" && opts.length) { sel = (sel + 1) % opts.length; showSugsMark(); e.preventDefault(); }
      else if (e.key === "ArrowUp" && opts.length) { sel = (sel - 1 + opts.length) % opts.length; showSugsMark(); e.preventDefault(); }
    });
    function showSugsMark() { Array.prototype.forEach.call($("#nsugs").children, function (li, i) { li.setAttribute("aria-selected", i === sel); li.firstChild.classList.toggle("on", i === sel); }); }
    $("#nsugs").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { answer(b.dataset.cc); $("#nsugs").innerHTML = ""; } });
    $("#shareBtn").onclick = async function () {
      var t = $("#shareText").textContent, b = this;
      try { if (navigator.share && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)) { await navigator.share({ text: t }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(t); b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy result"; }, 1600); } catch (e) { window.prompt("Copy your result:", t); }
    };
    $("#retryBtn").onclick = function () { if (LEVELS.indexOf(L) >= 0) start(L); else startPractice(); };
    $("#nextLvl").onclick = function () { var i = LEVELS.indexOf(L); if (LEVELS[i + 1]) start(LEVELS[i + 1]); };
    $("#skipTut").hidden = true;
    $("#chartBtn").onclick = $("#chartBtn2").onclick = home;
    $("#dailyBtn").onclick = startDaily;
    $("#practiceBtn").onclick = startPractice; if ($("#captainBtn")) $("#captainBtn").onclick = startCaptain;
    $("#tutBtn").onclick = startTutorial;
    $("#skipTut").onclick = function () { save.tut = 1; store(); RUN = null; startDaily(); };
    $("#homeShareBtn").onclick = async function () { var t = $("#homeShareText").textContent, b = this; try { await navigator.clipboard.writeText(t); b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy result"; }, 1600); } catch (e) { window.prompt("Copy your result:", t); } };
    // a new day while the page is open: offer it, never interrupt a run
    setInterval(function () { if (today() !== dayNo && !dm) { $("#fresh").hidden = false; } else if (!$("#chart").hidden && save.results[dayNo]) $("#dailyNote").textContent = "Next climb in " + untilMidnight() + ". " + statsLine(); }, 30000);
    $("#chartList").addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (b && !b.disabled) { RUN = null; start(LEVELS[+b.dataset.i]); } });
    renderChart();
    // first visit: the tutorial; then today's run, unless it's already played
    if (!save.tut && !Object.keys(save.results).length && !Object.keys(save.levels).length) startTutorial();
    else if (save.results[dayNo]) home();
    else startDaily();
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__ballast = {
      // test bot helpers: lay the piece flat, and run the physics until it settles, without waiting for frames
      flat: function () { if (!hover) return; var best = 0, bh = Infinity, o = localOutline(hover.s, S.k, hover.crate); for (var i = 0; i < 24; i++) { var a = i * Math.PI / 12, c = Math.cos(a), sn = Math.sin(a), lo = 0, hi = 0; o.forEach(function (v) { var y = v.x * sn + v.y * c; lo = Math.max(lo, y); hi = Math.min(hi, y); }); var h = lo * 2 + (lo - hi) * 0.3; if (h < bh) { bh = h; best = a; } } hover.ang = best; },
      // run the physics (no frames needed) until the dropped piece has landed and any hold countdown or final judging is over
      settle: function () { for (var n = 0; n < 1500 && !S.over && (state === "fall" || state === "wait" || state === "cheer" || holdT > 0); n++) step(1000 / 60); return state; },
      earn: function (right) { if (state === "earn") earn(right === false ? earnQ.all.findIndex(function (o) { return o !== earnQ.right; }) : earnQ.all.indexOf(earnQ.right)); }, earnQ: function () { return earnQ; }, hold: function () { return holdT; }, zoom: function () { return zoom; },
      L: function () { return L; }, S: function () { return S; }, LEVELS: LEVELS, start: start, gen: genLevel, run: function () { return RUN; }, voyage: function (i) { RUN = null; start(LEVELS[i]); }, hover: function () { return hover ? [hover.x, hover.ang, hoverPos().y, !!hover.crate] : null; }, cont: cont, asked: function () { return asked && asked.answer === null ? asked.s.cc : null; }, ghost: function () { return hover ? landY() : null; }, until: untilMidnight, tick: function (n) { for (var i = 0; i < n; i++) step(1000 / 60); }, shipAngle: function () { return ship.angle; }, fps: function () { return fpsNow; }, startDaily: startDaily, hint: function () { return state === "aim" && L.tut === 1 && S.i === 0 && !touched; }, startPractice: startPractice, startTutorial: startTutorial, home: home, TUTORIAL: TUTORIAL, drop: drop, answer: answer, move: move, turn: turn, state: function () { return state; }, height: heightKm, pieces: function () { return pieces; }, finish: finish, list: function () { return [listA, sinkV]; }, draw: draw, captain: function () { return [isSunday(dayNo), save.captain || {}]; }, startCaptain: startCaptain, sunday: isSunday, shot: stackShot, drawShot: drawShot, save: function () { return save; } };
  }
  var dayNo = today();
  var dm = /^#day-(\d+)$/.exec(location.hash);
  if (dm && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) dayNo = Number(dm[1]);
  init();
  if (location.protocol !== "file:" && "serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
