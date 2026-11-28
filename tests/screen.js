// The three tables: for every game, on a 375x667 phone as a first-time visitor,
//   A. first move: nothing covers the game, at most one sentence (or 20 words) to read, and the first action is on screen
//      (for the games in STRICT, the first action is also marked and the rules sit behind a "?")
//   B. one screen: in each state (opening, mid-play, after an answer, finish) the game ends above the fold
//   D. daily habit: the finish screen shows the shared streak, the time to the next puzzles and the next game
//   F. speed: ready for the first move in under 2 seconds on a slow-4G phone profile
// Run: node tests/screen.js   (prints the tables; exits 1 if a game listed in MUST fails)
const { chromium } = require("playwright"); const start = require("./server.js");
const W = 375, H = 667;
// what counts as "the game": every visible leaf outside these
const BELOW = "footer, .mx-today, .mx-today *, footer *, [data-below], [data-below] *, #toast, .sr, dialog:not([open]) *";
const measure = (p, area, must) => p.evaluate(([BELOW, area, must, H]) => {
  let bot = 0, who = "";
  // a state can name what must be on screen (a long result sheet: the result itself first, the extras below it)
  if (must) { for (const q of must) { const e = document.querySelector(q), r = e && e.getBoundingClientRect(); if (!r || !r.height) return { bot: 9999, who: "missing " + q, wide: 0 }; if (r.bottom > bot) { bot = r.bottom; who = q; } } return { bot: Math.round(bot), who, wide: document.documentElement.scrollWidth }; }
  const clip = (e, y) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { if (getComputedStyle(a).overflowY !== "visible") y = Math.min(y, a.getBoundingClientRect().bottom); } return y; };
  document.querySelectorAll((area || "body") + " *").forEach((e) => {
    if (e.matches(BELOW) || e.children.length > 3 || !e.offsetParent && getComputedStyle(e).position !== "fixed") return;
    const r = e.getBoundingClientRect(), c = getComputedStyle(e); if (!r.width || !r.height || c.visibility === "hidden" || +c.opacity === 0) return;
    const y = clip(e, r.bottom) + scrollY; if (y > bot) { bot = y; who = e.id || e.className || e.tagName; }
  });
  return { bot: Math.round(bot), who: String(who).slice(0, 24), wide: document.documentElement.scrollWidth };
}, [BELOW, area, must || null, H]);
const first = (p, g) => p.evaluate(([g, H]) => {
  const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(), c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== "hidden" && (e.offsetParent || c.position === "fixed"); };
  const o = { why: [] };
  const cover = [...document.querySelectorAll(".modal, dialog[open], [role=dialog]")].filter(vis); if (cover.length) o.why.push("a sheet covers the game");
  const act = document.querySelector(g.first); if (!vis(act)) o.why.push("no first action"); else { const r = act.getBoundingClientRect(); if (r.top < 0 || r.bottom > H) o.why.push("first action cut off (" + Math.round(r.bottom) + ")"); }
  const text = [...document.querySelectorAll(g.read)].filter(vis).filter((e) => e.getBoundingClientRect().top < H).map((e) => e.innerText.trim()).join(" ");
  const n = (text.match(/[.!?](?=\s|$)/g) || []).length; const words = text.split(/\s+/).filter(Boolean).length; if (n > 1 && words > 20) o.why.push(n + " sentences to read (" + words + " words)");
  // standard 9: a sound button on every game, saying whether sound is on
  { const sb = [...document.querySelectorAll("header.top button")].find((x) => vis(x) && /sound/i.test((x.getAttribute("aria-label") || "") + x.id)); if (!sb) o.why.push("no sound button"); else if (!/^(true|false)$/.test(sb.getAttribute("aria-pressed") || "")) o.why.push("sound button does not say on or off"); }
  if (g.strict) { if (!vis(document.querySelector("[data-first], .mx-first")) && !(g.hint && eval(g.hint))) o.why.push("first action not marked"); if (!vis(document.querySelector("[data-help], #helpBtn"))) o.why.push("no ? for the rules"); }
  return o;
}, [plain(g), H]);
const ready = (p, g) => p.waitForFunction((g) => { const e = document.querySelector(g.first); if (!e || !e.getBoundingClientRect().height || e.disabled) return false; return g.ready ? eval(g.ready) : true; }, plain(g), { timeout: 20000, polling: 50 });

const plain = (g) => ({ first: g.first, read: g.read, strict: !!g.strict, hint: g.hint || "", ready: g.ready || "" });

const GAMES = [
  { id: "ballast", name: "Ballast", page: "ballast.html", strict: true, first: "#sea", read: "#tip, #play .note, #play .lede", hint: "!!window.__ballast && __ballast.hint()", ready: "!!window.__ballast && __ballast.state() === 'aim'",
    states: async (p, m) => {
      await p.evaluate(() => { __ballast.drop(); __ballast.tick(200); }); await m("mid-play");
      await p.evaluate(() => __ballast.startDaily()); await p.waitForTimeout(300); await p.evaluate(() => { __ballast.drop(); __ballast.tick(150); }); await m("question");
      await p.click("#nameOpts .opt"); await m("after an answer");
      await p.evaluate(() => { const B = __ballast; B.run().lives = 1; B.run().cleared = 3; B.run().lvl = 4; B.S().cleared = false; B.finish(); }); await p.waitForTimeout(500); await m("finish"); await m("finish: the daily line", ["#doneTitle", "#shareBtn", ".mx-daily"]);
    } },
  { id: "bigger", name: "Bigger?", page: "bigger.html", at: "2026-11-30T12:00:00", /* No. 17, its first day */ first: "#pick0", read: ".lede", ready: "!!window.__big", states: async (p, m) => {
      for (let i = 0; i < 40; i++) { const st = await p.evaluate(() => { const d = document.querySelector("#done"); if (d && !d.hidden) return "done"; const n = [...document.querySelectorAll("#play button")].find((x) => x.offsetParent && !x.disabled && !/^pick/.test(x.id)); if (n) { n.click(); return "next"; } const b = document.querySelector("#pick0"); if (b && b.offsetParent && !b.disabled) { b.click(); return "pick"; } return "wait"; }); if (st === "done") break; await p.waitForTimeout(450); if (i === 0) await m("after an answer"); }
      await p.waitForTimeout(1200); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
  { id: "bigcountry", name: "Bigger country? (until No. 16)", page: "bigger-country.html#day-14", at: "2026-11-27T12:00:00", first: "#pick0", read: ".lede", ready: "!!window.__big", states: async (p, m) => {
      for (let i = 0; i < 40; i++) { const st = await p.evaluate(() => { const d = document.querySelector("#done"); if (d && !d.hidden) return "done"; const n = [...document.querySelectorAll("#play button")].find((x) => x.offsetParent && !x.disabled && !/^pick/.test(x.id)); if (n) { n.click(); return "next"; } const b = document.querySelector("#pick0"); if (b && b.offsetParent && !b.disabled) { b.click(); return "pick"; } return "wait"; }); if (st === "done") break; await p.waitForTimeout(450); if (i === 0) await m("after an answer"); }
      await p.waitForTimeout(1200); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
  { id: "history", name: "Logbook", page: "history.html", first: "#qbody .opt, #slider", read: ".lede", ready: "!!window.__hist",
    states: async (p, m) => {
      for (let i = 0; i < 8; i++) {
        const q = await p.evaluate((i) => ({ k: __hist.QS[i].k, r: __hist.right(i) }), i);
        if (q.k === "t" || q.k === "g") { await p.evaluate((v) => { const s = document.querySelector("#slider"); s.value = v; s.dispatchEvent(new Event("input")); }, q.r.g[0]); await p.waitForTimeout(100); await m("a " + (q.k === "t" ? "year" : "gap") + " question"); await p.tap("#qnext"); }
        else if (q.k === "o") { await m("an order question"); for (const j of q.r.p) await p.tap(`#qbody .opt[data-k="${j}"]`); await p.tap("#qnext"); }
        else await p.tap(`#qbody .opt[data-k="${q.r.p}"]`);
        await p.waitForTimeout(250); await m("after answer " + (i + 1)); await p.tap("#qnext"); await p.waitForTimeout(250);
      }
      await p.waitForTimeout(1200); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
  { id: "city", name: "Mystery city", page: "city.html", strict: true, first: "#board", read: ".lede, #tip, .modes", ready: "!!window.__lf",
    states: async (p, m) => {
      const far = (k) => p.evaluate((k) => { __lf.confirmAt([((__lf.P.lon + 180 - k) % 360) - 180, -__lf.P.lat]); }, k);
      await p.evaluate(() => { const d = ["left", "up", "right", "down"]; for (let i = 0; i < 40; i++) __lf.move(d[i % 4]); }); await p.waitForTimeout(900); await m("mid-play");
      await p.click("#pinBtn"); await p.waitForTimeout(900); await m("the map"); await p.evaluate(() => document.querySelector("#closeMap").click()); await p.waitForTimeout(300);
      await far(0); await p.waitForTimeout(1300); await m("after a miss"); await far(10); await p.waitForTimeout(1300); await m("after two misses");
      await p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(2500); await m("finish", ["#endTitle", "#endBody .place", "#endBody .score", "#endBody .row2", "#endBody .also", ".mx-daily"]);
    } },
  { id: "voyage", name: "Voyage (to No. 13)", page: "voyage.html", at: "2026-11-26T12:00:00", strict: true, first: "#opts button", read: ".lede, .note", ready: "!!window.__voy",
    states: async (p, m) => {
      const pick = (right) => p.evaluate((right) => { const S = __voy.S(), q = S.qs[S.g.at], want = q.options[q.answer]; const b = [...document.querySelectorAll("#opts button")].find((x) => (x.textContent.trim() === want) === right); b.click(); }, right);
      await pick(true); await p.waitForTimeout(1200); await m("after an answer");
      await p.click("#sail"); await p.waitForTimeout(900); await m("a question with a picture");
      await pick(false); await p.waitForTimeout(2200); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
  { id: "crossings", name: "Crossings", page: "crossings.html", strict: true, first: "#cin", read: ".lede, #parNote", ready: "!!window.__cross && !document.querySelector('#map').classList.contains('wait')",
    states: async (p, m) => {
      await p.evaluate(() => { const P = __cross.P(); let n = 0; for (let i = 0; n < 4 && i < 60; i++) if (i !== P.from && i !== P.to) { __cross.guess(i); n++; } }); await p.waitForTimeout(700); await m("after four guesses");
      await p.fill("#cin", "an"); await p.waitForTimeout(400); await m("typing a name"); await p.fill("#cin", "");
      await p.evaluate(() => { for (let i = 0; i < 12 && !__cross.G().over; i++) __cross.hint(); }); await p.waitForTimeout(1500); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
  { id: "reckoning", name: "Dead Reckoning", page: "dead-reckoning.html", strict: true, first: ".mapwrap", read: ".lede, .maphint", ready: "!!window.__dr && !!window.__WORLD && !!document.querySelector('#map path')",
    states: async (p, m) => {
      await p.evaluate(() => __dr.tapAt(10, 10)); await p.waitForTimeout(400); await m("a pin placed");
      await p.click("#lockBtn"); await p.waitForTimeout(1200); await m("after an answer");
      for (let i = 0; i < 4; i++) { await p.click("#nextBtn"); await p.waitForTimeout(500); await p.evaluate(() => __dr.tapAt(20, 30)); await p.click("#lockBtn"); await p.waitForTimeout(900); }
      await p.click("#nextBtn").catch(() => {}); await p.waitForTimeout(1500); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
  { id: "country", name: "Mystery country", page: "country.html", strict: true, first: "#board", read: ".lede, #tip, .mx-tip, .modes", ready: "!!window.__lf",
    states: async (p, m) => {
      const far = (k) => p.evaluate((k) => { const P = __lf.P; __lf.confirmAt([((P.lon + 180 - k) % 360) - 180, -P.lat]); }, k);
      await p.evaluate(() => { const d = ["left", "up", "right", "down"]; for (let i = 0; i < 40; i++) __lf.move(d[i % 4]); }); await p.waitForTimeout(900); await m("mid-play");
      await far(0); await p.waitForTimeout(1300); await m("after a miss"); await far(10); await p.waitForTimeout(1300); await m("after two misses");
      await p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(2500); await m("finish", ["#endTitle", "#endBody .place", "#endBody .score", "#endBody .row2", "#endBody .also", ".mx-daily"]);
    } },
  { id: "stamps", name: "Stamps", page: "stamps.html", strict: true, first: "#spin", read: ".lede, .note", ready: "!!window.__stamp",
    states: async (p, m) => {
      const ask = async () => { await p.evaluate(() => document.querySelector("#spin").click()); await p.waitForTimeout(250); await p.evaluate(() => document.querySelector("#wheelbox").click()); await p.waitForFunction(() => !document.querySelector("#quiz").hidden && document.querySelector("#qopts .opt") && __stamp.S().cur, null, { timeout: 12000 }); await p.waitForTimeout(300); };
      const answer = (right) => p.evaluate((right) => { const c = __stamp.S().cur, b = [...document.querySelectorAll("#qopts .opt")]; (right ? b[c.answer] : b[(c.answer + 1) % b.length]).click(); }, right);
      await ask(); await m("a question"); await answer(false); await p.waitForTimeout(700); await m("after a wrong answer");
      for (let i = 0; i < 14; i++) { if (await p.evaluate(() => !document.querySelector("#done").hidden)) break; await p.evaluate(() => { const n = document.querySelector("#qnext"); if (n && !n.hidden) n.click(); }); await p.waitForTimeout(400); if (await p.evaluate(() => !document.querySelector("#done").hidden)) break; if (await p.evaluate(() => document.querySelector("#quiz").hidden)) await ask(); await answer(true); await p.waitForTimeout(600); if (i === 0) await m("after a right answer"); }
      await p.waitForTimeout(1200); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
  { id: "fathoms", name: "Fathoms", page: "fathoms.html", strict: true, first: "#fin", read: ".lede", ready: "!!window.__fath",
    states: async (p, m) => {
      await p.fill("#fin", "a"); await p.waitForTimeout(400); await m("typing an answer"); await p.fill("#fin", "");
      for (let i = 0; i < 7; i++) { await p.click("#fpass"); await p.waitForTimeout(500); if (i === 0) await m("after an answer"); await p.evaluate(() => { const n = document.querySelector("#fnext"); if (n && n.offsetParent) n.click(); }); await p.waitForTimeout(400); }
      await p.waitForTimeout(1200); await m("finish", ["#doneTitle", "#done .score", "#shareBtn", ".mx-daily"]);
    } },
];
// games that must pass all three; a game joins this list in the release that fixes it
// standard 9: the first action of each game (run inside the page), which must change what is on screen within 100 ms
const ACT = {
  ballast: "document.querySelector('#dropBtn').click()", bigger: "document.querySelector('#pick0').click()", bigcountry: "document.querySelector('#pick0').click()",
  history: "document.querySelector('#qbody .opt').click()", city: "__lf.move('left') || __lf.move('up')", country: "__lf.move('left') || __lf.move('up')",
  voyage: "document.querySelector('#opts button').click()", crossings: "(function(){var P=__cross.P();for(var i=0;i<60;i++)if(i!==P.from&&i!==P.to){__cross.guess(i);break}})()",
  reckoning: "__dr.tapAt(10, 10)", stamps: "document.querySelector('#spin').click()", fathoms: "document.querySelector('#fpass').click()",
};
const MUST = ["ballast", "bigger", "bigcountry", "history", "city", "voyage", "crossings", "reckoning", "country", "stamps", "fathoms", "daily", "home"];

// known slow starts that do not count as regressions yet (none now)
const SLOW = [];

(async () => {
  const srv = await start({ gzip: true }), b = await chromium.launch(), rows = [], only = process.argv[2];
  for (const g of GAMES) { if (only && g.id !== only) continue;
    const row = { g, A: [], B: [], D: ["no finish screen reached"], F: 0, errs: [] };
    let ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true, serviceWorkers: "block" }), p = await ctx.newPage(); p.on("pageerror", (e) => row.errs.push(e.message));
    if (g.at) await p.clock.install({ time: new Date(g.at) });
    await p.goto(srv.url + g.page, { waitUntil: "load" }); await ready(p, g).catch(() => {}); await p.waitForTimeout(1100);
    row.A = (await first(p, g)).why;
    const m = async (state, must) => {
      if (/^finish/.test(state)) { row.D = await p.evaluate((H) => { const why = [], on = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); return r.height > 0 && r.top >= 0 && r.bottom <= H; };
        const d = [...document.querySelectorAll(".mx-daily")].find(on); if (!d) why.push("no daily line on screen"); else { if (!/Played today: day \d+ of your Mapelago streak\./.test(d.textContent)) why.push("no shared streak"); if (!/Next puzzles in \d+h \d+m\./.test(d.textContent)) why.push("no time to the next puzzles"); if (!/Your best: |A new personal best\./.test(d.textContent)) why.push("no personal best"); }
        const n = [...document.querySelectorAll("#done a.act, #endBody a.act")].find((a) => /^Play .+ next$|^All done today/.test(a.textContent.trim()) && on(a)); if (!n) why.push("no next-game button on screen"); else if (!/\.html$|^\.\/$|^games\/$/.test(n.getAttribute("href"))) why.push("next-game link looks wrong");
        return why; }, H); }
      const r = await measure(p, g.area, must); if (r.bot > H || r.wide > W) row.B.push(`${state}: ${r.wide > W ? "wider than the screen" : "ends at " + r.bot + " (" + r.who + ")"}`); row.states = (row.states || 0) + 1; };
    await m("opening"); try { await g.states(p, m); } catch (e) { row.B.push("could not play through: " + e.message.split("\n")[0]); }
    await ctx.close();
    ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true, serviceWorkers: "block" }); p = await ctx.newPage(); const c = await ctx.newCDPSession(p);
    await c.send("Network.enable"); await c.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }); await c.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    if (g.at) await p.clock.install({ time: new Date(g.at) });
    const t0 = Date.now(); await p.goto(srv.url + g.page, { waitUntil: "commit", timeout: 60000 }); await ready(p, g).catch(() => {}); row.F = Date.now() - t0; await ctx.close();
    ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true, serviceWorkers: "block" }); p = await ctx.newPage();
    if (g.at) await p.clock.install({ time: new Date(g.at) });
    await p.goto(srv.url + g.page, { waitUntil: "load" }); await ready(p, g).catch(() => {}); await p.waitForTimeout(900);
    row.R = await p.evaluate((act) => new Promise((done) => {
      const app = document.querySelector(".app"), snap = () => app.innerHTML.length + "|" + [...app.querySelectorAll("[class]")].map((e) => e.className.length || 0).join("") + "|" + (window.__ballast ? __ballast.state() : ""), before = snap(), t0 = performance.now();
      try { eval(act); } catch (e) { return done(-1); }
      const tick = () => { const t = performance.now() - t0; if (snap() !== before) done(Math.round(t)); else if (t > 600) done(999); else requestAnimationFrame(tick); }; tick();
    }), ACT[g.id]).catch(() => -1);
    await ctx.close();
    rows.push(row); }
  await b.close(); srv.close();
  const pad = (s, n) => (s + " ".repeat(n)).slice(0, n); let bad = 0;
  const table = (title, f, skip) => { console.log("\n" + title); let ok = 0; rows.forEach((r) => { const [pass, note] = f(r); if (pass) ok++; else if (MUST.includes(r.g.id) && !(skip || []).includes(r.g.id)) bad++; console.log("  " + pad(r.g.name, 17) + (pass ? "pass  " : "FAIL  ") + note); }); console.log(`  ${ok} of ${rows.length} pass`); };
  table("A. First move", (r) => [!r.A.length, r.A.join("; ")]);
  table("B. One screen (375x667)", (r) => [!r.B.length, r.B.length ? r.B.join("; ") : r.states + " states"]);
  table("D. Daily habit on the finish screen (shared streak, time to the next puzzles, personal best, next game in one tap)", (r) => [!r.D.length, r.D.join("; ")]);
  table("R. Feedback within 100 ms of the first action", (r) => [r.R >= 0 && r.R < 100, r.R < 0 ? "could not act" : r.R === 999 ? "nothing changed" : r.R + " ms"]);
  table("F. Ready on slow 4G", (r) => [r.F < 2000, (r.F / 1000).toFixed(1) + " s"], SLOW);
  rows.forEach((r) => { if (r.errs.length) { bad++; console.log("  ERROR in " + r.g.name + ": " + r.errs.join("; ")); } });
  console.log(bad ? `\n${bad} regressions in games that must pass` : "\nno regressions"); process.exit(bad ? 1 : 0);
})();
