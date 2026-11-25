# Mystery country update: merge notes

Branch `claude/happy-archimedes-imexu1`. Mystery country plays by Mystery city's rules from No. 14,
and is easier to find. This file lists every change to a shared file, so the branch can be merged
into `claude/charming-bardeen-967w66` without guesswork.

## The one conflict you will get: country.html, the game script line

The whole country game is one very long line of country.html (line 549 on main). Your branch changes
it (the no-repeat schedule, now from No. 20), and so does this one, so git reports a conflict on it.
To resolve, with your branch checked out and this one being merged in:

    git checkout --ours country.html        # your branch's country.html
    python3 review/country-rules-patch.py country.html

`--take-ours` keeps your side of each conflict block and leaves the parts git merged on its own; the
script then makes every change this branch makes to country.html (the game script, the cost line, the
rules sheet, the styles, the city/country strip). Run on main's country.html it gives this branch's copy byte for
byte. It is safe to run twice and stops without writing anything if one of its anchors has changed.
Checked by a throwaway merge into your branch at 10ea3ca (Quick mode for Mystery city): country.html
was the only conflict, the recipe above resolved it, and the whole test suite passed (360 checks).

Every function the script adds is named `Mx...` and sits on its own lines, after the comment
`/* mx-country-rules ... */`.

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

- `tests/run.js`: one block between test 7 (keyboard pin) and test 8 (midnight), marked
  `// ---- mx-country-rules ... ----` and `// ---- end mx-country-rules ----`. 23 checks: start number
  (No. 13 old rules, No. 14 new), one clue to start, moves cost 6, a miss costs 150 and opens a clue,
  label = highlighted slot after the free clue, the miss line, clues in the pin map, nearest-point
  distance (a square's edge, Arizona to Mexico), the softer last-pin score, the 0.14.0 save, and
  finding it (the strip at the top of both games at 375 px, by keyboard, the game list order, the
  city's end card).
  The Arizona check uses No. 19 (Mexico), which is the same on both schedules.

Not touched: `sw.js`, the `?v=` strings, `golden.json` (the country schedule is unchanged here).
