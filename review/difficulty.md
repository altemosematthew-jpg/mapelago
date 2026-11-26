# Difficulty (standards 5 and 6): first pass

Target: inside a round, about 90%, 65% and 35% right by thirds; a median score of 60-80% of the maximum; a weekly arc. One note on the target: a two-choice game cannot go below 50% right by guessing, so its hardest third bottoms out near 55-60%, not 35%.

## Measured

**Bigger city? and Bigger country?** A simple player: certain when one is twice the other, a coin toss when equal, in proportion between. Forty days each, No. 20-59.

| | Median ratio, pair 1 to 10 | Right by thirds | Median score | Perfect rounds |
|---|---|---|---|---|
| Bigger city?, before | 57.5, 19.6, 11.4, 7.0, 4.3, 3.1, 2.0, 1.8, 1.6, 1.5 | 100 / 98 / 81% | 10 of 10 | 53% |
| Bigger city?, from No. 17 | 5.4, 2.9, 2.4, 2.0, 1.7, 1.5, 1.4, 1.3, 1.2, 1.2 | 100 / 83 / 63% | 8 of 10 | 12% |
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
