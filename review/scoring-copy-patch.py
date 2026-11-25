#!/usr/bin/env python3
"""The new scoring, and Mystery country's Quick mode, in the games' copy (see review/scoring.md): targeted edits to copy/copy.json, then
copy/apply.py. Each edit is skipped if it is already there. Use it when copy/copy.json conflicts in a
merge: take your side of copy.json, then run  python3 review/scoring-copy-patch.py"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDITS = {
    ("city", "explainer"): [
        ("Every move costs 6 points, so each clue is a small bet.",
         "Every move costs 6 points, so each clue is a small bet, and each new tile size adds half its value back: a 16 adds 8."),
        ("A miss tells you how far off you were,",
         "A miss costs 50 to 150 points, less the closer it lands. It tells you how far off you were,"),
        ("Everyone plays the same city,", "Your result shows the sum and up to three stars. Everyone plays the same city,"),
    ],
    ("city", "howto"): [
        ("Each new tile size, up to 64, unlocks a clue. Every move costs 6 of your 1,000 points.",
         "Each new tile size, up to 64, unlocks a clue and adds half its value. Every move costs 6 of your 1,000 points."),
        ("A pin within 50 km finds the city. A miss shows the distance,",
         "A pin within 50 km finds the city. A miss costs 50 to 150 points, less the closer it lands, and shows the distance,"),
        ("Share your result: your clues and how close each pin came, never the city.",
         "Share your result: your stars, your clues and how close each pin came, never the city."),
    ],
    ("country", "explainer"): [
        ("Every move costs 6 of your 1,000 points, so each clue is a small bet.",
         "Every move costs 6 of your 1,000 points, so each clue is a small bet, and each new tile size adds half its value back: a 16 adds 8."),
        ("A miss costs 150 points. It tells you", "A miss costs 50 to 150 points, less the closer it lands. It tells you"),
        ("Everyone gets the same country,", "Your result shows the sum and up to three stars. Everyone gets the same country,", "up to three stars"),
        ("three stars. Everyone gets the same country,",
         "three stars. Short on time? Pick Quick mode before your first move: no tiles, one clue to start, a new clue after each missed pin, and five pins. Everyone gets the same country,", "Short on time?"),
    ],
    ("country", "howto"): [
        ("Each new tile size, up to 64, unlocks a clue, ending with the country's outline. Every move costs 6 of your 1,000 points.",
         "Each new tile size, up to 64, unlocks a clue and adds half its value, ending with the country's outline. Every move costs 6 of your 1,000 points."),
        ("finds it. A miss shows the distance to the nearest point of the country,",
         "finds it. A miss costs 50 to 150 points, less the closer it lands, and shows the distance to the nearest point of the country,"),
        ("Share your result: your clues and how close each pin came, never the country.",
         "Share your result: your stars, your clues and how close each pin came, never the country."),
        ("Share your result: your stars, your clues and how close each pin came, never the country.",
         "Or pick Quick mode: one clue to start, one more after each missed pin, five pins. Find it on pin 1 for 1,000 points, pin 2 for 800, and so on.\u0000Share your result: your stars, your clues and how close each pin came, never the country."),
    ],
}


def main():
    p = os.path.join(ROOT, "copy", "copy.json")
    d = json.load(open(p, encoding="utf-8"))
    n = 0
    for (g, field), edits in EDITS.items():
        v = d["games"][g][field]
        items = v if isinstance(v, list) else [v]
        for a, b, *mark in edits:  # an edit is skipped when its marker (or its new text) is already there
            if any((mark[0] if mark else b.split("\u0000")[0]) in x for x in items):
                continue
            hits = [i for i, x in enumerate(items) if a in x]
            if len(hits) != 1:
                sys.exit(f"copy.json {g}.{field}: can't find {a!r}; nothing written")
            i = hits[0]
            items[i:i + 1] = items[i].replace(a, b, 1).split("\u0000")  # \u0000 splits one step into two
            n += 1
        d["games"][g][field] = items if isinstance(v, list) else items[0]
    open(p, "w", encoding="utf-8").write(json.dumps(d, indent=1, ensure_ascii=False))
    print(f"copy/copy.json: {n} scoring edits")
    return subprocess.call([sys.executable, os.path.join(ROOT, "copy", "apply.py")])


if __name__ == "__main__":
    sys.exit(main())
