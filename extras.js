// Mapelago extras for the mystery city game: the play-first coach.
// The game itself lives in index.html. It calls window.MX.ev(name, data) at a few moments
// (a move, a new clue, a pin, the end of a round). If this file fails to load, the game still works:
// it just plays silently, opens the old rules sheet on a first visit and counts streaks the old way.
(function () {
  "use strict";

  var COACH_KEY = "dailycity:coach"; // coach step, or "done"

  var $ = function (s) { return document.querySelector(s); };
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
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

  // ---------- events from the game ----------
  var handlers = {
    clue: function (d) { coachOn("clue", d); },
    openmap: function () { coachOn("openmap", {}); },
    pin: function (d) { coachOn("pin", d); },
    end: function (d) { coachOn("end", d); },
    firstVisit: function () { startCoach(); return true; }
  };

  window.MX = {
    ev: function (name, data) { var h = handlers[name]; return h ? h(data || {}) : undefined; }
  };
})();
