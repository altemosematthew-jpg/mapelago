# How to go live with the improvements branch

The site is served by GitHub Pages straight from `main`, with `mapelago.com` pointing at it. Merging into `main` is going live.

## Before you merge (five minutes)
1. **Corrected facts start date.** In `country.html`, `bigger-country.html`, `voyage.html`, `fathoms.html` and `stamps.html`, find `FROM=14` and change 14 to the puzzle number of the day **after** you merge. Day 1 was 14 Nov 2026, so No. N is 13 Nov plus N days. This keeps anyone who already played that day's puzzle from seeing it change.
2. **Sitemap dates.** In `sitemap.xml`, set the changed pages' `lastmod` to the merge date.
3. **Review folders.** `review/` and `tests/` become public files on the site (search engines are told to skip them). Delete them first if you'd rather not publish them.
4. Check `CNAME` still says `mapelago.com`. It does on the branch, and the tests check it.

## Go live
Merge with a merge commit, so rollback is one command:

    git checkout main
    git pull
    git merge --no-ff claude/charming-bardeen-967w66
    git push origin main

GitHub Pages rebuilds in a minute or two. Its CDN can serve the old page for up to about 10 minutes after that.

## Who sees the new version, and when
- Pages always come fresh from the network, and every script address carries the release version (`site.js?v=0.14.0`), so a returning player gets the whole new version on their **first visit** after the CDN refreshes. The old offline cache (`mapelago-0.11.0`) is deleted on that visit.
- A tab left open from before keeps the old version until it's reloaded. The games reload themselves at the next midnight when the tab is idle.
- Offline players keep the old saved copy until they're next online.
- Because one visit is enough, there is no "new version, tap to refresh" notice.
- **Every future release:** change the version in `sw.js` and in every `?v=` (the tests fail if they don't match).

## First ten minutes after going live
1. On your phone, in a private tab, open mapelago.com: the header has a speaker button and "No. N · Day · level", and the turtle coach appears instead of the rules sheet.
2. Play one move and drop a pin; open "Your streaks" at the foot of the page.
3. Open each of the seven games from "Today's games"; each should load without a blank screen.
4. In your normal browser (where you have saves): reload once. Your streaks and today's results should all be there.
5. Paste a game link (for example mapelago.com/fathoms.html) into a chat: the preview should show the Fathoms image, not "Can you find today's city?". Chat apps cache previews, so a link they've already seen may show the old one.
6. In the repository's Settings, Pages: the custom domain still reads mapelago.com.

## Rollback (one step)
Find the merge commit (`git log --merges -1 --format=%h main`), then:

    git checkout main
    git pull
    git revert -m 1 <merge-commit>
    git push origin main

Pages redeploys the old version within a couple of minutes. Its service worker uses a different cache name (`mapelago-0.11.0`), so it replaces the new one on each player's next visit.

Saves are kept: results and streaks are stored per day, and the old version reads them. One exception: a mystery-city round started on the new rules and not finished may restart that day under the old rules. Streaks are unaffected.

## Trying the branch on your phone first
Simplest, with nothing to set up beyond a computer on the same Wi-Fi:

    git fetch origin claude/charming-bardeen-967w66
    git checkout claude/charming-bardeen-967w66
    python3 -m http.server 8000

Then open `http://<your computer's local IP>:8000` on the phone (on a Mac, the IP is in System Settings, Wi-Fi, Details).

Over plain http the offline mode and the phone's share sheet are switched off by the browser; the copy buttons fall back to selecting the text. Everything else is the real thing.

Alternative, a public preview: make a separate repository from this branch and turn on GitHub Pages there. **Delete its `CNAME` file first**, or it will try to claim mapelago.com.
