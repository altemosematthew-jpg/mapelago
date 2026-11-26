// Builds daily-data.js for Daily Voyage from data already on the site (no new facts).
const fs = require("fs"), R = "/home/user/mapelago/", S = "/tmp/claude-0/-home-user-mapelago/8063a17b-1e47-5ab7-9b66-367812e6a976/scratchpad/";
const fat = fs.readFileSync(R + "fathoms.html", "utf8");
const T = [...fat.matchAll(/\{cc:"([A-Z]{2})",cid:(\d+),name:"([^"]+)",continent:"([^"]+)"[^{}]*?area:(\d+)[^{}]*?fame:(\d+)\}/g)].map((m) => ({ cc: m[1], cid: +m[2], name: m[3], cont: m[4], area: +m[5], fame: +m[6] }));
const site = fs.readFileSync(R + "site.js", "utf8"), un = {}; site.match(/"(AF=[^"]+)"\.split/)[1].split(";").forEach((x) => { const [k, v] = x.split("="); un[k] = +v; });
const FLAG = new Set("AR CN DK FR IN MA NO PK RS UA US".split(" "));
const C = T.filter((c) => un[c.cc]).map((c) => [c.cc, c.name, c.cid, un[c.cc], c.fame, c.cont, FLAG.has(c.cc) ? 1 : 0]);
const X = JSON.parse(fs.readFileSync(S + "cross_data.json", "utf8"));
const iso = X.c.map((c) => c[0]), bad = new Set(X.x.map((x) => [x[0], x[1]].sort().join("-")));
const E = X.e.filter((e) => !bad.has([e[0], e[1]].sort().join("-")));
const dr = fs.readFileSync(R + "dead-reckoning.html", "utf8");
const cities = JSON.parse(dr.match(/DR_PLACES=(\[.*?\]);/s)[1]).filter((p) => p[6] <= 2).map((p) => [p[0], p[1], p[2], p[3], "city"]);
const pack = JSON.parse(dr.match(/DR_PACK1=(\[.*?\]);/s)[1]).filter((p) => p[5] <= 2).map((p) => [p[0], p[1], p[2], p[3], p[4], p[7]]);
global.window = {}; eval(fs.readFileSync(R + "history-data.js", "utf8")); const H = window.MX_HIST, nw = new Set(H.nw), z = new Set(H.z);
const F = H.F.map((f, i) => [f[0], f[1], z.has(i) ? 1 : 0]).map((f, i) => (nw.has(i) ? null : f));
const fam = [...fat.matchAll(/\["(Name a [^"]+)","([A-Z ]+)"\]/g)].map((m) => [m[1], m[2].split(" ")]);
const out = { C, E, P: cities.concat(pack), F, FAM: fam };
fs.writeFileSync(R + "daily-data.js", "// Daily Voyage data, built from the site's own tables (country areas: UN Demographic Yearbook 2023; borders: Crossings; places: Dead Reckoning; events: Logbook; prompts: Fathoms content pack 1). Do not edit by hand.\nwindow.DV=" + JSON.stringify(out) + ";\n");
console.log("countries", C.length, "edges", E.length, "places", out.P.length, "facts", F.filter(Boolean).length, "families", fam.length, "bytes", fs.statSync(R + "daily-data.js").size);
