# Independent scorecard (Duet, live 0.15.21, 500x667 and 1280x800)

Every game scored 5-7 of 10; Wordle and Worldle score 9. Ballast scored lowest (5). Status column is filled in as items are fixed.

## P1 Ballast bugs (reproduce, fix, add a test)
1. Third country overboard doesn't end the load: counter shows "Overboard 3 of 2 allowed" and the game waits on naming a country that's in the sea (Daily, drop three off the edge).
2. Stack readout disagrees with the drawn line: level 2 read 527 of 521 with the piece at or below the line; level 3 read 2,902 of 1,086 for 15 s without clearing; level 6 said "Loaded!" while below the line. Drive every readout and the clear rule from one game state.
3. Load line changes on each retry of the same level (1,325, then 804, then 1,345 km). Same level, same seed, same line.
4. A level won't clear until the naming question is answered or skipped; naming must never block. Label the skip "Skip naming".
5. Stale level-4 name buttons stay on screen above the typed field from level 5.
6. Levels 1-3 and the Calm harbour voyage end after one or two pieces (3 stars after 2 of 6). Every level needs at least three pieces; every voyage uses most of its cargo.
7. Stale text after finishing ("A country went overboard.", "You're here ... last game left (10 games)").
8. Voyage questions name the answer ("capital of France" to earn France): never name or imply the country being earned.
9. Desktop: Ballast is a narrow 410px column; use a two-column layout like Mystery city.

## P2 Other broken things
- Fathoms still rejects Tuvalu ("less land than Luxembourg"): check every prompt's answer list against all 193 UN members with a test. Stray "<-yours" text; typing appends to the last answer.
- Mystery country: notice says 8 per move, long text says 6; text mentions a Quick mode. Make them agree with the code.
- Mystery city: clues sit under the sticky Drop a pin bar on a short phone.
- Dead Reckoning: New Zealand clipped at the map's right edge; "Pin at x degrees" readout lets you aim by coordinates (say "pin placed"); distance differs by 1 km between play and summary.
- Voyage: globe alt text gives latitude and longitude; sailing on is always free so the harbour choice is meaningless (make it risk banked points or remove it); no explanation after an answer; Greece outline has no islands.
- Logbook: same icon for 100 and 75 points; next question marked "now" early; stray tick; a country asked twice in one day.
- Sound button only on 5 of 11 games: add the shared one everywhere.
- Copy sweep: "the size of Philippines", Cote d'Ivoire accent, leftover symbols.

## P3 Too easy
Bigger city?, Bigger country?, Stamps and Voyage are near-certain perfect scores. Ramp each to a close or obscure final third. Bigger country?'s last pair was 67% apart.

## P4 Facts the grader says are wrong
Not to be changed on its word alone: each goes in `review/facts-to-check.md` with old value, claimed value and confidence. Ho Chi Minh City "about 3.5 million" (claimed about 9M); Matola 680,000 (about 1M); Saudi Arabia 1.93M km2 (2.15M); Netherlands 37,100 (41,543); Pakistan 874k (796k); Tswana as official language of Botswana (English); "Canada borders only United States" (also Denmark since 2022, Hans Island); "Ntheledi" for Mafadi; Fathoms ranks Burundi above Botswana for no big city; Ankara shown with about 15 million.

## P5 Sharing
One share format across all games (brand, puzzle number, a grid that varies with play, link); a "beat yesterday" line and per-game streak on result cards.

## Front door
The grader's pick for new visitors is Dead Reckoning (understood in under 10 seconds). Home page not to be changed yet; Matthew decides.
