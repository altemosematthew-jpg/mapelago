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

## Fixes from the hands-on review of live 0.15.2

No. 12 and No. 13 keep their questions, answers and scoring (golden.json days 1 to 13 unchanged; the 0.14.0 and
0.15.2 save tests still pass). Changes that alter a question apply from No. 14 only; the rest is wording and layout.

Voyage
- Harbors: an anchor on islands 3 and 6 of the route, the points ladder (50 up to 1,000) shown once under it with the
  harbor values in bold, a key line, and a note under the score bar explaining "safe in harbor" while it is 0.
- Harder as the value rises (from No. 14): islands are ordered by a difficulty score (how well known the subject is,
  plus how hard the question type is), and the tests check it never goes down across an island run (No. 14 to 200).
  The wrong options also come from the same continent from island 5 on.
- Text alternative: the globe and outline pictures get role="img" and a label (the mark's latitude and longitude; the
  outline's continent, coast and rough area), every day. The label never names the answer.
- Share line: "I made it home: all ten islands. Can you?" after all ten; "How far would you sail?" after a wreck; the
  existing "Did I drop anchor too soon?" only after anchoring.
- The topic chips have a caption; a used spyglass stays visible, greyed, as "Spyglass used on this island" /
  "Spyglass used (one a day)"; "1,000" has its comma in the score, choices, status bar and share text (the share
  link keeps the plain number); city names read as in English from No. 14 (Nizhny Novgorod, Ludhiana, Prayagraj, Howrah,
  Urumqi, Izmir ...); the footer says "which city has the most people" instead of "sizes".

Stamps
- Size questions say "largest by area" (from No. 14). The explanation no longer quotes a km² figure: it says how many
  times bigger the answer is than the next largest option, which a few percent's difference in figures can't change.
  Note for the data owner: Bigger country? and Stamps read area from the same shared table, whose larger-country
  figures come from the map outlines and run a few percent under official total area (Nigeria 911,499 vs 923,768).
  The full replacement listed under "Flagged" in review/data-changes.md would fix both games at once.
- The answer message shows once (it was in the panel and again under it, and screen readers heard it twice), with no
  stray ✓/✗ before it.
- Explanations add a fact (every day; answers never change): "It's Bahrain. The highest point of Bahrain is Jabal ad
  Dukhan, 135 m." Facts come only from the table's capitals and the pack facts the games already treat as safe; the
  tests check each one against the pack. Border and continent explanations already added facts and are unchanged.
- The share grid is labelled: two lines of three, "✅ Capitals  🟨 Borders  ❌ Size".
- A line under the wheel: "Tap the wheel to stop it early. It skips categories that are already stamped or missed
  twice, and when only one is left it picks that one for you." Hidden while a question is open and on the result.

## Play-through on the branch (375 px phone, after merging 0.15.10)

The Cloudflare preview host is blocked by this session's network policy, so the same commit was played through the
local test server, which serves the files exactly as Pages does (the site has no build step). Played: Voyage No. 14 to
all ten islands, No. 15 anchored at island 4, Stamps No. 14 to a full page with three misses, practice in both
(right and wrong answers), and No. 12 on the real date. No console errors and nothing wider than 375 px. Fixed:

- Stamps explanations no longer say the answer twice ("It's Lesotho. Lesotho drives on the left." is now
  "Lesotho drives on the left."; the recap read "Lesotho. It's Lesotho. ..."). Language answers still lead with
  "It's English." because the fact is about the country. Tests check each explanation names the right answer.
- City-states: "Vatican City is in Europe. Its capital is Vatican City." now gives another fact instead.
- Practice: "Streak 0 · Best 0" is two separate items, spaced apart.

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
  `// ---- vx end ----` (it includes the `// ---- vx review fixes` tests). Nothing else in the file changed.
- `tests/golden.json`: Voyage and Stamps entries for No. 14 to 30, 60, 100, 200 and 365 only. If your branch also
  changes golden.json, take either side and re-run `cd tests && npm run golden` after the merge.
- `copy/copy.json`: two strings only, the `explainer` of `voyage` and of `stamps` (they now name the new topics, say
  Stamps' six change daily, and mention Play more). Then `python3 copy/apply.py` rewrote the foot of voyage.html and
  stamps.html and the two matching paragraphs in `games/index.html`; nothing else in its output changed. If copy.json
  conflicts, keep your side and re-apply those two sentences, then run `python3 copy/apply.py`.
- Not touched: site.js, extras.js, site.css, sw.js, copy.js.

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
- Clarity (played as a first-timer at 375 px): Voyage's opening line now says islands 3 and 6 are harbors where points
  are safe; its topic chips (up to nine now) moved under the question with a caption ("Today's topics. Each one fills
  in when you get it right.") instead of pushing the question down; practice hides the daily score bar so it can't be
  mistaken for the practice score. Stamps showed each answer message twice (in the panel and again below it, and
  screen readers heard it twice); now once, in the panel.
- The generated block sits just before `<div id="toast">`, one line away from the `?v=` script lines, so a version bump merges cleanly.
