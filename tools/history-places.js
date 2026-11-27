// Builds history-places.js: the places Logbook's questions and events name that are not countries, with where they are
// and the country they are in today, so a question's map can mark every place it names (scorecard 4). Coordinates come
// only from the site's own tables (Dead Reckoning, Daily Voyage, Bigger?), plus the short list below, checked by hand.
// Run: node tools/history-places.js
const fs = require("fs"), path = require("path"), R = path.join(__dirname, "..");
global.window = {};
require(path.join(R, "history-data.js")); require(path.join(R, "daily-data.js")); require(path.join(R, "bigger-data.js"));
const H = window.MX_HIST, out = {};
const dr = JSON.parse(fs.readFileSync(path.join(R, "dead-reckoning.html"), "utf8").match(/DR_PLACES *= *(\[[\s\S]*?\]\]);/)[1]);
const table = {};
dr.forEach((a) => { table[a[0]] = [a[2], a[3], a[1]]; });
window.DV.P.forEach((a) => { if (!table[a[0]] && a[1]) table[a[0]] = [a[2], a[3], a[1]]; });
window.BQ_DATA.city.forEach((a) => { if (!table[a[0]]) table[a[0]] = [a[3], a[4], a[1]]; });
// by hand (Wikipedia coordinates, to two decimals)
const EXTRA = { Baltiysk: [54.65, 19.92, "Russia"] };
Object.assign(table, EXTRA);
const texts = [];
H.F.forEach((f) => f && texts.push(f[1]));
H.Q.forEach((q) => q && texts.push(q[1], String(q[4] || ""), String(q[5] || "")));
(H.T || []).forEach((t) => typeof t === "string" && texts.push(t));
const all = texts.join(" \n ");
Object.keys(table).filter((n) => n.length > 3).forEach((n) => {
  const re = new RegExp("(^|[^\\p{L}])" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^\\p{L}])", "u");
  if (re.test(all)) out[n] = table[n];
});
fs.writeFileSync(path.join(R, "history-places.js"), "// Written by tools/history-places.js: places Logbook names, [lat, lon, country today].\nwindow.MXPLACES=" + JSON.stringify(out) + ";\n");
console.log(Object.keys(out).length, "places;", Object.keys(out).slice(0, 40).join(", "));
