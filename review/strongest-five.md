# The five strongest games: what was fixed for scorecard 3 (0.15.64)

The scorecard 1 and 2 items for these five were already closed (see `scorecard.md`). These are the top three issues I found still open in a play-through of each at 375x667, plus the result card and the first move.

## Daily Voyage
1. Picking the right answer in a two-way stop threw the other card up over the header. The page used the class `x`, which the dialog close button also uses. Fixed, with a test.
2. There was no map after an answer. The Bigger, Crossing and Voyage stops now show where the answer is.
3. The Bigger stop only ever asked about countries. From No. 17 it follows Bigger?: a pair of cities by people (UN 2025 urban areas) on odd numbers.

## Crossings
1. The hint button looked like the main action (rust, like Cross). It's now a secondary, outlined button.
2. The Cross button looked broken while it waited for a name. Disabled buttons are now an inked dashed outline across the site.
3. The result card was a generic picture. It now shows your route as stepping stones between the two named countries, coloured by how each guess went.

## Dead Reckoning
1. The result card was generic. It now shows five pins, each ringed by how close it landed. No places are named.
2. "Lock in my pin" looked broken before a pin was placed. Fixed by the inked disabled style.
3. The game cards under every game showed emoji. They now show each game's comic panel.

## Ballast
1. The hull and sea were flat colour. The hull now has planks, shadow-side hatching and a heavier line, and the water has inked wave strokes at fixed places, so nothing flickers.
2. The result card now shows your own stack, drawn on chart paper.
3. Disabled controls are inked.

## Fathoms
1. The disabled Answer button looked broken. Fixed by the inked disabled style.
2. The result card now shows one sounding line per prompt, longer the deeper your answer.
3. The game cards show each game's panel (as for Dead Reckoning).

## First move under 10 seconds
On a first visit at 375x667, none of the five opens a dialog. The first control is visible in about 0.3 s and sits on the first screen, and each instruction is 11 to 14 words. A test checks this for all five.
