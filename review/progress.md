# Progress: branch claude/charming-bardeen-967w66 (as of 03:22 CT, 25 Nov 2026)

Head: release 0.15.14. Every release below was pushed with its own version, with every suite passing.

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
