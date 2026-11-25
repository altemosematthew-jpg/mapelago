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
        check(s.S.r === r && s.S.moveCost === cost && s.cost.startsWith(r === 1 ? `Today: ${cost} points a move; a miss costs 150 and opens no clue.` : `Each move costs ${cost} points`), `country: a new No. ${day} round starts on rules ${r} (moves cost ${cost})`, JSON.stringify([s.S.r, s.S.moveCost, s.cost]));
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
        check(m > 0 && s1.pts === String(1000 - 6 * m + (s1.S.maxTile >= 4 ? Math.min(s1.S.maxTile, 64) - 2 : 0)), "country: each move costs 6 (plus the tile bonus from No. 14)", JSON.stringify([m, s1.pts]));
        await p.evaluate(far); await p.waitForTimeout(1500);
        const s2 = await read(p);
        check(s2.pts === String(+s1.pts - 150), "country: a far missed pin costs 150", s2.pts);
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
        const s = await p.evaluate(() => __lf.S()), want = Math.round((1000 - 2 * 50) * (1 - Math.sqrt((r => r - 50)(s.pins[0].d) / 2450)));
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

    // ---- mx-scoring: the new scoring for both mystery games from No. 14 (review/scoring.md, review/scoring-patch.py) ----
    {
      const G = [["", "dailycity:v2", "city"], ["country.html", "dailycity:country:v1", "country"]];
      const fresh = (k, extra) => Object.assign({ [k]: '{"games":{},"results":{},"seenHelp":true}' }, extra || {});
      const sm = (d) => (d <= 250 ? 50 : d >= 2000 ? 150 : Math.round((50 + (d - 250) / 17.5) / 10) * 10), sb = (m) => (m >= 4 ? Math.min(m, 64) - 2 : 0);
      for (const [f, key, g] of G) {
        // the start number, and the parts of the score
        for (const [day, want] of [[13, 0], [14, 1]]) {
          const { ctx, p } = await page(b, U + f + "#day-" + day, { storage: fresh(key) });
          const s = await p.evaluate(() => __lf.sc.s());
          check((s || 0) === want, `${g} scoring: a new No. ${day} round ${want ? "scores the new way" : "keeps the old scoring"}`, String(s));
          if (day === 14) {
            const r = await p.evaluate(() => [[100, 250, 1000, 1999, 2000, 9000].map(__lf.sc.sm), [2, 4, 16, 64, 128].map(__lf.sc.sb), [1000, 850, 849, 650, 649, 400, 399].map(__lf.sc.stars)]);
            check(JSON.stringify(r) === JSON.stringify([[50, 50, 90, 150, 150, 150], [0, 2, 14, 62, 62], [3, 3, 2, 2, 1, 1, 0]]), `${g} scoring: miss cost by distance, tile bonus, stars`, JSON.stringify(r));
          }
          await ctx.close();
        }
        // a round: moves, a tile bonus, a near miss, then a find; the end card's sum adds up and the share has the stars
        {
          const { ctx, p } = await page(b, U + f + "#day-14", { storage: fresh(key) });
          await p.waitForFunction(() => window.__WORLD);
          const notes = [];
          for (const d of ["up", "left", "down", "right", "up", "left", "down", "right"]) { await p.evaluate((d) => __lf.move(d), d); notes.push(await p.textContent("#live")); }
          const a = await p.evaluate(() => ({ m: __lf.S().swipes, mt: __lf.S().maxTile, pts: +document.querySelector("#score").textContent }));
          check(a.pts === 1000 - 6 * a.m + sb(a.mt), `${g} scoring: points = 1000 - 6 x moves + tile bonus`, JSON.stringify(a));
          check(notes.some((t) => /New clue: .*\. \+8 points for making a 16\./.test(t)) && notes.some((t) => /\+4 points for making an 8\./.test(t)), `${g} scoring: the new-clue note says what the tile earned`, notes.join(" / "));
          const far = await p.evaluate(() => { const h = __lf.home ? __lf.home() : [__lf.P.lon, __lf.P.lat]; return [h[0] + 6, h[1] + 3]; });
          await p.evaluate((x) => __lf.confirmAt(x), far); await p.waitForTimeout(1500);
          const miss = await p.evaluate(() => ({ d: __lf.S().pins[0].d, live: document.querySelector("#live").textContent, pts: +document.querySelector("#score").textContent }));
          check(miss.d > 50 && miss.pts === a.pts - sm(miss.d) && miss.live.includes(`−${sm(miss.d)} points.`), `${g} scoring: a miss ${Math.round(miss.d)} km off costs ${sm(miss.d)} and says so`, JSON.stringify(miss));
          await p.evaluate(() => __lf.confirmAt(__lf.home ? __lf.home() : [__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(3500);
          const e = await p.evaluate(() => ({ score: __lf.S().score, sum: (document.querySelector(".mx-sum") || {}).textContent, grade: (document.querySelector(".mx-grade [aria-hidden]") || {}).textContent, share: document.querySelector("#endBody .share").textContent, link: MXS.beat.upgrade(document.querySelector("#endBody .share").textContent) }));
          const want = a.pts - sm(miss.d), stars = want >= 850 ? 3 : want >= 650 ? 2 : want >= 400 ? 1 : 0;
          check(e.score === want && e.sum && e.sum.endsWith(`= ${want}`) && e.sum.includes(`${a.m} moves × 6`) && e.sum.includes(`+ ${sb(a.mt)} tile bonus`) && e.sum.includes(`1 missed pin (${sm(miss.d)})`), `${g} scoring: the end card's sum adds up (${e.sum})`, JSON.stringify(e));
          const st = "★".repeat(stars) + "☆".repeat(3 - stars);
          check(e.grade === st && e.share.includes(st + " " + want + " points"), `${g} scoring: stars on the end card and in the copied result`, JSON.stringify([e.grade, e.share.split("\n")[1]]));
          check(new RegExp(`#b-m${g === "city" ? "c" : "n"}-14-0-${want}`).test(e.link), `${g} scoring: beat-my-score link still carries the score`, e.link.split("\n").pop());
          check(!p.errs.length, `${g} scoring: no errors`, p.errs.join("; "));
          await ctx.close();
        }
        // a perfect round still scores the most; a lost round's sum adds up too
        {
          const { ctx, p } = await page(b, U + f + "#day-15", { storage: fresh(key) });
          await p.waitForFunction(() => window.__WORLD);
          await p.evaluate(() => __lf.confirmAt(__lf.home ? __lf.home() : [__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(3500);
          const r = await p.evaluate(() => [__lf.S().score, (document.querySelector(".mx-grade [aria-hidden]") || {}).textContent]);
          check(r[0] === 1000 && r[1] === "★★★", `${g} scoring: a find with no moves scores 1000 and three stars`, JSON.stringify(r));
          await ctx.close();
        }
        {
          const { ctx, p } = await page(b, U + f + "#day-16", { storage: fresh(key) });
          await p.waitForFunction(() => window.__WORLD);
          for (const d of ["up", "left", "down"]) await p.evaluate((d) => __lf.move(d), d);
          for (const k of [1, 2, 3]) { await p.evaluate((k) => __lf.confirmAt([((__lf.P.lon + 180 - 25 * k) % 360) - 180, -__lf.P.lat]), k); await p.waitForTimeout(1900); }
          const r = await p.evaluate(() => ({ S: __lf.S(), sum: (document.querySelector(".mx-sum") || {}).textContent }));
          check(r.S.done && !r.S.won && r.sum && /Not found, so × \d+% for your closest pin/.test(r.sum) && r.sum.endsWith(`= ${r.S.score}`), `${g} scoring: a lost round's sum adds up (${r.sum})`, JSON.stringify(r.sum));
          await ctx.close();
        }
      }
      // a move never pays for itself: over 40 days of play the score stays under 1000 after every move
      {
        const ctx = await b.newContext(PHONE), p = await ctx.newPage(); let bad = [], n = 0;
        for (let day = 14; day < 54; day++) {
          await p.goto(`${U}?s=${day}#day-${day}`, { waitUntil: "domcontentloaded" });
          await p.evaluate(() => localStorage.setItem("dailycity:v2", '{"games":{},"results":{},"seenHelp":true}'));
          await p.reload({ waitUntil: "domcontentloaded" }); await p.waitForFunction(() => window.__lf);
          const r = await p.evaluate(() => { const bad = []; for (let i = 0; i < 90; i++) { if (__lf.S().storm) break; let moved = false; for (const d of ["down", "left", "right", "up"]) { const b0 = __lf.S().swipes; __lf.move(d); if (__lf.S().swipes > b0) { moved = true; break; } } if (!moved) break; const pts = +document.querySelector("#score").textContent; if (pts >= 1000) bad.push(pts); } return [bad, __lf.S().swipes]; });
          bad = bad.concat(r[0]); n += r[1];
        }
        check(!bad.length && n > 1000, `scoring: no move ever brings the score back to 1000 (${n} moves over 40 days)`, bad.join());
        await ctx.close();
      }
      // Quick mode keeps its own scoring, with stars and a sum
      {
        const { ctx, p } = await page(b, U + "#day-14", { storage: fresh("dailycity:v2", { "dailycity:mode": "quick" }) });
        await p.waitForFunction(() => window.__WORLD);
        await p.evaluate(() => __lf.confirmAt([((__lf.P.lon + 180) % 360) - 180, -__lf.P.lat])); await p.waitForTimeout(1500);
        const live = await p.textContent("#live");
        await p.evaluate(() => __lf.confirmAt([__lf.P.lon, __lf.P.lat])); await p.waitForTimeout(3500);
        const r = await p.evaluate(() => ({ score: __lf.S().score, sum: (document.querySelector(".mx-sum") || {}).textContent, share: document.querySelector("#endBody .share").textContent }));
        check(r.score === 800 && !/points\./.test(live.replace(/\d+ km/, "")) && r.sum === "1,000 − 1 missed pin × 200 = 800" && r.share.includes("★★☆ Found in 2/5 pins"), "scoring: Quick mode still scores 1000/800/..., with stars and a sum", JSON.stringify([r, live]));
        await ctx.close();
      }
      // the rules page and each game's own explainer describe the new scoring
      {
        const htp = fs.readFileSync(path.join(__dirname, "../how-to-play/index.html"), "utf8"), cj = JSON.parse(fs.readFileSync(path.join(__dirname, "../copy/copy.json"), "utf8"));
        check(/From No\. 14 \(27 November 2026\)/.test(htp) && /adds half its value/.test(htp) && /50 points if it lands within 250 km/.test(htp), "scoring: how-to-play explains the new scoring and when it starts");
        check(["city", "country"].every((g) => /50 to 150 points/.test(cj.games[g].explainer) && cj.games[g].howto.some((x) => /adds half its value/.test(x))), "scoring: both games' copy explains it");
      }
    }
    // ---- end mx-scoring ----

    // ---- mx-country-quick: Quick mode for Mystery country from No. 14 (review/country-quick-patch.py) ----
    {
      const fresh = { "dailycity:country:v1": '{"games":{},"results":{},"seenHelp":true}' };
      {
        const { ctx, p } = await page(b, U + "country.html#day-13", { storage: fresh });
        check(!(await p.isVisible("#mxMode")), "country quick: no Tiles/Quick choice before No. 14");
        await ctx.close();
      }
      {
        const { ctx, p } = await page(b, U + "country.html#day-14", { storage: fresh, ctx: { viewport: { width: 375, height: 667 } } });
        await p.waitForFunction(() => window.__WORLD);
        check(await p.isVisible("#mxMode"), "country quick: the Tiles/Quick choice shows on a fresh No. 14");
        await p.focus("#mxMode [data-m=quick]"); await p.keyboard.press("Enter"); await p.waitForTimeout(200);
        const s0 = await p.evaluate(() => ({ pins: document.querySelector("#pinsText").textContent, board: getComputedStyle(document.querySelector("#board")).display, label: document.querySelector("#nextClue").textContent, clues: document.querySelectorAll("#clues li").length, mode: localStorage.getItem("dailycity:country:mode"), city: localStorage.getItem("dailycity:mode") }));
        check(s0.pins === "5 pins left" && s0.board === "none" && s0.label === "Next clue: after a missed pin" && s0.clues === 1 && s0.mode === "quick" && s0.city === null, "country quick: picked by keyboard; no tiles, one clue, five pins; the city's choice untouched", JSON.stringify(s0));
        await p.evaluate(() => __lf.confirmAt([((__lf.P.lon + 180) % 360) - 180, -__lf.P.lat])); await p.waitForTimeout(1500);
        const s1 = await p.evaluate(() => ({ pts: document.querySelector("#score").textContent, clues: document.querySelectorAll("#clues li").length, live: document.querySelector("#live").textContent }));
        check(s1.pts === "800" && s1.clues === 2 && /Free clue:/.test(s1.live), "country quick: a miss opens the next clue; 800 left", JSON.stringify(s1));
        await p.evaluate(() => __lf.confirmAt(__lf.home())); await p.waitForTimeout(3500);
        const e = await p.evaluate(() => ({ S: __lf.S(), res: JSON.parse(localStorage.getItem("dailycity:country:v1")).results[14], share: document.querySelector("#endBody .share").textContent, big: document.querySelector("#endBody .score b").textContent }));
        check(e.S.score === 800 && e.res.q === 1 && e.big === "2/5" && e.share.includes("quick mode") && e.share.includes("★★☆ Found in 2/5 pins") && /#b-mn-14-1-800/.test(await p.evaluate((t) => MXS.beat.upgrade(t), e.share)), "country quick: found on pin 2 scores 800, saved as Quick, shared as Quick", JSON.stringify(e));
        check(!p.errs.length, "country quick: no errors", p.errs.join("; "));
        await ctx.close();
      }
      {
        const { ctx, p } = await page(b, U + "country.html#day-15", { storage: fresh });
        await p.waitForFunction(() => window.__WORLD);
        await p.keyboard.press("ArrowUp"); await p.keyboard.press("ArrowLeft"); await p.waitForTimeout(200);
        check(!(await p.isVisible("#mxMode")) && (await p.evaluate(() => !__lf.S().r || __lf.S().swipes > 0)), "country quick: once a round has started it can't switch mode");
        await ctx.close();
      }
    }
    // ---- end mx-country-quick ----

    // ---- mx-review: fixes from the review of 0.15.2 (review/review-fixes-patch.py) ----
    {
      const fresh = (k) => ({ [k]: '{"games":{},"results":{},"seenHelp":true}' });
      const today12 = { clock: new Date("2026-11-25T12:00:00") };
      // the rules shown match the round: before No. 14 the round's own rules, from No. 14 the new ones
      for (const [f, key, g] of [["country.html", "dailycity:country:v1", "country"], ["", "dailycity:v2", "city"]]) {
        for (const day of [12, 14]) {
          const { ctx, p } = await page(b, U + f + "#day-" + day, { storage: fresh(key) });
          const r = await p.evaluate(() => ({ note: document.querySelector("#todayRules").hidden ? "" : document.querySelector("#todayRules").textContent, cost: document.querySelector("#costNote").textContent }));
          const ok = day === 14 ? !r.note && !/^Today:/.test(r.cost) : g === "country" ? r.note.startsWith("Today's round, No. 12, plays by the earlier rules: 8 points a move, and a missed pin costs 150 and opens no clue.") && r.cost === "Today: 8 points a move; a miss costs 150 and opens no clue." : r.note.startsWith("Today's round, No. 12, uses the earlier scoring: no tile bonus, and every missed pin costs 150.");
          check(ok, `review: ${g} No. ${day} shows the rules of its own round`, JSON.stringify(r));
          await ctx.close();
        }
      }
      // No. 12 keeps its answer and its rules: a miss costs 150 and opens no clue
      {
        const { ctx, p } = await page(b, U + "country.html#day-12", { storage: fresh("dailycity:country:v1") });
        await p.waitForFunction(() => window.__WORLD);
        const c0 = await p.evaluate(() => document.querySelectorAll("#clues li").length);
        await p.evaluate(() => __lf.confirmAt([((__lf.P.lon + 180) % 360) - 180, -__lf.P.lat])); await p.waitForTimeout(1500);
        const r = await p.evaluate(() => ({ name: __lf.P.city, clues: document.querySelectorAll("#clues li").length, pts: document.querySelector("#score").textContent }));
        check(r.name === "Israel" && r.clues === c0 && r.pts === "850", "review: country No. 12 keeps its answer and old rules (a miss: -150, no clue)", JSON.stringify([c0, r]));
        // the languages clue says its label once, for eyes and for screen readers
        for (let k = 1; k < 3; k++) { await p.evaluate((k) => __lf.confirmAt([((__lf.P.lon + 180 - 25 * k) % 360) - 180, -__lf.P.lat]), k); await p.waitForTimeout(1900); }
        const lang = await p.evaluate(() => [...document.querySelectorAll("#clues .tx")].map((x) => x.textContent).find((t) => /Hebrew/.test(t)));
        check(lang === "Languages: Hebrew and Arabic", "review: the languages clue reads 'Languages: Hebrew and Arabic' once", lang);
        // one name: the share says Mystery country, the header says No. 12, and the link is unchanged
        const sh = await p.evaluate(() => ({ share: document.querySelector("#endBody .share").textContent, num: document.querySelector("#num").textContent }));
        check(sh.share.startsWith("Mystery country No. 12, ") && /mapelago\.com\/country\.html#(c-12-|b-mn-12-)/.test(sh.share) && sh.num === "No. 12" && !/Countries/.test(sh.share), "review: the share and the header say Mystery country / No. 12", JSON.stringify(sh));
        await ctx.close();
      }
      for (const link of ["#c-12-640-2", "#b-mn-12-0-640"]) {
        const { ctx, p } = await page(b, U + "country.html" + link, { storage: fresh("dailycity:country:v1"), ...today12, wait: 900 });
        const t = await p.evaluate(() => document.body.innerText);
        check(/A friend scored 640/.test(t), `review: an old share link still works (${link})`);
        await ctx.close();
      }
      // the next-clue wording is the city's
      {
        const { ctx, p } = await page(b, U + "country.html#day-14", { storage: fresh("dailycity:country:v1") });
        const lines = [await p.textContent("#nextClue")];
        await p.keyboard.press("ArrowUp"); await p.keyboard.press("ArrowLeft"); await p.keyboard.press("ArrowDown");
        lines.push(await p.textContent("#nextClue"), await p.textContent("#coachText"));
        const body = await p.evaluate(() => document.documentElement.innerHTML);
        check(/^Next clue: make an? \d+$/.test(lines[0]) && lines.some((l) => /make an 8/.test(l)) && /Next clue: make an? \d+\./.test(lines[2]) && !/Next clue at|comes at/.test(body), "review: country says 'Next clue: make an 8', like the city", JSON.stringify(lines));
        await ctx.close();
      }
      // Past countries: today's player can play any earlier number, in its own save
      {
        const { ctx, p } = await page(b, U + "country.html", { storage: fresh("dailycity:country:v1"), ...today12, wait: 900 });
        await p.click("#pastCountries"); await p.waitForTimeout(200);
        const list = await p.evaluate(() => [...document.querySelectorAll("#mxPastList a")].map((a) => a.getAttribute("href")));
        check(list.length === 11 && list[0] === "#past-11" && list[10] === "#past-1" && (await p.isVisible("#mxPast")), "review: Past countries lists No. 11 to No. 1", list.join());
        await p.keyboard.press("Escape"); await p.waitForTimeout(100);
        check(!(await p.isVisible("#mxPast")), "review: the Past countries list closes with Escape");
        await p.evaluate(() => (location.hash = "#past-5")); await p.waitForTimeout(1200); await p.waitForFunction(() => window.__WORLD);
        const p5 = await ctx.newPage(); await p5.goto(U + "country.html#day-5", { waitUntil: "domcontentloaded" }); await p5.waitForFunction(() => window.__lf);
        const g5 = await p5.evaluate(() => __lf.P.city); await p5.close();
        const a = await p.evaluate(() => ({ num: document.querySelector("#num").textContent, ban: !document.querySelector("#arcBan").hidden, name: __lf.P.city }));
        check(a.num === "No. 5 · archive" && a.ban && a.name === g5, "review: #past-5 plays No. 5, marked as the archive", JSON.stringify([a, g5]));
        await p.evaluate(() => __lf.confirmAt(__lf.home())); await p.waitForTimeout(3500);
        const s = await p.evaluate(() => ({ main: JSON.parse(localStorage.getItem("dailycity:country:v1")), arc: JSON.parse(localStorage.getItem("dailycity:country:archive:v1")), share: document.querySelector("#endBody .share").textContent }));
        check(!Object.keys(s.main.results).length && !s.main.games[5] && s.arc.results[5] && s.arc.results[5].won && s.share.startsWith("Mystery country No. 5 (archive)"), "review: an archive round saves apart and never touches results or streaks", JSON.stringify([Object.keys(s.main.results), s.arc && s.arc.results, s.share.split("\n")[0]]));
        check(!p.errs.length, "review: Past countries, no errors", p.errs.join("; "));
        await ctx.close();
      }
    }
    // ---- end mx-review ----

    // ---- mx-teachers: the For teachers page (teachers/index.html, review/teachers-menu-patch.py) ----
    {
      for (const width of [375, 1440]) {
        const { ctx, p } = await page(b, U + "teachers/", { ctx: { viewport: { width, height: 900 }, isMobile: width < 500, hasTouch: width < 500 }, wait: 800 });
        const r = await p.evaluate(() => ({ h1: document.querySelector("h1").textContent, over: document.documentElement.scrollWidth > innerWidth + 1, links: [...document.querySelectorAll("main a")].map((a) => a.getAttribute("href")) }));
        check(!p.errs.length && r.h1 === "Mapelago for teachers" && !r.over, `teachers page loads cleanly at ${width} px, no sideways scroll`, p.errs.join("; ") + JSON.stringify(r.over));
        check(["../how-to-play/", "../privacy/"].every((h) => r.links.includes(h)), `teachers page links to How to play and Privacy (${width} px)`);
        await ctx.close();
      }
      const t = fs.readFileSync(path.join(__dirname, "../teachers/index.html"), "utf8").replace(/<[^>]+>/g, " ");
      check(["no accounts", "no ads", "no cookies", "Nothing to install", "same puzzles", "projector", "student devices", "offline", "Bigger country?", "Crossings", "Logbook", "Scale", "Borders", "Capitals", "History", "Place"].every((w) => t.includes(w)), "teachers page says what it promised");
      const pages = ["index.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "history.html", "hints.html", "offline.html", "about/index.html", "privacy/index.html", "how-to-play/index.html", "games/index.html", "teachers/index.html"];
      const missing = pages.filter((f) => { const s = fs.readFileSync(path.join(__dirname, "..", f), "utf8"); return (s.match(/href="(?:\.\.?\/)?teachers\/"[^>]*>For teachers<\/a>/g) || []).length !== 1; });
      check(!missing.length, "every page's menu has For teachers, once", missing.join());
      check(/<loc>https:\/\/mapelago\.com\/teachers\/<\/loc>/.test(fs.readFileSync(path.join(__dirname, "../sitemap.xml"), "utf8")), "sitemap lists the teachers page");
    }
    // ---- end mx-teachers ----

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
