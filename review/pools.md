# Standard 13: content pools and how long they last

Measured by `node tests/repeat.js`, which builds every game's schedule for 365 days from No. 20 and fails if anything returns too soon. New schedules below start at No. 17 (Fathoms: No. 20).

| Game | Used a day | Pool | Never repeats for | Status |
|---|---|---|---|---|
| Mystery city | 1 city | dated list | 365 days and more | Pass |
| Crossings | 1 route | 365 different routes in a year | 365 days | Pass |
| Logbook | 8 questions | 2,920 used in a year (cycle of 414 days) | 365 days | Pass |
| Bigger city? | 10 pairs | 3,650 different pairs in a year | 365 days | Pass (fixed: 71 pairs used to return) |
| Bigger country? | 10 pairs | 160 countries with official areas; 12,375 pairs at least 10% apart | 365 days | Pass (fixed: 850 pairs used to return). Only 327 pairs are 10-20% apart and two are used a day, so after about 160 days the last two pairs of the day get easier. |
| Ballast | up to 12 levels' cargo | 2,920 different sets in a year | 365 days | Pass (fixed: Oceania had the same three countries every time; it now sails with Asia) |
| Mystery country | 1 country | 193 | one full cycle (193 days), then a reshuffle; at least 60 days between the same country | Pass by the agreed cycle rule |
| Dead Reckoning | 5 places | 923 places in five difficulty pools of 110, 130, 140, 170 and 83, plus landmarks | 75 to 160 days, pool by pool (was 60) | Short of a year: content needed |
| Fathoms | 7 prompts | 319 prompts | 45 days as one deck, at least 20 days apart (the language prompts used to return every 9 days) | Short of a year: content needed |
| Voyage | 10 questions | 2,248 different in a year | at least 20 days apart; most facts return after about 100 days | Short of a year: content needed |
| Stamps | 12 questions (6 wedges, 2 each) | 3,117 different in a year | at least 30 days apart; most return after about 110 days | Short of a year: content needed |

Nothing appears twice in one day in any game.

## Same-form back to back (13e)
- Fathoms: fixed in the new deal (at most three of a kind a day, never two in a row).
- Voyage, Stamps, Logbook, Dead Reckoning: not yet checked.

## Practice modes
Not yet checked against "no repeat until the pool is exhausted".
