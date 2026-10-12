# Portfolio verification map

This directory is the maintained source for verifying the visitor-facing behavior of the Caleb Mills portfolio. Read the index before driving the page, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch the portfolio with `.cursor/skills/verify-portfolio/scripts/control-portfolio launch`.
- The default URL is `http://127.0.0.1:3100`. Set `PORTFOLIO_VERIFY_PORT` or pass `--port` to use another port.
- One checkout can host one `next dev`. A second checkout needs its own port and its own launch.
- There is no account and no seed data. The page renders its own copy.
- Chrome starts with an empty profile for that launch.
- Run `control-portfolio doctor` and require `result: ok`, the expected URL, matching package and Next versions, and matching git HEAD.
- Never drive a dev server or Chrome process that this verification run did not start.

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- `browser open` loads `/` and sets the viewport to 1280×800. Set the viewport after `open` when the recipe needs a different size.
- Desktop viewport is 1280×800. Mobile viewport is 390×844.
- Prefer ARIA roles and accessible names over CSS selectors or DOM position.
- Treat every command as literal. Keep quoted names and flags unchanged.
- `--nth` is 1-based DOM order. Pass it whenever `click` or `href` reports more than one match.
- Relative `artifacts/...` paths are written under `.cursor/skills/verify-portfolio/artifacts/`.
- Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a viewport screenshot. The snapshot includes the heading `Caleb Mills`. The screenshot sidecar records the feature id and entry point.
- Outbound-link proof is the link's `hrefAttr`. A third-party response is not a portfolio result.
- Record the feature id and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the visitor-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with control-portfolio` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only visitor paths, stable handles, required state, commands, and observable proof.

## Features

- [Home](./home.md) covers the hero identity, portrait, title, and primary calls to action.
- [Section navigation](./section-navigation.md) covers the desktop nav and hero calls to action, including the skills and experience sections they open.
- [Mobile menu](./mobile-menu.md) covers opening the drawer, following a section link, and closing it.
- [Projects](./projects.md) covers both project cards, their live-site links, and the UVSDECKS.GG source link.
- [Contact](./contact.md) covers email, phone, LinkedIn, and the Contact Me button.
