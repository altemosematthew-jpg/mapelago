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

## Not measured yet (no bot)

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
