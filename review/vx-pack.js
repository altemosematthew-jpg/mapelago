// Voyage and Stamps: the facts their new question families use, taken from data/countries.txt.
// Run from the repository root:  node review/vx-pack.js
// It rewrites the block between "vx-pack:start" and "vx-pack:end" in voyage.html and stamps.html.
// The rules below decide which facts are safe to ask; tests/run.js checks every answer against the pack again.
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

// Pack names that the games spell differently. Countries the games don't have (Tuvalu, Palestine, Kosovo, Taiwan) are skipped.
const NAME = { "Cape Verde": "Cabo Verde", "Czech Republic": "Czechia", "The Gambia": "Gambia", "Timor-Leste": "East Timor", "Turkey": "Türkiye" };
const NOT_IN_GAMES = new Set(["Tuvalu", "Palestine", "Kosovo", "Taiwan"]);

// Never asked, from the pack's notes and review/data-pack-check.md:
// - highest points the pack says not to ask about, plus the United States (Denali / Mount McKinley, flagged for review)
const NO_PEAK = new Set(["France", "Italy", "India", "Pakistan", "Israel", "Netherlands", "Denmark", "Spain", "Portugal", "Saudi Arabia", "Kosovo", "United States"]);
// - currencies flagged for review (Bulgaria's euro, Zimbabwe Gold)
const NO_MONEY = new Set(["Bulgaria", "Zimbabwe"]);
// - domains the pack marks as not fully verified
const NO_WEB = new Set([".ye", ".za", ".zm", ".zw"]);
// Flag colours and right-hand driving are not fully verified, so flags are never asked and driving is only ever
// asked as "which of these drives on the left?" (the left-hand list is the checked one).

// Currency names that would give the answer away or that more than one country could claim are dropped by the
// rules below; these are display names for the rest, written as they read in a sentence ("The baht is ...").
const MONEY_NAME = { "Yuan renminbi": "renminbi", "Cordoba oro": "córdoba", "Bolivar": "bolívar", "Pa'anga": "pa'anga", "Guarani": "guaraní", "Colon": "colón" };
// Currency names that contain a country's adjective the simple name test can't see.
const GIVES_AWAY = ["danish", "swiss", "dutch", "malagasy", "omani", "uae", "lao", "east caribbean", "cfa", "new israeli", "comorian", "congolese", "cabo verde", "us dollar", "euro"];

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const words = (s, n = 4) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= n);
const GENERIC = new Set(["de", "del", "des", "la", "le", "el", "ad", "al", "an", "at", "on", "of", "the", "san", "umm", "pic", "do", "da", "di", "du", "mount", "mont", "monte", "pico", "peak", "cerro", "jabal", "jebel", "gora", "hora", "golem", "range", "island", "hill", "near", "unnamed", "slope", "point", "dagi", "kalns", "taung", "gunung", "bukit", "phnum", "morne", "volcan", "south", "central"]);

function parse() {
  return fs.readFileSync(path.join(ROOT, "data/countries.txt"), "utf8").split("\n").filter((l) => l && !l.startsWith("#")).map((l) => {
    const f = l.split("|"), raw = f[0].replace(/ \(non-member\)$/, "");
    const hp = /^(.*), (\d+)$/.exec(f[8]);
    return { raw, name: NAME[raw] || raw, next: f[1], coast: f[2], money: f[3], drive: f[4], call: f[5], web: f[6], tz: f[7], peak: hp[1], height: +hp[2] };
  });
}

function build() {
  const all = parse();
  // currencies: the first one a country lists, if no other country in the pack lists it at all
  const codeCount = {};
  all.forEach((c) => (c.money.match(/\(([A-Z]{3})\)/g) || []).forEach((m) => (codeCount[m] = (codeCount[m] || 0) + 1)));
  const moneyOf = (c) => {
    const first = c.money.split(/,\s*(?=[^)]*(?:\(|$))/)[0];
    const m = /^(.*) \(([A-Z]{3})\)$/.exec(first.trim());
    return m ? { name: m[1], code: m[2] } : null;
  };
  const lastWord = (s) => norm(s).split(/\s+/).pop();
  const lastWords = {};
  all.forEach((c) => (c.money.split(/,\s*(?=[^)]*(?:\(|$))/)).forEach((x) => { const n = x.replace(/\s*\([A-Z]{3}\)\s*$/, "").trim(); const w = lastWord(n); lastWords[w] = (lastWords[w] || 0) + 1; }));
  // calling codes: the first form ("+1-809/829/849" is asked as +1-809); a code two countries share is never asked
  const callOf = (c) => c.call.split("/")[0];
  const callCount = {};
  all.forEach((c) => (callCount[callOf(c)] = (callCount[callOf(c)] || 0) + 1));
  // highest points: never an unnamed one, and never a mountain another country's highest point shares a name with
  const peakWords = (c) => words(c.peak.replace(/\(.*?\)/g, ""), 2).filter((w) => !GENERIC.has(w));
  const peakOwners = {};
  all.forEach((c) => peakWords(c).forEach((w) => (peakOwners[w] = (peakOwners[w] || 0) + 1)));

  const out = {}, skipped = { money: [], call: [], peak: [] };
  for (const c of all) {
    if (NOT_IN_GAMES.has(c.raw)) continue;
    const e = {};
    const m = moneyOf(c);
    if (m && !NO_MONEY.has(c.name)) {
      const shown = MONEY_NAME[m.name] || m.name.charAt(0).toLowerCase() + m.name.slice(1);
      const cw = words(c.name).map((w) => w.slice(0, 4));
      const reason = codeCount[`(${m.code})`] > 1 ? "shared" : lastWords[lastWord(m.name)] > 1 ? "name like another" :
        words(m.name).some((w) => cw.includes(w.slice(0, 4))) || GIVES_AWAY.some((g) => norm(m.name).includes(g)) ? "gives it away" : "";
      if (reason) skipped.money.push(`${c.name}: ${m.name} (${reason})`); else e.m = shown;
    }
    if (c.drive === "left") e.l = 1;
    const call = callOf(c);
    if (callCount[call] === 1) e.c = call; else skipped.call.push(`${c.name} ${call}`);
    if (c.web !== "none" && !NO_WEB.has(c.web)) e.w = c.web;
    const pw = peakWords(c);
    if (NO_PEAK.has(c.name) || /unnamed/i.test(c.peak) || !pw.length) skipped.peak.push(`${c.name}: ${c.peak} (not asked)`);
    else if (pw.some((w) => peakOwners[w] > 1)) skipped.peak.push(`${c.name}: ${c.peak} (shared name)`);
    else { e.p = c.peak; e.h = c.height; }
    if (c.drive !== "left") e.r = 1; // right-hand (only ever a wrong option)
    out[c.name] = e;
  }
  return { out, skipped };
}

if (require.main === module) {
  const { out, skipped } = build();
  const json = JSON.stringify(out);
  const fam = fs.readFileSync(path.join(__dirname, "vx-families.js"), "utf8").trim();
  for (const [f, game] of [["voyage.html", "vx-voyage.js"], ["stamps.html", "vx-stamps.js"]]) {
    const own = fs.readFileSync(path.join(__dirname, game), "utf8").trim();
    const block = `<script>/* vx-pack:start (generated by review/vx-pack.js from data/countries.txt, review/vx-families.js and review/${game}; do not edit by hand) */\nwindow.VXPACK=${json};\n${fam}\n${own}\n/* vx-pack:end */</script>`;
    const p = path.join(ROOT, f); let s = fs.readFileSync(p, "utf8");
    const re = /<script>\/\* vx-pack:start[\s\S]*?vx-pack:end \*\/<\/script>/;
    if (!re.test(s)) throw new Error(`${f}: no vx-pack block`);
    s = s.replace(re, () => block); fs.writeFileSync(p, s);
  }
  const n = (k) => Object.values(out).filter((e) => e[k]).length;
  console.log(`written: ${Object.keys(out).length} countries; money ${n("m")}, left ${n("l")}, calling codes ${n("c")}, domains ${n("w")}, peaks ${n("p")}`);
  if (process.argv.includes("-v")) console.log(JSON.stringify(skipped, null, 1));
}
module.exports = { build, parse, NAME, NOT_IN_GAMES, NO_PEAK, NO_MONEY, NO_WEB };
