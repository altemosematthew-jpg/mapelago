// Logbook (history.html) browser tests. Run with the rest: cd tests && npm test   (or: node history.js)
// They check that the page loads, that a full round plays to the end on a phone and on a desktop (by keyboard
// alone), that the share text gives nothing away, that no question repeats within the period the data claims,
// that every question traces to a line of Block A or Block B, that it works offline, and that nothing is
// loaded from another site. --update-golden rewrites history-golden.json after a deliberate schedule change.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path"), vm = require("vm");
const start = require("./server.js");
const ROOT = path.join(__dirname, "..");
const GOLDEN = path.join(__dirname, "history-golden.json");
const UPDATE = process.argv.includes("--update-golden");
const PHONE = { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true };
const DESKTOP = { viewport: { width: 1280, height: 800 } };
let passed = 0; const failed = [];
function check(ok, name, detail) { if (ok) passed++; else failed.push(name + (detail ? ` (${detail})` : "")); }

// ---------- the data, read the way the page reads it ----------
const box = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "history-data.js"), "utf8"), box);
const D = box.window.MX_HIST, F = D.F, Q = D.Q, T = D.T, Z = new Set(D.z);
function block(file, tag) { const L = fs.readFileSync(path.join(ROOT, "review/history", file), "utf8").split("\n"); return L.slice(L.indexOf("BLOCK " + tag) + 1, L.indexOf("END BLOCK " + tag)); }
const A_LINES = block("block-a.txt", "A"), B_LINES = block("block-b.txt", "B");
const A = Object.fromEntries(A_LINES.map((l) => [l.split(" | ")[0], l]));
const key = (it) => it[0] === "w" || it[0] === "g" ? it[0] + [it[1], it[2]].sort((a, b) => a - b).join(".") : it[0] === "o" ? "o" + it.slice(1).sort((a, b) => a - b).join(".") : it[0] + it[1];
const factsOf = (it) => it[0] === "m" ? Q[it[1]][3] : it[0] === "t" ? [it[1]] : it[0] === "o" ? it.slice(1) : [it[1], it[2]];

function dataChecks() {
  check(A_LINES.length === 193 && B_LINES.length === 303, "history: the blocks are complete (193 + 303 lines)");
  // 1. no question repeats within the claimed cycle, at any point, including where the schedule starts over
  const H = D.days, where = {}; let gap = Infinity, fgap = Infinity; const lastF = {};
  for (let n = 1; n <= 2 * H; n++) for (const it of D.D[(n - 1) % H]) {
    const k = key(it); if (k in where) gap = Math.min(gap, n - where[k]); where[k] = n;
    for (const f of new Set(factsOf(it))) { if (f in lastF) fgap = Math.min(fgap, n - lastF[f]); lastF[f] = n; }
  }
  check(D.cycle >= 365 && gap >= D.cycle, `history: no question repeats within ${D.cycle} days`, `shortest gap ${gap}`);
  check(fgap === D.rest && fgap >= 14, `history: the same fact comes back no sooner than ${D.rest} days`, `measured ${fgap}`);
  check(D.D.every((d) => d.length === 8), "history: every day has eight questions");
  const usedF = new Set(), usedQ = new Set();
  D.D.forEach((d) => d.forEach((it) => { factsOf(it).forEach((f) => usedF.add(f)); if (it[0] === "m") usedQ.add(it[1]); }));
  check(usedF.size === F.length && usedQ.size === Q.length, "history: every fact and question is used", `${usedF.size}/${F.length}, ${usedQ.size}/${Q.length}`);

  // 2. every question traces to a line of Block A or Block B
  const bad = [];
  F.forEach(([y, text, src], i) => {
    const s = src.split("|");
    if (!s.length) bad.push("fact " + i + " has no source");
    s.forEach((r) => {
      const [t, v] = [r.slice(0, 1), r.slice(2)];
      if (t === "B") { const l = B_LINES[Number(v) - 1]; if (!l) bad.push(r); else if (s[0] === r && l !== `${y} | ${text} | ${l.split(" | ")[2]}`) bad.push(`fact ${i} wording differs from ${r}`); }
      else if (t === "A") { if (!A[v]) bad.push(r); else if (y && !A[v].includes(String(y))) bad.push(`fact ${i}: ${y} not in Block A ${v}`); }
      else bad.push(r);
    });
  });
  Q.forEach(([kind, ask, ans, fids, src, note], i) => {
    const line = A[src.slice(2)], a = T[ans];
    if (!line) return bad.push("question " + i + " " + src);
    if (!(line.includes(a) || (a === "United States" && line.includes("US-administered")))) bad.push(`question ${i}: "${a}" not in ${src}`);
    (ask.match(/\b1[89]\d\d\b|\b20[0-2]\d\b/g) || []).forEach((yr) => { if (!line.includes(yr)) bad.push(`question ${i}: ${yr} not in ${src}`); });
    fids.forEach((f) => { if (!F[f]) bad.push(`question ${i}: no fact ${f}`); });
  });
  check(!bad.length, "history: every question traces to a Block A or B line", bad.slice(0, 5).join("; "));

  // 3. the rules that came with the data, as scheduled
  const rule = [];
  D.D.forEach((d, n) => d.forEach((it) => {
    const y = (f) => F[f][0];
    if (it[0] === "t") { if (Z.has(it[1])) rule.push(`No. ${n + 1}: slider on a defensible year`); if (!(y(it[1]) >= it[2] && y(it[1]) <= it[3])) rule.push(`No. ${n + 1}: slider window misses the year`); }
    if (it[0] === "w" || it[0] === "g") { const g = Math.abs(y(it[1]) - y(it[2])); if (g < (Z.has(it[1]) || Z.has(it[2]) ? 20 : 5)) rule.push(`No. ${n + 1}: pair ${g} years apart`); if (it[0] === "g" && (Z.has(it[1]) || Z.has(it[2]))) rule.push(`No. ${n + 1}: years-apart on a defensible year`); }
    if (it[0] === "o") { const ys = it.slice(1).map(y).sort((a, b) => a - b); if (ys[1] - ys[0] < 5 || ys[2] - ys[1] < 5) rule.push(`No. ${n + 1}: order too close`); }
    if (it[0] === "m") { const o = it[2]; if (o.length !== 4 || new Set(o).size !== 4 || o[it[3]] !== Q[it[1]][2]) rule.push(`No. ${n + 1}: options wrong`); }
    if (it.slice(1).some((x) => typeof x === "number" && x < 0)) rule.push("negative index");
  }));
  ["Czechoslovakia", "Yugoslavia", "Soviet Union", "Ottoman Empire", "Gran Colombia"].forEach((p) => {
    Q.forEach((q, i) => { if ((q[0] === "name" || q[0] === "nameof") && T[q[2]] === p) rule.push(`question ${i} uses ${p} as a former name`); });
    D.D.forEach((d) => d.forEach((it) => { if (it[0] === "m" && Q[it[1]][0] === "name" && it[2].some((o) => T[o] === p)) rule.push(`${p} offered as a former name`); }));
  });
  check(!rule.length, "history: schedule keeps the data's rules (gaps, defensible years, predecessors, options)", rule.slice(0, 5).join("; "));

  // 4. the schedule never changes by accident
  const days = [...Array(30).keys()].map((i) => i + 1).concat([60, 100, 200, 365, 371, 372, 742]);
  const now = Object.fromEntries(days.map((n) => [n, D.D[(n - 1) % D.days].map(key)]));
  if (UPDATE || !fs.existsSync(GOLDEN)) { fs.writeFileSync(GOLDEN, JSON.stringify(now, null, 1)); console.log("history-golden.json written"); }
  else { const gold = JSON.parse(fs.readFileSync(GOLDEN, "utf8")); days.forEach((n) => check(JSON.stringify(gold[n]) === JSON.stringify(now[n]), `history: schedule unchanged, No. ${n}`)); }
}

// ---------- the page ----------
async function open(b, url, opts = {}) {
  const ctx = await b.newContext({ ...(opts.desktop ? DESKTOP : PHONE) });
  if (opts.storage) await ctx.addInitScript((s) => { if (!sessionStorage.__t) { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); sessionStorage.__t = 1; } }, opts.storage);
  const p = await ctx.newPage(); p.errs = []; p.outside = [];
  p.on("pageerror", (e) => p.errs.push(e.message));
  p.on("console", (m) => { if (m.type() === "error") p.errs.push(m.text()); });
  p.on("request", (r) => { const u = new URL(r.url()); if (!/^(data|blob):/.test(r.url()) && u.hostname !== new URL(url).hostname) p.outside.push(r.url()); });
  await p.goto(url, { waitUntil: "domcontentloaded" }); await p.waitForTimeout(opts.wait || 500);
  return { ctx, p };
}
const setSlider = (p, v) => p.evaluate((v) => { const s = document.querySelector("#slider"); s.value = v; s.dispatchEvent(new Event("input")); }, v);

// A round by touch. `wrong` lists the questions to miss; sliders miss on the first try then land 3 years off.
async function playTouch(p, wrong) {
  for (let i = 0; i < 8; i++) {
    const q = await p.evaluate((i) => ({ k: __hist.QS[i].k, r: __hist.right(i), lo: __hist.QS[i].lo, hi: __hist.QS[i].hi, n: __hist.QS[i].opts && __hist.QS[i].opts.length }), i);
    if (q.k === "t" || q.k === "g") {
      const ans = q.r.g[0];
      if (wrong.includes(i)) { await setSlider(p, ans - q.lo > q.hi - ans ? q.lo : q.hi); await p.tap("#qnext"); await p.waitForTimeout(80); await setSlider(p, Math.min(q.hi, ans + 3)); }
      else await setSlider(p, ans);
      await p.tap("#qnext");
    } else if (q.k === "o") {
      const order = wrong.includes(i) ? [q.r.p[1], q.r.p[0], q.r.p[2]] : q.r.p;
      for (const j of order) await p.tap(`#qbody .opt[data-k="${j}"]`);
      await p.tap("#qnext");
    } else {
      const pick = wrong.includes(i) ? (q.k === "w" ? 1 - q.r.p : (q.r.p + 1) % q.n) : q.r.p;
      await p.tap(`#qbody .opt[data-k="${pick}"]`);
    }
    await p.waitForTimeout(60);
    await p.tap("#qnext"); await p.waitForTimeout(60);
  }
}
// A round by keyboard alone: Tab to things, Enter to press them, arrow keys on the slider.
async function tabTo(p, sel) {
  for (let n = 0; n < 25; n++) { if (await p.evaluate((s) => document.activeElement && document.activeElement.matches(s), sel)) return true; await p.keyboard.press("Tab"); }
  return false;
}
async function playKeys(p) {
  let ok = true;
  for (let i = 0; i < 8; i++) {
    const q = await p.evaluate((i) => ({ k: __hist.QS[i].k, r: __hist.right(i), lo: __hist.QS[i].lo }), i);
    if (q.k === "t" || q.k === "g") {
      ok = (await tabTo(p, "#slider")) && ok;
      await p.keyboard.press("Home");
      for (let s = q.lo; s < q.r.g[0]; s++) await p.keyboard.press("ArrowRight");
      await p.keyboard.press("Enter");
    } else if (q.k === "o") {
      for (const j of q.r.p) { ok = (await tabTo(p, `#qbody .opt[data-k="${j}"]`)) && ok; await p.keyboard.press("Enter"); }
      await p.waitForTimeout(60); await p.keyboard.press("Enter");     // focus has moved to "Lock in this order"
    } else { ok = (await tabTo(p, `#qbody .opt[data-k="${q.r.p}"]`)) && ok; await p.keyboard.press("Enter"); }
    await p.waitForTimeout(80);
    ok = (await p.evaluate(() => document.activeElement && document.activeElement.id === "qnext")) && ok;   // focus waits on "Next"
    await p.keyboard.press("Enter"); await p.waitForTimeout(80);
  }
  return ok;
}
function spoilerFree(share, day) {
  const lines = share.split("\n"), its = D.D[(day - 1) % D.days];
  const secrets = new Set();
  its.forEach((it) => {
    factsOf(it).forEach((f) => { secrets.add(F[f][1]); if (F[f][0]) secrets.add(String(F[f][0])); });
    if (it[0] === "m") { it[2].forEach((o) => secrets.add(T[o])); secrets.add(Q[it[1]][1]); }
  });
  const leaks = [...secrets].filter((s) => s.length >= 4 && share.includes(s));
  return lines.length === 3 && new RegExp(`^Mapelago Logbook No\\. ${day} \u{1F422} \\d+ points$`, "u").test(lines[0])
    && /^(✅|❌|\u{1F3AF}|\u{1F525}|\u{1F321}️|❄️|\u{1F9CA}){8}$/u.test(lines[1])
    && new RegExp(`mapelago\\.com/history\\.html#c-${day}-\\d+$`).test(lines[2]) && !leaks.length && !/\b(1[89]\d\d|20[0-2]\d)\b/.test(share);
}

(async () => {
  dataChecks();
  const srv = await start(); const U = srv.url;
  const b = await chromium.launch();
  try {
    // 5. loads cleanly, phone (375 px) and desktop
    for (const desktop of [false, true]) {
      const { ctx, p } = await open(b, U + "history.html", { desktop });
      const ok = await p.evaluate(() => document.querySelector("#qask").textContent.length > 5 && document.querySelectorAll("#dots li").length === 8 && document.documentElement.scrollWidth <= innerWidth);
      check(ok && !p.errs.length, `history: loads cleanly, ${desktop ? "desktop" : "phone 375 px"}, nothing wider than the screen`, p.errs.join("; "));
      await ctx.close();
    }
    // 6. a full round by touch on a phone: right and wrong answers, every kind, saves and shares
    for (const day of [2, 9, 15]) {
      const { ctx, p } = await open(b, `${U}history.html#day-${day}`);
      await playTouch(p, [0, 3, 5]);
      const r = await p.evaluate((day) => ({ done: !document.querySelector("#done").hidden, share: document.querySelector("#shareText").textContent,
        save: JSON.parse(localStorage.getItem("dailycity:history:v1")).results[day], total: __hist.total(), recap: document.querySelectorAll("#recap li").length,
        wide: document.documentElement.scrollWidth > innerWidth }), day);
      check(r.done && r.save && r.save.score === r.total && r.recap === 8 && !r.wide && !p.errs.length, `history: a full round plays to the end on a phone, No. ${day}`, JSON.stringify({ ...r, share: undefined, errs: p.errs }));
      check(spoilerFree(r.share, day), `history: share text has no spoilers, No. ${day}`, r.share);
      check(!p.outside.length, `history: nothing loaded from other sites, No. ${day}`, p.outside.join(" "));
      // a reload keeps the finished round
      await p.reload(); await p.waitForTimeout(500);
      check(await p.evaluate(() => !document.querySelector("#done").hidden && document.querySelectorAll("#recap li").length === 8), `history: a finished round is still there after a reload, No. ${day}`);
      await ctx.close();
    }
    // 7. today's round by keyboard alone on a desktop: every answer right scores 800, joins streaks and Today's games
    {
      const { ctx, p } = await open(b, U + "history.html", { desktop: true });
      const keys = await playKeys(p);
      const r = await p.evaluate(() => ({ total: __hist.total(), share: document.querySelector("#shareText").textContent, card: (document.querySelector('.mx-card a[href="history.html"]') || {}).textContent || "",
        info: MXS.info().filter((s) => s.game.id === "history").map((s) => s.doneToday)[0], focus: document.activeElement && document.activeElement.id }));
      check(keys && r.total === 800 && r.focus === "doneTitle" && !p.errs.length, "history: a whole round by keyboard alone (Tab, Enter, arrows), 800 for all right", JSON.stringify({ keys, total: r.total, focus: r.focus, errs: p.errs }));
      await p.reload(); await p.waitForTimeout(500);
      const card = await p.evaluate(() => (document.querySelector('.mx-card a[href="history.html"]') || {}).textContent || "");
      check(r.info === true && /Done today/.test(card), "history: counts for streaks and shows as done in Today's games", card);
      const day = await p.evaluate(() => __hist.day);
      check(spoilerFree(r.share, day) && /800 points/.test(r.share), "history: perfect-round share text", r.share);
      await ctx.close();
    }
    // 8. a round left halfway picks up where it was; a damaged save never stops the game
    {
      const { ctx, p } = await open(b, `${U}history.html#day-30`);
      await playTouch(p, []).catch(() => {});   // plays all 8; then check a fresh half-played save below
      await ctx.close();
      const ansFor = (it) => it[0] === "o" ? { p: [0, 1, 2] } : it[0] === "t" ? { g: [F[it[1]][0]] } : it[0] === "g" ? { g: [Math.abs(F[it[1]][0] - F[it[2]][0])] } : { p: 0 };
      const half = JSON.stringify({ v: 1, results: {}, games: { 30: { a: D.D[29].slice(0, 2).map(ansFor) } } });
      const k = await open(b, `${U}history.html#day-30`, { storage: { "dailycity:history:v1": half } });
      const at = await k.p.evaluate(() => __hist.cur());
      check(at === 2 && /Question 3 of 8/.test(await k.p.textContent("#qn")), "history: a half-played round resumes at the next question", String(at));
      await k.ctx.close();
      const d = await open(b, U + "history.html", { storage: { "dailycity:history:v1": '{"results":null,"games":7}' }, wait: 700 });
      check(!d.p.errs.length && (await d.p.textContent("#qask")).length > 5, "history: damaged save repaired", d.p.errs.join("; "));
      await d.ctx.close();
    }
    // 9. other pages link to Logbook
    {
      const { ctx, p } = await open(b, U + "stamps.html");
      check((await p.locator('nav[aria-label="Daily games"] a[href="history.html"]').count()) === 1 && (await p.locator('.mx-card a[href="history.html"]').count()) === 1, "history: listed on other games' pages");
      await ctx.close();
    }
  } finally { await b.close(); }

  // 10. offline after the first visit. The games skip the service worker on localhost; ?sw switches it on for this test.
  {
    const ob = await chromium.launch();
    try {
      const ctx = await ob.newContext(PHONE); const p = await ctx.newPage(); const errs = [];
      p.on("pageerror", (e) => errs.push(e.message));
      await p.goto(U + "history.html?sw"); await p.waitForTimeout(800);
      await p.evaluate(() => navigator.serviceWorker.ready); await p.waitForTimeout(3500);   // the page asks the worker to keep its files
      await ctx.setOffline(true);
      await p.reload({ waitUntil: "domcontentloaded" }); await p.waitForTimeout(1200);
      const r = await p.evaluate(() => ({ title: document.title, q: (document.querySelector("#qask") || {}).textContent || "" }));
      check(/Logbook/.test(r.title) && r.q.length > 5 && !errs.length, "history: works offline after the first visit", JSON.stringify({ ...r, errs }));
      await ctx.close();
    } finally { await ob.close(); }
  }
  srv.close();
  console.log(`\nLogbook: ${passed} passed, ${failed.length} failed`);
  failed.forEach((f) => console.log("  FAIL " + f));
  process.exit(failed.length ? 1 : 0);
})();
