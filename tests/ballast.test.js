// Ballast checks, run from run.js. They use the page's localhost-only hook, window.__ballast.
module.exports = async function ({ b, U, page, check }) {
  const SEEN = { "dailycity:ballast:v1": '{"tut":1}' };
  // play whatever is on screen with a plain bot until the result screen shows (levels restart on a timer, so poll)
  const playOut = async (p, opts = {}) => {
    for (let guard = 0; guard < 400; guard++) {
      const st = await p.evaluate((wrong) => {
        const B = __ballast; if (!document.querySelector("#done").hidden) return "done";
        if (B.state() !== "aim") return "wait";
        B.flat(); B.drop(); B.settle(); if (B.asked()) B.answer(wrong ? "ZZ" : B.asked()); if (B.state() === "last") B.cont(); return "ok";
      }, !!opts.wrong);
      if (st === "done") return true;
      if (st === "wait") await p.waitForTimeout(150);
    }
    return false;
  };
  // wording: "Stack the Countries" is another app's registered trademark, so the phrase is used nowhere on the site
  {
    const fs = require("fs"), path = require("path"), root = path.join(__dirname, ".."), hits = [];
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const f = path.join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|vendor|fonts|tests)$/.test(e.name)) walk(f); }
      else if (/\.(html|js|json|xml|webmanifest|md|txt)$/.test(e.name) && !/world\.js|ballast-data\.js|history-data\.js/.test(e.name)) { if (/stack[- ]the[- ]countr|\bStack the\b/i.test(fs.readFileSync(f, "utf8"))) hits.push(path.relative(root, f)); } });
    walk(root);
    check(!hits.length, "ballast: the phrase 'stack the countries' (and 'Stack the ...') appears nowhere on the site", hits.join(" "));
    const page0 = fs.readFileSync(path.join(root, "ballast.html"), "utf8");
    check(/<title>Ballast: a daily load-the-ship geography game \| Mapelago<\/title>/.test(page0) && /Load the deck with countries/.test(page0), "ballast: its own title and subtitle");
  }
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
    const gen = await p.evaluate(() => { const B = __ballast, S = window.MX_BALLAST, by = Object.fromEntries(S.map((s) => [s.cc, s])); const rank = Object.fromEntries(S.slice().sort((a, c) => c.f - a.f).map((s, i) => [s.cc, i])); let easy = 0, tot = 0, base = 0, lv = 0;
      const long = (s) => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; s.p.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }); return Math.max(x1 - x0, y1 - y0) / Math.max(1, Math.min(x1 - x0, y1 - y0)); };
      for (let seed = 1; seed <= 30; seed++) { B.gen(seed, 1, 0).list.concat(B.gen(seed, 2, 0).list).forEach((cc) => { tot++; if (rank[cc] < 110) easy++; });
        for (const n of [3, 8]) { const l = B.gen(seed, n, 0).list.map((cc) => by[cc]); lv++; if (l.every((x) => l[0].a / long(l[0]) ** 2 >= x.a / long(x) ** 2)) base++; } }
      return { easy: easy / tot, base, lv, until: B.until() }; });
    check(gen.easy > 0.85 && gen.base === gen.lv, "ballast generator: the day's first two levels use well-known countries; every level opens with its broadest piece", JSON.stringify(gen));
    check(/^\d+h \d+m$/.test(gen.until), "ballast: the countdown to the next climb reads like '5h 12m'", gen.until);
    check(r.levels === 30 && r.ids === 30 && Object.keys(r.regions).length === 6 && !r.unknown.length && r.tut === 5, "ballast: thirty voyages in six regions, five tutorial levels, every country known");
    await ctx.close();
  }
  // first visit: the tutorial (five one-screen levels), then the daily; it can be skipped; it never comes back
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { wait: 900 });
    const t0 = await p.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); return [__ballast.run().mode, document.querySelector("#tip").textContent.length > 20, r("#sea").bottom <= innerHeight && r("#sea").height >= innerHeight * 0.5, document.querySelector("#nameBox").hidden]; });
    check(t0[0] === "tut" && t0[1] && t0[2] && t0[3], "ballast: a first visit starts the tutorial, with a tip, on one screen", JSON.stringify(t0));
    let seen = new Set();
    for (let g = 0; g < 200; g++) {
      const st = await p.evaluate(() => { const B = __ballast, r = B.run(); if (!r || r.mode !== "tut") return ["out", r && r.mode]; if (B.state() !== "aim") return ["wait"]; const id = B.L().id; B.flat(); B.drop(); B.settle(); if (B.asked()) B.answer(B.asked()); if (B.state() === "last") B.cont(); return ["ok", id]; });
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
    const fit = await p.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); return [r("#sea").height >= innerHeight * 0.45, r("#sea").bottom <= innerHeight, r("#nameQ").top < innerHeight, /\u2665\u2665\u2665/.test(document.querySelector("#lvlMeta").textContent), /Level 1/.test(document.querySelector("#lvlTitle").textContent), /of 2$/.test(document.querySelector("#hLost").textContent)]; });
    check(fit.every(Boolean), `ballast ${tag}: the play area fills most of the screen; level 1, three lives, and how many may be lost are shown`, JSON.stringify(fit));
    const box = await p.locator("#sea").boundingBox(), cdp = await ctx.newCDPSession(p);
    const pre = await p.evaluate(() => [document.querySelector("#nameOpts").hidden, document.querySelector("#nameQ").textContent, typeof __ballast.ghost(), __ballast.hover()]);
    check(pre[0] && /Place a country, then name it for \+10/.test(pre[1]) && pre[2] === "number", `ballast ${tag}: no name question before the first piece is placed; a landing ghost shows`, JSON.stringify(pre));
    // a tap or click without a drag turns the piece 15 degrees and doesn't drop it; keys move and turn it
    if (desktop) await p.mouse.click(box.x + 40, box.y + 200); else await p.touchscreen.tap(box.x + 40, box.y + 200);
    const turned = await p.evaluate(() => __ballast.hover());
    await p.keyboard.press("ArrowLeft"); await p.keyboard.press("e"); await p.keyboard.press("ArrowDown");
    const keyed = await p.evaluate(() => [__ballast.hover(), __ballast.pieces().length]);
    check(Math.abs(turned[1] - pre[3][1] - Math.PI / 12) < 1e-6 && keyed[0][0] < turned[0] && Math.abs(keyed[0][1] - turned[1] - Math.PI / 12) < 1e-6 && keyed[0][2] > turned[2] && keyed[1] === 0, `ballast ${tag}: a tap turns the piece 15 degrees without dropping it; arrows and E move and turn it`, JSON.stringify([pre[3], turned, keyed]));
    // a real drag (touch on the phone, mouse on the desktop): the piece follows one for one in both directions; letting go drops it there
    const x0 = box.x + box.width / 2, y0 = box.y + 260, dx = 70, dy = -90, before = await p.evaluate(() => __ballast.hover()), unit = await p.evaluate(() => 360 / document.querySelector("#sea").getBoundingClientRect().width / __ballast.zoom());
    if (desktop) { await p.mouse.move(x0, y0); await p.mouse.down(); await p.mouse.move(x0 + dx / 2, y0 + dy / 2, { steps: 3 }); await p.mouse.move(x0 + dx, y0 + dy, { steps: 3 }); }
    else { await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: y0 }] }); for (let i = 1; i <= 6; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + dx * i / 6, y: y0 + dy * i / 6 }] }); }
    await p.waitForTimeout(60);
    const held = await p.evaluate(() => [__ballast.hover(), __ballast.pieces().length]);
    check(Math.abs(held[0][0] - before[0] - dx * unit) < 1.5 && Math.abs(held[0][2] - before[2] - dy * unit) < 1.5 && held[1] === 0, `ballast ${tag}: dragging moves the piece one for one, across and up, without dropping it`, JSON.stringify([before, held, unit]));
    if (desktop) await p.mouse.up(); else await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await p.waitForTimeout(60);
    const let0 = await p.evaluate(() => { const b = __ballast.pieces()[0]; return b ? [b.position.x, __ballast.state()] : null; });
    check(let0 && Math.abs(let0[0] - held[0][0]) < 3, `ballast ${tag}: letting go drops the piece from where it was held`, JSON.stringify([let0, held[0]]));
    await p.waitForFunction(() => __ballast.state() !== "fall", null, { timeout: 20000 });
    const post = await p.evaluate(() => [__ballast.pieces().length, __ballast.state(), __ballast.asked() === __ballast.L().list[0], document.querySelector("#nameQ").textContent, __ballast.S().lost.length]);
    check(post[0] === 1 && post[1] === "aim" && post[2] && /just place.*\(\+10\)/.test(post[3]) && post[4] === 0, `ballast ${tag}: the piece lands and stays aboard; the next is in hand at once and the name is asked about the one just placed (+10)`, JSON.stringify(post));
    await p.click("#nameOpts .opt >> nth=0");
    check(/Right|It's/.test(await p.textContent("#nameSay")), `ballast ${tag}: tapping a name choice answers`);
    await p.keyboard.press(" ");
    await p.waitForFunction(() => __ballast.state() !== "fall", null, { timeout: 20000 });
    check((await p.evaluate(() => __ballast.pieces().length)) === 2, `ballast ${tag}: Space drops the piece (keyboard fallback)`);
    // reload mid-run: the run carries on from its level with its lives
    if (!desktop) {
      await p.evaluate(() => { const B = __ballast; while (B.state() === "aim") { B.flat(); B.drop(); B.settle(); if (B.asked()) B.answer(B.asked()); if (B.state() === "last") B.cont(); } });
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
    check(/^Mapelago Ballast No\. 20 \u{1F422} [\d,]+ points\n/u.test(r.share) && /Loaded \d+ level/.test(r.share) && /^[\u{1F4E6}\u{1F30A}]+$/mu.test(r.share) && !r.leak.length && /#b-bl-20-0-\d+$/.test(r.share.trim()), "ballast: the share shows the levels cleared and squares, has a beat-my-score link, and names no country", r.share);
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
          for (let i = 0; i < lv.list.length && B.state() === "earn"; i++) { B.earn(); B.flat(); B.move(f(i)); B.drop(); B.settle(); }
          const S = B.S(); best = Math.max(best, S.cleared ? 1 + (S.lost.length ? 0 : 1) + 1 : 0);
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
  // feel: easy levels hold a plain centre drop; the stack must hold for two seconds; the loss limit; earned pieces; the camera
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { storage: SEEN, wait: 900 });
    const r = await p.evaluate(() => {
      const B = __ballast, out = {};
      // the tutorial's calm levels and the day's first two: every piece dropped from the middle, unturned
      out.easy = B.TUTORIAL.slice(0, 3).concat([B.gen(20, 1, 0), B.gen(20, 2, 0), B.gen(21, 1, 0)]).map((l) => { B.start(l); let n = 0; while (B.state() === "aim" && n++ < 12) { B.drop(); B.settle(); } return [l.id, B.S().lost.length, B.S().cleared]; });
      // the hold: over the line is not enough; it has to stand for two seconds
      const lv = B.gen(20, 1, 0); B.start(lv); let n = 0, first = null;
      while (B.state() === "aim" && n++ < 12) { B.drop(); for (let i = 0; i < 400 && B.state() === "fall"; i++) B.tick(1); if (first === null && B.height() >= lv.lineKm && B.S().i >= 2) { B.tick(60); first = [B.hold() > 800 && B.hold() < 2000, B.S().cleared]; B.tick(90); first.push(B.S().cleared); } }
      out.hold = first;
      // the loss limit: the third country in the sea ends the load
      const l2 = B.gen(20, 3, 0); l2.lineKm = 1e9; B.start(l2); out.spare = l2.spare; n = 0;
      while (B.state() === "aim" && n++ < 12) { B.move(170); B.drop(); B.settle(); }
      out.lost = [B.S().lost.length, B.S().judged, B.S().cleared];
      // a voyage: every piece is earned; a right answer gives the country, a wrong one a plain crate
      B.voyage(0); const q1 = B.earnQ(); out.q = [B.state(), q1.all.length, q1.all.includes(q1.right), new Set(q1.all).size];
      B.earn(); out.right = [B.state(), B.hover()[3]]; B.drop(); B.settle();
      B.earn(false); out.wrong = [B.state(), B.hover()[3], B.S().wrong]; B.drop(); B.settle();
      out.labels = B.pieces().map((x) => [x.mxShow, x.mxCrate]);
      const kinds = new Set(); B.LEVELS.forEach((l, i) => { B.voyage(i); for (let k = 0; k < l.list.length && B.state() === "earn"; k++) { const q = B.earnQ(); kinds.add(q.kind); if (!q.all.includes(q.right) || new Set(q.all).size !== 4) kinds.add("BAD " + l.id); B.earn(); B.drop(); B.settle(); } });
      out.kinds = [...kinds].sort();
      // the camera: a tall stack zooms the view out, and the deck stays in it
      const tall = B.gen(20, 9, 0); tall.lineKm = 1e9; tall.spare = 99; B.start(tall); n = 0; while (B.state() === "aim" && n++ < 12) { B.flat(); B.drop(); B.settle(); }
      out.tall = B.height();
      return out;
    });
    await p.waitForTimeout(1500);
    const z = await p.evaluate(() => __ballast.zoom());
    const one = await p.evaluate(() => { const B = __ballast; B.start(B.TUTORIAL[0]); B.drop(); B.tick(400); return [B.height() > 0, B.S().cleared, B.state(), B.L().lineKm]; });
    check(one[0] && !one[1] && one[2] === "aim", "ballast tutorial: one country alone never clears a level (at least two must be aboard)", JSON.stringify(one));
    check(r.easy.every((x) => x[1] === 0 && x[2]), "ballast feel: on easy levels a plain centre drop never goes overboard (Italy included) and the level clears", JSON.stringify(r.easy));
    check(r.hold && r.hold[0] && r.hold[1] === false && r.hold[2] === true, "ballast feel: the stack must stand above the line for two seconds to clear", JSON.stringify(r.hold));
    check(r.spare === 2 && r.lost[0] === 3 && r.lost[1] && !r.lost[2], "ballast feel: two countries may be lost; the third ends the load", JSON.stringify(r.lost));
    check(r.q[0] === "earn" && r.q[1] === 4 && r.q[2] && r.q[3] === 4 && r.right[0] === "aim" && r.right[1] === false && r.wrong[1] === true && r.wrong[2] === 1, "ballast voyages: each piece is earned with a four-choice question; right gives the country, wrong a plain crate", JSON.stringify([r.q, r.right, r.wrong]));
    check(r.labels.length === 2 && r.labels.every((x) => x[0]) && r.labels[1][1], "ballast: placed pieces carry their name (the crate says crate)", JSON.stringify(r.labels));
    check(["capital", "continent", "neighbour", "shape"].every((k) => r.kinds.includes(k)) && !r.kinds.some((k) => /BAD/.test(k)), "ballast voyages: outline, capital, continent and neighbour questions, each with one right answer among four", r.kinds.join(","));
    check(z < 0.95 && z >= 0.42, "ballast feel: the view zooms out for a tall stack and keeps the deck in it", `zoom ${z.toFixed(2)}, stack ${r.tall} km`);
    check(!p.errs.length, "ballast feel: no console errors", p.errs.join("; "));
    await ctx.close();
  }
  // midnight: a run in progress is not interrupted and is saved to its own day; the new day is offered
  {
    const { ctx, p } = await page(b, U + "ballast.html", { storage: SEEN, clock: new Date("2026-11-25T23:58:00"), ctx: { timezoneId: "Europe/London" }, wait: 300 });
    await p.clock.runFor(1500);
    const d0 = await p.evaluate(() => [MXS.today(), __ballast.run().mode, __ballast.run().seed]);
    await p.evaluate(() => { const B = __ballast; B.flat(); B.drop(); B.settle(); if (B.asked()) B.answer(B.asked()); });
    await p.clock.runFor(4 * 60 * 1000);
    const d1 = await p.evaluate(() => [MXS.today(), __ballast.run() && __ballast.run().seed, __ballast.state(), __ballast.pieces().length]);
    check(d1[0] === d0[0] + 1 && d1[1] === d0[2] && d1[3] >= 1, "ballast: midnight doesn't interrupt a run in progress", JSON.stringify([d0, d1]));
    for (let g = 0; g < 400; g++) { const st = await p.evaluate(() => { const B = __ballast; if (!document.querySelector("#done").hidden) return "done"; if (B.state() !== "aim") return "wait"; B.flat(); B.drop(); B.settle(); if (B.asked()) B.answer("ZZ"); if (B.state() === "last") B.cont(); return "ok"; }); if (st === "done") break; if (st === "wait") await p.clock.runFor(300); }
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
    const made = await p.evaluate(() => { let n = 0; const A = window.AudioContext; window.AudioContext = function () { n++; return new A(); }; const B = __ballast; B.flat(); B.drop(); B.settle(); if (B.asked()) B.answer(B.asked()); return [n, document.querySelector("#soundBtn").getAttribute("aria-pressed"), B.state()]; });
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
    await p.evaluate(() => { const B = __ballast; const lv = B.gen(20, 12, 0); lv.lineKm = 1e9; lv.spare = 99; B.start(lv); for (let i = 0; i < 9; i++) { B.flat(); B.move((i % 3 - 1) * 14); B.drop(); B.settle(); } });
    const fps = await p.evaluate(() => new Promise((done) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else done(n / 3); })(); }));
    const stepMs = await p.evaluate(() => { const B = __ballast, t0 = performance.now(); B.tick(120); return (performance.now() - t0) / 120; });
    check(fps >= 45 && stepMs < 8, "ballast: steady frame rate on a slow-phone profile with a full stack", `fps ${fps.toFixed(1)}, physics ${stepMs.toFixed(2)} ms a step, ${await p.evaluate(() => __ballast.pieces().filter((x) => !x.mxGone).length)} pieces on deck`);
    console.log(`  (ballast slow-phone profile: ${fps.toFixed(1)} fps, ${stepMs.toFixed(2)} ms per physics step)`);
    await ctx.close();
  }
  // a 375px phone: the control row fits, Continue stays hidden until the load is over, and the question never moves the buttons
  {
    const { ctx, p } = await page(b, U + "ballast.html", { storage: SEEN, ctx: { viewport: { width: 375, height: 700 } }, wait: 700 });
    const r = await p.evaluate(() => {
      const B = __ballast, box = (q) => document.querySelector(q).getBoundingClientRect(), o = {};
      o.row = [...document.querySelectorAll(".ctrl button")].filter((x) => x.offsetParent).map((x) => { const c = x.getBoundingClientRect(); return [x.id, Math.round(c.left), Math.round(c.right)]; });
      o.cont = !!document.querySelector("#contBtn").offsetParent; o.ang = B.hover()[1]; o.y0 = box(".ctrl").top;
      B.drop(); B.tick(120); o.asked = !!document.querySelector("#nameOpts .opt"); o.y1 = box(".ctrl").top; o.cont2 = !!document.querySelector("#contBtn").offsetParent;
      const long = (cc) => { const s = MX_BALLAST.find((x) => x.cc === cc); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; s.p.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }); return Math.max(x1 - x0, y1 - y0) / Math.max(1, Math.min(x1 - x0, y1 - y0)); };
      o.worst = 0; o.n = 0; for (let d = 15; d < 75; d++) for (let n = 1; n <= 2; n++) B.gen(d, n, 0).list.forEach((cc) => { o.n++; o.worst = Math.max(o.worst, long(cc)); });
      o.same = [13, 14].map((d) => B.gen(d, 1, 0).list.join(""));
      return o;
    });
    check(r.row.length === 5 && r.row.every((x) => x[1] >= 0 && x[2] <= 375), "ballast phone: every control button is inside a 375px screen", JSON.stringify(r.row));
    check(!r.cont && !r.cont2, "ballast phone: Continue is hidden while a piece is waiting", JSON.stringify([r.cont, r.cont2]));
    check(r.asked && Math.abs(r.y1 - r.y0) < 1, "ballast phone: the name question does not move the control row", `${r.y0} -> ${r.y1}`);
    check(r.ang === 0, "ballast: a piece arrives north-up", String(r.ang));
    check(r.n >= 480 && r.worst <= 1.6, "ballast daily: from No. 15 the first two levels hold only compact countries", `${r.n} pieces, longest ${r.worst.toFixed(2)}`);
    check(r.same[0] === "AOMAETEG" && r.same[1] === "ARPYPECO", "ballast daily: Nos. 13 and 14 keep the cargo they had", r.same.join(" "));
    await ctx.close();
  }
  // today's cargo: the last stack that stood is kept as outlines only, drawn on the home screen and on the share image
  {
    const { ctx, p } = await page(b, U + "ballast.html", { storage: SEEN, ctx: { viewport: { width: 375, height: 667 } }, wait: 700 });
    const r = await p.evaluate(async () => {
      const B = __ballast; let n = 0;
      while (B.run() && B.run().cleared < 1 && n++ < 30) { if (B.state() === "aim") { B.flat(); B.drop(); } B.settle(); B.tick(200); if (B.state() === "last") document.querySelector("#contBtn").click(); }
      const cleared = B.run().cleared; B.run().lives = 1; B.S().cleared = false; B.finish(); await new Promise((r) => setTimeout(r, 400));
      const res = B.save().results[Object.keys(B.save().results)[0]], c = document.createElement("canvas"); c.width = 400; c.height = 300;
      const drew = window.MX_SHARE_ART(c.getContext("2d"), { x: 0, y: 0, w: 400, h: 300 }), px = c.getContext("2d").getImageData(0, 0, 400, 300).data; let ink = 0; for (let i = 3; i < px.length; i += 4) if (px[i]) ink++;
      document.querySelector("#chartBtn2").click(); await new Promise((r) => setTimeout(r, 200));
      return { cleared, pic: res.pic && res.pic.p.length, names: /[A-Za-z]{3}/.test(JSON.stringify(res.pic || {}).replace(/"[dp]"/g, "")), drew, ink, fig: !document.querySelector("#cargoFig").hidden, share: document.querySelector("#homeShareText").textContent };
    });
    check(r.cleared >= 1 && r.pic >= 1 && !r.names, "ballast cargo: the stack that stood is saved as outlines, with no country names", JSON.stringify(r));
    check(r.drew === true && r.ink > 2000 && r.fig, "ballast cargo: it is drawn on the share image and shown as today's cargo on the home screen", JSON.stringify([r.drew, r.ink, r.fig]));
    check(/^\u{1F4E6}+\u{1F30A}*$/mu.test(r.share) && /Loaded \d+ level/.test(r.share) && /mapelago\.com\/ballast\.html#b-bl-/.test(r.share.trim().split("\n").pop()), "ballast share: crates for loaded levels, waves for lost loads, the link last", r.share);
    await ctx.close();
  }
  // the ship reacts to its load (drawing only), and Sunday's Captain's run is an extra that leaves the Daily alone
  {
    const { ctx, p } = await page(b, U + "ballast.html", { storage: SEEN, clock: new Date("2026-11-29T12:00:00"), ctx: { viewport: { width: 375, height: 667 } }, wait: 700 });
    const r = await p.evaluate(async () => {
      const B = __ballast, o = {};
      B.start(B.TUTORIAL[0]); for (let i = 0; i < 5; i++) B.move(1); B.drop(); B.settle(); const at = () => { const q = B.pieces()[0]; return [q.position.x, q.position.y, q.angle].join(","); }, h0 = B.height(), y0 = at();
      for (let i = 0; i < 300; i++) B.draw(); o.list = B.list(); o.same = B.height() === h0 && at() === y0;
      o.sun = [B.sunday(16), B.sunday(13), B.sunday(2)];
      B.home(); await new Promise((r) => setTimeout(r, 100)); const cb = document.querySelector("#captainBtn"); o.btn = !!cb.offsetParent && !cb.disabled;
      cb.click(); await new Promise((r) => setTimeout(r, 200)); o.mode = B.run().mode; o.sea = [B.L().swell, B.L().wind, document.querySelector("#lvlTitle").textContent];
      B.run().lives = 1; B.S().cleared = false; B.finish(); await new Promise((r) => setTimeout(r, 300));
      const sv = B.save(); o.captain = sv.captain && Object.keys(sv.captain); o.daily = Object.keys(sv.results).length; o.share = !document.querySelector("#shareBtn").hidden;
      B.home(); await new Promise((r) => setTimeout(r, 100)); o.after = [cb.disabled, cb.textContent, document.querySelector("#dailyBtn").disabled];
      return o;
    });
    check(r.list[0] > 0.002 && r.list[1] > 0.5 && r.same, "ballast ship: it sits lower and lists toward the heavy side, and the physics is untouched", JSON.stringify([r.list, r.same]));
    check(r.sun[0] && !r.sun[1] && r.sun[2] && r.btn && r.mode === "captain" && r.sea[0] > 0 && r.sea[1] > 0 && /Captain's run · Level 1/.test(r.sea[2]), "ballast Captain's run: offered on Sundays, level 1 already has swell and wind", JSON.stringify([r.sun, r.btn, r.mode, r.sea]));
    check(JSON.stringify(r.captain) === '["16"]' && r.daily === 0 && !r.share && r.after[0] && /done/.test(r.after[1]) && !r.after[2], "ballast Captain's run: one a Sunday, saved apart, the Daily Ballast is still there to play", JSON.stringify([r.captain, r.daily, r.share, r.after]));
    await ctx.close();
    const t = await page(b, U + "ballast.html", { storage: SEEN, clock: new Date("2026-11-26T12:00:00"), wait: 500 });
    const thu = await t.p.evaluate(async () => { __ballast.home(); await new Promise((r) => setTimeout(r, 100)); return !!document.querySelector("#captainBtn").offsetParent; });
    check(!thu, "ballast Captain's run: not offered on other days");
    await t.ctx.close();
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
