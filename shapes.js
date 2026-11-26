// Mapelago shapes: draws two countries side by side at the same scale (Bigger country?).
// The world outlines (world.js) load when the browser is idle, so the first paint stays fast.
// If they haven't arrived yet, the reveal simply shows the numbers and bars.
(function () {
  "use strict";
  var loading = false;
  function load() {
    if (window.__WORLD || loading) return;
    loading = true;
    var s = document.createElement("script");
    s.src = "world.js?v=0.15.37"; s.async = true;
    document.head.appendChild(s);
  }
  (window.requestIdleCallback || function (f) { setTimeout(f, 1500); })(load);

  var arcsCache = null;
  function arcs() {
    if (arcsCache) return arcsCache;
    var W = window.__WORLD, T = W.transform;
    arcsCache = W.arcs.map(function (a) {
      var x = 0, y = 0;
      return a.map(function (p) { x += p[0]; y += p[1]; return T ? [x * T.scale[0] + T.translate[0], y * T.scale[1] + T.translate[1]] : [x, y]; });
    });
    return arcsCache;
  }
  function ring(ids) {
    var A = arcs(), out = [];
    ids.forEach(function (i) { var a = i >= 0 ? A[i] : A[~i].slice().reverse(); out = out.concat(out.length ? a.slice(1) : a); });
    return out;
  }
  // Outer rings of a country, in kilometres around its own middle (so Russia and Fiji don't split at 180 degrees).
  function rings(cid) {
    var W = window.__WORLD, g = null;
    // the first match: a few ids are shared with small territories (036 is Australia, then Ashmore and Cartier)
    W.objects.countries.geometries.forEach(function (x) { if (Number(x.id) === cid && !g) g = x; });
    if (!g) return null;
    var polys = g.type === "Polygon" ? [g.arcs] : g.type === "MultiPolygon" ? g.arcs : [];
    var rs = polys.map(function (p) { return ring(p[0]); });
    var big = rs.reduce(function (m, r) { return r.length > m.length ? r : m; }, rs[0]);
    var lon0 = big.reduce(function (s, p) { return s + p[0]; }, 0) / big.length;
    var lat0 = big.reduce(function (s, p) { return s + p[1]; }, 0) / big.length;
    var k = 111.32, cos = Math.cos(lat0 * Math.PI / 180);
    return rs.map(function (r) {
      return r.map(function (p) { var dl = ((p[0] - lon0 + 540) % 360) - 180; return [dl * k * cos, -(p[1] - lat0) * k]; });
    }).filter(function (r) {
      // keep the main shape and anything within 3,000 km of it (drop far-off territories)
      return r.some(function (p) { return Math.abs(p[0]) < 3000 && Math.abs(p[1]) < 3000; });
    });
  }
  function box(rs) {
    var b = [Infinity, Infinity, -Infinity, -Infinity];
    rs.forEach(function (r) { r.forEach(function (p) { b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]); }); });
    return b;
  }
  // Draw both countries into their cards with one shared km-per-pixel scale.
  function pair(cids, cards) {
    if (!window.__WORLD) return false;
    var shapes = cids.map(rings);
    if (shapes.some(function (s) { return !s || !s.length; })) return false;
    var boxes = shapes.map(box);
    var W = 120, H = 84;
    var scale = Math.min.apply(null, boxes.map(function (b) { return Math.min(W / Math.max(1, b[2] - b[0]), H / Math.max(1, b[3] - b[1])); }));
    cards.forEach(function (card, i) {
      var b = boxes[i], cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
      var d = shapes[i].map(function (r) {
        return "M" + r.map(function (p) { return ((p[0] - cx) * scale + W / 2).toFixed(1) + " " + ((p[1] - cy) * scale + H / 2).toFixed(1); }).join("L") + "Z";
      }).join("");
      var tiny = (b[2] - b[0]) * scale < 3;
      var svg = '<svg class="shape" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">'
        + (tiny ? '<circle cx="' + W / 2 + '" cy="' + H / 2 + '" r="2.5"/>' : '<path d="' + d + '"/>') + "</svg>";
      var old = card.querySelector(".shape");
      if (old) old.remove();
      card.insertAdjacentHTML("beforeend", svg);
    });
    return true;
  }
  window.MXShapes = { pair: pair, load: load };
})();
