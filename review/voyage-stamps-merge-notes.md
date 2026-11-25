# Voyage and Stamps: merge notes

Branch `claude/funny-einstein-pl8zlg`. More variety for Voyage and Stamps from the country pack, and a "Play more"
practice mode after each daily round. This file lists every change to a shared file, so the branch can be merged
into `claude/charming-bardeen-967w66` without guesswork. Release version, `sw.js` and the `?v=` strings are untouched.

## Start number

- **`VX.FROM = 14`** (in `review/vx-families.js`, copied into both pages). No. 13 and earlier are dealt exactly as
  before (golden.json unchanged for days 1 to 13; the test suite checks it).
- It must be **at least the day after the release goes live**, or a puzzle someone already played would change under
  their save (the saves store answer positions). No. 14 is 27 Nov 2026. If the release goes out on 27 Nov or later,
  raise `FROM` in `review/vx-families.js`, run `node review/vx-pack.js`, then `cd tests && npm run golden`.

## What changed in the games

- **New question families** from `data/countries.txt`: currency ("The baht is the currency of which country?"),
  driving side ("Which of these countries drives on the left?"), highest point ("Kilimanjaro is the highest point of
  which country?"), calling code ("Phone numbers in which country start with +81?"), web domain ("Which country's web
  addresses end in .jp?"), and in Voyage also "Which of these countries is landlocked?".
- **Voyage** from No. 14: still seven country islands and three city islands, easiest first. Each country is asked
  about a family it hasn't had before while it has one left, no family twice in a day where possible.
  Capital and border questions now read "the Philippines", "the Netherlands" (noted in review/data-changes.md).
- **Stamps** from No. 14: the wheel's six categories change every day: three or four of the original six plus two or
  three new ones (Money, Driving, Peaks, Phone codes, Web), never the same six two days running. Each category comes up
  in proportion to how many questions it has. The original six carry on along their old no-repeat order.
- **Days before any question repeats**, counted from No. 14: **Voyage 104 days** (first repeat No. 118),
  **Stamps 115 days** (first repeat No. 129). The tests fail if either drops below 96.
- **Play more**: a button under the daily result opens endless practice: random questions from the same families, a
  running streak and a best streak, harder wrong options as the streak grows (Voyage). It is labelled as practice and
  never writes the daily save, streaks, stats or share text. The best streak is kept in its own save,
  `dailycity:practice:v1` (`{"results":{},"voyage":{"best":n},"stamps":{"best":n}}`; the empty `results` keeps
  site.js's save repair from touching it). It travels with the save code like every `dailycity:` key.

## Facts never asked (from the pack's notes and review/data-pack-check.md)

- Flag colours (not fully verified): no flag questions at all.
- Right-hand driving (not fully verified): only ever a wrong option to "drives on the left?", never an answer.
- Domains .ye, .za, .zm, .zw (not fully verified); Kosovo has none.
- Highest points the pack says not to ask (France, Italy, India, Pakistan, Israel, Netherlands, Denmark, Spain,
  Portugal, Saudi Arabia, Kosovo), the United States (Denali / Mount McKinley, flagged), unnamed points, and mountains
  that are the highest point of two countries (Everest, Margherita Peak, Nimba, Korab, Olympus, Hermon, Catherine).
- Currencies flagged for review (Bulgaria's euro, Zimbabwe Gold), any currency more than one country uses, and any
  whose name gives the country away or matches another ("Kenyan shilling", "won").
- Calling codes two countries share (+1, +7, +39).
- Kazakhstan, Azerbaijan, Turkmenistan are never in landlocked questions (the Caspian).
- Tuvalu, Palestine, Kosovo and Taiwan are not in the games' country table, so never appear.

## Files

Only this branch touches (no conflicts expected):

- `voyage.html`, `stamps.html`: every edit is marked `vx-` (see below)
- `review/vx-pack.js` (generator), `review/vx-families.js`, `review/vx-voyage.js`, `review/vx-stamps.js` (sources of
  the generated block), `review/vx-pages-patch.py` (the page edits, idempotent), this file
- `tests/fixtures/voyage-stamps-save-from-v0.14.json`, `tests/fixtures/voyage-stamps-save-from-v0.15.json` (recorded
  by playing on the real 0.14.0 and 0.15.2 code)

Shared files:

- `tests/run.js`: one block before the final `} finally {`, between `// ---- vx: Voyage and Stamps ...` and
  `// ---- vx end ----`. Nothing else in the file changed.
- `tests/golden.json`: 42 entries, Voyage and Stamps for No. 14 to 30, 60, 100, 200 and 365. If your branch also
  changes golden.json, take either side and re-run `cd tests && npm run golden` after the merge.
- Not touched: site.js, extras.js, site.css, sw.js, copy/copy.json, copy.js.

## The edits in voyage.html and stamps.html

Made by `python3 review/vx-pages-patch.py`, then `node review/vx-pack.js` fills the generated block. On a page that
someone else has changed, run both from the repository root; the patch skips edits already made and stops without
writing if an anchor is missing.

- A `<script>/* vx-pack:start ... vx-pack:end */</script>` block between `site.js` and the game script (pack facts and
  the code from the review/vx-*.js files).
- In the game script: the day's deal from No. 14 (`rn=...VXV.deal` / `A=...SX.deal`), the new kinds' names, the badges
  list, the picture drawer taking a canvas, and `window.VXH` / `SX.wire()` hooks.
- `<!-- vx-practice:start/end -->` markup: the "Play more" button under the result and the practice panel.
- `/* vx-practice */` styles at the end of each page's `<style>`.
- The generated block sits just before `<div id="toast">`, one line away from the `?v=` script lines, so a version bump merges cleanly.
