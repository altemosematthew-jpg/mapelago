# Bigger country? update: merge notes

Branch `claude/great-brown-nw0nnp`. Bigger country? gets a true-scale reveal after every pair, a run
counter and close-call moments, and an end card with the day's ten pairs at true scale. This file lists
every change to a shared file, so the branch can be merged into `claude/charming-bardeen-967w66`
without guesswork.

It also adds "Play more", an endless practice mode, to Bigger country? and Bigger city? (bigger.html).

Nothing here changes the daily pairs, the scoring or the save. No release version or `?v=` was changed.

## Shared files changed

### extras.js (two lines, both marked `bigcountry`)
- `addPastButton()`: returns early unless the page has `#board`, so the "Past cities" button stays on
  the Mystery city page now that Bigger country? also loads this file.
- `window.MX` gains `play: play`, so other games can play the site's existing sounds. `play()` already
  does nothing when the player has muted sound (`dailycity:sound` = `off`).

### tests/run.js (one block, also covering practice in bigger.html)
- One block between `// ---- bigcountry ...` and `// ---- end bigcountry ----`, placed just before
  `// 8. a game in progress survives midnight`. Nothing else in the file is touched.

### tests/fixtures (new files only)
- `bigcountry-save-from-v0.14.json`, `bigcountry-save-from-v0.15.json`: saves recorded by playing
  release 0.14.0 (commit 78bf19c) and 0.15.0 (commit 70be1eb) in a browser.

### Not changed
site.js, site.css, sw.js, copy/copy.json, copy.js, shapes.js, world.js. Bigger country? loads
extras.js from its own script with the same `?v=` as the page's site.js tag, so a release bump needs no
change for it, and the copy the service worker already saves (`extras.js?v=...` is in its list) is the
one used offline.

## bigger-country.html

Everything this branch adds sits on its own lines between `bigcountry` markers:
- a style block (`/* bigcountry: the round bar ... */` to `/* /bigcountry */`) at the end of the `<style>`,
- an empty `<nav class="tools">` in the header (extras.js puts the sound button there),
- the round bar and reveal panel inside `#play`, the stats and strip inside `#done`,
- one readable `<script>` (`MxBC`) right after `</footer>`, away from the `?v=` lines.

The game script line itself changes in one spot only: its last statements, which started the round,
now hand the round to `MxBC()` (and keep the old start as the fallback). If your branch also changes
that line (it holds the country data), git will report a conflict on it. To resolve, keep your side of
that one line, leave git's merge of the rest of the file as it is, then run:

    python3 review/bigcountry-patch.py
    git add bigger-country.html

The script re-adds the hook to the game line and checks that this branch's other blocks are present.
It is safe to run twice and stops without writing if an anchor has changed.

## Play more (practice), in both bigger-country.html and bigger.html

- The same readable `<script>` block (`/* bigcountry-practice: ... */`, defines `MxPractice`) sits right
  after `</footer>` in both pages; a test checks the two copies are identical. Keep them in step.
- Both pages get the same markup between `<!-- bigcountry-practice -->` markers: a "Play more" box inside
  the end card (under the Copy result row), and a `#mxpr` section after `#done`.
- Styles: a `/* bigcountry-practice ... */` block at the end of each page's `<style>`. bigger.html also gets
  a copy of the round bar and reveal styles from bigger-country.html, under the same marker.
- bigger.html gets an empty `<nav class="tools">` in the header (the sound button, from extras.js, which
  the practice block loads with the page's own `?v=`), and one call at the end of its game script line,
  after `O();`: `MxPractice({id:"bigger",pool:x,unit:v.unit,esc:$,icon:L})`. `review/bigcountry-patch.py`
  re-adds it if a merge conflicts on that line. In bigger-country.html, MxBC() starts the practice mode.
- Practice deals random pairs (Math.random, not the daily seed) from the whole pool the daily uses, in
  bands that close up as the run grows: at least 8x apart for the first pair of a run, down to 1.15-1.45x
  from the eleventh. A miss ends the run and the next pair starts wide again.
- Storage: only `dailycity:bigcountry:practice` / `dailycity:bigger:practice`, holding `[best run]` as a
  JSON array. An array, not an object, so site.js's save repair (which adds `results` to any `{...}` save
  under `dailycity:`) leaves it alone. Practice never writes the daily save, so results, streaks, stats,
  the share text and "today's games" are unchanged (a test compares them before and after).

## Review fixes (official areas, checked city figures), from No. 14

- **Start number 14 (Fri 27 Nov 2026), in two places:** `var FROM = 14` in the `bigcountry` script of
  bigger-country.html and in the `bigcountry-city` script of bigger.html. Nos. 1 to 13 keep their pairs and
  figures (tests/golden.json changed only for the two Bigger games from No. 14; a test checks it). Merge
  before 27 Nov, or move both numbers to the day after the merge, then run `npm run golden` and check the
  diff touches only `bigger` and `biggercountry` from that number.
- Bigger country?: areas are the CIA World Factbook's "Area: total" (read from the factbook.json mirror on
  25 Nov 2026), in `AREAS` in the bigcountry script, keyed by the map's country number. Morocco is left out.
  A seeded deal (`deal()` there) replaces the game's own from No. 14: same ten-a-day deck rotation idea,
  bands from at least 8x down to 1.05-1.15x for the last pair.
- Bigger city?: the checked figures, names and drops are the `FIX` and `DROP` lists in the new
  `bigcountry-city` script of bigger.html; every decision is listed in `review/bigger-city-data.md`. The game's
  own deal runs on the checked pool, and a day is re-dealt if any pair is within 10%.
- bigger.html's hook moved: it now runs just before `O();` (the first round), not after.
  `review/bigcountry-patch.py` knows the new form.
- Both games: the result list marks the player's pick and a "Your stats" panel (played, average, streak,
  best streak, score spread) sits above it, from `MxBigEnd` in the shared practice block. The country
  reveal waits for the Next tap (no auto-advance) and the next pair takes the focus.
- A source line under each game's explainer, just after `<!-- copy:end -->` (copy.json not touched; you
  may want the explainers in copy.json to name the sources too).
- **Shared test file:** tests/golden.json (Bigger games, No. 14 on).

## What it relies on in the game script
`MxBC()` is handed the game's own values: the countries (`M`), the day's pairs (`R`), the puzzle number,
the picks array and save object (mutated in place, so midnight handling still sees them), the
right-or-wrong test, the score, the save function, the unit text, the streak count, the countdown, the
toast, the escape and icon helpers, and the rank names. It saves exactly what the old code saved
(`results[n] = {score, picks}` or `game = {n, picks}`), so saves go both ways between versions.

## Known data notes (not changed here)
- The map's outlines and the official areas agree to within 1% for every country in the game except
  three, where the map draws a different territory from the one the figure counts: Cyprus (the map
  leaves out the north), Somalia (leaves out Somaliland) and Morocco (includes Western Sahara). The
  reveal's numbers and its "N× the size" line always use the official figures.
- `world.js` gives Ashmore and Cartier Islands the same number as Australia. The old card shapes in
  shapes.js drew Australia as that islet; the new drawing keeps the larger geometry. shapes.js is left
  as it is (it now only loads the outlines).

## Checked

Throwaway merges of this branch into yours, each with the whole test suite run on the merged tree:
- at fc67a60 ("Release 0.15.5: visitor counting switched on"), with Play more: no conflicts, 491 checks passed.
- earlier at 9c13c92 (0.15.4) and 13959f4 (0.15.2): no conflicts, all checks passed.
bigger-country.html, bigger.html and tests/run.js merged on their own each time, and the version check
passed (the pages pick up `extras.js?v=` from their own site.js tag). On this branch alone: 446 checks.
