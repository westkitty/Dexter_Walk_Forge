# Dexter Walk Forge — Operational State

Project ID: dexter-walk-forge
Revision: 4
Remote: `westkitty/Dexter_Walk_Forge`
Branch: `main`
Uplift implementation commit: `334021d36f733f19a6ec7e04805be5a4cb203938`
Timeforge implementation commit: `cfd3d9ae99662108872b01bc3b2b4a2d236562ec`

## Artifact contract

The primary artifact remains a single-file, mobile-first browser app. A user starts a walk, speaks or types unstructured product thoughts, issues natural-language decisions, and receives continuously maintained product structure plus a complete implementation handoff. The core experience remains local-first and requires no account, backend, analytics, or external runtime dependency.

`timeforge.html` is an optional repo-local companion for post-walk provenance, branch/history exploration, semantic comparison, selective merge, project memory, and deterministic handoff recipes. It does not replace or silently alter the primary capture artifact.

## Active invariants

- Raw walk trace is preserved separately from derived idea state.
- Typed capture remains usable when speech recognition is unavailable or denied.
- Idea state distinguishes active ideas, committed features, critical features, parked ideas, merged source material, and rejected ideas.
- Rejected ideas remain preserved as explicit non-goals and remain available to the implementation handoff.
- `build that` / `forge that` generates and opens an implementation handoff rather than pretending an external build occurred.
- Local project data persists in browser storage and can be exported as JSON.
- The primary runtime remains a self-contained HTML artifact with no external script or stylesheet dependency.
- Parking or rejecting a locked feature clears its lock so state cannot claim both “accepted decision” and “out of active scope.”
- Import and destructive/replacement workflows preserve a recovery path where practical.
- Timeforge branch edits are isolated until an explicit merge.
- Historical Timeforge checkpoints are read-only; continuing from history requires a fork.
- Timeforge selective merge applies only selected semantic differences.
- Imported DWF v3 provenance is labeled `inferred` unless a durable direct raw-source link exists.

## Current capabilities

### Primary Dexter Walk Forge

- Walk capture: typed and browser speech-recognition input, interim transcript, pause/resume, elapsed timer, typed fallback.
- Natural-language controls: feature, critical, lock, park, reject, restore, pin/unpin, merge, tag, rename, question, constraint, decision, dependency, undo/redo, pause/resume voice, build/forge.
- Structured idea model: state, priority, notes, tags, dependencies, lock, pin, timestamps, source trace.
- Live Spec Reactor: metrics, Forge-readiness score, thesis, critical path, theme clusters, non-goals, next useful question.
- Forge: derived MVP, acceptance criteria, user stories, constraints, decisions, open questions, later scope, deterministic risk/tension/duplicate signals.
- Map: interactive SVG topology for ideas, dependencies, priorities, and duplicate candidates.
- History: archive, restore-as-copy, export, delete.
- Recovery: undo/redo, rolling local snapshots, full backup import/export, session import/export, multi-tab refresh.
- Accessibility/ergonomics: keyboard shortcuts, visible focus states, reduced motion, high-contrast theme, text scaling, responsive mobile navigation, safe-area handling.
- Exports: full JSON backup, session JSON, Forge Markdown, implementation prompt Markdown, raw trace copy.
- Flagship: Portable Walk Capsule HTML containing derived product structure plus the preserved raw walk trace.

### Timeforge companion

- Import DWF v3 root/session state, Timeforge state, same-origin DWF local state, or a safe demo project.
- Source Lens showing raw walk evidence and Timeforge lineage for an idea.
- Direct/inferred/unlinked provenance classification with honest treatment of legacy v3 source ambiguity.
- Immutable event log plus full branch checkpoints.
- Time Machine slider for historical branch inspection.
- Fork-from-checkpoint branching with isolated branch mutation.
- Semantic diff across ideas, constraints, decisions, and questions.
- Selective merge into a target branch with no unselected-change leakage.
- Project Memory across current main plus imported archived walks.
- Deterministic Build, coding-agent, issue-sequence, MVP, QA, and cold-start handoff Recipes.
- Timeforge JSON export preserving branch/history metadata.
- DWF v3-compatible export of the current `main` branch.

## Evidence state

### Verified — primary app

- `verify.mjs` passes against the final primary implementation and validates syntax, single-file dependency boundaries, migration, normalization, malformed archive tolerance, clustering, duplicate/tension/risk signals, readiness/MVP derivation, acceptance stories, and Walk Capsule completeness.
- The same `index.html` + `verify.mjs` pair passes from a fresh temporary directory, clearing the obvious hidden-local-state clean-build risk for the declared artifact/test pair.
- Headless Chromium runtime QA passes for typed capture/persistence, raw-preserving undo/redo, natural-language question capture, feature promotion, Forge rendering, Map rendering, implementation handoff, Walk Capsule generation, and absence of external script/style dependencies.
- Deeper runtime QA passes for feature/critical/lock/park/restore/pin/tag/rename/question/constraint/decision/dependency/merge/reject commands; manual ordering; batch actions; detail-editor coherence; keyboard shortcuts; history archive/restore; and Forge-derived systems.
- Responsive runtime checks pass without horizontal overflow at 390×844, 834×1112, and 1440×900.
- Walk, Forge, Map, and History are reachable through mobile navigation at 390 px width.
- Remote `main` was moved non-forcefully to the implementation commit and independently read back from GitHub.

### Verified — Timeforge companion

- `timeforge-verify.mjs` passes, executes the exact `timeforge-core.js`, parses `timeforge-ui.js` and `timeforge-app.js`, and verifies that `timeforge.html` references only the three expected repo-local scripts.
- Deterministic checks pass for import normalization, direct provenance, event/checkpoint integrity, immutable historical checkpoints, branch isolation, semantic diff, selective merge, Project Memory, all six Recipes, malformed session normalization, and DWF-compatible export.
- Headless Chromium runtime QA passes for demo import, branch creation, branch-only idea capture, semantic diff rendering, selected merge into main, Project Memory rendering, QA Recipe rendering, and absence of runtime exceptions.
- Responsive runtime checks pass without horizontal overflow at 390×844, 834×1112, and 1440×900.
- Web authorship audit passes. A non-blocking style signal notes repeated rounded containers.
- Runtime QA exposed and then verified the repair for the demo double-normalization defect.

### Implemented, runtime-specific verification still pending

- Actual microphone capture and browser Web Speech behavior on a real supported browser/device in the primary app.
- Optional on-device `SpeechRecognition.processLocally` path, because support remains browser-dependent.

## Validation environment limitation

The managed Chromium available during these passes blocks direct `file://` and loopback navigation by administrator policy. Primary-app browser QA injects the exact final HTML into an allowed `about:blank` document. Timeforge QA injects the exact final HTML shell plus the exact repo-local `timeforge-core.js`, `timeforge-ui.js`, and `timeforge-app.js` sources into that allowed document. Both use isolated localStorage for the test page. This verifies DOM/runtime behavior without changing the delivered artifacts. It does not substitute for a real-device microphone test.

## CI / deployment

- GitHub previously reported no workflow runs associated with the primary uplift implementation commit.
- GitHub previously reported no commit-status checks associated with the primary uplift implementation commit.
- No deployment/release system is part of the repository contract discovered during these passes; delivery is the pushed repository artifact.

## Uplift ledger

`UPLIFT_LEDGER.md` records the original 20 UI/UX + 20 interaction + 20 backend/technical + 20 quality-of-life + 20 feature improvements and `WOW-01` Portable Walk Capsule. Timeforge is a later companion capability and is documented separately in `TIMEFORGE.md` and `Dexter_Walk_Forge_bible.md` rather than laundering it into the earlier 100-item count.

## Next closure check

Run one real walk in a supported Chrome/Brave-class browser with microphone permission and verify: start → final speech transcript → pause → resume → continued capture → finish/Forge. If that succeeds, the remaining primary-app runtime-specific uncertainty is closed.
