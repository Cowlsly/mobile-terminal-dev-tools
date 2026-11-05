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

Use Node.js 22.12+ (22.x), 24.x, or 26+:

```sh
npm install
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
