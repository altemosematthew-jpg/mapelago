# Dead Reckoning: merge notes

Dead Reckoning is the ninth daily game: five places a day, tapped on a blank world map, scored by great-circle
distance. Built on branch `claude/zealous-allen-u0n2ro` from main at `db566cc` (release 0.15.5).

## How to merge

1. Merge the branch. The game's own files can't clash with anything (they are new).
2. Run the patch for the shared files. It is idempotent: it checks each edit first and skips any already in place,
   so it is safe to run after a merge that already brought some of them in, or twice.

       python3 review/dead-reckoning-patch.py

   It prints `added`, `already there` or `NOT FOUND` for each edit and exits 1 if anything was not found
   (an anchor moved in another release; make that edit by hand from the list below).
3. Run the tests: `cd tests && npm test`. Dead Reckoning's checks are section 10 and the clean-load list.
4. At release, the usual version bump (`sw.js` `C` and every `?v=`) must include `dead-reckoning.html`, which loads
   `copy.js`, `site.js`, `world.js`, `dead-reckoning.js` and `analytics.js` with `?v=0.15.5`, and the
   `dead-reckoning.js?v=` entry in the `sw.js` PRE list. A global replace of `?v=0.15.5` catches all of them.

## New files (no conflicts possible)

| File | What |
|---|---|
| `dead-reckoning.html` | The page. Head and looks copied from `bigger.html`; the place list sits between `// places:start` and `// places:end`. |
| `dead-reckoning.js` | The game: map, scoring, daily schedule, practice, stats. Readable source, not built. |
| `og-dead-reckoning.png` | Share card, 1200 × 630, same layout as the others. Redraw with `node tools/dead-reckoning-og.js`. |
| `tools/dead-reckoning-data.js` | Rebuilds the place list inside `dead-reckoning.html` from `index.html`, `bigger.html`, `country.html` and `data/countries.txt`. |
| `tools/dead-reckoning-og.js` | Draws the share card. |
| `tests/dead-reckoning.test.js` | The game's tests, called from `tests/run.js`. |
| `review/dead-reckoning-patch.py` | The shared-file patch. |
| `review/dead-reckoning-merge-notes.md` | This file. |

## Every shared-file change (all made by the patch script)

| File | Change |
|---|---|
| `site.js` | `GAMES`: new entry `{ id: "reckoning", name: "Dead Reckoning", key: "dailycity:reckoning:v1", url: "dead-reckoning.html", icon: 📍 }` after Crossings. This is what puts it in the front page's "Today's games" cards, every game page's cards, the "Your streaks" sheet, the streak-at-risk note and the save code. |
| `site.js` | `BEAT`: `reckoning: { code: "dr", max: 1000, modes: 1 }`, the new beat-my-score game code (`#b-dr-<No.>-0-<score>`). |
| `site.js` | `UNIT`: `reckoning` reads "828 of 1,000" in a friend's challenge note. |
| `site.js` | `todayText`: Dead Reckoning's total in "Copy today's results". |
| `site.js` | `perfect`: confetti on 1,000 of 1,000. |
| `site.js` | `addImageButton`: not added for Dead Reckoning (its share line doesn't use the 🐢 layout the generic image expects). |
| `index.html`, `country.html`, `bigger.html`, `bigger-country.html`, `voyage.html`, `fathoms.html`, `stamps.html`, `crossings.html`, `404.html`, `offline.html`, `about/index.html`, `how-to-play/index.html` | One line: `<a href="…dead-reckoning.html">Dead Reckoning</a>` after Crossings in the "Daily games" menu. Inside the built pages it sits in the footer HTML, outside the game script. |
| `games/index.html` | A Dead Reckoning section before "Streaks"; title and descriptions say nine games instead of eight. |
| `how-to-play/index.html` | A "Dead Reckoning, the blank map" paragraph after Crossings. |
| `about/index.html` | "Nine games a day … Crossings and Dead Reckoning." |
| `sw.js` | PRE list: `"dead-reckoning.html"` and `"dead-reckoning.js?v=<version>"` after `crossings.html`. |
| `sitemap.xml` | `https://mapelago.com/dead-reckoning.html`. |
| `tests/run.js` | `dead-reckoning.html` in the clean-load list (section 1); section 10 calls `tests/dead-reckoning.test.js`; the About-page check now expects nine games including Dead Reckoning ("Nine games a day"). |

Not changed: `copy.js` / `copy/copy.json` (the card text falls back to `GAMES.about`; add a `cards.reckoning`
line there if you want house copy), `manifest.webmanifest`, `hints.html`, `privacy/`. No other game's script or
data was touched, so no other game's puzzles change (the golden check in `tests/run.js` confirms it).

## The game, for review

- **Numbering:** No. 1 is 14 November 2026 at local midnight, the same rule as the other games, so 25 November is No. 12.
- **Scoring:** each place scores `round(100 × exp(−d / 1100))` with `d` the great-circle distance in km:
  0 km 100, 50 km 96, 250 km 80, 500 km 63, 1,000 km 40, 2,500 km 10, 5,000 km 1. Places count ×1, ×1.5, ×2,
  ×2.5 and ×3, so a perfect day is exactly 1,000.
- **Share text** (no place or country in it; tests check this):

      Dead Reckoning No. 12: 828 of 1,000 🎯🟩🟨🟧🟥
      Beat my score: mapelago.com/dead-reckoning.html#b-dr-12-0-828

  Squares by distance: 🎯 under 50 km, 🟩 under 250, 🟨 under 750, 🟧 under 2,000, 🟥 farther.
- **Places (633):** from Mystery city's list (`index.html`), Bigger city?'s list (`bigger.html`), with capital status also checked against the capitals named in
  the country table (which has no capital coordinates of its own), keeping only places whose country is in `data/countries.txt` (that is where the facts come from).
  Coordinates and populations are the lists' own. Left out: everything review/data-changes.md flags as a district
  or a likely wrong entry (Queens, Kowloon, Çankaya, Gustavo A. Madero, Pasragad Branch, Budta, Camayenne, Chakwama,
  Kampung Baru Subang, Guli, Tanda, Malingao, Nowrangapur, Nur-Sultan), other borough-style districts (Brooklyn,
  Istanbul and Ankara districts, Ecatepec and so on), Hong Kong, Macao and Puerto Rico (not in the country table),
  and names without a common English spelling (accented names are kept only when the plain-English form is
  standard: Bogota, Sao Paulo, Krakow, Zurich, Montreal, Cologne…).
- **Difficulty:** a capital counts as five times its population. Round 5 is small capitals (under 500,000 and not
  famous) and cities under 250,000 (83 places). Rounds 1–4 split the rest by that fame figure: 110, 130, 140 and
  170 places. New Delhi and Washington, D.C. are put in round 1 by hand, because the lists give their core-city
  population only.
- **Known limit:** the repo has no coordinates for the smallest island capitals (Funafuti, Valletta, Reykjavik and
  others are not in either city list), so round 5 has small capitals and little-known cities rather than remote
  islands. Adding source-checked capital coordinates to the data would let round 5 include them.
- **Daily set:** worked out day by day from No. 1 with a fixed seed, so a number always gets the same five.
  No place comes back within 60 days; no two places on one day share a country; no place is in the same country as
  that day's Mystery city answer. The tests check 800 days and fingerprint No. 12. Changing the place list changes
  future days, so regenerate it only from the day after a release that announces it.
- **Facts:** two lines from the site's own data: capital or city and population (from the lists), then
  island/landlocked, highest point or currency (from `data/countries.txt`, the source-checked pack).
- **Saves:** `dailycity:reckoning:v1`, `{ results: { "<No.>": { total, score, g: [[lat, lon] ×5], b: "🎯🟩…" } }, game }`.
  `score` repeats `total` so anything that reads `score` works. Practice is held in memory only and never saved.
- **Map:** country outlines from `world.js` drawn as one SVG path, equirectangular, no labels. Tap places the pin,
  "Lock in my pin" confirms. Drag pans, pinch and wheel zoom, + / − / whole-world buttons (44 px). Keyboard as in
  Mystery city: arrow keys move the pin (Shift for 4× steps), Enter locks it in and goes on, + and − zoom.
- **Layouts:** phone (375 px): map full width, 5 : 4. Tablet: 16 : 10. Desktop (≥ 900 px): map and a 340 px side column
  in a 1,180 px page, map 16 : 9.4 (about 795 × 465 px at 1440). Every look sets its colours through the shared CSS variables (`--sea`, `--land`,
  `--land-line`, `--accent`…); the tests load all six looks at both widths.
