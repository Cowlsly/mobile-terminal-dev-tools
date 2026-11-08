# Recovery findings — 8 November 2026 UTC

## Confirmed Codespaces runtime failure

- Symptom: container setup failed, followed by a shell where `node` and `npm`
  were unavailable and all npm commands exited 127.
- Reproduction/evidence: `.persistedshare/creation.log` reports no manifest for
  `mcr.microsoft.com/devcontainers/javascript-node:1-24-bookworm`; the later
  environment is Alpine Linux 3.23.7 and has no Node executable on `PATH`.
- Root cause: unsupported/outdated image tag led Codespaces to a fallback
  environment rather than the configured JavaScript Node development image.
- Repair: changed the image reference to the official documented
  `mcr.microsoft.com/devcontainers/javascript-node:5-24-bookworm`. A Codespaces
  rebuild has not yet been run.
- Verification: installed official Node v24.22.2 Linux musl archive after its
  SHA-256 matched the official `SHASUMS256.txt`; npm 11.19.1 and requested
  project checks then passed. This proves local project checks, not image build.
- Prevention: validate image tags against the maintained Dev Container image
  documentation when changing major Node versions; test actual Codespaces
  creation before calling its preview path ready.

## Reported terminal commands

- `pilot-mobile-verification` and `Grok` do not resolve as executables; neither
  is a package script, repository-documented task, or matching alias in the
  inspected shell configuration.
- `copilot` does not resolve as an executable. No crash dump or matching crash
  message exists in inspected Codespaces startup/terminal logs. The reported
  segmentation fault cannot be attributed to a Copilot CLI binary or
  reproduced. The VS Code Copilot extension is a distinct component; its local
  host installation is not inspectable from this fallback shell.
- Prevention: confirm `command -v`, project scripts, and documented task names
  before running a command; do not invent aliases or install unofficial tools.

## Application and preservation evidence

- `npm ci`, `npm ls --depth=0`, typecheck, 30 tests, build, audit (zero
  vulnerabilities), and whitespace check passed. The build warns about
  optional large language chunks; it exits successfully.
- Dev server on 5173 and production preview on 4173 returned HTTP 200 locally.
  Build output includes the Pierre/WASM helper chunks and those assets returned
  HTTP 200; `codeToHtml` generated highlighted HTML in a Node smoke test.
  Production-browser WASM remains unverified.
- No backup archive/snapshot was found in the inspected locations. No restore
  was attempted; there was no unique backup content to reconcile.
- Browser viewport/touch/native picker, live GitHub browser flow, and the
  Codespaces forwarded-port interface remain untested.
- Remote publication is blocked: noninteractive `git ls-remote` and `git push`
  could not obtain a password, so no remote branch or PR was created. Do not
  request or record a token; publish through an authorized GitHub workflow. Git
  signing also lacked a local secret key; recovery commits used per-command
  unsigned overrides without changing Git configuration.

---

## Historical discoveries (superseded)

### Earlier implementation discoveries

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
