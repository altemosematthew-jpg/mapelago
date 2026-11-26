# Facts to check (from the grader's scorecard)

Nothing below has been changed in the data. "Sure" is how sure I am that our value is wrong, from general knowledge only; none of it is source-checked, so each needs a source before it is changed.

| # | Where | Our value | Claimed | Sure? | What I found | Recommendation |
|---|---|---|---|---|---|---|
| 1 | Ho Chi Minh City, population (Mystery city, Bigger city?, Dead Reckoning) | 3,467,331 | about 9 million | High | Ours is a narrow "city proper" figure from the cities list; the municipality is about 9 million. | A site-wide decision, not a one-off: pick one population definition (municipality or urban area) and have the whole cities list re-sourced. See content needed. |
| 2 | Matola, population | 675,422 | about 1 million | Fairly high | Same cause as 1. | Same as 1. |
| 3 | Saudi Arabia, area (Bigger country?, Fathoms, Stamps, Voyage) | 1,925,876 km2 | 2.15 million | High | Our areas are not from the country pack: they are measured from the map outlines, so every country is off by up to about 10%. | Needs a sourced area column for all countries (land or total, one definition). Until then a close pair in Bigger country? can be wrong. |
| 4 | Netherlands, area | about 37,100 km2 | 41,543 | High | Same cause as 3 (41,543 is total area; land is about 33,700). | Same as 3. |
| 5 | Pakistan, area | about 874,000 km2 | 796,000 | High | Same cause as 3; the outline includes Pakistan-administered Kashmir. | Same as 3, plus a rule for disputed territory. |
| 6 | Botswana, official languages (Fathoms language prompts) | English, Tswana | English only | High | English is the official language; Setswana is the national language. | Take Tswana off Botswana for "official language" prompts, or keep language prompts to countries on the pack's safe list. |
| 7 | Canada's borders | United States only | also Denmark (Hans Island, 2022) | High | The country pack lists Denmark; the shared table does not. | Never state "borders only one country" for Canada or Denmark. Keep the pair out of Crossings dailies, as the pack's rules say. |
| 8 | South Africa's highest point | Ntheledi, 3,450 m (the pack's wording) | Mafadi | High that both are right | Ntheledi is the Sotho name of Mafadi; Mafadi is the usual English name. | Show "Mafadi (Ntheledi)". |
| 9 | Fathoms: Burundi ranked above Botswana for "no big city" | both shown as having no city on our list | Bujumbura is a big city | Medium | Depth comes from the largest city on our cities list; a missing city reads as "no big city". | Check the cities list for missing largest cities (Bujumbura, Gaborone and others) before these prompts are used. |
| 10 | Ankara "about 15 million" | not found in the code | - | Unknown | Ankara's own figure is 3,517,182 in our list. The 15 million is probably Istanbul's, shown next to the capital's name somewhere. | Needs the grader's screen or prompt number to find. |

## What this means
- Items 1, 2 and 9 are one problem: the cities list uses mixed or narrow population figures and has gaps.
- Items 3, 4 and 5 are one problem: country areas are measured from the map, not sourced.
- Both feed standard 8 (never wrong) and the close pairs that standard 6 asks for. They are listed in `review/content-needed.md`.

## Sourced areas (27 Nov): differences of more than 10% from the old figure
The UN figure is in use from No. 17 for every row. The old figures were measured from the map outlines, which misses small islands and lagoons and, for a few countries, draws a different territory. South Sudan's old figure (624) was simply wrong.

| Country | Old (map) | UN 2023 | Change | Why |
|---|---|---|---|---|
| Bahamas | 12,657 | 13,940 | +10% | not explained by a note: the old figure was measured from the map outline |
| Bahrain | 544 | 778 | +43% | not explained by a note: the old figure was measured from the map outline |
| Barbados | 388 | 431 | +11% | not explained by a note: the old figure was measured from the map outline |
| Cabo Verde | 3,587 | 4,033 | +12% | not explained by a note: the old figure was measured from the map outline |
| Comoros | 1,582 | 2,235 | +41% | not explained by a note: the old figure was measured from the map outline |
| Cyprus | 5,710 | 9,251 | +62% | the whole island |
| France | 635,066 | 551,500 | -13% | metropolitan France only |
| Grenada | 288 | 345 | +20% | not explained by a note: the old figure was measured from the map outline |
| Guinea-Bissau | 32,044 | 36,125 | +13% | not explained by a note: the old figure was measured from the map outline |
| Kiribati | 941 | 726 | -23% | land area only |
| Liberia | 95,648 | 111,369 | +16% | not explained by a note: the old figure was measured from the map outline |
| Liechtenstein | 138 | 160 | +16% | not explained by a note: the old figure was measured from the map outline |
| Maldives | 67 | 300 | +348% | not explained by a note: the old figure was measured from the map outline |
| Malta | 276 | 315 | +14% | not explained by a note: the old figure was measured from the map outline |
| Marshall Islands | 236 | 181 | -23% | not explained by a note: the old figure was measured from the map outline |
| Micronesia | 524 | 702 | +34% | not explained by a note: the old figure was measured from the map outline |
| Monaco | 12 | 2 | -83% | not explained by a note: the old figure was measured from the map outline |
| Morocco | 582,379 | 446,550 | -23% | excludes Western Sahara |
| Nauru | 28 | 21 | -25% | not explained by a note: the old figure was measured from the map outline |
| Netherlands | 37,132 | 41,543 | +12% | the European part only |
| Norway | 384,265 | 323,772 | -16% | excludes Svalbard and Jan Mayen |
| Palau | 343 | 459 | +34% | not explained by a note: the old figure was measured from the map outline |
| Saint Kitts and Nevis | 234 | 261 | +12% | not explained by a note: the old figure was measured from the map outline |
| Saint Lucia | 552 | 616 | +12% | not explained by a note: the old figure was measured from the map outline |
| Saint Vincent and the Grenadines | 312 | 389 | +25% | not explained by a note: the old figure was measured from the map outline |
| San Marino | 70 | 61 | -13% | not explained by a note: the old figure was measured from the map outline |
| Saudi Arabia | 1,925,876 | 2,206,714 | +15% | not explained by a note: the old figure was measured from the map outline |
| Serbia | 77,482 | 88,444 | +14% | appears to include Kosovo |
| Seychelles | 172 | 457 | +166% | not explained by a note: the old figure was measured from the map outline |
| Singapore | 484 | 734 | +52% | not explained by a note: the old figure was measured from the map outline |
| Solomon Islands | 25,732 | 28,896 | +12% | not explained by a note: the old figure was measured from the map outline |
| Somalia | 473,624 | 637,657 | +35% | not explained by a note: the old figure was measured from the map outline |
| Suriname | 145,559 | 163,820 | +13% | not explained by a note: the old figure was measured from the map outline |
| Tonga | 431 | 747 | +73% | not explained by a note: the old figure was measured from the map outline |
| Vatican City | 1 | 0 | -56% | not explained by a note: the old figure was measured from the map outline |
| Yemen | 454,140 | 527,968 | +16% | not explained by a note: the old figure was measured from the map outline |
| South Sudan | 624 | 658,841 | - | the old figure was an error |

Items 3, 4 and 5 in the table above (Saudi Arabia, Netherlands, Pakistan) are settled by this source from No. 17.
