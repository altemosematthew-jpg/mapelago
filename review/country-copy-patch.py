#!/usr/bin/env python3
"""Mystery country's copy for the new rules (see review/country-merge-notes.md).

Sets four things in copy/copy.json, keeping everything else as it is, writes copy.json back in the
same format (json.dumps with indent=1, no newline at the end), then runs copy/apply.py:
- games.country.explainer and games.country.howto: the new rules
- home.cards.city and home.cards.country: "Guess the city: ..." / "Guess the country: ..."

Use it when copy/copy.json conflicts in a merge: take your side of copy.json, then run
    python3 review/country-copy-patch.py
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPLAINER = "Mystery country is the guess-the-country version of Mapelago, and it plays by the same rules as Mystery city. Slide the tiles to merge matching pairs, like 2048. Each new tile size you make, up to 64, earns a clue, in this order: hemisphere, continent, coast and borders, languages, the first letter of the capital, then the country's outline. Every move costs 6 of your 1,000 points, so each clue is a small bet. When you think you know it, drop a pin. You get three. A pin inside the country, or within 50 km of it, counts as found. A miss costs 150 points. It tells you how far your pin was from the nearest point of the country, which way to go and whether you're getting warmer, and it opens the next clue for free. Everyone gets the same country, and a new one arrives at midnight, your time."
HOWTO = [
    "Slide the tiles. Two matching tiles merge into one worth double.",
    "Each new tile size, up to 64, unlocks a clue, ending with the country's outline. Every move costs 6 of your 1,000 points.",
    "When you have a guess, drop a pin on the map. You get three.",
    "A pin inside the country, or within 50 km of it, finds it. A miss shows the distance to the nearest point of the country, an arrow toward it, whether you're warmer or colder, and opens the next clue.",
    "Share your result: your clues and how close each pin came, never the country."
]
CARDS = {
    "city": "Guess the city: slide tiles for clues, then pin it on the map.",
    "country": "Guess the country: slide tiles for clues, then pin it on the map."
}


def main():
    p = os.path.join(ROOT, "copy", "copy.json")
    d = json.load(open(p, encoding="utf-8"))
    d["games"]["country"]["explainer"] = EXPLAINER
    d["games"]["country"]["howto"] = HOWTO
    d["home"]["cards"].update(CARDS)
    open(p, "w", encoding="utf-8").write(json.dumps(d, indent=1, ensure_ascii=False))
    print("copy/copy.json: Mystery country copy set")
    return subprocess.call([sys.executable, os.path.join(ROOT, "copy", "apply.py")])


if __name__ == "__main__":
    sys.exit(main())
