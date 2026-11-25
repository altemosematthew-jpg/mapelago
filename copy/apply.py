#!/usr/bin/env python3
"""Write the text in copy/copy.json into the site. Run from anywhere: python3 copy/apply.py
It updates each game's title, search description, preview text, structured data and the explainer
at the foot of the page (between <!-- copy:start --> and <!-- copy:end -->), rebuilds the All games
page from the same text, and writes copy.js (share invitations and home-page card lines)."""
import json, re, os, sys, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = json.load(open(os.path.join(ROOT, 'copy', 'copy.json'), encoding='utf8'))
esc = lambda t: html.escape(t, quote=True)
bad = []
for gid, g in C['games'].items():
    if len(g['title']) > 60: bad.append(f"{gid}: title is {len(g['title'])} characters (max 60)")
    if len(g['description']) > 155: bad.append(f"{gid}: description is {len(g['description'])} characters (max 155)")
if bad: sys.exit("Not applied:\n  " + "\n  ".join(bad))

def block(g, gid):
    steps = ''.join(f'<li>{esc(s)}</li>' for s in g['howto'])
    return (f'<!-- copy:start -->\n    <h1 class="about-h">{esc(g["heading"])}</h1>\n    <p>{esc(g["explainer"])}</p>\n'
            f'    <h2>How to play</h2>\n    <ol class="howto">{steps}</ol>\n    <!-- copy:end -->\n    ')

for gid, g in C['games'].items():
    p = os.path.join(ROOT, g['file']); s = open(p, encoding='utf8').read()
    t, d = esc(g['title']), esc(g['description'])
    s = re.sub(r'<title>[^<]*</title>', f'<title>{t}</title>', s, count=1)
    s = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{t}">', s, count=1)
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{d}">', s, count=1)
    s = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{d}">', s, count=1)
    s = re.sub(r'("@type":\["VideoGame","WebApplication"\][^<]*?"description":)"(?:[^"\\]|\\.)*"', lambda m: m.group(1) + json.dumps(g['description'], ensure_ascii=False), s, count=1)
    # the page's one h1 is the explainer heading; the header name is a styled paragraph
    s = re.sub(r'<h1 class="word"([^>]*)>([^<]*)</h1>', r'<p class="word"\1>\2</p>', s, count=1)
    if '<!-- copy:start -->' in s:
        s = re.sub(r'<!-- copy:start -->.*?<!-- copy:end -->\n    ', lambda m: block(g, gid), s, count=1, flags=re.S)
    else:
        s = re.sub(r'(<footer class="about">\n    )<h2>.*?(?=<nav)', lambda m: m.group(1) + block(g, gid), s, count=1, flags=re.S)
    if '.about-h{' not in s:
        s = s.replace('</style>\n</head>', '.about-h{margin:0 0 10px;font-size:22px;line-height:1.2}.howto{margin:6px 0 14px;padding-left:22px;line-height:1.45}\n</style>\n</head>', 1)
    open(p, 'w', encoding='utf8').write(s)
    print('updated', g['file'])

# All games page
p = os.path.join(ROOT, 'games', 'index.html'); s = open(p, encoding='utf8').read()
s = re.sub(r'<p class="lede">.*?</p>', f'<p class="lede">{esc(C["allGames"]["intro"])}</p>', s, count=1, flags=re.S)
for gid, g in C['games'].items():
    url = '../' if g['file'] == 'index.html' else '../' + g['file']
    sec_id = 'mystery-city' if g['file'] == 'index.html' else g['file'].replace('.html', '')
    steps = ''.join(f'<li>{esc(x)}</li>' for x in g['howto'])
    s = re.sub(r'(<section id="' + re.escape(sec_id) + r'">\n<h2><a href="[^"]*">[^<]*</a></h2>\n).*?(?=<p><a class="play")',
               lambda m: m.group(1) + f'<p>{esc(g["explainer"])}</p>\n<ol class="howto">{steps}</ol>\n', s, count=1, flags=re.S)
open(p, 'w', encoding='utf8').write(s); print('updated games/index.html')

# copy.js: read by the games at run time
data = {'invite': {k: g['invite'] for k, g in C['games'].items()}, 'cards': C['home']['cards'], 'home': {'headline': C['home']['headline'], 'line': C['home']['line']}}
open(os.path.join(ROOT, 'copy.js'), 'w', encoding='utf8').write(
    '// Written by copy/apply.py from copy/copy.json. Edit copy.json, not this file.\nwindow.MXCOPY = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
print('wrote copy.js')
