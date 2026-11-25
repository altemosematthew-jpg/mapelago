#!/usr/bin/env python3
"""Logbook (the history game): builds history-data.js and review/history-questions.md
from the two source-checked blocks in this folder. Run from anywhere:  python3 review/history/build.py

Every question the game can ask is made here from a line of block-a.txt or block-b.txt, and
carries that line's reference (A:<country> or B:<line number>). Nothing else is a source of facts.
The rules Matthew gave with the blocks are the tables in section 1.
"""
import json, os, re, random, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SEED = 20261114

# ---------------------------------------------------------------- 1. the rules that came with the data
# Don't ask the exact independence year: another year is defensible. "Which came first" only 20+ years apart.
FUZZY = {"South Africa", "Egypt", "Zimbabwe", "Indonesia", "Philippines", "Timor-Leste", "Guinea-Bissau", "Eritrea",
         "Libya", "Viet Nam", "North Korea", "South Korea", "Malaysia", "Estonia", "Latvia", "Lithuania", "Austria",
         "Romania", "Iceland", "Marshall Islands", "Micronesia"}
# Block B lines that are the independence or founding of one of those countries (same treatment), plus the
# events that are themselves a defensible other year for one (Iceland 1918, Austria 1955, Malaysia 1963, Romania 1878).
FUZZY_B = {"Union of South Africa formed from four British colonies", "Britain declares Egypt independent, ending its protectorate",
           "Southern Rhodesia becomes independent Zimbabwe", "Philippines becomes independent from the United States",
           "Timor-Leste becomes independent after UN administration", "Eritrea becomes formally independent from Ethiopia",
           "Libya becomes independent as a united kingdom", "North and South Vietnam formally reunified",
           "Federation of Malaya becomes independent", "Malaya, Sabah, Sarawak and Singapore federate as Malaysia",
           "Austrian State Treaty restores Austria's independence", "Treaty of Berlin recognises Romania, Serbia and Montenegro",
           "Iceland becomes a sovereign kingdom in union with Denmark", "Iceland dissolves union with Denmark and becomes a republic",
           "Compact of Free Association ends US trusteeship of Marshall Islands, Micronesia"}
# Say "formed" or "founded", not "became independent".
FORMED = {"Canada", "Australia", "China", "Switzerland", "Italy", "Liechtenstein"}
# Years Duet could not confirm: never asked, never shown.
UNCONFIRMED = {("Argentina", "United Provinces of the Rio de la Plata", "end"), ("Uruguay", "Cisplatina", "start"),
               ("Central African Republic", "Ubangi-Shari", "end"), ("Nauru", "Pleasant Island", "end"), ("Tuvalu", "Ellice Islands", "end")}
# Predecessor states are not former names.
PREDECESSORS = {"Czechoslovakia", "Yugoslavia", "Soviet Union", "Ottoman Empire", "Gran Colombia"}
# Two predecessor states rather than a name: left out by the same reasoning (an open question for Matthew).
NOT_A_NAME = {("Yemen", "North Yemen and South Yemen")}
# Capital moves never asked as a year (asked only as "which city"). Block B's Kazakhstan 1997 line follows the same rule.
CAP_NO_YEAR = {"Japan", "Germany", "Kazakhstan", "Tanzania", "Solomon Islands",
               "Kenya"}   # Kenya: Block A says Mombasa to Nairobi in 1907, Block D says 1905. A clash, so neither year is asked.
CAP_NO_YEAR_B = {"Kazakhstan moves capital from Almaty to Akmola (later Astana)"}
POLITICAL_CAPITAL = {"Burundi"}
# Countries the game treats as South America (Block B has only 24 events there: at most 2 a day).
SOUTH_AMERICA = {"Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"}
# Pairs never offered as each other's wrong answers: their histories overlap, so a wrong answer could be argued.
OVERLAP = [("Kiribati", "Tuvalu"), ("Zimbabwe", "Zambia"), ("Zimbabwe", "Malawi"), ("Zambia", "Malawi"), ("Indonesia", "Timor-Leste"),
           ("Egypt", "Sudan"), ("Namibia", "South Africa"), ("Austria", "Germany"), ("Haiti", "Dominican Republic"), ("Argentina", "Uruguay"),
           ("Brazil", "Uruguay"), ("Malaysia", "Singapore"), ("United Arab Emirates", "Oman"), ("Ireland", "United Kingdom"), ("China", "Mongolia"),
           ("Ghana", "Togo"), ("Moldova", "Ukraine"), ("Democratic Republic of the Congo", "Republic of the Congo"), ("Sudan", "Mali"),
           ("Sudan", "South Sudan"), ("Russia", "Ukraine"), ("Russia", "Belarus"), ("Russia", "Kazakhstan"), ("Bangladesh", "Pakistan"),
           ("India", "Pakistan"), ("India", "Bangladesh"), ("Colombia", "Panama"), ("Colombia", "Venezuela"), ("Colombia", "Ecuador"),
           ("Benin", "Togo"), ("Papua New Guinea", "Solomon Islands"), ("Samoa", "New Zealand")]
# Block C (renamed cities): lines with only one source are skipped, as Duet advised.
C_ONE_SOURCE = {("Modimolle", "South Africa"), ("Chernyakhovsk", "Russia"), ("Korolyov", "Russia"), ("Gatchina", "Russia"),
                ("Dimitrovgrad", "Russia"), ("Sarov", "Russia"), ("Sochi", "Russia")}
C_FUZZY = {("Mbombela", "South Africa")}   # renamed 2009, upheld in court 2014: a defensible other year
C_TEXT = {("Thunder Bay", "Canada"): "Fort William and Port Arthur, Canada, merge as Thunder Bay",
          ("Niteroi", "Brazil"): "Vila Real da Praia Grande, Brazil, is renamed Nictheroy (now spelled Niteroi)",
          ("Kahramanmaras", "Turkiye"): "Maras, Turkiye, is given the title kahraman (heroic): Kahramanmaras",
          ("Sanliurfa", "Turkiye"): "Urfa, Turkiye, is given the title sanli (glorious): Sanliurfa"}
# Block D (240 more events). Lines not asked, and why:
D_EXCLUDE = {
    "Nairobi replaces Mombasa as capital of the East Africa Protectorate": "clashes with Block A (Kenya: Mombasa to Nairobi, 1907); neither year is asked",
    "Tonga ends British protection and becomes fully independent": "Block A says Tonga was never colonised and its independence year is \"don't ask\"",
    "Dakar replaces Saint-Louis as capital of French West Africa": "Block A marks Senegal's capital changes \"don't ask\"",
    "Niamey replaces Zinder as capital of the colony of Niger": "Block A marks Niger's capital changes \"don't ask\"",
}
# Another year is defensible: never on the slider, 20 years apart in pairs (Duet's note on Paraguay; Guinea-Bissau is on Block A's list).
D_FUZZY = {"Paraguay proclaims itself a republic", "Portugal recognises Guinea-Bissau's independence"}
GAP_FIRST = 5      # "which came first" and "put in order": events at least 5 years apart
GAP_FUZZY = 20     # 20 for the defensible-year countries
FACT_REST = 21     # the same fact (in any kind of question) comes back no sooner than 21 days later
PER_DAY = 8
YEAR_LO, YEAR_HI = 1800, 2026

THE = {"Philippines", "United States", "United Kingdom", "Netherlands", "Bahamas", "Democratic Republic of the Congo", "Republic of the Congo",
       "Central African Republic", "Dominican Republic", "United Arab Emirates", "Maldives", "Marshall Islands", "Solomon Islands", "Comoros", "Gambia"}
POWER_THE = {"United Kingdom", "Netherlands", "Soviet Union", "Ottoman Empire", "Russian Empire", "United States", "Holy Roman Empire"}


def the(c, cap=False, table=THE):
    s = ("the " + c) if c in table else c
    return s[0].upper() + s[1:] if cap else s


# ---------------------------------------------------------------- 2. read the blocks
def block(fn, tag):
    lines = open(os.path.join(HERE, fn), encoding="utf8").read().split("\n")
    return lines[lines.index("BLOCK " + tag) + 1: lines.index("END BLOCK " + tag)]


A_LINES, B_LINES = block("block-a.txt", "A"), block("block-b.txt", "B")
C_LINES, D_LINES = block("block-c.txt", "C"), block("block-d.txt", "D")
assert len(A_LINES) == 193 and len(B_LINES) == 303 and len(C_LINES) == 188 and len(D_LINES) == 240


def split_top(s):  # split on ";" outside brackets
    out, depth, cur = [], 0, ""
    for ch in s:
        depth += ch == "("; depth -= ch == ")"
        if ch == ";" and depth == 0: out.append(cur.strip()); cur = ""
        else: cur += ch
    return [x for x in out + [cur.strip()] if x]


A = {}
for line in A_LINES:
    c, y, frm, names, caps = [x.strip() for x in line.split(" | ")]
    row = {"c": c, "line": line, "y": int(y) if y.isdigit() else None, "from": frm, "names": [], "caps": [], "capsAsk": caps not in ("none", "don't ask")}
    if names not in ("none", "don't ask"):
        for part in split_top(names):
            m = re.match(r"^(.*?) \((.*)\)$", part)
            spans = []
            for sp in m.group(2).split(";"):
                sp = sp.strip()
                if sp.startswith("to "): spans.append((None, int(sp[3:])))
                else: a, b = sp.split("-"); spans.append((int(a), int(b)))
            row["names"].append((m.group(1), spans))
    if row["capsAsk"]:
        for part in split_top(caps):
            m = re.match(r"^(.*) to (.*) \((\d{4})(?:-(\d{4}))?\)$", part)
            row["caps"].append({"from": m.group(1), "to": m.group(2), "y": int(m.group(3)) if not m.group(4) else None})
    A[c] = row

B = []
for k, line in enumerate(B_LINES, 1):
    y, text, cs = [x.strip() for x in line.split(" | ")]
    B.append({"k": k, "line": line, "y": int(y), "text": text, "cs": [x.strip() for x in cs.split(",")]})

Dv = []
for k, line in enumerate(D_LINES, 1):
    y, text, cs = [x.strip() for x in line.split(" | ")]
    Dv.append({"k": k, "line": line, "y": int(y), "text": text, "cs": [x.strip() for x in cs.split(",")]})
C = []
for k, line in enumerate(C_LINES, 1):
    city, country, old, y, what = [x.strip() for x in line.split(" | ")]
    C.append({"k": k, "line": line, "city": city, "c": country, "old": old, "y": int(y), "what": what})

# ---------------------------------------------------------------- 3. facts: everything that has a year
STOP = {"of", "the", "and", "republic", "kingdom", "united", "islands", "state", "states", "democratic", "people's", "federation", "empire", "union"}
facts = []  # {id, y, text, cs, src[], tl, wf, fuzzy, role[]}


def add_fact(y, text, cs, src, tl=True, wf=True, fuzzy=False, role=None):
    f = {"id": len(facts), "y": y, "text": text, "cs": cs, "src": list(src), "tl": tl, "wf": wf, "fuzzy": fuzzy, "role": [role] if role else []}
    facts.append(f); return f


for b in B:
    fz = b["text"] in FUZZY_B
    noyear = b["text"] in CAP_NO_YEAR_B
    add_fact(b["y"], b["text"], b["cs"], ["B:%d" % b["k"]], tl=not fz and not noyear, wf=not noyear, fuzzy=fz)
d_excluded = []
for d in Dv:   # Block D's events join Block B's, under the same rules
    if d["text"] in D_EXCLUDE: d_excluded.append((d, D_EXCLUDE[d["text"]])); continue
    fz = d["text"] in D_FUZZY
    add_fact(d["y"], d["text"], d["cs"], ["D:%d" % d["k"]], tl=not fz, fuzzy=fz)
EVENTS = len(facts)   # Block B and Block D events come first; Block A and C facts join them where they say the same thing

INDEP_RE = re.compile(r"independen|separates|federate|Confederation|proclaim|unify|unite|reunif|dissolve|splits|formed|established|recognis|partitioned into|protectorate in \w+ ends")
merges = []  # for the review file


ALIAS = {"Afghanistan": ["Afghan"], "Somalia": ["Somali Republic"], "Mexico": ["Mexican"], "Viet Nam": ["Vietnam"], "Czechia": ["Czech"],
         "Costa Rica": ["Central America"], "El Salvador": ["Central America"], "Guatemala": ["Central America"],
         "Honduras": ["Central America"], "Nicaragua": ["Central America"]}


def mentions(text, country, extra=()):
    """Block B's wording must itself name the country (or a former name, or one of `extra`), not just tag it."""
    keys = [country] + ALIAS.get(country, []) + [n for n, _ in A[country]["names"]] + list(extra)
    return any(re.search(r"\b" + re.escape(k) + r"\b(?!-)", text, re.I) for k in keys)


def find_b(year, country, pattern, extra=()):
    return [f for f in facts[:EVENTS] if f["y"] == year and country in f["cs"] and re.search(pattern, f["text"], re.I) and mentions(f["text"], country, extra)]


def from_label(c, frm):
    """(label, kind) for the 'became independent from...' question, or (None, why)."""
    if frm.endswith("(dissolution)"): return frm[:-len(" (dissolution)")], "dissolution"
    skip = ("unification", "union of", "reunification", "federal state", "People's Republic", "Japanese rule", "partitioning", "Spain, then",
            "France and Spain", "United Kingdom and", "UK and French", "American Colonization", "never", "ancient", "co-principality", "Grimaldi",
            "Qing China", "traditional", "grand duchy", "Spain (1581", "United Kingdom (no single", "United Kingdom (federation", "United Kingdom (confederation",
            "United Kingdom (union", "Ottoman Empire (successor")
    if frm.startswith(skip): return None, "a union, founding or no single power"
    if frm == "US-administered UN trust territory": return "United States", "plain"
    return frm.split(" (")[0], "plain"


soviet_b = [f for f in facts if f["text"] == "Soviet Union formally dissolved into 15 states"][0]
czech_b = [f for f in facts if f["text"] == "Czechoslovakia splits into the Czech Republic and Slovakia"][0]
indep_fact = {}
for c, r in A.items():
    y = r["y"]
    if y is None: continue
    src = "A:" + c
    hit = None
    if r["from"] == "Soviet Union (dissolution)" and y == 1991: hit = soviet_b
    elif r["from"] == "Czechoslovakia (dissolution)": hit = czech_b
    else:
        hits = find_b(y, c, INDEP_RE.pattern)
        if hits: hit = hits[0]
    if hit:
        hit["src"].append(src); hit["role"].append(("indep", c)); indep_fact[c] = hit
        if c in FUZZY and not hit["fuzzy"]: hit["fuzzy"] = True; hit["tl"] = False
        merges.append(("independence", c, y, hit["text"]))
        continue
    lab, kind = from_label(c, r["from"])
    if c == "Switzerland": text = "The Swiss federal state is formed"
    elif c == "Liechtenstein": text = "Liechtenstein is formed as a sovereign state"
    elif c == "Somalia": text = "Somalia is formed from British and Italian Somaliland"
    elif c == "Turkiye": text = "The Republic of Turkiye is founded as successor to the Ottoman Empire"
    elif c == "Poland": text = "Poland becomes independent from the partitioning powers (Russia, Prussia, Austria)"
    elif c in ("North Korea", "South Korea"): text = "The state of %s is founded" % c
    elif c == "Venezuela": text = "Venezuela becomes independent from Gran Colombia"
    elif kind == "dissolution": text = "%s becomes independent on the dissolution of %s" % (the(c, True), the(lab, False, POWER_THE))
    elif lab: text = "%s becomes independent from %s" % (the(c, True), the(lab, False, POWER_THE))
    else: print("NO WORDING", c, y, r["from"]); continue
    fz = c in FUZZY
    pre = y < YEAR_LO
    f = add_fact(y, text, [c], [src], tl=not fz and not pre, wf=not pre, fuzzy=fz, role=("indep", c))
    indep_fact[c] = f

cap_fact = {}
for c, r in A.items():
    for i, m in enumerate(r["caps"]):
        word = "political capital" if c in POLITICAL_CAPITAL else "capital"
        key = (c, i)
        if m["y"] is not None:
            hits = find_b(m["y"], c, r"capital|Parliament", (m["to"],))
            if hits:
                h = hits[0]; h["src"].append("A:" + c); h["role"].append(("cap", c, i)); cap_fact[key] = h
                if c in CAP_NO_YEAR: h["tl"] = h["wf"] = False
                merges.append(("capital", c, m["y"], h["text"])); continue
        noyear = c in CAP_NO_YEAR or m["y"] is None
        text = "The %s of %s moves from %s to %s" % (word, the(c), m["from"], m["to"])
        cap_fact[key] = add_fact(m["y"], text, [c], ["A:" + c], tl=not noyear, wf=not noyear, role=("cap", c, i))

name_facts = collections.defaultdict(list)
skipped_names = []
GENERIC = {"british", "french", "german", "dutch", "portuguese", "spanish", "italian", "belgian", "empire", "kingdom", "republic", "united",
           "states", "islands", "union", "province", "anglo", "egyptian", "upper", "middle", "greater", "people's"}
NEAR_CLASH = {("United Kingdom", "Kingdom of Great Britain", "end"): "Block A says until 1800; Block B dates the union 1801, so the year isn't asked"}
for c, r in A.items():
    starts = {s for nm2, sp2 in r["names"] for s, e in sp2 if s}
    for nm, spans in r["names"]:
        if nm in PREDECESSORS or (c, nm) in NOT_A_NAME: continue
        for si, (s, e) in enumerate(spans):
            for which, y in (("start", s), ("end", e)):
                if y is None: continue
                if (c, nm, which) in UNCONFIRMED: continue
                if (c, nm, which) in NEAR_CLASH: skipped_names.append((c, nm, which, y, NEAR_CLASH[(c, nm, which)])); continue
                if c in FUZZY: skipped_names.append((c, nm, which, y, "defensible-year country")); continue
                if y == r["y"]: skipped_names.append((c, nm, which, y, "same year as independence")); continue
                distinct = [w for w in re.findall(r"[A-Za-z']+", nm) if w.lower() not in GENERIC and w.lower() not in STOP and len(w) > 2]
                hits = [f for f in facts[:EVENTS] if f["y"] == y and c in f["cs"] and (
                    any(re.search(r"\b" + re.escape(w) + r"\b", f["text"], re.I) for w in distinct) or re.search(r"renamed|\bname", f["text"], re.I))]
                if hits:
                    h = hits[0]; h["src"].append("A:" + c); h["role"].append(("name", c, nm)); name_facts[(c, nm)].append(h)
                    merges.append(("name " + which, c, y, h["text"])); continue
                if which == "end" and y in starts and y != s:   # the old name ends the year a new one starts: ask it once, as the start
                    skipped_names.append((c, nm, which, y, "the same change as the next name starting")); continue
                if which == "start": text = "The name %s comes %sinto use for today's %s" % (nm, "back " if si > 0 else "", c)
                else: text = "The name %s stops being used for today's %s" % (nm, c)
                f = add_fact(y, text, [c], ["A:" + c], role=("name", c, nm))
                name_facts[(c, nm)].append(f)
for c, r in A.items():   # a name whose change was asked as the next name's start points at that fact
    for nm, spans in r["names"]:
        for s, e in spans:
            if e and not name_facts.get((c, nm)):
                for nm2, sp2 in r["names"]:
                    if any(s2 == e for s2, _ in sp2): name_facts[(c, nm)] += name_facts.get((c, nm2), [])

city_fact, c_skipped = {}, []
for e in C:
    key = (e["city"], e["c"])
    if key in C_ONE_SOURCE: c_skipped.append((e, "one source only")); continue
    hits = [f for f in facts[:EVENTS] if f["y"] == e["y"] and re.search(r"\b" + re.escape(e["city"]) + r"\b", f["text"]) and re.search(r"\b" + re.escape(e["old"]) + r"\b", f["text"])]
    if hits:   # the same rename is a Block B event: one fact, both lines cited
        h = hits[0]; h["src"].append("C:%d" % e["k"]); h["role"].append(("city", e["city"])); city_fact[e["k"]] = h
        merges.append(("city name", e["city"], e["y"], h["text"])); continue
    text = C_TEXT.get(key) or "%s, %s, is renamed %s" % (e["old"], e["c"], e["city"])
    city_fact[e["k"]] = add_fact(e["y"], text, [e["c"]], ["C:%d" % e["k"]], tl=key not in C_FUZZY, fuzzy=key in C_FUZZY, role=("city", e["city"]))

# Facts that name the same city never share a day, so one can't give the other away
# (Leningrad in Block B and Block C, Lourenco Marques in Block A and Block C, and so on).
related = collections.defaultdict(set)
for e in C:
    if e["k"] not in city_fact: continue
    cf = city_fact[e["k"]]["id"]
    pats = [re.compile(r"\b" + re.escape(n) + r"\b") for n in (e["city"], e["old"]) if len(n) >= 4]
    for f in facts:
        if f["id"] != cf and any(p.search(f["text"]) for p in pats): related[cf].add(f["id"]); related[f["id"]].add(cf)

# Lines that restate each other without being merged (same year, same country) never share a day either.
by_year = collections.defaultdict(list)
for f in facts:
    if f["y"]: by_year[f["y"]].append(f)
for fs in by_year.values():
    for i, a in enumerate(fs):
        for b in fs[i + 1:]:
            if set(a["cs"]) & set(b["cs"]): related[a["id"]].add(b["id"]); related[b["id"]].add(a["id"])

for f in facts:
    if f["y"] is None or f["y"] < YEAR_LO or f["y"] > YEAR_HI: f["tl"] = False; f["wf"] = f["wf"] and f["y"] is not None and YEAR_LO <= f["y"] <= YEAR_HI

# ---------------------------------------------------------------- 4. multiple-choice questions
E = collections.defaultdict(set)  # countries whose histories overlap with each country
for b in B + Dv:
    for x in b["cs"]:
        E[x].update(y for y in b["cs"] if y != x)
for a, b in OVERLAP: E[a].add(b); E[b].add(a)

words = lambda s: {w for w in re.findall(r"[a-z']+", s.lower()) if w not in STOP and len(w) > 2}
POWER_ADJ = {"british": "United Kingdom", "french": "France", "spanish": "Spain", "portuguese": "Portugal", "dutch": "Netherlands", "belgian": "Belgium"}


def power_of(c):  # the "from" power, used only to choose harder or easier wrong answers
    lab, kind = from_label(c, A[c]["from"]) if c in A else (None, None)
    return lab


labels, lab_ix = [], {}


def L(s):
    if s not in lab_ix: lab_ix[s] = len(labels); labels.append(s)
    return lab_ix[s]


Q = []  # {id, kind, ask, ans, pool[(label, similarity)], facts[], src}


def span_words(spans, c, nm):
    parts = []
    for s, e in spans:
        s2 = None if (c, nm, "start") in UNCONFIRMED else s
        e2 = None if (c, nm, "end") in UNCONFIRMED or (c, nm, "end") in NEAR_CLASH else e
        if s2 and e2: parts.append("from %d to %d" % (s2, e2))
        elif e2 and s is None: parts.append("until %d" % e2)
        elif s2: parts.append("from %d" % s2)
    return " and ".join(parts)


former = [(c, nm, spans) for c, r in A.items() for nm, spans in r["names"] if nm not in PREDECESSORS and (c, nm) not in NOT_A_NAME]
for c, nm, spans in former:
    sw = span_words(spans, c, nm)
    own = {n for n, _ in A[c]["names"]}
    fids = [f["id"] for f in name_facts.get((c, nm), [])]
    pool = []
    for c2, nm2, sp2 in former:
        if c2 == c or nm2 in own or c2 in E[c]: continue
        if words(nm2) & words(c): continue           # a wrong name that contains the country's name would mislead
        sim = (power_of(c2) == power_of(c)) * 2 + bool(words(nm2) & words(nm))
        pool.append((nm2, sim))
    Q.append({"kind": "name", "ask": "Which of these is a former name of %s%s?" % (the(c), (", used " + sw) if sw else ""), "ans": nm, "pool": pool,
              "facts": fids, "src": ["A:" + c], "c": c})
    if words(nm) & words(c): continue                 # "Western Samoa is a former name of which country?" answers itself
    pool = []
    for c2 in A:
        if c2 == c or c2 in E[c] or not A[c2]["names"]: continue
        if words(c2) & words(nm): continue
        pool.append((c2, (power_of(c2) == power_of(c)) * 2))
    Q.append({"kind": "nameof", "ask": "%s%s is a former name of which country?" % (nm, (" (" + sw + ")") if sw else ""), "ans": c, "pool": pool,
              "facts": fids, "src": ["A:" + c], "c": c})

EQUIV = [{"United Kingdom", "Great Britain"}, {"Russia", "Russian Empire", "Soviet Union"}, {"Colombia", "Gran Colombia"}, {"Serbia and Montenegro", "Yugoslavia"}]
PRESENT = {"United Kingdom": ["United Kingdom"], "Great Britain": ["United Kingdom"], "Soviet Union": ["Russia"], "Russian Empire": ["Russia"], "Ottoman Empire": ["Turkiye"],
           "Yugoslavia": ["Serbia"], "Czechoslovakia": ["Czechia", "Slovakia"], "Austria-Hungary": ["Austria", "Hungary"], "Holy Roman Empire": ["Germany", "Austria"],
           "Gran Colombia": ["Colombia"], "Serbia and Montenegro": ["Serbia", "Montenegro"]}
fw_rows = []
for c, r in A.items():
    lab, kind = from_label(c, r["from"])
    if r["y"] is None or lab is None: continue
    fw_rows.append((c, lab, kind))
plain_pool = sorted({lab for c, lab, k in fw_rows if k == "plain"})
dis_pool = sorted({lab for c, lab, k in fw_rows if k == "dissolution"} | {"Yugoslavia", "Gran Colombia"})
for c, lab, kind in fw_rows:
    r, y = A[c], A[c]["y"]
    fz = c in FUZZY
    first = " first" if r["from"].startswith("Russian Empire (restored") else ""
    if kind == "dissolution":
        ask = ("In %d, %s became independent on the dissolution of" % (y, the(c))) if not fz else ("%s became independent on the dissolution of" % the(c, True))
    else:
        ask = ("In %d, %s%s became independent from" % (y, the(c), first)) if not fz else ("%s%s became independent from" % (the(c, True), first))
    adj = {POWER_ADJ[w] for nm, _ in r["names"] for w in re.findall(r"[a-z]+", nm.lower()) if w in POWER_ADJ}
    pool = []
    for p in (dis_pool if kind == "dissolution" else plain_pool):
        if p == lab or any(p in g and lab in g for g in EQUIV): continue
        if set(PRESENT.get(p, [p])) & (E[c] | {c}) or p in adj: continue
        if c == "Cameroon" and p == "United Kingdom": continue  # British Southern Cameroons joined 1961
        sim = sum(1 for c2, l2, k2 in fw_rows if l2 == p and c2 in E[c]) + (p in ("United Kingdom", "France", "Spain", "Portugal") and 1)
        pool.append((p, sim))
    Q.append({"kind": "from", "ask": ask + "…", "ans": lab, "pool": pool, "facts": [indep_fact[c]["id"]] if c in indep_fact else [],
              "src": ["A:" + c], "c": c, "note": r["from"]})

moves = [(c, i, m) for c, r in A.items() for i, m in enumerate(r["caps"])]
for c, i, m in moves:
    word = "political capital" if c in POLITICAL_CAPITAL else "capital"
    yr = m["y"] if (m["y"] and c not in CAP_NO_YEAR) else None
    pre = ("In %d, " % yr) if yr else ""
    same = {x for mm in A[c]["caps"] for x in (mm["from"], mm["to"])}
    cities = []
    for c2, i2, m2 in moves:
        if c2 == c or c2 in E[c]: continue
        for x in (m2["from"], m2["to"]):
            if x not in same and x not in [p for p, _ in cities]: cities.append((x, (power_of(c2) == power_of(c)) * 2))
    fid = [cap_fact[(c, i)]["id"]]
    Q.append({"kind": "capto", "ask": "%sthe %s of %s moved from %s to…" % (pre, word, the(c), m["from"]), "ans": m["to"], "pool": [x for x in cities if x[0] != m["from"]],
              "facts": fid, "src": ["A:" + c], "c": c})
    Q.append({"kind": "capfrom", "ask": "%s%s moved its %s to %s. Where was it before?" % (pre, the(c), word, ("the city of " + m["to"]) if m["to"] == c else m["to"]), "ans": m["from"], "pool": [x for x in cities if x[0] != m["to"]],
              "facts": fid, "src": ["A:" + c], "c": c})
    cs = []
    for c2, i2, m2 in moves:
        if c2 != c and c2 not in E[c] and c2 not in [p for p, _ in cs]: cs.append((c2, (power_of(c2) == power_of(c)) * 2))
    Q.append({"kind": "capwho", "ask": "%swhich country moved its %s from %s to %s?" % (pre, word, m["from"], m["to"]), "ans": c, "pool": cs,
              "facts": fid, "src": ["A:" + c], "c": c})
def squash(t): return re.sub(r"[^a-z]", "", t.lower())


def dedupe(pool):
    seen, out = set(), []
    for lab, sim in pool:
        if lab not in seen: seen.add(lab); out.append((lab, sim))
    return out


cities = [e for e in C if e["k"] in city_fact]
c_trivial = []
for e in cities:
    a, b = squash(e["city"]), squash(e["old"])
    if a in b or b in a: c_trivial.append(e); continue    # Bogota / Santa Fe de Bogota answers itself
    fid = [city_fact[e["k"]]["id"]]
    pool = []
    for e2 in cities:
        o = squash(e2["old"])
        if e2 is e or o == b or o in a or a in o: continue
        pool.append((e2["old"], (e2["c"] == e["c"]) * 2 + (abs(e2["y"] - e["y"]) <= 10) + bool(words(e2["old"]) & words(e["old"]))))
    yr = "" if (e["city"], e["c"]) in C_FUZZY else " before %d" % e["y"]
    Q.append({"kind": "city", "ask": "What was %s (%s) called%s?" % (e["city"], e["c"], yr), "ans": e["old"], "pool": dedupe(pool),
              "facts": fid, "src": ["C:%d" % e["k"]], "c": e["c"], "note": e["what"]})
    pool = []
    for e2 in cities:
        if e2 is e or squash(e2["city"]) == a or squash(e2["city"]) in b: continue
        pool.append(("%s (%s)" % (e2["city"], e2["c"]), (e2["c"] == e["c"]) * 2 + (abs(e2["y"] - e["y"]) <= 10)))
    Q.append({"kind": "cityof", "ask": "%s is a former name of which city?" % e["old"], "ans": "%s (%s)" % (e["city"], e["c"]), "pool": dedupe(pool),
              "facts": fid, "src": ["C:%d" % e["k"]], "c": e["c"], "note": e["what"]})

thin = [q for q in Q if len(q["pool"]) < 3]   # not enough fair wrong answers: left out, and listed in the review file
Q = [q for q in Q if len(q["pool"]) >= 3]
for q in Q:
    q["ask"] = q["ask"][0].upper() + q["ask"][1:]
for i, q in enumerate(Q): q["id"] = i

# ---------------------------------------------------------------- 5. the schedule
TL = [f for f in facts if f["tl"]]
WF = [f for f in facts if f["wf"]]
BANK = {"tl": TL, "mc_name": [q for q in Q if q["kind"] in ("name", "nameof")], "mc_from": [q for q in Q if q["kind"] == "from"],
        "mc_cap": [q for q in Q if q["kind"] in ("capto", "capfrom", "capwho")], "mc_city": [q for q in Q if q["kind"] in ("city", "cityof")]}
SINGLES_PER_DAY = 3.9   # slider and four-choice questions a day, on average; the rest are pairs and orders made fresh
CYCLE = int(os.environ.get("LOGBOOK_CYCLE", "0")) or max(371, -(-sum(len(v) for v in BANK.values()) * 10 // 39))   # days before any single-fact question comes back
H = 2 * CYCLE                                         # the shipped schedule; it then starts again from No. 1
R_ORDER = 1.75      # "put in order" questions a day, on average
R_GAP = 0.6         # "how many years apart?" a day, on average, late in the round
LATER = 0.3         # share of pairs asked as "which came later?"
rnd = random.Random(SEED)
perm = {k: rnd.sample(v, len(v)) for k, v in BANK.items()}


def per_day(n, total, days):  # spread `total` uses evenly over `days` days (day n is 1-based)
    return (n * total) // days - ((n - 1) * total) // days


def weekday(n): return (n + 5) % 7  # 0 = Sunday; No. 1 was Saturday 14 November 2026
BASE = {0: 5, 1: 1, 2: 2, 3: 3, 4: 3, 5: 4, 6: 4}     # Monday easiest, Sunday hardest, as in the other games
RAMP = [0, 0, 0, 1, 1, 1, 2, 2]
LEVEL = ["", "easy", "fairly easy", "medium", "medium", "hard", "hard", "hardest"]   # by slot difficulty
DAY_LEVEL = ["hardest", "easy", "fairly easy", "medium", "medium", "hard", "hard"]      # by weekday, shown under the name, as in the other games
GAPS = {1: (60, 230), 2: (40, 120), 3: (25, 70), 4: (15, 45), 5: (10, 30), 6: (6, 20), 7: (5, 12)}
WIN = {1: 50, 2: 70, 3: 90, 4: 120, 5: 150, 6: 190, 7: 227}


def qfacts(item):  # the facts a scheduled question is about
    k = item[0]
    if k == "w": return list(item[1:3])
    if k in ("o", "g"): return list(item[1:]) if k == "o" else list(item[1:3])
    if k == "t": return [item[1]]
    return Q[item[1]]["facts"]


# 5a. single-fact kinds: each bank used once per CYCLE days, in a fixed order, so the same question is CYCLE days apart.
single = {n: [] for n in range(1, CYCLE + 1)}
pos = {k: 0 for k in BANK}
for n in range(1, CYCLE + 1):
    for k in BANK:
        for _ in range(per_day(n, len(BANK[k]), CYCLE)):
            single[n].append((k, perm[k][pos[k]])); pos[k] += 1
assert all(pos[k] == len(BANK[k]) for k in BANK)


def fact_ids(k, x): return [x["id"]] if k == "tl" else x["facts"]


# swap within a kind to keep facts FACT_REST days apart across kinds, and one country to a question per day
def conflicts():
    seen = collections.defaultdict(list)
    for n, items in single.items():
        for k, x in items:
            for f in fact_ids(k, x): seen[f].append(n)
    bad = []
    for n, items in single.items():
        fs = {f for k, x in items for f in fact_ids(k, x)}
        bad += [(f, n) for f in fs if related[f] & fs]
    for f, ns in seen.items():
        ns.sort()
        for a, b in zip(ns, ns[1:] + [ns[0] + CYCLE]):
            if 0 < b - a < FACT_REST or b == a: bad.append((f, a))
    return bad


swap_rnd = random.Random(SEED + 1)
for _ in range(3000):
    bad = conflicts()
    if not bad: break
    f, n = swap_rnd.choice(bad)
    mine = [it for it in single[n] if f in fact_ids(*it)]
    if not mine: continue
    k, x = mine[0]
    ms = list(range(1, CYCLE + 1)); swap_rnd.shuffle(ms)
    for m in ms:
        other = [it for it in single[m] if it[0] == k and it != (k, x)]
        if not other or m == n: continue
        o = other[0]
        i1, i2 = single[n].index((k, x)), single[m].index(o)
        single[n][i1], single[m][i2] = o, (k, x)
        if len(conflicts()) < len(bad): break
        single[n][i1], single[m][i2] = (k, x), o
assert not conflicts(), conflicts()[:5]

# 5b. assemble each day: kinds in a varied order, difficulty rising through the round, pairs and orders chosen fresh.
last_used = {}           # fact id -> days it appears (all H days)
for n in range(1, H + 1):
    for k, x in single[(n - 1) % CYCLE + 1]:
        for f in fact_ids(k, x): last_used.setdefault(f, []).append(n)
used_pairs, used_triples = set(), set()
relax = collections.Counter()
days = []


def cyc(a, b): d = abs(a - b) % H; return min(d, H - d)


def free(f, n, today, rest=FACT_REST):
    if f["id"] in today or related[f["id"]] & today: return False
    return all(cyc(n, m) >= rest for m in last_used.get(f["id"], []))


def daily_ok(fs, today_facts):  # new facts may not push a day past one 2020s event or two South American ones
    allf = [facts[i] for i in today_facts] + fs
    for cat, cap in ((lambda f: (f["y"] or 0) >= 2020, 1), (lambda f: bool(set(f["cs"]) & SOUTH_AMERICA), 2)):
        if any(cat(f) for f in fs) and sum(1 for f in allf if cat(f)) > cap: return False
    return True


def gap_ok(a, b, lo, hi):
    g = abs(a["y"] - b["y"])
    need = GAP_FUZZY if (a["fuzzy"] or b["fuzzy"]) else GAP_FIRST
    return max(lo, need) <= g <= max(hi, need) and a["cs"][0] != b["cs"][0]


def pick_pair(n, d, today, r, gap_kind=False):
    lo, hi = GAPS[d]
    if gap_kind: lo, hi = 8, 230   # "how many years apart?": any two events whose years are both safe to ask exactly
    for widen in range(7):
        rest = FACT_REST if widen < 4 else FACT_REST - 4 * (widen - 3)
        if widen >= 4: relax["rest %d" % rest] += 1
        cand = [f for f in (TL if gap_kind else WF) if free(f, n, today, rest)]
        r.shuffle(cand)
        for a in cand:
            for b in cand:
                if b is a or not gap_ok(a, b, lo, hi) or b["id"] in related[a["id"]]: continue
                key = tuple(sorted((a["id"], b["id"])))
                if key in used_pairs or not daily_ok([a, b], today): continue
                used_pairs.add(key); return a, b
        lo, hi = max(GAP_FIRST, lo - 5), hi + 20; relax["pair window"] += 1
    raise SystemExit("no pair for day %d" % n)


def pick_triple(n, d, today, r):
    lo, hi = GAPS[d]
    lo, hi = lo + 3, hi + 10
    for widen in range(8):
        rest = FACT_REST if widen < 5 else FACT_REST - 4 * (widen - 4)
        if widen >= 5: relax["rest %d" % rest] += 1
        cand = [f for f in WF if free(f, n, today, rest)]
        r.shuffle(cand)
        by = sorted(cand, key=lambda f: f["y"])
        for a in cand:
            for b in cand:
                if b["y"] <= a["y"] or not gap_ok(a, b, lo, hi) or b["id"] in related[a["id"]]: continue
                for c in cand:
                    if c["y"] <= b["y"] or not gap_ok(b, c, lo, hi) or c["cs"][0] == a["cs"][0] or c["id"] in related[a["id"]] | related[b["id"]]: continue
                    if (a["fuzzy"] or c["fuzzy"]) and c["y"] - a["y"] < GAP_FUZZY: continue
                    key = (a["id"], b["id"], c["id"])
                    if key in used_triples or not daily_ok([a, b, c], today): continue
                    used_triples.add(key); return a, b, c
        lo, hi = max(GAP_FIRST, lo - 5), hi + 25; relax["order window"] += 1
    raise SystemExit("no order for day %d" % n)


def window(y, d, r):
    w = WIN[d]
    if w >= YEAR_HI - YEAR_LO: return YEAR_LO, YEAR_HI
    lo_min, lo_max = max(YEAR_LO, y - w + 4), min(y - 4, YEAR_HI - w)
    if lo_min > lo_max: lo_min = lo_max = max(YEAR_LO, min(y - w // 2, YEAR_HI - w))
    lo = r.randint(lo_min, lo_max)
    return lo, lo + w


def options(q, d, r):
    pool = list(q["pool"]); r.shuffle(pool)
    if d <= 2: pool.sort(key=lambda p: p[1])
    elif d >= 5: pool.sort(key=lambda p: -p[1])
    wrong = [p for p, _ in pool[:3]]
    opts = wrong + [q["ans"]]; r.shuffle(opts)
    return [L(o) for o in opts], opts.index(q["ans"])


for n in range(1, H + 1):
    r = random.Random(SEED * 1000 + n)
    wd = weekday(n)
    singles = single[(n - 1) % CYCLE + 1]
    n_order = per_day(n, round(R_ORDER * H), H)
    n_gap = per_day(n, round(R_GAP * H), H)
    n_pair = PER_DAY - len(singles) - n_order - n_gap
    while n_pair < 1 and n_order > 0: n_order -= 1; n_pair += 1
    while n_pair < 1 and n_gap > 0: n_gap -= 1; n_pair += 1
    assert n_pair >= 1, (n, len(singles))
    kinds = [("s", s) for s in singles] + [("o", None)] * n_order + [("w", None)] * (n_pair - 1)
    # Order: a "which came first" opens the round; then spread the kinds so the same kind rarely sits twice in a row.
    r.shuffle(kinds)
    seq = [("w", None)]
    while kinds:
        prev = seq[-1][0] if seq[-1][0] != "s" else seq[-1][1][0]
        pick = next((x for x in kinds if (x[0] if x[0] != "s" else x[1][0]) != prev), kinds[0])
        kinds.remove(pick); seq.append(pick)
    for _ in range(n_gap): seq.insert(r.randint(5, len(seq)), ("g", None))   # the years-apart question comes late
    today = set(f for k, x in singles for f in fact_ids(k, x))
    day = []
    for slot, (k, x) in enumerate(seq):
        d = min(7, BASE[wd] + RAMP[slot])
        if k == "w":
            a, b = pick_pair(n, d, today, r)
            if r.random() < 0.5: a, b = b, a
            item = ["w", a["id"], b["id"], 1 if r.random() < LATER else 0]
        elif k == "g":
            a, b = pick_pair(n, max(d, 4), today, r, gap_kind=True)
            item = ["g", a["id"], b["id"]]
        elif k == "o":
            tri = list(pick_triple(n, d, today, r)); r.shuffle(tri)
            item = ["o"] + [f["id"] for f in tri]
        else:
            kk, obj = x
            if kk == "tl":
                lo, hi = window(obj["y"], d, r); item = ["t", obj["id"], lo, hi]
            else:
                opts, ans = options(obj, d, r); item = ["m", obj["id"], opts, ans]
        for f in qfacts(item):
            today.add(f)
            if k in ("w", "o", "g"): last_used.setdefault(f, []).append(n)
        day.append(item)
    days.append(day)

# ---------------------------------------------------------------- 6. checks the tests repeat in the browser
def qkey(item):
    k = item[0]
    if k == "w": return ("w",) + tuple(sorted(item[1:3]))
    if k == "g": return ("g",) + tuple(sorted(item[1:3]))
    if k == "o": return ("o",) + tuple(sorted(item[1:]))
    if k == "t": return ("t", item[1])
    return ("m", item[1])


first_repeat = None
seen = {}
for n, day in enumerate(days, 1):
    for item in day:
        kq = qkey(item)
        if kq in seen and first_repeat is None: first_repeat = (n, seen[kq], kq)
        seen.setdefault(kq, n)
min_gap = H
where = {}
for n in range(1, 2 * H + 1):
    for item in days[(n - 1) % H]:
        kq = qkey(item)
        if kq in where: min_gap = min(min_gap, n - where[kq])
        where[kq] = n
fact_gap = H
last = {}
for n in range(1, 2 * H + 1):
    for item in days[(n - 1) % H]:
        for f in set(qfacts(item)):
            if f in last and n - last[f] > 0: fact_gap = min(fact_gap, n - last[f])
            last[f] = n
used_facts = {f for day in days for item in day for f in qfacts(item)}
reuse = collections.Counter(f for day in days[:CYCLE] for item in day for f in set(qfacts(item)))

# ---------------------------------------------------------------- 7. write history-data.js
def fz(f): return 1 if f["fuzzy"] else 0


data = {
    "v": 1, "cycle": CYCLE, "days": H, "level": DAY_LEVEL,
    "F": [[f["y"], f["text"], "|".join(f["src"])] for f in facts],
    "Q": [[q["kind"], q["ask"], L(q["ans"]), q["facts"], "|".join(q["src"]), q.get("note", "")] for q in Q],
    "T": labels,
    "D": days,
    "z": [f["id"] for f in facts if f["fuzzy"]],   # defensible-year facts: never on the slider, 20 years apart in pairs (checked by the tests)
    "rest": None,                                  # filled in below: the shortest gap before a fact comes back
}
data["rest"] = fact_gap
js = ("// Logbook (history game) data. Written by review/history/build.py from review/history/block-a.txt and block-b.txt.\n"
      "// Do not edit by hand: change the blocks or the rules in build.py and run it again.\n"
      "window.MX_HIST=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
open(os.path.join(ROOT, "history-data.js"), "w", encoding="utf8").write(js)

# ---------------------------------------------------------------- 8. write review/history-questions.md
def srcline(s):
    t, v = s.split(":", 1)
    if t == "A": return "Block A: " + A[v]["line"]
    if t == "C": return "Block C line %s: %s" % (v, C[int(v) - 1]["line"])
    if t == "D": return "Block D line %s: %s" % (v, Dv[int(v) - 1]["line"])
    return "Block B line %s: %s" % (v, B[int(v) - 1]["line"])


out = []
w = out.append
w("# Logbook: every question the game can ask\n")
w("Written by `review/history/build.py` from `review/history/block-a.txt`, `block-b.txt`, `block-c.txt` and `block-d.txt` (the source-checked blocks, unchanged). "
  "Each entry quotes the Block line it came from. Regenerate this file by running the script; don't edit it by hand.\n")
w("## The numbers\n")
w("| | |\n|---|---|")
w("| Dated facts (Block B and D events, Block A years, Block C city renames) | %d |" % len(facts))
w("| ...usable in \"Which came first?\" and \"Put in order\" | %d |" % len(WF))
w("| ...usable in \"When was it?\" (the timeline slider) | %d |" % len(TL))
w("| \"What was it called?\" questions | %d |" % len(BANK["mc_name"]))
w("| \"Independent from whom?\" questions | %d |" % len(BANK["mc_from"]))
w("| \"Capital on the move\" questions | %d |" % len(BANK["mc_cap"]))
w("| \"What was this city called?\" questions | %d |" % len(BANK["mc_city"]))
w("| Days before any question repeats | %d (the slider, name, from-whom and capital questions each run through their whole bank once in %d days; a pair or order of events is never repeated in the %d-day schedule) |" % (min_gap, CYCLE, H))
w("| Shipped schedule | No. 1 to No. %d, then it starts again from No. 1 |" % H)
w("| Shortest gap before the same fact appears again, in a different question | %d days |" % fact_gap)
w("| Average gap before a fact appears again | %.0f days |" % (CYCLE / (sum(reuse.values()) / max(1, len(reuse)))))
w("| Facts used at least once | %d of %d |" % (len(used_facts), len(facts)))
w("")
w("Kinds per day on average over a cycle: %s.\n" % ", ".join("%s %.2f" % (k, v / H) for k, v in sorted(collections.Counter(
    ({"w": "which came first or later", "o": "put in order", "t": "when was it", "m": "multiple choice", "g": "how many years apart"}[it[0]]) for day in days for it in day).items())))
if relax: w("The pair finder had to widen its year window %s times (of %d pairs and orders).\n" % (sum(relax.values()), sum(1 for day in days for it in day if it[0] in "wog")))

w("## Rules applied\n")
for line in [
    "Wording of Block B events is used exactly as written.",
    "\"Which came first?\" and \"Put in order\": events at least %d years apart; %d years when either is a defensible-year country's independence (%s)." % (GAP_FIRST, GAP_FUZZY, ", ".join(sorted(FUZZY))),
    "The same fact comes back no sooner than %d days later, in any kind of question." % FACT_REST,
    "\"When was it?\": never asked for those countries' independence, for unconfirmed years, or for the capital moves of %s." % ", ".join(sorted(CAP_NO_YEAR)),
    "Land within 5 years and it counts as right (a decade's window); the exact year scores a bonus.",
    "Predecessor states (%s) are never offered or accepted as former names; Yemen's \"North Yemen and South Yemen\" is left out for the same reason." % ", ".join(sorted(PREDECESSORS)),
    "Years Duet couldn't confirm (%s) are never asked or shown." % "; ".join("%s's %s %s year" % (c, n, w2) for c, n, w2 in sorted(UNCONFIRMED)),
    "Wrong answers never come from a country that shares a Block B line with the one asked about, or from these pairs: %s." % "; ".join("%s / %s" % p for p in OVERLAP),
    "At most one 2020s event and two South American events a day.",
    "\"Which came first?\", \"Which came later?\", \"Put in order\" and \"How many years apart?\" are made from two or three of the dated facts listed below (those marked `first`); \"How many years apart?\" uses only facts marked `slider`. A pair or order of facts is never repeated in the shipped schedule.",
    "Canada, Australia, China, Switzerland, Italy and Liechtenstein are \"formed\" or \"founded\", never \"became independent\".",
    "Burundi's move is to its political capital. Nauru stays Nauru. Myanmar's capital move is 2005.",
]: w("- " + line)
w("")

w("## Where Block A and Block B describe the same thing\n")
w("These Block A years and Block C renames were joined to the Block B or Block D event with the same year, so the game asks it once. One clash was found and nothing was chosen: Kenya's capital move is 1907 in Block A and 1905 in Block D, so neither year is asked (the move is still asked as \"which city?\", without a year).\n")
for kind, c, y, t in merges: w("- %s, %s %d: \"%s\"" % (c, kind, y, t))
w("")
w("## Questions left out for want of fair wrong answers\n")
for q in thin: w("- %s %s" % (q["ask"], q["ans"]))
w("")
w("## Block A name years not asked\n")
for c, nm, which, y, why in skipped_names: w("- %s, %s (%s %d): %s" % (c, nm, which, y, why))
w("")

w("## Dated facts\n")
w("`first` = can appear in \"Which came first?\" and \"Put in order\". `slider` = can be asked on the timeline. Every fact cites its line.\n")
for f in facts:
    flags = ", ".join(x for x, ok in (("first" + (" (20-year gap)" if f["fuzzy"] else ""), f["wf"]), ("slider", f["tl"])) if ok) or "not asked"
    w("%d. **%s** %s  [%s]" % (f["id"] + 1, f["y"] if f["y"] else "(no year)", f["text"], flags))
    for s in f["src"]: w("   - %s" % srcline(s))
w("")
w("## Block D lines not asked\n")
for d, why in d_excluded: w("- Block D line %d: %s: %s" % (d["k"], d["line"], why))
w("")
w("## Block C lines not asked as \"What was this city called?\"\n")
for e, why in c_skipped: w("- %s (%s), %s %d: %s, not asked at all" % (e["city"], e["c"], e["old"], e["y"], why))
for e in c_trivial: w("- %s (%s), %s %d: the present name contains the old one, so it is only a dated fact" % (e["city"], e["c"], e["old"], e["y"]))
w("")
for title, kinds in (("What was this city called?", ("city", "cityof")), ("What was it called?", ("name", "nameof")), ("Independent from whom?", ("from",)), ("Capital on the move", ("capto", "capfrom", "capwho"))):
    w("## %s\n" % title)
    w("Wrong answers are drawn from the other questions' right answers of the same kind (all from Block A), never from the excluded pairs above.\n")
    for q in Q:
        if q["kind"] not in kinds: continue
        w("- %s **%s**" % (q["ask"], q["ans"]))
        for s in q["src"]: w("  - %s" % srcline(s))
    w("")

WK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


def show(item):
    k = item[0]
    if k == "w": return ("Which came later? " if item[3] else "Which came first? ") + "%s / %s" % tuple("%s (%d)" % (facts[i]["text"], facts[i]["y"]) for i in item[1:3])
    if k == "g": return "How many years apart? %s / %s" % tuple("%s (%d)" % (facts[i]["text"], facts[i]["y"]) for i in item[1:3])
    if k == "o": return "Put in order: " + " / ".join("%s (%d)" % (facts[i]["text"], facts[i]["y"]) for i in item[1:])
    if k == "t": return "When was it? %s (%d; slider %d to %d)" % (facts[item[1]]["text"], facts[item[1]]["y"], item[2], item[3])
    q = Q[item[1]]
    return "%s %s (options: %s)" % (q["ask"], q["ans"], ", ".join(labels[i] for i in item[2]))


w("## The first two weeks\n")
for n in range(1, 15):
    w("### No. %d, %s (%s)\n" % (n, WK[weekday(n)], DAY_LEVEL[weekday(n)]))
    for item in days[n - 1]: w("1. " + show(item))
    w("")
open(os.path.join(ROOT, "review", "history-questions.md"), "w", encoding="utf8").write("\n".join(out) + "\n")

print("facts %d  first %d  slider %d  names %d  from %d  capital %d" % (len(facts), len(WF), len(TL), len(BANK["mc_name"]), len(BANK["mc_from"]), len(BANK["mc_cap"])))
print("cycle %d  shipped %d days  first repeat %s  min question gap %d  min fact gap %d  facts used %d/%d  relaxations %s" % (
    CYCLE, H, first_repeat, min_gap, fact_gap, len(used_facts), len(facts), dict(relax)))
print("history-data.js %d bytes" % len(js.encode("utf8")))
