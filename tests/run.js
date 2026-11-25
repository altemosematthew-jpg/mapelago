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
      for (const f of ["index.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "privacy/index.html", "shapes.js", "sw.js"]) {
        const s = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
        const tags = [...s.matchAll(/["'](?:\.\.\/|\.\/)?(?:site|extras|shapes|world|copy|analytics)\.js(\?v=[^"']*)?["']/g)].map((m) => m[1] || "");
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

    // ---- bigcountry: Bigger country? reveal, runs and end card (review/bigcountry-merge-notes.md) ----
    {
      const BC = "dailycity:bigcountry:v1", fresh = { [BC]: '{"results":{},"game":null}' };
      // the area of an SVG path made of M/L/Z, in drawing units
      const drawn = () => [...document.querySelectorAll("#bcReveal .bcs .sh")].map((g) => {
        const d = (g.querySelector("path") || { getAttribute: () => "" }).getAttribute("d");
        return d.split("Z").filter(Boolean).reduce((t, seg) => {
          const q = seg.replace("M", "").split("L").map((s) => s.trim().split(" ").map(Number)); let a = 0;
          for (let i = 0; i < q.length; i++) { const [x0, y0] = q[i], [x1, y1] = q[(i + 1) % q.length]; a += x0 * y1 - x1 * y0; }
          return t + Math.abs(a) / 2;
        }, 0);
      });
      // a whole day at phone size (375 px, taps) and desktop size (keyboard only)
      for (const desktop of [false, true]) {
        const size = desktop ? "desktop" : "phone";
        const { ctx, p } = await page(b, U + "bigger-country.html#day-12", { desktop, storage: fresh, clock: new Date("2026-11-25T12:00:00"), ctx: desktop ? {} : { viewport: { width: 375, height: 667 } } });
        const outside = []; p.on("request", (r) => { if (!r.url().startsWith(U)) outside.push(r.url()); });
        await p.waitForFunction(() => window.MX && MX.play && window.__big);
        await p.evaluate(() => MXShapes.load()); await p.waitForFunction(() => window.__WORLD);
        const P = await p.evaluate(() => __big.S().pairs.map((x) => x.map((c) => c.pop)));
        const right = P.map((x) => (x[0] >= x[1] ? 0 : 1));
        const plan = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (i === 5 ? 1 - right[i] : right[i])); // one wrong pick, at round 6
        const seen = [];
        if (desktop) await p.focus("#pick0");
        for (let i = 0; i < 10; i++) {
          await p.waitForTimeout(350);
          if (desktop) { if (plan[i] === 1) await p.keyboard.press("Tab"); await p.keyboard.press("Enter"); }
          else await p.tap("#pick" + plan[i]);
          await p.waitForSelector("#bcNext", { state: "visible", timeout: 4000 });
          seen.push(await p.evaluate(() => ({ run: document.querySelector("#bcRun b").textContent, shapes: document.querySelectorAll("#bcReveal .bcs .sh").length, real: document.querySelector("#bcReveal .bcs").getAttribute("data-real"),
            ratio: document.querySelector("#bcReveal .bcratio").textContent, focus: document.activeElement.id, wide: document.documentElement.scrollWidth })));
          await p.waitForTimeout(300);
          if (desktop) await p.keyboard.press("Enter"); else await p.tap("#bcNext");
          await p.waitForTimeout(150);
          if (desktop && i < 9) check((await p.evaluate(() => document.activeElement.id)) === "pick0", `bigcountry ${size}: focus returns to the first card after round ${i + 1}`);
        }
        const runs = plan.map((_, i) => { let r = 0; for (let j = 0; j <= i; j++) r = plan[j] === right[j] ? r + 1 : 0; return String(r); });
        check(seen.every((s) => s.shapes === 2 && s.real === "1"), `bigcountry ${size}: every reveal draws both outlines`, JSON.stringify(seen.map((s) => [s.shapes, s.real])));
        check(JSON.stringify(seen.map((s) => s.run)) === JSON.stringify(runs), `bigcountry ${size}: the run counter counts right answers in a row`, JSON.stringify([seen.map((s) => s.run), runs]));
        check(seen.every((s) => /^\S.* is (\d[\d,.]*× the size of|\d+% bigger than|a whisker bigger than) \S/.test(s.ratio)), `bigcountry ${size}: every reveal says how much bigger`, seen.map((s) => s.ratio).join(" | "));
        if (desktop) check(seen.every((s) => s.focus === "bcNext"), "bigcountry desktop: keyboard play moves focus to Next and does not hurry on", JSON.stringify(seen.map((s) => s.focus)));
        else check(seen.every((s) => s.wide <= 375), "bigcountry phone: nothing wider than a 375 px screen", JSON.stringify(seen.map((s) => s.wide)));
        await p.waitForTimeout(400);
        const end = await p.evaluate((BC) => ({ done: !document.querySelector("#done").hidden, score: document.querySelector("#bigScore").textContent, save: JSON.parse(localStorage.getItem(BC)),
          tiles: [...document.querySelectorAll(".bctile")].map((t) => t.querySelectorAll("svg[data-i] .sh").length), share: document.querySelector("#shareText").textContent,
          best: document.querySelector("#bcBest").textContent, streak: MXS.info().find((x) => x.game.id === "bigcountry").cur }), BC);
        check(end.done && end.score === "9" && JSON.stringify(end.save) === JSON.stringify({ results: { 12: { score: 9, picks: plan } }, game: null }), `bigcountry ${size}: the day ends at 9/10 and saves exactly as before`, JSON.stringify([end.score, end.save]));
        check(end.tiles.length === 10 && end.tiles.every((n) => n === 2), `bigcountry ${size}: the end card strip shows all ten pairs`, JSON.stringify(end.tiles));
        const lines = end.share.split("\n");
        check(lines.length === 4 && /^Mapelago Bigger country\? No\. 12 \u{1F422} 9\/10$/u.test(lines[0]) && lines[1] === "✅".repeat(5) + "❌" + "✅".repeat(4) && lines[2] === "Best run: 5 · Close calls: 2 of 2"
          && /mapelago\.com\/bigger-country\.html#b-bn-12-0-9$/.test(lines[3]) && end.best === "5" && end.streak === 1, `bigcountry ${size}: share text and beat-my-score link`, JSON.stringify([end.share, end.best, end.streak]));
        await p.click(".bctile[data-i='8']"); await p.waitForTimeout(300);
        check(!(await p.isHidden("#bcDetail")) && (await p.evaluate(() => document.querySelectorAll("#bcDetail .bcs .sh").length)) === 2 && (await p.getAttribute(".bctile[data-i='8']", "aria-expanded")) === "true", `bigcountry ${size}: a tile opens that pair's reveal again`);
        check(!outside.length, `bigcountry ${size}: loads nothing from other sites`, outside.join(" "));
        check(!p.errs.length, `bigcountry ${size}: no errors`, p.errs.join("; "));
        await ctx.close();
      }
      // the true-scale ratio for a known pair: No. 12, round 4 is Finland and Belize (Finland is 14.5x Belize).
      // Finland sits at 60-70 degrees north; a plain latitude-longitude map would draw it about twice too big.
      {
        const { ctx, p } = await page(b, U + "bigger-country.html#day-12", { storage: { [BC]: '{"results":{},"game":{"n":12,"picks":[0,0,0]}}' } });
        await p.evaluate(() => MXShapes.load()); await p.waitForFunction(() => window.__WORLD); await p.waitForTimeout(300);
        await p.click("#pick0"); await p.waitForSelector("#bcNext", { state: "visible" }); await p.waitForTimeout(900); // the ratio counts up first
        const r = await p.evaluate((f) => ({ names: [...document.querySelectorAll("#bcReveal .bclab b")].map((x) => x.textContent), ratio: document.querySelector("#bcReveal .bcratio").textContent,
          areas: [...document.querySelectorAll("#bcReveal .bclab span")].map((x) => x.textContent), drawn: eval(f)() }), "(" + drawn.toString() + ")");
        check(JSON.stringify(r.names) === '["Finland","Belize"]' && r.ratio === "Finland is 15× the size of Belize" && r.areas[0] === "330,000 km²" && r.areas[1] === "22,800 km²", "bigcountry: Finland and Belize, \"Finland is 15× the size of Belize\"", JSON.stringify(r));
        const q = r.drawn[0] / r.drawn[1];
        check(Math.abs(q / 14.514 - 1) < 0.03, "bigcountry: drawn at true scale, Finland's outline covers 14.5 times Belize's (equal-area)", q.toFixed(2));
        const a = await p.evaluate(() => { const o = MxBC.outline(246), j = __big.S().pairs[3][0]; return [o.area, j.pop, MxBC.outline(36).area]; });
        check(Math.abs(a[0] / a[1] - 1) < 0.02 && a[2] > 7e6, "bigcountry: outline areas match the official figures (Finland), and Australia is Australia", JSON.stringify(a));
        check((await p.evaluate(() => document.querySelector("#say").textContent)) === "Right. Finland is 15 times the size of Belize: about 330,000 km² against about 22,800 km².", "bigcountry: the screen reader hears the verdict and the ratio");
        await ctx.close();
      }
      // close pairs race before the verdict, and a muted player hears nothing
      for (const muted of [true, false]) {
        const { ctx, p } = await page(b, U + "bigger-country.html#day-12", { storage: { [BC]: '{"results":{},"game":{"n":12,"picks":[0,0,0,0,0,1,1,1]}}', "dailycity:sound": muted ? "off" : "on" } });
        await p.evaluate(() => { window.__ac = 0; const A = window.AudioContext; window.AudioContext = function () { window.__ac++; return new A(); }; });
        await p.waitForFunction(() => window.MX && MX.play); await p.waitForTimeout(300);
        check((await p.textContent("#bcHeat")) === "Close call" && (await p.isVisible("#bcHeat")) && (await p.evaluate(() => document.querySelectorAll("#dots li.close").length)) >= 2, `bigcountry: round 9 is flagged as a close call`);
        await p.click("#pick0"); await p.waitForTimeout(300);
        const mid = await p.evaluate(() => ({ verdict: !!document.querySelector(".pick.right,.pick.wrong,.pick.big"), run: document.querySelector("#bcRun b").textContent }));
        await p.waitForTimeout(1000);
        const after = await p.evaluate(() => ({ verdict: !!document.querySelector(".pick.right"), run: document.querySelector("#bcRun b").textContent, ac: window.__ac }));
        if (muted) check(!mid.verdict && mid.run === "8" && after.verdict && after.run === "9", "bigcountry: on a close pair the verdict waits for the race", JSON.stringify([mid, after]));
        check(muted ? after.ac === 0 : after.ac > 0, `bigcountry: sound ${muted ? "stays off when muted" : "plays when on"}`, String(after.ac));
        check(!!(await p.$("#soundBtn")) && !(await p.$("#pastCities")), "bigcountry: the sound button is there, Past cities is not");
        await ctx.close();
      }
      // saves from releases 0.14.0 and 0.15.0 (recorded on those versions): the round in progress, finished days and the streak
      for (const v of ["0.14", "0.15"]) {
        const live = JSON.parse(fs.readFileSync(path.join(__dirname, `fixtures/bigcountry-save-from-v${v}.json`), "utf8"));
        const { ctx, p } = await page(b, U + "bigger-country.html#day-12", { storage: live, clock: new Date("2026-11-25T12:00:00"), wait: 900 });
        const s = await p.evaluate(() => ({ round: document.querySelector("#bcRound").textContent, dots: [...document.querySelectorAll("#dots li.done")].length, picks: __big.S().picks.join(""),
          run: document.querySelector("#bcRun b").textContent, ok: [0, 1, 2, 3].map((i) => { const x = __big.S().pairs[i]; return (x[0].pop >= x[1].pop ? 0 : 1) === __big.S().picks[i]; }), info: MXS.info().find((x) => x.game.id === "bigcountry") }));
        let run = 0; s.ok.forEach((o) => { run = o ? run + 1 : 0; });
        check(s.round === "Round 5 of 10" && s.dots === 4 && s.picks === "0110" && s.run === String(run), `${v}.0 bigcountry save: today's round resumes at pair 5 with its run`, JSON.stringify(s));
        check(s.info.cur === 2 && s.info.played === 2, `${v}.0 bigcountry save: streak kept (2)`, JSON.stringify([s.info.cur, s.info.played]));
        for (const [d, sc] of [[11, "4"], [10, "8"]]) {
          await p.evaluate((d) => (location.hash = "#day-" + d), d); await p.waitForTimeout(1000);
          const e = await p.evaluate(() => ({ done: !document.querySelector("#done").hidden, score: document.querySelector("#bigScore").textContent, tiles: document.querySelectorAll(".bctile").length, share: document.querySelector("#shareText").textContent }));
          check(e.done && e.score === sc && e.tiles === 10 && e.share.includes(` ${sc}/10`), `${v}.0 bigcountry save: No. ${d} keeps its score (${sc}) and shows its strip`, JSON.stringify(e));
        }
        check(!p.errs.length, `${v}.0 bigcountry save: no errors`, p.errs.join("; "));
        await ctx.close();
      }
      // a friend's beat-my-score link still lands, and both scores show side by side at the end
      {
        const { ctx, p } = await page(b, U + "bigger-country.html?b=1#b-bn-12-0-5", { storage: { [BC]: '{"results":{},"game":{"n":12,"picks":[0,0,0,0,0,1,1,1,0]}}' }, clock: new Date("2026-11-25T12:00:00"), wait: 900 });
        check(/A friend scored 5 of 10 on today's Bigger country\?/.test(await p.textContent(".mx-beat")), "bigcountry: a beat-my-score link shows the friend's score");
        await p.click("#pick0"); await p.waitForSelector("#bcNext", { state: "visible" }); await p.waitForTimeout(300); await p.click("#bcNext"); await p.waitForTimeout(600);
        const vs = await p.evaluate(() => (document.querySelector(".mx-vs") || {}).innerText || "");
        check(/5/.test(vs) && /10/.test(vs) && /You win/.test(vs), "bigcountry: both scores side by side at the end", vs);
        check(!p.errs.length, "bigcountry beat link: no errors", p.errs.join("; "));
        await ctx.close();
      }
      // the city page keeps its Past cities button now that extras.js is shared
      {
        const { ctx, p } = await page(b, U + "#day-12", { storage: { "dailycity:v2": '{"games":{},"results":{},"seenHelp":true}', "dailycity:coach": "1" } });
        check(!!(await p.$("#pastCities")) && !!(await p.$("#soundBtn")), "city: Past cities and the sound button are still there");
        await ctx.close();
      }
      const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8");
      check(/"extras\.js\?v=/.test(sw) && /"world\.js\?v=/.test(sw) && /"shapes\.js\?v=/.test(sw), "bigcountry: everything it needs is in the offline copy");
    }
    // ---- end bigcountry ----

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

    // 14. visitor counting is built but switched off; the privacy page always matches the switch
    {
      const hits = [];
      const ctx = await b.newContext(PHONE);
      ctx.on("request", (r) => { if (/cloudflareinsights/.test(r.url())) hits.push(r.url()); });
      const p = await ctx.newPage();
      for (const f of ["", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "privacy/", "about/", "games/"]) {
        await p.goto(U + f, { waitUntil: "load" }); await p.waitForTimeout(150);
      }
      check(hits.length === 0, "analytics: no request to the analytics host while the token is empty", hits.join(" "));
      await p.goto(U + "privacy/", { waitUntil: "load" });
      const off = await p.evaluate(() => [MXANALYTICS.on, [...document.querySelectorAll('[data-analytics="off"]')].every((e) => !e.hidden), [...document.querySelectorAll('[data-analytics="on"]')].every((e) => e.hidden), /no tracking scripts/.test(document.querySelector("main").innerText), /Cloudflare/.test(document.querySelector("main").innerText)]);
      check(JSON.stringify(off) === "[false,true,true,true,false]", "analytics: switched off, the privacy page promises no tracking and doesn't mention Cloudflare", JSON.stringify(off));
      const rules = await p.evaluate(() => { const a = MXANALYTICS.allowed; return [a("mapelago.com", {}), a("www.mapelago.com", {}), a("localhost", {}), a("claude-charming-bardeen-967w.mapelago.pages.dev", {}), a("mapelago.com", { globalPrivacyControl: true }), a("mapelago.com", { doNotTrack: "1" }), a("mapelago.com", {}, { doNotTrack: "1" })]; });
      check(JSON.stringify(rules) === "[true,true,false,false,false,false,false]", "analytics: only mapelago.com, never previews, never with GPC or Do Not Track", JSON.stringify(rules));
      await ctx.close();
      // the same pages with a token set (served to this test only)
      const on = await b.newContext(PHONE), hits2 = [];
      on.on("request", (r) => { if (/cloudflareinsights/.test(r.url())) hits2.push(r.url()); });
      await on.route(/analytics\.js/, async (route) => { const res = await route.fetch(); route.fulfill({ response: res, body: (await res.text()).replace('token: "", since: ""', 'token: "0123456789abcdef0123456789abcdef", since: "1 December 2026"') }); });
      const q = await on.newPage(); await q.goto(U + "privacy/", { waitUntil: "load" }); await q.waitForTimeout(200);
      const w = await q.evaluate(() => [MXANALYTICS.on, [...document.querySelectorAll('[data-analytics="on"]')].every((e) => !e.hidden), [...document.querySelectorAll('[data-analytics="off"]')].every((e) => e.hidden), /Cloudflare Web Analytics/.test(document.querySelector("main").innerText), /no tracking scripts/.test(document.querySelector("main").innerText), document.querySelector("#analyticsSince").textContent]);
      check(JSON.stringify(w) === '[true,true,true,true,false,"1 December 2026"]', "analytics: switched on, the privacy page says what is counted and by whom", JSON.stringify(w));
      check(hits2.length === 0, "analytics: even switched on, localhost is never counted", hits2.join(" "));
      await on.close();
      const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8");
      check(/new URL\(r\.url\)\.origin !== location\.origin\) return/.test(sw), "analytics: the service worker never saves another host's files");
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
