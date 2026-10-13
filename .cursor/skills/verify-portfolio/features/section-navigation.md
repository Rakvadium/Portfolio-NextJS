# Section navigation

Section navigation moves a desktop visitor (1024px and wider) between Home, Skills, Experience, Projects, and Contact from a fixed top bar. The active section is marked with an underline that follows the scroll position. In-page links update the URL hash, and each section lands just below the bar. The hero repeats Experience and a View work shortcut to projects.

## Sub-features

- `nav-home` scrolls to the top from the bar or the monogram.
- `nav-skills` opens the Skills section: three groups (Frontend, Backend, Cloud) of skill chips.
- `nav-experience` opens the Experience section. The experience feature covers the role explorer.
- `nav-projects` opens projects. The projects feature covers the cards.
- `nav-contact` opens contact. The contact feature covers the links.
- `nav-active` marks the current section with `aria-current` and the underline, as the visitor scrolls.
- `hero-view-work` scrolls to projects from the hero.
- `hero-experience` scrolls to experience from the hero.

## How to get to it (user POV)

- Choose `Home`, `Skills`, `Experience`, `Projects`, or `Contact` in the desktop bar.
- Choose `View work` or `Experience` on the hero.
- Open a section hash directly: `#home`, `#skills`, `#experience`, `#projects`, or `#contact`.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800 and the hero heading is visible.

- **Skills from the bar.** Run `control-portfolio browser viewport --width 1280 --height 800` and `control-portfolio browser click --role link --name "Skills"`. The hash is `#skills`. Run `control-portfolio browser wait --role heading --name "Skills"` and `control-portfolio browser wait --role heading --name "Frontend"`. Both print `visible: true`.
- **Skill chips.** Run `control-portfolio browser see --name "Vue/Nuxt"`, `control-portfolio browser see --name "React Native"`, `control-portfolio browser see --name "UI/UX"`, `control-portfolio browser see --name "C#/.NET"`, `control-portfolio browser see --name "REST APIs"`, `control-portfolio browser see --name "SQL"`, `control-portfolio browser see --name "AWS"`, and `control-portfolio browser see --name "Azure"`. Each prints `count: 1`.
- **Repeated chips.** Run `control-portfolio browser see --name "TypeScript"`, `control-portfolio browser see --name "React"`, and `control-portfolio browser see --name "Next.js"`. Each prints `count: 4` (hero core stack, skills, two project cards). `Node.js` prints `count: 2` (hero core stack, skills).
- **Experience from the bar.** Run `control-portfolio browser click --role link --name "Experience" --nth 1`. The hash is `#experience`. Run `control-portfolio browser wait --role heading --name "Experience"` and `control-portfolio browser wait --role heading --name "Senior Full-Stack Engineer"`. Both print `visible: true`.
- **Projects from the bar.** Run `control-portfolio browser click --role link --name "Projects"`. The hash is `#projects` and `control-portfolio browser wait --role heading --name "Projects"` prints `visible: true`.
- **Contact from the bar.** Run `control-portfolio browser click --role link --name "Contact"`. The hash is `#contact` and `control-portfolio browser wait --role heading --name "Get in touch"` prints `visible: true`.
- **Active underline.** After each bar click, run `control-portfolio browser snapshot --aria --feature section-navigation --entry active --path artifacts/section-navigation/active.aria.txt`. The link for the section just opened carries `current: true`; no other bar link does. At the page bottom the current link is `Contact`.
- **Hero Experience.** Run `control-portfolio browser click --role link --name "Home"`, `control-portfolio browser wait --role heading --name "Caleb Mills"`, and `control-portfolio browser click --role link --name "Experience" --nth 2`. The hash is `#experience` and the Experience heading becomes visible.
- **Hero View work.** Run `control-portfolio browser click --role link --name "Home"`, `control-portfolio browser wait --role heading --name "Caleb Mills"`, and `control-portfolio browser click --role link --name "View work"`. The hash is `#projects` and the Projects heading becomes visible.
- **Direct skills hash.** Run `control-portfolio browser open --hash skills`, `control-portfolio browser viewport --width 1280 --height 800`, and `control-portfolio browser wait --role heading --name "Skills"`. The hash is `#skills` and the heading is visible.
- **Proof.** Run `control-portfolio browser snapshot --aria --feature section-navigation --entry direct-skills --path artifacts/section-navigation/direct-skills.aria.txt` and `control-portfolio browser screenshot --feature section-navigation --entry direct-skills --path artifacts/section-navigation/direct-skills.png`. The snapshot contains `Caleb Mills`, `Skills`, `Frontend`, and `Azure`. The screenshot shows the Skills heading below the bar.

## Gotchas

- The desktop bar is exposed at 1024px and wider. Below that it is `display: none` and the mobile navigation feature applies.
- On desktop `Experience` matches the bar (nth 1) and the hero (nth 2). `Home`, `Skills`, `Projects`, `Contact`, and `View work` are unique.
- Links scroll smoothly unless the browser prefers reduced motion. Wait for the target heading before reading the active link.
- Tiles below the hero fade up as they scroll into view, in browsers that support scroll-driven animations. Wait for `visible: true` before a screenshot.
- The contact section heading is `Get in touch`, not `Contact`.
