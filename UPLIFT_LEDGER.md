# Dexter Walk Forge — Uplift Ledger

Date: 2026-09-15
Implementation baseline: `334021d36f733f19a6ec7e04805be5a4cb203938`

This ledger records the distinct project improvements implemented in the forensic repair + uplift pass. Each item is counted once in one primary category. Secondary benefits are not re-counted.

## UI/UX — 20

- `UIUX-01` — Responsive two-column Walk workspace on wide screens.
- `UIUX-02` — Four-destination mobile bottom navigation for Walk, Forge, Map, and History.
- `UIUX-03` — Mobile sticky composer positioned above navigation with safe-area handling.
- `UIUX-04` — Consistent touch-sized controls and visible keyboard focus treatment.
- `UIUX-05` — Reduced-motion mode through `prefers-reduced-motion`.
- `UIUX-06` — High-contrast visual theme.
- `UIUX-07` — Light/paper visual theme.
- `UIUX-08` — User-adjustable text scaling.
- `UIUX-09` — Compact-density presentation mode.
- `UIUX-10` — Focus mode that suppresses secondary UI and emphasizes the active walk.
- `UIUX-11` — Visible save-state feedback (`saving…` / `saved` / storage failure).
- `UIUX-12` — Explicit listening, paused, unavailable, and idle speech states.
- `UIUX-13` — Interim speech transcript separated visually from committed thoughts.
- `UIUX-14` — Card-level badges for state, priority, locked decisions, and tags.
- `UIUX-15` — Purpose-specific empty states for Walk, History, Signals, and Map.
- `UIUX-16` — Dedicated side-sheet idea editor with sticky save/delete actions.
- `UIUX-17` — Dedicated implementation-handoff side sheet with copy/download/open actions.
- `UIUX-18` — Responsive Forge layout that collapses cleanly on smaller screens.
- `UIUX-19` — Full-width mobile sheets and sticky action regions for constrained displays.
- `UIUX-20` — Live Spec Reactor dashboard with metrics and readiness bar visible during ideation.

## Gameplay / primary interaction loop — 20

For this non-game product, “gameplay” means the primary user-driven walk/capture/decision loop.

- `GAME-01` — Typed thought capture into the live walk stream.
- `GAME-02` — Voice thought capture through browser speech recognition when available.
- `GAME-03` — Pause voice capture without ending the walk.
- `GAME-04` — Resume voice capture after a pause.
- `GAME-05` — Walk start/end lifecycle with elapsed-session timer.
- `GAME-06` — Promote an idea into a feature.
- `GAME-07` — Promote/set a feature as critical priority.
- `GAME-08` — Lock an accepted decision into the product model.
- `GAME-09` — Park an idea for later without deleting it.
- `GAME-10` — Reject an idea while preserving it as an explicit non-goal/source record.
- `GAME-11` — Restore the most recent parked or rejected idea.
- `GAME-12` — Pin and unpin important ideas.
- `GAME-13` — Merge the latest two active ideas while preserving the merged source.
- `GAME-14` — Tag the selected/latest idea through natural-language command.
- `GAME-15` — Rename the current project through natural-language command.
- `GAME-16` — Capture an open question through natural-language command.
- `GAME-17` — Capture a governing constraint through natural-language command.
- `GAME-18` — Capture an explicit product decision through natural-language command.
- `GAME-19` — Link the current idea as dependent on the previous active idea.
- `GAME-20` — `build that` / `forge that` opens the generated implementation handoff.

## Backend / technical — 20

- `BACK-01` — Versioned v3 persistent root schema.
- `BACK-02` — Migration path from the existing v1 local-storage schema.
- `BACK-03` — State normalization on load for sessions and ideas.
- `BACK-04` — Null-tolerant archive normalization for malformed imported backups.
- `BACK-05` — Raw source trace stored independently from derived idea state.
- `BACK-06` — Bounded undo stack for state mutations.
- `BACK-07` — Bounded redo stack.
- `BACK-08` — Rolling local recovery-snapshot ring.
- `BACK-09` — Debounced local persistence rather than synchronous write spam.
- `BACK-10` — Explicit browser-storage failure handling and user feedback.
- `BACK-11` — Cross-tab state reconciliation through the `storage` event.
- `BACK-12` — Bounded structured command trace.
- `BACK-13` — Duplicate-final speech result suppression.
- `BACK-14` — Backoff-controlled speech recognition restart behavior.
- `BACK-15` — Fatal-vs-retryable speech error handling.
- `BACK-16` — Optional on-device speech-processing detection when the browser exposes it.
- `BACK-17` — Import size gate before parsing or state mutation.
- `BACK-18` — Full-backup normalization with recovery snapshot before replacement.
- `BACK-19` — Session-import path that preserves the displaced current walk in history.
- `BACK-20` — Runtime remains a single self-contained HTML artifact with no external code/style dependency.

## Quality of life — 20

- `QOL-01` — Cmd/Ctrl+Enter typed capture shortcut.
- `QOL-02` — Cmd/Ctrl+Z undo shortcut.
- `QOL-03` — Cmd/Ctrl+Shift+Z redo shortcut.
- `QOL-04` — `/` shortcut to focus walk search.
- `QOL-05` — `?` shortcut for the command/shortcut help deck.
- `QOL-06` — Number keys 1–4 switch among primary views.
- `QOL-07` — Escape closes open overlays.
- `QOL-08` — Quick-action chips for common feature/priority/lock/park/reject/merge operations.
- `QOL-09` — Multi-select batch action bar.
- `QOL-10` — Search across idea text, notes, and tags.
- `QOL-11` — State filtering for ideas/features/parked/rejected items.
- `QOL-12` — Recent-first sorting.
- `QOL-13` — Oldest-first sorting.
- `QOL-14` — Priority sorting.
- `QOL-15` — Manual move-up/move-down idea ordering.
- `QOL-16` — Starting a new walk archives the prior non-empty walk instead of erasing it.
- `QOL-17` — Archived walks can be restored as independent copies.
- `QOL-18` — Current walk can be exported as standalone JSON.
- `QOL-19` — Entire local application state can be exported as a JSON backup.
- `QOL-20` — Raw walk trace can be copied directly for external use.

## Features — 20

- `FEAT-01` — Per-idea notes editing.
- `FEAT-02` — Per-idea tag editing.
- `FEAT-03` — Per-idea dependency editing.
- `FEAT-04` — Per-idea status editing.
- `FEAT-05` — Per-idea priority editing.
- `FEAT-06` — Deterministic theme clustering across active ideas.
- `FEAT-07` — Duplicate-candidate detection using token similarity.
- `FEAT-08` — Contradiction/tension detection for known incompatible product directions.
- `FEAT-09` — Deterministic project-risk signals from active requirements.
- `FEAT-10` — Live Forge readiness score.
- `FEAT-11` — Derived “next useful question” with one-click capture into open questions.
- `FEAT-12` — Derived first-slice MVP from critical/locked/committed features.
- `FEAT-13` — Generated behavioral acceptance criteria for committed features.
- `FEAT-14` — Generated walk-centered user stories for committed features.
- `FEAT-15` — Full Forge document view for thesis, MVP, features, constraints, decisions, questions, and later scope.
- `FEAT-16` — Signal desk for risks, tensions, and duplicate candidates.
- `FEAT-17` — Interactive SVG topology map showing ideas, dependencies, and duplicate links.
- `FEAT-18` — Persistent walk-history archive with per-session restore/export/delete controls.
- `FEAT-19` — Full implementation-prompt generator containing non-goals, source trace, MVP, acceptance criteria, risks, and constraints.
- `FEAT-20` — Forge-summary Markdown export.

## WOW-ME — 1

- `WOW-01` — **Portable Walk Capsule HTML export.** The current walk can be compiled into a standalone browser-openable dossier containing the derived thesis, critical path, committed features, themes, first-slice MVP, constraints, decisions, unresolved questions, risks/tensions, next useful question, and the preserved raw walk trace. It does not require a remote viewer or runtime dependency.

## Count integrity

- UI/UX: 20 / 20
- Gameplay / interaction: 20 / 20
- Backend / technical: 20 / 20
- Quality of life: 20 / 20
- Features: 20 / 20
- WOW-ME: 1 / 1
- Duplicate IDs: none
- Cross-category double-counting: none intended; each mandatory count has one primary owner.
- Proposed-only items: none in this ledger.

## Validation evidence

Static/logic validation is implemented in `verify.mjs` and was executed successfully against the final implementation file. It checks syntax, single-file dependency boundaries, v1→v3 migration, malformed-archive tolerance, theme clustering, duplicate/tension/risk detection, readiness/MVP derivation, acceptance stories, and Walk Capsule completeness.

Browser-runtime QA was also executed against the exact final HTML in headless Chromium by injecting the file into an allowed `about:blank` document because the managed browser policy blocks direct `file://` and loopback navigation. Verified runtime paths included typed capture and persistence, raw-preserving undo/redo, natural-language command handling, Forge and Map rendering, handoff generation, Walk Capsule generation, responsive widths at 390/834/1440 px, all four mobile views, batch operations, details editing, keyboard shortcuts, archive/restore, and the derived Forge systems.

## Remaining runtime uncertainty

The real microphone/Web Speech path could not be exercised with an actual microphone in the managed headless browser. The implementation is present and statically checked, but device/browser speech behavior remains the one material runtime verification gap.
