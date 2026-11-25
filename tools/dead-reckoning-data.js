// Builds the Dead Reckoning place list from data already in the repo, and writes it into dead-reckoning.html
// between the "places:start" and "places:end" markers. Run: node tools/dead-reckoning-data.js
// Sources: Mystery city's list (index.html), Bigger city?'s list (bigger.html), the countries in data/countries.txt.
// Places review/data-changes.md flags (districts, wrong figures) are left out, and only names with a common
// English spelling are kept. Coordinates come from those lists; nothing is made up.
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const str = (s) => Function('"use strict";return "' + s + '"')();

// countries.txt: name, landlocked/coastal/island, currency, highest point
const C = {};
read("data/countries.txt").split("\n").filter((l) => l && l[0] !== "#").forEach((l) => {
  const f = l.split("|");
  C[f[0]] = { kind: f[2], cur: f[3].replace(/\s*\(.*\)$/, ""), high: f[8] };
});
// the lists use a few other names for the same countries
const ALIAS = { "Czechia": "Czech Republic", "Türkiye": "Turkey", "East Timor": "Timor-Leste", "Ivory Coast": "Ivory Coast", "Côte d'Ivoire": "Ivory Coast", "Cape Verde": "Cabo Verde", "Swaziland": "Eswatini", "Macedonia": "North Macedonia", "Burma": "Myanmar", "East Timor": "Timor-Leste", "Congo (Kinshasa)": "Democratic Republic of the Congo", "DR Congo": "Democratic Republic of the Congo", "Congo (Brazzaville)": "Republic of the Congo", "Republic of Congo": "Republic of the Congo", "Vatican": "Vatican City", "Turkiye": "Turkey", "Türkiye": "Turkey", "USA": "United States", "UK": "United Kingdom", "Micronesia": "Micronesia", "The Gambia": "Gambia", "The Bahamas": "Bahamas", "São Tomé and Príncipe": "Sao Tome and Principe" };
const cname = (c) => (C[c] ? c : C[ALIAS[c]] ? ALIAS[c] : null);

// review/data-changes.md: districts and likely wrong entries in the city lists
const FLAGGED = ["Queens", "Kowloon", "Çankaya", "Cankaya", "Gustavo A. Madero", "Pasragad Branch", "Budta", "Camayenne", "Chakwama", "Kampung Baru Subang", "Guli", "Tanda", "Malingao", "Nowrangapur", "Nur-Sultan",
  // other districts listed beside their parent city
  "Brooklyn", "Manhattan", "The Bronx", "Bronx", "Staten Island", "Esenler", "Bağcılar", "Bagcilar", "Küçükçekmece", "Kucukcekmece", "Ümraniye", "Umraniye", "Bahçelievler", "Bahcelievler", "Pendik", "Sultangazi", "Üsküdar", "Uskudar", "Kadıköy", "Kadikoy", "Esenyurt", "Keçiören", "Kecioren", "Yenimahalle", "Iztapalapa", "Ecatepec", "Soacha", "Kowloon City", "Sha Tin", "Tuen Mun", "Yuen Long", "Kwun Tong"];
// common English spellings for a few names the lists keep in their own spelling
const ENGLISH = { "Kraków": "Krakow", "Bogotá": "Bogota", "Brasília": "Brasilia", "Asunción": "Asuncion", "Reykjavík": "Reykjavik", "Zürich": "Zurich", "São Paulo": "Sao Paulo", "Malmö": "Malmo", "Düsseldorf": "Dusseldorf", "Köln": "Cologne", "München": "Munich", "Nürnberg": "Nuremberg", "Medellín": "Medellin", "Querétaro": "Queretaro", "Mérida": "Merida", "Yaoundé": "Yaounde", "Lomé": "Lome", "Nouméa": "Noumea", "San José": "San Jose", "Panamá": "Panama City", "Ciudad de México": "Mexico City", "Belém": "Belem", "Göteborg": "Gothenburg", "Gothenburg": "Gothenburg", "Montréal": "Montreal", "Québec": "Quebec City", "Málaga": "Malaga", "Córdoba": "Cordoba", "Sevilla": "Seville", "Bucureşti": "Bucharest", "Bucharest": "Bucharest", "Wrocław": "Wroclaw", "Łódź": "Lodz", "Poznań": "Poznan", "Gdańsk": "Gdansk", "Curaçao": "Curacao", "Tórshavn": "Torshavn", "Nuuk": "Nuuk", "Washington, D.C.": "Washington, D.C.", "Xi’an": "Xi'an", "Ürümqi": "Urumqi", "Sūrat": "Surat", "İzmir": "Izmir", "Ludhiāna": "Ludhiana", "Juárez": "Ciudad Juarez", "León de los Aldama": "Leon", "Ghāziābād": "Ghaziabad", "Rājkot": "Rajkot", "Goiânia": "Goiania", "Allahābād": "Prayagraj", "Fès": "Fez", "Culiacán": "Culiacan", "Acapulco de Juárez": "Acapulco", "João Pessoa": "Joao Pessoa", "Diyarbakır": "Diyarbakir", "Santiago de Querétaro": "Queretaro", "Ta‘izz": "Taiz", "Bouaké": "Bouake", "Ta’if": "Taif", "Cuiabá": "Cuiaba", "Ryazan’": "Ryazan", "Stavropol’": "Stavropol", "Maturín": "Maturin", "Camagüey": "Camaguey", "Constanţa": "Constanta", "Mazār-e Sharīf": "Mazar-i-Sharif", "Genève": "Geneva", "Liège": "Liege", "Pécs": "Pecs", "Ploieşti": "Ploiesti", "Sumqayıt": "Sumqayit", "Orūmīyeh": "Urmia", "Ḩamāh": "Hama", "Hamhŭng": "Hamhung", "Arāk": "Arak", "Ar Rayyān": "Al Rayyan" };
const english = (n) => (ENGLISH[n] ? ENGLISH[n] : /^[A-Za-z .'-]+$/.test(n) ? n : null);

const places = new Map();
function add(name, country, lat, lon, pop, capital) {
  if (FLAGGED.includes(name)) return;
  const en = english(name), cn = cname(country);
  if (!en || !cn || !isFinite(lat) || !isFinite(lon) || !(pop > 0)) return;
  const key = en + "|" + cn;
  const old = places.get(key);
  if (old) { old.capital = old.capital || capital; return; }
  places.set(key, { name: en, country: cn, lat: +(+lat).toFixed(3), lon: +(+lon).toFixed(3), pop: +pop, capital: !!capital });
}
// Mystery city: {..., city:"Prague", country:"Czechia", cc:"CZ", cid:203, lat:50.088, lon:14.4208, pop:1165581, capital:!0, ...}
const mystery = [];
for (const m of read("index.html").matchAll(/\{n:(\d+),date:"[^"]*",d:\d+,city:"((?:[^"\\]|\\.)*)",country:"((?:[^"\\]|\\.)*)",cc:"\w+",cid:\d+,lat:([-.\d]+),lon:([-.\d]+),pop:(\d+),capital:!([01])/g)) {
  add(str(m[2]), str(m[3]), m[4], m[5], m[6], m[7] === "0");
  mystery[+m[1]] = { name: english(str(m[2])) || str(m[2]), country: cname(str(m[3])) || str(m[3]) };
}
// Bigger city?: {name:"Krakow", country:"Poland", pop:755050, lat:50.06, lon:19.93}
for (const m of read("bigger.html").matchAll(/\{name:"((?:[^"\\]|\\.)*)",country:"((?:[^"\\]|\\.)*)",pop:(\d+),lat:([-.\d]+),lon:([-.\d]+)\}/g))
  add(str(m[1]), str(m[2]), m[4], m[5], m[3], false);
// Capitals named in the country table (country.html carries the same table as data/countries.txt plus capitals)
const caps = {};
for (const m of read("country.html").matchAll(/name:"((?:[^"\\]|\\.)*)",continent:"[^"]*",capital:"((?:[^"\\]|\\.)*)"/g)) caps[cname(str(m[1])) || str(m[1])] = str(m[2]);
for (const p of places.values()) if (caps[p.country] && (english(caps[p.country]) === p.name)) p.capital = true;

// How well known: population, with capitals counted as better known than their size (a capital of 1 million
// ranks with a city of 5 million). Round 5 is small capitals and small cities; rounds 1-4 split the rest by fame.
let list = [...places.values()];
const FAMOUS = ["New Delhi", "Washington, D.C."]; // capitals whose listed population is the core city only
list.forEach((p) => { p.fame = FAMOUS.includes(p.name) ? 5e7 : p.pop * (p.capital ? 5 : 1); });
list.sort((a, b) => b.fame - a.fame || a.name.localeCompare(b.name));
list.forEach((p) => { p.tier = p.fame < 2.5e6 && (p.capital || p.pop < 2.5e5) ? 5 : 0; });
const SIZES = [110, 130, 140];
let i = 0;
list.forEach((p) => { if (p.tier) return; p.tier = i < SIZES[0] ? 1 : i < SIZES[0] + SIZES[1] ? 2 : i < SIZES[0] + SIZES[1] + SIZES[2] ? 3 : 4; i++; });
list.sort((a, b) => a.tier - b.tier || b.fame - a.fame || a.name.localeCompare(b.name));
const counts = [1, 2, 3, 4, 5].map((t) => list.filter((p) => p.tier === t).length);
console.log("places by round:", counts.join(" "), "total", list.length);
const facts = {};
list.forEach((p) => { const c = C[p.country]; facts[p.country] = [c.kind, c.cur, c.high]; });
// Duet's source-checked places that aren't cities (review/dead-reckoning-places.md), used from No. 14 on.
// The ten Duet flagged as overlapping the city list are left out. Fields kept: name, where (shown on the reveal
// only, never used for scoring), lat, lon, kind, difficulty (1 easy, 2 medium, 3 hard), clue.
const OVERLAP = ["Christ the Redeemer", "Hollywood Sign", "Golden Gate Bridge", "Hiroshima Peace Memorial", "Pearl Harbor", "Table Mountain", "Robben Island", "Alhambra", "Potala Palace", "Leaning Tower of Pisa"];
const landmarks = [];
let inPart = false;
read("review/dead-reckoning-places.md").split("\n").forEach((l) => {
  if (/^PLACES PART \d/.test(l)) { inPart = true; return; }
  if (/^END PART \d/.test(l)) { inPart = false; return; }
  if (!inPart || !l.trim()) return;
  const f = l.split(" | ");
  if (f.length !== 8) throw new Error("bad line: " + l);
  if (OVERLAP.includes(f[0])) return;
  const lat = Number(f[2]), lon = Number(f[3]), diff = { easy: 1, medium: 2, hard: 3 }[f[5]];
  if (!isFinite(lat) || !isFinite(lon) || !diff || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw new Error("bad values: " + l);
  landmarks.push([f[0], f[1], lat, lon, f[4], diff, f[6]]);
});
console.log("landmarks:", landmarks.length, [1, 2, 3].map((d) => landmarks.filter((x) => x[5] === d).length).join(" "));
const out = "var DR_PLACES=" + JSON.stringify(list.map((p) => [p.name, p.country, p.lat, p.lon, p.pop, p.capital ? 1 : 0, p.tier])) + ";\n"
  + "var DR_COUNTRIES=" + JSON.stringify(facts) + ";\n"
  + "var DR_LANDMARKS=" + JSON.stringify(landmarks) + ";\n"
  + "var DR_MYSTERY=" + JSON.stringify(mystery.slice(1).map((m) => m.name + "|" + m.country)) + ";\n";
const file = path.join(ROOT, "dead-reckoning.html");
if (fs.existsSync(file)) {
  const html = fs.readFileSync(file, "utf8").replace(/(\/\/ places:start\n)[\s\S]*?(\/\/ places:end)/, (a, s, e) => s + out + e);
  fs.writeFileSync(file, html);
  console.log("dead-reckoning.html updated");
} else process.stdout.write(out.slice(0, 400));
