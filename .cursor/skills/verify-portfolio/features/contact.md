# Contact

Contact is a "Get in touch" tile: a sentence about who Caleb is and where, an Email me button, and one link per channel (Email, LinkedIn, GitHub, Phone). Nothing is sent from the page: email links start a draft in the visitor's mail client.

## Sub-features

- `contact-email` links the address as `mailto:` from the row and the Email me button.
- `contact-phone` links the number as `tel:+12089498754`.
- `contact-linkedin` and `contact-github` open the profiles in a new tab.
- `contact-socials` keeps GitHub, LinkedIn, and Email icon links in the top bar at every width and scroll position.

## How to get to it (user POV)

- Choose `Contact` in the desktop navigation.
- Choose `Contact` in the mobile section menu.
- Open `http://127.0.0.1:<port>/#contact` directly.
- Scroll to the end of the page.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800.

- **Open the section.** Run `control-portfolio browser viewport --width 1280 --height 800` and `control-portfolio browser click --role link --name "Contact"`. The hash is `#contact`. Run `control-portfolio browser wait --role heading --name "Get in touch"`. It prints `visible: true`.
- **Email.** Run `control-portfolio browser href --role link --name "Email caleb.mills.1221@proton.me" --nth 2` and `control-portfolio browser href --role link --name "Email me" --nth 2`. Both `hrefAttr` values are `mailto:caleb.mills.1221@proton.me`.
- **Phone.** Run `control-portfolio browser href --role link --name "Phone (208) 949-8754"`. `hrefAttr` is `tel:+12089498754`.
- **LinkedIn and GitHub rows.** Run `control-portfolio browser href --role link --name "LinkedIn linkedin.com/in/calebmills1"` and `control-portfolio browser href --role link --name "GitHub github.com/Rakvadium"`. The values are `https://www.linkedin.com/in/calebmills1` and `https://github.com/Rakvadium`.
- **Top-bar socials at the bottom.** Run `control-portfolio browser see --role link --name "GitHub"`, `control-portfolio browser see --role link --name "LinkedIn"`, and `control-portfolio browser see --role link --name "Email caleb.mills.1221@proton.me" --nth 1`. Each prints `visible: true` while the page is scrolled to contact.
- **Proof.** Run `control-portfolio browser snapshot --aria --feature contact --entry desktop-nav --path artifacts/contact/desktop-nav.aria.txt` and `control-portfolio browser screenshot --feature contact --entry desktop-nav --path artifacts/contact/desktop-nav.png`. The snapshot contains `Caleb Mills`, `Get in touch`, `caleb.mills.1221@proton.me`, and `Meridian, ID`.

## Gotchas

- `Email caleb.mills.1221@proton.me` names the top-bar icon (nth 1) and the contact row (nth 2). `Email me` names the hero button (nth 1) and the contact button (nth 2).
- The top-bar icons are named `GitHub` and `LinkedIn`; the contact rows include the display address in their names.
- At 1280px the email and LinkedIn rows truncate their display text with an ellipsis. The accessible name and `href` are complete.
- There is no Contact Me button and no confetti. Do not use `browser canvases` as proof.
- Clicking a `mailto:` link in a browser with a mail handler leaves the page; run `browser open` before the next feature.
