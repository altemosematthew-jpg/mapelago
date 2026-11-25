# Bigger country? update: merge notes

Branch `claude/great-brown-nw0nnp`. Bigger country? gets a true-scale reveal after every pair, a run
counter and close-call moments, and an end card with the day's ten pairs at true scale. This file lists
every change to a shared file, so the branch can be merged into `claude/charming-bardeen-967w66`
without guesswork.

Nothing here changes the daily pairs, the scoring or the save. No release version or `?v=` was changed.

## Shared files changed

### extras.js (two lines, both marked `bigcountry`)
- `addPastButton()`: returns early unless the page has `#board`, so the "Past cities" button stays on
  the Mystery city page now that Bigger country? also loads this file.
- `window.MX` gains `play: play`, so other games can play the site's existing sounds. `play()` already
  does nothing when the player has muted sound (`dailycity:sound` = `off`).

### tests/run.js (one block)
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

Throwaway merge of this branch into yours at 9c13c92 ("Release 0.15.4: source-checked city facts ..."),
and before that at 13959f4 ("Release 0.15.2: Mystery country on Mystery
city's rules"): no conflicts (bigger-country.html and tests/run.js merged on their own), and the whole
test suite passed on the merged tree each time (454 checks at 0.15.4), including the version check (Bigger country?
picks up `extras.js?v=` from the page's site.js tag). On this branch alone: 413 checks.
