# Mobile navigation

Below 1024px the page has no menu. A dock floats at the bottom of the screen: a capsule of icon-only section tabs on the left and a capsule of GitHub, LinkedIn, and Email links on the right. The top bar starts transparent over the masthead (portrait, name, title). As the visitor scrolls, the bar turns to glass and the masthead's portrait, name, and title move up and shrink into it. The bar's identity is a link back to the top, and the current section's name shows on the bar's right.

## Sub-features

- `tabs` shows one tab per section, named Home, Skills, Experience, Projects, and Contact. The current tab is marked.
- `tab-navigate` follows a tab: the hash updates and the section lands just below the bar.
- `tab-follow` moves the marked tab and the bar's section name as the visitor scrolls. Home shows no section name. Contact is marked at the page bottom.
- `social-dock` keeps GitHub, LinkedIn, and Email visible and tappable at the top and the bottom of the page.
- `bar-morph` moves the masthead identity into the bar over the first scroll (about 180px). Scrolling back up reverses it. With reduced motion the masthead fades out while the bar's identity fades in.
- `back-to-top` returns to the top from the bar's identity link.
- `fits-360` keeps the dock inside a 360px-wide screen.

## How to get to it (user POV)

- Narrow the window below 1024px and choose a tab in the bottom dock.
- Scroll the page and watch the top bar.
- Choose `Caleb Mills, back to top` in the top bar.
- Choose GitHub, LinkedIn, or the Email icon in the bottom dock.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 390×844. At this width the desktop bar is not exposed.

- **Dock at the top.** Run `control-portfolio browser viewport --width 390 --height 844`, then `control-portfolio browser see --role navigation --name "Sections"` and `control-portfolio browser see --role group --name "Social links"`. Each prints `visible: true`.
- **Tabs.** Run `control-portfolio browser see --role link --name "Home"`, `control-portfolio browser see --role link --name "Skills"`, `control-portfolio browser see --role link --name "Projects"`, `control-portfolio browser see --role link --name "Contact"`, and `control-portfolio browser see --role link --name "Experience" --nth 1`. Each prints `visible: true`. The Experience tab is nth 1; the hero link is nth 2.
- **Socials.** Run `control-portfolio browser href --role link --name "GitHub"`, `control-portfolio browser href --role link --name "LinkedIn"`, and `control-portfolio browser href --role link --name "Email caleb.mills.1221@proton.me" --nth 1`. The `hrefAttr` values are `https://github.com/Rakvadium`, `https://www.linkedin.com/in/calebmills1`, and `mailto:caleb.mills.1221@proton.me`.
- **Navigate.** Run `control-portfolio browser click --role link --name "Projects"`. The hash is `#projects`. Run `control-portfolio browser wait --role heading --name "Projects"`. The heading prints `visible: true`, below the bar.
- **Bar after scrolling.** Run `control-portfolio browser snapshot --aria --feature mobile-navigation --entry projects --path artifacts/mobile-navigation/projects.aria.txt`. The snapshot has the link `Caleb Mills, back to top` and the `Projects` tab marked `current: true`.
- **Back to top.** Run `control-portfolio browser click --role link --name "Caleb Mills, back to top"`. The hash is `#home`. Run `control-portfolio browser wait --role heading --name "Caleb Mills"`. It prints `visible: true`.
- **Bottom.** Run `control-portfolio browser click --role link --name "Contact"` and `control-portfolio browser wheel --dy 4000`. Then run `control-portfolio browser see --role link --name "GitHub"`. It prints `visible: true`. Run `control-portfolio browser snapshot --aria --feature mobile-navigation --entry bottom --path artifacts/mobile-navigation/bottom.aria.txt`. The `Contact` tab is marked `current: true`.
- **Proof.** Run `control-portfolio browser screenshot --feature mobile-navigation --entry bottom --path artifacts/mobile-navigation/bottom.png`. The screenshot shows the glass bar with the small portrait, name, and title on the left, `Contact` on the right, and the two dock capsules at the bottom.
- **Morph frames, 360px, resize, reload.** The harness cannot scrub the scroll position or emulate reduced motion. Run `node scripts/capture.mjs mobile-nav --base http://127.0.0.1:<port>` from the repo root. It prints `pass` or `FAIL` for each check and writes frames to `captures/mobile-nav-final/`. The checks are one visible h1, the dock fitting at 360px, tab landing, the bar title, a resize from 390px to 360px mid-page, and a reload at `#experience`. It covers reduced motion on and off.

## Gotchas

- `browser open` resets the viewport to 1280×800. Set 390×844 again after every `open`.
- The tabs are icons. Their names come from `aria-label`, so match them with `--name "Skills"` and not by visible text.
- `Experience` names the tab (nth 1) and the hero link (nth 2). `Email caleb.mills.1221@proton.me` names the dock icon (nth 1) and the contact row (nth 2).
- The bar's section name is decorative and hidden from the accessibility tree. Read the current section from the tab marked `current: true`.
- The current section is the last one whose top has passed 35% of the viewport height. Right after a tab lands, the bar title and the tab agree. Mid-scroll, the next section can become current while its heading is still on screen.
- In `next dev`, the Next.js dev-tools button sits over the Home tab in the bottom-left corner. A real tap on Home there hits the button. Verify taps against `next start`, or hide `nextjs-portal`.
- With reduced motion the masthead does not move. It fades out while the bar's identity fades in.
