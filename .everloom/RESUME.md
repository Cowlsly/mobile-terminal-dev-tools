# Resume packet — 8 November 2026 UTC

## Current state
- Branch `recovery/codespaces-runtime-2026-11-08`, based on
  `79a3006141415e95c4705454dd394a282e32a550`.
- Repaired the invalid Node 24 Dev Container image tag and restored Node/npm in
  the current user PATH. The required local npm checks passed; details are in
  root `VERIFICATION.md`.
- Local dev server and production preview served successfully. No interactive
  browser or Codespaces forwarded-port UI was available.
- No backup was found/restored. No source dependency or lockfile changes.

## Next best actions
1. Publish the local recovery branch (commits `29d9737` and `c249c68`) through
   an authorized GitHub workflow; the agent's noninteractive remote check could
   not authenticate. Do not provide or store a token in the repository.
2. Open a review PR targeting `root` after the branch is available remotely.
3. Rebuild a Codespace from the corrected config; verify the image, Node/npm,
   `npm ci`, and port 5173 forwarding.
4. In a real browser, check 360px/390px portrait and desktop, navigation,
   highlighting/WASM, local file pickers, comparisons, public GitHub success and
   error flows, touch targets, and accessibility. Record NOT RUN until then.

## Command diagnosis
- The reported command names are not installed or documented project tasks.
- The `copilot` CLI segfault is unverified: no CLI binary, core dump, or matching
  inspected log entry exists. Do not equate it with the VS Code extension.
- Preserve the read-only public GitHub and browser-local file privacy boundaries.

---

## Historical resume packet (superseded)

### Initial implementation resume packet

## PRIMARY OBJECTIVE
Deliver a mobile-friendly local code workspace using the installed Pierre Trees, Diffs, and Highlights packages.

## CURRENT STATE
Plan captured in the task manifest and ledger; app source/tooling not yet implemented.

## COMPLETED
- Installed and previously verified `@pierre/diffs@1.6.4`, `@pierre/trees@1.0.0-beta.6`, and `@pierre/highlights@0.4.0`.
- Added `node_modules/` to `.gitignore`.
- Updated Everloom task scope for this user-authorized project improvement.

## ACTIVE TASK
app-foundation — add React/TypeScript/Vite app tooling and verify the first build.

## PENDING
- local file loading and browsing
- syntax-highlighted code viewer
- file comparison
- responsive UI, README, and final verification

## BLOCKED
- None.

## IMPORTANT FINDINGS
- Project README asks for a phone-friendly file explorer, comparison, syntax highlighting, and GitHub integration.
- Repo had no app source or npm scripts.
- Trees React API: `useFileTree({ paths, onSelectionChange })` and `<FileTree model={model}>`.
- Diffs React API: `<FileDiff fileDiff={metadata}>`; use `parseDiffFromFile(oldFile, newFile)` to make metadata.
- Highlights API: `codeToHtml(source, { lang, theme })` returns UTF-8 bytes.
- This task's scope is a browser-local MVP; no upload or remote GitHub/auth integration.

## DECISIONS
- Keep all local file reads in the browser.
- Deliver file browse/view/compare before future remote integration.
- Do not commit.

## FILES / LOCATIONS
- Task and progress: `.everloom/task.yml`, `.everloom/LEDGER.md`, `.everloom/CHECKPOINT.md`
- Application (planned): `src/`
- Tooling/docs (planned): `package.json`, `README.md`

## VERIFICATION STATUS
IMPLEMENTED: planning only; implementation/build not started.

## NEXT BEST ACTION
Install React, React DOM, Vite, TypeScript, and their types/plugin; create a minimal app entry and run TypeScript/build checks.

## WARNINGS / CONSTRAINTS
- Browser directory selection compatibility varies; provide a multiple-file picker fallback and document platform limitations.
- Do not claim runtime behavior based solely on a successful build.
