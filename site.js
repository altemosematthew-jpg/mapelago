// Mapelago site helpers, loaded by every game page before the game's own script.
// 1. A damaged save never stops a game from starting.
// 2. Dialogs behave like dialogs: focus moves in and stays in, Escape closes only the top one
//    (through its own close button, so the game saves what it needs), and focus goes back after.
(function () {
  "use strict";

  // ---------- 1. repair damaged saves (16.6) ----------
  // Only fills in a missing or broken "results" / "games" list with an empty one. Nothing is deleted.
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (!/^dailycity:/.test(key)) continue;
      var raw = localStorage.getItem(key);
      if (!raw || raw.charAt(0) !== "{") continue;
      var save;
      try { save = JSON.parse(raw); } catch (e) { continue; }
      if (!save || typeof save !== "object") continue;
      var fixed = false;
      ["results", "games"].forEach(function (f) {
        if (f in save && (save[f] === null || typeof save[f] !== "object" || Array.isArray(save[f]))) {
          save[f] = {};
          fixed = true;
        }
      });
      if (fixed) localStorage.setItem(key, JSON.stringify(save));
    }
  } catch (e) { /* storage may be blocked; the game copes */ }

  // ---------- 2. dialogs (16.3, 17.7) ----------
  var open = []; // [{ modal, back }]
  function focusables(el) {
    return Array.prototype.filter.call(
      el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (e) { return !e.disabled && e.offsetParent !== null; }
    );
  }
  function opened(modal) {
    for (var i = 0; i < open.length; i++) if (open[i].modal === modal) return;
    open.push({ modal: modal, back: document.activeElement });
    setTimeout(function () {
      if (modal.hidden) return;
      var f = focusables(modal);
      var first = modal.querySelector("[data-focus]") || f.filter(function (e) { return !e.classList.contains("x"); })[0] || f[0];
      if (first) first.focus({ preventScroll: true });
    }, 40);
  }
  function closed(modal) {
    for (var i = open.length - 1; i >= 0; i--) {
      if (open[i].modal !== modal) continue;
      var back = open[i].back;
      open.splice(i, 1);
      var top = open[open.length - 1];
      if (top) { var f = focusables(top.modal); if (f[0] && !top.modal.contains(document.activeElement)) f[0].focus({ preventScroll: true }); }
      else if (back && document.contains(back) && back.focus && back !== document.body) back.focus({ preventScroll: true });
      return;
    }
  }
  function isModal(el) { return el && el.classList && el.classList.contains("modal"); }
  new MutationObserver(function (list) {
    list.forEach(function (r) {
      if (!isModal(r.target)) return;
      if (r.target.hidden) closed(r.target); else opened(r.target);
    });
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
  function scanOpen() { Array.prototype.forEach.call(document.querySelectorAll(".modal:not([hidden])"), opened); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scanOpen); else scanOpen();

  // Runs before the game's own key handler (this file loads first, and listens in the capture phase).
  window.addEventListener("keydown", function (e) {
    while (open.length && open[open.length - 1].modal.hidden) open.pop();
    var top = open[open.length - 1];
    if (!top) return;
    var m = top.modal;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopImmediatePropagation();
      var x = m.querySelector(".x") || m.querySelector('[id^="close"]');
      if (x) x.click(); else m.hidden = true;
      return;
    }
    if (e.key === "Tab") {
      var f = focusables(m);
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1], act = document.activeElement;
      if (!m.contains(act)) { e.preventDefault(); a.focus(); }
      else if (e.shiftKey && act === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && act === z) { e.preventDefault(); a.focus(); }
    }
  }, true);
})();
