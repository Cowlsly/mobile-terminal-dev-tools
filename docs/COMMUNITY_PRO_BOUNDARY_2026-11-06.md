# Community vs Pro boundary | 2026-11-06

## Community: finish before proposing Pro shipping
The current repository is a React/TypeScript/Vite source-file browser and comparator with Pierre Trees, Diffs, Highlights and public GitHub browsing. Its README explicitly says it does **not** execute commands or provide private-repository authentication. Keep a free personal-use focus and trustworthy mobile experience.

Release gates: baseline npm tests/build/typecheck, GitHub CI, mobile usability checks, accurate README, explicit release artifacts and source licences. Do not infer a functioning terminal from the repository name.

## Proposed Pro, subject to owner review
A future separately licensed private repository can explore real isolated terminal sessions; private GitHub/OAuth with scoped access; repository patch/commit tools; multi-tab projects; encrypted workspace; remote worker execution via a secure approved backend; licensing and storefront. These are **not existing capabilities**. Terminal execution requires a separate threat model, key isolation, transport authentication, rate/resource limits, safe shell boundaries, opt-in and auditable permissions.

Review the licences of all open-source dependencies before relicensing or shipping a commercial closed-source bundle. Selling software isn't itself blocked by permissive licences, but copying source governed by incompatible terms can be.

## Release ownership
Never migrate the current free Community app's features to an unreviewed Pro codebase or hide previously free functions behind a paywall without a specific owner decision. Document what would be newly paid. Open a separate proposal/PR rather than silently making the existing public app proprietary.
