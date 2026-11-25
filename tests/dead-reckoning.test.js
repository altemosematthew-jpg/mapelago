// Dead Reckoning checks, run from run.js (section 10). They use the page's localhost-only hook, window.__dr.
module.exports = async function ({ b, U, page, check }) {
  // the scoring curve, a stable daily set, no repeats within 60 days, rounds getting harder, other games untouched
  {
    const { ctx, p } = await page(b, U + "dead-reckoning.html#day-12", { desktop: true, wait: 800 });
    const r = await p.evaluate(() => {
      const D = __dr;
      const curve = [0, 50, 250, 1000, 2500, 5000, 20000].map(D.points);
      const perfect = D.total([100, 100, 100, 100, 100]);
      const km = Math.round(D.km({ lat: 51.5074, lon: -0.1278 }, { lat: 48.8566, lon: 2.3522 })); // London to Paris, about 344 km
      // every day's five, from No. 1 for two years and a bit
      const days = []; for (let n = 1; n <= 800; n++) days.push(D.daily(n));
      let repeats = 0, sameCountry = 0, short = 0;
      const last = {};
      days.forEach((five, i) => {
        const n = i + 1;
        if (five.length !== 5 || new Set(five).size !== 5) short++;
        if (new Set(five.map((x) => D.P[x].country)).size !== 5) sameCountry++;
        five.forEach((x) => { if (last[x] !== undefined && n - last[x] <= 60) repeats++; last[x] = n; });
      });
      const tiersOk = days.every((five) => five.every((x, i) => D.P[x].tier === i + 1));
      const fame = [1, 2, 3, 4, 5].map((t) => { const ps = D.P.filter((x) => x.tier === t); return ps.reduce((s, x) => s + Math.log10(x.pop * (x.capital ? 5 : 1)), 0) / ps.length; });
      return { curve, perfect, km, repeats, sameCountry, short, tiersOk, fame, day12: D.daily(12).map((x) => D.P[x].name + "|" + D.P[x].country), pools: D.POOLS.map((x) => x.length) };
    });
    check(r.curve[0] === 100 && r.curve[2] >= 75 && r.curve[2] <= 85 && r.curve[3] < r.curve[2] && r.curve[5] <= 2 && r.curve[6] === 0 && r.curve.every((v, i) => !i || v <= r.curve[i - 1]),
      "dead reckoning: scoring curve (100 at 0 km, most points at 250 km, falling smoothly to 0)", JSON.stringify(r.curve));
    check(r.perfect === 1000, "dead reckoning: a perfect day is 1,000", String(r.perfect));
    check(r.km >= 340 && r.km <= 348, "dead reckoning: great-circle distance (London to Paris)", String(r.km));
    check(r.repeats === 0 && r.short === 0, "dead reckoning: five different places a day, none repeat within 60 days (800 days)", JSON.stringify([r.repeats, r.short]));
    check(r.sameCountry === 0, "dead reckoning: never two places in one country on a day", String(r.sameCountry));
    check(r.tiersOk && r.fame.every((f, i) => !i || f < r.fame[i - 1]), "dead reckoning: rounds run from best known to least known", JSON.stringify(r.fame));
    check(r.pools.every((n) => n > 61), "dead reckoning: every round has more than 60 places", JSON.stringify(r.pools));
    await ctx.close();
    // the same number gives the same five on a fresh load, and on a phone
    const k = await page(b, U + "dead-reckoning.html#day-12", { wait: 600 });
    const again = await k.p.evaluate(() => __dr.S().places);
    check(JSON.stringify(again) === JSON.stringify(r.day12), "dead reckoning: No. 12 is the same five on every load", JSON.stringify([again, r.day12]));
    const fp = require("crypto").createHash("sha256").update(JSON.stringify(again)).digest("hex").slice(0, 16);
    // fingerprint of No. 12, so a data change that moves the schedule is noticed (update it on purpose, with the data)
    check(fp === "2200ced7c10674a3", "dead reckoning: No. 12 schedule fingerprint unchanged", fp);
    await k.ctx.close();
  }

  // a full daily game: share text has no answers, stats count it, practice changes nothing
  {
    const { ctx, p } = await page(b, U + "dead-reckoning.html#day-12", { wait: 800 });
    const names = await p.evaluate(() => __dr.S().places);
    for (let i = 0; i < 5; i++) {
      await p.evaluate((i) => { const x = __dr.P[__dr.daily(12)[i]]; __dr.tapAt(x.lat + (i ? 2 : 0), x.lon); }, i);
      await p.click("#lockBtn"); await p.waitForTimeout(60); await p.click("#nextBtn");
    }
    await p.waitForTimeout(200);
    const share = await p.textContent("#shareText");
    const save1 = await p.evaluate(() => localStorage.getItem("dailycity:reckoning:v1"));
    const res = JSON.parse(save1).results[12];
    check(/^Dead Reckoning No\. 12: [\d,]+ of 1,000 [\u{1F3AF}\u{1F7E9}\u{1F7E8}\u{1F7E7}\u{1F7E5}]{5}\nBeat my score: mapelago\.com\/dead-reckoning\.html#b-dr-12-0-\d+$/u.test(share), "dead reckoning: share text format", share);
    const leaks = names.flatMap((n) => n.split("|")).filter((w) => share.toLowerCase().includes(w.toLowerCase()));
    check(!leaks.length, "dead reckoning: no place or country in the share text", leaks.join(", "));
    check(res && res.total > 600 && !(await p.isHidden("#done")), "dead reckoning: a finished day is saved and shown", JSON.stringify(res));
    const statsBefore = await p.evaluate(() => JSON.stringify(__dr.stats()));
    // practice: several rounds, then nothing about the daily game has moved
    await p.click("#moreBtn");
    check(!(await p.isHidden("#practiceTag")), "dead reckoning: practice is labelled");
    for (let i = 0; i < 4; i++) {
      const bb = await p.locator("#map").boundingBox();
      await p.mouse.click(bb.x + bb.width * (0.3 + i * 0.1), bb.y + bb.height * 0.45);
      await p.click("#lockBtn"); await p.waitForTimeout(60); await p.click("#nextBtn");
    }
    const after = await p.evaluate(() => ({ save: localStorage.getItem("dailycity:reckoning:v1"), stats: JSON.stringify(__dr.stats()), keys: Object.keys(localStorage).filter((k) => /reckon/.test(k)) }));
    check(after.save === save1 && after.stats === statsBefore && after.keys.length === 1, "dead reckoning: practice never touches the daily result, streak or stats", JSON.stringify(after.keys));
    await p.click("#backBtn"); await p.waitForTimeout(100);
    check((await p.textContent("#shareText")) === share, "dead reckoning: back from practice, today's result is unchanged");
    check(!p.errs.length, "dead reckoning: no errors through a full game and practice", p.errs.join("; "));
    // the streaks sheet and front page cards know the game
    const card = await p.evaluate(() => (window.MXS.games || []).some((g) => g.id === "reckoning"));
    check(card, "dead reckoning: listed in the site's games (cards, streaks)");
    await ctx.close();
  }

  // loads cleanly at 375 px and 1440 px, with the map filling the width, in every look
  for (const [w, h] of [[375, 812], [1440, 900]]) for (const look of ["chart", "island", "postcard", "night", "metro", "arcade"]) {
    const { ctx, p } = await page(b, U + "dead-reckoning.html", { ctx: { viewport: { width: w, height: h } }, storage: { "dailycity:look": look }, wait: 500 });
    const m = await p.evaluate(() => { const r = document.querySelector("#map").getBoundingClientRect(); return { w: r.width, h: r.height, sw: document.documentElement.scrollWidth, land: !!document.querySelector("#map .land") }; });
    check(!p.errs.length && m.land && m.sw <= w && m.w >= (w < 500 ? w - 40 : 700) && m.h >= 250, `dead reckoning: loads cleanly at ${w}px (${look})`, JSON.stringify(m) + " " + p.errs.join("; "));
    await ctx.close();
  }

  // keyboard: arrows move the pin, Enter locks it in
  {
    const { ctx, p } = await page(b, U + "dead-reckoning.html#day-13", { desktop: true, wait: 600 });
    await p.focus("#map"); await p.keyboard.press("ArrowRight"); await p.keyboard.press("Shift+ArrowUp");
    const ok = await p.isEnabled("#lockBtn");
    await p.keyboard.press("Enter"); await p.waitForTimeout(100);
    check(ok && !(await p.isHidden("#reveal")) && !p.errs.length, "dead reckoning: keyboard play (arrows, Enter)");
    await ctx.close();
  }

  // a friend's beat-my-score link
  {
    const { ctx, p } = await page(b, U + "dead-reckoning.html#b-dr-" + (await (async () => { const k = await page(b, U + "dead-reckoning.html"); const n = await k.p.evaluate(() => __dr.N); await k.ctx.close(); return n; })()) + "-0-640", { wait: 600 });
    check(/friend scored 640 of 1,000/i.test(await p.textContent(".mx-beat")), "dead reckoning: beat-my-score link", await p.textContent(".mx-beat"));
    await ctx.close();
  }
};
