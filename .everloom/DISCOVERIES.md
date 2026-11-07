# Current verification checkpoint — 8 November 2026 (AWST)

Supersedes historical implementation status below; historical decisions retained.

- The Pierre tree's original theme variables were unsupported, leaving a light
  background with faint text. Use documented `--trees-theme-sidebar-*` and
  list/input variables for a coherent dark tree.
- On narrow layouts the tree host had auto height while its virtualized shadow
  root used `height: 100%`; the scroll area collapsed to 0px. A definite,
  viewport-based mobile host height restores visible rows. Setting Pierre
  `itemHeight: 44` keeps touch targets aligned with the virtualizer and CSS.
- Verified in production Chromium at 360×900, 390×900, and 1280×900: no
  horizontal overflow; all sample rows visible at the phone sizes; real touch
  selection, highlighted TypeScript, rendered Diffs, and public
  `octocat/Hello-World` browsing work. The production Highlight bundle executes
  successfully, not just its Node/jsdom wrapper.
- Local file selection was exercised through Playwright file injection, not a
  physical/native picker. GitHub API success and invalid-host rejection passed;
  live network/rate-limit failures remain untested. Unit tests cover binary,
  oversized, invalid UTF-8, private/truncated and race cases.
- All requested local npm checks pass on source commit
  `db667cc6c5fa855c9c18baa59dc62e43c854343d`. The build still warns about
  optional language chunks over 500 kB. CI only passed on PR #4's published
  `402ac4bc319cf82210028b40b40af1f985134028`.
- GitHub write authentication, hosted Codespaces startup/port forwarding, and
  physical Android remain blockers/unverified. No credentials were accessed.
- No merge, deployment, paid service, private access, or shell backend.

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
