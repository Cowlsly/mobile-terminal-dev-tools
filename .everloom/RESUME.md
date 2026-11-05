# Resume Packet

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
