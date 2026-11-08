# Recovery verification — 8 November 2026 (UTC)

Scope: owner-authorized recovery on base
`79a3006141415e95c4705454dd394a282e32a550`, branch
`recovery/codespaces-runtime-2026-11-08`. The worktree was clean before repair.

## Root cause and repair

The supplied Codespaces creation log records “No manifest found” for
`mcr.microsoft.com/devcontainers/javascript-node:1-24-bookworm`. Codespaces
then fell back to Alpine Linux 3.23.7; the shell had no Node/npm. The configured
image now uses the official documented stable Node 24 tag
`mcr.microsoft.com/devcontainers/javascript-node:5-24-bookworm`.

Node v24.22.2/npm 11.19.1 were installed for local checks from the official
Linux musl Node archive after its SHA-256 matched the official release checksum.
The portable runtime is now in the Codespaces user's `~/.local` PATH. The actual
Codespace was not rebuilt, so image creation and forwarded-port UI are NOT RUN.

## Requested command results

| Command | Result | Evidence |
|---|---|---|
| `node --version` | PASS | `v24.22.2` |
| `npm --version` | PASS | `11.19.1` |
| `npm ci` | PASS (0) | 173 packages installed; 174 audited |
| `npm ls --depth=0` | PASS (0) | All direct dependencies resolve |
| `npm run typecheck` | PASS (0) | `tsc --noEmit` |
| `npm test` | PASS (0) | 4 files, 30 tests |
| `npm run build` | PASS (0) | Vite transformed 2,889 modules; large language chunks warning (>500 kB) |
| `npm audit` | PASS (0) | 0 known vulnerabilities |
| `git diff --check` | PASS (0) | No whitespace errors |

Before installing Node, `node`, `npm`, `npm ci`, dependency resolution,
typecheck, tests, build, and audit each failed with exit 127 because `npm`/`node`
were absent. These were environment failures, not test failures; all were rerun
after the runtime repair.

## Preview and application coverage

| Check | Result | Evidence |
|---|---|---|
| `npm run dev -- --port 5173 --strictPort` | PASS locally | `http://127.0.0.1:5173/` returned HTTP 200 |
| `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` | PASS locally | Built HTML, JS, CSS and Pierre/WASM helper assets returned HTTP 200 |
| Pierre `codeToHtml` smoke test | PASS in Node | Generated highlighted TypeScript HTML |
| Automated application tests | PASS | Sample workspace, tree selection, highlighting, compare renderer, local input, bad GitHub host, and race/response cases |
| 360px / 390px / desktop browser | NOT RUN | No browser executable or interactive browser available |
| Android touch, picker, and accessibility | NOT RUN | Physical device/browser unavailable |
| Live public GitHub browser flow | NOT RUN | Application tests mock API boundaries; no browser session |
| Codespaces rebuild / forwarded-port UI | NOT RUN | Corrected config is not running in a rebuilt hosted Codespace |
| Production deployment | NOT RUN | No deployment requested or performed |

The build contains inlined/dynamic Pierre WASM-related JavaScript assets; local
HTTP serving and Node highlighting succeeded. Execution of those assets in a
production browser is still unverified. The build emits a chunk-size warning
for optional language/highlighting bundles; build exit status is 0.

## CI evidence

The latest observed successful workflow was PR #5's `verify` job:
[run 42419171610](https://github.com/Cowlsly/mobile-terminal-dev-tools/actions/runs/42419171610)
on `337dd98328abe6e2d882a345379f91e4a8e64d82`. That earlier CI result predates
this recovery diff and is not evidence that the image-tag change passed CI.

## Command and backup diagnosis

- `pilot-mobile-verification`, `copilot`, and `Grok` do not resolve as installed
  commands. The first and third are not package scripts or repository tasks;
  no matching alias was found in inspected shell config.
- No Copilot CLI binary, matching crash log entry, or core dump was found. The
  reported `copilot` segmentation fault cannot be reproduced or attributed to
  the VS Code Copilot extension from this environment.
- No backup archive/snapshot was found in the inspected workspace and
  Codespaces persisted-share paths. Nothing was restored or overwritten.
- No dependencies or lockfile were changed. The previous PR #4 and PR #5 are
  merged. Local recovery commit
  `29d9737eb3c0fb4438b703222e675f7a3da5197c` is not pushed or run in CI. The
  noninteractive `git ls-remote` preflight could not obtain a password, so no
  remote branch change or PR was made. Git commit signing had no local private
  key; a per-command unsigned override was used without changing Git config.

---

# Historical verification — 7 November 2026 (AWST)

The following records the prior branch/commit only; it is retained as history.

Scope: COPILOT_NEXT_TASK.md on base `14942450b0c842d0bba3031afce52664a6a70f95`.
Branch: `fix/copilot-mobile-verification`. Runtime: Node 24.22.1, npm 11.9.0.

## OBSERVED NOW: local commands

| Command | Result | Evidence |
|---|---|---|
| npm ci | PASS (0) | 174 packages installed from existing lockfile |
| npm ls --depth=0 | PASS (0) | All 18 direct dependencies resolve |
| npm run typecheck | PASS (0) | Baseline and final source |
| npm test | PASS (0) | Baseline 20; final 30 tests across 4 files |
| npm run build | PASS (0) | Baseline and final production bundle; large optional language chunks warning |
| npm audit | PASS (0) | 0 known vulnerabilities, all dependencies |
| git diff --check | PASS (0) | No whitespace errors |

No dependency versions or lockfile were changed. Tests exercise empty GitHub
files, stale tree sizes, response size/encoding/binary/UTF-8 limits, private and
truncated repository rejection, local import superseding a pending GitHub load,
and comparison completion after switching workspaces.

## Runtime coverage and limits

- jsdom application tests: sample workspace, Pierre tree selection, highlighted
  source, mounting the diff renderer, local file input, invalid GitHub host.
- Production preview starts with `npm run preview -- --host 127.0.0.1 --port 4173`.
  A later HTTP probe could not connect, so a reachable preview is NOT verified.
  Default all-interface preview failed here because this runtime denies network
  interface enumeration (`uv_interface_addresses`). This is an environment
  restriction, not evidence that Codespaces has the same problem.
- Chromium launch FAILED: `socket() failed: Operation not permitted`.
  Therefore 360px, 390px and desktop visual checks, production-browser WASM,
  real network GitHub browsing, focus navigation, and native file pickers are
  **NOT RUN**. No screenshots are claimed. jsdom is not browser/device evidence.
- Codespaces image launch and forwarded preview: **NOT RUN**; configuration only.
- Phone installation, central account SSO and production: **NOT RUN**.

## CI and optional Fortify

[Community CI passed](https://github.com/Cowlsly/mobile-terminal-dev-tools/actions/runs/42381990953)
on source commit `e5b015615547d8029ca595bc6e496651287f0909`: install,
dependency resolution, typecheck, all 30 tests, production build, full audit and
clean tracked diff all succeeded. [Draft PR #4](https://github.com/Cowlsly/mobile-terminal-dev-tools/pull/4)
contains the changes. Later evidence-only commits do not change tested source.

[Observed Fortify failure](https://github.com/Cowlsly/mobile-terminal-dev-tools/actions/runs/42362861697)
at base SHA: `ERROR: Either FOD_CLIENT_ID or FOD_USER must be declared`.
The scan was not configured sufficiently in that run. Other vendor settings and
secret inventories are UNKNOWN; no secret values were accessed. This branch
makes Fortify manual-only, preserving the template for deliberate future setup.

## Review and rollback

Review the feature PR before merging. Rollback is reverting that PR; no data
migration, billing, account changes or deployment occurred. Preserve draft PR #2
and its central-account release gate. Touch controls now have 44px minimum
heights and readable narrow-screen inputs/code; visual acceptance remains open.
