# Difficulty (standards 5 and 6): first pass

Target: inside a round, about 90%, 65% and 35% right by thirds; a median score of 60-80% of the maximum; a weekly arc. One note on the target: a two-choice game cannot go below 50% right by guessing, so its hardest third bottoms out near 55-60%, not 35%.

## Measured

**Bigger city? and Bigger country?** A simple player: certain when one is twice the other, a coin toss when equal, in proportion between. Forty days each, No. 20-59.

| | Median ratio, pair 1 to 10 | Right by thirds | Median score | Perfect rounds |
|---|---|---|---|---|
| Bigger city?, before | 57.5, 19.6, 11.4, 7.0, 4.3, 3.1, 2.0, 1.8, 1.6, 1.5 | 100 / 98 / 81% | 10 of 10 | 53% |
| Bigger city?, from No. 17 | 5.4, 2.9, 2.4, 2.0, 1.7, 1.5, 1.4, 1.3, 1.2, 1.2 | 100 / 83 / 63% | 8 of 10 | 12% |
| Bigger city?, UN WUP 2025 figures (from No. 17) | 4.75, 2.97, 2.50, 2.06, 1.74, 1.53, 1.41, 1.35, 1.25, 1.21 | 100 / 83 / 63% | 8 of 10 | 11% |
| Bigger country?, before | 24.2, 7.9, 6.5, 5.4, 3.2, 2.2, 1.9, 1.4, 1.15, 1.15 | 100 / 96 / 62% | 9 of 10 | 20% |
| Bigger country?, from No. 17 | 13.4, 4.3, 2.8, 2.2, 1.9, 1.7, 1.45, 1.3, 1.2, 1.15 | 100 / 87 / 61% | 8 of 10 | 12% |

- Bigger city? stops at 15% apart: its population figures are not good enough to split a closer pair (see `facts-to-check.md`).
- Bigger country? stops at 10% apart until the re-sourced areas arrive.

**Ballast (Daily).** The test bot, 36 runs: levels 1-4 cleared every time, 5-6 about 85%, 7-9 about 60%, a quarter or less past level 10. Dials in order: more pieces and a higher line, then swell from level 3, wind from level 4, typed names from level 5, long shapes from level 7.

## Simple bots for the other games (one run each; every figure depends on the stated player)

| Game | The simple player | Right by thirds | Median score | Standard 5 (median 60-80%) | Standard 6 (ramp) |
|---|---|---|---|---|---|
| Voyage | Uses the game's own hardness figure for each question (0.14 on island 1 rising to 0.89 on island 10): certain at 0, a one-in-four guess at 1. | 83 / 63 / 41% | 150 of 1,000, whether it anchors after island 3, 5, 6, 8 or never | Fail, from the hard side: 15% of the maximum. Where it anchors hardly changes the result (mean 138 to 153), which is the grader's "the choice is meaningless". | Pass: the ramp is already there. |
| Stamps | Knows 70% of questions, every wedge alike. | flat | 6 of 6 in 57% of rounds: two tries a wedge stamp it 91% of the time | Fail: the median is the maximum. | Fail: no ramp. |
| Fathoms | Names an answer of average fame from the list. | from No. 20 the lists shrink through the day (26 answers down to 6 on No. 20) | not simulated: depth depends on which answer, not on right or wrong | Not graded | Pass from No. 20 |
| Dead Reckoning | - | five difficulty tiers, one per round, easiest first | not simulated: needs a model of how far off a guess lands | Not graded | Pass by construction |
| Logbook | - | question kinds harden through the round; a level per weekday in the data | not simulated | Not graded | Pass by construction |
| Crossings | - | one puzzle a day; par (the shortest route) sets the difficulty, named by weekday | not simulated | Not graded | Weekly arc: pass |
| Mystery city, Mystery country | Simulated when the scoring was set (`review/scoring.md`). | clue by clue | see that file | Not re-run | Weekly arc on the city: pass |

## For Matthew to decide (scoring changes, so not made here)
- **Voyage:** the points ladder, not the questions, is the problem. Either flatten the hardness of islands 4 to 7 or pay more for the early islands, so a typical player banks 600 to 800; and make anchoring matter (for example, lose half of what is above the last harbor rather than all of it).
- **Stamps:** score first-try stamps only (out of 6), keep the second try as a consolation mark; and order the wedges from the best-known subject to the most obscure.

## Structure of each game (for reference)

| Game | Ramp inside the round | Weekly arc | What I expect |
|---|---|---|---|
| Mystery city | clue by clue (each costs points) | yes: the header shows the day's level (for example "Thu · medium") | scoring was simulated earlier (`review/scoring.md`) |
| Mystery country | same as the city | not checked | - |
| Voyage | the ladder rises island by island | not checked | too easy by the grader's account; sailing on is free, so there is no real risk |
| Fathoms | from No. 20: longest answer list first, shortest last | no | - |
| Stamps | none: six wedges of equal difficulty | no | too easy by the grader's account |
| Crossings | par sets the difficulty | yes: named by weekday ("Thursday's middle distance") | - |
| Logbook | yes: question kinds get harder | yes: a level per weekday in the data | - |
| Dead Reckoning | yes: five difficulty tiers, one per round | no | - |

## Still to do for standards 5 and 6
- A simple bot for each of the eight games above, and the thirds and median for each.
- Voyage: make sailing on risk banked points (a scoring change: needs a start number).
- Stamps and Voyage: order questions by obscurity so the last third is hard.
- A weekly arc where there is none (Bigger, Fathoms, Stamps, Dead Reckoning, Ballast), and the day's difficulty shown in words on every game.

## Weekly arc and the day's level in words (from No. 17)
Monday is gentlest, Saturday hardest; one dial per game. The header shows it, for example "No. 18 · Tue · easy".

| Game | Dial | Status |
|---|---|---|
| Mystery city, Logbook, Crossings | already had a level per weekday | in place |
| Bigger city?, Bigger country? | the whole ramp is 30% wider apart on Monday and 20% closer on Saturday (never under 15% and 10%) | added |
| Ballast | the same cargo with the load line 6% lower on Monday and 4% higher on Saturday; Sunday has the Captain's run | added; bot not re-run |
| Mystery country, Voyage, Fathoms, Stamps, Dead Reckoning | none yet | not done: each needs its schedule or scoring reworked (Fathoms' deck, Dead Reckoning's pools, and the Voyage and Stamps decisions waiting on Matthew) |

Sunday is "medium" in the two Bigger games; it has no special round there.

## Voyage from No. 19 (0.15.46)
- Ladder 200, 400, 600, 680, 750, 810, 870, 920, 960, 1,000; harbors at islands 1, 3, 6 and 8; a miss still ends the voyage and keeps what is banked.
- At a harbor nothing is at risk, so the sail-or-anchor question is no longer asked there; between harbors it is, and sailing risks the unbanked points.
- Same simple player as before (83 / 63 / 41% right by thirds): reaches island 3 in 57% of voyages, so the median is 600 of 1,000 (was 150). 26% wreck before island 3 and keep 200; 16% score nothing.
- The questions were already ordered from the best-known subject to the most obscure; that is unchanged.

## Stamps from No. 19 (0.15.47)
- One question a wedge (the second chance is gone), and the wheel takes the wedges from the day's best-known subject to its most obscure.
- Simple player (certain on the best-known country, a one-in-four guess on the least known), forty days: right by spin 84, 76, 67, 59, 51, 39%; median 4 of 6; six of six in 6% of rounds (was 57%).
- Side effect: each wedge uses one question a day instead of two, so its pool lasts about twice as long before a question returns.

## Weekly arc on the other five (0.15.50, from No. 19)
- Voyage: harbors at 1, 3, 5, 6 and 8 on Monday and Tuesday; 1, 3, 6 and 8 midweek and Sunday; 1, 3 and 6 on Friday and Saturday.
- Dead Reckoning: the same places; the distance a pin may be off for the same points is 30% more on Monday, 20% less on Saturday.
- Mystery country, Fathoms, Stamps: the day's level in words only. A real dial needs their schedules reworked (Mystery country's cycle, Fathoms' deck, Stamps' wedges), so it waits for new content.

## Scorecard 3 retune (0.15.67, every change from No. 16)
Target: a simple player's median between 60 and 80% of the top score, with Friday and Saturday clearly hardest. The "bots" are the scripts described below; they are models of a player, not real players.

| Game | What changed | Simple player, before → after |
|---|---|---|
| Crossings | each weekday has its own pairs, Saturday the longest and least known; extra guesses cost 250 (was 100) and four are allowed (was six) | median 1,000 → 750 of 1,000; Mon–Wed 1,000, Thu/Fri/Sun 750, Sat 500 |
| Logbook | the closest-dates tolerance narrows by weekday: 3, 5, 4, 4, 3, 3, 2 years (Sun to Sat) | 630 → 620 of 800 (78%); Mon 645, Sat 550. The event schedule itself is fixed, so this is as far as it goes without new content |
| Stamps | the wheel's order depends on the day: Monday to Wednesday best-known first, Thursday to Sunday least-known first | median 4 of 6 (67%) either way; Mon and Wed 5, Thu, Sat and Sun 3 |
| Bigger? | every pair's gap is cut by the day's share (Mon 0.9 down to Sat 0.24), and the closest pairs may be 6% apart (was 15%) | expected right of 10: 8.2 → 7.4 median; Mon 8.1, Sat 6.3 |
| Ballast | from level 2 no single piece is as tall as the load line (a too-long piece is swapped for the country nearest its size that fits under it, in the same region; where the region has no such country the line goes just above it); the line is a share of the cargo that grows 7% a level | a plain bot (drop from the middle, flat or not) still clears 70 of 72 levels on days 16–24, so most of the challenge is now in the naming questions and the hold |
| Daily Voyage | every stop is tuned to the day (H = 0 on Monday to 1 on Saturday): Pin from better-known cities early in the week to less-known places later, scored on 1,380 km down to 900 km; Bigger pairs 1.56× down to 1.06× apart; Crossing between top-70 countries on Monday, ranks 90–160 on Saturday; the mark's wrong cities nearer (600–3,000 km on Saturday); Logbook dates 25–120 years apart on Monday, 8–30 on Saturday; the Fathoms stop uses Fathoms' rule for the smallest countries | not measured with a bot |
| Dead Reckoning | the five cities come from less-known tiers later in the week: Monday to Wednesday tiers 1–5 (one per round), Thursday 1,3,3,4,5, Friday 2,3,4,4,5, Saturday 3,4,4,5,5, Sunday 2,3,3,4,5 (tier 5 is used at most eight times a week, so its 83 places still rest 60 days) | not measured with a bot (scoring by distance needs a model of where people tap) |
| Fathoms | depth is still each answer's place in that prompt's own list; the ten smallest countries by area (Vatican City, Monaco, Nauru, Tuvalu, San Marino, Liechtenstein, Marshall Islands, Saint Kitts and Nevis, Maldives, Malta) now sit halfway down instead of at the bottom | naming the tiniest country no longer wins every prompt it fits |

Bots: Crossings and Logbook play with fame (the best-known answer first); Stamps is certain on the best-known subject and guesses one in four on the least known; Bigger? is sure when one is twice the other and tosses a coin when they are equal; Ballast drops every piece from the middle.

### One population figure
Every city population the site shows is the UN WUP 2025 urban-area figure (un-cities.js) or none. Dead Reckoning now uses it (a city without a UN figure gets no number). Fathoms no longer prints a largest-city figure from No. 16; its order still comes from the older largest-city sizes, because the UN table in the repo covers only the 315 cities the games use. Fixing that needs the full WUP 2025 Cities file (population.un.org), which this build machine cannot reach.

## Scorecard 4 changes (0.15.68)
- Crossings: an extra guess costs 100 again (scorecard 4 asked for 100, matching How to play); four extra guesses are still allowed from No. 16. Test player: median 750, Monday and Tuesday 1,000, Saturday 500 (unchanged, because the player's misses are mostly border-shut rounds).
- Stamps: from No. 16, on Fridays and Saturdays a stamp takes both of the wedge's questions right, and a miss on either closes it (scorecard 4: six of six in six spins).
- Mystery city: from No. 22 Saturday's and Sunday's cities swap, so Saturday is the hardest day as everywhere else (No. 16, a Sunday, keeps the hardest city it was dealt).
- Released on No. 15, so this release's new rules start at No. 17: Tuvalu and Timor-Leste (Asia) join Fathoms, and Macau leaves Bigger? and the Daily Voyage. Crossings' No. 16 keeps the 250 per extra guess it was published with; 100 from No. 17.
