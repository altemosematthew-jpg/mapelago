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
    for (const f of ["", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "history.html", "hints.html", "about/", "how-to-play/", "privacy/", "games/", "offline.html", "404.html"])
      for (const desktop of [false, true]) {
        const { ctx, p } = await page(b, U + f, { desktop, wait: 800 });
        check(!p.errs.length, `loads cleanly: /${f} ${desktop ? "desktop" : "phone"}`, p.errs.join("; "));
        await ctx.close();
      }

    // 1b. a release bumps the cache and every script address together, so returning players get it on their next visit
    {
      const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8"), v = /const C = "mapelago-([^"]+)"/.exec(sw)[1];
      for (const f of ["index.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "history.html", "privacy/index.html", "shapes.js", "sw.js"]) {
        const s = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
        const tags = [...s.matchAll(/["'](?:\.\.\/|\.\/)?(?:site|extras|shapes|world|copy|analytics|history|history-data)\.js(\?v=[^"']*)?["']/g)].map((m) => m[1] || "");
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
    // golden.json holds a fingerprint of each day's puzzle, not the puzzle, so the published file gives no answers away
    const fp = (v) => require("crypto").createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);
    for (const g of Object.keys(now)) for (const d of Object.keys(now[g])) now[g][d] = fp(now[g][d]);
    if (UPDATE || !fs.existsSync(GOLDEN)) { fs.writeFileSync(GOLDEN, JSON.stringify(now, null, 1)); console.log("golden.json written"); }
    else {
      const gold = JSON.parse(fs.readFileSync(GOLDEN, "utf8"));
      for (const g of Object.keys(GAMES)) for (const d of DAYS)
        check(gold[g] && gold[g][d] === now[g][d], `schedule unchanged: ${g} No. ${d}`);
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
      check(!/One mystery city a day/.test(ab) && ["Mystery city", "Mystery country", "Bigger city?", "Bigger country?", "Voyage", "Fathoms", "Stamps", "Crossings", "Logbook"].every((g) => (/<p class="lede">(.*?)<\/p>/.exec(ab) || ["", ""])[1].includes(g)) && /Nine games a day/.test(ab), "about page: names all nine daily games");
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
      const ladder = await p.evaluate(() => [...document.querySelectorAll("#track li")].map((l) => l.textContent));
      const nums = ladder.filter((x) => /^\d+$/.test(x));
      check(new Set(nums).size === nums.length && ladder.includes("\u{1F4CD}"), "the clue ladder never repeats a number; a pin marks the clue a miss opened", ladder.join(","));
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

    // 14. visitor counting (Cloudflare Web Analytics, switched on 25 Nov 2026): the beacon loads on mapelago.com only,
    //     never for Global Privacy Control or Do Not Track, and the privacy page always matches the switch
    {
      const PAGES = ["", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "privacy/", "about/", "games/"];
      const words = (q) => q.evaluate(() => [MXANALYTICS.on, [...document.querySelectorAll('[data-analytics="on"]')].every((e) => !e.hidden), [...document.querySelectorAll('[data-analytics="off"]')].every((e) => e.hidden), /Cloudflare Web Analytics/.test(document.querySelector("main").innerText), /no tracking scripts/.test(document.querySelector("main").innerText), (document.querySelector("#analyticsSince") || {}).textContent]);
      // switched on, on this machine: nothing is loaded, the wording is the counting wording
      {
        const ctx = await b.newContext(PHONE), hits = [];
        ctx.on("request", (r) => { if (/cloudflareinsights/.test(r.url())) hits.push(r.url()); });
        const p = await ctx.newPage();
        for (const f of PAGES) { await p.goto(U + f, { waitUntil: "load" }); await p.waitForTimeout(120); }
        check(hits.length === 0, "analytics: never counted on localhost", hits.join(" "));
        await p.goto(U + "privacy/", { waitUntil: "load" });
        const w = await words(p);
        check(JSON.stringify(w) === '[true,true,true,true,false,"November 25, 2026"]', "analytics: switched on, the privacy page says what is counted and by whom", JSON.stringify(w));
        await ctx.close();
      }
      // the same pages served as mapelago.com and as a pages.dev preview (the beacon itself is stopped, only recorded)
      const asHost = async (host, init) => {
        const ctx = await b.newContext(PHONE), hits = [];
        if (init) await ctx.addInitScript(init);
        await ctx.route(/cloudflareinsights/, (r) => { hits.push(r.request().url()); r.abort(); });
        await ctx.route(new RegExp("^https?://" + host.replace(/\./g, "\\.") + "/"), async (r) => { const u = new URL(r.request().url()); const res = await r.fetch({ url: U + u.pathname.slice(1) + u.search }); r.fulfill({ response: res }); });
        const p = await ctx.newPage();
        await p.goto("http://" + host + "/bigger.html", { waitUntil: "load" }); await p.waitForTimeout(300);
        await p.goto("http://" + host + "/privacy/", { waitUntil: "load" }); await p.waitForTimeout(300);
        const w = await words(p);
        await ctx.close();
        return { hits, w };
      };
      const live = await asHost("mapelago.com");
      check(live.hits.length === 2 && live.hits.every((u) => /static\.cloudflareinsights\.com\/beacon\.min\.js/.test(u)), "analytics: on mapelago.com every page loads the beacon", live.hits.join(" "));
      check(live.w[1] && live.w[3], "analytics: mapelago.com's privacy page shows the counting wording");
      check((await asHost("claude-charming-bardeen-967w.mapelago.pages.dev")).hits.length === 0, "analytics: never on a pages.dev preview");
      check((await asHost("mapelago.com", () => Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { get: () => true }))).hits.length === 0, "analytics: never with Global Privacy Control");
      check((await asHost("mapelago.com", () => Object.defineProperty(Navigator.prototype, "doNotTrack", { get: () => "1" }))).hits.length === 0, "analytics: never with Do Not Track");
      // with the token removed (the off switch), nothing loads and the page promises no tracking
      {
        const ctx = await b.newContext(PHONE), hits = [];
        await ctx.route(/cloudflareinsights/, (r) => { hits.push(r.request().url()); r.abort(); });
        await ctx.route(/^https?:\/\/mapelago\.com\//, async (r) => { const u = new URL(r.request().url()); const res = await r.fetch({ url: U + u.pathname.slice(1) }); r.fulfill({ response: res }); });
        // registered last, so it wins for analytics.js
        await ctx.route(/analytics\.js/, async (route) => { const res = await route.fetch({ url: U + "analytics.js" }); route.fulfill({ response: res, body: (await res.text()).replace(/token: "[0-9a-f]*"/, 'token: ""') }); });
        const p = await ctx.newPage();
        await p.goto("http://mapelago.com/privacy/", { waitUntil: "load" }); await p.waitForTimeout(300);
        const w = await words(p);
        check(hits.length === 0 && w[0] === false && w[4] === true && w[3] === false, "analytics: with an empty token nothing loads and the page says no tracking", JSON.stringify([hits, w]));
        await ctx.close();
      }
      const rules = await (async () => { const c = await b.newContext(); const q = await c.newPage(); await q.goto(U + "privacy/"); const r = await q.evaluate(() => { const a = MXANALYTICS.allowed; return [a("mapelago.com", {}), a("www.mapelago.com", {}), a("localhost", {}), a("x.mapelago.pages.dev", {}), a("mapelago.com", { globalPrivacyControl: true }), a("mapelago.com", { doNotTrack: "1" }), a("mapelago.com", {}, { doNotTrack: "1" })]; }); await c.close(); return r; })();
      check(JSON.stringify(rules) === "[true,true,false,false,false,false,false]", "analytics: the host and privacy rules", JSON.stringify(rules));
      const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8");
      check(/new URL\(r\.url\)\.origin !== location\.origin\) return/.test(sw) && !/cloudflareinsights/.test(sw.split("const PRE")[1].split("];")[0]), "analytics: the service worker never saves the beacon");
    }

    // 16. Crossings map labels never overlap (No. 12 put Hungary on Ukraine and the two Koreas on each other)
    {
      const { ctx, p } = await page(b, U + "crossings.html#day-12", { wait: 300 });
      await p.waitForFunction(() => window.__WORLD && document.querySelector("#map svg"));
      await p.evaluate(() => { const X = __cross, P = X.P(); X.C.map((_, i) => i).filter((i) => i !== P.from && i !== P.to && X.heat(i) <= 1).slice(0, 6).forEach((i) => X.guess(i)); });
      await p.waitForTimeout(300);
      const n = await p.evaluate(() => { const r = [...document.querySelectorAll("#map text")].map((t) => t.getBoundingClientRect()); let k = 0; for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], c = r[j]; if (a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top) k++; } return [r.length, k]; });
      check(n[0] >= 2 && n[1] === 0, "crossings: no two map labels overlap", JSON.stringify(n));
      await ctx.close();
    }

    // 17. game pages work at addresses without ".html" (mapelago.com/bigger, the previews' /bigger)
    {
      const { ctx, p } = await page(b, U + "bigger?q=1", { wait: 300 });
      const T = await p.evaluate(() => MXS.today());
      await p.goto(U + "bigger?q=2#b-bc-" + T + "-0-7"); await p.waitForTimeout(700);
      check(/A friend scored 7 of 10 on today's Bigger city\?/.test((await p.textContent(".mx-beat").catch(() => "")) || ""), "extensionless address: the beat-my-score banner shows on /bigger");
      await p.goto(U + "fathoms?q=3#c-" + T + "-4000"); await p.waitForTimeout(700);
      check(/A friend scored 4,000 fathoms/.test(await p.evaluate(() => [...document.querySelectorAll(".mx-risk")].map((e) => e.textContent).join(" "))), "extensionless address: the old challenge banner shows on /fathoms");
      await p.goto(U + "index?q=4#b-mc-" + T + "-0-850"); await p.waitForTimeout(900);
      check(/A friend scored 850 points on today's Mystery city/.test((await p.textContent(".mx-beat").catch(() => "")) || ""), "extensionless address: /index counts as the mystery city");
      await p.goto(U + "games/"); await p.waitForTimeout(500);
      check(!(await p.evaluate(() => !!document.querySelector(".mx-card.here"))), "a folder page such as /games/ is not mistaken for a game");
      await ctx.close();
    }

    // 18. a save from release 0.15.0 (recorded on that version): quick-mode result, crossings in progress, remembered mode
    {
      const v15 = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/save-from-v0.15.json"), "utf8"));
      const { ctx, p } = await page(b, U + "#day-12", { storage: v15, clock: new Date("2026-11-25T12:00:00"), wait: 1500 });
      const r = await p.evaluate(() => ({ res: JSON.parse(localStorage.getItem("dailycity:v2")).results[12], city: MXS.info().find((s) => s.game.id === "city"), quick: document.documentElement.classList.contains("mx-quick") }));
      check(r.res.q === 1 && r.res.score === 800 && r.city.cur === 3 && r.quick, "0.15.0 save: the quick-mode day and the 3-day streak are kept", JSON.stringify([r.res, r.city.cur, r.quick]));
      await p.goto(U + "?n=13#day-13"); await p.waitForTimeout(1200);
      check(await p.evaluate(() => document.documentElement.classList.contains("mx-quick")), "0.15.0 save: the remembered quick mode applies to the next day");
      await p.goto(U + "crossings.html#day-12"); await p.waitForTimeout(800);
      check((await p.evaluate(() => __cross.G().steps.map((s) => __cross.name(s.i)).join(","))) === "North Korea", "0.15.0 save: a crossing in progress keeps its guesses");
      check(!p.errs.length, "0.15.0 save: no errors", p.errs.join("; "));
      await ctx.close();
    }

    // 19. Fathoms: Tuvalu is a country (from No. 20), and from No. 20 each day deals seven different kinds of prompt
    {
      const { ctx, p } = await page(b, U + "fathoms.html#day-20", { storage: { "dailycity:fathoms:v1": '{"results":{},"game":null}' }, wait: 600 });
      const kinds = await p.evaluate(() => __fath.S().prompts.map((x) => x.kind));
      check(new Set(kinds).size === 7, "fathoms: seven different kinds of prompt on No. 20", kinds.join(","));
      const at = await p.evaluate(() => __fath.S().prompts.findIndex((x) => x.answers.includes("TV")));
      for (let i = 0; i < at; i++) { await p.click("#fpass"); await p.waitForTimeout(150); await p.click("#fnext"); await p.waitForTimeout(150); }
      await p.fill("#fin", "Tuvalu"); await p.waitForTimeout(100); await p.click("#fgo"); await p.waitForTimeout(400);
      const r = await p.evaluate(() => __fath.S());
      check(at >= 0 && r.picks[at] === "TV" && r.total > 0, "fathoms: Tuvalu is accepted as a right answer", JSON.stringify([at, r.picks, r.total]));
      await ctx.close();
      const o = await page(b, U + "fathoms.html#day-19", { wait: 600 });
      check(!(await o.p.evaluate(() => __fath.S().prompts.some((x) => x.answers.includes("TV")))), "fathoms: days before No. 20 are dealt exactly as before");
      await o.ctx.close();
    }

    // 20. source-checked city facts on the end card (looked up by city, never by puzzle number)
    {
      const ends = {};
      for (const d of [12, 13, 46]) {
        const { ctx, p } = await page(b, U + "#day-" + d, { storage: { "dailycity:v2": '{"games":{},"results":{},"seenHelp":true}', "dailycity:coach": "1" } });
        await p.waitForFunction(() => window.__WORLD);
        await p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(2600);
        ends[d] = await p.evaluate(() => ({ facts: [...document.querySelectorAll("#endBody .facts li")].map((l) => l.textContent), country: document.querySelector("#endBody .country").textContent }));
        await ctx.close();
      }
      check(ends[13].facts.length === 3 && /bandeng presto/.test(ends[13].facts.join(" ")), "city facts: No. 13 shows its three checked facts", JSON.stringify(ends[13]));
      check(ends[12].facts.length >= 1 && !/bandeng/.test(ends[12].facts.join(" ")), "city facts: a city without checked facts keeps the standard ones");
      check(ends[46].country === "China (Macao SAR)" && /1557/.test(ends[46].facts.join(" ")), "city facts: Macau reads China (Macao SAR)", JSON.stringify(ends[46]));
      const src = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
      check(!/"13":\[|No\. 13/.test(src.slice(src.indexOf("var MxCF="), src.indexOf("var MxCF=") + 300)), "city facts: the page keys them by city, not by puzzle number");
    }

    // 21. landmarks for screen readers: exactly one main region on every page (checked with axe-core: no landmark issues left)
    {
      const ctx = await b.newContext(PHONE), p = await ctx.newPage(), bad = [];
      for (const f of ["", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "games/", "privacy/", "about/", "how-to-play/"]) {
        await p.goto(U + f, { waitUntil: "load" }); await p.waitForTimeout(250);
        const r = await p.evaluate(() => [document.querySelectorAll("main,[role=main]").length, document.querySelectorAll("main header,[role=main] > header:not([role=none])").length]);
        if (r[0] !== 1 || r[1]) bad.push(f + " " + JSON.stringify(r));
      }
      check(!bad.length, "landmarks: each page has one main region", bad.join(" | "));
      await ctx.close();
    }

    // 22. the app manifest and the home page's search data know all eight games
    {
      const m = JSON.parse(fs.readFileSync(path.join(__dirname, "../manifest.webmanifest"), "utf8"));
      const ok = (m.shortcuts || []).every((x) => fs.existsSync(path.join(__dirname, "..", x.url === "./" ? "index.html" : x.url.endsWith("/") ? x.url + "index.html" : x.url)));
      check(ok && m.shortcuts.length >= 3, "manifest: shortcuts point at real pages");
      const home = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
      check(/Nine free daily geography games[^"]*Logbook/.test(home), "home page search data lists all nine games");
    }

    // 23. Crossings speaks in countries: par is the countries between, and the result shows one shortest route
    {
      const { ctx, p } = await page(b, U + "crossings.html#day-12", { wait: 400 });
      const r0 = await p.evaluate(() => [document.querySelector("#par").textContent, __cross.P().par]);
      check(Number(r0[0]) === r0[1] - 1, "crossings: par shows the countries between", JSON.stringify(r0));
      await p.evaluate(() => { const X = __cross, P = X.P(); let x = P.from; while (X.dist[x][P.to] > 1) { x = X.C.map((_, i) => i).find((n) => X.dist[x][n] === 1 && X.dist[n][P.to] === X.dist[x][P.to] - 1); X.guess(x); } });
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => [document.querySelector("#routeLine").textContent, document.querySelector("#shareText").textContent, document.querySelector("#bigScore").textContent]);
      check(/a shortest one: .+ → .+/.test(r[0]) && /par \d+ countr(y|ies) · /.test(r[1]) && r[2] === "1,000", "crossings: result shows the route, par in countries, 1,000 with a comma", JSON.stringify(r));
      await ctx.close();
    }

    // 24. the next-game button goes to the first unplayed game; the release line is in every game's footer
    {
      const pre = await page(b, U + "bigger.html"); const T = await pre.p.evaluate(() => MXS.today()); await pre.ctx.close();
      const done = (k) => JSON.stringify({ results: { [T]: { score: 5 } }, games: {} });
      const st = { "dailycity:v2": done(), "dailycity:country:v1": done(), "dailycity:bigger:v1": done(), "dailycity:coach": "1" };
      const { ctx, p } = await page(b, U + "crossings.html", { storage: st, wait: 600 });
      await p.evaluate(() => { const X = __cross, P = X.P(); let x = P.from; while (X.dist[x][P.to] > 1) { x = X.C.map((_, i) => i).find((n) => X.dist[x][n] === 1 && X.dist[n][P.to] === X.dist[x][P.to] - 1); X.guess(x); } });
      await p.waitForTimeout(400);
      const btn = await p.evaluate(() => { const a = document.querySelector("#done .row2 a.act.plain"); return [a.getAttribute("href"), a.textContent]; });
      check(btn[0] === "bigger-country.html" && btn[1] === "Play Bigger country? next", "next game: skips the games already played today", JSON.stringify(btn));
      check(/^Mapelago release \d+\.\d+\.\d+$/.test(await p.textContent(".mx-ver")), "the footer names the release");
      await ctx.close();
      // with every other game done and this one not, it doesn't say everything is done
      const all = {}; for (const k of ["dailycity:v2", "dailycity:country:v1", "dailycity:bigger:v1", "dailycity:bigcountry:v1", "dailycity:voyage:v1", "dailycity:fathoms:v1", "dailycity:stamps:v1", "dailycity:history:v1"]) all[k] = done();
      const q = await page(b, U + "crossings.html", { storage: all, wait: 600 });
      const line = await q.p.evaluate(() => [...document.querySelectorAll(".mx-next")].map((e) => e.textContent).join(" "));
      check(!/Every game done/.test(line) && /last game left/.test(line), "today's games: not 'every game done' while this one is unplayed", line);
      await q.ctx.close();
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
      check(/Crossings No\. 20 \u{1F422} 1,000 points/u.test(r.share), "crossings: share text");
      await ctx.close();
      const k = await page(b, U + "crossings.html#day-21", { desktop: true, wait: 800 });
      const target = await k.p.evaluate(() => { const X = __cross, P = X.P(); return X.C.map((_, i) => i).filter((i) => i !== P.from && i !== P.to && X.heat(i) === 0).map((i) => X.name(i))[0]; });
      await k.p.focus("#cin"); await k.p.keyboard.type(target); await k.p.keyboard.press("Enter"); await k.p.waitForTimeout(200);
      check(/on a shortest route/i.test(await k.p.textContent("#say")) && !k.p.errs.length, "crossings: keyboard guess", await k.p.textContent("#say"));
      await k.ctx.close();
    }
    // ---- vx: Voyage and Stamps, new question families from the country pack and "Play more" practice (voyage-stamps session) ----
    {
      const pack = require("../review/vx-pack.js"), P = {};
      for (const c of pack.parse()) if (!pack.NOT_IN_GAMES.has(c.raw)) P[c.name] = c;
      const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      const code = (c) => c.call.split("/")[0];
      // every answer in the new families matches data/countries.txt, and no flagged or unverified fact is asked
      const checkQ = (q, kind, where) => {
        const right = q.options[q.answer], wrong = q.options.filter((o, i) => i !== q.answer), A = P[right], W = wrong.map((o) => P[o]);
        let ok = !!A && W.every(Boolean);
        if (ok && kind === "money") { const m = /^The (.+) is the currency of which country\?$/.exec(q.ask), n = m && norm(m[1]); ok = !!m && norm(A.money).includes(n) && W.every((w) => !norm(w.money).includes(n)) && !pack.NO_MONEY.has(right); }
        if (ok && kind === "drive") ok = A.drive === "left" && W.every((w) => w.drive === "right") && /drives on the left\?$/.test(q.ask);
        if (ok && kind === "peak") ok = q.ask === `${A.peak} is the highest point of which country?` && W.every((w) => w.peak !== A.peak) && !pack.NO_PEAK.has(right) && !/unnamed/i.test(A.peak);
        if (ok && kind === "call") { const c = code(A); ok = q.ask === `Phone numbers in which country start with ${c}?` && Object.values(P).filter((x) => code(x) === c).length === 1; }
        if (ok && kind === "web") ok = q.ask === `Which country's web addresses end in ${A.web}?` && !pack.NO_WEB.has(A.web);
        if (ok && kind === "inland") ok = A.coast === "landlocked" && W.every((w) => w.coast !== "landlocked");
        if (!ok) check(false, `vx: ${where} ${kind} question matches the pack`, JSON.stringify(q));
        return ok;
      };
      const NEWK = ["money", "drive", "peak", "call", "web", "inland"];
      const { ctx, p } = await page(b, U + "voyage.html#day-14", { wait: 600 });
      const vq = await p.evaluate(() => { const H = VXH, out = []; for (let d = 14; d <= 120; d++) VXV.deal(H.xa, H.dt, d, H.yn).forEach((q) => out.push([d, q.kind, { ask: q.ask, options: q.options, answer: q.answer }])); return out; });
      let bad = 0, seen = {};
      for (const [d, k, q] of vq) if (NEWK.includes(k)) { seen[k] = (seen[k] || 0) + 1; if (!checkQ(q, k, `voyage No. ${d}`)) bad++; }
      check(!bad && NEWK.every((k) => seen[k] > 10), "vx: Voyage asks every new family, and every answer matches the pack (No. 14 to 120)", JSON.stringify(seen));
      const first = await p.evaluate(() => { const H = VXH, s = new Set(); for (let d = 14; d <= 400; d++) for (const q of VXV.deal(H.xa, H.dt, d, H.yn)) { const k = q.kind + "|" + q.about; if (s.has(k)) return d; s.add(k); } return 0; });
      check(first >= 110, `vx: Voyage runs ${first - 14} days from No. 14 before any question repeats`, String(first));
      await p.goto(U + "stamps.html#day-14"); await p.waitForFunction(() => window.__stamp);
      const sq = await p.evaluate(() => { const out = [], prev = []; let same = 0, cats = {}; for (let d = 14; d <= 120; d++) { const A = SX.deal(d, () => {}), ks = Object.keys(A); if (ks.join() === prev.join()) same++; prev.splice(0, 9, ...ks); ks.forEach((k) => { cats[k] = (cats[k] || 0) + 1; A[k].forEach((q) => out.push([d, k, q])); }); } return { out, same, cats }; });
      bad = 0; seen = {};
      for (const [d, k, q] of sq.out) if (NEWK.includes(k)) { seen[k] = (seen[k] || 0) + 1; if (!checkQ(q, k, `stamps No. ${d}`)) bad++; }
      check(!bad && ["money", "drive", "peak", "call", "web"].every((k) => seen[k] > 10) && sq.same === 0, "vx: Stamps' wheel changes every day, asks every new family, and every answer matches the pack (No. 14 to 120)", JSON.stringify([seen, sq.same]));
      const sfirst = await p.evaluate(() => { const s = new Set(); for (let d = 14; d <= 400; d++) { const A = SX.deal(d, () => {}); for (const [k, qs] of Object.entries(A)) for (const q of qs) { const id = k + "|" + q.ask + "|" + q.options[q.answer]; if (s.has(id)) return d; s.add(id); } } return 0; });
      check(sfirst >= 110, `vx: Stamps runs ${sfirst - 14} days from No. 14 before any question repeats`, String(sfirst));
      // the start number: No. 13 is dealt exactly as before (golden.json), No. 14 by the new mix
      const k13 = await p.evaluate(() => { location.hash = "#day-13"; return 1; }).then(() => p.waitForTimeout(800)).then(() => p.evaluate(() => Object.keys(__stamp.S().q).join()));
      check(k13 === "capital,border,tongue,size,continent,coast", "vx: Stamps No. 13 keeps the original six categories", k13);
      check(!p.errs.length, "vx: pack checks, no errors", p.errs.join("; "));
      await ctx.close();
    }
    // saves from 0.14.0 and 0.15.2 (recorded on those versions): Voyage and Stamps results, streaks and rounds in progress load unchanged
    for (const v of ["0.14", "0.15"]) {
      const save = JSON.parse(fs.readFileSync(path.join(__dirname, `fixtures/voyage-stamps-save-from-v${v}.json`), "utf8"));
      const { ctx, p } = await page(b, U + "voyage.html#day-11", { storage: save, clock: new Date("2026-11-25T12:00:00"), wait: 800 });
      const rd = () => p.evaluate(() => ({ pts: document.querySelector("#bigScore").textContent, title: document.querySelector("#doneTitle").textContent, done: !document.querySelector("#done").hidden }));
      const v11 = await rd();
      await p.goto(U + "voyage.html?n=12#day-12"); await p.waitForTimeout(600); const v12 = await rd();
      await p.goto(U + "voyage.html?n=13#day-13"); await p.waitForTimeout(600);
      const v13 = await p.evaluate(() => ({ choice: !document.querySelector("#choice").hidden, pts: document.querySelector("#vPoints").textContent, streak: MXS.info().find((s) => s.game.id === "voyage").cur }));
      check(v11.done && v11.pts === "150" && v11.title === "Anchored after island 3." && v12.pts === "150" && v12.title === "Wrecked at island 5." && v13.choice && v13.pts === "100" && v13.streak === 2,
        `vx: ${v} save: Voyage results, streak and the round in progress load unchanged`, JSON.stringify([v11, v12, v13]));
      await p.goto(U + "stamps.html?n=11#day-11"); await p.waitForTimeout(600);
      const s11 = await p.evaluate(() => [document.querySelector("#bigScore").textContent, document.querySelector("#bigSub").textContent]);
      await p.goto(U + "stamps.html?n=12#day-12"); await p.waitForTimeout(600);
      const s12 = await p.evaluate(() => [document.querySelector("#bigScore").textContent, document.querySelector("#bigSub").textContent, MXS.info().find((s) => s.game.id === "stamps").cur]);
      await p.goto(U + "stamps.html?n=13#day-13"); await p.waitForTimeout(600);
      const s13 = await p.evaluate(() => [__stamp.S().log.length, document.querySelector("#passTitle").textContent]);
      check(s11.join() === "6 of 6,stamps in 6 spins" && s12.join() === "5 of 6,stamps in 8 spins,2" && s13.join() === "3,1 of 6 stamps",
        `vx: ${v} save: Stamps results, streak and the round in progress load unchanged`, JSON.stringify([s11, s12, s13]));
      check(!p.errs.length, `vx: ${v} save: no errors`, p.errs.join("; "));
      await ctx.close();
    }
    // "Play more": endless practice after the daily round, by keyboard, never touching the daily save, streaks, stats or share text
    for (const [f, key, more, panel, opts, next, back] of [["voyage.html", "dailycity:voyage:v1", "#vxMore", "#vxp", "#vxpOpts", "#vxpNext", "#vxpBack"], ["stamps.html", "dailycity:stamps:v1", "#sxMore", "#sxp", "#sxpOpts", "#sxpNext", "#sxpBack"]]) {
      const save = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/voyage-stamps-save-from-v0.15.json"), "utf8"));
      const { ctx, p } = await page(b, U + f + "#day-12", { storage: save, clock: new Date("2026-11-25T12:00:00"), wait: 1200, desktop: true });
      const snap = () => p.evaluate((k) => ({ save: localStorage.getItem(k), share: document.querySelector("#shareText").textContent, info: JSON.stringify(MXS.info().map((s) => [s.game.id, s.cur, s.best, s.played])) }), key);
      const before = await snap();
      check(await p.isVisible(more), `vx: ${f} "Play more" shows under the result`);
      await p.focus(more); await p.keyboard.press("Enter"); await p.waitForTimeout(200);
      const st = await p.evaluate(([panel, opts]) => ({ open: !document.querySelector(panel).hidden, doneHidden: document.querySelector("#done").hidden, focus: document.activeElement && document.activeElement.closest(opts) !== null, tag: document.querySelector(panel + " .vxp-tag").textContent }), [panel, opts]);
      check(st.open && st.doneHidden && st.focus && /Practice/.test(st.tag), `vx: ${f} practice opens, labelled as practice, focus on the first answer`, JSON.stringify(st));
      const game = f === "voyage.html" ? "VXV" : "SX";
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const a = await p.evaluate((g) => window[g].practice.state().q.answer, game), pickRight = i !== 4;
        const target = pickRight ? a : (a + 1) % 4;
        // keyboard only: Tab from the first option to the chosen one, then Enter
        await p.focus(`${opts} .opt`); for (let t = 0; t < target; t++) await p.keyboard.press("Tab");
        await p.keyboard.press("Enter"); await p.waitForTimeout(100);
        streak = pickRight ? streak + 1 : 0;
        const r = await p.evaluate(([g, next]) => ({ streak: window[g].practice.state().streak, nextFocused: document.activeElement === document.querySelector(next) }), [game, next]);
        check(r.streak === streak && r.nextFocused, `vx: ${f} practice question ${i + 1}: streak ${streak}, focus on Next`, JSON.stringify(r));
        await p.keyboard.press("Enter"); await p.waitForTimeout(100);
      }
      const best = await p.evaluate((g) => JSON.parse(localStorage.getItem("dailycity:practice:v1"))[g].best, f === "voyage.html" ? "voyage" : "stamps");
      check(best === 4, `vx: ${f} best practice streak kept in its own save (4)`, String(best));
      await p.click(back); await p.waitForTimeout(100);
      const after = await snap();
      check(after.save === before.save && after.share === before.share && after.info === before.info && !(await p.isVisible(panel)) && (await p.isVisible("#done")),
        `vx: ${f} practice never touches the daily save, streaks, stats or share text`, JSON.stringify([before, after]));
      check(!p.errs.length, `vx: ${f} practice: no errors`, p.errs.join("; "));
      await ctx.close();
    }
    // ---- vx review fixes (hands-on review of live 0.15.2). No. 12 and 13 keep their answers and scoring (golden.json). ----
    {
      const pack = require("../review/vx-pack.js"), P = {};
      for (const c of pack.parse()) if (!pack.NOT_IN_GAMES.has(c.raw)) P[c.name] = c;
      const fresh375 = { ctx: { viewport: { width: 375, height: 667 } }, wait: 1200 };
      // Voyage: harbors on the route, the ladder once, the harbor note, the spyglass stays visible as used
      {
        const { ctx, p } = await page(b, U + "voyage.html#day-14", fresh375);
        await p.waitForFunction(() => window.__WORLD);
        const r = await p.evaluate(() => ({ harbors: [...document.querySelectorAll("#dots li")].map((l, i) => l.classList.contains("harbor") ? i + 1 : 0).filter(Boolean),
          ladder: [...document.querySelectorAll(".vx-ladder li")].map((l) => l.textContent), note: !document.querySelector("#vxHarborNote").hidden,
          key: getComputedStyle(document.querySelector(".vx-key")).display !== "none", caption: !!document.querySelector(".vx-topics") }));
        check(JSON.stringify(r.harbors) === "[3,6]" && r.ladder.join("|") === "50|100|150, harbor|250|350|500, harbor|650|800|900|1,000" && r.note && r.key && r.caption,
          "vx review: Voyage marks the harbors, shows the points ladder once, explains safe in harbor and the topic chips", JSON.stringify(r));
        // alt text for the globe (island 1 on No. 14 is a globe question), and for an outline
        const alt = await p.evaluate(() => { const c = document.querySelector("#show"), q = __voy.S().qs[0]; const H = VXH; let shape = null;
          for (let d = 14; d < 40 && !shape; d++) shape = VXV.deal(H.xa, H.dt, d, H.yn).find((x) => x.kind === "shape") || null;
          const cv = document.createElement("canvas"); VXV.alt(shape, cv, H.xa);
          return { kind: q.kind, role: c.getAttribute("role"), label: c.getAttribute("aria-label"), shape: cv.getAttribute("aria-label"), answer: shape.options[shape.answer] }; });
        check(alt.kind === "mark" && alt.role === "img" && /^A globe with a mark at about \d+° (north|south), \d+° (east|west)\.$/.test(alt.label) && /^The outline of a country in [A-Za-z ]+, .+ square kilometres\.$/.test(alt.shape) && !alt.shape.includes(alt.answer),
          "vx review: the globe and outline pictures have a text alternative that doesn't give the answer away", JSON.stringify(alt));
        const a0 = await p.evaluate(() => __voy.S().qs[0].answer);
        await p.click("#spy"); await p.waitForTimeout(200);
        const s1 = await p.evaluate(() => [document.querySelector("#spy").hidden, document.querySelector("#spy").disabled, document.querySelector("#spy").textContent, document.querySelectorAll("#opts .opt:not([hidden])").length]);
        await p.click(`#opts .opt[data-k="${a0}"]`); await p.waitForTimeout(1500); await p.click("#sail"); await p.waitForTimeout(300);
        const s2 = await p.evaluate(() => [document.querySelector("#spy").hidden, document.querySelector("#spy").disabled, document.querySelector("#spy").textContent, document.querySelector("#say").textContent]);
        check(JSON.stringify(s1) === '[false,true,"Spyglass used on this island",2]' && JSON.stringify(s2) === '[false,true,"Spyglass used (one a day)","Worth 100 points."]', "vx review: a used spyglass stays visible as used", JSON.stringify([s1, s2]));
        check(!p.errs.length, "vx review: Voyage, no errors", p.errs.join("; "));
        // all ten islands: the share line fits, and 1,000 has its comma
        const all = await p.evaluate(() => { const s = __voy.S(); return JSON.stringify({ results: { 14: { n: 14, at: 9, picks: s.qs.map((q) => q.answer), spy: -1, end: "home" } }, game: null }); });
        await p.evaluate((v) => localStorage.setItem("dailycity:voyage:v1", v), all); await p.reload(); await p.waitForTimeout(800);
        const h = await p.evaluate(() => [document.querySelector("#bigScore").textContent, document.querySelector("#shareText").textContent]);
        check(h[0] === "1,000" && /🐢 1,000 points/u.test(h[1]) && /I made it home: all ten islands/.test(h[1]) && !/drop anchor too soon/.test(h[1]), "vx review: sailing all ten islands shares a fitting line, with 1,000 written with a comma", JSON.stringify(h));
        await ctx.close();
      }
      // Voyage from No. 14: islands get harder as they're worth more, and city names read as in English
      {
        const { ctx, p } = await page(b, U + "voyage.html#day-14", { wait: 600 });
        const r = await p.evaluate(() => { const H = VXH, bad = [], odd = []; for (let d = 14; d <= 200; d++) { const qs = VXV.deal(H.xa, H.dt, d, H.yn);
          qs.forEach((q, i) => { if (i && q.ease < qs[i - 1].ease) bad.push(d); q.options.forEach((o) => { if (/[āīūēō’]|Nizhniy|Ürümqi|İzmir/.test(o)) odd.push(o); }); }); } return { bad, odd }; });
        check(!r.bad.length && !r.odd.length, "vx review: Voyage islands never get easier as their value rises, and city names read as in English (No. 14 to 200)", JSON.stringify(r).slice(0, 300));
        await ctx.close();
      }
      // Stamps: size questions say "by area"; explanations add a checked fact; one answer message; labelled share grid; the wheel explains itself
      {
        const { ctx, p } = await page(b, U + "stamps.html#day-14", { ...fresh375, ctx: { viewport: { width: 375, height: 667 }, reducedMotion: "reduce" } });
        const r = await p.evaluate(() => { const out = []; for (let d = 14; d <= 80; d++) { const A = SX.explainAll(SX.deal(d, () => {}), d); for (const [k, qs] of Object.entries(A)) qs.forEach((q) => out.push([d, k, q])); } return out; });
        let bad = [];
        for (const [d, k, q] of r) {
          const right = q.options[q.answer];
          if (k === "size" && q.ask !== "Which of these countries is the largest by area?") bad.push([d, k, q.ask]);
          if (k === "border" || k === "continent") continue;
          if (k === "size") { if (!/^(The )?.+ is the largest by area: about [\d.]+ times the size of .+, the next largest of the four\.$/.test(q.about)) bad.push([d, k, q.about]); continue; }
          const facts = q.about.split(/(?<=\.) /).slice(1).join(" ");
          if (!facts) { bad.push([d, k, q.about]); continue; }
          let m, ok = true;
          if ((m = /^The currency of (?:the )?(.+) is the (.+)\.$/.exec(facts))) ok = P[m[1]] && pack.parse && P[m[1]].money.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(m[2].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase());
          else if ((m = /^The highest point of (?:the )?(.+) is (.+), ([\d,]+) m\.$/.exec(facts))) ok = P[m[1]] && P[m[1]].peak === m[2] && P[m[1]].height === +m[3].replace(/,/g, "");
          else if ((m = /^Phone numbers in (?:the )?(.+) start with (.+)\.$/.exec(facts))) ok = P[m[1]] && P[m[1]].call.split("/")[0] === m[2];
          else if ((m = /^Web addresses in (?:the )?(.+) end in (.+)\.$/.exec(facts))) ok = P[m[1]] && P[m[1]].web === m[2];
          else if ((m = /^(?:The )?(.+) drives on the left\.$/.exec(facts))) ok = P[m[1]] && P[m[1]].drive === "left";
          else if ((m = /^(?:The )?(.+) has no sea coast\.$/.exec(facts))) ok = P[m[1]] && P[m[1]].coast === "landlocked";
          else if (!/^The capital of (?:the )?.+ is .+\.$/.test(facts)) ok = false;
          if (!ok) bad.push([d, k, q.about]);
        }
        check(!bad.length, "vx review: Stamps size questions say by area, and every explanation adds a fact that matches the pack (No. 14 to 80)", JSON.stringify(bad.slice(0, 4)));
        check(await p.isVisible("#vxWheelNote") && /stop it early.*skips categories.*picks that one for you/.test(await p.textContent("#vxWheelNote")), "vx review: the wheel says it can be tapped to stop, skips stamped categories and picks the last one");
        await p.click("#spin"); await p.waitForTimeout(300);
        const a = await p.evaluate(() => __stamp.S().cur.answer); await p.click(`#qopts .opt[data-i="${a}"]`); await p.waitForTimeout(200);
        const m = await p.evaluate(() => ({ shown: [...document.querySelectorAll("p")].filter((x) => x.offsetParent && /is stamped/.test(x.textContent)).length, before: getComputedStyle(document.querySelector("#qsay"), "::before").content, note: !!document.querySelector("#vxWheelNote").offsetParent }));
        check(m.shown === 1 && m.before === "none" && !m.note, "vx review: Stamps shows the answer message once, without stray marks", JSON.stringify(m));
        // finish the page and check the share grid names each category
        for (let i = 0; i < 14; i++) { if (await p.isVisible("#qnext")) { await p.click("#qnext"); await p.waitForTimeout(300); } if (!(await p.isVisible("#qopts .opt:not([disabled])"))) break; const x = await p.evaluate(() => __stamp.S().cur.answer); await p.click(`#qopts .opt[data-i="${x}"]`); await p.waitForTimeout(200); }
        if (await p.isVisible("#qnext")) { await p.click("#qnext"); await p.waitForTimeout(300); }
        const sh = await p.evaluate(() => ({ text: document.querySelector("#shareText").textContent, cats: Object.keys(__stamp.S().q).map((k) => SX.labels[k]) }));
        check(sh.cats.length === 6 && sh.cats.every((c) => new RegExp("(✅|🟨|❌) " + c + "(  |\\n)").test(sh.text + "  ")), "vx review: the Stamps share grid labels each square", JSON.stringify(sh));
        check(!p.errs.length, "vx review: Stamps, no errors", p.errs.join("; "));
        await ctx.close();
      }
    }

    // ---- vx end ----
  } finally { await b.close(); srv.close(); }
  console.log(`\n${passed} passed, ${failed.length} failed`);
  failed.forEach((f) => console.log("  FAIL " + f));
  process.exit(failed.length ? 1 : 0);
})();
