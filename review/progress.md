# Progress: branch claude/charming-bardeen-967w66 (as of 03:22 CT, 25 Nov 2026)

Head: release 0.15.14. Every release below was pushed with its own version, with every suite passing.

**Live:** main and mapelago.com are at release 0.15.14 (0.15.11 and 0.15.12 via PR #8, 0.15.13 and 0.15.14 via PR #9), each checked on its Cloudflare preview first. Paused at 4:00 AM CT.

## Released or ready to release (newest first)
| Release | Commit | What players get |
|---|---|---|
| 0.15.14 | 3693367 | Dead Reckoning, the tenth game (merged branch) |
| 0.15.13 | d9c1d97 | Bigger games: official areas, closer last pairs, checked populations, Play more, stats (from No. 14) |
| 0.15.12 | 592097e | Mystery country review fixes, Quick mode and Past countries; new scoring for both mystery games (No. 14); For teachers; Voyage and Stamps fixes; Logbook Play more and stats |
| 0.15.11 | 5e27d0b | Mystery city: no "32, 32" ladder, "make an 8", last clue described correctly, Quick pin values, Niamey population from No. 14 |
| 0.15.10 | 9ac9cda | Next-game buttons go to the first unplayed game; release line in the footer |
| 0.15.9 | e0cf9d7 | Crossings: par in countries, coloured ends, a shortest route, 1,000 with a comma |
| 0.15.8 | a87cb35 | Logbook, the history game |
| 0.15.7 | 7ae4f78 | App shortcuts; search data for all games |
| 0.15.6 | 9bd082d | Screen-reader landmarks (axe-core reports nothing) |
| 0.15.5 | fc67a60 | Visitor counting on (Cloudflare Web Analytics), plus 0.15.3 and 0.15.4 |
| 0.15.4 | 9c13c92 | Source-checked facts for the next 60 mystery cities |
| 0.15.3 | 9193400 | Fathoms: Tuvalu, seven kinds of prompt a day (from No. 20) |

## Start numbers in play (see how-to-go-live.md)
Mystery country no-repeat schedule: No. 20. Fathoms deal and Tuvalu: No. 20. Mystery country rules, both mystery
games' scoring, Bigger games' data, Niamey: No. 14 (27 Nov). If the next merge to main lands after 27 Nov, the No. 14
changes start on the day they arrive for rounds not yet started; finished rounds keep their scores.

## Where I stopped (hands-on review items not done)
- Fathoms: show every right answer deepest first after each prompt; say why an answer is deep ("Nauru: largest town
  about 1,000 people"); "borders the Democratic Republic of the Congo" (add "the"); San Marino scored as the country.
  ("Smaller than Palau" accepts Tuvalu from No. 20, already released.)
- Mystery city: rank explanation and one-line score breakdown on the result screen; letting a Tiles finisher also
  play Quick; keyboard zoom keeping the pin (shared map code).
- Site-wide: one rules text per game reused everywhere (Mystery country date first); Crossings in the menus of All
  games and How to play with its own How to play heading, How to play retitled; About's "The idea" for all games;
  "1,000" commas outside Crossings; common English city names (Nizhny Novgorod, Ludhiana, Gothenburg).
- Round 3 still open from earlier: clue-type rotation for the mystery games from the country pack; D graphics
  (illustrated Chart room, before/after phone screenshots); the line-up recommendation and new-game assessment.

## Open questions for Matthew
- Iztapalapa and Qarchak swap candidates (review/city-facts.md): Guadalajara or Puebla; Isfahan or Shiraz.
- Tuvalu in the other games' shared country table, and the "island" field differences (review/data-pack-check.md).
- Duet's source lines for the city facts (the Source column is waiting for them).
- review/ and tests/ stay published: city-facts.md no longer reveals days and golden.json holds fingerprints, but
  removing the folders from the site needs a Jekyll build I couldn't run here (proposal in the 0.15.1 notes).

## Polish pass, 26 Nov (releases 0.15.23 to 0.15.36)
- **The bar:** on a 375x667 phone, as a first-time visitor, every game opens with one sentence, a marked first move and its rules behind a "?"; the whole game fits one screen in every state through to the result; and it is ready in under 2 seconds on slow 4G. `node tests/screen.js` prints the tables (A first move, B one screen, D daily habit, F speed) and fails if a game slips. All four stand at 11 of 11.
- **How the phone layouts are applied:** `review/one-screen-patch.py` (safe to re-run; run it after any script that rebuilds a game page). Ballast and Crossings carry theirs in their own build.
- **Lighter map:** `world-lite.js` (built by `node review/world-lite-build.js` from `world.js`; run it again if `world.js` changes) is used by Crossings and Dead Reckoning.
- **Share texts:** sea-and-map symbols in place of coloured squares; every text starts "Mapelago ... 🐢" and ends with the link. Ballast shares a picture of the stack (outlines only).
- **Daily habit:** one streak across the site (`MXS.siteStreak()`: any finished game counts for the day; freezes as before), shown on every finish screen with "Next puzzles in Xh Ym" and the next unplayed game.
- **Ballast only:** the ship sits lower and lists toward the heavy side (drawing only, so scores and the bot numbers are unchanged); "today's cargo" picture on its home screen; a Captain's run on Sundays (the Daily's level 5 sea from the first load), saved apart from the Daily and the streak. First one: No. 16, Sunday 29 Nov.
- **Start numbers added:** Ballast's compact first pieces begin at No. 15.
- **Not done:** a physical (not just drawn) list on hard levels; a share text or friend link for the Captain's run; Stamps still marks a second-try stamp with a yellow square.
