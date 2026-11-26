# Ballast: design notes and what to check

**Files:** `ballast.html` (built by a script from Fathoms' head, like Crossings), `ballast.js` (the game, readable),
`ballast-data.js` (193 outlines made from `world.js`), `vendor/matter.min.js` and `vendor/decomp.min.js`
(matter-js 0.20.0 and poly-decomp 0.3.0, both MIT; licences in `vendor/LICENSES.txt`), `tests/ballast.test.js`.
The physics library is kept in the repository, not loaded from a CDN, because the privacy page says the games make
no requests to other companies. Save key: `dailycity:ballast:v1` (`results` per day for the daily, `levels` for stars).

## How it plays
- One outline per country: its main landmass, simplified to about 30 points. One scale per level, so sizes are in
  true proportion.
- Name the country before dropping it for bonus points (four choices on early levels, typed later; dropping unnamed is allowed).
- **Daily Ballast (the main mode):** one run a day from the date seed, the same for everyone. A level generator
  (`genLevel(seed, level, attempt)` in `ballast.js`) makes each level: level 1 is easy and each one adds pieces
  (4 up to 10), bigger pieces for the deck, a higher load line, swell from level 3, wind from level 4, typed names from
  level 5, long thin countries from level 7, and a new region each level (a world mix every sixth). No top level.
  Three lives: a load that ends below the line costs one and brings a fresh cargo for the same level.
  Score = 100 per level cleared + 10 per name. The share shows a square per load: green cleared, yellow cleared with
  something overboard, red failed. A run in progress is saved after every level and survives a reload or midnight.
- **Endless practice:** the same generator with a random seed. Never counts for the streak; best practice run is kept.
- **Tutorial:** five one-screen levels on a first visit (drop, turn, name, wind, swell). Can be skipped; replay from the menu.
- **Voyages:** the 30 set levels in six regions, with stars (reach the line; nothing overboard; every country named).
- **Stats:** personal best level, runs and average, and "Today's cargo starts in ..." on the menu.

## How the difficulty was set (three bot sweeps, then stopped)
A test bot plays plainly: each piece laid flat, dropped in the middle or alternating sides, every name right.
- Generator: the load line is 27% of the pieces' summed square-root areas times (0.8 + 0.09 × level). With that, one
  plain attempt clears levels 1 to 4 every time, 5 and 6 about 87% of the time, 7 to 9 about 45%, and 10 and up about
  20%. With three lives, a careful player should usually clear 1 to 5 and rarely pass 12.
- Voyages: each line is a share of the bot's second-best stack, 80% for a region's first voyage up to 120% for its
  fifth (90% to 130% across the World voyages).

## Please check by hand (I can't play it by touch here)
- The plain bot clears 27 of 30 voyages. It fails **Balkan squall (Europe 5), Small parcels (Africa 4) and Sahara cargo
  (Africa 5)**, which need deliberate placing. If any feels impossible, lower its share in the `line` table near the
  top of `ballast.js`.
- How far a real player gets in the Daily. If most stall before level 5 or sail past 12, change the two numbers in
  `lv.lineKm = ... (0.8 + 0.09 * n)`.
- Drag and tap-to-turn on a real phone, and whether the swell and wind feel fair.

## Found on the way
The map data gives id 036 to both Australia and the Ashmore and Cartier Islands. Code that took the last match drew
Ashmore. `shapes.js` (Bigger country?) and Crossings now take the first, Australia.
