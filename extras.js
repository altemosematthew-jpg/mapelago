// Mapelago extras for the mystery city game: sound, the clue flourish, the play-first coach and streak freezes.
// The game itself lives in index.html. It calls window.MX.ev(name, data) at a few moments
// (a move, a new clue, a pin, the end of a round). If this file fails to load, the game still works:
// it just plays silently, opens the old rules sheet on a first visit and counts streaks the old way.
(function () {
  "use strict";

  var SOUND_KEY = "dailycity:sound"; // "off" when muted
  var COACH_KEY = "dailycity:coach"; // coach step, or "done"
  var FREEZE_SEEN_KEY = "dailycity:freezeSeen"; // last frozen day we told the player about
  var FREEZE_EVERY = 7; // one freeze for every 7 days played
  var FREEZE_MAX = 2; // hold at most 2

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s) { return document.querySelector(s); };
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
  }

  // ---------- sound ----------
  // Every sound is synthesised with Web Audio, so there are no files to download.
  var muted = store(SOUND_KEY) === "off";
  var ctx = null;
  var master = null;

  function audio() {
    if (muted) return null;
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.16;
        master.connect(ctx.destination);
      } catch (e) { ctx = null; return null; }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // One note: frequency in Hz, start offset and length in seconds.
  function note(freq, at, len, type, vol, slideTo) {
    var c = audio();
    if (!c) return;
    var t0 = c.currentTime + (at || 0);
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + len);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
    o.connect(g);
    g.connect(master);
    o.start(t0);
    o.stop(t0 + len + 0.02);
  }

  // A major pentatonic run: each bigger tile merges a step higher.
  var SCALE = [262, 294, 330, 392, 440, 523, 587, 659, 784, 880, 1047, 1175];
  var sounds = {
    slide: function () { note(180, 0, 0.04, "triangle", 0.18); },
    merge: function (v) {
      var step = Math.max(0, Math.min(SCALE.length - 1, Math.round(Math.log2(v)) - 1));
      note(SCALE[step], 0, 0.14, "triangle", 0.45);
    },
    bump: function () { note(110, 0, 0.07, "sine", 0.35, 90); },
    clue: function () { note(659, 0, 0.12, "sine", 0.4); note(880, 0.09, 0.12, "sine", 0.4); note(1175, 0.18, 0.22, "sine", 0.35); },
    pin: function () { note(200, 0, 0.14, "sine", 0.6, 90); },
    close: function () { note(523, 0.22, 0.12, "triangle", 0.4); note(659, 0.32, 0.18, "triangle", 0.4); },
    mid: function () { note(392, 0.22, 0.2, "triangle", 0.35); },
    far: function () { note(330, 0.22, 0.28, "sine", 0.35, 220); },
    stuck: function () { note(196, 0, 0.12, "triangle", 0.4); note(147, 0.12, 0.2, "triangle", 0.4); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { note(f, i * 0.11, i === 3 ? 0.45 : 0.14, "triangle", 0.45); }); },
    lose: function () { [392, 330, 262].forEach(function (f, i) { note(f, i * 0.16, 0.25, "sine", 0.35); }); }
  };
  function play(name, arg) {
    if (muted) return;
    try { sounds[name](arg); } catch (e) { /* sound must never break the game */ }
  }

  // Browsers only allow sound after the player has touched the page, so wake the audio on the first gesture.
  function wake() {
    audio();
    window.removeEventListener("pointerdown", wake, true);
    window.removeEventListener("keydown", wake, true);
  }
  window.addEventListener("pointerdown", wake, true);
  window.addEventListener("keydown", wake, true);

  var ICON_ON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

  function drawMute(btn) {
    btn.innerHTML = muted ? ICON_OFF : ICON_ON;
    btn.setAttribute("aria-pressed", muted ? "true" : "false");
    btn.setAttribute("aria-label", muted ? "Sound is off. Turn sound on" : "Sound is on. Turn sound off");
  }
  function addMuteButton() {
    var tools = $(".tools");
    if (!tools || $("#soundBtn")) return;
    var btn = document.createElement("button");
    btn.className = "tool";
    btn.id = "soundBtn";
    drawMute(btn);
    btn.onclick = function () {
      muted = !muted;
      store(SOUND_KEY, muted ? "off" : "on");
      drawMute(btn);
      if (!muted) play("clue");
    };
    tools.insertBefore(btn, tools.firstChild);
  }

  // ---------- clue flourish (3.1) ----------
  // When a slide opens a clue, the tile that earned it rings, and a copy of it flies into its slot on the clue track.
  function flyToTrack(i, v) {
    var chip = document.querySelectorAll("#track li")[i];
    if (!chip) return;
    var tile = null;
    document.querySelectorAll("#tiles .tile").forEach(function (t) { if (Number(t.textContent) === v) tile = t; });
    if (!tile) return;
    tile.classList.remove("tierup");
    void tile.offsetWidth;
    tile.classList.add("tierup");
    if (reduceMotion || !tile.animate) return;
    var a = tile.getBoundingClientRect();
    var b = chip.getBoundingClientRect();
    var fly = tile.cloneNode(true);
    fly.classList.remove("tierup", "new");
    fly.classList.add("fly");
    fly.style.left = a.left + "px";
    fly.style.top = a.top + "px";
    fly.style.width = a.width + "px";
    fly.style.height = a.height + "px";
    fly.style.translate = "none";
    fly.style.transform = "none";
    document.body.appendChild(fly);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2);
    var dy = b.top + b.height / 2 - (a.top + a.height / 2);
    var s = Math.max(0.25, b.height / a.height);
    fly.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(" + dx * 0.5 + "px," + (dy * 0.5 - 40) + "px) scale(" + (1 + s) / 2 + ")", opacity: 1 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")", opacity: 0.2 }
      ],
      { duration: 520, easing: "cubic-bezier(.3,.7,.4,1)" }
    ).onfinish = function () { fly.remove(); };
  }

  // ---------- play-first coach (9.1) ----------
  // A first-time player gets the board straight away. The turtle explains one thing at a time, as it happens.
  var TIPS = [
    "Find today's mystery city. Swipe the board, or use the arrow keys: two matching tiles join into one.",
    "Each new tile size opens a clue about the city. Every move costs a few points, so stop when you think you know.",
    "Think you know where the city is? Tap Drop a pin, then tap the map.",
    "Follow the arrow to your next pin. A miss also opens the next clue for free."
  ];
  var coachStep = null; // null = the coach is off

  function showTip(step, text) {
    var tip = $("#tip");
    if (!tip) return;
    coachStep = step;
    store(COACH_KEY, String(step));
    $("#tipText").textContent = text || TIPS[step];
    tip.hidden = false;
  }
  function endCoach() {
    coachStep = null;
    store(COACH_KEY, "done");
    var tip = $("#tip");
    if (tip) tip.hidden = true;
  }
  function startCoach() {
    var saved = store(COACH_KEY);
    if (saved === "done") return;
    var step = Math.max(0, Math.min(TIPS.length - 1, Number(saved) || 0));
    var x = $("#tipX");
    if (x) x.onclick = endCoach;
    showTip(step);
  }
  function coachOn(event, data) {
    if (coachStep === null) return;
    if (event === "clue" && data.how === "tile") {
      if (data.i >= 2 && coachStep < 2) showTip(2);
      else if (coachStep < 1) showTip(1);
    } else if (event === "openmap" && coachStep < 2) {
      showTip(2);
    } else if (event === "pin" && !data.done) {
      showTip(3, data.rc ? "Right country! Now find the city. Follow the arrow, and use the free clue your miss just opened." : TIPS[3]);
    } else if (event === "end") {
      endCoach();
    }
  }

  // ---------- streak freezes (5.1) ----------
  // Worked out fresh from the days you have played, so nothing new is stored and old saves count as they are.
  // Walking forward day by day: every 7th day played earns a freeze (hold up to 2). A missed day while
  // a streak is running spends a freeze instead of ending the streak. Today doesn't count as missed until it is over.
  function streak(results, today) {
    if (window.MXS) return window.MXS.streak(results, today); // one copy of the rules, in site.js
    var days = Object.keys(results || {}).map(Number).filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; });
    var out = { cur: 0, best: 0, freezes: 0, frozen: [] };
    if (!days.length) return out;
    var played = new Set(days);
    var end = Math.max(today, days[days.length - 1]);
    var count = 0;
    for (var d = days[0]; d <= end; d++) {
      if (played.has(d)) {
        out.cur++;
        count++;
        if (count % FREEZE_EVERY === 0) out.freezes = Math.min(FREEZE_MAX, out.freezes + 1);
      } else if (d < today) {
        if (out.cur > 0 && out.freezes > 0) {
          out.freezes--;
          out.frozen.push(d);
        } else {
          out.cur = 0;
        }
      }
      out.best = Math.max(out.best, out.cur);
    }
    return out;
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function streakText(data) {
    var s = streak(data.r, data.today);
    var text = "Your streak: " + plural(s.cur, "day", "days") + ".";
    if (s.freezes) text += " \u{1F9CA} " + plural(s.freezes, "streak freeze", "streak freezes") + " ready.";
    var last = s.frozen[s.frozen.length - 1];
    if (last && last >= data.today - 2 && Number(store(FREEZE_SEEN_KEY) || 0) < last) {
      store(FREEZE_SEEN_KEY, String(last));
      setTimeout(function () {
        var t = $("#toast");
        if (!t) return;
        t.textContent = "\u{1F9CA} A streak freeze covered the day you missed. Your " + s.cur + "-day streak lives on.";
        t.classList.add("show");
        setTimeout(function () { t.classList.remove("show"); }, 4200);
      }, 900);
    }
    return text;
  }
  function freezeNote(data) {
    var s = streak(data.r, data.today);
    var held = s.freezes ? "\u{1F9CA} " + plural(s.freezes, "streak freeze", "streak freezes") + " ready. " : "";
    var used = s.frozen.length ? " Freezes have saved your streak " + plural(s.frozen.length, "time", "times") + "." : "";
    return '<p class="freeze">' + held + "Play 7 days and you earn a freeze (you can hold 2). It covers a day you miss, so one gap doesn't end your streak." + used + "</p>";
  }

  // ---------- events from the game ----------
  var handlers = {
    move: function (d) {
      if (d.m && d.m.length) play("merge", Math.max.apply(null, d.m));
      else play("slide");
    },
    bump: function () { play("bump"); },
    clue: function (d) {
      play("clue");
      if (d.how === "tile") flyToTrack(d.i, d.v);
      coachOn("clue", d);
    },
    openmap: function () { coachOn("openmap", {}); },
    pin: function (d) {
      play("pin");
      if (!d.won) play(d.band === "close" ? "close" : d.band === "mid" ? "mid" : "far");
      coachOn("pin", d);
    },
    stuck: function () { play("stuck"); },
    end: function (d) {
      play(d.won ? "win" : "lose");
      coachOn("end", d);
    },
    firstVisit: function () { startCoach(); return true; },
    streak: function (d) { return streak(d.r, d.today); },
    streakText: streakText,
    freezeNote: freezeNote
  };

  window.MX = {
    ev: function (name, data) { var h = handlers[name]; return h ? h(data || {}) : undefined; },
    streak: streak // exposed for tests
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addMuteButton);
  else addMuteButton();
})();
