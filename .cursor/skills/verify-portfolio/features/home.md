# Home

Home is the first screen. It introduces Caleb Mills with his title, a one-paragraph headline, a Quick facts list with his core stack, a portrait, and three calls to action. Below 1024px the portrait, name, and title form a masthead above the intro card, and the card opens with an "About me" label.

## Sub-features

- `home-identity` shows the name heading and the title.
- `home-facts` shows Quick facts: years as a software engineer, location, most recent role, and the core-stack chips.
- `home-portrait` shows the portrait: a large tile at 1024px and wider, the ringed masthead portrait above the intro card below that.
- `home-actions` offers View work (to projects), Email me (mailto), and Experience (to experience).
- `home-handoff` hands the name to the top bar as the page scrolls. At 1024px and wider the heading shrinks and fades while the bar name fades in. Below that the masthead moves into the bar (see the mobile navigation feature).

## How to get to it (user POV)

- Open the site root.
- Choose `Home` in the desktop navigation, or the `Caleb Mills, back to top` monogram link.
- Choose the `Home` tab in the mobile dock.
- Open `http://127.0.0.1:<port>/#home` directly.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800 after the page is open.

- **Open the root.** Load the portfolio. Run `control-portfolio browser open` and `control-portfolio browser viewport --width 1280 --height 800`. The address has no hash and the command output shows the heading `Caleb Mills` with `visible: true`.
- **Title and facts.** Run `control-portfolio browser see --name "Senior Frontend Engineer"`, `control-portfolio browser see --name "9+ years as a software engineer"`, and `control-portfolio browser see --role heading --name "Quick facts"`. Each prints `visible: true`.
- **Portrait.** Run `control-portfolio browser see --role image --name "Portrait of Caleb Mills"`. It prints `count: 1` and `visible: true` at both viewports: only one of the two portraits is displayed at a time.
- **Calls to action.** Run `control-portfolio browser href --role link --name "View work"`, `control-portfolio browser href --role link --name "Email me" --nth 1`, and `control-portfolio browser href --role link --name "Experience" --nth 2`. The `hrefAttr` values are `#projects`, `mailto:caleb.mills.1221@proton.me`, and `#experience`.
- **Direct hash.** Run `control-portfolio browser open --hash home`, `control-portfolio browser viewport --width 1280 --height 800`, and `control-portfolio browser wait --role heading --name "Caleb Mills"`. The hash is `#home` and the heading prints `visible: true`.
- **Proof.** Run `control-portfolio browser snapshot --aria --feature home --entry root --path artifacts/home/root.aria.txt` and `control-portfolio browser screenshot --feature home --entry root --path artifacts/home/root.png`. The snapshot contains `Caleb Mills`, `Senior Frontend Engineer`, `Quick facts`, and `View work`.

## Gotchas

- `Experience` matches the top-bar link or the mobile dock tab (nth 1) and the hero link (nth 2).
- `Email me` occurs twice: the hero (nth 1) and the contact section (nth 2).
- The hero has no Contact link. Contact is reached from the top bar, the mobile dock, or the Email me links.
- The name heading fades out between 150px and 300px of scroll on desktop, and moves into the bar over about 180px on phones. Read it at the top of the page.
- `browser open` resets the viewport to 1280×800. Set the viewport again after it when the recipe is not desktop.
