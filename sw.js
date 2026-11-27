// Pages come fresh from the network when there is one, and from the saved copy when there isn't.
// Everything else (map data, fonts, icons) is answered from the saved copy at once and refreshed behind the scenes.
// On install every game is saved, so every game works offline after the first visit to any of them.
// Release checklist: change this version here AND in every ?v= in the pages (tests/run.js checks they match).
const C = "mapelago-0.15.60";
const PRE = [
  "./", "city.html", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html", "crossings.html", "history.html",
  "dead-reckoning.html", "dead-reckoning.js?v=0.15.60",
  "daily.html", "daily.js?v=0.15.60", "daily-data.js?v=0.15.60", "un-cities.js?v=0.15.60",
  "ballast.html", "ballast.js?v=0.15.60", "ballast-data.js?v=0.15.60", "vendor/matter.min.js?v=0.15.60", "vendor/decomp.min.js?v=0.15.60",
  "offline.html", "analytics.js?v=0.15.60", "copy.js?v=0.15.60", "history.js?v=0.15.60", "history-data.js?v=0.15.60", "site.js?v=0.15.60", "extras.js?v=0.15.60", "shapes.js?v=0.15.60", "world.js?v=0.15.60", "world-lite.js?v=0.15.60", "site.css", "favicon.svg", "icon-180.png", "manifest.webmanifest",
  "ink.css?v=0.15.60", "ink/frame.svg", "ink/frame-ink.svg", "ink/blots.svg", "ink/hatch.svg", "ink/paper.jpg", "ink/art/city.svg", "ink/art/country.svg", "ink/art/bigger.svg", "ink/art/bigcountry.svg", "ink/art/voyage.svg", "ink/art/fathoms.svg", "ink/art/stamps.svg", "ink/art/crossings.svg", "ink/art/reckoning.svg", "ink/art/ballast.svg", "ink/art/history.svg", "ink/art/daily.svg", "ink/art/home.svg",
  "fonts/anton-latin-400-normal.woff2", "fonts/patrick-hand-sc-latin-400-normal.woff2", "fonts/patrick-hand-latin-400-normal.woff2",
  "fonts/overpass-latin-400-normal.woff2", "fonts/overpass-latin-600-normal.woff2",
  "fonts/overpass-latin-800-normal.woff2", "fonts/overpass-latin-800-italic.woff2"
];
self.addEventListener("install", (e) => {
  self.skipWaiting();
  // One file failing (a flaky connection) must not stop the rest from being saved.
  e.waitUntil(caches.open(C).then((c) => Promise.all(PRE.map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => {})))));
});
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const r = e.request;
  // Only this site's own files are ever saved. Other hosts (such as the visit-counting beacon, when it is switched on) pass straight through.
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(C).then((c) => c.put(r, copy)); } return res; })
      .catch(() => caches.match(r, { ignoreSearch: true }).then((hit) => hit || caches.match("offline.html"))));
    return;
  }
  e.respondWith(caches.open(C).then((c) => c.match(r).then((hit) => { const net = fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit); return hit || net; })));
});
