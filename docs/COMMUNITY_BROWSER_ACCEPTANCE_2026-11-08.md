# Community mobile/browser acceptance checklist
Updated 2026-11-08 AWST. Status: **NOT RUN** unless an evidence link is added.

This is a reproducible test plan, **not** a record of successful browser or device testing. The source PR's Node/CI checks do not substitute for native browser, Android picker, or Codespaces verification.

## Setup and evidence
- Check out the exact PR #4 head and record commit SHA, OS, browser version, device model, viewport CSS size and timestamp.
- Run `npm ci && npm run dev` on a supported Node 24 environment. Use the forwarded port 5173 preview if in Codespaces; do not expose the port publicly.
- Record screenshots (redact personal paths, tokens and private filenames), console errors and network errors. Test a fresh session.
- Keep local file content browser-local. Do not upload local files to a third-party test service.

## Browser matrix
| Scenario | 360px portrait | 390px portrait | Desktop | Android device |
|---|---|---|---|---|
| Sample workspace loads and tree navigates | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Syntax highlighting and WASM/fallback render | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Compare two files and switch workspaces mid-load | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Public GitHub repository and error/rate-limit states | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Local file picker and folder picker where supported | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Keyboard/focus, screen-reader names, 44px touch controls | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| No horizontal page overflow or inaccessible controls | NOT RUN | NOT RUN | NOT RUN | NOT RUN |

## Steps and expected outcomes
1. **Sample:** load sample project, open nested files, verify readable code and tree selection.
2. **Highlight:** open a supported language and an unsupported/binary or oversized file. The app must fail safely and remain responsive; check actual browser WASM loading.
3. **Compare:** choose two different files, confirm diff changes; start a slow repository load, switch to local sample, confirm stale results/loading indicator do not overwrite the new workspace.
4. **GitHub:** load a known public repository. Try invalid URL, private/nonexistent repository, empty file and rate-limit/network errors. Show actionable messages, no token requests.
5. **Local:** choose two small non-sensitive text files from the Android picker, verify names/content stay local. Test folder selection only where supported and label unsupported pickers accurately.
6. **Touch/accessibility:** rotate/resize, tap every control at 360px/390px, verify focus visibility and no hidden buttons or unwanted page-level horizontal scrolling.
7. **Codespaces:** start the configured devcontainer, run `npm run dev`, confirm port 5173 forwarded and browser preview loads. A JupyterLab connection error alone is not proof of app failure.

## Gates
- CI: previously successful on source commit `e5b015615547d8029ca595bc6e496651287f0909` at https://github.com/Cowlsly/mobile-terminal-dev-tools/actions/runs/42381990953 ; current PR head `402ac4bc319cf82210028b40b40af1f985134028` differs by evidence-only commits. Recheck CI for code changes.
- Fortify: PR #4 proposes making unconfigured optional vendor scan manual-only; do not claim a Fortify scan passed.
- Release: **BLOCKED** until required real browser/device checks and review. Central Cowlsly.Online SSO is a separate documented public-release gate; do not substitute mock login.
- Record observed result, screenshot/evidence URL, defects and exact environment for each cell. Do not change NOT RUN to PASS without executing it.

## Rollback
This file is documentation only; remove/revert independently if needed.
