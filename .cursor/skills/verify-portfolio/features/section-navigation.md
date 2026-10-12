# Section navigation

Section navigation moves a desktop visitor between Home, Skills, Experience, Projects, and Contact. The hero repeats Experience, Contact, and a View Work shortcut to projects. Skills and experience content are part of arriving on those sections.

## Sub-features

- `nav-home` scrolls to the hero from the top bar.
- `nav-skills` reveals the skills heading and the skill labels.
- `nav-experience` reveals the experience heading and role names.
- `nav-projects` scrolls to projects. The projects feature covers the cards.
- `nav-contact` scrolls to contact. The contact feature covers the actions.
- `hero-view-work` scrolls to projects from the hero.
- `hero-experience` scrolls to experience from the hero.
- `hero-contact` scrolls to contact from the hero.

## How to get to it (user POV)

- Choose `Home`, `Skills`, `Experience`, `Projects`, or `Contact` in the desktop bar.
- Choose `View Work`, `Experience`, or `Contact` on the hero.
- Open a section hash directly: `#home`, `#skills`, `#experience`, `#projects`, or `#contact`.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The viewport is 1280×800 and the hero heading is visible.

- **Skills from the bar.** Choose `Skills`. Run `control-portfolio browser viewport --width 1280 --height 800` and `control-portfolio browser click --role link --name "Skills"`. The hash is `#skills`. Run `control-portfolio browser wait --role heading --name "Skills"` and `control-portfolio browser see --name "TypeScript" --nth 1`. The heading prints `visible: true`. TypeScript prints `count: 3`, and nth 1 prints `visible: true`.
- **Repeated labels.** Run `control-portfolio browser see --name "React" --nth 1`. It also prints `count: 3`, and nth 1 is visible. nth 1 of TypeScript and React is the skills chip. The other two matches are the project-card badges.
- **Unique labels.** Read the labels that are not repeated on the cards. Run `control-portfolio browser see --name "Next.js"`, `control-portfolio browser see --name "Node.js"`, `control-portfolio browser see --name "SQL"`, `control-portfolio browser see --name "UI/UX"`, `control-portfolio browser see --name "C#/.NET"`, `control-portfolio browser see --name "REST APIs"`, `control-portfolio browser see --name "Vue/Nuxt"`, `control-portfolio browser see --name "AWS"`, `control-portfolio browser see --name "Azure"`, and `control-portfolio browser see --name "React Native"`. Each prints `count: 1`.
- **Experience from the bar.** Choose the bar's Experience link. Run `control-portfolio browser click --role link --name "Experience" --nth 1`. The hash is `#experience`. Run `control-portfolio browser wait --role heading --name "Experience"` and `control-portfolio browser wait --role heading --name "Senior Full-Stack Engineer"`. Both print `visible: true`.
- **Roles.** Read the other roles and the first employer line. Run `control-portfolio browser see --role heading --name "Senior Software Engineer"`, `control-portfolio browser see --role heading --name "Software Engineer"`, `control-portfolio browser see --role heading --name "Auto-Campaign Specialist"`, and `control-portfolio browser see --name "KensieMae, LLC, Remote"`. Each prints `count: 1`.
- **Projects from the bar.** Choose `Projects`. Run `control-portfolio browser click --role link --name "Projects"`. The hash is `#projects` and `control-portfolio browser wait --role heading --name "Projects"` prints `visible: true`.
- **Contact from the bar.** Choose the bar's Contact link. Run `control-portfolio browser click --role link --name "Contact" --nth 1`. The hash is `#contact` and `control-portfolio browser wait --role heading --name "Contact"` prints `visible: true`.
- **Hero Experience.** Return to the hero and choose its Experience link. Run `control-portfolio browser click --role link --name "Home"`, `control-portfolio browser wait --role heading --name "Caleb Mills"`, and `control-portfolio browser click --role link --name "Experience" --nth 2`. The hash is `#experience` and the Experience heading becomes visible.
- **Hero Contact.** Run `control-portfolio browser click --role link --name "Home"`, `control-portfolio browser wait --role heading --name "Caleb Mills"`, and `control-portfolio browser click --role link --name "Contact" --nth 2`. The hash is `#contact` and the Contact heading becomes visible.
- **Hero View Work.** Run `control-portfolio browser click --role link --name "Home"`, `control-portfolio browser wait --role heading --name "Caleb Mills"`, and `control-portfolio browser click --role link --name "View Work"`. The hash is `#projects` and the Projects heading becomes visible.
- **Direct skills hash.** Run `control-portfolio browser open --hash skills`, `control-portfolio browser viewport --width 1280 --height 800`, and `control-portfolio browser wait --role heading --name "Skills"`. The hash is `#skills` and the heading is visible.
- **Proof.** Capture skills after that direct open. Run `control-portfolio browser snapshot --aria --feature section-navigation --entry direct-skills --path artifacts/section-navigation/direct-skills.aria.txt` and `control-portfolio browser screenshot --feature section-navigation --entry direct-skills --path artifacts/section-navigation/direct-skills.png`. The snapshot contains `Caleb Mills`, `Skills`, and `TypeScript`. The screenshot shows the Skills heading.

## Gotchas

- On desktop, `Experience` and `Contact` match the bar and the hero. `--nth 1` is the bar. `--nth 2` is the hero. `click` fails closed when `--nth` is omitted.
- `Skills`, `Projects`, `Home`, and `View Work` are unique on a desktop viewport.
- Skill labels and role headings stay at opacity 0 until the section enters the viewport. Wait for the section heading before treating the section as shown.
- `TypeScript` and `React` each occur three times: the skills chip and both project cards. `count: 1` would be a failed assertion. The project cards say `NextJS`, so the skills label `Next.js` stays unique.
- The mobile bar is a different entry point. Drive it from the mobile menu feature.
