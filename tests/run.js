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
        check(lines.length === 4 && /^Mapelago Bigger country\? No\. 12 \u{1F422} 9\/10$/u.test(lines[0]) && lines[1] === "✅".repeat(5) + "❌" + "✅".repeat(4) && lines[2] === "Best run: 5"
          && /^Can you beat 9\? mapelago\.com\/bigger-country\.html#b-bn-12-0-9$/.test(lines[3]) && end.best === "5" && end.streak === 1, `bigcountry ${size}: share text and beat-my-score link`, JSON.stringify([end.share, end.best, end.streak]));
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
      // close pairs race before the verdict, and a muted player hears nothing (No. 14, eight right so far)
      const right14 = await (async () => { const { ctx, p } = await page(b, U + "bigger-country.html#day-14", { storage: fresh }); const r = await p.evaluate(() => __big.S().pairs.map((x) => (x[0].pop > x[1].pop ? 0 : 1))); await ctx.close(); return r; })();
      for (const muted of [true, false]) {
        const { ctx, p } = await page(b, U + "bigger-country.html#day-14", { storage: { [BC]: JSON.stringify({ results: {}, game: { n: 14, picks: right14.slice(0, 8) } }), "dailycity:sound": muted ? "off" : "on" } });
        await p.evaluate(() => { window.__ac = 0; const A = window.AudioContext; window.AudioContext = function () { window.__ac++; return new A(); }; });
        await p.waitForFunction(() => window.MX && MX.play); await p.waitForTimeout(300);
        check(/^(Close call|Very close)$/.test(await p.textContent("#bcHeat")) && (await p.isVisible("#bcHeat")) && (await p.evaluate(() => document.querySelectorAll("#dots li.close").length)) >= 2, `bigcountry: round 9 is flagged as a close call`, await p.textContent("#bcHeat"));
        await p.click("#pick" + right14[8]); await p.waitForTimeout(300);
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
      // "Play more": endless practice in Bigger country? and Bigger city?, which never touches the daily
      for (const [file, key, id] of [["bigger-country.html", "dailycity:bigcountry:v1", "bigcountry"], ["bigger.html", "dailycity:bigger:v1", "bigger"]]) {
        const daily = JSON.stringify({ results: { 11: { score: 6, picks: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1] }, 12: { score: 7, picks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } }, game: null });
        // not offered before the daily round is finished
        {
          const { ctx, p } = await page(b, U + file + "#day-12", { storage: { [key]: '{"results":{},"game":null}' }, clock: new Date("2026-11-25T12:00:00") });
          check(!(await p.isVisible("#mxprGo")) && !(await p.isVisible("#mxpr")), `${id} practice: not offered until today's ten are done`);
          await ctx.close();
        }
        const { ctx, p } = await page(b, U + file + "#day-12", { storage: { [key]: daily }, clock: new Date("2026-11-25T12:00:00"), ctx: { viewport: { width: 375, height: 667 } }, wait: 800 });
        const snap = () => p.evaluate((k) => ({ keys: Object.keys(localStorage).sort(), save: localStorage.getItem(k), share: document.querySelector("#shareText").textContent,
          info: JSON.stringify(MXS.info().map((s) => [s.game.id, s.cur, s.best, s.played, s.doneToday])) }), key);
        const before = await snap();
        check(await p.isVisible("#mxprGo") && /Practice/.test(await p.textContent(".mxpr-cta")), `${id} practice: "Play more" on the end card, labelled as practice`);
        await p.tap("#mxprGo"); await p.waitForTimeout(400);
        check(await p.isVisible("#mxpr") && !(await p.isVisible("#done")) && (await p.textContent(".mxpr-tag")) === "Practice" && /Doesn't count toward today's score, your streaks or your stats/.test(await p.textContent("#mxpr")), `${id} practice: opens, clearly labelled`);
        // play a run of 11 right, then miss: the run, the best and the closeness follow
        const pairs = [];
        for (let i = 0; i < 12; i++) {
          await p.waitForTimeout(330);
          const two = await p.evaluate(() => [...document.querySelectorAll("#mxprCards .pick")].map((c) => { const n = c.querySelector("b").textContent, w = c.querySelector(".where").textContent; return MxPractice.pool.find((x) => x.name === n && x.country === w).pop; }));
          const big = two[0] > two[1] ? 0 : 1;
          pairs.push(Math.max(...two) / Math.min(...two));
          await p.tap("#mxpr" + (i < 11 ? big : 1 - big));
          await p.waitForSelector("#mxprNext", { state: "visible", timeout: 4000 });
          const r = await p.evaluate(() => ({ run: document.querySelector("#mxprRun b").textContent, best: document.querySelector("#mxprBest").textContent, verdict: document.querySelector("#mxprReveal .bcverdict").textContent,
            shapes: document.querySelectorAll("#mxprReveal .bcs .sh").length, bars: document.querySelectorAll("#mxprReveal .mxpr-bars i").length, ratio: document.querySelector("#mxprReveal .bcratio").textContent }));
          if (i === 0) check(id === "bigcountry" ? r.shapes === 2 : r.bars === 2, `${id} practice: the reveal shows ${id === "bigcountry" ? "both countries at true scale" : "both populations to scale"}`, JSON.stringify(r));
          if (i === 0) check(/^\S.* (is|has) (\d[\d,.]*× the (size|people) of|\d+% (bigger|more people) than) \S/.test(r.ratio), `${id} practice: says how much bigger`, r.ratio);
          if (i < 11) { if (r.run !== String(i + 1)) check(false, `${id} practice: run counts up`, JSON.stringify([i, r])); }
          else check(r.run === "0" && r.best === "11" && r.verdict === "Not this time. Run over at 11.", `${id} practice: a miss ends the run and keeps the best (11)`, JSON.stringify(r));
          await p.waitForTimeout(300); await p.tap("#mxprNext"); await p.waitForTimeout(80);
        }
        check(pairs[0] >= 4 && pairs.slice(9, 12).every((x) => x < 2) && pairs.every((x) => x >= 1.15), `${id} practice: pairs get closer as the run goes on`, pairs.map((x) => x.toFixed(2)).join(" "));
        check((await p.textContent("#mxprN")) === "Pair 1 of this run" && (await p.textContent("#mxprRun b")) === "0", `${id} practice: a new run starts after a miss`);
        await p.tap("#mxprBack"); await p.waitForTimeout(300);
        const after = await snap();
        check(after.save === before.save && after.share === before.share && after.info === before.info, `${id} practice: today's result, share text, streaks and stats are untouched`, JSON.stringify([before.info, after.info]));
        check(JSON.stringify(after.keys) === JSON.stringify(before.keys.concat(`dailycity:${id}:practice`).sort()) && (await p.evaluate((id) => localStorage.getItem(`dailycity:${id}:practice`), id)) === "[11]", `${id} practice: only its own best run is saved`, JSON.stringify(after.keys));
        check(await p.isVisible("#done") && (await p.textContent("#mxprGoBest")) === "Your best practice run: 11 in a row." && (await p.evaluate(() => document.activeElement.id)) === "mxprGo", `${id} practice: back to today's result`);
        check(!p.errs.length, `${id} practice: no errors`, p.errs.join("; "));
        await ctx.close();
        // by keyboard at desktop size; the best run is remembered; the daily schedule never moves
        const k = await page(b, U + file + "#day-12", { desktop: true, storage: { [key]: daily, [`dailycity:${id}:practice`]: "[11]" }, clock: new Date("2026-11-25T12:00:00") });
        const pairs12 = await k.p.evaluate(() => JSON.stringify(__big.S().pairs.map((x) => x.map((c) => c.name))));
        await k.p.focus("#mxprGo"); await k.p.keyboard.press("Enter"); await k.p.waitForTimeout(400);
        check((await k.p.evaluate(() => document.activeElement.id)) === "mxpr0" && (await k.p.textContent("#mxprBest")) === "11", `${id} practice: keyboard opens it on the first card, best run remembered`);
        await k.p.keyboard.press("Enter"); await k.p.waitForSelector("#mxprNext", { state: "visible", timeout: 4000 });
        check((await k.p.evaluate(() => document.activeElement.id)) === "mxprNext", `${id} practice: keyboard play moves focus to Next`);
        await k.p.waitForTimeout(300); await k.p.keyboard.press("Enter"); await k.p.waitForTimeout(200);
        check((await k.p.evaluate(() => document.activeElement.id)) === "mxpr0" && (await k.p.evaluate(() => JSON.stringify(__big.S().pairs.map((x) => x.map((c) => c.name))))) === pairs12, `${id} practice: on to the next pair; today's pairs unchanged`);
        check(!k.p.errs.length, `${id} practice desktop: no errors`, k.p.errs.join("; "));
        await k.ctx.close();
      }
      check(fs.readFileSync(path.join(__dirname, "../bigger.html"), "utf8").match(/<script>\n\/\* bigcountry-practice:[\s\S]*?<\/script>/)[0] === fs.readFileSync(path.join(__dirname, "../bigger-country.html"), "utf8").match(/<script>\n\/\* bigcountry-practice:[\s\S]*?<\/script>/)[0], "practice: the same code in both games");
    // ---- the review fixes: official areas, close last pairs, waiting for the tap, your pick, stats, checked city figures ----
    {
      const fresh = { "dailycity:bigcountry:v1": '{"results":{},"game":null}' };
      {
        // Bigger country?: from No. 14 every area is the Factbook's total area, Morocco is out, the last two pairs are within 20%
        const seen = { wrong: [], wide: [], morocco: 0, n: 0 };
        const q = await page(b, U + "bigger-country.html#day-14", { storage: fresh });
        for (let d = 14; d <= 44; d++) {
          await q.p.goto(U + "bigger-country.html?d=" + d + "#day-" + d, { waitUntil: "domcontentloaded" }); await q.p.waitForFunction(() => window.__big);
          const x = await q.p.evaluate(() => { const P = __big.S().pairs, A = MxBC.areas; return { bad: P.flat().filter((c) => A[c.cid] !== c.pop).map((c) => c.name), morocco: P.flat().some((c) => c.name === "Morocco"), last: P.slice(8).map((t) => Math.max(t[0].pop, t[1].pop) / Math.min(t[0].pop, t[1].pop)) }; });
          seen.wrong.push(...x.bad); if (x.morocco) seen.morocco++; if (x.last.some((v) => v > 1.2 || v < 1.04)) seen.wide.push(d + ":" + x.last.map((v) => v.toFixed(2))); seen.n++;
        }
        check(!seen.wrong.length && !seen.morocco, "bigcountry: from No. 14 every area is the official total (CIA World Factbook), Morocco left out", JSON.stringify(seen.wrong.slice(0, 5)));
        check(!seen.wide.length && seen.n === 31, "bigcountry: from No. 14 the last two pairs are within 20% (Nos. 14 to 44)", seen.wide.join(" "));
        await q.p.goto(U + "bigger-country.html?d=12#day-12", { waitUntil: "domcontentloaded" }); await q.p.waitForFunction(() => window.__big);
        check((await q.p.evaluate(() => __big.S().pairs[0][0].pop)) === 2322794, "bigcountry: No. 12 keeps the figures it was played with");
        check(!q.p.errs.length, "bigcountry official areas: no errors", q.p.errs.join("; "));
        await q.ctx.close();
      }
      {
        // the reveal waits for the tap, and the next pair takes the focus; the share line about close pairs is true
        const { ctx, p } = await page(b, U + "bigger-country.html#day-14", { storage: fresh, clock: new Date("2026-11-27T12:00:00"), ctx: { viewport: { width: 375, height: 667 } } });
        await p.waitForTimeout(300); await p.tap("#pick0"); await p.waitForSelector("#bcNext", { state: "visible" });
        await p.waitForTimeout(5000);
        check(await p.isVisible("#bcNext") && (await p.evaluate(() => !document.querySelector("#bcNext i"))), "bigcountry: the reveal stays until the player taps Next");
        // the "Same scale" label has a strip of its own: no shape reaches under it (Haiti v Gabon put Gabon there)
        const tops = await p.evaluate(() => {
          const s = document.querySelector("#bcReveal .bcs"); return [...s.querySelectorAll(".sh")].map((g) => g.getBBox().y); });
        check(tops.every((y) => y >= 20), "bigcountry: shapes stay clear of the Same scale label", JSON.stringify(tops));
        await p.tap("#bcNext"); await p.waitForTimeout(200);
        check((await p.evaluate(() => document.activeElement.id)) === "pick0" && (await p.textContent("#bcRound")) === "Round 2 of 10", "bigcountry: after Next, focus is on the new pair");
        for (let i = 1; i < 10; i++) { await p.waitForTimeout(320); await p.tap("#pick1"); await p.waitForSelector("#bcNext", { state: "visible" }); await p.waitForTimeout(320); await p.tap("#bcNext"); }
        await p.waitForTimeout(500);
        const e = await p.evaluate(() => ({ last: document.querySelector("#shareText").textContent.split("\n").pop(), picks: [...document.querySelectorAll("#recap li")].map((li) => li.querySelectorAll(".mxpick").length), save: JSON.parse(localStorage.getItem("dailycity:bigcountry:v1")).results[14].picks }));
        check(/^The last pairs are close\./.test(e.last), "bigcountry: \"The last pairs are close\" when they were", e.last);
        check(e.picks.length === 10 && e.picks.every((n) => n === 1), "bigcountry: the result list marks your own pick in every pair", JSON.stringify(e.picks));
        const mine = await p.evaluate(() => [...document.querySelectorAll("#recap li")].map((li) => li.querySelector(".mxpick").parentElement.querySelector("b") ? 1 : 0));
        const names = await p.evaluate(() => [...document.querySelectorAll("#recap li")].map((li) => { const t = li.innerText; return t.split("\n").find((l) => /your pick/.test(l)).split(",")[0]; }));
        const pairs = await p.evaluate(() => __big.S().pairs.map((x) => x.map((c) => c.name)));
        check(names.every((n, i) => n === pairs[i][e.save[i]]), "bigcountry: the marked pick is the country you tapped", JSON.stringify(names));
        check(!p.errs.length, "bigcountry wait for the tap: no errors", p.errs.join("; "));
        await ctx.close();
      }
      // stats panels: played, average, streak, best streak and the spread, from the save
      for (const [file, key, id] of [["bigger-country.html", "dailycity:bigcountry:v1", "bigcountry"], ["bigger.html", "dailycity:bigger:v1", "bigger"]]) {
        const save = { results: { 9: { score: 10, picks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, 10: { score: 7, picks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, 11: { score: 8, picks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } }, game: null };
        const { ctx, p } = await page(b, U + file + "#day-11", { storage: { [key]: JSON.stringify(save) }, clock: new Date("2026-11-24T12:00:00"), wait: 900 });
        const s = await p.evaluate(() => ({ nums: [...document.querySelectorAll("#mxStats .stats b")].map((x) => x.textContent), rows: [...document.querySelectorAll("#mxStats .hrow")].map((r) => r.firstChild.textContent + "=" + r.querySelector(".hbar").lastChild.textContent), title: document.querySelector("#mxStatsH").textContent }));
        check(s.title === "Your stats" && JSON.stringify(s.nums) === '["3","8.3","3","3"]', `${id}: stats panel (played 3, average 8.3, streak 3, best 3)`, JSON.stringify(s));
        check(s.rows.join(" ") === "10/10=1 9/10=0 8/10=1 7/10=1 6/10=0 5/10=0", `${id}: score spread`, s.rows.join(" "));
        check(!p.errs.length, `${id} stats: no errors`, p.errs.join("; "));
        await ctx.close();
      }
      {
        // Bigger city?: checked figures, real cities with English names, no pair within 10%, from No. 14
        const { ctx, p } = await page(b, U + "bigger.html#day-14", { storage: { "dailycity:bigger:v1": '{"results":{},"game":null}' } });
        const pool = await p.evaluate(() => MxCity.pool.map((c) => [c.name, c.country, c.pop, c.note || ""]));
        const by = (n, c) => pool.find((x) => x[0] === n && (!c || x[1] === c));
        const gone = ["Göteborg", "Gustavo Adolfo Madero", "Brooklyn", "Kowloon", "Dadonghai", "Cape Town", "Durban", "Brussels", "Asmara", "Mogadishu", "Allahābād", "Nur-Sultan", "Abu Dhabi", "Çankaya", "Iztapalapa", "Soweto", "Yono"];
        check(pool.length === 671 && gone.every((n) => !by(n)), "bigger: from No. 14, 671 cities; districts, unchecked places and old names are gone", JSON.stringify(gone.filter((n) => by(n))));
        check(JSON.stringify(by("Gothenburg")) === '["Gothenburg","Sweden",' + JSON.stringify(by("Gothenburg")[2]) + ',""]' && by("Prayagraj")[2] === 1112544 && by("Astana")[2] === 1638233 && by("Pimpri-Chinchwad") && by("Belagavi") && by("Tanta") && by("Oujda") && by("Nishinomiya"),
          "bigger: renamed cities and common English names (Gothenburg, Prayagraj, Astana, Belagavi, Pimpri-Chinchwad, Tanta...)");
        const old = ["Homyel'", "Goyang-si", "Bucheon-si", "Seongnam-si", "Uijeongbu-si", "Ajman City", "Changshu City", "Wenshan City", "Al Jubayl", "Nizhniy Novgorod", "Naberezhnyye Chelny"];
        check(old.every((n) => !by(n)) && ["Gomel", "Goyang", "Bucheon", "Seongnam", "Uijeongbu", "Ajman", "Changshu", "Wenshan", "Jubail", "Nizhny Novgorod", "Naberezhnye Chelny"].every((n) => by(n)) && pool.every((c) => !/'$|-si$/.test(c[0])),
          "bigger: English names, not transliterations (Gomel, Goyang, Nizhny Novgorod...)", JSON.stringify(old.filter((n) => by(n))));
        check(by("Kathmandu")[2] === 845767 && by("Tegucigalpa")[2] === 1199136 && by("Beijing")[3] === "2020" && by("Buenos Aires")[3] === "city proper, 2022" && by("Tokyo")[3] === "23 wards, 2025",
          "bigger: checked figures with their year, and the unit where it matters", JSON.stringify([by("Kathmandu"), by("Buenos Aires"), by("Tokyo")]));
        const bad = [];
        for (let d = 14; d <= 44; d++) {
          await p.goto(U + "bigger.html?d=" + d + "#day-" + d, { waitUntil: "domcontentloaded" }); await p.waitForFunction(() => window.__big);
          const x = await p.evaluate(() => __big.S().pairs.map((t) => [t[0].name, t[1].name, Math.max(t[0].pop, t[1].pop) / Math.min(t[0].pop, t[1].pop)]));
          x.forEach((t) => { if (t[2] < 1.1 || !by(t[0]) || !by(t[1])) bad.push(d + ":" + t.join("/")); });
        }
        check(!bad.length, "bigger: Nos. 14 to 44 deal only checked cities, never two within 10%", bad.slice(0, 5).join(" "));
        await p.goto(U + "bigger.html?d=12#day-12", { waitUntil: "domcontentloaded" }); await p.waitForFunction(() => window.__big);
        check((await p.evaluate(() => __big.S().pairs[9].map((c) => c.name + " " + c.pop).join(" | "))) === "Kathmandu 1442271 | Tegucigalpa 850848", "bigger: No. 12 stays as played (Kathmandu v Tegucigalpa)");
        check(!p.errs.length, "bigger data: no errors", p.errs.join("; "));
        await ctx.close();
        // the reveal and the list give the year; the list marks your pick
        const k = await page(b, U + "bigger.html#day-14", { storage: { "dailycity:bigger:v1": '{"results":{},"game":null}' }, clock: new Date("2026-11-27T12:00:00") });
        await k.p.waitForTimeout(300); await k.p.click("#pick0"); await k.p.waitForTimeout(300);
        const shown = await k.p.evaluate(() => [...document.querySelectorAll(".pick .pop span")].map((x) => x.textContent));
        check(shown.length === 2 && shown.every((t) => / people( \((.+, )?\d{4}\))?$/.test(t)) && shown.some((t) => /\(\d{4}\)|, \d{4}\)/.test(t)), "bigger: the reveal gives each checked figure's year", JSON.stringify(shown));
        for (let i = 1; i < 10; i++) { await k.p.waitForTimeout(2000); await k.p.click("#pick1"); }
        await k.p.waitForTimeout(2500);
        const e = await k.p.evaluate(() => ({ marks: [...document.querySelectorAll("#recap li")].map((li) => li.querySelectorAll(".mxpick").length), share: document.querySelector("#shareText").textContent }));
        check(e.marks.length === 10 && e.marks.every((n) => n === 1), "bigger: the result list marks your own pick in every pair", JSON.stringify(e.marks));
        check(!k.p.errs.length, "bigger reveal: no errors", k.p.errs.join("; "));
        await k.ctx.close();
      }
    }
    // ---- end review fixes ----
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
  } finally { await b.close(); srv.close(); }
  console.log(`\n${passed} passed, ${failed.length} failed`);
  failed.forEach((f) => console.log("  FAIL " + f));
  process.exit(failed.length ? 1 : 0);
})();
