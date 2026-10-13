# Vendored pstack

Repo-local copy of pstack so Cursor agents (local and cloud) load the same skills, playbooks, agents, and model rule. Cloud agents only see what is committed here.

## Source

**Upstream pstack 0.15.15**, not Caleb's fork.

- Repo: https://github.com/cursor/plugins (`pstack/`)
- Version: `0.15.15` (from `pstack/.cursor-plugin/plugin.json`)
- Commit: `df581122cde17e6e27686b5a448bde23e4ad4318` (`feat(pstack): drop Sol, default to Opus xhigh and Grok (#511)`)
- License: MIT, copied to `.cursor/pstack-LICENSE`

Tried first: https://github.com/Rakvadium/odd-stack (and `odium-stack`, `odiumstack`, `oddstack`, `pstack` under the same owner). None of those repos resolve, public or via the authenticated `gh` session. Official 0.15.15 is the fallback the task named. The fork was described as identical to 0.15.15 plus a path-visualizer app; that app is not in this vendor.

## Layout

| Upstream (plugin) | This repo |
| --- | --- |
| `pstack/skills/` | `.cursor/skills/` |
| `pstack/agents/` | `.cursor/agents/` |
| `~/.cursor/rules/pstack-models.mdc` (written by `/setup-pstack`) | `.cursor/rules/pstack-models.mdc` |

`poteto-mode` keeps `playbooks/`, `references/`, and `scripts/` next to its `SKILL.md`. Other skills keep their `references/` and `scripts/` the same way. Skill-to-skill links such as `../poteto-mode/SKILL.md` still resolve.

## Uninstall the official plugin

Uninstall the official **pstack** Cursor plugin locally. If both the plugin and this tree are loaded, skill names (`/poteto-mode`, `/how`, …) duplicate and the agent can pick the wrong copy.

Also delete `~/.cursor/rules/pstack-models.mdc` if a previous `/setup-pstack` wrote one. The committed repo rule is the source of truth. Re-running `/setup-pstack` in this repo now writes `.cursor/rules/pstack-models.mdc`.

## Updating from the fork

When `Rakvadium/odd-stack` (or another odium-stack checkout) is available:

1. Confirm it is a pstack fork (`skills/poteto-mode/SKILL.md`, `playbooks/`, `references/`).
2. Copy `skills/` → `.cursor/skills/` and `agents/` → `.cursor/agents/`.
3. Do **not** vendor the path-visualizer app.
4. Re-apply the path remaps below (upstream playbooks still say `pstack/skills/...` and `scripts/watch-pr/...`).
5. Refresh `.cursor/pstack-LICENSE` and the Source section of this file (version, commit, URL).
6. Keep `.cursor/rules/pstack-models.mdc` unless the fork already sets different defaults.

To refresh from official pstack instead:

```bash
git clone --filter=blob:none --sparse https://github.com/cursor/plugins.git
git -C plugins sparse-checkout set pstack
git -C plugins checkout df581122cde17e6e27686b5a448bde23e4ad4318
rsync -a --delete plugins/pstack/skills/ .cursor/skills/
rsync -a --delete plugins/pstack/agents/ .cursor/agents/
# re-apply remaps, then restore this file and the model rule
```

## Path remaps applied on top of 0.15.15

These are the only intentional edits to vendored skill text. Helper script internals were left alone; they resolve via `import.meta.dir`.

- `pstack/skills/` → `.cursor/skills/`
- `~/.cursor/rules/pstack-models.mdc` → `.cursor/rules/pstack-models.mdc`
- `scripts/watch-pr/watch-pr` → `.cursor/skills/poteto-mode/scripts/watch-pr/watch-pr`
- `scripts/orch/orch.ts` / `bun scripts/orch/orch.ts` → `.cursor/skills/poteto-mode/scripts/orch/orch.ts`
- `scripts/worktree-audit.sh` → `.cursor/skills/poteto-mode/scripts/worktree-audit.sh`
- `scripts/log.sh` → `.cursor/skills/show-me-your-work/scripts/log.sh`

## What was not vendored

- Path-visualizer app (fork-only; not present in 0.15.15)
- Plugin `docs/`, `README.md`, `assets/`, `automations/benny/`, `plugin.json`
- App / site code

`/poteto-help` guide links now point at the pinned 0.15.15 commit on GitHub instead of the missing `../../docs/` plugin tree. Its "public copy" prefix still says `https://github.com/cursor/plugins/blob/main/pstack/`, which is newer than 0.15.15.

`deslop`, `control-ui`, and `control-cli` still come from the separate **cursor-team-kit** plugin. They are not in this vendor. Cloud agents will not have those skills unless that plugin is also installed or vendored.

## Runtime notes

- `check-plan.mjs` is plain Node and runs from repo root: `node .cursor/skills/poteto-mode/scripts/check-plan.mjs <plan.md>`
- `watch-pr` and `orch.ts` require **Bun** (`#!/usr/bin/env bun`). They install their own deps into `.cursor/skills/poteto-mode/scripts/node_modules/` (gitignored) via `bootstrap.ts`. Without Bun those two helpers will not start.
