# Mobile menu

Below 1024px the section links live in a dropdown in the top bar. Its button names the current section. A visitor opens it, chooses a section, or dismisses it with Escape or a tap outside. The GitHub, LinkedIn, and Email icon links stay visible next to it at every width.

## Sub-features

- `menu-closed` leaves the section links out of the page while the menu is shut.
- `menu-open` shows Home, Skills, Experience, Projects, and Contact, with the current one marked.
- `menu-navigate` follows a section link, updates the hash, and closes the menu.
- `menu-dismiss` closes the menu with Escape (focus returns to the button) or a tap outside it.
- `menu-label` renames the button to the current section as the visitor scrolls.

## How to get to it (user POV)

- Narrow the window below 1024px and choose the `Jump to section. Current section: <section>` button.
- Choose a section name inside the menu.
- Press Escape, or tap anywhere outside the menu.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 390×844. At this width the desktop bar is not exposed.

- **Closed menu.** Run `control-portfolio browser viewport --width 390 --height 844` and `control-portfolio browser absent --role link --name "Home"`. The command prints `count: 0`.
- **Socials.** Run `control-portfolio browser see --role link --name "GitHub"`, `control-portfolio browser see --role link --name "LinkedIn"`, and `control-portfolio browser see --role link --name "Email caleb.mills.1221@proton.me" --nth 1`. Each prints `visible: true`.
- **Open.** Run `control-portfolio browser click --role button --name "Jump to section. Current section: Home"` and `control-portfolio browser wait --role link --name "Home"`. Home prints `visible: true`.
- **Menu links.** Run `control-portfolio browser see --role link --name "Skills"`, `control-portfolio browser see --role link --name "Projects"`, `control-portfolio browser see --role link --name "Contact"`, and `control-portfolio browser see --role link --name "Experience" --nth 1`. Each is present. The menu copy of Experience is nth 1; the hero link is nth 2.
- **Navigate.** Run `control-portfolio browser click --role link --name "Projects"`. The hash is `#projects`. Run `control-portfolio browser wait --role heading --name "Projects"` and `control-portfolio browser absent --role link --name "Home"`. The heading is visible and Home prints `count: 0`. The button is now named `Jump to section. Current section: Projects`.
- **Dismiss.** Reopen and close without navigating. Run `control-portfolio browser click --role button --name "Jump to section. Current section: Projects"`, `control-portfolio browser wait --role link --name "Home"`, `control-portfolio browser click --role heading --name "Projects"` (an outside tap), and `control-portfolio browser absent --role link --name "Home"`. Home prints `count: 0`. The harness has no key command; Escape (and focus returning to the button) is covered by the `Top bar/TopBar` `PhoneMenuDismiss` story test (`npm run test-storybook`).
- **Proof.** Run `control-portfolio browser click --role button --name "Jump to section. Current section: Projects"`, `control-portfolio browser wait --role link --name "Home"`, `control-portfolio browser snapshot --aria --feature mobile-menu --entry menu --path artifacts/mobile-menu/menu.aria.txt`, and `control-portfolio browser screenshot --feature mobile-menu --entry menu --path artifacts/mobile-menu/menu.png`. The snapshot contains `Caleb Mills`, `Projects` marked `current: true`, and `Skills`. The screenshot shows the open menu under the button.

## Gotchas

- Set the viewport to 390×844 after any `browser open`. `open` snaps back to 1280×800, where this button is not exposed.
- The menu is not in the page until it is opened. A missing Home link is the closed state, not a failed load.
- The button's name changes with the current section. Match the full name, or read it from a snapshot first.
- `Email caleb.mills.1221@proton.me` names both the top-bar icon (nth 1) and the contact-section row (nth 2).
- There is no separate close button. Escape, an outside tap, or choosing a link closes the menu.
- The menu fades in over about 180ms. Wait until Home is `visible: true` before clicking a link.
