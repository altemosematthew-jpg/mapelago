# Mystery country update: merge notes

Branch `claude/happy-archimedes-imexu1`. Mystery country plays by Mystery city's rules from No. 14,
and is easier to find. This file lists every change to a shared file, so the branch can be merged
into `claude/charming-bardeen-967w66` without guesswork.

## The two conflicts you will get

### country.html, the game script line

The whole country game is one very long line of country.html (line 549 on main). Your branch changes
it (the no-repeat schedule, now from No. 20), and so does this one, so git reports a conflict on it.
To resolve, with your branch checked out and this one being merged in:

    python3 review/country-rules-patch.py --take-ours country.html
    git add country.html

`--take-ours` keeps your side of each conflict block and leaves the parts git merged on its own; the
script then makes every change this branch makes to country.html (the game script, the cost line, the
rules sheet, the styles, the city/country strip). Run on main's country.html it gives this branch's
copy byte for byte, except the explainer at the foot, which `copy/apply.py` writes from copy.json. It
is safe to run twice (an edit already there is skipped) and stops without writing anything if an
anchor has changed.

Every function the script adds is named `Mx...` and sits on its own lines, after the comment
`/* mx-country-rules ... */`.

### copy/copy.json

Your branch rewrote every line of copy.json (one-space indent), so git can't line up this branch's four
copy edits with it and reports conflicts there too. To resolve:

    git checkout --ours copy/copy.json
    python3 review/country-copy-patch.py
    git add copy/copy.json copy.js games/index.html country.html

The script sets Mystery country's explainer and steps and the city and country card lines, keeps
everything else in your copy.json, writes it back in your format, and runs `copy/apply.py`.

### Checked

Throwaway merge of this branch into yours at 2169659 ("Keep review/, tests/, copy/ and data/ ... off
the published site"): country.html and copy/copy.json were the only conflicts, the two recipes above
resolved them (your quick-mode and Crossings text kept), and the whole test suite passed, 385 checks.
Nothing else conflicted.

## Rules version and start number

- A new country round of No. 14 or later stores `r: 2` in its save and plays by the new rules.
  A round with no `r` (everything before No. 14, and any round started on 0.14.0, whatever its number)
  keeps the old rules: moves cost 8, a miss opens nothing, the old last-pin score.
- A saved round with no moves and no pins counts as not started, so it gets the new rules.
- `MxNew()` holds the number 14.

## Files only this branch touches

- `country.html` (see above, plus: cost line, rules sheet, `#toast.mxtop` style, `role="status"` on `#storm`,
  and the same city/country strip and style block as index.html)
- `review/country-rules-patch.py` (new)
- `review/country-copy-patch.py` (new)
- `review/country-merge-notes.md` (this file, new)
- `tests/fixtures/country-save-from-v0.14.json` (new: a save recorded on main at 0.14.0, country No. 12 and 13 finished, No. 14 in progress)

## Shared files, each change in a marked block

- `index.html`, two blocks, neither on the game script line:
  - CSS between `/* mx-find: ... */` and `/* /mx-find */`, right after the `.mark{min-width:0;flex:1}...`
    rule (a few lines above your quick-mode CSS, with unchanged lines between, so no conflict).
  - `<!-- mx-find: ... -->` and a `<nav class="mx-find">` right after `</header>`: two tabs,
    Mystery city and Mystery country, at the top of the page. Your quick-mode `#mxMode` sits below
    the score bar, so the two don't touch.
  - Not changed: Mystery city's end card already offers "Like guessing countries? Play the mystery
    country" (`at.next`, on the script line); the CSS block only centres its text.

- `copy/copy.json`: country `explainer` and `howto`, and the `city` and `country` lines under
  `home.cards` ("Guess the city: ..." / "Guess the country: ..."). Written in your branch's format
  (`json.dumps(indent=1)`, no newline at the end); then `python3 copy/apply.py` was run, which changed only:
  - `copy.js`: the `city` and `country` card lines.
  - `games/index.html`: the Mystery country section's paragraph and steps.
  - `country.html`: its explainer block at the foot (between `<!-- copy:start -->` and `<!-- copy:end -->`).
  copy.json will conflict: see "copy/copy.json" above.
- `how-to-play/index.html`: one sentence added to the lede (a link to `#mystery-country`), and the
  "The countries version" section replaced by a block between `<!-- mx-country-rules ... -->` and
  `<!-- /mx-country-rules -->`: the rules, the nearest-point distance, and that they start with No. 14
  (27 November 2026). Your Crossings paragraph and nav link are on other lines.
- `tests/run.js`: one block between test 7 (keyboard pin) and test 8 (midnight), marked
  `// ---- mx-country-rules ... ----` and `// ---- end mx-country-rules ----`. 23 checks: start number
  (No. 13 old rules, No. 14 new), one clue to start, moves cost 6, a miss costs 150 and opens a clue,
  label = highlighted slot after the free clue, the miss line, clues in the pin map, nearest-point
  distance (a square's edge, Arizona to Mexico), the softer last-pin score, the 0.14.0 save, and
  finding it (the strip at the top of both games at 375 px, by keyboard, the game list order, the
  city's end card).
  The Arizona check uses No. 19 (Mexico), which is the same on both schedules.

Not touched: `sw.js`, the `?v=` strings, `golden.json` (the country schedule is unchanged here),
`site.js`, `extras.js`, `site.css`, `sitemap.xml` (its dates already read 2026-11-25).

## Noticed, not changed

- `hints.html` (Mystery city's hints page) says "Each move costs 8 points"; Mystery city's moves cost 6
  since rules version 2. It's in the minified page text, so I left it for the city's owner.

## Round 2: the new scoring (both mystery games, from No. 14)

Design and sources: `review/scoring.md`. Made by `review/scoring-patch.py`, which edits index.html and
country.html (run it after `review/country-rules-patch.py`). If either page conflicts in a merge:

    python3 review/country-rules-patch.py --take-ours country.html
    python3 review/scoring-patch.py --take-ours

Changes to shared files, all marked `mx-scoring`:
- `index.html`: a block of `MxS...` functions on their own lines just before `/* Quick mode (asked for
  by players)`; on the game script line, the edits the script lists (the score `Jt`, the move's lock
  check, `Rv` stamps `P.s`, the miss line, the new-clue note, the cost line, the end card, the share
  text, the test hooks); a CSS block after `/* /mx-find */`; one hidden `<li class="mx-s2">` in the
  rules sheet.
- `tests/run.js`: a block `// ---- mx-scoring ... ----` after the mx-country-rules block. Three
  checks in the mx-country-rules block now expect the new scoring on No. 14.
- Also in this round: `hints.html` ("Each move costs 6 points") and `about/index.html` (the lede names
  the eight games), each a one-line change.
- `copy/copy.json` (city and country explainer and steps: the tile bonus, misses at 50 to 150, the
  stars), made by `review/scoring-copy-patch.py`, which also runs `copy/apply.py` (index.html,
  country.html and games/index.html foot copy). If copy.json conflicts, take your side and run
  `python3 review/country-copy-patch.py` then `python3 review/scoring-copy-patch.py`.
- `how-to-play/index.html`: a block `<!-- mx-scoring ... -->` after the first Scoring paragraph, and
  one sentence in the Mystery country block (misses at 50 to 150, the tile bonus).

## Merging your releases into this branch (done twice, 0.15.2 and 0.15.3)

A release bump changes the `?v=` lines right next to the game script lines, so index.html and
country.html conflict whichever way you merge. What worked both times, with this branch checked out:

    git checkout --theirs index.html country.html
    python3 review/country-rules-patch.py country.html
    python3 review/scoring-patch.py
    python3 review/country-quick-patch.py
    python3 copy/apply.py
    git add index.html country.html

The result differed from this branch only in the version strings, and the whole suite passed.
Merging this branch into yours: the same, with `--ours` (or `--take-ours` on the two patch scripts).

## Round 2: Quick mode for Mystery country (from No. 14)

Made by `review/country-quick-patch.py` (country.html only; run after the rules and scoring scripts).
Its copy is in `review/scoring-copy-patch.py` (country explainer and a Quick step) and one paragraph
in the `mx-country-rules` block of how-to-play. Tests: the `// ---- mx-country-quick ... ----` block.
The country remembers its own choice in `dailycity:country:mode`, separate from the city's
`dailycity:mode`. Checked against your branch at fc67a60 (0.15.5): all five scripts apply cleanly
and give this branch's index.html, country.html, copy.json, copy.js and games/index.html, apart
from your newer release content (version strings, the city facts).

Noticed in Mystery city, not changed (your code): the Tiles/Quick choice stays on screen after the
first move until the page redraws, and tapping it then does nothing. The country version hides it on
the first move (one extra call after a move); the same fix in the city would be adding `MxModeUi()`
to the move handler `za`.
