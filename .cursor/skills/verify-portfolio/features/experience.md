# Experience

Experience lists four roles, newest first. At 1024px and wider it is a two-pane explorer: a vertical list of role tabs and a panel with the selected role's dates, title, company, and highlights. Below 1024px it is an accordion where one role is open at a time.

## Sub-features

- `explorer-tabs` selects a role from the tab list; the panel shows only that role.
- `explorer-keys` moves between tabs with ArrowDown and ArrowUp (wrapping), Home, and End.
- `explorer-step` steps with Newer and Older, disabled at either end.
- `accordion-one-open` keeps exactly one role open below 1024px; the newest is open first.

## How to get to it (user POV)

- Choose `Experience` in the desktop bar or the mobile section menu.
- Choose `Experience` on the hero.
- Open `http://127.0.0.1:<port>/#experience` directly.

## Driving it with control-portfolio

Preconditions:

- `control-portfolio doctor` prints `result: ok`.
- The page is open at `#experience`: `control-portfolio browser open --hash experience`, then `control-portfolio browser wait --role heading --name "Experience"`.

- **Desktop explorer.** Run `control-portfolio browser viewport --width 1280 --height 800` and `control-portfolio browser wait --role heading --name "Senior Full-Stack Engineer"`. It prints `visible: true`. Run `control-portfolio browser see --name "Role 1 of 4, newest first"`.
- **Select a tab.** Run `control-portfolio browser click --role tab --name "2017 – 2022 Software Engineer Velma.com"` and `control-portfolio browser wait --role heading --name "Software Engineer"`. The panel heading changes and `Role 3 of 4, newest first` is shown.
- **Step buttons.** Run `control-portfolio browser click --role button --name "Older"` and `control-portfolio browser wait --role heading --name "Auto-Campaign Specialist"`. Older is now disabled.
- **Phone accordion.** Run `control-portfolio browser viewport --width 390 --height 844` and `control-portfolio browser see --role button --name "2023 – 2026 Senior Full-Stack Engineer KensieMae, LLC"`. Its snapshot line shows `expanded: true`; the other three role buttons show `expanded: false`.
- **One open.** Run `control-portfolio browser click --role button --name "2022 – 2023 Senior Software Engineer Velma.com"`. In a fresh snapshot that button is `expanded: true` and the KensieMae button is `expanded: false`.
- **Proof.** Run `control-portfolio browser snapshot --aria --feature experience --entry explorer --path artifacts/experience/explorer.aria.txt` and `control-portfolio browser screenshot --feature experience --entry explorer --path artifacts/experience/explorer.png` at each viewport.

## Gotchas

- On desktop only the selected role's title is a heading. The tabs are named `<years> <title> <company>`, for example `2022 – 2023 Senior Software Engineer Velma.com`.
- On phones each role title is an `h3` wrapping its button. The heading and the button share the name `<years> <title> <company>`.
- `Software Engineer` is a substring of two other titles. Match names exactly.
- Keyboard focus moves with the selection. Only the selected tab is in the tab order.
