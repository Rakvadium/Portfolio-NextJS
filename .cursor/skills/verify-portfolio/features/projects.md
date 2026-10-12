# Projects

Projects shows two cards, GenHealthAZ and UVSDECKS.GG. Each card has a live-site link on the image and a Live Site link in the card. UVSDECKS.GG also has a source-code link.

## Sub-features

- `projects-nav` opens the section from the desktop bar.
- `projects-view-work` opens the section from the hero.
- `projects-hash` opens the section from `/#projects`.
- `projects-cards` shows both titles.
- `projects-live` points each live-site control at that project's URL.
- `projects-source` points UVSDECKS.GG at its repository and does not add a source link to GenHealthAZ.

## How to get to it (user POV)

- Choose `Projects` in the desktop navigation.
- Choose `View Work` on the home hero.
- Choose `Projects` in the mobile navigation menu.
- Open `http://127.0.0.1:<port>/#projects` directly.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800 and the hero heading is visible.

- **Desktop bar.** Choose `Projects`. Run `control-portfolio browser viewport --width 1280 --height 800` and `control-portfolio browser click --role link --name "Projects"`. The hash is `#projects`.
- **Section visible.** Wait for the heading and both card titles. Run `control-portfolio browser wait --role heading --name "Projects"`, `control-portfolio browser wait --role heading --name "GenHealthAZ"`, and `control-portfolio browser wait --role heading --name "UVSDECKS.GG"`. Each prints `visible: true`.
- **GenHealth image link.** Run `control-portfolio browser href --role link --name "Open GenHealthAZ live site"`. `hrefAttr` is `https://www.genhealthaz.com`.
- **UVS image link.** Run `control-portfolio browser href --role link --name "Open UVSDECKS.GG live site"`. `hrefAttr` is `https://www.uvsdecks.gg`.
- **Live Site links.** Run `control-portfolio browser href --role link --name "Live Site" --nth 1` and `control-portfolio browser href --role link --name "Live Site" --nth 2`. The first `hrefAttr` is `https://www.genhealthaz.com` and the second is `https://www.uvsdecks.gg`.
- **Source code.** Run `control-portfolio browser href --role link --name "Source Code"` and `control-portfolio browser see --role link --name "Source Code"`. `hrefAttr` is `https://github.com/Rakvadium/uvs-decks-gg` and `count` is 1.
- **Bar proof.** Capture this entry. Run `control-portfolio browser snapshot --aria --feature projects --entry desktop-nav --path artifacts/projects/desktop-nav.aria.txt` and `control-portfolio browser screenshot --feature projects --entry desktop-nav --path artifacts/projects/desktop-nav.png`. The snapshot contains `Caleb Mills`, `GenHealthAZ`, and `UVSDECKS.GG`. The screenshot shows the Projects heading and both titles.
- **Hero entry.** Return home and choose `View Work`. Run `control-portfolio browser click --role link --name "Home"`, `control-portfolio browser wait --role heading --name "Caleb Mills"`, and `control-portfolio browser click --role link --name "View Work"`. The hash is `#projects`. Run `control-portfolio browser wait --role heading --name "Projects"`. It prints `visible: true`.
- **Hero proof.** Run `control-portfolio browser snapshot --aria --feature projects --entry view-work --path artifacts/projects/view-work.aria.txt` and `control-portfolio browser screenshot --feature projects --entry view-work --path artifacts/projects/view-work.png`. The snapshot's `entry` line is `view-work` and the body contains `GenHealthAZ`.
- **Direct hash.** Load the section URL. Run `control-portfolio browser open --hash projects`, `control-portfolio browser viewport --width 1280 --height 800`, `control-portfolio browser wait --role heading --name "Projects"`, and `control-portfolio browser wait --role heading --name "UVSDECKS.GG"`. The hash is `#projects` and both headings print `visible: true`.
- **Hash proof.** Run `control-portfolio browser snapshot --aria --feature projects --entry direct-hash --path artifacts/projects/direct-hash.aria.txt` and `control-portfolio browser screenshot --feature projects --entry direct-hash --path artifacts/projects/direct-hash.png`. The snapshot URL contains `#projects`.

## Gotchas

- The mobile `Projects` path is a separate entry. Drive it from the mobile menu feature. Do not mark it verified from the desktop bar.
- Two links are named `Live Site`. `href` and `click` refuse that name unless `--nth` is set. The image links have unique names.
- GenHealthAZ has no source-code link. A second `Source Code` link means the page changed.
- Card titles fade in with the section. Wait for `UVSDECKS.GG` as well as the section heading before a screenshot, or the card can still be transparent.
- Do not require genhealthaz.com, uvsdecks.gg, or GitHub to load. Record `hrefAttr`.
