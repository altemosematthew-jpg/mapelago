# Ballast: design notes and what to check

**Files:** `ballast.html` (built by a script from Fathoms' head, like Crossings), `ballast.js` (the game, readable),
`ballast-data.js` (193 outlines made from `world.js`), `vendor/matter.min.js` and `vendor/decomp.min.js`
(matter-js 0.20.0 and poly-decomp 0.3.0, both MIT; licences in `vendor/LICENSES.txt`), `tests/ballast.test.js`.
The physics library is kept in the repository, not loaded from a CDN, because the privacy page says the games make
no requests to other companies. Save key: `dailycity:ballast:v1` (`results` per day for the daily, `levels` for stars).

## How it plays
- One outline per country: its main landmass, simplified to about 30 points. One scale per round, so sizes are in
  true proportion (the biggest piece is 45% of the deck).
- Name the country before dropping it for +100 (four choices on early voyages, typed later; dropping unnamed is allowed).
- **Daily Ballast:** ten countries of similar size, the same for everyone; calm Monday to rough Sunday. Score = stack
  height in km + 100 per name. One go counts; replays don't change the result.
- **Voyages:** 30 levels in six regions. Stars: reach the load line; nothing overboard; every country named.
  A voyage ends as soon as the stack reaches the line. Each opens when the one before is cleared; every region's
  first voyage is open from the start.

## How the load lines were set
A test bot played every voyage four plain ways (each piece laid flat; dropped in the middle, or alternating sides).
Each voyage's line is a share of the bot's second-best stack: 80% for a region's first voyage rising to 120% for its
fifth, and 90% to 130% across the seven World voyages. The daily's line is 27% of the pieces' summed square-root areas,
which the bot reaches on most days.

## Please check by hand (I can't play it by touch here)
- The plain bot clears 27 of 30 voyages. It fails **Balkan squall (Europe 5), Small parcels (Africa 4) and Sahara cargo
  (Africa 5)**, which need deliberate placing. If any voyage feels impossible, lower its share in the `line` table
  near the top of `ballast.js`.
- Drag and tap-to-turn on a real phone, and whether the swell and wind feel fair.
- Small island countries are not used in the daily (pieces are between 40,000 and 2.5 million km²).

## Found on the way
The map data gives id 036 to both Australia and the Ashmore and Cartier Islands. Code that took the last match drew
Ashmore. `shapes.js` (Bigger country?) and Crossings now take the first, Australia.
