# The Mapelago standard (approved by Matthew, 26 Nov 2026)

One standard and one work order for the whole site. Every game must pass all thirteen; each is graded pass/fail with evidence.

1. **One rule:** explained in one sentence of 20 words or fewer on the play screen; the rest behind "?".
2. **First move in 10 seconds** on 375x667, no scrolling, no dialog first.
3. **One screen in every state** (opening, mid-play, after an answer, finish), nothing cut off.
4. **One round of two to four minutes** with a clear end, scored once a day.
5. **It can be lost:** median score 60-80% of the maximum, never 100%.
6. **Gets harder as it goes** (rules below).
7. **Fair and honest:** every counter and message matches the game state; every loss has a visible cause; same seed gives the same puzzle everywhere.
8. **Never wrong:** every fact correct and dated; every valid answer accepted, with alternate names.
9. **Feedback within 100 ms** on every action; wrong answers explain why in one line; sound button on all eleven games.
10. **One site-wide share format:** name, puzzle number, a spoiler-free grid that differs between players, score, link.
11. **A reason to return:** streak, countdown to the next puzzle, personal best, a "beat yesterday" line. No nags.
12. **Fast and light:** ready under 2 s on slow 4G, no console errors, offline after first visit, keyboard and screen-reader play that never leaks the answer.
13. **Never the same twice** (Matthew's priority): no question, city, country, pair, prompt, route or piece set repeats within 365 days in any game, and nothing appears twice in one day. Practice and Play-more modes draw from the pool without repeating until the pool is exhausted, then reshuffle.
   - (a) For each game, count its content pool and how many days it lasts at the current daily usage; print that as a table.
   - (b) A test builds the next 365 days of every game's schedule and fails on any repeat or same-day duplicate.
   - (c) Where a game uses templates or a generator (Bigger pairs, Crossings routes, Ballast levels, Logbook pairs, Fathoms prompts), widen the generator and keep a used-history so combinations don't recur.
   - (d) Where a pool lasts under a year, do NOT invent facts: list exactly what is needed (how many, what kind, what fields) in `review/content-needed.md`; Duet supplies source-checked content.
   - (e) Vary question families within a day so two questions never have the same form back to back.

## Difficulty rules (every game)
- Thirds inside a round: about 90%, 65%, 35% correct.
- One dial at a time, no sudden jumps.
- A weekly arc: Monday gentlest to Saturday hardest, Sunday special; the day's difficulty shown in words.
- Measured with a simple bot or simulation and written to `review/difficulty.md`.
- Dials: Mystery city and Mystery country: fame of the place by weekday. Bigger city? and Bigger country?: ratio shrinking pair by pair from over 3x to within 10%. Voyage: obscurity, and sailing on must risk banked points. Fathoms: size of the answer list. Stamps: obscurity by wedge. Crossings: minimum borders. Logbook: gap between dates from a century to a decade. Dead Reckoning: fame of place and distance needed. Ballast: shape, then swell, then wind; every level at least three pieces; first five Daily pieces compact; same level and seed always the same load line.

## Work order (one release per group; re-print the thirteen-standard table for the games touched after each)
- **P0** the broken things in `review/scorecard.md`, Ballast first, each with a failing-then-passing test.
- **P1** standards 1-3 (release the three tables at 11 of 11, with the tests).
- **P2** standard 8: facts file and answer lists tested against all 193 UN members.
- **P3** standard 13, then 5 and 6: never-repeat test and pool table, then difficulty.
- **P4** standards 9 and 12.
- **P5** standards 10 and 11.
- **P6** Ballast's character: flags, reacting crew, stowaways (cosmetic only; no faces on countries).
- **P7** graphics and desktop layouts.

## Automated gates on every release
First move visible; one screen per state; counters equal game state after each action in a scripted round; determinism on two runs; answers; speed; saves and midnight rollover; keyboard round; share format; 365-day no-repeat.

## Left for Matthew (one-line recommendation each)
Which game is the front door (grader says Dead Reckoning); whether to feature fewer than eleven games; any fact not sure of; national-animal stowaways; every merge.

## Report per release
RELEASE READY sha and version; what changed, one line each; what was left out and why; the standards table for games touched; what's waiting on Matthew.

## Usage
Short reports, no re-reading known files, no open-ended tuning (three sweeps at most), full suites once per release.
