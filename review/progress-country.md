# Where the country session stopped (25 November 2026, 3:35 AM CT)

Branch `claude/happy-archimedes-imexu1`, head pushed before this note: 22abccd (synced with
`claude/charming-bardeen-967w66` at 0.15.11). Everything below went live in 0.15.12.

## Done

- Mystery country on Mystery city's rules from No. 14 (moves 6, a miss opens a clue, "Next clue: make a N"
  matching the slot, clues in the pin map, miss distance to the nearest point of the border).
- Mystery city and Mystery country side by side at the top of both games; "Guess the city / country" cards.
- The new scoring for both mystery games from No. 14: tile bonus (half the tile, 62 at most), misses 50 to 150
  by distance, the sum and stars on the end card, stars in the share. Design and sources: `review/scoring.md`.
- Quick mode for Mystery country from No. 14.
- Review fixes: rules shown for the round being played (No. 12 and 13 on the earlier rules), the languages
  clue label once, one name ("Mystery country No. 12"), "make an 8", Past countries (archive; no repeat
  welcome sheet, "This round" on its cost line).
- For teachers page at /teachers/, in every page's menu and the sitemap.
- Text fixes: city hints page (moves cost 6), About names every game.
- Tests for all of it in tests/run.js (blocks marked `mx-...`); both suites passed at 22abccd (474 and Logbook 66).

## Half-done

- Nothing in progress. Not merged: `claude/charming-bardeen-967w66` after 0.15.11 (it's at 0.15.14 now);
  the next merge follows `review/country-merge-notes.md`.

## Next (not started)

- Stars on the share image (the picture card still shows only the score).
- Mystery city's Tiles/Quick choice stays on screen after the first move until the page redraws (the city
  session's code; the country version hides it, and the fix is one call in the city's move handler).

## Waiting on Matthew

- Nothing from this session. The Cloudflare previews can't be reached from this container, so every check
  here was on a local server; the coordinating session checks each release on its preview.

## How the changes are made

The two mystery pages are minified, so this branch's changes are applied by scripts in `review/`
(country-rules-patch.py, scoring-patch.py, country-quick-patch.py, review-fixes-patch.py,
teachers-menu-patch.py, country-copy-patch.py, scoring-copy-patch.py). Each is safe to run again; the
order and the merge recipe are in `review/country-merge-notes.md`.
