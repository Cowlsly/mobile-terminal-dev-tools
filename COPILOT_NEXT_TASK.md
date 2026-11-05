# Copilot next task: verify and harden the mobile code workspace

**Repository:** Cowlsly/mobile-terminal-dev-tools
**Base branch:** root
**Owner authorization:** Continue work in this repository; implement and verify the next development increment. Use a feature branch and pull request; do not merge or deploy automatically.
**Priority:** P0 build and test evidence, P1 mobile usability, P1 Codespaces convenience, P1 accurate project records.

## Mission
Turn the already-merged Pierre-powered mobile workspace MVP into a **verified, easy-to-use, mobile-first application**. Do not restart the project or merely install the dependencies again. Close real gaps with inspectable evidence. Follow root AGENTS.md and the existing .everloom work system.

## Baseline already observed on 2026-11-05 (recheck before acting)
- Root branch contains a Vite/React/TypeScript app, Pierre Trees, Diffs, Highlights, Octokit, source and tests. PR #1 was merged.
- package.json declares npm scripts: dev, typecheck, build, test, preview.
- README documents local browsing, public GitHub repository loading and two-file comparison, but these descriptions are not verified runtime results.
- The .everloom checkpoint/ledger/resume records are out of date relative to merged source and should be reconciled only after checks.
- No .devcontainer/devcontainer.json or ordinary .github/workflows/ci.yml was found on root when checked.
- A .github/workflows/fortify.yml template exists and may require paid vendor configuration/secrets. Its presence does not constitute a successful security scan.
- No successful GitHub Actions run has been independently confirmed.

## Work packets (complete in order; stop only for a genuine blocker)

### 1. Inspect and reproduce the baseline
- Inspect all relevant changed files, latest commits, outstanding branches and any recent CI results; avoid duplicating or overwriting more recent work.
- Run in the repository: npm ci; npm ls --depth=0; npm run typecheck; npm test; npm run build; npm audit; git diff --check.
- Capture actual exit codes and concise error summaries. Fix discovered problems rather than marking them complete based on package scripts or assertions. Confirm whether the Pierre Highlights WASM asset works in a production bundle and on a real browser where possible.
- If npm audit reports issues, distinguish production from development transitive dependencies; use minimal compatible fixes, never npm audit fix --force blindly.
- Keep npm lockfile changes intentional. Do not modify dependency versions without a reason and regression tests.

### 2. Add reliable, independent CI
- Add a basic GitHub Actions CI workflow in .github/workflows/ci.yml for pull requests to root and pushes to root (and optional manual dispatch).
- Use a maintained Node.js version compatible with Vite 8 and the documented project requirements (prefer Node 24). Use npm ci.
- Run typecheck, unit tests, production build, and a dependency audit. Document audit policy accurately and avoid reporting green where the audit is red.
- Evaluate the existing Fortify template: determine whether its required secrets or commercial service are configured without exposing secret values. Do not count it as successful or make ordinary CI depend on paid services. Document/segregate any unconfigured scan; propose a safe change if it causes persistent failures.
- Restrict CI permissions to the minimum needed and avoid running untrusted PR code with write permissions or secrets.
- Provide a link to the actual completed CI run before claiming that CI passed.

### 3. Add a mobile-friendly Codespaces configuration
- Create .devcontainer/devcontainer.json (the correct conventional path, NOT a root-level devcontainer.json), suitable for Codespaces opened from Android.
- Use a stable Node 24 image, keep the container lightweight, run npm ci after creation, and forward Vite port 5173; make the preview accessible through the Codespaces forwarded-port UI.
- Include sensible editor customizations for mobile: word wrap, adequate editor/terminal font sizing, minimap off, reduced clutter and useful file associations. Do not pretend these settings can control the Android keyboard or the browser's viewport.
- Provide concise README instructions: start a Codespace, run npm run dev, open port 5173 preview, use the demo, then select local files or a public GitHub repository. Add troubleshooting for 5173 not forwarded and mobile file pickers.
- Keep development settings separate from production code and do not introduce deployment or paid services.

### 4. Verify and improve the actual mobile UX
- Test 360px and 390px portrait widths, plus a desktop viewport, ideally with screenshots or reproducible browser evidence.
- Ensure no unwanted page-level horizontal overflow, squashed controls, microscopic text, unreachable buttons or inaccessible file navigation. Make touch targets roughly 44 CSS px where practical.
- Check a fresh session; sample project load; Pierre Trees navigation; code highlighting (including fallback); local file/folder picker behavior or explicit platform limitations; two-file Diffs comparison; public GitHub repository browsing, bad URLs, network/rate-limit errors and oversized/binary files.
- Add or repair tests for each meaningful regression found. Preserve the read-only, no-token, no-upload privacy boundary.
- Do not add an inert terminal widget. This app currently does not execute shell commands; a real terminal requires a separate authorized backend design.

### 5. Reconcile durable records and hand off
- Update .everloom/LEDGER.md, CHECKPOINT.md, RESUME.md, DISCOVERIES.md and task.yml with current observations and proven work. Preserve historical decisions but clearly supersede stale statuses.
- Add a short root-level VERIFICATION.md with dated command results, CI URL, viewport/browser coverage, and remaining risks; mark unexecuted checks NOT RUN.
- Update README only with actually confirmed capabilities and sensible setup guidance.
- Create a feature branch, commit related changes, push it and open a descriptive PR targeting root; do not auto-merge. If existing working tree contains unknown changes, inspect them and preserve them rather than resetting.
- In the final reply, provide changed-file links, PR link, explicit PASS/FAIL/NOT RUN per command, any mobile screenshots/links, and unresolved blockers.

## Definition of done
A reproducible npm install/typecheck/test/build, working reviewable CI, a functional Codespaces preview, and a tested mobile workflow (or explicitly documented browser-test limitation) with durable evidence and a reviewable PR. No unsupported green checkmarks. No production deployments, external migrations, private tokens, new bills or unauthorized repository changes.

**Continue through these packets in sequence using best-effort progress. Do not ask the owner to perform terminal steps that the coding environment can execute itself.**
