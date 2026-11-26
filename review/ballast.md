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

## Ballast feel (0.15.21)
What changed, after Matthew played 0.15.18:
- **Handling:** press anywhere and drag; the country follows the finger one for one in both directions; letting go drops
  it from there. A tap or click without a drag turns it 15 degrees. The arrow, turn and Drop buttons are a small
  fallback row under the question. Keys: arrows (all four), Q and E, Space.
- **Physics:** outlines simplified to at most 22 points (about 6 convex parts each), and the same outline is drawn, so
  what you see is what touches. No bounce, high grip, spin that dies away quickly, taller rails. A plain centre drop on
  the tutorial's calm levels and the day's first two levels never goes overboard (tested, Italy included).
- **Size:** the play area fills most of the screen; the deck is about 28% wider and the pieces scale with it; each
  placed country carries its name once it has been named (or straight away where there is no question to spoil).
- **Goal:** a gauge beside the line and "Stack 640 of 900 km"; the stack must stand above the line for two seconds
  ("Hold 1.4" counts down); then the line goes solid, "Loaded!" and the win sound (no pulsing with reduced motion).
- **Failure:** a country is lost only when it is in the water. Two may be lost in a load ("Overboard 1 of 2 allowed");
  the third ends it. A load also fails if the cargo runs out and the stack settles below the line.
- **Voyages:** each piece is earned with a four-choice question about that country (which outline, capital, continent,
  a neighbour). Wrong costs nothing but gives a plain crate about a third of the size. Third star: every question right.
  Capitals and neighbours come from the checked country tables; countries with more than one capital are never asked.
- **Camera:** the view keeps the deck at the bottom and zooms out smoothly so the stack, the line and the piece in hand fit.
- **Not done:** flag-colour questions (the pack marks flag colours as not fully verified, and many flags share colours,
  so a wrong "right answer" was likely); freezing settled pieces; strict one-dial-at-a-time difficulty.
- One bot sweep after: levels 1 to 4 cleared every time, 5 and 6 about 73%, 7 and 8 about 45%, 11 and up 15 to 25%.
  No retuning of the Daily. The voyage load lines were re-measured once with the new physics (same shares of the bot's stack); the plain bot clears each region's first voyage (tested). A new piece waits just above the stack, so a plain drop is gentle on any screen size.

## Polish stage (0.15.20), from Duet's research
- A translucent landing ghost shows where the piece in hand will first touch; a small "Next" box previews the next country.
- The name is asked **after** a country is placed, about that country, and never holds up the next piece. An unanswered
  question lapses at the next drop. After a load's last piece there is a Continue button, with the question still open.
- The day's first two levels (nine pieces) use each region's best-known countries. Every level opens with its
  broadest piece as a base. In the climb the line only counts once half the cargo is aboard.
- The last piece of a load must lie still for 1.2 s before the load is judged (0.45 s for earlier pieces).
- "Next climb in 5h 12m" on the menu and the result.
- Voyage stars: "every country named" now means every country you placed (a voyage can end early at the line).
- Not done: freezing settled pieces below the top (risk of visible snapping); Monday-to-Saturday weather (difficulty
  follows the level reached instead); strictly one dial at a time (swell, wind and count are staggered but overlap).
- One bot sweep after these changes: levels 1 to 4 cleared every time, 5 and 6 about 83%, 7 to 9 about 50%, 10 and up
  about 25%: no worse than before, so nothing was retuned.

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
