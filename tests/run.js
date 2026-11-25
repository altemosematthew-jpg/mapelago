// Mapelago browser tests. Run: cd tests && npm install && npx playwright install chromium && npm test
// They use the games' localhost-only test hooks (#day-N, window.__lf and friends), which do nothing on the live site.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const start = require("./server.js");
const UPDATE = process.argv.includes("--update-golden");
const GOLDEN = path.join(__dirname, "golden.json");
const GAMES = { city: "", country: "country.html", bigger: "bigger.html", biggercountry: "bigger-country.html", voyage: "voyage.html", fathoms: "fathoms.html", stamps: "stamps.html", crossings: "crossings.html" };
const DAYS = [...Array(30).keys()].map((i) => i + 1).concat([60, 100, 200, 365]);
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
const DESKTOP = { viewport: { width: 1280, height: 800 } };
let passed = 0; const failed = [];
function check(ok, name, detail) { if (ok) passed++; else failed.push(name + (detail ? ` (${detail})` : "")); }

// What "the puzzle" is for each game, read from its test hook.
const PUZZLE = {
  city: () => __lf.P.city,
  country: () => __lf.P.city,
  bigger: () => __big.S().pairs.map((p) => p.map((x) => x.name).join(" | ")),
  biggercountry: () => __big.S().pairs.map((p) => p.map((x) => x.name).join(" | ")),
  voyage: () => __voy.S().qs.map((q) => q.ask + " = " + q.options[q.answer]),
  fathoms: () => __fath.S().prompts.map((p) => p.ask + " = " + p.answers.join(",")),
  stamps: () => Object.entries(__stamp.S().q).map(([k, qs]) => k + ": " + qs.map((q) => q.ask + " = " + q.options[q.answer]).join(" / ")),
  crossings: () => { const P = __cross.P(); return __cross.name(P.from) + " > " + __cross.name(P.to) + " par " + P.par; },
};

async function page(b, url, opts = {}) {
  const ctx = await b.newContext({ ...(opts.desktop ? DESKTOP : PHONE), ...(opts.ctx || {}) });
  if (opts.storage) await ctx.addInitScript((s) => { if (!sessionStorage.__t) { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); sessionStorage.__t = 1; } }, opts.storage);
  const p = await ctx.newPage(); p.errs = [];
  p.on("pageerror", (e) => p.errs.push(e.message));
  // Script errors fail a test; a missing outside resource (no network in CI) does not.
  p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) p.errs.push(m.text()); });
  if (opts.clock) await p.clock.install({ time: opts.clock });
  await p.goto(url, { waitUntil: "domcontentloaded" }); await p.waitForTimeout(opts.wait || 500);
  return { ctx, p };
}

(async () => {
  const srv = await start(); const U = srv.url;
  const b = await chromium.launch();
  try {
    // 1. every page loads cleanly at phone and desktop size
    for (const f of ["", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "hints.html", "about/", "how-to-play/", "privacy/", "games/", "offline.html", "404.html"])
      for (const desktop of [false, true]) {
        const { ctx, p } = await page(b, U + f, { desktop, wait: 800 });
        check(!p.errs.length, `loads cleanly: /${f} ${desktop ? "desktop" : "phone"}`, p.errs.join("; "));
        await ctx.close();
      }

    // 1b. a release bumps the cache and every script address together, so returning players get it on their next visit
    {
      const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8"), v = /const C = "mapelago-([^"]+)"/.exec(sw)[1];
      for (const f of ["index.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "shapes.js", "sw.js"]) {
        const s = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
        const tags = [...s.matchAll(/["'](?:site|extras|shapes|world|copy)\.js(\?v=[^"']*)?["']/g)].map((m) => m[1] || "");
        check(tags.length > 0 && tags.every((t) => t === "?v=" + v), `script addresses carry the cache version ${v}: ${f}`, tags.join(" "));
      }
      check(fs.readFileSync(path.join(__dirname, "../CNAME"), "utf8").trim() === "mapelago.com", "CNAME still says mapelago.com");
    }

    // 2. the daily schedule never changes by accident
    const now = {};
    const ctx = await b.newContext(PHONE); const p = await ctx.newPage();
    for (const [g, file] of Object.entries(GAMES)) {
      now[g] = {};
      for (const d of DAYS) {
        await p.goto(`${U}${file}?t=${d}#day-${d}`, { waitUntil: "domcontentloaded" });
        await p.waitForFunction((g) => (g === "city" || g === "country" ? window.__lf : g.startsWith("bigger") ? window.__big : window[{ voyage: "__voy", fathoms: "__fath", stamps: "__stamp", crossings: "__cross" }[g]]), g);
        now[g][d] = await p.evaluate(PUZZLE[g]);
      }
    }
    await ctx.close();
    if (UPDATE || !fs.existsSync(GOLDEN)) { fs.writeFileSync(GOLDEN, JSON.stringify(now, null, 1)); console.log("golden.json written"); }
    else {
      const gold = JSON.parse(fs.readFileSync(GOLDEN, "utf8"));
      for (const g of Object.keys(GAMES)) for (const d of DAYS)
        check(JSON.stringify(gold[g] && gold[g][d]) === JSON.stringify(now[g][d]), `schedule unchanged: ${g} No. ${d}`);
    }

    // 3. a save made by the live version (0.11) replays exactly
    const old = fs.readFileSync(path.join(__dirname, "fixtures/save-from-v0.11.json"), "utf8");
    for (const desktop of [false, true]) {
      let { ctx, p } = await page(b, U + "#day-12", { desktop, storage: { "dailycity:v2": old } });
      const s = await p.evaluate(() => ({ S: __lf.S(), pts: document.querySelector("#score").textContent, clues: document.querySelectorAll("#clues li").length }));
      check(s.S.swipes === 25 && s.pts === "650" && s.clues === 5 && s.S.pins.length === 1, "old save: day 12 in progress replays (25 moves, 650 points, 5 clues)", JSON.stringify([s.S.swipes, s.pts, s.clues]));
      await p.evaluate(() => (location.hash = "#day-11")); await p.waitForTimeout(1200);
      check((await p.evaluate(() => __lf.S().score)) === 714, "old save: day 11 result kept (714)");
      await ctx.close();
    }

    // 4. streaks and freezes
    {
      const { ctx, p } = await page(b, U);
      const r = await p.evaluate(() => {
        const R = (ds) => Object.fromEntries(ds.map((d) => [d, { score: 1 }]));
        const S = (ds, t) => { const s = MX.streak(R(ds), t); return [s.cur, s.best, s.freezes]; };
        return [S([9, 10, 11], 12), S([1, 2, 3, 4, 5, 6, 7, 9, 10, 11], 12), S([1, 2, 3, 4, 5, 6, 7], 12), S([10, 11, 12], 12), S([], 12)];
      });
      check(JSON.stringify(r) === JSON.stringify([[3, 3, 0], [10, 10, 0], [0, 7, 0], [3, 3, 0], [0, 0, 0]]), "streak and freeze counting", JSON.stringify(r));
      await ctx.close();
    }

    // 5. new games: one clue to start, scoring
    {
      const { ctx, p } = await page(b, U + "#day-12");
      check((await p.evaluate(() => document.querySelectorAll("#clues li").length)) === 1, "new game starts with exactly one clue");
      await p.waitForFunction(() => window.__WORLD);
      await p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(1500);
      check((await p.evaluate(() => __lf.S().score)) === 1000, "found with no moves and no misses scores 1000");
      await ctx.close();
    }

    // 6. a damaged save never stops a game
    for (const [f, k] of [["fathoms.html", "dailycity:fathoms:v1"], ["stamps.html", "dailycity:stamps:v1"], ["crossings.html", "dailycity:crossings:v1"], ["", "dailycity:v2"]]) {
      const { ctx, p } = await page(b, U + f, { storage: { [k]: '{"results":null}' }, wait: 800 });
      check(!p.errs.length, `damaged save repaired: /${f}`, p.errs.join("; "));
      await ctx.close();
    }

    // 7. keyboard-only pin
    for (const f of ["", "country.html"]) {
      const { ctx, p } = await page(b, U + f + "#day-7", { desktop: true, storage: { [f ? "dailycity:country:v1" : "dailycity:v2"]: '{"games":{},"results":{},"seenHelp":true}' } });
      await p.waitForFunction(() => window.__WORLD);
      await p.focus("#pinBtn"); await p.keyboard.press("Enter"); await p.waitForTimeout(500);
      await p.keyboard.press("ArrowRight"); await p.keyboard.press("Enter"); await p.waitForTimeout(1300);
      check((await p.evaluate(() => __lf.S().pins.length)) === 1, `keyboard pin: /${f}`);
      await ctx.close();
    }

    // 8. a game in progress survives midnight
    {
      const { ctx, p } = await page(b, U, { clock: new Date("2026-11-25T23:59:30"), ctx: { timezoneId: "Europe/London" } });
      for (const k of ["ArrowUp", "ArrowRight", "ArrowUp"]) await p.keyboard.press(k);
      const before = await p.textContent("#num");
      await p.clock.runFor(60000); await p.waitForTimeout(300);
      check(before === (await p.textContent("#num")) && (await p.locator("#newDay").isVisible()), "city: an unfinished round survives midnight with a banner");
      await ctx.close();
    }
    // 10. after a missed pin opens a clue early, "Next clue: make a N" matches the highlighted locked slot
    {
      const { ctx, p } = await page(b, U + "#day-12", { storage: { "dailycity:v2": '{"games":{},"results":{},"seenHelp":true}' } });
      await p.waitForFunction(() => window.__WORLD);
      const read = () => p.evaluate(() => ({ label: (document.querySelector("#nextClue").textContent.match(/\d+/) || [""])[0], slot: (document.querySelector("#track .upnext") || {}).textContent, open: document.querySelectorAll("#clues li").length }));
      const before = await read();
      await p.evaluate(() => __lf.confirmAt([((__lf.P.lon + 180) % 360) - 180, -__lf.P.lat])); await p.waitForTimeout(1500);
      const after = await read();
      check(after.open === before.open + 1, "missed pin opens the next clue", JSON.stringify([before, after]));
      check(after.label && after.label === after.slot, "next-clue label matches the highlighted slot after a missed pin", JSON.stringify(after));
      await ctx.close();
    }

    // 11. a save from the live release (0.14.0, recorded on that version) loads with its results, streaks and round in progress
    {
      const live = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/save-from-v0.14.json"), "utf8"));
      const { ctx, p } = await page(b, U + "#day-12", { storage: live, clock: new Date("2026-11-25T12:00:00"), wait: 1200 });
      const r = await p.evaluate(() => ({ moves: document.querySelector("#swipes").textContent, info: MXS.info().map((s) => [s.game.id, s.cur, s.played]) }));
      check(r.moves === "3", "0.14.0 save: today's mystery city round in progress replays (3 moves)", r.moves);
      const city = r.info.find((x) => x[0] === "city"), country = r.info.find((x) => x[0] === "country");
      check(city[1] === 3 && city[2] === 3 && country[1] === 2 && country[2] === 2, "0.14.0 save: streaks kept (city 3, country 2)", JSON.stringify(r.info));
      await p.evaluate(() => (location.hash = "#day-11")); await p.waitForTimeout(1200);
      check((await p.evaluate(() => __lf.S().score)) === 1000, "0.14.0 save: a finished day keeps its score");
      check(!p.errs.length, "0.14.0 save: no errors", p.errs.join("; "));
      await ctx.close();
    }

    // 12. Quick mode for the mystery city: no tiles, a clue per missed pin, five pins, scored by the pin that finds it
    {
      const { ctx, p } = await page(b, U + "#day-12", { storage: { "dailycity:v2": '{"games":{},"results":{},"seenHelp":true}', "dailycity:coach": "1" } });
      await p.waitForFunction(() => window.__WORLD);
      check(await p.isVisible("#mxMode"), "quick mode: the mode choice shows before the first move");
      await p.click('#mxMode [data-m="quick"]');
      await p.keyboard.press("ArrowUp");
      const s0 = await p.evaluate(() => ({ moves: document.querySelector("#swipes").textContent, clues: document.querySelectorAll("#clues li").length, board: getComputedStyle(document.querySelector("#board")).display }));
      check(s0.moves === "0" && s0.clues === 1 && s0.board === "none", "quick mode: one clue, no board, arrows do nothing", JSON.stringify(s0));
      for (const o of [40, 20]) { await p.evaluate((o) => __lf.confirmAt([__lf.P.lon + o, __lf.P.lat]), o); await p.waitForTimeout(1600); }
      check((await p.evaluate(() => document.querySelectorAll("#clues li").length)) === 3 && !(await p.isVisible("#mxMode")), "quick mode: each miss opens a clue; the choice is locked once you've pinned");
      await p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(2600);
      const r = await p.evaluate(() => ({ res: JSON.parse(localStorage.getItem("dailycity:v2")).results[12], share: document.querySelector("#endBody .share").textContent, streak: MXS.info()[0].cur }));
      check(r.res.q === 1 && r.res.score === 600 && r.res.pins === 3 && r.streak === 1, "quick mode: found on pin 3 scores 600, counts for the streak", JSON.stringify(r.res));
      check(/quick mode/.test(r.share) && /Found in 3\/5 pins/.test(r.share), "quick mode: the share says the mode and 3/5", r.share);
      await ctx.close();
      // a tile round already started stays a tile round, even if the player last chose quick
      const t = await page(b, U + "#day-12", { storage: { "dailycity:v2": '{"games":{"12":{"moves":"U","pins":[],"done":false,"won":false,"score":0,"r":3}},"results":{},"seenHelp":true}', "dailycity:mode": "quick", "dailycity:coach": "1" } });
      check(!(await t.p.evaluate(() => document.documentElement.classList.contains("mx-quick"))) && !(await t.p.isVisible("#mxMode")), "quick mode: never switches a round already started");
      await t.ctx.close();
    }

    // 13. beat-my-score links: checked strictly, never the answer, side by side at the end
    {
      const { ctx, p } = await page(b, U, { storage: { "dailycity:v2": '{"games":{},"results":{},"seenHelp":true}', "dailycity:coach": "1" } });
      const T = await p.evaluate(() => MXS.today());
      const bad = await p.evaluate((T) => ["#b-zz-1-0-5", `#b-mc-${T}-0-1001`, `#b-mc-${T}-2-600`, `#b-bc-${T}-0-11`, `#b-mc-${T}-0-<b>1</b>`, `#b-mc-${T + 2}-0-600`, "#b-mc-0-0-5"].map((h) => MXS.beat.parse(h)), T);
      check(bad.every((x) => x === null), "beat link: unknown games, out-of-range numbers and markup are refused", JSON.stringify(bad));
      check(JSON.stringify(await p.evaluate((T) => MXS.beat.parse(`#b-mc-${T}-1-600`), T)).includes('"score":600'), "beat link: a valid link is read");
      check((await p.evaluate(() => MXS.beat.upgrade("x mapelago.com/#c-12-600-3"))) === "x mapelago.com/#b-mc-12-0-600"
        && (await p.evaluate(() => MXS.beat.upgrade("Found in 3/5 pins, quick mode mapelago.com/#c-12-600-3"))).endsWith("#b-mc-12-1-600")
        && (await p.evaluate(() => MXS.beat.upgrade("mapelago.com/fathoms.html#c-12-4500"))) === "mapelago.com/fathoms.html#b-fa-12-0-4500", "beat link: shares carry game, puzzle, mode and score");
      await ctx.close();
      const c = await page(b, U + "?b=1#b-mc-" + T + "-0-640", { storage: { "dailycity:v2": '{"games":{},"results":{},"seenHelp":true}', "dailycity:coach": "1" } });
      await c.p.waitForFunction(() => window.__WORLD);
      check(/A friend scored 640 points on today's Mystery city/.test(await c.p.textContent(".mx-beat")), "beat link: the banner names the score and the game");
      const city = await c.p.evaluate(() => __lf.P.city);
      check(!(await c.p.textContent(".mx-beat")).includes(city), "beat link: the banner never gives the answer");
      await c.p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await c.p.waitForTimeout(3000);
      const vs = await c.p.evaluate(() => (document.querySelector(".mx-vs") || {}).innerText || "");
      check(/640/.test(vs) && /1000/.test(vs) && /You win/.test(vs) && /Send yours back/.test(vs), "beat link: both scores side by side at the end", vs);
      check(/#b-mc-\d+-0-1000$/.test(await c.p.evaluate(() => document.querySelector("#endBody .share").textContent.trim())), "beat link: your own share carries the new link");
      await c.ctx.close();
      const o = await page(b, U + "fathoms.html?b=2#b-fa-" + (T - 3) + "-0-6000", { wait: 900 });
      check(/No\. \d+, an earlier puzzle/.test(await o.p.textContent(".mx-beat")) && (await o.p.getAttribute(".mx-beat a", "href")) === "fathoms.html", "beat link: another day's link says so kindly and offers today's");
      await o.ctx.close();
    }

    // 9. Crossings: a shortest route scores 1000, the pairs last two years, it can be played by keyboard alone
    {
      const { ctx, p } = await page(b, U + "crossings.html#day-20", { wait: 800 });
      const r = await p.evaluate(() => {
        const X = __cross, P = X.P(), sizes = X.lists.map((l) => l.length);
        // walk a shortest route
        let x = P.from; const route = [];
        while (X.dist[x][P.to] > 1) { x = X.C.map((_, i) => i).find((n) => X.dist[x][n] === 1 && X.dist[n][P.to] === X.dist[x][P.to] - 1); route.push(x); }
        route.forEach((i) => X.guess(i));
        const save = JSON.parse(localStorage.getItem("dailycity:crossings:v1"));
        // no pair repeats within two years of daily puzzles
        const seen = new Set(); let dup = 0;
        for (let d = 1; d <= 730; d++) { const q = X.daily(d), k = Math.min(q.from, q.to) + "-" + Math.max(q.from, q.to); if (seen.has(k)) dup++; seen.add(k); }
        return { sizes, score: save.results[20] && save.results[20].score, done: !document.querySelector("#done").hidden, dup, share: document.querySelector("#shareText").textContent };
      });
      check(r.score === 1000 && r.done, "crossings: a shortest route scores 1000", JSON.stringify(r));
      check(Math.min(...r.sizes) >= 105 && r.dup === 0, "crossings: every weekday has two years of pairs, none repeat", JSON.stringify([r.sizes, r.dup]));
      check(/Crossings No\. 20 \u{1F422} 1000 points/u.test(r.share), "crossings: share text");
      await ctx.close();
      const k = await page(b, U + "crossings.html#day-21", { desktop: true, wait: 800 });
      const target = await k.p.evaluate(() => { const X = __cross, P = X.P(); return X.C.map((_, i) => i).filter((i) => i !== P.from && i !== P.to && X.heat(i) === 0).map((i) => X.name(i))[0]; });
      await k.p.focus("#cin"); await k.p.keyboard.type(target); await k.p.keyboard.press("Enter"); await k.p.waitForTimeout(200);
      check(/on a shortest route/i.test(await k.p.textContent("#say")) && !k.p.errs.length, "crossings: keyboard guess", await k.p.textContent("#say"));
      await k.ctx.close();
    }
  } finally { await b.close(); srv.close(); }
  console.log(`\n${passed} passed, ${failed.length} failed`);
  failed.forEach((f) => console.log("  FAIL " + f));
  process.exit(failed.length ? 1 : 0);
})();
