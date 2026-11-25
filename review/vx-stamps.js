// Stamps from No. 14 (VX.FROM): the wheel's six categories change every day, drawn from the original six and the
// pack's families, and "Play more" opens endless practice.
// Source for the block review/vx-pack.js copies into stamps.html. Edit here, then run: node review/vx-pack.js
(function () {
  "use strict";
  var V = window.VX, F = V.FAM;
  var CLASSIC = ["capital", "border", "tongue", "size", "continent", "coast"];
  var NEW = ["money", "drive", "peak", "call", "web"];
  var ORDER = CLASSIC.concat(NEW);
  var LABELS = {}, NAMES = { capital: "Capitals", border: "Borders", tongue: "Languages", size: "Size", continent: "Continents", coast: "Coasts" };
  NEW.forEach(function (k) { LABELS[k] = NAMES[k] = F[k].label; });
  var s = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
  var ICONS = {
    money: '<rect x="-10" y="-6" width="20" height="12" rx="2" ' + s + '/><circle r="3" ' + s + '/>',
    drive: '<path d="M-7 9-2.5-9M7 9 2.5-9" ' + s + '/><path d="M0 8v-3M0 1v-3M0-6v-2" ' + s + '/>',
    peak: '<path d="M-10 8-3-6l4 6 3-4 6 12Z" ' + s + '/>',
    call: '<rect x="-5.5" y="-9.5" width="11" height="19" rx="2.5" ' + s + '/><path d="M-1.5 6h3" ' + s + '/>',
    web: '<rect x="-9.5" y="-8" width="19" height="16" rx="2" ' + s + '/><path d="M-9.5-3h19" ' + s + '/><circle cx="-6" cy="-5.6" r=".6" fill="currentColor"/><circle cx="-3.6" cy="-5.6" r=".6" fill="currentColor"/>',
  };
  var H = null, pools = null;
  // Called by the game on every day: the original builders, pools and helpers, and the label and icon tables to extend.
  function init(h) {
    H = h;
    Object.assign(h.D, LABELS); Object.assign(h.va, ICONS);
    pools = h.Ya(h.T);
    NEW.forEach(function (k) { pools[k] = h.T.filter(function (c) { return F[k].ok(c); }); });
  }
  // The day's six categories, worked out day by day from No. 14: each category comes up in proportion to how many
  // questions it has, so they all run out at about the same time; two or three of the new families every day,
  // and never the same six two days running.
  var days = {}, st = null;
  function cats(t) {
    if (!st) st = { day: V.FROM - 1, uses: {}, prev: "" };
    while (st.day < t) {
      var d = ++st.day, r = V.rng(d * 7919 + 41), tries = 0, out;
      do {
        var sorted = ORDER.map(function (k) { return [((st.uses[k] || 0) + 1) * 2 / pools[k].length + r() * 0.004 + (tries ? r() * 0.05 : 0), k]; })
          .sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; });
        // two or three of the new families, so three or four of the original six
        out = sorted.filter(function (k) { return NEW.indexOf(k) >= 0; }).slice(0, 2);
        sorted.forEach(function (k) {
          var isNew = NEW.indexOf(k) >= 0;
          if (out.length >= 6 || out.indexOf(k) >= 0 || (isNew && out.filter(function (x) { return NEW.indexOf(x) >= 0; }).length >= 3)) return;
          out.push(k);
        });
        out.sort(function (a, b) { return ORDER.indexOf(a) - ORDER.indexOf(b); });
        tries++;
      } while (out.join() === st.prev && tries < 20);
      var seen = {};
      out.forEach(function (k) { seen[k] = st.uses[k] || 0; st.uses[k] = seen[k] + 1; });
      days[d] = { cats: out, seen: seen };
      st.prev = out.join();
    }
    return days[t];
  }
  function fromFamily(cat, c, r) {
    var q = F[cat].make(c, H.T, r, true), o = V.shuffle([q.answer].concat(q.others), r);
    return { cat: cat, ask: q.ask, options: o, answer: o.indexOf(q.answer), about: q.note };
  }
  // The day's questions: two per category (a first try and a second chance). The original six carry on along their
  // own no-repeat order from where the old schedule left off; the new ones start their own.
  function deal(t, setCats) {
    var day = cats(t);
    setCats(day.cats.slice());
    var out = {};
    day.cats.forEach(function (cat, ci) {
      var pool = pools[cat], j = CLASSIC.indexOf(cat), at = day.seen[cat] * 2;
      var idx = j >= 0 ? H.yn(pool.length, 5501 + j * 131, (V.FROM - 1) * 2 + at, 2) : H.yn(pool.length, 7001 + NEW.indexOf(cat) * 131, at, 2);
      out[cat] = idx.map(function (i, k) {
        var seed = t * 8191 + ci * 313 + k * 17 + 3;
        return j >= 0 ? H.Wa[cat](H.sa(seed), H.T, pool[i]) : fromFamily(cat, pool[i], V.rng(seed));
      });
    });
    return out;
  }

  // ---- practice: endless questions from every category, a running streak and a best streak. Never touches the daily save. ----
  var $ = function (q) { return document.querySelector(q); };
  var pr = { q: null, streak: 0, done: false, recent: [] };
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function practiceQuestion() {
    var q = null;
    for (var i = 0; i < 50 && !q; i++) {
      var cat = V.pick(ORDER, Math.random), pool = pools[cat].filter(function (c) { return pr.recent.indexOf(cat + c.cc) < 0; });
      if (!pool.length) continue;
      var c = V.pick(pool, Math.random), seed = Math.floor(Math.random() * 4294967296);
      try { q = CLASSIC.indexOf(cat) >= 0 ? H.Wa[cat](H.sa(seed), H.T, c) : fromFamily(cat, c, V.rng(seed)); } catch (e) { q = null; }
      if (q) { q.cat = cat; pr.recent.push(cat + c.cc); if (pr.recent.length > 60) pr.recent.shift(); }
    }
    return q;
  }
  function score() { $("#sxpStreak").innerHTML = "Streak <b>" + pr.streak + "</b> · Best <b>" + V.best("stamps") + "</b>"; }
  function show() {
    var q = pr.q = practiceQuestion();
    pr.done = false;
    $("#sxpCat").innerHTML = '<svg viewBox="-11 -11 22 22" width="20" height="20" aria-hidden="true">' + H.va[q.cat] + "</svg> " + esc(NAMES[q.cat]);
    $("#sxpAsk").textContent = q.ask;
    $("#sxpOpts").innerHTML = q.options.map(function (o, i) { return '<button class="opt" data-i="' + i + '">' + esc(o) + "</button>"; }).join("");
    $("#sxpSay").hidden = true; $("#sxpNext").hidden = true;
    score();
  }
  function answer(i) {
    if (pr.done || !pr.q) return;
    pr.done = true;
    var q = pr.q, right = i === q.answer, was = V.best("stamps");
    document.querySelectorAll("#sxpOpts .opt").forEach(function (b, j) {
      b.disabled = true;
      if (j === q.answer) { b.classList.add("right"); b.insertAdjacentHTML("afterbegin", '<span aria-hidden="true">✓ </span><span class="sr">Right answer: </span>'); }
      else if (j === i) { b.classList.add("wrong"); b.insertAdjacentHTML("afterbegin", '<span aria-hidden="true">✗ </span><span class="sr">Your answer: </span>'); }
    });
    var msg;
    if (right) { pr.streak++; if (pr.streak > was) V.best("stamps", pr.streak); msg = "Right. " + (pr.streak > was && pr.streak > 1 ? "A new best streak: " + pr.streak + "." : "Streak " + pr.streak + "."); }
    else { msg = "Not that one." + (pr.streak ? " Your streak of " + pr.streak + " ends." : ""); pr.streak = 0; }
    var say = $("#sxpSay");
    say.textContent = msg + " " + q.about; say.className = "qsay " + (right ? "ok" : "no"); say.hidden = false;
    $("#sxpNext").hidden = false; $("#sxpNext").focus();
    score();
  }
  function open() {
    $("#done").hidden = true; $("#sxp").hidden = false;
    show();
    $("#sxp").scrollIntoView({ block: "start" });
    var b = $("#sxpOpts .opt"); if (b) b.focus({ preventScroll: true });
  }
  function close() { $("#sxp").hidden = true; $("#done").hidden = false; $("#sxMore").focus(); }
  function wire() {
    if (!$("#sxMore")) return;
    $("#sxMore").onclick = open;
    $("#sxpBack").onclick = close;
    $("#sxpNext").onclick = function () { show(); var b = $("#sxpOpts .opt"); if (b) b.focus(); };
    $("#sxpOpts").onclick = function (e) { var b = e.target.closest(".opt"); if (b) answer(Number(b.dataset.i)); };
  }
  window.SX = { FROM: V.FROM, init: init, deal: deal, cats: cats, order: ORDER, labels: NAMES, wire: wire, practice: { open: open, close: close, state: function () { return pr; } } };
})();
