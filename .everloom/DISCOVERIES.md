# Current verification checkpoint — 8 November 2026 (AWST)

Supersedes historical implementation status below; historical decisions retained.

- At production build preview, 360×800 and 390×844 viewports had no horizontal
  page overflow; 1280×900 desktop also fit.
- Before the current uncommitted CSS update, the Pierre tree's theme variables
  were not applied and its narrow-screen region was only about 113px high. The
  current worktree sets the package's sidebar/list/input theme variables and a
  definite mobile height (`clamp(120px, 24dvh, 220px)`). A 390px production
  browser run then showed four rows in about 203px, touch selection, highlighting,
  and comparison. Preserve this local change; it is not committed.
- Production-browser highlighting confirms the bundled WASM runtime works; this
  is stronger than the earlier Node/jsdom-only check.
- A real public API request for `octocat/Hello-World` succeeded without a token.
  Rate-limit/network failure and native Android picker behavior are still not
  verified; unit tests cover validation and size/encoding/binary limits.
- `npm ci`, dependency resolution, typecheck, 30 tests, build, audit, and
  `git diff --check` pass locally. A documentation-only commit followed these
  checks; remote CI is successful only on PR #4's published head, not on local
  records or the uncommitted stylesheet.
- Remote push still requires authenticated GitHub UI access. The corrected
  Codespaces image has not been rebuilt; do not claim a hosted preview.
- No merge, deployment, paid service, private GitHub access, or shell backend.

---

## Historical record (superseded)

# Discoveries

- The project started with only a README, license, Git ignore file, and the newly installed Pierre libraries; there was no application source or npm scripts.
- The resolved Pierre package versions are `@pierre/diffs@1.6.4`, `@pierre/trees@1.0.0-beta.6`, and `@pierre/highlights@0.4.0`.
- `@pierre/trees/react` exposes `useFileTree` with `onSelectionChange`, and its `<FileTree>` renders an encapsulated tree.
- `@pierre/diffs/react` exports `<FileDiff>` and root exports `parseDiffFromFile(oldFile, newFile)`.
- `@pierre/highlights` initializes WebAssembly at import and exposes `codeToHtml`; import and bundle behavior must be checked in the production build.
- The durable work method is from `Cowlsly/everloom-universal`; no registered orchestration workflow exists, so state is maintained in `.everloom/`.
- Reviewed package metadata and maintainers' repositories from npm and GitHub. Selected Lucide (ISC, React 19 peer compatible), Octokit (MIT, browser-capable official GitHub SDK), and Vitest plus Testing Library/jsdom (MIT, React 19 and Vite 8 compatible).
- `vite-plugin-pwa@2.0.0` declares Vite 8 support but introduces 6 audit findings through Workbox build dependencies (2 low, 4 moderate). The audit's proposed `1.1.0` downgrade does not support Vite 8, so PWA was rejected rather than introduce a vulnerable/conflicting dependency graph.
- The terminal emulator `@xterm/xterm` was not selected: this browser-only app has no shell execution backend, so a terminal widget would not provide a real terminal and could mislead users.
- Public GitHub browsing will use Octokit with fixed official API endpoints only; no tokens, private repositories, or file uploads.
