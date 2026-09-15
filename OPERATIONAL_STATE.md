# Dexter Walk Forge — Operational State

Project ID: dexter-walk-forge
Revision: 6
Remote: `westkitty/Dexter_Walk_Forge`
Branch: `main`
Uplift implementation commit: `334021d36f733f19a6ec7e04805be5a4cb203938`
Timeforge implementation commit: `cfd3d9ae99662108872b01bc3b2b4a2d236562ec`
Pages/PWA implementation commit: `4d9589f8e55106f8007b3b106f0dea09e2ed3b3d`
Pages/PWA parser/cache repair commit: `ee8d9d8bbed22a795aa90d223e09539fabec0bf5`
Live Pages URL: `https://westkitty.github.io/Dexter_Walk_Forge/`

## Artifact contract

The primary source artifact remains a single-file, mobile-first browser app. A user starts a walk, speaks or types unstructured product thoughts, issues natural-language decisions, and receives continuously maintained product structure plus a complete implementation handoff. The core experience remains local-first and requires no account, backend, analytics, or external application runtime dependency.

`timeforge.html` remains an optional repo-local companion for post-walk provenance, branch/history exploration, semantic comparison, selective merge, project memory, and deterministic handoff recipes. It does not replace or silently alter the primary capture artifact.

GitHub Pages is the hosted distribution path. The Pages build creates a separate `_site` artifact from verified source files and injects manifest/install hooks into hosted copies. Source `index.html` remains unchanged so the verified single-file source artifact is preserved.

## Active invariants

- Raw walk trace is preserved separately from derived idea state.
- Typed capture remains usable when speech recognition is unavailable or denied.
- Rejected ideas remain explicit non-goals and remain available to the implementation handoff.
- `build that` / `forge that` generates a handoff rather than pretending an external build occurred.
- Local project data persists in browser storage and can be exported as JSON.
- The primary source runtime remains a self-contained HTML artifact with no external script or stylesheet dependency.
- Import and destructive/replacement workflows preserve a recovery path where practical.
- Timeforge branch edits remain isolated until explicit merge; historical checkpoints remain read-only.
- Imported DWF v3 provenance remains labeled `inferred` unless a durable direct raw-source link exists.
- Pages deployment must pass the primary verifier, Timeforge verifier, source PWA verifier, Pages build, and built-site PWA verifier before deploy.
- PWA enhancement is applied to Pages build output rather than rewriting protected source `index.html`.
- Pages HTML injection must target verified outer document boundaries; generated HTML strings inside JavaScript must never be treated as the hosting document boundary.
- Built Pages `index.html` must preserve the primary source inline script exactly; any difference is a deployment blocker.
- The service worker is repo-scoped and may delete only cache keys owned by Dexter Walk Forge; it must not clear sibling caches on the shared GitHub Pages origin.

## Current capabilities

### Primary Dexter Walk Forge

- Typed/browser speech walk capture, interim transcript, pause/resume, elapsed timer, typed fallback.
- Natural-language feature/critical/lock/park/reject/restore/pin/merge/tag/rename/question/constraint/decision/dependency/undo/redo/build controls.
- Structured ideas, Live Spec Reactor, Forge, interactive Map, History, backups/import/export, accessibility controls, responsive navigation, and Portable Walk Capsule.

### Timeforge companion

- DWF import, Source Lens, direct/inferred/unlinked provenance, immutable event/checkpoint history, historical scrub, fork-from-checkpoint, semantic diff, selective merge, Project Memory, deterministic Forge Recipes, Timeforge export, and DWF-compatible main export.

### Pages / PWA distribution layer

- Web app manifest with standalone display, repo-relative scope/start URL, 192x192 and 512x512 icons, Walk/Timeforge shortcuts.
- Browser install prompt support plus iOS Add to Home Screen guidance.
- Install affordance positioned above DWF capture/navigation controls and safe-area inset.
- Same-origin repo-scoped service worker with precached shell, namespaced cache cleanup, navigation network-first fallback, and static cache background refresh.
- Offline fallback page that does not promise offline browser speech recognition.
- Parser-safe deterministic Pages build with outer-document-boundary injection.
- GitHub Actions Pages workflow with validation gates before upload/deploy.

## Evidence state

### Verified — primary app

- `verify.mjs` passes against the current source and validates migration, normalization, clustering, duplicate/tension/risk signals, readiness, MVP derivation, acceptance stories, Walk Capsule, and single-file invariants.
- Prior headless Chromium QA passed typed capture/persistence, raw-preserving undo/redo, command flows, Forge, Map, handoff, Walk Capsule, history/recovery behavior, and responsive checks at 390x844, 834x1112, and 1440x900.

### Verified — Timeforge companion

- `timeforge-verify.mjs` passes deterministic import/provenance/history/branch/diff/merge/memory/recipe/export checks.
- Prior headless Chromium QA passed demo import, branch mutation, semantic diff, selected merge, Project Memory, QA Recipe, and responsive checks.

### Verified — Pages/PWA repair and deployment

- User screenshots reproduced the signature of premature inline-script termination: normal UI followed by raw DWF JavaScript rendered as page text.
- Root cause confirmed in `scripts/build-pages.mjs`: first-match `</body>` replacement targeted the Walk Capsule template string inside the main inline script.
- `scripts/html-document.mjs` now resolves validated outer boundaries and the builder injects the install hook only at the outer body close.
- `pwa-verify.mjs` now contains a synthetic nested-HTML regression and verifies exact inline-script preservation in built output.
- Service-worker cleanup is namespaced to Dexter Walk Forge caches; unrelated origin caches are preserved.
- Static cached assets now refresh in the background to prevent indefinite stale resources.
- GitHub Actions run `34950237988` passed primary, Timeforge, source-PWA, build, built-site integrity, Pages configuration, artifact upload, and deployment jobs for repair commit `ee8d9d8bbed22a795aa90d223e09539fabec0bf5`.
- The uploaded Pages artifact was independently downloaded and inspected: the PWA hook appears after the complete primary inline script and immediately before the actual outer `</body>`.
- GitHub reported successful deployment and environment URL `https://westkitty.github.io/Dexter_Walk_Forge/`.

### Implemented, real-device verification still pending

- Installed-PWA launch/persistence/offline reload on the user's target device.
- iOS Add to Home Screen affordance on a real iPhone/iPad.
- Actual microphone capture and browser Web Speech behavior in the primary app.
- Optional on-device `SpeechRecognition.processLocally` path remains browser-dependent.

## Regression guards

- Never inject hosted/runtime tags with first-match replacement of generic closing HTML tags in a document that contains generated HTML strings.
- A Pages build is invalid if the first inline script differs from source or fails JavaScript compilation.
- Service-worker cache cleanup must remain prefix-scoped to this application.
- Preserve source `index.html` as the single-file local artifact; hosted PWA hooks belong to the generated Pages artifact unless explicitly redesigned later.

## CI / deployment

- Workflow: `.github/workflows/pages.yml` (`Pages / PWA`).
- Trigger: pushes to `main` plus manual `workflow_dispatch`.
- Latest verified run: `34950237988` — SUCCESS.
- Current deployment state: **LIVE — VERIFIED BY GITHUB PAGES DEPLOYMENT**.
- Live URL: `https://westkitty.github.io/Dexter_Walk_Forge/`.

## Uplift ledger

`UPLIFT_LEDGER.md` remains the original 100-item uplift plus `WOW-01`. Timeforge, Pages/PWA, and this bugsweep are later capability/repair slices and are documented separately rather than double-counted into that ledger.

## Next closure checks

1. On the target Android device, install from the live Pages URL and verify launch -> local persistence -> close/reopen -> offline reload -> Timeforge navigation.
2. On iOS if relevant, verify Safari Share -> Add to Home Screen guidance and standalone launch.
3. Separately close the existing speech uncertainty with one real microphone walk: start -> final speech transcript -> pause -> resume -> continued capture -> finish/Forge.
