# Voyage and Stamps session: where I stopped (26 Nov 2026, 3:35 AM CT)

Branch `claude/funny-einstein-pl8zlg`. Details of every change are in `review/voyage-stamps-merge-notes.md`.

## Done (live on mapelago.com in 0.15.12)
- New question families from `data/countries.txt`, from No. 14: currency, driving on the left, highest point,
  calling code, web domain, and landlocked (Voyage). Flagged or unverified facts are never asked.
- Stamps' wheel draws six of eleven categories each day. Days before any question repeats, counted from No. 14:
  Voyage 104, Stamps 115.
- "Play more" practice after the daily round in both games. It keeps its own best streak and never touches the
  daily save, streaks, stats or share text.
- Clarity fixes from the 375 px first-time play and from the review of live 0.15.2: harbors and the points ladder,
  a used spyglass shown as used, text alternatives for the pictures, 1,000 with a comma, a fitting share line,
  English city names, Stamps size questions "by area", explanations that add a checked fact, a labelled share grid,
  and a note under the wheel.
- Tests for all of it, including saves recorded on 0.14.0 and 0.15.2. Last full run on 54a2bb5 (contains main at
  0.15.11): run.js 462 passed, history.js 66 passed.

## Half-done
- Nothing.

## Next
- Stamps size questions should use Bigger country?'s official total areas, now live. Today Stamps reads area from
  the shared country table (map-outline figures, a few percent under official totals). Because of that, its
  explanation compares sizes ("about 1.4 times the size of ...") rather than quoting km². Once Stamps uses the
  official figures, it can quote km² again.
- Changing areas can change which country is largest. So the switch needs its own start number, at least the day
  after it goes live, and a re-recorded golden.json for Stamps from that day.

## Waiting on Matthew
- Nothing blocking. Optional: the city data has entries flagged in `review/data-changes.md` (bogus or district
  entries). Voyage's "On the globe" and "most people" questions use them as before.
