// Visitor counting with Cloudflare Web Analytics: cookie-free, nothing stored on the device, no fingerprinting.
// OFF while token is empty: nothing loads, and the privacy page shows its "no visit counting" wording.
// To switch on: paste the site token from Cloudflare below, set `since` to the date it goes live
// (shown as "Last updated" on the privacy page), and bump the release version as for any release.
// The same switch picks the privacy page's wording, so the page can't say one thing while the site does another.
(function () {
  "use strict";
  var ANALYTICS = { token: "", since: "" };

  var on = typeof ANALYTICS.token === "string" && /^[0-9a-f]{32}$/i.test(ANALYTICS.token);
  // Only the real site is counted: never localhost, the *.pages.dev previews or anything else,
  // and never a browser that asks not to be tracked.
  function allowed(host, nav, win) {
    if (host !== "mapelago.com" && host !== "www.mapelago.com") return false;
    nav = nav || {}; win = win || {};
    if (nav.globalPrivacyControl === true) return false;
    if (nav.doNotTrack === "1" || nav.doNotTrack === "yes" || win.doNotTrack === "1" || nav.msDoNotTrack === "1") return false;
    return true;
  }
  window.MXANALYTICS = { on: on, since: ANALYTICS.since, allowed: allowed };

  if (on && allowed(location.hostname, navigator, window)) {
    var s = document.createElement("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: ANALYTICS.token, spa: false }));
    document.head.appendChild(s);
  }

  // The privacy page holds both wordings; show the one that matches the switch.
  function wording() {
    var blocks = document.querySelectorAll("[data-analytics]");
    Array.prototype.forEach.call(blocks, function (el) { el.hidden = el.getAttribute("data-analytics") !== (on ? "on" : "off"); });
    var d = document.getElementById("analyticsSince");
    if (d) d.textContent = ANALYTICS.since || "the day visit counting was switched on";
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wording); else wording();
})();
