# Mapelago browser tests

They check that every page loads, that the daily puzzles stay on schedule, that saves from the live
version still replay, that streaks and freezes count correctly, and a few fixes that are easy to break
(damaged saves, keyboard play, midnight).

    cd tests
    npm install
    npx playwright install chromium
    npm test

`golden.json` is the record of each game's puzzle for days 1 to 30, 60, 100, 200 and 365. If a change
is meant to alter future puzzles (for example a data fix), run `npm run golden` and review the diff of
golden.json before committing it.

`history.js` tests Logbook (history.html): a full round on a phone and by keyboard alone, share text without
spoilers, no repeated question within the cycle the data claims, every question traced to a line of
review/history/block-a.txt or block-b.txt, offline after the first visit, and nothing loaded from other sites.
`history-golden.json` is its schedule record; `npm run golden` rewrites it with the others.
