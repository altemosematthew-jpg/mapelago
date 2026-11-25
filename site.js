// Mapelago site helpers, loaded by every game page before the game's own script.
// 1. A damaged save never stops a game from starting.
// 2. Dialogs behave like dialogs: focus moves in and stays in, Escape closes only the top one
//    (through its own close button, so the game saves what it needs), and focus goes back after.
// 3. Streaks across all seven games: freezes, a note when a streak is waiting, one stats panel, a save code.
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
      // The city and country games need both lists; the other games need "results".
      var need = /^dailycity:(v2|country:v1)$/.test(key) ? ["results", "games"] : ["results"];
      ["results", "games"].forEach(function (f) {
        var bad = f in save ? save[f] === null || typeof save[f] !== "object" || Array.isArray(save[f]) : need.indexOf(f) >= 0;
        if (bad) {
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

  // ---------- 3. streaks across all seven games (5.1, 5.2, 5.3, 5.4) ----------
  var GAMES = [
    { id: "city", name: "Mystery city", key: "dailycity:v2", url: "./" },
    { id: "country", name: "Mystery country", key: "dailycity:country:v1", url: "country.html" },
    { id: "bigger", name: "Bigger city?", key: "dailycity:bigger:v1", url: "bigger.html" },
    { id: "bigcountry", name: "Bigger country?", key: "dailycity:bigcountry:v1", url: "bigger-country.html" },
    { id: "voyage", name: "Voyage", key: "dailycity:voyage:v1", url: "voyage.html" },
    { id: "fathoms", name: "Fathoms", key: "dailycity:fathoms:v1", url: "fathoms.html" },
    { id: "stamps", name: "Stamps", key: "dailycity:stamps:v1", url: "stamps.html" }
  ];
  var FREEZE_EVERY = 7, FREEZE_MAX = 2;
  function today() {
    var d = new Date();
    return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 10, 14)) / 864e5) + 1;
  }
  // Worked out fresh from the days already saved, so nothing new is stored and old saves count as they are.
  // Every 7th day played earns a freeze (hold up to 2). A missed day while a streak is running spends one
  // instead of ending the streak. Today only counts as missed once it is over.
  function streak(results, now) {
    var days = Object.keys(results || {}).map(Number).filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; });
    var out = { cur: 0, best: 0, freezes: 0, frozen: [], played: days.length, days: days };
    if (!days.length) return out;
    var set = {}; days.forEach(function (d) { set[d] = 1; });
    var end = Math.max(now, days[days.length - 1]), count = 0;
    for (var d = days[0]; d <= end; d++) {
      if (set[d]) {
        out.cur++; count++;
        if (count % FREEZE_EVERY === 0) out.freezes = Math.min(FREEZE_MAX, out.freezes + 1);
      } else if (d < now) {
        if (out.cur > 0 && out.freezes > 0) { out.freezes--; out.frozen.push(d); } else out.cur = 0;
      }
      out.best = Math.max(out.best, out.cur);
    }
    return out;
  }
  function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function plural(n, a, b) { return n + " " + (n === 1 ? a : b); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function info() {
    var now = today();
    return GAMES.map(function (g) {
      var save = read(g.key), res = (save && save.results) || {};
      var s = streak(res, now);
      s.game = g; s.doneToday = !!res[now]; s.res = res;
      return s;
    });
  }
  window.MXS = { streak: streak, info: info, today: today, games: GAMES };

  var CSS = '.mx-risk{display:block;margin:0 0 10px;line-height:1.45;padding:8px 12px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r,12px);background:var(--tint,#dcedf5);color:var(--ink,#000);font-size:14px;font-weight:600}'
    + '.mx-risk a{color:inherit;font-weight:800}'
    + '.mx-link{background:none;border:0;padding:4px 0;font:inherit;font-weight:800;text-decoration:underline;text-underline-offset:3px;color:inherit;cursor:pointer;min-height:44px}'
    + '.mxm{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:12px;background:var(--scrim,rgba(0,0,0,.32))}.mxm[hidden]{display:none}'
    + '.mxs{position:relative;width:min(560px,100%);max-height:calc(100vh - 24px);overflow:auto;background:var(--paper,#fff);color:var(--ink,#000);border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r,12px);padding:18px 18px 22px}'
    + '.mxs h2{margin:0 44px 12px 0;font-size:22px}.mxs h3{margin:18px 0 6px;font-size:16px}.mxs p{margin:6px 0;font-size:14.5px;line-height:1.4}'
    + '.mxs .x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r-tool,10px);background:var(--paper,#fff);color:inherit;font-size:22px;cursor:pointer}'
    + '.mx-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;padding:8px 0;border-top:1.5px solid var(--rule,#c9e1ec)}'
    + '.mx-row b{font-size:15px}.mx-row .n{font-size:13.5px;color:var(--ink-2,#3d4a52);grid-column:1/-1}'
    + '.mx-cal{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}.mx-cal i{width:13px;height:13px;border:1.5px solid var(--ink,#000);border-radius:3px;font-style:normal;font-size:9px;line-height:10px;text-align:center}'
    + '.mx-cal i.p{background:var(--accent,#b4237d)}.mx-cal i.f{border-style:dashed}.mx-cal i.t{outline:2px solid var(--focus,#b4237d);outline-offset:1px}'
    + '.mxs textarea{width:100%;min-height:76px;box-sizing:border-box;font:12px ui-monospace,monospace;border:1.5px solid var(--line,#000);border-radius:8px;padding:6px}'
    + '.mxs .btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.mxs .btns button{min-height:44px;padding:0 14px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r-btn,12px);background:var(--paper,#fff);color:inherit;font:inherit;font-weight:800;cursor:pointer}'
    + '.mxs .btns .go{background:var(--accent,#b4237d);color:var(--on-accent,#fff)}';

  function here() {
    var f = location.pathname.split("/").pop() || "";
    return GAMES.filter(function (g) { return g.url === (f === "index.html" ? "./" : f || "./"); })[0];
  }

  // 5.2 a note on every game page when another game's streak is waiting for today
  function riskNote(app) {
    var me = here();
    var risk = info().filter(function (s) { return s.cur >= 3 && !s.doneToday && (!me || s.game.id !== me.id); });
    if (!risk.length) return;
    var el = document.createElement("p");
    el.className = "mx-risk"; el.setAttribute("role", "status");
    el.innerHTML = risk.map(function (s) {
      return s.freezes
        ? "Play <a href=\"" + s.game.url + "\">" + esc(s.game.name) + "</a> today to keep your " + s.cur + "-day streak without using a freeze."
        : "Your " + s.cur + "-day <a href=\"" + s.game.url + "\">" + esc(s.game.name) + "</a> streak ends at midnight.";
    }).join("<br>");
    var head = app.querySelector("header");
    if (head && head.parentNode === app) app.insertBefore(el, head.nextSibling); else app.insertBefore(el, app.firstChild);
  }

  // 5.3 one place for every game's streak, with the last 30 days
  function sheet() {
    var m = document.getElementById("mxStreaks");
    if (m) return m;
    m = document.createElement("div");
    m.className = "modal mxm"; m.id = "mxStreaks"; m.hidden = true;
    m.innerHTML = '<div class="mxs" role="dialog" aria-modal="true" aria-labelledby="mxT"><button class="x" id="closeMxs" aria-label="Close">×</button><h2 id="mxT">Your streaks</h2><div id="mxBody"></div>'
      + '<h3>Move your streaks to another device</h3><p>Copy your save code here, then paste it on the other device. Days you have already played there are kept.</p>'
      + '<div class="btns"><button class="go" id="mxCopy">Copy save code</button></div>'
      + '<p><label for="mxPaste">Paste a save code from another device:</label></p><textarea id="mxPaste" spellcheck="false" autocomplete="off"></textarea>'
      + '<div class="btns"><button id="mxLoad">Load it</button></div><p id="mxSay" role="status"></p></div>';
    document.body.appendChild(m);
    m.addEventListener("click", function (e) { if (e.target === m) m.hidden = true; });
    m.querySelector("#closeMxs").onclick = function () { m.hidden = true; };
    m.querySelector("#mxCopy").onclick = copyCode;
    m.querySelector("#mxLoad").onclick = loadCode;
    return m;
  }
  function openSheet() {
    var m = sheet(), now = today();
    m.querySelector("#mxBody").innerHTML = info().map(function (s) {
      var cal = "";
      for (var d = now - 29; d <= now; d++) {
        if (d < 1) continue;
        var p = !!s.res[d], f = s.frozen.indexOf(d) >= 0;
        cal += '<i class="' + (p ? "p" : f ? "f" : "") + (d === now ? " t" : "") + '" title="No. ' + d + (p ? ": played" : f ? ": a freeze covered it" : ": not played") + '">' + (f ? "❄" : "") + "</i>";
      }
      return '<div class="mx-row"><b><a href="' + s.game.url + '">' + esc(s.game.name) + "</a></b><span>" + (s.doneToday ? "Done today" : "Not played today") + "</span>"
        + '<span class="n">' + plural(s.played, "day", "days") + " played. Streak " + s.cur + ", best " + s.best + (s.freezes ? ". \u{1F9CA} " + plural(s.freezes, "freeze", "freezes") + " ready" : "") + (s.frozen.length ? ". Freezes have saved it " + plural(s.frozen.length, "time", "times") : "") + ".</span>"
        + '<span class="mx-cal" role="img" aria-label="Last 30 days: ' + Object.keys(s.res).filter(function (k) { return k > now - 30; }).length + ' played">' + cal + "</span></div>";
    }).join("") + "<p>Every 7 days you play a game earns a streak freeze for that game (hold up to 2). A freeze covers a day you miss, so one gap doesn't end your streak.</p>";
    m.querySelector("#mxSay").textContent = "";
    m.hidden = false;
  }

  // 5.4 save code: every Mapelago save on this device, compressed when the browser can
  function b64(bytes) { var s = ""; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function unb64(t) { t = t.replace(/-/g, "+").replace(/_/g, "/"); var s = atob(t), b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; }
  async function pack(text) {
    var bytes = new TextEncoder().encode(text);
    if (window.CompressionStream) {
      var z = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer());
      return "MAPELAGO-Z" + b64(z);
    }
    return "MAPELAGO-J" + b64(bytes);
  }
  async function unpack(code) {
    var m = /MAPELAGO-([ZJ])([A-Za-z0-9_-]+)/.exec(code.replace(/\s+/g, ""));
    if (!m) throw new Error("bad");
    var bytes = unb64(m[2]);
    if (m[1] === "Z") bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function copyCode() {
    var all = {};
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^dailycity:/.test(k)) all[k] = localStorage.getItem(k); }
    var code = await pack(JSON.stringify(all)), say = document.getElementById("mxSay");
    try { await navigator.clipboard.writeText(code); say.textContent = "Save code copied. Paste it on your other device."; }
    catch (e) { var t = document.getElementById("mxPaste"); t.value = code; t.select(); say.textContent = "Select the code above and copy it."; }
  }
  // Merge, never overwrite: days already played on this device stay as they are.
  function merge(mine, theirs) {
    if (!mine || typeof mine !== "object") return theirs;
    if (!theirs || typeof theirs !== "object") return mine;
    ["results", "games"].forEach(function (f) {
      if (theirs[f] && typeof theirs[f] === "object") {
        mine[f] = mine[f] && typeof mine[f] === "object" ? mine[f] : {};
        Object.keys(theirs[f]).forEach(function (d) { if (!(d in mine[f])) mine[f][d] = theirs[f][d]; });
      }
    });
    Object.keys(theirs).forEach(function (k) { if (!(k in mine)) mine[k] = theirs[k]; });
    return mine;
  }
  async function loadCode() {
    var say = document.getElementById("mxSay"), data;
    try { data = await unpack(document.getElementById("mxPaste").value); } catch (e) { say.textContent = "That doesn't look like a Mapelago save code. Copy it again and paste the whole thing."; return; }
    var n = 0;
    Object.keys(data).forEach(function (k) {
      if (!/^dailycity:/.test(k) || typeof data[k] !== "string") return;
      var mineRaw = localStorage.getItem(k), theirs = data[k], out = theirs;
      if (mineRaw !== null) {
        var a = null, b = null;
        try { a = JSON.parse(mineRaw); b = JSON.parse(theirs); } catch (e) { a = null; }
        out = a && b && typeof a === "object" ? JSON.stringify(merge(a, b)) : mineRaw;
      }
      localStorage.setItem(k, out); n++;
    });
    say.textContent = "Loaded " + plural(n, "save", "saves") + ". Reloading…";
    setTimeout(function () { location.reload(); }, 900);
  }

  function mount() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var app = document.querySelector(".app");
    if (app) riskNote(app);
    var nav = document.querySelector('nav[aria-label="Daily games"]');
    if (nav) {
      var b = document.createElement("button");
      b.className = "mx-link"; b.type = "button"; b.textContent = "Your streaks"; b.onclick = openSheet;
      nav.parentNode.insertBefore(b, nav.nextSibling);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
