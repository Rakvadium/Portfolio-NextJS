# Projects

Projects shows two cards, GenHealthAZ and UVSDECKS.GG. Each card has a screenshot that links to the live site, what the project is, what Caleb built, the technologies, and a Visit link. UVSDECKS.GG also has a Source code link.

## Sub-features

- `projects-nav` opens the section from the desktop bar.
- `projects-view-work` opens the section from the hero.
- `projects-hash` opens the section from `/#projects`.
- `projects-cards` shows both titles as headings inside named articles.
- `projects-live` points each screenshot link and Visit link at that project's URL, in a new tab.
- `projects-source` points UVSDECKS.GG at its repository and does not add a source link to GenHealthAZ.

## How to get to it (user POV)

- Choose `Projects` in the desktop navigation.
- Choose `View work` on the home hero.
- Choose `Projects` in the mobile section menu.
- Open `http://127.0.0.1:<port>/#projects` directly.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800 and the hero heading is visible.

- **Desktop bar.** Run `control-portfolio browser viewport --width 1280 --height 800` and `control-portfolio browser click --role link --name "Projects"`. The hash is `#projects`.
- **Section visible.** Run `control-portfolio browser wait --role heading --name "Projects"`, `control-portfolio browser wait --role heading --name "GenHealthAZ"`, and `control-portfolio browser wait --role heading --name "UVSDECKS.GG"`. Each prints `visible: true`.
- **Screenshot links.** Run `control-portfolio browser href --role link --name "Open GenHealthAZ (genhealthaz.com)"` and `control-portfolio browser href --role link --name "Open UVSDECKS.GG (uvsdecks.gg)"`. The `hrefAttr` values are `https://www.genhealthaz.com` and `https://www.uvsdecks.gg`.
- **Visit links.** Run `control-portfolio browser href --role link --name "Visit genhealthaz.com"` and `control-portfolio browser href --role link --name "Visit uvsdecks.gg"`. The `hrefAttr` values are the same two URLs.
- **Source code.** Run `control-portfolio browser href --role link --name "Source code"` and `control-portfolio browser see --role link --name "Source code"`. `hrefAttr` is `https://github.com/Rakvadium/uvs-decks-gg` and `count` is 1.
- **Bar proof.** Run `control-portfolio browser snapshot --aria --feature projects --entry desktop-nav --path artifacts/projects/desktop-nav.aria.txt` and `control-portfolio browser screenshot --feature projects --entry desktop-nav --path artifacts/projects/desktop-nav.png`. The snapshot contains `Caleb Mills`, `GenHealthAZ`, and `UVSDECKS.GG`.
- **Hero entry.** Run `control-portfolio browser click --role link --name "Home"`, `control-portfolio browser wait --role heading --name "Caleb Mills"`, and `control-portfolio browser click --role link --name "View work"`. The hash is `#projects` and `control-portfolio browser wait --role heading --name "Projects"` prints `visible: true`.
- **Direct hash.** Run `control-portfolio browser open --hash projects`, `control-portfolio browser viewport --width 1280 --height 800`, `control-portfolio browser wait --role heading --name "Projects"`, and `control-portfolio browser wait --role heading --name "UVSDECKS.GG"`. Then capture `artifacts/projects/direct-hash.aria.txt` and `.png` as above. The snapshot URL contains `#projects`.

## Gotchas

- The mobile `Projects` path is a separate entry. Drive it from the mobile menu feature.
- GenHealthAZ has no source link. A second `Source code` link means the page changed.
- Technology chips read `Next.js` and `Convex`, matching the skills section's spelling.
- Cards fade up as they scroll into view. Wait for `UVSDECKS.GG` as well as the section heading before a screenshot.
- Do not require genhealthaz.com, uvsdecks.gg, or GitHub to load. Record `hrefAttr`.
