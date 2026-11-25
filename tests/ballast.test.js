// Ballast checks, run from run.js. They use the page's localhost-only hook, window.__ballast.
module.exports = async function ({ b, U, page, check }) {
  // every outline is a valid shape, sizes are in true proportion, and the daily is the same for everyone
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { wait: 900 });
    const r = await p.evaluate(() => {
      const S = window.MX_BALLAST, by = Object.fromEntries(S.map((s) => [s.cc, s]));
      const B = __ballast, a = B.daily(20).list.join(","), again = B.daily(20).list.join(","), other = B.daily(21).list.join(",");
      const ids = new Set(B.LEVELS.map((l) => l.id)), regions = {}; B.LEVELS.forEach((l) => (regions[l.region] = (regions[l.region] || 0) + 1));
      return { n: S.length, small: S.filter((s) => s.p.length < 4).length, au: by.AU.a, ratio: by.RU.a / by.FR.a, a, again, other, levels: B.LEVELS.length, ids: ids.size, regions,
        unknown: B.LEVELS.flatMap((l) => l.list).filter((cc) => !by[cc]), lines: B.LEVELS.every((l) => { B.start(l); return l.lineKm > 0; }) };
    });
    check(r.n === 193 && r.small === 0 && r.au > 7e6, "ballast: 193 country outlines, Australia is the continent (not Ashmore)", JSON.stringify([r.n, r.small, r.au]));
    check(r.ratio > 25 && r.ratio < 36, "ballast: sizes are in true proportion (Russia is about 30 Frances)", String(r.ratio));
    check(r.a === r.again && r.a !== r.other && r.a.split(",").length === 10, "ballast: the daily is ten countries, the same every time, different each day", r.a);
    check(r.levels === 30 && r.ids === 30 && Object.keys(r.regions).length === 6 && !r.unknown.length && r.lines, "ballast: thirty voyages in six regions, every country known, every load line set", JSON.stringify(r.regions));
    await ctx.close();
  }
  // a plain bot (each piece laid flat, dropped in the middle, named right) clears the first voyage of every region
  {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { wait: 900 });
    const r = await p.evaluate(() => {
      const B = __ballast, out = {};
      B.LEVELS.filter((l) => /1$/.test(l.id)).forEach((lv) => {
        let best = 0;
        for (const f of [() => 0, (i) => (i % 2 ? 18 : -18), (i) => (i % 3 - 1) * 10]) {
          B.start(lv);
          for (let i = 0; i < lv.list.length && B.state() === "aim"; i++) { B.answer(lv.list[B.S().i]); B.flat(); B.move(f(i)); B.drop(); B.settle(); }
          if (B.state() !== "done") B.finish();
          const S = B.S(); best = Math.max(best, S.height >= lv.lineKm ? 1 + (S.lost.length ? 0 : 1) + 1 : 0);
        }
        out[lv.id] = best;
      });
      const saved = JSON.parse(localStorage.getItem("dailycity:ballast:v1"));
      return { out, stars: saved.levels, results: Object.keys(saved.results || {}).length };
    });
    check(Object.values(r.out).every((s) => s >= 1), "ballast: the first voyage of each region can be cleared by a plain bot", JSON.stringify(r.out));
    check(Object.keys(r.stars).length === 6 && r.results === 0, "ballast: voyage stars are saved; voyages never count as the daily", JSON.stringify(r.stars));
    await p.reload(); await p.waitForTimeout(700);
    await p.click("#chartBtn"); await p.waitForTimeout(200);
    const chart = await p.evaluate(() => ({ done: document.querySelectorAll(".lvbtn.done").length, open: document.querySelectorAll(".lvbtn:not([disabled])").length, total: document.querySelector("#chartStars").textContent }));
    check(chart.done === 6 && chart.open >= 12 && /of 90 stars/.test(chart.total), "ballast: the chart shows saved stars and opens the next voyages", JSON.stringify(chart));
    await ctx.close();
  }
  // the daily: naming scores, the share never names a country, the result counts for the streak and survives a reload
  for (const desktop of [false, true]) {
    const { ctx, p } = await page(b, U + "ballast.html#day-20", { desktop, wait: 900 });
    const fit = await p.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); return [r("#nameBox").top >= 0, r("#dropBtn").bottom <= innerHeight, r("#sea").width > 250]; });
    if (!desktop) check(fit.every(Boolean), "ballast: on a phone the name choices, the deck and Drop fit on one screen", JSON.stringify(fit));
    // by keyboard: arrows move, Q and E turn, Space drops
    const k0 = await p.evaluate(() => 0);
    await p.keyboard.press("ArrowLeft"); await p.keyboard.press("q"); await p.keyboard.press("e"); await p.keyboard.press("e");
    await p.click("#nameOpts .opt >> nth=0");
    check(/Right|It's/.test(await p.textContent("#nameSay")), `ballast ${desktop ? "desktop" : "phone"}: tapping a name choice answers`);
    await p.keyboard.press(" ");
    await p.waitForFunction(() => __ballast.state() !== "fall", null, { timeout: 20000 });
    check((await p.evaluate(() => __ballast.pieces().length)) === 1, `ballast ${desktop ? "desktop" : "phone"}: the keyboard moves, turns and drops`);
    const r = await p.evaluate(() => {
      const B = __ballast;
      while (B.state() === "aim") { B.answer(B.L().list[B.S().i]); B.flat(); B.drop(); B.settle(); }
      const names = window.MX_BALLAST.filter((s) => B.L().list.includes(s.cc)).map((s) => s.n);
      const share = document.querySelector("#shareText").textContent, res = JSON.parse(localStorage.getItem("dailycity:ballast:v1")).results[20];
      return { share, leak: names.filter((n) => share.includes(n)), res, done: !document.querySelector("#done").hidden, info: MXS.info().find((s) => s.game.id === "ballast") };
    });
    check(r.done && r.res && r.res.score === r.res.h + 100 * r.res.named && r.res.named >= 9, `ballast ${desktop ? "desktop" : "phone"}: the daily scores height plus 100 a name`, JSON.stringify(r.res));
    check(/^Mapelago Ballast No\. 20 \u{1F422} [\d,]+ points\n/u.test(r.share) && !r.leak.length && /#b-bl-20-0-\d+$/.test(r.share.trim()), "ballast: the share has the score and a beat-my-score link, and names no country", r.share);
    check(r.info && r.info.played === 1, "ballast: the daily counts in Your streaks");
    await p.reload(); await p.waitForTimeout(700);
    check(/Today's Daily Ballast: [\d,]+ points/.test(await p.textContent("#dailyNote")) && (await p.isVisible("#chart")), "ballast: a finished daily shows its score and the voyages after a reload");
    check(!p.errs.length, `ballast ${desktop ? "desktop" : "phone"}: no errors`, p.errs.join("; "));
    await ctx.close();
  }
  // a damaged save never stops the game; reduced motion is honoured
  {
    const { ctx, p } = await page(b, U + "ballast.html", { storage: { "dailycity:ballast:v1": '{"results":null,"levels":7}' }, ctx: { reducedMotion: "reduce" }, wait: 900 });
    check(!p.errs.length && (await p.evaluate(() => __ballast.state())) === "aim", "ballast: a damaged save is repaired; plays with reduced motion", p.errs.join("; "));
    await ctx.close();
  }
};
