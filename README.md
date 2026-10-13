# Caleb Mills portfolio

A single-page portfolio for Caleb Mills, a senior frontend engineer. The page has five sections: Home, Skills, Experience, Projects, and Contact. Desktop gets a fixed top bar. Phones get a top bar and a bottom dock with section tabs.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- framer-motion for scroll-linked motion; CSS for entrances and reveals (see `app/motion.css`)
- lucide-react icons
- Storybook 10 (`@storybook/nextjs-vite`), with Vitest running every story as a test

## Content

All authored content lives in `app/data/portfolio.ts`: profile, roles, skills, and projects. A content edit touches only that file.

`app/data/site.ts` derives the view model from it with `buildSite()`. This includes date ranges, counts, years of experience, section intros, and contact channels. Components receive slices of `site` as props and do not format anything themselves. `buildSite()` throws on bad content (roles out of order, no engineering role, duplicate project slugs), so the build fails.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server with Turbopack. |
| `npm run storybook` | Start Storybook on port 6006. |
| `npm run build-storybook` | Build a static Storybook into `storybook-static/`. |
| `npm test` | Run the unit tests for the pure modules with `node --test`. |
| `npm run test-storybook` | Run every story (render, play function, a11y) in headless Chrome through Vitest. |
| `npm run typecheck` | Type-check with `tsc --noEmit`. |
| `npm run lint` | Lint with `next lint`. |
| `npm run check` | Run typecheck, lint, test, test-storybook, build-storybook, and build, in that order. |
| `npm run build` | Build the production site. |

`npm test` relies on Node 22 type stripping. `npm run test-storybook` uses the installed Google Chrome; set `CHROME_PATH` if it is not at the default Windows path.

## Storybook

Components are built in Storybook first. Stories live next to their components (`components/**/*.stories.tsx`). Story decorators are in `.storybook/decorators.tsx`. Content variants for stories and tests, such as many roles or one project, are in `app/data/fixtures.ts`.

## Captures

`scripts/capture.mjs` takes proof screenshots over the Chrome DevTools Protocol. It has no dependencies and writes to `captures/` (git-ignored).

```bash
node scripts/capture.mjs page [--base URL] [--reduced-motion] [--video]
node scripts/capture.mjs stories [--base URL | --dir storybook-static] <story-id>[@phone][@full][@hover] ...
node scripts/capture.mjs mobile-nav [--base URL]
```

- `page` screenshots the full scroll at desktop and phone sizes and prints console errors and warnings. It exits 1 if there are any.
- `stories` screenshots Storybook stories by id. `--dir` serves a built Storybook from disk.
- `mobile-nav` captures the phone morph frames and runs navigation checks. It exits 1 if a check fails.

The default base URL is `http://127.0.0.1:3201`, so start the site there or pass `--base`. Set `CHROME` if Chrome is not at the default Windows path. `--video` needs ffmpeg on `PATH` or in the `FFMPEG` env variable.

## Verification

`.cursor/skills/verify-portfolio/` is an agent skill that drives the site in Chrome the way a visitor does and saves proof. Start with its `SKILL.md`. `features/` holds one verification recipe per part of the page. Launch the site for it with `.cursor/skills/verify-portfolio/scripts/control-portfolio launch`.
