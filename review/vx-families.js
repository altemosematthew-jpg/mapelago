// Voyage and Stamps: question families from the country pack (data/countries.txt), and endless practice.
// Source for the block review/vx-pack.js copies into voyage.html and stamps.html. Edit here, then run: node review/vx-pack.js
(function () {
  "use strict";
  var P = window.VXPACK || {};
  var THE = /^(Philippines|Netherlands|United States|United Kingdom|United Arab Emirates|Bahamas|Gambia|Maldives|Marshall Islands|Solomon Islands|Comoros|Seychelles|Central African Republic|Dominican Republic|Democratic Republic of the Congo|Republic of the Congo)$/;
  function the(n) { return THE.test(n) ? "the " + n : n; }
  function The(n) { return THE.test(n) ? "The " + n : n; }
  // A small seeded random number source, so everyone gets the same daily questions.
  function rng(seed) {
    var t = seed >>> 0;
    return function () {
      t = (t + 0x6d2b79f5) >>> 0;
      var x = Math.imul(t ^ (t >>> 15), 1 | t);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(a, r) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a, r) { return a[Math.floor(r() * a.length)]; }
  function fact(c) { return P[c.name] || {}; }
  var CASPIAN = /^(KZ|AZ|TM)$/; // landlocked or not depends on whether the Caspian counts as a sea, so never asked either way
  var sameArea = function (a, b) { return a.continent.split(" and ").some(function (x) { return b.continent.indexOf(x) >= 0; }); };

  // Three wrong options: countries for which pred() holds. Harder questions take them from the same part of the world;
  // easier ones from better-known countries.
  function others(c, T, r, pred, hard) {
    var all = T.filter(function (x) { return x.cc !== c.cc && pred(x); });
    var near = all.filter(function (x) { return sameArea(x, c); });
    var known = all.slice().sort(function (a, b) { return b.fame - a.fame; }).slice(0, 70);
    var from = hard && near.length >= 3 ? near : !hard && known.length >= 3 ? known : all;
    return shuffle(from.slice(), r).slice(0, 3).map(function (x) { return x.name; });
  }

  // Each family: label (Voyage badge and Stamps wheel), ok(country) says whether it can be asked about,
  // make() returns { ask, answer, others, note }. answer and others are country names.
  var FAM = {
    money: {
      label: "Money", hard: 0.25,
      ok: function (c) { return !!fact(c).m; },
      make: function (c, T, r, hard) {
        var m = fact(c).m;
        return { ask: "The " + m + " is the currency of which country?", answer: c.name,
          others: others(c, T, r, function (x) { return !!P[x.name] && x.name !== "Bulgaria" && x.name !== "Zimbabwe"; }, hard),
          note: "The " + m + " is the currency of " + the(c.name) + "." };
      },
    },
    drive: {
      label: "Driving", hard: 0.1,
      ok: function (c) { return !!fact(c).l; },
      make: function (c, T, r, hard) {
        return { ask: "Which of these countries drives on the left?", answer: c.name,
          others: others(c, T, r, function (x) { return !!fact(x).r; }, hard),
          note: The(c.name) + " drives on the left. The other three drive on the right." };
      },
    },
    peak: {
      label: "Peaks", hard: 0.3,
      ok: function (c) { return !!fact(c).p; },
      make: function (c, T, r, hard) {
        var f = fact(c);
        return { ask: f.p + " is the highest point of which country?", answer: c.name,
          others: others(c, T, r, function (x) { return !!fact(x).p; }, hard),
          note: f.p + ", " + f.h.toLocaleString("en-US") + " m, is the highest point of " + the(c.name) + "." };
      },
    },
    call: {
      label: "Phone codes", hard: 0.3,
      ok: function (c) { return !!fact(c).c; },
      make: function (c, T, r, hard) {
        var code = fact(c).c;
        return { ask: "Phone numbers in which country start with " + code + "?", answer: c.name,
          others: others(c, T, r, function (x) { return !!fact(x).c; }, hard),
          note: code + " is the international calling code for " + the(c.name) + "." };
      },
    },
    web: {
      label: "Web", hard: 0.1,
      ok: function (c) { return !!fact(c).w; },
      make: function (c, T, r, hard) {
        var w = fact(c).w, l = w.charAt(1);
        // Countries whose name starts with the same letter make the best wrong options
        var o = others(c, T, r, function (x) { return !!fact(x).w && x.name.charAt(0).toLowerCase() === l; }, false);
        if (o.length < 3) o = o.concat(others(c, T, r, function (x) { return !!fact(x).w && o.indexOf(x.name) < 0; }, hard)).slice(0, 3);
        return { ask: "Which country's web addresses end in " + w + "?", answer: c.name, others: o,
          note: w + " is the internet domain of " + the(c.name) + "." };
      },
    },
    inland: {
      label: "Landlocked", hard: 0.05,
      ok: function (c) { return c.coast === "landlocked" && !CASPIAN.test(c.cc); },
      make: function (c, T, r, hard) {
        return { ask: "Which of these countries is landlocked?", answer: c.name,
          others: others(c, T, r, function (x) { return x.coast !== "landlocked" && !CASPIAN.test(x.cc); }, hard),
          note: The(c.name) + " is landlocked: it has no sea coast." };
      },
    },
  };

  // Practice best streaks live in their own save, never in a game's daily save.
  var PKEY = "dailycity:practice:v1";
  function best(game, v) {
    try {
      var s = JSON.parse(localStorage.getItem(PKEY)) || {};
      if (!s.results || typeof s.results !== "object") s.results = {};
      if (v === undefined) return (s[game] && s[game].best) || 0;
      s[game] = { best: v };
      localStorage.setItem(PKEY, JSON.stringify(s));
    } catch (e) { return 0; }
  }

  window.VX = { FROM: 14, FAM: FAM, the: the, The: The, rng: rng, shuffle: shuffle, pick: pick, fact: fact, others: others, best: best, PKEY: PKEY };
})();
