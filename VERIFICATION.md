# Community verification — 8 November 2026 (AWST; 7 November UTC)

Current results supersede the earlier recovery log below wherever they differ.
Branch `fix/copilot-mobile-verification`; tested source commit
`db667cc6c5fa855c9c18baa59dc62e43c854343d`, based on `402ac4b`. No dependency
versions or lockfile were changed. No credentials were read or exposed.

## Current local checks

| Command | Result | Evidence |
|---|---|---|
| `node --version` / `npm --version` | PASS (0) | Node 24.22.1 / npm 11.11.0 |
| `npm ci` | PASS (0) | 174 packages installed; 175 audited; 0 vulnerabilities |
| `npm ls --depth=0` | PASS (0) | All 18 direct dependencies resolve |
| `npm run typecheck` | PASS (0) | `tsc --noEmit` |
| `npm test` | PASS (0) | 30 tests across 4 files |
| `npm run build` | PASS (0) | Vite 8.3.5; optional language chunks exceed 500 kB |
| `npm audit` | PASS (0) | 0 known vulnerabilities, including development dependencies |
| `git diff --check` | PASS (0) | No whitespace errors |

## Current browser checks

- The production preview on port 5173 returned HTTP 200. Headless Chromium
  149 exercised it at 360×900, 390×900, and 1280×900. Document width matched
  each viewport; no page-level horizontal overflow or page errors occurred.
- A confirmed mobile defect was repaired: Pierre's virtualized tree needs a
  definite height on narrow layouts. Its auto-sized host had left the internal
  virtual scroll region at 0px, clipping rows. The mobile tree now receives a
  definite viewport-based height, and all four sample rows fit at both phone
  sizes. Tree rows and the mobile import/navigation controls measure 44px.
- Portrait touch selected `src/greeting-updated.ts`; the production browser
  rendered syntax-highlighted output (25 highlight spans). The production
  Diffs component rendered the expected old `Hello` and new `Welcome back` lines.
- Playwright's local file injection exercised the individual-file import path.
  The native Android file/folder picker was not opened. A bad external host was
  rejected with `Only HTTPS URLs from github.com are supported.` Public
  `octocat/Hello-World` browsing succeeded without a token: repository,
  branch, and tree endpoints returned HTTP 200, and its README rendered.
- Existing jsdom tests cover invalid GitHub hosts, binary/oversized/invalid
  UTF-8 responses, private/truncated repositories, file input handling, and
  workspace race conditions. API rate-limit/network failures, physical Android,
  keyboard/focus navigation, and the native picker remain **NOT RUN**.
- The corrected `.devcontainer/devcontainer.json` startup and Codespaces
  forwarded-port UI remain **NOT RUN**. Local preview is not evidence of hosted
  Codespaces readiness. No production deployment was made.

Screenshots at 360px, 390px, and desktop are retained as session artifacts and
are not committed to the application repository.

## CI and remaining blockers

[Community CI passed](https://github.com/Cowlsly/mobile-terminal-dev-tools/actions/runs/42382070655)
on the published PR #4 head `402ac4bc319cf82210028b40b40af1f985134028`. PR #4
is still open and draft. CI has **NOT RUN** on `db667cc6c5fa855c9c18baa59dc62e43c854343d`.
The local source and verification commits remain unpushed.

Push publication remains blocked: the noninteractive `git push` exited 128 with
`fatal: unable to get password from user`; the shell has no configured GitHub
credential helper or `gh` executable. Do not send credentials in chat. The Pro
add-on repository has not been created; keep its source separate from this free
workspace and defer repository creation until the free PR/release gates and
repository write access are available.

[The observed Fortify run failed](https://github.com/Cowlsly/mobile-terminal-dev-tools/actions/runs/42362861697)
at the base SHA because `FOD_CLIENT_ID` or `FOD_USER` was missing. The vendor
scan remains manual-only and is not counted as successful security evidence.
Other vendor configuration is unknown; no secret values were accessed.

The central account SSO described by draft PR #2 remains a separate release
dependency, not part of this browser-only free workspace. No merge, deployment,
paid service, private GitHub access, or shell backend was introduced.

## Earlier recovery log — 7 November 2026 (superseded where updated above)

Scope: COPILOT_NEXT_TASK.md on base `14942450b0c842d0bba3031afce52664a6a70f95`.
Branch: `fix/copilot-mobile-verification`. Runtime: Node 24.22.1, npm 11.11.0.

## OBSERVED NOW: local commands

| Command | Result | Evidence |
|---|---|---|
| node --version | PASS (0) | v24.22.1 |
| npm --version | PASS (0) | 11.11.0 |
| npm ci | PASS (0) | 174 packages installed; 175 audited |
| npm ls --depth=0 | PASS (0) | All 18 direct dependencies resolve |
| npm run typecheck | PASS (0) | `tsc --noEmit` |
| npm test | PASS (0) | 30 tests across 4 files |
| npm run build | PASS (0) | Vite 8.3.5 production build; optional language chunks exceed 500 kB |
| npm audit | PASS (0) | 0 known vulnerabilities, all dependencies |
| git diff --check | PASS (0) | No whitespace errors |

No dependency versions or lockfile were changed. Tests exercise empty GitHub
files, stale tree sizes, response size/encoding/binary/UTF-8 limits, private and
truncated repository rejection, local import superseding a pending GitHub load,
and comparison completion after switching workspaces.

## Runtime coverage and limits

- jsdom application tests: sample workspace, Pierre tree selection, highlighted
  source, mounting the diff renderer, local file input, invalid GitHub host.
- Node-side `@pierre/highlights` smoke returned highlighted markup. The
  production bundle contains the WASM wrapper chunks; the standalone `.wasm`
  binary is not emitted. Production-browser WASM execution is still **NOT RUN**.
- `npm run preview -- --host 0.0.0.0 --port 5173 --strictPort` served the
  production index, JavaScript, CSS, and both WASM wrapper chunks with HTTP 200
  on localhost. This does not verify the Codespaces forwarded-port UI.
- No browser executable or browser automation was available. The earlier
  Chromium launch attempt failed with `socket() failed: Operation not permitted`.
  Therefore 360px, 390px and desktop visual checks, touch/focus navigation,
  real network GitHub browsing, and native file pickers are **NOT RUN**. No
  screenshots are claimed; jsdom is not browser/device evidence.
- The creation log records a failed image pull at 18:09 because
  `javascript-node:1-24-bookworm` had no manifest. Codespaces then started a
  `base:alpine2026` fallback container. The repository config now specifies
  `javascript-node:24-bookworm`, `npm ci`, and port 5173, but rebuilding this
  corrected config has not been verified.
- The fallback Alpine shell initially lacked `node` and `npm` on `PATH`. The
  official Alpine packages `nodejs-24.22.1-r1` and `npm-11.11.0-r0` were
  installed; normal `node`/`npm` commands now work in this Codespace.
- Phone installation, central account SSO and production: **NOT RUN**.

## Terminal error diagnosis

| Reported command/error | Current evidence and conclusion |
|---|---|
| `pilot-mobile-verification: command not found` | No executable, shell alias, npm script, or documented task with this name was found. The command is unsupported here; use the documented npm scripts. |
| `copilot` segmentation fault | No `copilot` executable or core file was found, so the reported crash could not be reproduced or attributed to the VS Code extension. No CLI was installed or replaced. A cached extension entry is not evidence that a CLI exists. |
| `Grok: command not found` | No executable, alias, npm script, or documented task with this name was found. It is not a supported repository command. |

No authentication credentials were read or exposed. The existing remote
Community CI pass is on commit `402ac4bc319cf82210028b40b40af1f985134028`;
the local image-fix commit `e425eb5a27f870a3f052998bf77ae5f4fd2a5209` has not
received CI. Pushing failed because Git could not obtain a password in this
shell; no credential helper or `gh` executable is configured. PR #4 remains
open and draft, targeting `root`.

## Backup reconciliation

Searched `/workspaces` and `/home/vscode` (up to five directory levels) for
backup/archive files and snapshot directories. None were found. The Codespaces
persisted share contains startup/runtime logs, not a backup snapshot. No restore
was attempted; all repository work was preserved.

## CI and optional Fortify

[Community CI passed](https://github.com/Cowlsly/mobile-terminal-dev-tools/actions/runs/42382070655)
on commit `402ac4bc319cf82210028b40b40af1f985134028`: install, dependency
resolution, typecheck, all 30 tests, production build, full audit and clean
tracked diff succeeded. [Draft PR #4](https://github.com/Cowlsly/mobile-terminal-dev-tools/pull/4)
contains the published changes; the local image-fix and recovery notes have not
been pushed, so they have no CI result yet.

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
