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
  // name: "pick" (four choices) or "type"; line: the load line as a share of the stack the test bot reached.
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
  // The load line rises through each region: the first voyage asks for 80% of the test bot's stack, the fifth 120%;
  // the World voyages run from 90% to 130%.
  (function () { var seen = {}; LEVELS.forEach(function (l) { var i = seen[l.region] = (seen[l.region] || 0) + 1; l.line = l.region === "World" ? [0.9, 0.95, 1, 1.05, 1.1, 1.2, 1.3][i - 1] : [0.8, 0.9, 1, 1.1, 1.2][i - 1]; }); })();
  // Stack heights (km) a simple test bot reached on each voyage (its second-best of four plain strategies).
  // A voyage's load line is that height times the voyage's "line" share; see review/ballast.md.
  var BOT = window.MX_BALLAST_BOT || {};

  // ---------- the daily ---------
  var EPOCH = Date.UTC(2026, 10, 14);
  function today() { return window.MXS ? MXS.today() : Math.round((Date.now() - EPOCH) / 864e5) + 1; }
  function dailyLevel(n) {
    var r = rng(n * 977 + 31), pool = SHAPES.filter(function (s) { return s.a >= 40000 && s.a <= 2500000; });
    var anchor = pool[Math.floor(r() * pool.length)], lo = anchor.a / 5, hi = anchor.a * 2.5;
    var near = shuffle(pool.filter(function (s) { return s.a >= lo && s.a <= hi && s.cc !== anchor.cc; }), r).slice(0, 9);
    var list = shuffle([anchor].concat(near), r).map(function (s) { return s.cc; });
    var opts = [[230, 0, 0], [220, 2, 0], [220, 0, 1], [210, 2, 1], [200, 3, 1], [200, 3, 2], [190, 4, 1]][(6 + n - 1) % 7]; // calm Monday to rough Sunday
    return R("daily", "Daily", "Daily Ballast No. " + n, list, { deck: opts[0], swell: opts[1], wind: opts[2], name: "pick", daily: n, line: 1 });
  }

  // ---------- save ----------
  var save = (function () { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === "object") return s; } catch (e) {} return {}; })();
  save.results = save.results && typeof save.results === "object" ? save.results : {};
  save.levels = save.levels && typeof save.levels === "object" ? save.levels : {};
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
  var VW = 360, VH = 400;           // view size in world units; the canvas is scaled to fit
  var DECK_Y = 0;                    // top of the deck
  var cv = $("#sea"), cx = cv.getContext("2d");
  var engine, world, ship, rails, pieces, current, hover, L, S, camY = 0, raf = 0, last = 0, acc = 0, time = 0, settleT = 0, state = "idle", ttl = 0;

  function scaleFor(list, deck) {
    // one km-to-unit scale for the whole round: the biggest piece is ~45% of the deck wide
    var big = 0; list.forEach(function (cc) { var s = byCC[cc]; big = Math.max(big, s.u * 100); });
    return deck * 0.45 / big;
  }
  function localOutline(s, k) { return s.p.map(function (q) { return { x: q[0] * s.u * k, y: q[1] * s.u * k }; }); }
  function makeBody(s, k, x, y, ang) {
    var out = localOutline(s, k);
    var opt = { friction: 1, frictionStatic: 3, frictionAir: 0.045, restitution: 0, density: 0.0015, slop: 0.03 };
    // keep even small convex parts (the library drops parts under 10 square units by default)
    var b = M.Bodies.fromVertices(0, 0, [out], opt, true, 0.01, 0.05);
    if (!b) b = M.Bodies.fromVertices(0, 0, [M.Vertices.hull(out.map(function (v) { return { x: v.x, y: v.y }; }))], opt);
    // keep the outline lined up with the body (the library recentres it on the centre of mass)
    var bx = [Infinity, Infinity, -Infinity, -Infinity];
    (b.parts.length > 1 ? b.parts.slice(1) : [b]).forEach(function (p) { p.vertices.forEach(function (v) { bx[0] = Math.min(bx[0], v.x); bx[1] = Math.min(bx[1], v.y); bx[2] = Math.max(bx[2], v.x); bx[3] = Math.max(bx[3], v.y); }); });
    var ob = [Infinity, Infinity, -Infinity, -Infinity]; out.forEach(function (v) { ob[0] = Math.min(ob[0], v.x); ob[1] = Math.min(ob[1], v.y); ob[2] = Math.max(ob[2], v.x); ob[3] = Math.max(ob[3], v.y); });
    var dx = (bx[0] + bx[2]) / 2 - (ob[0] + ob[2]) / 2 - b.position.x, dy = (bx[1] + bx[3]) / 2 - (ob[1] + ob[3]) / 2 - b.position.y;
    b.mxOutline = out.map(function (v) { return { x: v.x + dx, y: v.y + dy }; });
    M.Body.setPosition(b, { x: x, y: y }); M.Body.setAngle(b, ang || 0);
    b.mxCC = s.cc;
    return b;
  }
  function halfHeight(s, k, ang) { var o = localOutline(s, k), c = Math.cos(ang), sn = Math.sin(ang), m = 0; o.forEach(function (v) { m = Math.max(m, Math.abs(v.x * sn + v.y * c)); }); return m; }

  function start(level) {
    stop();
    L = level;
    S = { i: 0, k: scaleFor(L.list, L.deck), named: [], lost: [], kept: [], score: 0, over: false, won: false, height: 0, peak: 0 };
    engine = M.Engine.create({ gravity: { x: 0, y: 1, scale: 0.0007 }, positionIterations: 10, velocityIterations: 8, enableSleeping: !L.swell && !L.wind });
    world = engine.world; pieces = [];
    ship = M.Bodies.rectangle(0, DECK_Y + 7, L.deck, 14, { isStatic: true, friction: 1, frictionStatic: 1.4, label: "deck" });
    // low rails at both ends of the deck, as on a real ship (they hold a piece that slides, not one that topples)
    var railH = 10;
    rails = [-1, 1].map(function (sd) { return M.Bodies.rectangle(sd * (L.deck / 2 - 3), DECK_Y - railH / 2, 6, railH, { isStatic: true, friction: 1, label: "rail" }); });
    ship = M.Body.create({ parts: [ship].concat(rails), isStatic: true, friction: 1, frictionStatic: 3 });
    M.Composite.add(world, ship);
    // the load line, in km above the deck
    L.lineKm = L.lineKm || Math.round((BOT[L.id] || estimateLine(L)) * L.line);
    camY = null; time = 0;
    $("#lvlTitle").textContent = L.title;
    $("#lvlMeta").textContent = (L.daily ? "No. " + L.daily + " · " : L.region + " · ") + L.list.length + " countries · load line " + fmt(L.lineKm) + " km" + (L.swell ? " · swell" : "") + (L.wind ? " · wind" : "");
    $("#play").hidden = false; $("#done").hidden = true; $("#chart").hidden = true;
    next();
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; if (engine) M.Engine.clear(engine); engine = null; }
  function estimateLine(level) {
    // no measured value (the daily): the test bot's stacks reach about a quarter of the pieces' summed square-root areas
    var k = 0; level.list.forEach(function (cc) { k += Math.sqrt(byCC[cc].a); }); return k * 0.27;
  }

  // ---------- one piece at a time ----------
  function next() {
    if (S.i >= L.list.length) { finish(); return; }
    var s = byCC[L.list[S.i]];
    hover = { s: s, x: 0, ang: 0, named: null, answer: null };
    renderName(); renderHud(); state = "aim";
    $("#dropBtn").disabled = false;
  }
  function stackTop() { var top = DECK_Y; pieces.forEach(function (b) { if (!b.mxGone) top = Math.min(top, b.bounds.min.y); }); return top; }
  function hoverY() { var h = halfHeight(hover.s, S.k, hover.ang); return Math.min(stackTop(), DECK_Y) - 14 - h; }
  function drop() {
    if (state !== "aim") return;
    var b = makeBody(hover.s, S.k, hover.x, hoverY(), hover.ang);
    pieces.push(b); M.Composite.add(world, b);
    S.kept.push(hover.s.cc);
    state = "fall"; settleT = 0; ttl = 0;
    $("#dropBtn").disabled = true;
    SFX.drop();
    if (hover.answer === null) markName(false, true);
  }
  function overboard(b) { return b.position.y > DECK_Y + 140 || Math.abs(b.position.x) > VW; }
  function settled() { return pieces.every(function (b) { return b.mxGone || b.isSleeping || (b.speed < 0.1 && b.angularSpeed < 0.008); }); }
  function heightKm() { return Math.max(0, Math.round((DECK_Y - stackTop()) / S.k)); }

  function step(dt) {
    time += dt;
    // swell rocks the deck; with reduced motion it sits at a fixed tilt instead
    var sw = L.swell * Math.PI / 180, ang = reduce ? sw * 0.6 : sw * Math.sin(time / 1300);
    M.Body.setAngle(ship, ang, true);
    if (L.wind) {
      var w = L.wind * 0.00009 * (0.6 + 0.4 * Math.sin(time / 2100) + (reduce ? 0 : 0.3 * Math.sin(time / 370)));
      pieces.forEach(function (b) { if (!b.mxGone && !b.isSleeping) M.Body.applyForce(b, b.position, { x: b.mass * w, y: 0 }); });
    }
    M.Engine.update(engine, dt);
    pieces.forEach(function (b) {
      if (!b.mxGone && overboard(b)) { b.mxGone = true; M.Composite.remove(world, b); S.lost.push(b.mxCC); SFX.splash(); toast(byCC[b.mxCC].n + " went overboard."); }
    });
    if (state === "fall") {
      ttl += dt;
      settleT = settled() ? settleT + dt : 0;
      if (settleT > 450 || ttl > 6000) {
        S.height = heightKm(); S.peak = Math.max(S.peak, S.height);
        SFX.land(); S.i++;
        if (S.height >= L.lineKm && !L.daily) { finish(); return; }
        next();
      }
      renderHud();
    }
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    var dt = Math.min(64, now - last); last = now;
    if (engine && !S.over) { acc += dt; while (acc >= 1000 / 60) { step(1000 / 60); acc -= 1000 / 60; if (S.over) break; } }
    draw();
  }

  // ---------- drawing ----------
  var css = function (v, d) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || d; };
  var turtleImg = new Image(); turtleImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(window.MX_TURTLE_SVG || "");
  function resize() {
    var w = cv.clientWidth || 360, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(w * VH / VW * dpr);
  }
  function draw() {
    if (!L) return;
    var k = cv.width / VW, W = cv.width, H = cv.height;
    // camera: keep the stack top and the hovering piece in view
    // the view's top edge (world y): the ship sits near the bottom until the stack grows, then the view climbs with it
    var lift = hover && state === "aim" ? hoverY() - halfHeight(hover.s, S.k, hover.ang) - 30 : stackTop() - 180;
    var want = Math.min(DECK_Y - (VH - 70), lift);
    camY = camY === null ? want : camY + (want - camY) * (reduce ? 1 : 0.08);
    var top = camY;
    var X = function (x) { return (x + VW / 2) * k; }, Y = function (y) { return (y - top) * k; };
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.fillStyle = css("--sea", "#ffffff"); cx.fillRect(0, 0, W, H);
    // chart grid
    cx.strokeStyle = css("--grat", "#c9e1ec"); cx.lineWidth = 1;
    for (var gx = 0; gx <= VW; gx += 30) { cx.beginPath(); cx.moveTo(gx * k, 0); cx.lineTo(gx * k, H); cx.stroke(); }
    for (var gy = Math.ceil(top / 30) * 30; gy < top + VH; gy += 30) { cx.beginPath(); cx.moveTo(0, Y(gy)); cx.lineTo(W, Y(gy)); cx.stroke(); }
    // the load line
    var ly = DECK_Y - L.lineKm * S.k;
    cx.setLineDash([8 * k / 2, 6 * k / 2]); cx.strokeStyle = css("--accent", "#b4237d"); cx.lineWidth = 2 * k / 1.5;
    cx.beginPath(); cx.moveTo(0, Y(ly)); cx.lineTo(W, Y(ly)); cx.stroke(); cx.setLineDash([]);
    cx.fillStyle = css("--accent", "#b4237d"); cx.font = "800 " + 12 * k + "px " + css("--font", "sans-serif");
    cx.fillText("Load line · " + fmt(L.lineKm) + " km", 6 * k, Y(ly) - 5 * k);
    // the sea
    var sea = DECK_Y + 26, wave = reduce ? 0 : 3 * Math.sin(time / 600);
    cx.fillStyle = css("--tint-2", "#a9d3e8");
    cx.beginPath(); cx.moveTo(0, Y(sea + wave)); for (var sx = 0; sx <= VW; sx += 20) cx.lineTo(X(sx - VW / 2), Y(sea + wave + (reduce ? 0 : 2.5 * Math.sin(sx / 30 + time / 500)))); cx.lineTo(W, H); cx.lineTo(0, H); cx.closePath(); cx.fill();
    // the ship
    var dk = ship.parts[1]; cx.save(); cx.translate(X(dk.position.x), Y(dk.position.y)); cx.rotate(ship.angle);
    var dw = L.deck * k;
    cx.fillStyle = "#8a5a2b"; cx.strokeStyle = css("--ink", "#000"); cx.lineWidth = 2 * k / 1.2;
    cx.beginPath(); cx.moveTo(-dw / 2 - 10 * k, -7 * k); cx.lineTo(dw / 2 + 16 * k, -7 * k); cx.lineTo(dw / 2 - 6 * k, 30 * k); cx.lineTo(-dw / 2 + 4 * k, 30 * k); cx.closePath(); cx.fill(); cx.stroke();
    cx.fillStyle = "#c08a50"; cx.fillRect(-dw / 2, -7 * k, dw, 6 * k); cx.strokeRect(-dw / 2, -7 * k, dw, 6 * k);
    [-1, 1].forEach(function (sd) { cx.fillRect(sd * (dw / 2 - 3 * k) - 3 * k, -17 * k, 6 * k, 10 * k); cx.strokeRect(sd * (dw / 2 - 3 * k) - 3 * k, -17 * k, 6 * k, 10 * k); });
    if (turtleImg.complete && turtleImg.naturalWidth) cx.drawImage(turtleImg, dw / 2 + 2 * k, -34 * k, 26 * k, 26 * k);
    cx.restore();
    // the stack
    pieces.forEach(function (b) { if (!b.mxGone) shape(b.mxOutline, b.position.x, b.position.y, b.angle, false); });
    // the piece in hand, with a drop guide
    if (state === "aim" && hover) {
      var hy = hoverY(), o = localOutline(hover.s, S.k);
      cx.strokeStyle = css("--muted", "#6b777e"); cx.setLineDash([3 * k, 4 * k]); cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(X(hover.x), Y(hy)); cx.lineTo(X(hover.x), Y(DECK_Y)); cx.stroke(); cx.setLineDash([]);
      shape(o, hover.x, hy, hover.ang, true);
    }
    function shape(out, px, py, a, live) {
      cx.save(); cx.translate(X(px), Y(py)); cx.rotate(a);
      cx.beginPath(); out.forEach(function (v, i) { (i ? cx.lineTo : cx.moveTo).call(cx, v.x * k, v.y * k); }); cx.closePath();
      cx.fillStyle = live ? css("--accent", "#b4237d") : css("--land", "#f3d98a"); cx.globalAlpha = live ? 0.85 : 1; cx.fill(); cx.globalAlpha = 1;
      cx.lineJoin = "round"; cx.strokeStyle = css("--ink", "#000"); cx.lineWidth = 1.6 * k / 1.2; cx.stroke();
      cx.restore();
    }
  }

  // ---------- naming ----------
  function renderName() {
    var box = $("#nameBox"), s = hover.s;
    $("#nameQ").textContent = "Which country is this? (+100)";
    $("#nameSay").textContent = "";
    if (L.name === "pick") {
      $("#nameType").hidden = true; $("#nameOpts").hidden = false;
      var r = rng((L.daily || 7) * 131 + S.i * 17 + s.cc.charCodeAt(0));
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
    if (hover.answer !== null) return;
    hover.answer = ok; S.named.push(ok ? 1 : 0);
    var s = hover.s, box = $("#nameBox");
    box.classList.add(ok ? "right" : "wrong");
    $("#nameSay").textContent = ok ? "Right: " + s.n + ". +100" : skipped ? "Dropped unnamed: it was " + s.n + "." : "It's " + s.n + ".";
    Array.prototype.forEach.call(document.querySelectorAll("#nameOpts .opt"), function (b) { b.disabled = true; if (b.dataset.cc === s.cc) b.classList.add("is"); });
    $("#nin").disabled = true;
    if (!skipped) (ok ? SFX.right : SFX.wrong)();
    renderHud();
  }
  function answer(cc) { if (state !== "aim" || hover.answer !== null) return; markName(cc === hover.s.cc); }

  // ---------- HUD, end ----------
  function named() { return S.named.reduce(function (a, b) { return a + b; }, 0); }
  function points() { return heightKm() + 100 * named(); }
  function renderHud() {
    $("#hPieces").textContent = Math.max(0, L.list.length - S.i);
    $("#hHeight").textContent = fmt(state === "fall" ? heightKm() : S.height);
    $("#hNamed").textContent = named();
    $("#hLost").textContent = S.lost.length;
  }
  function stars() {
    if (S.height < L.lineKm) return 0;
    return 1 + (S.lost.length === 0 ? 1 : 0) + (named() === L.list.length ? 1 : 0);
  }
  function finish() {
    S.over = true; state = "done";
    S.height = heightKm();
    var st = stars(), pts = S.height + 100 * named();
    if (st) SFX.line(); else SFX.fail();
    turtle(st ? "swim" : "peek");
    var marks = L.list.map(function (cc, i) { var lost = S.lost.indexOf(cc) >= 0, nm = S.named[i]; return lost ? "\u{1F7E5}" : nm ? "\u{1F7E9}" : "\u{1F7E8}"; }).join("");
    if (L.daily) {
      if (!save.results[L.daily]) { save.results[L.daily] = { score: pts, h: S.height, named: named(), lost: S.lost.length, stars: st }; store(); }
    } else {
      var prev = save.levels[L.id] || { stars: 0, best: 0 };
      save.levels[L.id] = { stars: Math.max(prev.stars, st), best: Math.max(prev.best, pts) }; store();
    }
    $("#doneTitle").textContent = st ? (st === 3 ? "Three stars. A perfect load." : "Loaded to the line.") : "Below the line this time.";
    $("#doneStars").textContent = "★".repeat(st) + "☆".repeat(3 - st);
    $("#doneStars").setAttribute("aria-label", st + " of 3 stars");
    $("#bigScore").textContent = fmt(pts);
    $("#doneLine").textContent = "Stack " + fmt(S.height) + " km (load line " + fmt(L.lineKm) + " km) · " + named() + " of " + L.list.length + " named · " + S.lost.length + " overboard.";
    $("#doneWhy").textContent = "Points: " + fmt(S.height) + " for the height + " + fmt(100 * named()) + " for the names = " + fmt(pts) + ". Stars: reach the line; nothing overboard; every country named.";
    var share = $("#shareText"), sb = $("#shareBtn");
    if (L.daily) {
      share.hidden = false; sb.hidden = false;
      share.textContent = "Mapelago Ballast No. " + L.daily + " \u{1F422} " + fmt(save.results[L.daily].score) + " points\n" + marks + "\n" + "Stack " + fmt(save.results[L.daily].h) + " km · " + save.results[L.daily].named + " of " + L.list.length + " named\n" + ((window.MXCOPY && MXCOPY.invite && MXCOPY.invite.ballast) || "Can you stack higher?") + " mapelago.com/ballast.html#c-" + L.daily + "-" + save.results[L.daily].score;
      $("#nextLvl").hidden = true;
    } else {
      share.hidden = true; sb.hidden = true;
      var idx = LEVELS.indexOf(L), nx = LEVELS[idx + 1];
      $("#nextLvl").hidden = !(st && nx); if (nx) $("#nextLvl").textContent = "Next voyage: " + nx.title;
    }
    $("#retryBtn").hidden = !!L.daily;
    $("#play").hidden = true; $("#done").hidden = false;
    renderChart();
    setTimeout(function () { var t = $("#doneTitle"); t.setAttribute("tabindex", "-1"); t.focus(); }, 30);
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
  function move(dx) { if (state === "aim") hover.x = Math.max(-VW / 2 + 10, Math.min(VW / 2 - 10, hover.x + dx)); }
  function turn(d) { if (state === "aim") hover.ang += d * Math.PI / 12; }
  function init() {
    $("#logoMascot").innerHTML = window.MX_TURTLE_SVG;
    drawMute();
    $("#soundBtn").onclick = function () { muted = !muted; try { localStorage.setItem("dailycity:sound", muted ? "off" : "on"); } catch (e) {} drawMute(); if (!muted) SFX.right(); };
    resize(); window.addEventListener("resize", resize);
    // drag to move; a tap (no drag) turns the piece
    var down = null;
    cv.addEventListener("pointerdown", function (e) { down = { x: e.clientX, hx: hover ? hover.x : 0, moved: false }; try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
    cv.addEventListener("pointermove", function (e) { if (!down || state !== "aim") return; var dx = (e.clientX - down.x) * VW / cv.clientWidth; if (Math.abs(dx) > 4) down.moved = true; hover.x = Math.max(-VW / 2 + 10, Math.min(VW / 2 - 10, down.hx + dx)); });
    cv.addEventListener("pointerup", function () { if (down && !down.moved) turn(2); down = null; });
    $("#leftBtn").onclick = function () { move(-12); };
    $("#rightBtn").onclick = function () { move(12); };
    $("#ccwBtn").onclick = function () { turn(-1); };
    $("#cwBtn").onclick = function () { turn(1); };
    $("#dropBtn").onclick = drop;
    window.addEventListener("keydown", function (e) {
      if (state !== "aim" || /^(INPUT|TEXTAREA)$/.test((e.target || {}).tagName)) return;
      if (e.key === "ArrowLeft") { move(e.shiftKey ? -3 : -8); e.preventDefault(); }
      else if (e.key === "ArrowRight") { move(e.shiftKey ? 3 : 8); e.preventDefault(); }
      else if (e.key === "q" || e.key === "Q" || e.key === "ArrowUp") { turn(-1); e.preventDefault(); }
      else if (e.key === "e" || e.key === "E") { turn(1); e.preventDefault(); }
      else if (e.key === " " || e.key === "ArrowDown") { drop(); e.preventDefault(); }
    });
    $("#nameOpts").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) answer(b.dataset.cc); });
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
    $("#retryBtn").onclick = function () { start(L); };
    $("#nextLvl").onclick = function () { var i = LEVELS.indexOf(L); if (LEVELS[i + 1]) start(LEVELS[i + 1]); };
    $("#chartBtn").onclick = $("#chartBtn2").onclick = function () { stop(); $("#play").hidden = true; $("#done").hidden = true; $("#chart").hidden = false; renderChart(); };
    $("#dailyBtn").onclick = function () { start(dailyLevel(dayNo)); };
    $("#chartList").addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (b && !b.disabled) start(LEVELS[+b.dataset.i]); });
    renderChart();
    // today's daily, unless it's already played: then the level chart
    if (save.results[dayNo]) { $("#chart").hidden = false; $("#play").hidden = true; $("#dailyBtn").textContent = "Replay today's Daily Ballast (not counted)"; showDailyDone(); }
    else start(dailyLevel(dayNo));
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__ballast = {
      // test bot helpers: lay the piece flat, and run the physics until it settles, without waiting for frames
      flat: function () { var best = 0, bh = Infinity, o = localOutline(hover.s, S.k); for (var i = 0; i < 24; i++) { var a = i * Math.PI / 12, c = Math.cos(a), sn = Math.sin(a), lo = 0, hi = 0; o.forEach(function (v) { var y = v.x * sn + v.y * c; lo = Math.max(lo, y); hi = Math.min(hi, y); }); var h = lo * 2 + (lo - hi) * 0.3; if (h < bh) { bh = h; best = a; } } hover.ang = best; },
      settle: function () { for (var n = 0; n < 900 && state === "fall" && !S.over; n++) step(1000 / 60); return state; },
      L: function () { return L; }, S: function () { return S; }, LEVELS: LEVELS, start: start, daily: dailyLevel, drop: drop, answer: answer, move: move, turn: turn, state: function () { return state; }, height: heightKm, pieces: function () { return pieces; }, finish: finish, save: function () { return save; } };
  }
  function showDailyDone() {
    var r = save.results[dayNo]; if (!r) return;
    $("#dailyNote").hidden = false;
    $("#dailyNote").textContent = "Today's Daily Ballast: " + fmt(r.score) + " points (" + fmt(r.h) + " km, " + r.named + " named). New cargo at midnight. Meanwhile, sail the voyages.";
  }
  var dayNo = today();
  var dm = /^#day-(\d+)$/.exec(location.hash);
  if (dm && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) dayNo = Number(dm[1]);
  init();
})();
