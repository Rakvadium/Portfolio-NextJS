# Mobile menu

The mobile menu is the only section navigation below the desktop breakpoint. A visitor opens a drawer, chooses a section, and can close the drawer without navigating.

## Sub-features

- `menu-closed` leaves the section links out of the page while the drawer is shut.
- `menu-open` shows Home, Skills, Experience, Projects, and Contact.
- `menu-navigate` follows a section link and closes the drawer.
- `menu-dismiss` closes the drawer from the close button.

## How to get to it (user POV)

- Narrow the window below 768px and choose `Open navigation menu`.
- Choose a section name inside the drawer.
- Choose `Close navigation menu`.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 390×844. At this width the desktop bar is not exposed.

- **Closed drawer.** Set the phone viewport and confirm the bar is gone. Run `control-portfolio browser viewport --width 390 --height 844` and `control-portfolio browser absent --role link --name "Home"`. The command prints `count: 0`.
- **Open.** Choose `Open navigation menu`. Run `control-portfolio browser click --role button --name "Open navigation menu"` and `control-portfolio browser wait --role link --name "Home"`. Home prints `visible: true`.
- **Drawer links.** Read the section links. Run `control-portfolio browser see --role link --name "Skills"`, `control-portfolio browser see --role link --name "Projects"`, `control-portfolio browser see --role link --name "Experience" --nth 1`, and `control-portfolio browser see --role link --name "Contact" --nth 1`. Each is present. Experience and Contact still share their names with the hero links further down the page, so the drawer copies are nth 1.
- **Navigate.** Choose `Projects`. Run `control-portfolio browser click --role link --name "Projects"`. The hash is `#projects`. Run `control-portfolio browser wait --role heading --name "Projects"` and `control-portfolio browser absent --role link --name "Home"`. The heading is visible and Home prints `count: 0` because choosing a link closes the drawer.
- **Dismiss.** Reopen and close without navigating. Run `control-portfolio browser click --role button --name "Open navigation menu"`, `control-portfolio browser wait --role link --name "Home"`, `control-portfolio browser click --role button --name "Close navigation menu"`, and `control-portfolio browser absent --role link --name "Home"`. The close command returns to the page and Home prints `count: 0`.
- **Proof.** Capture the open drawer. Run `control-portfolio browser click --role button --name "Open navigation menu"`, `control-portfolio browser wait --role link --name "Home"`, `control-portfolio browser snapshot --aria --feature mobile-menu --entry drawer --path artifacts/mobile-menu/drawer.aria.txt`, and `control-portfolio browser screenshot --feature mobile-menu --entry drawer --path artifacts/mobile-menu/drawer.png`. The snapshot contains `Caleb Mills`, `Open navigation menu`'s counterpart `Close navigation menu`, and `Projects`. The screenshot shows the open drawer.

## Gotchas

- Set the viewport to 390×844 after any `browser open`. `open` snaps back to 1280×800, where this menu button is not exposed and `absent` for Home fails because the desktop bar is showing.
- The drawer is not in the page until it is opened. A missing Home link is the closed state, not a failed load.
- `Experience` and `Contact` are ambiguous while the drawer is open because the hero links remain in the page. `Projects`, `Skills`, and `Home` are unique at this viewport.
- The drawer animates in from the right. Wait until Home is `visible: true` before clicking a link.
