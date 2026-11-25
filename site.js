// Mapelago site helpers, loaded by every game page before the game's own script.
// 1. A damaged save never stops a game from starting.
// 2. Dialogs behave like dialogs: focus moves in and stays in, Escape closes only the top one
//    (through its own close button, so the game saves what it needs), and focus goes back after.
// 3. Streaks across all the games: freezes, a note when a streak is waiting, one stats panel, a save code.
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

  // ---------- 3. streaks across all the games (5.1, 5.2, 5.3, 5.4) ----------
  var GAMES = [
    { id: "city", name: "Mystery city", key: "dailycity:v2", url: "./", icon: "\u{1F3D9}\uFE0F", about: "Slide tiles for clues, then pin today's city." },
    { id: "country", name: "Mystery country", key: "dailycity:country:v1", url: "country.html", icon: "\u{1F30D}", about: "The same, with a country to find." },
    { id: "bigger", name: "Bigger city?", key: "dailycity:bigger:v1", url: "bigger.html", icon: "\u{1F465}", about: "Ten pairs: tap the city where more people live." },
    { id: "bigcountry", name: "Bigger country?", key: "dailycity:bigcountry:v1", url: "bigger-country.html", icon: "\u{1F5FA}\uFE0F", about: "Ten pairs: tap the country with more land." },
    { id: "voyage", name: "Voyage", key: "dailycity:voyage:v1", url: "voyage.html", icon: "\u26F5", about: "Ten islands of trivia. Sail on or drop anchor." },
    { id: "fathoms", name: "Fathoms", key: "dailycity:fathoms:v1", url: "fathoms.html", icon: "\u{1F30A}", about: "Name the least obvious right answer." },
    { id: "stamps", name: "Stamps", key: "dailycity:stamps:v1", url: "stamps.html", icon: "\u{1F4EE}", about: "Spin, answer, and fill a page of stamps." },
    { id: "crossings", name: "Crossings", key: "dailycity:crossings:v1", url: "crossings.html", icon: "\u{1F9ED}", about: "Name the countries between two others, border by border." }
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
    + '.mxs .btns .go{background:var(--accent,#b4237d);color:var(--on-accent,#fff)}'
    + '.mx-today{grid-column:1/-1;margin:36px 0 0}.mx-today h2{margin:0 0 10px;font-size:20px}'
    + '.mx-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}'
    + '.mx-card a{display:grid;grid-template-columns:auto minmax(0,1fr);gap:2px 10px;align-items:start;height:100%;box-sizing:border-box;padding:10px 12px;min-height:44px;border:var(--bw,2px) solid var(--line,#000);border-bottom-width:var(--lip,6px);border-radius:var(--r,12px);background:var(--paper,#fff);color:var(--ink,#000);text-decoration:none}'
    + '.mx-card .ic{grid-row:span 3;font-size:26px;line-height:1.1}.mx-card b{font-size:16px;line-height:1.2}.mx-card .ab{font-size:13px;line-height:1.3;color:var(--ink-2,#3d4a52)}'
    + '.mx-card .st{font-size:12.5px;font-weight:800;color:var(--accent-ink,#b4237d)}.mx-card.done a{background:var(--tint,#dcedf5)}.mx-card.here a{outline:3px solid var(--accent,#b4237d);outline-offset:-3px}'
    + '.mx-next{margin:10px 0 0;font-size:15px;font-weight:600}.mx-next a{font-weight:800;color:inherit}'
    + '.mx-passport{margin:18px 0 0}.mx-passport h3{margin:0 0 4px;font-size:17px}.mx-passport p{margin:0 0 8px;font-size:14px}.mx-passport ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.mx-passport li{display:grid;justify-items:center;gap:2px;padding:6px 2px;border:1.5px dashed var(--line,#000);border-radius:8px;font-size:12px}.mx-passport b{font-size:11px;letter-spacing:-1px;color:var(--accent-ink,#b4237d);word-break:break-all;text-align:center;line-height:1.1}'
    + '.mx-vs{margin:0 0 10px;padding:10px 12px;border:var(--bw,2px) solid var(--line,#000);border-radius:var(--r,12px);background:var(--tint,#dcedf5);color:var(--ink,#000)}.mx-vs-cols{display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center}.mx-vs-cols span{display:block;font-size:13px;font-weight:600}.mx-vs-cols b{font-size:34px;font-weight:800;font-style:var(--num-style,normal)}.mx-vs p{margin:6px 0 0;font-weight:700;text-align:center}.mx-vs .mx-link{display:block;margin:0 auto}'
    + '.mx-ver{margin:14px 0 0;font-size:12px;color:var(--ink-2,#3d4a52)}'
    + '.mx-past{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:4px}.mx-past li{display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border:1.5px solid var(--rule,#c9e1ec);border-radius:8px}.mx-past a{font-weight:800;color:inherit}';

  // Addresses come with or without ".html" (mapelago.com/bigger and the previews' /bigger work too), and the home
  // page as "/", "/index" or "/index.html". Pages inside a folder (/games/, /about/) are not games.
  function pageKey(p) { p = String(p || "").replace(/^\.?\//, "").replace(/\.html$/, ""); return p === "index" ? "" : p; }
  function here() {
    var parts = location.pathname.split("/"), f = parts.pop();
    if (parts.filter(Boolean).length) return undefined;
    return GAMES.filter(function (g) { return pageKey(g.url) === pageKey(f); })[0];
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


  // 18.6 a share image for the games that had none, drawn from their own share text
  var TURTLE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200"><g fill="#9fc98b" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"><path d="M45.5 24h9v12h-9z"/><path d="M50 8c6 0 9.5 5 9.5 10.5S56 28 50 28s-9.5-4-9.5-9.5S44 8 50 8z"/><path d="M32 41C21 30 9 30 8.5 37.5c-.4 5.6 9 10 23.5 12z"/><path d="M68 41c11-11 23-11 23.5-3.5.4 5.6-9 10-23.5 12z"/><path d="M35 73c-9 4-16 11-12 15 4.5 3.8 12-3 17-10z"/><path d="M65 73c9 4 16 11 12 15-4.5 3.8-12-3-17-10z"/><path d="M46.5 80 50 91l3.5-11z"/></g><circle cx="46" cy="16.5" r="1.8" fill="#000000"/><circle cx="54" cy="16.5" r="1.8" fill="#000000"/><rect x="29" y="34" width="42" height="43" rx="15" fill="#ffffff" stroke="#000000" stroke-width="2.4"/><rect x="34.2" y="39.2" width="10.8" height="10.8" fill="#ffffff" stroke="#000000" stroke-width="1.4"/><rect x="45" y="39.2" width="10.8" height="10.8" fill="#dcedf5" stroke="#000000" stroke-width="1.4"/><rect x="55.800000000000004" y="39.2" width="10.8" height="10.8" fill="#a9d3e8" stroke="#000000" stroke-width="1.4"/><rect x="34.2" y="50" width="10.8" height="10.8" fill="#9fc98b" stroke="#000000" stroke-width="1.4"/><rect x="45" y="50" width="10.8" height="10.8" fill="#b4237d" stroke="#000000" stroke-width="1.4"/><path d="M50.4 58.9c-.7-1.4-3-3.3-3-5.2a3 3 0 0 1 6 0c0 1.9-2.3 3.8-3 5.2z" fill="#ffffff"/><circle cx="50.4" cy="53.8" r="1" fill="#b4237d"/><rect x="55.800000000000004" y="50" width="10.8" height="10.8" fill="#f3d98a" stroke="#000000" stroke-width="1.4"/><rect x="34.2" y="60.800000000000004" width="10.8" height="10.8" fill="#a9d3e8" stroke="#000000" stroke-width="1.4"/><rect x="45" y="60.800000000000004" width="10.8" height="10.8" fill="#dcedf5" stroke="#000000" stroke-width="1.4"/><rect x="55.800000000000004" y="60.800000000000004" width="10.8" height="10.8" fill="#ffffff" stroke="#000000" stroke-width="1.4"/></svg>';
  function shareImage(text, me) {
    var lines = text.split("\n"), W = 1080, H = 1350, c = document.createElement("canvas");
    c.width = W; c.height = H;
    var x = c.getContext("2d"), font = "Overpass, 'Helvetica Neue', Arial, sans-serif";
    x.fillStyle = "#e6f1f7"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#fff"; x.fillRect(48, 48, W - 96, H - 96); x.lineWidth = 6; x.strokeStyle = "#000"; x.strokeRect(48, 48, W - 96, H - 96);
    x.fillStyle = "#dcedf5"; x.beginPath(); x.moveTo(51, H - 260); x.quadraticCurveTo(W / 2, H - 330, W - 51, H - 260); x.lineTo(W - 51, H - 51); x.lineTo(51, H - 51); x.fill();
    var head = lines[0].split(" \u{1F422} "), title = head[0].replace(/^Mapelago /, ""), score = head[1] || "";
    x.fillStyle = "#000"; x.font = "italic 800 84px " + font; x.fillText(title.replace(/ No\. \d+$/, ""), 300, 190);
    x.font = "600 44px " + font; x.fillStyle = "#3d4a52"; x.fillText("Mapelago · " + (title.match(/No\. \d+$/) || [""])[0], 300, 255);
    x.fillStyle = "#000"; x.font = "italic 800 " + (score.length > 10 ? 120 : 170) + "px " + font; x.fillText(score.replace(/ points$/, ""), 110, 520);
    if (/points$/.test(score)) { x.font = "600 46px " + font; x.fillStyle = "#3d4a52"; x.fillText("points", 116, 590); }
    // marks as shapes, so they read the same on every phone
    var marks = Array.from(lines[1] || "").filter(function (ch) { return /\S/.test(ch) && ch !== "️"; }), size = Math.min(110, Math.floor((W - 220) / Math.max(1, marks.length)) - 12);
    marks.forEach(function (m, i) {
      var px = 110 + i * (size + 12), py = 680;
      x.lineWidth = 5; x.strokeStyle = "#000"; x.setLineDash([]);
      var fill = { "✅": "#b4237d", "\u{1F7E6}": "#2c7bb6", "\u{1F7E8}": "#f3d98a", "⬜": "#ffffff", "⚓": "#a9d3e8", "\u{1F4A1}": "#f3d98a" }[m];
      if (m === "❌") { x.setLineDash([12, 8]); x.strokeRect(px, py, size, size); x.setLineDash([]); x.beginPath(); x.moveTo(px + size * .28, py + size * .28); x.lineTo(px + size * .72, py + size * .72); x.moveTo(px + size * .72, py + size * .28); x.lineTo(px + size * .28, py + size * .72); x.stroke(); return; }
      x.fillStyle = fill || MXFILL[m] || "#ffffff"; x.fillRect(px, py, size, size); x.strokeRect(px, py, size, size); // MXFILL: Logbook's heat marks
      if (m === "✅") { x.strokeStyle = "#fff"; x.lineWidth = 8; x.beginPath(); x.moveTo(px + size * .25, py + size * .52); x.lineTo(px + size * .43, py + size * .7); x.lineTo(px + size * .76, py + size * .3); x.stroke(); }
      if (m === "⚓") { x.fillStyle = "#000"; x.font = "800 " + Math.round(size * .6) + "px " + font; x.fillText("⚓", px + size * .2, py + size * .72); }
    });
    var last = lines[lines.length - 1] || "", ask = last.replace(/\s*\S+$/, ""), url = (last.match(/\S+$/) || [""])[0].replace(/#.*$/, "");
    x.fillStyle = "#000"; x.font = "800 56px " + font; x.fillText(ask, 110, H - 180);
    x.fillStyle = "#b4237d"; x.font = "800 46px " + font; x.fillText(url, 110, H - 110);
    return new Promise(function (done) {
      var img = new Image();
      img.onload = function () { x.drawImage(img, 80, 80, 200, 200); done(c); };
      img.onerror = function () { done(c); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(TURTLE);
    });
  }
  async function shareImageClick(me) {
    var t = document.getElementById("shareText"); if (!t) return;
    var c = await shareImage(t.textContent, me), blob = await new Promise(function (r) { c.toBlob(r, "image/png"); });
    try {
      var f = new File([blob], "mapelago-" + me.id + ".png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: t.textContent }); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    var m = document.getElementById("mxImg");
    if (!m) {
      m = document.createElement("div"); m.className = "modal mxm"; m.id = "mxImg"; m.hidden = true;
      m.innerHTML = '<div class="mxs" role="dialog" aria-modal="true" aria-labelledby="mxImgT"><button class="x" id="closeMxImg" aria-label="Close">×</button><h2 id="mxImgT">Your result card</h2><p>Press and hold the image to save it, or download it, then post it.</p><img id="mxImgPic" alt="Your result card" style="width:100%;border:2px solid #000;border-radius:8px"><div class="btns"><a class="go" id="mxImgDl" download="mapelago.png" style="display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:2px solid #000;border-radius:12px;text-decoration:none;font-weight:800">Download</a></div></div>';
      document.body.appendChild(m);
      m.querySelector("#closeMxImg").onclick = function () { m.hidden = true; };
      m.addEventListener("click", function (e) { if (e.target === m) m.hidden = true; });
    }
    var url = c.toDataURL("image/png");
    m.querySelector("#mxImgPic").src = url; m.querySelector("#mxImgDl").href = url; m.querySelector("#mxImgDl").download = "mapelago-" + me.id + ".png";
    m.hidden = false;
  }
  function addImageButton() {
    var me = here(), btn = document.getElementById("shareBtn");
    if (!me || !btn || document.getElementById("imgBtn") || me.id === "city" || me.id === "country" || (me.id === "reckoning")) return;
    var b = document.createElement("button");
    b.className = btn.className + " mx-img"; b.type = "button"; b.textContent = "Share image";
    b.onclick = function () { shareImageClick(me); };
    btn.parentNode.insertBefore(b, btn.nextSibling);
  }

  // 18.7 one message for everything you played today
  function todayText() {
    var t = today(), parts = [];
    info().forEach(function (s) {
      var r = s.res[t]; if (!r) return;
      if (s.game.id === "history") { parts.push(s.game.icon + " " + (r.score != null ? r.score : "✓")); return; } // Logbook
      var id = s.game.id, v =
        id === "city" || id === "country" ? (r.q ? (r.won ? r.pins + "/5 quick" : "X/5 quick") : r.score != null ? r.score : "✓") :
        id === "bigger" || id === "bigcountry" ? (r.score != null ? r.score + "/10" : "✓") :
        id === "fathoms" ? (r.total != null ? Number(r.total).toLocaleString("en-US") : "✓") :
        id === "stamps" ? (r.got != null ? r.got + "/6" : "✓") :
        id === "crossings" ? (r.score != null ? r.score : "✓") : id === "reckoning" ? (r.total != null ? r.total : "✓") :
        id === "ballast" ? (r.score != null ? Number(r.score).toLocaleString("en-US") : "✓") : "✓";
      parts.push(s.game.icon + " " + v);
    });
    return { n: parts.length, text: "Mapelago today, No. " + t + " \u{1F422}\n" + parts.join(" · ") + "\nmapelago.com/games/" };
  }


  // 13.4 a real celebration for a perfect game; 15.5 the Stamps passport book
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function perfect(me, text) {
    var line = (text.split("\n")[0] || "") + " " + (text.split("\n")[1] || "");
    if (me.id === "history") return /\b800 points\b/.test(line); // Logbook
    if (me.id === "voyage") return /✅{10}/.test(text.replace(/\s/g, ""));
    if (me.id === "bigger" || me.id === "bigcountry") return /\b10\/10\b/.test(line);
    if (me.id === "stamps") return /\b6 of 6\b/.test(line);
    if (me.id === "fathoms") return /7,000 of 7,000/.test(line);
    if (me.id === "crossings") return /\u{1F422} 1,?000 points/u.test(line);
    if (me.id === "reckoning") return /1,000 of 1,000/.test(line);
    return false;
  }
  function confetti(box) {
    if (reduce || !box.animate) return;
    var cs = getComputedStyle(document.documentElement), cols = ["--accent", "--t8", "--t16", "--t32", "--t4"].map(function (v) { return cs.getPropertyValue(v).trim() || "#b4237d"; });
    var layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:fixed;left:0;right:0;top:0;height:0;pointer-events:none;z-index:80";
    document.body.appendChild(layer);
    for (var i = 0; i < 30; i++) {
      var c = document.createElement("i");
      c.style.cssText = "position:absolute;top:-12px;width:10px;height:10px;border-radius:2px;left:" + (4 + (i * 37) % 92) + "%;background:" + cols[i % cols.length];
      layer.appendChild(c);
      c.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: "translate(" + ((i % 7) - 3) * 16 + "px," + (420 + (i % 5) * 60) + "px) rotate(" + (i % 2 ? 1 : -1) * (220 + i * 9) + "deg)", opacity: 0 }],
        { duration: 1200 + (i % 6) * 120, delay: (i % 9) * 40, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" });
    }
    setTimeout(function () { layer.remove(); }, 2600);
  }
  function passport(done) {
    if (document.getElementById("mxPassport")) return;
    var save = read("dailycity:stamps:v1"), res = (save && save.results) || {}, t = today(), rows = "";
    for (var d = Math.max(1, t - 13); d <= t; d++) {
      var r = res[d], got = r && r.got != null ? r.got : null;
      rows += '<li title="No. ' + d + (got == null ? ": not played" : ": " + got + " of 6") + '"><span>' + d + "</span><b>" + (got == null ? "·" : "■".repeat(got) + "□".repeat(6 - got)) + "</b></li>";
    }
    var sec = document.createElement("section");
    sec.id = "mxPassport"; sec.className = "mx-passport";
    sec.innerHTML = "<h3>Your passport</h3><p>The last two weeks of pages. Each square is a stamp.</p><ol>" + rows + "</ol>";
    done.appendChild(sec);
  }
  function watchDone() {
    var me = here(), done = document.getElementById("done");
    if (!me || !done || me.id === "city" || me.id === "country") return;
    var seen = false;
    function check() {
      if (done.hidden || seen) return;
      seen = true;
      var t = document.getElementById("shareText");
      if (me.id === "stamps") passport(done);
      if (t && perfect(me, t.textContent)) {
        confetti(done);
        var tm = document.getElementById("logoMascot");
        if (tm && tm.animate && !reduce) tm.animate([{ transform: "translateY(0)" }, { transform: "translateY(-8px)" }, { transform: "translateY(0)" }], { duration: 450, iterations: 3 });
      }
    }
    new MutationObserver(check).observe(done, { attributes: true, attributeFilter: ["hidden"] });
    check();
  }

  // 16.5 Today's games: a card for every game with today's status, and what to play next
  function today_games(app) {
    var me = here(), all = info();
    var sec = document.createElement("section");
    sec.className = "mx-today"; sec.setAttribute("aria-labelledby", "mxTodayH");
    var next = nextUp(all, me), meLeft = me && all.some(function (s) { return s.game.id === me.id && !s.doneToday; });
    var homeCopy = me && me.id === "city" && window.MXCOPY && MXCOPY.home;
    sec.innerHTML = (homeCopy ? '<h2 id="mxTodayH">' + esc(homeCopy.headline) + '</h2><p class="mx-next">' + esc(homeCopy.line) + "</p>" : '<h2 id="mxTodayH">Today\'s games</h2>') + '<ul class="mx-cards">' + all.map(function (s) {
      var g = s.game, isMe = me && g.id === me.id;
      var st = s.doneToday ? "\u2713 Done today" : isMe ? "You're here" : s.cur >= 2 ? s.cur + "-day streak: play today" : "Play";
      return '<li class="mx-card' + (s.doneToday ? " done" : "") + (isMe ? " here" : "") + '"><a href="' + g.url + '"' + (isMe ? ' aria-current="page"' : "") + '><span class="ic" aria-hidden="true">' + g.icon + "</span><b>" + esc(g.name) + '</b><span class="ab">' + esc((window.MXCOPY && MXCOPY.cards && MXCOPY.cards[g.id]) || g.about) + '</span><span class="st">' + st + "</span></a></li>";
    }).join("") + "</ul>" + (next ? '<p class="mx-next">Next up: <a href="' + next.game.url + '">' + esc(next.game.name) + "</a></p>" : '<p class="mx-next">' + (meLeft ? "This is the last game left today." : "Every game done today. See you tomorrow.") + '</p>');
    var tt = todayText();
    if (tt.n >= 2) {
      var share = document.createElement("p"); share.className = "mx-next";
      share.innerHTML = '<button class="mx-link" type="button" id="mxToday">Copy today\'s results (' + tt.n + " games)</button>";
      sec.appendChild(share);
      share.querySelector("button").onclick = async function () {
        var txt = todayText().text, b = this;
        try { await navigator.clipboard.writeText(txt); b.textContent = "Copied. Paste it in your group chat."; }
        catch (e) { window.prompt("Copy your results:", txt); }
      };
    }
    var foot = app.querySelector("footer");
    if (foot && foot.parentNode === app) app.insertBefore(sec, foot); else app.appendChild(sec);
  }

  // 18.5 a friend's challenge link (#c-<number>-<score>) on the games that had none
  var UNIT = { bigger: function (n) { return n + " of 10"; }, bigcountry: function (n) { return n + " of 10"; }, voyage: function (n) { return n + " points"; },
    fathoms: function (n) { return Number(n).toLocaleString("en-US") + " fathoms"; }, stamps: function (n) { return n + " of 6 stamps"; }, crossings: function (n) { return n + " points"; } };
  function challenge(app) {
    var me = here(), m = /^#c-(\d+)-(\d+)$/.exec(location.hash);
    if (!me || !m || !UNIT[me.id]) return;
    var n = Number(m[1]), t = today();
    if (Math.abs(n - t) > 1) return;
    var el = document.createElement("p");
    el.className = "mx-risk"; el.setAttribute("role", "status");
    el.textContent = n === t
      ? "A friend scored " + UNIT[me.id](m[2]) + " on No. " + n + ". Try to beat it."
      : "A friend scored " + UNIT[me.id](m[2]) + " on No. " + n + ". That is " + (n < t ? "yesterday's" : "tomorrow's") + " puzzle where you are, so today you get No. " + t + ". Play it and send yours back.";
    var head = app.querySelector("header");
    if (head && head.parentNode === app) app.insertBefore(el, head.nextSibling); else app.insertBefore(el, app.firstChild);
  }
  // ---------- Logbook (history game): start ----------
  // Logbook joins streaks, "Today's games", today's combined message, challenge links and the share image.
  // Its page is history.html; its own code is history.js. Merge notes: review/history-merge-notes.md
  GAMES.push({ id: "history", name: "Logbook", key: "dailycity:history:v1", url: "history.html", icon: "\u{1F4DC}", about: "Eight questions on how the world map has changed since 1800." });
  UNIT.history = function (n) { return n + " points"; };
  var MXFILL = { "\u{1F3AF}": "#7a0177", "\u{1F525}": "#e06a00", "\u{1F321}": "#f3d98a", "\u2744": "#a9d3e8", "\u{1F9CA}": "#dcedf5" };
  // Until every page's footer lists Logbook, add it to the "Daily games" links on pages that don't.
  function logbookLink() {
    Array.prototype.forEach.call(document.querySelectorAll('nav[aria-label="Daily games"]'), function (nav) {
      if (nav.querySelector('a[href$="history.html"]')) return;
      var a = document.createElement("a"); a.href = "history.html"; a.textContent = "Logbook";
      nav.appendChild(document.createTextNode(" ")); nav.appendChild(a);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", logbookLink); else logbookLink();
  // ---------- Logbook: end ----------
  // ---------- Dead Reckoning: start ----------
  // Dead Reckoning joins streaks, "Today's games", today's combined message and challenge links. Its page is
  // dead-reckoning.html; its own code is dead-reckoning.js. Merge notes: review/dead-reckoning-merge-notes.md
  GAMES.push({ id: "reckoning", name: "Dead Reckoning", key: "dailycity:reckoning:v1", url: "dead-reckoning.html", icon: "\u{1F4CD}", about: "Tap five places on a blank map. Closer scores more." });
  UNIT.reckoning = function (n) { return Number(n).toLocaleString("en-US") + " of 1,000"; };
  // ---------- Dead Reckoning: end ----------
  // ---------- Ballast ----------
  // Only the Daily Ballast counts for streaks and "Today's games"; the voyages (levels) keep their stars in the same save.
  GAMES.push({ id: "ballast", name: "Ballast", key: "dailycity:ballast:v1", url: "ballast.html", icon: "\u{1F6A2}", about: "Stack real countries on a ship. Name them for bonus points." });
  UNIT.ballast = function (n) { return Number(n).toLocaleString("en-US") + " points"; };
  // ---------- Ballast: end ----------

  // The first game not yet played today, in menu order, leaving out the one you're on.
  function nextUp(all, me) { return (all || info()).filter(function (s) { return !s.doneToday && (!me || s.game.id !== me.id); })[0]; }
  // Every result's "play next" button goes to the first unplayed game (or to All games once everything is done).
  function nextButtons() {
    var me = here(); if (!me) return;
    var n = nextUp(null, me), btns = document.querySelectorAll("#done .row2 a.act.plain, #endBody a.act.plain.also");
    Array.prototype.forEach.call(btns, function (a) {
      var href = n ? n.game.url : "games/", text = n ? "Play " + n.game.name + " next" : "All done today: see every game";
      if (a.getAttribute("href") !== href) a.setAttribute("href", href);
      if (a.textContent !== text) a.textContent = text;
    });
  }
  // A small release line in each game's footer, so a bug report can say which version it was.
  function versionLine() {
    var f = document.querySelector(".app > footer"), sc = document.querySelector('script[src*="site.js?v="]');
    if (!f || !sc || f.querySelector(".mx-ver")) return;
    var v = (/[?&]v=([\w.-]+)/.exec(sc.getAttribute("src")) || [])[1]; if (!v) return;
    var p = document.createElement("p"); p.className = "mx-ver"; p.textContent = "Mapelago release " + v;
    f.appendChild(p);
  }

  // Beat my score. A shared result carries #b-<game>-<puzzle>-<mode>-<score>: a two-letter game code and
  // whole numbers only, nothing about the person and never the answer. Everything read from the address is
  // checked against fixed lists and ranges, and only ever written into the page as text.
  var BEAT = {
    city: { code: "mc", max: 1000, modes: 2 }, country: { code: "mn", max: 1000, modes: 2 },
    bigger: { code: "bc", max: 10, modes: 1 }, bigcountry: { code: "bn", max: 10, modes: 1 },
    voyage: { code: "vy", max: 1000, modes: 1 }, fathoms: { code: "fa", max: 7000, modes: 1 },
    stamps: { code: "st", max: 6, modes: 1 }, crossings: { code: "cr", max: 1000, modes: 1 },
    history: { code: "lb", max: 800, modes: 1 },
    reckoning: { code: "dr", max: 1000, modes: 1 },
    ballast: { code: "bl", max: 60000, modes: 1 }
  };
  function gameByCode(c) { var id = Object.keys(BEAT).filter(function (k) { return BEAT[k].code === c; })[0]; return id ? GAMES.filter(function (g) { return g.id === id; })[0] : null; }
  function gameByPage(page) { return GAMES.filter(function (g) { return pageKey(g.url) === pageKey(page); })[0]; }
  function said(id, mode, n) {
    if (mode === 1) return n >= 200 && n % 200 === 0 ? "found it on pin " + ((1000 - n) / 200 + 1) + " of 5 in Quick mode" : "didn't find it in 5 pins in Quick mode";
    if (id === "city" || id === "country" || id === "crossings") return Number(n).toLocaleString("en-US") + " points";
    if (UNIT[id]) return UNIT[id](n);
    return String(n);
  }
  function parseBeat(hash) {
    var m = /^#b-([a-z]{2})-(\d{1,5})-([0-9])-(\d{1,5})$/.exec(hash || "");
    if (!m) return null;
    var g = gameByCode(m[1]); if (!g) return null;
    var n = Number(m[2]), mode = Number(m[3]), sc = Number(m[4]), b = BEAT[g.id];
    if (n < 1 || n > today() + 1 || mode >= b.modes || sc > b.max) return null;
    return { game: g, n: n, mode: mode, score: sc };
  }
  // the game's own link, old style (#c-<puzzle>-<score>[-<pins>]) or new, turned into the new style
  var LINK = /(mapelago\.com\/)([\w.-]*)#(?:c-(\d+)-(\d+)(?:-\d+)?|b-[a-z]{2}-\d+-\d-\d+)/;
  function upgrade(text) {
    if (typeof text !== "string") return text;
    return text.replace(new RegExp(LINK.source, "g"), function (all, host, page, n, sc) {
      if (n === undefined) return all;
      var g = gameByPage(page); if (!g || !BEAT[g.id]) return all;
      var mode = BEAT[g.id].modes > 1 && /quick mode/i.test(text) ? 1 : 0;
      return host + page + "#b-" + BEAT[g.id].code + "-" + n + "-" + mode + "-" + sc;
    });
  }
  function ownResult(text) {
    var m = /#b-([a-z]{2})-(\d+)-(\d)-(\d+)/.exec(upgrade(text || ""));
    return m ? { n: Number(m[2]), mode: Number(m[3]), score: Number(m[4]) } : null;
  }
  // every copy and share goes out with the new link
  (function wrap() {
    try {
      var cb = navigator.clipboard;
      if (cb && cb.writeText && !cb.__mx) { var w = cb.writeText.bind(cb); cb.writeText = function (t) { return w(upgrade(t)); }; cb.__mx = 1; }
      if (navigator.share && !navigator.__mxs) { var sh = navigator.share.bind(navigator); navigator.share = function (d) { if (d && d.text) d = Object.assign({}, d, { text: upgrade(d.text) }); return sh(d); }; navigator.__mxs = 1; }
    } catch (e) {}
  })();
  function upgradeShown() {
    Array.prototype.forEach.call(document.querySelectorAll("#shareText, .share"), function (el) {
      if (LINK.test(el.textContent) && /#c-/.test(el.textContent)) el.textContent = upgrade(el.textContent);
    });
  }
  var friend = null;
  function beat(app) {
    var me = here(), f = parseBeat(location.hash);
    if (!me || !f) return;
    if (f.game.id !== me.id) { location.replace(f.game.url + location.hash); return; }
    var t = today(), el = document.createElement("p");
    el.className = "mx-risk mx-beat"; el.setAttribute("role", "status");
    if (f.n === t) {
      friend = f;
      el.textContent = "A friend " + (f.mode === 1 ? "" : "scored ") + said(me.id, f.mode, f.score) + " on today's " + me.name + ". Can you beat it?";
    } else {
      el.appendChild(document.createTextNode("This challenge is for No. " + f.n + ", " + (f.n < t ? "an earlier puzzle" : "which is tomorrow's where you are (your friend is a day ahead)") + ". Today's " + me.name + " is No. " + t + ". "));
      var a = document.createElement("a"); a.href = me.url; a.textContent = "Play today's and send your score back";
      el.appendChild(a);
    }
    var head = app.querySelector("header");
    if (head && head.parentNode === app) app.insertBefore(el, head.nextSibling); else app.insertBefore(el, app.firstChild);
  }
  function compareInto(box, shareEl) {
    if (!friend || !box || box.querySelector(".mx-vs")) return;
    var me = here(), mine = ownResult(shareEl && shareEl.textContent);
    if (!mine || mine.n !== friend.n) return;
    var d = mine.score - friend.score, sec = document.createElement("section");
    sec.className = "mx-vs"; sec.setAttribute("aria-label", "You and your friend");
    var cols = document.createElement("div"); cols.className = "mx-vs-cols";
    [["Your friend", friend], ["You", mine]].forEach(function (x) {
      var c = document.createElement("div"), b = document.createElement("b"), s = document.createElement("span");
      s.textContent = x[0]; b.textContent = x[1].mode === 1 ? (x[1].score >= 200 && x[1].score % 200 === 0 ? (1000 - x[1].score) / 200 + 1 + "/5" : "X/5") : String(x[1].score);
      c.appendChild(s); c.appendChild(b); cols.appendChild(c);
    });
    var v = document.createElement("p");
    v.textContent = (mine.mode !== friend.mode ? "Different modes, so take this lightly: " : "") + (d > 0 ? "You win." : d === 0 ? "A tie." : "Your friend wins this one.");
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "mx-link"; btn.textContent = "Send yours back";
    btn.onclick = async function () {
      var txt = upgrade(shareEl.textContent);
      try { if (navigator.share && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)) { await navigator.share({ text: txt }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(txt); btn.textContent = "Copied. Paste it to your friend."; } catch (e) { window.prompt("Copy your result:", txt); }
    };
    sec.appendChild(cols); sec.appendChild(v); sec.appendChild(btn);
    shareEl.parentNode.insertBefore(sec, shareEl);
  }
  function watchEnd() {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return; pending = true;
      setTimeout(function () {
        pending = false; upgradeShown(); nextButtons();
        var done = document.getElementById("done"), end = document.getElementById("endModal");
        if (done && !done.hidden) compareInto(done, document.getElementById("shareText"));
        if (end && !end.hidden) compareInto(document.getElementById("endBody"), document.querySelector("#endBody .share"));
      }, 30);
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["hidden"] });
  }

  window.MXS.beat = { parse: parseBeat, upgrade: upgrade };

  function mount() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var app = document.querySelector(".app");
    // screen readers can jump straight to the game: the page's main region (pages that have a <main> keep it)
    if (app && !document.querySelector("main,[role=main]")) {
      app.setAttribute("role", "main");
      // a header or footer inside the main region isn't a page-level banner or footer
      Array.prototype.forEach.call(app.children, function (el) { if (/^(HEADER|FOOTER)$/.test(el.tagName)) el.setAttribute("role", "none"); });
    }
    if (app) { riskNote(app); challenge(app); beat(app); today_games(app); }
    watchEnd(); upgradeShown(); nextButtons(); versionLine();
    addImageButton();
    watchDone();
    var nav = document.querySelector('nav[aria-label="Daily games"]');
    var me = here();
    if (nav && me) Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) { if (a.getAttribute("href") === me.url || (me.url === "./" && /^(\.\/|index\.html|\.)$/.test(a.getAttribute("href")))) a.setAttribute("aria-current", "page"); });
    if (nav) {
      var b = document.createElement("button");
      b.className = "mx-link"; b.type = "button"; b.textContent = "Your streaks"; b.onclick = openSheet;
      nav.parentNode.insertBefore(b, nav.nextSibling);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
