# Home

Home is the first screen. It introduces Caleb Mills, his title, a short bio, his portrait, and three ways to jump further down the page.

## Sub-features

- `home-identity` shows the name and title.
- `home-portrait` shows the portrait labeled with his name.
- `home-actions` offers View Work, Experience, and Contact.

## How to get to it (user POV)

- Open the site root.
- Choose `Home` in the desktop navigation.
- Choose `Home` in the mobile navigation menu.
- Open `http://127.0.0.1:<port>/#home` directly.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800 after the page is open.

- **Open the root.** Load the portfolio. Run `control-portfolio browser open` and `control-portfolio browser viewport --width 1280 --height 800`. The address has no hash and the command output shows the heading `Caleb Mills` with `visible: true`.
- **Title.** Read the title line. Run `control-portfolio browser see --name "Senior Frontend Engineer"`. The command prints `count: 1`.
- **Portrait.** Read the portrait name. Run `control-portfolio browser see --role image --name "Caleb Mills"`. The command prints `visible: true`.
- **Calls to action.** Read the three hero links. Run `control-portfolio browser href --role link --name "View Work"`, `control-portfolio browser href --role link --name "Experience" --nth 2`, and `control-portfolio browser href --role link --name "Contact" --nth 2`. The `hrefAttr` values are `#projects`, `#experience`, and `#contact`. The Experience and Contact hero links are nth 2 because the top bar uses the same names earlier in the page.
- **Direct hash.** Load the home hash. Run `control-portfolio browser open --hash home` and `control-portfolio browser viewport --width 1280 --height 800`. Then run `control-portfolio browser wait --role heading --name "Caleb Mills"`. The hash is `#home` and the heading prints `visible: true`.
- **Proof.** Capture the hero. Run `control-portfolio browser snapshot --aria --feature home --entry root --path artifacts/home/root.aria.txt` and `control-portfolio browser screenshot --feature home --entry root --path artifacts/home/root.png`. The snapshot contains `Caleb Mills`, `Senior Frontend Engineer`, and `View Work`. The screenshot shows the name and the View Work link.

## Gotchas

- The heading `Caleb Mills` and the portrait image share that accessible name. Pass `--role`.
- `Experience` and `Contact` are ambiguous on desktop. The hero controls are `--nth 2`.
- The hero fades in on load. Wait until `visible: true` before a screenshot.
- `browser open` resets the viewport to 1280×800. Set the viewport again after it when the recipe is not desktop.
- The mobile Home entry belongs to the mobile menu recipe. Do not mark it verified from the desktop hero.
