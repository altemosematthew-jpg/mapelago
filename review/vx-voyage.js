// Voyage from No. 14 (VX.FROM): the pack's question families join the mix, and "Play more" opens endless practice.
// Source for the block review/vx-pack.js copies into voyage.html. Edit here, then run: node review/vx-pack.js
(function () {
  "use strict";
  var V = window.VX, F = V.FAM;
  // The six original kinds keep their order (the badges list them first); the pack's families follow.
  var KINDS = ["capital", "shape", "border", "mark", "size", "tongue", "inland", "drive", "web", "money", "call", "peak"];
  var COUNTRY = ["capital", "shape", "border", "tongue", "inland", "drive", "web", "money", "call", "peak"];
  var HARD = { capital: 0, shape: 0.05, border: 0.1, tongue: 0.1 };
  var LABEL = { capital: "Capitals", shape: "Outlines", border: "Borders", mark: "On the globe", size: "Sizes", tongue: "Languages" };
  COUNTRY.forEach(function (k) { if (F[k]) { HARD[k] = F[k].hard; LABEL[k] = F[k].label; } });
  var R = Math.PI / 180;
  function km(a, b) {
    var t = (b.lat - a.lat) * R, e = (b.lon - a.lon) * R;
    var o = Math.pow(Math.sin(t / 2), 2) + Math.cos(a.lat * R) * Math.cos(b.lat * R) * Math.pow(Math.sin(e / 2), 2);
    return 2 * 6371 * Math.asin(Math.sqrt(o));
  }
  function ok(k, c) {
    if (k === "capital") return !c.noCap && !(c.capital.indexOf(c.name) >= 0 || c.name.indexOf(c.capital) >= 0);
    if (k === "shape") return c.area >= 2e4;
    if (k === "border") return c.next.length > 0 && c.cc !== "FR";
    if (k === "tongue") return !c.noLang && c.langs.length > 0;
    return F[k].ok(c);
  }
  var cityName = function (h) { return h.name + ", " + h.country; };

  // One island's question. S is the island (0 to 9): from island 5 the wrong options come from the same continent.
  // Returns null when the question can't be made (too few wrong options, or the subject was already asked today).
  function make(kind, S, c, city, ctx) {
    var r = ctx.r, n = ctx.n, f = ctx.f, used = ctx.used, hard = S >= 4;
    var E = ctx.u.slice(0, Math.min(ctx.u.length, 40 + S * 16));
    var fin = function (q, right, wrong) {
      var k = wrong.filter(function (x, i) { return x !== right && wrong.indexOf(x) === i; });
      if (k.length < 3 || used.has(q.about)) return null;
      var o = V.shuffle([right].concat(k.slice(0, 3)), r);
      q.kind = kind; q.options = o; q.answer = o.indexOf(right);
      return q;
    };
    var others = function (w) {
      var A = E.filter(function (x) { return x.cc !== c.cc && w(x) && (!hard || x.continent === c.continent); });
      return V.shuffle(A.length < 3 ? n.filter(function (x) { return x.cc !== c.cc && w(x) && x.fame > 0; }) : A, r);
    };
    if (kind === "mark") {
      var w = city || V.pick(f, r), lim = hard ? 900 : 2500, picked = [];
      V.shuffle(f.slice(), r).some(function (T) {
        if (T.name === w.name) return false;
        var d = km(T, w);
        if (d < lim || (hard && d > 5e3)) return false;
        if (picked.some(function (y) { return y.name === T.name || km(T, y) < lim / 2; })) return false;
        picked.push(T); return picked.length === 3;
      });
      return fin({ about: cityName(w), ask: "Which city is at the mark?", show: { lat: w.lat, lon: w.lon, zoom: hard ? 2.2 : 1 } }, cityName(w), picked.map(cityName));
    }
    if (kind === "size") {
      var big = city || V.pick(f, r);
      return fin({ about: cityName(big), ask: "Which of these cities has the most people?" }, cityName(big),
        V.shuffle(f.filter(function (x) { return x.pop * 1.25 <= big.pop && x.name !== big.name; }), r).map(cityName));
    }
    if (!c || !ok(kind, c)) return null;
    if (kind === "capital") return fin({ about: c.cc, ask: "What is the capital of " + V.the(c.name) + "?" }, c.capital,
      others(function (x) { return x.capital.indexOf(c.name) < 0; }).map(function (x) { return x.capital; }));
    if (kind === "shape") return fin({ about: c.cc, ask: "Which country has this outline?", show: { cid: c.cid } }, c.name, others(function () { return true; }).map(function (x) { return x.name; }));
    if (kind === "border") {
      var nb = V.pick(c.next, r), A = n.filter(function (x) { return x.cc === nb; })[0];
      if (!A || (nb === "FR" && c.continent !== "Europe")) return null;
      return fin({ about: c.cc, ask: "Which of these countries shares a border with " + V.the(c.name) + "?" }, A.name,
        V.shuffle(n.filter(function (x) { return x.cc !== c.cc && c.next.indexOf(x.cc) < 0 && x.continent === c.continent && x.fame > 0; }), r).map(function (x) { return x.name; }));
    }
    if (kind === "tongue") {
      var L = V.pick(c.langs, r);
      var q = fin({ about: c.cc, ask: "In which of these countries is " + L + " an official language?" }, c.name,
        others(function (x) { return x.langs.indexOf(L) < 0; }).map(function (x) { return x.name; }));
      if (q) q.lang = L;
      return q;
    }
    var p = F[kind].make(c, n, r, hard);
    return fin({ about: c.cc, ask: p.ask, note: p.note }, p.answer, p.others);
  }

  // Which family each day's seven countries are asked about. Worked out day by day from No. 14, so a country is asked
  // about a family it hasn't had before whenever it has one left, no family comes up twice in a day if it can be
  // helped, and the families stay roughly even over time.
  var plans = {}, st = null;
  function plan(n, t, yn) {
    if (!st) st = { day: V.FROM - 1, used: {}, total: {} };
    while (st.day < t) {
      var d = ++st.day, today = {};
      plans[d] = yn(n.length, 9151, (d - 10) * 7, 7).map(function (i, j) {
        var c = n[i], el = COUNTRY.filter(function (k) { return ok(k, c); });
        if (!el.length) el = ["tongue"];
        var u = st.used[c.cc] || (st.used[c.cc] = []);
        var fresh = el.filter(function (k) { return u.indexOf(k) < 0; });
        if (!fresh.length) { u.length = 0; fresh = el; }
        var jr = V.rng(d * 131 + j * 7 + 1);
        var k = fresh.map(function (k) { return [(today[k] || 0) * 1000 + (st.total[k] || 0) + jr(), k]; }).sort(function (a, b) { return a[0] - b[0]; })[0][1];
        u.push(k); today[k] = (today[k] || 0) + 1; st.total[k] = (st.total[k] || 0) + 1;
        return { c: c, kind: k };
      });
    }
    return plans[t];
  }

  function setup(n, a, r) {
    return { r: r, n: n, u: n.slice().sort(function (x, y) { return y.fame - x.fame || (x.name < y.name ? -1 : 1); }), f: a.filter(function (h) { return h.pop >= 1e6; }), used: new Set() };
  }

  // The day's ten islands, easiest first. Seven countries and three cities, as before; the cities keep their schedule.
  function deal(n, a, t, yn) {
    var ctx = setup(n, a, V.rng(t * 6151 + 977)), h = t - 10;
    var rank = new Map(ctx.u.map(function (x, i) { return [x.cc, i / ctx.u.length]; }));
    var crank = new Map(ctx.f.slice().sort(function (x, y) { return y.pop - x.pop; }).map(function (x, i) { return [cityName(x), i / ctx.f.length]; }));
    var items = plan(n, t, yn).map(function (p) { return { kind: p.kind, c: p.c, ease: (rank.get(p.c.cc) || 0) * 0.8 + HARD[p.kind] }; });
    yn(ctx.f.length, 733, h * 3, 3).forEach(function (x, i) { items.push({ kind: i === 2 ? "size" : "mark", city: ctx.f[x], ease: (crank.get(cityName(ctx.f[x])) || 0) * 0.8 + 0.05 }); });
    items.sort(function (x, y) { return x.ease - y.ease; });
    return items.map(function (x, S) {
      var q = make(x.kind, S, x.c, x.city, ctx);
      if (!q && x.c) COUNTRY.forEach(function (k) { if (!q && k !== x.kind && ok(k, x.c)) q = make(k, S, x.c, null, ctx); });
      if (!q && x.city) q = make("mark", S, null, x.city, ctx);
      for (var i = 0; i < 400 && !q; i++) q = make(V.pick(["capital", "tongue", "web", "call"], ctx.r), S, V.pick(ctx.u.slice(0, 80), ctx.r), null, ctx);
      if (!q) throw new Error("No question found for island " + (S + 1) + " of day " + t);
      ctx.used.add(q.about);
      return q;
    });
  }

  // ---- practice: endless questions, a running streak and a best streak. Never reads or writes the daily save. ----
  var $ = function (s) { return document.querySelector(s); };
  var pr = { on: false, q: null, streak: 0, done: false, recent: [] };
  function practiceQuestion() {
    var H = window.VXH, ctx = setup(H.xa, H.dt, Math.random), S = Math.min(9, pr.streak), q = null;
    ctx.used = new Set(pr.recent);
    var kinds = KINDS.filter(function (k) { return (k !== "shape" && k !== "mark") || H.map(); });
    for (var i = 0; i < 200 && !q; i++) {
      var k = V.pick(kinds, Math.random);
      if (k === "mark" || k === "size") q = make(k, S, null, null, ctx);
      else {
        var pool = ctx.u.slice(0, Math.min(ctx.u.length, 40 + S * 16)).filter(function (c) { return ok(k, c); });
        if (pool.length) q = make(k, S, V.pick(pool, Math.random), null, ctx);
      }
    }
    pr.recent.push(q.about); if (pr.recent.length > 40) pr.recent.shift();
    return q;
  }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function score() {
    var b = V.best("voyage");
    $("#vxpStreak").innerHTML = "Streak <b>" + pr.streak + "</b> · Best <b>" + b + "</b>";
  }
  function show() {
    var q = pr.q = practiceQuestion();
    pr.done = false;
    $("#vxpKind").textContent = LABEL[q.kind] + (pr.streak >= 4 ? " · harder now" : "");
    $("#vxpAsk").textContent = q.ask;
    window.VXH.draw(q, $("#vxpShow"));
    $("#vxpOpts").innerHTML = q.options.map(function (o, i) { return '<button class="opt" data-k="' + i + '"><span>' + esc(o) + "</span></button>"; }).join("");
    $("#vxpSay").hidden = true; $("#vxpNext").hidden = true;
    score();
  }
  function answer(i) {
    if (pr.done || !pr.q) return;
    pr.done = true;
    var q = pr.q, right = i === q.answer;
    document.querySelectorAll("#vxpOpts .opt").forEach(function (b, j) {
      b.disabled = true;
      if (j === q.answer) { b.classList.add("right"); b.insertAdjacentHTML("afterbegin", '<span aria-hidden="true">✓</span><span class="sr">Right answer: </span>'); }
      else if (j === i) { b.classList.add("wrong"); b.insertAdjacentHTML("afterbegin", '<span aria-hidden="true">✗</span><span class="sr">Your answer: </span>'); }
    });
    var was = V.best("voyage"), msg;
    if (right) {
      pr.streak++;
      if (pr.streak > was) V.best("voyage", pr.streak);
      msg = "Right. " + (pr.streak > was && pr.streak > 1 ? "A new best streak: " + pr.streak + "." : "Streak " + pr.streak + ".");
    } else {
      msg = "Not that one. It was " + q.options[q.answer] + "." + (pr.streak ? " Your streak of " + pr.streak + " ends." : "");
      pr.streak = 0;
    }
    if (q.note) msg += " " + q.note;
    var say = $("#vxpSay");
    say.textContent = msg; say.className = "qsay " + (right ? "ok" : "no"); say.hidden = false;
    $("#vxpNext").hidden = false; $("#vxpNext").focus();
    score();
  }
  function open() {
    pr.on = true;
    document.body.classList.add("vx-practicing"); $("#done").hidden = true; $("#vxp").hidden = false;
    show();
    $("#vxp").scrollIntoView({ block: "start" });
    var b = $("#vxpOpts .opt"); if (b) b.focus({ preventScroll: true });
  }
  function close() {
    pr.on = false;
    document.body.classList.remove("vx-practicing");
    $("#vxp").hidden = true; $("#done").hidden = false;
    $("#vxMore").focus();
  }
  function wire() {
    if (!$("#vxMore")) return;
    $("#vxMore").onclick = open;
    $("#vxpBack").onclick = close;
    $("#vxpNext").onclick = function () { show(); var b = $("#vxpOpts .opt"); if (b) b.focus(); };
    $("#vxpOpts").onclick = function (e) { var b = e.target.closest(".opt"); if (b) answer(Number(b.dataset.k)); };
  }

  window.VXV = { deal: deal, kinds: KINDS, labels: LABEL, plan: plan, ok: ok, wire: wire, practice: { open: open, close: close, state: function () { return pr; } } };
})();
