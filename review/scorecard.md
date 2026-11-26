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

## Status (updated as items are fixed)

| Item | Status |
|---|---|
| Ballast 1-9 | Fixed in 0.15.37, each with a test. Item 2: the readout, the line and the clear rule already shared one state; what was missing was the reason a tall stack hadn't cleared (too few pieces aboard), now shown, and a cleared stack is frozen so "Loaded!" can't show a fallen stack. |
| Fathoms: Tuvalu | Accepted from No. 20 (3 Dec), the start number set when Tuvalu was added. The all-193 answer test is P2. |
| Fathoms: "<-yours", typing appends | Not reproduced on the current build (the answer list was rebuilt in 0.15.2x). |
| Mystery country: 8 or 6 per move, Quick mode | The text describes the rules that start at No. 14 (27 Nov): 6 a move and Quick mode. They agree from that day; no change made. |
| Mystery city: clues under the pin bar | Fixed in 0.15.25 (one screen). |
| Dead Reckoning: New Zealand clipped, coordinates readout, 1 km difference | Fixed in 0.15.38, each with a test. |
| Voyage: globe alt text | Fixed in 0.15.38 (a description in words, no coordinates). |
| Voyage: sailing on is free; no explanation after an answer | Open: a scoring change, so it goes with difficulty (P3) and a start number. |
| Voyage: Greece outline has no islands | Open (P7): the outlines draw the main landmass only. |
| Logbook: same icon for 100 and 75; next question marked now early | Fixed in 0.15.38 with a test. |
| Logbook: stray tick | Not found; needs the grader's screenshot. |
| Logbook: a country asked twice in one day | Open: goes with never-the-same-twice (P3). |
| Sound button on all eleven | Open: goes with standard 9 (P4). |
| Copy: "the size of Philippines", Côte d'Ivoire | Fixed in 0.15.38. |
| Stale "You're here ... last game left" | Fixed in 0.15.37 (Today's games redraws when a game is finished). |
| P3 too easy, P4 facts, P5 sharing | Open: P3, P2 and P5 of the work order. |

## Line by line at 0.15.45
| Item | Now |
|---|---|
| Ballast 1 to 9 | fixed |
| Fathoms: Tuvalu | fixed (from No. 20; typeable everywhere now) |
| Fathoms: "<-yours", typing appends | not reproduced |
| Mystery country: 8 or 6 a move, Quick mode | fixed (the rules the text describes began at No. 14) |
| Mystery city: clues under the pin bar | fixed |
| Dead Reckoning: New Zealand, coordinates, 1 km | fixed |
| Voyage: alt text | fixed |
| Voyage: no explanation after an answer | partly (the fact is added where the question has one) |
| Voyage: sailing on is free | open (scoring decision) |
| Voyage: Greece's islands | open (showing small islands would also pull far territories into other outlines) |
| Logbook: 100 and 75 icon, now dot | fixed |
| Logbook: stray tick | open (not found) |
| Logbook: a country asked twice in a day | open (needs the schedule rebuilt from the source blocks) |
| Sound button on all eleven | fixed |
| Copy sweep | fixed |
| Too easy: Bigger city?, Bigger country? | fixed |
| Too easy: Stamps, Voyage | open (scoring decision) |
| Facts: areas | fixed (UN source from No. 17) |
| Facts: Botswana, Canada-Denmark, Mafadi | fixed (from No. 18) |
| Facts: city populations, Burundi, Ankara | open (Matthew) |
| One share format, beat yesterday, per-game streak | partly (shared look and site streak done; "beat yesterday" not) |
| Mystery country cycle rule | confirmed by Matthew |
