# Community verification — 7 November 2026 (AWST)

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
- The supplied Codespaces creation log showed image launch failed because
  `javascript-node:1-24-bookworm` has no manifest. The config now uses
  `javascript-node:24-bookworm`; devcontainer JSON validation and the registry
  manifest request both pass. Container startup and forwarded preview remain
  **NOT RUN** after the correction: this environment has no Docker/devcontainer
  executable. Node/npm are also unavailable here, so app checks were not rerun.
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
