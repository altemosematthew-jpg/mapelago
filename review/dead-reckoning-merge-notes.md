# Dead Reckoning: merge notes

Dead Reckoning is a new daily game: five places a day, tapped on a blank world map, scored by great-circle
distance. It becomes the tenth game once Logbook (0.15.8, `history.html`) is out, the ninth before that.
Branch `claude/zealous-allen-u0n2ro`; main (`claude/charming-bardeen-967w66`) at **0.15.10** (`9ac9cda`) is already merged
into it, with the patch re-applied on top, so merging the branch into 0.15.10 brings no conflicts. The version
is not bumped here; `dead-reckoning.html`'s `?v=` follows `sw.js` (0.15.10).

## How to merge

1. Merge the branch. If main has moved on past 0.15.10, the shared files may conflict: take **main's**
   version of every shared file listed below (`git checkout --theirs` / `--ours` as appropriate, i.e. the side
   that is main), then run step 2, which puts Dead Reckoning back in.
2. Run the patch for the shared files from anywhere:

       python3 review/dead-reckoning-patch.py

   It is idempotent: each edit is checked first and skipped when already in place, so running it twice, or after a
   merge that kept some of the edits, is safe. Nothing in it assumes which game came last: links and entries go
   after the last game already listed (Logbook if `history.html` is in the menu, otherwise Crossings), and the
   "ten games" wording is worked out from the number of games in `site.js` after the edit (the `GAMES` array plus
   every `GAMES.push`).
   It prints `added`, `already there` or `NOT FOUND` for each edit and exits 1 if anything was not found.
3. Run the tests: `cd tests && npm test` (`run.js`, then Logbook's `history.js`). Dead Reckoning's checks run just
   before the end of `run.js`. See the end of this file for the latest counts on this branch.
4. At release, bump the version as usual. The patch already set `dead-reckoning.html`'s `?v=` to the `sw.js`
   version at the time it ran, and `tests/run.js` section 1b now checks that page too. A global replace of the old
   `?v=` value covers it, along with `dead-reckoning.js?v=` in the `sw.js` PRE list.

Checked on clean copies of 0.15.5, 0.15.7, 0.15.8 and 0.15.10: every edit applies once and a second run adds nothing. On
0.15.8, Dead Reckoning goes after Logbook everywhere (menus, cards, streaks sheet, lists) and every count reads "ten".

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

"After the last game" means after Logbook when it is there, otherwise after Crossings. "N" is the number of games
in `site.js` once Dead Reckoning is added (ten with Logbook).

| File | Change |
|---|---|
| `site.js` | A `// ---------- Dead Reckoning: start/end ----------` block right after Logbook's block, laid out like it: `GAMES.push({ id: "reckoning", name: "Dead Reckoning", key: "dailycity:reckoning:v1", url: "dead-reckoning.html", icon: 📍 })` and `UNIT.reckoning` ("828 of 1,000" in a friend's challenge note). This puts it after Logbook in the front page's "Today's games" cards, every game page's cards, the "Your streaks" sheet, the streak-at-risk note and the save code. |
| `site.js` | `BEAT` (after `history`): `reckoning: { code: "dr", max: 1000, modes: 1 }`, the new beat-my-score game code (`#b-dr-<No.>-0-<score>`). |
| `site.js` | `todayText`: Dead Reckoning's total in "Copy today's results". |
| `site.js` | `perfect`: confetti on 1,000 of 1,000. |
| `site.js` | `addImageButton`: not added for Dead Reckoning (its share line doesn't use the 🐢 layout the generic image expects). |
| `index.html`, `country.html`, `bigger.html`, `bigger-country.html`, `voyage.html`, `fathoms.html`, `stamps.html`, `crossings.html`, `history.html` (when present), `404.html`, `offline.html`, `about/index.html`, `how-to-play/index.html` | One line, `<a href="…dead-reckoning.html">Dead Reckoning</a>`, after the last game in the "Daily games" menu. In the built pages it sits in the footer HTML, outside the game script. |
| `index.html` | Search data (JSON-LD, from 0.15.7): "N free daily geography games: …, Dead Reckoning." |
| `manifest.webmanifest` | Description: "N free daily geography games: … and tap places on a blank map." The shortcuts are left as they are. |
| `games/index.html` | A Dead Reckoning section before "Streaks"; title and descriptions say N games and add "blank-map pins" to the list. |
| `how-to-play/index.html` | A "Dead Reckoning, the blank map" section just before "The quick games". |
| `about/index.html` | Lede: "N games a day … and Dead Reckoning." |
| `dead-reckoning.html` | Script addresses take the `sw.js` version. |
| `sw.js` | PRE list: `"dead-reckoning.html"` and `"dead-reckoning.js?v=<version>"` on the line before `offline.html`. |
| `sitemap.xml` | `https://mapelago.com/dead-reckoning.html`. |
| `tests/run.js` | `dead-reckoning.html` added after the last game in every page list that names the games (clean load, the cache-version check 1b, the landmarks check 21); Dead Reckoning's save in section 24's list of every game's save (so "last game left" still holds when all the others are played); a call to `tests/dead-reckoning.test.js` before the end; the About-page check and the home search-data check (22) also name Dead Reckoning; their counts and test names say N. |

Not changed: `copy/copy.json` and `copy.js` (generated from it by `copy/apply.py`): the card text falls back to
`GAMES.about`; add `reckoning` lines there if you want house copy, the manifest's shortcuts, `hints.html`, `privacy/`. No other game's script or
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

## Play-test notes (25 November, 0.15.10 merged)

Played through at 375 px (touch) and 1440 px (mouse) on the branch's own files: the daily five, share text and
clipboard, the stats sheet (Esc closes it), Play more for several places, back to today, reload, and a friend's
`#b-dr-12-0-786` link in a fresh browser through to the "You / Your friend" comparison. No console errors.
The branch's Cloudflare preview (claude-zealous-allen-u0n2ro.mapelago.pages.dev) could not be reached from the build
session, whose network doesn't allow that host, so this was played on a local server with the same files.

Fixed from the play-through (with tests):
- Facts said "a city in Netherlands", "Netherlands's", "the Euro" and "Mount Scenery (Saba) (862 m)". They now read
  "the Netherlands", "the Netherlands'", "the euro", "Mount Scenery (Saba), 862 m"; a test checks all 633 places.
- On a phone the distance and Next button were below the fold after locking a pin; they now scroll into view.
- The result card had no next-game button; it now has one, which 0.15.10's `nextButtons()` turns into
  "Play <first unplayed game> next" like every other game.
