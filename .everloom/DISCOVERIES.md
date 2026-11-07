# Current verification checkpoint — 7 November 2026

Supersedes historical implementation status below; historical decisions retained.

- Authority: owner recovery request; root AGENTS.md and COPILOT_NEXT_TASK.md read.
- Base: 14942450b0c842d0bba3031afce52664a6a70f95. Branch:
  fix/copilot-mobile-verification. Tested application source: e425eb5a27f870a3f052998bf77ae5f4fd2a5209.
- State: BLOCKED for remote publication; existing draft PR #4 targets root.
  Its published head is 402ac4bc319cf82210028b40b40af1f985134028.
- Recovery diagnosis: the Codespaces log records the invalid
  `javascript-node:1-24-bookworm` image tag, then a `base:alpine2026` fallback.
  The local devcontainer config now uses `24-bookworm`, runs `npm ci`, and
  forwards 5173. The corrected image has not been rebuilt in this Codespace.
- The fallback shell initially lacked Node/npm on PATH. Official Alpine packages
  restored Node 24.22.1 and npm 11.11.0. `npm ci`, dependency resolution,
  typecheck, 30 tests, build, audit (zero findings), and `git diff --check` pass.
  Build warns about optional language chunks over 500 kB.
- Production preview on port 5173 returned HTTP 200 for the app and JS/CSS/WASM
  wrapper assets. Pierre Highlights passed a Node smoke and jsdom app test.
  Forwarded-port UI and browser execution are not verified.
- Terminal diagnosis: `pilot-mobile-verification` and `Grok` are unsupported
  commands; `copilot` is absent, so its reported segmentation fault cannot be
  attributed or reproduced. No CLI was installed and no credentials were read.
- Backup inventory found no named archive/snapshot files or directories under
  `/workspaces` or `/home/vscode`; no restore was attempted.
- Existing remote CI passed on 402ac4b. Local commit e425eb5 has no CI result;
  `git push` was rejected because no credential helper/`gh` is configured.
  Do not send credentials in chat.
- Browser/device checks at 360/390px, desktop, Android picker, real GitHub
  requests, and corrected Codespaces startup remain NOT RUN. See VERIFICATION.md.
- No merge, deployment, paid services, private GitHub access, or shell backend.
- Next: authenticate through the Codespaces UI, push this branch, verify new CI,
  then complete browser and hosted Codespaces checks. Preserve draft PR #2.
- Reusable lesson: after a devcontainer image pull error, verify the actual
  running image and PATH; Codespaces can fall back to a base image without Node.

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
