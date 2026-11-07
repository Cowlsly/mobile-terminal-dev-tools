# Cowlsly Labs | Superflow v3 execution checkpoint
Date: 2026-11-08 (AWST)
Source: owner-supplied `Cowlsly_Labs_Master_Superflow_Work_Queue_v3.md` (7 November 2026).
Status: PARTIAL. This file is the repository-scoped execution adaptation, not a claim that the full portfolio prompt has been executed.

## Authority and boundaries
- Owner requested application of Superflow v3 to this repository, finishing Free before cloning it to create Pro.
- Follow `AGENTS.md`, `COPILOT_NEXT_TASK.md` and `.everloom/` instructions. Use branches and draft PRs; no automatic merge, deployment, spending or account changes.
- Current Free application is a browser-based read-only public GitHub workspace. It has **no shell backend, Shizuku functionality, Android APK, or private repository access**. Do not misrepresent it as a native terminal.
- A separate private Pro repository is a future stage, not created or authorised to publish here. Audit licences and upstream obligations before choosing Pro distribution terms.
- Do not add Shizuku or privileged operations to Free. Pro requires an independently reviewed security architecture, scoped permissions and explicit approvals for consequential actions.

## Reconciled evidence (observed via GitHub connector on 2026-11-08)
- Repository: https://github.com/Cowlsly/mobile-terminal-dev-tools ; default branch `root`.
- PR #3, exported Codespaces changes: merged (observed).
- PR #4, file loading, mobile Codespaces and CI: draft/unmerged (observed).
- PR #4 `VERIFICATION.md` reports successful npm ci, typecheck, 30 tests, build, audit and a linked CI run on a specific SHA (historical report; do not generalise to subsequent commits).
- 360px/390px mobile browser checks, native file pickers, hosted Codespaces preview and production browser WASM remain NOT RUN in the recorded evidence.
- PR #2 is a separate Copilot instructions proposal. Preserve and reconcile before merge.
- Local unpushed Codespaces edits: UNKNOWN. GitHub cannot prove they were preserved.

## Ordered execution queue
| ID | Priority | State | Outcome / acceptance gate |
|---|---|---|---|
| CL-DT-001 | P1 | VERIFYING | Reconcile PR #4 and PR #2; independently review diffs, checks, release boundaries and regressions. No automatic merge. |
| CL-DT-002 | P1 | READY | Run real 360px, 390px and desktop browser smoke tests: workspace load, tree, highlighting/WASM, diff, GitHub errors, file selection, focus and touch. Attach actual evidence; mark device-only checks pending. |
| CL-DT-003 | P1 | READY | Verify Codespaces port 5173 in supported environment; distinguish container connectivity from app defects. |
| CL-DT-004 | P2 | BLOCKED | Produce Free release candidate only after code review and required gates. Define distribution format honestly; do not promise APK from Vite source. Blocker: browser/device evidence and review. |
| CL-DT-005 | P2 | BLOCKED | After verified Free baseline, prepare a private Pro clone with provenance, licences, separation, security model and rollback. Blocker: Free release candidate; owner approval for consequential repository creation/publication where applicable. |
| CL-DT-006 | P2 | BLOCKED | Implement Pro-only advanced/privileged features after separate specification, authorisation and tests. No Shizuku in Free. |

## Resumption
1. Inspect PR #4's current head, CI and review comments; inspect PR #2 and `.everloom/` records before editing.
2. Complete CL-DT-001, then CL-DT-002/003 in a browser-capable runtime. Avoid retrying the same container socket failure without a changed environment.
3. Keep `local`, `CI`, `browser`, `Android device` and `production` verification separate.
4. Update existing `.everloom` ledger/checkpoint after substantive implementation. No parallel ledger authority is created by this file.
5. Before any Pro clone: freeze and tag the reviewed Free source, inspect MIT and third-party licences, document exact fork lineage, decide private repo access and release policy.

## Rollback
This coordination-only change can be reverted independently. It does not modify application source, dependencies, CI, credentials or deployments.
