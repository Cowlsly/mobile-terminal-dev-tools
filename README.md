# Mobile Terminal Dev Tools

A mobile-friendly browser workspace for exploring source files and comparing
code. Load files from your device or browse a public GitHub repository without
setting up an account or sending local files to a server.

## Features

- Browse local folders with the Pierre file tree, or choose individual files
  when the browser does not support folder selection.
- Read UTF-8 text with syntax highlighting for common programming languages.
- Compare two selected files in a unified diff view.
- Browse the default branch of a public GitHub repository with the official
  GitHub REST API client.
- Use a responsive interface designed for phones as well as desktop screens.

## Run locally

Use Node.js 24 (the CI and Codespaces version):

```sh
npm ci
npm run dev
```

The development server binds to all interfaces so it can be opened from another
device on the same network. Build and preview the production app with:

```sh
npm run build
npm run preview
```

Run the TypeScript check and tests with:

```sh
npm run typecheck
npm test
```

## Privacy and limits

- Local files are read in the browser and are never uploaded.
- Public GitHub repository browsing makes unauthenticated requests to
  `api.github.com`; repository names and file paths are sent to GitHub. Private
  repositories and access tokens are not supported.
- GitHub's unauthenticated API rate limits apply. The browser shows API errors
  rather than silently falling back to another source.
- Folder selection depends on browser support for `webkitdirectory`; use
  **Select files** as a fallback.
- A workspace is limited to 5,000 files, and text previews are limited to
  1 MiB per file. Binary and invalid UTF-8 files are not previewed.
- GitHub browsing currently reads the default branch only. It does not execute
  code, write files, authenticate, or review pull requests.

## Main libraries

- [Pierre Trees](https://github.com/pierrecomputer/pierre) — file tree
- [Pierre Diffs](https://github.com/pierrecomputer/pierre) — code comparisons
- [Pierre Highlights](https://github.com/pierrecomputer/pierre) — syntax
  highlighting
- [Octokit REST](https://github.com/octokit/rest.js) — public GitHub API access
- [Lucide](https://github.com/lucide-icons/lucide) — interface icons
- [Vitest](https://github.com/vitest-dev/vitest) and
  [Testing Library](https://github.com/testing-library/react-testing-library)
  — automated tests

## Codespaces from Android

1. Open this repository's working branch on GitHub, choose **Code → Codespaces → Create**.
2. Wait for the container's `npm ci` to finish, then run `npm run dev`.
3. Open **Ports → 5173 → Open in Browser**. Keep the forwarded port private.
4. Choose **Load sample project**, select a file in the tree, then try **Compare**.
5. Use **Select files** for your phone's local picker, or **GitHub repo** for a public repository.

If the preview is missing, add port **5173** in the Ports panel and verify that the
Vite process is still running. If the port is occupied, stop the old process or
forward the new port printed by Vite. If an existing Codespace has no Node/npm
after a failed container build, run **Codespaces: Rebuild Container** to apply
the Node 24 image from `.devcontainer/devcontainer.json`; do not treat a fallback
Alpine shell as ready. Folder selection varies across Android browsers and
document providers; select individual files when needed. Cancelling a picker
leaves the current workspace intact. Editor font/wrap settings do not change
Android keyboard behaviour. Codespaces hosting itself has account quotas.

## Verification and release status

See [VERIFICATION.md](VERIFICATION.md) for executed checks and limitations.
Community CI runs install, dependency resolution, typecheck, tests, build and
`npm audit` (all severities, including development dependencies). Audit failure
fails CI; no vendor subscription or secrets are needed. Fortify is a separate,
manual vendor scan: its last observed automatic run failed for missing FoD
credentials. It has not provided successful security evidence.

This is a browser source inspector, not an Android APK or an executable terminal.
There is no shell backend or Shizuku dependency. The configuration for Codespaces
is supplied but a hosted Codespace and physical Android interactions still need
verification. The central Cowlsly.Online account integration described in draft
PR #2 remains a separate release dependency; this PR does not introduce fake
login or claim that SSO is implemented. No production release is included.
