// Dead Reckoning: five places a day, tapped on a blank world map. Scored by great-circle distance.
// Places come from DR_PLACES (built by tools/dead-reckoning-data.js from data already in the site).
(function () {
  "use strict";
  var KEY = "dailycity:reckoning:v1", GAP = 60, K = 1100, WEIGHTS = [1, 1.5, 2, 2.5, 3];
  var P = (window.DR_PLACES || []).map(function (a, i) { return { i: i, name: a[0], country: a[1], lat: a[2], lon: a[3], pop: a[4], capital: !!a[5], tier: a[6] }; });
  var POOLS = [1, 2, 3, 4, 5].map(function (t) { return P.filter(function (p) { return p.tier === t; }).map(function (p) { return p.i; }); });
  var MYST = window.DR_MYSTERY || [];
  var $ = function (s) { return document.querySelector(s); };

  // ---------- day number: No. 1 is 14 November 2026, local midnight like the other games ----------
  function dayNow() { var d = new Date(); return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 10, 14)) / 864e5) + 1; }
  var LOCAL = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].indexOf(location.hostname) >= 0;
  var hook = LOCAL ? /^#day-(\d+)$/.exec(location.hash) : null;
  var N = Math.max(1, hook ? Number(hook[1]) : dayNow());

  // ---------- scoring ----------
  var R = 6371.0088, RAD = Math.PI / 180;
  function km(a, b) {
    var dLat = (b.lat - a.lat) * RAD, dLon = (b.lon - a.lon) * RAD;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }
  // 0 km = 100, 250 km = 80, 1,000 km = 40, 2,500 km = 10, 5,000 km = 1
  function points(d) { return Math.round(100 * Math.exp(-d / K)); }
  function total(rounds) { return Math.round(rounds.reduce(function (s, r, i) { return s + WEIGHTS[i] * r; }, 0)); }
  function bearing(a, b) {
    var y = Math.sin((b.lon - a.lon) * RAD) * Math.cos(b.lat * RAD);
    var x = Math.cos(a.lat * RAD) * Math.sin(b.lat * RAD) - Math.sin(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.cos((b.lon - a.lon) * RAD);
    return (Math.atan2(y, x) / RAD + 360) % 360;
  }
  var DIRS = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
  function dirName(deg) { return DIRS[Math.round(deg / 45) % 8]; }
  function band(d) { return d < 50 ? "\u{1F3AF}" : d < 250 ? "\u{1F7E9}" : d < 750 ? "\u{1F7E8}" : d < 2000 ? "\u{1F7E7}" : "\u{1F7E5}"; }
  function fmtKm(d) { return d < 10 ? d.toFixed(1) + " km" : Math.round(d).toLocaleString("en-US") + " km"; }

  // ---------- the daily five ----------
  // Worked out day by day from No. 1 with a fixed seed, so each number always gets the same five. A place is
  // never used again within 60 days, two places on one day are never in the same country, and no place shares
  // a country with that day's Mystery city answer (so neither game gives the other away).
  function rng(seed) { return function () { seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var sched = [null], last = {};
  function daily(n) {
    while (sched.length <= n) {
      var d = sched.length, r = rng(d * 7919 + 104729), m = (MYST[d - 1] || "|").split("|"), used = {}, pick = [];
      for (var t = 0; t < 5; t++) {
        var pool = POOLS[t], L = pool.length, k = Math.floor(r() * L), chosen = -1;
        for (var pass = 0; pass < 2 && chosen < 0; pass++)
          for (var j = 0; j < L; j++) {
            var p = P[pool[(k + j) % L]];
            if (last[p.i] !== undefined && d - last[p.i] <= GAP) continue;
            if (pass === 0 && (used[p.country] || p.country === m[1] || p.name === m[0])) continue;
            chosen = p.i; break;
          }
        if (chosen < 0) chosen = pool[k];
        last[chosen] = d; used[P[chosen].country] = 1; pick.push(chosen);
      }
      sched.push(pick);
    }
    return sched[n].slice();
  }

  // ---------- facts: two lines from the site's own data ----------
  function popText(n) { return n >= 1e6 ? (Math.round(n / 1e5) / 10).toLocaleString("en-US") + " million" : (Math.round(n / 1e4) * 1e4).toLocaleString("en-US"); }
  // country names that take "the" in a sentence
  var THE = /^(Netherlands|United States|United Kingdom|United Arab Emirates|Philippines|Czech Republic|Dominican Republic|Central African Republic|Democratic Republic of the Congo|Republic of the Congo|Gambia|Bahamas|Maldives|Comoros|Seychelles|Marshall Islands|Solomon Islands|Vatican City)$/;
  function the(c) { return THE.test(c) ? "the " + c : c; }
  function owns(c) { return the(c) + (/s$/.test(c) ? "'" : "'s"); }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function fact(p) {
    var c = (window.DR_COUNTRIES || {})[p.country] || [], kind = c[0], cur = c[1], high = c[2];
    var one = p.capital ? "The capital of " + the(p.country) + ", home to about " + popText(p.pop) + " people." : "A city in " + the(p.country) + " of about " + popText(p.pop) + " people.";
    var two = [];
    if (kind === "island") two.push(the(p.country) + " is an island country");
    else if (kind === "landlocked") two.push(the(p.country) + " has no coastline");
    if (high) {
      var at = high.lastIndexOf(", "), peak = high.slice(0, at), m = Number(high.slice(at + 2));
      if (peak && isFinite(m)) two.push((two.length ? "its" : owns(p.country)) + " highest point is " + peak + ", " + m.toLocaleString("en-US") + " m");
    }
    // one-word currencies are common nouns (the euro, the leone); longer names keep their capitals (the Pakistan rupee)
    if (cur && two.length < 2) two.push((two.length ? "its" : owns(p.country)) + " currency is the " + (/\s/.test(cur) ? cur : cur.toLowerCase()));
    return [one, two.length ? cap(two.join("; ")) + "." : ""];
  }

  // ---------- saves ----------
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === "object") { if (!s.results || typeof s.results !== "object") s.results = {}; return s; } } catch (e) {} return { results: {}, game: null }; }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var S = load();

  // ---------- state ----------
  var mode = "daily";           // or "practice"
  var places, guesses, pin = null, revealed = false, practice = { n: 0, sum: 0 };
  function startDaily() {
    mode = "daily"; places = daily(N).map(function (i) { return P[i]; });
    var res = S.results[N];
    guesses = res && res.g ? res.g.slice() : S.game && S.game.n === N && Array.isArray(S.game.g) ? S.game.g.slice(0, 5) : [];
    guesses = guesses.filter(function (g) { return Array.isArray(g) && isFinite(g[0]) && isFinite(g[1]); });
    pin = null; revealed = false;
  }
  function roundsOf(gs, ps) { return gs.map(function (g, i) { var d = km({ lat: g[0], lon: g[1] }, ps[i]); return { d: d, s: points(d) }; }); }
  function finishDaily() {
    var rs = roundsOf(guesses, places), tot = total(rs.map(function (r) { return r.s; }));
    if (!S.results[N]) { S.results[N] = { total: tot, score: tot, g: guesses.slice(), b: rs.map(function (r) { return band(r.d); }).join("") }; S.game = null; save(S); }
  }
  function shareText() {
    var r = S.results[N]; if (!r) return "";
    return "Dead Reckoning No. " + N + ": " + r.total.toLocaleString("en-US") + " of 1,000 " + r.b + "\nBeat my score: mapelago.com/dead-reckoning.html#b-dr-" + N + "-0-" + r.total;
  }
  function stats() {
    var days = Object.keys(S.results).map(Number).filter(function (n) { return n > 0 && S.results[n] && isFinite(S.results[n].total); });
    var tots = days.map(function (d) { return S.results[d].total; });
    var st = window.MXS && MXS.streak ? MXS.streak(S.results, dayNow()) : { cur: 0, best: 0 };
    return { played: days.length, avg: tots.length ? Math.round(tots.reduce(function (a, b) { return a + b; }, 0) / tots.length) : 0, best: tots.length ? Math.max.apply(null, tots) : 0, streak: st.cur, bestStreak: st.best };
  }

  // ---------- the map ----------
  var NS = "http://www.w3.org/2000/svg", svg = $("#map"), view = { x: 0, y: 0, w: 360, h: 180 }, gPins, landDrawn = false;
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  // equirectangular: x = longitude + 180, y = 90 - latitude, in degrees
  function toXY(lat, lon) { return [lon + 180, 90 - lat]; }
  function toLL(x, y) { return { lat: Math.max(-89.9, Math.min(89.9, 90 - y)), lon: ((x % 360) + 360) % 360 - 180 }; }
  function drawLand() {
    var W = window.__WORLD; if (!W || landDrawn) return;
    landDrawn = true;
    var T = W.transform, sc = T ? T.scale : [1, 1], tr = T ? T.translate : [0, 0];
    var arcs = W.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (q) { if (T) { x += q[0]; y += q[1]; } else { x = q[0]; y = q[1]; } return [x * sc[0] + tr[0], y * sc[1] + tr[1]]; }); });
    function ring(r) {
      var pts = [];
      r.forEach(function (ai, k) { var a = ai < 0 ? arcs[~ai].slice().reverse() : arcs[ai]; (k ? a.slice(1) : a).forEach(function (p) { pts.push(p); }); });
      // break the ring where it jumps across the date line, so no stripe crosses the map
      var d = "", prev = null;
      pts.forEach(function (p) { var xy = toXY(p[1], p[0]); d += (prev && Math.abs(p[0] - prev[0]) < 180 ? "L" : "M") + xy[0].toFixed(2) + " " + xy[1].toFixed(2); prev = p; });
      return d + "Z";
    }
    var d = "";
    W.objects.countries.geometries.forEach(function (g) {
      if (g.type === "Polygon") g.arcs.forEach(function (r) { d += ring(r); });
      else if (g.type === "MultiPolygon") g.arcs.forEach(function (poly) { poly.forEach(function (r) { d += ring(r); }); });
    });
    el("path", { class: "land", d: d }, svg.querySelector(".landg"));
  }
  function buildMap() {
    svg.innerHTML = "";
    var g = el("g", { class: "landg" }, svg);
    var gr = "";
    for (var lon = -150; lon < 180; lon += 30) gr += "M" + (lon + 180) + " 0V180";
    for (var lat = -60; lat <= 60; lat += 30) gr += "M0 " + (90 - lat) + "H360";
    el("path", { class: "grat", d: gr }, g);
    gPins = el("g", {}, svg);
    if (window.__WORLD) drawLand(); else window.addEventListener("load", drawLand);
    fit(); applyView();
  }
  function box() { var r = svg.getBoundingClientRect(); return { w: r.width || 1, h: r.height || 1, l: r.left, t: r.top }; }
  // the whole world, fitted to the box
  function fit() {
    var b = box(), asp = b.w / b.h;
    if (asp > 360 / 170) { view.h = 170; view.w = 170 * asp; } else { view.w = 360; view.h = 360 / asp; }
    view.x = 180 - view.w / 2; view.y = 78 - view.h / 2; // centred a little north, where the places are
  }
  function clampView() {
    var b = box(), asp = b.w / b.h, minW = 4;
    var maxW = Math.max(360, 180 * asp);
    view.w = Math.max(minW, Math.min(maxW, view.w)); view.h = view.w / asp;
    var cx = view.x + view.w / 2, cy = view.y + view.h / 2;
    cx = Math.max(0, Math.min(360, cx)); cy = Math.max(0, Math.min(180, cy));
    view.x = cx - view.w / 2; view.y = cy - view.h / 2;
  }
  function applyView() {
    clampView();
    svg.setAttribute("viewBox", view.x + " " + view.y + " " + view.w + " " + view.h);
    drawPins();
  }
  function unit() { return view.w / box().w; } // degrees per screen pixel
  function zoomAt(f, sx, sy) {
    var b = box(); if (sx == null) { sx = b.w / 2; sy = b.h / 2; }
    var px = view.x + sx / b.w * view.w, py = view.y + sy / b.h * view.h;
    view.w /= f; view.h /= f; view.x = px - sx / b.w * view.w; view.y = py - sy / b.h * view.h; applyView();
  }
  function screenToMap(cx, cy) { var b = box(); return [view.x + (cx - b.l) / b.w * view.w, view.y + (cy - b.t) / b.h * view.h]; }

  var answerShown = null, doneMarks = null;
  function drawPins() {
    if (!gPins) return;
    gPins.innerHTML = "";
    var u = unit();
    if (doneMarks && mode === "daily") doneMarks.forEach(function (m) {
      var a = toXY(m[0].lat, m[0].lon), g = toXY(m[1].lat, m[1].lon);
      el("line", { class: "gap", x1: g[0], y1: g[1], x2: a[0], y2: a[1] }, gPins);
      el("circle", { class: "pin", cx: g[0], cy: g[1], r: 4 * u }, gPins);
      el("circle", { class: "ans", cx: a[0], cy: a[1], r: 7 * u }, gPins);
    });
    if (answerShown) {
      var a = toXY(answerShown.lat, answerShown.lon);
      if (pin) { var p = toXY(pin.lat, pin.lon); el("line", { class: "gap", x1: p[0], y1: p[1], x2: a[0], y2: a[1] }, gPins); }
      el("circle", { class: "ans", cx: a[0], cy: a[1], r: 11 * u }, gPins);
      el("circle", { class: "ans-dot", cx: a[0], cy: a[1], r: 4 * u }, gPins);
    }
    if (pin) {
      var q = toXY(pin.lat, pin.lon);
      if (!answerShown) el("circle", { class: "ring", cx: q[0], cy: q[1], r: 20 * u }, gPins);
      el("path", { class: "pin", d: "M" + q[0] + " " + q[1] + "l" + (-8 * u) + " " + (-14 * u) + "a" + 9.2 * u + " " + 9.2 * u + " 0 1 1 " + 16 * u + " 0z" }, gPins);
    }
  }

  // pointer handling: one finger drags, two pinch, a tap without moving places the pin
  var ptrs = {}, start = null, moved = false, pinch = null;
  svg.addEventListener("pointerdown", function (e) {
    svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
    ptrs[e.pointerId] = [e.clientX, e.clientY];
    var ids = Object.keys(ptrs);
    if (ids.length === 1) { start = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; moved = false; pinch = null; }
    else if (ids.length === 2) {
      var a = ptrs[ids[0]], b = ptrs[ids[1]];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, w: view.w, mid: screenToMap((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) }; moved = true;
    }
  });
  svg.addEventListener("pointermove", function (e) {
    if (!ptrs[e.pointerId]) return;
    ptrs[e.pointerId] = [e.clientX, e.clientY];
    var ids = Object.keys(ptrs), b = box();
    if (pinch && ids.length >= 2) {
      var p = ptrs[ids[0]], q = ptrs[ids[1]], d = Math.hypot(p[0] - q[0], p[1] - q[1]) || 1, mx = (p[0] + q[0]) / 2 - b.l, my = (p[1] + q[1]) / 2 - b.t;
      view.w = pinch.w * pinch.d / d; view.h = view.w * b.h / b.w;
      view.x = pinch.mid[0] - mx / b.w * view.w; view.y = pinch.mid[1] - my / b.h * view.h; applyView();
    } else if (start) {
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!moved && Math.hypot(dx, dy) > 7) moved = true;
      if (moved) { view.x = start.vx - dx * view.w / b.w; view.y = start.vy - dy * view.h / b.h; applyView(); }
    }
  });
  function up(e) {
    if (!ptrs[e.pointerId]) return;
    delete ptrs[e.pointerId];
    var left = Object.keys(ptrs).length;
    if (!left) {
      if (start && !moved && e.type === "pointerup") place(screenToMap(e.clientX, e.clientY));
      start = null; pinch = null;
    } else if (left === 1) { var id = Object.keys(ptrs)[0]; start = { x: ptrs[id][0], y: ptrs[id][1], vx: view.x, vy: view.y }; pinch = null; }
  }
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
  svg.addEventListener("wheel", function (e) { e.preventDefault(); var b = box(); zoomAt(Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0018)), e.clientX - b.l, e.clientY - b.t); }, { passive: false });
  $("#zoomIn").onclick = function () { zoomAt(1.8); };
  $("#zoomOut").onclick = function () { zoomAt(1 / 1.8); };
  $("#zoomAll").onclick = function () { fit(); applyView(); };
  window.addEventListener("resize", function () { var c = [view.x + view.w / 2, view.y + view.h / 2], w = view.w, b = box(); view.w = w; view.h = w * b.h / b.w; view.x = c[0] - view.w / 2; view.y = c[1] - view.h / 2; applyView(); });

  function place(xy) {
    if (revealed || !places) return;
    pin = toLL(xy[0], xy[1]); drawPins();
    $("#lockBtn").disabled = false;
  }
  // keyboard: arrows move the pin (Shift for big steps), Enter locks it in, + and - zoom (as in Mystery city)
  svg.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAt(1.8); return; }
    if (e.key === "-") { e.preventDefault(); zoomAt(1 / 1.8); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (revealed) next(); else if (pin) lock(); return; }
    var k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!k || revealed) return;
    e.preventDefault();
    var step = (e.shiftKey ? 48 : 12) * unit(), c = pin ? toXY(pin.lat, pin.lon) : [view.x + view.w / 2, view.y + view.h / 2];
    var nx = Math.max(view.x + 2 * unit(), Math.min(view.x + view.w - 2 * unit(), c[0] + k[0] * step)), ny = Math.max(view.y + 2 * unit(), Math.min(view.y + view.h - 2 * unit(), c[1] + k[1] * step));
    place([nx, ny]);
    var ll = pin; $("#mapHint").textContent = "Pin at " + Math.abs(ll.lat).toFixed(1) + "° " + (ll.lat >= 0 ? "N" : "S") + ", " + Math.abs(ll.lon).toFixed(1) + "° " + (ll.lon >= 0 ? "E" : "W") + ". Enter locks it in.";
  });

  // ---------- rounds ----------
  function current() { return mode === "daily" ? guesses.length : practice.n; }
  function target() { return mode === "daily" ? places[guesses.length] : practice.place; }
  function showAsk() {
    var t = target(), i = current();
    $("#practiceTag").hidden = mode !== "practice";
    $("#rnd").textContent = mode === "daily" ? "Place " + (i + 1) + " of 5" + (WEIGHTS[i] !== 1 ? " · counts ×" + WEIGHTS[i] : "") : "Practice place " + (i + 1);
    $("#place").innerHTML = "";
    $("#place").appendChild(document.createTextNode(t.name));
    var sm = document.createElement("small"); sm.textContent = t.country; $("#place").appendChild(sm);
    $("#run").textContent = mode === "daily" ? String(total(roundsOf(guesses, places).map(function (r) { return r.s; }))) : practice.n ? "avg " + Math.round(practice.sum / practice.n) : "";
    $("#lockBtn").hidden = false; $("#lockBtn").disabled = !pin; $("#reveal").hidden = true;
    drawDots();
  }
  function drawDots() {
    var ol = $("#dots");
    ol.hidden = mode !== "daily";
    if (mode !== "daily") return;
    var rs = roundsOf(guesses, places);
    ol.innerHTML = [0, 1, 2, 3, 4].map(function (i) {
      return rs[i] ? '<li class="got" title="Place ' + (i + 1) + ": " + rs[i].s + ' points">' + band(rs[i].d) + "<br>" + rs[i].s + "</li>" : '<li class="' + (i === guesses.length && !S.results[N] ? "now" : "") + '">' + (i + 1) + "</li>";
    }).join("");
  }
  function lock() {
    if (!pin || revealed) return;
    var t = target(), d = km(pin, t), s = points(d), br = bearing(pin, t);
    revealed = true; answerShown = t;
    if (mode === "daily") {
      guesses.push([+pin.lat.toFixed(3), +pin.lon.toFixed(3)]);
      if (guesses.length >= 5) finishDaily(); else { S.game = { n: N, g: guesses.slice() }; save(S); }
    } else { practice.n++; practice.sum += s; }
    $("#lockBtn").hidden = true;
    $("#reveal").hidden = false;
    $("#arrow").querySelector("svg").style.transform = "rotate(" + Math.round(br) + "deg)";
    $("#arrow").setAttribute("aria-hidden", "true");
    $("#km").innerHTML = ""; $("#km").appendChild(document.createTextNode(fmtKm(d)));
    var sm = document.createElement("small"); sm.textContent = d < 1 ? "Right on it" : t.name + " is " + dirName(br) + " of your pin"; $("#km").appendChild(sm);
    $("#pts").innerHTML = s + "<small>" + (mode === "daily" && WEIGHTS[current() - 1] !== 1 ? "×" + WEIGHTS[current() - 1] + " = " + Math.round(s * WEIGHTS[current() - 1]) : "points") + "</small>";
    var f = fact(t), fe = $("#fact"); fe.innerHTML = "";
    var b = document.createElement("b"); b.textContent = f[0]; fe.appendChild(b); fe.appendChild(document.createTextNode(f[1]));
    $("#nextBtn").textContent = mode === "daily" ? (guesses.length >= 5 ? "See my score" : "Next place") : "Next practice place";
    // show both the pin and the answer
    var a = toXY(t.lat, t.lon), p = toXY(pin.lat, pin.lon), bx = box(), asp = bx.w / bx.h;
    var w = Math.max(Math.abs(a[0] - p[0]) * 1.6, Math.abs(a[1] - p[1]) * 1.6 * asp, 14);
    if (Math.abs(a[0] - p[0]) < 300) { view.w = w; view.h = w / asp; view.x = (a[0] + p[0]) / 2 - view.w / 2; view.y = (a[1] + p[1]) / 2 - view.h / 2; }
    applyView();
    drawDots();
    $("#run").textContent = mode === "daily" ? String(total(roundsOf(guesses, places).map(function (r) { return r.s; }))) : "avg " + Math.round(practice.sum / practice.n);
    $("#nextBtn").focus({ preventScroll: true });
    // on a phone the result sits under the map: bring it into view, map still partly showing
    if (window.innerWidth < 900) { var rv = $("#reveal"); if (rv.scrollIntoView) rv.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
  }
  function next() {
    revealed = false; answerShown = null; pin = null;
    if (mode === "daily" && guesses.length >= 5) { showDone(); return; }
    if (mode === "practice") practice.place = P[Math.floor(Math.random() * P.length)];
    fit(); applyView(); showAsk();
    $("#mapHint").textContent = "Tap the map to drop your pin. Pinch or scroll to zoom, drag to move. Keyboard: arrow keys move the pin (Shift for big steps), Enter locks it in.";
  }
  $("#lockBtn").onclick = lock;
  $("#nextBtn").onclick = next;

  function statsHtml() {
    var s = stats();
    return [["Played", s.played], ["Average", s.avg], ["Best", s.best], ["Streak", s.streak]].map(function (x) { return "<div><b>" + x[1] + "</b><span>" + x[0] + "</span></div>"; }).join("");
  }
  function showDone() {
    var r = S.results[N]; if (!r) return;
    mode = "daily"; revealed = false; answerShown = null; pin = null;
    $("#ask").hidden = true; $("#lockBtn").hidden = true; $("#reveal").hidden = true; $("#practiceBox").hidden = true;
    $("#doneTitle").textContent = r.total >= 900 ? "Superb navigating." : r.total >= 700 ? "Well steered." : r.total >= 450 ? "Land ho." : "Off course, but home safe.";
    $("#bigScore").textContent = r.total.toLocaleString("en-US");
    $("#shareText").textContent = shareText();
    $("#stats").innerHTML = statsHtml();
    var rs = roundsOf(r.g, places);
    $("#recap").innerHTML = "";
    rs.forEach(function (x, i) {
      var li = document.createElement("li"), s1 = document.createElement("span"), s2 = document.createElement("span"), s3 = document.createElement("b");
      s1.textContent = band(x.d); s2.textContent = places[i].name + ", " + places[i].country + " · " + fmtKm(x.d); s3.textContent = x.s;
      li.appendChild(s1); li.appendChild(s2); li.appendChild(s3); $("#recap").appendChild(li);
    });
    // show today's five on the whole map, each answer joined to its pin
    doneMarks = places.map(function (p, i) { return [p, { lat: r.g[i][0], lon: r.g[i][1] }]; });
    fit(); applyView();
    drawDots();
    $("#done").hidden = false;
  }
  function startPractice() {
    mode = "practice"; practice = { n: 0, sum: 0, place: P[Math.floor(Math.random() * P.length)] };
    $("#done").hidden = true; $("#ask").hidden = false; $("#practiceBox").hidden = false;
    $("#practiceSay").textContent = "Endless random places. Nothing here counts: today's result, streak and stats stay as they are.";
    revealed = false; answerShown = null; pin = null; fit(); applyView(); showAsk();
    svg.focus({ preventScroll: true });
  }
  $("#moreBtn").onclick = startPractice;
  $("#practiceReset").onclick = startPractice;
  $("#backBtn").onclick = function () { startDaily(); fit(); applyView(); if (S.results[N]) showDone(); else { $("#ask").hidden = false; $("#practiceBox").hidden = true; showAsk(); } };

  $("#shareBtn").onclick = async function () {
    var t = shareText(), b = this;
    try { if (navigator.share && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)) { await navigator.share({ text: t }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(t); toast("Copied. Paste it anywhere."); } catch (e) { window.prompt("Copy your result:", t); }
  };
  var tt;
  function toast(m) { var a = $("#toast"); a.textContent = m; a.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { a.classList.remove("show"); }, 1900); }

  var sm = $("#statsModal");
  $("#statsBtn").onclick = function () {
    var s = stats();
    $("#statsBig").innerHTML = statsHtml();
    $("#statsSay").textContent = s.played ? "Best streak " + s.bestStreak + ". Practice rounds never count here." : "Play today's five to start your stats. Practice rounds never count here.";
    sm.hidden = false;
  };
  $("#closeStats").onclick = function () { sm.hidden = true; };
  sm.addEventListener("click", function (e) { if (e.target === sm) sm.hidden = true; });

  // ---------- next game and midnight, like the other games ----------
  function tick() {
    if (!hook && dayNow() > N) {
      if (!S.results[N] && !guesses.length) { location.reload(); return; }
      if (S.results[N]) $("#fresh").hidden = false;
    }
    var n = new Date(), a = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), o = Math.max(0, Math.floor((a - n) / 1e3));
    var l = [Math.floor(o / 3600), Math.floor(o % 3600 / 60), o % 60].map(function (e) { return String(e).padStart(2, "0"); }).join(":");
    document.querySelectorAll(".countdown").forEach(function (e) { e.textContent = l; });
  }
  setInterval(tick, 1000); tick();
  window.addEventListener("hashchange", function () { location.reload(); });

  // ---------- start ----------
  try { var look = getComputedStyle(document.documentElement).getPropertyValue("--ground").trim(), tc = document.querySelector('meta[name="theme-color"]'); if (look && tc) tc.setAttribute("content", look); } catch (e) {}
  $("#num").textContent = "No. " + N;
  buildMap();
  startDaily();
  if (S.results[N]) showDone(); else showAsk();

  if (LOCAL) window.__dr = {
    N: N, P: P, POOLS: POOLS, daily: daily, km: km, points: points, total: total, band: band, fact: fact, shareText: shareText, stats: stats,
    S: function () { return { n: N, mode: mode, places: places.map(function (p) { return p.name + "|" + p.country; }), guesses: guesses.slice(), save: load() }; },
    tapAt: function (lat, lon) { place(toXY(lat, lon)); }, lock: lock, next: next, startPractice: startPractice
  };
  if (!LOCAL && "serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
