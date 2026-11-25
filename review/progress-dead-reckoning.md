# Dead Reckoning: where this session stopped (25 November 2026, 03:35 CT)

Branch `claude/zealous-allen-u0n2ro`. Dead Reckoning went live on mapelago.com in release 0.15.14 (the main session
played its first round on the preview and checked the live page).

## Done
- The game: `dead-reckoning.html` and `dead-reckoning.js`. Five places a day on a blank map, scored by great-circle
  distance, out of 1,000. Practice (Play more), stats, share text, beat-my-score code `dr`, next-game button, every look,
  375 px and 1440 px.
- Shared-file patch `review/dead-reckoning-patch.py` (idempotent; adds Dead Reckoning after the last game everywhere
  games are listed and works out the "ten games" counts). Checked on clean copies of 0.15.5, 0.15.7, 0.15.8, 0.15.10,
  0.15.11 and 0.15.12. Every shared-file change is listed in `review/dead-reckoning-merge-notes.md`.
- Duet's 300 source-checked places that aren't cities, saved unchanged in `review/dead-reckoning-places.md`. 290 are used
  (the ten flagged overlaps are left out): one or two a day from No. 14. Nos. 1–13 are unchanged, and a test proves it.
- Tests: `tests/dead-reckoning.test.js`, run from `tests/run.js`. Last run on this branch: `run.js` 560 passed,
  `history.js` 78 passed, nothing failed.

## Half-done
- Nothing in progress.

## Next
- **Reveal facts use old city populations.** The first fact line takes its population from Mystery city's and
  Bigger city's original lists. For example, Lahore shows "about 6.3 million", but Pakistan's 2023 census counted
  13,004,135. Switch the facts to the source-checked populations the Bigger games now use. The tool to change is
  `tools/dead-reckoning-data.js`, which writes the `pop` field in `DR_PLACES`. Scoring and the daily schedule don't
  read `pop` directly, but tiers are worked out from it when the list is built. So keep the tier assignment as it is
  (or keep it frozen for days already published), so that past puzzle numbers don't change. The No. 12 and Nos. 1–13
  fingerprint tests will catch any shift.
- Round 5 still has no remote-island capitals: the repo has no coordinates for them. Duet's landmarks now cover some
  remote islands (Tristan da Cunha, Pitcairn, Bouvet and others) from No. 14.

## Waiting on Matthew
- Nothing blocking. The population fix above needs his OK on which source-checked figures to use, if there is more than one set.
- This session could not reach the Cloudflare previews (its network doesn't allow `pages.dev`); every release is checked on its preview by the main session.
