"use strict";
// Logbook: a daily history game about how the world map has changed since 1800.
// Every question and every day's round come from history-data.js, which review/history/build.py writes
// from the two source-checked blocks in review/history/. This file only plays them.
(function () {
  var NAME = "Logbook";                 // the game's name wherever it is shown; the page title and footer say it too
  var KEY = "dailycity:history:v1";     // the save, shared with streaks, "Today's games" and the save code
  var PAGE = "history.html";
  var D = window.MX_HIST;
  // the source lists spell it without the accent; it is shown as it should be
  try { D = JSON.parse(JSON.stringify(D).replace(/Cote d'Ivoire/g, "C\u00f4te d'Ivoire")); } catch (e) {}
  if (!D) return;
  var F = D.F, Q = D.Q, T = D.T;        // facts [year, text, source], multiple-choice questions, answer labels
  var $ = function (s) { return document.querySelector(s); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

  // ---------- which day ----------
  var today = window.MXS ? MXS.today() : 1, dayNo = today;
  var dm = /^#day-(\d+)$/.exec(location.hash);
  if (dm && local) dayNo = Number(dm[1]);   // test hook: only on this computer, never on the live site
  dayNo = Math.max(1, dayNo);
  // Modes: "daily" (today's round, counts for streaks), "past" (an earlier day from the archive, #past-N, saved apart and
  // never counted), "practice" (Play more: endless questions from the whole bank, never saved).
  var MODE = "daily";
  var pm = /^#past-(\d+)$/.exec(location.hash);
  if (pm && Number(pm[1]) >= 1 && Number(pm[1]) < today) { MODE = "past"; dayNo = Number(pm[1]); }
  var ARCH_KEY = "dailycity:history:past:v1";
  var WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function weekday(n) { return (n + 5) % 7; } // No. 1 was Saturday 14 November 2026
  var ITEMS = D.D[(dayNo - 1) % D.days];

  // ---------- the save ----------
  var save = (function () { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === "object") return s; } catch (e) {} return {}; })();
  save.v = 1;
  save.games = save.games && typeof save.games === "object" ? save.games : {};
  save.results = save.results && typeof save.results === "object" ? save.results : {};
  var arch = (function () { try { var s = JSON.parse(localStorage.getItem(ARCH_KEY)); if (s && typeof s === "object") return s; } catch (e) {} return {}; })();
  arch.v = 1;
  arch.games = arch.games && typeof arch.games === "object" ? arch.games : {};
  arch.results = arch.results && typeof arch.results === "object" ? arch.results : {};
  var home = MODE === "past" && !(save.games[dayNo] && save.results[dayNo]) ? arch : save;   // a day already played as the daily shows that result
  var mine = home.games[dayNo] && Array.isArray(home.games[dayNo].a) ? home.games[dayNo] : { a: [] };
  home.games[dayNo] = mine;
  function store() {
    if (MODE === "practice") return;   // practice is never saved
    try { localStorage.setItem(home === arch ? ARCH_KEY : KEY, JSON.stringify(home)); } catch (e) {}
  }

  // ---------- heat: how close a year (or a gap in years) was ----------
  // The first try ends the question if it lands within 5 years; otherwise it gets a band and a direction, and one more try.
  var BANDS = [
    { max: 0, e: "\u{1F3AF}", w: "Bang on", p1: 100, p2: 75 },
    { max: 5, e: "\u{1F525}", w: "Hot", p1: 85, p2: 60 },
    { max: 15, e: "\u{1F321}️", w: "Warm", p2: 30, range: "6 to 15 years out" },
    { max: 40, e: "❄️", w: "Cold", p2: 10, range: "16 to 40 years out" },
    { max: Infinity, e: "\u{1F9CA}", w: "Freezing", p2: 0, range: "more than 40 years out" }
  ];
  function band(diff) { for (var i = 0; i < BANDS.length; i++) if (diff <= BANDS[i].max) return BANDS[i]; return BANDS[BANDS.length - 1]; }
  function yrs(n) { return n + (n === 1 ? " year" : " years"); }

  // ---------- the round ----------
  function make(item) {
    var k = item[0];
    if (k === "w") return { k: "w", f: [item[1], item[2]], later: !!item[3] };
    if (k === "o") return { k: "o", f: item.slice(1) };
    if (k === "t") return { k: "t", f: [item[1]], lo: item[2], hi: item[3], ans: F[item[1]][0] };
    if (k === "g") return { k: "g", f: [item[1], item[2]], lo: 0, hi: 230, ans: Math.abs(F[item[1]][0] - F[item[2]][0]) };
    return { k: "m", q: item[1], opts: item[2], ans: item[3] };
  }
  var QS = ITEMS.map(make);
  var MC_KIND = { name: "What was it called?", nameof: "What was it called?", from: "Independent from whom?", capto: "Capital on the move", capfrom: "Capital on the move", capwho: "Capital on the move", city: "What was this city called?", cityof: "What was this city called?" };
  function changed(mq) { return (mq[0] === "city" || mq[0] === "cityof") && mq[5] ? mq[5].charAt(0).toUpperCase() + mq[5].slice(1) + "." : ""; }   // Block C's "what changed", as written
  function kindName(q) {
    return q.k === "w" ? (q.later ? "Which came later?" : "Which came first?") : q.k === "o" ? "Put in order" : q.k === "t" ? "When was it?" : q.k === "g" ? "How many years apart?" : MC_KIND[Q[q.q][0]];
  }
  function yearOf(i) { return F[i][0]; }

  // The state of question i from its saved answer: { done, pts, right, mark }
  function judge(i) {
    var q = QS[i], a = mine.a[i] || {};
    if (q.k === "w") {
      if (a.p == null) return { done: false };
      var y = q.f.map(yearOf), right = q.later ? y[a.p] > y[1 - a.p] : y[a.p] < y[1 - a.p];
      return { done: true, right: right, pts: right ? 100 : 0, mark: right ? "✅" : "❌" };
    }
    if (q.k === "o") {
      if (!a.p || a.p.length < 3) return { done: false };
      var ys = a.p.map(function (j) { return yearOf(q.f[j]); }), ok = ys[0] < ys[1] && ys[1] < ys[2];
      return { done: true, right: ok, pts: ok ? 100 : 0, mark: ok ? "✅" : "❌" };
    }
    if (q.k === "t" || q.k === "g") {
      var g = a.g || [];
      if (!g.length) return { done: false };
      var d1 = Math.abs(g[0] - q.ans), b1 = band(d1);
      if (d1 <= 5) return { done: true, right: true, pts: b1.p1, mark: b1.e, diff: d1, tries: 1, b: b1 };
      if (g.length < 2) return { done: false, first: b1, d1: d1, dir: q.ans > g[0] ? 1 : -1 };
      var d2 = Math.abs(g[1] - q.ans), b2 = band(d2);
      // a second try is marked one step cooler than its band, so 100 (first try, bang on) and 75 (second try) never share a mark
      return { done: true, right: d2 <= 5, pts: b2.p2, mark: BANDS[Math.min(BANDS.length - 1, BANDS.indexOf(b2) + 1)].e, diff: d2, tries: 2, b: b2, first: b1 };
    }
    if (a.p == null) return { done: false };
    var r = a.p === q.ans;
    return { done: true, right: r, pts: r ? 100 : 0, mark: r ? "✅" : "❌" };
  }
  function cur() { for (var i = 0; i < QS.length; i++) if (!judge(i).done) return i; return QS.length; }
  function total() { return QS.reduce(function (s, _, i) { var j = judge(i); return s + (j.done ? j.pts : 0); }, 0); }
  function marks() { return QS.map(function (_, i) { var j = judge(i); return j.done ? j.mark : ""; }).join(""); }

  // ---------- sound (the same mute setting as every other game) ----------
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
    } catch (e) { /* sound never breaks the game */ }
  }
  var SFX = {
    right: function () { note(659, 0, 0.12); note(880, 0.09, 0.18); },
    wrong: function () { note(196, 0, 0.12); note(147, 0.12, 0.2); },
    tap: function () { note(440, 0, 0.06, 0.25); },
    hot: function () { note(523, 0, 0.12); note(784, 0.08, 0.2); },
    warm: function () { note(523, 0, 0.16); },
    cold: function () { note(330, 0, 0.24, 0.35, "sine", 220); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { note(f, i * 0.11, i === 3 ? 0.45 : 0.14, 0.45); }); },
    end: function () { [392, 494, 587].forEach(function (f, i) { note(f, i * 0.12, 0.2, 0.35); }); }
  };
  var ICON_ON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  function drawMute() { var b = $("#soundBtn"); b.innerHTML = muted ? ICON_OFF : ICON_ON; b.setAttribute("aria-pressed", muted ? "true" : "false"); b.setAttribute("aria-label", muted ? "Sound is off. Turn sound on" : "Sound is on. Turn sound off"); }
  function heatSound(b) { (b.max <= 5 ? SFX.hot : b.max <= 15 ? SFX.warm : SFX.cold)(); }

  // ---------- drawing ----------
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function drawDots() {
    if (MODE === "practice") return practiceTally();
    var c = cur();
    if (typeof shown === "number" && shown < c && shown >= 0 && !$("#qnext").hidden) c = -1; // still reading the answer: the next question is not "now" yet
    $("#dots").innerHTML = QS.map(function (q, i) {
      var j = judge(i);
      var label = "Question " + (i + 1) + ": " + (j.done ? (j.right ? "right" : "not right") + ", " + j.pts + " points" : i === c ? "now" : "to come");
      return '<li class="' + (j.done ? "done" : i === c ? "now" : "") + '"><span aria-hidden="true">' + (j.done ? j.mark : "") + '</span><span class="sr">' + label + "</span></li>";
    }).join("");
    var on = shown >= 0 ? shown : c;
    $("#qn").textContent = c < QS.length || shown < QS.length - 1 ? "Question " + (on + 1) + " of " + QS.length : "All " + QS.length + " answered";
    $("#pts").textContent = total() + " points";
  }

  var shown = -1; // the question on screen
  function show(i, focus) {
    shown = i;
    var q = QS[i], j = judge(i);
    $("#qkind").textContent = kindName(q);
    var body = $("#qbody"), ask = $("#qask");
    $("#qsay").hidden = true; $("#qsay").className = "qsay";
    $("#qnext").hidden = true;
    if (q.k === "w") {
      ask.textContent = q.later ? "Tap the one that happened later" : "Tap the one that happened first";
      body.innerHTML = '<div class="opts two">' + q.f.map(function (f, k) { return '<button class="opt" type="button" data-k="' + k + '"><span>' + esc(F[f][1]) + "</span></button>"; }).join("") + "</div>";
      body.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { answer(i, { p: Number(b.dataset.k) }); }; });
    } else if (q.k === "o") {
      ask.textContent = "Tap them from earliest to latest";
      body.innerHTML = '<p class="hint">Tap a numbered one to take it back.</p><div class="opts two">' + q.f.map(function (f, k) {
        return '<button class="opt" type="button" aria-pressed="false" data-k="' + k + '"><span class="badge" aria-hidden="true"></span><span>' + esc(F[f][1]) + "</span></button>";
      }).join("") + "</div>";
      var order = [];
      var paint = function () {
        body.querySelectorAll(".opt").forEach(function (b) {
          var at = order.indexOf(Number(b.dataset.k));
          b.setAttribute("aria-pressed", at >= 0 ? "true" : "false");
          b.querySelector(".badge").textContent = at >= 0 ? at + 1 : "";
          b.setAttribute("aria-label", (at >= 0 ? ["First", "Second", "Third"][at] + ": " : "") + F[q.f[Number(b.dataset.k)]][1]);
        });
        var nx = $("#qnext");
        nx.hidden = order.length < 3; nx.textContent = "Lock in this order";
        nx.onclick = function () { if (order.length === 3) answer(i, { p: order.slice() }); };
      };
      body.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () {
          var k = Number(b.dataset.k), at = order.indexOf(k);
          if (at >= 0) order = order.slice(0, at); else if (order.length < 3) order.push(k);
          SFX.tap(); paint();
          if (order.length === 3) $("#qnext").focus();
        };
      });
      paint();
    } else if (q.k === "t" || q.k === "g") {
      var gap = q.k === "g";
      ask.textContent = gap ? "Slide to the number of years between them" : "Slide to the year it happened";
      var start = gap ? 50 : Math.round((q.lo + q.hi) / 2);
      if (j.first) start = mine.a[i].g[0];
      body.innerHTML = (gap ? q.f.map(function (f) { return '<p class="ev">' + esc(F[f][1]) + "</p>"; }).join("") : '<p class="ev">' + esc(F[q.f[0]][1]) + "</p>")
        + '<p class="hint">Within 5 years counts. You get two tries.</p>'
        + '<div class="tl"><div class="yearbig" aria-hidden="true"><b id="yr"></b>' + (gap ? "<span>years</span>" : "") + "</div>"
        + '<div class="rail"><input type="range" id="slider" min="' + q.lo + '" max="' + q.hi + '" step="1" value="' + start + '" aria-label="' + (gap ? "Years apart" : "Year") + '"></div>'
        + '<div class="ends" aria-hidden="true"><span>' + q.lo + (gap ? " years" : "") + "</span><span>" + q.hi + (gap ? " years" : "") + "</span></div>"
        + '<div class="tlpins" id="tlpins" aria-hidden="true"></div>'
        + '<div class="nudge">' + [-10, -1, 1, 10].map(function (d) { return '<button type="button" data-d="' + d + '" aria-label="' + (d < 0 ? "Minus " : "Plus ") + Math.abs(d) + '">' + (d < 0 ? "−" : "+") + Math.abs(d) + "</button>"; }).join("") + "</div></div>";
      var sl = $("#slider");
      var upd = function () {
        var v = Number(sl.value);
        $("#yr").textContent = v;
        sl.setAttribute("aria-valuetext", gap ? yrs(v) : String(v));
        var nx = $("#qnext"); nx.hidden = false; nx.textContent = "Lock in " + (gap ? yrs(v) : v);
      };
      sl.addEventListener("input", upd);
      sl.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); $("#qnext").click(); } });
      body.querySelectorAll(".nudge button").forEach(function (b) {
        b.onclick = function () { sl.value = Math.max(q.lo, Math.min(q.hi, Number(sl.value) + Number(b.dataset.d))); upd(); };
      });
      $("#qnext").onclick = function () {
        var g = (mine.a[i] && mine.a[i].g) ? mine.a[i].g.slice() : [];
        g.push(Number(sl.value)); answer(i, { g: g });
      };
      upd();
      pins(i);
      if (j.first) firstSay(i, j);
    } else {
      var mq = Q[q.q];
      ask.textContent = mq[1];
      body.innerHTML = '<div class="opts">' + q.opts.map(function (o, k) { return '<button class="opt" type="button" data-k="' + k + '"><span>' + esc(T[o]) + "</span></button>"; }).join("") + "</div>";
      body.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { answer(i, { p: Number(b.dataset.k) }); }; });
    }
    drawDots();
    if (j.done) reveal(i, true);
    if (focus) setTimeout(function () { ask.focus({ preventScroll: true }); if (!reduce) $("#quiz").scrollIntoView({ block: "nearest" }); }, 30);
  }

  function pins(i) {
    var q = QS[i], el = $("#tlpins"); if (!el) return;
    var g = (mine.a[i] && mine.a[i].g) || [], j = judge(i), out = "";
    var at = function (v) { return Math.max(4, Math.min(96, (v - q.lo) / (q.hi - q.lo) * 100)).toFixed(2) + "%"; };
    g.forEach(function (v, k) { out += '<span class="tlpin" style="left:' + at(v) + '">' + (k ? "2nd" : "1st") + "</span>"; });
    if (j.done) out += '<span class="tlpin ans" style="left:' + at(q.ans) + '">' + (q.k === "g" ? yrs(q.ans) : q.ans) + "</span>";
    el.innerHTML = out;
  }
  function firstSay(i, j) {
    var q = QS[i], s = $("#qsay");
    s.hidden = false; s.className = "qsay heat";
    s.innerHTML = '<span class="big" aria-hidden="true">' + j.first.e + "</span>" + j.first.w + ": " + j.first.range + ". "
      + (q.k === "g" ? (j.dir > 0 ? "It's a bigger gap." : "It's a smaller gap.") : (j.dir > 0 ? "Go later." : "Go earlier.")) + "<small>One more try.</small>";
  }

  function answer(i, a) {
    if (judge(i).done) return;
    mine.a[i] = a;
    var j = judge(i);
    if (j.done && cur() === QS.length && MODE !== "practice") finishSave();
    store();
    if (!j.done) { // a first slider try outside 5 years: say how warm, and go again
      heatSound(j.first); pins(i); firstSay(i, j);
      drawDots(); return;
    }
    if (QS[i].k === "t" || QS[i].k === "g") heatSound(j.b); else (j.right ? SFX.right : SFX.wrong)();
    reveal(i, false);
    drawDots();
  }

  function reveal(i, quiet) {
    var q = QS[i], j = judge(i), a = mine.a[i], s = $("#qsay"), body = $("#qbody");
    s.hidden = false;
    if (q.k === "w" || q.k === "o") {
      body.querySelectorAll(".opt").forEach(function (b) {
        var k = Number(b.dataset.k), f = q.f[k];
        b.disabled = true; b.classList.add("done");
        b.insertAdjacentHTML("beforeend", '<span class="yr">' + yearOf(f) + "</span>");
        if (q.k === "w") {
          var y = q.f.map(yearOf), win = q.later ? (y[k] > y[1 - k]) : (y[k] < y[1 - k]);
          if (win) b.classList.add("right"); else if (k === a.p) b.classList.add("wrong");
        } else {
          var sorted = q.f.slice().sort(function (x, z) { return yearOf(x) - yearOf(z); });
          if (a.p.indexOf(k) === sorted.indexOf(f)) b.classList.add("right"); else b.classList.add("wrong");
        }
      });
      if (q.k === "o") {
        var right = q.f.slice().sort(function (x, z) { return yearOf(x) - yearOf(z); });
        s.className = "qsay " + (j.right ? "ok" : "no");
        s.textContent = (j.right ? "Right order. " : "Not quite. ") + "Earliest to latest: " + right.map(function (f) { return yearOf(f); }).join(", ") + ".";
      } else {
        var y2 = q.f.map(yearOf);
        s.className = "qsay " + (j.right ? "ok" : "no");
        s.textContent = (j.right ? "Right. " : "Not this time. ") + Math.abs(y2[0] - y2[1]) + " years apart.";
      }
    } else if (q.k === "t" || q.k === "g") {
      var sl = $("#slider"); if (sl) { sl.disabled = true; sl.value = a.g[a.g.length - 1]; $("#yr").textContent = sl.value; }
      body.querySelectorAll(".nudge button").forEach(function (b) { b.disabled = true; });
      // answered: the nudges and the rule have done their job, so Next stays on a phone's screen
      body.querySelectorAll(".nudge, .hint").forEach(function (e) { e.style.display = "none"; });
      pins(i);
      var truth = q.k === "g" ? "They were " + yrs(q.ans) + " apart (" + yearOf(q.f[0]) + " and " + yearOf(q.f[1]) + ")." : "It was " + q.ans + ".";
      s.className = "qsay heat";
      s.innerHTML = '<span class="big" aria-hidden="true">' + j.b.e + "</span>" + (j.diff === 0 ? "Bang on! " + truth : j.b.w + ": " + yrs(j.diff) + " off. " + truth)
        + "<small>" + (j.right ? (j.tries === 1 ? "First try" : "Second try") + ", within 5 years: it counts. " : "") + "+" + j.pts + " points</small>";
    } else {
      body.querySelectorAll(".opt").forEach(function (b) {
        var k = Number(b.dataset.k); b.disabled = true; b.classList.add("done");
        if (k === q.ans) b.classList.add("right"); else if (k === a.p) b.classList.add("wrong");
      });
      var mq = Q[q.q], ans = T[mq[2]];
      s.className = "qsay " + (j.right ? "ok" : "no");
      s.textContent = (j.right ? "Right: " : "It was ") + ans + "." + (mq[0] === "from" && mq[5] && mq[5] !== ans ? " (" + mq[5] + ")" : "") + factLine(mq[3]) + (changed(mq) ? " " + changed(mq) : "");
    }
    var nx = $("#qnext"), last = i === QS.length - 1;
    nx.hidden = false; nx.textContent = MODE === "practice" ? "Another question" : last ? (MODE === "past" ? "See this day's log" : "See today's log") : "Next question";
    nx.onclick = function () { if (MODE === "practice") practiceNext(); else if (last) finish(true); else show(i + 1, true); };
    if (MODE === "practice") practiceTally();
    if (!quiet) setTimeout(function () { nx.focus({ preventScroll: true }); }, 30);
  }
  function factLine(ids) {
    var f = (ids || []).filter(function (x) { return F[x][0]; })[0];
    return f != null ? " " + F[f][0] + ": " + F[f][1] + "." : "";
  }

  // ---------- the end ----------
  function finishSave() {
    home.results[dayNo] = { score: total(), right: QS.filter(function (_, i) { return judge(i).right; }).length, marks: marks() };
  }
  function shareText() {
    var sc = total();
    return "Mapelago " + NAME + " No. " + dayNo + " \u{1F422} " + sc + " points\n" + marks() + "\n"
      + ((window.MXCOPY && MXCOPY.invite && MXCOPY.invite.history) || "How close to the year can you get?") + " mapelago.com/" + PAGE + "#c-" + dayNo + "-" + sc;
  }
  function title(sc) { return sc >= 800 ? "A perfect log" : sc >= 640 ? "Ship-shape" : sc >= 480 ? "Steady sailing" : sc >= 320 ? "Choppy waters" : "Lost in the fog"; }
  function recapItem(i) {
    var q = QS[i], j = judge(i), y = function (f) { return "<b>" + yearOf(f) + "</b> " + esc(F[f][1]); };
    var head = kindName(q), lines = [];
    if (q.k === "w" || q.k === "o" || q.k === "g") {
      lines = q.f.slice().sort(function (a, b) { return yearOf(a) - yearOf(b); }).map(y);
      if (q.k === "g") lines.push(yrs(q.ans) + " apart. You said " + yrs(mine.a[i].g[mine.a[i].g.length - 1]) + ".");
    } else if (q.k === "t") {
      lines = [y(q.f[0]), "You said " + mine.a[i].g.join(", then ") + "."];
    } else {
      var mq = Q[q.q];
      head = esc(mq[1]);
      lines = ["<b>" + esc(T[mq[2]]) + "</b>" + (mq[0] === "from" && mq[5] && mq[5] !== T[mq[2]] ? " (" + esc(mq[5]) + ")" : "")];
      mq[3].filter(function (x) { return F[x][0]; }).slice(0, 1).forEach(function (f) { lines.push(y(f)); });
      if (changed(mq)) lines.push('<span class="src">' + esc(changed(mq)) + "</span>");
    }
    return '<li><span class="mk" aria-hidden="true">' + j.mark + '</span><span><span class="q">' + (q.k === "m" ? head : esc(head)) + '<span class="sr"> (' + (j.right ? "right" : "not right") + ", " + j.pts + " points)</span></span>"
      + lines.map(function (l) { return '<span class="f">' + l + "</span>"; }).join("") + "</span></li>";
  }
  function finish(focus) {
    var sc = total();
    $("#quiz").hidden = true; $("#lede").hidden = true; $("#tally").hidden = true;
    $("#doneTitle").textContent = title(sc);
    $("#bigScore").textContent = sc;
    $("#shareText").textContent = shareText();
    $("#recap").innerHTML = QS.map(function (_, i) { return recapItem(i); }).join("");
    var past = MODE === "past";
    ["#shareText", "#shareBtn", ".mx-img", "#streakNote"].forEach(function (sel) { var el = $(sel); if (el) el.hidden = past; });
    $("#pastNote").hidden = !past;
    if (past) $("#pastNote").textContent = "No. " + dayNo + " from the archive. " + (home === save ? "You played it on the day, so this is your real result." : "Archive rounds don't count toward your streak or stats.");
    if (window.MXS && !past) {
      var s = MXS.streak(save.results, today);
      $("#streakNote").hidden = false;
      $("#streakNote").textContent = "Streak: " + s.cur + (s.cur === 1 ? " day" : " days") + ". Best: " + s.best + "." + (s.freezes ? " \u{1F9CA} " + s.freezes + (s.freezes === 1 ? " freeze" : " freezes") + " ready." : "");
    }
    drawDots();
    $("#done").hidden = false;
    if (focus) {
      (sc >= 800 ? SFX.win : SFX.end)();
      setTimeout(function () { $("#doneTitle").focus({ preventScroll: false }); }, 50);
    }
  }

  // ---------- stats (daily rounds only) ----------
  function stats() {
    var days = Object.keys(save.results).map(Number).filter(function (n) { return n > 0 && save.results[n] && save.results[n].score != null; });
    var scores = days.map(function (n) { return Number(save.results[n].score) || 0; });
    var s = window.MXS ? MXS.streak(save.results, today) : { cur: 0, best: 0 };
    var buckets = [0, 0, 0, 0, 0];   // 0-199, 200-399, 400-599, 600-799, 800
    scores.forEach(function (v) { buckets[Math.min(4, Math.floor(v / 200))]++; });
    return { played: days.length, avg: scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : 0,
      best: scores.length ? Math.max.apply(null, scores) : 0, cur: s.cur, bestStreak: s.best, buckets: buckets, todayScore: save.results[today] ? save.results[today].score : null };
  }
  function openStats() {
    var st = stats(), max = Math.max.apply(null, st.buckets.concat(1)), labels = ["0\u2013199", "200\u2013399", "400\u2013599", "600\u2013799", "800"];
    var mineB = st.todayScore != null ? Math.min(4, Math.floor(st.todayScore / 200)) : -1;
    $("#statsBody").innerHTML = '<div class="stats">'
      + [[st.played, "Played"], [st.avg, "Average"], [st.best, "Best"], [st.cur, "Streak"]].map(function (x) { return "<div><b>" + x[0] + "</b><span>" + x[1] + "</span></div>"; }).join("")
      + '</div><p class="note">Best streak: ' + st.bestStreak + (st.bestStreak === 1 ? " day" : " days") + ". Only daily rounds count; past logbooks and practice don't.</p>"
      + '<h3 class="sh">Your scores</h3><div class="hist">' + st.buckets.map(function (c, k) {
        return '<div class="hrow"><span>' + labels[k] + '</span><div class="hbar' + (k === mineB ? " me" : "") + '" style="width:' + Math.max(8, c / max * 100) + '%">' + c + "</div></div>";
      }).join("") + "</div>" + (st.played ? "" : '<p class="note">Finish a daily round to start your stats.</p>');
    $("#statsSheet").hidden = false;
  }

  // ---------- past logbooks ----------
  function openPast() {
    var rows = [];
    for (var n = today - 1; n >= 1; n--) {
      var r = save.results[n] || arch.results[n], d = new Date(Date.UTC(2026, 10, 13 + n));
      rows.push('<li><a href="#past-' + n + '">No. ' + n + " \u00b7 " + WEEK[d.getUTCDay()] + " " + d.getUTCDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()]
        + "</a><span>" + (r ? r.score + " points" + (save.results[n] ? "" : " (archive)") : "not played") + "</span></li>");
    }
    $("#pastList").innerHTML = rows.join("") || "<li>No earlier logbooks yet. Come back tomorrow.</li>";
    $("#pastSheet").hidden = false;
  }

  // ---------- play more (practice) ----------
  // Questions drawn at random from the whole bank under the same rules as the daily rounds. Nothing is saved:
  // the daily result, streak, stats and share text never change.
  var NT = {}, NW = {}, Z = {}, practiced = 0, practicePts = 0;
  (D.nt || []).forEach(function (i) { NT[i] = 1; }); (D.nw || []).forEach(function (i) { NW[i] = 1; }); (D.z || []).forEach(function (i) { Z[i] = 1; });
  function rint(n) { return Math.floor(Math.random() * n); }
  function pickFact(ok) { for (var t = 0; t < 4000; t++) { var i = rint(F.length); if (ok(i)) return i; } return -1; }
  function okPair(a, b, min) { var g = Math.abs(F[a][0] - F[b][0]); return a !== b && D.pc[a] !== D.pc[b] && g >= Math.max(min, Z[a] || Z[b] ? 20 : 5); }
  function practiceItem() {
    var roll = rint(13), wf = function (i) { return F[i][0] && !NW[i]; }, tl = function (i) { return F[i][0] && !NT[i]; };
    for (var tries = 0; tries < 200; tries++) {
      if (roll < 3) { var a = pickFact(wf), b = pickFact(wf); if (okPair(a, b, 5)) return ["w", a, b, Math.random() < 0.3 ? 1 : 0]; }
      else if (roll < 5) {
        var x = [pickFact(wf), pickFact(wf), pickFact(wf)].sort(function (p, q) { return F[p][0] - F[q][0]; });
        if (okPair(x[0], x[1], 5) && okPair(x[1], x[2], 5) && okPair(x[0], x[2], 10)) return ["o"].concat(x.sort(function () { return Math.random() - 0.5; }));
      } else if (roll < 8) {
        var f = pickFact(tl), y = F[f][0], w = 60 + rint(110), lo = Math.max(1800, Math.min(y - 4 - rint(Math.max(1, w - 8)), 2026 - w));
        if (lo <= y - 4 || lo === 1800) return ["t", f, lo, Math.min(2026, lo + w)];
      } else if (roll < 9) { var g1 = pickFact(tl), g2 = pickFact(tl); if (okPair(g1, g2, 8) && !Z[g1] && !Z[g2]) return ["g", g1, g2]; }
      else {
        var qi = rint(Q.length), wrong = (D.qd[qi] || []).slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3);
        if (wrong.length === 3) { var opts = wrong.concat([Q[qi][2]]).sort(function () { return Math.random() - 0.5; }); return ["m", qi, opts, opts.indexOf(Q[qi][2])]; }
      }
    }
    return ["w", 0, F.length - 1, 0];
  }
  function practiceTally() {
    var done = QS.filter(function (_, i) { return judge(i).done; });
    practiced = done.length; practicePts = QS.reduce(function (s, _, i) { var j = judge(i); return s + (j.done ? j.pts : 0); }, 0);
    $("#qn").textContent = "Practice \u00b7 " + practiced + (practiced === 1 ? " question" : " questions");
    $("#pts").textContent = practicePts + " points, not saved";
  }
  function startPractice() {
    MODE = "practice"; QS = []; mine = { a: [] };
    $("#done").hidden = true; $("#dots").hidden = true; $("#lede").hidden = false; $("#tally").hidden = false; $("#quiz").hidden = false; $("#practiceBar").hidden = false;
    $("#lede").textContent = "Practice: questions from the whole logbook, as many as you like. Nothing here is saved or shared, and today's result stays as it was.";
    $("#num").textContent = "Practice \u00b7 not saved";
    practiceNext();
  }
  function practiceNext() {
    QS.push(make(practiceItem()));
    show(QS.length - 1, true);
    $("#qkind").textContent = "Practice \u00b7 " + kindName(QS[QS.length - 1]);
    practiceTally();
  }

  function countdown() {
    var el = $("#countdown"); if (!el) return;
    var n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), s = Math.max(0, Math.floor((m - n) / 1000));
    el.textContent = String(Math.floor(s / 3600)).padStart(2, "0") + ":" + String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    if (window.MXS && MXS.today() !== today) $("#fresh").hidden = false;
  }

  // Offline after the first visit: sw.js saves every file fetched while it is in charge, but this page's own files
  // load before it takes over on a first visit. So once it is in charge, fetch them again for it to keep.
  // (When sw.js lists history.html, history.js and history-data.js itself, this becomes a harmless repeat.)
  function keepOffline() {
    var sw = navigator.serviceWorker;
    if (!sw.controller) { sw.addEventListener("controllerchange", keepOffline, { once: true }); return; }
    var urls = [location.pathname.split("/").pop() || PAGE].concat(Array.prototype.map.call(document.scripts, function (x) { return x.getAttribute("src"); }).filter(Boolean));
    urls.forEach(function (u) { fetch(u).catch(function () {}); });
  }

  function init() {
    $("#num").textContent = "No. " + dayNo + " · " + WEEK[weekday(dayNo)] + " · " + D.level[weekday(dayNo)] + (MODE === "past" ? " · archive" : "");
    if (MODE === "past") $("#lede").textContent = "An earlier logbook, No. " + dayNo + ". It doesn't count toward your streak or stats.";
    $("#statsBtn").onclick = openStats; $("#statsLink").onclick = openStats;
    $("#closeStats").onclick = function () { $("#statsSheet").hidden = true; };
    $("#pastBtn").onclick = openPast; $("#pastLink").onclick = openPast;
    $("#closePast").onclick = function () { $("#pastSheet").hidden = true; };
    ["#statsSheet", "#pastSheet"].forEach(function (id) { $(id).addEventListener("click", function (e) { if (e.target === $(id)) $(id).hidden = true; }); });
    $("#pastList").addEventListener("click", function (e) { if (e.target.closest("a")) setTimeout(function () { location.reload(); }, 0); });
    $("#moreBtn").onclick = startPractice;
    $("#practiceDone").onclick = function () { location.hash = ""; location.reload(); };
    $("#todayLink").hidden = MODE !== "past";
    window.addEventListener("hashchange", function () { if (/^#(past-\d+)?$/.test(location.hash) || location.hash === "") location.reload(); });
    drawMute();
    $("#soundBtn").onclick = function () { muted = !muted; try { localStorage.setItem("dailycity:sound", muted ? "off" : "on"); } catch (e) {} drawMute(); if (!muted) SFX.right(); };
    $("#shareBtn").onclick = async function () {
      var t = shareText(), b = this;
      try { if (navigator.share && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)) { await navigator.share({ text: t }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(t); b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy result"; }, 1600); } catch (e) { window.prompt("Copy your result:", t); }
    };
    var c = cur();
    if (c >= QS.length) { if (!home.results[dayNo]) { finishSave(); store(); } finish(false); }
    else {
      // a round in progress picks up where it was left: the answered question stays on screen until "Next"
      show(c, false);
    }
    countdown(); setInterval(countdown, 1000);
    if ((!local || /[?&]sw\b/.test(location.search)) && "serviceWorker" in navigator) {   // ?sw: the offline test, on this computer
      navigator.serviceWorker.register("sw.js").catch(function () {});
      navigator.serviceWorker.ready.then(function () { setTimeout(keepOffline, 1200); }).catch(function () {});
    }
    if (local) {
      window.__hist = {
        day: dayNo, D: D, get QS() { return QS; }, judge: judge, total: total, shareText: shareText, cur: cur, show: show,
        mode: function () { return MODE; }, practiceItem: practiceItem, stats: stats,
        // the right answer to question i, in the form answer() takes
        right: function (i) {
          var q = QS[i];
          if (q.k === "w") { var y = q.f.map(yearOf); return { p: (q.later ? y[0] > y[1] : y[0] < y[1]) ? 0 : 1 }; }
          if (q.k === "o") return { p: [0, 1, 2].sort(function (a, b) { return yearOf(q.f[a]) - yearOf(q.f[b]); }) };
          if (q.k === "t" || q.k === "g") return { g: [q.ans] };
          return { p: q.ans };
        }
      };
    }
  }
  init();
})();
