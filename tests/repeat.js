// Standard 13, never the same twice: builds every game's schedule for the next 365 days and reports
//   - anything that appears twice in one day
//   - anything that comes back within the 365 days
// and prints the pool table (how many different items a year uses, and the first day something returns).
// Run: node tests/repeat.js [firstDay] [days]   (exit 1 if a game listed in MUST repeats)
const { chromium } = require("playwright"); const start = require("./server.js");
const FIRST = +process.argv[2] || 20, DAYS = +process.argv[3] || 365;
// how each game's content for one day is read: an array of keys (one per question, pair, place, route or piece set)
const GAMES = [
  { id: "city", name: "Mystery city", page: "index.html", unit: "city", hook: "__lf", key: () => [__lf.P.city + ", " + __lf.P.country] },
  { id: "country", name: "Mystery country", page: "country.html", unit: "country", gap: 45, why: "about 195 countries: one full cycle, then a reshuffle", hook: "__lf", key: () => [__lf.P.city] },
  { id: "bigger", name: "Bigger city?", page: "bigger.html", unit: "pair", hook: "__big", key: () => __big.S().pairs.map((p) => p.map((c) => c.name + "," + (c.country || "")).sort().join(" | ")) },
  { id: "bigcountry", name: "Bigger country?", page: "bigger-country.html", unit: "pair", hook: "__big", key: () => __big.S().pairs.map((p) => p.map((c) => c.name).sort().join(" | ")) },
  { id: "voyage", name: "Voyage", page: "voyage.html", unit: "question", gap: 14, why: "its fact pools (capitals, outlines, borders) hold 100 to 200 each", hook: "__voy", key: () => __voy.S().qs.map((q) => q.kind + ": " + q.ask + " [" + q.options[q.answer] + (/Which of these|largest|smallest|most|fewest/.test(q.ask) ? "; " + q.options.slice().sort().join(", ") : "") + "]") },
  { id: "fathoms", name: "Fathoms", page: "fathoms.html", unit: "prompt", gap: 20, why: "329 prompts at seven a day last 47 days", hook: "__fath", key: () => __fath.S().prompts.map((q) => q.ask) },
  { id: "stamps", name: "Stamps", page: "stamps.html", unit: "question", gap: 30, why: "six wedges, two questions each, from pools of 100 to 200", hook: "__stamp", key: () => { const q = __stamp.S().q, out = []; Object.keys(q).forEach((c) => q[c].forEach((x) => out.push(x.ask + " [" + x.options[x.answer] + (/Which of these|Three of these|largest|smallest/.test(x.ask) ? "; " + x.options.slice().sort().join(", ") : "") + "]"))); return out; } },
  { id: "history", name: "Logbook", page: "history.html", unit: "question", hook: "__hist", key: () => __hist.QS.map((q) => q.k === "m" ? "m:" + q.q : q.k + ":" + q.f.slice().sort((a, c) => a - c).join(",")) },
  { id: "crossings", name: "Crossings", page: "crossings.html", unit: "route", hook: "__cross", inPage: (n) => { const d = __cross.daily(n); return [[__cross.name(d.from), __cross.name(d.to)].sort().join(" | ")]; } },
  { id: "reckoning", name: "Dead Reckoning", page: "dead-reckoning.html", unit: "place", gap: 75, why: "its smallest pool (the hardest places) has 83", hook: "__dr", inPage: (n) => __dr.daily(n).map((i) => __dr.P[i].name + ", " + __dr.P[i].country) },
  { id: "ballast", name: "Ballast", page: "ballast.html", unit: "piece set", hook: "__ballast", inPage: (n) => [1, 2, 3, 4, 5, 6, 7, 8].map((l) => __ballast.daily(n, l).list.slice().sort().join("")) },
];
// games that must never repeat (within a year, or within their stated gap where the pool is smaller than a year)
const MUST = (process.env.MUST || "city,country,bigger,bigcountry,voyage,fathoms,stamps,history,crossings,reckoning,ballast").split(",").filter(Boolean);
(async () => {
  const srv = await start(), b = await chromium.launch(), only = process.env.ONLY, rows = [];
  for (const g of GAMES) { if (only && g.id !== only) continue;
    const days = [];
    if (g.inPage) { const p = await (await b.newContext()).newPage(); await p.route(/analytics|woff/, (r) => r.abort()); await p.goto(srv.url + g.page); await p.waitForFunction((h) => !!window[h], g.hook, { timeout: 20000 }); for (let d = 0; d < DAYS; d++) days.push(await p.evaluate(g.inPage, FIRST + d)); await p.context().close(); }
    else { const W = 4, ctxs = []; for (let w = 0; w < W; w++) { const p = await (await b.newContext()).newPage(); await p.route(/analytics|woff|world(-lite)?\.js/, (r) => r.abort()); ctxs.push(p); }
      await Promise.all(ctxs.map(async (p, w) => { for (let d = w; d < DAYS; d += W) { await p.goto(srv.url + g.page + "?d=" + d + "#day-" + (FIRST + d), { waitUntil: "domcontentloaded" }); await p.waitForFunction((h) => !!window[h], g.hook, { timeout: 20000 }); days[d] = await p.evaluate(g.key); } }));
      for (const p of ctxs) await p.context().close(); }
    const seen = new Map(), last = new Map(); let sameDay = 0, back = 0, firstBack = null; const ex = [];
    days.forEach((keys, d) => { const today = new Set(); keys.forEach((k) => { if (today.has(k)) { sameDay++; if (ex.length < 3) ex.push("twice on No. " + (FIRST + d) + ": " + k); } else if (seen.has(k) && d - last.get(k) < (g.gap || 1e9)) { back++; if (firstBack === null) firstBack = d; if (ex.length < 3) ex.push("No. " + (FIRST + seen.get(k)) + " and No. " + (FIRST + d) + ": " + k); } today.add(k); }); today.forEach((k) => { if (!seen.has(k)) seen.set(k, d); last.set(k, d); }); });
    const per = days.reduce((s, k) => s + k.length, 0) / DAYS;
    rows.push({ g, per, used: seen.size, sameDay, back, firstBack, ex });
    console.log(`${g.name}: ${per.toFixed(1)} ${g.unit}s a day, ${seen.size} different in ${DAYS} days, ${sameDay} twice in a day, ${back} came back` + (g.gap ? ` within ${g.gap} days (${g.why})` : "") + (firstBack !== null ? ` (first on day ${firstBack + 1})` : "") + (ex.length ? "\n    " + ex.join("\n    ").slice(0, 500) : ""));
  }
  await b.close(); srv.close();
  const bad = rows.filter((r) => MUST.includes(r.g.id) && (r.sameDay || r.back)).length;
  console.log(`\n${rows.filter((r) => !r.sameDay && !r.back).length} of ${rows.length} games never repeat in ${DAYS} days` + (bad ? `; ${bad} regressions` : "")); process.exit(bad ? 1 : 0);
})();
