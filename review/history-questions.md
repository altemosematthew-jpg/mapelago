# Logbook: every question the game can ask

Written by `review/history/build.py` from `review/history/block-a.txt`, `block-b.txt`, `block-c.txt` and `block-d.txt` (the source-checked blocks, unchanged). Each entry quotes the Block line it came from. Regenerate this file by running the script; don't edit it by hand.

## The numbers

| | |
|---|---|
| Dated facts (Block B and D events, Block A years, Block C city renames) | 833 |
| ...usable in "Which came first?" and "Put in order" | 826 |
| ...usable in "When was it?" (the timeline slider) | 797 |
| "What was it called?" questions | 144 |
| "Independent from whom?" questions | 146 |
| "Capital on the move" questions | 177 |
| "What was this city called?" questions | 350 |
| Days before any question repeats | 414 (the slider, name, from-whom and capital questions each run through their whole bank once in 414 days; a pair or order of events is never repeated in the 828-day schedule) |
| Shipped schedule | No. 1 to No. 828, then it starts again from No. 1 |
| Shortest gap before the same fact appears again, in a different question | 21 days |
| Average gap before a fact appears again | 61 days |
| Facts used at least once | 833 of 833 |

Kinds per day on average over a cycle: how many years apart 0.60, multiple choice 1.97, put in order 1.59, when was it 1.93, which came first or later 1.91.

## Rules applied

- Wording of Block B events is used exactly as written.
- "Which came first?" and "Put in order": events at least 5 years apart; 20 years when either is a defensible-year country's independence (Austria, Egypt, Eritrea, Estonia, Guinea-Bissau, Iceland, Indonesia, Latvia, Libya, Lithuania, Malaysia, Marshall Islands, Micronesia, North Korea, Philippines, Romania, South Africa, South Korea, Timor-Leste, Viet Nam, Zimbabwe).
- The same fact comes back no sooner than 21 days later, in any kind of question.
- "When was it?": never asked for those countries' independence, for unconfirmed years, or for the capital moves of Germany, Japan, Kazakhstan, Kenya, Solomon Islands, Tanzania.
- Land within 5 years and it counts as right (a decade's window); the exact year scores a bonus.
- Predecessor states (Czechoslovakia, Gran Colombia, Ottoman Empire, Soviet Union, Yugoslavia) are never offered or accepted as former names; Yemen's "North Yemen and South Yemen" is left out for the same reason.
- Years Duet couldn't confirm (Argentina's United Provinces of the Rio de la Plata end year; Central African Republic's Ubangi-Shari end year; Nauru's Pleasant Island end year; Tuvalu's Ellice Islands end year; Uruguay's Cisplatina start year) are never asked or shown.
- Wrong answers never come from a country that shares a Block B line with the one asked about, or from these pairs: Kiribati / Tuvalu; Zimbabwe / Zambia; Zimbabwe / Malawi; Zambia / Malawi; Indonesia / Timor-Leste; Egypt / Sudan; Namibia / South Africa; Austria / Germany; Haiti / Dominican Republic; Argentina / Uruguay; Brazil / Uruguay; Malaysia / Singapore; United Arab Emirates / Oman; Ireland / United Kingdom; China / Mongolia; Ghana / Togo; Moldova / Ukraine; Democratic Republic of the Congo / Republic of the Congo; Sudan / Mali; Sudan / South Sudan; Russia / Ukraine; Russia / Belarus; Russia / Kazakhstan; Bangladesh / Pakistan; India / Pakistan; India / Bangladesh; Colombia / Panama; Colombia / Venezuela; Colombia / Ecuador; Benin / Togo; Papua New Guinea / Solomon Islands; Samoa / New Zealand.
- At most one 2020s event and two South American events a day.
- "Which came first?", "Which came later?", "Put in order" and "How many years apart?" are made from two or three of the dated facts listed below (those marked `first`); "How many years apart?" uses only facts marked `slider`. A pair or order of facts is never repeated in the shipped schedule.
- Canada, Australia, China, Switzerland, Italy and Liechtenstein are "formed" or "founded", never "became independent".
- Burundi's move is to its political capital. Nauru stays Nauru. Myanmar's capital move is 2005.

## Where Block A and Block B describe the same thing

These Block A years and Block C renames were joined to the Block B or Block D event with the same year, so the game asks it once. One clash was found and nothing was chosen: Kenya's capital move is 1907 in Block A and 1905 in Block D, so neither year is asked (the move is still asked as "which city?", without a year).

- Afghanistan, independence 1919: "Treaty of Rawalpindi: Britain recognizes Afghan independence"
- Albania, independence 1912: "Albania declares independence from the Ottoman Empire"
- Algeria, independence 1962: "Algeria becomes independent from France"
- Angola, independence 1975: "Angola becomes independent from Portugal"
- Argentina, independence 1816: "Argentina declares independence from Spain"
- Armenia, independence 1991: "Soviet Union formally dissolved into 15 states"
- Australia, independence 1901: "Six Australian colonies federate as Commonwealth of Australia"
- Azerbaijan, independence 1991: "Soviet Union formally dissolved into 15 states"
- Bangladesh, independence 1971: "Bangladesh declares independence from Pakistan, wins war that year"
- Barbados, independence 1966: "Barbados becomes independent from the United Kingdom"
- Belarus, independence 1991: "Soviet Union formally dissolved into 15 states"
- Belgium, independence 1830: "Belgium declares independence from the Netherlands"
- Belize, independence 1981: "Belize becomes independent from the United Kingdom"
- Bolivia, independence 1825: "Bolivia declares independence"
- Botswana, independence 1966: "Bechuanaland becomes independent as Botswana"
- Brazil, independence 1822: "Brazil declares independence from Portugal"
- Brunei, independence 1984: "Brunei becomes fully independent from the United Kingdom"
- Bulgaria, independence 1908: "Bulgaria declares independence from the Ottoman Empire"
- Burkina Faso, independence 1960: "Upper Volta becomes independent from France"
- Burundi, independence 1962: "Ruanda-Urundi splits into independent Rwanda and Burundi"
- Cabo Verde, independence 1975: "Cabo Verde becomes independent from Portugal"
- Cameroon, independence 1960: "French Cameroun becomes independent as Cameroon"
- Canada, independence 1867: "Dominion of Canada created by Confederation"
- Chad, independence 1960: "Chad becomes independent from France"
- Chile, independence 1818: "Chile declares independence from Spain"
- China, independence 1949: "People's Republic of China proclaimed in Beijing"
- Colombia, independence 1819: "Congress of Angostura proclaims the Republic of Colombia (Gran Colombia)"
- Costa Rica, independence 1821: "Central America declares independence from Spain"
- Cote d'Ivoire, independence 1960: "Cote d'Ivoire becomes independent from France"
- Cuba, independence 1902: "Cuba becomes independent as the Republic of Cuba"
- Czechia, independence 1993: "Czechoslovakia splits into the Czech Republic and Slovakia"
- Democratic Republic of the Congo, independence 1960: "Belgian Congo becomes independent"
- Djibouti, independence 1977: "Djibouti becomes independent from France"
- Dominican Republic, independence 1844: "Dominican Republic declares independence from Haiti"
- Ecuador, independence 1830: "Ecuador separates from Gran Colombia"
- Egypt, independence 1922: "Britain declares Egypt independent, ending its protectorate"
- El Salvador, independence 1821: "Central America declares independence from Spain"
- Equatorial Guinea, independence 1968: "Equatorial Guinea becomes independent from Spain"
- Eritrea, independence 1993: "Eritrea becomes formally independent from Ethiopia"
- Eswatini, independence 1968: "Swaziland becomes independent from the United Kingdom"
- Fiji, independence 1970: "Fiji becomes independent from the United Kingdom"
- Finland, independence 1917: "Finland declares independence from Russia"
- Gabon, independence 1960: "Gabon becomes independent from France"
- Gambia, independence 1965: "Gambia becomes independent from the United Kingdom"
- Georgia, independence 1991: "Soviet Union formally dissolved into 15 states"
- Ghana, independence 1957: "Gold Coast becomes independent as Ghana"
- Greece, independence 1830: "London Protocol recognises Greece as independent"
- Guatemala, independence 1821: "Central America declares independence from Spain"
- Guinea, independence 1958: "Guinea becomes independent from France"
- Guyana, independence 1966: "British Guiana becomes independent as Guyana"
- Haiti, independence 1804: "Haiti declares independence from France"
- Honduras, independence 1821: "Central America declares independence from Spain"
- Iceland, independence 1944: "Iceland dissolves union with Denmark and becomes a republic"
- India, independence 1947: "British India partitioned into India and Pakistan"
- Iraq, independence 1932: "Iraq becomes independent as British mandate ends"
- Ireland, independence 1922: "Irish Free State established"
- Israel, independence 1948: "Israel's declaration of independence proclaimed in Tel Aviv"
- Italy, independence 1861: "Kingdom of Italy proclaimed"
- Jamaica, independence 1962: "Jamaica becomes independent from the United Kingdom"
- Jordan, independence 1946: "Transjordan becomes an independent kingdom"
- Kazakhstan, independence 1991: "Soviet Union formally dissolved into 15 states"
- Kenya, independence 1963: "Kenya becomes independent from the United Kingdom"
- Kiribati, independence 1979: "Gilbert Islands become independent as Kiribati"
- Kyrgyzstan, independence 1991: "Soviet Union formally dissolved into 15 states"
- Lebanon, independence 1943: "France accepts Lebanon's independence"
- Lesotho, independence 1966: "Basutoland becomes independent as Lesotho"
- Liberia, independence 1847: "Liberia declares independence"
- Libya, independence 1951: "Libya becomes independent as a united kingdom"
- Madagascar, independence 1960: "Madagascar becomes independent from France"
- Malawi, independence 1964: "Nyasaland becomes independent as Malawi"
- Malaysia, independence 1957: "Federation of Malaya becomes independent"
- Malta, independence 1964: "Malta becomes independent from the United Kingdom"
- Mauritania, independence 1960: "Mauritania becomes independent from France"
- Mexico, independence 1821: "Treaty of Cordoba establishes Mexican independence from Spain"
- Moldova, independence 1991: "Soviet Union formally dissolved into 15 states"
- Montenegro, independence 2006: "Montenegro declares independence, ending Serbia and Montenegro union"
- Morocco, independence 1956: "French protectorate in Morocco ends"
- Mozambique, independence 1975: "Mozambique becomes independent from Portugal"
- Myanmar, independence 1948: "Burma becomes independent outside the Commonwealth"
- Namibia, independence 1990: "Namibia becomes independent from South Africa"
- Nauru, independence 1968: "Nauru becomes independent from Australian-run UN trusteeship"
- Nicaragua, independence 1821: "Central America declares independence from Spain"
- Nigeria, independence 1960: "Nigeria becomes independent from the United Kingdom"
- Norway, independence 1905: "Norway dissolves its union with Sweden"
- Pakistan, independence 1947: "British India partitioned into India and Pakistan"
- Palau, independence 1994: "Palau becomes independent in free association with United States"
- Panama, independence 1903: "Panama separates from Colombia"
- Papua New Guinea, independence 1975: "Papua New Guinea becomes independent from Australia"
- Peru, independence 1821: "Peru declares independence from Spain"
- Philippines, independence 1946: "Philippines becomes independent from the United States"
- Rwanda, independence 1962: "Ruanda-Urundi splits into independent Rwanda and Burundi"
- Samoa, independence 1962: "Western Samoa becomes independent from New Zealand"
- Sao Tome and Principe, independence 1975: "Sao Tome and Principe becomes independent from Portugal"
- Saudi Arabia, independence 1932: "Ibn Saud proclaims the Kingdom of Saudi Arabia"
- Serbia, independence 1878: "Treaty of Berlin recognises Romania, Serbia and Montenegro"
- Seychelles, independence 1976: "Seychelles becomes independent from the United Kingdom"
- Sierra Leone, independence 1961: "Sierra Leone becomes independent from the United Kingdom"
- Singapore, independence 1965: "Singapore separates from Malaysia as a sovereign state"
- Slovakia, independence 1993: "Czechoslovakia splits into the Czech Republic and Slovakia"
- Solomon Islands, independence 1978: "Solomon Islands becomes independent"
- Somalia, independence 1960: "British and Italian Somaliland unite as the Somali Republic"
- South Africa, independence 1910: "Union of South Africa formed from four British colonies"
- South Sudan, independence 2011: "South Sudan becomes independent from Sudan"
- Sri Lanka, independence 1948: "Ceylon becomes independent from Britain"
- Sudan, independence 1956: "Sudan becomes independent"
- Suriname, independence 1975: "Suriname becomes independent from the Netherlands"
- Tajikistan, independence 1991: "Soviet Union formally dissolved into 15 states"
- Tanzania, independence 1964: "Tanganyika and Zanzibar unite; renamed Tanzania same year"
- Timor-Leste, independence 2002: "Timor-Leste becomes independent after UN administration"
- Togo, independence 1960: "Togo becomes independent from France"
- Tunisia, independence 1956: "Tunisia becomes independent from France"
- Turkmenistan, independence 1991: "Soviet Union formally dissolved into 15 states"
- Tuvalu, independence 1978: "Ellice Islands become independent as Tuvalu"
- Uganda, independence 1962: "Uganda becomes independent with Kampala as its capital"
- Ukraine, independence 1991: "Soviet Union formally dissolved into 15 states"
- United Arab Emirates, independence 1971: "Six Trucial States form the United Arab Emirates"
- Uruguay, independence 1828: "Uruguay becomes independent between Brazil and Argentina"
- Uzbekistan, independence 1991: "Soviet Union formally dissolved into 15 states"
- Vanuatu, independence 1980: "New Hebrides becomes independent as Vanuatu"
- Venezuela, independence 1830: "Venezuela separates from Gran Colombia"
- Viet Nam, independence 1976: "North and South Vietnam formally reunified"
- Yemen, independence 1990: "North and South Yemen unify as Republic of Yemen"
- Zambia, independence 1964: "Northern Rhodesia becomes independent as Zambia"
- Zimbabwe, independence 1980: "Southern Rhodesia becomes independent Zimbabwe"
- Australia, capital 1927: "Australian Parliament moves from Melbourne to Canberra"
- Belize, capital 1970: "Government of British Honduras moves capital to new Belmopan"
- Botswana, capital 1965: "Gaborone replaces Mafikeng as capital of Bechuanaland"
- Brazil, capital 1960: "Brasilia replaces Rio de Janeiro as capital of Brazil"
- Burundi, capital 2019: "Burundi makes Gitega its political capital instead of Bujumbura"
- Cote d'Ivoire, capital 1983: "Yamoussoukro made capital of Cote d'Ivoire instead of Abidjan"
- Equatorial Guinea, capital 2026: "Equatorial Guinea decrees Ciudad de la Paz its capital, replacing Malabo"
- Greece, capital 1834: "Capital of Greece moves from Nafplio to Athens"
- Guinea-Bissau, capital 1941: "Bissau replaces Bolama as capital of Portuguese Guinea"
- Italy, capital 1871: "Rome becomes capital of Italy"
- Kazakhstan, capital 1997: "Kazakhstan moves capital from Almaty to Akmola (later Astana)"
- Malawi, capital 1975: "Lilongwe replaces Zomba as capital of Malawi"
- Micronesia, capital 1989: "Palikir replaces Kolonia as capital of Micronesia"
- Myanmar, capital 2005: "Myanmar's government moves capital from Yangon to Naypyidaw"
- New Zealand, capital 1841: "Auckland becomes the capital of New Zealand"
- New Zealand, capital 1865: "Capital of New Zealand moves to Wellington"
- Nigeria, capital 1991: "Abuja replaces Lagos as capital of Nigeria"
- Palau, capital 2006: "Palau moves capital from Koror to Ngerulmud"
- Russia, capital 1918: "Soviet Russia moves its capital from Petrograd to Moscow"
- Solomon Islands, capital 1952: "Honiara replaces Tulagi as capital of the Solomon Islands"
- Turkiye, capital 1923: "Turkiye moves its capital from Istanbul to Ankara"
- Uganda, capital 1962: "Uganda becomes independent with Kampala as its capital"
- United States, capital 1800: "US federal government moves its capital to Washington"
- Uzbekistan, capital 1930: "Uzbek SSR capital moves from Samarkand to Tashkent"
- Zambia, capital 1935: "Lusaka replaces Livingstone as capital of Northern Rhodesia"
- Belize, name end 1973: "British Honduras officially renamed Belize"
- Benin, name end 1975: "Dahomey renamed People's Republic of Benin"
- Botswana, name start 1885: "Britain establishes the Bechuanaland Protectorate"
- Brazil, name end 1889: "Brazil becomes a republic"
- Burkina Faso, name end 1984: "Upper Volta renamed Burkina Faso"
- China, name end 1912: "Republic of China proclaimed, ending Qing imperial rule"
- Colombia, name start 1831: "Gran Colombia legally ends; State of New Granada is created"
- Colombia, name end 1858: "Granadine Confederation replaces the Republic of New Granada"
- Colombia, name start 1863: "Granadine Confederation becomes the United States of Colombia"
- Colombia, name end 1886: "United States of Colombia becomes the Republic of Colombia"
- Democratic Republic of the Congo, name start 1885: "Congo Free State established under Leopold II"
- Democratic Republic of the Congo, name end 1908: "Belgium annexes the Congo Free State as Belgian Congo"
- Democratic Republic of the Congo, name start 1908: "Belgium annexes the Congo Free State as Belgian Congo"
- Democratic Republic of the Congo, name start 1971: "Democratic Republic of the Congo renamed Zaire"
- Democratic Republic of the Congo, name end 1997: "Zaire renamed back to Democratic Republic of the Congo"
- Eswatini, name end 2018: "Kingdom of Swaziland renamed Kingdom of Eswatini"
- Germany, name start 1949: "Federal Republic of Germany founded, capital Bonn"
- Germany, name end 1990: "East and West Germany reunify"
- Iran, name end 1935: "Persia asks foreign states to call it Iran"
- Ireland, name end 1937: "New Irish constitution names the state Eire (Ireland)"
- Kenya, name start 1895: "Britain proclaims the East Africa Protectorate"
- Kenya, name end 1920: "British East Africa Protectorate becomes Kenya Colony"
- Myanmar, name end 1989: "Burma's English name changed to Myanmar, Rangoon to Yangon"
- Namibia, name start 1884: "German South West Africa established"
- North Macedonia, name end 2019: "Prespa Agreement in force; Macedonia renamed North Macedonia"
- Papua New Guinea, name start 1949: "Papua and New Guinea merged under one administration"
- Samoa, name end 1914: "New Zealand forces capture German Samoa"
- Samoa, name end 1997: "Western Samoa renamed Samoa"
- Sri Lanka, name end 1972: "Ceylon becomes a republic renamed Sri Lanka"
- Sudan, name start 1899: "Anglo-Egyptian condominium over Sudan established"
- Thailand, name end 1939: "Siam officially renamed Thailand"
- Astana, city name 2022: "Kazakhstan's capital Nur-Sultan renamed back to Astana"
- Harare, city name 1982: "Salisbury, capital of Zimbabwe, renamed Harare"
- Oslo, city name 1925: "Norway's capital Kristiania renamed Oslo"
- Tokyo, city name 1868: "Edo renamed Tokyo"

## Questions left out for want of fair wrong answers

- Austria became independent on the dissolution of… Austria-Hungary
- In 1993, Slovakia became independent on the dissolution of… Czechoslovakia

## Block A name years not asked

- Argentina, United Provinces of the Rio de la Plata (start 1816): same year as independence
- Austria, German-Austria (start 1918): defensible-year country
- Austria, German-Austria (end 1919): defensible-year country
- Bangladesh, East Pakistan (end 1971): same year as independence
- Belarus, Byelorussia (end 1991): same year as independence
- Bolivia, Upper Peru (end 1825): same year as independence
- Botswana, Bechuanaland (end 1966): same year as independence
- Brazil, Empire of Brazil (start 1822): same year as independence
- Canada, Province of Canada (end 1867): same year as independence
- Democratic Republic of the Congo, Belgian Congo (end 1960): same year as independence
- Djibouti, French Somaliland (end 1967): the same change as the next name starting
- Djibouti, Afars and Issas (end 1977): same year as independence
- Egypt, United Arab Republic (start 1958): defensible-year country
- Egypt, United Arab Republic (end 1971): defensible-year country
- Equatorial Guinea, Spanish Guinea (end 1968): same year as independence
- Ghana, Gold Coast (end 1957): same year as independence
- Guinea, French Guinea (end 1958): same year as independence
- Guinea-Bissau, Portuguese Guinea (end 1974): defensible-year country
- Guyana, British Guiana (end 1966): same year as independence
- Haiti, Saint-Domingue (end 1804): same year as independence
- Iceland, Kingdom of Iceland (start 1918): defensible-year country
- Iceland, Kingdom of Iceland (end 1944): defensible-year country
- Indonesia, Dutch East Indies (end 1949): defensible-year country
- Ireland, Irish Free State (start 1922): same year as independence
- Kiribati, Gilbert Islands (end 1979): same year as independence
- Kyrgyzstan, Kirghizia (end 1991): same year as independence
- Lesotho, Basutoland (end 1966): same year as independence
- Libya, Italian Libya (start 1934): defensible-year country
- Libya, Italian Libya (end 1943): defensible-year country
- Malawi, Nyasaland (end 1964): same year as independence
- Malaysia, Malaya (start 1948): defensible-year country
- Malaysia, Malaya (end 1963): defensible-year country
- Mexico, New Spain (end 1821): same year as independence
- Moldova, Moldavia (end 1991): same year as independence
- Namibia, South West Africa (end 1990): same year as independence
- North Macedonia, Macedonia (start 1991): same year as independence
- Saudi Arabia, Hejaz and Nejd (end 1932): same year as independence
- South Africa, Union of South Africa (start 1910): defensible-year country
- South Africa, Union of South Africa (end 1961): defensible-year country
- Sudan, Anglo-Egyptian Sudan (end 1956): same year as independence
- Tanzania, Tanganyika (end 1964): same year as independence
- Timor-Leste, Portuguese Timor (end 1975): defensible-year country
- Togo, French Togoland (end 1960): same year as independence
- Turkmenistan, Turkmenia (end 1991): same year as independence
- Ukraine, Ukrainian SSR (end 1991): same year as independence
- United Arab Emirates, Trucial States (end 1971): same year as independence
- United Kingdom, Kingdom of Great Britain (end 1800): Block A says until 1800; Block B dates the union 1801, so the year isn't asked
- Uruguay, Cisplatina (end 1828): same year as independence
- Vanuatu, New Hebrides (end 1980): same year as independence
- Viet Nam, Dai Nam (start 1839): defensible-year country
- Viet Nam, Dai Nam (end 1945): defensible-year country
- Zambia, Northern Rhodesia (end 1964): same year as independence
- Zimbabwe, Southern Rhodesia (start 1898): defensible-year country
- Zimbabwe, Southern Rhodesia (end 1965): defensible-year country
- Zimbabwe, Rhodesia (start 1965): defensible-year country
- Zimbabwe, Rhodesia (end 1979): defensible-year country

## Dated facts

`first` = can appear in "Which came first?" and "Put in order". `slider` = can be asked on the timeline. Every fact cites its line.

1. **1800** US federal government moves its capital to Washington  [first, slider]
   - Block B line 1: 1800 | US federal government moves its capital to Washington | United States
   - Block A: United States | 1776 | Great Britain | none | Philadelphia to Washington (1800)
2. **1801** Great Britain and Ireland unite as the United Kingdom  [first, slider]
   - Block B line 2: 1801 | Great Britain and Ireland unite as the United Kingdom | United Kingdom, Ireland
3. **1803** United States buys Louisiana from France  [first, slider]
   - Block B line 3: 1803 | United States buys Louisiana from France | United States, France
4. **1804** Haiti declares independence from France  [first, slider]
   - Block B line 4: 1804 | Haiti declares independence from France | Haiti, France
   - Block A: Haiti | 1804 | France | Saint-Domingue (to 1804) | none
5. **1804** Country renamed Viet Nam under Emperor Gia Long  [first, slider]
   - Block B line 5: 1804 | Country renamed Viet Nam under Emperor Gia Long | Viet Nam
6. **1806** Holy Roman Empire dissolved  [first, slider]
   - Block B line 6: 1806 | Holy Roman Empire dissolved | Germany, Austria
7. **1808** Sierra Leone becomes a British crown colony  [first, slider]
   - Block B line 7: 1808 | Sierra Leone becomes a British crown colony | Sierra Leone, United Kingdom
8. **1808** Portuguese royal court moves to Brazil  [first, slider]
   - Block B line 8: 1808 | Portuguese royal court moves to Brazil | Brazil, Portugal
9. **1809** Sweden cedes Finland to Russia  [first, slider]
   - Block B line 9: 1809 | Sweden cedes Finland to Russia | Finland, Sweden, Russia
10. **1810** Kamehameha I unifies the Hawaiian Islands  [first, slider]
   - Block B line 10: 1810 | Kamehameha I unifies the Hawaiian Islands | United States
11. **1814** Denmark cedes Norway to Sweden  [first, slider]
   - Block B line 11: 1814 | Denmark cedes Norway to Sweden | Norway, Denmark, Sweden
12. **1814** Netherlands cedes the Cape Colony to Britain  [first, slider]
   - Block B line 12: 1814 | Netherlands cedes the Cape Colony to Britain | South Africa, Netherlands, United Kingdom
13. **1815** United Kingdom of the Netherlands created  [first, slider]
   - Block B line 13: 1815 | United Kingdom of the Netherlands created | Netherlands, Belgium
14. **1815** Kingdom of Kandy ceded to British rule  [first, slider]
   - Block B line 14: 1815 | Kingdom of Kandy ceded to British rule | Sri Lanka, United Kingdom
15. **1816** Argentina declares independence from Spain  [first, slider]
   - Block B line 15: 1816 | Argentina declares independence from Spain | Argentina, Spain
   - Block A: Argentina | 1816 | Spain | United Provinces of the Rio de la Plata (1816-1831) | none
16. **1818** Chile declares independence from Spain  [first, slider]
   - Block B line 16: 1818 | Chile declares independence from Spain | Chile, Spain
   - Block A: Chile | 1818 | Spain | none | none
17. **1819** Spain cedes Florida to the United States  [first, slider]
   - Block B line 17: 1819 | Spain cedes Florida to the United States | United States, Spain
18. **1819** British trading post founded at Singapore  [first, slider]
   - Block B line 18: 1819 | British trading post founded at Singapore | Singapore, United Kingdom
19. **1821** Treaty of Cordoba establishes Mexican independence from Spain  [first, slider]
   - Block B line 19: 1821 | Treaty of Cordoba establishes Mexican independence from Spain | Mexico, Spain
   - Block A: Mexico | 1821 | Spain | New Spain (to 1821) | none
20. **1821** Central America declares independence from Spain  [first, slider]
   - Block B line 20: 1821 | Central America declares independence from Spain | Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica, Spain
   - Block A: Costa Rica | 1821 | Spain | none | Cartago to San Jose (1823)
   - Block A: El Salvador | 1821 | Spain | none | none
   - Block A: Guatemala | 1821 | Spain | none | none
   - Block A: Honduras | 1821 | Spain | none | Comayagua to Tegucigalpa (1880)
   - Block A: Nicaragua | 1821 | Spain | none | don't ask
21. **1821** Peru declares independence from Spain  [first, slider]
   - Block B line 21: 1821 | Peru declares independence from Spain | Peru, Spain
   - Block A: Peru | 1821 | Spain | none | none
22. **1822** Brazil declares independence from Portugal  [first, slider]
   - Block B line 22: 1822 | Brazil declares independence from Portugal | Brazil, Portugal
   - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
23. **1824** Anglo-Dutch Treaty divides Malaya and Sumatra spheres  [first, slider]
   - Block B line 23: 1824 | Anglo-Dutch Treaty divides Malaya and Sumatra spheres | Malaysia, Indonesia, United Kingdom, Netherlands
24. **1825** Bolivia declares independence  [first, slider]
   - Block B line 24: 1825 | Bolivia declares independence | Bolivia, Spain
   - Block A: Bolivia | 1825 | Spain | Upper Peru (to 1825) | don't ask
25. **1825** Erie Canal opens  [first, slider]
   - Block B line 25: 1825 | Erie Canal opens | United States
26. **1825** Van Diemen's Land becomes a colony separate from New South Wales  [first, slider]
   - Block B line 26: 1825 | Van Diemen's Land becomes a colony separate from New South Wales | Australia, United Kingdom
27. **1826** Burma cedes Assam, Arakan and Tenasserim to the British  [first, slider]
   - Block B line 27: 1826 | Burma cedes Assam, Arakan and Tenasserim to the British | Myanmar, India, United Kingdom
28. **1828** Persia cedes Erivan and Nakhchivan khanates to Russia  [first, slider]
   - Block B line 28: 1828 | Persia cedes Erivan and Nakhchivan khanates to Russia | Iran, Russia, Armenia, Azerbaijan
29. **1828** Uruguay becomes independent between Brazil and Argentina  [first, slider]
   - Block B line 29: 1828 | Uruguay becomes independent between Brazil and Argentina | Uruguay, Brazil, Argentina
   - Block A: Uruguay | 1828 | Brazil | Cisplatina (1821-1828) | none
30. **1829** Swan River Colony founded in Western Australia  [first, slider]
   - Block B line 30: 1829 | Swan River Colony founded in Western Australia | Australia, United Kingdom
31. **1830** Belgium declares independence from the Netherlands  [first, slider]
   - Block B line 31: 1830 | Belgium declares independence from the Netherlands | Belgium, Netherlands
   - Block A: Belgium | 1830 | Netherlands | none | none
32. **1830** London Protocol recognises Greece as independent  [first, slider]
   - Block B line 32: 1830 | London Protocol recognises Greece as independent | Greece, Turkiye
   - Block A: Greece | 1830 | Ottoman Empire | none | Nafplio to Athens (1834)
33. **1830** France captures Algiers  [first, slider]
   - Block B line 33: 1830 | France captures Algiers | Algeria, France
34. **1830** Ecuador separates from Gran Colombia  [first, slider]
   - Block B line 34: 1830 | Ecuador separates from Gran Colombia | Ecuador, Colombia
   - Block A: Ecuador | 1830 | Gran Colombia | none | none
35. **1832** Rideau Canal opens  [first, slider]
   - Block B line 35: 1832 | Rideau Canal opens | Canada
36. **1834** Capital of Greece moves from Nafplio to Athens  [first, slider]
   - Block B line 36: 1834 | Capital of Greece moves from Nafplio to Athens | Greece
   - Block A: Greece | 1830 | Ottoman Empire | none | Nafplio to Athens (1834)
37. **1836** Texas declares independence from Mexico  [first, slider]
   - Block B line 37: 1836 | Texas declares independence from Mexico | United States, Mexico
38. **1836** Province of South Australia proclaimed  [first, slider]
   - Block B line 38: 1836 | Province of South Australia proclaimed | Australia, United Kingdom
39. **1839** British East India Company captures Aden  [first, slider]
   - Block B line 39: 1839 | British East India Company captures Aden | Yemen, United Kingdom
40. **1839** Treaty of London recognises Belgium and partitions Luxembourg  [first, slider]
   - Block B line 40: 1839 | Treaty of London recognises Belgium and partitions Luxembourg | Belgium, Luxembourg, Netherlands
41. **1840** Treaty of Waitangi signed; British sovereignty over New Zealand  [first, slider]
   - Block B line 41: 1840 | Treaty of Waitangi signed; British sovereignty over New Zealand | New Zealand, United Kingdom
42. **1842** China cedes Hong Kong Island to Britain  [first, slider]
   - Block B line 42: 1842 | China cedes Hong Kong Island to Britain | China, United Kingdom
43. **1843** Natal proclaimed a British colony  [first, slider]
   - Block B line 43: 1843 | Natal proclaimed a British colony | South Africa, United Kingdom
44. **1844** Dominican Republic declares independence from Haiti  [first, slider]
   - Block B line 44: 1844 | Dominican Republic declares independence from Haiti | Dominican Republic, Haiti
   - Block A: Dominican Republic | 1844 | Haiti | Santo Domingo (to 1821) | none
45. **1846** Oregon Treaty sets US-British border at the 49th parallel  [first, slider]
   - Block B line 45: 1846 | Oregon Treaty sets US-British border at the 49th parallel | United States, Canada, United Kingdom
46. **1847** Liberia declares independence  [first, slider]
   - Block B line 46: 1847 | Liberia declares independence | Liberia
   - Block A: Liberia | 1847 | American Colonization Society | none | none
47. **1848** Mexico cedes California and the Southwest to the United States  [first, slider]
   - Block B line 47: 1848 | Mexico cedes California and the Southwest to the United States | Mexico, United States
48. **1848** Bern becomes the Swiss federal city  [first, slider]
   - Block B line 48: 1848 | Bern becomes the Swiss federal city | Switzerland
49. **1849** Britain annexes the Punjab  [first, slider]
   - Block B line 49: 1849 | Britain annexes the Punjab | India, Pakistan, United Kingdom
50. **1851** Victoria separates from New South Wales  [first, slider]
   - Block B line 50: 1851 | Victoria separates from New South Wales | Australia
51. **1852** Britain recognises Boer independence north of the Vaal  [first, slider]
   - Block B line 51: 1852 | Britain recognises Boer independence north of the Vaal | South Africa, United Kingdom
52. **1852** Haarlemmermeer lake drained into dry land  [first, slider]
   - Block B line 52: 1852 | Haarlemmermeer lake drained into dry land | Netherlands
53. **1853** United States buys southern Arizona strip from Mexico  [first, slider]
   - Block B line 53: 1853 | United States buys southern Arizona strip from Mexico | United States, Mexico
54. **1854** Orange Free State becomes independent  [first, slider]
   - Block B line 54: 1854 | Orange Free State becomes independent | South Africa, United Kingdom
55. **1856** Russia returns southern Bessarabia to Moldavia  [first, slider]
   - Block B line 55: 1856 | Russia returns southern Bessarabia to Moldavia | Russia, Romania, Moldova, Ukraine
56. **1856** Van Diemen's Land renamed Tasmania  [first, slider]
   - Block B line 56: 1856 | Van Diemen's Land renamed Tasmania | Australia
57. **1857** Ottawa chosen as capital of the Province of Canada  [first, slider]
   - Block B line 57: 1857 | Ottawa chosen as capital of the Province of Canada | Canada
58. **1858** Treaty of Aigun moves Amur lands from China to Russia  [first, slider]
   - Block B line 58: 1858 | Treaty of Aigun moves Amur lands from China to Russia | Russia, China
59. **1858** British Crown takes over rule of India from the Company  [first, slider]
   - Block B line 59: 1858 | British Crown takes over rule of India from the Company | India, United Kingdom
60. **1860** Sardinia cedes Savoy and Nice to France  [first, slider]
   - Block B line 60: 1860 | Sardinia cedes Savoy and Nice to France | France, Italy
61. **1860** China cedes Kowloon to Britain  [first, slider]
   - Block B line 61: 1860 | China cedes Kowloon to Britain | China, United Kingdom
62. **1861** Kingdom of Italy proclaimed  [first, slider]
   - Block B line 62: 1861 | Kingdom of Italy proclaimed | Italy
   - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
63. **1861** Britain annexes Lagos  [first, slider]
   - Block B line 63: 1861 | Britain annexes Lagos | Nigeria, United Kingdom
64. **1862** Viet Nam cedes three southern provinces to France  [first, slider]
   - Block B line 64: 1862 | Viet Nam cedes three southern provinces to France | Viet Nam, France
65. **1865** Capital of New Zealand moves to Wellington  [first, slider]
   - Block B line 65: 1865 | Capital of New Zealand moves to Wellington | New Zealand
   - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
66. **1867** United States buys Alaska from Russia  [first, slider]
   - Block B line 66: 1867 | United States buys Alaska from Russia | United States, Russia
67. **1867** Dominion of Canada created by Confederation  [first, slider]
   - Block B line 67: 1867 | Dominion of Canada created by Confederation | Canada, United Kingdom
   - Block A: Canada | 1867 | United Kingdom (confederation, not independence) | Province of Canada (1841-1867) | none
68. **1867** Dual monarchy of Austria-Hungary established  [first, slider]
   - Block B line 68: 1867 | Dual monarchy of Austria-Hungary established | Austria, Hungary
69. **1868** Edo renamed Tokyo  [first, slider]
   - Block B line 69: 1868 | Edo renamed Tokyo | Japan
   - Block C line 21: Tokyo | Japan | Edo | 1868 | renamed Eastern Capital under Emperor Meiji
70. **1869** Suez Canal opens  [first, slider]
   - Block B line 70: 1869 | Suez Canal opens | Egypt
71. **1870** Rupert's Land transferred to Canada  [first, slider]
   - Block B line 71: 1870 | Rupert's Land transferred to Canada | Canada
72. **1871** German Empire proclaimed  [first, slider]
   - Block B line 72: 1871 | German Empire proclaimed | Germany
73. **1871** France cedes Alsace and part of Lorraine to Germany  [first, slider]
   - Block B line 73: 1871 | France cedes Alsace and part of Lorraine to Germany | France, Germany
74. **1871** Rome becomes capital of Italy  [first, slider]
   - Block B line 74: 1871 | Rome becomes capital of Italy | Italy
   - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
75. **1871** British Columbia joins Canada  [first, slider]
   - Block B line 75: 1871 | British Columbia joins Canada | Canada
76. **1874** Fiji ceded to Britain  [first, slider]
   - Block B line 76: 1874 | Fiji ceded to Britain | Fiji, United Kingdom
77. **1874** Gold Coast becomes a British crown colony  [first, slider]
   - Block B line 77: 1874 | Gold Coast becomes a British crown colony | Ghana, United Kingdom
78. **1877** Britain annexes the Transvaal  [first, slider]
   - Block B line 78: 1877 | Britain annexes the Transvaal | South Africa, United Kingdom
79. **1878** Treaty of Berlin recognises Romania, Serbia and Montenegro  [first (20-year gap)]
   - Block B line 79: 1878 | Treaty of Berlin recognises Romania, Serbia and Montenegro | Romania, Serbia, Montenegro, Turkiye
   - Block A: Serbia | 1878 | Ottoman Empire | none | Kragujevac to Belgrade (1841)
80. **1879** Japan annexes the Ryukyu Kingdom  [first, slider]
   - Block B line 80: 1879 | Japan annexes the Ryukyu Kingdom | Japan
81. **1881** Tunisia becomes a French protectorate  [first, slider]
   - Block B line 81: 1881 | Tunisia becomes a French protectorate | Tunisia, France
82. **1881** Argentina and Chile sign a boundary treaty  [first, slider]
   - Block B line 82: 1881 | Argentina and Chile sign a boundary treaty | Argentina, Chile
83. **1882** Britain occupies Egypt  [first, slider]
   - Block B line 83: 1882 | Britain occupies Egypt | Egypt, United Kingdom
84. **1883** Peru cedes Tarapaca to Chile  [first, slider]
   - Block B line 84: 1883 | Peru cedes Tarapaca to Chile | Peru, Chile
85. **1884** German South West Africa established  [first, slider]
   - Block B line 85: 1884 | German South West Africa established | Namibia, Germany
   - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
86. **1884** Germany claims north-eastern New Guinea  [first, slider]
   - Block B line 86: 1884 | Germany claims north-eastern New Guinea | Papua New Guinea, Germany
87. **1884** Britain proclaims protectorate over south-eastern New Guinea  [first, slider]
   - Block B line 87: 1884 | Britain proclaims protectorate over south-eastern New Guinea | Papua New Guinea, United Kingdom
88. **1885** Congo Free State established under Leopold II  [first, slider]
   - Block B line 88: 1885 | Congo Free State established under Leopold II | Democratic Republic of the Congo, Belgium
   - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
89. **1885** Eastern Rumelia unites with Bulgaria  [first, slider]
   - Block B line 89: 1885 | Eastern Rumelia unites with Bulgaria | Bulgaria, Turkiye
90. **1886** Britain annexes Burma  [first, slider]
   - Block B line 90: 1886 | Britain annexes Burma | Myanmar, United Kingdom
91. **1888** Chile annexes Easter Island  [first, slider]
   - Block B line 91: 1888 | Chile annexes Easter Island | Chile
92. **1889** Brazil becomes a republic  [first, slider]
   - Block B line 92: 1889 | Brazil becomes a republic | Brazil
   - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
93. **1890** Britain gives Heligoland to Germany  [first, slider]
   - Block B line 93: 1890 | Britain gives Heligoland to Germany | Germany, United Kingdom, Tanzania
94. **1890** Luxembourg ends personal union with the Netherlands  [first, slider]
   - Block B line 94: 1890 | Luxembourg ends personal union with the Netherlands | Luxembourg, Netherlands
95. **1893** Corinth Canal opens  [first, slider]
   - Block B line 95: 1893 | Corinth Canal opens | Greece
96. **1894** Uganda Protectorate established  [first, slider]
   - Block B line 96: 1894 | Uganda Protectorate established | Uganda, United Kingdom
97. **1895** Kiel Canal opens  [first, slider]
   - Block B line 97: 1895 | Kiel Canal opens | Germany
98. **1896** Italy recognises Ethiopia's independence  [first, slider]
   - Block B line 98: 1896 | Italy recognises Ethiopia's independence | Ethiopia, Italy
99. **1897** Korean Empire proclaimed  [first, slider]
   - Block B line 99: 1897 | Korean Empire proclaimed | South Korea, North Korea
100. **1898** United States annexes Hawaii  [first, slider]
   - Block B line 100: 1898 | United States annexes Hawaii | United States
101. **1898** Britain leases the New Territories of Hong Kong  [first, slider]
   - Block B line 101: 1898 | Britain leases the New Territories of Hong Kong | China, United Kingdom
102. **1898** Spain cedes the Philippines, Guam and Puerto Rico to US  [first, slider]
   - Block B line 102: 1898 | Spain cedes the Philippines, Guam and Puerto Rico to US | Philippines, Spain, United States, Cuba
103. **1899** Anglo-Egyptian condominium over Sudan established  [first, slider]
   - Block B line 103: 1899 | Anglo-Egyptian condominium over Sudan established | Sudan, South Sudan, Egypt, United Kingdom
   - Block A: Sudan | 1956 | United Kingdom and Egypt (condominium) | Anglo-Egyptian Sudan (1899-1956) | none
104. **1899** Samoa partitioned between Germany and the United States  [first, slider]
   - Block B line 104: 1899 | Samoa partitioned between Germany and the United States | Samoa, Germany, United States
105. **1901** Six Australian colonies federate as Commonwealth of Australia  [first, slider]
   - Block B line 105: 1901 | Six Australian colonies federate as Commonwealth of Australia | Australia, United Kingdom
   - Block A: Australia | 1901 | United Kingdom (federation of colonies) | none | Melbourne to Canberra (1927)
106. **1902** Treaty of Vereeniging: Boer republics become British colonies  [first, slider]
   - Block B line 106: 1902 | Treaty of Vereeniging: Boer republics become British colonies | South Africa, United Kingdom
107. **1902** Cuba becomes independent as the Republic of Cuba  [first, slider]
   - Block B line 107: 1902 | Cuba becomes independent as the Republic of Cuba | Cuba, United States
   - Block A: Cuba | 1902 | Spain, then US occupation | none | none
108. **1903** Panama separates from Colombia  [first, slider]
   - Block B line 108: 1903 | Panama separates from Colombia | Panama, Colombia
   - Block A: Panama | 1903 | Colombia | none | none
109. **1903** Treaty of Petropolis: Bolivia cedes Acre to Brazil  [first, slider]
   - Block B line 109: 1903 | Treaty of Petropolis: Bolivia cedes Acre to Brazil | Bolivia, Brazil
110. **1904** Bolivia recognizes Chilean sovereignty over its former coast  [first, slider]
   - Block B line 110: 1904 | Bolivia recognizes Chilean sovereignty over its former coast | Bolivia, Chile
111. **1905** Norway dissolves its union with Sweden  [first, slider]
   - Block B line 111: 1905 | Norway dissolves its union with Sweden | Norway, Sweden
   - Block A: Norway | 1905 | Sweden (union dissolved) | none | none
112. **1905** Treaty of Portsmouth: Japan gains southern Sakhalin from Russia  [first, slider]
   - Block B line 112: 1905 | Treaty of Portsmouth: Japan gains southern Sakhalin from Russia | Japan, Russia
113. **1905** Alberta and Saskatchewan become Canadian provinces  [first, slider]
   - Block B line 113: 1905 | Alberta and Saskatchewan become Canadian provinces | Canada
114. **1905** British India partitions Bengal into two provinces  [first, slider]
   - Block B line 114: 1905 | British India partitions Bengal into two provinces | India, Bangladesh
115. **1906** Britain and France agree joint condominium over New Hebrides  [first, slider]
   - Block B line 115: 1906 | Britain and France agree joint condominium over New Hebrides | Vanuatu, United Kingdom, France
116. **1906** Simplon railway tunnel opens under the Alps  [first, slider]
   - Block B line 116: 1906 | Simplon railway tunnel opens under the Alps | Switzerland, Italy
117. **1907** New Zealand becomes a dominion  [first, slider]
   - Block B line 117: 1907 | New Zealand becomes a dominion | New Zealand, United Kingdom
118. **1907** Oklahoma becomes the 46th US state  [first, slider]
   - Block B line 118: 1907 | Oklahoma becomes the 46th US state | United States
119. **1908** Belgium annexes the Congo Free State as Belgian Congo  [first, slider]
   - Block B line 119: 1908 | Belgium annexes the Congo Free State as Belgian Congo | Democratic Republic of the Congo, Belgium
   - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
   - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
120. **1908** Bulgaria declares independence from the Ottoman Empire  [first, slider]
   - Block B line 120: 1908 | Bulgaria declares independence from the Ottoman Empire | Bulgaria, Turkiye
   - Block A: Bulgaria | 1908 | Ottoman Empire | none | Tarnovo to Sofia (1879)
121. **1908** Austria-Hungary annexes Bosnia and Herzegovina  [first, slider]
   - Block B line 121: 1908 | Austria-Hungary annexes Bosnia and Herzegovina | Bosnia and Herzegovina, Austria, Hungary, Turkiye
122. **1909** Anglo-Siamese Treaty: Siam cedes four Malay states to Britain  [first, slider]
   - Block B line 122: 1909 | Anglo-Siamese Treaty: Siam cedes four Malay states to Britain | Thailand, Malaysia, United Kingdom
123. **1910** Union of South Africa formed from four British colonies  [first (20-year gap)]
   - Block B line 123: 1910 | Union of South Africa formed from four British colonies | South Africa, United Kingdom
   - Block A: South Africa | 1910 | United Kingdom (union, full sovereignty 1931) | Union of South Africa (1910-1961) | don't ask
124. **1910** Japan annexes Korea  [first, slider]
   - Block B line 124: 1910 | Japan annexes Korea | Japan, South Korea, North Korea
125. **1911** New South Wales transfers Federal Capital Territory to Australia  [first, slider]
   - Block B line 125: 1911 | New South Wales transfers Federal Capital Territory to Australia | Australia
126. **1912** Treaty of Ouchy: Ottoman Empire cedes Libya to Italy  [first, slider]
   - Block B line 126: 1912 | Treaty of Ouchy: Ottoman Empire cedes Libya to Italy | Libya, Italy, Turkiye
127. **1912** Albania declares independence from the Ottoman Empire  [first, slider]
   - Block B line 127: 1912 | Albania declares independence from the Ottoman Empire | Albania, Turkiye
   - Block A: Albania | 1912 | Ottoman Empire | none | Durres to Tirana (1920)
128. **1912** Treaty of Fez makes Morocco a French protectorate  [first, slider]
   - Block B line 128: 1912 | Treaty of Fez makes Morocco a French protectorate | Morocco, France
129. **1912** Republic of China proclaimed, ending Qing imperial rule  [first, slider]
   - Block B line 129: 1912 | Republic of China proclaimed, ending Qing imperial rule | China
   - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
130. **1912** Arizona becomes 48th and last contiguous US state  [first, slider]
   - Block B line 130: 1912 | Arizona becomes 48th and last contiguous US state | United States
131. **1913** Treaty of Bucharest: Bulgaria cedes Southern Dobruja to Romania  [first, slider]
   - Block B line 131: 1913 | Treaty of Bucharest: Bulgaria cedes Southern Dobruja to Romania | Bulgaria, Romania
132. **1913** Crete formally united with Greece  [first, slider]
   - Block B line 132: 1913 | Crete formally united with Greece | Greece
133. **1914** Panama Canal opens  [first, slider]
   - Block B line 133: 1914 | Panama Canal opens | Panama, United States
134. **1914** Northern and Southern Nigeria merged into one colony  [first, slider]
   - Block B line 134: 1914 | Northern and Southern Nigeria merged into one colony | Nigeria, United Kingdom
135. **1914** Saint Petersburg renamed Petrograd  [first, slider]
   - Block B line 135: 1914 | Saint Petersburg renamed Petrograd | Russia
136. **1914** New Zealand forces capture German Samoa  [first, slider]
   - Block B line 136: 1914 | New Zealand forces capture German Samoa | Samoa, New Zealand, Germany
   - Block A: Samoa | 1962 | New Zealand (UN trust territory) | German Samoa (1900-1914); Western Samoa (to 1997) | none
137. **1917** Denmark sells Danish West Indies to the United States  [first, slider]
   - Block B line 137: 1917 | Denmark sells Danish West Indies to the United States | United States, Denmark
138. **1917** Finland declares independence from Russia  [first, slider]
   - Block B line 138: 1917 | Finland declares independence from Russia | Finland, Russia
   - Block A: Finland | 1917 | Russia | none | Turku to Helsinki (1812)
139. **1918** Czechoslovakia declares independence from Austria-Hungary  [first, slider]
   - Block B line 139: 1918 | Czechoslovakia declares independence from Austria-Hungary | Czechia, Slovakia, Austria, Hungary
140. **1918** Kingdom of Serbs, Croats and Slovenes is proclaimed  [first, slider]
   - Block B line 140: 1918 | Kingdom of Serbs, Croats and Slovenes is proclaimed | Serbia, Croatia, Slovenia, Bosnia and Herzegovina, Montenegro, North Macedonia
141. **1918** Iceland becomes a sovereign kingdom in union with Denmark  [first (20-year gap)]
   - Block B line 141: 1918 | Iceland becomes a sovereign kingdom in union with Denmark | Iceland, Denmark
142. **1918** Soviet Russia moves its capital from Petrograd to Moscow  [first, slider]
   - Block B line 142: 1918 | Soviet Russia moves its capital from Petrograd to Moscow | Russia
   - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
143. **1919** Treaty of Versailles signed; Alsace-Lorraine restored to France  [first, slider]
   - Block B line 143: 1919 | Treaty of Versailles signed; Alsace-Lorraine restored to France | Germany, France
144. **1919** Treaty of Rawalpindi: Britain recognizes Afghan independence  [first, slider]
   - Block B line 144: 1919 | Treaty of Rawalpindi: Britain recognizes Afghan independence | Afghanistan, United Kingdom
   - Block A: Afghanistan | 1919 | United Kingdom (control of foreign affairs) | none | none
145. **1919** Treaty of Saint-Germain: South Tyrol passes from Austria to Italy  [first, slider]
   - Block B line 145: 1919 | Treaty of Saint-Germain: South Tyrol passes from Austria to Italy | Austria, Italy
146. **1920** Treaty of Trianon fixes Hungary's reduced borders  [first, slider]
   - Block B line 146: 1920 | Treaty of Trianon fixes Hungary's reduced borders | Hungary, Romania, Slovakia, Serbia, Croatia, Austria
147. **1920** North Schleswig votes to join Denmark and is transferred  [first, slider]
   - Block B line 147: 1920 | North Schleswig votes to join Denmark and is transferred | Denmark, Germany
148. **1920** British East Africa Protectorate becomes Kenya Colony  [first, slider]
   - Block B line 148: 1920 | British East Africa Protectorate becomes Kenya Colony | Kenya, United Kingdom
   - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
149. **1920** League of Nations gives New Zealand mandate over Western Samoa  [first, slider]
   - Block B line 149: 1920 | League of Nations gives New Zealand mandate over Western Samoa | Samoa, New Zealand
150. **1920** Australia takes League mandate over former German New Guinea  [first, slider]
   - Block B line 150: 1920 | Australia takes League mandate over former German New Guinea | Papua New Guinea, Australia
151. **1922** Irish Free State established  [first, slider]
   - Block B line 151: 1922 | Irish Free State established | Ireland, United Kingdom
   - Block A: Ireland | 1922 | United Kingdom | Irish Free State (1922-1937) | none
152. **1922** Britain declares Egypt independent, ending its protectorate  [first (20-year gap)]
   - Block B line 152: 1922 | Britain declares Egypt independent, ending its protectorate | Egypt, United Kingdom
   - Block A: Egypt | 1922 | United Kingdom (protectorate) | United Arab Republic (1958-1971) | none
153. **1922** Soviet Union formed by four founding republics  [first, slider]
   - Block B line 153: 1922 | Soviet Union formed by four founding republics | Russia, Ukraine, Belarus, Georgia, Armenia, Azerbaijan
154. **1923** Turkiye moves its capital from Istanbul to Ankara  [first, slider]
   - Block B line 154: 1923 | Turkiye moves its capital from Istanbul to Ankara | Turkiye
   - Block A: Turkiye | 1923 | Ottoman Empire (successor republic) | none | Istanbul to Ankara (1923)
155. **1923** Treaty of Lausanne sets the borders of modern Turkiye  [first, slider]
   - Block B line 155: 1923 | Treaty of Lausanne sets the borders of modern Turkiye | Turkiye, Greece, United Kingdom, France, Italy
156. **1923** Britain annexes Southern Rhodesia as a self-governing colony  [first, slider]
   - Block B line 156: 1923 | Britain annexes Southern Rhodesia as a self-governing colony | Zimbabwe, United Kingdom
157. **1924** Petrograd renamed Leningrad  [first, slider]
   - Block B line 157: 1924 | Petrograd renamed Leningrad | Russia
158. **1925** Svalbard Treaty takes effect under Norwegian sovereignty  [first, slider]
   - Block B line 158: 1925 | Svalbard Treaty takes effect under Norwegian sovereignty | Norway
159. **1925** Norway's capital Kristiania renamed Oslo  [first, slider]
   - Block B line 159: 1925 | Norway's capital Kristiania renamed Oslo | Norway
   - Block C line 15: Oslo | Norway | Kristiania | 1925 | original name Oslo restored
160. **1927** Australian Parliament moves from Melbourne to Canberra  [first, slider]
   - Block B line 160: 1927 | Australian Parliament moves from Melbourne to Canberra | Australia
   - Block A: Australia | 1901 | United Kingdom (federation of colonies) | none | Melbourne to Canberra (1927)
161. **1929** Kingdom of Serbs, Croats and Slovenes renamed Yugoslavia  [first, slider]
   - Block B line 161: 1929 | Kingdom of Serbs, Croats and Slovenes renamed Yugoslavia | Serbia, Croatia, Slovenia, Bosnia and Herzegovina, Montenegro, North Macedonia
162. **1929** Treaty of Lima: Tacna returns to Peru, Chile keeps Arica  [first, slider]
   - Block B line 162: 1929 | Treaty of Lima: Tacna returns to Peru, Chile keeps Arica | Peru, Chile
163. **1929** Lateran Treaty creates Vatican City as an independent state  [first, slider]
   - Block B line 163: 1929 | Lateran Treaty creates Vatican City as an independent state | Vatican City, Italy
164. **1930** Britain returns Weihaiwei to China  [first, slider]
   - Block B line 164: 1930 | Britain returns Weihaiwei to China | China, United Kingdom
165. **1932** Afsluitdijk closes off the Zuiderzee, creating the IJsselmeer  [first, slider]
   - Block B line 165: 1932 | Afsluitdijk closes off the Zuiderzee, creating the IJsselmeer | Netherlands
166. **1932** Ibn Saud proclaims the Kingdom of Saudi Arabia  [first, slider]
   - Block B line 166: 1932 | Ibn Saud proclaims the Kingdom of Saudi Arabia | Saudi Arabia
   - Block A: Saudi Arabia | 1932 | unification of Hejaz and Nejd | Hejaz and Nejd (to 1932) | don't ask
167. **1932** Iraq becomes independent as British mandate ends  [first, slider]
   - Block B line 167: 1932 | Iraq becomes independent as British mandate ends | Iraq, United Kingdom
   - Block A: Iraq | 1932 | United Kingdom (mandate) | Mesopotamia (to 1921) | none
168. **1934** Italy unifies Tripolitania and Cyrenaica as the colony of Libya  [first, slider]
   - Block B line 168: 1934 | Italy unifies Tripolitania and Cyrenaica as the colony of Libya | Libya, Italy
169. **1935** Persia asks foreign states to call it Iran  [first, slider]
   - Block B line 169: 1935 | Persia asks foreign states to call it Iran | Iran
   - Block A: Iran | don't ask | never colonised | Persia (to 1935) | none
170. **1935** Saar returns to Germany after a referendum  [first, slider]
   - Block B line 170: 1935 | Saar returns to Germany after a referendum | Germany
171. **1935** Hoover Dam dedicated, impounding Lake Mead  [first, slider]
   - Block B line 171: 1935 | Hoover Dam dedicated, impounding Lake Mead | United States
172. **1936** Italy merges Ethiopia, Eritrea and Somalia into Italian East Africa  [first, slider]
   - Block B line 172: 1936 | Italy merges Ethiopia, Eritrea and Somalia into Italian East Africa | Ethiopia, Eritrea, Somalia, Italy
173. **1936** Dominican capital Santo Domingo renamed Ciudad Trujillo  [first, slider]
   - Block B line 173: 1936 | Dominican capital Santo Domingo renamed Ciudad Trujillo | Dominican Republic
174. **1936** Kazakh SSR becomes a full Soviet union republic  [first, slider]
   - Block B line 174: 1936 | Kazakh SSR becomes a full Soviet union republic | Kazakhstan, Russia
175. **1937** Burma separated from British India as its own colony  [first, slider]
   - Block B line 175: 1937 | Burma separated from British India as its own colony | Myanmar, India, United Kingdom
176. **1937** New Irish constitution names the state Eire (Ireland)  [first, slider]
   - Block B line 176: 1937 | New Irish constitution names the state Eire (Ireland) | Ireland
   - Block A: Ireland | 1922 | United Kingdom | Irish Free State (1922-1937) | none
177. **1938** Nazi Germany annexes Austria (Anschluss)  [first, slider]
   - Block B line 177: 1938 | Nazi Germany annexes Austria (Anschluss) | Austria, Germany
178. **1938** Munich Agreement lets Germany annex the Sudetenland  [first, slider]
   - Block B line 178: 1938 | Munich Agreement lets Germany annex the Sudetenland | Czechia, Germany
179. **1938** Chaco peace treaty gives Paraguay most of the Gran Chaco  [first, slider]
   - Block B line 179: 1938 | Chaco peace treaty gives Paraguay most of the Gran Chaco | Paraguay, Bolivia
180. **1939** Siam officially renamed Thailand  [first, slider]
   - Block B line 180: 1939 | Siam officially renamed Thailand | Thailand
   - Block A: Thailand | don't ask | never colonised | Siam (to 1939; 1945-1949) | none
181. **1939** US and UK agree joint rule of Canton and Enderbury Islands  [first, slider]
   - Block B line 181: 1939 | US and UK agree joint rule of Canton and Enderbury Islands | Kiribati, United States, United Kingdom
182. **1942** Rio Protocol signed on the Peru-Ecuador border  [first, slider]
   - Block B line 182: 1942 | Rio Protocol signed on the Peru-Ecuador border | Peru, Ecuador
183. **1943** France accepts Lebanon's independence  [first, slider]
   - Block B line 183: 1943 | France accepts Lebanon's independence | Lebanon, France
   - Block A: Lebanon | 1943 | France (mandate) | Greater Lebanon (1920-1926) | none
184. **1944** Iceland dissolves union with Denmark and becomes a republic  [first (20-year gap)]
   - Block B line 184: 1944 | Iceland dissolves union with Denmark and becomes a republic | Iceland, Denmark
   - Block A: Iceland | 1944 | Denmark | Kingdom of Iceland (1918-1944) | none
185. **1944** Tuva is annexed into the Soviet Union  [first, slider]
   - Block B line 185: 1944 | Tuva is annexed into the Soviet Union | Russia
186. **1945** Korea divided at the 38th parallel into US and Soviet zones  [first, slider]
   - Block B line 186: 1945 | Korea divided at the 38th parallel into US and Soviet zones | South Korea, North Korea, United States, Russia
187. **1946** Philippines becomes independent from the United States  [first (20-year gap)]
   - Block B line 187: 1946 | Philippines becomes independent from the United States | Philippines, United States
   - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
188. **1946** Transjordan becomes an independent kingdom  [first, slider]
   - Block B line 188: 1946 | Transjordan becomes an independent kingdom | Jordan, United Kingdom
   - Block A: Jordan | 1946 | United Kingdom (mandate) | Transjordan (1921-1949) | none
189. **1947** British India partitioned into India and Pakistan  [first, slider]
   - Block B line 189: 1947 | British India partitioned into India and Pakistan | India, Pakistan, Bangladesh, United Kingdom
   - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
   - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
190. **1947** Peace treaty transfers Italy's Dodecanese islands to Greece  [first, slider]
   - Block B line 190: 1947 | Peace treaty transfers Italy's Dodecanese islands to Greece | Greece, Italy
191. **1948** Burma becomes independent outside the Commonwealth  [first, slider]
   - Block B line 191: 1948 | Burma becomes independent outside the Commonwealth | Myanmar, United Kingdom
   - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
192. **1948** Ceylon becomes independent from Britain  [first, slider]
   - Block B line 192: 1948 | Ceylon becomes independent from Britain | Sri Lanka, United Kingdom
   - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
193. **1948** Israel's declaration of independence proclaimed in Tel Aviv  [first, slider]
   - Block B line 193: 1948 | Israel's declaration of independence proclaimed in Tel Aviv | Israel
   - Block A: Israel | 1948 | United Kingdom (end of mandate) | none | don't ask
194. **1949** Newfoundland joins Canada as its tenth province  [first, slider]
   - Block B line 194: 1949 | Newfoundland joins Canada as its tenth province | Canada
195. **1949** Federal Republic of Germany founded, capital Bonn  [first, slider]
   - Block B line 195: 1949 | Federal Republic of Germany founded, capital Bonn | Germany
   - Block A: Germany | don't ask | unification 1871, refounded 1949, reunified 1990 | West Germany (1949-1990) | Bonn to Berlin (1990)
196. **1949** People's Republic of China proclaimed in Beijing  [first, slider]
   - Block B line 196: 1949 | People's Republic of China proclaimed in Beijing | China
   - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
197. **1951** Libya becomes independent as a united kingdom  [first (20-year gap)]
   - Block B line 197: 1951 | Libya becomes independent as a united kingdom | Libya, United Kingdom, France
   - Block A: Libya | 1951 | UK and French administration | Italian Libya (1934-1943) | don't ask
198. **1953** Federation of Rhodesia and Nyasaland created  [first, slider]
   - Block B line 198: 1953 | Federation of Rhodesia and Nyasaland created | Zimbabwe, Zambia, Malawi, United Kingdom
199. **1953** Korean armistice creates the Demilitarized Zone  [first, slider]
   - Block B line 199: 1953 | Korean armistice creates the Demilitarized Zone | South Korea, North Korea
200. **1954** Geneva Accords divide Viet Nam at the 17th parallel  [first, slider]
   - Block B line 200: 1954 | Geneva Accords divide Viet Nam at the 17th parallel | Viet Nam, France
201. **1955** Austrian State Treaty restores Austria's independence  [first (20-year gap)]
   - Block B line 201: 1955 | Austrian State Treaty restores Austria's independence | Austria
202. **1956** Sudan becomes independent  [first, slider]
   - Block B line 202: 1956 | Sudan becomes independent | Sudan, United Kingdom, Egypt
   - Block A: Sudan | 1956 | United Kingdom and Egypt (condominium) | Anglo-Egyptian Sudan (1899-1956) | none
203. **1956** French protectorate in Morocco ends  [first, slider]
   - Block B line 203: 1956 | French protectorate in Morocco ends | Morocco, France
   - Block A: Morocco | 1956 | France and Spain (protectorates) | none | Fez to Rabat (1912)
204. **1956** Tunisia becomes independent from France  [first, slider]
   - Block B line 204: 1956 | Tunisia becomes independent from France | Tunisia, France
   - Block A: Tunisia | 1956 | France | none | none
205. **1957** Saar joins West Germany as Saarland  [first, slider]
   - Block B line 205: 1957 | Saar joins West Germany as Saarland | Germany, France
206. **1957** Gold Coast becomes independent as Ghana  [first, slider]
   - Block B line 206: 1957 | Gold Coast becomes independent as Ghana | Ghana, United Kingdom
   - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
207. **1957** Federation of Malaya becomes independent  [first (20-year gap)]
   - Block B line 207: 1957 | Federation of Malaya becomes independent | Malaysia, United Kingdom
   - Block A: Malaysia | 1957 | United Kingdom | Malaya (1948-1963) | none
208. **1958** West Indies Federation formed  [first, slider]
   - Block B line 208: 1958 | West Indies Federation formed | Jamaica, Trinidad and Tobago, Barbados, United Kingdom
209. **1958** Egypt and Syria unite as the United Arab Republic  [first, slider]
   - Block B line 209: 1958 | Egypt and Syria unite as the United Arab Republic | Egypt, Syria
210. **1958** Guinea becomes independent from France  [first, slider]
   - Block B line 210: 1958 | Guinea becomes independent from France | Guinea, France
   - Block A: Guinea | 1958 | France | French Guinea (to 1958) | none
211. **1959** Alaska becomes the 49th US state  [first, slider]
   - Block B line 211: 1959 | Alaska becomes the 49th US state | United States
212. **1959** Saint Lawrence Seaway opens to ocean ships  [first, slider]
   - Block B line 212: 1959 | Saint Lawrence Seaway opens to ocean ships | Canada, United States
213. **1959** Hawaii becomes the 50th US state  [first, slider]
   - Block B line 213: 1959 | Hawaii becomes the 50th US state | United States
214. **1959** Antarctic Treaty signed in Washington  [first, slider]
   - Block B line 214: 1959 | Antarctic Treaty signed in Washington | Argentina, Chile, United States, Russia, United Kingdom
215. **1960** Brasilia replaces Rio de Janeiro as capital of Brazil  [first, slider]
   - Block B line 215: 1960 | Brasilia replaces Rio de Janeiro as capital of Brazil | Brazil
   - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
216. **1960** Nigeria becomes independent from the United Kingdom  [first, slider]
   - Block B line 216: 1960 | Nigeria becomes independent from the United Kingdom | Nigeria, United Kingdom
   - Block A: Nigeria | 1960 | United Kingdom | none | Lagos to Abuja (1991)
217. **1961** Construction of the Berlin Wall begins  [first, slider]
   - Block B line 217: 1961 | Construction of the Berlin Wall begins | Germany
218. **1962** Western Samoa becomes independent from New Zealand  [first, slider]
   - Block B line 218: 1962 | Western Samoa becomes independent from New Zealand | Samoa, New Zealand
   - Block A: Samoa | 1962 | New Zealand (UN trust territory) | German Samoa (1900-1914); Western Samoa (to 1997) | none
219. **1962** Algeria becomes independent from France  [first, slider]
   - Block B line 219: 1962 | Algeria becomes independent from France | Algeria, France
   - Block A: Algeria | 1962 | France | none | none
220. **1962** Jamaica becomes independent from the United Kingdom  [first, slider]
   - Block B line 220: 1962 | Jamaica becomes independent from the United Kingdom | Jamaica, United Kingdom
   - Block A: Jamaica | 1962 | United Kingdom | none | Spanish Town to Kingston (1872)
221. **1963** Malaya, Sabah, Sarawak and Singapore federate as Malaysia  [first (20-year gap)]
   - Block B line 221: 1963 | Malaya, Sabah, Sarawak and Singapore federate as Malaysia | Malaysia, Singapore
222. **1964** Tanganyika and Zanzibar unite; renamed Tanzania same year  [first, slider]
   - Block B line 222: 1964 | Tanganyika and Zanzibar unite; renamed Tanzania same year | Tanzania
   - Block A: Tanzania | 1964 | union of Tanganyika and Zanzibar | Tanganyika (to 1964) | Dar es Salaam to Dodoma (1996)
223. **1964** Malta becomes independent from the United Kingdom  [first, slider]
   - Block B line 223: 1964 | Malta becomes independent from the United Kingdom | Malta, United Kingdom
   - Block A: Malta | 1964 | United Kingdom | none | none
224. **1965** Singapore separates from Malaysia as a sovereign state  [first, slider]
   - Block B line 224: 1965 | Singapore separates from Malaysia as a sovereign state | Singapore, Malaysia
   - Block A: Singapore | 1965 | Malaysia | Syonan-to (1942-1945) | none
225. **1966** British Guiana becomes independent as Guyana  [first, slider]
   - Block B line 225: 1966 | British Guiana becomes independent as Guyana | Guyana, United Kingdom
   - Block A: Guyana | 1966 | United Kingdom | British Guiana (1831-1966) | none
226. **1966** Barbados becomes independent from the United Kingdom  [first, slider]
   - Block B line 226: 1966 | Barbados becomes independent from the United Kingdom | Barbados, United Kingdom
   - Block A: Barbados | 1966 | United Kingdom | none | none
227. **1968** Nauru becomes independent from Australian-run UN trusteeship  [first, slider]
   - Block B line 227: 1968 | Nauru becomes independent from Australian-run UN trusteeship | Nauru, Australia
   - Block A: Nauru | 1968 | Australia (UN trust territory) | Pleasant Island (to 1888) | none
228. **1970** Aswan High Dam completed on the Nile, forming Lake Nasser  [first, slider]
   - Block B line 228: 1970 | Aswan High Dam completed on the Nile, forming Lake Nasser | Egypt, Sudan
229. **1970** Fiji becomes independent from the United Kingdom  [first, slider]
   - Block B line 229: 1970 | Fiji becomes independent from the United Kingdom | Fiji, United Kingdom
   - Block A: Fiji | 1970 | United Kingdom | none | Levuka to Suva (1882)
230. **1970** Government of British Honduras moves capital to new Belmopan  [first, slider]
   - Block B line 230: 1970 | Government of British Honduras moves capital to new Belmopan | Belize
   - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
231. **1971** Bangladesh declares independence from Pakistan, wins war that year  [first, slider]
   - Block B line 231: 1971 | Bangladesh declares independence from Pakistan, wins war that year | Bangladesh, Pakistan
   - Block A: Bangladesh | 1971 | Pakistan | East Pakistan (to 1971) | none
232. **1971** Democratic Republic of the Congo renamed Zaire  [first, slider]
   - Block B line 232: 1971 | Democratic Republic of the Congo renamed Zaire | Democratic Republic of the Congo
   - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
233. **1971** Six Trucial States form the United Arab Emirates  [first, slider]
   - Block B line 233: 1971 | Six Trucial States form the United Arab Emirates | United Arab Emirates
   - Block A: United Arab Emirates | 1971 | United Kingdom (protectorate) | Trucial States (to 1971) | none
234. **1972** United States returns Okinawa to Japan  [first, slider]
   - Block B line 234: 1972 | United States returns Okinawa to Japan | Japan, United States
235. **1972** Ceylon becomes a republic renamed Sri Lanka  [first, slider]
   - Block B line 235: 1972 | Ceylon becomes a republic renamed Sri Lanka | Sri Lanka
   - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
236. **1973** British Honduras officially renamed Belize  [first, slider]
   - Block B line 236: 1973 | British Honduras officially renamed Belize | Belize
   - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
237. **1975** Mozambique becomes independent from Portugal  [first, slider]
   - Block B line 237: 1975 | Mozambique becomes independent from Portugal | Mozambique, Portugal
   - Block A: Mozambique | 1975 | Portugal | none | Island of Mozambique to Lourenco Marques (1898)
238. **1975** Papua New Guinea becomes independent from Australia  [first, slider]
   - Block B line 238: 1975 | Papua New Guinea becomes independent from Australia | Papua New Guinea, Australia
   - Block A: Papua New Guinea | 1975 | Australia | Papua and New Guinea (1949-1971) | none
239. **1975** Italy and Yugoslavia sign Treaty of Osimo settling Trieste border  [first, slider]
   - Block B line 239: 1975 | Italy and Yugoslavia sign Treaty of Osimo settling Trieste border | Italy, Slovenia, Croatia
240. **1975** Suriname becomes independent from the Netherlands  [first, slider]
   - Block B line 240: 1975 | Suriname becomes independent from the Netherlands | Suriname, Netherlands
   - Block A: Suriname | 1975 | Netherlands | Dutch Guiana (to 1954) | none
241. **1975** Dahomey renamed People's Republic of Benin  [first, slider]
   - Block B line 241: 1975 | Dahomey renamed People's Republic of Benin | Benin
   - Block A: Benin | 1960 | France | Dahomey (to 1975) | none
242. **1976** North and South Vietnam formally reunified  [first (20-year gap)]
   - Block B line 242: 1976 | North and South Vietnam formally reunified | Viet Nam
   - Block A: Viet Nam | 1976 | reunification of North and South | Dai Nam (1839-1945) | Hue to Hanoi (1945)
243. **1978** Ellice Islands become independent as Tuvalu  [first, slider]
   - Block B line 243: 1978 | Ellice Islands become independent as Tuvalu | Tuvalu, United Kingdom
   - Block A: Tuvalu | 1978 | United Kingdom | Ellice Islands (to 1975) | none
244. **1979** Gilbert Islands become independent as Kiribati  [first, slider]
   - Block B line 244: 1979 | Gilbert Islands become independent as Kiribati | Kiribati, United Kingdom
   - Block A: Kiribati | 1979 | United Kingdom | Gilbert Islands (to 1979) | none
245. **1979** Panama Canal Zone abolished under Torrijos-Carter Treaties  [first, slider]
   - Block B line 245: 1979 | Panama Canal Zone abolished under Torrijos-Carter Treaties | Panama, United States
246. **1980** Southern Rhodesia becomes independent Zimbabwe  [first (20-year gap)]
   - Block B line 246: 1980 | Southern Rhodesia becomes independent Zimbabwe | Zimbabwe, United Kingdom
   - Block A: Zimbabwe | 1980 | United Kingdom | Southern Rhodesia (1898-1965); Rhodesia (1965-1979) | none
247. **1980** New Hebrides becomes independent as Vanuatu  [first, slider]
   - Block B line 247: 1980 | New Hebrides becomes independent as Vanuatu | Vanuatu, United Kingdom, France
   - Block A: Vanuatu | 1980 | United Kingdom and France | New Hebrides (to 1980) | none
248. **1981** Belize becomes independent from the United Kingdom  [first, slider]
   - Block B line 248: 1981 | Belize becomes independent from the United Kingdom | Belize, United Kingdom
   - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
249. **1982** Salisbury, capital of Zimbabwe, renamed Harare  [first, slider]
   - Block B line 249: 1982 | Salisbury, capital of Zimbabwe, renamed Harare | Zimbabwe
   - Block C line 10: Harare | Zimbabwe | Salisbury | 1982 | capital renamed two years after independence
250. **1982** Itaipu Dam reservoir forms, drowning the Guaira Falls  [first, slider]
   - Block B line 250: 1982 | Itaipu Dam reservoir forms, drowning the Guaira Falls | Brazil, Paraguay
251. **1983** Yamoussoukro made capital of Cote d'Ivoire instead of Abidjan  [first, slider]
   - Block B line 251: 1983 | Yamoussoukro made capital of Cote d'Ivoire instead of Abidjan | Cote d'Ivoire
   - Block A: Cote d'Ivoire | 1960 | France | none | Abidjan to Yamoussoukro (1983)
252. **1984** Brunei becomes fully independent from the United Kingdom  [first, slider]
   - Block B line 252: 1984 | Brunei becomes fully independent from the United Kingdom | Brunei, United Kingdom
   - Block A: Brunei | 1984 | United Kingdom (protectorate) | none | none
253. **1984** Upper Volta renamed Burkina Faso  [first, slider]
   - Block B line 253: 1984 | Upper Volta renamed Burkina Faso | Burkina Faso
   - Block A: Burkina Faso | 1960 | France | Upper Volta (to 1984) | none
254. **1984** Chile and Argentina sign treaty ending Beagle Channel boundary dispute  [first, slider]
   - Block B line 254: 1984 | Chile and Argentina sign treaty ending Beagle Channel boundary dispute | Chile, Argentina
255. **1986** Flevoland, built on reclaimed polders, becomes 12th Dutch province  [first, slider]
   - Block B line 255: 1986 | Flevoland, built on reclaimed polders, becomes 12th Dutch province | Netherlands
256. **1986** Compact of Free Association ends US trusteeship of Marshall Islands, Micronesia  [first (20-year gap)]
   - Block B line 256: 1986 | Compact of Free Association ends US trusteeship of Marshall Islands, Micronesia | Marshall Islands, Micronesia, United States
257. **1988** Seikan Tunnel opens linking Honshu and Hokkaido  [first, slider]
   - Block B line 257: 1988 | Seikan Tunnel opens linking Honshu and Hokkaido | Japan
258. **1989** Burma's English name changed to Myanmar, Rangoon to Yangon  [first, slider]
   - Block B line 258: 1989 | Burma's English name changed to Myanmar, Rangoon to Yangon | Myanmar
   - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
259. **1989** Berlin Wall opened, border crossings freed  [first, slider]
   - Block B line 259: 1989 | Berlin Wall opened, border crossings freed | Germany
260. **1990** Namibia becomes independent from South Africa  [first, slider]
   - Block B line 260: 1990 | Namibia becomes independent from South Africa | Namibia, South Africa
   - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
261. **1990** North and South Yemen unify as Republic of Yemen  [first, slider]
   - Block B line 261: 1990 | North and South Yemen unify as Republic of Yemen | Yemen
   - Block A: Yemen | 1990 | unification of North and South Yemen | North Yemen and South Yemen (to 1990) | none
262. **1990** East and West Germany reunify  [first, slider]
   - Block B line 262: 1990 | East and West Germany reunify | Germany
   - Block A: Germany | don't ask | unification 1871, refounded 1949, reunified 1990 | West Germany (1949-1990) | Bonn to Berlin (1990)
263. **1991** Abuja replaces Lagos as capital of Nigeria  [first, slider]
   - Block B line 263: 1991 | Abuja replaces Lagos as capital of Nigeria | Nigeria
   - Block A: Nigeria | 1960 | United Kingdom | none | Lagos to Abuja (1991)
264. **1991** Soviet Union formally dissolved into 15 states  [first, slider]
   - Block B line 264: 1991 | Soviet Union formally dissolved into 15 states | Russia, Ukraine, Belarus, Kazakhstan
   - Block A: Armenia | 1991 | Soviet Union (dissolution) | none | none
   - Block A: Azerbaijan | 1991 | Soviet Union (dissolution) | none | none
   - Block A: Belarus | 1991 | Soviet Union (dissolution) | Byelorussia (1920-1991) | none
   - Block A: Georgia | 1991 | Soviet Union (dissolution) | none | none
   - Block A: Kazakhstan | 1991 | Soviet Union (dissolution) | none | Almaty to Astana (1997)
   - Block A: Kyrgyzstan | 1991 | Soviet Union (dissolution) | Kirghizia (to 1991) | none
   - Block A: Moldova | 1991 | Soviet Union (dissolution) | Moldavia (1940-1991) | none
   - Block A: Tajikistan | 1991 | Soviet Union (dissolution) | none | none
   - Block A: Turkmenistan | 1991 | Soviet Union (dissolution) | Turkmenia (to 1991) | none
   - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
   - Block A: Uzbekistan | 1991 | Soviet Union (dissolution) | none | Samarkand to Tashkent (1930)
265. **1993** Czechoslovakia splits into the Czech Republic and Slovakia  [first, slider]
   - Block B line 265: 1993 | Czechoslovakia splits into the Czech Republic and Slovakia | Czechia, Slovakia
   - Block A: Czechia | 1993 | Czechoslovakia (dissolution) | none | none
   - Block A: Slovakia | 1993 | Czechoslovakia (dissolution) | none | none
266. **1993** Eritrea becomes formally independent from Ethiopia  [first (20-year gap)]
   - Block B line 266: 1993 | Eritrea becomes formally independent from Ethiopia | Eritrea, Ethiopia
   - Block A: Eritrea | 1993 | Ethiopia | none | Massawa to Asmara (1897)
267. **1994** South Africa transfers Walvis Bay enclave to Namibia  [first, slider]
   - Block B line 267: 1994 | South Africa transfers Walvis Bay enclave to Namibia | Namibia, South Africa
268. **1994** Channel Tunnel opens between England and France  [first, slider]
   - Block B line 268: 1994 | Channel Tunnel opens between England and France | United Kingdom, France
269. **1994** Palau becomes independent in free association with United States  [first, slider]
   - Block B line 269: 1994 | Palau becomes independent in free association with United States | Palau, United States
   - Block A: Palau | 1994 | US-administered UN trust territory | none | Koror to Ngerulmud (2006)
270. **1995** Kiribati moves International Date Line east around Line Islands  [first, slider]
   - Block B line 270: 1995 | Kiribati moves International Date Line east around Line Islands | Kiribati
271. **1997** Zaire renamed back to Democratic Republic of the Congo  [first, slider]
   - Block B line 271: 1997 | Zaire renamed back to Democratic Republic of the Congo | Democratic Republic of the Congo
   - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
272. **1997** United Kingdom transfers Hong Kong to China  [first, slider]
   - Block B line 272: 1997 | United Kingdom transfers Hong Kong to China | China, United Kingdom
273. **1997** Kazakhstan moves capital from Almaty to Akmola (later Astana)  [not asked]
   - Block B line 273: 1997 | Kazakhstan moves capital from Almaty to Akmola (later Astana) | Kazakhstan
   - Block A: Kazakhstan | 1991 | Soviet Union (dissolution) | none | Almaty to Astana (1997)
274. **1998** Peru and Ecuador sign Brasilia Presidential Act ending border dispute  [first, slider]
   - Block B line 274: 1998 | Peru and Ecuador sign Brasilia Presidential Act ending border dispute | Peru, Ecuador
275. **1999** Nunavut split from Northwest Territories as new Canadian territory  [first, slider]
   - Block B line 275: 1999 | Nunavut split from Northwest Territories as new Canadian territory | Canada
276. **1999** New constitution renames Venezuela the Bolivarian Republic of Venezuela  [first, slider]
   - Block B line 276: 1999 | New constitution renames Venezuela the Bolivarian Republic of Venezuela | Venezuela
277. **1999** Portugal transfers Macau to China  [first, slider]
   - Block B line 277: 1999 | Portugal transfers Macau to China | China, Portugal
278. **1999** United States hands full control of Panama Canal to Panama  [first, slider]
   - Block B line 278: 1999 | United States hands full control of Panama Canal to Panama | Panama, United States
279. **2000** Oresund Bridge opens linking Copenhagen and Malmo  [first, slider]
   - Block B line 279: 2000 | Oresund Bridge opens linking Copenhagen and Malmo | Denmark, Sweden
280. **2002** Timor-Leste becomes independent after UN administration  [first (20-year gap)]
   - Block B line 280: 2002 | Timor-Leste becomes independent after UN administration | Timor-Leste, Indonesia
   - Block A: Timor-Leste | 2002 | Indonesia (via UN administration) | Portuguese Timor (to 1975) | none
281. **2003** Federal Republic of Yugoslavia renamed Serbia and Montenegro  [first, slider]
   - Block B line 281: 2003 | Federal Republic of Yugoslavia renamed Serbia and Montenegro | Serbia, Montenegro
282. **2005** Myanmar's government moves capital from Yangon to Naypyidaw  [first, slider]
   - Block B line 282: 2005 | Myanmar's government moves capital from Yangon to Naypyidaw | Myanmar
   - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
283. **2006** Main wall of Three Gorges Dam on the Yangtze completed  [first, slider]
   - Block B line 283: 2006 | Main wall of Three Gorges Dam on the Yangtze completed | China
284. **2006** Montenegro declares independence, ending Serbia and Montenegro union  [first, slider]
   - Block B line 284: 2006 | Montenegro declares independence, ending Serbia and Montenegro union | Montenegro, Serbia
   - Block A: Montenegro | 2006 | Serbia and Montenegro | none | Cetinje to Podgorica (1946)
285. **2006** Palau moves capital from Koror to Ngerulmud  [first, slider]
   - Block B line 285: 2006 | Palau moves capital from Koror to Ngerulmud | Palau
   - Block A: Palau | 1994 | US-administered UN trust territory | none | Koror to Ngerulmud (2006)
286. **2008** Nigeria completes handover of Bakassi peninsula to Cameroon  [first, slider]
   - Block B line 286: 2008 | Nigeria completes handover of Bakassi peninsula to Cameroon | Cameroon, Nigeria
287. **2008** Russia transfers part of Bolshoy Ussuriysky Island to China  [first, slider]
   - Block B line 287: 2008 | Russia transfers part of Bolshoy Ussuriysky Island to China | China, Russia
288. **2009** New constitution renames Bolivia the Plurinational State of Bolivia  [first, slider]
   - Block B line 288: 2009 | New constitution renames Bolivia the Plurinational State of Bolivia | Bolivia
289. **2010** Netherlands Antilles dissolved; Curacao and Sint Maarten become countries  [first, slider]
   - Block B line 289: 2010 | Netherlands Antilles dissolved; Curacao and Sint Maarten become countries | Netherlands
290. **2011** South Sudan becomes independent from Sudan  [first, slider]
   - Block B line 290: 2011 | South Sudan becomes independent from Sudan | South Sudan, Sudan
   - Block A: South Sudan | 2011 | Sudan | none | none
291. **2011** Samoa crosses International Date Line, skipping 30 December  [first, slider]
   - Block B line 291: 2011 | Samoa crosses International Date Line, skipping 30 December | Samoa
292. **2015** India and Bangladesh exchange their border enclaves  [first, slider]
   - Block B line 292: 2015 | India and Bangladesh exchange their border enclaves | India, Bangladesh
293. **2016** Czech government adopts Czechia as official English short name  [first, slider]
   - Block B line 293: 2016 | Czech government adopts Czechia as official English short name | Czechia
294. **2016** Expanded Panama Canal with new larger locks opens  [first, slider]
   - Block B line 294: 2016 | Expanded Panama Canal with new larger locks opens | Panama
295. **2018** Kingdom of Swaziland renamed Kingdom of Eswatini  [first, slider]
   - Block B line 295: 2018 | Kingdom of Swaziland renamed Kingdom of Eswatini | Eswatini
   - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
296. **2019** Burundi makes Gitega its political capital instead of Bujumbura  [first, slider]
   - Block B line 296: 2019 | Burundi makes Gitega its political capital instead of Bujumbura | Burundi
   - Block A: Burundi | 1962 | Belgium (UN trust territory) | none | Bujumbura to Gitega (2019)
297. **2019** Prespa Agreement in force; Macedonia renamed North Macedonia  [first, slider]
   - Block B line 297: 2019 | Prespa Agreement in force; Macedonia renamed North Macedonia | North Macedonia, Greece
   - Block A: North Macedonia | 1991 | Yugoslavia | Macedonia (1991-2019) | none
298. **2019** Kazakhstan renames its capital Astana to Nur-Sultan  [first, slider]
   - Block B line 298: 2019 | Kazakhstan renames its capital Astana to Nur-Sultan | Kazakhstan
299. **2022** United Nations adopts Turkiye as the country's name  [first, slider]
   - Block B line 299: 2022 | United Nations adopts Turkiye as the country's name | Turkiye
300. **2022** Canada and Denmark agree to split Hans Island between them  [first, slider]
   - Block B line 300: 2022 | Canada and Denmark agree to split Hans Island between them | Canada, Denmark
301. **2022** Peljesac Bridge opens, linking Dubrovnik area to rest of Croatia  [first, slider]
   - Block B line 301: 2022 | Peljesac Bridge opens, linking Dubrovnik area to rest of Croatia | Croatia
302. **2022** Kazakhstan's capital Nur-Sultan renamed back to Astana  [first, slider]
   - Block B line 302: 2022 | Kazakhstan's capital Nur-Sultan renamed back to Astana | Kazakhstan
   - Block C line 1: Astana | Kazakhstan | Nur-Sultan | 2022 | capital's name changed back to Astana
303. **2026** Equatorial Guinea decrees Ciudad de la Paz its capital, replacing Malabo  [first, slider]
   - Block B line 303: 2026 | Equatorial Guinea decrees Ciudad de la Paz its capital, replacing Malabo | Equatorial Guinea
   - Block A: Equatorial Guinea | 1968 | Spain | Spanish Guinea (to 1968) | Malabo to Ciudad de la Paz (2026)
304. **1804** Hobart founded as a British settlement in Van Diemen's Land  [first, slider]
   - Block D line 1: 1804 | Hobart founded as a British settlement in Van Diemen's Land | Australia, United Kingdom
305. **1811** Venezuela declares independence from Spain  [first, slider]
   - Block D line 2: 1811 | Venezuela declares independence from Spain | Venezuela, Spain
306. **1813** Paraguay proclaims itself a republic  [first (20-year gap)]
   - Block D line 3: 1813 | Paraguay proclaims itself a republic | Paraguay
307. **1819** Congress of Angostura proclaims the Republic of Colombia (Gran Colombia)  [first, slider]
   - Block D line 4: 1819 | Congress of Angostura proclaims the Republic of Colombia (Gran Colombia) | Colombia, Venezuela, Ecuador, Panama
   - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
308. **1830** Venezuela separates from Gran Colombia  [first, slider]
   - Block D line 5: 1830 | Venezuela separates from Gran Colombia | Venezuela, Colombia
   - Block A: Venezuela | 1830 | Gran Colombia | none | none
309. **1831** Gran Colombia legally ends; State of New Granada is created  [first, slider]
   - Block D line 6: 1831 | Gran Colombia legally ends; State of New Granada is created | Colombia, Panama
   - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
310. **1832** Ecuador annexes the Galapagos Islands  [first, slider]
   - Block D line 7: 1832 | Ecuador annexes the Galapagos Islands | Ecuador
311. **1839** Peru-Bolivian Confederation is dissolved  [first, slider]
   - Block D line 8: 1839 | Peru-Bolivian Confederation is dissolved | Peru, Bolivia
312. **1841** Auckland becomes the capital of New Zealand  [first, slider]
   - Block D line 9: 1841 | Auckland becomes the capital of New Zealand | New Zealand
   - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
313. **1841** New Zealand becomes a colony separate from New South Wales  [first, slider]
   - Block D line 10: 1841 | New Zealand becomes a colony separate from New South Wales | New Zealand, Australia, United Kingdom
314. **1842** France makes Tahiti a protectorate  [first, slider]
   - Block D line 11: 1842 | France makes Tahiti a protectorate | France
315. **1853** France takes possession of New Caledonia  [first, slider]
   - Block D line 12: 1853 | France takes possession of New Caledonia | France
316. **1856** Norfolk Island separated from Tasmania  [first, slider]
   - Block D line 13: 1856 | Norfolk Island separated from Tasmania | Australia
317. **1858** Granadine Confederation replaces the Republic of New Granada  [first, slider]
   - Block D line 14: 1858 | Granadine Confederation replaces the Republic of New Granada | Colombia, Panama
   - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
318. **1859** Queensland separates from New South Wales  [first, slider]
   - Block D line 15: 1859 | Queensland separates from New South Wales | Australia
319. **1863** Granadine Confederation becomes the United States of Colombia  [first, slider]
   - Block D line 16: 1863 | Granadine Confederation becomes the United States of Colombia | Colombia, Panama
   - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
320. **1863** Northern Territory becomes part of South Australia  [first, slider]
   - Block D line 17: 1863 | Northern Territory becomes part of South Australia | Australia
321. **1866** Bolivia and Chile set their border at the 24th parallel  [first, slider]
   - Block D line 18: 1866 | Bolivia and Chile set their border at the 24th parallel | Bolivia, Chile
322. **1867** Russia creates Turkestan Governor-Generalship with capital Tashkent  [first, slider]
   - Block D line 19: 1867 | Russia creates Turkestan Governor-Generalship with capital Tashkent | Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, Russia
323. **1867** Treaty of Ayacucho sets the Bolivia-Brazil border  [first, slider]
   - Block D line 20: 1867 | Treaty of Ayacucho sets the Bolivia-Brazil border | Bolivia, Brazil
324. **1867** United States takes formal possession of Midway Atoll  [first, slider]
   - Block D line 21: 1867 | United States takes formal possession of Midway Atoll | United States
325. **1868** Basutoland becomes a British protectorate  [first, slider]
   - Block D line 22: 1868 | Basutoland becomes a British protectorate | Lesotho, United Kingdom
326. **1868** Russia annexes Samarkand from the Emirate of Bukhara  [first, slider]
   - Block D line 23: 1868 | Russia annexes Samarkand from the Emirate of Bukhara | Uzbekistan, Russia
327. **1872** Paraguay cedes land north of the Apa River to Brazil  [first, slider]
   - Block D line 24: 1872 | Paraguay cedes land north of the Apa River to Brazil | Paraguay, Brazil
328. **1873** Khanate of Khiva becomes a Russian protectorate  [first, slider]
   - Block D line 25: 1873 | Khanate of Khiva becomes a Russian protectorate | Uzbekistan, Turkmenistan, Russia
329. **1874** New Bolivia-Chile treaty confirms the 24th parallel border  [first, slider]
   - Block D line 26: 1874 | New Bolivia-Chile treaty confirms the 24th parallel border | Bolivia, Chile
330. **1876** Russia annexes the Kokand Khanate as Fergana Oblast  [first, slider]
   - Block D line 27: 1876 | Russia annexes the Kokand Khanate as Fergana Oblast | Uzbekistan, Kyrgyzstan, Tajikistan, Russia
331. **1876** Treaty gives Argentina Misiones and land south of the Pilcomayo  [first, slider]
   - Block D line 28: 1876 | Treaty gives Argentina Misiones and land south of the Pilcomayo | Argentina, Paraguay
332. **1878** Hayes arbitral award gives the disputed Chaco to Paraguay  [first, slider]
   - Block D line 29: 1878 | Hayes arbitral award gives the disputed Chaco to Paraguay | Paraguay, Argentina
333. **1879** Queensland annexes the remaining Torres Strait Islands  [first, slider]
   - Block D line 30: 1879 | Queensland annexes the remaining Torres Strait Islands | Australia
334. **1880** Buenos Aires city is federalized as Argentina's capital  [first, slider]
   - Block D line 31: 1880 | Buenos Aires city is federalized as Argentina's capital | Argentina
335. **1880** France annexes Tahiti as a colony  [first, slider]
   - Block D line 32: 1880 | France annexes Tahiti as a colony | France
336. **1881** Treaty of Saint Petersburg returns eastern Ili to China  [first, slider]
   - Block D line 33: 1881 | Treaty of Saint Petersburg returns eastern Ili to China | China, Kazakhstan, Russia
337. **1882** La Plata is founded as the new capital of Buenos Aires province  [first, slider]
   - Block D line 34: 1882 | La Plata is founded as the new capital of Buenos Aires province | Argentina
338. **1884** Germany declares a protectorate over Togoland  [first, slider]
   - Block D line 35: 1884 | Germany declares a protectorate over Togoland | Togo, Ghana, Germany
339. **1884** Germany establishes the protectorate of Kamerun  [first, slider]
   - Block D line 36: 1884 | Germany establishes the protectorate of Kamerun | Cameroon, Germany
340. **1884** Merv Turkmen tribes come under Russian rule  [first, slider]
   - Block D line 37: 1884 | Merv Turkmen tribes come under Russian rule | Turkmenistan, Russia
341. **1885** Britain establishes the Bechuanaland Protectorate  [first, slider]
   - Block D line 38: 1885 | Britain establishes the Bechuanaland Protectorate | Botswana, United Kingdom
   - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
342. **1885** Germany declares a protectorate over the Marshall Islands  [first, slider]
   - Block D line 39: 1885 | Germany declares a protectorate over the Marshall Islands | Marshall Islands, Germany
343. **1886** United States of Colombia becomes the Republic of Colombia  [first, slider]
   - Block D line 40: 1886 | United States of Colombia becomes the Republic of Colombia | Colombia, Panama
   - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
344. **1887** Kermadec Islands assigned to the colony of New Zealand  [first, slider]
   - Block D line 41: 1887 | Kermadec Islands assigned to the colony of New Zealand | New Zealand, United Kingdom
345. **1888** Cook Islands become a British protectorate  [first, slider]
   - Block D line 42: 1888 | Cook Islands become a British protectorate | New Zealand, United Kingdom
346. **1888** Germany annexes Nauru  [first, slider]
   - Block D line 43: 1888 | Germany annexes Nauru | Nauru, Germany
347. **1890** Italy proclaims the colony of Eritrea  [first, slider]
   - Block D line 44: 1890 | Italy proclaims the colony of Eritrea | Eritrea, Italy
348. **1892** Gilbert and Ellice Islands become British protectorates  [first, slider]
   - Block D line 45: 1892 | Gilbert and Ellice Islands become British protectorates | Kiribati, Tuvalu, United Kingdom
349. **1893** Britain proclaims a protectorate over the Solomon Islands  [first, slider]
   - Block D line 46: 1893 | Britain proclaims a protectorate over the Solomon Islands | Solomon Islands, United Kingdom
350. **1895** Britain proclaims the East Africa Protectorate  [first, slider]
   - Block D line 47: 1895 | Britain proclaims the East Africa Protectorate | Kenya, United Kingdom
   - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
351. **1895** Cleveland award gives the Palmas region to Brazil over Argentina  [first, slider]
   - Block D line 48: 1895 | Cleveland award gives the Palmas region to Brazil over Argentina | Brazil, Argentina
352. **1895** France creates the federation of French West Africa  [first, slider]
   - Block D line 49: 1895 | France creates the federation of French West Africa | Senegal, Mali, Guinea, Cote d'Ivoire, France
353. **1895** Pamir boundary protocols create Afghanistan's Wakhan Corridor  [first, slider]
   - Block D line 50: 1895 | Pamir boundary protocols create Afghanistan's Wakhan Corridor | Afghanistan, Tajikistan, Pakistan, Russia, United Kingdom
354. **1897** Belo Horizonte replaces Ouro Preto as capital of Minas Gerais  [first, slider]
   - Block D line 51: 1897 | Belo Horizonte replaces Ouro Preto as capital of Minas Gerais | Brazil
355. **1899** Germany buys the Carolines, Palau and Northern Marianas from Spain  [first, slider]
   - Block D line 52: 1899 | Germany buys the Carolines, Palau and Northern Marianas from Spain | Micronesia, Palau, United States, Germany, Spain
356. **1899** Puna de Atacama arbitration gives most of the area to Argentina  [first, slider]
   - Block D line 53: 1899 | Puna de Atacama arbitration gives most of the area to Argentina | Argentina, Chile
357. **1899** United States claims Wake Island  [first, slider]
   - Block D line 54: 1899 | United States claims Wake Island | United States
358. **1900** Congress organizes the Territory of Hawaii  [first, slider]
   - Block D line 55: 1900 | Congress organizes the Territory of Hawaii | United States
359. **1900** Ocean Island (Banaba) added to the Gilbert and Ellice protectorate  [first, slider]
   - Block D line 56: 1900 | Ocean Island (Banaba) added to the Gilbert and Ellice protectorate | Kiribati, United Kingdom
360. **1900** Swiss arbitration gives Amapa to Brazil over French Guiana  [first, slider]
   - Block D line 57: 1900 | Swiss arbitration gives Amapa to Brazil over French Guiana | Brazil, France
361. **1900** Tonga becomes a British protected state  [first, slider]
   - Block D line 58: 1900 | Tonga becomes a British protected state | Tonga, United Kingdom
362. **1900** Tutuila ceded to the United States  [first, slider]
   - Block D line 59: 1900 | Tutuila ceded to the United States | United States
363. **1901** Cook Islands and Niue brought within New Zealand's boundaries  [first, slider]
   - Block D line 60: 1901 | Cook Islands and Niue brought within New Zealand's boundaries | New Zealand
364. **1902** British arbitral award fixes much of the Argentina-Chile Andes border  [first, slider]
   - Block D line 61: 1902 | British arbitral award fixes much of the Argentina-Chile Andes border | Argentina, Chile
365. **1904** Italian king's award fixes the British Guiana-Brazil border  [first, slider]
   - Block D line 63: 1904 | Italian king's award fixes the British Guiana-Brazil border | Guyana, Brazil, United Kingdom
366. **1904** Manu'a Islands ceded to the United States  [first, slider]
   - Block D line 64: 1904 | Manu'a Islands ceded to the United States | United States
367. **1906** British New Guinea becomes Australia's Territory of Papua  [first, slider]
   - Block D line 66: 1906 | British New Guinea becomes Australia's Territory of Papua | Papua New Guinea, Australia
368. **1906** Marshall Islands annexed to German New Guinea  [first, slider]
   - Block D line 67: 1906 | Marshall Islands annexed to German New Guinea | Marshall Islands, Papua New Guinea, Germany
369. **1909** Brazil and Peru sign a treaty completing their border  [first, slider]
   - Block D line 68: 1909 | Brazil and Peru sign a treaty completing their border | Brazil, Peru
370. **1909** Brazil-Uruguay treaty redraws the border on Lagoa Mirim  [first, slider]
   - Block D line 69: 1909 | Brazil-Uruguay treaty redraws the border on Lagoa Mirim | Brazil, Uruguay
371. **1910** France forms French Equatorial Africa, run from Brazzaville  [first, slider]
   - Block D line 70: 1910 | France forms French Equatorial Africa, run from Brazzaville | Gabon, Republic of the Congo, Central African Republic, Chad, France
372. **1911** Northern Territory transferred from South Australia to Commonwealth  [first, slider]
   - Block D line 71: 1911 | Northern Territory transferred from South Australia to Commonwealth | Australia
373. **1911** US Samoan islands officially renamed American Samoa  [first, slider]
   - Block D line 72: 1911 | US Samoan islands officially renamed American Samoa | United States
374. **1914** Japan seizes German Micronesia  [first, slider]
   - Block D line 73: 1914 | Japan seizes German Micronesia | Japan, Micronesia, Palau, Marshall Islands, United States, Germany
375. **1914** Norfolk Island transferred from Britain to Australia  [first, slider]
   - Block D line 74: 1914 | Norfolk Island transferred from Britain to Australia | Australia, United Kingdom
376. **1916** Colombia and Ecuador sign their land border treaty  [first, slider]
   - Block D line 75: 1916 | Colombia and Ecuador sign their land border treaty | Colombia, Ecuador
377. **1916** Gilbert and Ellice Islands become a British Crown colony  [first, slider]
   - Block D line 76: 1916 | Gilbert and Ellice Islands become a British Crown colony | Kiribati, Tuvalu, United Kingdom
378. **1916** Tokelau annexed to the Gilbert and Ellice Islands Colony  [first, slider]
   - Block D line 77: 1916 | Tokelau annexed to the Gilbert and Ellice Islands Colony | New Zealand, United Kingdom
379. **1920** Bukharan People's Soviet Republic replaces the Emirate of Bukhara  [first, slider]
   - Block D line 78: 1920 | Bukharan People's Soviet Republic replaces the Emirate of Bukhara | Uzbekistan, Tajikistan, Turkmenistan
380. **1920** Khorezm People's Soviet Republic replaces the Khanate of Khiva  [first, slider]
   - Block D line 79: 1920 | Khorezm People's Soviet Republic replaces the Khanate of Khiva | Uzbekistan, Turkmenistan
381. **1922** Salomon-Lozano Treaty signed: Leticia corridor to Colombia  [first, slider]
   - Block D line 80: 1922 | Salomon-Lozano Treaty signed: Leticia corridor to Colombia | Colombia, Peru
382. **1924** Northern Rhodesia passes from company rule to a British protectorate  [first, slider]
   - Block D line 81: 1924 | Northern Rhodesia passes from company rule to a British protectorate | Zambia, United Kingdom
383. **1924** Soviet national delimitation creates Uzbek and Turkmen SSRs  [first, slider]
   - Block D line 82: 1924 | Soviet national delimitation creates Uzbek and Turkmen SSRs | Uzbekistan, Turkmenistan
384. **1925** Kazakh capital moves from Orenburg to Kzyl-Orda  [first, slider]
   - Block D line 83: 1925 | Kazakh capital moves from Orenburg to Kzyl-Orda | Kazakhstan, Russia
385. **1925** Kirghiz ASSR renamed Kazakh ASSR  [first, slider]
   - Block D line 84: 1925 | Kirghiz ASSR renamed Kazakh ASSR | Kazakhstan
386. **1925** Swains Island annexed to American Samoa  [first, slider]
   - Block D line 85: 1925 | Swains Island annexed to American Samoa | United States
387. **1927** Northern Territory split into North and Central Australia  [first, slider]
   - Block D line 87: 1927 | Northern Territory split into North and Central Australia | Australia
388. **1929** Tajik SSR becomes a union republic, gaining the Khujand area  [first, slider]
   - Block D line 88: 1929 | Tajik SSR becomes a union republic, gaining the Khujand area | Tajikistan, Uzbekistan
389. **1930** Uzbek SSR capital moves from Samarkand to Tashkent  [first, slider]
   - Block D line 89: 1930 | Uzbek SSR capital moves from Samarkand to Tashkent | Uzbekistan
   - Block A: Uzbekistan | 1991 | Soviet Union (dissolution) | none | Samarkand to Tashkent (1930)
390. **1931** Arbitration awards Clipperton Island to France  [first, slider]
   - Block D line 90: 1931 | Arbitration awards Clipperton Island to France | France, Mexico
391. **1931** North and Central Australia reunited as the Northern Territory  [first, slider]
   - Block D line 91: 1931 | North and Central Australia reunited as the Northern Territory | Australia
392. **1932** Sydney Harbour Bridge opens  [first, slider]
   - Block D line 92: 1932 | Sydney Harbour Bridge opens | Australia
393. **1934** Rio Protocol ends the Colombia-Peru War  [first, slider]
   - Block D line 93: 1934 | Rio Protocol ends the Colombia-Peru War | Colombia, Peru
394. **1935** Lusaka replaces Livingstone as capital of Northern Rhodesia  [first, slider]
   - Block D line 94: 1935 | Lusaka replaces Livingstone as capital of Northern Rhodesia | Zambia, United Kingdom
   - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
395. **1936** Karakalpak ASSR moves from Russian SFSR to Uzbek SSR  [first, slider]
   - Block D line 95: 1936 | Karakalpak ASSR moves from Russian SFSR to Uzbek SSR | Uzbekistan, Russia
396. **1936** Kirghiz SSR becomes a full Soviet union republic  [first, slider]
   - Block D line 96: 1936 | Kirghiz SSR becomes a full Soviet union republic | Kyrgyzstan, Russia
397. **1941** Bissau replaces Bolama as capital of Portuguese Guinea  [first, slider]
   - Block D line 97: 1941 | Bissau replaces Bolama as capital of Portuguese Guinea | Guinea-Bissau, Portugal
   - Block A: Guinea-Bissau | 1973 | Portugal | Portuguese Guinea (to 1974) | Bolama to Bissau (1941)
398. **1941** Colombia and Venezuela sign their land border treaty  [first, slider]
   - Block D line 98: 1941 | Colombia and Venezuela sign their land border treaty | Colombia, Venezuela
399. **1943** Brazil creates five federal territories, including Amapa  [first, slider]
   - Block D line 99: 1943 | Brazil creates five federal territories, including Amapa | Brazil
400. **1946** Tarawa made capital of the Gilbert and Ellice Islands  [first, slider]
   - Block D line 100: 1946 | Tarawa made capital of the Gilbert and Ellice Islands | Kiribati, Tuvalu, United Kingdom
401. **1947** UN Trust Territory of the Pacific Islands created under the US  [first, slider]
   - Block D line 101: 1947 | UN Trust Territory of the Pacific Islands created under the US | Micronesia, Palau, Marshall Islands, United States
402. **1949** Papua and New Guinea merged under one administration  [first, slider]
   - Block D line 102: 1949 | Papua and New Guinea merged under one administration | Papua New Guinea, Australia
   - Block A: Papua New Guinea | 1975 | Australia | Papua and New Guinea (1949-1971) | none
403. **1949** Tokelau formally becomes part of New Zealand  [first, slider]
   - Block D line 103: 1949 | Tokelau formally becomes part of New Zealand | New Zealand
404. **1950** Guam Organic Act makes Guam an unincorporated US territory  [first, slider]
   - Block D line 104: 1950 | Guam Organic Act makes Guam an unincorporated US territory | United States
405. **1952** Eritrea is federated with Ethiopia under a UN resolution  [first, slider]
   - Block D line 105: 1952 | Eritrea is federated with Ethiopia under a UN resolution | Eritrea, Ethiopia
406. **1952** Honiara replaces Tulagi as capital of the Solomon Islands  [not asked]
   - Block D line 106: 1952 | Honiara replaces Tulagi as capital of the Solomon Islands | Solomon Islands
   - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
407. **1956** Tangier international zone returns to Moroccan sovereignty  [first, slider]
   - Block D line 107: 1956 | Tangier international zone returns to Moroccan sovereignty | Morocco
408. **1958** Spain hands the Tarfaya Strip to Morocco  [first, slider]
   - Block D line 108: 1958 | Spain hands the Tarfaya Strip to Morocco | Morocco, Spain
409. **1959** Auckland Harbour Bridge opens  [first, slider]
   - Block D line 109: 1959 | Auckland Harbour Bridge opens | New Zealand
410. **1959** Kariba Dam on the Zambezi completed, forming Lake Kariba  [first, slider]
   - Block D line 110: 1959 | Kariba Dam on the Zambezi completed, forming Lake Kariba | Zambia, Zimbabwe
411. **1960** Belgian Congo becomes independent  [first, slider]
   - Block D line 111: 1960 | Belgian Congo becomes independent | Democratic Republic of the Congo, Belgium
   - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
412. **1960** British and Italian Somaliland unite as the Somali Republic  [first, slider]
   - Block D line 112: 1960 | British and Italian Somaliland unite as the Somali Republic | Somalia, United Kingdom, Italy
   - Block A: Somalia | 1960 | union of British and Italian Somaliland | none | none
413. **1960** Chad becomes independent from France  [first, slider]
   - Block D line 113: 1960 | Chad becomes independent from France | Chad, France
   - Block A: Chad | 1960 | France | none | none
414. **1960** Cote d'Ivoire becomes independent from France  [first, slider]
   - Block D line 114: 1960 | Cote d'Ivoire becomes independent from France | Cote d'Ivoire, France
   - Block A: Cote d'Ivoire | 1960 | France | none | Abidjan to Yamoussoukro (1983)
415. **1960** French Cameroun becomes independent as Cameroon  [first, slider]
   - Block D line 115: 1960 | French Cameroun becomes independent as Cameroon | Cameroon, France
   - Block A: Cameroon | 1960 | France (British Southern Cameroons joined 1961) | none | none
416. **1960** Gabon becomes independent from France  [first, slider]
   - Block D line 116: 1960 | Gabon becomes independent from France | Gabon, France
   - Block A: Gabon | 1960 | France | none | none
417. **1960** Madagascar becomes independent from France  [first, slider]
   - Block D line 117: 1960 | Madagascar becomes independent from France | Madagascar, France
   - Block A: Madagascar | 1960 | France | none | none
418. **1960** Mali Federation breaks up as Senegal secedes  [first, slider]
   - Block D line 118: 1960 | Mali Federation breaks up as Senegal secedes | Senegal, Mali
419. **1960** Mauritania becomes independent from France  [first, slider]
   - Block D line 119: 1960 | Mauritania becomes independent from France | Mauritania, France
   - Block A: Mauritania | 1960 | France | none | none
420. **1960** Togo becomes independent from France  [first, slider]
   - Block D line 120: 1960 | Togo becomes independent from France | Togo, France
   - Block A: Togo | 1960 | France | French Togoland (1916-1960) | none
421. **1960** Upper Volta becomes independent from France  [first, slider]
   - Block D line 121: 1960 | Upper Volta becomes independent from France | Burkina Faso, France
   - Block A: Burkina Faso | 1960 | France | Upper Volta (to 1984) | none
422. **1961** Northern Cameroons joins Nigeria, Southern Cameroons joins Cameroon  [first, slider]
   - Block D line 122: 1961 | Northern Cameroons joins Nigeria, Southern Cameroons joins Cameroon | Cameroon, Nigeria, United Kingdom
423. **1961** Sierra Leone becomes independent from the United Kingdom  [first, slider]
   - Block D line 123: 1961 | Sierra Leone becomes independent from the United Kingdom | Sierra Leone, United Kingdom
   - Block A: Sierra Leone | 1961 | United Kingdom | none | none
424. **1961** Tanganyika becomes independent from the United Kingdom  [first, slider]
   - Block D line 124: 1961 | Tanganyika becomes independent from the United Kingdom | Tanzania, United Kingdom
425. **1962** Acre becomes a state of Brazil  [first, slider]
   - Block D line 125: 1962 | Acre becomes a state of Brazil | Brazil
426. **1962** Eritrea's federation with Ethiopia ends; Eritrea annexed  [first, slider]
   - Block D line 126: 1962 | Eritrea's federation with Ethiopia ends; Eritrea annexed | Eritrea, Ethiopia
427. **1962** Ruanda-Urundi splits into independent Rwanda and Burundi  [first, slider]
   - Block D line 127: 1962 | Ruanda-Urundi splits into independent Rwanda and Burundi | Rwanda, Burundi, Belgium
   - Block A: Burundi | 1962 | Belgium (UN trust territory) | none | Bujumbura to Gitega (2019)
   - Block A: Rwanda | 1962 | Belgium (UN trust territory) | none | none
428. **1962** Uganda becomes independent with Kampala as its capital  [first, slider]
   - Block D line 128: 1962 | Uganda becomes independent with Kampala as its capital | Uganda, United Kingdom
   - Block A: Uganda | 1962 | United Kingdom | none | Entebbe to Kampala (1962)
   - Block A: Uganda | 1962 | United Kingdom | none | Entebbe to Kampala (1962)
429. **1963** Federation of Rhodesia and Nyasaland is dissolved  [first, slider]
   - Block D line 129: 1963 | Federation of Rhodesia and Nyasaland is dissolved | Zimbabwe, Zambia, Malawi, United Kingdom
430. **1963** Kenya becomes independent from the United Kingdom  [first, slider]
   - Block D line 130: 1963 | Kenya becomes independent from the United Kingdom | Kenya, United Kingdom
   - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
431. **1964** Northern Rhodesia becomes independent as Zambia  [first, slider]
   - Block D line 131: 1964 | Northern Rhodesia becomes independent as Zambia | Zambia, United Kingdom
   - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
432. **1964** Nyasaland becomes independent as Malawi  [first, slider]
   - Block D line 132: 1964 | Nyasaland becomes independent as Malawi | Malawi, United Kingdom
   - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
433. **1965** Akosombo Dam completed on the Volta, forming Lake Volta  [first, slider]
   - Block D line 133: 1965 | Akosombo Dam completed on the Volta, forming Lake Volta | Ghana
434. **1965** Cook Islands become self-governing under a new constitution  [first, slider]
   - Block D line 134: 1965 | Cook Islands become self-governing under a new constitution | New Zealand
435. **1965** Friendship Bridge links Brazil and Paraguay over the Parana  [first, slider]
   - Block D line 135: 1965 | Friendship Bridge links Brazil and Paraguay over the Parana | Brazil, Paraguay
436. **1965** Gaborone replaces Mafikeng as capital of Bechuanaland  [first, slider]
   - Block D line 136: 1965 | Gaborone replaces Mafikeng as capital of Bechuanaland | Botswana, United Kingdom
   - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
437. **1965** Gambia becomes independent from the United Kingdom  [first, slider]
   - Block D line 137: 1965 | Gambia becomes independent from the United Kingdom | Gambia, United Kingdom
   - Block A: Gambia | 1965 | United Kingdom | none | none
438. **1966** Basutoland becomes independent as Lesotho  [first, slider]
   - Block D line 138: 1966 | Basutoland becomes independent as Lesotho | Lesotho, United Kingdom
   - Block A: Lesotho | 1966 | United Kingdom | Basutoland (to 1966) | none
439. **1966** Bechuanaland becomes independent as Botswana  [first, slider]
   - Block D line 139: 1966 | Bechuanaland becomes independent as Botswana | Botswana, United Kingdom
   - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
440. **1968** Equatorial Guinea becomes independent from Spain  [first, slider]
   - Block D line 140: 1968 | Equatorial Guinea becomes independent from Spain | Equatorial Guinea, Spain
   - Block A: Equatorial Guinea | 1968 | Spain | Spanish Guinea (to 1968) | Malabo to Ciudad de la Paz (2026)
441. **1968** Swaziland becomes independent from the United Kingdom  [first, slider]
   - Block D line 141: 1968 | Swaziland becomes independent from the United Kingdom | Eswatini, United Kingdom
   - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
442. **1969** Spain cedes the Ifni enclave to Morocco  [first, slider]
   - Block D line 142: 1969 | Spain cedes the Ifni enclave to Morocco | Morocco, Spain
443. **1974** Niue becomes self-governing in free association with New Zealand  [first, slider]
   - Block D line 144: 1974 | Niue becomes self-governing in free association with New Zealand | New Zealand
444. **1974** Portugal recognises Guinea-Bissau's independence  [first (20-year gap)]
   - Block D line 145: 1974 | Portugal recognises Guinea-Bissau's independence | Guinea-Bissau, Portugal
445. **1975** Angola becomes independent from Portugal  [first, slider]
   - Block D line 146: 1975 | Angola becomes independent from Portugal | Angola, Portugal
   - Block A: Angola | 1975 | Portugal | none | none
446. **1975** Cabo Verde becomes independent from Portugal  [first, slider]
   - Block D line 147: 1975 | Cabo Verde becomes independent from Portugal | Cabo Verde, Portugal
   - Block A: Cabo Verde | 1975 | Portugal | none | none
447. **1975** General Artigas Bridge links Paysandu and Colon  [first, slider]
   - Block D line 148: 1975 | General Artigas Bridge links Paysandu and Colon | Uruguay, Argentina
448. **1975** Guanabara state merges into Rio de Janeiro state  [first, slider]
   - Block D line 149: 1975 | Guanabara state merges into Rio de Janeiro state | Brazil
449. **1975** Lilongwe replaces Zomba as capital of Malawi  [first, slider]
   - Block D line 150: 1975 | Lilongwe replaces Zomba as capital of Malawi | Malawi
   - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
450. **1975** Sao Tome and Principe becomes independent from Portugal  [first, slider]
   - Block D line 151: 1975 | Sao Tome and Principe becomes independent from Portugal | Sao Tome and Principe, Portugal
   - Block A: Sao Tome and Principe | 1975 | Portugal | none | none
451. **1976** Libertador General San Martin Bridge links Uruguay and Argentina  [first, slider]
   - Block D line 152: 1976 | Libertador General San Martin Bridge links Uruguay and Argentina | Uruguay, Argentina
452. **1976** Seychelles becomes independent from the United Kingdom  [first, slider]
   - Block D line 153: 1976 | Seychelles becomes independent from the United Kingdom | Seychelles, United Kingdom
   - Block A: Seychelles | 1976 | United Kingdom | none | none
453. **1976** Toktogul Dam floods the Ketmen-Tobo valley  [first, slider]
   - Block D line 154: 1976 | Toktogul Dam floods the Ketmen-Tobo valley | Kyrgyzstan
454. **1977** Djibouti becomes independent from France  [first, slider]
   - Block D line 155: 1977 | Djibouti becomes independent from France | Djibouti, France
   - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
455. **1978** Australia and Papua New Guinea sign the Torres Strait Treaty  [first, slider]
   - Block D line 156: 1978 | Australia and Papua New Guinea sign the Torres Strait Treaty | Australia, Papua New Guinea
456. **1978** Northern Territory becomes self-governing  [first, slider]
   - Block D line 157: 1978 | Northern Territory becomes self-governing | Australia
457. **1978** Solomon Islands becomes independent  [first, slider]
   - Block D line 158: 1978 | Solomon Islands becomes independent | Solomon Islands, United Kingdom
   - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
458. **1980** Nurek Dam completed, then the world's tallest dam  [first, slider]
   - Block D line 159: 1980 | Nurek Dam completed, then the world's tallest dam | Tajikistan
459. **1985** Tancredo Neves Bridge links Foz do Iguacu and Puerto Iguazu  [first, slider]
   - Block D line 160: 1985 | Tancredo Neves Bridge links Foz do Iguacu and Puerto Iguazu | Brazil, Argentina
460. **1986** ICJ fixes the disputed Burkina Faso-Mali frontier  [first, slider]
   - Block D line 161: 1986 | ICJ fixes the disputed Burkina Faso-Mali frontier | Burkina Faso, Mali
461. **1987** Fiji declared a republic  [first, slider]
   - Block D line 162: 1987 | Fiji declared a republic | Fiji
462. **1988** Brazil's new constitution creates the state of Tocantins  [first, slider]
   - Block D line 163: 1988 | Brazil's new constitution creates the state of Tocantins | Brazil
463. **1989** Palikir replaces Kolonia as capital of Micronesia  [first, slider]
   - Block D line 164: 1989 | Palikir replaces Kolonia as capital of Micronesia | Micronesia
   - Block A: Micronesia | 1986 | US-administered UN trust territory | none | Kolonia to Palikir (1989)
464. **1994** Arbitral award gives Laguna del Desierto to Argentina  [first, slider]
   - Block D line 165: 1994 | Arbitral award gives Laguna del Desierto to Argentina | Argentina, Chile
465. **1994** ICJ awards the Aouzou Strip to Chad; Libya withdraws  [first, slider]
   - Block D line 166: 1994 | ICJ awards the Aouzou Strip to Chad; Libya withdraws | Chad, Libya
466. **1994** Kazakhstan and China sign their border agreement  [first, slider]
   - Block D line 167: 1994 | Kazakhstan and China sign their border agreement | Kazakhstan, China
467. **1994** South Africa replaces its four provinces with nine  [first, slider]
   - Block D line 168: 1994 | South Africa replaces its four provinces with nine | South Africa
468. **1997** Western Samoa renamed Samoa  [first, slider]
   - Block D line 169: 1997 | Western Samoa renamed Samoa | Samoa
   - Block A: Samoa | 1962 | New Zealand (UN trust territory) | German Samoa (1900-1914); Western Samoa (to 1997) | none
469. **1999** ICJ rules Kasikili/Sedudu island belongs to Botswana  [first, slider]
   - Block D line 170: 1999 | ICJ rules Kasikili/Sedudu island belongs to Botswana | Botswana, Namibia
470. **2000** India creates Chhattisgarh, Uttaranchal and Jharkhand states  [first, slider]
   - Block D line 171: 2000 | India creates Chhattisgarh, Uttaranchal and Jharkhand states | India
471. **2000** Treaty of Jeddah fixes the Saudi Arabia-Yemen border  [first, slider]
   - Block D line 172: 2000 | Treaty of Jeddah fixes the Saudi Arabia-Yemen border | Saudi Arabia, Yemen
472. **2001** ICJ gives Hawar Islands to Bahrain and Zubarah to Qatar  [first, slider]
   - Block D line 173: 2001 | ICJ gives Hawar Islands to Bahrain and Zubarah to Qatar | Bahrain, Qatar
473. **2001** Kazakhstan and Kyrgyzstan sign their border treaty  [first, slider]
   - Block D line 174: 2001 | Kazakhstan and Kyrgyzstan sign their border treaty | Kazakhstan, Kyrgyzstan
474. **2001** Kazakhstan and Turkmenistan sign their border treaty  [first, slider]
   - Block D line 175: 2001 | Kazakhstan and Turkmenistan sign their border treaty | Kazakhstan, Turkmenistan
475. **2001** Newfoundland renamed Newfoundland and Labrador  [first, slider]
   - Block D line 176: 2001 | Newfoundland renamed Newfoundland and Labrador | Canada
476. **2002** ICJ awards Ligitan and Sipadan islands to Malaysia  [first, slider]
   - Block D line 177: 2002 | ICJ awards Ligitan and Sipadan islands to Malaysia | Malaysia, Indonesia
477. **2002** Japan-Palau Friendship Bridge links Koror and Babeldaob  [first, slider]
   - Block D line 178: 2002 | Japan-Palau Friendship Bridge links Koror and Babeldaob | Palau
478. **2002** Kazakhstan and China complete border demarcation  [first, slider]
   - Block D line 179: 2002 | Kazakhstan and China complete border demarcation | Kazakhstan, China
479. **2003** Kazakhstan-Uzbekistan border treaties enter into force  [first, slider]
   - Block D line 180: 2003 | Kazakhstan-Uzbekistan border treaties enter into force | Kazakhstan, Uzbekistan
480. **2003** South Africa's Northern Province is renamed Limpopo  [first, slider]
   - Block D line 181: 2003 | South Africa's Northern Province is renamed Limpopo | South Africa
481. **2004** Australia and New Zealand sign a maritime boundary treaty  [first, slider]
   - Block D line 182: 2004 | Australia and New Zealand sign a maritime boundary treaty | Australia, New Zealand
482. **2004** Iran splits Khorasan into three provinces  [first, slider]
   - Block D line 183: 2004 | Iran splits Khorasan into three provinces | Iran
483. **2004** Rio-Antirrio Bridge opens across the Gulf of Corinth  [first, slider]
   - Block D line 184: 2004 | Rio-Antirrio Bridge opens across the Gulf of Corinth | Greece
484. **2005** ICJ splits Niger River islands, giving Lete to Niger  [first, slider]
   - Block D line 185: 2005 | ICJ splits Niger River islands, giving Lete to Niger | Benin, Niger
485. **2005** Kazakhstan and Russia sign their border treaty  [first, slider]
   - Block D line 186: 2005 | Kazakhstan and Russia sign their border treaty | Kazakhstan, Russia
486. **2005** Kokaral Dike completed, separating the North Aral Sea  [first, slider]
   - Block D line 187: 2005 | Kokaral Dike completed, separating the North Aral Sea | Kazakhstan
487. **2005** Perm Oblast and Komi-Permyak merge into Perm Krai  [first, slider]
   - Block D line 188: 2005 | Perm Oblast and Komi-Permyak merge into Perm Krai | Russia
488. **2006** Micronesia and Marshall Islands sign a maritime boundary treaty  [first, slider]
   - Block D line 189: 2006 | Micronesia and Marshall Islands sign a maritime boundary treaty | Micronesia, Marshall Islands
489. **2007** Chile creates Arica y Parinacota and Los Rios regions  [first, slider]
   - Block D line 190: 2007 | Chile creates Arica y Parinacota and Los Rios regions | Chile
490. **2007** Denmark replaces its 13 counties with five regions  [first, slider]
   - Block D line 191: 2007 | Denmark replaces its 13 counties with five regions | Denmark
491. **2007** Lotschberg Base Tunnel opens under the Bernese Alps  [first, slider]
   - Block D line 192: 2007 | Lotschberg Base Tunnel opens under the Bernese Alps | Switzerland
492. **2007** Saint Barthelemy and Saint Martin separate from Guadeloupe  [first, slider]
   - Block D line 193: 2007 | Saint Barthelemy and Saint Martin separate from Guadeloupe | France
493. **2008** Ha Tay province is merged into Hanoi  [first, slider]
   - Block D line 194: 2008 | Ha Tay province is merged into Hanoi | Viet Nam
494. **2008** ICJ awards Pedra Branca to Singapore  [first, slider]
   - Block D line 195: 2008 | ICJ awards Pedra Branca to Singapore | Singapore, Malaysia
495. **2008** Nepal abolishes its monarchy and becomes a republic  [first, slider]
   - Block D line 196: 2008 | Nepal abolishes its monarchy and becomes a republic | Nepal
496. **2009** ICJ sets the Romania-Ukraine boundary in the Black Sea  [first, slider]
   - Block D line 197: 2009 | ICJ sets the Romania-Ukraine boundary in the Black Sea | Romania, Ukraine
497. **2009** Merowe Dam on the Nile is inaugurated  [first, slider]
   - Block D line 198: 2009 | Merowe Dam on the Nile is inaugurated | Sudan
498. **2009** Takutu River Bridge opens between Guyana and Brazil  [first, slider]
   - Block D line 199: 2009 | Takutu River Bridge opens between Guyana and Brazil | Guyana, Brazil
499. **2010** North-West Frontier Province renamed Khyber Pakhtunkhwa  [first, slider]
   - Block D line 200: 2010 | North-West Frontier Province renamed Khyber Pakhtunkhwa | Pakistan
500. **2010** Norway and Russia sign Barents Sea boundary treaty  [first, slider]
   - Block D line 201: 2010 | Norway and Russia sign Barents Sea boundary treaty | Norway, Russia
501. **2011** Bueng Kan province split from Nong Khai  [first, slider]
   - Block D line 202: 2011 | Bueng Kan province split from Nong Khai | Thailand
502. **2011** Indian state of Orissa renamed Odisha  [first, slider]
   - Block D line 203: 2011 | Indian state of Orissa renamed Odisha | India
503. **2011** Interoceanic Highway between Brazil and Peru is inaugurated  [first, slider]
   - Block D line 204: 2011 | Interoceanic Highway between Brazil and Peru is inaugurated | Brazil, Peru
504. **2011** Tajikistan ratifies ceding about 1,000 sq km of Pamirs to China  [first, slider]
   - Block D line 205: 2011 | Tajikistan ratifies ceding about 1,000 sq km of Pamirs to China | Tajikistan, China
505. **2012** Sejong becomes a special self-governing city  [first, slider]
   - Block D line 206: 2012 | Sejong becomes a special self-governing city | South Korea
506. **2012** Seven Pacific states sign maritime boundary treaties at Rarotonga  [first, slider]
   - Block D line 207: 2012 | Seven Pacific states sign maritime boundary treaties at Rarotonga | Kiribati, Tuvalu, Nauru, Marshall Islands, New Zealand
507. **2013** Cape Verde asks to be known officially as Cabo Verde  [first, slider]
   - Block D line 208: 2013 | Cape Verde asks to be known officially as Cabo Verde | Cabo Verde
508. **2013** ICJ fixes the Burkina Faso-Niger frontier  [first, slider]
   - Block D line 209: 2013 | ICJ fixes the Burkina Faso-Niger frontier | Burkina Faso, Niger
509. **2013** Marmaray rail tunnel under the Bosphorus opens  [first, slider]
   - Block D line 210: 2013 | Marmaray rail tunnel under the Bosphorus opens | Turkiye
510. **2013** Namibia renames the Caprivi Region the Zambezi Region  [first, slider]
   - Block D line 211: 2013 | Namibia renames the Caprivi Region the Zambezi Region | Namibia
511. **2014** ICJ sets the Peru-Chile maritime boundary  [first, slider]
   - Block D line 212: 2014 | ICJ sets the Peru-Chile maritime boundary | Peru, Chile
512. **2014** Telangana becomes a state, split from Andhra Pradesh  [first, slider]
   - Block D line 213: 2014 | Telangana becomes a state, split from Andhra Pradesh | India
513. **2015** Egypt opens the New Suez Canal parallel channel  [first, slider]
   - Block D line 214: 2015 | Egypt opens the New Suez Canal parallel channel | Egypt
514. **2016** Federal District renamed Mexico City (CDMX)  [first, slider]
   - Block D line 215: 2016 | Federal District renamed Mexico City (CDMX) | Mexico
515. **2016** France's 13 merged metropolitan regions take effect  [first, slider]
   - Block D line 216: 2016 | France's 13 merged metropolitan regions take effect | France
516. **2016** Gotthard Base Tunnel opens under the Alps  [first, slider]
   - Block D line 217: 2016 | Gotthard Base Tunnel opens under the Alps | Switzerland
517. **2017** Oyapock River Bridge opens between Brazil and French Guiana  [first, slider]
   - Block D line 218: 2017 | Oyapock River Bridge opens between Brazil and French Guiana | Brazil, France
518. **2018** Australia and Timor-Leste sign first Timor Sea maritime boundary  [first, slider]
   - Block D line 219: 2018 | Australia and Timor-Leste sign first Timor Sea maritime boundary | Australia, Timor-Leste
519. **2018** Chile's Nuble Region takes effect, split from Biobio  [first, slider]
   - Block D line 220: 2018 | Chile's Nuble Region takes effect, split from Biobio | Chile
520. **2018** Hong Kong-Zhuhai-Macau Bridge opens  [first, slider]
   - Block D line 221: 2018 | Hong Kong-Zhuhai-Macau Bridge opens | China
521. **2018** Maputo-Katembe bridge opens across Maputo Bay  [first, slider]
   - Block D line 222: 2018 | Maputo-Katembe bridge opens across Maputo Bay | Mozambique
522. **2018** Shymkent split off; South Kazakhstan renamed Turkistan Region  [first, slider]
   - Block D line 223: 2018 | Shymkent split off; South Kazakhstan renamed Turkistan Region | Kazakhstan
523. **2018** Tribal areas (FATA) merged into Khyber Pakhtunkhwa  [first, slider]
   - Block D line 224: 2018 | Tribal areas (FATA) merged into Khyber Pakhtunkhwa | Pakistan
524. **2019** Atlantic Bridge opens over the Panama Canal  [first, slider]
   - Block D line 225: 2019 | Atlantic Bridge opens over the Panama Canal | Panama
525. **2019** Bangsamoro autonomous region replaces the ARMM  [first, slider]
   - Block D line 226: 2019 | Bangsamoro autonomous region replaces the ARMM | Philippines
526. **2019** Senegambia Bridge opens over the River Gambia  [first, slider]
   - Block D line 227: 2019 | Senegambia Bridge opens over the River Gambia | Gambia, Senegal
527. **2020** Dadra and Nagar Haveli and Daman and Diu merge  [first, slider]
   - Block D line 228: 2020 | Dadra and Nagar Haveli and Daman and Diu merge | India
528. **2020** Norway merges its 19 counties into 11  [first, slider]
   - Block D line 229: 2020 | Norway merges its 19 counties into 11 | Norway
529. **2021** Barbados becomes a republic  [first, slider]
   - Block D line 230: 2021 | Barbados becomes a republic | Barbados
530. **2021** Kazungula Bridge opens over the Zambezi  [first, slider]
   - Block D line 231: 2021 | Kazungula Bridge opens over the Zambezi | Zambia, Botswana
531. **2022** 1915 Canakkale Bridge opens over the Dardanelles  [first, slider]
   - Block D line 232: 2022 | 1915 Canakkale Bridge opens over the Dardanelles | Turkiye
532. **2022** Fiji and Solomon Islands sign maritime boundary agreement  [first, slider]
   - Block D line 233: 2022 | Fiji and Solomon Islands sign maritime boundary agreement | Fiji, Solomon Islands
533. **2022** Kazakhstan creates Abai, Jetisu and Ulytau regions  [first, slider]
   - Block D line 234: 2022 | Kazakhstan creates Abai, Jetisu and Ulytau regions | Kazakhstan
534. **2022** Padma Bridge opens over the Padma River  [first, slider]
   - Block D line 235: 2022 | Padma Bridge opens over the Padma River | Bangladesh
535. **2023** Kyrgyzstan-Uzbekistan border treaty ratifications exchanged  [first, slider]
   - Block D line 236: 2023 | Kyrgyzstan-Uzbekistan border treaty ratifications exchanged | Kyrgyzstan, Uzbekistan
536. **2025** Grand Ethiopian Renaissance Dam on the Blue Nile is inaugurated  [first, slider]
   - Block D line 237: 2025 | Grand Ethiopian Renaissance Dam on the Blue Nile is inaugurated | Ethiopia
537. **2025** Kyrgyzstan and Tajikistan sign their border treaty  [first, slider]
   - Block D line 238: 2025 | Kyrgyzstan and Tajikistan sign their border treaty | Kyrgyzstan, Tajikistan
538. **2025** Treaty fixes the Kyrgyzstan-Tajikistan-Uzbekistan border tripoint  [first, slider]
   - Block D line 239: 2025 | Treaty fixes the Kyrgyzstan-Tajikistan-Uzbekistan border tripoint | Kyrgyzstan, Tajikistan, Uzbekistan
539. **2025** Viet Nam merges its 63 provinces and cities into 34  [first, slider]
   - Block D line 240: 2025 | Viet Nam merges its 63 provinces and cities into 34 | Viet Nam
540. **1981** Antigua and Barbuda becomes independent from the United Kingdom  [first, slider]
   - Block A: Antigua and Barbuda | 1981 | United Kingdom | none | none
541. **1918** Austria becomes independent on the dissolution of Austria-Hungary  [first (20-year gap)]
   - Block A: Austria | 1918 | Austria-Hungary (dissolution) | German-Austria (1918-1919) | none
542. **1973** The Bahamas becomes independent from the United Kingdom  [first, slider]
   - Block A: Bahamas | 1973 | United Kingdom | none | none
543. **1971** Bahrain becomes independent from the United Kingdom  [first, slider]
   - Block A: Bahrain | 1971 | United Kingdom (protectorate) | none | none
544. **1960** Benin becomes independent from France  [first, slider]
   - Block A: Benin | 1960 | France | Dahomey (to 1975) | none
545. **1992** Bosnia and Herzegovina becomes independent from Yugoslavia  [first, slider]
   - Block A: Bosnia and Herzegovina | 1992 | Yugoslavia | none | none
546. **1953** Cambodia becomes independent from France  [first, slider]
   - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
547. **1960** The Central African Republic becomes independent from France  [first, slider]
   - Block A: Central African Republic | 1960 | France | Ubangi-Shari (to 1958); Central African Empire (1976-1979) | none
548. **1975** The Comoros becomes independent from France  [first, slider]
   - Block A: Comoros | 1975 | France | none | Dzaoudzi to Moroni (1958)
549. **1991** Croatia becomes independent from Yugoslavia  [first, slider]
   - Block A: Croatia | 1991 | Yugoslavia | none | none
550. **1960** Cyprus becomes independent from the United Kingdom  [first, slider]
   - Block A: Cyprus | 1960 | United Kingdom | none | none
551. **1978** Dominica becomes independent from the United Kingdom  [first, slider]
   - Block A: Dominica | 1978 | United Kingdom | none | none
552. **1918** Estonia becomes independent from the Russian Empire  [first (20-year gap)]
   - Block A: Estonia | 1918 | Russian Empire (restored 1991 from Soviet Union) | none | none
553. **1974** Grenada becomes independent from the United Kingdom  [first, slider]
   - Block A: Grenada | 1974 | United Kingdom | none | none
554. **1973** Guinea-Bissau becomes independent from Portugal  [first (20-year gap)]
   - Block A: Guinea-Bissau | 1973 | Portugal | Portuguese Guinea (to 1974) | Bolama to Bissau (1941)
555. **1945** Indonesia becomes independent from the Netherlands  [first (20-year gap)]
   - Block A: Indonesia | 1945 | Netherlands | Dutch East Indies (to 1949) | none
556. **1961** Kuwait becomes independent from the United Kingdom  [first, slider]
   - Block A: Kuwait | 1961 | United Kingdom (protectorate) | none | none
557. **1953** Laos becomes independent from France  [first, slider]
   - Block A: Laos | 1953 | France | none | none
558. **1918** Latvia becomes independent from the Russian Empire  [first (20-year gap)]
   - Block A: Latvia | 1918 | Russian Empire (restored 1991 from Soviet Union) | none | none
559. **1806** Liechtenstein is formed as a sovereign state  [first, slider]
   - Block A: Liechtenstein | 1806 | Holy Roman Empire (dissolution) | none | none
560. **1918** Lithuania becomes independent from the Russian Empire  [first (20-year gap)]
   - Block A: Lithuania | 1918 | Russian Empire (restored 1990 from Soviet Union) | none | don't ask
561. **1965** The Maldives becomes independent from the United Kingdom  [first, slider]
   - Block A: Maldives | 1965 | United Kingdom (protectorate) | none | none
562. **1960** Mali becomes independent from France  [first, slider]
   - Block A: Mali | 1960 | France (via the Mali Federation) | French Sudan (to 1958) | none
563. **1986** The Marshall Islands becomes independent from the United States  [first (20-year gap)]
   - Block A: Marshall Islands | 1986 | US-administered UN trust territory | none | none
564. **1968** Mauritius becomes independent from the United Kingdom  [first, slider]
   - Block A: Mauritius | 1968 | United Kingdom | Isle de France (to 1810) | none
565. **1986** Micronesia becomes independent from the United States  [first (20-year gap)]
   - Block A: Micronesia | 1986 | US-administered UN trust territory | none | Kolonia to Palikir (1989)
566. **1960** Niger becomes independent from France  [first, slider]
   - Block A: Niger | 1960 | France | none | don't ask
567. **1948** The state of North Korea is founded  [first (20-year gap)]
   - Block A: North Korea | 1948 | Japanese rule ended 1945, state founded 1948 | none | none
568. **1991** North Macedonia becomes independent from Yugoslavia  [first, slider]
   - Block A: North Macedonia | 1991 | Yugoslavia | Macedonia (1991-2019) | none
569. **1811** Paraguay becomes independent from Spain  [first, slider]
   - Block A: Paraguay | 1811 | Spain | none | none
570. **1918** Poland becomes independent from the partitioning powers (Russia, Prussia, Austria)  [first, slider]
   - Block A: Poland | 1918 | partitioning powers (Russia, Prussia, Austria) | none | none
571. **1971** Qatar becomes independent from the United Kingdom  [first, slider]
   - Block A: Qatar | 1971 | United Kingdom (protectorate) | none | none
572. **1960** The Republic of the Congo becomes independent from France  [first, slider]
   - Block A: Republic of the Congo | 1960 | France | Middle Congo (to 1958) | none
573. **1877** Romania becomes independent from the Ottoman Empire  [first (20-year gap)]
   - Block A: Romania | 1877 | Ottoman Empire | none | none
574. **1983** Saint Kitts and Nevis becomes independent from the United Kingdom  [first, slider]
   - Block A: Saint Kitts and Nevis | 1983 | United Kingdom | none | none
575. **1979** Saint Lucia becomes independent from the United Kingdom  [first, slider]
   - Block A: Saint Lucia | 1979 | United Kingdom | none | none
576. **1979** Saint Vincent and the Grenadines becomes independent from the United Kingdom  [first, slider]
   - Block A: Saint Vincent and the Grenadines | 1979 | United Kingdom | none | none
577. **1960** Senegal becomes independent from France  [first, slider]
   - Block A: Senegal | 1960 | France (via the Mali Federation) | none | don't ask
578. **1991** Slovenia becomes independent from Yugoslavia  [first, slider]
   - Block A: Slovenia | 1991 | Yugoslavia | none | none
579. **1948** The state of South Korea is founded  [first (20-year gap)]
   - Block A: South Korea | 1948 | Japanese rule ended 1945, state founded 1948 | none | none
580. **1848** The Swiss federal state is formed  [first, slider]
   - Block A: Switzerland | 1848 | federal state formed | none | don't ask
581. **1946** Syria becomes independent from France  [first, slider]
   - Block A: Syria | 1946 | France (mandate) | none | none
582. **1962** Trinidad and Tobago becomes independent from the United Kingdom  [first, slider]
   - Block A: Trinidad and Tobago | 1962 | United Kingdom | none | none
583. **1923** The Republic of Turkiye is founded as successor to the Ottoman Empire  [first, slider]
   - Block A: Turkiye | 1923 | Ottoman Empire (successor republic) | none | Istanbul to Ankara (1923)
584. **1776** The United States becomes independent from Great Britain  [not asked]
   - Block A: United States | 1776 | Great Britain | none | Philadelphia to Washington (1800)
585. **1920** The capital of Albania moves from Durres to Tirana  [first, slider]
   - Block A: Albania | 1912 | Ottoman Empire | none | Durres to Tirana (1920)
586. **1961** The capital of Bhutan moves from Punakha to Thimphu  [first, slider]
   - Block A: Bhutan | don't ask | never colonised | none | Punakha to Thimphu (1961)
587. **1879** The capital of Bulgaria moves from Tarnovo to Sofia  [first, slider]
   - Block A: Bulgaria | 1908 | Ottoman Empire | none | Tarnovo to Sofia (1879)
588. **1928** The capital of China moves from Beijing to Nanjing  [first, slider]
   - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
589. **1949** The capital of China moves from Nanjing to Beijing  [first, slider]
   - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
590. **1958** The capital of the Comoros moves from Dzaoudzi to Moroni  [first, slider]
   - Block A: Comoros | 1975 | France | none | Dzaoudzi to Moroni (1958)
591. **1823** The capital of Costa Rica moves from Cartago to San Jose  [first, slider]
   - Block A: Costa Rica | 1821 | Spain | none | Cartago to San Jose (1823)
592. **1894** The capital of Djibouti moves from Obock to Djibouti  [first, slider]
   - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
593. **1897** The capital of Eritrea moves from Massawa to Asmara  [first, slider]
   - Block A: Eritrea | 1993 | Ethiopia | none | Massawa to Asmara (1897)
594. **1902** The capital of Eswatini moves from Bremersdorp to Mbabane  [first, slider]
   - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
595. **1882** The capital of Fiji moves from Levuka to Suva  [first, slider]
   - Block A: Fiji | 1970 | United Kingdom | none | Levuka to Suva (1882)
596. **1812** The capital of Finland moves from Turku to Helsinki  [first, slider]
   - Block A: Finland | 1917 | Russia | none | Turku to Helsinki (1812)
597. **1990** The capital of Germany moves from Bonn to Berlin  [not asked]
   - Block A: Germany | don't ask | unification 1871, refounded 1949, reunified 1990 | West Germany (1949-1990) | Bonn to Berlin (1990)
598. **1877** The capital of Ghana moves from Cape Coast to Accra  [first, slider]
   - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
599. **1880** The capital of Honduras moves from Comayagua to Tegucigalpa  [first, slider]
   - Block A: Honduras | 1821 | Spain | none | Comayagua to Tegucigalpa (1880)
600. **1911** The capital of India moves from Calcutta to Delhi  [first, slider]
   - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
601. **1931** The capital of India moves from Delhi to New Delhi  [first, slider]
   - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
602. **1865** The capital of Italy moves from Turin to Florence  [first, slider]
   - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
603. **1872** The capital of Jamaica moves from Spanish Town to Kingston  [first, slider]
   - Block A: Jamaica | 1962 | United Kingdom | none | Spanish Town to Kingston (1872)
604. **(no year)** The capital of Japan moves from Kyoto to Tokyo  [not asked]
   - Block A: Japan | don't ask | never colonised | none | Kyoto to Tokyo (1868-1869)
605. **1907** The capital of Kenya moves from Mombasa to Nairobi  [not asked]
   - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
606. **1946** The capital of Montenegro moves from Cetinje to Podgorica  [first, slider]
   - Block A: Montenegro | 2006 | Serbia and Montenegro | none | Cetinje to Podgorica (1946)
607. **1912** The capital of Morocco moves from Fez to Rabat  [first, slider]
   - Block A: Morocco | 1956 | France and Spain (protectorates) | none | Fez to Rabat (1912)
608. **1898** The capital of Mozambique moves from Island of Mozambique to Lourenco Marques  [first, slider]
   - Block A: Mozambique | 1975 | Portugal | none | Island of Mozambique to Lourenco Marques (1898)
609. **1959** The capital of Pakistan moves from Karachi to Rawalpindi  [first, slider]
   - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
610. **1967** The capital of Pakistan moves from Rawalpindi to Islamabad  [first, slider]
   - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
611. **1948** The capital of the Philippines moves from Manila to Quezon City  [first, slider]
   - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
612. **1976** The capital of the Philippines moves from Quezon City to Manila  [first, slider]
   - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
613. **1808** The capital of Portugal moves from Lisbon to Rio de Janeiro  [first, slider]
   - Block A: Portugal | don't ask | ancient kingdom | none | Lisbon to Rio de Janeiro (1808)
614. **1841** The capital of Serbia moves from Kragujevac to Belgrade  [first, slider]
   - Block A: Serbia | 1878 | Ottoman Empire | none | Kragujevac to Belgrade (1841)
615. **1982** The capital of Sri Lanka moves from Colombo to Sri Jayawardenepura Kotte  [first, slider]
   - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
616. **1996** The capital of Tanzania moves from Dar es Salaam to Dodoma  [not asked]
   - Block A: Tanzania | 1964 | union of Tanganyika and Zanzibar | Tanganyika (to 1964) | Dar es Salaam to Dodoma (1996)
617. **1934** The capital of Ukraine moves from Kharkiv to Kyiv  [first, slider]
   - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
618. **1945** The capital of Viet Nam moves from Hue to Hanoi  [first, slider]
   - Block A: Viet Nam | 1976 | reunification of North and South | Dai Nam (1839-1945) | Hue to Hanoi (1945)
619. **1920** The name Byelorussia comes into use for today's Belarus  [first, slider]
   - Block A: Belarus | 1991 | Soviet Union (dissolution) | Byelorussia (1920-1991) | none
620. **1970** The name Khmer Republic comes into use for today's Cambodia  [first, slider]
   - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
621. **1975** The name Khmer Republic stops being used for today's Cambodia  [first, slider]
   - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
622. **1976** The name Kampuchea comes into use for today's Cambodia  [first, slider]
   - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
623. **1989** The name Kampuchea stops being used for today's Cambodia  [first, slider]
   - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
624. **1841** The name Province of Canada comes into use for today's Canada  [first, slider]
   - Block A: Canada | 1867 | United Kingdom (confederation, not independence) | Province of Canada (1841-1867) | none
625. **1976** The name Central African Empire comes into use for today's Central African Republic  [first, slider]
   - Block A: Central African Republic | 1960 | France | Ubangi-Shari (to 1958); Central African Empire (1976-1979) | none
626. **1979** The name Central African Empire stops being used for today's Central African Republic  [first, slider]
   - Block A: Central African Republic | 1960 | France | Ubangi-Shari (to 1958); Central African Empire (1976-1979) | none
627. **1967** The name Afars and Issas comes into use for today's Djibouti  [first, slider]
   - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
628. **1821** The name Santo Domingo stops being used for today's Dominican Republic  [first, slider]
   - Block A: Dominican Republic | 1844 | Haiti | Santo Domingo (to 1821) | none
629. **1831** The name British Guiana comes into use for today's Guyana  [first, slider]
   - Block A: Guyana | 1966 | United Kingdom | British Guiana (1831-1966) | none
630. **1921** The name Mesopotamia stops being used for today's Iraq  [first, slider]
   - Block A: Iraq | 1932 | United Kingdom (mandate) | Mesopotamia (to 1921) | none
631. **1921** The name Transjordan comes into use for today's Jordan  [first, slider]
   - Block A: Jordan | 1946 | United Kingdom (mandate) | Transjordan (1921-1949) | none
632. **1949** The name Transjordan stops being used for today's Jordan  [first, slider]
   - Block A: Jordan | 1946 | United Kingdom (mandate) | Transjordan (1921-1949) | none
633. **1920** The name Greater Lebanon comes into use for today's Lebanon  [first, slider]
   - Block A: Lebanon | 1943 | France (mandate) | Greater Lebanon (1920-1926) | none
634. **1926** The name Greater Lebanon stops being used for today's Lebanon  [first, slider]
   - Block A: Lebanon | 1943 | France (mandate) | Greater Lebanon (1920-1926) | none
635. **1907** The name Nyasaland comes into use for today's Malawi  [first, slider]
   - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
636. **1958** The name French Sudan stops being used for today's Mali  [first, slider]
   - Block A: Mali | 1960 | France (via the Mali Federation) | French Sudan (to 1958) | none
637. **1810** The name Isle de France stops being used for today's Mauritius  [first, slider]
   - Block A: Mauritius | 1968 | United Kingdom | Isle de France (to 1810) | none
638. **1940** The name Moldavia comes into use for today's Moldova  [first, slider]
   - Block A: Moldova | 1991 | Soviet Union (dissolution) | Moldavia (1940-1991) | none
639. **1911** The name Outer Mongolia stops being used for today's Mongolia  [first, slider]
   - Block A: Mongolia | don't ask | Qing China, then Republic of China | Outer Mongolia (to 1911) | none
640. **1915** The name German South West Africa stops being used for today's Namibia  [first, slider]
   - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
641. **1856** The name Muscat and Oman comes into use for today's Oman  [first, slider]
   - Block A: Oman | don't ask | never colonised | Muscat and Oman (1856-1970) | don't ask
642. **1970** The name Muscat and Oman stops being used for today's Oman  [first, slider]
   - Block A: Oman | don't ask | never colonised | Muscat and Oman (1856-1970) | don't ask
643. **1971** The name Papua and New Guinea stops being used for today's Papua New Guinea  [first, slider]
   - Block A: Papua New Guinea | 1975 | Australia | Papua and New Guinea (1949-1971) | none
644. **1958** The name Middle Congo stops being used for today's Republic of the Congo  [first, slider]
   - Block A: Republic of the Congo | 1960 | France | Middle Congo (to 1958) | none
645. **1917** The name Russian SFSR comes into use for today's Russia  [first, slider]
   - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
646. **1991** The name Russian SFSR stops being used for today's Russia  [first, slider]
   - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
647. **1900** The name German Samoa comes into use for today's Samoa  [first, slider]
   - Block A: Samoa | 1962 | New Zealand (UN trust territory) | German Samoa (1900-1914); Western Samoa (to 1997) | none
648. **1942** The name Syonan-to comes into use for today's Singapore  [first, slider]
   - Block A: Singapore | 1965 | Malaysia | Syonan-to (1942-1945) | none
649. **1945** The name Syonan-to stops being used for today's Singapore  [first, slider]
   - Block A: Singapore | 1965 | Malaysia | Syonan-to (1942-1945) | none
650. **1975** The name British Solomon Islands stops being used for today's Solomon Islands  [first, slider]
   - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
651. **1954** The name Dutch Guiana stops being used for today's Suriname  [first, slider]
   - Block A: Suriname | 1975 | Netherlands | Dutch Guiana (to 1954) | none
652. **1945** The name Siam comes back into use for today's Thailand  [first, slider]
   - Block A: Thailand | don't ask | never colonised | Siam (to 1939; 1945-1949) | none
653. **1949** The name Siam stops being used for today's Thailand  [first, slider]
   - Block A: Thailand | don't ask | never colonised | Siam (to 1939; 1945-1949) | none
654. **1916** The name French Togoland comes into use for today's Togo  [first, slider]
   - Block A: Togo | 1960 | France | French Togoland (1916-1960) | none
655. **1919** The name Ukrainian SSR comes into use for today's Ukraine  [first, slider]
   - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
656. **1911** The name Northern Rhodesia comes into use for today's Zambia  [first, slider]
   - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
657. **1970** Brunei Town, Brunei, is renamed Bandar Seri Begawan  [first, slider]
   - Block C line 2: Bandar Seri Begawan | Brunei | Brunei Town | 1970 | renamed to honour Sultan Omar Ali Saifuddien III
658. **1973** Bathurst, Gambia, is renamed Banjul  [first, slider]
   - Block C line 3: Banjul | Gambia | Bathurst | 1973 | capital renamed after independence
659. **1991** Frunze, Kyrgyzstan, is renamed Bishkek  [first, slider]
   - Block C line 4: Bishkek | Kyrgyzstan | Frunze | 1991 | Soviet-era name dropped
660. **2000** Santa Fe de Bogota, Colombia, is renamed Bogota  [first, slider]
   - Block C line 5: Bogota | Colombia | Santa Fe de Bogota | 2000 | constitutional reform made the name just Bogota
661. **1919** Pressburg, Slovakia, is renamed Bratislava  [first, slider]
   - Block C line 6: Bratislava | Slovakia | Pressburg | 1919 | name Bratislava officially adopted
662. **1961** Stalinabad, Tajikistan, is renamed Dushanbe  [first, slider]
   - Block C line 7: Dushanbe | Tajikistan | Stalinabad | 1961 | renamed in de-Stalinization
663. **1969** Gaberones, Botswana, is renamed Gaborone  [first, slider]
   - Block C line 8: Gaborone | Botswana | Gaberones | 1969 | capital's name officially changed
664. **1812** Stabroek, Guyana, is renamed Georgetown  [first, slider]
   - Block C line 9: Georgetown | Guyana | Stabroek | 1812 | British renamed it for King George III
665. **1966** Leopoldville, Democratic Republic of the Congo, is renamed Kinshasa  [first, slider]
   - Block C line 11: Kinshasa | Democratic Republic of the Congo | Leopoldville | 1966 | capital renamed under Mobutu's Africanization drive
666. **1973** Santa Isabel, Equatorial Guinea, is renamed Malabo  [first, slider]
   - Block C line 12: Malabo | Equatorial Guinea | Santa Isabel | 1973 | European name replaced under Macias Nguema
667. **1976** Lourenco Marques, Mozambique, is renamed Maputo  [first, slider]
   - Block C line 13: Maputo | Mozambique | Lourenco Marques | 1976 | capital renamed after independence
668. **1973** Fort-Lamy, Chad, is renamed N'Djamena  [first, slider]
   - Block C line 14: N'Djamena | Chad | Fort-Lamy | 1973 | capital renamed by President Tombalbaye
669. **1855** Bytown, Canada, is renamed Ottawa  [first, slider]
   - Block C line 16: Ottawa | Canada | Bytown | 1855 | renamed Ottawa on gaining city status
670. **1992** Titograd, Montenegro, is renamed Podgorica  [first, slider]
   - Block C line 17: Podgorica | Montenegro | Titograd | 1992 | original name restored
671. **1961** Ciudad Trujillo, Dominican Republic, is renamed Santo Domingo  [first, slider]
   - Block C line 18: Santo Domingo | Dominican Republic | Ciudad Trujillo | 1961 | old name restored after the dictator's death
672. **1946** Gyeongseong, South Korea, is renamed Seoul  [first, slider]
   - Block C line 19: Seoul | South Korea | Gyeongseong | 1946 | US military government named it Seoul
673. **1936** Tiflis, Georgia, is renamed Tbilisi  [first, slider]
   - Block C line 20: Tbilisi | Georgia | Tiflis | 1936 | official Russian name changed to Tbilisi
674. **1924** Niislel Khuree, Mongolia, is renamed Ulaanbaatar  [first, slider]
   - Block C line 22: Ulaanbaatar | Mongolia | Niislel Khuree | 1924 | renamed at founding of People's Republic
675. **1990** Qyteti Stalin, Albania, is renamed Kucove  [first, slider]
   - Block C line 23: Kucove | Albania | Qyteti Stalin | 1990 | Stalin name dropped, old name back
676. **1962** Philippeville, Algeria, is renamed Skikda  [first, slider]
   - Block C line 24: Skikda | Algeria | Philippeville | 1962 | French name dropped at independence
677. **1975** Nova Lisboa, Angola, is renamed Huambo  [first, slider]
   - Block C line 25: Huambo | Angola | Nova Lisboa | 1975 | original name restored after independence
678. **1976** Salazar, Angola, is renamed N'dalatando  [first, slider]
   - Block C line 26: N'dalatando | Angola | Salazar | 1976 | original name restored after independence
679. **1955** Ciudad Eva Peron, Argentina, is renamed La Plata  [first, slider]
   - Block C line 27: La Plata | Argentina | Ciudad Eva Peron | 1955 | original name restored after Peron fell
680. **1933** Stuart, Australia, is renamed Alice Springs  [first, slider]
   - Block C line 28: Alice Springs | Australia | Stuart | 1933 | town gazetted under its waterhole name
681. **1891** Sandhurst, Australia, is renamed Bendigo  [first, slider]
   - Block C line 29: Bendigo | Australia | Sandhurst | 1891 | official name changed back to Bendigo
682. **1911** Palmerston, Australia, is renamed Darwin  [first, slider]
   - Block C line 30: Darwin | Australia | Palmerston | 1911 | town renamed after Charles Darwin
683. **1958** South Coast, Australia, is renamed Gold Coast  [first, slider]
   - Block C line 31: Gold Coast | Australia | South Coast | 1958 | Town of South Coast renamed Town of Gold Coast
684. **1935** Ambleside, Australia, is renamed Hahndorf  [first, slider]
   - Block C line 32: Hahndorf | Australia | Ambleside | 1935 | German name restored after WWI-era change
685. **1915** Germanton, Australia, is renamed Holbrook  [first, slider]
   - Block C line 33: Holbrook | Australia | Germanton | 1915 | German name dropped in WWI
686. **1989** Kirovabad, Azerbaijan, is renamed Ganja  [first, slider]
   - Block C line 34: Ganja | Azerbaijan | Kirovabad | 1989 | original name restored during perestroika
687. **2008** Ali Bayramli, Azerbaijan, is renamed Shirvan  [first, slider]
   - Block C line 35: Shirvan | Azerbaijan | Ali Bayramli | 2008 | Azerbaijan parliament renamed the city
688. **1930** Parahyba do Norte, Brazil, is renamed Joao Pessoa  [first, slider]
   - Block C line 36: Joao Pessoa | Brazil | Parahyba do Norte | 1930 | state capital renamed for a murdered governor
689. **1835** Vila Real da Praia Grande, Brazil, is renamed Nictheroy (now spelled Niteroi)  [first, slider]
   - Block C line 37: Niteroi | Brazil | Vila Real da Praia Grande | 1835 | renamed Nictheroy (now spelled Niteroi)
690. **1990** Tolbukhin, Bulgaria, is renamed Dobrich  [first, slider]
   - Block C line 38: Dobrich | Bulgaria | Tolbukhin | 1990 | old name restored by decree
691. **1956** Stalin, Bulgaria, is renamed Varna  [first, slider]
   - Block C line 39: Varna | Bulgaria | Stalin | 1956 | Stalin name dropped, old name back
692. **1962** Usumbura, Burundi, is renamed Bujumbura  [first, slider]
   - Block C line 40: Bujumbura | Burundi | Usumbura | 1962 | capital renamed at independence
693. **1982** Victoria, Cameroon, is renamed Limbe  [first, slider]
   - Block C line 41: Limbe | Cameroon | Victoria | 1982 | renamed by presidential decree
694. **1989** Eskimo Point, Canada, is renamed Arviat  [first, slider]
   - Block C line 42: Arviat | Canada | Eskimo Point | 1989 | English name replaced by Inuktitut name
695. **1987** Frobisher Bay, Canada, is renamed Iqaluit  [first, slider]
   - Block C line 43: Iqaluit | Canada | Frobisher Bay | 1987 | English name replaced by Inuktitut name
696. **1905** Rat Portage, Canada, is renamed Kenora  [first, slider]
   - Block C line 44: Kenora | Canada | Rat Portage | 1905 | new name built from Keewatin, Norman, Rat Portage
697. **1916** Berlin, Canada, is renamed Kitchener  [first, slider]
   - Block C line 45: Kitchener | Canada | Berlin | 1916 | German name dropped by referendum in WWI
698. **1996** Coppermine, Canada, is renamed Kugluktuk  [first, slider]
   - Block C line 46: Kugluktuk | Canada | Coppermine | 1996 | English name replaced by Inuinnaqtun name
699. **1980** Fort Chimo, Canada, is renamed Kuujjuaq  [first, slider]
   - Block C line 47: Kuujjuaq | Canada | Fort Chimo | 1980 | took the Inuit name of the Koksoak River
700. **1998** Broughton Island, Canada, is renamed Qikiqtarjuaq  [first, slider]
   - Block C line 48: Qikiqtarjuaq | Canada | Broughton Island | 1998 | English name replaced by Inuktitut name
701. **1882** Pile o' Bones, Canada, is renamed Regina  [first, slider]
   - Block C line 49: Regina | Canada | Pile o' Bones | 1882 | renamed Regina in honour of Queen Victoria
702. **1970** Fort William and Port Arthur, Canada, merge as Thunder Bay  [first, slider]
   - Block C line 50: Thunder Bay | Canada | Fort William and Port Arthur | 1970 | two cities merged into Thunder Bay
703. **1834** York, Canada, is renamed Toronto  [first, slider]
   - Block C line 51: Toronto | Canada | York | 1834 | incorporated as a city under the name Toronto
704. **1886** Granville, Canada, is renamed Vancouver  [first, slider]
   - Block C line 52: Vancouver | Canada | Granville | 1886 | renamed Vancouver on incorporation as a city
705. **1974** Crampel, Central African Republic, is renamed Kaga-Bandoro  [first, slider]
   - Block C line 53: Kaga-Bandoro | Central African Republic | Crampel | 1974 | colonial name (Fort-Crampel) replaced
706. **1972** Fort-Archambault, Chad, is renamed Sarh  [first, slider]
   - Block C line 54: Sarh | Chad | Fort-Archambault | 1972 | renamed in Tombalbaye's authenticite campaign
707. **2001** Zhongdian, China, is renamed Shangri-La  [first, slider]
   - Block C line 55: Shangri-La | China | Zhongdian | 2001 | county renamed after the novel's paradise
708. **1954** Dihua, China, is renamed Urumqi  [first, slider]
   - Block C line 56: Urumqi | China | Dihua | 1954 | name Urumqi restored by the government
709. **1994** Dayong, China, is renamed Zhangjiajie  [first, slider]
   - Block C line 57: Zhangjiajie | China | Dayong | 1994 | city renamed after its famous scenic area
710. **1990** Gottwaldov, Czechia, is renamed Zlin  [first, slider]
   - Block C line 58: Zlin | Czechia | Gottwaldov | 1990 | Gottwald name dropped, old name back
711. **1966** Banningville, Democratic Republic of the Congo, is renamed Bandundu  [first, slider]
   - Block C line 59: Bandundu | Democratic Republic of the Congo | Banningville | 1966 | Belgian colonial name dropped
712. **1966** Luluabourg, Democratic Republic of the Congo, is renamed Kananga  [first, slider]
   - Block C line 60: Kananga | Democratic Republic of the Congo | Luluabourg | 1966 | colonial name replaced under Mobutu
713. **1966** Stanleyville, Democratic Republic of the Congo, is renamed Kisangani  [first, slider]
   - Block C line 61: Kisangani | Democratic Republic of the Congo | Stanleyville | 1966 | colonial name replaced under authenticite policy
714. **1966** Jadotville, Democratic Republic of the Congo, is renamed Likasi  [first, slider]
   - Block C line 62: Likasi | Democratic Republic of the Congo | Jadotville | 1966 | Belgian colonial name dropped
715. **1966** Elisabethville, Democratic Republic of the Congo, is renamed Lubumbashi  [first, slider]
   - Block C line 63: Lubumbashi | Democratic Republic of the Congo | Elisabethville | 1966 | Belgian colonial name replaced under Mobutu
716. **1966** Coquilhatville, Democratic Republic of the Congo, is renamed Mbandaka  [first, slider]
   - Block C line 64: Mbandaka | Democratic Republic of the Congo | Coquilhatville | 1966 | renamed to honour a local leader
717. **1960** Bremersdorp, Eswatini, is renamed Manzini  [first, slider]
   - Block C line 65: Manzini | Eswatini | Bremersdorp | 1960 | original Swazi name restored
718. **2000** Nazret, Ethiopia, is renamed Adama  [first, slider]
   - Block C line 66: Adama | Ethiopia | Nazret | 2000 | Oromo name officially restored
719. **1866** Port-de-France, France, is renamed Noumea  [first, slider]
   - Block C line 67: Noumea | France | Port-de-France | 1866 | New Caledonia capital renamed Noumea
720. **1990** Karl-Marx-Stadt, Germany, is renamed Chemnitz  [first, slider]
   - Block C line 68: Chemnitz | Germany | Karl-Marx-Stadt | 1990 | historical name restored
721. **1961** Stalinstadt, Germany, is renamed Eisenhuttenstadt  [first, slider]
   - Block C line 69: Eisenhuttenstadt | Germany | Stalinstadt | 1961 | renamed during de-Stalinization
722. **1961** Sztalinvaros, Hungary, is renamed Dunaujvaros  [first, slider]
   - Block C line 70: Dunaujvaros | Hungary | Sztalinvaros | 1961 | Stalin name dropped, new name given
723. **2014** Bangalore, India, is renamed Bengaluru  [first, slider]
   - Block C line 71: Bengaluru | India | Bangalore | 2014 | officially renamed with 12 other Karnataka cities
724. **1996** Madras, India, is renamed Chennai  [first, slider]
   - Block C line 72: Chennai | India | Madras | 1996 | official name changed to the Tamil name
725. **2016** Gurgaon, India, is renamed Gurugram  [first, slider]
   - Block C line 73: Gurugram | India | Gurgaon | 2016 | Haryana renamed it with central approval
726. **1996** Cochin, India, is renamed Kochi  [first, slider]
   - Block C line 74: Kochi | India | Cochin | 1996 | reverted to its original Malayalam name
727. **2001** Calcutta, India, is renamed Kolkata  [first, slider]
   - Block C line 75: Kolkata | India | Calcutta | 2001 | official name changed to the Bengali form
728. **1995** Bombay, India, is renamed Mumbai  [first, slider]
   - Block C line 76: Mumbai | India | Bombay | 1995 | state government adopted the Marathi name
729. **2014** Mysore, India, is renamed Mysuru  [first, slider]
   - Block C line 77: Mysuru | India | Mysore | 2014 | officially renamed with other Karnataka cities
730. **2006** Pondicherry, India, is renamed Puducherry  [first, slider]
   - Block C line 78: Puducherry | India | Pondicherry | 2006 | territory and city renamed by Act of Parliament
731. **1991** Trivandrum, India, is renamed Thiruvananthapuram  [first, slider]
   - Block C line 79: Thiruvananthapuram | India | Trivandrum | 1991 | official name restored to the Malayalam name
732. **1974** Baroda, India, is renamed Vadodara  [first, slider]
   - Block C line 80: Vadodara | India | Baroda | 1974 | official name changed to the local name
733. **1963** Kutaraja, Indonesia, is renamed Banda Aceh  [first, slider]
   - Block C line 81: Banda Aceh | Indonesia | Kutaraja | 1963 | Indonesian ministry restored the name Banda Aceh
734. **1999** Ujung Pandang, Indonesia, is renamed Makassar  [first, slider]
   - Block C line 82: Makassar | Indonesia | Ujung Pandang | 1999 | name reverted to Makassar
735. **1979** Bandar Pahlavi, Iran, is renamed Bandar Anzali  [first, slider]
   - Block C line 83: Bandar Anzali | Iran | Bandar Pahlavi | 1979 | Pahlavi-era name dropped after the revolution
736. **1920** Queenstown, Ireland, is renamed Cobh  [first, slider]
   - Block C line 84: Cobh | Ireland | Queenstown | 1920 | Irish name adopted
737. **1920** Kingstown, Ireland, is renamed Dun Laoghaire  [first, slider]
   - Block C line 85: Dun Laoghaire | Ireland | Kingstown | 1920 | Irish name adopted
738. **1927** Girgenti, Italy, is renamed Agrigento  [first, slider]
   - Block C line 86: Agrigento | Italy | Girgenti | 1927 | Latin-based name adopted by decree
739. **1946** Littoria, Italy, is renamed Latina  [first, slider]
   - Block C line 87: Latina | Italy | Littoria | 1946 | Fascist-era name dropped
740. **1991** Shevchenko, Kazakhstan, is renamed Aktau  [first, slider]
   - Block C line 88: Aktau | Kazakhstan | Shevchenko | 1991 | original name restored at independence
741. **2022** Kapchagay, Kazakhstan, is renamed Konaev  [first, slider]
   - Block C line 89: Konaev | Kazakhstan | Kapchagay | 2022 | renamed after Soviet-era leader Dinmukhamed Kunaev
742. **2002** Leninogorsk, Kazakhstan, is renamed Ridder  [first, slider]
   - Block C line 90: Ridder | Kazakhstan | Leninogorsk | 2002 | original name restored
743. **2007** Semipalatinsk, Kazakhstan, is renamed Semey  [first, slider]
   - Block C line 91: Semey | Kazakhstan | Semipalatinsk | 2007 | city council voted for the Kazakh name
744. **1997** Zhambyl, Kazakhstan, is renamed Taraz  [first, slider]
   - Block C line 92: Taraz | Kazakhstan | Zhambyl | 1997 | ancient name Taraz restored
745. **1991** Przhevalsk, Kyrgyzstan, is renamed Karakol  [first, slider]
   - Block C line 93: Karakol | Kyrgyzstan | Przhevalsk | 1991 | original name restored at independence
746. **1967** Jesselton, Malaysia, is renamed Kota Kinabalu  [first, slider]
   - Block C line 94: Kota Kinabalu | Malaysia | Jesselton | 1967 | Sabah assembly renamed the capital
747. **1972** Port Swettenham, Malaysia, is renamed Port Klang  [first, slider]
   - Block C line 95: Port Klang | Malaysia | Port Swettenham | 1972 | colonial name replaced
748. **1960** Port-Etienne, Mauritania, is renamed Nouadhibou  [first, slider]
   - Block C line 96: Nouadhibou | Mauritania | Port-Etienne | 1960 | French name dropped after independence
749. **1888** Paso del Norte, Mexico, is renamed Ciudad Juarez  [first, slider]
   - Block C line 97: Ciudad Juarez | Mexico | Paso del Norte | 1888 | renamed in honour of Benito Juarez
750. **1928** Cajeme, Mexico, is renamed Ciudad Obregon  [first, slider]
   - Block C line 98: Ciudad Obregon | Mexico | Cajeme | 1928 | renamed after Alvaro Obregon's murder
751. **1825** Santa Maria de Aguayo, Mexico, is renamed Ciudad Victoria  [first, slider]
   - Block C line 99: Ciudad Victoria | Mexico | Santa Maria de Aguayo | 1825 | made a city and named for Guadalupe Victoria
752. **1936** Puerto Mexico, Mexico, is renamed Coatzacoalcos  [first, slider]
   - Block C line 100: Coatzacoalcos | Mexico | Puerto Mexico | 1936 | old name restored to the port city
753. **1828** Valladolid, Mexico, is renamed Morelia  [first, slider]
   - Block C line 101: Morelia | Mexico | Valladolid | 1828 | renamed for independence hero Morelos
754. **1911** Ciudad Porfirio Diaz, Mexico, is renamed Piedras Negras  [first, slider]
   - Block C line 102: Piedras Negras | Mexico | Ciudad Porfirio Diaz | 1911 | old name restored after Diaz fell
755. **1956** Port-Lyautey, Morocco, is renamed Kenitra  [first, slider]
   - Block C line 103: Kenitra | Morocco | Port-Lyautey | 1956 | French name dropped at independence
756. **1975** Vila Pery, Mozambique, is renamed Chimoio  [first, slider]
   - Block C line 104: Chimoio | Mozambique | Vila Pery | 1975 | renamed at a rally by Samora Machel
757. **1975** Porto Amelia, Mozambique, is renamed Pemba  [first, slider]
   - Block C line 105: Pemba | Mozambique | Porto Amelia | 1975 | Portuguese name dropped at end of colonial rule
758. **1975** Joao Belo, Mozambique, is renamed Xai-Xai  [first, slider]
   - Block C line 106: Xai-Xai | Mozambique | Joao Belo | 1975 | Portuguese name dropped at independence
759. **1996** Titov Veles, North Macedonia, is renamed Veles  [first, slider]
   - Block C line 107: Veles | North Macedonia | Titov Veles | 1996 | Tito name dropped
760. **1931** Nidaros, Norway, is renamed Trondheim  [first, slider]
   - Block C line 108: Trondheim | Norway | Nidaros | 1931 | Nidaros dropped after protests
761. **1978** Campbellpur, Pakistan, is renamed Attock  [first, slider]
   - Block C line 109: Attock | Pakistan | Campbellpur | 1978 | Government of Pakistan restored the old name
762. **1979** Lyallpur, Pakistan, is renamed Faisalabad  [first, slider]
   - Block C line 110: Faisalabad | Pakistan | Lyallpur | 1979 | renamed in honour of King Faisal of Saudi Arabia
763. **1989** Puerto Presidente Stroessner, Paraguay, is renamed Ciudad del Este  [first, slider]
   - Block C line 111: Ciudad del Este | Paraguay | Puerto Presidente Stroessner | 1989 | renamed after the dictator was overthrown
764. **1945** Danzig, Poland, is renamed Gdansk  [first, slider]
   - Block C line 112: Gdansk | Poland | Danzig | 1945 | German city became Polish Gdansk
765. **1956** Stalinogrod, Poland, is renamed Katowice  [first, slider]
   - Block C line 113: Katowice | Poland | Stalinogrod | 1956 | Stalin name dropped, old name back
766. **1945** Stettin, Poland, is renamed Szczecin  [first, slider]
   - Block C line 114: Szczecin | Poland | Stettin | 1945 | German city became Polish Szczecin
767. **1945** Breslau, Poland, is renamed Wroclaw  [first, slider]
   - Block C line 115: Wroclaw | Poland | Breslau | 1945 | German city became Polish Wroclaw
768. **1991** Loubomo, Republic of the Congo, is renamed Dolisie  [first, slider]
   - Block C line 116: Dolisie | Republic of the Congo | Loubomo | 1991 | earlier name Dolisie restored
769. **1960** Orasul Stalin, Romania, is renamed Brasov  [first, slider]
   - Block C line 117: Brasov | Romania | Orasul Stalin | 1960 | Stalin name dropped, old name back
770. **1946** Pillau, Russia, is renamed Baltiysk  [first, slider]
   - Block C line 118: Baltiysk | Russia | Pillau | 1946 | German name replaced under Soviet rule
771. **1931** Pokrovsk, Russia, is renamed Engels  [first, slider]
   - Block C line 121: Engels | Russia | Pokrovsk | 1931 | renamed after Friedrich Engels
772. **1987** Ustinov, Russia, is renamed Izhevsk  [first, slider]
   - Block C line 123: Izhevsk | Russia | Ustinov | 1987 | historical name regained after protests
773. **1946** Konigsberg, Russia, is renamed Kaliningrad  [first, slider]
   - Block C line 124: Kaliningrad | Russia | Konigsberg | 1946 | renamed after Mikhail Kalinin under Soviet rule
774. **1934** Vyatka, Russia, is renamed Kirov  [first, slider]
   - Block C line 125: Kirov | Russia | Vyatka | 1934 | renamed after Bolshevik Sergei Kirov
775. **1920** Yekaterinodar, Russia, is renamed Krasnodar  [first, slider]
   - Block C line 127: Krasnodar | Russia | Yekaterinodar | 1920 | renamed after the revolution
776. **1921** Petrovsk-Port, Russia, is renamed Makhachkala  [first, slider]
   - Block C line 128: Makhachkala | Russia | Petrovsk-Port | 1921 | renamed under Soviet rule
777. **1988** Brezhnev, Russia, is renamed Naberezhnye Chelny  [first, slider]
   - Block C line 129: Naberezhnye Chelny | Russia | Brezhnev | 1988 | Brezhnev name dropped, old name back
778. **1990** Gorky, Russia, is renamed Nizhny Novgorod  [first, slider]
   - Block C line 130: Nizhny Novgorod | Russia | Gorky | 1990 | original name reinstated
779. **1926** Novonikolayevsk, Russia, is renamed Novosibirsk  [first, slider]
   - Block C line 131: Novosibirsk | Russia | Novonikolayevsk | 1926 | given its present name
780. **1957** Chkalov, Russia, is renamed Orenburg  [first, slider]
   - Block C line 132: Orenburg | Russia | Chkalov | 1957 | original name regained
781. **1957** Molotov, Russia, is renamed Perm  [first, slider]
   - Block C line 133: Perm | Russia | Molotov | 1957 | historical name restored
782. **1937** Detskoye Selo, Russia, is renamed Pushkin  [first, slider]
   - Block C line 134: Pushkin | Russia | Detskoye Selo | 1937 | renamed after the poet Pushkin
783. **1989** Andropov, Russia, is renamed Rybinsk  [first, slider]
   - Block C line 135: Rybinsk | Russia | Andropov | 1989 | Andropov name dropped, old name back
784. **1991** Leningrad, Russia, is renamed Saint Petersburg  [first, slider]
   - Block C line 136: Saint Petersburg | Russia | Leningrad | 1991 | old name restored after a city referendum
785. **1991** Kuybyshev, Russia, is renamed Samara  [first, slider]
   - Block C line 137: Samara | Russia | Kuybyshev | 1991 | historical name restored
786. **1991** Zagorsk, Russia, is renamed Sergiyev Posad  [first, slider]
   - Block C line 139: Sergiyev Posad | Russia | Zagorsk | 1991 | original name restored
787. **1946** Tilsit, Russia, is renamed Sovetsk  [first, slider]
   - Block C line 141: Sovetsk | Russia | Tilsit | 1946 | German name replaced under Soviet rule
788. **1964** Stavropol, Russia, is renamed Tolyatti  [first, slider]
   - Block C line 142: Tolyatti | Russia | Stavropol | 1964 | renamed after Italian communist Togliatti
789. **1990** Kalinin, Russia, is renamed Tver  [first, slider]
   - Block C line 143: Tver | Russia | Kalinin | 1990 | historical name restored
790. **1924** Simbirsk, Russia, is renamed Ulyanovsk  [first, slider]
   - Block C line 144: Ulyanovsk | Russia | Simbirsk | 1924 | renamed after Lenin (Vladimir Ulyanov)
791. **1957** Voroshilov, Russia, is renamed Ussuriysk  [first, slider]
   - Block C line 145: Ussuriysk | Russia | Voroshilov | 1957 | Voroshilov name dropped
792. **1990** Ordzhonikidze, Russia, is renamed Vladikavkaz  [first, slider]
   - Block C line 146: Vladikavkaz | Russia | Ordzhonikidze | 1990 | old Russian name Vladikavkaz returned
793. **1961** Stalingrad, Russia, is renamed Volgograd  [first, slider]
   - Block C line 147: Volgograd | Russia | Stalingrad | 1961 | renamed during de-Stalinization
794. **1991** Sverdlovsk, Russia, is renamed Yekaterinburg  [first, slider]
   - Block C line 148: Yekaterinburg | Russia | Sverdlovsk | 1991 | historical name restored
795. **1950** Caribrod, Serbia, is renamed Dimitrovgrad  [first, slider]
   - Block C line 149: Dimitrovgrad | Serbia | Caribrod | 1950 | renamed after Georgi Dimitrov
796. **1946** Petrovgrad, Serbia, is renamed Zrenjanin  [first, slider]
   - Block C line 150: Zrenjanin | Serbia | Petrovgrad | 1946 | renamed after partisan Zarko Zrenjanin
797. **2002** Warmbaths, South Africa, is renamed Bela-Bela  [first, slider]
   - Block C line 151: Bela-Bela | South Africa | Warmbaths | 2002 | officially renamed by government
798. **2021** Port Elizabeth, South Africa, is renamed Gqeberha  [first, slider]
   - Block C line 152: Gqeberha | South Africa | Port Elizabeth | 2021 | name change officially gazetted
799. **2021** Uitenhage, South Africa, is renamed Kariega  [first, slider]
   - Block C line 153: Kariega | South Africa | Uitenhage | 2021 | name change officially gazetted
800. **2002** Ellisras, South Africa, is renamed Lephalale  [first, slider]
   - Block C line 154: Lephalale | South Africa | Ellisras | 2002 | renamed by Limpopo provincial government
801. **2018** Grahamstown, South Africa, is renamed Makhanda  [first, slider]
   - Block C line 155: Makhanda | South Africa | Grahamstown | 2018 | officially renamed after colonial-era name
802. **2009** Nelspruit, South Africa, is renamed Mbombela  [first (20-year gap)]
   - Block C line 156: Mbombela | South Africa | Nelspruit | 2009 | renamed by government, upheld in court 2014
803. **2003** Potgietersrus, South Africa, is renamed Mokopane  [first, slider]
   - Block C line 158: Mokopane | South Africa | Potgietersrus | 2003 | name officially changed by government
804. **2005** Pietersburg, South Africa, is renamed Polokwane  [first, slider]
   - Block C line 159: Polokwane | South Africa | Pietersburg | 2005 | government declared Polokwane official name
805. **2021** King William's Town, South Africa, is renamed Qonce  [first, slider]
   - Block C line 160: Qonce | South Africa | King William's Town | 2021 | officially renamed
806. **2006** Witbank, South Africa, is renamed eMalahleni  [first, slider]
   - Block C line 161: eMalahleni | South Africa | Witbank | 2006 | officially renamed
807. **2018** Qurghonteppa, Tajikistan, is renamed Bokhtar  [first, slider]
   - Block C line 162: Bokhtar | Tajikistan | Qurghonteppa | 2018 | city officially renamed Bokhtar
808. **2000** Ura-Tyube, Tajikistan, is renamed Istaravshan  [first, slider]
   - Block C line 163: Istaravshan | Tajikistan | Ura-Tyube | 2000 | Tajik government restored the historic name
809. **1930** Constantinople, Turkiye, is renamed Istanbul  [first, slider]
   - Block C line 164: Istanbul | Turkiye | Constantinople | 1930 | Istanbul made the official name
810. **1973** Maras, Turkiye, is given the title kahraman (heroic): Kahramanmaras  [first, slider]
   - Block C line 165: Kahramanmaras | Turkiye | Maras | 1973 | parliament added the title kahraman (heroic)
811. **1984** Urfa, Turkiye, is given the title sanli (glorious): Sanliurfa  [first, slider]
   - Block C line 166: Sanliurfa | Turkiye | Urfa | 1984 | parliament added the title sanli (glorious)
812. **1993** Krasnovodsk, Turkmenistan, is renamed Turkmenbashi  [first, slider]
   - Block C line 167: Turkmenbashi | Turkmenistan | Krasnovodsk | 1993 | renamed after President Niyazov's title
813. **2016** Dnipropetrovsk, Ukraine, is renamed Dnipro  [first, slider]
   - Block C line 168: Dnipro | Ukraine | Dnipropetrovsk | 2016 | renamed under decommunization law
814. **1962** Stanislav, Ukraine, is renamed Ivano-Frankivsk  [first, slider]
   - Block C line 169: Ivano-Frankivsk | Ukraine | Stanislav | 1962 | renamed after writer Ivan Franko
815. **1954** Proskuriv, Ukraine, is renamed Khmelnytskyi  [first, slider]
   - Block C line 170: Khmelnytskyi | Ukraine | Proskuriv | 1954 | renamed after Bohdan Khmelnytsky
816. **2016** Kirovohrad, Ukraine, is renamed Kropyvnytskyi  [first, slider]
   - Block C line 171: Kropyvnytskyi | Ukraine | Kirovohrad | 2016 | renamed under decommunization law
817. **2019** Pereiaslav-Khmelnytskyi, Ukraine, is renamed Pereiaslav  [first, slider]
   - Block C line 172: Pereiaslav | Ukraine | Pereiaslav-Khmelnytskyi | 2019 | historic name reinstated by parliament
818. **1839** Waterloo, United States, is renamed Austin  [first, slider]
   - Block C line 173: Austin | United States | Waterloo | 1839 | renamed Austin when chosen as Texas capital
819. **1873** Edwinton, United States, is renamed Bismarck  [first, slider]
   - Block C line 174: Bismarck | United States | Edwinton | 1873 | railway renamed it for Otto von Bismarck
820. **1998** Agana, United States, is renamed Hagatna  [first, slider]
   - Block C line 175: Hagatna | United States | Agana | 1998 | Guam capital took its Chamorro name
821. **1954** Mauch Chunk, United States, is renamed Jim Thorpe  [first, slider]
   - Block C line 176: Jim Thorpe | United States | Mauch Chunk | 1954 | merged boroughs renamed for athlete Jim Thorpe
822. **1996** North Tarrytown, United States, is renamed Sleepy Hollow  [first, slider]
   - Block C line 177: Sleepy Hollow | United States | North Tarrytown | 1996 | village took the area's historical name
823. **1950** Hot Springs, United States, is renamed Truth or Consequences  [first, slider]
   - Block C line 178: Truth or Consequences | United States | Hot Springs | 1950 | renamed after a radio quiz show
824. **2016** Barrow, United States, is renamed Utqiagvik  [first, slider]
   - Block C line 179: Utqiagvik | United States | Barrow | 2016 | English name replaced by Inupiaq name
825. **1846** Angostura, Venezuela, is renamed Ciudad Bolivar  [first, slider]
   - Block C line 180: Ciudad Bolivar | Venezuela | Angostura | 1846 | renamed in honour of Simon Bolivar
826. **1976** Saigon, Viet Nam, is renamed Ho Chi Minh City  [first, slider]
   - Block C line 181: Ho Chi Minh City | Viet Nam | Saigon | 1976 | renamed at Vietnam's reunification
827. **1966** Broken Hill, Zambia, is renamed Kabwe  [first, slider]
   - Block C line 182: Kabwe | Zambia | Broken Hill | 1966 | colonial name dropped after independence
828. **1982** Hartley, Zimbabwe, is renamed Chegutu  [first, slider]
   - Block C line 183: Chegutu | Zimbabwe | Hartley | 1982 | colonial name officially replaced
829. **1982** Wankie, Zimbabwe, is renamed Hwange  [first, slider]
   - Block C line 184: Hwange | Zimbabwe | Wankie | 1982 | colonial name replaced
830. **1982** Gatooma, Zimbabwe, is renamed Kadoma  [first, slider]
   - Block C line 185: Kadoma | Zimbabwe | Gatooma | 1982 | renamed in 1982 gazette of new names
831. **1982** Fort Victoria, Zimbabwe, is renamed Masvingo  [first, slider]
   - Block C line 186: Masvingo | Zimbabwe | Fort Victoria | 1982 | colonial name replaced (briefly Nyanda)
832. **1982** Umtali, Zimbabwe, is renamed Mutare  [first, slider]
   - Block C line 187: Mutare | Zimbabwe | Umtali | 1982 | colonial name officially replaced
833. **1982** Shabani, Zimbabwe, is renamed Zvishavane  [first, slider]
   - Block C line 188: Zvishavane | Zimbabwe | Shabani | 1982 | colonial name replaced with indigenous one

## Block D lines not asked

- Block D line 62: 1902 | Dakar replaces Saint-Louis as capital of French West Africa | Senegal, France: Block A marks Senegal's capital changes "don't ask"
- Block D line 65: 1905 | Nairobi replaces Mombasa as capital of the East Africa Protectorate | Kenya, United Kingdom: clashes with Block A (Kenya: Mombasa to Nairobi, 1907); neither year is asked
- Block D line 86: 1926 | Niamey replaces Zinder as capital of the colony of Niger | Niger, France: Block A marks Niger's capital changes "don't ask"
- Block D line 143: 1970 | Tonga ends British protection and becomes fully independent | Tonga, United Kingdom: Block A says Tonga was never colonised and its independence year is "don't ask"

## Block C lines not asked as "What was this city called?"

- Chernyakhovsk (Russia), Insterburg 1946: one source only, not asked at all
- Dimitrovgrad (Russia), Melekess 1972: one source only, not asked at all
- Gatchina (Russia), Krasnogvardeysk 1944: one source only, not asked at all
- Korolyov (Russia), Kaliningrad 1996: one source only, not asked at all
- Sarov (Russia), Kremlyov 1995: one source only, not asked at all
- Sochi (Russia), Dakhovsky Posad 1896: one source only, not asked at all
- Modimolle (South Africa), Nylstroom 2002: one source only, not asked at all
- Bogota (Colombia), Santa Fe de Bogota 2000: the present name contains the old one, so it is only a dated fact
- Veles (North Macedonia), Titov Veles 1996: the present name contains the old one, so it is only a dated fact
- Kahramanmaras (Turkiye), Maras 1973: the present name contains the old one, so it is only a dated fact
- Sanliurfa (Turkiye), Urfa 1984: the present name contains the old one, so it is only a dated fact
- Dnipro (Ukraine), Dnipropetrovsk 2016: the present name contains the old one, so it is only a dated fact
- Pereiaslav (Ukraine), Pereiaslav-Khmelnytskyi 2019: the present name contains the old one, so it is only a dated fact

## What was this city called?

Wrong answers are drawn from the other questions' right answers of the same kind (all from Block A), never from the excluded pairs above.

- What was Astana (Kazakhstan) called before 2022? **Nur-Sultan**
  - Block C line 1: Astana | Kazakhstan | Nur-Sultan | 2022 | capital's name changed back to Astana
- Nur-Sultan is a former name of which city? **Astana (Kazakhstan)**
  - Block C line 1: Astana | Kazakhstan | Nur-Sultan | 2022 | capital's name changed back to Astana
- What was Bandar Seri Begawan (Brunei) called before 1970? **Brunei Town**
  - Block C line 2: Bandar Seri Begawan | Brunei | Brunei Town | 1970 | renamed to honour Sultan Omar Ali Saifuddien III
- Brunei Town is a former name of which city? **Bandar Seri Begawan (Brunei)**
  - Block C line 2: Bandar Seri Begawan | Brunei | Brunei Town | 1970 | renamed to honour Sultan Omar Ali Saifuddien III
- What was Banjul (Gambia) called before 1973? **Bathurst**
  - Block C line 3: Banjul | Gambia | Bathurst | 1973 | capital renamed after independence
- Bathurst is a former name of which city? **Banjul (Gambia)**
  - Block C line 3: Banjul | Gambia | Bathurst | 1973 | capital renamed after independence
- What was Bishkek (Kyrgyzstan) called before 1991? **Frunze**
  - Block C line 4: Bishkek | Kyrgyzstan | Frunze | 1991 | Soviet-era name dropped
- Frunze is a former name of which city? **Bishkek (Kyrgyzstan)**
  - Block C line 4: Bishkek | Kyrgyzstan | Frunze | 1991 | Soviet-era name dropped
- What was Bratislava (Slovakia) called before 1919? **Pressburg**
  - Block C line 6: Bratislava | Slovakia | Pressburg | 1919 | name Bratislava officially adopted
- Pressburg is a former name of which city? **Bratislava (Slovakia)**
  - Block C line 6: Bratislava | Slovakia | Pressburg | 1919 | name Bratislava officially adopted
- What was Dushanbe (Tajikistan) called before 1961? **Stalinabad**
  - Block C line 7: Dushanbe | Tajikistan | Stalinabad | 1961 | renamed in de-Stalinization
- Stalinabad is a former name of which city? **Dushanbe (Tajikistan)**
  - Block C line 7: Dushanbe | Tajikistan | Stalinabad | 1961 | renamed in de-Stalinization
- What was Gaborone (Botswana) called before 1969? **Gaberones**
  - Block C line 8: Gaborone | Botswana | Gaberones | 1969 | capital's name officially changed
- Gaberones is a former name of which city? **Gaborone (Botswana)**
  - Block C line 8: Gaborone | Botswana | Gaberones | 1969 | capital's name officially changed
- What was Georgetown (Guyana) called before 1812? **Stabroek**
  - Block C line 9: Georgetown | Guyana | Stabroek | 1812 | British renamed it for King George III
- Stabroek is a former name of which city? **Georgetown (Guyana)**
  - Block C line 9: Georgetown | Guyana | Stabroek | 1812 | British renamed it for King George III
- What was Harare (Zimbabwe) called before 1982? **Salisbury**
  - Block C line 10: Harare | Zimbabwe | Salisbury | 1982 | capital renamed two years after independence
- Salisbury is a former name of which city? **Harare (Zimbabwe)**
  - Block C line 10: Harare | Zimbabwe | Salisbury | 1982 | capital renamed two years after independence
- What was Kinshasa (Democratic Republic of the Congo) called before 1966? **Leopoldville**
  - Block C line 11: Kinshasa | Democratic Republic of the Congo | Leopoldville | 1966 | capital renamed under Mobutu's Africanization drive
- Leopoldville is a former name of which city? **Kinshasa (Democratic Republic of the Congo)**
  - Block C line 11: Kinshasa | Democratic Republic of the Congo | Leopoldville | 1966 | capital renamed under Mobutu's Africanization drive
- What was Malabo (Equatorial Guinea) called before 1973? **Santa Isabel**
  - Block C line 12: Malabo | Equatorial Guinea | Santa Isabel | 1973 | European name replaced under Macias Nguema
- Santa Isabel is a former name of which city? **Malabo (Equatorial Guinea)**
  - Block C line 12: Malabo | Equatorial Guinea | Santa Isabel | 1973 | European name replaced under Macias Nguema
- What was Maputo (Mozambique) called before 1976? **Lourenco Marques**
  - Block C line 13: Maputo | Mozambique | Lourenco Marques | 1976 | capital renamed after independence
- Lourenco Marques is a former name of which city? **Maputo (Mozambique)**
  - Block C line 13: Maputo | Mozambique | Lourenco Marques | 1976 | capital renamed after independence
- What was N'Djamena (Chad) called before 1973? **Fort-Lamy**
  - Block C line 14: N'Djamena | Chad | Fort-Lamy | 1973 | capital renamed by President Tombalbaye
- Fort-Lamy is a former name of which city? **N'Djamena (Chad)**
  - Block C line 14: N'Djamena | Chad | Fort-Lamy | 1973 | capital renamed by President Tombalbaye
- What was Oslo (Norway) called before 1925? **Kristiania**
  - Block C line 15: Oslo | Norway | Kristiania | 1925 | original name Oslo restored
- Kristiania is a former name of which city? **Oslo (Norway)**
  - Block C line 15: Oslo | Norway | Kristiania | 1925 | original name Oslo restored
- What was Ottawa (Canada) called before 1855? **Bytown**
  - Block C line 16: Ottawa | Canada | Bytown | 1855 | renamed Ottawa on gaining city status
- Bytown is a former name of which city? **Ottawa (Canada)**
  - Block C line 16: Ottawa | Canada | Bytown | 1855 | renamed Ottawa on gaining city status
- What was Podgorica (Montenegro) called before 1992? **Titograd**
  - Block C line 17: Podgorica | Montenegro | Titograd | 1992 | original name restored
- Titograd is a former name of which city? **Podgorica (Montenegro)**
  - Block C line 17: Podgorica | Montenegro | Titograd | 1992 | original name restored
- What was Santo Domingo (Dominican Republic) called before 1961? **Ciudad Trujillo**
  - Block C line 18: Santo Domingo | Dominican Republic | Ciudad Trujillo | 1961 | old name restored after the dictator's death
- Ciudad Trujillo is a former name of which city? **Santo Domingo (Dominican Republic)**
  - Block C line 18: Santo Domingo | Dominican Republic | Ciudad Trujillo | 1961 | old name restored after the dictator's death
- What was Seoul (South Korea) called before 1946? **Gyeongseong**
  - Block C line 19: Seoul | South Korea | Gyeongseong | 1946 | US military government named it Seoul
- Gyeongseong is a former name of which city? **Seoul (South Korea)**
  - Block C line 19: Seoul | South Korea | Gyeongseong | 1946 | US military government named it Seoul
- What was Tbilisi (Georgia) called before 1936? **Tiflis**
  - Block C line 20: Tbilisi | Georgia | Tiflis | 1936 | official Russian name changed to Tbilisi
- Tiflis is a former name of which city? **Tbilisi (Georgia)**
  - Block C line 20: Tbilisi | Georgia | Tiflis | 1936 | official Russian name changed to Tbilisi
- What was Tokyo (Japan) called before 1868? **Edo**
  - Block C line 21: Tokyo | Japan | Edo | 1868 | renamed Eastern Capital under Emperor Meiji
- Edo is a former name of which city? **Tokyo (Japan)**
  - Block C line 21: Tokyo | Japan | Edo | 1868 | renamed Eastern Capital under Emperor Meiji
- What was Ulaanbaatar (Mongolia) called before 1924? **Niislel Khuree**
  - Block C line 22: Ulaanbaatar | Mongolia | Niislel Khuree | 1924 | renamed at founding of People's Republic
- Niislel Khuree is a former name of which city? **Ulaanbaatar (Mongolia)**
  - Block C line 22: Ulaanbaatar | Mongolia | Niislel Khuree | 1924 | renamed at founding of People's Republic
- What was Kucove (Albania) called before 1990? **Qyteti Stalin**
  - Block C line 23: Kucove | Albania | Qyteti Stalin | 1990 | Stalin name dropped, old name back
- Qyteti Stalin is a former name of which city? **Kucove (Albania)**
  - Block C line 23: Kucove | Albania | Qyteti Stalin | 1990 | Stalin name dropped, old name back
- What was Skikda (Algeria) called before 1962? **Philippeville**
  - Block C line 24: Skikda | Algeria | Philippeville | 1962 | French name dropped at independence
- Philippeville is a former name of which city? **Skikda (Algeria)**
  - Block C line 24: Skikda | Algeria | Philippeville | 1962 | French name dropped at independence
- What was Huambo (Angola) called before 1975? **Nova Lisboa**
  - Block C line 25: Huambo | Angola | Nova Lisboa | 1975 | original name restored after independence
- Nova Lisboa is a former name of which city? **Huambo (Angola)**
  - Block C line 25: Huambo | Angola | Nova Lisboa | 1975 | original name restored after independence
- What was N'dalatando (Angola) called before 1976? **Salazar**
  - Block C line 26: N'dalatando | Angola | Salazar | 1976 | original name restored after independence
- Salazar is a former name of which city? **N'dalatando (Angola)**
  - Block C line 26: N'dalatando | Angola | Salazar | 1976 | original name restored after independence
- What was La Plata (Argentina) called before 1955? **Ciudad Eva Peron**
  - Block C line 27: La Plata | Argentina | Ciudad Eva Peron | 1955 | original name restored after Peron fell
- Ciudad Eva Peron is a former name of which city? **La Plata (Argentina)**
  - Block C line 27: La Plata | Argentina | Ciudad Eva Peron | 1955 | original name restored after Peron fell
- What was Alice Springs (Australia) called before 1933? **Stuart**
  - Block C line 28: Alice Springs | Australia | Stuart | 1933 | town gazetted under its waterhole name
- Stuart is a former name of which city? **Alice Springs (Australia)**
  - Block C line 28: Alice Springs | Australia | Stuart | 1933 | town gazetted under its waterhole name
- What was Bendigo (Australia) called before 1891? **Sandhurst**
  - Block C line 29: Bendigo | Australia | Sandhurst | 1891 | official name changed back to Bendigo
- Sandhurst is a former name of which city? **Bendigo (Australia)**
  - Block C line 29: Bendigo | Australia | Sandhurst | 1891 | official name changed back to Bendigo
- What was Darwin (Australia) called before 1911? **Palmerston**
  - Block C line 30: Darwin | Australia | Palmerston | 1911 | town renamed after Charles Darwin
- Palmerston is a former name of which city? **Darwin (Australia)**
  - Block C line 30: Darwin | Australia | Palmerston | 1911 | town renamed after Charles Darwin
- What was Gold Coast (Australia) called before 1958? **South Coast**
  - Block C line 31: Gold Coast | Australia | South Coast | 1958 | Town of South Coast renamed Town of Gold Coast
- South Coast is a former name of which city? **Gold Coast (Australia)**
  - Block C line 31: Gold Coast | Australia | South Coast | 1958 | Town of South Coast renamed Town of Gold Coast
- What was Hahndorf (Australia) called before 1935? **Ambleside**
  - Block C line 32: Hahndorf | Australia | Ambleside | 1935 | German name restored after WWI-era change
- Ambleside is a former name of which city? **Hahndorf (Australia)**
  - Block C line 32: Hahndorf | Australia | Ambleside | 1935 | German name restored after WWI-era change
- What was Holbrook (Australia) called before 1915? **Germanton**
  - Block C line 33: Holbrook | Australia | Germanton | 1915 | German name dropped in WWI
- Germanton is a former name of which city? **Holbrook (Australia)**
  - Block C line 33: Holbrook | Australia | Germanton | 1915 | German name dropped in WWI
- What was Ganja (Azerbaijan) called before 1989? **Kirovabad**
  - Block C line 34: Ganja | Azerbaijan | Kirovabad | 1989 | original name restored during perestroika
- Kirovabad is a former name of which city? **Ganja (Azerbaijan)**
  - Block C line 34: Ganja | Azerbaijan | Kirovabad | 1989 | original name restored during perestroika
- What was Shirvan (Azerbaijan) called before 2008? **Ali Bayramli**
  - Block C line 35: Shirvan | Azerbaijan | Ali Bayramli | 2008 | Azerbaijan parliament renamed the city
- Ali Bayramli is a former name of which city? **Shirvan (Azerbaijan)**
  - Block C line 35: Shirvan | Azerbaijan | Ali Bayramli | 2008 | Azerbaijan parliament renamed the city
- What was Joao Pessoa (Brazil) called before 1930? **Parahyba do Norte**
  - Block C line 36: Joao Pessoa | Brazil | Parahyba do Norte | 1930 | state capital renamed for a murdered governor
- Parahyba do Norte is a former name of which city? **Joao Pessoa (Brazil)**
  - Block C line 36: Joao Pessoa | Brazil | Parahyba do Norte | 1930 | state capital renamed for a murdered governor
- What was Niteroi (Brazil) called before 1835? **Vila Real da Praia Grande**
  - Block C line 37: Niteroi | Brazil | Vila Real da Praia Grande | 1835 | renamed Nictheroy (now spelled Niteroi)
- Vila Real da Praia Grande is a former name of which city? **Niteroi (Brazil)**
  - Block C line 37: Niteroi | Brazil | Vila Real da Praia Grande | 1835 | renamed Nictheroy (now spelled Niteroi)
- What was Dobrich (Bulgaria) called before 1990? **Tolbukhin**
  - Block C line 38: Dobrich | Bulgaria | Tolbukhin | 1990 | old name restored by decree
- Tolbukhin is a former name of which city? **Dobrich (Bulgaria)**
  - Block C line 38: Dobrich | Bulgaria | Tolbukhin | 1990 | old name restored by decree
- What was Varna (Bulgaria) called before 1956? **Stalin**
  - Block C line 39: Varna | Bulgaria | Stalin | 1956 | Stalin name dropped, old name back
- Stalin is a former name of which city? **Varna (Bulgaria)**
  - Block C line 39: Varna | Bulgaria | Stalin | 1956 | Stalin name dropped, old name back
- What was Bujumbura (Burundi) called before 1962? **Usumbura**
  - Block C line 40: Bujumbura | Burundi | Usumbura | 1962 | capital renamed at independence
- Usumbura is a former name of which city? **Bujumbura (Burundi)**
  - Block C line 40: Bujumbura | Burundi | Usumbura | 1962 | capital renamed at independence
- What was Limbe (Cameroon) called before 1982? **Victoria**
  - Block C line 41: Limbe | Cameroon | Victoria | 1982 | renamed by presidential decree
- Victoria is a former name of which city? **Limbe (Cameroon)**
  - Block C line 41: Limbe | Cameroon | Victoria | 1982 | renamed by presidential decree
- What was Arviat (Canada) called before 1989? **Eskimo Point**
  - Block C line 42: Arviat | Canada | Eskimo Point | 1989 | English name replaced by Inuktitut name
- Eskimo Point is a former name of which city? **Arviat (Canada)**
  - Block C line 42: Arviat | Canada | Eskimo Point | 1989 | English name replaced by Inuktitut name
- What was Iqaluit (Canada) called before 1987? **Frobisher Bay**
  - Block C line 43: Iqaluit | Canada | Frobisher Bay | 1987 | English name replaced by Inuktitut name
- Frobisher Bay is a former name of which city? **Iqaluit (Canada)**
  - Block C line 43: Iqaluit | Canada | Frobisher Bay | 1987 | English name replaced by Inuktitut name
- What was Kenora (Canada) called before 1905? **Rat Portage**
  - Block C line 44: Kenora | Canada | Rat Portage | 1905 | new name built from Keewatin, Norman, Rat Portage
- Rat Portage is a former name of which city? **Kenora (Canada)**
  - Block C line 44: Kenora | Canada | Rat Portage | 1905 | new name built from Keewatin, Norman, Rat Portage
- What was Kitchener (Canada) called before 1916? **Berlin**
  - Block C line 45: Kitchener | Canada | Berlin | 1916 | German name dropped by referendum in WWI
- Berlin is a former name of which city? **Kitchener (Canada)**
  - Block C line 45: Kitchener | Canada | Berlin | 1916 | German name dropped by referendum in WWI
- What was Kugluktuk (Canada) called before 1996? **Coppermine**
  - Block C line 46: Kugluktuk | Canada | Coppermine | 1996 | English name replaced by Inuinnaqtun name
- Coppermine is a former name of which city? **Kugluktuk (Canada)**
  - Block C line 46: Kugluktuk | Canada | Coppermine | 1996 | English name replaced by Inuinnaqtun name
- What was Kuujjuaq (Canada) called before 1980? **Fort Chimo**
  - Block C line 47: Kuujjuaq | Canada | Fort Chimo | 1980 | took the Inuit name of the Koksoak River
- Fort Chimo is a former name of which city? **Kuujjuaq (Canada)**
  - Block C line 47: Kuujjuaq | Canada | Fort Chimo | 1980 | took the Inuit name of the Koksoak River
- What was Qikiqtarjuaq (Canada) called before 1998? **Broughton Island**
  - Block C line 48: Qikiqtarjuaq | Canada | Broughton Island | 1998 | English name replaced by Inuktitut name
- Broughton Island is a former name of which city? **Qikiqtarjuaq (Canada)**
  - Block C line 48: Qikiqtarjuaq | Canada | Broughton Island | 1998 | English name replaced by Inuktitut name
- What was Regina (Canada) called before 1882? **Pile o' Bones**
  - Block C line 49: Regina | Canada | Pile o' Bones | 1882 | renamed Regina in honour of Queen Victoria
- Pile o' Bones is a former name of which city? **Regina (Canada)**
  - Block C line 49: Regina | Canada | Pile o' Bones | 1882 | renamed Regina in honour of Queen Victoria
- What was Thunder Bay (Canada) called before 1970? **Fort William and Port Arthur**
  - Block C line 50: Thunder Bay | Canada | Fort William and Port Arthur | 1970 | two cities merged into Thunder Bay
- Fort William and Port Arthur is a former name of which city? **Thunder Bay (Canada)**
  - Block C line 50: Thunder Bay | Canada | Fort William and Port Arthur | 1970 | two cities merged into Thunder Bay
- What was Toronto (Canada) called before 1834? **York**
  - Block C line 51: Toronto | Canada | York | 1834 | incorporated as a city under the name Toronto
- York is a former name of which city? **Toronto (Canada)**
  - Block C line 51: Toronto | Canada | York | 1834 | incorporated as a city under the name Toronto
- What was Vancouver (Canada) called before 1886? **Granville**
  - Block C line 52: Vancouver | Canada | Granville | 1886 | renamed Vancouver on incorporation as a city
- Granville is a former name of which city? **Vancouver (Canada)**
  - Block C line 52: Vancouver | Canada | Granville | 1886 | renamed Vancouver on incorporation as a city
- What was Kaga-Bandoro (Central African Republic) called before 1974? **Crampel**
  - Block C line 53: Kaga-Bandoro | Central African Republic | Crampel | 1974 | colonial name (Fort-Crampel) replaced
- Crampel is a former name of which city? **Kaga-Bandoro (Central African Republic)**
  - Block C line 53: Kaga-Bandoro | Central African Republic | Crampel | 1974 | colonial name (Fort-Crampel) replaced
- What was Sarh (Chad) called before 1972? **Fort-Archambault**
  - Block C line 54: Sarh | Chad | Fort-Archambault | 1972 | renamed in Tombalbaye's authenticite campaign
- Fort-Archambault is a former name of which city? **Sarh (Chad)**
  - Block C line 54: Sarh | Chad | Fort-Archambault | 1972 | renamed in Tombalbaye's authenticite campaign
- What was Shangri-La (China) called before 2001? **Zhongdian**
  - Block C line 55: Shangri-La | China | Zhongdian | 2001 | county renamed after the novel's paradise
- Zhongdian is a former name of which city? **Shangri-La (China)**
  - Block C line 55: Shangri-La | China | Zhongdian | 2001 | county renamed after the novel's paradise
- What was Urumqi (China) called before 1954? **Dihua**
  - Block C line 56: Urumqi | China | Dihua | 1954 | name Urumqi restored by the government
- Dihua is a former name of which city? **Urumqi (China)**
  - Block C line 56: Urumqi | China | Dihua | 1954 | name Urumqi restored by the government
- What was Zhangjiajie (China) called before 1994? **Dayong**
  - Block C line 57: Zhangjiajie | China | Dayong | 1994 | city renamed after its famous scenic area
- Dayong is a former name of which city? **Zhangjiajie (China)**
  - Block C line 57: Zhangjiajie | China | Dayong | 1994 | city renamed after its famous scenic area
- What was Zlin (Czechia) called before 1990? **Gottwaldov**
  - Block C line 58: Zlin | Czechia | Gottwaldov | 1990 | Gottwald name dropped, old name back
- Gottwaldov is a former name of which city? **Zlin (Czechia)**
  - Block C line 58: Zlin | Czechia | Gottwaldov | 1990 | Gottwald name dropped, old name back
- What was Bandundu (Democratic Republic of the Congo) called before 1966? **Banningville**
  - Block C line 59: Bandundu | Democratic Republic of the Congo | Banningville | 1966 | Belgian colonial name dropped
- Banningville is a former name of which city? **Bandundu (Democratic Republic of the Congo)**
  - Block C line 59: Bandundu | Democratic Republic of the Congo | Banningville | 1966 | Belgian colonial name dropped
- What was Kananga (Democratic Republic of the Congo) called before 1966? **Luluabourg**
  - Block C line 60: Kananga | Democratic Republic of the Congo | Luluabourg | 1966 | colonial name replaced under Mobutu
- Luluabourg is a former name of which city? **Kananga (Democratic Republic of the Congo)**
  - Block C line 60: Kananga | Democratic Republic of the Congo | Luluabourg | 1966 | colonial name replaced under Mobutu
- What was Kisangani (Democratic Republic of the Congo) called before 1966? **Stanleyville**
  - Block C line 61: Kisangani | Democratic Republic of the Congo | Stanleyville | 1966 | colonial name replaced under authenticite policy
- Stanleyville is a former name of which city? **Kisangani (Democratic Republic of the Congo)**
  - Block C line 61: Kisangani | Democratic Republic of the Congo | Stanleyville | 1966 | colonial name replaced under authenticite policy
- What was Likasi (Democratic Republic of the Congo) called before 1966? **Jadotville**
  - Block C line 62: Likasi | Democratic Republic of the Congo | Jadotville | 1966 | Belgian colonial name dropped
- Jadotville is a former name of which city? **Likasi (Democratic Republic of the Congo)**
  - Block C line 62: Likasi | Democratic Republic of the Congo | Jadotville | 1966 | Belgian colonial name dropped
- What was Lubumbashi (Democratic Republic of the Congo) called before 1966? **Elisabethville**
  - Block C line 63: Lubumbashi | Democratic Republic of the Congo | Elisabethville | 1966 | Belgian colonial name replaced under Mobutu
- Elisabethville is a former name of which city? **Lubumbashi (Democratic Republic of the Congo)**
  - Block C line 63: Lubumbashi | Democratic Republic of the Congo | Elisabethville | 1966 | Belgian colonial name replaced under Mobutu
- What was Mbandaka (Democratic Republic of the Congo) called before 1966? **Coquilhatville**
  - Block C line 64: Mbandaka | Democratic Republic of the Congo | Coquilhatville | 1966 | renamed to honour a local leader
- Coquilhatville is a former name of which city? **Mbandaka (Democratic Republic of the Congo)**
  - Block C line 64: Mbandaka | Democratic Republic of the Congo | Coquilhatville | 1966 | renamed to honour a local leader
- What was Manzini (Eswatini) called before 1960? **Bremersdorp**
  - Block C line 65: Manzini | Eswatini | Bremersdorp | 1960 | original Swazi name restored
- Bremersdorp is a former name of which city? **Manzini (Eswatini)**
  - Block C line 65: Manzini | Eswatini | Bremersdorp | 1960 | original Swazi name restored
- What was Adama (Ethiopia) called before 2000? **Nazret**
  - Block C line 66: Adama | Ethiopia | Nazret | 2000 | Oromo name officially restored
- Nazret is a former name of which city? **Adama (Ethiopia)**
  - Block C line 66: Adama | Ethiopia | Nazret | 2000 | Oromo name officially restored
- What was Noumea (France) called before 1866? **Port-de-France**
  - Block C line 67: Noumea | France | Port-de-France | 1866 | New Caledonia capital renamed Noumea
- Port-de-France is a former name of which city? **Noumea (France)**
  - Block C line 67: Noumea | France | Port-de-France | 1866 | New Caledonia capital renamed Noumea
- What was Chemnitz (Germany) called before 1990? **Karl-Marx-Stadt**
  - Block C line 68: Chemnitz | Germany | Karl-Marx-Stadt | 1990 | historical name restored
- Karl-Marx-Stadt is a former name of which city? **Chemnitz (Germany)**
  - Block C line 68: Chemnitz | Germany | Karl-Marx-Stadt | 1990 | historical name restored
- What was Eisenhuttenstadt (Germany) called before 1961? **Stalinstadt**
  - Block C line 69: Eisenhuttenstadt | Germany | Stalinstadt | 1961 | renamed during de-Stalinization
- Stalinstadt is a former name of which city? **Eisenhuttenstadt (Germany)**
  - Block C line 69: Eisenhuttenstadt | Germany | Stalinstadt | 1961 | renamed during de-Stalinization
- What was Dunaujvaros (Hungary) called before 1961? **Sztalinvaros**
  - Block C line 70: Dunaujvaros | Hungary | Sztalinvaros | 1961 | Stalin name dropped, new name given
- Sztalinvaros is a former name of which city? **Dunaujvaros (Hungary)**
  - Block C line 70: Dunaujvaros | Hungary | Sztalinvaros | 1961 | Stalin name dropped, new name given
- What was Bengaluru (India) called before 2014? **Bangalore**
  - Block C line 71: Bengaluru | India | Bangalore | 2014 | officially renamed with 12 other Karnataka cities
- Bangalore is a former name of which city? **Bengaluru (India)**
  - Block C line 71: Bengaluru | India | Bangalore | 2014 | officially renamed with 12 other Karnataka cities
- What was Chennai (India) called before 1996? **Madras**
  - Block C line 72: Chennai | India | Madras | 1996 | official name changed to the Tamil name
- Madras is a former name of which city? **Chennai (India)**
  - Block C line 72: Chennai | India | Madras | 1996 | official name changed to the Tamil name
- What was Gurugram (India) called before 2016? **Gurgaon**
  - Block C line 73: Gurugram | India | Gurgaon | 2016 | Haryana renamed it with central approval
- Gurgaon is a former name of which city? **Gurugram (India)**
  - Block C line 73: Gurugram | India | Gurgaon | 2016 | Haryana renamed it with central approval
- What was Kochi (India) called before 1996? **Cochin**
  - Block C line 74: Kochi | India | Cochin | 1996 | reverted to its original Malayalam name
- Cochin is a former name of which city? **Kochi (India)**
  - Block C line 74: Kochi | India | Cochin | 1996 | reverted to its original Malayalam name
- What was Kolkata (India) called before 2001? **Calcutta**
  - Block C line 75: Kolkata | India | Calcutta | 2001 | official name changed to the Bengali form
- Calcutta is a former name of which city? **Kolkata (India)**
  - Block C line 75: Kolkata | India | Calcutta | 2001 | official name changed to the Bengali form
- What was Mumbai (India) called before 1995? **Bombay**
  - Block C line 76: Mumbai | India | Bombay | 1995 | state government adopted the Marathi name
- Bombay is a former name of which city? **Mumbai (India)**
  - Block C line 76: Mumbai | India | Bombay | 1995 | state government adopted the Marathi name
- What was Mysuru (India) called before 2014? **Mysore**
  - Block C line 77: Mysuru | India | Mysore | 2014 | officially renamed with other Karnataka cities
- Mysore is a former name of which city? **Mysuru (India)**
  - Block C line 77: Mysuru | India | Mysore | 2014 | officially renamed with other Karnataka cities
- What was Puducherry (India) called before 2006? **Pondicherry**
  - Block C line 78: Puducherry | India | Pondicherry | 2006 | territory and city renamed by Act of Parliament
- Pondicherry is a former name of which city? **Puducherry (India)**
  - Block C line 78: Puducherry | India | Pondicherry | 2006 | territory and city renamed by Act of Parliament
- What was Thiruvananthapuram (India) called before 1991? **Trivandrum**
  - Block C line 79: Thiruvananthapuram | India | Trivandrum | 1991 | official name restored to the Malayalam name
- Trivandrum is a former name of which city? **Thiruvananthapuram (India)**
  - Block C line 79: Thiruvananthapuram | India | Trivandrum | 1991 | official name restored to the Malayalam name
- What was Vadodara (India) called before 1974? **Baroda**
  - Block C line 80: Vadodara | India | Baroda | 1974 | official name changed to the local name
- Baroda is a former name of which city? **Vadodara (India)**
  - Block C line 80: Vadodara | India | Baroda | 1974 | official name changed to the local name
- What was Banda Aceh (Indonesia) called before 1963? **Kutaraja**
  - Block C line 81: Banda Aceh | Indonesia | Kutaraja | 1963 | Indonesian ministry restored the name Banda Aceh
- Kutaraja is a former name of which city? **Banda Aceh (Indonesia)**
  - Block C line 81: Banda Aceh | Indonesia | Kutaraja | 1963 | Indonesian ministry restored the name Banda Aceh
- What was Makassar (Indonesia) called before 1999? **Ujung Pandang**
  - Block C line 82: Makassar | Indonesia | Ujung Pandang | 1999 | name reverted to Makassar
- Ujung Pandang is a former name of which city? **Makassar (Indonesia)**
  - Block C line 82: Makassar | Indonesia | Ujung Pandang | 1999 | name reverted to Makassar
- What was Bandar Anzali (Iran) called before 1979? **Bandar Pahlavi**
  - Block C line 83: Bandar Anzali | Iran | Bandar Pahlavi | 1979 | Pahlavi-era name dropped after the revolution
- Bandar Pahlavi is a former name of which city? **Bandar Anzali (Iran)**
  - Block C line 83: Bandar Anzali | Iran | Bandar Pahlavi | 1979 | Pahlavi-era name dropped after the revolution
- What was Cobh (Ireland) called before 1920? **Queenstown**
  - Block C line 84: Cobh | Ireland | Queenstown | 1920 | Irish name adopted
- Queenstown is a former name of which city? **Cobh (Ireland)**
  - Block C line 84: Cobh | Ireland | Queenstown | 1920 | Irish name adopted
- What was Dun Laoghaire (Ireland) called before 1920? **Kingstown**
  - Block C line 85: Dun Laoghaire | Ireland | Kingstown | 1920 | Irish name adopted
- Kingstown is a former name of which city? **Dun Laoghaire (Ireland)**
  - Block C line 85: Dun Laoghaire | Ireland | Kingstown | 1920 | Irish name adopted
- What was Agrigento (Italy) called before 1927? **Girgenti**
  - Block C line 86: Agrigento | Italy | Girgenti | 1927 | Latin-based name adopted by decree
- Girgenti is a former name of which city? **Agrigento (Italy)**
  - Block C line 86: Agrigento | Italy | Girgenti | 1927 | Latin-based name adopted by decree
- What was Latina (Italy) called before 1946? **Littoria**
  - Block C line 87: Latina | Italy | Littoria | 1946 | Fascist-era name dropped
- Littoria is a former name of which city? **Latina (Italy)**
  - Block C line 87: Latina | Italy | Littoria | 1946 | Fascist-era name dropped
- What was Aktau (Kazakhstan) called before 1991? **Shevchenko**
  - Block C line 88: Aktau | Kazakhstan | Shevchenko | 1991 | original name restored at independence
- Shevchenko is a former name of which city? **Aktau (Kazakhstan)**
  - Block C line 88: Aktau | Kazakhstan | Shevchenko | 1991 | original name restored at independence
- What was Konaev (Kazakhstan) called before 2022? **Kapchagay**
  - Block C line 89: Konaev | Kazakhstan | Kapchagay | 2022 | renamed after Soviet-era leader Dinmukhamed Kunaev
- Kapchagay is a former name of which city? **Konaev (Kazakhstan)**
  - Block C line 89: Konaev | Kazakhstan | Kapchagay | 2022 | renamed after Soviet-era leader Dinmukhamed Kunaev
- What was Ridder (Kazakhstan) called before 2002? **Leninogorsk**
  - Block C line 90: Ridder | Kazakhstan | Leninogorsk | 2002 | original name restored
- Leninogorsk is a former name of which city? **Ridder (Kazakhstan)**
  - Block C line 90: Ridder | Kazakhstan | Leninogorsk | 2002 | original name restored
- What was Semey (Kazakhstan) called before 2007? **Semipalatinsk**
  - Block C line 91: Semey | Kazakhstan | Semipalatinsk | 2007 | city council voted for the Kazakh name
- Semipalatinsk is a former name of which city? **Semey (Kazakhstan)**
  - Block C line 91: Semey | Kazakhstan | Semipalatinsk | 2007 | city council voted for the Kazakh name
- What was Taraz (Kazakhstan) called before 1997? **Zhambyl**
  - Block C line 92: Taraz | Kazakhstan | Zhambyl | 1997 | ancient name Taraz restored
- Zhambyl is a former name of which city? **Taraz (Kazakhstan)**
  - Block C line 92: Taraz | Kazakhstan | Zhambyl | 1997 | ancient name Taraz restored
- What was Karakol (Kyrgyzstan) called before 1991? **Przhevalsk**
  - Block C line 93: Karakol | Kyrgyzstan | Przhevalsk | 1991 | original name restored at independence
- Przhevalsk is a former name of which city? **Karakol (Kyrgyzstan)**
  - Block C line 93: Karakol | Kyrgyzstan | Przhevalsk | 1991 | original name restored at independence
- What was Kota Kinabalu (Malaysia) called before 1967? **Jesselton**
  - Block C line 94: Kota Kinabalu | Malaysia | Jesselton | 1967 | Sabah assembly renamed the capital
- Jesselton is a former name of which city? **Kota Kinabalu (Malaysia)**
  - Block C line 94: Kota Kinabalu | Malaysia | Jesselton | 1967 | Sabah assembly renamed the capital
- What was Port Klang (Malaysia) called before 1972? **Port Swettenham**
  - Block C line 95: Port Klang | Malaysia | Port Swettenham | 1972 | colonial name replaced
- Port Swettenham is a former name of which city? **Port Klang (Malaysia)**
  - Block C line 95: Port Klang | Malaysia | Port Swettenham | 1972 | colonial name replaced
- What was Nouadhibou (Mauritania) called before 1960? **Port-Etienne**
  - Block C line 96: Nouadhibou | Mauritania | Port-Etienne | 1960 | French name dropped after independence
- Port-Etienne is a former name of which city? **Nouadhibou (Mauritania)**
  - Block C line 96: Nouadhibou | Mauritania | Port-Etienne | 1960 | French name dropped after independence
- What was Ciudad Juarez (Mexico) called before 1888? **Paso del Norte**
  - Block C line 97: Ciudad Juarez | Mexico | Paso del Norte | 1888 | renamed in honour of Benito Juarez
- Paso del Norte is a former name of which city? **Ciudad Juarez (Mexico)**
  - Block C line 97: Ciudad Juarez | Mexico | Paso del Norte | 1888 | renamed in honour of Benito Juarez
- What was Ciudad Obregon (Mexico) called before 1928? **Cajeme**
  - Block C line 98: Ciudad Obregon | Mexico | Cajeme | 1928 | renamed after Alvaro Obregon's murder
- Cajeme is a former name of which city? **Ciudad Obregon (Mexico)**
  - Block C line 98: Ciudad Obregon | Mexico | Cajeme | 1928 | renamed after Alvaro Obregon's murder
- What was Ciudad Victoria (Mexico) called before 1825? **Santa Maria de Aguayo**
  - Block C line 99: Ciudad Victoria | Mexico | Santa Maria de Aguayo | 1825 | made a city and named for Guadalupe Victoria
- Santa Maria de Aguayo is a former name of which city? **Ciudad Victoria (Mexico)**
  - Block C line 99: Ciudad Victoria | Mexico | Santa Maria de Aguayo | 1825 | made a city and named for Guadalupe Victoria
- What was Coatzacoalcos (Mexico) called before 1936? **Puerto Mexico**
  - Block C line 100: Coatzacoalcos | Mexico | Puerto Mexico | 1936 | old name restored to the port city
- Puerto Mexico is a former name of which city? **Coatzacoalcos (Mexico)**
  - Block C line 100: Coatzacoalcos | Mexico | Puerto Mexico | 1936 | old name restored to the port city
- What was Morelia (Mexico) called before 1828? **Valladolid**
  - Block C line 101: Morelia | Mexico | Valladolid | 1828 | renamed for independence hero Morelos
- Valladolid is a former name of which city? **Morelia (Mexico)**
  - Block C line 101: Morelia | Mexico | Valladolid | 1828 | renamed for independence hero Morelos
- What was Piedras Negras (Mexico) called before 1911? **Ciudad Porfirio Diaz**
  - Block C line 102: Piedras Negras | Mexico | Ciudad Porfirio Diaz | 1911 | old name restored after Diaz fell
- Ciudad Porfirio Diaz is a former name of which city? **Piedras Negras (Mexico)**
  - Block C line 102: Piedras Negras | Mexico | Ciudad Porfirio Diaz | 1911 | old name restored after Diaz fell
- What was Kenitra (Morocco) called before 1956? **Port-Lyautey**
  - Block C line 103: Kenitra | Morocco | Port-Lyautey | 1956 | French name dropped at independence
- Port-Lyautey is a former name of which city? **Kenitra (Morocco)**
  - Block C line 103: Kenitra | Morocco | Port-Lyautey | 1956 | French name dropped at independence
- What was Chimoio (Mozambique) called before 1975? **Vila Pery**
  - Block C line 104: Chimoio | Mozambique | Vila Pery | 1975 | renamed at a rally by Samora Machel
- Vila Pery is a former name of which city? **Chimoio (Mozambique)**
  - Block C line 104: Chimoio | Mozambique | Vila Pery | 1975 | renamed at a rally by Samora Machel
- What was Pemba (Mozambique) called before 1975? **Porto Amelia**
  - Block C line 105: Pemba | Mozambique | Porto Amelia | 1975 | Portuguese name dropped at end of colonial rule
- Porto Amelia is a former name of which city? **Pemba (Mozambique)**
  - Block C line 105: Pemba | Mozambique | Porto Amelia | 1975 | Portuguese name dropped at end of colonial rule
- What was Xai-Xai (Mozambique) called before 1975? **Joao Belo**
  - Block C line 106: Xai-Xai | Mozambique | Joao Belo | 1975 | Portuguese name dropped at independence
- Joao Belo is a former name of which city? **Xai-Xai (Mozambique)**
  - Block C line 106: Xai-Xai | Mozambique | Joao Belo | 1975 | Portuguese name dropped at independence
- What was Trondheim (Norway) called before 1931? **Nidaros**
  - Block C line 108: Trondheim | Norway | Nidaros | 1931 | Nidaros dropped after protests
- Nidaros is a former name of which city? **Trondheim (Norway)**
  - Block C line 108: Trondheim | Norway | Nidaros | 1931 | Nidaros dropped after protests
- What was Attock (Pakistan) called before 1978? **Campbellpur**
  - Block C line 109: Attock | Pakistan | Campbellpur | 1978 | Government of Pakistan restored the old name
- Campbellpur is a former name of which city? **Attock (Pakistan)**
  - Block C line 109: Attock | Pakistan | Campbellpur | 1978 | Government of Pakistan restored the old name
- What was Faisalabad (Pakistan) called before 1979? **Lyallpur**
  - Block C line 110: Faisalabad | Pakistan | Lyallpur | 1979 | renamed in honour of King Faisal of Saudi Arabia
- Lyallpur is a former name of which city? **Faisalabad (Pakistan)**
  - Block C line 110: Faisalabad | Pakistan | Lyallpur | 1979 | renamed in honour of King Faisal of Saudi Arabia
- What was Ciudad del Este (Paraguay) called before 1989? **Puerto Presidente Stroessner**
  - Block C line 111: Ciudad del Este | Paraguay | Puerto Presidente Stroessner | 1989 | renamed after the dictator was overthrown
- Puerto Presidente Stroessner is a former name of which city? **Ciudad del Este (Paraguay)**
  - Block C line 111: Ciudad del Este | Paraguay | Puerto Presidente Stroessner | 1989 | renamed after the dictator was overthrown
- What was Gdansk (Poland) called before 1945? **Danzig**
  - Block C line 112: Gdansk | Poland | Danzig | 1945 | German city became Polish Gdansk
- Danzig is a former name of which city? **Gdansk (Poland)**
  - Block C line 112: Gdansk | Poland | Danzig | 1945 | German city became Polish Gdansk
- What was Katowice (Poland) called before 1956? **Stalinogrod**
  - Block C line 113: Katowice | Poland | Stalinogrod | 1956 | Stalin name dropped, old name back
- Stalinogrod is a former name of which city? **Katowice (Poland)**
  - Block C line 113: Katowice | Poland | Stalinogrod | 1956 | Stalin name dropped, old name back
- What was Szczecin (Poland) called before 1945? **Stettin**
  - Block C line 114: Szczecin | Poland | Stettin | 1945 | German city became Polish Szczecin
- Stettin is a former name of which city? **Szczecin (Poland)**
  - Block C line 114: Szczecin | Poland | Stettin | 1945 | German city became Polish Szczecin
- What was Wroclaw (Poland) called before 1945? **Breslau**
  - Block C line 115: Wroclaw | Poland | Breslau | 1945 | German city became Polish Wroclaw
- Breslau is a former name of which city? **Wroclaw (Poland)**
  - Block C line 115: Wroclaw | Poland | Breslau | 1945 | German city became Polish Wroclaw
- What was Dolisie (Republic of the Congo) called before 1991? **Loubomo**
  - Block C line 116: Dolisie | Republic of the Congo | Loubomo | 1991 | earlier name Dolisie restored
- Loubomo is a former name of which city? **Dolisie (Republic of the Congo)**
  - Block C line 116: Dolisie | Republic of the Congo | Loubomo | 1991 | earlier name Dolisie restored
- What was Brasov (Romania) called before 1960? **Orasul Stalin**
  - Block C line 117: Brasov | Romania | Orasul Stalin | 1960 | Stalin name dropped, old name back
- Orasul Stalin is a former name of which city? **Brasov (Romania)**
  - Block C line 117: Brasov | Romania | Orasul Stalin | 1960 | Stalin name dropped, old name back
- What was Baltiysk (Russia) called before 1946? **Pillau**
  - Block C line 118: Baltiysk | Russia | Pillau | 1946 | German name replaced under Soviet rule
- Pillau is a former name of which city? **Baltiysk (Russia)**
  - Block C line 118: Baltiysk | Russia | Pillau | 1946 | German name replaced under Soviet rule
- What was Engels (Russia) called before 1931? **Pokrovsk**
  - Block C line 121: Engels | Russia | Pokrovsk | 1931 | renamed after Friedrich Engels
- Pokrovsk is a former name of which city? **Engels (Russia)**
  - Block C line 121: Engels | Russia | Pokrovsk | 1931 | renamed after Friedrich Engels
- What was Izhevsk (Russia) called before 1987? **Ustinov**
  - Block C line 123: Izhevsk | Russia | Ustinov | 1987 | historical name regained after protests
- Ustinov is a former name of which city? **Izhevsk (Russia)**
  - Block C line 123: Izhevsk | Russia | Ustinov | 1987 | historical name regained after protests
- What was Kaliningrad (Russia) called before 1946? **Konigsberg**
  - Block C line 124: Kaliningrad | Russia | Konigsberg | 1946 | renamed after Mikhail Kalinin under Soviet rule
- Konigsberg is a former name of which city? **Kaliningrad (Russia)**
  - Block C line 124: Kaliningrad | Russia | Konigsberg | 1946 | renamed after Mikhail Kalinin under Soviet rule
- What was Kirov (Russia) called before 1934? **Vyatka**
  - Block C line 125: Kirov | Russia | Vyatka | 1934 | renamed after Bolshevik Sergei Kirov
- Vyatka is a former name of which city? **Kirov (Russia)**
  - Block C line 125: Kirov | Russia | Vyatka | 1934 | renamed after Bolshevik Sergei Kirov
- What was Krasnodar (Russia) called before 1920? **Yekaterinodar**
  - Block C line 127: Krasnodar | Russia | Yekaterinodar | 1920 | renamed after the revolution
- Yekaterinodar is a former name of which city? **Krasnodar (Russia)**
  - Block C line 127: Krasnodar | Russia | Yekaterinodar | 1920 | renamed after the revolution
- What was Makhachkala (Russia) called before 1921? **Petrovsk-Port**
  - Block C line 128: Makhachkala | Russia | Petrovsk-Port | 1921 | renamed under Soviet rule
- Petrovsk-Port is a former name of which city? **Makhachkala (Russia)**
  - Block C line 128: Makhachkala | Russia | Petrovsk-Port | 1921 | renamed under Soviet rule
- What was Naberezhnye Chelny (Russia) called before 1988? **Brezhnev**
  - Block C line 129: Naberezhnye Chelny | Russia | Brezhnev | 1988 | Brezhnev name dropped, old name back
- Brezhnev is a former name of which city? **Naberezhnye Chelny (Russia)**
  - Block C line 129: Naberezhnye Chelny | Russia | Brezhnev | 1988 | Brezhnev name dropped, old name back
- What was Nizhny Novgorod (Russia) called before 1990? **Gorky**
  - Block C line 130: Nizhny Novgorod | Russia | Gorky | 1990 | original name reinstated
- Gorky is a former name of which city? **Nizhny Novgorod (Russia)**
  - Block C line 130: Nizhny Novgorod | Russia | Gorky | 1990 | original name reinstated
- What was Novosibirsk (Russia) called before 1926? **Novonikolayevsk**
  - Block C line 131: Novosibirsk | Russia | Novonikolayevsk | 1926 | given its present name
- Novonikolayevsk is a former name of which city? **Novosibirsk (Russia)**
  - Block C line 131: Novosibirsk | Russia | Novonikolayevsk | 1926 | given its present name
- What was Orenburg (Russia) called before 1957? **Chkalov**
  - Block C line 132: Orenburg | Russia | Chkalov | 1957 | original name regained
- Chkalov is a former name of which city? **Orenburg (Russia)**
  - Block C line 132: Orenburg | Russia | Chkalov | 1957 | original name regained
- What was Perm (Russia) called before 1957? **Molotov**
  - Block C line 133: Perm | Russia | Molotov | 1957 | historical name restored
- Molotov is a former name of which city? **Perm (Russia)**
  - Block C line 133: Perm | Russia | Molotov | 1957 | historical name restored
- What was Pushkin (Russia) called before 1937? **Detskoye Selo**
  - Block C line 134: Pushkin | Russia | Detskoye Selo | 1937 | renamed after the poet Pushkin
- Detskoye Selo is a former name of which city? **Pushkin (Russia)**
  - Block C line 134: Pushkin | Russia | Detskoye Selo | 1937 | renamed after the poet Pushkin
- What was Rybinsk (Russia) called before 1989? **Andropov**
  - Block C line 135: Rybinsk | Russia | Andropov | 1989 | Andropov name dropped, old name back
- Andropov is a former name of which city? **Rybinsk (Russia)**
  - Block C line 135: Rybinsk | Russia | Andropov | 1989 | Andropov name dropped, old name back
- What was Saint Petersburg (Russia) called before 1991? **Leningrad**
  - Block C line 136: Saint Petersburg | Russia | Leningrad | 1991 | old name restored after a city referendum
- Leningrad is a former name of which city? **Saint Petersburg (Russia)**
  - Block C line 136: Saint Petersburg | Russia | Leningrad | 1991 | old name restored after a city referendum
- What was Samara (Russia) called before 1991? **Kuybyshev**
  - Block C line 137: Samara | Russia | Kuybyshev | 1991 | historical name restored
- Kuybyshev is a former name of which city? **Samara (Russia)**
  - Block C line 137: Samara | Russia | Kuybyshev | 1991 | historical name restored
- What was Sergiyev Posad (Russia) called before 1991? **Zagorsk**
  - Block C line 139: Sergiyev Posad | Russia | Zagorsk | 1991 | original name restored
- Zagorsk is a former name of which city? **Sergiyev Posad (Russia)**
  - Block C line 139: Sergiyev Posad | Russia | Zagorsk | 1991 | original name restored
- What was Sovetsk (Russia) called before 1946? **Tilsit**
  - Block C line 141: Sovetsk | Russia | Tilsit | 1946 | German name replaced under Soviet rule
- Tilsit is a former name of which city? **Sovetsk (Russia)**
  - Block C line 141: Sovetsk | Russia | Tilsit | 1946 | German name replaced under Soviet rule
- What was Tolyatti (Russia) called before 1964? **Stavropol**
  - Block C line 142: Tolyatti | Russia | Stavropol | 1964 | renamed after Italian communist Togliatti
- Stavropol is a former name of which city? **Tolyatti (Russia)**
  - Block C line 142: Tolyatti | Russia | Stavropol | 1964 | renamed after Italian communist Togliatti
- What was Tver (Russia) called before 1990? **Kalinin**
  - Block C line 143: Tver | Russia | Kalinin | 1990 | historical name restored
- Kalinin is a former name of which city? **Tver (Russia)**
  - Block C line 143: Tver | Russia | Kalinin | 1990 | historical name restored
- What was Ulyanovsk (Russia) called before 1924? **Simbirsk**
  - Block C line 144: Ulyanovsk | Russia | Simbirsk | 1924 | renamed after Lenin (Vladimir Ulyanov)
- Simbirsk is a former name of which city? **Ulyanovsk (Russia)**
  - Block C line 144: Ulyanovsk | Russia | Simbirsk | 1924 | renamed after Lenin (Vladimir Ulyanov)
- What was Ussuriysk (Russia) called before 1957? **Voroshilov**
  - Block C line 145: Ussuriysk | Russia | Voroshilov | 1957 | Voroshilov name dropped
- Voroshilov is a former name of which city? **Ussuriysk (Russia)**
  - Block C line 145: Ussuriysk | Russia | Voroshilov | 1957 | Voroshilov name dropped
- What was Vladikavkaz (Russia) called before 1990? **Ordzhonikidze**
  - Block C line 146: Vladikavkaz | Russia | Ordzhonikidze | 1990 | old Russian name Vladikavkaz returned
- Ordzhonikidze is a former name of which city? **Vladikavkaz (Russia)**
  - Block C line 146: Vladikavkaz | Russia | Ordzhonikidze | 1990 | old Russian name Vladikavkaz returned
- What was Volgograd (Russia) called before 1961? **Stalingrad**
  - Block C line 147: Volgograd | Russia | Stalingrad | 1961 | renamed during de-Stalinization
- Stalingrad is a former name of which city? **Volgograd (Russia)**
  - Block C line 147: Volgograd | Russia | Stalingrad | 1961 | renamed during de-Stalinization
- What was Yekaterinburg (Russia) called before 1991? **Sverdlovsk**
  - Block C line 148: Yekaterinburg | Russia | Sverdlovsk | 1991 | historical name restored
- Sverdlovsk is a former name of which city? **Yekaterinburg (Russia)**
  - Block C line 148: Yekaterinburg | Russia | Sverdlovsk | 1991 | historical name restored
- What was Dimitrovgrad (Serbia) called before 1950? **Caribrod**
  - Block C line 149: Dimitrovgrad | Serbia | Caribrod | 1950 | renamed after Georgi Dimitrov
- Caribrod is a former name of which city? **Dimitrovgrad (Serbia)**
  - Block C line 149: Dimitrovgrad | Serbia | Caribrod | 1950 | renamed after Georgi Dimitrov
- What was Zrenjanin (Serbia) called before 1946? **Petrovgrad**
  - Block C line 150: Zrenjanin | Serbia | Petrovgrad | 1946 | renamed after partisan Zarko Zrenjanin
- Petrovgrad is a former name of which city? **Zrenjanin (Serbia)**
  - Block C line 150: Zrenjanin | Serbia | Petrovgrad | 1946 | renamed after partisan Zarko Zrenjanin
- What was Bela-Bela (South Africa) called before 2002? **Warmbaths**
  - Block C line 151: Bela-Bela | South Africa | Warmbaths | 2002 | officially renamed by government
- Warmbaths is a former name of which city? **Bela-Bela (South Africa)**
  - Block C line 151: Bela-Bela | South Africa | Warmbaths | 2002 | officially renamed by government
- What was Gqeberha (South Africa) called before 2021? **Port Elizabeth**
  - Block C line 152: Gqeberha | South Africa | Port Elizabeth | 2021 | name change officially gazetted
- Port Elizabeth is a former name of which city? **Gqeberha (South Africa)**
  - Block C line 152: Gqeberha | South Africa | Port Elizabeth | 2021 | name change officially gazetted
- What was Kariega (South Africa) called before 2021? **Uitenhage**
  - Block C line 153: Kariega | South Africa | Uitenhage | 2021 | name change officially gazetted
- Uitenhage is a former name of which city? **Kariega (South Africa)**
  - Block C line 153: Kariega | South Africa | Uitenhage | 2021 | name change officially gazetted
- What was Lephalale (South Africa) called before 2002? **Ellisras**
  - Block C line 154: Lephalale | South Africa | Ellisras | 2002 | renamed by Limpopo provincial government
- Ellisras is a former name of which city? **Lephalale (South Africa)**
  - Block C line 154: Lephalale | South Africa | Ellisras | 2002 | renamed by Limpopo provincial government
- What was Makhanda (South Africa) called before 2018? **Grahamstown**
  - Block C line 155: Makhanda | South Africa | Grahamstown | 2018 | officially renamed after colonial-era name
- Grahamstown is a former name of which city? **Makhanda (South Africa)**
  - Block C line 155: Makhanda | South Africa | Grahamstown | 2018 | officially renamed after colonial-era name
- What was Mbombela (South Africa) called? **Nelspruit**
  - Block C line 156: Mbombela | South Africa | Nelspruit | 2009 | renamed by government, upheld in court 2014
- Nelspruit is a former name of which city? **Mbombela (South Africa)**
  - Block C line 156: Mbombela | South Africa | Nelspruit | 2009 | renamed by government, upheld in court 2014
- What was Mokopane (South Africa) called before 2003? **Potgietersrus**
  - Block C line 158: Mokopane | South Africa | Potgietersrus | 2003 | name officially changed by government
- Potgietersrus is a former name of which city? **Mokopane (South Africa)**
  - Block C line 158: Mokopane | South Africa | Potgietersrus | 2003 | name officially changed by government
- What was Polokwane (South Africa) called before 2005? **Pietersburg**
  - Block C line 159: Polokwane | South Africa | Pietersburg | 2005 | government declared Polokwane official name
- Pietersburg is a former name of which city? **Polokwane (South Africa)**
  - Block C line 159: Polokwane | South Africa | Pietersburg | 2005 | government declared Polokwane official name
- What was Qonce (South Africa) called before 2021? **King William's Town**
  - Block C line 160: Qonce | South Africa | King William's Town | 2021 | officially renamed
- King William's Town is a former name of which city? **Qonce (South Africa)**
  - Block C line 160: Qonce | South Africa | King William's Town | 2021 | officially renamed
- What was eMalahleni (South Africa) called before 2006? **Witbank**
  - Block C line 161: eMalahleni | South Africa | Witbank | 2006 | officially renamed
- Witbank is a former name of which city? **eMalahleni (South Africa)**
  - Block C line 161: eMalahleni | South Africa | Witbank | 2006 | officially renamed
- What was Bokhtar (Tajikistan) called before 2018? **Qurghonteppa**
  - Block C line 162: Bokhtar | Tajikistan | Qurghonteppa | 2018 | city officially renamed Bokhtar
- Qurghonteppa is a former name of which city? **Bokhtar (Tajikistan)**
  - Block C line 162: Bokhtar | Tajikistan | Qurghonteppa | 2018 | city officially renamed Bokhtar
- What was Istaravshan (Tajikistan) called before 2000? **Ura-Tyube**
  - Block C line 163: Istaravshan | Tajikistan | Ura-Tyube | 2000 | Tajik government restored the historic name
- Ura-Tyube is a former name of which city? **Istaravshan (Tajikistan)**
  - Block C line 163: Istaravshan | Tajikistan | Ura-Tyube | 2000 | Tajik government restored the historic name
- What was Istanbul (Turkiye) called before 1930? **Constantinople**
  - Block C line 164: Istanbul | Turkiye | Constantinople | 1930 | Istanbul made the official name
- Constantinople is a former name of which city? **Istanbul (Turkiye)**
  - Block C line 164: Istanbul | Turkiye | Constantinople | 1930 | Istanbul made the official name
- What was Turkmenbashi (Turkmenistan) called before 1993? **Krasnovodsk**
  - Block C line 167: Turkmenbashi | Turkmenistan | Krasnovodsk | 1993 | renamed after President Niyazov's title
- Krasnovodsk is a former name of which city? **Turkmenbashi (Turkmenistan)**
  - Block C line 167: Turkmenbashi | Turkmenistan | Krasnovodsk | 1993 | renamed after President Niyazov's title
- What was Ivano-Frankivsk (Ukraine) called before 1962? **Stanislav**
  - Block C line 169: Ivano-Frankivsk | Ukraine | Stanislav | 1962 | renamed after writer Ivan Franko
- Stanislav is a former name of which city? **Ivano-Frankivsk (Ukraine)**
  - Block C line 169: Ivano-Frankivsk | Ukraine | Stanislav | 1962 | renamed after writer Ivan Franko
- What was Khmelnytskyi (Ukraine) called before 1954? **Proskuriv**
  - Block C line 170: Khmelnytskyi | Ukraine | Proskuriv | 1954 | renamed after Bohdan Khmelnytsky
- Proskuriv is a former name of which city? **Khmelnytskyi (Ukraine)**
  - Block C line 170: Khmelnytskyi | Ukraine | Proskuriv | 1954 | renamed after Bohdan Khmelnytsky
- What was Kropyvnytskyi (Ukraine) called before 2016? **Kirovohrad**
  - Block C line 171: Kropyvnytskyi | Ukraine | Kirovohrad | 2016 | renamed under decommunization law
- Kirovohrad is a former name of which city? **Kropyvnytskyi (Ukraine)**
  - Block C line 171: Kropyvnytskyi | Ukraine | Kirovohrad | 2016 | renamed under decommunization law
- What was Austin (United States) called before 1839? **Waterloo**
  - Block C line 173: Austin | United States | Waterloo | 1839 | renamed Austin when chosen as Texas capital
- Waterloo is a former name of which city? **Austin (United States)**
  - Block C line 173: Austin | United States | Waterloo | 1839 | renamed Austin when chosen as Texas capital
- What was Bismarck (United States) called before 1873? **Edwinton**
  - Block C line 174: Bismarck | United States | Edwinton | 1873 | railway renamed it for Otto von Bismarck
- Edwinton is a former name of which city? **Bismarck (United States)**
  - Block C line 174: Bismarck | United States | Edwinton | 1873 | railway renamed it for Otto von Bismarck
- What was Hagatna (United States) called before 1998? **Agana**
  - Block C line 175: Hagatna | United States | Agana | 1998 | Guam capital took its Chamorro name
- Agana is a former name of which city? **Hagatna (United States)**
  - Block C line 175: Hagatna | United States | Agana | 1998 | Guam capital took its Chamorro name
- What was Jim Thorpe (United States) called before 1954? **Mauch Chunk**
  - Block C line 176: Jim Thorpe | United States | Mauch Chunk | 1954 | merged boroughs renamed for athlete Jim Thorpe
- Mauch Chunk is a former name of which city? **Jim Thorpe (United States)**
  - Block C line 176: Jim Thorpe | United States | Mauch Chunk | 1954 | merged boroughs renamed for athlete Jim Thorpe
- What was Sleepy Hollow (United States) called before 1996? **North Tarrytown**
  - Block C line 177: Sleepy Hollow | United States | North Tarrytown | 1996 | village took the area's historical name
- North Tarrytown is a former name of which city? **Sleepy Hollow (United States)**
  - Block C line 177: Sleepy Hollow | United States | North Tarrytown | 1996 | village took the area's historical name
- What was Truth or Consequences (United States) called before 1950? **Hot Springs**
  - Block C line 178: Truth or Consequences | United States | Hot Springs | 1950 | renamed after a radio quiz show
- Hot Springs is a former name of which city? **Truth or Consequences (United States)**
  - Block C line 178: Truth or Consequences | United States | Hot Springs | 1950 | renamed after a radio quiz show
- What was Utqiagvik (United States) called before 2016? **Barrow**
  - Block C line 179: Utqiagvik | United States | Barrow | 2016 | English name replaced by Inupiaq name
- Barrow is a former name of which city? **Utqiagvik (United States)**
  - Block C line 179: Utqiagvik | United States | Barrow | 2016 | English name replaced by Inupiaq name
- What was Ciudad Bolivar (Venezuela) called before 1846? **Angostura**
  - Block C line 180: Ciudad Bolivar | Venezuela | Angostura | 1846 | renamed in honour of Simon Bolivar
- Angostura is a former name of which city? **Ciudad Bolivar (Venezuela)**
  - Block C line 180: Ciudad Bolivar | Venezuela | Angostura | 1846 | renamed in honour of Simon Bolivar
- What was Ho Chi Minh City (Viet Nam) called before 1976? **Saigon**
  - Block C line 181: Ho Chi Minh City | Viet Nam | Saigon | 1976 | renamed at Vietnam's reunification
- Saigon is a former name of which city? **Ho Chi Minh City (Viet Nam)**
  - Block C line 181: Ho Chi Minh City | Viet Nam | Saigon | 1976 | renamed at Vietnam's reunification
- What was Kabwe (Zambia) called before 1966? **Broken Hill**
  - Block C line 182: Kabwe | Zambia | Broken Hill | 1966 | colonial name dropped after independence
- Broken Hill is a former name of which city? **Kabwe (Zambia)**
  - Block C line 182: Kabwe | Zambia | Broken Hill | 1966 | colonial name dropped after independence
- What was Chegutu (Zimbabwe) called before 1982? **Hartley**
  - Block C line 183: Chegutu | Zimbabwe | Hartley | 1982 | colonial name officially replaced
- Hartley is a former name of which city? **Chegutu (Zimbabwe)**
  - Block C line 183: Chegutu | Zimbabwe | Hartley | 1982 | colonial name officially replaced
- What was Hwange (Zimbabwe) called before 1982? **Wankie**
  - Block C line 184: Hwange | Zimbabwe | Wankie | 1982 | colonial name replaced
- Wankie is a former name of which city? **Hwange (Zimbabwe)**
  - Block C line 184: Hwange | Zimbabwe | Wankie | 1982 | colonial name replaced
- What was Kadoma (Zimbabwe) called before 1982? **Gatooma**
  - Block C line 185: Kadoma | Zimbabwe | Gatooma | 1982 | renamed in 1982 gazette of new names
- Gatooma is a former name of which city? **Kadoma (Zimbabwe)**
  - Block C line 185: Kadoma | Zimbabwe | Gatooma | 1982 | renamed in 1982 gazette of new names
- What was Masvingo (Zimbabwe) called before 1982? **Fort Victoria**
  - Block C line 186: Masvingo | Zimbabwe | Fort Victoria | 1982 | colonial name replaced (briefly Nyanda)
- Fort Victoria is a former name of which city? **Masvingo (Zimbabwe)**
  - Block C line 186: Masvingo | Zimbabwe | Fort Victoria | 1982 | colonial name replaced (briefly Nyanda)
- What was Mutare (Zimbabwe) called before 1982? **Umtali**
  - Block C line 187: Mutare | Zimbabwe | Umtali | 1982 | colonial name officially replaced
- Umtali is a former name of which city? **Mutare (Zimbabwe)**
  - Block C line 187: Mutare | Zimbabwe | Umtali | 1982 | colonial name officially replaced
- What was Zvishavane (Zimbabwe) called before 1982? **Shabani**
  - Block C line 188: Zvishavane | Zimbabwe | Shabani | 1982 | colonial name replaced with indigenous one
- Shabani is a former name of which city? **Zvishavane (Zimbabwe)**
  - Block C line 188: Zvishavane | Zimbabwe | Shabani | 1982 | colonial name replaced with indigenous one

## What was it called?

Wrong answers are drawn from the other questions' right answers of the same kind (all from Block A), never from the excluded pairs above.

- Which of these is a former name of Argentina, used from 1816? **United Provinces of the Rio de la Plata**
  - Block A: Argentina | 1816 | Spain | United Provinces of the Rio de la Plata (1816-1831) | none
- United Provinces of the Rio de la Plata (from 1816) is a former name of which country? **Argentina**
  - Block A: Argentina | 1816 | Spain | United Provinces of the Rio de la Plata (1816-1831) | none
- Which of these is a former name of Austria, used from 1918 to 1919? **German-Austria**
  - Block A: Austria | 1918 | Austria-Hungary (dissolution) | German-Austria (1918-1919) | none
- Which of these is a former name of Bangladesh, used until 1971? **East Pakistan**
  - Block A: Bangladesh | 1971 | Pakistan | East Pakistan (to 1971) | none
- East Pakistan (until 1971) is a former name of which country? **Bangladesh**
  - Block A: Bangladesh | 1971 | Pakistan | East Pakistan (to 1971) | none
- Which of these is a former name of Belarus, used from 1920 to 1991? **Byelorussia**
  - Block A: Belarus | 1991 | Soviet Union (dissolution) | Byelorussia (1920-1991) | none
- Byelorussia (from 1920 to 1991) is a former name of which country? **Belarus**
  - Block A: Belarus | 1991 | Soviet Union (dissolution) | Byelorussia (1920-1991) | none
- Which of these is a former name of Belize, used until 1973? **British Honduras**
  - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
- British Honduras (until 1973) is a former name of which country? **Belize**
  - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
- Which of these is a former name of Benin, used until 1975? **Dahomey**
  - Block A: Benin | 1960 | France | Dahomey (to 1975) | none
- Dahomey (until 1975) is a former name of which country? **Benin**
  - Block A: Benin | 1960 | France | Dahomey (to 1975) | none
- Which of these is a former name of Bolivia, used until 1825? **Upper Peru**
  - Block A: Bolivia | 1825 | Spain | Upper Peru (to 1825) | don't ask
- Upper Peru (until 1825) is a former name of which country? **Bolivia**
  - Block A: Bolivia | 1825 | Spain | Upper Peru (to 1825) | don't ask
- Which of these is a former name of Botswana, used from 1885 to 1966? **Bechuanaland**
  - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
- Bechuanaland (from 1885 to 1966) is a former name of which country? **Botswana**
  - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
- Which of these is a former name of Brazil, used from 1822 to 1889? **Empire of Brazil**
  - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
- Which of these is a former name of Burkina Faso, used until 1984? **Upper Volta**
  - Block A: Burkina Faso | 1960 | France | Upper Volta (to 1984) | none
- Upper Volta (until 1984) is a former name of which country? **Burkina Faso**
  - Block A: Burkina Faso | 1960 | France | Upper Volta (to 1984) | none
- Which of these is a former name of Cambodia, used from 1970 to 1975? **Khmer Republic**
  - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
- Khmer Republic (from 1970 to 1975) is a former name of which country? **Cambodia**
  - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
- Which of these is a former name of Cambodia, used from 1976 to 1989? **Kampuchea**
  - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
- Kampuchea (from 1976 to 1989) is a former name of which country? **Cambodia**
  - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
- Which of these is a former name of Canada, used from 1841 to 1867? **Province of Canada**
  - Block A: Canada | 1867 | United Kingdom (confederation, not independence) | Province of Canada (1841-1867) | none
- Which of these is a former name of the Central African Republic? **Ubangi-Shari**
  - Block A: Central African Republic | 1960 | France | Ubangi-Shari (to 1958); Central African Empire (1976-1979) | none
- Ubangi-Shari is a former name of which country? **Central African Republic**
  - Block A: Central African Republic | 1960 | France | Ubangi-Shari (to 1958); Central African Empire (1976-1979) | none
- Which of these is a former name of the Central African Republic, used from 1976 to 1979? **Central African Empire**
  - Block A: Central African Republic | 1960 | France | Ubangi-Shari (to 1958); Central African Empire (1976-1979) | none
- Which of these is a former name of China, used until 1912? **Qing Empire**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- Qing Empire (until 1912) is a former name of which country? **China**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- Which of these is a former name of Colombia, used from 1831 to 1858? **New Granada**
  - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
- New Granada (from 1831 to 1858) is a former name of which country? **Colombia**
  - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
- Which of these is a former name of Colombia, used from 1863 to 1886? **United States of Colombia**
  - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
- Which of these is a former name of the Democratic Republic of the Congo, used from 1885 to 1908? **Congo Free State**
  - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
- Which of these is a former name of the Democratic Republic of the Congo, used from 1908 to 1960? **Belgian Congo**
  - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
- Which of these is a former name of the Democratic Republic of the Congo, used from 1971 to 1997? **Zaire**
  - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
- Zaire (from 1971 to 1997) is a former name of which country? **Democratic Republic of the Congo**
  - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
- Which of these is a former name of Djibouti, used until 1967? **French Somaliland**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- French Somaliland (until 1967) is a former name of which country? **Djibouti**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- Which of these is a former name of Djibouti, used from 1967 to 1977? **Afars and Issas**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- Afars and Issas (from 1967 to 1977) is a former name of which country? **Djibouti**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- Which of these is a former name of the Dominican Republic, used until 1821? **Santo Domingo**
  - Block A: Dominican Republic | 1844 | Haiti | Santo Domingo (to 1821) | none
- Santo Domingo (until 1821) is a former name of which country? **Dominican Republic**
  - Block A: Dominican Republic | 1844 | Haiti | Santo Domingo (to 1821) | none
- Which of these is a former name of Egypt, used from 1958 to 1971? **United Arab Republic**
  - Block A: Egypt | 1922 | United Kingdom (protectorate) | United Arab Republic (1958-1971) | none
- United Arab Republic (from 1958 to 1971) is a former name of which country? **Egypt**
  - Block A: Egypt | 1922 | United Kingdom (protectorate) | United Arab Republic (1958-1971) | none
- Which of these is a former name of Equatorial Guinea, used until 1968? **Spanish Guinea**
  - Block A: Equatorial Guinea | 1968 | Spain | Spanish Guinea (to 1968) | Malabo to Ciudad de la Paz (2026)
- Which of these is a former name of Eswatini, used until 2018? **Swaziland**
  - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
- Swaziland (until 2018) is a former name of which country? **Eswatini**
  - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
- Which of these is a former name of Germany, used from 1949 to 1990? **West Germany**
  - Block A: Germany | don't ask | unification 1871, refounded 1949, reunified 1990 | West Germany (1949-1990) | Bonn to Berlin (1990)
- Which of these is a former name of Ghana, used until 1957? **Gold Coast**
  - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
- Gold Coast (until 1957) is a former name of which country? **Ghana**
  - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
- Which of these is a former name of Guinea, used until 1958? **French Guinea**
  - Block A: Guinea | 1958 | France | French Guinea (to 1958) | none
- Which of these is a former name of Guinea-Bissau, used until 1974? **Portuguese Guinea**
  - Block A: Guinea-Bissau | 1973 | Portugal | Portuguese Guinea (to 1974) | Bolama to Bissau (1941)
- Which of these is a former name of Guyana, used from 1831 to 1966? **British Guiana**
  - Block A: Guyana | 1966 | United Kingdom | British Guiana (1831-1966) | none
- British Guiana (from 1831 to 1966) is a former name of which country? **Guyana**
  - Block A: Guyana | 1966 | United Kingdom | British Guiana (1831-1966) | none
- Which of these is a former name of Haiti, used until 1804? **Saint-Domingue**
  - Block A: Haiti | 1804 | France | Saint-Domingue (to 1804) | none
- Saint-Domingue (until 1804) is a former name of which country? **Haiti**
  - Block A: Haiti | 1804 | France | Saint-Domingue (to 1804) | none
- Which of these is a former name of Iceland, used from 1918 to 1944? **Kingdom of Iceland**
  - Block A: Iceland | 1944 | Denmark | Kingdom of Iceland (1918-1944) | none
- Which of these is a former name of Indonesia, used until 1949? **Dutch East Indies**
  - Block A: Indonesia | 1945 | Netherlands | Dutch East Indies (to 1949) | none
- Dutch East Indies (until 1949) is a former name of which country? **Indonesia**
  - Block A: Indonesia | 1945 | Netherlands | Dutch East Indies (to 1949) | none
- Which of these is a former name of Iran, used until 1935? **Persia**
  - Block A: Iran | don't ask | never colonised | Persia (to 1935) | none
- Persia (until 1935) is a former name of which country? **Iran**
  - Block A: Iran | don't ask | never colonised | Persia (to 1935) | none
- Which of these is a former name of Iraq, used until 1921? **Mesopotamia**
  - Block A: Iraq | 1932 | United Kingdom (mandate) | Mesopotamia (to 1921) | none
- Mesopotamia (until 1921) is a former name of which country? **Iraq**
  - Block A: Iraq | 1932 | United Kingdom (mandate) | Mesopotamia (to 1921) | none
- Which of these is a former name of Ireland, used from 1922 to 1937? **Irish Free State**
  - Block A: Ireland | 1922 | United Kingdom | Irish Free State (1922-1937) | none
- Irish Free State (from 1922 to 1937) is a former name of which country? **Ireland**
  - Block A: Ireland | 1922 | United Kingdom | Irish Free State (1922-1937) | none
- Which of these is a former name of Jordan, used from 1921 to 1949? **Transjordan**
  - Block A: Jordan | 1946 | United Kingdom (mandate) | Transjordan (1921-1949) | none
- Transjordan (from 1921 to 1949) is a former name of which country? **Jordan**
  - Block A: Jordan | 1946 | United Kingdom (mandate) | Transjordan (1921-1949) | none
- Which of these is a former name of Kenya, used from 1895 to 1920? **British East Africa**
  - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
- British East Africa (from 1895 to 1920) is a former name of which country? **Kenya**
  - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
- Which of these is a former name of Kiribati, used until 1979? **Gilbert Islands**
  - Block A: Kiribati | 1979 | United Kingdom | Gilbert Islands (to 1979) | none
- Gilbert Islands (until 1979) is a former name of which country? **Kiribati**
  - Block A: Kiribati | 1979 | United Kingdom | Gilbert Islands (to 1979) | none
- Which of these is a former name of Kyrgyzstan, used until 1991? **Kirghizia**
  - Block A: Kyrgyzstan | 1991 | Soviet Union (dissolution) | Kirghizia (to 1991) | none
- Kirghizia (until 1991) is a former name of which country? **Kyrgyzstan**
  - Block A: Kyrgyzstan | 1991 | Soviet Union (dissolution) | Kirghizia (to 1991) | none
- Which of these is a former name of Lebanon, used from 1920 to 1926? **Greater Lebanon**
  - Block A: Lebanon | 1943 | France (mandate) | Greater Lebanon (1920-1926) | none
- Which of these is a former name of Lesotho, used until 1966? **Basutoland**
  - Block A: Lesotho | 1966 | United Kingdom | Basutoland (to 1966) | none
- Basutoland (until 1966) is a former name of which country? **Lesotho**
  - Block A: Lesotho | 1966 | United Kingdom | Basutoland (to 1966) | none
- Which of these is a former name of Libya, used from 1934 to 1943? **Italian Libya**
  - Block A: Libya | 1951 | UK and French administration | Italian Libya (1934-1943) | don't ask
- Which of these is a former name of Malawi, used from 1907 to 1964? **Nyasaland**
  - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
- Nyasaland (from 1907 to 1964) is a former name of which country? **Malawi**
  - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
- Which of these is a former name of Malaysia, used from 1948 to 1963? **Malaya**
  - Block A: Malaysia | 1957 | United Kingdom | Malaya (1948-1963) | none
- Malaya (from 1948 to 1963) is a former name of which country? **Malaysia**
  - Block A: Malaysia | 1957 | United Kingdom | Malaya (1948-1963) | none
- Which of these is a former name of Mali, used until 1958? **French Sudan**
  - Block A: Mali | 1960 | France (via the Mali Federation) | French Sudan (to 1958) | none
- French Sudan (until 1958) is a former name of which country? **Mali**
  - Block A: Mali | 1960 | France (via the Mali Federation) | French Sudan (to 1958) | none
- Which of these is a former name of Mauritius, used until 1810? **Isle de France**
  - Block A: Mauritius | 1968 | United Kingdom | Isle de France (to 1810) | none
- Isle de France (until 1810) is a former name of which country? **Mauritius**
  - Block A: Mauritius | 1968 | United Kingdom | Isle de France (to 1810) | none
- Which of these is a former name of Mexico, used until 1821? **New Spain**
  - Block A: Mexico | 1821 | Spain | New Spain (to 1821) | none
- New Spain (until 1821) is a former name of which country? **Mexico**
  - Block A: Mexico | 1821 | Spain | New Spain (to 1821) | none
- Which of these is a former name of Moldova, used from 1940 to 1991? **Moldavia**
  - Block A: Moldova | 1991 | Soviet Union (dissolution) | Moldavia (1940-1991) | none
- Moldavia (from 1940 to 1991) is a former name of which country? **Moldova**
  - Block A: Moldova | 1991 | Soviet Union (dissolution) | Moldavia (1940-1991) | none
- Which of these is a former name of Mongolia, used until 1911? **Outer Mongolia**
  - Block A: Mongolia | don't ask | Qing China, then Republic of China | Outer Mongolia (to 1911) | none
- Which of these is a former name of Myanmar, used until 1989? **Burma**
  - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
- Burma (until 1989) is a former name of which country? **Myanmar**
  - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
- Which of these is a former name of Namibia, used from 1884 to 1915? **German South West Africa**
  - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
- German South West Africa (from 1884 to 1915) is a former name of which country? **Namibia**
  - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
- Which of these is a former name of Namibia, used until 1990? **South West Africa**
  - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
- South West Africa (until 1990) is a former name of which country? **Namibia**
  - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
- Which of these is a former name of Nauru? **Pleasant Island**
  - Block A: Nauru | 1968 | Australia (UN trust territory) | Pleasant Island (to 1888) | none
- Pleasant Island is a former name of which country? **Nauru**
  - Block A: Nauru | 1968 | Australia (UN trust territory) | Pleasant Island (to 1888) | none
- Which of these is a former name of North Macedonia, used from 1991 to 2019? **Macedonia**
  - Block A: North Macedonia | 1991 | Yugoslavia | Macedonia (1991-2019) | none
- Which of these is a former name of Oman, used from 1856 to 1970? **Muscat and Oman**
  - Block A: Oman | don't ask | never colonised | Muscat and Oman (1856-1970) | don't ask
- Which of these is a former name of Papua New Guinea, used from 1949 to 1971? **Papua and New Guinea**
  - Block A: Papua New Guinea | 1975 | Australia | Papua and New Guinea (1949-1971) | none
- Which of these is a former name of the Republic of the Congo, used until 1958? **Middle Congo**
  - Block A: Republic of the Congo | 1960 | France | Middle Congo (to 1958) | none
- Which of these is a former name of Russia, used from 1917 to 1991? **Russian SFSR**
  - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
- Russian SFSR (from 1917 to 1991) is a former name of which country? **Russia**
  - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
- Which of these is a former name of Samoa, used from 1900 to 1914? **German Samoa**
  - Block A: Samoa | 1962 | New Zealand (UN trust territory) | German Samoa (1900-1914); Western Samoa (to 1997) | none
- Which of these is a former name of Samoa, used until 1997? **Western Samoa**
  - Block A: Samoa | 1962 | New Zealand (UN trust territory) | German Samoa (1900-1914); Western Samoa (to 1997) | none
- Which of these is a former name of Saudi Arabia, used until 1932? **Hejaz and Nejd**
  - Block A: Saudi Arabia | 1932 | unification of Hejaz and Nejd | Hejaz and Nejd (to 1932) | don't ask
- Hejaz and Nejd (until 1932) is a former name of which country? **Saudi Arabia**
  - Block A: Saudi Arabia | 1932 | unification of Hejaz and Nejd | Hejaz and Nejd (to 1932) | don't ask
- Which of these is a former name of Singapore, used from 1942 to 1945? **Syonan-to**
  - Block A: Singapore | 1965 | Malaysia | Syonan-to (1942-1945) | none
- Syonan-to (from 1942 to 1945) is a former name of which country? **Singapore**
  - Block A: Singapore | 1965 | Malaysia | Syonan-to (1942-1945) | none
- Which of these is a former name of the Solomon Islands, used until 1975? **British Solomon Islands**
  - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
- Which of these is a former name of South Africa, used from 1910 to 1961? **Union of South Africa**
  - Block A: South Africa | 1910 | United Kingdom (union, full sovereignty 1931) | Union of South Africa (1910-1961) | don't ask
- Which of these is a former name of Sri Lanka, used until 1972? **Ceylon**
  - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
- Ceylon (until 1972) is a former name of which country? **Sri Lanka**
  - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
- Which of these is a former name of Sudan, used from 1899 to 1956? **Anglo-Egyptian Sudan**
  - Block A: Sudan | 1956 | United Kingdom and Egypt (condominium) | Anglo-Egyptian Sudan (1899-1956) | none
- Which of these is a former name of Suriname, used until 1954? **Dutch Guiana**
  - Block A: Suriname | 1975 | Netherlands | Dutch Guiana (to 1954) | none
- Dutch Guiana (until 1954) is a former name of which country? **Suriname**
  - Block A: Suriname | 1975 | Netherlands | Dutch Guiana (to 1954) | none
- Which of these is a former name of Tanzania, used until 1964? **Tanganyika**
  - Block A: Tanzania | 1964 | union of Tanganyika and Zanzibar | Tanganyika (to 1964) | Dar es Salaam to Dodoma (1996)
- Tanganyika (until 1964) is a former name of which country? **Tanzania**
  - Block A: Tanzania | 1964 | union of Tanganyika and Zanzibar | Tanganyika (to 1964) | Dar es Salaam to Dodoma (1996)
- Which of these is a former name of Thailand, used until 1939 and from 1945 to 1949? **Siam**
  - Block A: Thailand | don't ask | never colonised | Siam (to 1939; 1945-1949) | none
- Siam (until 1939 and from 1945 to 1949) is a former name of which country? **Thailand**
  - Block A: Thailand | don't ask | never colonised | Siam (to 1939; 1945-1949) | none
- Which of these is a former name of Timor-Leste, used until 1975? **Portuguese Timor**
  - Block A: Timor-Leste | 2002 | Indonesia (via UN administration) | Portuguese Timor (to 1975) | none
- Which of these is a former name of Togo, used from 1916 to 1960? **French Togoland**
  - Block A: Togo | 1960 | France | French Togoland (1916-1960) | none
- French Togoland (from 1916 to 1960) is a former name of which country? **Togo**
  - Block A: Togo | 1960 | France | French Togoland (1916-1960) | none
- Which of these is a former name of Turkmenistan, used until 1991? **Turkmenia**
  - Block A: Turkmenistan | 1991 | Soviet Union (dissolution) | Turkmenia (to 1991) | none
- Turkmenia (until 1991) is a former name of which country? **Turkmenistan**
  - Block A: Turkmenistan | 1991 | Soviet Union (dissolution) | Turkmenia (to 1991) | none
- Which of these is a former name of Tuvalu? **Ellice Islands**
  - Block A: Tuvalu | 1978 | United Kingdom | Ellice Islands (to 1975) | none
- Ellice Islands is a former name of which country? **Tuvalu**
  - Block A: Tuvalu | 1978 | United Kingdom | Ellice Islands (to 1975) | none
- Which of these is a former name of Ukraine, used from 1919 to 1991? **Ukrainian SSR**
  - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
- Ukrainian SSR (from 1919 to 1991) is a former name of which country? **Ukraine**
  - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
- Which of these is a former name of the United Arab Emirates, used until 1971? **Trucial States**
  - Block A: United Arab Emirates | 1971 | United Kingdom (protectorate) | Trucial States (to 1971) | none
- Trucial States (until 1971) is a former name of which country? **United Arab Emirates**
  - Block A: United Arab Emirates | 1971 | United Kingdom (protectorate) | Trucial States (to 1971) | none
- Which of these is a former name of the United Kingdom? **Kingdom of Great Britain**
  - Block A: United Kingdom | don't ask | never independent from anyone | Kingdom of Great Britain (to 1800) | none
- Kingdom of Great Britain is a former name of which country? **United Kingdom**
  - Block A: United Kingdom | don't ask | never independent from anyone | Kingdom of Great Britain (to 1800) | none
- Which of these is a former name of Uruguay? **Cisplatina**
  - Block A: Uruguay | 1828 | Brazil | Cisplatina (1821-1828) | none
- Cisplatina is a former name of which country? **Uruguay**
  - Block A: Uruguay | 1828 | Brazil | Cisplatina (1821-1828) | none
- Which of these is a former name of Vanuatu, used until 1980? **New Hebrides**
  - Block A: Vanuatu | 1980 | United Kingdom and France | New Hebrides (to 1980) | none
- New Hebrides (until 1980) is a former name of which country? **Vanuatu**
  - Block A: Vanuatu | 1980 | United Kingdom and France | New Hebrides (to 1980) | none
- Which of these is a former name of Viet Nam, used from 1839 to 1945? **Dai Nam**
  - Block A: Viet Nam | 1976 | reunification of North and South | Dai Nam (1839-1945) | Hue to Hanoi (1945)
- Which of these is a former name of Zambia, used from 1911 to 1964? **Northern Rhodesia**
  - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
- Northern Rhodesia (from 1911 to 1964) is a former name of which country? **Zambia**
  - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
- Which of these is a former name of Zimbabwe, used from 1898 to 1965? **Southern Rhodesia**
  - Block A: Zimbabwe | 1980 | United Kingdom | Southern Rhodesia (1898-1965); Rhodesia (1965-1979) | none
- Southern Rhodesia (from 1898 to 1965) is a former name of which country? **Zimbabwe**
  - Block A: Zimbabwe | 1980 | United Kingdom | Southern Rhodesia (1898-1965); Rhodesia (1965-1979) | none
- Which of these is a former name of Zimbabwe, used from 1965 to 1979? **Rhodesia**
  - Block A: Zimbabwe | 1980 | United Kingdom | Southern Rhodesia (1898-1965); Rhodesia (1965-1979) | none
- Rhodesia (from 1965 to 1979) is a former name of which country? **Zimbabwe**
  - Block A: Zimbabwe | 1980 | United Kingdom | Southern Rhodesia (1898-1965); Rhodesia (1965-1979) | none

## Independent from whom?

Wrong answers are drawn from the other questions' right answers of the same kind (all from Block A), never from the excluded pairs above.

- In 1919, Afghanistan became independent from… **United Kingdom**
  - Block A: Afghanistan | 1919 | United Kingdom (control of foreign affairs) | none | none
- In 1912, Albania became independent from… **Ottoman Empire**
  - Block A: Albania | 1912 | Ottoman Empire | none | Durres to Tirana (1920)
- In 1962, Algeria became independent from… **France**
  - Block A: Algeria | 1962 | France | none | none
- In 1975, Angola became independent from… **Portugal**
  - Block A: Angola | 1975 | Portugal | none | none
- In 1981, Antigua and Barbuda became independent from… **United Kingdom**
  - Block A: Antigua and Barbuda | 1981 | United Kingdom | none | none
- In 1816, Argentina became independent from… **Spain**
  - Block A: Argentina | 1816 | Spain | United Provinces of the Rio de la Plata (1816-1831) | none
- In 1991, Armenia became independent on the dissolution of… **Soviet Union**
  - Block A: Armenia | 1991 | Soviet Union (dissolution) | none | none
- In 1991, Azerbaijan became independent on the dissolution of… **Soviet Union**
  - Block A: Azerbaijan | 1991 | Soviet Union (dissolution) | none | none
- In 1973, the Bahamas became independent from… **United Kingdom**
  - Block A: Bahamas | 1973 | United Kingdom | none | none
- In 1971, Bahrain became independent from… **United Kingdom**
  - Block A: Bahrain | 1971 | United Kingdom (protectorate) | none | none
- In 1971, Bangladesh became independent from… **Pakistan**
  - Block A: Bangladesh | 1971 | Pakistan | East Pakistan (to 1971) | none
- In 1966, Barbados became independent from… **United Kingdom**
  - Block A: Barbados | 1966 | United Kingdom | none | none
- In 1991, Belarus became independent on the dissolution of… **Soviet Union**
  - Block A: Belarus | 1991 | Soviet Union (dissolution) | Byelorussia (1920-1991) | none
- In 1830, Belgium became independent from… **Netherlands**
  - Block A: Belgium | 1830 | Netherlands | none | none
- In 1981, Belize became independent from… **United Kingdom**
  - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
- In 1960, Benin became independent from… **France**
  - Block A: Benin | 1960 | France | Dahomey (to 1975) | none
- In 1825, Bolivia became independent from… **Spain**
  - Block A: Bolivia | 1825 | Spain | Upper Peru (to 1825) | don't ask
- In 1992, Bosnia and Herzegovina became independent from… **Yugoslavia**
  - Block A: Bosnia and Herzegovina | 1992 | Yugoslavia | none | none
- In 1966, Botswana became independent from… **United Kingdom**
  - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
- In 1822, Brazil became independent from… **Portugal**
  - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
- In 1984, Brunei became independent from… **United Kingdom**
  - Block A: Brunei | 1984 | United Kingdom (protectorate) | none | none
- In 1908, Bulgaria became independent from… **Ottoman Empire**
  - Block A: Bulgaria | 1908 | Ottoman Empire | none | Tarnovo to Sofia (1879)
- In 1960, Burkina Faso became independent from… **France**
  - Block A: Burkina Faso | 1960 | France | Upper Volta (to 1984) | none
- In 1962, Burundi became independent from… **Belgium**
  - Block A: Burundi | 1962 | Belgium (UN trust territory) | none | Bujumbura to Gitega (2019)
- In 1975, Cabo Verde became independent from… **Portugal**
  - Block A: Cabo Verde | 1975 | Portugal | none | none
- In 1953, Cambodia became independent from… **France**
  - Block A: Cambodia | 1953 | France | Khmer Republic (1970-1975); Kampuchea (1976-1989) | none
- In 1960, Cameroon became independent from… **France**
  - Block A: Cameroon | 1960 | France (British Southern Cameroons joined 1961) | none | none
- In 1960, the Central African Republic became independent from… **France**
  - Block A: Central African Republic | 1960 | France | Ubangi-Shari (to 1958); Central African Empire (1976-1979) | none
- In 1960, Chad became independent from… **France**
  - Block A: Chad | 1960 | France | none | none
- In 1818, Chile became independent from… **Spain**
  - Block A: Chile | 1818 | Spain | none | none
- In 1819, Colombia became independent from… **Spain**
  - Block A: Colombia | 1819 | Spain | Gran Colombia (1819-1831); New Granada (1831-1858); United States of Colombia (1863-1886) | none
- In 1975, the Comoros became independent from… **France**
  - Block A: Comoros | 1975 | France | none | Dzaoudzi to Moroni (1958)
- In 1821, Costa Rica became independent from… **Spain**
  - Block A: Costa Rica | 1821 | Spain | none | Cartago to San Jose (1823)
- In 1960, Cote d'Ivoire became independent from… **France**
  - Block A: Cote d'Ivoire | 1960 | France | none | Abidjan to Yamoussoukro (1983)
- In 1991, Croatia became independent from… **Yugoslavia**
  - Block A: Croatia | 1991 | Yugoslavia | none | none
- In 1960, Cyprus became independent from… **United Kingdom**
  - Block A: Cyprus | 1960 | United Kingdom | none | none
- In 1993, Czechia became independent on the dissolution of… **Czechoslovakia**
  - Block A: Czechia | 1993 | Czechoslovakia (dissolution) | none | none
- In 1960, the Democratic Republic of the Congo became independent from… **Belgium**
  - Block A: Democratic Republic of the Congo | 1960 | Belgium | Congo Free State (1885-1908); Belgian Congo (1908-1960); Zaire (1971-1997) | none
- In 1977, Djibouti became independent from… **France**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- In 1978, Dominica became independent from… **United Kingdom**
  - Block A: Dominica | 1978 | United Kingdom | none | none
- In 1844, the Dominican Republic became independent from… **Haiti**
  - Block A: Dominican Republic | 1844 | Haiti | Santo Domingo (to 1821) | none
- In 1830, Ecuador became independent from… **Gran Colombia**
  - Block A: Ecuador | 1830 | Gran Colombia | none | none
- Egypt became independent from… **United Kingdom**
  - Block A: Egypt | 1922 | United Kingdom (protectorate) | United Arab Republic (1958-1971) | none
- In 1821, El Salvador became independent from… **Spain**
  - Block A: El Salvador | 1821 | Spain | none | none
- In 1968, Equatorial Guinea became independent from… **Spain**
  - Block A: Equatorial Guinea | 1968 | Spain | Spanish Guinea (to 1968) | Malabo to Ciudad de la Paz (2026)
- Eritrea became independent from… **Ethiopia**
  - Block A: Eritrea | 1993 | Ethiopia | none | Massawa to Asmara (1897)
- Estonia first became independent from… **Russian Empire**
  - Block A: Estonia | 1918 | Russian Empire (restored 1991 from Soviet Union) | none | none
- In 1968, Eswatini became independent from… **United Kingdom**
  - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
- In 1970, Fiji became independent from… **United Kingdom**
  - Block A: Fiji | 1970 | United Kingdom | none | Levuka to Suva (1882)
- In 1917, Finland became independent from… **Russia**
  - Block A: Finland | 1917 | Russia | none | Turku to Helsinki (1812)
- In 1960, Gabon became independent from… **France**
  - Block A: Gabon | 1960 | France | none | none
- In 1965, the Gambia became independent from… **United Kingdom**
  - Block A: Gambia | 1965 | United Kingdom | none | none
- In 1991, Georgia became independent on the dissolution of… **Soviet Union**
  - Block A: Georgia | 1991 | Soviet Union (dissolution) | none | none
- In 1957, Ghana became independent from… **United Kingdom**
  - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
- In 1830, Greece became independent from… **Ottoman Empire**
  - Block A: Greece | 1830 | Ottoman Empire | none | Nafplio to Athens (1834)
- In 1974, Grenada became independent from… **United Kingdom**
  - Block A: Grenada | 1974 | United Kingdom | none | none
- In 1821, Guatemala became independent from… **Spain**
  - Block A: Guatemala | 1821 | Spain | none | none
- In 1958, Guinea became independent from… **France**
  - Block A: Guinea | 1958 | France | French Guinea (to 1958) | none
- Guinea-Bissau became independent from… **Portugal**
  - Block A: Guinea-Bissau | 1973 | Portugal | Portuguese Guinea (to 1974) | Bolama to Bissau (1941)
- In 1966, Guyana became independent from… **United Kingdom**
  - Block A: Guyana | 1966 | United Kingdom | British Guiana (1831-1966) | none
- In 1804, Haiti became independent from… **France**
  - Block A: Haiti | 1804 | France | Saint-Domingue (to 1804) | none
- In 1821, Honduras became independent from… **Spain**
  - Block A: Honduras | 1821 | Spain | none | Comayagua to Tegucigalpa (1880)
- Iceland became independent from… **Denmark**
  - Block A: Iceland | 1944 | Denmark | Kingdom of Iceland (1918-1944) | none
- In 1947, India became independent from… **United Kingdom**
  - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
- Indonesia became independent from… **Netherlands**
  - Block A: Indonesia | 1945 | Netherlands | Dutch East Indies (to 1949) | none
- In 1932, Iraq became independent from… **United Kingdom**
  - Block A: Iraq | 1932 | United Kingdom (mandate) | Mesopotamia (to 1921) | none
- In 1922, Ireland became independent from… **United Kingdom**
  - Block A: Ireland | 1922 | United Kingdom | Irish Free State (1922-1937) | none
- In 1948, Israel became independent from… **United Kingdom**
  - Block A: Israel | 1948 | United Kingdom (end of mandate) | none | don't ask
- In 1962, Jamaica became independent from… **United Kingdom**
  - Block A: Jamaica | 1962 | United Kingdom | none | Spanish Town to Kingston (1872)
- In 1946, Jordan became independent from… **United Kingdom**
  - Block A: Jordan | 1946 | United Kingdom (mandate) | Transjordan (1921-1949) | none
- In 1991, Kazakhstan became independent on the dissolution of… **Soviet Union**
  - Block A: Kazakhstan | 1991 | Soviet Union (dissolution) | none | Almaty to Astana (1997)
- In 1963, Kenya became independent from… **United Kingdom**
  - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
- In 1979, Kiribati became independent from… **United Kingdom**
  - Block A: Kiribati | 1979 | United Kingdom | Gilbert Islands (to 1979) | none
- In 1961, Kuwait became independent from… **United Kingdom**
  - Block A: Kuwait | 1961 | United Kingdom (protectorate) | none | none
- In 1991, Kyrgyzstan became independent on the dissolution of… **Soviet Union**
  - Block A: Kyrgyzstan | 1991 | Soviet Union (dissolution) | Kirghizia (to 1991) | none
- In 1953, Laos became independent from… **France**
  - Block A: Laos | 1953 | France | none | none
- Latvia first became independent from… **Russian Empire**
  - Block A: Latvia | 1918 | Russian Empire (restored 1991 from Soviet Union) | none | none
- In 1943, Lebanon became independent from… **France**
  - Block A: Lebanon | 1943 | France (mandate) | Greater Lebanon (1920-1926) | none
- In 1966, Lesotho became independent from… **United Kingdom**
  - Block A: Lesotho | 1966 | United Kingdom | Basutoland (to 1966) | none
- In 1806, Liechtenstein became independent on the dissolution of… **Holy Roman Empire**
  - Block A: Liechtenstein | 1806 | Holy Roman Empire (dissolution) | none | none
- Lithuania first became independent from… **Russian Empire**
  - Block A: Lithuania | 1918 | Russian Empire (restored 1990 from Soviet Union) | none | don't ask
- In 1960, Madagascar became independent from… **France**
  - Block A: Madagascar | 1960 | France | none | none
- In 1964, Malawi became independent from… **United Kingdom**
  - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
- Malaysia became independent from… **United Kingdom**
  - Block A: Malaysia | 1957 | United Kingdom | Malaya (1948-1963) | none
- In 1965, the Maldives became independent from… **United Kingdom**
  - Block A: Maldives | 1965 | United Kingdom (protectorate) | none | none
- In 1960, Mali became independent from… **France**
  - Block A: Mali | 1960 | France (via the Mali Federation) | French Sudan (to 1958) | none
- In 1964, Malta became independent from… **United Kingdom**
  - Block A: Malta | 1964 | United Kingdom | none | none
- The Marshall Islands became independent from… **United States**
  - Block A: Marshall Islands | 1986 | US-administered UN trust territory | none | none
- In 1960, Mauritania became independent from… **France**
  - Block A: Mauritania | 1960 | France | none | none
- In 1968, Mauritius became independent from… **United Kingdom**
  - Block A: Mauritius | 1968 | United Kingdom | Isle de France (to 1810) | none
- In 1821, Mexico became independent from… **Spain**
  - Block A: Mexico | 1821 | Spain | New Spain (to 1821) | none
- Micronesia became independent from… **United States**
  - Block A: Micronesia | 1986 | US-administered UN trust territory | none | Kolonia to Palikir (1989)
- In 1991, Moldova became independent on the dissolution of… **Soviet Union**
  - Block A: Moldova | 1991 | Soviet Union (dissolution) | Moldavia (1940-1991) | none
- In 2006, Montenegro became independent from… **Serbia and Montenegro**
  - Block A: Montenegro | 2006 | Serbia and Montenegro | none | Cetinje to Podgorica (1946)
- In 1975, Mozambique became independent from… **Portugal**
  - Block A: Mozambique | 1975 | Portugal | none | Island of Mozambique to Lourenco Marques (1898)
- In 1948, Myanmar became independent from… **United Kingdom**
  - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
- In 1990, Namibia became independent from… **South Africa**
  - Block A: Namibia | 1990 | South Africa | German South West Africa (1884-1915); South West Africa (to 1990) | none
- In 1968, Nauru became independent from… **Australia**
  - Block A: Nauru | 1968 | Australia (UN trust territory) | Pleasant Island (to 1888) | none
- In 1821, Nicaragua became independent from… **Spain**
  - Block A: Nicaragua | 1821 | Spain | none | don't ask
- In 1960, Niger became independent from… **France**
  - Block A: Niger | 1960 | France | none | don't ask
- In 1960, Nigeria became independent from… **United Kingdom**
  - Block A: Nigeria | 1960 | United Kingdom | none | Lagos to Abuja (1991)
- In 1991, North Macedonia became independent from… **Yugoslavia**
  - Block A: North Macedonia | 1991 | Yugoslavia | Macedonia (1991-2019) | none
- In 1905, Norway became independent from… **Sweden**
  - Block A: Norway | 1905 | Sweden (union dissolved) | none | none
- In 1947, Pakistan became independent from… **United Kingdom**
  - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
- In 1994, Palau became independent from… **United States**
  - Block A: Palau | 1994 | US-administered UN trust territory | none | Koror to Ngerulmud (2006)
- In 1903, Panama became independent from… **Colombia**
  - Block A: Panama | 1903 | Colombia | none | none
- In 1975, Papua New Guinea became independent from… **Australia**
  - Block A: Papua New Guinea | 1975 | Australia | Papua and New Guinea (1949-1971) | none
- In 1811, Paraguay became independent from… **Spain**
  - Block A: Paraguay | 1811 | Spain | none | none
- In 1821, Peru became independent from… **Spain**
  - Block A: Peru | 1821 | Spain | none | none
- The Philippines became independent from… **United States**
  - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
- In 1971, Qatar became independent from… **United Kingdom**
  - Block A: Qatar | 1971 | United Kingdom (protectorate) | none | none
- In 1960, the Republic of the Congo became independent from… **France**
  - Block A: Republic of the Congo | 1960 | France | Middle Congo (to 1958) | none
- Romania became independent from… **Ottoman Empire**
  - Block A: Romania | 1877 | Ottoman Empire | none | none
- In 1962, Rwanda became independent from… **Belgium**
  - Block A: Rwanda | 1962 | Belgium (UN trust territory) | none | none
- In 1983, Saint Kitts and Nevis became independent from… **United Kingdom**
  - Block A: Saint Kitts and Nevis | 1983 | United Kingdom | none | none
- In 1979, Saint Lucia became independent from… **United Kingdom**
  - Block A: Saint Lucia | 1979 | United Kingdom | none | none
- In 1979, Saint Vincent and the Grenadines became independent from… **United Kingdom**
  - Block A: Saint Vincent and the Grenadines | 1979 | United Kingdom | none | none
- In 1962, Samoa became independent from… **New Zealand**
  - Block A: Samoa | 1962 | New Zealand (UN trust territory) | German Samoa (1900-1914); Western Samoa (to 1997) | none
- In 1975, Sao Tome and Principe became independent from… **Portugal**
  - Block A: Sao Tome and Principe | 1975 | Portugal | none | none
- In 1960, Senegal became independent from… **France**
  - Block A: Senegal | 1960 | France (via the Mali Federation) | none | don't ask
- In 1878, Serbia became independent from… **Ottoman Empire**
  - Block A: Serbia | 1878 | Ottoman Empire | none | Kragujevac to Belgrade (1841)
- In 1976, Seychelles became independent from… **United Kingdom**
  - Block A: Seychelles | 1976 | United Kingdom | none | none
- In 1961, Sierra Leone became independent from… **United Kingdom**
  - Block A: Sierra Leone | 1961 | United Kingdom | none | none
- In 1965, Singapore became independent from… **Malaysia**
  - Block A: Singapore | 1965 | Malaysia | Syonan-to (1942-1945) | none
- In 1991, Slovenia became independent from… **Yugoslavia**
  - Block A: Slovenia | 1991 | Yugoslavia | none | none
- In 1978, the Solomon Islands became independent from… **United Kingdom**
  - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
- In 2011, South Sudan became independent from… **Sudan**
  - Block A: South Sudan | 2011 | Sudan | none | none
- In 1948, Sri Lanka became independent from… **United Kingdom**
  - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
- In 1975, Suriname became independent from… **Netherlands**
  - Block A: Suriname | 1975 | Netherlands | Dutch Guiana (to 1954) | none
- In 1946, Syria became independent from… **France**
  - Block A: Syria | 1946 | France (mandate) | none | none
- In 1991, Tajikistan became independent on the dissolution of… **Soviet Union**
  - Block A: Tajikistan | 1991 | Soviet Union (dissolution) | none | none
- Timor-Leste became independent from… **Indonesia**
  - Block A: Timor-Leste | 2002 | Indonesia (via UN administration) | Portuguese Timor (to 1975) | none
- In 1960, Togo became independent from… **France**
  - Block A: Togo | 1960 | France | French Togoland (1916-1960) | none
- In 1962, Trinidad and Tobago became independent from… **United Kingdom**
  - Block A: Trinidad and Tobago | 1962 | United Kingdom | none | none
- In 1956, Tunisia became independent from… **France**
  - Block A: Tunisia | 1956 | France | none | none
- In 1991, Turkmenistan became independent on the dissolution of… **Soviet Union**
  - Block A: Turkmenistan | 1991 | Soviet Union (dissolution) | Turkmenia (to 1991) | none
- In 1978, Tuvalu became independent from… **United Kingdom**
  - Block A: Tuvalu | 1978 | United Kingdom | Ellice Islands (to 1975) | none
- In 1962, Uganda became independent from… **United Kingdom**
  - Block A: Uganda | 1962 | United Kingdom | none | Entebbe to Kampala (1962)
- In 1991, Ukraine became independent on the dissolution of… **Soviet Union**
  - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
- In 1971, the United Arab Emirates became independent from… **United Kingdom**
  - Block A: United Arab Emirates | 1971 | United Kingdom (protectorate) | Trucial States (to 1971) | none
- In 1776, the United States became independent from… **Great Britain**
  - Block A: United States | 1776 | Great Britain | none | Philadelphia to Washington (1800)
- In 1828, Uruguay became independent from… **Brazil**
  - Block A: Uruguay | 1828 | Brazil | Cisplatina (1821-1828) | none
- In 1991, Uzbekistan became independent on the dissolution of… **Soviet Union**
  - Block A: Uzbekistan | 1991 | Soviet Union (dissolution) | none | Samarkand to Tashkent (1930)
- In 1830, Venezuela became independent from… **Gran Colombia**
  - Block A: Venezuela | 1830 | Gran Colombia | none | none
- In 1964, Zambia became independent from… **United Kingdom**
  - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
- Zimbabwe became independent from… **United Kingdom**
  - Block A: Zimbabwe | 1980 | United Kingdom | Southern Rhodesia (1898-1965); Rhodesia (1965-1979) | none

## Capital on the move

Wrong answers are drawn from the other questions' right answers of the same kind (all from Block A), never from the excluded pairs above.

- In 1920, the capital of Albania moved from Durres to… **Tirana**
  - Block A: Albania | 1912 | Ottoman Empire | none | Durres to Tirana (1920)
- In 1920, Albania moved its capital to Tirana. Where was it before? **Durres**
  - Block A: Albania | 1912 | Ottoman Empire | none | Durres to Tirana (1920)
- In 1920, which country moved its capital from Durres to Tirana? **Albania**
  - Block A: Albania | 1912 | Ottoman Empire | none | Durres to Tirana (1920)
- In 1927, the capital of Australia moved from Melbourne to… **Canberra**
  - Block A: Australia | 1901 | United Kingdom (federation of colonies) | none | Melbourne to Canberra (1927)
- In 1927, Australia moved its capital to Canberra. Where was it before? **Melbourne**
  - Block A: Australia | 1901 | United Kingdom (federation of colonies) | none | Melbourne to Canberra (1927)
- In 1927, which country moved its capital from Melbourne to Canberra? **Australia**
  - Block A: Australia | 1901 | United Kingdom (federation of colonies) | none | Melbourne to Canberra (1927)
- In 1970, the capital of Belize moved from Belize City to… **Belmopan**
  - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
- In 1970, Belize moved its capital to Belmopan. Where was it before? **Belize City**
  - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
- In 1970, which country moved its capital from Belize City to Belmopan? **Belize**
  - Block A: Belize | 1981 | United Kingdom | British Honduras (to 1973) | Belize City to Belmopan (1970)
- In 1961, the capital of Bhutan moved from Punakha to… **Thimphu**
  - Block A: Bhutan | don't ask | never colonised | none | Punakha to Thimphu (1961)
- In 1961, Bhutan moved its capital to Thimphu. Where was it before? **Punakha**
  - Block A: Bhutan | don't ask | never colonised | none | Punakha to Thimphu (1961)
- In 1961, which country moved its capital from Punakha to Thimphu? **Bhutan**
  - Block A: Bhutan | don't ask | never colonised | none | Punakha to Thimphu (1961)
- In 1965, the capital of Botswana moved from Mafeking to… **Gaborone**
  - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
- In 1965, Botswana moved its capital to Gaborone. Where was it before? **Mafeking**
  - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
- In 1965, which country moved its capital from Mafeking to Gaborone? **Botswana**
  - Block A: Botswana | 1966 | United Kingdom | Bechuanaland (1885-1966) | Mafeking to Gaborone (1965)
- In 1960, the capital of Brazil moved from Rio de Janeiro to… **Brasilia**
  - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
- In 1960, Brazil moved its capital to Brasilia. Where was it before? **Rio de Janeiro**
  - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
- In 1960, which country moved its capital from Rio de Janeiro to Brasilia? **Brazil**
  - Block A: Brazil | 1822 | Portugal | Empire of Brazil (1822-1889) | Rio de Janeiro to Brasilia (1960)
- In 1879, the capital of Bulgaria moved from Tarnovo to… **Sofia**
  - Block A: Bulgaria | 1908 | Ottoman Empire | none | Tarnovo to Sofia (1879)
- In 1879, Bulgaria moved its capital to Sofia. Where was it before? **Tarnovo**
  - Block A: Bulgaria | 1908 | Ottoman Empire | none | Tarnovo to Sofia (1879)
- In 1879, which country moved its capital from Tarnovo to Sofia? **Bulgaria**
  - Block A: Bulgaria | 1908 | Ottoman Empire | none | Tarnovo to Sofia (1879)
- In 2019, the political capital of Burundi moved from Bujumbura to… **Gitega**
  - Block A: Burundi | 1962 | Belgium (UN trust territory) | none | Bujumbura to Gitega (2019)
- In 2019, Burundi moved its political capital to Gitega. Where was it before? **Bujumbura**
  - Block A: Burundi | 1962 | Belgium (UN trust territory) | none | Bujumbura to Gitega (2019)
- In 2019, which country moved its political capital from Bujumbura to Gitega? **Burundi**
  - Block A: Burundi | 1962 | Belgium (UN trust territory) | none | Bujumbura to Gitega (2019)
- In 1928, the capital of China moved from Beijing to… **Nanjing**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- In 1928, China moved its capital to Nanjing. Where was it before? **Beijing**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- In 1928, which country moved its capital from Beijing to Nanjing? **China**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- In 1949, the capital of China moved from Nanjing to… **Beijing**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- In 1949, China moved its capital to Beijing. Where was it before? **Nanjing**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- In 1949, which country moved its capital from Nanjing to Beijing? **China**
  - Block A: China | 1949 | People's Republic proclaimed (not independence) | Qing Empire (to 1912) | Beijing to Nanjing (1928); Nanjing to Beijing (1949)
- In 1958, the capital of the Comoros moved from Dzaoudzi to… **Moroni**
  - Block A: Comoros | 1975 | France | none | Dzaoudzi to Moroni (1958)
- In 1958, the Comoros moved its capital to Moroni. Where was it before? **Dzaoudzi**
  - Block A: Comoros | 1975 | France | none | Dzaoudzi to Moroni (1958)
- In 1958, which country moved its capital from Dzaoudzi to Moroni? **Comoros**
  - Block A: Comoros | 1975 | France | none | Dzaoudzi to Moroni (1958)
- In 1823, the capital of Costa Rica moved from Cartago to… **San Jose**
  - Block A: Costa Rica | 1821 | Spain | none | Cartago to San Jose (1823)
- In 1823, Costa Rica moved its capital to San Jose. Where was it before? **Cartago**
  - Block A: Costa Rica | 1821 | Spain | none | Cartago to San Jose (1823)
- In 1823, which country moved its capital from Cartago to San Jose? **Costa Rica**
  - Block A: Costa Rica | 1821 | Spain | none | Cartago to San Jose (1823)
- In 1983, the capital of Cote d'Ivoire moved from Abidjan to… **Yamoussoukro**
  - Block A: Cote d'Ivoire | 1960 | France | none | Abidjan to Yamoussoukro (1983)
- In 1983, Cote d'Ivoire moved its capital to Yamoussoukro. Where was it before? **Abidjan**
  - Block A: Cote d'Ivoire | 1960 | France | none | Abidjan to Yamoussoukro (1983)
- In 1983, which country moved its capital from Abidjan to Yamoussoukro? **Cote d'Ivoire**
  - Block A: Cote d'Ivoire | 1960 | France | none | Abidjan to Yamoussoukro (1983)
- In 1894, the capital of Djibouti moved from Obock to… **Djibouti**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- In 1894, Djibouti moved its capital to the city of Djibouti. Where was it before? **Obock**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- In 1894, which country moved its capital from Obock to Djibouti? **Djibouti**
  - Block A: Djibouti | 1977 | France | French Somaliland (to 1967); Afars and Issas (1967-1977) | Obock to Djibouti (1894)
- In 2026, the capital of Equatorial Guinea moved from Malabo to… **Ciudad de la Paz**
  - Block A: Equatorial Guinea | 1968 | Spain | Spanish Guinea (to 1968) | Malabo to Ciudad de la Paz (2026)
- In 2026, Equatorial Guinea moved its capital to Ciudad de la Paz. Where was it before? **Malabo**
  - Block A: Equatorial Guinea | 1968 | Spain | Spanish Guinea (to 1968) | Malabo to Ciudad de la Paz (2026)
- In 2026, which country moved its capital from Malabo to Ciudad de la Paz? **Equatorial Guinea**
  - Block A: Equatorial Guinea | 1968 | Spain | Spanish Guinea (to 1968) | Malabo to Ciudad de la Paz (2026)
- In 1897, the capital of Eritrea moved from Massawa to… **Asmara**
  - Block A: Eritrea | 1993 | Ethiopia | none | Massawa to Asmara (1897)
- In 1897, Eritrea moved its capital to Asmara. Where was it before? **Massawa**
  - Block A: Eritrea | 1993 | Ethiopia | none | Massawa to Asmara (1897)
- In 1897, which country moved its capital from Massawa to Asmara? **Eritrea**
  - Block A: Eritrea | 1993 | Ethiopia | none | Massawa to Asmara (1897)
- In 1902, the capital of Eswatini moved from Bremersdorp to… **Mbabane**
  - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
- In 1902, Eswatini moved its capital to Mbabane. Where was it before? **Bremersdorp**
  - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
- In 1902, which country moved its capital from Bremersdorp to Mbabane? **Eswatini**
  - Block A: Eswatini | 1968 | United Kingdom | Swaziland (to 2018) | Bremersdorp to Mbabane (1902)
- In 1882, the capital of Fiji moved from Levuka to… **Suva**
  - Block A: Fiji | 1970 | United Kingdom | none | Levuka to Suva (1882)
- In 1882, Fiji moved its capital to Suva. Where was it before? **Levuka**
  - Block A: Fiji | 1970 | United Kingdom | none | Levuka to Suva (1882)
- In 1882, which country moved its capital from Levuka to Suva? **Fiji**
  - Block A: Fiji | 1970 | United Kingdom | none | Levuka to Suva (1882)
- In 1812, the capital of Finland moved from Turku to… **Helsinki**
  - Block A: Finland | 1917 | Russia | none | Turku to Helsinki (1812)
- In 1812, Finland moved its capital to Helsinki. Where was it before? **Turku**
  - Block A: Finland | 1917 | Russia | none | Turku to Helsinki (1812)
- In 1812, which country moved its capital from Turku to Helsinki? **Finland**
  - Block A: Finland | 1917 | Russia | none | Turku to Helsinki (1812)
- The capital of Germany moved from Bonn to… **Berlin**
  - Block A: Germany | don't ask | unification 1871, refounded 1949, reunified 1990 | West Germany (1949-1990) | Bonn to Berlin (1990)
- Germany moved its capital to Berlin. Where was it before? **Bonn**
  - Block A: Germany | don't ask | unification 1871, refounded 1949, reunified 1990 | West Germany (1949-1990) | Bonn to Berlin (1990)
- Which country moved its capital from Bonn to Berlin? **Germany**
  - Block A: Germany | don't ask | unification 1871, refounded 1949, reunified 1990 | West Germany (1949-1990) | Bonn to Berlin (1990)
- In 1877, the capital of Ghana moved from Cape Coast to… **Accra**
  - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
- In 1877, Ghana moved its capital to Accra. Where was it before? **Cape Coast**
  - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
- In 1877, which country moved its capital from Cape Coast to Accra? **Ghana**
  - Block A: Ghana | 1957 | United Kingdom | Gold Coast (to 1957) | Cape Coast to Accra (1877)
- In 1834, the capital of Greece moved from Nafplio to… **Athens**
  - Block A: Greece | 1830 | Ottoman Empire | none | Nafplio to Athens (1834)
- In 1834, Greece moved its capital to Athens. Where was it before? **Nafplio**
  - Block A: Greece | 1830 | Ottoman Empire | none | Nafplio to Athens (1834)
- In 1834, which country moved its capital from Nafplio to Athens? **Greece**
  - Block A: Greece | 1830 | Ottoman Empire | none | Nafplio to Athens (1834)
- In 1941, the capital of Guinea-Bissau moved from Bolama to… **Bissau**
  - Block A: Guinea-Bissau | 1973 | Portugal | Portuguese Guinea (to 1974) | Bolama to Bissau (1941)
- In 1941, Guinea-Bissau moved its capital to Bissau. Where was it before? **Bolama**
  - Block A: Guinea-Bissau | 1973 | Portugal | Portuguese Guinea (to 1974) | Bolama to Bissau (1941)
- In 1941, which country moved its capital from Bolama to Bissau? **Guinea-Bissau**
  - Block A: Guinea-Bissau | 1973 | Portugal | Portuguese Guinea (to 1974) | Bolama to Bissau (1941)
- In 1880, the capital of Honduras moved from Comayagua to… **Tegucigalpa**
  - Block A: Honduras | 1821 | Spain | none | Comayagua to Tegucigalpa (1880)
- In 1880, Honduras moved its capital to Tegucigalpa. Where was it before? **Comayagua**
  - Block A: Honduras | 1821 | Spain | none | Comayagua to Tegucigalpa (1880)
- In 1880, which country moved its capital from Comayagua to Tegucigalpa? **Honduras**
  - Block A: Honduras | 1821 | Spain | none | Comayagua to Tegucigalpa (1880)
- In 1911, the capital of India moved from Calcutta to… **Delhi**
  - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
- In 1911, India moved its capital to Delhi. Where was it before? **Calcutta**
  - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
- In 1911, which country moved its capital from Calcutta to Delhi? **India**
  - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
- In 1931, the capital of India moved from Delhi to… **New Delhi**
  - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
- In 1931, India moved its capital to New Delhi. Where was it before? **Delhi**
  - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
- In 1931, which country moved its capital from Delhi to New Delhi? **India**
  - Block A: India | 1947 | United Kingdom | none | Calcutta to Delhi (1911); Delhi to New Delhi (1931)
- In 1865, the capital of Italy moved from Turin to… **Florence**
  - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
- In 1865, Italy moved its capital to Florence. Where was it before? **Turin**
  - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
- In 1865, which country moved its capital from Turin to Florence? **Italy**
  - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
- In 1871, the capital of Italy moved from Florence to… **Rome**
  - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
- In 1871, Italy moved its capital to Rome. Where was it before? **Florence**
  - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
- In 1871, which country moved its capital from Florence to Rome? **Italy**
  - Block A: Italy | 1861 | unification of Italian states | none | Turin to Florence (1865); Florence to Rome (1871)
- In 1872, the capital of Jamaica moved from Spanish Town to… **Kingston**
  - Block A: Jamaica | 1962 | United Kingdom | none | Spanish Town to Kingston (1872)
- In 1872, Jamaica moved its capital to Kingston. Where was it before? **Spanish Town**
  - Block A: Jamaica | 1962 | United Kingdom | none | Spanish Town to Kingston (1872)
- In 1872, which country moved its capital from Spanish Town to Kingston? **Jamaica**
  - Block A: Jamaica | 1962 | United Kingdom | none | Spanish Town to Kingston (1872)
- The capital of Japan moved from Kyoto to… **Tokyo**
  - Block A: Japan | don't ask | never colonised | none | Kyoto to Tokyo (1868-1869)
- Japan moved its capital to Tokyo. Where was it before? **Kyoto**
  - Block A: Japan | don't ask | never colonised | none | Kyoto to Tokyo (1868-1869)
- Which country moved its capital from Kyoto to Tokyo? **Japan**
  - Block A: Japan | don't ask | never colonised | none | Kyoto to Tokyo (1868-1869)
- The capital of Kazakhstan moved from Almaty to… **Astana**
  - Block A: Kazakhstan | 1991 | Soviet Union (dissolution) | none | Almaty to Astana (1997)
- Kazakhstan moved its capital to Astana. Where was it before? **Almaty**
  - Block A: Kazakhstan | 1991 | Soviet Union (dissolution) | none | Almaty to Astana (1997)
- Which country moved its capital from Almaty to Astana? **Kazakhstan**
  - Block A: Kazakhstan | 1991 | Soviet Union (dissolution) | none | Almaty to Astana (1997)
- The capital of Kenya moved from Mombasa to… **Nairobi**
  - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
- Kenya moved its capital to Nairobi. Where was it before? **Mombasa**
  - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
- Which country moved its capital from Mombasa to Nairobi? **Kenya**
  - Block A: Kenya | 1963 | United Kingdom | British East Africa (1895-1920) | Mombasa to Nairobi (1907)
- In 1975, the capital of Malawi moved from Zomba to… **Lilongwe**
  - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
- In 1975, Malawi moved its capital to Lilongwe. Where was it before? **Zomba**
  - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
- In 1975, which country moved its capital from Zomba to Lilongwe? **Malawi**
  - Block A: Malawi | 1964 | United Kingdom | Nyasaland (1907-1964) | Zomba to Lilongwe (1975)
- In 1989, the capital of Micronesia moved from Kolonia to… **Palikir**
  - Block A: Micronesia | 1986 | US-administered UN trust territory | none | Kolonia to Palikir (1989)
- In 1989, Micronesia moved its capital to Palikir. Where was it before? **Kolonia**
  - Block A: Micronesia | 1986 | US-administered UN trust territory | none | Kolonia to Palikir (1989)
- In 1989, which country moved its capital from Kolonia to Palikir? **Micronesia**
  - Block A: Micronesia | 1986 | US-administered UN trust territory | none | Kolonia to Palikir (1989)
- In 1946, the capital of Montenegro moved from Cetinje to… **Podgorica**
  - Block A: Montenegro | 2006 | Serbia and Montenegro | none | Cetinje to Podgorica (1946)
- In 1946, Montenegro moved its capital to Podgorica. Where was it before? **Cetinje**
  - Block A: Montenegro | 2006 | Serbia and Montenegro | none | Cetinje to Podgorica (1946)
- In 1946, which country moved its capital from Cetinje to Podgorica? **Montenegro**
  - Block A: Montenegro | 2006 | Serbia and Montenegro | none | Cetinje to Podgorica (1946)
- In 1912, the capital of Morocco moved from Fez to… **Rabat**
  - Block A: Morocco | 1956 | France and Spain (protectorates) | none | Fez to Rabat (1912)
- In 1912, Morocco moved its capital to Rabat. Where was it before? **Fez**
  - Block A: Morocco | 1956 | France and Spain (protectorates) | none | Fez to Rabat (1912)
- In 1912, which country moved its capital from Fez to Rabat? **Morocco**
  - Block A: Morocco | 1956 | France and Spain (protectorates) | none | Fez to Rabat (1912)
- In 1898, the capital of Mozambique moved from Island of Mozambique to… **Lourenco Marques**
  - Block A: Mozambique | 1975 | Portugal | none | Island of Mozambique to Lourenco Marques (1898)
- In 1898, Mozambique moved its capital to Lourenco Marques. Where was it before? **Island of Mozambique**
  - Block A: Mozambique | 1975 | Portugal | none | Island of Mozambique to Lourenco Marques (1898)
- In 1898, which country moved its capital from Island of Mozambique to Lourenco Marques? **Mozambique**
  - Block A: Mozambique | 1975 | Portugal | none | Island of Mozambique to Lourenco Marques (1898)
- In 2005, the capital of Myanmar moved from Yangon to… **Naypyidaw**
  - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
- In 2005, Myanmar moved its capital to Naypyidaw. Where was it before? **Yangon**
  - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
- In 2005, which country moved its capital from Yangon to Naypyidaw? **Myanmar**
  - Block A: Myanmar | 1948 | United Kingdom | Burma (to 1989) | Yangon to Naypyidaw (2005)
- In 1841, the capital of New Zealand moved from Okiato to… **Auckland**
  - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
- In 1841, New Zealand moved its capital to Auckland. Where was it before? **Okiato**
  - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
- In 1841, which country moved its capital from Okiato to Auckland? **New Zealand**
  - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
- In 1865, the capital of New Zealand moved from Auckland to… **Wellington**
  - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
- In 1865, New Zealand moved its capital to Wellington. Where was it before? **Auckland**
  - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
- In 1865, which country moved its capital from Auckland to Wellington? **New Zealand**
  - Block A: New Zealand | don't ask | United Kingdom (no single date) | none | Okiato to Auckland (1841); Auckland to Wellington (1865)
- In 1991, the capital of Nigeria moved from Lagos to… **Abuja**
  - Block A: Nigeria | 1960 | United Kingdom | none | Lagos to Abuja (1991)
- In 1991, Nigeria moved its capital to Abuja. Where was it before? **Lagos**
  - Block A: Nigeria | 1960 | United Kingdom | none | Lagos to Abuja (1991)
- In 1991, which country moved its capital from Lagos to Abuja? **Nigeria**
  - Block A: Nigeria | 1960 | United Kingdom | none | Lagos to Abuja (1991)
- In 1959, the capital of Pakistan moved from Karachi to… **Rawalpindi**
  - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
- In 1959, Pakistan moved its capital to Rawalpindi. Where was it before? **Karachi**
  - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
- In 1959, which country moved its capital from Karachi to Rawalpindi? **Pakistan**
  - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
- In 1967, the capital of Pakistan moved from Rawalpindi to… **Islamabad**
  - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
- In 1967, Pakistan moved its capital to Islamabad. Where was it before? **Rawalpindi**
  - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
- In 1967, which country moved its capital from Rawalpindi to Islamabad? **Pakistan**
  - Block A: Pakistan | 1947 | United Kingdom | none | Karachi to Rawalpindi (1959); Rawalpindi to Islamabad (1967)
- In 2006, the capital of Palau moved from Koror to… **Ngerulmud**
  - Block A: Palau | 1994 | US-administered UN trust territory | none | Koror to Ngerulmud (2006)
- In 2006, Palau moved its capital to Ngerulmud. Where was it before? **Koror**
  - Block A: Palau | 1994 | US-administered UN trust territory | none | Koror to Ngerulmud (2006)
- In 2006, which country moved its capital from Koror to Ngerulmud? **Palau**
  - Block A: Palau | 1994 | US-administered UN trust territory | none | Koror to Ngerulmud (2006)
- In 1948, the capital of the Philippines moved from Manila to… **Quezon City**
  - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
- In 1948, the Philippines moved its capital to Quezon City. Where was it before? **Manila**
  - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
- In 1948, which country moved its capital from Manila to Quezon City? **Philippines**
  - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
- In 1976, the capital of the Philippines moved from Quezon City to… **Manila**
  - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
- In 1976, the Philippines moved its capital to Manila. Where was it before? **Quezon City**
  - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
- In 1976, which country moved its capital from Quezon City to Manila? **Philippines**
  - Block A: Philippines | 1946 | United States | none | Manila to Quezon City (1948); Quezon City to Manila (1976)
- In 1808, the capital of Portugal moved from Lisbon to… **Rio de Janeiro**
  - Block A: Portugal | don't ask | ancient kingdom | none | Lisbon to Rio de Janeiro (1808)
- In 1808, Portugal moved its capital to Rio de Janeiro. Where was it before? **Lisbon**
  - Block A: Portugal | don't ask | ancient kingdom | none | Lisbon to Rio de Janeiro (1808)
- In 1808, which country moved its capital from Lisbon to Rio de Janeiro? **Portugal**
  - Block A: Portugal | don't ask | ancient kingdom | none | Lisbon to Rio de Janeiro (1808)
- In 1918, the capital of Russia moved from Petrograd to… **Moscow**
  - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
- In 1918, Russia moved its capital to Moscow. Where was it before? **Petrograd**
  - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
- In 1918, which country moved its capital from Petrograd to Moscow? **Russia**
  - Block A: Russia | don't ask | ancient state; continues the Soviet Union | Russian SFSR (1917-1991) | Petrograd to Moscow (1918)
- In 1841, the capital of Serbia moved from Kragujevac to… **Belgrade**
  - Block A: Serbia | 1878 | Ottoman Empire | none | Kragujevac to Belgrade (1841)
- In 1841, Serbia moved its capital to Belgrade. Where was it before? **Kragujevac**
  - Block A: Serbia | 1878 | Ottoman Empire | none | Kragujevac to Belgrade (1841)
- In 1841, which country moved its capital from Kragujevac to Belgrade? **Serbia**
  - Block A: Serbia | 1878 | Ottoman Empire | none | Kragujevac to Belgrade (1841)
- The capital of the Solomon Islands moved from Tulagi to… **Honiara**
  - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
- The Solomon Islands moved its capital to Honiara. Where was it before? **Tulagi**
  - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
- Which country moved its capital from Tulagi to Honiara? **Solomon Islands**
  - Block A: Solomon Islands | 1978 | United Kingdom | British Solomon Islands (to 1975) | Tulagi to Honiara (1952)
- In 1982, the capital of Sri Lanka moved from Colombo to… **Sri Jayawardenepura Kotte**
  - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
- In 1982, Sri Lanka moved its capital to Sri Jayawardenepura Kotte. Where was it before? **Colombo**
  - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
- In 1982, which country moved its capital from Colombo to Sri Jayawardenepura Kotte? **Sri Lanka**
  - Block A: Sri Lanka | 1948 | United Kingdom | Ceylon (to 1972) | Colombo to Sri Jayawardenepura Kotte (1982)
- The capital of Tanzania moved from Dar es Salaam to… **Dodoma**
  - Block A: Tanzania | 1964 | union of Tanganyika and Zanzibar | Tanganyika (to 1964) | Dar es Salaam to Dodoma (1996)
- Tanzania moved its capital to Dodoma. Where was it before? **Dar es Salaam**
  - Block A: Tanzania | 1964 | union of Tanganyika and Zanzibar | Tanganyika (to 1964) | Dar es Salaam to Dodoma (1996)
- Which country moved its capital from Dar es Salaam to Dodoma? **Tanzania**
  - Block A: Tanzania | 1964 | union of Tanganyika and Zanzibar | Tanganyika (to 1964) | Dar es Salaam to Dodoma (1996)
- In 1923, the capital of Turkiye moved from Istanbul to… **Ankara**
  - Block A: Turkiye | 1923 | Ottoman Empire (successor republic) | none | Istanbul to Ankara (1923)
- In 1923, Turkiye moved its capital to Ankara. Where was it before? **Istanbul**
  - Block A: Turkiye | 1923 | Ottoman Empire (successor republic) | none | Istanbul to Ankara (1923)
- In 1923, which country moved its capital from Istanbul to Ankara? **Turkiye**
  - Block A: Turkiye | 1923 | Ottoman Empire (successor republic) | none | Istanbul to Ankara (1923)
- In 1962, the capital of Uganda moved from Entebbe to… **Kampala**
  - Block A: Uganda | 1962 | United Kingdom | none | Entebbe to Kampala (1962)
- In 1962, Uganda moved its capital to Kampala. Where was it before? **Entebbe**
  - Block A: Uganda | 1962 | United Kingdom | none | Entebbe to Kampala (1962)
- In 1962, which country moved its capital from Entebbe to Kampala? **Uganda**
  - Block A: Uganda | 1962 | United Kingdom | none | Entebbe to Kampala (1962)
- In 1934, the capital of Ukraine moved from Kharkiv to… **Kyiv**
  - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
- In 1934, Ukraine moved its capital to Kyiv. Where was it before? **Kharkiv**
  - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
- In 1934, which country moved its capital from Kharkiv to Kyiv? **Ukraine**
  - Block A: Ukraine | 1991 | Soviet Union (dissolution) | Ukrainian SSR (1919-1991) | Kharkiv to Kyiv (1934)
- In 1800, the capital of the United States moved from Philadelphia to… **Washington**
  - Block A: United States | 1776 | Great Britain | none | Philadelphia to Washington (1800)
- In 1800, the United States moved its capital to Washington. Where was it before? **Philadelphia**
  - Block A: United States | 1776 | Great Britain | none | Philadelphia to Washington (1800)
- In 1800, which country moved its capital from Philadelphia to Washington? **United States**
  - Block A: United States | 1776 | Great Britain | none | Philadelphia to Washington (1800)
- In 1930, the capital of Uzbekistan moved from Samarkand to… **Tashkent**
  - Block A: Uzbekistan | 1991 | Soviet Union (dissolution) | none | Samarkand to Tashkent (1930)
- In 1930, Uzbekistan moved its capital to Tashkent. Where was it before? **Samarkand**
  - Block A: Uzbekistan | 1991 | Soviet Union (dissolution) | none | Samarkand to Tashkent (1930)
- In 1930, which country moved its capital from Samarkand to Tashkent? **Uzbekistan**
  - Block A: Uzbekistan | 1991 | Soviet Union (dissolution) | none | Samarkand to Tashkent (1930)
- In 1945, the capital of Viet Nam moved from Hue to… **Hanoi**
  - Block A: Viet Nam | 1976 | reunification of North and South | Dai Nam (1839-1945) | Hue to Hanoi (1945)
- In 1945, Viet Nam moved its capital to Hanoi. Where was it before? **Hue**
  - Block A: Viet Nam | 1976 | reunification of North and South | Dai Nam (1839-1945) | Hue to Hanoi (1945)
- In 1945, which country moved its capital from Hue to Hanoi? **Viet Nam**
  - Block A: Viet Nam | 1976 | reunification of North and South | Dai Nam (1839-1945) | Hue to Hanoi (1945)
- In 1935, the capital of Zambia moved from Livingstone to… **Lusaka**
  - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
- In 1935, Zambia moved its capital to Lusaka. Where was it before? **Livingstone**
  - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)
- In 1935, which country moved its capital from Livingstone to Lusaka? **Zambia**
  - Block A: Zambia | 1964 | United Kingdom | Northern Rhodesia (1911-1964) | Livingstone to Lusaka (1935)

## The first two weeks

### No. 1, Sat (hard)

1. Which came later? ICJ awards Ligitan and Sipadan islands to Malaysia (2002) / Dadra and Nagar Haveli and Daman and Diu merge (2020)
1. Put in order: Kingdom of Swaziland renamed Kingdom of Eswatini (2018) / The name French Sudan stops being used for today's Mali (1958) / Fort Victoria, Zimbabwe, is renamed Masvingo (1982)
1. Which came first? The name Middle Congo stops being used for today's Republic of the Congo (1958) / Gorky, Russia, is renamed Nizhny Novgorod (1990)
1. When was it? United States buys Alaska from Russia (1867; slider 1858 to 2008)
1. Which came first? Treaty of Waitangi signed; British sovereignty over New Zealand (1840) / British trading post founded at Singapore (1819)
1. Which came later? Niislel Khuree, Mongolia, is renamed Ulaanbaatar (1924) / Philippines becomes independent from the United States (1946)
1. Which came first? Santa Fe de Bogota, Colombia, is renamed Bogota (2000) / East and West Germany reunify (1990)
1. Which came later? Togo becomes independent from France (1960) / Southern Rhodesia becomes independent Zimbabwe (1980)

### No. 2, Sun (hardest)

1. Which came first? Austrian State Treaty restores Austria's independence (1955) / North and South Vietnam formally reunified (1976)
1. When was it? Namibia becomes independent from South Africa (1990; slider 1863 to 2013)
1. Which came later? Queensland separates from New South Wales (1859) / Britain establishes the Bechuanaland Protectorate (1885)
1. Put in order: Peru cedes Tarapaca to Chile (1883) / Treaty of Fez makes Morocco a French protectorate (1912) / Girgenti, Italy, is renamed Agrigento (1927)
1. When was it? The capital of Honduras moves from Comayagua to Tegucigalpa (1880; slider 1815 to 2005)
1. How many years apart? United States buys southern Arizona strip from Mexico (1853) / Sudan becomes independent (1956)
1. Put in order: Karl-Marx-Stadt, Germany, is renamed Chemnitz (1990) / Spain hands the Tarfaya Strip to Morocco (1958) / Fort-Archambault, Chad, is renamed Sarh (1972)
1. What was Bandar Seri Begawan (Brunei) called before 1970? Brunei Town (options: Vila Pery, Brunei Town, Fort Chimo, Bathurst)

### No. 3, Mon (easy)

1. Which came first? Rome becomes capital of Italy (1871) / Czechoslovakia splits into the Czech Republic and Slovakia (1993)
1. What was Piedras Negras (Mexico) called before 1911? Ciudad Porfirio Diaz (options: Vyatka, Ciudad Porfirio Diaz, Luluabourg, Petrovgrad)
1. Put in order: Lusaka replaces Livingstone as capital of Northern Rhodesia (1935) / Britain annexes the Punjab (1849) / Qurghonteppa, Tajikistan, is renamed Bokhtar (2018)
1. Which of these is a former name of Ghana, used until 1957? Gold Coast (options: Turkmenia, German Samoa, Ukrainian SSR, Gold Coast)
1. In 1975, which country moved its capital from Zomba to Lilongwe? Malawi (options: Russia, Malawi, Albania, Italy)
1. When was it? France's 13 merged metropolitan regions take effect (2016; slider 1953 to 2023)
1. In 1811, Paraguay became independent from… Spain (options: Spain, New Zealand, Pakistan, Belgium)
1. When was it? The name Isle de France stops being used for today's Mauritius (1810; slider 1801 to 1891)

### No. 4, Tue (fairly easy)

1. Which came first? Tajik SSR becomes a union republic, gaining the Khujand area (1929) / The name Central African Empire stops being used for today's Central African Republic (1979)
1. Put in order: Capital of Greece moves from Nafplio to Athens (1834) / Uganda becomes independent with Kampala as its capital (1962) / Atlantic Bridge opens over the Panama Canal (2019)
1. When was it? Edwinton, United States, is renamed Bismarck (1873; slider 1867 to 1937)
1. Which came first? Fiji declared a republic (1987) / The name Greater Lebanon comes into use for today's Lebanon (1920)
1. When was it? Kyrgyzstan and Tajikistan sign their border treaty (2025; slider 1936 to 2026)
1. How many years apart? Kingdom of Kandy ceded to British rule (1815) / Danzig, Poland, is renamed Gdansk (1945)
1. Put in order: United Kingdom transfers Hong Kong to China (1997) / Jadotville, Democratic Republic of the Congo, is renamed Likasi (1966) / Gotthard Base Tunnel opens under the Alps (2016)
1. What was Xai-Xai (Mozambique) called before 1975? Joao Belo (options: Joao Belo, Pressburg, Salisbury, Nidaros)

### No. 5, Wed (medium)

1. Which came first? The name Nyasaland comes into use for today's Malawi (1907) / General Artigas Bridge links Paysandu and Colon (1975)
1. Japan moved its capital to Tokyo. Where was it before? Kyoto (options: Kyoto, Manila, Quezon City, Cape Coast)
1. Which came later? Britain proclaims a protectorate over the Solomon Islands (1893) / Philippeville, Algeria, is renamed Skikda (1962)
1. Put in order: Mauritius becomes independent from the United Kingdom (1968) / Newfoundland renamed Newfoundland and Labrador (2001) / Pereiaslav-Khmelnytskyi, Ukraine, is renamed Pereiaslav (2019)
1. When was it? Barbados becomes a republic (2021; slider 1906 to 2026)
1. Vyatka is a former name of which city? Kirov (Russia) (options: Maputo (Mozambique), Gqeberha (South Africa), Kirov (Russia), Arviat (Canada))
1. How many years apart? Bukharan People's Soviet Republic replaces the Emirate of Bukhara (1920) / Rio-Antirrio Bridge opens across the Gulf of Corinth (2004)
1. When was it? Saint Petersburg renamed Petrograd (1914; slider 1825 to 1975)

### No. 6, Thu (medium)

1. Which came first? The capital of Sri Lanka moves from Colombo to Sri Jayawardenepura Kotte (1982) / Korean armistice creates the Demilitarized Zone (1953)
1. Which of these is a former name of South Africa, used from 1910 to 1961? Union of South Africa (options: Turkmenia, Outer Mongolia, Union of South Africa, Anglo-Egyptian Sudan)
1. Romania became independent from… Ottoman Empire (options: South Africa, Colombia, Spain, Ottoman Empire)
1. Put in order: New South Wales transfers Federal Capital Territory to Australia (1911) / Treaty of Ayacucho sets the Bolivia-Brazil border (1867) / Argentina declares independence from Spain (1816)
1. Petrovsk-Port is a former name of which city? Makhachkala (Russia) (options: Tolyatti (Russia), Bismarck (United States), Makhachkala (Russia), Harare (Zimbabwe))
1. Put in order: Karakalpak ASSR moves from Russian SFSR to Uzbek SSR (1936) / Kuybyshev, Russia, is renamed Samara (1991) / Italy recognises Ethiopia's independence (1896)
1. When was it? Western Samoa renamed Samoa (1997; slider 1855 to 2005)
1. When was it? Van Diemen's Land becomes a colony separate from New South Wales (1825; slider 1818 to 1968)

### No. 7, Fri (hard)

1. Which came first? Puna de Atacama arbitration gives most of the area to Argentina (1899) / Denmark sells Danish West Indies to the United States (1917)
1. Put in order: Fiji becomes independent from the United Kingdom (1970) / Bosnia and Herzegovina becomes independent from Yugoslavia (1992) / Sejong becomes a special self-governing city (2012)
1. When was it? ICJ fixes the disputed Burkina Faso-Mali frontier (1986; slider 1905 to 2025)
1. Put in order: Dominican capital Santo Domingo renamed Ciudad Trujillo (1936) / Berlin, Canada, is renamed Kitchener (1916) / Lourenco Marques, Mozambique, is renamed Maputo (1976)
1. Which came first? Tolbukhin, Bulgaria, is renamed Dobrich (1990) / Saint Barthelemy and Saint Martin separate from Guadeloupe (2007)
1. When was it? Flevoland, built on reclaimed polders, becomes 12th Dutch province (1986; slider 1865 to 2015)
1. Which came later? China cedes Kowloon to Britain (1860) / The capital of Serbia moves from Kragujevac to Belgrade (1841)
1. How many years apart? The capital of Italy moves from Turin to Florence (1865) / Arbitral award gives Laguna del Desierto to Argentina (1994)

### No. 8, Sat (hard)

1. Which came first? Britain annexes Lagos (1861) / Six Australian colonies federate as Commonwealth of Australia (1901)
1. Put in order: Shabani, Zimbabwe, is renamed Zvishavane (1982) / Czech government adopts Czechia as official English short name (2016) / Saar joins West Germany as Saarland (1957)
1. Which came first? Germany declares a protectorate over the Marshall Islands (1885) / The capital of Morocco moves from Fez to Rabat (1912)
1. Coquilhatville is a former name of which city? Mbandaka (Democratic Republic of the Congo) (options: Lubumbashi (Democratic Republic of the Congo), Kinshasa (Democratic Republic of the Congo), Mbandaka (Democratic Republic of the Congo), Kisangani (Democratic Republic of the Congo))
1. When was it? Treaty of Lima: Tacna returns to Peru, Chile keeps Arica (1929; slider 1830 to 1980)
1. Put in order: The name German Samoa comes into use for today's Samoa (1900) / The name Moldavia comes into use for today's Moldova (1940) / Suez Canal opens (1869)
1. When was it? Stalingrad, Russia, is renamed Volgograd (1961; slider 1832 to 2022)
1. In 1960, the capital of Brazil moved from Rio de Janeiro to… Brasilia (options: Bissau, Island of Mozambique, Brasilia, Lourenco Marques)

### No. 9, Sun (hardest)

1. Which came first? Wankie, Zimbabwe, is renamed Hwange (1982) / Samoa crosses International Date Line, skipping 30 December (2011)
1. In 1828, Uruguay became independent from… Brazil (options: Spain, Portugal, Brazil, United Kingdom)
1. Put in order: Cambodia becomes independent from France (1953) / Interoceanic Highway between Brazil and Peru is inaugurated (2011) / Sverdlovsk, Russia, is renamed Yekaterinburg (1991)
1. What was N'Djamena (Chad) called before 1973? Fort-Lamy (options: Fort Chimo, Fort-Lamy, Fort William and Port Arthur, Fort-Archambault)
1. Which of these is a former name of Ireland, used from 1922 to 1937? Irish Free State (options: Malaya, Trucial States, Basutoland, Irish Free State)
1. How many years apart? Anglo-Siamese Treaty: Siam cedes four Malay states to Britain (1909) / Viet Nam cedes three southern provinces to France (1862)
1. When was it? Sao Tome and Principe becomes independent from Portugal (1975; slider 1800 to 2026)
1. When was it? Persia cedes Erivan and Nakhchivan khanates to Russia (1828; slider 1800 to 2026)

### No. 10, Mon (easy)

1. Which came first? Loubomo, Republic of the Congo, is renamed Dolisie (1991) / Kazakh capital moves from Orenburg to Kzyl-Orda (1925)
1. When was it? Crampel, Central African Republic, is renamed Kaga-Bandoro (1974; slider 1965 to 2015)
1. Put in order: People's Republic of China proclaimed in Beijing (1949) / ICJ fixes the Burkina Faso-Niger frontier (2013) / The name Muscat and Oman comes into use for today's Oman (1856)
1. When was it? Stabroek, Guyana, is renamed Georgetown (1812; slider 1806 to 1876)
1. In 1894, Djibouti moved its capital to the city of Djibouti. Where was it before? Obock (options: Kolonia, Entebbe, Petrograd, Obock)
1. Put in order: Britain returns Weihaiwei to China (1930) / Saint Kitts and Nevis becomes independent from the United Kingdom (1983) / Equatorial Guinea decrees Ciudad de la Paz its capital, replacing Malabo (2026)
1. How many years apart? South Coast, Australia, is renamed Gold Coast (1958) / Broughton Island, Canada, is renamed Qikiqtarjuaq (1998)
1. What was Bujumbura (Burundi) called before 1962? Usumbura (options: Usumbura, Tilsit, Chkalov, Stalin)

### No. 11, Tue (fairly easy)

1. Which came first? Iceland becomes a sovereign kingdom in union with Denmark (1918) / The name British Solomon Islands stops being used for today's Solomon Islands (1975)
1. When was it? Tangier international zone returns to Moroccan sovereignty (1956; slider 1892 to 1962)
1. Which came first? Republic of China proclaimed, ending Qing imperial rule (1912) / Compact of Free Association ends US trusteeship of Marshall Islands, Micronesia (1986)
1. Put in order: Paraguay proclaims itself a republic (1813) / Argentina and Chile sign a boundary treaty (1881) / Treaty of Saint-Germain: South Tyrol passes from Austria to Italy (1919)
1. When was it? The capital of Albania moves from Durres to Tirana (1920; slider 1885 to 1975)
1. Bathurst is a former name of which city? Banjul (Gambia) (options: Banjul (Gambia), Wroclaw (Poland), Ciudad Obregon (Mexico), Izhevsk (Russia))
1. Put in order: Przhevalsk, Kyrgyzstan, is renamed Karakol (1991) / Soviet Union formed by four founding republics (1922) / The capital of Montenegro moves from Cetinje to Podgorica (1946)
1. Which came later? Erie Canal opens (1825) / Liberia declares independence (1847)

### No. 12, Wed (medium)

1. Which came first? Britain occupies Egypt (1882) / Nazi Germany annexes Austria (Anschluss) (1938)
1. In 1967, which country moved its capital from Rawalpindi to Islamabad? Pakistan (options: Honduras, Albania, Equatorial Guinea, Pakistan)
1. In 1958, Guinea became independent from… France (options: Indonesia, France, Spain, Malaysia)
1. When was it? Acre becomes a state of Brazil (1962; slider 1886 to 2006)
1. Which of these is a former name of the Democratic Republic of the Congo, used from 1971 to 1997? Zaire (options: Gold Coast, Ubangi-Shari, Zaire, French Somaliland)
1. What was Kabwe (Zambia) called before 1966? Broken Hill (options: Pile o' Bones, Broken Hill, Stalingrad, Palmerston)
1. When was it? Pile o' Bones, Canada, is renamed Regina (1882; slider 1854 to 2004)
1. How many years apart? Mauch Chunk, United States, is renamed Jim Thorpe (1954) / United States hands full control of Panama Canal to Panama (1999)

### No. 13, Thu (medium)

1. Which came first? Petrograd renamed Leningrad (1924) / Italy proclaims the colony of Eritrea (1890)
1. When was it? Expanded Panama Canal with new larger locks opens (2016; slider 1935 to 2025)
1. Which came first? Italy unifies Tripolitania and Cyrenaica as the colony of Libya (1934) / Granville, Canada, is renamed Vancouver (1886)
1. Put in order: Kazakhstan and Turkmenistan sign their border treaty (2001) / The name French Togoland comes into use for today's Togo (1916) / Cook Islands become self-governing under a new constitution (1965)
1. Which came later? Russia transfers part of Bolshoy Ussuriysky Island to China (2008) / Yamoussoukro made capital of Cote d'Ivoire instead of Abidjan (1983)
1. When was it? British Honduras officially renamed Belize (1973; slider 1896 to 2016)
1. Which came later? ICJ rules Kasikili/Sedudu island belongs to Botswana (1999) / Nova Lisboa, Angola, is renamed Huambo (1975)
1. Which came first? Kazakhstan and China sign their border agreement (1994) / Chile creates Arica y Parinacota and Los Rios regions (2007)

### No. 14, Fri (hard)

1. Which came first? Federation of Malaya becomes independent (1957) / Constantinople, Turkiye, is renamed Istanbul (1930)
1. When was it? Stalinabad, Tajikistan, is renamed Dushanbe (1961; slider 1894 to 2014)
1. Which came first? The capital of Viet Nam moves from Hue to Hanoi (1945) / Kenya becomes independent from the United Kingdom (1963)
1. Put in order: Treaty fixes the Kyrgyzstan-Tajikistan-Uzbekistan border tripoint (2025) / Cochin, India, is renamed Kochi (1996) / Netherlands Antilles dissolved; Curacao and Sint Maarten become countries (2010)
1. What was Brasov (Romania) called before 1960? Orasul Stalin (options: Ciudad Eva Peron, Stalin, Orasul Stalin, Luluabourg)
1. Put in order: Mozambique becomes independent from Portugal (1975) / Norway's capital Kristiania renamed Oslo (1925) / Burma becomes independent outside the Commonwealth (1948)
1. Which came first? Pillau, Russia, is renamed Baltiysk (1946) / The capital of Ukraine moves from Kharkiv to Kyiv (1934)
1. How many years apart? Pamir boundary protocols create Afghanistan's Wakhan Corridor (1895) / Nurek Dam completed, then the world's tallest dam (1980)

