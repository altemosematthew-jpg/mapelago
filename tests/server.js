// A tiny static server for the site folder (one level up), so the tests need nothing else.
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json", ".webmanifest": "application/manifest+json", ".txt": "text/plain", ".md": "text/plain" };
module.exports = function start(opt) {
  const zlib = require("zlib");
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      let f = path.join(ROOT, p);
      // like GitHub Pages and the Cloudflare previews, /bigger serves bigger.html
      if (!path.extname(f) && !fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
      const type = TYPES[path.extname(f)] || "application/octet-stream";
      // the speed test serves text compressed, as the live host does
      if (opt && opt.gzip && /text|json|svg|manifest/.test(type)) { res.writeHead(200, { "Content-Type": type, "Content-Encoding": "gzip" }); res.end(zlib.gzipSync(fs.readFileSync(f))); return; }
      res.writeHead(200, { "Content-Type": type });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => resolve({ url: `http://localhost:${srv.address().port}/`, close: () => srv.close() }));
  });
};
