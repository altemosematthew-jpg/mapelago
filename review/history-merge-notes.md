# Logbook (the history game): merge notes

For the session merging `claude/compassionate-johnson-kphp1c` into `claude/charming-bardeen-967w66`.

Logbook lives in its own files. Shared files have small, marked changes, each placed at least one unchanged line
away from that branch's own edits, so git merges them without conflicts. This was checked file by file with
`git merge-file` against `claude/charming-bardeen-967w66`, and for the whole branch with `git merge-tree` (see the end of this file).

The release version (`mapelago-0.14.0`, `?v=0.14.0`) is not changed anywhere. Logbook's page uses `?v=0.14.0` like every other page.

## New files (Logbook only)

| File | What it is |
|---|---|
| `history.html` | The page. Its styles are Stamps' styles copied unchanged, plus a block marked `/* ---------- Logbook ---------- */`. |
| `history.js` | The game. The name "Logbook" is set once at the top (`NAME`); the page title, footer text and `site.js` entry say it too. |
| `history-data.js` | Facts, questions and the 742-day schedule. Written by `review/history/build.py`; don't edit by hand. |
| `og-history.png` | Link preview image (1200 × 630), in the same style as the others. |
| `review/history/block-a.txt`, `block-b.txt`, `block-c.txt` | The source-checked blocks, unchanged. The only source of facts. |
| `review/history/build.py` | Turns the blocks into `history-data.js` and `review/history-questions.md`. The rules that came with the data are the tables at its top. |
| `review/history-questions.md` | Every question the game can ask, each with the Block line it came from, plus the first two weeks. |
| `review/history-merge-notes.md` | This file. |
| `tests/history.js`, `tests/history-golden.json` | Logbook's browser tests and schedule record. |

The save key is `dailycity:history:v1`, so `site.js` repairs it, includes it in the save code and counts its streak like the others.

## Shared files changed (every change)

### `site.js`
1. Share image, in `shareImage()`: `x.fillStyle = fill || "#ffffff"` became `x.fillStyle = fill || MXFILL[m] || "#ffffff"` (comment `// MXFILL: Logbook's heat marks`). This gives Logbook's 🎯 🔥 🌡️ ❄️ 🧊 marks their colours.
2. `todayText()`: one new line after `var r = s.res[t]; if (!r) return;`, marked `// Logbook`. It puts Logbook's points into today's combined message.
3. `perfect()`: one new first line, marked `// Logbook`. 800 points sets off the confetti.
4. `today_games()`: "All seven done today." became "Every game done today." This is the same text your branch already has, so git takes it as one change.
5. A block between the end of `challenge()` and `function mount()`, marked `// ---------- Logbook (history game): start ----------` … `end`:
   - `GAMES.push({ id: "history", name: "Logbook", key: "dailycity:history:v1", url: "history.html", icon: "📜", … })`. After the merge Logbook comes after Crossings.
   - `UNIT.history` (for `#c-` challenge links).
   - `MXFILL` (the share-image colours above).
   - `logbookLink()`: adds a "Logbook" link to the "Daily games" footer on pages that lack one. It can go once every page's footer lists Logbook (see "To do" below).

### `how-to-play/index.html`
A new `<h2>Logbook, the history game</h2>` and paragraph, just before `<h2>Stamps, the trivia wheel</h2>`.

### `games/index.html`
A new `<section id="history">`, just before `<section id="stamps">`. `copy/apply.py` finds it by that id once Logbook is in `copy.json`.

### `sitemap.xml`
One line, `https://mapelago.com/history.html`, after the `hints.html` line.

### `tests/package.json`
`"test": "node run.js && node history.js"` and `"golden": "node run.js --update-golden && node history.js --update-golden"`.

### `tests/README.md`
One paragraph about `history.js`, added at the end.

Not changed: `extras.js`, `site.css`, `index.html` and the other game pages, `sw.js`, `copy/copy.json`, `copy.js`, `tests/run.js`, `robots.txt`, `_config.yml`.

## To do at the merge (left for you because your branch owns these)

1. **Offline cache (`sw.js`).** Add these to `PRE` in the release that ships Logbook:
   `"history.html", "history.js?v=<version>", "history-data.js?v=<version>"`.
   Until then, Logbook still works offline after a first visit to it: once the service worker is in charge, the page fetches its own three files again so the worker keeps them. `tests/history.js` checks this, and checks that it fails without that step. With `PRE` updated, a first visit to any game will be enough.
2. **Release version.** Your branch is now at 0.15.2, so after the merge `history.html` still says `?v=0.14.0` while every other page says `?v=0.15.2`. It works (the server ignores the query), but change those four to the current version in the merge commit. Then, at every future release, include the four `?v=` addresses in `history.html` (`copy.js`, `site.js`, `history-data.js`, `history.js`). `tests/run.js` section 1b doesn't check `history.html` yet. To make it check: add `"history.html"` to its file list and `history|history-data` to its script regex.
3. **Beat-my-score links.** Your `BEAT` table needs `history: { code: "lb", max: 800, modes: 1 }`. Until then Logbook's share link stays `history.html#c-<No.>-<points>`, which `challenge()` and `UNIT.history` already handle. `said()` falls back to `UNIT.history`, giving "640 points".
4. **Copy (`copy/copy.json`).** Left alone, because your branch rewrote most of it. Add this entry under `games` and a `history` line under `home.cards`, then run `python3 copy/apply.py`:
   ```json
   "history": {
     "file": "history.html",
     "title": "Logbook: a daily history game about the world map | Mapelago",
     "description": "Eight questions a day on how the world map has changed since 1800: which came first, when it was, and what it used to be called. Free, from Mapelago.",
     "heading": "How has the world map changed since 1800?",
     "explainer": "(copy the paragraph between <!-- copy:start --> and <!-- copy:end --> in history.html)",
     "howto": ["Answer eight questions. They get harder as you go.", "For \"Which came first?\", tap the event that happened first.", "For \"When was it?\", slide to the year and lock it in. You get two tries, with a hot or cold clue after the first. Within 5 years counts.", "Each question is worth up to 100 points, 800 a day. The exact year scores most.", "Share your row of results. It never gives the answers away."],
     "invite": "How close to the year can you get?",
     "image": "How has the map changed?"
   }
   ```
   Home card line: `"history": "Eight questions on the world map since 1800. Get warmer."`
   The title is 60 characters and the description 151, within `apply.py`'s limits.
5. **Footers.** Add `<a href="history.html">Logbook</a>` (with the right `../` or `https://mapelago.com/` prefix) to the "Daily games" links in every page, after Crossings: `index.html`, the game pages, `hints.html`, `about/`, `how-to-play/`, `games/`, `privacy/`, `offline.html`, `404.html`. Add Crossings to `history.html`'s footer too. Then the `logbookLink()` helper in `site.js` can be deleted. Until then the link is added at run time on pages that load `site.js`. Pages without `site.js` (about, how-to-play, games, privacy, offline, 404) don't show it yet.
6. **Counts.** "Eight daily games" becomes nine in `games/index.html` (title, description, lede), in `copy.json`'s `home.line` and `allGames.intro`, and in any other place that counts the games.
7. **Tests.** Optionally add `"history.html"` to `tests/run.js` section 1 (loads cleanly). `tests/history.js` already checks that, at 375 px and on a desktop.

## Whole-branch check

Against `claude/charming-bardeen-967w66` at commit 13959f4 ("Release 0.15.2: Mystery country on Mystery city's rules"), `git merge-tree --write-tree` reports no conflicts. Merged in a scratch worktree, both suites pass: `tests/run.js` 392 passed, 0 failed, and `tests/history.js` 66 passed, 0 failed. Re-run before merging, since both branches keep moving.
