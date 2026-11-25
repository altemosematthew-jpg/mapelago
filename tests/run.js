// Mapelago browser tests. Run: cd tests && npm install && npx playwright install chromium && npm test
// They use the games' localhost-only test hooks (#day-N, window.__lf and friends), which do nothing on the live site.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const start = require("./server.js");
const UPDATE = process.argv.includes("--update-golden");
const GOLDEN = path.join(__dirname, "golden.json");
const GAMES = { city: "", country: "country.html", bigger: "bigger.html", biggercountry: "bigger-country.html", voyage: "voyage.html", fathoms: "fathoms.html", stamps: "stamps.html" };
const DAYS = [...Array(30).keys()].map((i) => i + 1).concat([60, 100, 200, 365]);
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
const DESKTOP = { viewport: { width: 1280, height: 800 } };
let passed = 0; const failed = [];
function check(ok, name, detail) { if (ok) passed++; else failed.push(name + (detail ? ` (${detail})` : "")); }

// What "the puzzle" is for each game, read from its test hook.
const PUZZLE = {
  city: () => __lf.P.city,
  country: () => __lf.P.name,
  bigger: () => __big.S().pairs.map((p) => p.map((x) => x.name).join(" | ")),
  biggercountry: () => __big.S().pairs.map((p) => p.map((x) => x.name).join(" | ")),
  voyage: () => __voy.S().qs.map((q) => q.ask + " = " + q.options[q.answer]),
  fathoms: () => __fath.S().prompts.map((p) => p.ask + " = " + p.answers.join(",")),
  stamps: () => Object.entries(__stamp.S().q).map(([k, qs]) => k + ": " + qs.map((q) => q.ask + " = " + q.options[q.answer]).join(" / ")),
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
    for (const f of ["", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "hints.html", "about/", "how-to-play/", "privacy/", "games/", "offline.html", "404.html"])
      for (const desktop of [false, true]) {
        const { ctx, p } = await page(b, U + f, { desktop, wait: 800 });
        check(!p.errs.length, `loads cleanly: /${f} ${desktop ? "desktop" : "phone"}`, p.errs.join("; "));
        await ctx.close();
      }

    // 1b. a release bumps the cache and every script address together, so returning players get it on their next visit
    {
      const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8"), v = /const C = "mapelago-([^"]+)"/.exec(sw)[1];
      for (const f of ["index.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "shapes.js", "sw.js"]) {
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
        await p.waitForFunction((g) => (g === "city" || g === "country" ? window.__lf : g.startsWith("bigger") ? window.__big : window[{ voyage: "__voy", fathoms: "__fath", stamps: "__stamp" }[g]]), g);
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
    for (const [f, k] of [["fathoms.html", "dailycity:fathoms:v1"], ["stamps.html", "dailycity:stamps:v1"], ["", "dailycity:v2"]]) {
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

    // ---- mx-country-rules: Mystery country plays by Mystery city's rules from No. 14 (review/country-rules-patch.py) ----
    {
      const fresh = { "dailycity:country:v1": '{"games":{},"results":{},"seenHelp":true}' };
      const far = () => __lf.confirmAt([((__lf.P.lon + 180) % 360) - 180, -__lf.P.lat]);
      const read = (p) => p.evaluate(() => ({ S: __lf.S(), pts: document.querySelector("#score").textContent, clues: document.querySelectorAll("#clues li").length,
        label: (document.querySelector("#nextClue").textContent.match(/\d+/) || [""])[0], slot: (document.querySelector("#track .upnext") || {}).textContent,
        cost: document.querySelector("#costNote").textContent, live: document.querySelector("#live").textContent }));
      // the start number: No. 13 starts on the old rules, No. 14 on the new
      for (const [day, cost, r] of [[13, 8, 1], [14, 6, 2]]) {
        const { ctx, p } = await page(b, U + "country.html#day-" + day, { storage: fresh });
        await p.waitForFunction(() => window.__WORLD);
        const s = await read(p);
        check(s.S.r === r && s.S.moveCost === cost && s.cost.startsWith(`Each move costs ${cost} points`), `country: a new No. ${day} round starts on rules ${r} (moves cost ${cost})`, JSON.stringify([s.S.r, s.S.moveCost, s.cost]));
        await ctx.close();
      }
      // the rules: one clue to start, moves cost 6, a miss costs 150 and opens the next clue, and the label matches the slot after it
      {
        const { ctx, p } = await page(b, U + "country.html#day-14", { storage: fresh });
        await p.waitForFunction(() => window.__WORLD);
        const s0 = await read(p);
        check(s0.clues === 1 && s0.S.tiles.every((t) => t.v === 2), "country: a new round starts with two 2-tiles and one clue", JSON.stringify([s0.clues, s0.S.tiles.map((t) => t.v)]));
        for (const k of ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"]) await p.keyboard.press(k);
        const s1 = await read(p), m = s1.S.swipes;
        check(m > 0 && s1.pts === String(1000 - 6 * m), "country: each move costs 6", JSON.stringify([m, s1.pts]));
        await p.evaluate(far); await p.waitForTimeout(1500);
        const s2 = await read(p);
        check(s2.pts === String(1000 - 6 * m - 150), "country: a missed pin costs 150", s2.pts);
        check(s2.clues === s1.clues + 1 && /Free clue: /.test(s2.live), "country: a missed pin opens the next clue", JSON.stringify([s1.clues, s2.clues, s2.live]));
        check(s2.label && s2.label === s2.slot, "country: next-clue label matches the highlighted slot after a free clue", JSON.stringify([s2.label, s2.slot]));
        check(/^(\S+ )?\S+( and (warmer|colder))?: Missed by [\d,]+ km\. The country is to the (north|south|east|west|northeast|northwest|southeast|southwest)\./u.test(s2.live), "country: the miss line gives heat, distance and direction", s2.live);
        await p.evaluate(() => __lf.openMap()); await p.waitForTimeout(400);
        check((await p.evaluate(() => document.querySelectorAll("#mapClues li").length)) === s2.clues && (await p.isVisible("#mapClues")), "country: the clues are inside the pin map");
        check(!p.errs.length, "country rules: no errors", p.errs.join("; "));
        await ctx.close();
      }
      // the miss distance is to the nearest point of the country's border; three misses score on the softer curve
      {
        const { ctx, p } = await page(b, U + "country.html#day-19", { storage: fresh });
        await p.waitForFunction(() => window.__WORLD);
        const r = await p.evaluate(() => ({ name: __lf.P.city, sq: __lf.near([5, -1], { type: "Polygon", coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]] }), az: __lf.dist([-110, 32.5]) }));
        check(Math.abs(r.sq[0] - 111.19) < 0.05 && r.sq[1][0] === 5 && r.sq[1][1] === 0, "country: distance to the middle of a long edge, not its corners", JSON.stringify(r.sq));
        check(r.name === "Mexico" && r.az.d > 125 && r.az.d < 136 && Math.abs(r.az.b - 180) < 10, "country: a pin in Arizona is about 130 km north of Mexico's nearest border", JSON.stringify(r));
        for (let i = 0; i < 3; i++) { await p.evaluate(() => __lf.confirmAt([-110, 32.5])); await p.waitForTimeout(1900); }
        const s = await p.evaluate(() => __lf.S()), want = Math.round(700 * (1 - Math.sqrt((r => r - 50)(s.pins[0].d) / 2450)));
        check(s.done && !s.won && s.score === want, `country: three near misses score on the softer last-pin curve (${want})`, JSON.stringify([s.score, s.pins.map((x) => x.d)]));
        await ctx.close();
      }
      // a save made on the live release (0.14.0): results, streak and a No. 14 round in progress keep their rules and scores
      {
        const live = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/country-save-from-v0.14.json"), "utf8"));
        const { ctx, p } = await page(b, U + "country.html#day-14", { storage: live, clock: new Date("2026-11-27T12:00:00"), wait: 1200 });
        await p.waitForFunction(() => window.__WORLD);
        const s = await read(p), info = await p.evaluate(() => MXS.info().find((x) => x.game.id === "country"));
        check(s.S.r === 1 && s.S.moveCost === 8 && s.S.swipes === 7 && s.pts === "794" && s.S.pins.length === 1 && s.S.clues === s.clues, "0.14.0 country save: the No. 14 round in progress keeps the old rules (7 moves, 1 miss, 794 points)", JSON.stringify([s.S.r, s.S.moveCost, s.S.swipes, s.pts, s.clues]));
        check(info.cur === 2 && info.played === 2, "0.14.0 country save: streak kept (2)", JSON.stringify([info.cur, info.played]));
        await p.evaluate(() => (location.hash = "#day-12")); await p.waitForTimeout(1200);
        check((await p.evaluate(() => __lf.S().score)) === 802, "0.14.0 country save: a finished round keeps its score (802)");
        check(!p.errs.length, "0.14.0 country save: no errors", p.errs.join("; "));
        await ctx.close();
      }
      // easier to find: both mystery games side by side at the top of each, and first in the game list; the city's end card offers the country
      for (const [f, key, cur] of [["", "dailycity:v2", "Mystery city"], ["country.html", "dailycity:country:v1", "Mystery country"]]) {
        const { ctx, p } = await page(b, U + f + "#day-12", { storage: { [key]: '{"games":{},"results":{},"seenHelp":true}' }, ctx: { viewport: { width: 375, height: 667 } } });
        const r = await p.evaluate(() => { const n = document.querySelector(".mx-find"); return { links: [...n.querySelectorAll("a")].map((a) => [a.getAttribute("href"), a.lastChild.textContent, a.getAttribute("aria-current")]), first: document.querySelector("header.top").nextElementSibling === n, bottom: n.getBoundingClientRect().bottom, cards: [...document.querySelectorAll(".mx-cards li b")].slice(0, 2).map((x) => x.textContent) }; });
        check(JSON.stringify(r.links.map((l) => [l[0], l[1]])) === JSON.stringify([["./", "Mystery city"], ["country.html", "Mystery country"]]) && r.links.filter((l) => l[2] === "page").map((l) => l[1]).join() === cur && r.first && r.bottom < 160,
          `find it: Mystery city and Mystery country at the top of /${f}`, JSON.stringify(r));
        check(r.cards.join() === "Mystery city,Mystery country", `find it: the two mystery games lead the game list on /${f}`, r.cards.join());
        if (!f) {
          await p.focus(".mx-find a[href='country.html']"); await p.keyboard.press("Enter"); await p.waitForURL(/country\.html/);
          check(true, "find it: the country tab works by keyboard");
        }
        await ctx.close();
      }
      {
        const { ctx, p } = await page(b, U + "#day-12", { storage: { "dailycity:v2": '{"games":{},"results":{},"seenHelp":true}' } });
        await p.waitForFunction(() => window.__WORLD);
        await p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(3500);
        const a = await p.evaluate(() => { const x = document.querySelector("#endBody .also"); return x && [x.getAttribute("href"), x.textContent]; });
        check(a && a[0] === "country.html" && /mystery country/i.test(a[1]), "find it: Mystery city's end card offers Mystery country next", JSON.stringify(a));
        await ctx.close();
      }
    }
    // text that has to match the games: the city's hints page and the About page
    {
      const { ctx, p } = await page(b, U + "hints.html", { wait: 600 });
      const t = await p.textContent("body");
      check(/Each move costs 6 points/.test(t) && !/costs 8 points/.test(t), "hints page: city moves cost 6");
      await ctx.close();
      const ab = fs.readFileSync(path.join(__dirname, "../about/index.html"), "utf8");
      check(!/One mystery city a day/.test(ab) && ["Mystery city", "Mystery country", "Bigger city?", "Bigger country?", "Voyage", "Fathoms", "Stamps", "Crossings"].every((g) => (/<p class="lede">(.*?)<\/p>/.exec(ab) || ["", ""])[1].includes(g)) && /Eight games a day/.test(ab), "about page: names all eight daily games");
    }
    // ---- end mx-country-rules ----

    // 8. a game in progress survives midnight
    {
      const { ctx, p } = await page(b, U, { clock: new Date("2026-11-25T23:59:30"), ctx: { timezoneId: "Europe/London" } });
      for (const k of ["ArrowUp", "ArrowRight", "ArrowUp"]) await p.keyboard.press(k);
      const before = await p.textContent("#num");
      await p.clock.runFor(60000); await p.waitForTimeout(300);
      check(before === (await p.textContent("#num")) && (await p.locator("#newDay").isVisible()), "city: an unfinished round survives midnight with a banner");
      await ctx.close();
    }
  } finally { await b.close(); srv.close(); }
  console.log(`\n${passed} passed, ${failed.length} failed`);
  failed.forEach((f) => console.log("  FAIL " + f));
  process.exit(failed.length ? 1 : 0);
})();
