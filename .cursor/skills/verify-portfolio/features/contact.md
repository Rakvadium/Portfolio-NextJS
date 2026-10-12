# Contact

Contact tells a visitor how to reach Caleb Mills and offers a Contact Me button. The button starts an email draft in the visitor's mail client and plays a confetti burst. It does not send a message by itself.

## Sub-features

- `contact-email` shows the email address as a mailto link.
- `contact-phone` shows the phone number as a tel link.
- `contact-linkedin` shows a LinkedIn link in the contact copy.
- `contact-button` activates Contact Me.

## How to get to it (user POV)

- Choose `Contact` in the desktop navigation.
- Choose `Contact` on the hero.
- Choose `Contact` in the mobile navigation menu.
- Open `http://127.0.0.1:<port>/#contact` directly.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800 so the contact copy is not duplicated by the mobile drawer.

- **Open the section.** Choose the bar's Contact link. Run `control-portfolio browser viewport --width 1280 --height 800` and `control-portfolio browser click --role link --name "Contact" --nth 1`. The hash is `#contact`. Run `control-portfolio browser wait --role heading --name "Contact"`. It prints `visible: true`.
- **Email.** Read the address. Run `control-portfolio browser href --role link --name "caleb.mills.1221@proton.me"`. `hrefAttr` is `mailto:caleb.mills.1221@proton.me`.
- **Phone.** Run `control-portfolio browser href --role link --name "(208) 949-8754"`. `hrefAttr` is `tel:2089498754`.
- **LinkedIn.** Run `control-portfolio browser href --role link --name "LinkedIn"`. `hrefAttr` is `https://www.linkedin.com/in/calebmills1`.
- **Button.** Run `control-portfolio browser see --role button --name "Contact Me"` and `control-portfolio browser motion`. The button prints `visible: true`. Record `reducedMotion`.
- **Before the burst.** Run `control-portfolio browser canvases`. It prints `canvases: 0`.
- **Activate.** Choose Contact Me. Run `control-portfolio browser click --role button --name "Contact Me"` and `control-portfolio browser location`. The URL starts with `mailto:caleb.mills.1221@proton.me`.
- **Confetti.** If the URL is still on the portfolio, run `control-portfolio browser canvases`. When `reducedMotion` is false, `canvases` is at least 1. When `reducedMotion` is true, the burst is skipped and `canvases` stays 0.
- **Proof.** If the browser stayed on the portfolio, capture the section. Run `control-portfolio browser snapshot --aria --feature contact --entry desktop-nav --path artifacts/contact/desktop-nav.aria.txt` and `control-portfolio browser screenshot --feature contact --entry desktop-nav --path artifacts/contact/desktop-nav.png`. The snapshot contains `Caleb Mills`, `Contact Me`, `caleb.mills.1221@proton.me`, and `Meridian, ID`. If the browser followed the mailto URL, the location line is the proof of the click and `control-portfolio browser open` is required before the next feature.

## Gotchas

- Desktop `Contact` matches the bar and the hero. The bar is `--nth 1`. The hero entry is `--nth 2` and is covered again by the section-navigation feature. The mobile entry is covered by the mobile menu feature.
- The top-bar mail icon is named `Email caleb.mills.1221@proton.me`, not the bare address. The address link in the contact copy is the one this recipe reads.
- The LinkedIn icon in the bar is named `LinkedIn profile`. The word `LinkedIn` in the contact paragraph is the link this recipe reads.
- While the mobile drawer is open, the email, phone, and LinkedIn names occur twice. Drive this recipe at 1280×800 with the drawer closed.
- Contact Me does not send an email. The side effect is the `mailto:` location, plus a canvas when the browser is not reducing motion.
- After a mailto navigation, doctor is `not-ok` until `browser open` loads the portfolio again.
