# Dexter Walk Forge — Project Bible

This file is additive. New implementation sessions append evidence and decisions; earlier entries should not be rewritten to make later work look cleaner.

## 2026-09-15 — Timeforge companion slice

Implementation commit: `cfd3d9ae99662108872b01bc3b2b4a2d236562ec`

### Decision

Keep the verified `index.html` walk/capture artifact unchanged during this slice. Add Timeforge as an optional repo-local companion rather than forcing a risky rewrite of the primary capture surface.

### Implemented

- `timeforge.html` — local-first branch/history companion shell.
- `timeforge-core.js` — pure deterministic import, provenance, checkpoint, diff, merge, memory, recipe, and export logic.
- `timeforge-ui.js` — rendering, modal, provenance display, diff, memory, and recipe presentation layer.
- `timeforge-app.js` — browser event binding, persistence triggers, import/export controls, and interaction bootstrap.
- Source Lens with direct, inferred, and unlinked provenance states.
- Event-backed checkpoints and historical read-only inspection.
- Fork-from-checkpoint branch creation.
- Semantic branch comparison.
- Selective merge that applies only chosen differences.
- Cross-walk Project Memory over current main plus imported archive.
- Six deterministic Forge Recipes.
- Timeforge JSON export and DWF v3-compatible main-branch export.
- `timeforge-verify.mjs` — standard-library verifier that executes the exact core file, parses the browser layer, and enforces repo-local dependency boundaries.

### Protected behavior

- Primary `index.html` is unchanged.
- DWF remains local-first.
- Existing raw walk trace remains source evidence.
- Rejected ideas/non-goals remain preserved in imported state.
- Timeforge introduces no remote runtime dependency; its three JavaScript dependencies are repo-local files beside `timeforge.html`.
- Timeforge does not claim imported v3 provenance is direct when only similarity evidence exists.

### Validation

Executed successfully in the implementation workspace:

- `node timeforge-verify.mjs`
- Headless Chromium runtime path using the repository's established exact-HTML `about:blank` injection workaround because direct `file://` navigation is blocked by managed browser policy.
- Runtime exercised demo import, branch creation, branch-only mutation, semantic diff, selected merge into main, Project Memory rendering, QA Recipe rendering, and responsive overflow checks at 390×844, 834×1112, and 1440×900.
- Web authorship audit: PASS. One non-blocking style signal remained for repeated rounded containers.

### Repair evidence

Runtime QA exposed one real defect before delivery: the demo path double-normalized an already normalized import object. `normalizeImport` now accepts the internal normalized DWF import form. Deterministic and runtime validation both passed after that repair.

### Environment limits

- Direct `file://` browser navigation is blocked by administrator policy in the managed Chromium environment. Runtime QA injected the exact final HTML shell plus the exact repo-local Timeforge scripts into an allowed blank document, matching the repository's existing QA method.
- Real microphone/Web Speech verification for the primary app remains outside this Timeforge slice and remains the existing project-level uncertainty.

## 2026-09-15 — Pages/PWA parser and cache bugsweep

Implementation commit: `ee8d9d8bbed22a795aa90d223e09539fabec0bf5`
Workflow run: `34950237988`
Live Pages URL: `https://westkitty.github.io/Dexter_Walk_Forge/`

### Trigger

User screenshots showed the hosted app rendering normal UI followed by raw JavaScript source. This was treated as a deployment/runtime regression, not a cosmetic layout bug.

### Root cause and repairs

- The Pages builder injected its PWA script with first-match `</body>` replacement. Dexter Walk Forge's Walk Capsule generator contains nested HTML, so the first `</body>` belonged to a JavaScript template string. The injected literal `</script>` terminated the real app script early. Replaced generic first-match injection with validated outer-document boundary injection.
- Added a regression fixture that deliberately embeds nested `<body>...</body>` markup inside an inline script and proves the hosted hook cannot enter that script.
- Built-site verification now asserts the first inline script is byte-for-byte identical to source and compiles successfully.
- Service-worker activation previously deleted all other cache keys on the shared GitHub Pages origin. Cleanup is now restricted to Dexter Walk Forge's cache prefix.
- Static cached resources now receive background refresh instead of remaining cache-first forever.
- Install affordance now clears DWF's bottom capture/navigation area and supports iOS Add to Home Screen guidance.

### Validation

GitHub Actions run `34950237988` passed the primary verifier, Timeforge verifier, source PWA verifier, Pages build, built-site parser/script-integrity verifier, Pages configuration, artifact upload, and deployment.

The exact uploaded Pages artifact was then downloaded and inspected independently. In built `index.html`, the primary inline script closes before the injected PWA script, and the PWA script sits immediately before the real outer `</body>`. The failure path visible in the screenshots is absent.

### New invariants

- Never use first-match generic closing-tag replacement for Pages injection in HTML containing generated HTML strings.
- Hosted builds must preserve the source inline script exactly.
- Service-worker cache cleanup must be application-prefix-scoped on shared origins.
- Source `index.html` remains the local single-file artifact; PWA augmentation belongs to the generated Pages artifact.

### Remaining evidence gap

Real-device installed-PWA launch/persistence/offline behavior and the pre-existing microphone/Web Speech path remain to be verified on target hardware.
