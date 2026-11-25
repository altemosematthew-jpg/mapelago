// Pages come fresh from the network when there is one, and from the saved copy when there isn't.
// Everything else (map data, fonts, icons) is answered from the saved copy at once and refreshed behind the scenes.
// On install every game is saved, so all seven work offline after the first visit to any of them.
const C = "mapelago-0.13.0";
const PRE = [
  "./", "country.html", "bigger.html", "bigger-country.html", "voyage.html", "fathoms.html", "stamps.html",
  "offline.html", "site.js", "extras.js", "shapes.js", "world.js", "site.css", "favicon.svg", "icon-180.png", "manifest.webmanifest",
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
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(C).then((c) => c.put(r, copy)); } return res; })
      .catch(() => caches.match(r, { ignoreSearch: true }).then((hit) => hit || caches.match("offline.html"))));
    return;
  }
  e.respondWith(caches.open(C).then((c) => c.match(r).then((hit) => { const net = fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit); return hit || net; })));
});
