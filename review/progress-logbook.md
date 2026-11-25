# Logbook: where I stopped (session on branch claude/compassionate-johnson-kphp1c)

Paused 25 Nov 2026, before 4:00 AM CT. Branch head: the commit that adds this note, on top of 4b70e20.

## Done and live on mapelago.com
- Logbook, the daily history game (`history.html`, `history.js`, `history-data.js`), live since 0.15.8: eight questions a day built from
  the four source-checked blocks in `review/history/` (Blocks A to D). No question repeats within 414 days; every question is listed with
  its source line in `review/history-questions.md`.
- Play more (practice), the stats panel and Past logbooks, live in 0.15.12.

## Done, waiting for the next release
These are on this branch but not yet in `claude/charming-bardeen-967w66` or `main`:
- 90a3b8a: two close slider tries keep their "1st" and "2nd" labels apart (they overlapped by 14.6 px), and the archive's
  "Past logbooks" and "Today's logbook" links line up. Two new tests. Found playing the game through at 375 px.
- 4b70e20: merge of `claude/charming-bardeen-967w66` at 0.15.12 into this branch, so the next merge back has no conflicts.
- This note.

The next release only needs to merge this branch; it changes Logbook's own files and this note, and no shared file. Checked at 4b70e20:
the existing suite passed 519 of 519 and the Logbook suite 81 of 81, and it merged with no conflicts.

## Half-done
Nothing.

## Next (not started)
- Nothing is owed. Possible follow-ups if Matthew wants them: more source-checked data (more former country names especially) to vary
  days further.

## Waiting on Matthew
- The name: Logbook, or an alternative (Tides, Almanac). Renaming needs one line in `history.js` plus the page title and the `site.js` entry.
- "The right decade": read as within 5 years either way; the alternative is the calendar decade.
- Whether to keep Block C's "what changed" notes as written, since some carry a cause or judgement (for example "after the dictator's death").
- Editorial calls listed in `review/history-questions.md` and `review/history/build.py`: wrong-answer pairs never offered together, and the
  wording of Block A-only events.
- Data left out, with reasons in `review/history-questions.md`: Yemen's "North Yemen and South Yemen", the Kenya capital-move clash
  (1907 in Block A, 1905 in Block D), Tonga 1970, Dakar 1902, Niamey 1926, and the seven single-source city renames.
- The Cloudflare preview can't be reached from this container; Matthew checks each release there himself.
