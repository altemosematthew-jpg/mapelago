# Dead Reckoning: 300 source-checked places that aren't cities (from Duet, 25 November 2026)

Both parts exactly as received. Fields: name | country or ocean | latitude | longitude | kind | difficulty | clue | source URL.
`tools/dead-reckoning-data.js` reads the lines between `PLACES PART 1` / `END PART 1` and `PLACES PART 2` / `END PART 2`.

Duet's notes:
- Coarse points, fine for distance scoring: Tasmania, Borneo, Bass Strait, Strait of Magellan, Tierra del Fuego, Hudson Bay, Lake Victoria, Vredefort and the Galápagos.
- Points not at the exact centre: Three Gorges Dam, Grand Canyon, Lake Toba, Kati Thanda–Lake Eyre, Krakatoa, the Faroe Islands and Baalbek.
- The North Pole and the South Pole station have longitude 0; skip them if your map or distance code can't handle the poles.
- Mount Sinai's identification is traditional only.
- These may overlap your city list, so drop any whose city is already a round: Christ the Redeemer, Hollywood Sign, Golden Gate Bridge, Hiroshima Peace Memorial, Pearl Harbor, Table Mountain, Robben Island, Alhambra, Potala Palace and the Leaning Tower of Pisa.
- Lake Tanganyika borders four countries and border summits list both sides, so use the country field only on the reveal, never for scoring.

PLACES PART 1
Matterhorn | Switzerland / Italy | 45.98 | 7.66 | summit | easy | A pyramid-shaped Alpine peak first climbed in 1865; four of that party died descending. | https://en.wikipedia.org/wiki/Matterhorn
Mount Etna | Italy | 37.76 | 14.99 | volcano | easy | One of the world's most active volcanoes, towering over an island's east coast. | https://en.wikipedia.org/wiki/Mount_Etna
Mount Vesuvius | Italy | 40.82 | 14.43 | volcano | easy | Its eruption in 79 AD buried the Roman towns of Pompeii and Herculaneum. | https://en.wikipedia.org/wiki/Mount_Vesuvius
Stromboli | Italy | 38.79 | 15.21 | volcano | medium | An island volcano erupting almost constantly, nicknamed the Lighthouse of the Mediterranean. | https://en.wikipedia.org/wiki/Stromboli
Leaning Tower of Pisa | Italy | 43.72 | 10.40 | monument | easy | A cathedral bell tower that began to tilt while it was being built. | https://en.wikipedia.org/wiki/Leaning_Tower_of_Pisa
Lake Como | Italy | 46.00 | 9.27 | lake | medium | A deep Alpine-foothill lake shaped like an upside-down letter Y. | https://en.wikipedia.org/wiki/Lake_Como
Stonehenge | United Kingdom | 51.18 | -1.83 | ancient site | easy | A prehistoric ring of standing stones aligned with the midsummer sunrise. | https://en.wikipedia.org/wiki/Stonehenge
Loch Ness | United Kingdom | 57.30 | -4.45 | lake | easy | A long, deep lake famous for sightings of a legendary monster. | https://en.wikipedia.org/wiki/Loch_Ness
Giant's Causeway | United Kingdom | 55.24 | -6.51 | rock formation | easy | About 40,000 interlocking basalt columns formed by ancient lava. | https://en.wikipedia.org/wiki/Giant%27s_Causeway
St Kilda | United Kingdom | 57.81 | -8.59 | archipelago | hard | Remote Atlantic islands whose last residents asked to be evacuated in 1930. | https://en.wikipedia.org/wiki/St_Kilda,_Scotland
Skara Brae | United Kingdom | 59.05 | -3.34 | ancient site | hard | A Neolithic stone village uncovered by a storm in 1850. | https://en.wikipedia.org/wiki/Skara_Brae
Cliffs of Moher | Ireland | 52.97 | -9.43 | cliffs | medium | Sea cliffs rising over 200 metres above the Atlantic. | https://en.wikipedia.org/wiki/Cliffs_of_Moher
Mont-Saint-Michel | France | 48.64 | -1.51 | island | easy | A tidal island crowned by a medieval abbey. | https://en.wikipedia.org/wiki/Mont-Saint-Michel
Pont du Gard | France | 43.95 | 4.54 | bridge | medium | A three-tiered Roman aqueduct bridge built in the first century AD. | https://en.wikipedia.org/wiki/Pont_du_Gard
Lascaux | France | 45.05 | 1.17 | ancient site | medium | A cave painted with horses and aurochs about 17,000 years ago. | https://en.wikipedia.org/wiki/Lascaux
Millau Viaduct | France | 44.08 | 3.02 | bridge | medium | A cable-stayed bridge whose tallest mast rises about 343 metres. | https://en.wikipedia.org/wiki/Millau_Viaduct
Dune of Pilat | France | 44.59 | -1.21 | sand dune | hard | Europe's tallest sand dune, beside an Atlantic bay. | https://en.wikipedia.org/wiki/Dune_of_Pilat
Verdon Gorge | France | 43.74 | 6.36 | canyon | hard | A limestone gorge with turquoise water, up to 700 metres deep. | https://en.wikipedia.org/wiki/Verdon_Gorge
Alhambra | Spain | 37.18 | -3.59 | monument | easy | A Moorish palace-fortress complex overlooking a southern city. | https://en.wikipedia.org/wiki/Alhambra
Teide | Spain | 28.27 | -16.64 | volcano | medium | A volcano on an Atlantic island that is its country's highest point. | https://en.wikipedia.org/wiki/Teide
Cape Finisterre | Spain | 42.88 | -9.27 | cape | hard | A granite headland whose name means 'end of the earth'. | https://en.wikipedia.org/wiki/Cape_Finisterre
Cabo da Roca | Portugal | 38.78 | -9.50 | cape | medium | The westernmost point of mainland Europe. | https://en.wikipedia.org/wiki/Cabo_da_Roca
Mount Pico | Portugal | 38.47 | -28.40 | volcano | hard | A mid-Atlantic volcano that is its country's highest mountain. | https://en.wikipedia.org/wiki/Mount_Pico
Rhine Falls | Switzerland | 47.68 | 8.62 | waterfall | medium | Europe's most powerful plain waterfall, about 150 metres wide. | https://en.wikipedia.org/wiki/Rhine_Falls
Lake Geneva | Switzerland / France | 46.45 | 6.55 | lake | easy | A crescent-shaped Alpine lake that the Rhône flows through. | https://en.wikipedia.org/wiki/Lake_Geneva
Zugspitze | Germany / Austria | 47.42 | 10.99 | summit | medium | An Alpine peak reached by cable car that straddles an international border. | https://en.wikipedia.org/wiki/Zugspitze
Neuschwanstein Castle | Germany | 47.56 | 10.75 | castle | easy | A 19th-century fairy-tale castle commissioned by a reclusive king. | https://en.wikipedia.org/wiki/Neuschwanstein_Castle
Afsluitdijk | Netherlands | 53.00 | 5.17 | dam | hard | A 32-kilometre dike that turned a saltwater inlet into a freshwater lake. | https://en.wikipedia.org/wiki/Afsluitdijk
Øresund Bridge | Denmark / Sweden | 55.57 | 12.85 | bridge | medium | A road and rail link that dives into a tunnel partway across a strait. | https://en.wikipedia.org/wiki/%C3%98resund_Bridge
Preikestolen | Norway | 58.99 | 6.19 | cliff | medium | A flat-topped cliff jutting 604 metres above a fjord. | https://en.wikipedia.org/wiki/Preikestolen
Geirangerfjord | Norway | 62.12 | 7.13 | fjord | medium | A narrow fjord lined with waterfalls such as the Seven Sisters. | https://en.wikipedia.org/wiki/Geirangerfjord
North Cape | Norway | 71.17 | 25.78 | cape | medium | A cliff often billed as Europe's northernmost point, above the Barents Sea. | https://en.wikipedia.org/wiki/North_Cape_(Norway)
Svalbard Global Seed Vault | Norway | 78.24 | 15.49 | vault | medium | A vault dug into Arctic permafrost to store backup seeds of the world's crops. | https://en.wikipedia.org/wiki/Svalbard_Global_Seed_Vault
Gullfoss | Iceland | 64.33 | -20.12 | waterfall | medium | A two-tiered waterfall plunging into a deep crevice on the Golden Circle route. | https://en.wikipedia.org/wiki/Gullfoss
Surtsey | Iceland | 63.30 | -20.61 | island | hard | A volcanic island that rose from the sea in an eruption starting in 1963. | https://en.wikipedia.org/wiki/Surtsey
Faroe Islands | Denmark | 62.00 | -6.78 | archipelago | medium | A windswept North Atlantic archipelago of 18 rocky islands. | https://en.wikipedia.org/wiki/Faroe_Islands
Mount Olympus | Greece | 40.09 | 22.36 | summit | easy | In myth the home of twelve gods, it rises to about 2,918 metres. | https://en.wikipedia.org/wiki/Mount_Olympus
Delphi | Greece | 38.48 | 22.50 | ancient site | medium | Ancient sanctuary of Apollo, once thought to be the centre of the world. | https://en.wikipedia.org/wiki/Delphi
Meteora | Greece | 39.71 | 21.63 | monument | medium | Monasteries perched on top of towering sandstone pillars. | https://en.wikipedia.org/wiki/Meteora
Santorini | Greece | 36.41 | 25.43 | island | easy | A crescent island ringing a flooded volcanic caldera. | https://en.wikipedia.org/wiki/Santorini
Mount Athos | Greece | 40.16 | 24.33 | summit | hard | A peninsula peak whose monasteries have barred women for over a thousand years. | https://en.wikipedia.org/wiki/Mount_Athos
Plitvice Lakes | Croatia | 44.88 | 15.62 | lake | medium | Sixteen terraced lakes linked by waterfalls in a forested park. | https://en.wikipedia.org/wiki/Plitvice_Lakes_National_Park
Lake Bled | Slovenia | 46.36 | 14.09 | lake | hard | An Alpine lake with a tiny island church reached by wooden boat. | https://en.wikipedia.org/wiki/Lake_Bled
Wieliczka Salt Mine | Poland | 49.98 | 20.06 | mine | hard | A centuries-old mine with chapels and chandeliers carved from rock salt. | https://en.wikipedia.org/wiki/Wieliczka_Salt_Mine
Lake Ladoga | Russia | 61.00 | 31.50 | lake | medium | Europe's largest lake, whose winter ice road supplied a besieged city. | https://en.wikipedia.org/wiki/Lake_Ladoga
Mount Elbrus | Russia | 43.35 | 42.44 | summit | easy | A dormant twin-peaked volcano, the highest summit in Europe. | https://en.wikipedia.org/wiki/Mount_Elbrus
Mount Ararat | Turkey | 39.70 | 44.30 | volcano | easy | A snow-capped volcano linked by tradition to the landing of Noah's Ark. | https://en.wikipedia.org/wiki/Mount_Ararat
Pamukkale | Turkey | 37.92 | 29.12 | travertine terraces | medium | White terraces of travertine filled by warm mineral springs. | https://en.wikipedia.org/wiki/Pamukkale
Göbekli Tepe | Turkey | 37.22 | 38.92 | ancient site | medium | Carved stone pillars raised about 11,000 years ago. | https://en.wikipedia.org/wiki/G%C3%B6bekli_Tepe
Troy | Turkey | 39.96 | 26.24 | ancient site | medium | Ruins of the city besieged in Homer's Iliad. | https://en.wikipedia.org/wiki/Troy
Mount Nemrut | Turkey | 37.98 | 38.74 | ancient site | hard | A mountaintop tomb ringed by giant stone heads of gods and a king. | https://en.wikipedia.org/wiki/Mount_Nemrut
Mount Everest | Nepal / China | 27.99 | 86.93 | summit | easy | Earth's highest mountain above sea level, at 8,849 metres. | https://en.wikipedia.org/wiki/Mount_Everest
Lake Baikal | Russia | 53.50 | 108.00 | lake | easy | The world's deepest lake, holding about a fifth of Earth's unfrozen fresh surface water. | https://en.wikipedia.org/wiki/Lake_Baikal
Klyuchevskaya Sopka | Russia | 56.06 | 160.64 | volcano | hard | The tallest active volcano in Eurasia, on a Pacific peninsula. | https://en.wikipedia.org/wiki/Klyuchevskaya_Sopka
Wrangel Island | Russia | 71.23 | -179.42 | island | hard | An Arctic island where woolly mammoths survived until about 4,000 years ago. | https://en.wikipedia.org/wiki/Wrangel_Island
Novaya Zemlya | Russia | 74.75 | 57.95 | archipelago | hard | Arctic islands where the most powerful bomb ever was detonated in 1961. | https://en.wikipedia.org/wiki/Novaya_Zemlya
Great Wall at Badaling | China | 40.35 | 116.01 | monument | easy | The most visited section of a defensive wall thousands of kilometres long. | https://en.wikipedia.org/wiki/Badaling
Terracotta Army | China | 34.38 | 109.27 | ancient site | easy | Thousands of life-size clay soldiers buried with an emperor around 210 BC. | https://en.wikipedia.org/wiki/Terracotta_Army
Three Gorges Dam | China | 30.84 | 111.02 | dam | easy | The world's largest power station by installed capacity. | https://en.wikipedia.org/wiki/Three_Gorges_Dam
Zhangjiajie National Forest Park | China | 29.35 | 110.44 | rock formation | medium | Towering sandstone pillars said to have inspired floating mountains in a 2009 film. | https://en.wikipedia.org/wiki/Zhangjiajie_National_Forest_Park
Mount Kailash | China | 31.07 | 81.31 | summit | hard | A sacred peak circled by pilgrims of four religions and never climbed. | https://en.wikipedia.org/wiki/Mount_Kailash
Huangshan | China | 30.12 | 118.17 | summit | medium | Granite peaks above seas of cloud, painted by artists for centuries. | https://en.wikipedia.org/wiki/Huangshan
Leshan Giant Buddha | China | 29.54 | 103.77 | monument | medium | A 71-metre Buddha carved into a cliff where three rivers meet. | https://en.wikipedia.org/wiki/Leshan_Giant_Buddha
FAST radio telescope | China | 25.65 | 106.86 | observatory | hard | A radio dish 500 metres wide set into a natural karst hollow. | https://en.wikipedia.org/wiki/Five-hundred-meter_Aperture_Spherical_Telescope
Potala Palace | China | 29.66 | 91.12 | monument | medium | A white and red hilltop palace, former winter home of the Dalai Lamas. | https://en.wikipedia.org/wiki/Potala_Palace
Mogao Caves | China | 40.04 | 94.80 | ancient site | hard | Nearly 500 Buddhist cave temples on the old Silk Road. | https://en.wikipedia.org/wiki/Mogao_Caves
Mount Fuji | Japan | 35.36 | 138.73 | volcano | easy | A near-symmetrical volcanic cone that is its country's highest peak. | https://en.wikipedia.org/wiki/Mount_Fuji
Itsukushima Shrine | Japan | 34.30 | 132.32 | monument | medium | A shrine whose great gate seems to float at high tide. | https://en.wikipedia.org/wiki/Itsukushima_Shrine
Akashi Kaikyō Bridge | Japan | 34.62 | 135.02 | bridge | hard | Its 1,991-metre central span was the world's longest for 24 years. | https://en.wikipedia.org/wiki/Akashi_Kaiky%C5%8D_Bridge
Sakurajima | Japan | 31.58 | 130.66 | volcano | medium | A very active volcano facing a city across a bay. | https://en.wikipedia.org/wiki/Sakurajima
Hallasan | South Korea | 33.36 | 126.53 | volcano | medium | A shield volcano at the heart of a southern resort island. | https://en.wikipedia.org/wiki/Hallasan
Ha Long Bay | Vietnam | 20.90 | 107.20 | bay | easy | Thousands of limestone islets rising from emerald water. | https://en.wikipedia.org/wiki/H%E1%BA%A1_Long_Bay
Angkor Wat | Cambodia | 13.41 | 103.87 | ancient site | easy | The world's largest religious monument, built in the 12th century. | https://en.wikipedia.org/wiki/Angkor_Wat
Tonlé Sap | Cambodia | 12.88 | 104.07 | lake | hard | A lake that swells several times over when its river reverses each wet season. | https://en.wikipedia.org/wiki/Tonl%C3%A9_Sap
Borobudur | Indonesia | -7.61 | 110.20 | ancient site | easy | The world's largest Buddhist temple, a 9th-century stepped stone monument. | https://en.wikipedia.org/wiki/Borobudur
Krakatoa | Indonesia | -6.10 | 105.42 | volcano | easy | Its 1883 eruption was heard nearly 5,000 kilometres away. | https://en.wikipedia.org/wiki/Krakatoa
Mount Bromo | Indonesia | -7.94 | 112.95 | volcano | medium | An active volcano smoking inside a vast caldera floored with sand. | https://en.wikipedia.org/wiki/Mount_Bromo
Lake Toba | Indonesia | 2.68 | 98.88 | lake | medium | The crater lake of a supervolcano that erupted about 74,000 years ago. | https://en.wikipedia.org/wiki/Lake_Toba
Komodo Island | Indonesia | -8.55 | 119.45 | island | medium | Home of the world's largest living lizards. | https://en.wikipedia.org/wiki/Komodo_(island)
Puncak Jaya | Indonesia | -4.08 | 137.16 | summit | hard | The highest island peak on Earth, with small equatorial glaciers. | https://en.wikipedia.org/wiki/Puncak_Jaya
Mount Kinabalu | Malaysia | 6.08 | 116.56 | summit | medium | A granite peak on Borneo, among the highest in Southeast Asia's islands. | https://en.wikipedia.org/wiki/Mount_Kinabalu
Mayon | Philippines | 13.26 | 123.69 | volcano | medium | A volcano famed for its almost perfectly symmetrical cone. | https://en.wikipedia.org/wiki/Mayon
Chocolate Hills | Philippines | 9.92 | 124.17 | hills | medium | Over a thousand grassy hills that turn brown in the dry season. | https://en.wikipedia.org/wiki/Chocolate_Hills
Bagan | Myanmar | 21.17 | 94.86 | ancient site | medium | A plain dotted with over 2,000 surviving Buddhist temples and pagodas. | https://en.wikipedia.org/wiki/Bagan
Inle Lake | Myanmar | 20.55 | 96.92 | lake | hard | A lake known for fishermen who row standing on one leg. | https://en.wikipedia.org/wiki/Inle_Lake
Taj Mahal | India | 27.18 | 78.04 | monument | easy | A white marble mausoleum built by a Mughal emperor for his wife. | https://en.wikipedia.org/wiki/Taj_Mahal
Ajanta Caves | India | 20.55 | 75.70 | ancient site | medium | Rock-cut Buddhist caves with murals, the oldest from about the 2nd century BC. | https://en.wikipedia.org/wiki/Ajanta_Caves
Konark Sun Temple | India | 19.89 | 86.09 | monument | hard | A 13th-century temple shaped as a giant stone chariot with carved wheels. | https://en.wikipedia.org/wiki/Konark_Sun_Temple
Hampi | India | 15.33 | 76.46 | ancient site | medium | Boulder-strewn ruins of a medieval empire's capital. | https://en.wikipedia.org/wiki/Hampi
Kangchenjunga | Nepal / India | 27.70 | 88.15 | summit | medium | The world's third-highest mountain. | https://en.wikipedia.org/wiki/Kangchenjunga
North Sentinel Island | India | 11.58 | 92.24 | island | medium | Home to an uncontacted people who turn away all outside visitors. | https://en.wikipedia.org/wiki/North_Sentinel_Island
Annapurna | Nepal | 28.60 | 83.82 | summit | medium | The first 8,000-metre peak ever climbed, in 1950, and one of the deadliest. | https://en.wikipedia.org/wiki/Annapurna
Lumbini | Nepal | 27.48 | 83.28 | ancient site | medium | Traditionally held to be the birthplace of the Buddha. | https://en.wikipedia.org/wiki/Lumbini
Paro Taktsang | Bhutan | 27.49 | 89.36 | monument | medium | A monastery clinging to a cliff about 900 metres above a valley. | https://en.wikipedia.org/wiki/Paro_Taktsang
Sigiriya | Sri Lanka | 7.96 | 80.76 | ancient site | medium | A rock fortress once entered through the paws of a giant stone lion. | https://en.wikipedia.org/wiki/Sigiriya
Minaret of Jam | Afghanistan | 34.40 | 64.52 | monument | hard | A 65-metre brick minaret hidden in a remote river gorge for centuries. | https://en.wikipedia.org/wiki/Minaret_of_Jam
Darvaza gas crater | Turkmenistan | 40.25 | 58.44 | crater | medium | A natural gas crater that has been burning since 1971. | https://en.wikipedia.org/wiki/Darvaza_gas_crater
Baikonur Cosmodrome | Kazakhstan | 45.97 | 63.30 | spaceport | medium | Launch site of the first satellite and of the first human in space. | https://en.wikipedia.org/wiki/Baikonur_Cosmodrome
Issyk-Kul | Kyrgyzstan | 42.42 | 77.25 | lake | medium | A high mountain lake that never freezes, despite its altitude. | https://en.wikipedia.org/wiki/Issyk-Kul
Petra | Jordan | 30.33 | 35.44 | ancient site | easy | A city carved into rose-red sandstone cliffs by the Nabataeans. | https://en.wikipedia.org/wiki/Petra
Masada | Israel | 31.32 | 35.35 | ancient site | medium | A clifftop fortress where Jewish rebels held out against Rome until about 73 AD. | https://en.wikipedia.org/wiki/Masada
Baalbek | Lebanon | 34.01 | 36.21 | ancient site | medium | Roman temples resting on some of the largest stones ever quarried. | https://en.wikipedia.org/wiki/Baalbek
Palmyra | Syria | 34.55 | 38.27 | ancient site | medium | An oasis city whose Roman-era temples were blown up in 2015. | https://en.wikipedia.org/wiki/Palmyra
Persepolis | Iran | 29.93 | 52.89 | ancient site | easy | Ceremonial capital of an ancient empire, burned by Alexander the Great in 330 BC. | https://en.wikipedia.org/wiki/Persepolis
Mount Damavand | Iran | 35.95 | 52.11 | volcano | medium | The highest volcano in Asia, rising about 5,600 metres. | https://en.wikipedia.org/wiki/Mount_Damavand
Strait of Hormuz | Indian Ocean | 26.60 | 56.50 | strait | easy | A narrow chokepoint carrying about a fifth of the world's oil trade. | https://en.wikipedia.org/wiki/Strait_of_Hormuz
Ziggurat of Ur | Iraq | 30.96 | 46.10 | ancient site | medium | A stepped Sumerian temple about 4,000 years old. | https://en.wikipedia.org/wiki/Ziggurat_of_Ur
Babylon | Iraq | 32.54 | 44.42 | ancient site | medium | Ruins of the city of Hammurabi and Nebuchadnezzar, on the Euphrates. | https://en.wikipedia.org/wiki/Babylon
Hegra | Saudi Arabia | 26.79 | 37.95 | ancient site | hard | More than 100 Nabataean tombs cut into desert sandstone outcrops. | https://en.wikipedia.org/wiki/Hegra_(Mada%27in_Salih)
Socotra | Yemen | 12.51 | 53.92 | island | hard | An island famous for umbrella-shaped dragon's blood trees. | https://en.wikipedia.org/wiki/Socotra
Bab-el-Mandeb | Indian Ocean | 12.58 | 43.33 | strait | medium | A strait whose name means 'Gate of Grief', guarding a sea's southern end. | https://en.wikipedia.org/wiki/Bab-el-Mandeb
Mount Sinai | Egypt | 28.54 | 33.98 | summit | easy | A granite peak where tradition says Moses received the Ten Commandments. | https://en.wikipedia.org/wiki/Mount_Sinai
Mount Kilimanjaro | Tanzania | -3.08 | 37.35 | volcano | easy | Africa's highest mountain, a free-standing volcano with shrinking glaciers. | https://en.wikipedia.org/wiki/Mount_Kilimanjaro
Victoria Falls | Zambia / Zimbabwe | -17.92 | 25.86 | waterfall | easy | Its local name means 'the smoke that thunders'. | https://en.wikipedia.org/wiki/Victoria_Falls
Abu Simbel | Egypt | 22.34 | 31.63 | ancient site | easy | Rock temples moved uphill in the 1960s to escape a rising reservoir. | https://en.wikipedia.org/wiki/Abu_Simbel
Valley of the Kings | Egypt | 25.74 | 32.60 | ancient site | easy | Burial valley of New Kingdom pharaohs, including Tutankhamun. | https://en.wikipedia.org/wiki/Valley_of_the_Kings
Siwa Oasis | Egypt | 29.21 | 25.52 | oasis | hard | A desert oasis where Alexander the Great consulted the oracle of Amun. | https://en.wikipedia.org/wiki/Siwa_Oasis
Toubkal | Morocco | 31.06 | -7.92 | summit | medium | The highest peak of the Atlas Mountains. | https://en.wikipedia.org/wiki/Toubkal
Aït Benhaddou | Morocco | 31.05 | -7.13 | ancient site | medium | A fortified mud-brick village used as a set for many films. | https://en.wikipedia.org/wiki/A%C3%AFt_Benhaddou
Leptis Magna | Libya | 32.64 | 14.29 | ancient site | hard | A seaside Roman city, birthplace of the emperor Septimius Severus. | https://en.wikipedia.org/wiki/Leptis_Magna
Richat Structure | Mauritania | 21.11 | -11.39 | geological feature | medium | A 40-kilometre ring of rock known as the Eye of the Sahara. | https://en.wikipedia.org/wiki/Richat_Structure
Great Mosque of Djenné | Mali | 13.91 | -4.56 | monument | medium | The world's largest mud-brick building, replastered by the town each year. | https://en.wikipedia.org/wiki/Great_Mosque_of_Djenn%C3%A9
Akosombo Dam | Ghana | 6.30 | 0.06 | dam | hard | A 1965 dam that created the largest reservoir in the world by surface area. | https://en.wikipedia.org/wiki/Akosombo_Dam
Mount Cameroon | Cameroon | 4.22 | 9.17 | volcano | medium | One of Africa's most active volcanoes, rising straight from the Atlantic coast. | https://en.wikipedia.org/wiki/Mount_Cameroon
Lake Nyos | Cameroon | 6.44 | 10.30 | lake | hard | A crater lake whose 1986 carbon dioxide release killed about 1,700 people. | https://en.wikipedia.org/wiki/Lake_Nyos
Mount Nyiragongo | DR Congo | -1.52 | 29.25 | volcano | medium | A volcano holding one of the world's largest lava lakes in its crater. | https://en.wikipedia.org/wiki/Mount_Nyiragongo
Congo River mouth | DR Congo / Angola | -6.08 | 12.45 | river mouth | medium | Mouth of the world's deepest river, pouring a vast brown plume into the Atlantic. | https://en.wikipedia.org/wiki/Congo_River
Lake Tanganyika | Tanzania / DR Congo | -6.10 | 29.50 | lake | medium | The world's longest freshwater lake, about 673 kilometres end to end. | https://en.wikipedia.org/wiki/Lake_Tanganyika
Lake Victoria | Uganda / Kenya / Tanzania | -1.00 | 33.00 | lake | easy | Africa's largest lake by area and a main source of the Nile. | https://en.wikipedia.org/wiki/Lake_Victoria
Lake Natron | Tanzania | -2.42 | 36.00 | lake | hard | A caustic red soda lake, the main breeding ground of lesser flamingos. | https://en.wikipedia.org/wiki/Lake_Natron
Lake Turkana | Kenya | 3.58 | 36.12 | lake | hard | The world's largest permanent desert lake. | https://en.wikipedia.org/wiki/Lake_Turkana
Margherita Peak | DR Congo / Uganda | 0.39 | 29.87 | summit | hard | The highest point of the range nicknamed the Mountains of the Moon. | https://en.wikipedia.org/wiki/Mount_Stanley
Rock-hewn churches of Lalibela | Ethiopia | 12.03 | 39.04 | ancient site | medium | Eleven medieval churches carved down into solid rock. | https://en.wikipedia.org/wiki/Rock-Hewn_Churches,_Lalibela
Dallol | Ethiopia | 14.24 | 40.30 | hydrothermal field | hard | Acid hot springs painting salt flats yellow, green and red. | https://en.wikipedia.org/wiki/Dallol_(hydrothermal_system)
Erta Ale | Ethiopia | 13.61 | 40.66 | volcano | hard | A shield volcano that held a persistent lava lake for decades. | https://en.wikipedia.org/wiki/Erta_Ale
Obelisk of Axum | Ethiopia | 14.13 | 38.72 | monument | hard | A 1,700-year-old carved stone stele returned from Rome in 2005. | https://en.wikipedia.org/wiki/Obelisk_of_Axum
Kariba Dam | Zambia / Zimbabwe | -16.52 | 28.76 | dam | medium | A 1959 arch dam forming the world's largest artificial lake by volume. | https://en.wikipedia.org/wiki/Kariba_Dam
Okavango Delta | Botswana | -19.40 | 22.90 | inland delta | medium | A river delta that drains into a desert instead of the sea. | https://en.wikipedia.org/wiki/Okavango_Delta
Sossusvlei | Namibia | -24.74 | 15.29 | salt pan | medium | A clay pan ringed by some of the world's tallest red dunes. | https://de.wikipedia.org/wiki/Sossusvlei
Fish River Canyon | Namibia | -27.59 | 17.60 | canyon | hard | One of Africa's largest canyons, about 160 kilometres long. | https://en.wikipedia.org/wiki/Fish_River_Canyon
Table Mountain | South Africa | -33.96 | 18.41 | summit | easy | A flat-topped mountain often draped in a 'tablecloth' of cloud. | https://en.wikipedia.org/wiki/Table_Mountain
Cape of Good Hope | South Africa | -34.36 | 18.47 | cape | easy | A rocky headland first rounded by Bartolomeu Dias in 1488. | https://de.wikipedia.org/wiki/Kap_der_Guten_Hoffnung
Cape Agulhas | South Africa | -34.83 | 20.00 | cape | hard | The southern tip of Africa, where two oceans are officially divided. | https://de.wikipedia.org/wiki/Kap_Agulhas
Vredefort impact structure | South Africa | -27.00 | 27.50 | impact crater | hard | The largest verified impact structure on Earth, about two billion years old. | https://en.wikipedia.org/wiki/Vredefort_impact_structure
Robben Island | South Africa | -33.80 | 18.37 | island | medium | An island prison where a future president was held for 18 years. | https://en.wikipedia.org/wiki/Robben_Island
Avenue of the Baobabs | Madagascar | -20.25 | 44.42 | natural feature | medium | A dirt road lined with giant baobab trees hundreds of years old. | https://en.wikipedia.org/wiki/Avenue_of_the_Baobabs
Tsingy de Bemaraha | Madagascar | -18.67 | 44.75 | karst | hard | A forest of razor-sharp limestone pinnacles. | https://en.wikipedia.org/wiki/Tsingy_de_Bemaraha_National_Park
Piton de la Fournaise | France (Réunion) | -21.24 | 55.71 | volcano | hard | One of the world's most active volcanoes, on a tropical Indian Ocean island. | https://en.wikipedia.org/wiki/Piton_de_la_Fournaise
Aldabra | Seychelles | -9.42 | 46.35 | atoll | hard | A raised coral atoll home to about 100,000 giant tortoises. | https://en.wikipedia.org/wiki/Aldabra
Murchison Falls | Uganda | 2.28 | 31.69 | waterfall | hard | Where the Nile forces through a gap just 7 metres wide. | https://en.wikipedia.org/wiki/Murchison_Falls
END PART 1

PLACES PART 2
Lake Assal | Djibouti | 11.65 | 42.42 | lake | hard | A salt lake about 155 metres below sea level, Africa's lowest point. | https://en.wikipedia.org/wiki/Lake_Assal_(Djibouti)
Emi Koussi | Chad | 19.79 | 18.55 | volcano | hard | The highest peak of the Sahara, a huge shield volcano. | https://en.wikipedia.org/wiki/Emi_Koussi
Pico Cão Grande | São Tomé and Príncipe | 0.12 | 6.57 | summit | hard | A needle-shaped volcanic plug towering above equatorial rainforest. | https://en.wikipedia.org/wiki/Pico_C%C3%A3o_Grande
Pico do Fogo | Cape Verde | 14.95 | -24.34 | volcano | hard | A volcano whose 2014 eruption buried villages inside its caldera. | https://en.wikipedia.org/wiki/Pico_do_Fogo
Zanzibar (Unguja) | Tanzania | -6.13 | 39.33 | island | easy | A spice island off East Africa, once a great slave and ivory trading hub. | https://en.wikipedia.org/wiki/Unguja
Grand Canyon | United States | 36.30 | -112.75 | canyon | easy | A mile-deep canyon exposing nearly two billion years of rock layers. | https://en.wikipedia.org/wiki/Grand_Canyon
Mount Rushmore | United States | 43.88 | -103.46 | monument | easy | Four giant faces of national leaders carved into a granite mountain. | https://en.wikipedia.org/wiki/Mount_Rushmore
Golden Gate Bridge | United States | 37.82 | -122.48 | bridge | easy | A suspension bridge painted 'International Orange', spanning a bay's mouth. | https://en.wikipedia.org/wiki/Golden_Gate_Bridge
Hoover Dam | United States | 36.02 | -114.74 | dam | easy | A 1930s concrete arch-gravity dam holding back the reservoir Lake Mead. | https://en.wikipedia.org/wiki/Hoover_Dam
Old Faithful | United States | 44.46 | -110.83 | geyser | easy | A geyser erupting roughly every 90 minutes in the world's first national park. | https://en.wikipedia.org/wiki/Old_Faithful
Niagara Falls | Canada / United States | 43.08 | -79.07 | waterfall | easy | Three waterfalls on a border river between two Great Lakes. | https://en.wikipedia.org/wiki/Niagara_Falls
Mount St. Helens | United States | 46.19 | -122.19 | volcano | easy | A volcano whose 1980 eruption blew away its north flank. | https://en.wikipedia.org/wiki/Mount_St._Helens
Mauna Kea Observatories | United States | 19.82 | -155.47 | observatory | medium | A cluster of telescopes on a dormant volcano about 4,200 metres up in mid-Pacific. | https://en.wikipedia.org/wiki/Mauna_Kea_Observatories
Kīlauea | United States | 19.42 | -155.29 | volcano | medium | One of the world's most active volcanoes, home of the goddess Pele in legend. | https://en.wikipedia.org/wiki/K%C4%ABlauea
Badwater Basin (Death Valley) | United States | 36.25 | -116.83 | desert basin | easy | The lowest point in North America, 86 metres below sea level. | https://en.wikipedia.org/wiki/Badwater_Basin
Crater Lake | United States | 42.95 | -122.10 | lake | medium | The deepest lake in its country, filling a collapsed volcano. | https://en.wikipedia.org/wiki/Crater_Lake
Meteor Crater | United States | 35.03 | -111.02 | impact crater | medium | A 1.2-kilometre crater blasted out by a meteorite about 50,000 years ago. | https://en.wikipedia.org/wiki/Meteor_Crater
Great Salt Lake | United States | 41.17 | -112.53 | lake | easy | The largest saltwater lake in the Western Hemisphere. | https://en.wikipedia.org/wiki/Great_Salt_Lake
Half Dome | United States | 37.75 | -119.53 | summit | medium | A granite dome sliced sheer on one side, above a glacial valley. | https://en.wikipedia.org/wiki/Half_Dome
Devils Tower | United States | 44.59 | -104.72 | monolith | hard | A columnar igneous butte, the first site of its kind declared a national monument, in 1906. | https://en.wikipedia.org/wiki/Devils_Tower
Mammoth Cave | United States | 37.19 | -86.10 | cave | hard | The longest known cave system, with over 680 kilometres surveyed. | https://en.wikipedia.org/wiki/Mammoth_Cave_National_Park
Pueblo Bonito | United States | 36.06 | -107.96 | ancient site | hard | A great house of about 650 rooms built by Ancestral Puebloans. | https://en.wikipedia.org/wiki/Pueblo_Bonito
Kennedy Space Center Launch Complex 39A | United States | 28.61 | -80.60 | spaceport | easy | The launch pad from which Apollo 11 left for the Moon. | https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39A
Antelope Canyon | United States | 36.86 | -111.37 | canyon | medium | A narrow slot canyon of wave-like sandstone lit by shafts of sun. | https://en.wikipedia.org/wiki/Antelope_Canyon
Monument Valley | United States | 36.98 | -110.10 | buttes | medium | Red sandstone buttes made famous by Western films. | https://en.wikipedia.org/wiki/Monument_Valley
Point Barrow | United States | 71.39 | -156.48 | cape | hard | The northernmost point of its country. | https://en.wikipedia.org/wiki/Point_Barrow
Pearl Harbor | United States | 21.37 | -157.98 | harbour | easy | Naval base attacked by surprise in December 1941. | https://en.wikipedia.org/wiki/Pearl_Harbor
Midway Atoll | United States | 28.21 | -177.35 | atoll | medium | An atoll that gave its name to a pivotal 1942 naval battle. | https://en.wikipedia.org/wiki/Midway_Atoll
Moraine Lake | Canada | 51.32 | -116.19 | lake | medium | A glacier-fed turquoise lake beneath a valley of ten peaks. | https://en.wikipedia.org/wiki/Moraine_Lake
Bay of Fundy | Canada | 45.00 | -65.75 | bay | medium | A bay with the world's highest tides, up to about 16 metres. | https://en.wikipedia.org/wiki/Bay_of_Fundy
L'Anse aux Meadows | Canada | 51.60 | -55.53 | ancient site | hard | The only confirmed Norse settlement in the Americas, from around 1000 AD. | https://en.wikipedia.org/wiki/L%27Anse_aux_Meadows
Mount Logan | Canada | 60.57 | -140.41 | summit | hard | The highest mountain of its country, with a vast ice-covered summit plateau. | https://en.wikipedia.org/wiki/Mount_Logan
Hudson Bay | Canada | 60.00 | -86.00 | bay | easy | A vast inland sea, frozen much of the year and patrolled by polar bears. | https://en.wikipedia.org/wiki/Hudson_Bay
Alert | Canada | 82.50 | -62.35 | research station | hard | The northernmost permanently inhabited place on Earth. | https://en.wikipedia.org/wiki/Alert,_Nunavut
Sable Island | Canada | 43.93 | -59.92 | island | hard | A crescent-shaped sandbar island famous for wild horses and shipwrecks. | https://en.wikipedia.org/wiki/Sable_Island
Ilulissat Icefjord | Greenland (Denmark) | 69.15 | -49.55 | fjord | hard | A fjord choked with icebergs from one of the fastest-moving glaciers. | https://en.wikipedia.org/wiki/Ilulissat_Icefjord
Chichén Itzá | Mexico | 20.68 | -88.57 | ancient site | easy | A Maya city whose pyramid casts a serpent shadow at the equinoxes. | https://en.wikipedia.org/wiki/Chichen_Itza
Popocatépetl | Mexico | 19.02 | -98.63 | volcano | medium | A highly active snow-capped volcano whose name means 'Smoking Mountain'. | https://en.wikipedia.org/wiki/Popocat%C3%A9petl
Pico de Orizaba | Mexico | 19.03 | -97.27 | volcano | medium | The highest mountain of its country and North America's highest volcano. | https://en.wikipedia.org/wiki/Pico_de_Orizaba
Tulum | Mexico | 20.21 | -87.43 | ancient site | medium | A walled Maya port perched on Caribbean cliffs. | https://en.wikipedia.org/wiki/Tulum
Palenque | Mexico | 17.48 | -92.05 | ancient site | medium | A Maya city where King Pakal's richly furnished tomb was found in 1952. | https://en.wikipedia.org/wiki/Palenque
Chicxulub crater | Mexico | 21.40 | -89.50 | impact crater | hard | A buried crater from the asteroid linked to the dinosaurs' extinction. | https://en.wikipedia.org/wiki/Chicxulub_crater
Parícutin | Mexico | 19.49 | -102.25 | volcano | hard | A volcano that began erupting in a farmer's cornfield in 1943. | https://en.wikipedia.org/wiki/Par%C3%ADcutin
Cave of the Crystals | Mexico | 27.85 | -105.50 | cave | hard | A cave holding selenite crystals up to about 12 metres long. | https://en.wikipedia.org/wiki/Cave_of_the_Crystals
Tikal | Guatemala | 17.22 | -89.62 | ancient site | easy | A Maya city whose temples rise above the rainforest canopy. | https://en.wikipedia.org/wiki/Tikal
Lake Atitlán | Guatemala | 14.70 | -91.20 | lake | medium | A deep crater lake ringed by three volcanoes. | https://en.wikipedia.org/wiki/Lake_Atitl%C3%A1n
Great Blue Hole | Belize | 17.32 | -87.53 | sinkhole | medium | A circular marine sinkhole over 300 metres wide. | https://en.wikipedia.org/wiki/Great_Blue_Hole
Copán | Honduras | 14.84 | -89.14 | ancient site | medium | A Maya city famed for its hieroglyphic stairway. | https://en.wikipedia.org/wiki/Cop%C3%A1n
Masaya Volcano | Nicaragua | 11.98 | -86.16 | volcano | hard | A volcano with an occasionally visible lava lake, once called the 'mouth of hell'. | https://en.wikipedia.org/wiki/Masaya_Volcano
Arenal Volcano | Costa Rica | 10.46 | -84.70 | volcano | medium | A conical volcano that erupted continuously from 1968 to 2010. | https://en.wikipedia.org/wiki/Arenal_Volcano
Cocos Island | Costa Rica | 5.53 | -87.06 | island | hard | A remote Pacific island famed for hammerhead sharks and pirate-treasure legends. | https://en.wikipedia.org/wiki/Cocos_Island
Gatun Lake | Panama | 9.20 | -79.90 | lake | hard | A dammed lake that ships cross on a route between two oceans. | https://en.wikipedia.org/wiki/Gatun_Lake
Pico Duarte | Dominican Republic | 19.02 | -71.00 | summit | hard | The highest peak in the Caribbean. | https://en.wikipedia.org/wiki/Pico_Duarte
Machu Picchu | Peru | -13.16 | -72.55 | ancient site | easy | A 15th-century Inca citadel on a ridge above a river gorge. | https://en.wikipedia.org/wiki/Machu_Picchu
Angel Falls | Venezuela | 5.97 | -62.54 | waterfall | easy | The world's tallest uninterrupted waterfall, about 979 metres. | https://en.wikipedia.org/wiki/Angel_Falls
Iguazu Falls | Argentina / Brazil | -25.69 | -54.44 | waterfall | easy | About 275 drops on a border river, including the Devil's Throat. | https://en.wikipedia.org/wiki/Iguazu_Falls
Aconcagua | Argentina | -32.65 | -70.01 | summit | easy | The highest mountain outside Asia, at about 6,961 metres. | https://en.wikipedia.org/wiki/Aconcagua
Lake Titicaca | Peru / Bolivia | -15.82 | -69.33 | lake | easy | One of the highest large navigable lakes, about 3,800 metres up. | https://en.wikipedia.org/wiki/Lake_Titicaca
Salar de Uyuni | Bolivia | -20.13 | -67.49 | salt flat | easy | The world's largest salt flat, a giant mirror after rain. | https://en.wikipedia.org/wiki/Salar_de_Uyuni
Paranal Observatory | Chile | -24.63 | -70.40 | observatory | medium | Home of the Very Large Telescope, in one of Earth's driest deserts. | https://en.wikipedia.org/wiki/Paranal_Observatory
ALMA | Chile | -23.02 | -67.75 | observatory | hard | Sixty-six radio antennas on a plateau about 5,000 metres high. | https://en.wikipedia.org/wiki/Atacama_Large_Millimeter_Array
Easter Island | Chile | -27.12 | -109.35 | island | easy | A remote Pacific island dotted with nearly 1,000 moai statues. | https://en.wikipedia.org/wiki/Easter_Island
Perito Moreno Glacier | Argentina | -50.50 | -73.13 | glacier | medium | A glacier whose ice dam periodically ruptures in spectacular collapses. | https://en.wikipedia.org/wiki/Perito_Moreno_Glacier
Cape Horn | Chile | -55.98 | -67.29 | cape | easy | A notorious headland at the southern tip of the Americas. | https://en.wikipedia.org/wiki/Cape_Horn
Strait of Magellan | Chile | -54.00 | -71.00 | strait | easy | A strait first navigated in 1520 by an expedition that circled the globe. | https://en.wikipedia.org/wiki/Strait_of_Magellan
Nazca Lines | Peru | -14.70 | -75.14 | ancient site | easy | Giant figures etched into the desert, best seen from the air. | https://en.wikipedia.org/wiki/Nazca_Lines
Colca Canyon | Peru | -15.60 | -71.88 | canyon | hard | One of the world's deepest canyons, patrolled by Andean condors. | https://en.wikipedia.org/wiki/Colca_Canyon
Huascarán | Peru | -9.12 | -77.60 | summit | hard | The highest point in the tropics; a 1970 avalanche from it buried a town. | https://en.wikipedia.org/wiki/Huascar%C3%A1n
Rainbow Mountain | Peru | -13.87 | -71.30 | summit | medium | Striped mineral slopes in red, yellow and turquoise above 5,000 metres. | https://en.wikipedia.org/wiki/Vinicunca
Chan Chan | Peru | -8.11 | -79.07 | ancient site | hard | The largest adobe city of the pre-Columbian Americas. | https://en.wikipedia.org/wiki/Chan_Chan
Cotopaxi | Ecuador | -0.68 | -78.44 | volcano | medium | One of the world's highest active volcanoes, an ice-capped cone near the equator. | https://en.wikipedia.org/wiki/Cotopaxi
Chimborazo | Ecuador | -1.47 | -78.82 | volcano | medium | Its summit is the farthest point from Earth's centre. | https://en.wikipedia.org/wiki/Chimborazo
Galápagos Islands | Ecuador | -0.50 | -90.50 | archipelago | easy | Volcanic islands whose finches and tortoises inspired Darwin. | https://en.wikipedia.org/wiki/Gal%C3%A1pagos_Islands
Ciudad Perdida | Colombia | 11.04 | -73.93 | ancient site | hard | A jungle city of stone terraces about 650 years older than Machu Picchu. | https://en.wikipedia.org/wiki/Ciudad_Perdida
Lake Maracaibo | Venezuela | 9.82 | -71.56 | lake | medium | A brackish lake famous for near-nightly lightning storms. | https://en.wikipedia.org/wiki/Lake_Maracaibo
Amazon River mouth | Brazil | 0.71 | -50.09 | river mouth | easy | Where the river with the largest discharge on Earth meets the Atlantic. | https://en.wikipedia.org/wiki/Amazon_River
Fernando de Noronha | Brazil | -3.85 | -32.42 | archipelago | hard | A volcanic Atlantic archipelago with strict limits on visitor numbers. | https://en.wikipedia.org/wiki/Fernando_de_Noronha
Valdés Peninsula | Argentina | -42.50 | -64.00 | peninsula | hard | A peninsula where orcas beach themselves to hunt sea lions. | https://en.wikipedia.org/wiki/Vald%C3%A9s_Peninsula
Ojos del Salado | Chile / Argentina | -27.11 | -68.54 | volcano | hard | The highest active volcano on Earth. | https://en.wikipedia.org/wiki/Ojos_del_Salado
Osorno Volcano | Chile | -41.10 | -72.50 | volcano | hard | A snow-capped cone mirrored in a lake, often likened to Mount Fuji. | https://en.wikipedia.org/wiki/Osorno_(volcano)
Robinson Crusoe Island | Chile | -33.64 | -78.84 | island | hard | A marooned sailor's stay here inspired a famous 1719 novel. | https://en.wikipedia.org/wiki/Robinson_Crusoe_Island
Uluru | Australia | -25.34 | 131.04 | monolith | easy | A huge sandstone monolith that glows red at sunset. | https://en.wikipedia.org/wiki/Uluru
Twelve Apostles | Australia | -38.67 | 143.10 | sea stacks | medium | Limestone sea stacks along a famous coastal road; fewer than twelve still stand. | https://en.wikipedia.org/wiki/The_Twelve_Apostles_(Victoria)
Kata Tjuta | Australia | -25.30 | 130.73 | rock formation | hard | A cluster of 36 domed rocks near a more famous monolith. | https://en.wikipedia.org/wiki/Kata_Tjuta
Kati Thanda–Lake Eyre | Australia | -28.67 | 137.33 | lake | medium | A usually dry salt lake at the lowest point of its continent. | https://en.wikipedia.org/wiki/Kati_Thanda%E2%80%93Lake_Eyre
K'gari (Fraser Island) | Australia | -25.24 | 153.15 | island | medium | The largest sand island in the world. | https://en.wikipedia.org/wiki/K%27gari
Mount Kosciuszko | Australia | -36.46 | 148.26 | summit | medium | The highest mountain on its country's mainland, named after a Polish general. | https://en.wikipedia.org/wiki/Mount_Kosciuszko
Parkes Observatory | Australia | -33.00 | 148.26 | observatory | hard | A radio dish that relayed TV pictures of the 1969 Moon landing. | https://en.wikipedia.org/wiki/Parkes_Observatory
Shark Bay | Australia | -25.50 | 113.50 | bay | hard | A bay where living stromatolites grow, like some of the earliest life on Earth. | https://en.wikipedia.org/wiki/Shark_Bay
Ningaloo Reef | Australia | -22.56 | 113.81 | reef | hard | A fringing reef where whale sharks gather each autumn. | https://en.wikipedia.org/wiki/Ningaloo_Coast
Cape York | Australia | -10.69 | 142.53 | cape | medium | The northernmost point of a continent's mainland. | https://en.wikipedia.org/wiki/Cape_York_(Queensland)
Lord Howe Island | Australia | -31.55 | 159.09 | island | hard | A crescent volcanic island; the spire of Ball's Pyramid stands offshore. | https://en.wikipedia.org/wiki/Lord_Howe_Island
Aoraki / Mount Cook | New Zealand | -43.59 | 170.14 | summit | medium | The highest mountain of its country, where Edmund Hillary honed his climbing. | https://en.wikipedia.org/wiki/Aoraki_/_Mount_Cook
Milford Sound | New Zealand | -44.65 | 167.91 | fjord | medium | A rainy fjord where Mitre Peak rises straight from the sea. | https://en.wikipedia.org/wiki/Milford_Sound
Mount Ruapehu | New Zealand | -39.28 | 175.57 | volcano | hard | An active volcano with ski fields and a hot crater lake. | https://en.wikipedia.org/wiki/Mount_Ruapehu
Lake Taupō | New Zealand | -38.81 | 175.91 | lake | medium | The crater lake of a supervolcano that erupted violently about 1,800 years ago. | https://en.wikipedia.org/wiki/Lake_Taup%C5%8D
Whakaari / White Island | New Zealand | -37.52 | 177.18 | volcano | hard | An offshore volcano where a 2019 eruption killed 22 visitors. | https://en.wikipedia.org/wiki/Whakaari_/_White_Island
Cape Reinga | New Zealand | -34.42 | 172.68 | cape | hard | A headland where two seas meet, sacred as the departure point of spirits. | https://en.wikipedia.org/wiki/Cape_Reinga
Waitomo Caves | New Zealand | -38.26 | 175.10 | cave | hard | Caves lit by thousands of glowworms. | https://www.geonames.org/search.html?q=Waitomo
Bora Bora | France (French Polynesia) | -16.50 | -151.74 | island | easy | A lagoon island famous for overwater bungalows beneath a volcanic peak. | https://en.wikipedia.org/wiki/Bora_Bora
Moruroa | France (French Polynesia) | -21.83 | -138.83 | atoll | hard | An atoll used for nuclear weapons tests until 1996. | https://en.wikipedia.org/wiki/Moruroa
Bikini Atoll | Marshall Islands | 11.60 | 165.40 | atoll | easy | An atoll hit by 23 nuclear tests, later the swimsuit's namesake. | https://en.wikipedia.org/wiki/Bikini_Atoll
Nan Madol | Micronesia | 6.84 | 158.33 | ancient site | hard | A ruined city of basalt columns built on artificial islets in a lagoon. | https://en.wikipedia.org/wiki/Nan_Madol
Mount Yasur | Vanuatu | -19.53 | 169.45 | volcano | hard | A volcano that has erupted almost continuously for centuries; visitors peer into it. | https://en.wikipedia.org/wiki/Mount_Yasur
Mount Wilhelm | Papua New Guinea | -5.80 | 145.03 | summit | hard | The highest peak of its country; on clear days both coasts can be seen. | https://en.wikipedia.org/wiki/Mount_Wilhelm
Pitcairn Island | United Kingdom | -25.07 | -130.10 | island | hard | Where mutineers from HMS Bounty settled in 1790. | https://en.wikipedia.org/wiki/Pitcairn_Islands
Challenger Deep | Pacific Ocean | 11.37 | 142.59 | ocean trench | easy | The deepest known point in the oceans, nearly 11 kilometres down. | https://en.wikipedia.org/wiki/Challenger_Deep
Kiritimati | Kiribati | 1.85 | -157.40 | atoll | hard | The largest coral atoll by land area, among the first places to see each new year. | https://en.wikipedia.org/wiki/Kiritimati
Hunga Tonga–Hunga Ha'apai | Tonga | -20.55 | -175.39 | volcano | hard | An undersea volcano whose 2022 eruption was the largest recorded this century. | https://en.wikipedia.org/wiki/Hunga_Tonga%E2%80%93Hunga_Ha%CA%BBapai
Amundsen–Scott South Pole Station | Antarctica | -90.00 | 0.00 | research station | easy | A research station at the very bottom of the Earth, first built in 1956. | https://en.wikipedia.org/wiki/Amundsen%E2%80%93Scott_South_Pole_Station
McMurdo Station | Antarctica | -77.85 | 166.67 | research station | medium | The largest research base on its continent, home to about 1,000 people in summer. | https://en.wikipedia.org/wiki/McMurdo_Station
Vostok Station | Antarctica | -78.46 | 106.84 | research station | hard | The station that recorded Earth's lowest measured air temperature, −89.2°C. | https://en.wikipedia.org/wiki/Vostok_Station
Concordia Station | Antarctica | -75.10 | 123.33 | research station | hard | A base high on an ice dome, used to study isolation for missions to Mars. | https://en.wikipedia.org/wiki/Concordia_Station
Mount Erebus | Antarctica | -77.53 | 167.15 | volcano | medium | The southernmost active volcano, with a long-lived lava lake. | https://en.wikipedia.org/wiki/Mount_Erebus
Vinson Massif | Antarctica | -78.53 | -85.62 | summit | medium | The highest peak on its continent, about 4,892 metres. | https://en.wikipedia.org/wiki/Vinson_Massif
Deception Island | Antarctica | -62.96 | -60.64 | island | hard | A flooded volcanic caldera that ships enter through a narrow gap. | https://en.wikipedia.org/wiki/Deception_Island
Palmer Station | Antarctica | -64.77 | -64.05 | research station | hard | A research base on an island off a long peninsula, built in 1968. | https://en.wikipedia.org/wiki/Palmer_Station
Rothera Research Station | Antarctica | -67.57 | -68.12 | research station | hard | A research base with a gravel runway on an island off a long peninsula. | https://en.wikipedia.org/wiki/Rothera_Research_Station
Princess Elisabeth Antarctica | Antarctica | -71.95 | 23.35 | research station | hard | The first zero-emission polar research station, opened in 2009. | https://en.wikipedia.org/wiki/Princess_Elisabeth_Antarctica
Tristan da Cunha | United Kingdom | -37.12 | -12.29 | island | hard | The most remote inhabited archipelago, about 2,400 kilometres from the nearest settlement. | https://en.wikipedia.org/wiki/Tristan_da_Cunha
Bouvet Island | Norway | -54.42 | 3.36 | island | hard | An ice-covered volcanic island, often called the most remote island on Earth. | https://www.geonames.org/3371122
Saint Helena | United Kingdom | -15.96 | -5.71 | island | medium | The remote South Atlantic island where Napoleon died in exile. | https://www.geonames.org/3370750
Christmas Island | Australia | -10.49 | 105.63 | island | hard | Millions of red crabs migrate across this island to the sea each year. | https://en.wikipedia.org/wiki/Christmas_Island
Point Nemo | Pacific Ocean | -48.88 | -123.39 | pole of inaccessibility | medium | The ocean spot farthest from any land, where old spacecraft are sunk. | https://en.wikipedia.org/wiki/Point_Nemo
Strait of Dover | Atlantic Ocean | 51.00 | 1.50 | strait | easy | The narrowest part of a busy sea channel, about 33 kilometres across. | https://en.wikipedia.org/wiki/Strait_of_Dover
Strait of Gibraltar | Atlantic Ocean | 35.95 | -5.50 | strait | easy | A 14-kilometre-wide gap between two continents at the Mediterranean's mouth. | https://en.wikipedia.org/wiki/Strait_of_Gibraltar
Bering Strait | Pacific Ocean | 65.75 | -168.98 | strait | easy | A strait about 82 kilometres wide separating two continents near the Arctic Circle. | https://en.wikipedia.org/wiki/Bering_Strait
Torres Strait | Pacific Ocean | -9.83 | 142.50 | strait | hard | An island-strewn strait between a huge island and a continent's northern tip. | https://en.wikipedia.org/wiki/Torres_Strait
Strait of Messina | Mediterranean Sea | 38.25 | 15.63 | strait | medium | A narrow strait between a big island and a peninsula's toe, home of Scylla and Charybdis. | https://en.wikipedia.org/wiki/Strait_of_Messina
Cook Strait | Pacific Ocean | -41.23 | 174.48 | strait | hard | A strait between two main islands, named after an 18th-century navigator. | https://en.wikipedia.org/wiki/Cook_Strait
Bass Strait | Pacific Ocean | -40.00 | 146.00 | strait | hard | A stormy strait separating a large southern island from its mainland. | https://en.wikipedia.org/wiki/Bass_Strait
Beerenberg | Norway | 71.08 | -8.16 | volcano | hard | The world's northernmost active volcano above sea level, on a remote Arctic island. | https://en.wikipedia.org/wiki/Beerenberg
Wreck of the Titanic | Atlantic Ocean | 41.73 | -49.95 | shipwreck | easy | Wreck of a liner that sank in 1912 after hitting an iceberg. | https://en.wikipedia.org/wiki/Wreck_of_the_Titanic
Lake Superior | Canada / United States | 47.70 | -87.50 | lake | easy | The largest freshwater lake in the world by surface area. | https://en.wikipedia.org/wiki/Lake_Superior
Caspian Sea | Russia / Kazakhstan / Turkmenistan / Iran / Azerbaijan | 42.00 | 50.50 | lake | easy | The largest inland body of water on Earth, bordered by five countries. | https://en.wikipedia.org/wiki/Caspian_Sea
Chernobyl Nuclear Power Plant | Ukraine | 51.39 | 30.10 | power plant | easy | Site of the 1986 nuclear disaster, now inside a 30-kilometre exclusion zone. | https://en.wikipedia.org/wiki/Chernobyl_Nuclear_Power_Plant
Hiroshima Peace Memorial | Japan | 34.40 | 132.45 | monument | easy | A domed ruin left standing near the hypocentre of a 1945 atomic bomb. | https://en.wikipedia.org/wiki/Hiroshima_Peace_Memorial
Christ the Redeemer | Brazil | -22.95 | -43.21 | monument | easy | A 30-metre Art Deco statue of Jesus with outstretched arms atop a granite peak. | https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)
Hollywood Sign | United States | 34.13 | -118.32 | landmark | easy | Nine giant white letters on a hillside; the 1923 original advertised a housing development. | https://en.wikipedia.org/wiki/Hollywood_Sign
North Pole | Arctic Ocean | 90.00 | 0.00 | geographic pole | easy | The northern end of Earth's axis, usually covered by drifting sea ice. | https://en.wikipedia.org/wiki/North_Pole
Tasmania | Australia | -42.00 | 147.00 | island | easy | A heart-shaped island whose striped marsupial 'tiger' was hunted to extinction. | https://en.wikipedia.org/wiki/Tasmania
Sicily | Italy | 37.50 | 14.00 | island | easy | The largest island in the Mediterranean, just off a peninsula's toe. | https://en.wikipedia.org/wiki/Sicily
Borneo | Indonesia / Malaysia / Brunei | 0.00 | 114.00 | island | easy | The third-largest island on Earth, shared by three countries. | https://en.wikipedia.org/wiki/Borneo
Crete | Greece | 35.21 | 24.91 | island | easy | A large Mediterranean island, heart of the Bronze Age Minoan civilisation. | https://en.wikipedia.org/wiki/Crete
Bali | Indonesia | -8.34 | 115.09 | island | easy | A Hindu-majority island famed for terraced rice fields and temples. | https://en.wikipedia.org/wiki/Bali
Fukushima Daiichi Nuclear Power Plant | Japan | 37.42 | 141.03 | power plant | easy | A nuclear plant crippled by a tsunami in 2011. | https://en.wikipedia.org/wiki/Fukushima_Daiichi_Nuclear_Power_Plant
Omaha Beach | France | 49.37 | -0.87 | beach | easy | A D-Day landing beach where American troops suffered heavy losses in 1944. | https://en.wikipedia.org/wiki/Omaha_Beach
Mount Pinatubo | Philippines | 15.14 | 120.35 | volcano | medium | Its 1991 eruption cooled global temperatures by about half a degree Celsius. | https://en.wikipedia.org/wiki/Mount_Pinatubo
Ben Nevis | United Kingdom | 56.80 | -5.00 | summit | medium | The highest mountain in the British Isles, often wrapped in cloud. | https://en.wikipedia.org/wiki/Ben_Nevis
Tierra del Fuego | Chile / Argentina | -54.00 | -69.00 | island | medium | A large island at the southern tip of the Americas, named for its natives' fires. | https://en.wikipedia.org/wiki/Isla_Grande_de_Tierra_del_Fuego
END PART 2
