# Recovery checkpoint — 8 November 2026 UTC

Supersedes the prior status below; historical decisions remain available.

- Authority: owner-authored Superflow Recovery v2.1. Branch
  `recovery/codespaces-runtime-2026-11-08`, based on `79a3006141415e95c4705454dd394a282e32a550`.
- The worktree was clean before recovery. No backup archive/snapshot was found
  in the inspected workspace/persisted-share locations; nothing was restored.
- Root cause: Codespaces creation logged “No manifest found” for
  `mcr.microsoft.com/devcontainers/javascript-node:1-24-bookworm`, then fell
  back to Alpine 3.23.7. That shell had no Node/npm, so npm checks initially
  exited 127. Updated the image to the official documented `5-24-bookworm` tag.
- Node 24.22.2/npm 11.19.1 were installed from the official musl release with
  a matching SHA-256; `npm ci`, dependency resolution, typecheck, 30 tests,
  production build, audit (zero findings), and `git diff --check` now pass.
- Local Vite port 5173 and production preview port 4173 both returned HTTP 200.
  Production app/highlighting assets returned HTTP 200; Pierre highlighting
  smoke test passed in Node. Browser execution was not available.
- Latest observed CI was successful on the earlier merged PR #5 commit; it does
  not run against this recovery diff. See root `VERIFICATION.md`.
- Recovery commit `29d9737eb3c0fb4438b703222e675f7a3da5197c` and evidence
  commit `c249c681654cda7be9757a51c1840ff9a0ad07d1` are local only.
  The remote branch check and noninteractive push both failed because Git could
  not obtain a password; no remote ref changed and no PR was created. Commit
  signing lacked a local private key, so all recovery commits used one-command
  unsigned overrides; persistent Git configuration was not changed.
- `pilot-mobile-verification`, `copilot`, and `Grok` are not installed commands
  or project scripts. No alias/docs or crash dump was found. The reported
  Copilot segmentation fault cannot be attributed or reproduced here; a CLI and
  the VS Code Copilot extension are separate components.
- BLOCKED: no interactive browser or Codespaces forwarded-port UI. 360/390px,
  desktop, Android picker/touch behavior, live GitHub browser flow, and hosted
  Codespace rebuild remain NOT RUN.
- No dependency or lockfile change, backup restore, merge, deployment, private
  GitHub access, or shell backend.
- Next: publish the local branch through an authorized GitHub workflow and open
  a PR against `root`; then rebuild the Codespace and complete browser/device checks.

---

## Historical checkpoint (superseded)

### Initial implementation checkpoint

## Objective
Deliver a first usable increment of the mobile-terminal-dev-tools project: a browser-local workspace for browsing source files, viewing highlighted code, and comparing two files.

## Completed before this task
- Added `@pierre/diffs`, `@pierre/trees`, and `@pierre/highlights`.
- Verified the packages resolve with `npm ls --depth=0`.
- Added `node_modules/` to `.gitignore`.

## Current task state
The React/Vite/TypeScript foundation and the initial local workspace UI are implemented. The foundation check identified a missing Vite asset type declaration; app implementation and testing continue.

## Planned work packets
1. Establish React/TypeScript/Vite tooling and scripts.
2. Load local files and browse them with the Pierre tree.
3. Add syntax-highlighted code viewing and explicit binary-file handling.
4. Compare selected files with the Pierre diff renderer.
5. Add public GitHub repo browsing without credentials.
6. Add focused tests and Lucide icons, then responsive/accessibility polish.
7. Document usage and verify dependency health.

## Provenance and decisions
- Everloom workflow guidance was read from `Cowlsly/everloom-universal` (`EVERLOOM.md`, task schema, and verification contract).
- User requested to improve the project. Its README defines a mobile-friendly file explorer, code comparison, highlighting, and GitHub integration.
- The repository was otherwise an empty shell with the three Pierre dependencies installed.
- Public GitHub repo browsing is included as a read-only enhancement using the official API, without authentication.
- Files are read in-browser only. No file contents are uploaded.
- A PWA plugin was evaluated and rejected after its current release added audited vulnerable transitive build dependencies; the older safe-version suggestion conflicts with the project's Vite 8 stack.

## Verification
- Pending; record exact commands and results as packets complete.

## Next action
Finish fixing the TypeScript foundation check, then verify the app build before continuing through ledger packets.
