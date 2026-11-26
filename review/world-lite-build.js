// Builds world-lite.js from world.js: the same countries, ids and shared borders, with fewer points per line
// (Visvalingam-Whyatt on every arc; endpoints kept, rings keep at least 4 points so no country disappears).
// usage: node review/world-lite-build.js   (run again whenever world.js changes)
const fs = require("fs"), zlib = require("zlib"); const R = "/home/user/mapelago/";
const src = fs.readFileSync(R + "world.js", "utf8"); const i = src.indexOf("{"), j = src.lastIndexOf("}");
const head = src.slice(0, i), tail = src.slice(j + 1), T = JSON.parse(src.slice(i, j + 1));
const TH = +process.argv[2] || 3000, Q = +process.argv[3] || 4;
let before = 0, after = 0;
T.arcs = T.arcs.map((arc) => {
  let x = 0, y = 0; const pts = arc.map((d) => [x += d[0], y += d[1]]); before += pts.length;
  const closed = pts.length > 3 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1], min = closed ? 5 : 2;
  const keep = pts.map(() => true), area = (a, b, c) => Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
  let n = pts.length;
  for (;;) { if (n <= min) break; let best = -1, ba = Infinity, prev = 0;
    for (let k = 1; k < pts.length - 1; k++) { if (!keep[k]) continue; let nx = k + 1; while (!keep[nx]) nx++; const a = area(pts[prev], pts[k], pts[nx]); if (a < ba) { ba = a; best = k; } prev = k; }
    if (best < 0 || ba >= TH) break; keep[best] = false; n--; }
  let out = pts.filter((_, k) => keep[k]).map((p) => [Math.round(p[0] / Q), Math.round(p[1] / Q)]);
  out = out.filter((p, k) => k === 0 || k === out.length - 1 || p[0] !== out[k - 1][0] || p[1] !== out[k - 1][1]); after += out.length;
  let px = 0, py = 0; return out.map((p) => { const d = [p[0] - px, p[1] - py]; px = p[0]; py = p[1]; return d; });
});
if (Q !== 1 && T.transform) { T.transform.scale = T.transform.scale.map((s) => s * Q); }
const text = "// A lighter copy of world.js (same countries and borders, fewer points), built by a script; used where the map must appear fast.\n" + head + JSON.stringify(T) + tail;
fs.writeFileSync(process.argv[4] || R + "world-lite.js", text);
console.log("points", before, "->", after, "bytes", src.length, "->", text.length, "gzip", zlib.gzipSync(src).length, "->", zlib.gzipSync(text).length);
