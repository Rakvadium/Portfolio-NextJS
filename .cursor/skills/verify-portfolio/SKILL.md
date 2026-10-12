---
name: verify-portfolio
description: "Drive the Caleb Mills portfolio Next.js site in Chrome the way a visitor does, and capture proof. Use when changing the homepage, navigation, projects, or contact UI, or when a change needs a real browser pass before it is called done."
---

# Verify the portfolio

The portfolio is a single public Next.js page. A visitor scrolls it, uses the desktop nav or the mobile menu, and follows in-page or outbound links. There is no account, no database, and no API to seed. This skill launches that page, drives it from the accessibility tree, and writes proof under the evidence directory.

Run every command from any working directory. The harness locates the repo from its own path. Prefix examples below with the script path:

`.cursor/skills/verify-portfolio/scripts/control-portfolio`

## Launch

Install dependencies once if `node_modules/next/package.json` is missing:

```bash
npm install
```

Start a verification instance:

```bash
.cursor/skills/verify-portfolio/scripts/control-portfolio launch
```

`launch` runs this dev command in the repo root and detaches it:

```bash
NEXT_TELEMETRY_DISABLED=1 BROWSER=none npm run dev -- --port 3100 --hostname 127.0.0.1
```

`npm run dev` is `next dev --turbopack`, so the port and hostname are appended after Turbopack. Override the port with `--port` or `PORTFOLIO_VERIFY_PORT`. The default is `3100`. The base URL is `http://127.0.0.1:<port>`. Use `127.0.0.1`, not `localhost`.

Ready means all of the following, and `launch` exits only after the last one:

- The log at `/tmp/portfolio-verify/<port>/next.log` contains `Local:` with that URL and `Ready in`.
- `GET /` returns 200, the title `Caleb Mills | Senior Frontend Engineer`, and `id="projects"`.
- Headless Chrome, started by this run with a fresh user-data-dir, has the hero heading `Caleb Mills` visible.

There is nothing to migrate or seed. Copy comes from the app itself. Chrome's profile starts empty on every launch so a later theme preference cannot leak between runs. The README mentions a theme toggle stored in localStorage; the current page has no theme control.

One checkout can run one `next dev`. The harness refuses to launch when any `next dev` or `next-server` process already has this repo as its working directory, or when the chosen port is taken. Two checkouts can run side by side on different ports. Do not drive a dev server this run did not start. `launch` exiting does not stop the server.

## Doctor

```bash
.cursor/skills/verify-portfolio/scripts/control-portfolio doctor
```

Run this before the first drive and again after anything surprising. It is read-only. `result: ok` requires:

- the recorded npm pid is still this run's `npm run dev` for this port
- that pid's process tree owns the listening port
- `GET /` still returns the portfolio title
- `package.json` version, installed Next version, and git HEAD match the values saved at launch
- this run's Chrome process is alive
- the open page URL is still `http://127.0.0.1:<port>` and the heading `Caleb Mills` is in the accessibility tree

Auth is `none`. A scrolled section is still healthy: doctor does not require the hero to be in the viewport. If the server is healthy but the browser left the portfolio (for example after a `mailto:` link opened a mail client), doctor prints `result: not-ok` and `recovery: ... browser open`. `browser open` loads `/` again. If Chrome or the dev server died, run `cleanup` and `launch`. A HEAD mismatch means the tree changed after launch; clean up and launch again.

## Drive

Prefer accessible roles and names over CSS selectors, coordinates, and tab order. Roles used by the recipes are `link`, `button`, `heading`, and `image`. Names are exact and case-sensitive.

`browser open` loads the portfolio and then forces a 1280×800 viewport. Set the viewport after every `open` when the recipe needs a different size. Desktop recipes use `1280`×`800`. Mobile recipes use `390`×`844`. The viewport command resizes the Chrome window, so the width persists after the command exits. Later commands reapply the saved size. The desktop nav is `display: none` below 1024px. The mobile section-menu button is `display: none` at 1024px and above. The GitHub, LinkedIn, and Email icon links are in the top bar at every width.

When more than one node shares a role and name, `click` and `href` exit 1 until you pass `--nth`. `--nth` is 1-based DOM order among nodes still exposed to the accessibility tree. On a desktop viewport, `Experience` matches twice: nth 1 is the top bar, nth 2 is the hero link. `Email me` and `Email caleb.mills.1221@proton.me` also match twice at every width; the feature files say which nth is which. `browser open` without `--hash` waits until the hero heading is visible. `browser open --hash projects` loads `/#projects` and returns when the hash matches; the recipe then waits for the section heading.

Command stdout is part of the proof. A wait that prints `visible: true` is the cue to screenshot. Tiles under the hero fade up as they scroll into view (in browsers with scroll-driven animations), so wait for `visible: true` before a screenshot. The server HTML already contains every section, so text reads correctly before hydration.

The map in `features/README.md` is the source of which journeys exist. Driving one entry point does not cover the others listed there.

## Evidence

Write proof under `.cursor/skills/verify-portfolio/artifacts/`. Override the directory with `PORTFOLIO_VERIFY_EVIDENCE`. Relative `--path` values that start with `artifacts/` are stored inside that directory, so `--path artifacts/projects/view-work.png` becomes `artifacts/projects/view-work.png` and not a nested `artifacts/artifacts` folder. Cleanup never deletes this directory. It is gitignored.

A proof exercises the page in Chrome. Do not set React state, do not treat `app/data/portfolio.ts` as the result, and do not add a test-only route. Capture the command output and the resulting state. Each snapshot starts with `feature`, `entry`, `url`, `title`, and `viewport`. Each screenshot writes a sibling `*.png.meta.txt` with the same fields. The snapshot must include the heading `Caleb Mills` so the proof is tied to this site even when that heading is scrolled off the screenshot.

Visible results are headings, link names, and section copy. Side effects this app can produce are the URL hash, a mobile menu that mounts or unmounts links, the selected role in the experience explorer or accordion, a new tab URL when an outbound link is clicked, and a `mailto:` navigation. There is no database row and no sent message to inspect. Outbound origins (GenHealthAZ, UVSDECKS.GG, GitHub, LinkedIn) are outside the portfolio: record `hrefAttr` from the link the visitor would activate. A failure to load that origin is not a portfolio failure. Do not click those origins unless the feature file says to, and close extra tabs with `browser close-extra` afterward.

There is no dry-run mode and nothing on the page sends mail. The Email links are plain `mailto:caleb.mills.1221@proton.me` links: record `hrefAttr` rather than clicking them. A browser that hands off to a mail client leaves the page with a `mailto:` URL; run `browser open` afterwards. `browser canvases` is left over from the previous design and always prints 0 now.

## Cleanup

```bash
.cursor/skills/verify-portfolio/scripts/control-portfolio cleanup
```

Cleanup signals only the npm and Chrome pids recorded for this port, and only after their command lines still match this run. It then deletes `/tmp/portfolio-verify/<port>/`, including the Chrome profile and server log. It does not delete the evidence directory, `.next`, or any process it did not start. Do not use `pkill`, `killall`, or a kill by process name. A missing state file prints `result: no-instance` and exits 0. Run cleanup after a failed launch too. `launch` already does that for a failure it caused itself.

## Helpers

The harness is `.cursor/skills/verify-portfolio/scripts/control-portfolio`. It is executable Node.js and uses only Node built-ins plus `google-chrome` on `PATH` (`PORTFOLIO_VERIFY_CHROME` overrides the binary). Invoke it by that path:

```bash
.cursor/skills/verify-portfolio/scripts/control-portfolio launch
.cursor/skills/verify-portfolio/scripts/control-portfolio doctor
.cursor/skills/verify-portfolio/scripts/control-portfolio cleanup
.cursor/skills/verify-portfolio/scripts/control-portfolio browser open [--hash projects]
.cursor/skills/verify-portfolio/scripts/control-portfolio browser viewport --width 1280 --height 800
.cursor/skills/verify-portfolio/scripts/control-portfolio browser click --role link --name "Projects" [--nth 1]
.cursor/skills/verify-portfolio/scripts/control-portfolio browser wait --role heading --name "Projects" [--timeout 10000]
.cursor/skills/verify-portfolio/scripts/control-portfolio browser see --role heading --name "Projects" [--nth 1]
.cursor/skills/verify-portfolio/scripts/control-portfolio browser absent --role link --name "Home"
.cursor/skills/verify-portfolio/scripts/control-portfolio browser href --role link --name "Open GenHealthAZ live site"
.cursor/skills/verify-portfolio/scripts/control-portfolio browser location
.cursor/skills/verify-portfolio/scripts/control-portfolio browser motion
.cursor/skills/verify-portfolio/scripts/control-portfolio browser canvases
.cursor/skills/verify-portfolio/scripts/control-portfolio browser wheel --dy 400
.cursor/skills/verify-portfolio/scripts/control-portfolio browser snapshot --aria --path artifacts/projects/view-work.aria.txt --feature projects --entry view-work
.cursor/skills/verify-portfolio/scripts/control-portfolio browser screenshot --path artifacts/projects/view-work.png --feature projects --entry view-work
.cursor/skills/verify-portfolio/scripts/control-portfolio browser close-extra
```

`click` and `href` require `--nth` when the name is ambiguous. `wait` prints `visible: true` only after the node is opaque and inside the viewport. `absent` exits 0 when the count is 0. `wheel` scrolls the page vertically; positive `--dy` goes down. `close-extra` closes Chrome page targets other than the portfolio page recorded at launch.

## Maintenance

When the portfolio changes, run `/maintain-verification-skill` so this map stays aligned with the UI.
