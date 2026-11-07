# Copilot execution handoff | Mobile Dev Tools Community | 2026-11-06

You are working exclusively in the repository `Cowlsly/mobile-terminal-dev-tools`, default branch `root`. Read the repository contents BEFORE claiming what is implemented. Create a feature branch and **draft PR** for one coherent packet. No automatic merge, release, deployment, paid services or secrets.

## Read these repository files in order
- `README.md`: truth about current behaviour.
- `package.json` and lockfile: commands and actual dependency versions.
- `COPILOT_NEXT_TASK.md`: existing detailed technical mission; preserve its best requirements.
- `src/App.tsx`, `src/styles.css`, `src/main.tsx`: mobile frontend.
- `src/lib/workspace.ts`, `src/lib/github.ts`, `src/lib/github-repository.ts`: browser workspace and public GitHub logic.
- `src/components/CodeViewer.tsx`, `src/components/CompareView.tsx`: highlighting and comparison.
- `src/App.test.tsx`, `src/lib/workspace.test.ts`, `src/lib/github.test.ts`: tests.
- `.github/workflows/fortify.yml` and any actual `.github/workflows/ci.yml`, `.devcontainer/devcontainer.json`: verify existence instead of assuming it.
- `.everloom/LEDGER.md`, `.everloom/CHECKPOINT.md`, `.everloom/RESUME.md`, `.everloom/DISCOVERIES.md`, `.everloom/task.yml` IF present. Treat current code and passing tests as stronger evidence than historical notes.
- `docs/COMMUNITY_PRO_BOUNDARY_2026-11-06.md`: scope and commercial separation.

## Required Cowlsly account at release
Owner-wide rule: every Cowlsly Labs app/game, including free Mobile Dev Tools Community and future Pro, will require sign-in with a real **Cowlsly.Online** account to use its features. This is a release gate; the central server-backed OIDC/PKCE identity issuer does not yet exist in production. Preserve current browser-only source inspection and privacy while drafting integration points. Do NOT implement a fake login with `localStorage`, password collection, tokens in source, automatic private GitHub access, or a paywall. New users need accessible sign-up and recovery outside the gated workspace. Document the blocker. See the central contract in `Cowlsly/main_user_site_cowlsly_online/docs/architecture/COWLSLY_CENTRAL_ACCOUNT_AND_REWARDS_CONTRACT_2026-11-06.md` (requires access to that repo; don't pretend cross-repo files are local).

## Central Cowlsly account entry paths
Once central account SSO exists, Community and Pro must show **Sign in**, **Create account**, **Forgot password**. The latter two open the real Cowlsly.Online website signup/recovery screens, not local mock forms or a codes UI. Signup verification/recovery uses secure Resend email links that continue after original app/browser closure. Native return uses verified registered Android App Links and OAuth PKCE/state, browser-only version uses registered web callbacks, with website fallback. No hard-coded return URL or private OAuth token in a web URL. Central specification: `Cowlsly/main_user_site_cowlsly_online/docs/architecture/ACCOUNT_LINK_VERIFICATION_AND_APP_RETURN_2026-11-06.md` on owner review branch. **Not implemented here**.

## Mission
**Finish Community first.** The user owns this project for personal use; public Community is free. Proposed Pro version is a later commercial fork/edition, not the current task.

Packet 0: Inspect Git status and recent PRs, inventory current branches, search for working CI and Codespaces config. PR #1 was merged; do not redo its work.
Packet 1: Run `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, and a dependency audit, recording PASS/FAIL/NOT RUN and actual exit codes. Fix minimal failures with tests. Never pretend it ran if tools cannot run commands.
Packet 2: Add or correct ordinary GitHub Actions CI (minimum read permissions) and reliable mobile-friendly Codespaces on port 5173. Check if a conventional `.devcontainer/devcontainer.json` already exists; don't overwrite user settings.
Packet 3: Validate the application end to end at 360px, 390px and desktop: demo projects; import local files and folders; file tree; syntax highlight; compare/diffs; GitHub public repo browsing; limits; error states; focus and accessibility. Avoid asking Android browser to perform unsupported filesystem operations. Preserve browser-local file privacy.
Packet 4: Improve UI as needed, strengthen tests, update accurate README docs. The app currently is a **read-only source inspector/comparison tool**, NOT a working terminal. A terminal pane is not allowed unless a real, permission-checked execution backend is built and isolated, documented and tested.
Packet 5: Open one draft PR and publish verification report. Do not release Pro or add billing within this task.

## Reporting contract
Describe exact commit, edited paths, command outputs, CI result links, browser evidence, supported/unsupported features, blocking owner actions and the next packet. When done, the owner should be able to run Community on mobile and see tested behaviour without finding fake functionality or paying for a plan.
