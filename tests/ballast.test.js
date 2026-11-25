// Ballast checks, run from run.js. They use the page's localhost-only hook, window.__ballast.
module.exports = async function ({ b, U, page, check }) {
  const SEEN = { "dailycity:ballast:v1": '{"tut":1}' };
  // play whatever is on screen with a plain bot until the result screen shows (levels restart on a timer, so poll)
  const playOut = async (p, opts = {}) => {
    for (let guard = 0; guard < 400; guard++) {
      const st = await p.evaluate((wrong) => {
        const B = __ballast; if (!document.querySelector("#done").hidden) return "done";
        if (B.state() !== "aim") return "wait";
        B.answer(wrong ? "ZZ" : B.L().list[B.S().i]); B.flat(); B.drop(); B.settle(); return "ok";
      }, !!opts.wrong);
      if (st === "done") return true;
      if (st === "wait") await p.waitForTimeout(150);
    }
    return false;
  };
  // outlines, true scale, the generator
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { storage: SEEN, wait: 900 });
    const r = await p.evaluate(() => {
      const S = window.MX_BALLAST, by = Object.fromEntries(S.map((s) => [s.cc, s])), B = __ballast;
      const g = (seed, n, a) => { const l = B.gen(seed, n, a); return [l.list.join(","), l.lineKm, l.deck, l.swell, l.wind, l.name, l.region].join("|"); };
      const lv = [1, 3, 6, 9, 12].map((n) => B.gen(20, n, 0));
      const regs = new Set([1, 2, 3, 4, 5, 6].map((n) => B.gen(20, n, 0).region));
      const ids = new Set(B.LEVELS.map((l) => l.id)), regions = {}; B.LEVELS.forEach((l) => (regions[l.region] = (regions[l.region] || 0) + 1));
      return { n: S.length, small: S.filter((s) => s.p.length < 4).length, au: by.AU.a, ratio: by.RU.a / by.FR.a,
        same: g(20, 4, 0) === g(20, 4, 0), day: g(20, 4, 0) !== g(21, 4, 0), retry: g(20, 4, 0) !== g(20, 4, 1),
        counts: lv.map((l) => l.list.length), swell: lv.map((l) => l.swell), wind: lv.map((l) => l.wind), names: lv.map((l) => l.name), regs: regs.size,
        levels: B.LEVELS.length, ids: ids.size, regions, unknown: B.LEVELS.flatMap((l) => l.list).concat(B.TUTORIAL.flatMap((l) => l.list)).filter((cc) => !by[cc]), tut: B.TUTORIAL.length };
    });
    check(r.n === 193 && r.small === 0 && r.au > 7e6, "ballast: 193 country outlines, Australia is the continent (not Ashmore)", JSON.stringify([r.n, r.small, r.au]));
    check(r.ratio > 25 && r.ratio < 36, "ballast: sizes are in true proportion (Russia is about 30 Frances)", String(r.ratio));
    check(r.same && r.day && r.retry, "ballast generator: the same seed and level give the same cargo; another day or a retry gives another");
    const up = (a) => a.every((x, i) => !i || x >= a[i - 1]);
    check(up(r.counts) && r.counts[0] < r.counts[4] && up(r.swell) && up(r.wind) && r.swell[0] === 0 && r.wind[4] > 0 && r.names[0] === "pick" && r.names[4] === "type" && r.regs >= 5, "ballast generator: levels get harder (more pieces, swell, wind, typed names) and change region", JSON.stringify(r));
    check(r.levels === 30 && r.ids === 30 && Object.keys(r.regions).length === 6 && !r.unknown.length && r.tut === 5, "ballast: thirty voyages in six regions, five tutorial levels, every country known");
    await ctx.close();
  }
  // first visit: the tutorial (five one-screen levels), then the daily; it can be skipped; it never comes back
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { wait: 900 });
    const t0 = await p.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); return [__ballast.run().mode, document.querySelector("#tip").textContent.length > 20, r("#dropBtn").bottom <= innerHeight, document.querySelector("#nameBox").hidden]; });
    check(t0[0] === "tut" && t0[1] && t0[2] && t0[3], "ballast: a first visit starts the tutorial, with a tip, on one screen", JSON.stringify(t0));
    let seen = new Set();
    for (let g = 0; g < 200; g++) {
      const st = await p.evaluate(() => { const B = __ballast, r = B.run(); if (!r || r.mode !== "tut") return ["out", r && r.mode]; if (B.state() !== "aim") return ["wait"]; const id = B.L().id; if (B.L().name !== "none") B.answer(B.L().list[B.S().i]); B.flat(); B.drop(); B.settle(); return ["ok", id]; });
      if (st[0] === "out") { seen.mode = st[1]; break; } if (st[0] === "ok") seen.add(st[1]); else await p.waitForTimeout(150);
    }
    check(seen.size === 5 && seen.mode === "daily", "ballast: the five tutorial levels lead into today's Daily Ballast", JSON.stringify([[...seen], seen.mode]));
    await p.reload(); await p.waitForTimeout(700);
    check((await p.evaluate(() => __ballast.run().mode)) === "daily", "ballast: the tutorial isn't shown again");
    await ctx.close();
    const s = await page(b, U + "ballast.html#day-20", { wait: 900 });
    await s.p.click("#skipTut"); await s.p.waitForTimeout(300);
    check((await s.p.evaluate(() => __ballast.run().mode)) === "daily", "ballast: the tutorial can be skipped");
    await s.ctx.close();
  }
  // a full daily run on phone and desktop: touch or mouse, and keys; lives; result; share; streak; reload
  for (const desktop of [false, true]) {
    const tag = desktop ? "desktop" : "phone";
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { desktop, storage: SEEN, wait: 900 });
    const fit = await p.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); return [r("#nameBox").top >= 0, r("#dropBtn").bottom <= innerHeight, r("#sea").width > 250, /♥♥♥/.test(document.querySelector("#lvlMeta").textContent), /Level 1/.test(document.querySelector("#lvlTitle").textContent)]; });
    check(fit.every(Boolean), `ballast ${tag}: level 1, three lives, and the names, deck and Drop on one screen`, JSON.stringify(fit));
    // drag (touch or mouse) moves the piece; a tap turns it; keys move, turn and drop
    const box = await p.locator("#sea").boundingBox();
    const before = await p.evaluate(() => { const B = __ballast; return B.hover(); });
    await p.mouse.move(box.x + box.width / 2, box.y + 60); await p.mouse.down(); await p.mouse.move(box.x + box.width / 2 + 50, box.y + 60, { steps: 4 }); await p.mouse.up();
    const dragged = await p.evaluate(() => __ballast.hover());
    if (desktop) await p.mouse.click(box.x + 40, box.y + 40); else await p.touchscreen.tap(box.x + 40, box.y + 40);
    const turned = await p.evaluate(() => __ballast.hover());
    await p.keyboard.press("ArrowLeft"); await p.keyboard.press("e");
    const keyed = await p.evaluate(() => __ballast.hover());
    check(dragged[0] > before[0] + 20 && turned[1] !== dragged[1] && keyed[0] < turned[0] && keyed[1] !== turned[1], `ballast ${tag}: drag moves, a tap turns, arrow keys and E work`, JSON.stringify([before, dragged, turned, keyed]));
    await p.click("#nameOpts .opt >> nth=0");
    check(/Right|It's/.test(await p.textContent("#nameSay")), `ballast ${tag}: tapping a name choice answers`);
    await p.keyboard.press(" ");
    await p.waitForFunction(() => __ballast.state() !== "fall", null, { timeout: 20000 });
    check((await p.evaluate(() => __ballast.pieces().length)) === 1, `ballast ${tag}: Space drops the piece`);
    // reload mid-run: the run carries on from its level with its lives
    if (!desktop) {
      await p.evaluate(() => { const B = __ballast; while (B.state() === "aim") { B.answer(B.L().list[B.S().i]); B.flat(); B.drop(); B.settle(); } });
      await p.waitForFunction(() => __ballast.run() && __ballast.run().lvl >= 2 && __ballast.state() === "aim", null, { timeout: 20000 });
      const mid = await p.evaluate(() => [__ballast.run().lvl, __ballast.run().lives]);
      await p.reload(); await p.waitForTimeout(800);
      const back = await p.evaluate(() => [__ballast.run().lvl, __ballast.run().lives]);
      check(JSON.stringify(mid) === JSON.stringify(back), "ballast: a daily run in progress survives a reload", JSON.stringify([mid, back]));
    }
    check(await playOut(p), `ballast ${tag}: a full daily run plays to its result`);
    const r = await p.evaluate(() => {
      const names = window.MX_BALLAST.map((s) => s.n), share = document.querySelector("#shareText").textContent, sv = JSON.parse(localStorage.getItem("dailycity:ballast:v1"));
      return { share, leak: names.filter((n) => share.includes(n)), res: sv.results[20], stats: sv.stats, run: sv.run, info: MXS.info().find((s) => s.game.id === "ballast"), title: document.querySelector("#doneTitle").textContent };
    });
    check(r.res && r.res.lvl >= 1 && r.res.score === r.res.lvl * 100 + r.res.named * 10 && (r.res.marks.match(/\u{1F7E5}/gu) || []).length === 3 && !r.run, `ballast ${tag}: three failed loads end the run; score = 100 a level + 10 a name`, JSON.stringify(r.res));
    check(/^Mapelago Ballast No\. 20 \u{1F422} [\d,]+ points\n/u.test(r.share) && /Cleared \d+ level/.test(r.share) && !r.leak.length && /#b-bl-20-0-\d+$/.test(r.share.trim()), "ballast: the share shows the levels cleared and squares, has a beat-my-score link, and names no country", r.share);
    check(r.info && r.info.played === 1 && r.stats.best === r.res.lvl && r.stats.runs === 1, "ballast: the daily counts in Your streaks; personal best and runs are kept", JSON.stringify(r.stats));
    await p.reload(); await p.waitForTimeout(700);
    const home = await p.evaluate(() => ({ chart: !document.querySelector("#chart").hidden, btn: document.querySelector("#dailyBtn").disabled, note: document.querySelector("#dailyNote").textContent, share: document.querySelector("#homeShareText").textContent, best: JSON.parse(localStorage.getItem("dailycity:ballast:v1")).stats.best }));
    check(home.chart && home.btn && /Your best: level \d+/.test(home.note) && /Ballast No\. 20/.test(home.share) && home.best === r.res.lvl, "ballast: after a reload the day's result, share and personal best are still there, and the daily can't be replayed", JSON.stringify(home));
    // endless practice: plays, ends, shows a result, changes nothing about the daily
    await p.click("#practiceBtn"); await p.waitForTimeout(300);
    check(await playOut(p, { wrong: true }), `ballast ${tag}: a practice run plays to its result`);
    const pr = await p.evaluate(() => ({ title: document.querySelector("#doneTitle").textContent, share: document.querySelector("#shareText").hidden, sv: JSON.parse(localStorage.getItem("dailycity:ballast:v1")) }));
    check(/Practice over/.test(pr.title) && pr.share && Object.keys(pr.sv.results).length === 1 && pr.sv.stats.runs === 1 && pr.sv.stats.bestPractice >= 0, "ballast: practice shows its own result and never counts for the daily or the streak", JSON.stringify(pr.sv.stats));
    check(!p.errs.length, `ballast ${tag}: no console errors`, p.errs.join("; "));
    await ctx.close();
  }
  // a voyage finishes with stars, which survive a reload; the plain bot clears each region's first voyage
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { storage: SEEN, wait: 900 });
    const r = await p.evaluate(() => {
      const B = __ballast, out = {};
      B.LEVELS.forEach((lv, idx) => { if (!/1$/.test(lv.id)) return;
        let best = 0;
        for (const f of [() => 0, (i) => (i % 2 ? 18 : -18), (i) => (i % 3 - 1) * 10]) {
          B.voyage(idx);
          for (let i = 0; i < lv.list.length && B.state() === "aim"; i++) { B.answer(lv.list[B.S().i]); B.flat(); B.move(f(i)); B.drop(); B.settle(); }
          if (B.state() !== "done") B.finish();
          const S = B.S(); best = Math.max(best, S.height >= lv.lineKm ? 1 + (S.lost.length ? 0 : 1) + 1 : 0);
        }
        out[lv.id] = best; });
      const saved = JSON.parse(localStorage.getItem("dailycity:ballast:v1"));
      return { out, stars: saved.levels, results: Object.keys(saved.results || {}).length, shown: !document.querySelector("#done").hidden && !document.querySelector("#doneStars").hidden };
    });
    check(Object.values(r.out).every((s) => s >= 1) && r.shown, "ballast: a voyage finishes with a star result; a plain bot clears each region's first", JSON.stringify(r.out));
    check(Object.keys(r.stars).length === 6 && r.results === 0, "ballast: voyage stars are saved; voyages never count as the daily");
    await p.reload(); await p.waitForTimeout(700);
    await p.click("#chartBtn"); await p.waitForTimeout(200);
    const chart = await p.evaluate(() => ({ done: document.querySelectorAll(".lvbtn.done").length, open: document.querySelectorAll(".lvbtn:not([disabled])").length, total: document.querySelector("#chartStars").textContent, cargo: document.querySelector("#dailyNote").textContent }));
    check(chart.done === 6 && chart.open >= 12 && /of 90 stars/.test(chart.total) && /Today's cargo starts in/.test(chart.cargo), "ballast: stars survive a reload; the menu previews today's cargo", JSON.stringify(chart));
    await ctx.close();
  }
  // midnight: a run in progress is not interrupted and is saved to its own day; the new day is offered
  {
    const { ctx, p } = await page(b, U + "ballast.html", { storage: SEEN, clock: new Date("2026-11-25T23:58:00"), ctx: { timezoneId: "Europe/London" }, wait: 300 });
    await p.clock.runFor(1500);
    const d0 = await p.evaluate(() => [MXS.today(), __ballast.run().mode, __ballast.run().seed]);
    await p.evaluate(() => { const B = __ballast; B.answer(B.L().list[0]); B.flat(); B.drop(); B.settle(); });
    await p.clock.runFor(4 * 60 * 1000);
    const d1 = await p.evaluate(() => [MXS.today(), __ballast.run() && __ballast.run().seed, __ballast.state(), __ballast.pieces().length]);
    check(d1[0] === d0[0] + 1 && d1[1] === d0[2] && d1[3] >= 1, "ballast: midnight doesn't interrupt a run in progress", JSON.stringify([d0, d1]));
    for (let g = 0; g < 400; g++) { const st = await p.evaluate(() => { const B = __ballast; if (!document.querySelector("#done").hidden) return "done"; if (B.state() !== "aim") return "wait"; B.answer("ZZ"); B.flat(); B.drop(); B.settle(); return "ok"; }); if (st === "done") break; if (st === "wait") await p.clock.runFor(300); }
    const d2 = await p.evaluate(() => ({ days: Object.keys(JSON.parse(localStorage.getItem("dailycity:ballast:v1")).results), fresh: !document.querySelector("#fresh").hidden }));
    check(d2.days.length === 1 && Number(d2.days[0]) === d0[0] && d2.fresh, "ballast: the finished run is saved to the day it began, and the new Daily is offered", JSON.stringify(d2));
    await p.goto(U + "ballast.html?next=1"); await p.clock.runFor(1500);
    check((await p.evaluate(() => __ballast.run() && __ballast.run().seed)) === d0[0] + 1, "ballast: after midnight a fresh visit starts the new day's run");
    await ctx.close();
  }
  // sound off and reduced motion are respected; a damaged save is repaired
  {
    const { ctx, p } = await page(b, U + "ballast.html", { storage: { "dailycity:ballast:v1": '{"results":null,"levels":7,"tut":1}', "dailycity:sound": "off" }, ctx: { reducedMotion: "reduce" }, wait: 300 });
    await p.addInitScript(() => 0);
    const made = await p.evaluate(() => { let n = 0; const A = window.AudioContext; window.AudioContext = function () { n++; return new A(); }; const B = __ballast; B.answer(B.L().list[0]); B.flat(); B.drop(); B.settle(); return [n, document.querySelector("#soundBtn").getAttribute("aria-pressed"), B.state()]; });
    check(made[0] === 0 && made[1] === "true", "ballast: with sound off, nothing plays", JSON.stringify(made));
    const calm = await p.evaluate(() => { const B = __ballast; B.start(B.gen(5, 9, 0)); const a = []; for (let i = 0; i < 5; i++) { B.tick(40); a.push(Math.round(B.shipAngle() * 1e4)); } return a; });
    check(new Set(calm).size === 1, "ballast: with reduced motion the deck doesn't rock (it sits at a fixed tilt)", JSON.stringify(calm));
    check(!p.errs.length, "ballast: a damaged save is repaired", p.errs.join("; "));
    await ctx.close();
  }
  // a slow phone (CPU slowed four times) with a full stack: the frame rate holds
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { storage: SEEN, wait: 600 });
    const cdp = await ctx.newCDPSession(p); await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await p.evaluate(() => { const B = __ballast; const lv = B.gen(20, 12, 0); lv.lineKm = 1e9; B.start(lv); for (let i = 0; i < 9; i++) { B.answer(lv.list[i]); B.flat(); B.move((i % 3 - 1) * 14); B.drop(); B.settle(); } });
    const fps = await p.evaluate(() => new Promise((done) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else done(n / 3); })(); }));
    const stepMs = await p.evaluate(() => { const B = __ballast, t0 = performance.now(); B.tick(120); return (performance.now() - t0) / 120; });
    check(fps >= 45 && stepMs < 8, "ballast: steady frame rate on a slow-phone profile with a full stack", `fps ${fps.toFixed(1)}, physics ${stepMs.toFixed(2)} ms a step, ${await p.evaluate(() => __ballast.pieces().filter((x) => !x.mxGone).length)} pieces on deck`);
    console.log(`  (ballast slow-phone profile: ${fps.toFixed(1)} fps, ${stepMs.toFixed(2)} ms per physics step)`);
    await ctx.close();
  }
  // offline after a first load
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    await ctx.addInitScript(() => { if (!sessionStorage.t) { localStorage.setItem("dailycity:ballast:v1", '{"tut":1}'); sessionStorage.t = 1; } });
    await p.goto(U + "ballast.html"); await p.evaluate(() => navigator.serviceWorker.ready); await p.waitForTimeout(2500);
    await ctx.setOffline(true);
    await p.reload({ waitUntil: "load" }).catch(() => {}); await p.waitForTimeout(1200);
    const ok = await p.evaluate(() => !!(window.__ballast && window.Matter && __ballast.state() === "aim")).catch(() => false);
    check(ok && !errs.length, "ballast: plays offline after the first load", errs.join("; "));
    await ctx.close();
  }
};
