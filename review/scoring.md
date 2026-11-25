# Scoring for the two mystery games, from No. 14

Matthew asked to "make the 2048 map point grading system a little bit better", for Mystery city and
Mystery country (one engine). This is a modest change: 1,000 is still the top score, a find with no
moves still scores exactly 1,000, moves still cost 6, and a miss still opens the next clue.

## What changes

| | Until now | From No. 14 |
|---|---|---|
| Each move | −6 | −6 (unchanged) |
| Each new tile size, 4 to 64, the first time you make it | nothing | **+ half its value**: 4 → +2, 8 → +4, 16 → +8, 32 → +16, 64 → +32 (62 at most) |
| A missed pin | −150 | **−50 within 250 km, rising evenly to −150 at 2,000 km and beyond** (rounded to 10) |
| No find after three pins | the points you'd have had finding it on pin 3 × 1 − √((km − 50) / 2450) | the same, on the new points |
| Top score | 1,000 | 1,000 (the sum is capped there; no round can reach it except a find with no moves, see below) |
| End card | the score and a rank name | also **the sum** and **one to three stars** |
| Copied result | score, moves, clues, pins | the same, with the stars before the score |

The miss line says what the miss cost: "Hot: 235 km off. Head southwest. −50 points. Free clue: …".
The new-clue note says what the tile earned: "New clue: continent. +2 points for making a 4."

The sum on the end card, for example:

    1,000 − 8 moves × 6 + 14 tile bonus − 1 missed pin (50) = 916
    1,000 − 3 moves × 6 + 2 tile bonus − 2 missed pins (150 + 150) = 684. Not found, so × 48% for your closest pin (700 km) = 332

Stars: ★★★ at 850 or more, ★★☆ at 650, ★☆☆ at 400, ☆☆☆ below. The rank names (Legend, Voyager …)
stay as they were.

**Quick mode** (Mystery city) keeps its own scoring (found on pin 1 = 1,000, pin 2 = 800 … five misses
= up to 100). It gets the stars and a sum ("1,000 − 1 missed pin × 200 = 800") and nothing else, so
a Quick result and a tiles result stay comparable the way they were.

## Who gets it

A round of No. 14 (27 November 2026) or later that starts on this version stores `s: 1` in its save
and scores the new way, in both games. Everything else — every earlier round, and any round already
started when the new version arrives, whatever its number — scores exactly as before, so no score
changes under anyone and saves from 0.14.0 and 0.15.x replay as they were (tests load both).
Mystery country's new rules (moves at 6, a miss opens a clue) start the same day, so both mystery
games change together. Beat-my-score links compare only rounds of the same puzzle number, as before;
a friend on the same puzzle has the same scoring unless one of you started it on the old version.

## Why these numbers

- **The tile bonus** follows 2048 itself, where the score goes up by the value of each new tile, so
  merging feels like earning. Half the value, and only once per tile size, keeps it small next to the
  move costs: making a 64 takes about 53 moves (318 points) and pays back 62 in all.
- **A perfect round still scores the most.** Every move adds a 2 or a 4 to the board, so making a tile
  of value *v* takes at least (v − 4) / 4 moves, which cost 1.5 (v − 4) points or more; the bonus up
  to that tile is v − 2. So the bonus is always smaller than the moves it took (4: 2 < 6; 8: 6 < 12;
  16: 14 < 18; 32: 30 < 42; 64: 62 < 90), and any round with a move scores under 1,000. The tests
  play 40 days and check the score after every move.
- **A miss costs less the closer it lands**, like distance-based scoring in GeoGuessr-style games and
  Worldle's proximity: a near miss was nearly right, and charging it the same 150 as a pin on the wrong
  continent felt harsh. A miss still always opens a clue and costs at least 50, so guessing at random to
  buy clues stays worse than sliding: a wild guess costs 150 plus a pin.
- **The sum and the stars** make the score readable: you see exactly where the points went, and the
  stars give a quick grade to share.

## Pacing check

Playing No. 14 to No. 113 with a simple strategy (down, left, right, up, the first that moves), the
median number of moves to make each tile, and the score for finding it with the first pin right then:

| Tile (clue) | Rounds that reached it | Median moves | Until now | From No. 14 |
|---|---|---|---|---|
| 4 (2nd clue) | 100 / 100 | 2 | 988 | 990 |
| 8 (3rd) | 100 / 100 | 7 | 958 | 964 |
| 16 (4th) | 100 / 100 | 16 | 904 | 918 |
| 32 (5th) | 100 / 100 | 27 | 838 | 868 |
| 64 (6th) | 99 / 100 | 53 | 682 | 744 |

The order of choices doesn't change: each further clue still costs points overall, the 6th clue the
most, and pinning as soon as you know is still best. (The two games deal the same boards on the same
day, so the table is the same for both.) A near miss with a free clue now costs 50 instead of 150,
which is roughly the price of the 5th clue by sliding.

## Sources

- 2048: the score goes up by the value of each new tile made by a merge. Wikipedia, "2048 (video
  game)".
- Worldle: after each wrong guess, the distance, the direction and a proximity percentage (0% for the
  far side of the world, 100% for right). worldle.teuteuf.fr/faq.
- GeoGuessr-style scoring falls smoothly with distance; a published approximation for world maps is
  5000 × e^(−km / 1492.7) (the OSV-5M "plonk" demo on Hugging Face). GeoGuessr itself publishes no
  formula.

These were researched by the coordinating session; this session had no web access and did not open them.

## Where it is

- `review/scoring-patch.py` makes the change in index.html and country.html (run it after
  `review/country-rules-patch.py`; `--take-ours` resolves a merge conflict on those pages first).
  The functions are named `MxS…`, `MxStar…`, `MxSum`, `MxEnd`, on their own lines after
  `/* mx-scoring … */`.
- Tests: the `mx-scoring` block in tests/run.js.

## Not done

- The share image (the picture card) shows the score as before, without the stars.
