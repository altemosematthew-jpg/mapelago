# Bigger games: where this session stopped (25 Nov 2026, 03:40 CT)

Branch `claude/great-brown-nw0nnp`, head 4523e26 plus this note. Work paused for the night; nothing is in progress.

## Done and live (mapelago.com, 0.15.14; data changes from No. 14, Fri 27 Nov)
- Bigger country?: both countries drawn at true scale after every pair (equal-area outlines), run counter,
  close-call race, sounds that respect mute, end-card strip of the day's ten pairs, share line.
- Bigger country?: official areas, all from the CIA World Factbook "Area: total" (Morocco left out);
  a deal that puts the last two pairs within 20%; "The last pairs are close" only when true; the reveal
  waits for the tap and the next pair takes the focus.
- Bigger city?: Duet's checked populations with their year (and unit where it matters), renamed cities,
  no districts or unchecked places, no pair within 10%. Decisions in `review/bigger-city-data.md`.
- Both games: Play more (endless practice, never touches the daily), your own pick in the result list,
  a "Your stats" panel. Nos. 1 to 13 unchanged (fingerprint test).
- Merged by the main session up to 6139caf.

## Waiting for the next release (on this branch, after 6139caf)
- d59cd47, playthrough fixes, with tests:
  - Bigger city?: English names instead of transliterations and suffixes from No. 14 (Gomel, Goyang,
    Bucheon, Seongnam, Uijeongbu, Ajman, Changshu, Wenshan, Jubail, Nizhny Novgorod, Naberezhnye
    Chelny). Six Bigger city? fingerprints change, all from No. 14.
  - Bigger country?: the "Same scale" label has its own strip, so no shape is drawn under it.
- 35d8e5b: the main branch at 0.15.12 merged in (no conflicts). 4523e26: merge-notes update.
- Tests at the head (03:43 CT): tests/run.js 634 passed, tests/history.js (Logbook) 78 passed.
- The main branch has moved on since (1f0cd7f); this branch has not merged that yet.

## Half-done
- Nothing.

## Next
- Bigger city? still says "Tap for the next pair" but moves on by itself after 1.7 s (the fix Bigger
  country? got). Needs an edit to its minified game script.
- Optionally name the sources in copy.json's explainers too (today a source line sits just after
  `<!-- copy:end -->` on each page).

## Waiting on Matthew
- Check the playthrough fixes (d59cd47) on the branch's Cloudflare preview before they go live; the
  preview hosts are blocked from this container, so they were tested on a local server only.
- Decide on the Bigger city? auto-advance above.
