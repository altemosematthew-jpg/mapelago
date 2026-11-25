// Draws og-dead-reckoning.png (1200 x 630) in the same layout as the other games' share cards.
// Run: node tools/dead-reckoning-og.js   (needs Playwright, as the tests do)
const { chromium } = require("playwright"), fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const turtle = /var TURTLE = '([^']+)'/.exec(fs.readFileSync(path.join(ROOT, "site.js"), "utf8"))[1].replace('width="200" height="200"', 'width="300" height="300"');
const font = (w, s) => `@font-face{font-family:O;font-weight:${w};font-style:${s};src:url(file://${ROOT}/fonts/overpass-latin-${w}-${s}.woff2)}`;
const tile = (bg, inner) => `<div class="t" style="background:${bg}">${inner}</div>`;
const html = `<!DOCTYPE html><html><head><style>${font(400, "normal")}${font(600, "normal")}${font(800, "normal")}${font(800, "italic")}
body{margin:0;width:1200px;height:630px;background:#e6f1f7;font-family:O,sans-serif}
.card{position:absolute;left:30px;top:30px;width:1134px;height:564px;border:6px solid #000;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='65' height='65'%3E%3Cpath d='M64.5 0V65M0 64.5H65' fill='none' stroke='%23e8f1f6'/%3E%3C/svg%3E");overflow:hidden}
.tu{position:absolute;left:90px;top:80px}
h1{position:absolute;left:428px;top:62px;margin:0;font:italic 800 96px O;letter-spacing:-2px}
.by{position:absolute;left:428px;top:178px;color:#b4237d;font:800 27px O}
.tag{position:absolute;left:428px;top:222px;color:#3d4a52;font:600 40px O}
.row{position:absolute;left:424px;top:308px;display:flex;gap:16px}
.t{width:76px;height:68px;border:4px solid #000;border-bottom-width:9px;border-radius:12px;display:grid;place-items:center;font:italic 800 30px O}
.sea{position:absolute;left:-10px;right:-10px;bottom:-10px;height:130px;background:#dcedf5;border-top:2px dashed #a9d3e8;border-radius:50% 50% 0 0/30px 30px 0 0}
.foot{position:absolute;left:70px;bottom:44px;font:800 30px O}
</style></head><body><div class="card"><div class="tu">${turtle}</div><h1>Dead Reckoning</h1><div class="by">Mapelago · a free daily game</div><div class="tag">Tap the map. Closer scores more.</div>
<div class="row">${tile("#b4237d", '<svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14" fill="none" stroke="#fff" stroke-width="4"/><circle cx="17" cy="17" r="5" fill="#fff"/></svg>')}${tile("#9fc98b", "")}${tile("#f3d98a", "")}${tile("#a9d3e8", "")}${tile("#fff", "")}</div>
<div class="sea"></div><div class="foot">Five places a day on a blank world map. A perfect day is 1,000.</div></div></body></html>`;
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const f = path.join(__dirname, ".og.html"); fs.writeFileSync(f, html);
  await p.goto("file://" + f); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(ROOT, "og-dead-reckoning.png") });
  fs.unlinkSync(f); await b.close(); console.log("og-dead-reckoning.png written");
})();
